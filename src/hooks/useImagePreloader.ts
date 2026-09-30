'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { frameSrc, type SequenceDef } from '@/lib/sequences';

/**
 * Frame store for a scroll sequence.
 *
 * Frames are downloaded once and kept as compressed Blobs (the whole sequence is a few MB of
 * memory). Nothing is decoded here: BitmapWindow decodes the handful of frames around the
 * scroll position, off the main thread, when they are about to be needed. Loading is therefore
 * almost free, and the page stays responsive while it happens.
 */

type Snapshot = { progress: number; firstReady: boolean; ready: boolean };

export type FrameStore = {
  blobs: (Blob | undefined)[];
  /** Pixel size of the frames actually being served (standard or HD). */
  srcW: number;
  srcH: number;
  snapshot: Snapshot;
  listeners: Set<() => void>;
  started: boolean;
};

const IDLE: Snapshot = { progress: 0, firstReady: false, ready: false };

// Module-level cache: remounts and Fast Refresh share one download per sequence.
const stores = new Map<string, FrameStore>();

function getStore(seq: SequenceDef): FrameStore {
  let s = stores.get(seq.dir);
  if (!s) {
    s = { blobs: new Array(seq.count), srcW: seq.w, srcH: seq.h, snapshot: IDLE, listeners: new Set(), started: false };
    stores.set(seq.dir, s);
  }
  return s;
}

/** Frame 0 first, then every 8th, 4th, 2nd, and finally everything: an early scroll still finds evenly spaced frames. */
function loadOrder(count: number, step: number): number[] {
  const seen = new Set<number>();
  const order: number[] = [];
  for (const stride of [8, 4, 2, 1]) {
    if (stride < step) break;
    for (let i = 0; i < count; i += stride) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  return order;
}

/** The HD set only pays off on a large canvas; phones, data-saver and low-memory devices keep the standard frames. */
function wantHd(): boolean {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if ((nav.deviceMemory ?? 8) < 4) return false;
  return window.matchMedia('(min-width: 1200px) and (orientation: landscape)').matches;
}

function start(seq: SequenceDef, store: FrameStore, step: number, concurrency: number) {
  store.started = true;
  const hd = seq.hd && wantHd() ? seq.hd : null;
  const dir = hd?.dir ?? seq.dir;
  store.srcW = hd?.w ?? seq.w;
  store.srcH = hd?.h ?? seq.h;

  const order = loadOrder(seq.count, step);
  let cursor = 0;
  let done = 0;

  const publish = () => {
    const next: Snapshot = {
      progress: Math.round((done / order.length) * 100),
      firstReady: !!store.blobs[0],
      ready: done >= order.length,
    };
    const prev = store.snapshot;
    if (next.progress === prev.progress && next.firstReady === prev.firstReady && next.ready === prev.ready) return;
    store.snapshot = next;
    store.listeners.forEach((l) => l());
  };

  const pump = async () => {
    while (cursor < order.length) {
      const i = order[cursor++];
      try {
        const res = await fetch(frameSrc(seq, dir, i));
        if (!res.ok) throw new Error(String(res.status));
        store.blobs[i] = await res.blob();
      } catch {
        // A missing frame is not fatal: the player paints its nearest neighbour.
      }
      done++;
      publish();
    }
  };

  for (let n = 0; n < concurrency; n++) void pump();
}

export function useImagePreloader(seq: SequenceDef, opts: { step?: number; concurrency?: number; enabled?: boolean } = {}) {
  const { step, concurrency = 4, enabled = true } = opts;
  const store = getStore(seq);

  useEffect(() => {
    if (!enabled || store.started || typeof createImageBitmap !== 'function') return;
    // Phones and data-saver sessions load every 2nd frame: half the bytes.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const auto = window.matchMedia('(max-width: 767px)').matches || saveData ? 2 : 1;
    start(seq, store, step ?? auto, concurrency);
  }, [enabled, seq, store, step, concurrency]);

  const snapshot = useSyncExternalStore(
    (cb) => {
      store.listeners.add(cb);
      return () => store.listeners.delete(cb);
    },
    () => store.snapshot,
    () => IDLE,
  );

  return { store, ...snapshot };
}
