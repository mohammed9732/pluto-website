import { cn } from '@/lib/cn';

/**
 * PLUT + orb: the logo's "O" is the orb. Always LTR and Latin, in both locales.
 * `orb={false}` gives a type-only mark for places using mix-blend-difference,
 * where the orb's colours would invert.
 */
export function Wordmark({ className, orb = true }: { className?: string; orb?: boolean }) {
  return (
    <span dir="ltr" aria-label="Pluto" className={cn('inline-flex items-center gap-[0.18em] font-light leading-none', className)}>
      <span aria-hidden className="tracking-[0.12em]">
        {orb ? 'PLUT' : 'PLUTO'}
      </span>
      {orb && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/brand/pluto-orb.png" alt="" className="h-[0.86em] w-[0.86em]" />
      )}
    </span>
  );
}
