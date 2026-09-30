"""
Derives the HD web frames (1600x900 JPEG) from the AI-upscaled masters in masters/sequence-N-1440.
The masters are produced by upscale-frames.py and are kept out of public/ (they are not deployed).

Why 1600x900 JPEG: measured in Chrome on the client's laptop, a 1920x1080 WebP frame takes ~65 ms
to decode and a 1600x900 JPEG ~20 ms. On a 1920-wide canvas the difference in sharpness is not
visible; the difference in smoothness is.

Usage:  python scripts/build-hd.py [quality]
"""
import glob
import os
import sys

import cv2

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
quality = int(sys.argv[1]) if len(sys.argv) > 1 else 78

for n in (1, 2):
    src = sorted(glob.glob(os.path.join(APP, "masters", f"sequence-{n}-1440", "frame-*.webp")))
    out = os.path.join(APP, "public", f"sequence-{n}-hd")
    os.makedirs(out, exist_ok=True)
    total = 0
    for f in src:
        im = cv2.resize(cv2.imread(f), (1600, 900), interpolation=cv2.INTER_AREA)
        p = os.path.join(out, os.path.splitext(os.path.basename(f))[0] + ".jpg")
        cv2.imwrite(p, im, [cv2.IMWRITE_JPEG_QUALITY, quality, cv2.IMWRITE_JPEG_OPTIMIZE, 1])
        total += os.path.getsize(p)
    print(f"sequence-{n}-hd: {len(src)} frames, {total / 1e6:.1f} MB")
