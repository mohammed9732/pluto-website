'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Copy } from '@/content/copy';
import { EXPO } from '@/lib/cn';
import { markHeroReady, onHeroReady } from '@/lib/ready';

/** The planet, and the name. One of the page's two dark bookends; the silk page slides up over it. */
export function Hero({ t }: { t: Copy }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => onHeroReady(() => setReady(true)), []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 3) markHeroReady();
    const onCanPlay = () => markHeroReady();
    video.addEventListener('canplay', onCanPlay);
    // Decode only while on screen.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => {
      video.removeEventListener('canplay', onCanPlay);
      io.disconnect();
    };
  }, []);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: ready ? 1 : 0, y: ready ? 0 : 18 },
    transition: { duration: 1.2, ease: EXPO, delay },
  });

  return (
    <section id="top" ref={sectionRef} data-tone="dark" className="relative h-[calc(100svh+2rem)] overflow-hidden bg-ink text-bone">
      {/*
        Landscape: the film fills the screen. Portrait: filling a tall screen with 16:9 footage
        would be a 3.8x zoom, so the film keeps its own height and its sides run off-screen.
        The planet is centred in frame, so it stays whole and sharp either way.
      */}
      <div className="absolute inset-0 flex justify-center portrait:bottom-auto portrait:top-[6svh] portrait:h-[52svh]">
        <motion.div style={{ scale }} className="h-full w-full shrink-0 portrait:aspect-video portrait:w-auto">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="/globe-loop-1080.mp4"
            poster="/posters/globe.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden
            tabIndex={-1}
          />
        </motion.div>
      </div>

      {/* Scrims: a dark side for the name, and a floor so the type never sits on the rings. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent rtl:bg-gradient-to-l portrait:hidden" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-ink via-ink/75 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="absolute inset-0 flex flex-col justify-end px-6 pb-36 md:px-12 md:pb-24">
        <motion.p className="label mb-5 text-bone-muted md:mb-7" {...rise(0.45)}>
          {t.hero.label}
        </motion.p>

        {/* The name, as large as the screen allows. The logo's own orb is its "O". */}
        <h1 dir="ltr" aria-label={t.hero.name} className="flex items-end self-start">
          <span className="overflow-hidden pb-[0.04em]">
            <motion.span
              aria-hidden
              className="flex items-center gap-[0.1em] text-[clamp(4.25rem,17vw,15rem)] font-extralight leading-[0.82] tracking-[0.06em]"
              initial={{ y: '112%' }}
              animate={{ y: ready ? '0%' : '112%' }}
              transition={{ duration: 1.4, ease: EXPO, delay: 0.55 }}
            >
              PLUT
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/pluto-orb.png" alt="" className="h-[0.74em] w-[0.74em]" />
            </motion.span>
          </span>
          <motion.span aria-hidden className="label mb-[0.35em] ms-3 text-bone md:ms-5 md:text-sm" {...rise(1.25)}>
            {t.hero.company}
          </motion.span>
        </h1>

        <motion.p className="mt-7 max-w-[22ch] text-title md:mt-9" {...rise(1.0)}>
          {t.hero.title.join(' ')}
        </motion.p>
        <motion.p className="mt-5 hidden max-w-[48ch] text-[15px] leading-relaxed text-bone-muted sm:block md:text-base" {...rise(1.2)}>
          {t.hero.intro}
        </motion.p>
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute bottom-28 end-6 hidden items-center gap-4 md:end-12 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.2, delay: 1.6 }}
      >
        <span className="label text-bone-muted">{t.hero.scroll}</span>
        <span className="relative h-12 w-px overflow-hidden bg-bone/25">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-bone"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity }}
          />
        </span>
      </motion.div>
    </section>
  );
}
