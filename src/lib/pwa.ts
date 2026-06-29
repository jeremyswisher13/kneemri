export interface RedirectSignInHints {
  standalone?: boolean;
  userAgent?: string;
  platform?: string;
  maxTouchPoints?: number;
}

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
  userAgentData?: { platform?: string };
};

export function isStandaloneDisplayMode(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as NavigatorWithStandalone;
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

export function browserRedirectSignInHints(): RedirectSignInHints {
  if (typeof window === "undefined") return {};
  const nav = navigator as NavigatorWithStandalone;
  return {
    standalone: isStandaloneDisplayMode(),
    userAgent: nav.userAgent,
    platform: nav.userAgentData?.platform || nav.platform,
    maxTouchPoints: nav.maxTouchPoints,
  };
}

export function isLikelyIosDevice(hints: RedirectSignInHints): boolean {
  const ua = (hints.userAgent || "").toLowerCase();
  const platform = (hints.platform || "").toLowerCase();
  return (
    /iphone|ipad|ipod/.test(ua) ||
    /iphone|ipad|ipod/.test(platform) ||
    (platform === "macintel" && (hints.maxTouchPoints ?? 0) > 1)
  );
}

export function installInstructionsForUserAgent(userAgent: string, platform = "", maxTouchPoints = 0) {
  const text = `${userAgent} ${platform}`.toLowerCase();
  if (
    /iphone|ipad|ipod/.test(text) ||
    (platform.toLowerCase() === "macintel" && maxTouchPoints > 1 && /mobile|safari/.test(text))
  ) {
    return "On iPhone or iPad: tap Share, then Add to Home Screen.";
  }
  if (/android/.test(text)) {
    return "On Android: open the browser menu, then tap Install app or Add to Home screen.";
  }
  return "Use your browser menu to install this app or add it to your home screen.";
}

export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  const meta = import.meta as ImportMeta & { env?: { PROD?: boolean } };
  if (meta.env && !meta.env.PROD) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        window.dispatchEvent(
          new CustomEvent("ucla-pwa-ready", {
            detail: { active: !!registration.active },
          }),
        );
      })
      .catch(() => {
        window.dispatchEvent(new Event("ucla-pwa-unavailable"));
      });
  });
}
