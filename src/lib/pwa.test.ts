import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { installInstructionsForUserAgent, isLikelyIosDevice } from "@/lib/pwa";

describe("pwa helpers", () => {
  it("detects modern iPadOS devices that report as MacIntel", () => {
    expect(isLikelyIosDevice({ platform: "MacIntel", maxTouchPoints: 5 })).toBe(true);
    expect(isLikelyIosDevice({ platform: "MacIntel", maxTouchPoints: 0 })).toBe(false);
  });

  it("returns platform-specific install instructions", () => {
    expect(installInstructionsForUserAgent("Mozilla/5.0 (iPhone)", "iPhone")).toContain(
      "Share",
    );
    expect(
      installInstructionsForUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15",
        "MacIntel",
        0,
      ),
    ).toContain("browser menu");
    expect(
      installInstructionsForUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1",
        "MacIntel",
        5,
      ),
    ).toContain("Share");
    expect(installInstructionsForUserAgent("Mozilla/5.0 (Linux; Android 14)", "Linux")).toContain(
      "Install app",
    );
  });

  it("offers home-screen shortcuts for every normal MRI workstation", () => {
    const manifest = JSON.parse(
      readFileSync(resolve("public/manifest.webmanifest"), "utf8"),
    ) as { shortcuts: { url: string }[] };

    expect(manifest.shortcuts.map((shortcut) => shortcut.url)).toEqual(
      expect.arrayContaining([
        "/courses/knee-mri/normal-knee-mri",
        "/courses/shoulder-mri/normal-shoulder-mri",
        "/courses/hip-mri/normal-hip-mri",
        "/courses/elbow-mri/normal-elbow-mri",
      ]),
    );
  });

  it("wires install icons for browser, Android, and iOS home screens", () => {
    const index = readFileSync(resolve("index.html"), "utf8");
    const manifest = JSON.parse(
      readFileSync(resolve("public/manifest.webmanifest"), "utf8"),
    ) as { icons: { src: string; sizes: string; purpose?: string; type: string }[] };
    const sw = readFileSync(resolve("public/sw.js"), "utf8");
    const favicon = readFileSync(resolve("public/favicon.svg"), "utf8");

    expect(index).toContain('rel="icon" type="image/svg+xml" href="/favicon.svg"');
    expect(index).toContain('rel="icon" type="image/png" sizes="192x192" href="/pwa-icon-192.png"');
    expect(index).toContain('rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"');
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ src: "/pwa-icon-192.png", sizes: "192x192", purpose: "any" }),
        expect.objectContaining({ src: "/pwa-icon-512.png", sizes: "512x512", purpose: "any" }),
        expect.objectContaining({ src: "/pwa-maskable-icon-512.png", sizes: "512x512", purpose: "maskable" }),
      ]),
    );
    expect(sw).toContain('const CACHE_VERSION = "ucla-sports-mri-v5"');
    expect(sw).toContain('"/apple-touch-icon.png"');
    expect(favicon).toContain("UCLA Sports MRI favicon");
    expect(favicon).not.toContain("#863bff");
  });
});
