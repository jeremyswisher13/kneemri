import type { User } from "firebase/auth";

export const LOCAL_PREVIEW_AUTH_KEY = "localPreviewAuth";
export const LOCAL_PREVIEW_UID = "local-preview-user";

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

export function createLocalPreviewUser(): User {
  return {
    uid: LOCAL_PREVIEW_UID,
    email: "local-preview@localhost",
    displayName: "Local Preview",
    photoURL: null,
    phoneNumber: null,
    providerId: "local-preview",
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
        signInProvider: "local-preview",
        signInSecondFactor: null,
        token: "local-preview-token",
      }) as Awaited<ReturnType<User["getIdTokenResult"]>>,
    reload: async () => {},
    toJSON: () => ({
      uid: LOCAL_PREVIEW_UID,
      email: "local-preview@localhost",
      displayName: "Local Preview",
    }),
  } as unknown as User;
}
