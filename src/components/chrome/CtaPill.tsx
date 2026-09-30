'use client';

import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useState } from 'react';
import { ContactMenu } from '@/components/ui/ContactMenu';
import type { Copy } from '@/content/copy';
import { useOnDark } from '@/hooks/useTone';
import { cn, EXPO } from '@/lib/cn';

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3 13 13 3M5 3h8v8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** Persistent bottom-centre CTA. Opens a choice of WhatsApp or email. Hides near the footer, which has its own CTAs. */
export function CtaPill({ t }: { t: Copy }) {
  const { scrollYProgress } = useScroll();
  const [hide, setHide] = useState(false);
  const dark = useOnDark('bottom');
  useMotionValueEvent(scrollYProgress, 'change', (p) => setHide(p > 0.9));

  // Magnetic hover: the pill leans up to 8px toward the pointer.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 18 });
  const y = useSpring(my, { stiffness: 200, damping: 18 });

  const skin = cn(
    'shadow-[0_10px_30px_rgba(12,11,10,0.18)] transition-colors duration-500 group-hover:bg-pluto-coral group-hover:text-white',
    dark ? 'bg-bone text-ink' : 'bg-ink text-bone',
  );

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: hide ? 80 : 0, opacity: hide ? 0 : 1 }}
      transition={{ duration: 0.8, ease: EXPO, delay: hide ? 0 : 0.2 }}
    >
      <motion.div
        style={{ x, y, pointerEvents: hide ? 'none' : 'auto' }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width - 0.5) * 16);
          my.set(((e.clientY - r.top) / r.height - 0.5) * 16);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
      >
        <ContactMenu t={t} kind="partner" className="group flex items-center gap-1.5">
          <span className={cn('rounded-full px-6 py-3 text-xs font-medium', skin)}>{t.cta.partner}</span>
          <span className={cn('flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-500 group-hover:rotate-45', skin)}>
            <Arrow className="h-3 w-3" />
          </span>
        </ContactMenu>
      </motion.div>
    </motion.div>
  );
}
