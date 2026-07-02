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
  // hosts and the native iOS WKWebView shell (no window.open). Everything a real
  // browser renders — desktop, mobile Safari, AND installed standalone (home-screen)
  // PWAs — uses popup.
  //
  // Why popup for standalone PWAs too: on iOS, signInWithRedirect sends the user
  // out to Google + the firebaseapp.com auth handler, which on a home-screen PWA
  // breaks out into Safari — a SEPARATE storage context from the installed app —
  // so the credential never returns and the user is bounced back to /login. (In
  // plain mobile Safari the same web.app <-> firebaseapp.com hop is dropped by
  // tracking prevention.) signInWithPopup keeps the exchange in an in-app browser
  // tied to this origin, so the session lands where the app can see it. If a popup
  // is ever blocked, handleProviderSignIn falls back to redirect anyway.
  return (
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    isNativeIosAppShell(url.search, hints.userAgent)
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
