import { useEffect, useState, useMemo, useCallback, Fragment } from "react";
import { getAllFellows, setUserRole, completeModuleAdmin } from "@/lib/firestore";
import { sendCertificateCallable } from "@/lib/functions";
import { csvCell } from "@/lib/csv-cell";
import { moduleQuizzes } from "@/content/quizzes/module-quizzes";
import {
  courseRegistry,
  defaultCourse,
  getPreQuizQuestions,
  getPostQuizQuestions,
  type CourseDefinition,
} from "@/content/courses";
import {
  pct,
  fellowName,
  fellowStatus,
  hasNormalMriWorkstation,
  daysSince,
  lastSeen,
  totalCasesForRole,
  STATUS_COLORS,
  type Fellow,
  type FellowStatus,
  type SurveyResponse,
  type CaseAttemptItem,
} from "@/components/admin/shared";
import { matchTrackedFellows } from "@/lib/tracked-fellows";
import StatusFunnel from "@/components/admin/StatusFunnel";
import NeedsAttentionPanel from "@/components/admin/NeedsAttentionPanel";
import DomainMasteryPanel from "@/components/admin/DomainMasteryPanel";
import ConfidenceCalibrationPanel from "@/components/admin/ConfidenceCalibrationPanel";
import ModuleHeatmapPanel from "@/components/admin/ModuleHeatmapPanel";
import ItemAnalysisTable from "@/components/admin/ItemAnalysisTable";
import TestQualityPanel from "@/components/admin/TestQualityPanel";
import ResearchSummaryPanel from "@/components/admin/ResearchSummaryPanel";
import EngagementPanel from "@/components/admin/EngagementPanel";
import MedicalQaReadinessPanel from "@/components/admin/MedicalQaReadinessPanel";
import IssueReportsPanel from "@/components/admin/IssueReportsPanel";

/* ───────── Helpers ───────── */

function avgConfidence(responses: SurveyResponse[] | null): number | null {
  if (!responses || responses.length === 0) return null;
  const sum = responses.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / responses.length) * 10) / 10;
}

function formatDate(ts?: { seconds: number } | null): string {
  if (!ts) return "--";
  return new Date(ts.seconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(ts?: { seconds: number } | null): string {
  if (!ts) return "--";
  return new Date(ts.seconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ───────── CSV Export ───────── */

function csvTotalCases(f: Fellow, course: CourseDefinition): number {
  return totalCasesForRole(course, f.role);
}

function exportCSV(fellows: Fellow[], course: CourseDefinition) {
  const totalModules = course.modules.length;
  const PRE_QUIZ_TOTAL = getPreQuizQuestions(course).length;
  const POST_QUIZ_TOTAL = getPostQuizQuestions(course).length;
  const headers = [
    "Name",
    "Email",
    "Pre-Quiz Score",
    "Pre-Quiz %",
    "Post-Quiz Score",
    "Post-Quiz %",
    "Improvement %",
    "Pre-Confidence Avg",
    "Post-Confidence Avg",
    "Modules Completed",
    "Cases Completed",
    "Normal MRI",
    "Status",
  ];
  const rows = fellows.map((f) => {
    const prePct = f.preQuizScore !== null ? pct(f.preQuizScore, f.preQuizTotal ?? PRE_QUIZ_TOTAL) : "";
    const postPct = f.postQuizScore !== null ? pct(f.postQuizScore, f.postQuizTotal ?? POST_QUIZ_TOTAL) : "";
    const improvement =
      f.preQuizScore !== null && f.postQuizScore !== null
        ? (pct(f.postQuizScore, f.postQuizTotal ?? POST_QUIZ_TOTAL) - pct(f.preQuizScore, f.preQuizTotal ?? PRE_QUIZ_TOTAL))
        : "";
    const preConf = avgConfidence(f.preSurveyResponses);
    const postConf = avgConfidence(f.postSurveyResponses);
    return [
      fellowName(f),
      f.email || "",
      f.preQuizScore !== null ? `${f.preQuizScore}/${f.preQuizTotal ?? PRE_QUIZ_TOTAL}` : "",
      prePct !== "" ? `${prePct}%` : "",
      f.postQuizScore !== null ? `${f.postQuizScore}/${f.postQuizTotal ?? POST_QUIZ_TOTAL}` : "",
      postPct !== "" ? `${postPct}%` : "",
      improvement !== "" ? `${improvement}%` : "",
      preConf !== null ? preConf.toFixed(1) : "",
      postConf !== null ? postConf.toFixed(1) : "",
      `${f.modulesCompleted}/${totalModules}`,
      `${Math.min(f.casesCompleted, csvTotalCases(f, course))}/${csvTotalCases(f, course)}`,
      normalMriProgressLabel(f, course),
      fellowStatus(f, totalModules, csvTotalCases(f, course), course, POST_QUIZ_TOTAL),
    ];
  });

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => csvCell(cell)).join(","))
    .join("\n");

  downloadCsv(csvContent, `${course.id}-cohort-${new Date().toISOString().slice(0, 10)}.csv`);
}

function downloadCsv(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const csvEscape = csvCell;

function isoDate(ts?: { seconds: number } | null): string {
  if (!ts) return "";
  return new Date(ts.seconds * 1000).toISOString();
}

/**
 * Detailed CSV export — one row per learner with columns covering every
 * module, case, confidence statement, and timestamp. Designed for offline
 * analysis (Excel, R, Python) of cohort learning patterns.
 */
function exportDetailedCSV(fellows: Fellow[], course: CourseDefinition) {
  const totalModules = course.modules.length;
  // Phase-correct administered totals (the pre/post quizzes use mapped subsets,
  // not the full instrument) — match the summary CSV and on-screen table.
  const preQuizTotal = getPreQuizQuestions(course).length;
  const postQuizTotal = getPostQuizQuestions(course).length;

  // Build stable column lists from the active course
  const modules = course.modules.map((m) => ({ id: m.id, title: m.title }));
  const cases = course.cases.map((c) => ({ id: c.id, title: c.title, tier: c.tier }));
  const statements = course.confidenceStatements.map((s) => ({ id: s.id, domain: s.domain }));

  const headers: string[] = [
    "Learner ID",
    "Name",
    "Email",
    "Role",
    "Status",
    "Last Login (ISO)",
    "Last Active (ISO)",
    "Certificate Sent",
    "Certificate Sent At (ISO)",
    "Pre-Quiz Score",
    "Pre-Quiz Total",
    "Pre-Quiz %",
    "Post-Quiz Score",
    "Post-Quiz Total",
    "Post-Quiz %",
    "Improvement (pp)",
    "Pre-Confidence Avg (1-5)",
    "Post-Confidence Avg (1-5)",
    "Confidence Change",
    "Modules Completed",
    "Modules Required",
    "Module Completion %",
    "Cases Completed",
    "Cases Required",
    "Case Completion %",
    "Normal MRI Complete",
    "Normal MRI Planes Passed",
    "Normal MRI Planes Required",
    "Avg Module Quiz %",
  ];

  // Per-module columns: completed, score, total, %, completed-at
  modules.forEach((m) => {
    headers.push(
      `Module: ${m.title} — Completed`,
      `Module: ${m.title} — Score`,
      `Module: ${m.title} — Total`,
      `Module: ${m.title} — %`,
      `Module: ${m.title} — Completed At (ISO)`,
    );
  });

  // Per-case columns: attempted, completed-at
  cases.forEach((c) => {
    headers.push(
      `Case [${c.tier}]: ${c.title} — Attempted`,
      `Case [${c.tier}]: ${c.title} — Completed At (ISO)`,
    );
  });

  // Per-confidence-statement columns: day-one pre, retrospective "then", post,
  // the raw change (post − day-one), and the response-shift-corrected gain (post − then).
  statements.forEach((s) => {
    headers.push(
      `Confidence [${s.domain}] ${s.id} — Pre (day one)`,
      `Confidence [${s.domain}] ${s.id} — Retro (then, looking back)`,
      `Confidence [${s.domain}] ${s.id} — Post (now)`,
      `Confidence [${s.domain}] ${s.id} — Change (post − day one)`,
      `Confidence [${s.domain}] ${s.id} — Corrected gain (post − then)`,
    );
  });

  const rows = fellows.map((f) => {
    const totalCases = csvTotalCases(f, course);
    const preTotal = f.preQuizTotal ?? preQuizTotal;
    const postTotal = f.postQuizTotal ?? postQuizTotal;
    const prePctVal = f.preQuizScore !== null ? pct(f.preQuizScore, preTotal) : null;
    const postPctVal = f.postQuizScore !== null ? pct(f.postQuizScore, postTotal) : null;
    const improvement = prePctVal !== null && postPctVal !== null ? postPctVal - prePctVal : null;
    const preConf = avgConfidence(f.preSurveyResponses);
    const postConf = avgConfidence(f.postSurveyResponses);
    const confChange = preConf !== null && postConf !== null ? Math.round((postConf - preConf) * 10) / 10 : null;

    // Build lookup maps
    const modMap = new Map(f.moduleProgress.map((m) => [m.id, m]));
    const caseMap = new Map<string, CaseAttemptItem>();
    f.caseAttempts.forEach((c) => {
      // Keep the earliest attempt per case
      const existing = caseMap.get(c.caseId);
      if (!existing || !existing.completedAt || (c.completedAt && c.completedAt.seconds < existing.completedAt.seconds)) {
        caseMap.set(c.caseId, c);
      }
    });
    const preSurveyMap = new Map((f.preSurveyResponses ?? []).map((r) => [r.statementId, r.rating]));
    const postSurveyMap = new Map((f.postSurveyResponses ?? []).map((r) => [r.statementId, r.rating]));
    const retroSurveyMap = new Map((f.postRetroResponses ?? []).map((r) => [r.statementId, r.rating]));

    // Avg module quiz %
    const moduleQuizPcts = f.moduleProgress
      .filter((m) => m.quizScore !== null && m.quizTotal && m.quizTotal > 0)
      .map((m) => pct(m.quizScore as number, m.quizTotal as number));
    const avgModQuiz = moduleQuizPcts.length > 0
      ? Math.round(moduleQuizPcts.reduce((a, b) => a + b, 0) / moduleQuizPcts.length)
      : null;

    const row: (string | number)[] = [
      f.id,
      fellowName(f),
      f.email || "",
      f.role || "",
      fellowStatus(f, totalModules, totalCases, course, postQuizTotal),
      isoDate(f.lastLoginAt),
      isoDate(f.lastActive),
      f.certificateSent ? "Yes" : "No",
      isoDate(f.certificateSentAt),
      f.preQuizScore ?? "",
      f.preQuizScore !== null ? preTotal : "",
      prePctVal !== null ? prePctVal : "",
      f.postQuizScore ?? "",
      f.postQuizScore !== null ? postTotal : "",
      postPctVal !== null ? postPctVal : "",
      improvement !== null ? improvement : "",
      preConf !== null ? preConf : "",
      postConf !== null ? postConf : "",
      confChange !== null ? confChange : "",
      f.modulesCompleted,
      totalModules,
      totalModules > 0 ? Math.round((f.modulesCompleted / totalModules) * 100) : 0,
      Math.min(f.casesCompleted, totalCases),
      totalCases,
      totalCases > 0 ? Math.min(100, Math.round((f.casesCompleted / totalCases) * 100)) : 0,
      hasNormalMriWorkstation(course) ? (f.normalMriComplete ? "Yes" : "No") : "Not required",
      f.normalPlanesPassed ?? "",
      f.totalNormalPlanes ?? "",
      avgModQuiz !== null ? avgModQuiz : "",
    ];

    modules.forEach((m) => {
      const mp = modMap.get(m.id);
      const modPct = mp && mp.quizScore !== null && mp.quizTotal && mp.quizTotal > 0
        ? pct(mp.quizScore, mp.quizTotal)
        : null;
      row.push(
        mp?.completed ? "Yes" : "No",
        mp?.quizScore ?? "",
        mp?.quizTotal ?? "",
        modPct !== null ? modPct : "",
        isoDate(mp?.completedAt),
      );
    });

    cases.forEach((c) => {
      const ca = caseMap.get(c.id);
      row.push(ca ? "Yes" : "No", isoDate(ca?.completedAt));
    });

    statements.forEach((s) => {
      const pre = preSurveyMap.get(s.id);
      const retro = retroSurveyMap.get(s.id);
      const post = postSurveyMap.get(s.id);
      const change = pre !== undefined && post !== undefined ? post - pre : null;
      const correctedGain = retro !== undefined && post !== undefined ? post - retro : null;
      row.push(
        pre ?? "",
        retro ?? "",
        post ?? "",
        change !== null ? change : "",
        correctedGain !== null ? correctedGain : "",
      );
    });

    return row;
  });

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => csvEscape(cell)).join(","))
    .join("\n");

  downloadCsv(csvContent, `${course.id}-detailed-${new Date().toISOString().slice(0, 10)}.csv`);
}

/* ───────── StatusBadge ───────── */

function StatusBadge({ status }: { status: FellowStatus }) {
  const styles = {
    Complete: "bg-green-100 text-green-800 border-green-200",
    "Below 70%": "bg-amber-100 text-amber-800 border-amber-200",
    "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
    "Not Started": "bg-gray-100 text-gray-500 border-gray-200",
  };
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

/* ───────── Bar helpers (pure CSS) ───────── */

function HBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const w = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="w-8 text-right text-xs text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
        <div className="h-full rounded" style={{ width: `${w}%`, backgroundColor: color }} />
      </div>
      <span className="w-10 text-xs font-semibold text-gray-700">{value}%</span>
    </div>
  );
}

type NextStepTone = "done" | "attention" | "steady" | "waiting";

interface TrackedFellowRow {
  targetName: string;
  fellow: Fellow | null;
  status: FellowStatus | null;
  progressPct: number;
  nextStep: string;
  nextStepTone: NextStepTone;
  normalMri: string;
  daysInactive: number | null;
}

function normalMriProgressLabel(fellow: Fellow, course: CourseDefinition): string {
  if (!hasNormalMriWorkstation(course)) return "Not required";
  const total = fellow.totalNormalPlanes ?? 0;
  const passed = fellow.normalPlanesPassed ?? (fellow.normalMriComplete ? total : 0);
  if (fellow.normalMriComplete) {
    return total > 0 ? `Complete (${passed}/${total})` : "Complete";
  }
  return total > 0 ? `${passed}/${total} planes` : "Not started";
}

function learnerProgressPct(
  fellow: Fellow,
  course: CourseDefinition,
  totalModules: number,
  totalCases: number,
): number {
  const hasNormal = hasNormalMriWorkstation(course);
  const normalTotal = fellow.totalNormalPlanes ?? 0;
  const normalPassed = fellow.normalPlanesPassed ?? (fellow.normalMriComplete ? normalTotal : 0);
  const normalProgress = !hasNormal
    ? 1
    : normalTotal > 0
      ? Math.min(normalPassed / normalTotal, 1)
      : fellow.normalMriComplete
        ? 1
        : 0;
  const moduleProgress = totalModules > 0 ? Math.min(fellow.modulesCompleted / totalModules, 1) : 1;
  const caseProgress = totalCases > 0 ? Math.min(fellow.casesCompleted / totalCases, 1) : 1;
  const steps = [
    fellow.preQuizScore !== null ? 1 : 0,
    fellow.preSurveyCompleted ? 1 : 0,
    normalProgress,
    moduleProgress,
    caseProgress,
    fellow.postQuizScore !== null ? 1 : 0,
    fellow.postSurveyCompleted ? 1 : 0,
  ];
  return Math.round((steps.reduce((sum, value) => sum + value, 0) / steps.length) * 100);
}

function nextIncompleteModuleLabel(fellow: Fellow, course: CourseDefinition): string | null {
  const completed = new Set(
    (fellow.moduleProgress ?? []).filter((item) => item.completed).map((item) => item.id),
  );
  const next = course.modules.find((module) => !completed.has(module.id));
  return next ? `Module ${next.number}: ${next.title}` : null;
}

function nextStepForFellow(
  fellow: Fellow,
  course: CourseDefinition,
  totalModules: number,
  totalCases: number,
  postQuizTotal: number,
): { label: string; tone: NextStepTone } {
  if (fellow.preQuizScore === null) return { label: "Start pre-assessment", tone: "attention" };
  if (!fellow.preSurveyCompleted) return { label: "Finish pre-confidence survey", tone: "attention" };
  if (hasNormalMriWorkstation(course) && !fellow.normalMriComplete) {
    return { label: `Complete Normal MRI (${normalMriProgressLabel(fellow, course)})`, tone: "attention" };
  }
  if (fellow.modulesCompleted < totalModules) {
    return { label: nextIncompleteModuleLabel(fellow, course) ?? "Continue modules", tone: "steady" };
  }
  if (fellow.casesCompleted < totalCases) {
    return { label: "Complete required cases", tone: "steady" };
  }
  if (fellow.postQuizScore === null) return { label: "Take post-assessment", tone: "attention" };
  if (!fellow.postSurveyCompleted) return { label: "Finish post-confidence survey", tone: "attention" };

  const status = fellowStatus(fellow, totalModules, totalCases, course, postQuizTotal);
  if (status === "Below 70%") return { label: "Review and retake post-assessment", tone: "attention" };
  if (!fellow.certificateSent) return { label: "Certificate ready to send", tone: "done" };
  return { label: "Certificate sent", tone: "done" };
}

function buildTrackedFellowRows(
  fellows: Fellow[],
  course: CourseDefinition,
  totalModules: number,
  totalCasesForFellow: (fellow: Fellow) => number,
  postQuizTotal: number,
): TrackedFellowRow[] {
  return matchTrackedFellows(fellows).map(({ targetName, fellow }) => {
    if (!fellow) {
      return {
        targetName,
        fellow: null,
        status: null,
        progressPct: 0,
        nextStep: "Waiting for first sign-in",
        nextStepTone: "waiting",
        normalMri: "No account yet",
        daysInactive: null,
      };
    }

    const totalCases = totalCasesForFellow(fellow);
    const next = nextStepForFellow(fellow, course, totalModules, totalCases, postQuizTotal);
    return {
      targetName,
      fellow,
      status: fellowStatus(fellow, totalModules, totalCases, course, postQuizTotal),
      progressPct: learnerProgressPct(fellow, course, totalModules, totalCases),
      nextStep: next.label,
      nextStepTone: next.tone,
      normalMri: normalMriProgressLabel(fellow, course),
      daysInactive: daysSince(lastSeen(fellow)),
    };
  });
}

/* ───────── MAIN COMPONENT ───────── */

type DashboardTab = "overview" | "insights" | "learners" | "issues";

const TABS: { id: DashboardTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "insights", label: "Insights" },
  { id: "learners", label: "Learners" },
  { id: "issues", label: "Issue Reports" },
];

export default function AdminDashboardPage() {
  const [fellows, setFellows] = useState<Fellow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFellow, setExpandedFellow] = useState<string | null>(null);
  const [jumpTarget, setJumpTarget] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<"all" | "fellow" | "resident">("all");
  const [selectedCourse, setSelectedCourse] = useState<CourseDefinition>(defaultCourse);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [statusFilter, setStatusFilter] = useState<FellowStatus | null>(null);

  // Per-course derived values (recompute when the admin switches cohort).
  const PRE_QUIZ_TOTAL = getPreQuizQuestions(selectedCourse).length;
  const POST_QUIZ_TOTAL = getPostQuizQuestions(selectedCourse).length;
  const residentRequiredCaseCount = totalCasesForRole(selectedCourse, "resident");

  // Force-complete state
  const [fcSelectedFellow, setFcSelectedFellow] = useState<string>("");
  const [fcSelectedModules, setFcSelectedModules] = useState<Set<string>>(new Set());
  const [fcBusy, setFcBusy] = useState(false);
  const [fcResult, setFcResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let active = true; // guard against a stale (slower) response on rapid course switch
    setLoading(true);
    setError(null);
    setExpandedFellow(null);
    // Statuses are course-specific, so a carried-over funnel filter would be stale.
    setStatusFilter(null);
    // Certificates are course-scoped, so a "Certificate sent!" message must not
    // follow the same learner into another cohort where none was sent.
    setCertResult(null);
    setSendingCertIds(new Set());
    getAllFellows(selectedCourse)
      .then((data) => { if (active) setFellows(data as unknown as Fellow[]); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [selectedCourse]);

  const filteredFellows = useMemo(() => {
    if (roleFilter === "all") return fellows;
    return fellows.filter((f) => f.role === roleFilter);
  }, [fellows, roleFilter]);

  const fellowCount = fellows.filter((f) => f.role === "fellow").length;
  const residentCount = fellows.filter((f) => f.role === "resident").length;

  const handleRoleChange = useCallback(async (userId: string, newRole: "fellow" | "resident") => {
    try {
      await setUserRole(userId, newRole);
      setFellows((prev) => prev.map((f) => (f.id === userId ? { ...f, role: newRole } : f)));
    } catch (err) {
      alert("Failed to update role: " + (err as Error).message);
    }
  }, []);

  const handleForceComplete = useCallback(async () => {
    if (!fcSelectedFellow || fcSelectedModules.size === 0) return;
    setFcBusy(true);
    setFcResult(null);
    try {
      for (const moduleId of fcSelectedModules) {
        // Mark complete WITHOUT a fabricated quiz score. Writing a fake 100%
        // was indistinguishable from an earned score: it inflated the module
        // heatmap/CSV and could flip a struggling module's "needs review" flag
        // off. null/null is suppressed by every aggregation.
        await completeModuleAdmin(fcSelectedFellow, moduleId, null, null, selectedCourse.id);
      }
      // Refresh fellows data
      const refreshed = await getAllFellows(selectedCourse);
      setFellows(refreshed as unknown as Fellow[]);
      setFcResult({ type: "success", message: `Marked ${fcSelectedModules.size} module(s) as completed.` });
      setFcSelectedModules(new Set());
    } catch (err) {
      setFcResult({ type: "error", message: (err as Error).message });
    } finally {
      setFcBusy(false);
    }
  }, [fcSelectedFellow, fcSelectedModules, selectedCourse]);

  const toggleFcModule = useCallback((moduleId: string) => {
    setFcSelectedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  }, []);

  // Send certificate state. A SET of in-flight ids, not a single id: with a
  // scalar, starting a send for a second learner cleared the flag for the first
  // and re-enabled that row's button while its request was still in flight —
  // one double-click away from a duplicate certificate email.
  const [sendingCertIds, setSendingCertIds] = useState<Set<string>>(new Set());
  const [certResult, setCertResult] = useState<{ type: "success" | "error"; message: string; userId: string; canForce?: boolean } | null>(null);

  const handleSendCertificate = useCallback(async (userId: string, force = false) => {
    // Functional updates so concurrent sends can't clobber each other's entry.
    setSendingCertIds((prev) => new Set(prev).add(userId));
    setCertResult(null);
    try {
      // Send the certificate for the currently selected course cohort. `force`
      // overrides the server-side completion gate (used by the "Send anyway"
      // button when a learner is below the completion bar but the admin chooses
      // to certify anyway — the override is recorded server-side).
      await sendCertificateCallable({ userId, courseId: selectedCourse.id, force });
      setFellows((prev) => prev.map((f) => (f.id === userId ? { ...f, certificateSent: true } : f)));
      setCertResult({ type: "success", message: "Certificate sent!", userId });
    } catch (err) {
      // A completion-gate rejection can be overridden once with "Send anyway".
      setCertResult({ type: "error", message: (err as Error).message, userId, canForce: !force });
    } finally {
      setSendingCertIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  }, [selectedCourse]);

  const totalModules = selectedCourse.modules.length;
  const totalCases = totalCasesForRole(selectedCourse, "fellow");

  const totalCasesForFellow = useCallback((f: Fellow): number => {
    return f.role === "resident" ? residentRequiredCaseCount : totalCases;
  }, [totalCases, residentRequiredCaseCount]);

  const handleFunnelSelect = useCallback((s: FellowStatus | null) => {
    setStatusFilter(s);
    if (s !== null) setActiveTab("learners");
  }, []);

  // Jump from a "Needs Attention" learner straight to their expanded row in the
  // Learners tab (clear any status filter so the row is guaranteed visible).
  const handleJumpToLearner = useCallback((id: string) => {
    setStatusFilter(null);
    setActiveTab("learners");
    setExpandedFellow(id);
    setJumpTarget(id);
  }, []);

  useEffect(() => {
    if (!jumpTarget || activeTab !== "learners") return;
    const el = document.getElementById(`fellow-row-${jumpTarget}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setJumpTarget(null);
    }
  }, [jumpTarget, activeTab]);

  /* ── Cohort stats ── */
  const stats = useMemo(() => {
    const withPre = filteredFellows.filter((f) => f.preQuizScore !== null);
    const withPost = filteredFellows.filter((f) => f.postQuizScore !== null);
    const withPreConf = filteredFellows.filter((f) => f.preSurveyResponses && f.preSurveyResponses.length > 0);
    const withPostConf = filteredFellows.filter((f) => f.postSurveyResponses && f.postSurveyResponses.length > 0);

    const avgPre =
      withPre.length > 0
        ? Math.round(withPre.reduce((s, f) => s + pct(f.preQuizScore!, f.preQuizTotal ?? PRE_QUIZ_TOTAL), 0) / withPre.length)
        : null;
    const avgPost =
      withPost.length > 0
        ? Math.round(withPost.reduce((s, f) => s + pct(f.postQuizScore!, f.postQuizTotal ?? POST_QUIZ_TOTAL), 0) / withPost.length)
        : null;
    // Improvement must be the mean of per-fellow (post − pre) over fellows who took
    // BOTH — not avgPost(post-takers) − avgPre(pre-takers), which subtracts two
    // different populations and can show a misleading number.
    const withBoth = filteredFellows.filter((f) => f.preQuizScore !== null && f.postQuizScore !== null);
    const avgImprovement =
      withBoth.length > 0
        ? Math.round(
            withBoth.reduce(
              (s, f) =>
                s +
                (pct(f.postQuizScore!, f.postQuizTotal ?? POST_QUIZ_TOTAL) -
                  pct(f.preQuizScore!, f.preQuizTotal ?? PRE_QUIZ_TOTAL)),
              0,
            ) / withBoth.length,
          )
        : null;

    const avgPreConf =
      withPreConf.length > 0
        ? Math.round((withPreConf.reduce((s, f) => s + avgConfidence(f.preSurveyResponses)!, 0) / withPreConf.length) * 10) / 10
        : null;
    const avgPostConf =
      withPostConf.length > 0
        ? Math.round((withPostConf.reduce((s, f) => s + avgConfidence(f.postSurveyResponses)!, 0) / withPostConf.length) * 10) / 10
        : null;

    const completedCount = filteredFellows.filter((f) => fellowStatus(f, totalModules, totalCasesForFellow(f), selectedCourse, POST_QUIZ_TOTAL) === "Complete").length;
    const completionRate = filteredFellows.length > 0 ? Math.round((completedCount / filteredFellows.length) * 100) : 0;

    return { avgPre, avgPost, avgImprovement, avgPreConf, avgPostConf, completionRate };
  }, [filteredFellows, totalModules, totalCasesForFellow, PRE_QUIZ_TOTAL, POST_QUIZ_TOTAL, selectedCourse]);

  /* ── Score comparison data (sorted by improvement desc) ── */
  const scoreComparison = useMemo(() => {
    return filteredFellows
      .filter((f) => f.preQuizScore !== null && f.postQuizScore !== null)
      .map((f) => ({
        id: f.id,
        name: fellowName(f),
        pre: pct(f.preQuizScore!, f.preQuizTotal ?? PRE_QUIZ_TOTAL),
        post: pct(f.postQuizScore!, f.postQuizTotal ?? POST_QUIZ_TOTAL),
        improvement: pct(f.postQuizScore!, f.postQuizTotal ?? POST_QUIZ_TOTAL) - pct(f.preQuizScore!, f.preQuizTotal ?? PRE_QUIZ_TOTAL),
      }))
      .sort((a, b) => b.improvement - a.improvement);
  }, [filteredFellows, PRE_QUIZ_TOTAL, POST_QUIZ_TOTAL]);

  /* ── Table rows: role filter + (optional) funnel status filter ── */
  const displayedFellows = useMemo(() => {
    if (!statusFilter) return filteredFellows;
    return filteredFellows.filter(
      (f) => fellowStatus(f, totalModules, totalCasesForFellow(f), selectedCourse, POST_QUIZ_TOTAL) === statusFilter,
    );
  }, [filteredFellows, statusFilter, totalModules, totalCasesForFellow, selectedCourse, POST_QUIZ_TOTAL]);

  const trackedFellowRows = useMemo(
    () => buildTrackedFellowRows(fellows, selectedCourse, totalModules, totalCasesForFellow, POST_QUIZ_TOTAL),
    [fellows, selectedCourse, totalModules, totalCasesForFellow, POST_QUIZ_TOTAL],
  );

  const handleExport = useCallback(() => {
    exportCSV(filteredFellows, selectedCourse);
  }, [filteredFellows, selectedCourse]);

  const handleExportDetailed = useCallback(() => {
    exportDetailedCSV(filteredFellows, selectedCourse);
  }, [filteredFellows, selectedCourse]);

  /* ── Loading / Error states ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2774AE] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
        <p className="text-red-700 font-medium">Error loading fellows</p>
        <p className="text-sm text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header + Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Director Dashboard</h1>
          <p className="mt-1 text-gray-500">{selectedCourse.shortTitle} cohort overview</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
            style={{ backgroundColor: "#2774AE" }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#005587")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2774AE")}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Summary CSV
          </button>
          <button
            onClick={handleExportDetailed}
            title="Per-learner row with every module score, case attempt, and confidence rating — designed for analytics."
            className="inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-semibold shadow-sm transition-colors"
            style={{ borderColor: "#2774AE", color: "#2774AE", backgroundColor: "white" }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#2774AE";
              e.currentTarget.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#2774AE";
            }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Detailed CSV
          </button>
        </div>
      </div>

      {/* ─── Course Selector ─── */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
        <span className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Course</span>
        {courseRegistry.map((course) => {
          const active = course.id === selectedCourse.id;
          return (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                active ? "bg-ucla-blue text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {course.shortTitle}
            </button>
          );
        })}
      </div>

      {/* ─── Dashboard Tabs + global Role Filter ─── */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
        <span className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">View</span>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                active ? "bg-ucla-blue text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
        {/* Role filters shape learner analytics, but do not apply to the
            course-scoped issue queue. */}
        {activeTab !== "issues" && (
          <span className="ml-auto px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Learners</span>
        )}
        {activeTab !== "issues" && (["all", "fellow", "resident"] as const).map((filter) => {
          const count = filter === "all" ? fellows.length : filter === "fellow" ? fellowCount : residentCount;
          const label = filter === "all" ? "All" : filter === "fellow" ? "Fellows" : "Residents";
          const isActive = roleFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setRoleFilter(filter)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive ? "text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={isActive ? { backgroundColor: "#2774AE" } : undefined}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* ════════ OVERVIEW TAB ════════ */}
      {activeTab === "overview" && (
        <>
          {/* ─── A. COHORT SUMMARY CARDS ─── */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
            <SummaryCard label="Learners Enrolled" value={String(fellows.length)} sub={`${fellowCount} Fellows · ${residentCount} Residents`} color="#2774AE" />
            <SummaryCard label="Avg Pre-Quiz" value={stats.avgPre !== null ? `${stats.avgPre}%` : "--"} color="#d97706" />
            <SummaryCard label="Avg Post-Quiz" value={stats.avgPost !== null ? `${stats.avgPost}%` : "--"} color="#16a34a" />
            <SummaryCard
              label="Avg Improvement"
              value={stats.avgImprovement !== null ? `${stats.avgImprovement > 0 ? "+" : ""}${stats.avgImprovement}%` : "--"}
              color="#005587"
              arrow={stats.avgImprovement !== null ? (stats.avgImprovement > 0 ? "up" : stats.avgImprovement < 0 ? "down" : undefined) : undefined}
            />
            <SummaryCard label="Avg Pre-Confidence" value={stats.avgPreConf !== null ? `${stats.avgPreConf}/5` : "--"} color="#d97706" />
            <SummaryCard label="Avg Post-Confidence" value={stats.avgPostConf !== null ? `${stats.avgPostConf}/5` : "--"} color="#16a34a" />
            <SummaryCard label="Completion Rate" value={`${stats.completionRate}%`} color="#005587" />
          </div>

          <TrackedFellowsPanel
            rows={trackedFellowRows}
            course={selectedCourse}
            totalModules={totalModules}
            onSelectLearner={handleJumpToLearner}
          />

          <MedicalQaReadinessPanel course={selectedCourse} />

          <StatusFunnel
            fellows={filteredFellows}
            course={selectedCourse}
            totalModules={totalModules}
            postQuizTotal={POST_QUIZ_TOTAL}
            active={statusFilter}
            onSelect={handleFunnelSelect}
          />

          <NeedsAttentionPanel
            fellows={filteredFellows}
            course={selectedCourse}
            totalModules={totalModules}
            postQuizTotal={POST_QUIZ_TOTAL}
            onSelectLearner={handleJumpToLearner}
          />

          {/* ─── B. PRE VS POST SCORE CHART ─── */}
          {scoreComparison.length > 0 && (
            <Section title="Pre vs Post Quiz Scores" subtitle="Sorted by improvement (biggest improvers first)">
              <div className="space-y-4">
                {scoreComparison.map((item) => (
                  <div key={item.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{item.name}</span>
                      <span className="text-xs font-semibold" style={{ color: item.improvement >= 0 ? "#16a34a" : "#dc2626" }}>
                        {item.improvement > 0 ? "+" : ""}{item.improvement}%
                      </span>
                    </div>
                    <div className="space-y-1">
                      <HBar value={item.pre} max={100} color="#d97706" label="Pre" />
                      <HBar value={item.post} max={100} color="#16a34a" label="Post" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: "#d97706" }} /> Pre-Quiz
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: "#16a34a" }} /> Post-Quiz
                </div>
              </div>
            </Section>
          )}
        </>
      )}

      {/* ════════ INSIGHTS TAB ════════ */}
      {activeTab === "insights" && (
        <>
          <TestQualityPanel fellows={filteredFellows} course={selectedCourse} />

          <ResearchSummaryPanel fellows={filteredFellows} course={selectedCourse} />

          <DomainMasteryPanel fellows={filteredFellows} course={selectedCourse} />

          <ModuleHeatmapPanel fellows={filteredFellows} course={selectedCourse} />

          <ItemAnalysisTable fellows={filteredFellows} course={selectedCourse} />

          <ConfidenceCalibrationPanel fellows={filteredFellows} course={selectedCourse} />

          <EngagementPanel
            fellows={filteredFellows}
            course={selectedCourse}
            totalModules={totalModules}
            postQuizTotal={POST_QUIZ_TOTAL}
          />
        </>
      )}

      {/* ════════ LEARNERS TAB ════════ */}
      {activeTab === "learners" && (
        <>
          {/* ─── D. FELLOWS TABLE ─── */}
          <Section title="Learners" subtitle={`${displayedFellows.length} shown`}>
            {statusFilter && (
              <div className="mb-3">
                <button
                  onClick={() => setStatusFilter(null)}
                  title="Clear status filter"
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[statusFilter] }} />
                  Showing: {statusFilter}
                  <span aria-hidden="true" className="text-gray-500">&#10005;</span>
                </button>
              </div>
            )}
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-left text-sm min-w-[1080px]">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: "#2774AE" }}>
                    {["Name", "Email", "Role", "Pre-Quiz", "Post-Quiz", "Impr.", "Pre-Conf.", "Post-Conf.", "Normal MRI", "Modules", "Cases", "Status", "Last Active"].map(
                      (h) => (
                        <th key={h} className="pb-3 pr-3 font-semibold text-gray-700 whitespace-nowrap text-xs uppercase tracking-wide">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayedFellows.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="py-12 text-center text-gray-500">
                        No learners found.
                      </td>
                    </tr>
                  ) : (
                    displayedFellows.map((f) => {
                      const isResident = f.role === "resident";
                      const userTotalCases = isResident ? residentRequiredCaseCount : totalCases;
                      const preAvg = avgConfidence(f.preSurveyResponses);
                      const postAvg = avgConfidence(f.postSurveyResponses);
                      const prePct = f.preQuizScore !== null ? pct(f.preQuizScore, f.preQuizTotal ?? PRE_QUIZ_TOTAL) : null;
                      const postPct = f.postQuizScore !== null ? pct(f.postQuizScore, f.postQuizTotal ?? POST_QUIZ_TOTAL) : null;
                      const improvement = prePct !== null && postPct !== null ? postPct - prePct : null;
                      const isExpanded = expandedFellow === f.id;
                      const status = fellowStatus(f, totalModules, userTotalCases, selectedCourse, POST_QUIZ_TOTAL);

                      return (
                        <Fragment key={f.id}>
                          <tr
                            id={`fellow-row-${f.id}`}
                            className={`cursor-pointer transition-colors ${jumpTarget === f.id ? "bg-blue-50" : "hover:bg-blue-50/40"}`}
                            onClick={() => setExpandedFellow(isExpanded ? null : f.id)}
                          >
                            <td className="py-3 pr-3 font-medium text-gray-900 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] transition-transform ${isExpanded ? "rotate-90" : ""}`} style={{ color: "#2774AE" }}>
                                  &#9654;
                                </span>
                                {fellowName(f)}
                              </div>
                            </td>
                            <td className="py-3 pr-3 text-gray-500 text-xs">{f.email || "--"}</td>
                            <td className="py-3 pr-3" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={f.role || "fellow"}
                                onChange={(e) => handleRoleChange(f.id, e.target.value as "fellow" | "resident")}
                                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 cursor-pointer hover:border-gray-400 transition-colors"
                              >
                                <option value="fellow">Fellow</option>
                                <option value="resident">Resident</option>
                              </select>
                            </td>
                            <td className="py-3 pr-3">
                              {f.preQuizScore !== null ? (
                                <span>
                                  {f.preQuizScore}/{f.preQuizTotal ?? PRE_QUIZ_TOTAL}{" "}
                                  <span className="font-semibold" style={{ color: prePct! >= 70 ? "#16a34a" : "#d97706" }}>
                                    ({prePct}%)
                                  </span>
                                </span>
                              ) : (
                                <span className="text-gray-300">--</span>
                              )}
                            </td>
                            <td className="py-3 pr-3">
                              {f.postQuizScore !== null ? (
                                <span>
                                  {f.postQuizScore}/{f.postQuizTotal ?? POST_QUIZ_TOTAL}{" "}
                                  <span className="font-semibold" style={{ color: postPct! >= 70 ? "#16a34a" : "#d97706" }}>
                                    ({postPct}%){postPct! >= 70 ? " ✓" : ""}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-gray-300">--</span>
                              )}
                            </td>
                            <td className="py-3 pr-3">
                              {improvement !== null ? (
                                <span className="font-semibold" style={{ color: improvement >= 0 ? "#16a34a" : "#dc2626" }}>
                                  {improvement > 0 ? "+" : ""}{improvement}%
                                </span>
                              ) : (
                                <span className="text-gray-300">--</span>
                              )}
                            </td>
                            <td className="py-3 pr-3">
                              {preAvg !== null ? (
                                <span className="font-semibold" style={{ color: preAvg >= 4 ? "#16a34a" : preAvg >= 3 ? "#2774AE" : "#d97706" }}>
                                  {preAvg.toFixed(1)}/5
                                </span>
                              ) : (
                                <span className="text-gray-300">--</span>
                              )}
                            </td>
                            <td className="py-3 pr-3">
                              {postAvg !== null ? (
                                <span className="font-semibold" style={{ color: postAvg >= 4 ? "#16a34a" : postAvg >= 3 ? "#2774AE" : "#d97706" }}>
                                  {postAvg.toFixed(1)}/5
                                </span>
                              ) : (
                                <span className="text-gray-300">--</span>
                              )}
                            </td>
                            <td className="py-3 pr-3">
                              <span
                                className={`text-xs font-semibold ${
                                  f.normalMriComplete ? "text-green-700" : "text-gray-600"
                                }`}
                              >
                                {normalMriProgressLabel(f, selectedCourse)}
                              </span>
                            </td>
                            <td className="py-3 pr-3">
                              <span className="text-gray-900">{f.modulesCompleted}</span>
                              <span className="text-gray-500">/{totalModules}</span>
                            </td>
                            <td className="py-3 pr-3">
                              <span className="text-gray-900">{Math.min(f.casesCompleted, userTotalCases)}</span>
                              <span className="text-gray-500">/{userTotalCases}</span>
                            </td>
                            <td className="py-3 pr-3">
                              <div className="flex items-center gap-2">
                                <StatusBadge status={status} />
                                {status === "Complete" && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleSendCertificate(f.id); }}
                                    disabled={sendingCertIds.has(f.id)}
                                    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                                      f.certificateSent
                                        ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
                                        : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                                    } disabled:opacity-50`}
                                    title={f.certificateSent ? "Resend certificate email" : "Send certificate email"}
                                  >
                                    {sendingCertIds.has(f.id) ? (
                                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                      </svg>
                                    )}
                                    {f.certificateSent ? "Resend" : "Send Cert"}
                                  </button>
                                )}
                                {certResult?.userId === f.id && (
                                  <span className={`text-[10px] ${certResult.type === "success" ? "text-green-600" : "text-red-700"}`}>
                                    {certResult.message}
                                  </span>
                                )}
                                {certResult?.userId === f.id && certResult.type === "error" && certResult.canForce && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleSendCertificate(f.id, true); }}
                                    disabled={sendingCertIds.has(f.id)}
                                    className="rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                                    title="Send the certificate despite incomplete requirements (recorded as an override)"
                                  >
                                    Send anyway
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="py-3 text-xs text-gray-500 whitespace-nowrap">
                              {formatDate(f.lastActive || f.lastLoginAt)}
                            </td>
                          </tr>

                          {/* ─── E. EXPANDED FELLOW DETAIL ─── */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={13} className="bg-gray-50/80 px-6 py-5 border-l-4" style={{ borderColor: "#2774AE" }}>
                                <FellowDetail fellow={f} course={selectedCourse} />
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Section>

          {/* ─── ADMIN TOOLS: FORCE COMPLETE ─── */}
          <Section title="Admin Tools" subtitle="Force Complete Module">
            <div className="space-y-4">
              {/* Fellow selector */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Select Learner</label>
                <select
                  value={fcSelectedFellow}
                  onChange={(e) => { setFcSelectedFellow(e.target.value); setFcResult(null); }}
                  className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-[#2774AE] focus:ring-1 focus:ring-[#2774AE] outline-none"
                >
                  <option value="">-- Choose a learner --</option>
                  {fellows.map((f) => (
                    <option key={f.id} value={f.id}>
                      {fellowName(f)} {f.email ? `(${f.email})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Module checkboxes */}
              {fcSelectedFellow && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Select Modules to Complete</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCourse.modules.map((mod) => {
                      const selected = fcSelectedModules.has(mod.id);
                      const fellowData = fellows.find((f) => f.id === fcSelectedFellow);
                      const alreadyDone = (fellowData?.moduleProgress || []).some((mp) => mp.id === mod.id && mp.completed);
                      const quizCount = (moduleQuizzes[mod.id] ?? []).length;
                      return (
                        <label
                          key={mod.id}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                            alreadyDone
                              ? "bg-green-50 border-green-200 text-green-700"
                              : selected
                              ? "bg-blue-50 border-[#2774AE] text-gray-900"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            disabled={alreadyDone}
                            onChange={() => toggleFcModule(mod.id)}
                            className="accent-[#2774AE]"
                          />
                          <span className="flex-1">
                            {mod.number}. {mod.title}
                            {alreadyDone && <span className="ml-1 text-green-600 text-xs">(done)</span>}
                          </span>
                          <span className="text-xs text-gray-500">{quizCount}q</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action button + feedback */}
              {fcSelectedFellow && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleForceComplete}
                    disabled={fcBusy || fcSelectedModules.size === 0}
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#2774AE" }}
                    onMouseOver={(e) => { if (!fcBusy && fcSelectedModules.size > 0) e.currentTarget.style.backgroundColor = "#005587"; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#2774AE"; }}
                  >
                    {fcBusy ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Completing...
                      </>
                    ) : (
                      <>Force Complete Selected ({fcSelectedModules.size})</>
                    )}
                  </button>
                  {fcResult && (
                    <span className={`text-sm font-medium ${fcResult.type === "success" ? "text-green-600" : "text-red-600"}`}>
                      {fcResult.message}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Section>
        </>
      )}

      {activeTab === "issues" && <IssueReportsPanel course={selectedCourse} />}
    </div>
  );
}

/* ───────── Sub-components ───────── */

function TrackedFellowsPanel({
  rows,
  course,
  totalModules,
  onSelectLearner,
}: {
  rows: TrackedFellowRow[];
  course: CourseDefinition;
  totalModules: number;
  onSelectLearner: (id: string) => void;
}) {
  const foundCount = rows.filter((row) => row.fellow).length;
  const attentionCount = rows.filter((row) => row.nextStepTone === "attention" || row.nextStepTone === "waiting").length;
  const completeCount = rows.filter((row) => row.status === "Complete").length;

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Tracked Sports Medicine Fellows</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Riley Coon, Sonal Singh, and Lilian Toaspern in the selected {course.shortTitle} cohort.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center sm:w-[360px]">
          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <p className="text-lg font-bold text-ucla-dark">{foundCount}/3</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Signed in</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <p className="text-lg font-bold text-green-700">{completeCount}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Complete</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <p className="text-lg font-bold text-amber-700">{attentionCount}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Needs check</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {rows.map((row) => {
          const fellow = row.fellow;
          const postPct =
            fellow && fellow.postQuizScore !== null
              ? pct(fellow.postQuizScore, fellow.postQuizTotal ?? getPostQuizQuestions(course).length)
              : null;
          const caseTotal = fellow ? totalCasesForRole(course, fellow.role) : 0;
          const caseValue = !fellow
            ? "--"
            : `${Math.min(fellow.casesCompleted, caseTotal)}/${caseTotal}`;
          const nextClass =
            row.nextStepTone === "done"
              ? "border-green-200 bg-green-50 text-green-800"
              : row.nextStepTone === "attention"
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : row.nextStepTone === "waiting"
                  ? "border-gray-200 bg-gray-50 text-gray-600"
                  : "border-blue-200 bg-blue-50 text-blue-800";
          const inactive = row.daysInactive !== null && row.daysInactive >= 14;

          return (
            <article
              key={row.targetName}
              className={`rounded-xl border bg-white p-4 shadow-sm ${
                fellow ? "border-gray-200" : "border-dashed border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-gray-900">{row.targetName}</h3>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{fellow?.email ?? "No learner account matched yet"}</p>
                </div>
                {row.status ? (
                  <StatusBadge status={row.status} />
                ) : (
                  <span className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                    Waiting
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-600">Course progress</span>
                  <span className="font-bold text-gray-900">{row.progressPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-ucla-blue"
                    style={{ width: `${Math.min(Math.max(row.progressPct, 0), 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <TrackedMetric label="Normal MRI" value={row.normalMri} />
                <TrackedMetric label="Modules" value={fellow ? `${fellow.modulesCompleted}/${totalModules}` : "--"} />
                <TrackedMetric label="Cases" value={caseValue} />
                <TrackedMetric label="Post Quiz" value={postPct !== null ? `${postPct}%` : "--"} />
              </div>

              <div className={`mt-4 rounded-lg border px-3 py-2 text-xs font-semibold ${nextClass}`}>
                {row.nextStep}
              </div>

              <div className="mt-3 flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                <span className={inactive ? "font-semibold text-amber-700" : ""}>
                  {fellow ? `Last active: ${formatDateTime(lastSeen(fellow))}` : "Waiting for first login"}
                </span>
                <button
                  type="button"
                  onClick={() => fellow && onSelectLearner(fellow.id)}
                  disabled={!fellow}
                  className="self-start rounded-lg border border-ucla-blue/30 px-3 py-1.5 text-xs font-semibold text-ucla-dark transition-colors hover:bg-ucla-light disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent sm:self-auto"
                >
                  Open row
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TrackedMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-0.5 truncate text-xs font-bold text-gray-900">{value}</p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
  arrow,
  sub,
}: {
  label: string;
  value: string;
  color: string;
  arrow?: "up" | "down";
  sub?: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-4 text-center shadow-sm">
      <div className="flex items-center justify-center gap-1">
        {arrow === "up" && <span style={{ color }} className="text-lg">&#9650;</span>}
        {arrow === "down" && <span style={{ color }} className="text-lg">&#9660;</span>}
        <p className="text-2xl font-bold" style={{ color }}>
          {value}
        </p>
      </div>
      <p className="text-[11px] text-gray-500 mt-1 leading-tight">{label}</p>
      {sub && <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

/* ───────── Fellow Detail Panel ───────── */

function FellowDetail({ fellow, course }: { fellow: Fellow; course: CourseDefinition }) {
  const moduleMap = new Map(course.modules.map((m) => [m.id, m]));
  const caseMap = new Map(course.cases.map((c) => [c.id, c]));
  const confidenceStatements = course.confidenceStatements;

  // Build a timeline of all completions
  type TimelineItem = { label: string; date: { seconds: number }; type: "module" | "case" | "quiz" | "survey" };
  const timeline: TimelineItem[] = [];
  (fellow.moduleProgress || []).forEach((mp) => {
    if (mp.completedAt) {
      const mod = moduleMap.get(mp.id);
      timeline.push({ label: mod ? `Module: ${mod.title}` : `Module: ${mp.id}`, date: mp.completedAt, type: "module" });
    }
  });
  (fellow.caseAttempts || []).forEach((ca) => {
    if (ca.completedAt) {
      const c = caseMap.get(ca.caseId);
      timeline.push({ label: c ? `Case: ${c.title}` : `Case: ${ca.caseId}`, date: ca.completedAt, type: "case" });
    }
  });
  timeline.sort((a, b) => a.date.seconds - b.date.seconds);

  const completedCaseIds = new Set((fellow.caseAttempts || []).map((ca) => ca.caseId));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Confidence by Domain */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Confidence by Domain</h3>
        <div className="space-y-2">
          {confidenceStatements.map((stmt) => {
            const preRating = fellow.preSurveyResponses?.find((r) => r.statementId === stmt.id)?.rating ?? null;
            const postRating = fellow.postSurveyResponses?.find((r) => r.statementId === stmt.id)?.rating ?? null;
            const change = preRating !== null && postRating !== null ? postRating - preRating : null;
            const changeColor = change !== null ? (change > 0 ? "#16a34a" : change < 0 ? "#dc2626" : "#d97706") : "#9ca3af";

            return (
              <div key={stmt.id} className="rounded-lg border border-gray-200 bg-white p-2.5">
                <p className="text-xs font-medium text-gray-700 mb-1">
                  {stmt.domain.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-500">
                    Pre: <span className="font-semibold text-gray-900">{preRating ?? "--"}</span>/5
                  </span>
                  <span className="text-gray-300">&rarr;</span>
                  <span className="text-gray-500">
                    Post: <span className="font-semibold text-gray-900">{postRating ?? "--"}</span>/5
                  </span>
                  {change !== null && (
                    <span className="font-bold" style={{ color: changeColor }}>
                      {change > 0 ? `+${change}` : change}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {/* Normal MRI Workstation */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Normal MRI Workstation</h3>
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-gray-700">Plane Mastery Checks</span>
              <span
                className={`text-sm font-bold ${
                  fellow.normalMriComplete || !hasNormalMriWorkstation(course) ? "text-green-700" : "text-amber-700"
                }`}
              >
                {normalMriProgressLabel(fellow, course)}
              </span>
            </div>
          </div>
        </div>

        {/* Module Quiz Scores */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Module Progress</h3>
          <div className="space-y-1.5">
            {course.modules.map((mod) => {
              const mp = (fellow.moduleProgress || []).find((m) => m.id === mod.id);
              const completed = mp?.completed;
              return (
                <div key={mod.id} className="flex items-center gap-2 text-xs">
                  <span style={{ color: completed ? "#16a34a" : "#d1d5db" }} className="text-sm">
                    {completed ? "✓" : "○"}
                  </span>
                  <span className={`flex-1 ${completed ? "text-gray-900" : "text-gray-500"}`}>
                    {mod.number}. {mod.title}
                  </span>
                  {mp?.quizScore != null && mp?.quizTotal != null && mp.quizTotal > 0 && (
                    /* Only show a score when a real attempt exists. A `|| 5`
                       fallback invented a length and produced a bogus pass/fail
                       colour; force-complete writes null score/total so this
                       (and the heatmap/CSV aggregations) correctly show nothing. */
                    <span className="font-semibold" style={{ color: pct(mp.quizScore, mp.quizTotal) >= 70 ? "#16a34a" : "#d97706" }}>
                      {mp.quizScore}/{mp.quizTotal}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cases Completed */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Cases Completed</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {course.cases.map((c) => {
              const done = completedCaseIds.has(c.id);
              return (
                <div key={c.id} className="flex items-center gap-2 text-xs">
                  <span style={{ color: done ? "#16a34a" : "#d1d5db" }} className="text-sm">
                    {done ? "✓" : "○"}
                  </span>
                  <span className={done ? "text-gray-900" : "text-gray-500"}>{c.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        {timeline.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Completion Timeline</h3>
            <div className="space-y-1">
              {timeline.map((item) => {
                const typeColor = item.type === "module" ? "#2774AE" : item.type === "case" ? "#005587" : "#d97706";
                return (
                  <div key={`${item.type}-${item.label}-${item.date.seconds}`} className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500 w-24 shrink-0 text-right">{formatDateTime(item.date)}</span>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: typeColor }} />
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
