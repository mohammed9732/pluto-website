'use client';

import { animate, AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Wordmark } from '@/components/ui/Wordmark';
import { EXPO } from '@/lib/cn';
import { markHeroReady, onHeroReady } from '@/lib/ready';

const MIN_MS = 1400; // long enough to read the mark, even on a fast connection
const MAX_MS = 5000; // a slow network must never trap the visitor behind the curtain

export function Preloader() {
  const [done, setDone] = useState(false);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Development screenshots (?at=...) skip the curtain.
    if (process.env.NODE_ENV === 'development' && window.location.search.includes('at=')) {
      markHeroReady();
      setDone(true);
      return;
    }
    const t0 = performance.now();
    let timer: ReturnType<typeof setTimeout>;
    const off = onHeroReady(() => {
      timer = setTimeout(() => setDone(true), Math.max(0, MIN_MS - (performance.now() - t0)));
    });
    const cap = setTimeout(markHeroReady, MAX_MS);
    const count = animate(0, 100, {
      duration: MIN_MS / 1000,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (counter.current) counter.current.textContent = String(Math.round(v)).padStart(3, '0');
      },
    });
    return () => {
      off();
      clearTimeout(timer);
      clearTimeout(cap);
      count.stop();
    };
  }, []);

  // The page stays put behind the curtain.
  useEffect(() => {
    if (done) return;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="silk fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 text-ink"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1.1, ease: EXPO }}
        >
          <Wordmark className="text-4xl md:text-5xl" />
          <span ref={counter} dir="ltr" className="label font-mono tabular-nums text-ink/50">
            000
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
