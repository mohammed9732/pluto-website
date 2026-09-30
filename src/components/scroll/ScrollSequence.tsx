'use client';

import { useMotionValueEvent, useScroll, type MotionValue } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { useReducedMotionSafe } from '@/hooks/useMedia';
import { BitmapWindow } from '@/lib/bitmapWindow';
import { cn } from '@/lib/cn';
import { progressToPlayback, type SequenceDef } from '@/lib/sequences';

/**
 * Where the film plays. Landscape: full-bleed. Portrait: a near-square stage in the upper
 * part of the screen — cover-cropping 16:9 footage into a tall viewport would be a ~3.8x
 * zoom that loses the subjects, so the picture gets a stage and the text sits below on silk.
 * The canvas is sized by CSS and measured by a ResizeObserver, so the cover maths follows.
 */
export const STAGE =
  'absolute inset-0 h-full w-full portrait:inset-x-0 portrait:bottom-auto portrait:top-[13svh] portrait:h-[100vw] portrait:max-h-[54svh]';

type Props = {
  id?: string;
  seq: SequenceDef;
  label: string;
  poster: string;
  /** Opening / closing slices of scroll where the first / last frame is held. */
  hold?: number;
  tail?: number;
  children?: (progress: MotionValue<number>) => ReactNode;
};

export function ScrollSequence({ id, seq, label, poster, hold = 0, tail = 0, children }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = useRef({ w: 0, h: 0 });
  const lastSrc = useRef<ImageBitmap | null>(null);
  const lastWant = useRef(0);
  const dir = useRef<1 | -1>(1);
  const queued = useRef(0);
  const redraw = useRef<() => void>(() => {});
  const [win] = useState(() => new BitmapWindow(() => redraw.current()));
  const reduced = useReducedMotionSafe();
  const [near, setNear] = useState(false);

  const { store, firstReady, progress: loadProgress } = useImagePreloader(seq, { enabled: near && !reduced });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  useEffect(() => () => win.clear(), [win]);

  // Start downloading when the section is within three screens, so it never competes with the hero.
  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '300% 0px' });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  const draw = useCallback(
    (p: number, force = false) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const { w, h } = size.current;
      if (!canvas || !ctx || !w) return;
      const want = Math.round(progressToPlayback(p, hold, tail) * (seq.count - 1));

      // How fast is the visitor moving, in frames per painted frame? Decode that far apart, ahead of them.
      const moved = want - lastWant.current;
      if (moved !== 0) dir.current = moved > 0 ? 1 : -1;
      lastWant.current = want;
      win.ensure(want, dir.current, Math.min(6, Math.max(1, Math.abs(moved))), store.blobs);

      // Always a full-resolution frame: the exact one or, until it is decoded, its nearest neighbour.
      const src = win.nearest(want);
      if (!src || (!force && src === lastSrc.current)) return;
      lastSrc.current = src;

      // object-fit: cover
      const scale = Math.max(w / src.width, h / src.height);
      const dw = src.width * scale;
      const dh = src.height * scale;
      ctx.drawImage(src, (w - dw) / 2, (h - dh) / 2, dw, dh);
    },
    [store, hold, tail, seq.count, win],
  );
  redraw.current = () => draw(scrollYProgress.get());

  // Backing store: device pixels, but never more than the footage can fill (1600 wide).
  // Extra canvas pixels would only be upscaled footage, paid for on every frame.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.max(1, 1600 / w));
      size.current = { w, h };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingQuality = 'medium';
      }
      draw(scrollYProgress.get(), true);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw, scrollYProgress]);

  // Repaint as frames arrive, so a neighbouring frame settles into the exact one.
  useEffect(() => {
    if (firstReady) draw(scrollYProgress.get(), true);
  }, [firstReady, loadProgress, draw, scrollYProgress]);

  // Frame index never touches React state: motion value -> one imperative draw per display frame.
  useMotionValueEvent(scrollYProgress, 'change', () => {
    if (queued.current) return;
    queued.current = requestAnimationFrame(() => {
      queued.current = 0;
      draw(scrollYProgress.get());
    });
  });
  useEffect(() => () => cancelAnimationFrame(queued.current), []);

  return (
    <section id={id} ref={sectionRef} aria-label={label} className={cn('relative', reduced ? 'h-[100svh]' : 'h-[300vh] md:h-[400vh]')}>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-silk">
        {reduced ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className={cn(STAGE, 'object-cover')} />
        ) : (
          <canvas ref={canvasRef} aria-hidden className={STAGE} />
        )}
        {/* Landscape: a breath of silk under the navigation. Portrait: melt the stage's edges into the page. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-silk/70 to-transparent portrait:hidden" />
        <div aria-hidden className={cn(STAGE, 'pointer-events-none hidden bg-[linear-gradient(#F6F3EE,rgba(246,243,238,0)_14%,rgba(246,243,238,0)_82%,#F6F3EE)] portrait:block')} />
        {children?.(scrollYProgress)}
      </div>
    </section>
  );
}
