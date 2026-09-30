"""
Rebuilds public/sequence-1 and public/sequence-2 straight from the original videos.

The first version of the site used frames exported through ezgif (~23 KB JPEGs), which
destroyed fine detail. Decoding the source H.264 directly and writing JPEG (it decodes about three times faster than WebP in the browser, which is what keeps scrubbing smooth)
keeps everything the videos actually contain. Frame counts are unchanged (181 / 150) so
scroll timing and caption beats stay where they were.

Usage:  python scripts/rebuild-frames.py <folder containing the source videos> [quality]
"""
import glob
import os
import sys

import cv2

APP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(APP, "public")

# (filename prefix, first source frame, last source frame, frames to write) — 1-based, inclusive.
# Ranges were found by matching the old site frames against the decoded videos.
SEQUENCES = {
    "sequence-1": [
        ("People_passing_box_through_locat", 1, 237, 150),
        ("Three_women_holding_package_20260919003141.mp4", 1, 103, 31),
    ],
    "sequence-2": [
        ("Syringe_dispensing_liquid_from_box", 1, 237, 150),
    ],
}


def find(src_dir, prefix):
    hits = sorted(f for f in glob.glob(os.path.join(src_dir, "*.mp4")) if os.path.basename(f).startswith(prefix.replace(".mp4", "")) and "ezgif" not in f)
    if not hits:
        sys.exit(f"source video not found: {prefix}*")
    return hits[0]


def read_all(path):
    cap, frames = cv2.VideoCapture(path), []
    while True:
        ok, frame = cap.read()
        if not ok:
            return frames
        frames.append(frame)


def main():
    src_dir = sys.argv[1]
    quality = int(sys.argv[2]) if len(sys.argv) > 2 else 80
    for name, parts in SEQUENCES.items():
        out = os.path.join(PUB, name)
        os.makedirs(out, exist_ok=True)
        n, total = 0, 0
        for prefix, first, last, count in parts:
            frames = read_all(find(src_dir, prefix))
            for i in range(count):
                idx = round(first + i * (last - first) / (count - 1)) - 1
                n += 1
                path = os.path.join(out, f"frame-{n:04d}.jpg")
                cv2.imwrite(path, frames[idx], [cv2.IMWRITE_JPEG_QUALITY, quality, cv2.IMWRITE_JPEG_OPTIMIZE, 1])
                total += os.path.getsize(path)
        print(f"{name}: {n} frames, {total / 1e6:.1f} MB, avg {total / n / 1024:.0f} KB")


if __name__ == "__main__":
    main()
