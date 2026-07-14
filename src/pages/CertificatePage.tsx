import { Link } from "react-router-dom";
import type { jsPDF } from "jspdf";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import {
  CERTIFICATE_PASS_THRESHOLD,
  hasCompletedRequirements,
  meetsPassThreshold,
  postScorePct,
} from "@/lib/completion";
import {
  coursePath,
  defaultCourse,
  getPreQuizQuestions,
  getPostQuizQuestions,
  getVisibleCoreCases,
  normalMriTitle,
  requiredCoreCaseCount,
} from "@/content/courses";

/* ─── helpers ─── */
const UCLA_BLUE = "#2774AE";
const UCLA_DARK = "#003B5C";
const UCLA_GOLD = "#FFD100";
const GRAY_400 = "#9CA3AF";
const GRAY_600 = "#4B5563";
const GRAY_900 = "#111827";
const GREEN_600 = "#059669";

function pct(score: number, total: number) {
  return total > 0 ? Math.round((score / total) * 100) : 0;
}

/* ─── PDF generator (vector, no screenshot) ─── */
// jsPDF (~400 KB) is dynamically imported here so it loads ONLY when a learner
// actually downloads — the certificate page itself (requirements checklist /
// preview) stays light even before the course is finished.
async function generatePdf({
  fellowName,
  completionDate,
  modulesCount,
  casesCount,
  preScore,
  postScore,
  preTotal,
  postTotal,
  courseTitle,
  trackLabel,
  footerText,
  fileSlug,
}: {
  fellowName: string;
  completionDate: string;
  modulesCount: number;
  casesCount: number;
  preScore: number;
  postScore: number;
  preTotal: number;
  postTotal: number;
  courseTitle: string;
  trackLabel: string;
  footerText: string;
  fileSlug: string;
}) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth(); // 612
  const H = doc.internal.pageSize.getHeight(); // 792
  const CX = W / 2;

  /* ── Gold decorative border ── */
  doc.setDrawColor(UCLA_GOLD);
  doc.setLineWidth(4);
  doc.rect(24, 24, W - 48, H - 48);
  doc.setLineWidth(1.5);
  doc.rect(32, 32, W - 64, H - 64);

  /* ── Blue header bar ── */
  doc.setFillColor(UCLA_BLUE);
  doc.rect(32, 32, W - 64, 90, "F");

  /* header text */
  doc.setTextColor("#FFFFFF");
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("UNIVERSITY OF CALIFORNIA, LOS ANGELES", CX, 66, { align: "center" });
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Certificate of Completion", CX, 100, { align: "center" });

  /* ── Gold seal circle ── */
  const sealY = 172;
  doc.setDrawColor(UCLA_GOLD);
  doc.setLineWidth(3);
  doc.setFillColor("#FFF9E0");
  doc.circle(CX, sealY, 28, "FD");
  // Trophy-like icon inside seal (simple star)
  doc.setFillColor(UCLA_GOLD);
  const starPoints = buildStar(CX, sealY, 16, 8, 5);
  drawPolygon(doc, starPoints);

  /* ── "This certifies that" ── */
  let y = 224;
  doc.setTextColor(GRAY_400);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("This certifies that", CX, y, { align: "center" });

  /* ── Fellow name ── */
  y += 32;
  doc.setTextColor(UCLA_DARK);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text(fellowName, CX, y, { align: "center" });

  /* underline under name */
  const nameWidth = doc.getTextWidth(fellowName);
  doc.setDrawColor(UCLA_GOLD);
  doc.setLineWidth(1.5);
  doc.line(CX - nameWidth / 2, y + 6, CX + nameWidth / 2, y + 6);

  /* ── Description ── */
  y += 36;
  doc.setTextColor(GRAY_600);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("has successfully completed the", CX, y, { align: "center" });

  y += 26;
  doc.setTextColor(GRAY_900);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(courseTitle, CX, y, { align: "center" });

  y += 22;
  doc.setTextColor(GRAY_600);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(trackLabel, CX, y, { align: "center" });

  /* ── Course stats ── */
  y += 44;
  doc.setTextColor(GRAY_400);
  doc.setFontSize(10);
  doc.text(
    `${modulesCount} modules completed  |  ${casesCount} case studies reviewed  |  Pre & Post assessments`,
    CX,
    y,
    { align: "center" }
  );

  /* ── Score boxes ── */
  y += 36;
  const boxW = 130;
  const boxH = 64;
  const gap = 20;
  const prePercent = pct(preScore, preTotal);
  const postPercent = pct(postScore, postTotal);
  const improvement = postPercent - prePercent;

  // Pre-Assessment box
  const x1 = CX - boxW - gap / 2 - boxW / 2;
  drawScoreBox(doc, x1, y, boxW, boxH, "Pre-Assessment", `${prePercent}%`, GRAY_600);
  // Post-Assessment box
  const x2 = CX - boxW / 2;
  drawScoreBox(doc, x2, y, boxW, boxH, "Post-Assessment", `${postPercent}%`, UCLA_BLUE);
  // Improvement box
  const x3 = CX + gap / 2 + boxW / 2;
  const impColor = improvement > 0 ? GREEN_600 : improvement < 0 ? "#DC2626" : GRAY_600;
  const impText = `${improvement > 0 ? "+" : ""}${improvement}%`;
  drawScoreBox(doc, x3, y, boxW, boxH, "Improvement", impText, impColor);

  /* ── Signature lines ── */
  y += boxH + 60;
  const lineW = 180;

  // Left: Date
  doc.setDrawColor(GRAY_400);
  doc.setLineWidth(0.75);
  doc.line(CX - 200, y, CX - 200 + lineW, y);
  doc.setTextColor(GRAY_900);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(completionDate, CX - 200, y + 16);
  doc.setTextColor(GRAY_400);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Date of Completion", CX - 200, y + 30);

  // Right: Course Director
  doc.setDrawColor(GRAY_400);
  doc.line(CX + 20, y, CX + 20 + lineW, y);
  doc.setTextColor(GRAY_900);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Jeremy Swisher, MD", CX + 20, y + 16);
  doc.setTextColor(GRAY_400);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Course Director", CX + 20, y + 30);

  /* ── Footer ── */
  const footerY = H - 52;
  doc.setDrawColor(UCLA_GOLD);
  doc.setLineWidth(1);
  doc.line(48, footerY, W - 48, footerY);
  doc.setTextColor(GRAY_400);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    footerText,
    CX,
    footerY + 16,
    { align: "center" }
  );

  doc.save(`${fileSlug}_Certificate_${fellowName.replace(/\s+/g, "_")}.pdf`);
}

function drawScoreBox(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  color: string
) {
  doc.setDrawColor("#E5E7EB");
  doc.setLineWidth(0.75);
  doc.setFillColor("#F9FAFB");
  doc.roundedRect(x, y, w, h, 4, 4, "FD");
  doc.setTextColor(GRAY_400);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(label, x + w / 2, y + 18, { align: "center" });
  doc.setTextColor(color);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(value, x + w / 2, y + 46, { align: "center" });
}

function buildStar(cx: number, cy: number, outerR: number, innerR: number, points: number) {
  const coords: [number, number][] = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI / 2) * -1 + (Math.PI / points) * i;
    const r = i % 2 === 0 ? outerR : innerR;
    coords.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
  }
  return coords;
}

function drawPolygon(doc: jsPDF, points: [number, number][]) {
  if (points.length < 3) return;
  doc.setLineWidth(0);
  // Build path manually
  const lines: number[][] = [];
  for (let i = 1; i < points.length; i++) {
    lines.push([points[i][0], points[i][1]]);
  }
  doc.triangle(
    points[0][0], points[0][1],
    points[1][0], points[1][1],
    points[2][0], points[2][1],
    "F"
  );
  // Fill the full star with small triangles from centre
  const cx = points.reduce((s, p) => s + p[0], 0) / points.length;
  const cy = points.reduce((s, p) => s + p[1], 0) / points.length;
  for (let i = 0; i < points.length; i++) {
    const next = (i + 1) % points.length;
    doc.triangle(cx, cy, points[i][0], points[i][1], points[next][0], points[next][1], "F");
  }
}

/* ─── Component ─── */
export default function CertificatePage() {
  const { user, role } = useAuth();
  const activeCourse = useActiveCourse();
  const { progress, loading } = useProgress(activeCourse);
  const isResident = role === "resident";

  // Each administered quiz uses only its mapped subset for this course.
  const PRE_QUIZ_TOTAL = getPreQuizQuestions(activeCourse).length;
  const POST_QUIZ_TOTAL = getPostQuizQuestions(activeCourse).length;
  const isKneeCourse = activeCourse.id === defaultCourse.id;
  // Certificate copy — preserve the exact knee wording; derive shoulder/other from the course.
  const certCourseTitle = activeCourse.title;
  const trackLabel = isKneeCourse
    ? (isResident ? "Knee MRI Fundamentals — Resident Track" : "for Sports Medicine Fellows")
    : (isResident ? `${activeCourse.shortTitle} — Resident Track` : `for ${activeCourse.audience}`);
  const certFooter = isKneeCourse
    ? (isResident
        ? "UCLA Division of Sports Medicine  |  Knee MRI Fundamentals for Resident Physicians"
        : "UCLA Division of Sports Medicine  |  Knee MRI Interpretation Course for Sports Medicine Fellows")
    : `UCLA Division of Sports Medicine  |  ${activeCourse.title}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  const preAssessmentComplete =
    progress?.preQuizCompleted && progress?.preSurveyCompleted;
  const modulesCompleted = progress?.modulesCompleted ?? 0;
  const totalModules = activeCourse.modules.length;
  const requiredCases = getVisibleCoreCases(activeCourse, isResident);
  const requiredCaseIds = new Set(requiredCases.map(c => c.id));
  const completedCaseIds = new Set(
    (progress?.caseAttempts?.map((c) => c.caseId) ?? [])
      .filter((id: string) => requiredCaseIds.has(id))
  );
  const casesCompleted = completedCaseIds.size;
  const requiredCaseCount = requiredCoreCaseCount(activeCourse, isResident);
  const postAssessmentComplete =
    progress?.postQuizCompleted && progress?.postSurveyCompleted;
  const normalTitle = normalMriTitle(activeCourse);
  const hasWorkstation = (progress?.totalNormalPlanes ?? 0) > 0;
  const requirementsDone = progress ? hasCompletedRequirements(progress, activeCourse) : false;
  const scorePassed = progress ? meetsPassThreshold(progress, activeCourse) : false;

  /* ─── Requirements remaining: show checklist ─── */
  if (!requirementsDone) {
    const remaining: { label: string; done: boolean; detail: string }[] = [
      {
        label: "Pre-Assessment",
        done: !!preAssessmentComplete,
        detail: preAssessmentComplete ? "Complete" : "Quiz and survey required",
      },
      {
        label: "Modules",
        done: modulesCompleted === totalModules,
        detail: `${modulesCompleted}/${totalModules} completed`,
      },
      ...(hasWorkstation
        ? [
            {
              label: `Interactive ${normalTitle}`,
              done: !!progress?.normalMriComplete,
              detail: `${progress?.normalPlanesPassed ?? 0}/${progress?.totalNormalPlanes ?? 0} planes passed`,
            },
          ]
        : []),
      {
        label: "Cases",
        done: casesCompleted >= requiredCaseCount,
        detail: `${Math.min(casesCompleted, requiredCaseCount)}/${requiredCaseCount} required core cases reviewed`,
      },
      {
        label: "Post-Assessment",
        done: !!postAssessmentComplete,
        detail: postAssessmentComplete
          ? "Complete"
          : progress?.postQuizUnlocked
          ? "Available - quiz and survey required"
          : hasWorkstation
          ? `Locked - finish the baseline, the ${normalTitle}, all modules, and 3 core cases first`
          : "Locked - finish the baseline, modules, and 3 core cases first",
      },
    ];

    const requiredItems = remaining;
    const doneCount = requiredItems.filter((r) => r.done).length;
    const overallPct = Math.round((doneCount / requiredItems.length) * 100);

    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Certificate of Completion
        </h1>
        <p className="mt-1 text-gray-500">
          Complete all course requirements to unlock your certificate.
        </p>

        {/* Overall progress */}
        <Card className="mt-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Overall Progress
            </p>
            <p className="mt-2 text-4xl font-bold text-ucla-blue">{overallPct}%</p>
            <div className="mx-auto mt-3 h-3 w-full max-w-md rounded-full bg-gray-200">
              <div
                className="h-3 rounded-full bg-ucla-blue transition-all"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {doneCount} of {requiredItems.length} requirements met
            </p>
          </div>
        </Card>

        {/* Requirements checklist */}
        <Card className="mt-6 !p-0 divide-y divide-gray-100">
          {remaining.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    item.done
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.done ? (
                    <svg
                      className="h-3.5 w-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.detail}</p>
                </div>
              </div>
              <span
                className={`text-xs font-medium ${
                  item.done ? "text-green-600" : "text-amber-500"
                }`}
              >
                {item.done ? "Done" : "Remaining"}
              </span>
            </div>
          ))}
        </Card>

        <div className="mt-8 rounded-lg border border-ucla-blue/20 bg-ucla-light/30 px-6 py-5 text-center">
          <p className="text-sm font-medium text-ucla-dark">
            You're making great progress! Keep going to earn your certificate.
          </p>
          <div className="mt-3">
            <Link to={coursePath(activeCourse, "/")}>
              <Button size="sm">Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Everything done but score below threshold: explain the gap kindly ─── */
  if (!scorePassed) {
    const nearMissPct = progress ? postScorePct(progress) : null;
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Certificate of Completion
        </h1>
        <p className="mt-1 text-gray-500">
          One step remains: a passing score on the post-assessment.
        </p>

        <Card className="mt-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Post-Assessment Score
            </p>
            {nearMissPct !== null ? (
              <>
                <p className="mt-2 text-4xl font-bold text-amber-500">{nearMissPct}%</p>
                <p className="mt-2 text-sm text-gray-600">
                  Post-assessment: {nearMissPct}% &mdash; {CERTIFICATE_PASS_THRESHOLD}% needed
                  for the certificate
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                Your score couldn't be loaded &mdash; contact your course director.
                ({CERTIFICATE_PASS_THRESHOLD}% is needed for the certificate.)
              </p>
            )}
          </div>
        </Card>

        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-6 py-5">
          <p className="text-sm font-medium text-amber-800">
            You've finished every course requirement — great work. The certificate
            just needs a post-assessment score of {CERTIFICATE_PASS_THRESHOLD}% or
            higher, and you're close.
          </p>
          <p className="mt-2 text-sm text-amber-800">
            Ask your course director to arrange a retake of the post-assessment.
            In the meantime, revisiting the modules and your review cards is a
            great way to prepare — everything stays open to you.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link to={coursePath(activeCourse, "/modules")}>
              <Button size="sm">Review Modules</Button>
            </Link>
            <Link to={coursePath(activeCourse, "/")}>
              <Button variant="secondary" size="sm">Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Course complete: show certificate ─── */
  const fellowName = user?.displayName || user?.email || "Fellow";
  // Use the post-assessment completion timestamp if available, fall back to today
  const completionTimestamp =
    progress?.postSurveyCompletedAt?.seconds ??
    progress?.postQuizCompletedAt?.seconds ??
    null;
  const completionDate = (
    completionTimestamp
      ? new Date(completionTimestamp * 1000)
      : new Date()
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const preScore = progress?.preQuizScore ?? 0;
  const postScore = progress?.postQuizScore ?? 0;
  const preTotal = progress?.preQuizTotal ?? PRE_QUIZ_TOTAL;
  const postTotal = progress?.postQuizTotal ?? POST_QUIZ_TOTAL;
  const prePercent = pct(preScore, preTotal);
  const postPercent = pct(postScore, postTotal);
  const improvement = postPercent - prePercent;

  function handleDownload() {
    generatePdf({
      fellowName,
      completionDate,
      modulesCount: totalModules,
      casesCount: casesCompleted,
      fileSlug: `UCLA_${activeCourse.shortTitle.replace(/\s+/g, "_")}`,
      preScore,
      postScore,
      preTotal,
      postTotal,
      courseTitle: certCourseTitle,
      trackLabel,
      footerText: certFooter,
    }).catch(() => {});
  }

  return (
    <div>
      {/* Action bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link to={coursePath(activeCourse, "/")}>
          <Button variant="secondary" size="sm">
            &larr; Back to Dashboard
          </Button>
        </Link>
        <Button onClick={handleDownload}>
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download PDF
          </span>
        </Button>
      </div>

      {/* On-screen certificate preview */}
      <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border-4 border-ucla-gold bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003B5C] to-[#2774AE] px-8 py-6 text-center text-white">
          <p className="text-sm font-medium tracking-widest uppercase opacity-80">
            University of California, Los Angeles
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Certificate of Completion
          </h1>
        </div>

        {/* Body */}
        <div className="px-8 py-10 text-center">
          {/* Seal */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-ucla-gold bg-ucla-gold/10">
            <svg className="h-10 w-10 text-ucla-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 3h14c.6 0 1 .4 1 1v2c0 2.8-2 5.1-4.6 5.8-.4 1.4-1.5 2.5-2.9 2.9V17h3a1 1 0 110 2H8a1 1 0 110-2h3v-2.3c-1.4-.4-2.5-1.5-2.9-2.9C5.5 11.1 4 8.8 4 6V4c0-.6.4-1 1-1zm1 2v1c0 1.9 1.2 3.5 2.8 4.2.5-.3 1-.4 1.6-.4h1.2c.6 0 1.1.1 1.6.4C14.8 9.5 16 7.9 16 6V5H6z" />
            </svg>
          </div>

          <p className="text-sm text-gray-500">This certifies that</p>
          <h2 className="mt-2 text-2xl font-bold text-[#003B5C]">{fellowName}</h2>

          <p className="mt-4 text-sm text-gray-500">has successfully completed the</p>
          <h3 className="mt-1 text-xl font-semibold text-gray-900">
            {certCourseTitle}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{trackLabel}</p>

          {/* Scores */}
          <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Pre-Assessment</p>
              <p className="mt-1 text-xl font-bold text-gray-600">{prePercent}%</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Post-Assessment</p>
              <p className="mt-1 text-xl font-bold text-ucla-blue">{postPercent}%</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Improvement</p>
              <p
                className={`mt-1 text-xl font-bold ${
                  improvement > 0
                    ? "text-green-600"
                    : improvement < 0
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {improvement > 0 ? "+" : ""}
                {improvement}%
              </p>
            </div>
          </div>

          {/* Completion details */}
          <div className="mt-8 text-sm text-gray-500">
            <p>
              {totalModules} modules &middot; {casesCompleted} case studies &middot; Pre &amp; post
              assessments
            </p>
          </div>

          {/* Date and signature */}
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 gap-8">
            <div>
              <div className="border-t border-gray-300 pt-2">
                <p className="text-sm font-medium text-gray-700">{completionDate}</p>
                <p className="text-xs text-gray-500">Date of Completion</p>
              </div>
            </div>
            <div>
              <div className="border-t border-gray-300 pt-2">
                <p className="text-sm font-medium text-gray-700">Jeremy Swisher, MD</p>
                <p className="text-xs text-gray-500">
                  Course Director
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-ucla-gold/30 bg-[#DAEBFE]/30 px-8 py-3 text-center">
          <p className="text-xs text-gray-500">
            {certFooter.replace("  |  ", " · ")}
          </p>
        </div>
      </div>
    </div>
  );
}
