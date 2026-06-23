import Card from "@/components/ui/Card";
import type { CourseDefinition } from "@/content/courses";
import { defaultCourse } from "@/content/courses";
import type { UserProgress } from "@/types/progress";

type Timestamp = { seconds: number } | null | undefined;

interface TimelineEvent {
  /** ISO date string (yyyy-mm-dd) used as stable group key */
  dateKey: string;
  /** epoch seconds used for sorting */
  epoch: number;
  /** Formatted long date, e.g. "April 23, 2026" */
  dateLabel: string;
  /** Formatted time, e.g. "3:24 PM" */
  timeLabel: string;
  /** Kind of event — drives color/icon */
  kind: "pre-quiz" | "pre-survey" | "module" | "case" | "post-quiz" | "post-survey";
  /** Human-readable title */
  title: string;
  /** Optional subtitle (e.g. score "12/13", difficulty label, module subtitle) */
  subtitle?: string;
}

function toEvent(ts: Timestamp, kind: TimelineEvent["kind"], title: string, subtitle?: string): TimelineEvent | null {
  if (!ts) return null;
  const d = new Date(ts.seconds * 1000);
  if (isNaN(d.getTime())) return null;
  return {
    // Group by LOCAL calendar day (not UTC) so evening study sessions in
    // Pacific time aren't bucketed into the next UTC day or split across two —
    // keeps dateKey consistent with the locale-formatted dateLabel below.
    dateKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    epoch: ts.seconds,
    dateLabel: d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    timeLabel: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    kind,
    title,
    subtitle,
  };
}

const KIND_CONFIG: Record<TimelineEvent["kind"], { dot: string; ring: string; pill: string; label: string }> = {
  "pre-quiz":    { dot: "bg-amber-400",  ring: "ring-amber-100",  pill: "bg-amber-50 text-amber-700",   label: "Pre-Quiz" },
  "pre-survey":  { dot: "bg-amber-300",  ring: "ring-amber-100",  pill: "bg-amber-50 text-amber-700",   label: "Pre-Survey" },
  "module":      { dot: "bg-ucla-blue",  ring: "ring-blue-100",   pill: "bg-blue-50 text-ucla-blue",    label: "Module" },
  "case":        { dot: "bg-ucla-gold",  ring: "ring-yellow-100", pill: "bg-yellow-50 text-yellow-700", label: "Case" },
  "post-quiz":   { dot: "bg-green-500",  ring: "ring-green-100",  pill: "bg-green-50 text-green-700",   label: "Post-Quiz" },
  "post-survey": { dot: "bg-green-400",  ring: "ring-green-100",  pill: "bg-green-50 text-green-700",   label: "Post-Survey" },
};

interface CompletionTimelineProps {
  progress: UserProgress | null;
  course?: CourseDefinition;
}

export default function CompletionTimeline({ progress, course = defaultCourse }: CompletionTimelineProps) {
  const events: TimelineEvent[] = [];

  // Pre-assessment
  if (course.features.assessments) {
    const pre = toEvent(progress?.preQuizCompletedAt, "pre-quiz", "Pre-Assessment Quiz",
      progress?.preQuizScore != null && progress?.preQuizTotal != null
        ? `Scored ${progress.preQuizScore}/${progress.preQuizTotal}`
        : undefined);
    if (pre) events.push(pre);

    const preSurvey = toEvent(progress?.preSurveyCompletedAt, "pre-survey", "Pre-Assessment Confidence Survey", "Baseline confidence recorded");
    if (preSurvey) events.push(preSurvey);
  }

  // Modules
  for (const mp of progress?.moduleProgress ?? []) {
    if (!mp.completed || !mp.completedAt) continue;
    const meta = course.modules.find(m => m.id === mp.id);
    if (!meta) continue;
    const title = meta ? `Module ${meta.number}: ${meta.title}` : `Module: ${mp.id}`;
    const subtitle = mp.quizScore != null && mp.quizTotal != null ? `Quiz ${mp.quizScore}/${mp.quizTotal}` : undefined;
    const ev = toEvent(mp.completedAt, "module", title, subtitle);
    if (ev) events.push(ev);
  }

  // Cases
  for (const ca of progress?.caseAttempts ?? []) {
    if (!ca.completedAt) continue;
    const meta = course.cases.find(c => c.id === ca.caseId);
    if (!meta) continue;
    const title = meta ? meta.title : `Case: ${ca.caseId}`;
    const subtitle = meta ? meta.difficulty.charAt(0).toUpperCase() + meta.difficulty.slice(1) : undefined;
    const ev = toEvent(ca.completedAt, "case", title, subtitle);
    if (ev) events.push(ev);
  }

  // Post-assessment
  if (course.features.assessments) {
    const post = toEvent(progress?.postQuizCompletedAt, "post-quiz", "Post-Assessment Quiz",
      progress?.postQuizScore != null && progress?.postQuizTotal != null
        ? `Scored ${progress.postQuizScore}/${progress.postQuizTotal}`
        : undefined);
    if (post) events.push(post);

    const postSurvey = toEvent(progress?.postSurveyCompletedAt, "post-survey", "Post-Assessment Confidence Survey", "Final confidence recorded");
    if (postSurvey) events.push(postSurvey);
  }

  if (events.length === 0) {
    return (
      <Card>
        <p className="py-4 text-center text-sm text-gray-500">
          Your completion timeline will appear here as you progress through the course.
        </p>
      </Card>
    );
  }

  // Sort chronologically (earliest → latest)
  events.sort((a, b) => a.epoch - b.epoch);

  // Group by calendar day
  const groups = new Map<string, { dateLabel: string; items: TimelineEvent[] }>();
  for (const ev of events) {
    if (!groups.has(ev.dateKey)) {
      groups.set(ev.dateKey, { dateLabel: ev.dateLabel, items: [] });
    }
    groups.get(ev.dateKey)!.items.push(ev);
  }
  const groupList = [...groups.entries()].map(([key, g]) => ({ key, ...g }));

  return (
    <Card className="!p-0">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Completion Timeline</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {events.length} {events.length === 1 ? "milestone" : "milestones"} across {groupList.length} {groupList.length === 1 ? "day" : "days"}
          </p>
        </div>
      </div>

      <ol className="relative px-5 py-5">
        {/* Vertical rail */}
        <span aria-hidden className="absolute left-8 top-5 bottom-5 w-px bg-gray-200" />
        {groupList.map((group, gi) => (
          <li key={group.key} className={gi > 0 ? "mt-6" : ""}>
            <div className="flex items-center gap-3 mb-3">
              <span className="relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white">
                <svg className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </span>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{group.dateLabel}</p>
            </div>

            <ul className="space-y-3 pl-9">
              {group.items.map((ev, i) => {
                const cfg = KIND_CONFIG[ev.kind];
                return (
                  <li key={`${group.key}-${i}`} className="relative">
                    <span aria-hidden className={`absolute -left-[1.625rem] top-1.5 h-3 w-3 rounded-full ring-4 ${cfg.ring} ${cfg.dot}`} />
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cfg.pill}`}>
                            {cfg.label}
                          </span>
                          <p className="text-sm font-medium text-gray-900 truncate">{ev.title}</p>
                        </div>
                        {ev.subtitle && (
                          <p className="mt-0.5 text-xs text-gray-500">{ev.subtitle}</p>
                        )}
                      </div>
                      <span className="shrink-0 text-xs text-gray-500 tabular-nums">{ev.timeLabel}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </Card>
  );
}
