import { useEffect, useRef } from "react";

export interface NormalModeOption<TMode extends string = string> {
  id: TMode;
  label: string;
}

interface NormalModeSwitcherProps<TMode extends string> {
  modes: NormalModeOption<TMode>[];
  activeMode: TMode;
  onModeChange: (mode: TMode) => void;
  label?: string;
}

export default function NormalModeSwitcher<TMode extends string>({
  modes,
  activeMode,
  onModeChange,
  label = "Normal MRI modes",
}: NormalModeSwitcherProps<TMode>) {
  const activeButtonRef = useRef<HTMLButtonElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const activeButton = activeButtonRef.current;
    const scroller = scrollerRef.current;
    if (!activeButton || !scroller) return undefined;

    activeButton.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "auto",
    });

    const frame = window.requestAnimationFrame(() => {
      if (window.matchMedia("(min-width: 640px)").matches) return;
      const scrollerRect = scroller.getBoundingClientRect();
      const buttons = Array.from(scroller.querySelectorAll("button"));
      const clippedLeftIndex = buttons.findIndex((button) => {
        const rect = button.getBoundingClientRect();
        return rect.left < scrollerRect.left && rect.right > scrollerRect.left;
      });
      const nextButton = clippedLeftIndex >= 0 ? buttons[clippedLeftIndex + 1] : null;
      if (!nextButton) return;

      const nextRect = nextButton.getBoundingClientRect();
      const activeRect = activeButton.getBoundingClientRect();
      const delta = nextRect.left - scrollerRect.left - 4;
      const activeWouldStayVisible =
        activeRect.left - delta >= scrollerRect.left &&
        activeRect.right - delta <= scrollerRect.right;
      if (delta > 0 && activeWouldStayVisible) {
        scroller.scrollLeft += delta;
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeMode, modes.length]);

  return (
    <div
      ref={scrollerRef}
      // Mobile: a single horizontally-scrollable row (flex-nowrap + overflow-x)
      // so 7+ modes don't wrap into a 4-row wall of buttons above the content.
      // The active tab is scrolled fully into view on direct links.
      // Desktop (sm+): the familiar inline segmented control that wraps normally.
      className="mt-4 flex w-full max-w-full flex-nowrap gap-1 overflow-x-auto rounded-lg border border-gray-200 bg-white p-1 [scrollbar-width:none] sm:inline-flex sm:w-auto sm:flex-wrap sm:gap-0 sm:p-0.5 [&::-webkit-scrollbar]:hidden"
      role="group"
      aria-label={label}
    >
      {modes.map((mode) => {
        const active = mode.id === activeMode;
        return (
          <button
            key={mode.id}
            ref={active ? activeButtonRef : undefined}
            type="button"
            onClick={() => onModeChange(mode.id)}
            aria-pressed={active}
            className={`min-h-11 shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium leading-tight transition-colors sm:min-h-9 sm:flex-none sm:py-1.5 ${
              active ? "bg-ucla-blue text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
