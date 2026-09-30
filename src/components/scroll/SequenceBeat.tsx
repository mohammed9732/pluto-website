'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Align = 'bottom-start' | 'bottom-end' | 'center';

const POSITION: Record<Align, string> = {
  'bottom-start': 'items-end justify-start text-start',
  'bottom-end': 'items-end justify-end text-start',
  center: 'items-center justify-center text-center',
};

// The footage is bright; type is ink. A low veil of silk keeps the bottom edge calm, and a soft
// glow behind the words themselves does the real work, so the picture stays clear everywhere else.
const SCRIM: Record<Align, string> = {
  'bottom-start': 'inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-silk/90 to-transparent',
  'bottom-end': 'inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-silk/90 to-transparent',
  center: 'inset-0 bg-silk/35',
};

/** A caption bound to a window of scroll progress. Only opacity and position animate: both are compositor-cheap. */
export function SequenceBeat({
  progress,
  from,
  to,
  align = 'bottom-start',
  children,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  align?: Align;
  children: ReactNode;
}) {
  const edge = Math.min(0.04, (to - from) / 3);
  const stops = [from, from + edge, to - edge, to];
  const opacity = useTransform(progress, stops, [0, 1, 1, 0]);
  const y = useTransform(progress, stops, [28, 0, 0, -28]);

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0">
      <div className={cn('absolute', SCRIM[align])} />
      <motion.div style={{ y }} className={cn('relative flex h-full w-full px-6 pb-28 md:px-12 md:pb-24', POSITION[align])}>
        <div className="relative max-w-xl">
          <span aria-hidden className="absolute -inset-x-24 -inset-y-16 -z-10 rounded-[50%] bg-silk/90 blur-3xl" />
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
