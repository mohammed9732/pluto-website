export type SequenceDef = {
  dir: string;
  count: number;
  pad: number;
  ext: 'jpg' | 'webp';
  w: number;
  h: number;
  /** AI-upscaled copy of the same frames (same names, same count), for large landscape screens. */
  hd?: { dir: string; w: number; h: number };
};

// Frames are JPEG on purpose: measured in Chrome, JPEG decodes about three times faster than
// WebP at these sizes, and decode speed is what keeps scrubbing smooth.
export const SEQ_JOURNEY: SequenceDef = {
  dir: '/sequence-1',
  count: 181,
  pad: 4,
  ext: 'jpg',
  w: 1280,
  h: 720,
  hd: { dir: '/sequence-1-hd', w: 1600, h: 900 },
};

export const SEQ_PRODUCT: SequenceDef = {
  dir: '/sequence-2',
  count: 150,
  pad: 4,
  ext: 'jpg',
  w: 1280,
  h: 720,
  hd: { dir: '/sequence-2-hd', w: 1600, h: 900 },
};

/** `i` is 0-based; files on disk are 1-based. */
export const frameSrc = (s: Pick<SequenceDef, 'pad' | 'ext'>, dir: string, i: number) =>
  `${dir}/frame-${String(i + 1).padStart(s.pad, '0')}.${s.ext}`;

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Maps a section's scroll progress (0–1) to a playback position (0–1). `hold` and `tail` are
 * the opening and closing slices of scroll during which the first / last frame stays frozen
 * (used while a section fades in from, or out to, silk). Linear in between: scrubbing is direct
 * manipulation, so the picture should move exactly as far as the hand does.
 */
export function progressToPlayback(p: number, hold = 0, tail = 0): number {
  return clamp01((p - hold) / (1 - hold - tail));
}
