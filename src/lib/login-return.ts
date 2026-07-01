import { isNativeIosAppShell, type RedirectSignInHints } from "@/lib/pwa";

export const LOGIN_RETURN_TO_KEY = "loginReturnTo";
export const LOGIN_RETURN_TO_PARAM = "returnTo";

export type LoginLocationState = {
  from?: {
    pathname?: string;
    search?: string;
    hash?: string;
  };
};

type ReturnPathStorage = Pick<Storage, "getItem" | "removeItem" | "setItem">;

export function safeInternalPath(path: string | null | undefined): string {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/login")) {
    return "/";
  }
  return path;
}

export function returnPathFromState(state: unknown): string {
  const from = (state as LoginLocationState | null)?.from;
  if (!from?.pathname) return "/";
  return safeInternalPath(`${from.pathname}${from.search ?? ""}${from.hash ?? ""}`);
}

export function returnPathFromSearch(search: string): string {
  const params = new URLSearchParams(search);
  return safeInternalPath(params.get(LOGIN_RETURN_TO_PARAM));
}

export function returnPathFromLocation(state: unknown, search: string): string {
  const fromState = returnPathFromState(state);
  return fromState === "/" ? returnPathFromSearch(search) : fromState;
}

export function loginPathForReturnTo(path: string): string {
  const safeReturnTo = safeInternalPath(path);
  if (safeReturnTo === "/") return "/login";
  return `/login?${LOGIN_RETURN_TO_PARAM}=${encodeURIComponent(safeReturnTo)}`;
}

export function localLoginUrlForLocalAuthHost(href: string, returnTo: string): string | null {
  const url = new URL(href);
  if (url.hostname !== "127.0.0.1") return null;

  url.hostname = "localhost";
  url.pathname = "/login";
  url.search = "";
  url.hash = "";

  const safeReturnTo = safeInternalPath(returnTo);
  if (safeReturnTo !== "/") {
    url.searchParams.set(LOGIN_RETURN_TO_PARAM, safeReturnTo);
  }
  return url.toString();
}

export function shouldUseRedirectSignIn(href: string, hints: RedirectSignInHints = {}): boolean {
  const url = new URL(href);
  // Use redirect sign-in ONLY where popup sign-in genuinely can't work: local dev
  // hosts, the native iOS WKWebView shell (no window.open), and installed
  // standalone PWAs (a popup would escape the app window).
  //
  // Plain mobile Safari deliberately uses popup instead. signInWithRedirect drops
  // the session on iOS Safari here: the app is served from ucla-knee-mri.web.app
  // while Firebase's auth handler lives on ucla-knee-mri.firebaseapp.com, and
  // Safari's tracking prevention blocks that cross-domain hand-off — so the user
  // returns unauthenticated and gets bounced back to /login. Popup keeps the
  // credential exchange in the app's own origin, avoiding the problem.
  return (
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    isNativeIosAppShell(url.search, hints.userAgent) ||
    hints.standalone === true
  );
}

export function rememberReturnPath(storage: ReturnPathStorage, path: string) {
  storage.setItem(LOGIN_RETURN_TO_KEY, safeInternalPath(path));
}

export function consumeReturnPath(storage: ReturnPathStorage, fallback: string) {
  const stored = safeInternalPath(storage.getItem(LOGIN_RETURN_TO_KEY));
  storage.removeItem(LOGIN_RETURN_TO_KEY);
  return stored === "/" ? safeInternalPath(fallback) : stored;
}
