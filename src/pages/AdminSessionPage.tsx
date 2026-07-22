import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFellows } from "@/lib/firestore";
import { fellowName, type Fellow } from "@/components/admin/shared";
import { matchTrackedFellows } from "@/lib/tracked-fellows";
import { coursePath, getCourseById, normalMriPath } from "@/content/courses";
import { normalKneeSeries } from "@/content/normal-workstation-series";
import {
  NORMAL_MRI_MODE_PARAM,
  NORMAL_MRI_SERIES_PARAM,
} from "@/lib/normal-workstation-url";
import {
  SESSION_CASES,
  SESSION_HOUR_ONE,
  TEACHING_SESSION,
  fellowInviteText,
  isTeachingSessionLearnerReady,
} from "@/content/teaching-session";

const ASSIGNMENT_KEY = "teachingSession.caseLeads.v1";
const PREFLIGHT_KEY = "teachingSession.preflight.v1";

const PREFLIGHT_ITEMS = [
  {
    id: "workstation",
    label: "Presenter and fellow devices load the sagittal knee stack on the room network",
  },
  {
    id: "tabs",
    label: "Normal workstation and all three cases are pre-opened in separate presenter tabs",
  },
  {
    id: "external",
    label: "Optional external stacks were opened once; local case images are ready as fallback",
  },
  {
    id: "room",
    label: "Projector, power, charger and backup hotspot are ready",
  },
] as const;

/**
 * Faculty run-sheet for the live 7/24 knee-MRI session — admin-only.
 *
 * Two things drive every design choice here:
 *  1. It is used LIVE, standing up, on whatever device is at hand. Big targets,
 *     no nested scrolling, everything on one page in running order.
 *  2. The screen may be PROJECTED. Case diagnoses and teaching points are
 *     spoilers the app deliberately hides from fellows until they commit their
 *     read, so a projector-safe toggle masks them here too.
 */
export default function AdminSessionPage() {
  const course = getCourseById(TEACHING_SESSION.courseId);
  const [fellows, setFellows] = useState<Fellow[] | null>(null);
  const [rosterError, setRosterError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [projectorSafe, setProjectorSafe] = useState(false);

  const loadRoster = useCallback(async () => {
    setRefreshing(true);
    setRosterError(null);
    try {
      // Same cast the admin dashboard uses: firestore's ModuleProgressItem has
      // an optional `completed`, the admin one requires it. This page only reads
      // baseline/activity fields, never moduleProgress.
      setFellows((await getAllFellows(course)) as unknown as Fellow[]);
    } catch {
      setRosterError("Could not load the roster. Check the connection and try again.");
    } finally {
      setRefreshing(false);
    }
  }, [course]);

  useEffect(() => {
    void loadRoster();
  }, [loadRoster]);

  const roster = useMemo(() => matchTrackedFellows(fellows ?? []), [fellows]);

  return (
    <div className="space-y-6 pb-16">
      <SessionHeader
        projectorSafe={projectorSafe}
        onToggleProjectorSafe={() => setProjectorSafe((v) => !v)}
      />

      <RosterCheck
        roster={roster}
        loading={fellows === null}
        refreshing={refreshing}
        error={rosterError}
        onRefresh={() => void loadRoster()}
        course={course}
      />

      <PreflightChecklist />

      <InviteBlock />

      <HourOnePanel course={course} projectorSafe={projectorSafe} />

      <HourTwoPanel
        course={course}
        roster={roster}
        projectorSafe={projectorSafe}
      />

      <WrapUpPanel course={course} />
    </div>
  );
}

/* ───────── Room preflight ───────── */

type PreflightState = Record<(typeof PREFLIGHT_ITEMS)[number]["id"], boolean>;

function emptyPreflight(): PreflightState {
  return Object.fromEntries(PREFLIGHT_ITEMS.map((item) => [item.id, false])) as PreflightState;
}

function readPreflight(): PreflightState {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFLIGHT_KEY) ?? "{}") as Partial<PreflightState>;
    return Object.fromEntries(
      PREFLIGHT_ITEMS.map((item) => [item.id, saved[item.id] === true]),
    ) as PreflightState;
  } catch {
    return emptyPreflight();
  }
}

function PreflightChecklist() {
  const [state, setState] = useState<PreflightState>(() =>
    typeof localStorage === "undefined" ? emptyPreflight() : readPreflight(),
  );
  const done = PREFLIGHT_ITEMS.filter((item) => state[item.id]).length;

  function setItem(id: (typeof PREFLIGHT_ITEMS)[number]["id"], checked: boolean) {
    const next = { ...state, [id]: checked };
    setState(next);
    try {
      localStorage.setItem(PREFLIGHT_KEY, JSON.stringify(next));
    } catch {
      /* private-mode storage refusal must not break the checklist */
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Friday 12:50 preflight</h2>
          <p className="mt-0.5 text-sm text-gray-600">
            Dr. Swisher drives the projector; Dr. Burbank owns the fellows and the clock.
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            done === PREFLIGHT_ITEMS.length
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-900"
          }`}
        >
          {done}/{PREFLIGHT_ITEMS.length} ready
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {PREFLIGHT_ITEMS.map((item) => (
          <label
            key={item.id}
            className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-gray-200 px-3 py-2.5 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={state[item.id]}
              onChange={(event) => setItem(item.id, event.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 text-ucla-blue focus:ring-ucla-blue/50"
            />
            <span className={state[item.id] ? "text-sm text-gray-500 line-through" : "text-sm text-gray-800"}>
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}

/* ───────── Header ───────── */

function SessionHeader({
  projectorSafe,
  onToggleProjectorSafe,
}: {
  projectorSafe: boolean;
  onToggleProjectorSafe: () => void;
}) {
  return (
    <section className="rounded-2xl border border-ucla-blue/25 bg-gradient-to-br from-ucla-light/70 to-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-ucla-blue">
            Live teaching session
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{TEACHING_SESSION.title}</h1>
          <p className="mt-1.5 text-sm font-medium text-gray-700">
            {TEACHING_SESSION.dateLabel} · {TEACHING_SESSION.timeLabel}
          </p>
          <p className="mt-0.5 text-sm text-gray-600">
            {TEACHING_SESSION.faculty.join(" & ")} · 3 sports medicine fellows
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleProjectorSafe}
          aria-pressed={projectorSafe}
          className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors ${
            projectorSafe
              ? "border-amber-400 bg-amber-50 text-amber-900"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${projectorSafe ? "bg-amber-500" : "bg-gray-300"}`}
            aria-hidden="true"
          />
          {projectorSafe ? "Projector-safe: ON" : "Projector-safe: OFF"}
        </button>
      </div>

      {projectorSafe && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
          Everything faculty-only is hidden — diagnoses, teaching points, the evidence prompts
          and the closing-impression wording. Safe to share this screen with the fellows.
        </p>
      )}
    </section>
  );
}

/* ───────── Roster readiness ───────── */

interface ReadinessFlag {
  label: string;
  done: boolean;
}

function readinessFor(fellow: Fellow): ReadinessFlag[] {
  return [
    { label: "Signed in", done: true },
    { label: "Fellow access", done: fellow.role === "fellow" },
    { label: "Baseline quiz", done: fellow.preQuizScore !== null },
    { label: "Confidence survey", done: fellow.preSurveyCompleted },
  ];
}

function lastSeenLabel(fellow: Fellow): string {
  const ts = fellow.lastActive ?? fellow.lastLoginAt ?? null;
  if (!ts) return "No activity yet";
  const days = Math.floor((Date.now() - ts.seconds * 1000) / 86_400_000);
  if (days <= 0) return "Active today";
  if (days === 1) return "Active yesterday";
  return `Last active ${days} days ago`;
}

function RosterCheck({
  roster,
  loading,
  refreshing,
  error,
  onRefresh,
  course,
}: {
  roster: { targetName: string; fellow: Fellow | null }[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  course: ReturnType<typeof getCourseById>;
}) {
  const ready = roster.filter(
    (r) => r.fellow && isTeachingSessionLearnerReady(r.fellow),
  ).length;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Roster check</h2>
          <p className="mt-0.5 text-sm text-gray-600">
            {loading ? "Checking…" : `${ready} of ${roster.length} fellows are fully ready`}
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {roster.map(({ targetName, fellow }) => (
          <li
            key={targetName}
            className="rounded-xl border border-gray-200 bg-gray-50/60 p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold text-gray-900">
                {fellow ? fellowName(fellow) : targetName}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {loading ? "…" : fellow ? lastSeenLabel(fellow) : "Has not signed in yet"}
              </p>
            </div>

            {fellow ? (
              <>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {readinessFor(fellow).map((flag) => (
                    <span
                      key={flag.label}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        flag.done
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {flag.done ? "✓" : "•"} {flag.label}
                    </span>
                  ))}
                  {fellow.totalNormalPlanes ? (
                    <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700">
                      Normal MRI {fellow.normalPlanesPassed ?? 0}/{fellow.totalNormalPlanes} planes
                    </span>
                  ) : null}
                </div>
                {/* Case 2 (medial-root-tear) is residentVisible:false, so a
                    resident-role account dead-ends on it live. Surface it here
                    instead of discovering it at 2:22 PM. */}
                {fellow.role === "resident" && (
                  <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
                    ⚠️ This account is a <strong>resident</strong> — Case 2 (medial root tear) will not
                    open for them. Change the role to <strong>fellow</strong> in the admin dashboard before Friday.
                  </p>
                )}
              </>
            ) : (
              !loading && (
                <p className="mt-2 text-sm text-gray-600">
                  Send them the invite below — they need to sign in once before Friday.
                </p>
              )
            )}
          </li>
        ))}
      </ul>

      <Link
        to={coursePath(course, "/")}
        className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-ucla-blue hover:underline"
      >
        Open the fellow-facing course dashboard →
      </Link>
    </section>
  );
}

/* ───────── Invite ───────── */

function InviteBlock() {
  const text = useMemo(() => fellowInviteText(), []);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopyFailed(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can reject in an embedded webview or non-secure context —
      // surface it and point at the manual-copy fallback instead of failing silently.
      setCopied(false);
      setCopyFailed(true);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Send this to the fellows</h2>
          <p className="mt-0.5 text-sm text-gray-600">
            Baseline before Friday — it only measures the change if it happens first.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void copy()}
          className="inline-flex min-h-11 items-center rounded-lg bg-ucla-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-ucla-dark"
        >
          {copied ? "Copied ✓" : "Copy invite"}
        </button>
      </div>
      {copyFailed && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Couldn't copy automatically — open <strong>Preview the message</strong> below and copy it by hand.
        </p>
      )}
      <details className="mt-4 rounded-lg border border-gray-200 bg-gray-50" open={copyFailed}>
        <summary className="flex min-h-11 cursor-pointer items-center px-4 text-sm font-semibold text-gray-700">
          Preview the message
        </summary>
        <pre className="border-t border-gray-200 p-4 text-xs leading-relaxed whitespace-pre-wrap text-gray-800">
          {text}
        </pre>
      </details>
    </section>
  );
}

/* ───────── Hour 1 ───────── */

function seriesLabel(seriesId: string): string {
  return normalKneeSeries.find((s) => s.id === seriesId)?.label ?? seriesId;
}

function HourOnePanel({
  course,
  projectorSafe,
}: {
  course: ReturnType<typeof getCourseById>;
  projectorSafe: boolean;
}) {
  const base = normalMriPath(course);
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Hour 1 · 1:00 – 2:00</h2>
      <p className="mt-0.5 text-sm text-gray-600">
        Normal knee MRI on the fellows' own devices — we navigate with them.
      </p>

      <ol className="mt-4 space-y-3">
        {SESSION_HOUR_ONE.map((step) => (
          <li key={step.label} className="rounded-xl border border-gray-200 p-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="rounded-md bg-ucla-light px-2 py-0.5 text-xs font-bold text-ucla-dark">
                {step.minutes}
              </span>
              <h3 className="font-semibold text-gray-900">{step.label}</h3>
            </div>
            {!projectorSafe && (
              <p className="mt-2 text-sm text-gray-700">{step.facultyNote}</p>
            )}
            <Link
              to={`${base}?${NORMAL_MRI_SERIES_PARAM}=${step.seriesId}&${NORMAL_MRI_MODE_PARAM}=${step.mode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center rounded-lg border border-ucla-blue/40 bg-ucla-light/40 px-4 text-sm font-semibold text-ucla-dark transition-colors hover:bg-ucla-light"
            >
              Open {seriesLabel(step.seriesId)} ↗
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ───────── Hour 2 ───────── */

type LeadMap = Record<string, string>;

function readLeads(): LeadMap {
  try {
    const raw = localStorage.getItem(ASSIGNMENT_KEY);
    return raw ? (JSON.parse(raw) as LeadMap) : {};
  } catch {
    return {};
  }
}

function HourTwoPanel({
  course,
  roster,
  projectorSafe,
}: {
  course: ReturnType<typeof getCourseById>;
  roster: { targetName: string; fellow: Fellow | null }[];
  projectorSafe: boolean;
}) {
  const [leads, setLeads] = useState<LeadMap>(() =>
    typeof localStorage === "undefined" ? {} : readLeads(),
  );

  // Default rotation: one case each, in roster order. Fill only cases whose key
  // has NEVER been set — testing `in`, not truthiness, so an explicit "" that a
  // faculty member chose via "Unassigned" is preserved instead of being re-filled
  // with the roster default on the next render.
  const effectiveLeads = useMemo(() => {
    const next: LeadMap = { ...leads };
    SESSION_CASES.forEach((c, i) => {
      if (!(c.caseId in next)) next[c.caseId] = roster[i]?.targetName ?? "";
    });
    return next;
  }, [leads, roster]);

  function assign(caseId: string, name: string) {
    const next = { ...effectiveLeads, [caseId]: name };
    setLeads(next);
    try {
      localStorage.setItem(ASSIGNMENT_KEY, JSON.stringify(next));
    } catch {
      /* private-mode storage refusal must not break the session */
    }
  }

  const names = roster.map((r) => r.targetName);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Hour 2 · 2:05 – 3:00</h2>
      <p className="mt-0.5 text-sm text-gray-600">
        One fellow leads; the other two supply evidence. Case 3 is the short one — Hour 2 is
        48 minutes of case time, not 60.
      </p>

      {!projectorSafe && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-900">
            Read this before 2:05
          </p>
          <p className="mt-1.5 text-sm text-amber-950">
            Each search-pattern step now keeps a compact local image rail in view. Use your
            projector copy for larger comparison and the external stack only when it adds value;
            pre-flight those external links because they are outside our control.
          </p>
          <p className="mt-2 text-sm text-amber-950">
            Image captions, tags, accessibility labels and the diagnosis stay hidden until the
            fellow commits. A blue &ldquo;mentioned&rdquo; dot only detects related words; it does not
            understand negation, so faculty still grade the clinical meaning.
          </p>
        </div>
      )}

      <div className="mt-4 space-y-4">
        {SESSION_CASES.map((plan, index) => (
          <article key={plan.caseId} className="rounded-xl border border-gray-200 p-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="rounded-md bg-ucla-blue px-2 py-0.5 text-xs font-bold text-white">
                Case {index + 1}
              </span>
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-700">
                {plan.window}
              </span>
              <h3 className="font-semibold text-gray-900">
                {projectorSafe ? `Case ${index + 1}` : plan.title}
              </h3>
            </div>

            <p className="mt-2 text-sm text-gray-700">{plan.scenario}</p>

            <label className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-gray-700">Leading:</span>
              <select
                value={effectiveLeads[plan.caseId] ?? ""}
                onChange={(e) => assign(plan.caseId, e.target.value)}
                className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-base font-medium text-gray-900 sm:text-sm"
              >
                <option value="">Unassigned</option>
                {names.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            {!projectorSafe && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-900">
                  Teaching focus — faculty only
                </p>
                <ul className="mt-1.5 space-y-1 text-sm text-amber-950">
                  {plan.teachingFocus.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span aria-hidden="true">·</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!projectorSafe && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                    The other two
                  </p>
                  <p className="mt-1 text-sm text-gray-800">{plan.supportingRole}</p>
                </div>
                <div className="rounded-lg border border-ucla-blue/25 bg-ucla-light/40 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-ucla-blue">
                    Closing impression
                  </p>
                  <p className="mt-1 text-sm text-gray-800">{plan.impressionPrompt}</p>
                </div>
              </div>
            )}

            <Link
              to={coursePath(course, `/cases/${plan.caseId}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-ucla-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-ucla-dark"
            >
              Open case {index + 1} ↗
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ───────── Wrap ───────── */

function WrapUpPanel({ course }: { course: ReturnType<typeof getCourseById> }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">Last 5 minutes</h2>
      <ul className="mt-3 space-y-2 text-sm text-gray-800">
        <li className="flex gap-2">
          <span aria-hidden="true">1.</span>
          <span>
            Ask each fellow for the one search-pattern change they will make on Monday.
          </span>
        </li>
        <li className="flex gap-2">
          <span aria-hidden="true">2.</span>
          <span>
            Point them at the post-assessment — same structure as the baseline, so the pair
            measures the change. It does not have to be done today.
          </span>
        </li>
        <li className="flex gap-2">
          <span aria-hidden="true">3.</span>
          <span>Remind them the rest of the course stays open, offline, on their phone.</span>
        </li>
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to={coursePath(course, "/post-assessment")}
          className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Post-assessment
        </Link>
        <Link
          to="/admin"
          className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Full admin dashboard
        </Link>
      </div>
    </section>
  );
}
