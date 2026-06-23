export interface NormalSeriesOption<TId extends string = string> {
  id: TId;
  label: string;
}

interface NormalSeriesSelectorProps<TId extends string> {
  series: NormalSeriesOption<TId>[];
  activeId: TId;
  onSeriesChange: (id: TId) => void;
  comingSoon?: string[];
  label?: string;
}

export default function NormalSeriesSelector<TId extends string>({
  series,
  activeId,
  onSeriesChange,
  comingSoon = [],
  label = "MRI series",
}: NormalSeriesSelectorProps<TId>) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      {series.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSeriesChange(item.id)}
            aria-pressed={active}
            className={`min-h-9 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "border-ucla-blue bg-ucla-blue text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {item.label}
          </button>
        );
      })}
      {comingSoon.map((item) => (
        <span
          key={item}
          aria-disabled="true"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-dashed border-gray-300 bg-gray-50 px-3.5 py-1.5 text-sm font-medium text-gray-500"
          title="Coming soon"
        >
          {item}
          <span className="rounded-full bg-gray-200 px-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            soon
          </span>
        </span>
      ))}
    </div>
  );
}
