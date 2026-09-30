'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import type { Copy } from '@/content/copy';
import { EXPO } from '@/lib/cn';

export function Advantages({ t }: { t: Copy }) {
  const [open, setOpen] = useState(0);

  return (
    <section id="advantages" className="silk px-6 pb-40 pt-32 md:px-12 md:pb-52 md:pt-40">
      <p className="label mb-12 text-pluto-blue">{t.advantages.label}</p>
      <ul className="border-b border-ink/10">
        {t.advantages.items.map((item, i) => {
          const active = open === i;
          return (
            <li key={item.title} className="border-t border-ink/10">
              <button
                onClick={() => setOpen(active ? -1 : i)}
                aria-expanded={active}
                aria-controls={`adv-${i}`}
                className="group flex w-full items-center justify-between gap-6 py-7 text-start md:py-9"
              >
                <span className={`font-display text-3xl transition-all duration-700 ease-expo group-hover:ps-3 md:text-title rtl:font-sans rtl:font-medium ${active ? '' : 'text-ink/35 group-hover:text-ink'}`}>
                  {item.title}
                </span>
                <span aria-hidden className={`relative h-5 w-5 shrink-0 transition-transform duration-700 ease-expo ${active ? 'rotate-45' : ''}`}>
                  <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
                  <span className="absolute inset-y-0 start-1/2 w-px bg-current" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {active && (
                  <motion.div
                    id={`adv-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.7, ease: EXPO }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[52ch] pb-10 text-[15px] leading-relaxed text-ink/65 md:ms-[33%] md:text-base">{item.body}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
