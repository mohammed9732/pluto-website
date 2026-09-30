/**
 * A sliding window of decoded frames around the current scroll position.
 *
 * Frames are decoded from their compressed Blobs, which browsers do on a background thread, so
 * the page never waits for a decode. Painting a decoded frame is then a plain copy (~2 ms).
 *
 * Two rules keep it smooth on a modest laptop:
 *  - Look ahead as far as the visitor is moving. At a fast scroll we decode every 3rd or 4th
 *    frame ahead of them rather than frames they will have passed before the decode finishes.
 *  - Never ask the decoder to resize. A high-quality resize costs several times the decode
 *    itself; the canvas scales on the GPU for free.
 */

const MEMORY_BUDGET = 170e6; // bytes of decoded frames we are willing to hold
const MAX_PENDING = 3; // concurrent decodes
const MAX_FAILURES = 3; // then assume the browser can't do this

export class BitmapWindow {
  private map = new Map<number, ImageBitmap>();
  private pending = new Set<number>();
  private capacity = 16;
  private failures = 0;

  constructor(private onReady: () => void) {}

  /** The decoded frame closest to `i`, however far: a sharp neighbour beats a blank or blurred exact frame. */
  nearest(i: number): ImageBitmap | undefined {
    const exact = this.map.get(i);
    if (exact) return exact;
    let best: ImageBitmap | undefined;
    let bestDist = Infinity;
    this.map.forEach((bmp, k) => {
      const d = Math.abs(k - i);
      if (d < bestDist) {
        bestDist = d;
        best = bmp;
      }
    });
    return best;
  }

  /** Distance from `i` to the closest decoded frame (Infinity if none). */
  distance(i: number): number {
    let best = Infinity;
    this.map.forEach((_, k) => {
      best = Math.min(best, Math.abs(k - i));
    });
    return best;
  }

  /**
   * Decode what the visitor is about to need and release what is furthest away.
   * `dir` is the scroll direction, `stride` how many frames they cover per painted frame.
   */
  ensure(want: number, dir: 1 | -1, stride: number, blobs: (Blob | undefined)[]) {
    if (this.failures >= MAX_FAILURES || typeof createImageBitmap !== 'function') return;

    this.evict(want);
    const ahead = Math.max(4, this.capacity - 5);
    const wanted: number[] = [want];
    for (let d = 1; d <= ahead; d++) wanted.push(want + d * stride * dir);
    for (let d = 1; d <= 3; d++) wanted.push(want - d * dir); // a short tail for direction reversals
    if (stride > 1) for (let d = 1; d <= 4; d++) wanted.push(want + d * dir); // fill in as they slow down

    for (const i of wanted) {
      if (this.pending.size >= MAX_PENDING) break;
      const blob = blobs[i];
      if (!blob || this.map.has(i) || this.pending.has(i)) continue;
      this.build(i, blob, want);
    }
  }

  clear() {
    this.pending.clear();
    this.map.forEach((bmp) => bmp.close());
    this.map.clear();
  }

  private build(i: number, blob: Blob, want: number) {
    this.pending.add(i);
    createImageBitmap(blob)
      .then((bmp) => {
        if (!this.pending.delete(i)) return bmp.close(); // cleared while decoding
        this.map.set(i, bmp);
        this.capacity = Math.min(28, Math.max(8, Math.floor(MEMORY_BUDGET / (bmp.width * bmp.height * 4))));
        this.evict(want);
        this.onReady();
      })
      .catch(() => {
        this.pending.delete(i);
        this.failures++;
      });
  }

  /** Over capacity: drop the frames furthest from where the visitor is. */
  private evict(want: number) {
    if (this.map.size <= this.capacity) return;
    const keys: number[] = [];
    this.map.forEach((_, k) => keys.push(k));
    keys.sort((a, b) => Math.abs(b - want) - Math.abs(a - want));
    for (const k of keys.slice(0, this.map.size - this.capacity)) {
      this.map.get(k)?.close();
      this.map.delete(k);
    }
  }
}
