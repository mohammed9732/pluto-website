'use client';

import { useEffect, useState } from 'react';

/**
 * The page is light with two dark bookends (sections marked data-tone="dark"). Fixed chrome
 * (nav, dots, CTA) asks what is behind it at its own height and picks its colour to match.
 */
export function useOnDark(anchor: 'top' | 'middle' | 'bottom') {
  const [dark, setDark] = useState(true); // the page opens on the dark hero

  useEffect(() => {
    const check = () => {
      const y = anchor === 'top' ? 36 : anchor === 'middle' ? window.innerHeight / 2 : window.innerHeight - 44;
      let d = false;
      document.querySelectorAll('[data-tone="dark"]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) d = true;
      });
      setDark(d);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [anchor]);

  return dark;
}
