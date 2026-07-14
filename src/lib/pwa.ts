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

export function isNativeIosAppShell(search?: string, userAgent?: string): boolean {
  const rawSearch =
    search ?? (typeof window === "undefined" ? "" : window.location.search);
  const ua =
    userAgent ?? (typeof navigator === "undefined" ? "" : navigator.userAgent);
  const source = new URLSearchParams(rawSearch).get("source")?.toLowerCase();
  return source === "ios-app" || /\bUCLASportsMRIiOS\b/i.test(ua);
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

function clearNativeIosShellServiceWorkerState() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch(() => {});
  }

  if ("caches" in window) {
    window.caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => window.caches.delete(key))))
      .catch(() => {});
  }
}

export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (isNativeIosAppShell(window.location.search, navigator.userAgent)) {
    clearNativeIosShellServiceWorkerState();
    return;
  }
  if (!("serviceWorker" in navigator)) return;
  const meta = import.meta as ImportMeta & { env?: { PROD?: boolean } };
  if (meta.env && !meta.env.PROD) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        const announceUpdate = () => {
          if (!registration.waiting || !navigator.serviceWorker.controller) return;
          window.dispatchEvent(
            new CustomEvent("ucla-pwa-update", { detail: { registration } }),
          );
        };

        announceUpdate();
        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          installing?.addEventListener("statechange", () => {
            if (installing.state === "installed") announceUpdate();
          });
        });

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

let reloadForAcceptedUpdate = false;

export function activateWaitingServiceWorker(registration: ServiceWorkerRegistration): boolean {
  if (!registration.waiting) return false;
  reloadForAcceptedUpdate = true;
  registration.waiting.postMessage({ type: "SKIP_WAITING" });
  return true;
}

export function installAcceptedUpdateReload() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!reloadForAcceptedUpdate) return;
    reloadForAcceptedUpdate = false;
    window.location.reload();
  });
}
