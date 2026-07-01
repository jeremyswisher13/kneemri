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
  return (
    <div
      className="mt-4 flex w-full max-w-full flex-wrap rounded-lg border border-gray-200 bg-white p-0.5 sm:inline-flex sm:w-auto"
      role="group"
      aria-label={label}
    >
      {modes.map((mode) => {
        const active = mode.id === activeMode;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onModeChange(mode.id)}
            aria-pressed={active}
            className={`min-h-11 flex-1 basis-[8.5rem] rounded-md px-3 py-2 text-sm font-medium leading-tight transition-colors sm:min-h-9 sm:flex-none sm:basis-auto sm:py-1.5 ${
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
