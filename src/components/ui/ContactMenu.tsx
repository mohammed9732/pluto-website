'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { mailLink, site, waLink, type Copy } from '@/content/copy';
import { cn, EXPO } from '@/lib/cn';

/**
 * A call to action that lets the visitor choose how to reach Pluto: WhatsApp or email.
 * The trigger is whatever is passed as children; the choice opens above it.
 */
export function ContactMenu({
  t,
  kind,
  className,
  align = 'center',
  children,
}: {
  t: Copy;
  kind: 'partner' | 'visit';
  className?: string;
  align?: 'center' | 'start';
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onScroll = () => setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, [open]);

  const message = kind === 'partner' ? t.cta.partnerMsg : t.cta.visitMsg;
  const subject = kind === 'partner' ? t.cta.partnerSubject : t.cta.visitSubject;

  const options = [
    { key: 'wa', label: t.cta.whatsapp, detail: site.phone, href: waLink(message), external: true, icon: <WhatsAppIcon /> },
    { key: 'mail', label: t.cta.email, detail: site.email, href: mailLink(subject, message), external: false, icon: <MailIcon /> },
  ];

  return (
    <div ref={root} className="relative inline-flex max-sm:w-full">
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={className}>
        {children}
      </button>

      <AnimatePresence>
        {open && (
          // Position lives on this wrapper; Framer owns the transform of the panel inside it.
          <div className={cn('absolute bottom-full z-50 mb-3 flex w-[17.5rem] max-w-[calc(100vw-2rem)]', align === 'center' ? 'start-1/2 -translate-x-1/2 justify-center rtl:translate-x-1/2' : 'start-0')}>
            <motion.div
              role="menu"
              aria-label={t.cta.choose}
              className="w-full overflow-hidden rounded-3xl border border-ink/10 bg-silk-light p-2 text-ink shadow-[0_24px_60px_rgba(12,11,10,0.22)]"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.45, ease: EXPO }}
            >
              <p className="label px-4 pb-2 pt-3 text-ink/50">{t.cta.choose}</p>
              {options.map((o) => (
                <a
                  key={o.key}
                  role="menuitem"
                  href={o.href}
                  {...(o.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={() => setOpen(false)}
                  className="group/item flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors duration-300 hover:bg-ink hover:text-bone"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 transition-colors duration-300 group-hover/item:border-bone/30">
                    {o.icon}
                  </span>
                  <span className="min-w-0 text-start">
                    <span className="block text-sm font-medium">{o.label}</span>
                    <span dir="ltr" className="block truncate text-xs opacity-60 rtl:text-end">
                      {o.detail}
                    </span>
                  </span>
                </a>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 20.5l1.3-4.6A8.5 8.5 0 1 1 8 19.2l-4.5 1.3z" />
      <path d="M9.3 8.2c-.5 3.4 3.1 7 6.5 6.5l.8-1.6-1.9-1.100-.9.800c-1-.5-1.800-1.300-2.300-2.300l.8-.9-1.100-1.900z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3.5 7.5l8.5 6 8.5-6" />
    </svg>
  );
}
