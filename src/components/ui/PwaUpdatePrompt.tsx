import { useEffect, useState } from "react";
import { activateWaitingServiceWorker } from "@/lib/pwa";

export default function PwaUpdatePrompt() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const onUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ registration?: ServiceWorkerRegistration }>).detail;
      if (detail?.registration) setRegistration(detail.registration);
    };
    window.addEventListener("ucla-pwa-update", onUpdate);
    return () => window.removeEventListener("ucla-pwa-update", onUpdate);
  }, []);

  if (!registration) return null;

  return (
    <div
      role="status"
      data-testid="pwa-update-prompt"
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[70] mx-auto flex max-w-md items-center gap-3 rounded-lg border border-ucla-blue/30 bg-white px-4 py-3 shadow-xl"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900">App update ready</p>
        <p className="mt-0.5 text-xs text-gray-500">Refresh once to use the latest course and fixes.</p>
      </div>
      <button
        type="button"
        disabled={updating}
        onClick={() => {
          setUpdating(true);
          // If `waiting` is already gone, another client accepted the update and
          // the new worker is active + claimed us — so this client is running a
          // stale shell and a plain reload is exactly what it needs. Previously
          // this just flipped `updating` back off, leaving a live-looking but
          // permanently inert button on an undismissable card.
          if (!activateWaitingServiceWorker(registration)) window.location.reload();
        }}
        className="min-h-11 shrink-0 rounded-lg bg-ucla-blue px-3 py-2 text-sm font-semibold text-white hover:bg-ucla-dark disabled:opacity-60"
      >
        {updating ? "Updating..." : "Update now"}
      </button>
    </div>
  );
}

