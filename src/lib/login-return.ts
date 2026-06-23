export const LOGIN_RETURN_TO_KEY = "loginReturnTo";

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

export function rememberReturnPath(storage: ReturnPathStorage, path: string) {
  storage.setItem(LOGIN_RETURN_TO_KEY, safeInternalPath(path));
}

export function consumeReturnPath(storage: ReturnPathStorage, fallback: string) {
  const stored = safeInternalPath(storage.getItem(LOGIN_RETURN_TO_KEY));
  storage.removeItem(LOGIN_RETURN_TO_KEY);
  return stored === "/" ? safeInternalPath(fallback) : stored;
}
