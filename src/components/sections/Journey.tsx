'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { ScrollSequence } from '@/components/scroll/ScrollSequence';
import { SequenceBeat } from '@/components/scroll/SequenceBeat';
import type { Copy } from '@/content/copy';
import { SEQ_JOURNEY } from '@/lib/sequences';

const TAIL = 0.04; // last frame held while the section fades back to silk

const BEATS: [number, number][] = [
  [0.16, 0.34],
  [0.38, 0.58],
  [0.62, 0.82],
];

/** The delivery film: laboratory -> Pluto -> clinic, scrubbed by scroll. Plays full-frame from its first pixel. */
export function Journey({ t }: { t: Copy }) {
  return (
    <ScrollSequence id="journey" seq={SEQ_JOURNEY} label={t.journey.aria} poster="/posters/hero.jpg" tail={TAIL}>
      {(p) => <Layers p={p} t={t} />}
    </ScrollSequence>
  );
}

function Layers({ p, t }: { p: MotionValue<number>; t: Copy }) {
  const veil = useTransform(p, [1 - TAIL, 1], [0, 1]);

  return (
    <>
      <SequenceBeat progress={p} from={-0.05} to={0.13} align="bottom-start">
        <p className="label mb-4 text-pluto-blue">{t.journey.label}</p>
        <h2 className="text-title">{t.journey.title}</h2>
      </SequenceBeat>

      {t.journey.beats.map((b, i) => (
        <SequenceBeat key={b.n} progress={p} from={BEATS[i][0]} to={BEATS[i][1]} align={i === 1 ? 'bottom-end' : 'bottom-start'}>
          <p className="label mb-4 text-pluto-blue" dir="ltr">
            {b.n} / 03
          </p>
          <h2 className="mb-4 text-title">{b.title}</h2>
          <p className="max-w-[38ch] text-[15px] leading-relaxed text-ink/70 md:text-base">{b.body}</p>
        </SequenceBeat>
      ))}

      <SequenceBeat progress={p} from={0.86} to={0.985} align="center">
        <h2 className="text-display">{t.journey.final}</h2>
      </SequenceBeat>

      <motion.div aria-hidden style={{ opacity: veil }} className="pointer-events-none absolute inset-0 bg-silk" />
    </>
  );
}
