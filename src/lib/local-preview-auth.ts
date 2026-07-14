import type { User } from "firebase/auth";

export const LOCAL_PREVIEW_AUTH_KEY = "localPreviewAuth";
export const LOCAL_PREVIEW_ROLE_KEY = "localPreviewRole";
export const LOCAL_PREVIEW_UID = "local-preview-user";
export const APP_REVIEW_DEMO_AUTH_KEY = "appReviewDemoAuth";
export const APP_REVIEW_DEMO_UID = "app-review-demo-user";
export const APP_REVIEW_DEMO_PARAM = "reviewerDemo";

type ReadableStorage = Pick<Storage, "getItem">;
type WritableStorage = Pick<Storage, "removeItem" | "setItem">;

export function isLocalPreviewHost(href: string): boolean {
  try {
    const url = new URL(href);
    return url.hostname === "localhost" || url.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

export function hasLocalPreviewAuth(storage: ReadableStorage): boolean {
  return storage.getItem(LOCAL_PREVIEW_AUTH_KEY) === "1";
}

export function enableLocalPreviewAuth(storage: WritableStorage) {
  storage.setItem(LOCAL_PREVIEW_AUTH_KEY, "1");
}

export function disableLocalPreviewAuth(storage: WritableStorage) {
  storage.removeItem(LOCAL_PREVIEW_AUTH_KEY);
}

export function isAppReviewDemoRequested(href: string): boolean {
  try {
    const url = new URL(href);
    const value = url.searchParams.get(APP_REVIEW_DEMO_PARAM)?.toLowerCase();
    if (value === "1" || value === "true") return true;

    const returnTo = url.searchParams.get("returnTo");
    if (!returnTo || !returnTo.startsWith("/")) return false;
    const nested = new URL(returnTo, url.origin);
    const nestedValue = nested.searchParams.get(APP_REVIEW_DEMO_PARAM)?.toLowerCase();
    return nestedValue === "1" || nestedValue === "true";
  } catch {
    return false;
  }
}

export function hasAppReviewDemoAuth(storage: ReadableStorage): boolean {
  return storage.getItem(APP_REVIEW_DEMO_AUTH_KEY) === "1";
}

export function enableAppReviewDemoAuth(storage: WritableStorage) {
  storage.setItem(APP_REVIEW_DEMO_AUTH_KEY, "1");
}

export function disableAppReviewDemoAuth(storage: WritableStorage) {
  storage.removeItem(APP_REVIEW_DEMO_AUTH_KEY);
}

export function canEnableAppReviewDemo(href: string, storage: ReadableStorage): boolean {
  return isAppReviewDemoRequested(href) || hasAppReviewDemoAuth(storage);
}

export function isLocalPreviewSession(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      isLocalPreviewHost(window.location.href) &&
      hasLocalPreviewAuth(sessionStorage)
    );
  } catch {
    return false;
  }
}

export function isAppReviewDemoSession(): boolean {
  try {
    return typeof window !== "undefined" && hasAppReviewDemoAuth(sessionStorage);
  } catch {
    return false;
  }
}

export function isPreviewAuthSession(): boolean {
  return isLocalPreviewSession() || isAppReviewDemoSession();
}

export function activePreviewRole(): "admin" | "fellow" | "resident" {
  if (!isLocalPreviewSession()) return "fellow";
  try {
    const stored = sessionStorage.getItem(LOCAL_PREVIEW_ROLE_KEY);
    return stored === "admin" || stored === "resident" ? stored : "fellow";
  } catch {
    return "fellow";
  }
}

function createPreviewUser(uid: string, email: string, displayName: string, providerId: string): User {
  return {
    uid,
    email,
    displayName,
    photoURL: null,
    phoneNumber: null,
    providerId,
    emailVerified: true,
    isAnonymous: false,
    tenantId: null,
    metadata: {},
    providerData: [],
    delete: async () => {},
    getIdToken: async () => "local-preview-token",
    getIdTokenResult: async () =>
      ({
        authTime: "",
        claims: {},
        expirationTime: "",
        issuedAtTime: "",
        signInProvider: providerId,
        signInSecondFactor: null,
        token: `${providerId}-token`,
      }) as Awaited<ReturnType<User["getIdTokenResult"]>>,
    reload: async () => {},
    toJSON: () => ({
      uid,
      email,
      displayName,
    }),
  } as unknown as User;
}

export function createLocalPreviewUser(): User {
  return createPreviewUser(
    LOCAL_PREVIEW_UID,
    "local-preview@localhost",
    "Local Preview",
    "local-preview",
  );
}

export function createAppReviewDemoUser(): User {
  return createPreviewUser(
    APP_REVIEW_DEMO_UID,
    "app-review-demo@uclasportsmri.local",
    "App Review Demo",
    "app-review-demo",
  );
}

export function createActivePreviewUser(): User {
  return isAppReviewDemoSession() ? createAppReviewDemoUser() : createLocalPreviewUser();
}
