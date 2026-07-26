#!/usr/bin/env python3
"""Generate public/og-image.jpg — the link-preview card for iMessage, Slack, etc.

Regenerate with:  python3 scripts/gen-og-image.py

This exists as a script rather than a hand-made asset because the previous card
was a one-off export that silently went stale: it still showed UCLA branding, the
LEGACY domain, and only two courses long after there were four. Baked-in pixels
cannot be caught by grep or a test, so the fix is to make the card cheap to
rebuild from the values below.

Design notes: the palette matches the app's brand tokens in src/index.css
(#2774AE / #005587 / #FFD100 / #DAEBFE) and the crosshair motif matches the
favicon and PWA icons in public/, so a shared link, the browser tab, and the
home-screen icon all read as the same product.
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630

BLUE = (0x27, 0x74, 0xAE)      # brand-blue
DARK = (0x00, 0x55, 0x87)      # brand-dark
GOLD = (0xFF, 0xD1, 0x00)      # brand-gold
LIGHT = (0xDA, 0xEB, 0xFE)     # brand-light
WHITE = (0xFF, 0xFF, 0xFF)

TITLE = "Sports MRI Academy"
SUBTITLE = "Interactive, case-based MRI training for sports medicine"
COURSES = "Knee  ·  Shoulder  ·  Hip  ·  Elbow"
DOMAIN = "sportsmriacademy.com"

FONT_CANDIDATES = [
    ("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 0),
    ("/System/Library/Fonts/Helvetica.ttc", 1),
    ("/System/Library/Fonts/Supplemental/Arial.ttf", 0),
]
REGULAR_CANDIDATES = [
    ("/System/Library/Fonts/Supplemental/Arial.ttf", 0),
    ("/System/Library/Fonts/Helvetica.ttc", 0),
]


def load(candidates, size):
    for path, idx in candidates:
        try:
            return ImageFont.truetype(path, size, index=idx)
        except Exception:
            continue
    return ImageFont.load_default()


def main() -> None:
    img = Image.new("RGB", (W, H), DARK)
    d = ImageDraw.Draw(img)

    # Diagonal gradient, drawn as vertical bands blended along x+y so the card
    # has depth without needing an external asset.
    for y in range(H):
        for_band = y / H
        for x in range(0, W, 8):
            t = (x / W * 0.6) + (for_band * 0.4)
            c = tuple(int(BLUE[i] + (DARK[i] - BLUE[i]) * t) for i in range(3))
            d.rectangle([x, y, x + 8, y + 1], fill=c)

    # ── Crosshair motif (mirrors favicon.svg) ──────────────────────────────
    # Kept fully clear of the text column: at 1000/132 its leftmost tick lands
    # at x=844, while the longest text line ends near x=790.
    cx, cy, r = 1000, 315, 132
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(255, 255, 255), width=2)
    d.line([cx, cy - r - 22, cx, cy + r + 22], fill=(255, 255, 255), width=2)
    d.line([cx - r - 22, cy, cx + r + 22, cy], fill=(255, 255, 255), width=2)
    gr = 92
    d.ellipse([cx - gr, cy - gr, cx + gr, cy + gr], outline=GOLD, width=13)
    for dx, dy in ((0, -1), (0, 1), (-1, 0), (1, 0)):
        d.line(
            [cx + dx * 34, cy + dy * 34, cx + dx * 67, cy + dy * 67],
            fill=WHITE, width=9,
        )
    d.ellipse([cx - 20, cy - 20, cx + 20, cy + 20], fill=WHITE)

    # ── Wordmark and copy ──────────────────────────────────────────────────
    # Text is a left column capped well short of the motif. Social cards get
    # cropped and downscaled hard, so this stays large and high-contrast.
    x = 84
    d.text((x, 196), TITLE, font=load(FONT_CANDIDATES, 62), fill=WHITE)
    d.text((x, 282), SUBTITLE, font=load(REGULAR_CANDIDATES, 25), fill=LIGHT)
    d.text((x, 340), COURSES, font=load(FONT_CANDIDATES, 29), fill=GOLD)

    # Rule + domain, so the card states where the link actually goes.
    d.line([x, 410, x + 430, 410], fill=(255, 255, 255), width=1)
    d.text((x, 432), DOMAIN, font=load(REGULAR_CANDIDATES, 24), fill=LIGHT)

    img.save("public/og-image.jpg", "JPEG", quality=90, optimize=True)
    print(f"wrote public/og-image.jpg ({W}x{H})")


if __name__ == "__main__":
    main()
