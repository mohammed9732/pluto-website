'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { scrollToId } from '@/components/providers/SmoothScroll';
import { Wordmark } from '@/components/ui/Wordmark';
import { site, type Copy, type Locale } from '@/content/copy';
import { useOnDark } from '@/hooks/useTone';
import { cn, EXPO } from '@/lib/cn';

export function Nav({ t, locale }: { t: Copy; locale: Locale }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const onDark = useOnDark('top');
  const dark = onDark && !open; // the open menu is silk

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200);
  });

  // The page must not scroll behind the open mobile menu.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = [
    ['#about', t.nav.about],
    ['#journey', t.nav.journey],
    ['#portfolio', t.nav.portfolio],
    ['#advantages', t.nav.advantages],
    ['#global', t.nav.global],
  ] as const;

  const go = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(hash);
  };

  const other = locale === 'en' ? 'ar' : 'en';

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={{ duration: 0.7, ease: EXPO }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-colors duration-500 md:px-12',
          dark ? 'text-bone' : 'text-ink',
        )}
      >
        <a href="#top" onClick={go('#top')} aria-label="Pluto" className="-my-2 py-2">
          <Wordmark className="text-xl md:text-2xl" />
        </a>

        <nav className="absolute start-1/2 hidden -translate-x-1/2 gap-8 lg:flex rtl:translate-x-1/2">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={go(href)} className="label opacity-70 transition-opacity hover:opacity-100">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-6 md:gap-8">
          <a href={`tel:${site.phone.replace(/\s/g, '')}`} dir="ltr" className="label hidden opacity-70 hover:opacity-100 xl:block">
            {site.phone}
          </a>
          <Link href={`/${other}`} className="label -my-4 py-4 opacity-70 hover:opacity-100" hrefLang={other}>
            {t.nav.switchTo}
          </Link>
          <button className="label -my-4 py-4 lg:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
            {open ? t.nav.close : t.nav.menu}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="silk fixed inset-0 z-40 flex flex-col justify-center gap-2 overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24 text-ink lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: EXPO }}
          >
            {links.map(([href, label], i) => (
              <span key={href} className="overflow-hidden">
                <motion.a
                  href={href}
                  onClick={go(href)}
                  className="block py-1 text-title"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EXPO, delay: 0.15 + i * 0.07 }}
                >
                  {label}
                </motion.a>
              </span>
            ))}

            {/* On a phone the menu is also the contact card. */}
            <motion.div
              className="mt-8 grid gap-4 border-t border-ink/10 pt-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EXPO, delay: 0.55 }}
            >
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-2 text-base">
                {t.cta.whatsapp}
                <span dir="ltr" className="text-sm text-ink/55">
                  {site.phone}
                </span>
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center justify-between py-2 text-base">
                {t.cta.email}
                <span dir="ltr" className="text-sm text-ink/55">
                  {site.email}
                </span>
              </a>
              <Link href={`/${other}`} hrefLang={other} className="flex items-center justify-between py-2 text-base">
                {t.nav.switchTo}
                <span className="label text-ink/55">{other.toUpperCase()}</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
