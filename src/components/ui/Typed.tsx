'use client';

import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Typewriter: the text is keyed in one character at a time behind a blinking caret, once,
 * when it scrolls into view. The full text is always in the layout (untyped characters are
 * transparent), so nothing shifts as it types, and screen readers get the whole string.
 */
export function Typed({
  text,
  delay = 0,
  speed = 120,
  className,
  onDone,
}: {
  text: string;
  /** Milliseconds to wait after entering view before the first key. */
  delay?: number;
  /** Milliseconds per character. */
  speed?: number;
  className?: string;
  onDone?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const chars = Array.from(text); // by code point, so Arabic and symbols are never split
  const [n, setN] = useState(0);
  const [caret, setCaret] = useState(false);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(chars.length);
      done.current?.();
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const key = () => {
      i++;
      setN(i);
      if (i < chars.length) {
        // A typist is never perfectly even.
        timer = setTimeout(key, speed * (0.7 + Math.random() * 0.6));
      } else {
        done.current?.();
        timer = setTimeout(() => setCaret(false), 1400);
      }
    };
    timer = setTimeout(() => {
      setCaret(true);
      timer = setTimeout(key, speed);
    }, delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} aria-label={text} className={cn('whitespace-pre-wrap', className)}>
      <span aria-hidden>{chars.slice(0, n).join('')}</span>
      <span aria-hidden className="relative inline-block w-0 align-baseline">
        <span className={cn('absolute bottom-[0.02em] start-[0.04em] h-[0.74em] w-[0.05em] min-w-[2px] bg-pluto-coral transition-opacity duration-300', caret ? 'animate-caret' : 'opacity-0')} />
      </span>
      <span aria-hidden className="opacity-0">
        {chars.slice(n).join('')}
      </span>
    </span>
  );
}
