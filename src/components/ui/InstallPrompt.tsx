import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { installInstructionsForUserAgent, isStandaloneDisplayMode } from "@/lib/pwa";

const DISMISS_KEY = "uclaSportsMri.installPrompt.dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

interface InstallPromptProps {
  variant?: "full" | "header";
  className?: string;
}

function readDismissed() {
  try {
    return typeof localStorage === "undefined" ? false : localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export default function InstallPrompt({ variant = "full", className = "" }: InstallPromptProps) {
  const [dismissed, setDismissed] = useState(readDismissed);
  const [standalone] = useState(() => isStandaloneDisplayMode());
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const instructions = useMemo(() => {
    if (typeof navigator === "undefined") return "";
    return installInstructionsForUserAgent(navigator.userAgent, navigator.platform, navigator.maxTouchPoints);
  }, []);

  if (dismissed || standalone) return null;

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") dismiss();
    setDeferredPrompt(null);
  }

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Private browsing or strict storage settings should not break the prompt.
    }
    setDismissed(true);
    setDetailsOpen(false);
  }

  if (variant === "header") {
    const panelId = "install-prompt-details";
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          aria-expanded={detailsOpen}
          aria-controls={panelId}
          onClick={() => {
            if (deferredPrompt) {
              void install();
              return;
            }
            setDetailsOpen((open) => !open);
          }}
          className="inline-flex min-h-9 items-center rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-ucla-dark"
        >
          Install app
        </button>

        {detailsOpen && (
          <div
            id={panelId}
            className="absolute right-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-gray-200 bg-white p-3 text-left text-gray-700 shadow-lg"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-ucla-blue">Add to Home Screen</p>
            <p className="mt-1 text-sm text-gray-700">
              Save UCLA Sports MRI as a standalone app for faster access before clinic or conference.
            </p>
            <p className="mt-2 text-xs font-medium text-gray-500">{instructions}</p>
            <div className="mt-3 flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={dismiss}>
                Not now
              </Button>
              <Button size="sm" onClick={() => setDetailsOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <section className={`rounded-xl border border-ucla-blue/20 bg-ucla-light/50 p-4 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#003B5C]">Use this like an app</h2>
          <p className="mt-1 text-sm text-gray-600">
            Add UCLA Sports MRI to your home screen for faster access before conference or clinic.
          </p>
          <p className="mt-1 text-xs font-medium text-gray-500">{instructions}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {deferredPrompt && (
            <Button size="sm" onClick={install}>
              Install
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={dismiss}>
            Not now
          </Button>
        </div>
      </div>
    </section>
  );
}
