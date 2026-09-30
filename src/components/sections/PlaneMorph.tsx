'use client';

// Name kept from the original brief. This is the product film: a CLAPIO carton
// lifts away, the syringe is revealed, the gel extrudes into a helix.

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { ScrollSequence, STAGE } from '@/components/scroll/ScrollSequence';
import { SequenceBeat } from '@/components/scroll/SequenceBeat';
import type { Copy } from '@/content/copy';
import { cn } from '@/lib/cn';
import { SEQ_PRODUCT } from '@/lib/sequences';

export function PlaneMorph({ t }: { t: Copy }) {
  return (
    <ScrollSequence id="portfolio" seq={SEQ_PRODUCT} label={t.product.aria} poster="/posters/product.jpg" tail={0.05}>
      {(p) => <Layers p={p} t={t} />}
    </ScrollSequence>
  );
}

function Layers({ p, t }: { p: MotionValue<number>; t: Copy }) {
  const veil = useTransform(p, [0.94, 1], [0, 1]);
  const specs = useTransform(p, [0.27, 0.32, 0.6, 0.64], [0, 1, 1, 0]);
  const specsX = useTransform(p, [0.27, 0.32], [40, 0]);

  return (
    <>
      {/* The film's own silk runs out into the page's silk. */}
      <div aria-hidden className={cn(STAGE, 'pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(246,243,238,0)_55%,rgba(246,243,238,0.7)_85%,#F6F3EE_100%)]')} />

      <SequenceBeat progress={p} from={-0.05} to={0.24} align="bottom-start">
        <p className="label mb-4 text-pluto-blue">{t.product.label}</p>
        <h2 className="mb-4 text-title">{t.product.headline}</h2>
        <p className="max-w-[40ch] text-[15px] leading-relaxed text-ink/70 md:text-base">{t.product.body}</p>
      </SequenceBeat>

      {/* Spec sheet */}
      <motion.div style={{ opacity: specs }} className="pointer-events-none absolute inset-0">
        {/* Phone: the sheet sits below the syringe, so the veil rises from the bottom. Desktop: it comes in from the side. */}
        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-silk via-silk/95 to-transparent md:hidden" />
        <div className="absolute inset-y-0 end-0 hidden w-[46%] bg-gradient-to-l from-silk via-silk/85 to-transparent rtl:bg-gradient-to-r md:block" />
        {/* Centering lives on the flex parent: Framer owns this element's transform, so a Tailwind translate would be overwritten. */}
        <div className="absolute inset-0 flex items-end justify-end px-6 pb-24 md:items-center md:px-12 md:pb-0">
          <motion.div style={{ x: specsX }} className="w-[min(24rem,100%)]">
            <h3 dir="ltr" className="mb-5 font-display text-3xl md:text-4xl rtl:text-end">
              {t.product.specsTitle}
            </h3>
            <dl>
              {t.product.specs.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 border-t border-ink/15 py-1.5 md:py-2.5">
                  <dt className="label shrink-0 text-ink/55">{k}</dt>
                  <dd className="text-end text-xs md:text-sm">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </motion.div>

      <SequenceBeat progress={p} from={0.67} to={0.93} align="bottom-start">
        <h2 className="mb-4 text-title">{t.product.second.title}</h2>
        <p className="max-w-[40ch] text-[15px] leading-relaxed text-ink/70 md:text-base">{t.product.second.body}</p>
      </SequenceBeat>

      <motion.div aria-hidden style={{ opacity: veil }} className="pointer-events-none absolute inset-0 bg-silk" />
    </>
  );
}
