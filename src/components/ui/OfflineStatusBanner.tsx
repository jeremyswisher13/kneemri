import { useEffect, useRef, useState } from "react";

export default function OfflineStatusBanner() {
  const [online, setOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [showReady, setShowReady] = useState(false);
  const readyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    const onReady = () => {
      if (readyTimeoutRef.current !== null) window.clearTimeout(readyTimeoutRef.current);
      setShowReady(true);
      readyTimeoutRef.current = window.setTimeout(() => setShowReady(false), 4500);
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("ucla-pwa-ready", onReady);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("ucla-pwa-ready", onReady);
      if (readyTimeoutRef.current !== null) window.clearTimeout(readyTimeoutRef.current);
    };
  }, []);

  if (online && !showReady) return null;

  return (
    <div
      className={`border-b px-4 py-2 text-center text-xs font-medium ${
        online
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-amber-200 bg-amber-50 text-amber-800"
      }`}
      role="status"
      aria-live="polite"
    >
      {online
        ? "App shell ready for home-screen use."
        : "Offline mode: previously opened pages and cached MRI images remain available."}
    </div>
  );
}
