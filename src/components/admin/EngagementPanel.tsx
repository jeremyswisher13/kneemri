import { useMemo } from "react";
import type { CourseDefinition } from "@/content/courses";
import {
  daysSince,
  fellowName,
  fellowStatus,
  lastSeen,
  totalCasesForRole,
  INACTIVE_THRESHOLD_DAYS,
  STATUS_COLORS,
  type Fellow,
  type FellowStatus,
} from "@/components/admin/shared";

interface EngagementPanelProps {
  fellows: Fellow[];
  course: CourseDefinition;
  totalModules: number;
  postQuizTotal: number;
}

interface StaleLearner {
  id: string;
  name: string;
  status: FellowStatus;
  days: number | null;
}

const STALE_SENTINEL = 1_000_000;

function staleness(days: number | null): number {
  return days === null ? STALE_SENTINEL : days;
}

function daysLabel(days: number | null): string {
  if (days === null) return "never seen";
  if (days === 1) return "1 day";
  return `${days} days`;
}

export default function EngagementPanel({ fellows, course, totalModules, postQuizTotal }: EngagementPanelProps) {
  const { buckets, stale } = useMemo(() => {
    let active7 = 0;
    let d8to14 = 0;
    let d15to30 = 0;
    let d31plus = 0;
    const staleList: StaleLearner[] = [];

    for (const f of fellows) {
      const days = daysSince(lastSeen(f));
      if (days !== null && days <= 7) active7++;
      else if (days !== null && days < INACTIVE_THRESHOLD_DAYS) d8to14++;
      else if (days !== null && days <= 30) d15to30++;
      else d31plus++;

      const status = fellowStatus(f, totalModules, totalCasesForRole(course, f.role), course, postQuizTotal);
      if (status !== "Complete" && (days === null || days >= INACTIVE_THRESHOLD_DAYS)) {
        staleList.push({ id: f.id, name: fellowName(f), status, days });
      }
    }

    staleList.sort((a, b) => staleness(b.days) - staleness(a.days));

    return {
      buckets: [
        { label: "Active ≤ 7 days", count: active7, color: "#16a34a" },
        { label: "8–13 days", count: d8to14, color: "#2774AE" },
        { label: "14–30 days", count: d15to30, color: "#d97706" },
        { label: "31+ days / never", count: d31plus, color: "#dc2626" },
      ],
      stale: staleList,
    };
  }, [fellows, course, totalModules, postQuizTotal]);

  const shown = stale.slice(0, 10);
  const overflow = stale.length - shown.length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Engagement</h2>
        <p className="text-sm text-gray-500">Who has drifted away mid-course</p>
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        All learners by last activity
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {buckets.map((b) => (
          <div key={b.label} className="rounded-lg border border-gray-200 bg-white p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: b.color }}>
              {b.count}
            </p>
            <p className="mt-1 text-[11px] leading-tight text-gray-500">{b.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        {stale.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            No one has drifted — every unfinished learner has been active in the last two weeks.
          </p>
        ) : (
          <div className="space-y-1.5">
            {shown.map((s) => (
              <div key={s.id} className="flex items-center gap-2 text-sm">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[s.status] }}
                />
                <span className="font-medium text-gray-900">{s.name}</span>
                <span className="text-gray-300">&mdash;</span>
                <span className="text-gray-500">{s.status}</span>
                <span className="text-gray-300">&mdash;</span>
                <span
                  className="font-semibold"
                  style={{ color: s.days === null || s.days >= 31 ? "#dc2626" : "#d97706" }}
                >
                  {daysLabel(s.days)}
                </span>
              </div>
            ))}
            {overflow > 0 && <p className="pt-1 text-xs text-gray-500">+{overflow} more</p>}
          </div>
        )}
      </div>
    </div>
  );
}
