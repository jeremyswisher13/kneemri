import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MriStackViewer from "./MriStackViewer";
import { wheelSliceStep } from "./mri-stack-wheel";

describe("MriStackViewer", () => {
  it("keeps controls accessible without rendering visible shortcut hints", () => {
    const html = renderToStaticMarkup(
      <MriStackViewer
        slices={[
          { src: "/slice-01.jpg", alt: "Normal knee sagittal slice 1 of 2" },
          { src: "/slice-02.jpg", alt: "Normal knee sagittal slice 2 of 2" },
        ]}
        title="Normal Knee"
        plane="Sagittal PD FS"
        startIndex={1}
        caption="Normal knee reference stack for comparing marrow, cartilage, menisci, ligaments, and recesses across slices."
        attribution="De-identified normal knee MRI"
      />,
    );

    expect(html).toContain("Normal knee reference stack");
    expect(html).toContain('aria-label="Slice position"');
    expect(html).toContain('aria-valuetext="Slice 2 of 2"');
    expect(html).toContain('aria-label="Adjust window/level (brightness and contrast)"');
    expect(html).not.toContain("Scroll, drag, or arrow keys");
    expect(html).not.toContain("pinch or double-tap");
    expect(html).not.toContain("Space to play");
  });

  it("leaves ordinary vertical wheel gestures available for page scrolling", () => {
    expect(wheelSliceStep({ deltaX: 0, deltaY: 120, shiftKey: false })).toBe(0);
    expect(wheelSliceStep({ deltaX: 4, deltaY: -120, shiftKey: false })).toBe(0);
    expect(wheelSliceStep({ deltaX: 5, deltaY: 0, shiftKey: false })).toBe(0);
    expect(wheelSliceStep({ deltaX: 40, deltaY: 30, shiftKey: false })).toBe(0);
  });

  it("scrubs slices only for horizontal trackpad gestures or Shift+wheel", () => {
    expect(wheelSliceStep({ deltaX: 80, deltaY: 5, shiftKey: false })).toBe(1);
    expect(wheelSliceStep({ deltaX: -80, deltaY: 5, shiftKey: false })).toBe(-1);
    expect(wheelSliceStep({ deltaX: 0, deltaY: 120, shiftKey: true })).toBe(1);
    expect(wheelSliceStep({ deltaX: 0, deltaY: -120, shiftKey: true })).toBe(-1);
  });
});
