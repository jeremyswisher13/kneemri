import { describe, expect, it } from "vitest";
import {
  LOCAL_PREVIEW_AUTH_KEY,
  LOCAL_PREVIEW_UID,
  createLocalPreviewUser,
  disableLocalPreviewAuth,
  enableLocalPreviewAuth,
  hasLocalPreviewAuth,
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

  it("creates a stable fellow preview user", () => {
    const user = createLocalPreviewUser();

    expect(user.uid).toBe(LOCAL_PREVIEW_UID);
    expect(user.email).toBe("local-preview@localhost");
    expect(user.displayName).toBe("Local Preview");
    expect(user.isAnonymous).toBe(false);
  });
});
