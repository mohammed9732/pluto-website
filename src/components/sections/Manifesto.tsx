'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, useState } from 'react';
import { Typed } from '@/components/ui/Typed';
import type { Copy } from '@/content/copy';

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

/** A figure keyed in on a typewriter; its caption follows once the figure is down. */
function Stat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [valueDone, setValueDone] = useState(false);
  return (
    <div>
      <p dir="ltr" className="text-display lining-nums tabular-nums rtl:text-end">
        <Typed text={value} delay={delay} speed={170} onDone={() => setValueDone(true)} />
      </p>
      <p className="label mt-4 min-h-[1.5em] text-ink/55">{valueDone && <Typed text={label} delay={150} speed={38} />}</p>
    </div>
  );
}

export function Manifesto({ t }: { t: Copy }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.35'] });
  const words = t.manifesto.text.split(' ');

  return (
    <section id="about" className="silk relative z-10 -mt-8 rounded-t-[2rem] px-6 pb-28 pt-24 md:rounded-t-[3rem] md:px-12 md:py-48">
      <p className="label mb-10 text-pluto-blue">{t.manifesto.label}</p>
      {/* Each word lights up across its own slice of the scroll range. */}
      <p ref={ref} className="max-w-[22ch] text-title md:max-w-[24ch]">
        {words.map((w, i) => (
          <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 3) / words.length)]} />
        ))}
      </p>

      <div className="mt-24 grid gap-10 border-t border-ink/10 pt-10 md:mt-36 md:grid-cols-3">
        {t.manifesto.stats.map((s, i) => (
          <Stat key={s.label} value={s.value} label={s.label} delay={i * 900} />
        ))}
      </div>
    </section>
  );
}
