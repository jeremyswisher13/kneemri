import { useEffect, useState } from "react";

interface PageLoaderProps {
  label?: string;
  fullHeight?: boolean;
}

/**
 * Fallback shown while auth, progress, or a lazily-loaded route chunk resolves.
 */
export default function PageLoader({ label, fullHeight = false }: PageLoaderProps) {
  const [slow, setSlow] = useState(false);
  const resolvedLabel = label ?? "Opening this page...";

  useEffect(() => {
    const id = window.setTimeout(() => setSlow(true), 3500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      className={`flex items-center justify-center px-4 ${fullHeight ? "min-h-[60vh] py-8" : "py-16"}`}
      role="status"
      aria-label={resolvedLabel}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-sm text-center">
        <img
          src="/pwa-icon-192.png"
          alt=""
          aria-hidden="true"
          className="mx-auto h-12 w-12 rounded-xl shadow-sm ring-1 ring-black/5"
        />
        <p className="mt-4 text-sm font-semibold text-gray-800">{resolvedLabel}</p>
        <div
          className="mx-auto mt-4 h-1.5 max-w-60 overflow-hidden rounded-full bg-gray-200"
          aria-hidden="true"
        >
          <div className="page-loader-indicator h-full w-2/5 rounded-full bg-ucla-blue" />
        </div>

        {slow && (
          <div
            role="alert"
            className="mt-6 border-t border-gray-200 pt-4 text-sm text-gray-600"
          >
            <p className="font-semibold text-gray-800">Taking longer than expected</p>
            <p className="mt-1 text-xs leading-5">
              Check your connection, then try loading this screen again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 min-h-11 rounded-lg bg-ucla-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ucla-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ucla-blue focus-visible:ring-offset-2 sm:min-h-9"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
