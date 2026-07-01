import { describe, expect, it } from "vitest";
import {
  LOGIN_RETURN_TO_KEY,
  localLoginUrlForLocalAuthHost,
  consumeReturnPath,
  loginPathForReturnTo,
  rememberReturnPath,
  returnPathFromLocation,
  returnPathFromSearch,
  returnPathFromState,
  safeInternalPath,
  shouldUseRedirectSignIn,
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

  it("reads a safe return target from the login query string", () => {
    expect(returnPathFromSearch("?returnTo=%2Fnormal-knee-mri%3Fslice%3D4%23acl")).toBe(
      "/normal-knee-mri?slice=4#acl",
    );
    expect(returnPathFromSearch("?returnTo=https%3A%2F%2Fexample.com")).toBe("/");
  });

  it("prefers router state over a return target query parameter", () => {
    expect(
      returnPathFromLocation(
        { from: { pathname: "/normal-shoulder-mri", search: "?tour=guided" } },
        "?returnTo=%2Fnormal-knee-mri",
      ),
    ).toBe("/normal-shoulder-mri?tour=guided");
  });

  it("rejects external, protocol-relative, empty, and login paths", () => {
    expect(safeInternalPath("https://example.com/courses/hip-mri")).toBe("/");
    expect(safeInternalPath("//example.com/courses/hip-mri")).toBe("/");
    expect(safeInternalPath("")).toBe("/");
    expect(safeInternalPath("/login")).toBe("/");
    expect(safeInternalPath("/login?next=/admin")).toBe("/");
  });

  it("builds login URLs with durable return targets for full-page reloads", () => {
    expect(loginPathForReturnTo("/courses/elbow-mri/normal-elbow-mri?mode=tour#ucl")).toBe(
      "/login?returnTo=%2Fcourses%2Felbow-mri%2Fnormal-elbow-mri%3Fmode%3Dtour%23ucl",
    );
    expect(loginPathForReturnTo("/login?returnTo=/admin")).toBe("/login");
    expect(loginPathForReturnTo("https://example.com")).toBe("/login");
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

  it("canonicalizes local 127 login URLs to localhost while preserving the intended route", () => {
    expect(
      localLoginUrlForLocalAuthHost(
        "http://127.0.0.1:4174/login",
        "/normal-elbow-mri?panel=tour#ulnar-collateral-ligament",
      ),
    ).toBe(
      "http://localhost:4174/login?returnTo=%2Fnormal-elbow-mri%3Fpanel%3Dtour%23ulnar-collateral-ligament",
    );
  });

  it("leaves production and localhost login URLs alone", () => {
    expect(localLoginUrlForLocalAuthHost("https://ucla-knee-mri.firebaseapp.com/login", "/")).toBeNull();
    expect(localLoginUrlForLocalAuthHost("http://localhost:4174/login", "/")).toBeNull();
  });

  it("uses full-page redirect sign-in on local preview hosts", () => {
    expect(shouldUseRedirectSignIn("http://localhost:4174/login")).toBe(true);
    expect(shouldUseRedirectSignIn("http://127.0.0.1:4174/login")).toBe(true);
    expect(shouldUseRedirectSignIn("https://ucla-knee-mri.firebaseapp.com/login")).toBe(false);
    expect(shouldUseRedirectSignIn("https://ucla-knee-mri.firebaseapp.com/login", { standalone: true })).toBe(
      true,
    );
    expect(
      shouldUseRedirectSignIn("https://ucla-knee-mri.firebaseapp.com/login", {
        platform: "iPhone",
        userAgent: "Mozilla/5.0",
      }),
    ).toBe(true);
  });

  it("uses full-page redirect sign-in in the native iOS shell", () => {
    expect(
      shouldUseRedirectSignIn("https://ucla-knee-mri.firebaseapp.com/login?source=ios-app"),
    ).toBe(true);
    expect(
      shouldUseRedirectSignIn("https://ucla-knee-mri.firebaseapp.com/login", {
        userAgent: "Mozilla/5.0 UCLASportsMRIiOS",
      }),
    ).toBe(true);
  });
});
