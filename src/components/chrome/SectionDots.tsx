'use client';

import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';
import { scrollToId } from '@/components/providers/SmoothScroll';
import type { Copy } from '@/content/copy';
import { useOnDark } from '@/hooks/useTone';
import { cn } from '@/lib/cn';

const SECTIONS = ['top', 'about', 'journey', 'portfolio', 'brands', 'advantages', 'global'] as const;

/**
 * Where am I? One dot per chapter on the leading edge of the screen. The current chapter's dot
 * stretches into a bar that fills as you move through it, which matters in the two long films.
 */
export function SectionDots({ t }: { t: Copy }) {
  const [active, setActive] = useState(0);
  const progress = useMotionValue(0);
  const dark = useOnDark('middle');

  const labels: Record<(typeof SECTIONS)[number], string> = {
    top: t.dots.top,
    about: t.dots.about,
    journey: t.dots.journey,
    portfolio: t.dots.product,
    brands: t.dots.brands,
    advantages: t.dots.advantages,
    global: t.dots.coverage,
  };

  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id));
    const check = () => {
      const mid = window.innerHeight / 2;
      let idx = 0;
      let top = 0;
      let bottom = 1;
      els.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= mid) {
          idx = i;
          top = r.top;
          // A chapter runs until the next one begins (About includes the pillars below it).
          const next = els.slice(i + 1).find(Boolean);
          bottom = next ? next.getBoundingClientRect().top : r.bottom;
        }
      });
      setActive(idx);
      progress.set(Math.min(1, Math.max(0, (mid - top) / Math.max(1, bottom - top))));
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [progress]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <nav aria-label={t.dots.top} className="fixed start-0 top-1/2 z-40 -translate-y-1/2 md:start-1">
      <ul className="flex flex-col items-start">
        {SECTIONS.map((id, i) => {
          const current = i === active;
          return (
            <li key={id}>
              <a href={`#${id}`} onClick={go(id)} aria-current={current ? 'true' : undefined} className="group flex items-center gap-3 px-2 py-1.5">
                <span
                  className={cn(
                    'relative block w-[5px] overflow-hidden rounded-full transition-[height,background-color] duration-700 ease-expo md:w-1.5',
                    current ? 'h-9' : 'h-[5px] md:h-1.5',
                    dark ? (i < active ? 'bg-bone/80' : 'bg-bone/30') : i < active ? 'bg-ink/70' : 'bg-ink/20',
                  )}
                >
                  {current && <motion.span style={{ scaleY: progress }} className={cn('absolute inset-0 origin-top rounded-full', dark ? 'bg-bone' : 'bg-ink')} />}
                </span>
                {/* The name appears on hover only, on its own chip, so it never competes with the page. */}
                <span
                  className={cn(
                    'label pointer-events-none hidden -translate-x-1.5 rounded-full px-3 py-1.5 opacity-0 transition-all duration-500 ease-expo md:block',
                    'group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 rtl:translate-x-1.5',
                    dark ? 'bg-bone text-ink' : 'bg-ink text-bone',
                  )}
                >
                  {labels[id]}
                </span>
                <span className="sr-only md:hidden">{labels[id]}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
