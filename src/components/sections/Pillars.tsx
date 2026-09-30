'use client';

import { motion } from 'framer-motion';
import { RevealLines } from '@/components/ui/RevealLines';
import type { Copy } from '@/content/copy';
import { EXPO } from '@/lib/cn';

export function Pillars({ t }: { t: Copy }) {
  return (
    <section className="bg-silk px-6 pb-32 md:px-12 md:pb-48">
      <p className="label mb-12 text-pluto-blue">{t.pillars.label}</p>
      <div className="grid gap-x-12 gap-y-16 md:grid-cols-2">
        {t.pillars.items.map((item, i) => (
          <article key={item.title}>
            <motion.div
              className="hairline mb-6 origin-left rtl:origin-right"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 1.4, ease: EXPO, delay: (i % 2) * 0.1 }}
            />
            <p className="label mb-5 text-ink/45" dir="ltr">
              ({String(i + 1).padStart(2, '0')})
            </p>
            <h3 className="mb-4 font-display text-3xl md:text-5xl rtl:font-sans rtl:text-2xl rtl:font-medium rtl:md:text-4xl">
              <RevealLines lines={[item.title]} delay={(i % 2) * 0.1} />
            </h3>
            <p className="max-w-[42ch] text-[15px] leading-relaxed text-ink/65 md:text-base">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
