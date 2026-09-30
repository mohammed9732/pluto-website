'use client';

import { useEffect, type ReactNode } from 'react';

/**
 * Scrolling is the browser's own. Native scrolling runs on the compositor thread, so the page
 * keeps gliding even at moments when the main thread is busy; a smooth-scroll library moves
 * scrolling onto the main thread, which is what made the page feel heavy on slower machines.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  // Development aid for screenshots: /en?at=journey:0.46 jumps to 46% of the way through #journey.
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const at = new URLSearchParams(window.location.search).get('at');
    if (!at) return;
    const [id, f = '0'] = at.split(':');
    const jump = () => {
      const el = document.getElementById(id);
      if (el) window.scrollTo(0, el.offsetTop + Math.max(0, el.offsetHeight - window.innerHeight) * Number(f));
    };
    const timers = [300, 1500, 3000].map((ms) => setTimeout(jump, ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  return <>{children}</>;
}

/** Glide to a section. Respects the visitor's reduced-motion setting. */
export function scrollToId(id: string) {
  const el = document.getElementById(id.replace(/^#/, ''));
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
