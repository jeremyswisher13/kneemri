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
  normalElbowLearn,
  structureElbowPearl,
  structureElbowReading,
  structureElbowCase,
  elbowStructureCorrelate,
  elbowAdvanced,
  elbowImageCaq,
  elbowCrossPlane,
} from "@/content/normal-elbow-learn";
import { normalElbowSeries as SERIES } from "@/content/normal-workstation-series";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdminView } from "@/hooks/useIsAdminView";
import { useNormalMriResume } from "@/hooks/useNormalMriResume";
import { useNormalIssueContext } from "@/hooks/useNormalIssueContext";
import { coursePath, getCourseById } from "@/content/courses";
import { workstationReviewId } from "@/content/review-id";
import { caseTeachingImageById } from "@/content/case-preview-images";
import {
  NORMAL_MRI_MODE_PARAM,
  NORMAL_MRI_SERIES_PARAM,
  readNormalParam,
} from "@/lib/normal-workstation-url";

const ELBOW_CASE_BASE = coursePath(getCourseById("elbow-mri"), "/cases");

type Mode = "explore" | "tour" | "check" | "correlate" | "compare" | "advanced" | "caq" | "adjust";
const RESTORABLE_MODES: Mode[] = ["explore", "tour", "check", "correlate", "compare", "advanced", "caq"];
const MODES: { id: Mode; label: string }[] = [
  { id: "explore", label: "Explore" },
  { id: "tour", label: "Guided Tour" },
  { id: "check", label: "Practice & Mastery" },
];

/**
 * Interactive Normal Elbow MRI — a "mini-workstation" of a real, de-identified
 * normal elbow. Built on the same region-agnostic components as the other
 * Normal MRI workstations. Coronal, axial, and sagittal stacks are loaded.
 */
// Coronal, axial, and sagittal are loaded; arthrographic / FABS sequences could be added later.
const COMING_SOON: string[] = [];

export default function NormalElbowMriPage() {
  const { user, role } = useAuth();
  const isAdmin = role === "admin";
  const isAdminView = useIsAdminView();
  const initialSearch = typeof window === "undefined" ? "" : window.location.search;
  const [activeId, setActiveId] = useState(() =>
    readNormalParam(initialSearch, NORMAL_MRI_SERIES_PARAM, SERIES.map((s) => s.id), SERIES[0].id),
  );
  const [mode, setMode] = useState<Mode>(() =>
    readNormalParam(initialSearch, NORMAL_MRI_MODE_PARAM, RESTORABLE_MODES, "explore"),
  );
  const [tourTarget, setTourTarget] = useState<ShowInLearnArgs | null>(null);
  const series = SERIES.find((s) => s.id === activeId) ?? SERIES[0];
  const learn = normalElbowLearn[series.id];

  async function handleCheckComplete(planeId: string, score: number, total: number) {
    if (!user || isAdminView || !isPassingMasteryScore(score, total)) return;
    const { markNormalPlanePassed } = await import("@/lib/firestore");
    markNormalPlanePassed(user.uid, user.email || "", planeId, score, total).catch(() => {});
  }

  function handleMiss(itemId: string) {
    if (!user || isAdminView || !getCourseById("elbow-mri").features.reviewCards) return;
    import("@/lib/firestore")
      .then(({ addWrongAnswerToReview }) =>
        addWrongAnswerToReview(user.uid, workstationReviewId("elbow-mri", itemId), "workstation", "elbow-mri"),
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
    ...(elbowCrossPlane.length > 0 ? [{ id: "correlate" as Mode, label: "Cross-Plane" }] : []),
    { id: "compare" as Mode, label: "Compare" },
    ...(elbowAdvanced.length > 0 ? [{ id: "advanced" as Mode, label: "Advanced" }] : []),
    ...(elbowImageCaq.length > 0 ? [{ id: "caq" as Mode, label: "Image CAQ" }] : []),
  ];
  const visibleModes = isAdmin
    ? [...baseModes, { id: "adjust" as Mode, label: "Adjust (admin)" }]
    : baseModes;
  const modeLabel = visibleModes.find((item) => item.id === mode)?.label ?? "Explore";
  useNormalMriResume({
    courseId: "elbow-mri",
    title: "Interactive Normal Elbow MRI",
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
        alt: `Normal elbow — ${series.plane} — slice ${i + 1} of ${series.count}`,
      })),
    [series],
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Interactive Normal Elbow MRI</h1>
      <p className="mt-1 text-gray-500">
        A real, de-identified normal elbow MRI for anchoring ligaments, tendons, cartilage,
        nerves, and marrow before pathology.
      </p>

      <NormalSeriesSelector
        series={SERIES}
        activeId={activeId}
        onSeriesChange={handleSeriesChange}
        comingSoon={COMING_SOON}
      />

      <NormalModeSwitcher modes={visibleModes} activeMode={mode} onModeChange={handleModeChange} />

      <NormalMriMasteryPanel
        courseId="elbow-mri"
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
              title="Normal Elbow"
              plane={series.plane}
              startIndex={series.startIndex}
              caption="Normal elbow reference stack for comparing ligaments, tendons, cartilage, nerves, and marrow across slices."
              attribution="De-identified normal elbow MRI · UCLA Sports Medicine teaching collection"
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
          attribution="De-identified normal elbow MRI · UCLA Sports Medicine teaching collection"
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
              structureCase={structureElbowCase}
              structurePearl={structureElbowPearl}
              structureReading={structureElbowReading}
              structureCorrelate={elbowStructureCorrelate}
              caseImageById={caseTeachingImageById}
              caseBasePath={ELBOW_CASE_BASE}
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
              onComplete={(s, t) => handleCheckComplete(`elbow-${series.id}`, s, t)}
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
            elbow in your head.{" "}
            <span className="text-gray-500">This drill spans all planes (the chips above don&apos;t change it).</span>
          </p>
          <CrossPlanePrimer
            rules={[
              {
                label: "Anchor on the capitellum & trochlea.",
                text: "The humeral condyles are your fixed point on every plane — the radial head sits under the capitellum (lateral) and the coronoid/olecranon under the trochlea (medial); place everything relative to them.",
              },
              {
                label: "Orient by the radial head and olecranon.",
                text: "The round radial-head disc marks LATERAL, and the olecranon with the triceps marks POSTERIOR — use them to tell medial from lateral and front from back across planes.",
              },
              {
                label: "Shape changes per plane.",
                text: "The UCL is a band running to the sublime tubercle on coronal; the ulnar nerve is a dot in the cubital tunnel on axial — confirm a finding on two planes.",
              },
            ]}
          />
          <CrossPlaneDrill items={elbowCrossPlane} onContextChange={issueContext.onContextChange} />
        </div>
      )}

      {/* ── Advanced challenge ──────────────────────────────────────── */}
      {mode === "advanced" && (
        <div className="mt-5">
          <p className="mb-4 text-sm text-gray-500">
            Push your learning — higher-level elbow-MRI questions beyond normal anatomy.{" "}
            <span className="text-gray-500">Optional; pick a topic and go as deep as you like.</span>
          </p>
          <AdvancedChallenge questions={elbowAdvanced} onMiss={handleMiss} />
        </div>
      )}

      {/* ── Image-anchored CAQ ──────────────────────────────────────── */}
      {mode === "caq" && (
        <div className="mt-5">
          <p className="mb-4 text-sm text-gray-500">
            Board-style questions anchored to the real MRI — review the image stack, then commit to your answer.{" "}
            <span className="text-gray-500">Misses return in your spaced review.</span>
          </p>
          <ImageCaq questions={elbowImageCaq} onMiss={handleMiss} onContextChange={issueContext.onContextChange} />
        </div>
      )}

      {/* ── Adjust (admin authoring workbench) ──────────────────────── */}
      {mode === "adjust" && isAdmin && (
        <div className="mt-5">
          {learn ? (
            <MarkerAdjuster
              key={series.id}
              planeId={`elbow-${series.id}`}
              planeLabel={`Elbow ${series.label}`}
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
