import { describe, expect, it } from "vitest";
import {
  LOGIN_RETURN_TO_KEY,
  consumeReturnPath,
  rememberReturnPath,
  returnPathFromState,
  safeInternalPath,
} from "@/lib/login-return";

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

describe("login return paths", () => {
  it("keeps internal deep links with query and hash", () => {
    expect(
      returnPathFromState({
        from: {
          pathname: "/courses/hip-mri/modules",
          search: "?from=smoke",
          hash: "#target",
        },
      }),
    ).toBe("/courses/hip-mri/modules?from=smoke#target");
  });

  it("rejects external, protocol-relative, empty, and login paths", () => {
    expect(safeInternalPath("https://example.com/courses/hip-mri")).toBe("/");
    expect(safeInternalPath("//example.com/courses/hip-mri")).toBe("/");
    expect(safeInternalPath("")).toBe("/");
    expect(safeInternalPath("/login")).toBe("/");
    expect(safeInternalPath("/login?next=/admin")).toBe("/");
  });

  it("uses and clears a stored redirect target after full-page auth", () => {
    const storage = memoryStorage();
    rememberReturnPath(storage, "/courses/elbow-mri/cases");

    expect(consumeReturnPath(storage, "/")).toBe("/courses/elbow-mri/cases");
    expect(storage.getItem(LOGIN_RETURN_TO_KEY)).toBeNull();
  });

  it("falls back to the router state path when stored state is missing or unsafe", () => {
    const storage = memoryStorage();
    expect(consumeReturnPath(storage, "/courses/shoulder-mri")).toBe("/courses/shoulder-mri");

    rememberReturnPath(storage, "//example.com");
    expect(consumeReturnPath(storage, "/courses/knee-mri")).toBe("/courses/knee-mri");
  });
});
