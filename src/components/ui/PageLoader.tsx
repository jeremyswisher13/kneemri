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

  useEffect(() => {
    const id = window.setTimeout(() => setSlow(true), 3500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${fullHeight ? "min-h-[60vh]" : "py-20"}`}
      role="status"
      aria-label={label ?? "Loading"}
      aria-live="polite"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-ucla-blue" />
      {label && <p className="text-sm font-medium text-gray-500">{label}</p>}
      {slow && (
        <p className="max-w-xs text-center text-xs text-gray-500">
          Still loading. On slower hospital Wi-Fi, MRI stacks and route chunks can take a moment.
        </p>
      )}
    </div>
  );
}
