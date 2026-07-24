import { useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function UnsavedNavigationGuard({
  active,
  title = "Leave this assessment?",
  description = "Your answers have not been submitted and will be lost.",
}: {
  active: boolean;
  title?: string;
  description?: string;
}) {
  const blocker = useBlocker(active);
  const stayButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    stayButtonRef.current?.focus();
    const reset = blocker.reset;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") reset();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [blocker]);

  useEffect(() => {
    if (!active) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [active]);

  if (blocker.state !== "blocked") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="unsaved-navigation-title"
        aria-describedby="unsaved-navigation-description"
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
      >
        <h2 id="unsaved-navigation-title" className="text-lg font-semibold text-gray-900">
          {title}
        </h2>
        <p id="unsaved-navigation-description" className="mt-2 text-sm text-gray-600">
          {description}
        </p>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            ref={stayButtonRef}
            variant="secondary"
            className="min-h-11 w-full sm:w-auto"
            onClick={() => blocker.reset()}
          >
            Stay here
          </Button>
          <Button
            className="min-h-11 w-full sm:w-auto"
            onClick={() => blocker.proceed()}
          >
            Leave and discard
          </Button>
        </div>
      </div>
    </div>
  );
}
