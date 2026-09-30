'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn, EXPO } from '@/lib/cn';

/** Line-mask reveal: each line slides up from behind an overflow-hidden parent. */
export function RevealLines({
  lines,
  className,
  delay = 0,
  when = true,
}: {
  lines: string[];
  className?: string;
  delay?: number;
  /** Hold the reveal until this is true (the hero waits for the preloader to lift). */
  when?: boolean;
}) {
  // Observe the wrapper, not the lines: a line starts fully clipped by its mask,
  // so an IntersectionObserver on the line itself would never fire.
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const show = inView && when;

  return (
    <span ref={ref} className={cn('block', className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em]">
          <motion.span
            className="block"
            initial={{ y: '115%' }}
            animate={{ y: show ? '0%' : '115%' }}
            transition={{ duration: 1.2, ease: EXPO, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
