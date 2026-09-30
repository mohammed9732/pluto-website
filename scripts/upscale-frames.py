"""
AI-upscales the site's frame sequences 2x (1280x720 -> 2560x1440) with Real-ESRGAN
"general x4 v3" running on ONNX Runtime (CPU).

The model is 4x; the result is box-filtered down to 2x, which is sharper and cleaner than
running a 2x model and keeps the output a sensible size for the web.

Usage:
  python scripts/upscale-frames.py <model.onnx> <in_dir> <out_dir> [--only 80,165] [--quality 84]

Resumable: frames that already exist in <out_dir> are skipped, so an interrupted run can be
restarted with the same command.
"""
import argparse
import glob
import os
import sys
import time

import cv2
import numpy as np
import onnxruntime as ort

TILE = 192   # core tile size (input pixels)
PAD = 16     # context around each tile that is computed then discarded, hides seams
SCALE = 4    # the model's native factor
OUT_SCALE = 2


def upscale_x4(session, bgr):
    """Tile-wise 4x upscale of a BGR uint8 image; returns BGR uint8."""
    h, w = bgr.shape[:2]
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    padded = np.pad(rgb, ((PAD, PAD), (PAD, PAD), (0, 0)), mode="reflect")
    out = np.zeros((h * SCALE, w * SCALE, 3), np.float32)
    for y in range(0, h, TILE):
        for x in range(0, w, TILE):
            y1, x1 = min(y + TILE, h), min(x + TILE, w)
            tile = padded[y : y1 + 2 * PAD, x : x1 + 2 * PAD]
            inp = np.ascontiguousarray(tile.transpose(2, 0, 1)[None])
            res = session.run(None, {"input": inp})[0][0].transpose(1, 2, 0)
            c = PAD * SCALE
            out[y * SCALE : y1 * SCALE, x * SCALE : x1 * SCALE] = res[c : c + (y1 - y) * SCALE, c : c + (x1 - x) * SCALE]
    out = np.clip(out * 255.0 + 0.5, 0, 255).astype(np.uint8)
    return cv2.cvtColor(out, cv2.COLOR_RGB2BGR)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("model")
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--only", help="comma-separated 1-based frame numbers (for tests)")
    ap.add_argument("--quality", type=int, default=84)
    a = ap.parse_args()

    opts = ort.SessionOptions()
    opts.intra_op_num_threads = max(1, (os.cpu_count() or 4) - 1)  # leave one core for the machine
    session = ort.InferenceSession(a.model, opts, providers=["CPUExecutionProvider"])

    files = sorted(glob.glob(os.path.join(a.src, "frame-*.webp")))
    if a.only:
        want = {int(n) for n in a.only.split(",")}
        files = [f for f in files if int(os.path.basename(f)[6:10]) in want]
    os.makedirs(a.dst, exist_ok=True)

    todo = [f for f in files if not os.path.exists(os.path.join(a.dst, os.path.basename(f)))]
    print(f"{len(files)} frames, {len(files) - len(todo)} already done", flush=True)
    t0 = time.time()
    for n, f in enumerate(todo, 1):
        img = cv2.imread(f, cv2.IMREAD_COLOR)
        big = upscale_x4(session, img)
        h, w = img.shape[:2]
        small = cv2.resize(big, (w * OUT_SCALE, h * OUT_SCALE), interpolation=cv2.INTER_AREA)
        name = os.path.join(a.dst, os.path.basename(f))
        cv2.imwrite(name + ".tmp.webp", small, [cv2.IMWRITE_WEBP_QUALITY, a.quality])
        os.replace(name + ".tmp.webp", name)
        el = time.time() - t0
        print(f"[{n}/{len(todo)}] {os.path.basename(f)}  {el / n:.1f}s/frame  eta {el / n * (len(todo) - n) / 60:.0f} min", flush=True)


if __name__ == "__main__":
    sys.exit(main())
