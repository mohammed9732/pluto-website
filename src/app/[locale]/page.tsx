import { notFound } from 'next/navigation';
import { CtaPill } from '@/components/chrome/CtaPill';
import { Nav } from '@/components/chrome/Nav';
import { Preloader } from '@/components/chrome/Preloader';
import { SectionDots } from '@/components/chrome/SectionDots';
import { Advantages } from '@/components/sections/Advantages';
import { Brands } from '@/components/sections/Brands';
import { Coverage } from '@/components/sections/Coverage';
import { Hero } from '@/components/sections/Hero';
import { Journey } from '@/components/sections/Journey';
import { Manifesto } from '@/components/sections/Manifesto';
import { Pillars } from '@/components/sections/Pillars';
import { PlaneMorph } from '@/components/sections/PlaneMorph';
import { copy, isLocale } from '@/content/copy';

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const t = copy[params.locale];

  return (
    <>
      <Preloader />
      <Nav t={t} locale={params.locale} />
      <SectionDots t={t} />
      <main>
        <Hero t={t} />
        <Manifesto t={t} />
        <Pillars t={t} />
        <Journey t={t} />
        <PlaneMorph t={t} />
        <Brands t={t} />
        <Advantages t={t} />
        <Coverage t={t} rtl={params.locale === 'ar'} />
      </main>
      <CtaPill t={t} />
    </>
  );
}
