import { describe, expect, it } from "vitest";
import {
  APP_REVIEW_DEMO_AUTH_KEY,
  APP_REVIEW_DEMO_UID,
  LOCAL_PREVIEW_AUTH_KEY,
  LOCAL_PREVIEW_ROLE_KEY,
  LOCAL_PREVIEW_UID,
  activePreviewRole,
  canEnableAppReviewDemo,
  createAppReviewDemoUser,
  createLocalPreviewUser,
  disableAppReviewDemoAuth,
  disableLocalPreviewAuth,
  enableAppReviewDemoAuth,
  enableLocalPreviewAuth,
  hasAppReviewDemoAuth,
  hasLocalPreviewAuth,
  isAppReviewDemoRequested,
  isLocalPreviewHost,
} from "@/lib/local-preview-auth";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

describe("local preview auth", () => {
  it("is available only on local preview hosts", () => {
    expect(isLocalPreviewHost("http://localhost:4174/login")).toBe(true);
    expect(isLocalPreviewHost("http://127.0.0.1:4174/login")).toBe(true);
    expect(isLocalPreviewHost("https://ucla-knee-mri.firebaseapp.com/login")).toBe(false);
    expect(isLocalPreviewHost("not a url")).toBe(false);
  });

  it("stores and clears the local preview flag", () => {
    const storage = memoryStorage();

    expect(hasLocalPreviewAuth(storage)).toBe(false);
    enableLocalPreviewAuth(storage);
    expect(storage.getItem(LOCAL_PREVIEW_AUTH_KEY)).toBe("1");
    expect(hasLocalPreviewAuth(storage)).toBe(true);

    disableLocalPreviewAuth(storage);
    expect(hasLocalPreviewAuth(storage)).toBe(false);
  });

  it("recognizes App Review demo launch flags", () => {
    expect(isAppReviewDemoRequested("https://ucla-knee-mri.firebaseapp.com/login?reviewerDemo=1")).toBe(true);
    expect(isAppReviewDemoRequested("https://ucla-knee-mri.firebaseapp.com/login?reviewerDemo=true")).toBe(true);
    expect(isAppReviewDemoRequested("https://ucla-knee-mri.firebaseapp.com/login?returnTo=%2F%3FreviewerDemo%3D1")).toBe(true);
    expect(isAppReviewDemoRequested("https://ucla-knee-mri.firebaseapp.com/login")).toBe(false);
    expect(isAppReviewDemoRequested("not a url")).toBe(false);
  });

  it("stores and clears the App Review demo flag", () => {
    const storage = memoryStorage();

    expect(hasAppReviewDemoAuth(storage)).toBe(false);
    expect(canEnableAppReviewDemo("https://ucla-knee-mri.firebaseapp.com/login", storage)).toBe(false);

    enableAppReviewDemoAuth(storage);
    expect(storage.getItem(APP_REVIEW_DEMO_AUTH_KEY)).toBe("1");
    expect(hasAppReviewDemoAuth(storage)).toBe(true);
    expect(canEnableAppReviewDemo("https://ucla-knee-mri.firebaseapp.com/login", storage)).toBe(true);

    disableAppReviewDemoAuth(storage);
    expect(hasAppReviewDemoAuth(storage)).toBe(false);
  });

  it("creates a stable fellow preview user", () => {
    const user = createLocalPreviewUser();

    expect(user.uid).toBe(LOCAL_PREVIEW_UID);
    expect(user.email).toBe("local-preview@localhost");
    expect(user.displayName).toBe("Local Preview");
    expect(user.isAnonymous).toBe(false);
  });

  it("keeps the local admin role gated behind an active local preview session", () => {
    const previousWindow = globalThis.window;
    const previousSessionStorage = globalThis.sessionStorage;
    const storage = memoryStorage();
    storage.setItem(LOCAL_PREVIEW_AUTH_KEY, "1");
    storage.setItem(LOCAL_PREVIEW_ROLE_KEY, "admin");
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { location: { href: "http://127.0.0.1:4174/" } },
    });
    Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: storage });

    expect(activePreviewRole()).toBe("admin");

    Object.defineProperty(globalThis, "window", { configurable: true, value: previousWindow });
    Object.defineProperty(globalThis, "sessionStorage", {
      configurable: true,
      value: previousSessionStorage,
    });
  });

  it("creates a stable App Review demo user", () => {
    const user = createAppReviewDemoUser();

    expect(user.uid).toBe(APP_REVIEW_DEMO_UID);
    expect(user.email).toBe("app-review-demo@uclasportsmri.local");
    expect(user.displayName).toBe("App Review Demo");
    expect(user.isAnonymous).toBe(false);
  });
});
