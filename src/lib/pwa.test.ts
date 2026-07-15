import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  installInstructionsForUserAgent,
  isLikelyIosDevice,
  isNativeIosAppShell,
  registerServiceWorker,
} from "@/lib/pwa";
import {
  INSTALL_PROMPT_DISMISS_KEY,
  INSTALL_PROMPT_REMINDER_MS,
  isInstallPromptDismissed,
} from "@/lib/install-prompt";

function memoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

function pngMetadata(path: string) {
  const png = readFileSync(resolve(path));
  expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
  const colorType = png[25];
  return {
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
    hasAlpha: colorType === 4 || colorType === 6,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

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

  it("detects the native iOS shell so browser install prompts can be hidden", () => {
    expect(isNativeIosAppShell("?source=ios-app", "")).toBe(true);
    expect(isNativeIosAppShell("", "Mozilla/5.0 UCLASportsMRIiOS")).toBe(true);
    expect(isNativeIosAppShell("?source=homescreen", "Mozilla/5.0 Safari/605.1.15")).toBe(false);
  });

  it("reminds learners about installation after a seven-day dismissal window", () => {
    const now = Date.UTC(2026, 6, 14);
    const recent = memoryStorage({
      [INSTALL_PROMPT_DISMISS_KEY]: String(now - INSTALL_PROMPT_REMINDER_MS + 1),
    });
    const expired = memoryStorage({
      [INSTALL_PROMPT_DISMISS_KEY]: String(now - INSTALL_PROMPT_REMINDER_MS),
    });
    const legacyPermanentDismissal = memoryStorage({ [INSTALL_PROMPT_DISMISS_KEY]: "1" });

    expect(isInstallPromptDismissed(recent, now)).toBe(true);
    expect(isInstallPromptDismissed(expired, now)).toBe(false);
    expect(isInstallPromptDismissed(legacyPermanentDismissal, now)).toBe(false);
  });

  it("keeps stale PWA service-worker caches out of the native iOS shell", async () => {
    const unregister = vi.fn().mockResolvedValue(true);
    const getRegistrations = vi.fn().mockResolvedValue([{ unregister }]);
    const register = vi.fn();
    const keys = vi.fn().mockResolvedValue(["ucla-sports-mri-v4"]);
    const deleteCache = vi.fn().mockResolvedValue(true);

    vi.stubGlobal("window", {
      location: { search: "?source=ios-app" },
      caches: { keys, delete: deleteCache },
    });
    vi.stubGlobal("navigator", {
      userAgent: "Mozilla/5.0 UCLASportsMRIiOS",
      serviceWorker: { getRegistrations, register },
    });

    registerServiceWorker();
    await Promise.resolve();
    await Promise.resolve();

    expect(register).not.toHaveBeenCalled();
    expect(getRegistrations).toHaveBeenCalled();
    expect(unregister).toHaveBeenCalled();
    expect(keys).toHaveBeenCalled();
    expect(deleteCache).toHaveBeenCalledWith("ucla-sports-mri-v4");
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
    expect(sw).toContain('const CACHE_VERSION = "ucla-sports-mri-v6"');
    expect(sw).toContain('"/apple-touch-icon.png"');
    expect(sw).toContain("html.matchAll");
    expect(sw).toContain('event.data?.type === "SKIP_WAITING"');
    expect(favicon).toContain("UCLA Sports MRI favicon");
    expect(favicon).not.toContain("#863bff");
  });

  it("keeps home-screen PNG icons opaque and at their declared dimensions", () => {
    expect(pngMetadata("public/pwa-icon-192.png")).toEqual({
      width: 192,
      height: 192,
      hasAlpha: false,
    });
    expect(pngMetadata("public/pwa-icon-512.png")).toEqual({
      width: 512,
      height: 512,
      hasAlpha: false,
    });
    expect(pngMetadata("public/pwa-maskable-icon-512.png")).toEqual({
      width: 512,
      height: 512,
      hasAlpha: false,
    });
    expect(pngMetadata("public/apple-touch-icon.png")).toEqual({
      width: 180,
      height: 180,
      hasAlpha: false,
    });
  });

  it("keeps live App Store readiness checking install icons", () => {
    const liveReadiness = readFileSync(resolve("scripts/ios-live-readiness.mjs"), "utf8");

    expect(liveReadiness).toContain("/manifest.webmanifest");
    expect(liveReadiness).toContain("/apple-touch-icon.png");
    expect(liveReadiness).toContain("/pwa-icon-512.png");
    expect(liveReadiness).toContain("assertContentTypeIncludes");
    expect(liveReadiness).toContain("Live web manifest names app");
    expect(liveReadiness).toContain("Live favicon names app");
  });
});
