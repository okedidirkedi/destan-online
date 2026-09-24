#!/usr/bin/env python3
"""Draw stand-in Okçu projectile frames.

Filenames are the odd sequence from the Taner pack (0001, 0003, … 0029).
Drop the real PNGs from T:\\…\\SKILL on top of the same names; the client
binds those paths and does not care who painted the pixels.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1] / "public" / "vfx" / "projectiles"
FRAME_IDS = [f"{n:04d}" for n in range(1, 30, 2)]
W, H = 128, 48

SETS = {
    "arrow": "normal",
    "fire-arrow": "fire",
    "magic-arrow": "magic",
    "arrow-rain": "normal",
    "fire-arrow-rain": "fire",
    "dark-arrow-rain": "dark",
}

SOURCES = {
    "arrow": r"Projectiles Character Pack 1\Arrow Sprites\Arrow",
    "fire-arrow": r"Projectiles - 2D HD Character pack 1\Arrows\FireArrow",
    "magic-arrow": r"Projectiles Character Pack 1\Arrow Sprites\MagicArrow",
    "arrow-rain": r"Projectiles Character Pack 1\AoE Sprites\ArrowRain",
    "fire-arrow-rain": r"Projectiles Character Pack 1\AoE Sprites\FireArrowRain",
    "dark-arrow-rain": r"Projectiles Character Pack 1\AoE Sprites\DarkArrowRain",
}


def palette(kind: str) -> dict[str, tuple[int, int, int, int]]:
    if kind == "fire":
        return {
            "shaft": (132, 58, 28, 255),
            "head": (255, 186, 48, 255),
            "fletch": (255, 92, 18, 255),
            "line": (48, 18, 8, 255),
            "glow": (255, 140, 32, 170),
        }
    if kind == "magic":
        return {
            "shaft": (86, 58, 168, 255),
            "head": (206, 188, 255, 255),
            "fletch": (154, 78, 255, 255),
            "line": (28, 16, 64, 255),
            "glow": (186, 140, 255, 160),
        }
    if kind == "dark":
        return {
            "shaft": (42, 28, 62, 255),
            "head": (126, 86, 176, 255),
            "fletch": (64, 32, 96, 255),
            "line": (12, 8, 18, 255),
            "glow": (90, 40, 140, 150),
        }
    return {
        "shaft": (112, 74, 42, 255),
        "head": (214, 218, 224, 255),
        "fletch": (168, 42, 46, 255),
        "line": (28, 18, 12, 255),
        "glow": (255, 244, 210, 80),
    }


def draw_frame(frame_index: int, kind: str) -> Image.Image:
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    colors = palette(kind)
    y = 24 + (1 if frame_index % 2 else -1)
    flap = 5 + (frame_index % 5)
    d.polygon([(22, y - 3), (96, y - 3), (96, y + 3), (22, y + 3)], fill=colors["shaft"])
    d.polygon([(96, y - 9), (120, y), (96, y + 9)], fill=colors["head"])
    d.polygon([(22, y), (6, y - flap), (20, y - 1)], fill=colors["fletch"])
    d.polygon([(22, y), (6, y + flap - 1), (20, y + 1)], fill=colors["fletch"])
    d.line(
        [(22, y - 3), (96, y - 3), (96, y - 9), (120, y), (96, y + 9), (96, y + 3), (22, y + 3)],
        fill=colors["line"],
        width=1,
    )
    hx = 28 + frame_index * 4
    d.ellipse((hx, y - 7, hx + 8, y + 1), fill=colors["glow"])
    return im


def main() -> None:
    manifest_sets = {}
    for folder, kind in SETS.items():
        out = ROOT / folder
        out.mkdir(parents=True, exist_ok=True)
        hashes = []
        for index, frame_id in enumerate(FRAME_IDS):
            image = draw_frame(index, kind)
            path = out / f"{frame_id}.png"
            image.save(path, "PNG")
            hashes.append(hashlib.sha256(path.read_bytes()).hexdigest()[:12])
        manifest_sets[folder] = {
            "tanerPack": SOURCES[folder],
            "frames": [f"{frame_id}.png" for frame_id in FRAME_IDS],
            "pixelSize": [W, H],
            "sha256_12": hashes,
        }
    manifest = {
        "frameOrder": FRAME_IDS,
        "note": "Odd frames only. Replace PNGs in place with the Taner pack; do not add even numbers.",
        "sets": manifest_sets,
    }
    (ROOT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(SETS) * len(FRAME_IDS)} frames under {ROOT}")


if __name__ == "__main__":
    main()
