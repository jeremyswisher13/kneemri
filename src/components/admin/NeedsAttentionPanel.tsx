import { useMemo } from "react";
import {
  fellowStatus,
  fellowName,
  totalCasesForRole,
  pct,
  daysSince,
  lastSeen,
  INACTIVE_THRESHOLD_DAYS,
  STATUS_COLORS,
  type Fellow,
} from "@/components/admin/shared";
import type { CourseDefinition } from "@/content/courses";

interface NeedsAttentionPanelProps {
  fellows: Fellow[];
  course: CourseDefinition;
  totalModules: number;
  postQuizTotal: number;
  /** Jump to a learner's expanded row in the Learners tab. */
  onSelectLearner?: (id: string) => void;
}

interface AttentionEntry {
  id: string;
  name: string;
  detail?: string;
}

interface AttentionGroup {
  key: string;
  heading: string;
  color: string;
  note?: string;
  entries: AttentionEntry[];
}

const NAME_CAP = 6;

export default function NeedsAttentionPanel({
  fellows,
  course,
  totalModules,
  postQuizTotal,
  onSelectLearner,
}: NeedsAttentionPanelProps) {
  const isKnee = course.bodyRegion === "knee";

  const groups = useMemo<AttentionGroup[]>(() => {
    const readyForCert: AttentionEntry[] = [];
    const belowBar: AttentionEntry[] = [];
    const inactive: AttentionEntry[] = [];
    const neverStarted: AttentionEntry[] = [];

    for (const f of fellows) {
      const status = fellowStatus(
        f,
        totalModules,
        totalCasesForRole(course, f.role),
        isKnee,
        postQuizTotal,
      );
      const name = fellowName(f);

      if (status === "Complete" && !f.certificateSent) {
        readyForCert.push({ id: f.id, name });
      }

      if (status === "Below 70%") {
        const postPct =
          f.postQuizScore !== null
            ? pct(f.postQuizScore, f.postQuizTotal ?? postQuizTotal)
            : null;
        belowBar.push({ id: f.id, name, detail: postPct !== null ? `${postPct}%` : "—" });
      }

      if (status === "In Progress") {
        const days = daysSince(lastSeen(f));
        if (days !== null && days >= INACTIVE_THRESHOLD_DAYS) {
          inactive.push({ id: f.id, name, detail: `${days} days` });
        }
      }

      if (status === "Not Started") {
        neverStarted.push({ id: f.id, name });
      }
    }

    const built: AttentionGroup[] = [
      {
        key: "ready",
        heading: "Ready for certificate",
        color: STATUS_COLORS.Complete,
        note: "Send from the Learners table.",
        entries: readyForCert,
      },
      {
        key: "below",
        heading: "Below the 70% bar",
        color: STATUS_COLORS["Below 70%"],
        note: "Arrange a retake.",
        entries: belowBar,
      },
      {
        key: "inactive",
        heading: `Inactive ${INACTIVE_THRESHOLD_DAYS}+ days`,
        color: STATUS_COLORS["In Progress"],
        entries: inactive,
      },
      {
        key: "never",
        heading: "Never started",
        color: STATUS_COLORS["Not Started"],
        entries: neverStarted,
      },
    ];

    return built.filter((g) => g.entries.length > 0);
  }, [fellows, course, totalModules, postQuizTotal, isKnee]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Needs Attention</h2>
        <p className="text-sm text-gray-500">Learners and actions worth a look right now</p>
      </div>

      {groups.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-500">
          Nothing needs your attention right now &#10003;
        </p>
      ) : (
        <div className="space-y-5">
          {groups.map((group) => {
            const overflow = group.entries.length - NAME_CAP;
            const shown = group.entries.slice(0, NAME_CAP);
            return (
              <div key={group.key}>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-semibold" style={{ color: group.color }}>
                    {group.heading}
                  </h3>
                  <span className="text-xs font-medium text-gray-500">{group.entries.length}</span>
                  {group.note && <span className="text-xs text-gray-500">· {group.note}</span>}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {shown.map((entry) => {
                    const base =
                      "inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs text-gray-700";
                    const inner = (
                      <>
                        {entry.name}
                        {entry.detail && (
                          <span className="font-semibold" style={{ color: group.color }}>
                            {entry.detail}
                          </span>
                        )}
                      </>
                    );
                    return onSelectLearner ? (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => onSelectLearner(entry.id)}
                        title={`View ${entry.name}`}
                        className={`${base} transition-colors hover:border-ucla-blue hover:bg-blue-50 hover:text-ucla-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-ucla-blue`}
                      >
                        {inner}
                      </button>
                    ) : (
                      <span key={entry.id} className={base}>
                        {inner}
                      </span>
                    );
                  })}
                  {overflow > 0 && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-500">
                      +{overflow} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
