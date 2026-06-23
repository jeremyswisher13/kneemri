import { useMemo } from "react";
import {
  fellowStatus,
  totalCasesForRole,
  STATUS_COLORS,
  type Fellow,
  type FellowStatus,
} from "@/components/admin/shared";
import type { CourseDefinition } from "@/content/courses";

interface StatusFunnelProps {
  fellows: Fellow[];
  course: CourseDefinition;
  totalModules: number;
  postQuizTotal: number;
  active: FellowStatus | null;
  onSelect: (s: FellowStatus | null) => void;
}

const CARDS: { status: FellowStatus; label: string; subtitle?: string }[] = [
  { status: "Not Started", label: "Not Started" },
  { status: "In Progress", label: "In Progress" },
  { status: "Below 70%", label: "Below 70%", subtitle: "post-assessment under 70%" },
  { status: "Complete", label: "Complete" },
];

export default function StatusFunnel({
  fellows,
  course,
  totalModules,
  postQuizTotal,
  active,
  onSelect,
}: StatusFunnelProps) {
  const isKnee = course.bodyRegion === "knee";

  const counts = useMemo(() => {
    const tally: Record<FellowStatus, number> = {
      Complete: 0,
      "Below 70%": 0,
      "In Progress": 0,
      "Not Started": 0,
    };
    for (const f of fellows) {
      const status = fellowStatus(
        f,
        totalModules,
        totalCasesForRole(course, f.role),
        isKnee,
        postQuizTotal,
      );
      tally[status] += 1;
    }
    return tally;
  }, [fellows, course, totalModules, postQuizTotal, isKnee]);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CARDS.map(({ status, label, subtitle }) => {
        const color = STATUS_COLORS[status];
        const isActive = active === status;
        return (
          <button
            key={status}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(isActive ? null : status)}
            className={`rounded-xl border bg-white p-4 text-left shadow-sm transition-colors ${
              isActive
                ? "border-transparent ring-2"
                : "border-gray-200 hover:bg-gray-50"
            }`}
            style={
              isActive
                ? ({ borderLeft: `4px solid ${color}`, "--tw-ring-color": color } as React.CSSProperties)
                : { borderLeft: `4px solid ${color}` }
            }
          >
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-2xl font-bold" style={{ color }}>
                {counts[status]}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-gray-700 leading-tight">{label}</p>
            {subtitle && <p className="mt-0.5 text-[11px] text-gray-500 leading-tight">{subtitle}</p>}
          </button>
        );
      })}
    </div>
  );
}
