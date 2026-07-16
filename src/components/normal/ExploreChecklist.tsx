import { useState } from "react";
import Card from "@/components/ui/Card";

/**
 * The Explore-mode "What to identify" list, made active: the learner taps each
 * structure as they find it on the stack, with a found-counter for a small sense
 * of progress. Resets when the plane changes. Session-only (no persistence).
 */
export default function ExploreChecklist({ plane, items }: { plane: string; items: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  // Reset when the plane (item set) changes — adjusted during render (not in an
  // effect) per the codebase's set-state-in-effect rule.
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setChecked(new Set());
  }

  const toggle = (i: number) =>
    setChecked((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  const found = checked.size;
  const allFound = found === items.length && items.length > 0;

  return (
    <Card>
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900">What to identify</h2>
        <span className={`text-xs font-semibold ${allFound ? "text-green-600" : "text-gray-500"}`}>
          {found}/{items.length} found
        </span>
      </div>
      <p className="mt-0.5 text-xs text-gray-500">{plane}</p>
      <ul className="mt-3 space-y-1">
        {items.map((item, i) => {
          const on = checked.has(i);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={on}
                className="flex min-h-11 w-full items-start gap-2 rounded-md px-1.5 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 sm:min-h-0 sm:py-1"
              >
                <span
                  className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border transition-colors ${
                    on ? "border-ucla-blue bg-ucla-blue text-white" : "border-gray-300 bg-white"
                  }`}
                >
                  {on && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className={on ? "text-gray-500 line-through" : "text-gray-700"}>{item}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
        Tap each as you find it. Then <strong>Guided Tour</strong> for a labeled walkthrough, or{" "}
        <strong>Practice &amp; Mastery</strong> to test yourself.
      </p>
    </Card>
  );
}
