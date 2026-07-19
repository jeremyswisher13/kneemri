import { useMemo, useState } from "react";
import MriStackViewer from "@/components/ui/MriStackViewer";
import Card from "@/components/ui/Card";
import GuidedTour from "@/components/normal/GuidedTour";
import KnowledgeCheck, { type ShowInLearnArgs } from "@/components/normal/KnowledgeCheck";
import { isPassingMasteryScore } from "@/components/normal/knowledge-check-logic";
import CrossPlaneDrill from "@/components/normal/CrossPlaneDrill";
import CrossPlanePrimer from "@/components/normal/CrossPlanePrimer";
import AdvancedChallenge from "@/components/normal/AdvancedChallenge";
import ImageCaq from "@/components/normal/ImageCaq";
import PlaneCompare from "@/components/normal/PlaneCompare";
import ExploreChecklist from "@/components/normal/ExploreChecklist";
import NormalModeSwitcher from "@/components/normal/NormalModeSwitcher";
import NormalMriMasteryPanel from "@/components/normal/NormalMriMasteryPanel";
import NormalSeriesSelector from "@/components/normal/NormalSeriesSelector";
import {
  normalKneeLearn,
  advancedChallenge,
  kneeImageCaq,
  crossPlane,
  structureCase,
  structurePearl,
  structureReading,
  structureCorrelate,
} from "@/content/normal-knee-learn";
import { normalKneeSeries as SERIES } from "@/content/normal-workstation-series";
import MarkerAdjuster from "@/components/normal/MarkerAdjuster";
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

const KNEE_CASE_BASE = coursePath(getCourseById("knee-mri"), "/cases");

type Mode = "explore" | "tour" | "check" | "correlate" | "compare" | "advanced" | "caq" | "adjust";
// Read side of the persist/restore round-trip — shared with useNormalMriResume
// (see RESTORABLE_NORMAL_MODES) so the two can never drift apart again.
const RESTORABLE_MODES = RESTORABLE_NORMAL_MODES as readonly Mode[];
const MODES: { id: Mode; label: string }[] = [
  { id: "explore", label: "Explore" },
  { id: "tour", label: "Guided Tour" },
  { id: "check", label: "Practice & Mastery" },
  { id: "correlate", label: "Cross-Plane" },
  { id: "compare", label: "Compare" },
  // "Advanced" appended at render time only when the bank has questions.
];

/**
 * Interactive Normal Knee MRI — a "mini-workstation" of a real, de-identified
 * normal knee. Built to be extended: add a new entry to SERIES for each plane /
 * sequence as the stacks are captured (coronal, axial, T1, etc.).
 */

// Planes/sequences not yet loaded — shown as disabled chips to signal what's coming.
const COMING_SOON: string[] = [];

export default function NormalKneeMriPage() {
  const { user, role } = useAuth();
  const isAdmin = role === "admin";
  const isAdminView = useIsAdminView();
  // Residents are hard-gated out of some cases, so the guided tour must not
  // link them to one (it would dead-end on "Not Available").
  const visibleCaseIds = useMemo(
    () => visibleCaseIdsFor(getCourseById("knee-mri"), role === "resident"),
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
  const learn = normalKneeLearn[series.id];
  const baseModes: { id: Mode; label: string }[] = [
    ...MODES,
    ...(advancedChallenge.length > 0 ? [{ id: "advanced" as Mode, label: "Advanced" }] : []),
    ...(kneeImageCaq.length > 0 ? [{ id: "caq" as Mode, label: "Image CAQ" }] : []),
  ];
  const visibleModes = isAdmin
    ? [...baseModes, { id: "adjust" as Mode, label: "Adjust (admin)" }]
    : baseModes;
  const modeLabel = visibleModes.find((item) => item.id === mode)?.label ?? "Explore";
  useNormalMriResume({
    courseId: "knee-mri",
    title: "Interactive Normal Knee MRI",
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

  // Passing a plane's blinded Mastery Check (70%+) records it toward completing the
  // Interactive Normal Knee MRI — a required part of the course.
  async function handleCheckComplete(planeId: string, score: number, total: number) {
    if (!user || isAdminView || !isPassingMasteryScore(score, total)) return;
    const { markNormalPlanePassed } = await import("@/lib/firestore");
    markNormalPlanePassed(user.uid, user.email || "", planeId, score, total).catch(() => {});
  }

  // Missed practice, mastery, and Advanced items feed the spaced-review queue.
  function handleMiss(itemId: string) {
    if (!user || isAdminView || !getCourseById("knee-mri").features.reviewCards) return;
    import("@/lib/firestore")
      .then(({ addWrongAnswerToReview }) =>
        addWrongAnswerToReview(user.uid, workstationReviewId("knee-mri", itemId), "workstation", "knee-mri"),
      )
      .catch(() => {});
  }

  // "Show me in Learn mode" from a missed Knowledge-Check item: switch to the
  // Guided Tour (Learn) on the item's plane. The check already runs on the
  // active plane, so the slice/structure the fellow missed is on this tour.
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

  const slices = useMemo(
    () =>
      Array.from({ length: series.count }, (_, i) => ({
        src: `${series.dir}/slice_${String(i + 1).padStart(2, "0")}.jpg`,
        alt: `Normal knee — ${series.plane} — slice ${i + 1} of ${series.count}`,
      })),
    [series],
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Interactive Normal Knee MRI</h1>
      <p className="mt-1 text-gray-500">
        A real, de-identified normal knee MRI for anchoring marrow, cartilage, menisci,
        ligaments, and recesses before pathology.
      </p>

      <NormalSeriesSelector
        series={SERIES}
        activeId={activeId}
        onSeriesChange={handleSeriesChange}
        comingSoon={COMING_SOON}
      />

      <NormalModeSwitcher modes={visibleModes} activeMode={mode} onModeChange={handleModeChange} />

      <NormalMriMasteryPanel
        courseId="knee-mri"
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
              title="Normal Knee"
              plane={series.plane}
              startIndex={series.startIndex}
              caption="Normal knee reference stack for comparing marrow, cartilage, menisci, ligaments, and recesses across slices."
              attribution="De-identified normal knee MRI · UCLA Sports Medicine teaching collection"
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
          attribution="De-identified normal knee MRI · UCLA Sports Medicine teaching collection"
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
              structureCase={structureCase}
              isCaseAvailable={(id) => visibleCaseIds.has(id)}
              structurePearl={structurePearl}
              structureReading={structureReading}
              structureCorrelate={structureCorrelate}
              caseImageById={caseTeachingImageById}
              caseBasePath={KNEE_CASE_BASE}
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
            <>
              <p className="mb-4 text-sm text-gray-500">
                Practice the normal {series.label} landmarks with feedback, then pass the blinded Mastery Check at 70% or higher. Pass all four loaded series to complete the Normal Knee MRI.
              </p>
              <KnowledgeCheck
                key={series.id}
                dir={series.dir}
                items={learn.quiz}
                tour={learn.tour}
                planeLabel={series.label}
                onComplete={(s, t) => handleCheckComplete(series.id, s, t)}
                onMiss={handleMiss}
                onShowInLearn={handleShowInLearn}
                onContextChange={issueContext.onContextChange}
              />
            </>
          ) : (
            <ComingSoonForPlane label={series.label} kind="practice and mastery check" />
          )}
        </div>
      )}

      {/* ── Cross-Plane correlation drill (spans all planes) ────────── */}
      {mode === "correlate" && (
        <div className="mt-5">
          <p className="mb-4 text-sm text-gray-500">
            Match the same structure across planes — the skill that turns four 2-D stacks into one 3-D
            knee in your head.{" "}
            <span className="text-gray-500">This drill spans all planes (the chips above don't change it).</span>
          </p>
          <CrossPlanePrimer
            rules={[
              {
                label: "Side never flips.",
                text: "Medial is image-LEFT, lateral image-RIGHT, on every plane — the side is your anchor.",
              },
              {
                label: "Shape changes per plane.",
                text: "A meniscus is a sagittal bow-tie but a coronal wedge; the cruciate is a sagittal band you localize on the coronal by the tibial spines.",
              },
              {
                label: "Jump on landmarks.",
                text: "Tibial spines mark the midline and cruciate origin; the popliteal vessels mark posterior; switch to T1 for the marrow read.",
              },
            ]}
          />
          <CrossPlaneDrill items={crossPlane} onContextChange={issueContext.onContextChange} />
        </div>
      )}

      {/* ── Advanced challenge (optional, spans the whole knee) ──────── */}
      {mode === "advanced" && (
        <div className="mt-5">
          <p className="mb-4 text-sm text-gray-500">
            Push your learning — higher-level questions beyond normal anatomy.{" "}
            <span className="text-gray-500">Entirely optional; pick a topic and go as deep as you like.</span>
          </p>
          <AdvancedChallenge questions={advancedChallenge} onMiss={handleMiss} />
        </div>
      )}

      {/* ── Image-anchored CAQ (read off the real stack) ────────────── */}
      {mode === "caq" && (
        <div className="mt-5">
          <p className="mb-4 text-sm text-gray-500">
            Board-style questions anchored to the real MRI — review the image stack, then commit to your answer.{" "}
            <span className="text-gray-500">Misses return in your spaced review.</span>
          </p>
          <ImageCaq questions={kneeImageCaq} onMiss={handleMiss} onContextChange={issueContext.onContextChange} />
        </div>
      )}

      {/* ── Adjust (admin authoring workbench) ──────────────────────── */}
      {mode === "adjust" && isAdmin && (
        <div className="mt-5">
          {learn ? (
            <MarkerAdjuster
              key={series.id}
              planeId={series.id}
              planeLabel={series.label}
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
        <strong>Explore</strong> has the reference stack; the <strong>Sagittal PD-FS</strong> tour &amp;
        check are ready.
      </p>
    </Card>
  );
}
