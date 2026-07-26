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

    # ── Brand mark ─────────────────────────────────────────────────────────
    # Composited from the designer's own raster in brand/, never redrawn — the
    # same rule scripts/gen-brand-icons.py follows, and for the same reason:
    # a PIL reproduction of this mark measured ~16/255 off the real one.
    # Placed clear of the text column: at 1000 centre / 260 wide its left edge
    # lands at x=870, while the longest text line ends near x=710.
    mark = Image.open("brand/favicons/android-chrome-512x512.png").convert("RGBA")
    side = 260
    mark = mark.resize((side, side), Image.LANCZOS)
    rounded = Image.new("L", (side * 4, side * 4), 0)
    ImageDraw.Draw(rounded).rounded_rectangle(
        [0, 0, side * 4 - 1, side * 4 - 1], radius=14 / 64 * side * 4, fill=255
    )
    mark.putalpha(rounded.resize((side, side), Image.LANCZOS))
    img.paste(mark, (1000 - side // 2, 315 - side // 2), mark)

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
