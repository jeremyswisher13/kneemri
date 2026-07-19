import { useMemo, useState } from "react";
import MriStackViewer from "@/components/ui/MriStackViewer";
import Card from "@/components/ui/Card";
import GuidedTour from "@/components/normal/GuidedTour";
import KnowledgeCheck, { type ShowInLearnArgs } from "@/components/normal/KnowledgeCheck";
import { isPassingMasteryScore } from "@/components/normal/knowledge-check-logic";
import AdvancedChallenge from "@/components/normal/AdvancedChallenge";
import ImageCaq from "@/components/normal/ImageCaq";
import PlaneCompare from "@/components/normal/PlaneCompare";
import ExploreChecklist from "@/components/normal/ExploreChecklist";
import CrossPlaneDrill from "@/components/normal/CrossPlaneDrill";
import CrossPlanePrimer from "@/components/normal/CrossPlanePrimer";
import MarkerAdjuster from "@/components/normal/MarkerAdjuster";
import NormalModeSwitcher from "@/components/normal/NormalModeSwitcher";
import NormalMriMasteryPanel from "@/components/normal/NormalMriMasteryPanel";
import NormalSeriesSelector from "@/components/normal/NormalSeriesSelector";
import {
  normalHipLearn,
  structureHipPearl,
  structureHipReading,
  structureHipCase,
  hipStructureCorrelate,
  hipAdvanced,
  hipImageCaq,
  hipCrossPlane,
} from "@/content/normal-hip-learn";
import { normalHipSeries as SERIES } from "@/content/normal-workstation-series";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdminView } from "@/hooks/useIsAdminView";
import { useNormalMriResume } from "@/hooks/useNormalMriResume";
import { useNormalIssueContext } from "@/hooks/useNormalIssueContext";
import { coursePath, visibleCaseIdsFor, getCourseById } from "@/content/courses";
import { workstationReviewId } from "@/content/review-id";
import { caseTeachingImageById } from "@/content/case-preview-images";
import {
  NORMAL_MRI_MODE_PARAM,
  RESTORABLE_NORMAL_MODES,
  NORMAL_MRI_SERIES_PARAM,
  readNormalParam,
} from "@/lib/normal-workstation-url";

const HIP_CASE_BASE = coursePath(getCourseById("hip-mri"), "/cases");

type Mode = "explore" | "tour" | "check" | "correlate" | "compare" | "advanced" | "caq" | "adjust";
// Read side of the persist/restore round-trip — shared with useNormalMriResume
// (see RESTORABLE_NORMAL_MODES) so the two can never drift apart again.
const RESTORABLE_MODES = RESTORABLE_NORMAL_MODES as readonly Mode[];
const MODES: { id: Mode; label: string }[] = [
  { id: "explore", label: "Explore" },
  { id: "tour", label: "Guided Tour" },
  { id: "check", label: "Practice & Mastery" },
];

/**
 * Interactive Normal Hip MRI — a "mini-workstation" of a real, de-identified
 * normal hip. Built on the same region-agnostic components as the knee/shoulder.
 * Add a SERIES entry per plane/sequence as the stacks are captured.
 */
// Coronal, axial, and sagittal are loaded; a dedicated T1 sequence could be added later.
const COMING_SOON: string[] = [];

export default function NormalHipMriPage() {
  const { user, role } = useAuth();
  const isAdmin = role === "admin";
  const isAdminView = useIsAdminView();
  // Residents are hard-gated out of some cases, so the guided tour must not
  // link them to one (it would dead-end on "Not Available").
  const visibleCaseIds = useMemo(
    () => visibleCaseIdsFor(getCourseById("hip-mri"), role === "resident"),
    [role],
  );
  const initialSearch = typeof window === "undefined" ? "" : window.location.search;
  const [activeId, setActiveId] = useState(() =>
    readNormalParam(initialSearch, NORMAL_MRI_SERIES_PARAM, SERIES.map((s) => s.id), SERIES[0].id),
  );
  const [mode, setMode] = useState<Mode>(() =>
    readNormalParam(initialSearch, NORMAL_MRI_MODE_PARAM, RESTORABLE_MODES, "explore"),
  );
  const [tourTarget, setTourTarget] = useState<ShowInLearnArgs | null>(null);
  const series = SERIES.find((s) => s.id === activeId) ?? SERIES[0];
  const learn = normalHipLearn[series.id];

  async function handleCheckComplete(planeId: string, score: number, total: number) {
    if (!user || isAdminView || !isPassingMasteryScore(score, total)) return;
    const { markNormalPlanePassed } = await import("@/lib/firestore");
    markNormalPlanePassed(user.uid, user.email || "", planeId, score, total).catch(() => {});
  }

  function handleMiss(itemId: string) {
    if (!user || isAdminView || !getCourseById("hip-mri").features.reviewCards) return;
    import("@/lib/firestore")
      .then(({ addWrongAnswerToReview }) =>
        addWrongAnswerToReview(user.uid, workstationReviewId("hip-mri", itemId), "workstation", "hip-mri"),
      )
      .catch(() => {});
  }

  function handleSeriesChange(id: string) {
    setActiveId(id);
    setTourTarget(null);
  }

  function handleModeChange(nextMode: Mode) {
    setTourTarget(null);
    setMode(nextMode);
  }

  function handleShowInLearn(args: ShowInLearnArgs) {
    setTourTarget(args);
    setMode("tour");
  }

  const baseModes: { id: Mode; label: string }[] = [
    ...MODES,
    ...(hipCrossPlane.length > 0 ? [{ id: "correlate" as Mode, label: "Cross-Plane" }] : []),
    { id: "compare" as Mode, label: "Compare" },
    ...(hipAdvanced.length > 0 ? [{ id: "advanced" as Mode, label: "Advanced" }] : []),
    ...(hipImageCaq.length > 0 ? [{ id: "caq" as Mode, label: "Image CAQ" }] : []),
  ];
  const visibleModes = isAdmin
    ? [...baseModes, { id: "adjust" as Mode, label: "Adjust (admin)" }]
    : baseModes;
  const modeLabel = visibleModes.find((item) => item.id === mode)?.label ?? "Explore";
  useNormalMriResume({
    courseId: "hip-mri",
    title: "Interactive Normal Hip MRI",
    modeId: mode,
    modeLabel,
    seriesId: series.id,
    seriesLabel: series.label,
  });
  const issueContext = useNormalIssueContext({
    mode,
    modeLabel,
    seriesId: series.id,
    seriesLabel: series.label,
    startIndex: series.startIndex ?? 0,
  });

  const slices = useMemo(
    () =>
      Array.from({ length: series.count }, (_, i) => ({
        src: `${series.dir}/slice_${String(i + 1).padStart(2, "0")}.jpg`,
        alt: `Normal hip — ${series.plane} — slice ${i + 1} of ${series.count}`,
      })),
    [series],
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Interactive Normal Hip MRI</h1>
      <p className="mt-1 text-gray-500">
        A real, de-identified normal hip MRI for anchoring the femoral head, acetabular rim,
        labrum, tendons, and marrow before pathology.
      </p>

      <NormalSeriesSelector
        series={SERIES}
        activeId={activeId}
        onSeriesChange={handleSeriesChange}
        comingSoon={COMING_SOON}
      />

      <NormalModeSwitcher modes={visibleModes} activeMode={mode} onModeChange={handleModeChange} />

      <NormalMriMasteryPanel
        courseId="hip-mri"
        activeMode={mode}
        activeModeLabel={modeLabel}
        seriesLabel={series.label}
        availableModes={visibleModes}
      />

      {/* ── Explore ─────────────────────────────────────────────────── */}
      {mode === "explore" && (
        <div className="mt-4 grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MriStackViewer
              slices={slices}
              title="Normal Hip"
              plane={series.plane}
              startIndex={series.startIndex}
              caption="Normal hip reference stack for comparing the femoral head, acetabular rim, labrum, tendons, and marrow across slices."
              attribution="De-identified normal hip MRI · UCLA Sports Medicine teaching collection"
              onSliceChange={issueContext.onSliceChange}
            />
          </div>
          <div>
            <ExploreChecklist plane={series.plane} items={series.checklist} />
          </div>
        </div>
      )}


      {/* ── Compare two planes ──────────────────────────────────────── */}
      {mode === "compare" && (
        <PlaneCompare
          planes={SERIES}
          attribution="De-identified normal hip MRI · UCLA Sports Medicine teaching collection"
          onContextChange={issueContext.onContextChange}
        />
      )}

      {/* ── Guided Tour ─────────────────────────────────────────────── */}
      {mode === "tour" && (
        <div className="mt-5">
          {learn ? (
            <GuidedTour
              dir={series.dir}
              steps={learn.tour}
              structureCase={structureHipCase}
              isCaseAvailable={(id) => visibleCaseIds.has(id)}
              structurePearl={structureHipPearl}
              structureReading={structureHipReading}
              structureCorrelate={hipStructureCorrelate}
              caseImageById={caseTeachingImageById}
              caseBasePath={HIP_CASE_BASE}
              focusTarget={tourTarget}
              onContextChange={issueContext.onContextChange}
            />
          ) : (
            <ComingSoonForPlane label={series.label} kind="guided tour" />
          )}
        </div>
      )}

      {/* ── Practice & Mastery ──────────────────────────────────────── */}
      {mode === "check" && (
        <div className="mt-5">
          {learn ? (
            <KnowledgeCheck
              key={series.id}
              dir={series.dir}
              items={learn.quiz}
              tour={learn.tour}
              planeLabel={series.label}
              onComplete={(s, t) => handleCheckComplete(`hip-${series.id}`, s, t)}
              onMiss={handleMiss}
              onShowInLearn={handleShowInLearn}
              onContextChange={issueContext.onContextChange}
            />
          ) : (
            <ComingSoonForPlane label={series.label} kind="practice and mastery check" />
          )}
        </div>
      )}

      {/* ── Cross-plane correlation ─────────────────────────────────── */}
      {mode === "correlate" && (
        <div className="mt-5">
          <p className="mb-4 text-sm text-gray-500">
            Match the same structure across planes — the skill that turns three 2-D stacks into one 3-D
            hip in your head.{" "}
            <span className="text-gray-500">This drill spans all planes (the chips above don&apos;t change it).</span>
          </p>
          <CrossPlanePrimer
            rules={[
              {
                label: "Anchor on the femoral head.",
                text: "The round ball in the socket is your fixed point on every plane — find it first, then place the labrum (rim), neck (below), and abductors (lateral) relative to it.",
              },
              {
                label: "Orient by soft tissue.",
                text: "The iliopsoas tendon marks ANTERIOR and the sciatic nerve marks POSTERIOR — use them to tell front from back on the axial and sagittal.",
              },
              {
                label: "Shape changes per plane.",
                text: "The labrum is a small low-signal triangle at the rim on every plane, and the femoral neck is a profile on sagittal but a column on coronal — confirm a finding on two planes.",
              },
            ]}
          />
          <CrossPlaneDrill items={hipCrossPlane} onContextChange={issueContext.onContextChange} />
        </div>
      )}

      {/* ── Advanced challenge ──────────────────────────────────────── */}
      {mode === "advanced" && (
        <div className="mt-5">
          <p className="mb-4 text-sm text-gray-500">
            Push your learning — higher-level hip-MRI questions beyond normal anatomy.{" "}
            <span className="text-gray-500">Optional; pick a topic and go as deep as you like.</span>
          </p>
          <AdvancedChallenge questions={hipAdvanced} onMiss={handleMiss} />
        </div>
      )}

      {/* ── Image-anchored CAQ ──────────────────────────────────────── */}
      {mode === "caq" && (
        <div className="mt-5">
          <p className="mb-4 text-sm text-gray-500">
            Board-style questions anchored to the real MRI — review the image stack, then commit to your answer.{" "}
            <span className="text-gray-500">Misses return in your spaced review.</span>
          </p>
          <ImageCaq questions={hipImageCaq} onMiss={handleMiss} onContextChange={issueContext.onContextChange} />
        </div>
      )}

      {/* ── Adjust (admin authoring workbench) ──────────────────────── */}
      {mode === "adjust" && isAdmin && (
        <div className="mt-5">
          {learn ? (
            <MarkerAdjuster
              key={series.id}
              planeId={`hip-${series.id}`}
              planeLabel={`Hip ${series.label}`}
              dir={series.dir}
              count={series.count}
              learn={learn}
            />
          ) : (
            <ComingSoonForPlane label={series.label} kind="adjust workbench" />
          )}
        </div>
      )}
    </div>
  );
}

function ComingSoonForPlane({ label, kind }: { label: string; kind: string }) {
  return (
    <Card>
      <p className="py-8 text-center text-sm text-gray-500">
        The {kind} for the <strong>{label}</strong> plane is coming soon.{" "}
        <strong>Explore</strong> has the reference stack.
      </p>
    </Card>
  );
}
