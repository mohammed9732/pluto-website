'use client';

import { Arrow } from '@/components/chrome/CtaPill';
import { LocalTime } from '@/components/ui/LocalTime';
import { RevealLines } from '@/components/ui/RevealLines';
import { Wordmark } from '@/components/ui/Wordmark';
import { ContactMenu } from '@/components/ui/ContactMenu';
import { site, type Copy } from '@/content/copy';

const OPACITIES = ['opacity-100', 'opacity-40', 'opacity-70', 'opacity-25', 'opacity-55'];

/** Coverage, the closing call to action and the footer. The second dark bookend: the planet returns, still. */
export function Coverage({ t, rtl }: { t: Copy; rtl: boolean }) {
  const cities = [...t.coverage.cities, ...t.coverage.cities];

  return (
    <section id="global" data-tone="dark" className="relative isolate z-10 -mt-8 overflow-x-clip rounded-t-[2rem] bg-ink text-bone md:rounded-t-[3rem]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/posters/globe.jpg"
        alt=""
        loading="lazy"
        className="pointer-events-none absolute -bottom-[8%] end-[-20%] -z-10 w-[150%] max-w-none opacity-50 [mask-image:radial-gradient(closest-side,black_55%,transparent)] md:end-[-12%] md:w-[85%]"
      />

      <div className="px-6 pt-28 md:px-12 md:pt-40">
        <p className="label mb-10 text-bone-muted">{t.coverage.label}</p>
        <h2 className="text-display">
          <RevealLines lines={t.coverage.title} />
        </h2>

        <dl className="mt-20 grid gap-8 border-t border-bone-faint pt-8 md:mt-28 md:grid-cols-3">
          {t.coverage.stats.map((s) => (
            <div key={s.label}>
              <dt className="label mb-3 text-bone-muted">{s.label}</dt>
              <dd className="font-display text-3xl md:text-5xl rtl:font-sans">{s.value === 'TIME' ? <LocalTime /> : s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* City cloud */}
      <div aria-hidden className="mt-20 overflow-hidden py-6 md:mt-28">
        <div className={`flex w-max gap-12 whitespace-nowrap text-title ${rtl ? 'animate-marquee-rtl' : 'animate-marquee'}`}>
          {cities.map((c, i) => (
            <span key={i} className={OPACITIES[i % OPACITIES.length]}>
              {c}
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">{t.coverage.cities.join(', ')}</p>

      <div className="px-6 pb-10 pt-20 md:px-12 md:pt-28">
        <p className="max-w-[26ch] text-title">{t.coverage.closing}</p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <ContactMenu
            t={t}
            kind="partner"
            align="start"
            className="group inline-flex w-full items-center justify-between gap-6 rounded-full bg-bone px-7 py-4 text-sm font-medium text-ink transition-colors duration-500 hover:bg-pluto-coral hover:text-white sm:w-auto"
          >
            {t.cta.partner}
            <Arrow className="h-3 w-3 transition-transform duration-500 group-hover:rotate-45" />
          </ContactMenu>
          <ContactMenu
            t={t}
            kind="visit"
            align="start"
            className="group inline-flex w-full items-center justify-between gap-6 rounded-full border border-bone/40 px-7 py-4 text-sm font-medium transition-colors duration-500 hover:border-bone hover:bg-bone hover:text-ink sm:w-auto"
          >
            {t.cta.visit}
            <Arrow className="h-3 w-3 transition-transform duration-500 group-hover:rotate-45" />
          </ContactMenu>
        </div>

        <footer className="mt-28 border-t border-bone-faint pt-10 md:mt-40">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <Wordmark className="text-3xl" />
            </div>
            {t.footer.offices.map((o) => (
              <address key={o.city} className="not-italic">
                <p className="label mb-3 text-bone-muted">{o.city}</p>
                <p className="text-[15px] leading-relaxed">{o.address}</p>
              </address>
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label mb-3 text-bone-muted">{t.footer.inquiries}</p>
              <a href={`mailto:${site.email}`} className="block py-1.5 text-xl transition-colors hover:text-pluto-cyan md:text-2xl">
                {site.email}
              </a>
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} dir="ltr" className="block py-1.5 text-xl transition-colors hover:text-pluto-cyan md:text-2xl rtl:text-end">
                {site.phone}
              </a>
            </div>
            <div className="flex gap-8">
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="label -my-4 py-4 opacity-70 hover:opacity-100">
                Instagram
              </a>
              <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="label -my-4 py-4 opacity-70 hover:opacity-100">
                Facebook
              </a>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 text-bone-muted md:flex-row md:justify-between">
            <p className="label">{t.footer.rights}</p>
            <p className="text-[11px]">{t.footer.disclaimer}</p>
          </div>
        </footer>
      </div>
    </section>
  );
}
