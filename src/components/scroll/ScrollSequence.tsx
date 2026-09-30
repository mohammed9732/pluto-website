'use client';

import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, type MotionValue } from 'framer-motion';
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

/**
 * Scrolling down scrubs the film directly: the picture is wherever the hand is.
 * Scrolling up does not drag it backwards at flick speed (which stutters through whatever
 * frames happen to be decoded): the film rewinds at a steady pace, one decoded frame after
 * another, until it catches up with the scroll position. It reads as a deliberate rewind.
 */
const REWIND_FRAMES_PER_MS = 0.06; // 60 frames per second, whatever the display's refresh rate
const MAX_WAIT_MS = 90; // how long the rewind waits for a frame to decode before moving on

type Props = {
  id?: string;
  seq: SequenceDef;
  label: string;
  poster: string;
  /** Opening / closing slices of scroll where the first / last frame is held. */
  hold?: number;
  tail?: number;
  rewindLabel: string;
  children?: (progress: MotionValue<number>) => ReactNode;
};

export function ScrollSequence({ id, seq, label, poster, hold = 0, tail = 0, rewindLabel, children }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = useRef({ w: 0, h: 0 });
  const lastSrc = useRef<ImageBitmap | null>(null);
  const shown = useRef(0); // the frame on the canvas (fractional while rewinding)
  const target = useRef(0); // the frame the scroll position asks for
  const waitedSince = useRef(0);
  const lastStep = useRef(0);
  const dir = useRef<1 | -1>(1);
  const queued = useRef(0);
  const redraw = useRef<() => void>(() => {});
  const [win] = useState(() => new BitmapWindow(() => redraw.current()));
  const [rewinding, setRewinding] = useState(false);
  const reduced = useReducedMotionSafe();
  const [near, setNear] = useState(false);
  const visible = useRef(false);

  const { store, firstReady, progress: loadProgress } = useImagePreloader(seq, { enabled: near && !reduced });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  // What the captions follow: the film itself, so they never run ahead of a rewinding picture.
  const displayProgress = useMotionValue(0);

  useEffect(() => () => win.clear(), [win]);

  // Start downloading when the section is within three screens, so it never competes with the hero.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '300% 0px' });
    io.observe(el);
    const io2 = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
    });
    io2.observe(el);
    return () => {
      io.disconnect();
      io2.disconnect();
    };
  }, []);

  const paint = useCallback(
    (frame: number, force: boolean) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const { w, h } = size.current;
      if (!canvas || !ctx || !w) return;
      // Always a full-resolution frame: the exact one or, until it is decoded, its nearest neighbour.
      const src = win.nearest(frame);
      if (!src || (!force && src === lastSrc.current)) return;
      lastSrc.current = src;
      canvas.dataset.frame = String(frame); // observable from tests
      // object-fit: cover
      const scale = Math.max(w / src.width, h / src.height);
      const dw = src.width * scale;
      const dh = src.height * scale;
      ctx.drawImage(src, (w - dw) / 2, (h - dh) / 2, dw, dh);
    },
    [win],
  );

  /** One step of playback. Returns true while the picture still has to move. */
  const step = useCallback(
    (force = false): boolean => {
      const p = scrollYProgress.get();
      const t = Math.round(progressToPlayback(p, hold, tail) * (seq.count - 1));
      const prevTarget = target.current;
      target.current = t;

      const now = performance.now();
      const dt = Math.min(50, now - lastStep.current); // a background tab must not rewind in one leap
      lastStep.current = now;

      const gap = t - shown.current;
      const moved = t - prevTarget;
      if (moved !== 0) dir.current = moved > 0 ? 1 : -1;

      let next: number;
      if (gap >= 0 || !visible.current) {
        // Forward, or off screen: the picture is wherever the hand is.
        next = t;
      } else {
        // Backward: rewind at a steady pace, and only onto frames that are decoded.
        const candidate = Math.max(t, shown.current - REWIND_FRAMES_PER_MS * dt);
        const ready = win.distance(Math.round(candidate)) <= 1;
        if (ready || now - waitedSince.current >= MAX_WAIT_MS) {
          next = candidate;
          waitedSince.current = now;
        } else {
          next = shown.current;
        }
      }
      shown.current = next;

      const frame = Math.round(next);
      const speed = Math.min(6, Math.max(1, Math.abs(moved)));
      win.ensure(frame, gap < 0 ? -1 : dir.current, gap < 0 ? 1 : speed, store.blobs);
      paint(frame, force);

      const playback = frame / (seq.count - 1);
      displayProgress.set(Math.max(p, hold + playback * (1 - hold - tail)));

      return Math.round(shown.current) !== t;
    },
    [scrollYProgress, hold, tail, seq.count, win, store, paint, displayProgress],
  );

  // Ticks run one per display frame, and keep running while a rewind is catching up.
  const tick = useCallback(() => {
    queued.current = 0;
    const busy = step();
    setRewinding(busy);
    if (busy && !queued.current) queued.current = requestAnimationFrame(tick);
  }, [step]);
  const schedule = useCallback(() => {
    if (!queued.current) queued.current = requestAnimationFrame(tick);
  }, [tick]);
  redraw.current = () => step(true);

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
      step(true);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [step]);

  // Repaint as frames arrive, so a neighbouring frame settles into the exact one.
  useEffect(() => {
    if (firstReady) step(true);
  }, [firstReady, loadProgress, step]);

  // Frame index never touches React state: motion value -> one imperative draw per display frame.
  useMotionValueEvent(scrollYProgress, 'change', schedule);
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

        {/* Rewind marker: a small chip while the film is catching up backwards. */}
        <AnimatePresence>
          {rewinding && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute start-1/2 top-24 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink/85 px-3.5 py-2 text-bone backdrop-blur-sm portrait:top-[calc(13svh+0.75rem)] rtl:translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className="flex gap-0.5">
                <RewindGlyph delay={0.15} />
                <RewindGlyph delay={0} />
              </span>
              <span className="label">{rewindLabel}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {children?.(displayProgress)}
      </div>
    </section>
  );
}

function RewindGlyph({ delay }: { delay: number }) {
  return (
    <motion.svg
      viewBox="0 0 8 10"
      className="h-2.5 w-2 fill-current"
      animate={{ opacity: [0.35, 1, 0.35] }}
      transition={{ duration: 0.7, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <path d="M8 0 0 5l8 5z" />
    </motion.svg>
  );
}
