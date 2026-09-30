'use client';

import { useEffect, useState } from 'react';
import { site } from '@/content/copy';

/** Rendered client-only: a server-rendered clock would always mismatch on hydration. */
export function LocalTime() {
  const [time, setTime] = useState('--:--');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: site.timeZone, hour: '2-digit', minute: '2-digit' });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return (
    <span dir="ltr" className="tabular-nums">
      {time}
    </span>
  );
}
