'use client';

import { motion } from 'framer-motion';
import type { Copy } from '@/content/copy';
import { EXPO } from '@/lib/cn';

// White-on-transparent marks (inverted to ink by CSS) rendered from the client's artwork.
const BRANDS: { name: string; src?: string; h: string }[] = [
  { name: 'MY·FILLER', src: '/brand/myfiller.png', h: 'h-5 md:h-6' },
  { name: 'Revitalize', src: '/brand/revitalize.png', h: 'h-20 md:h-24' },
  { name: 'CLAPIO', src: '/brand/clapio.png', h: 'h-4 md:h-5' },
  { name: 'Inobelle', src: '/brand/inobelle.png', h: 'h-8 md:h-10' },
];

export function Brands({ t }: { t: Copy }) {
  return (
    <section id="brands" className="bg-silk px-6 py-32 md:px-12 md:py-40">
      <p className="label mb-6 text-pluto-blue">{t.brands.label}</p>
      <h2 className="mb-16 max-w-[20ch] text-title md:mb-24">{t.brands.title}</h2>
      <ul dir="ltr" className="grid grid-cols-2 border-s border-t border-ink/10 md:grid-cols-4">
        {BRANDS.map((b, i) => (
          <motion.li
            key={b.name}
            className="group flex aspect-[4/3] items-center justify-center border-b border-e border-ink/10 p-8 transition-colors duration-700 hover:bg-silk-light"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 1, ease: EXPO, delay: i * 0.08 }}
          >
            {b.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.src} alt={b.name} loading="lazy" className={`${b.h} w-auto max-w-full object-contain opacity-70 invert transition-opacity duration-700 group-hover:opacity-100`} />
            ) : (
              <span className="text-2xl font-light tracking-[0.3em] opacity-60 transition-opacity duration-700 group-hover:opacity-100 md:text-3xl">{b.name}</span>
            )}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
