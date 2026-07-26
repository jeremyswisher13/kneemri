#!/usr/bin/env python3
"""Derive the app's icon set from the Sports MRI Academy brand kit in brand/.

Regenerate with:  python3 scripts/gen-brand-icons.py

The mark is a circle (the bore) crossed by three rounded slice lines on the
brand-dark field #005587 — the same value as --color-brand-dark in src/index.css,
so the icon, the app chrome, and the link-preview card share one palette.

THIS SCRIPT COPIES, IT DOES NOT REDRAW. An earlier version reproduced the geometry
with PIL primitives and came out visibly off (mean abs error ~16/255 against the
supplied render — PIL's stroke and cap rendering differs from SVG's). The
designer's raster output in brand/favicons is the source of truth. If the mark
changes, replace brand/ and re-run.

EVERY PNG STAYS SQUARE AND OPAQUE, which is both what the kit ships and what
pwa.test.ts enforces ("keeps home-screen PNG icons opaque"). Rounding a PNG here
would introduce an alpha channel, and transparency in a home-screen icon renders
unpredictably — iOS composites it against black, and Android adaptive icons apply
their own shaping regardless. Rounded corners belong in the SVGs, which the
platforms that support them will prefer anyway:
  * purpose "any"      -> rounded in SVG (rx=14), square in PNG.
  * purpose "maskable" -> square everywhere. The OS crops to a circle/squircle, so
                          art must stay inside the centre 80% safe zone; this mark
                          spans ~67%, comfortably inside.
Apple also rounds apple-touch-icon itself — a pre-rounded source there shows white
corners on older iOS.
"""
from pathlib import Path
from PIL import Image

SRC = Path("brand/favicons")
OUT = Path("public")

SVG = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">'
    "<title>{title}</title>"
    '<rect width="64" height="64" rx="{rx}" fill="#005587"/>'
    '<g stroke="#ffffff" stroke-linecap="round" fill="none">'
    '<circle cx="32" cy="32" r="20" stroke-width="3"/>'
    '<path d="M20 32h24M22.5 24.5h19M22.5 39.5h19" stroke-width="3.2"/>'
    "</g></svg>\n"
)


def copy_opaque(src: Path, out: Path) -> None:
    """Copy the designer's artwork, flattened to RGB so no alpha channel survives."""
    Image.open(src).convert("RGB").save(out, "PNG", optimize=True)
    print(f"wrote {out} (square, opaque)")


def main() -> None:
    # SVGs, straight from the kit's geometry. The titles are load-bearing:
    # pwa.test.ts and the live release gate both assert the favicon names the
    # product rather than a scaffold default.
    for path, title, rx in [
        (OUT / "favicon.svg", "Sports MRI Academy favicon", 14),
        (OUT / "pwa-icon.svg", "Sports MRI Academy icon", 14),
        (OUT / "pwa-maskable-icon.svg", "Sports MRI Academy maskable icon", 0),
    ]:
        path.write_text(SVG.format(title=title, rx=rx), encoding="utf8")
        print(f"wrote {path}")

    for src, out in [
        ("android-chrome-192x192.png", "pwa-icon-192.png"),
        ("android-chrome-512x512.png", "pwa-icon-512.png"),
        ("android-chrome-512x512.png", "pwa-maskable-icon-512.png"),
        ("apple-touch-icon.png", "apple-touch-icon.png"),
        ("favicon-32x32.png", "favicon-32x32.png"),
    ]:
        copy_opaque(SRC / src, OUT / out)

    # Browsers request /favicon.ico unprompted; without a real file, firebase.json's
    # ** rewrite hands them the SPA HTML shell instead.
    (OUT / "favicon.ico").write_bytes((SRC / "favicon.ico").read_bytes())
    print(f"wrote {OUT / 'favicon.ico'}")


if __name__ == "__main__":
    main()
