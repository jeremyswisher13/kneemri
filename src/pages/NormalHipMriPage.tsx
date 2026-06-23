import { useMemo, useState } from "react";
import MriStackViewer from "@/components/ui/MriStackViewer";
import Card from "@/components/ui/Card";
import GuidedTour from "@/components/normal/GuidedTour";
import KnowledgeCheck from "@/components/normal/KnowledgeCheck";
import AdvancedChallenge from "@/components/normal/AdvancedChallenge";
import ImageCaq from "@/components/normal/ImageCaq";
import PlaneCompare from "@/components/normal/PlaneCompare";
import ExploreChecklist from "@/components/normal/ExploreChecklist";
import CrossPlaneDrill from "@/components/normal/CrossPlaneDrill";
import CrossPlanePrimer from "@/components/normal/CrossPlanePrimer";
import MarkerAdjuster from "@/components/normal/MarkerAdjuster";
import NormalModeSwitcher from "@/components/normal/NormalModeSwitcher";
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
import { useAuth } from "@/contexts/AuthContext";
import { coursePath, getCourseById } from "@/content/courses";
import { workstationReviewId } from "@/content/review-id";
import { caseTeachingImageById } from "@/content/case-preview-images";

const HIP_CASE_BASE = coursePath(getCourseById("hip-mri"), "/cases");

type Mode = "explore" | "tour" | "check" | "correlate" | "compare" | "advanced" | "caq" | "adjust";
const MODES: { id: Mode; label: string }[] = [
  { id: "explore", label: "Explore" },
  { id: "tour", label: "Guided Tour" },
  { id: "check", label: "Knowledge Check" },
];

/**
 * Interactive Normal Hip MRI — a "mini-workstation" of a real, de-identified
 * normal hip. Built on the same region-agnostic components as the knee/shoulder.
 * Add a SERIES entry per plane/sequence as the stacks are captured.
 */
interface HipSeries {
  id: string;
  label: string;
  plane: string;
  dir: string;
  count: number;
  startIndex?: number;
  checklist: string[];
}

const SERIES: HipSeries[] = [
  {
    id: "cor-t2fs",
    label: "Coronal T2-FS",
    plane: "Coronal T2 FS Dixon",
    dir: "/images/teaching/stacks/normal-hip-coronal",
    count: 34,
    startIndex: 16, // opens at the mid-coronal femoral heads / acetabula
    checklist: [
      "Femoral heads — spherical, congruent; marrow signal symmetric",
      "Acetabular roof (sourcil) & the joint space",
      "Acetabular labrum — the superolateral triangle",
      "Abductors — gluteus medius & minimus toward the greater trochanter",
      "Greater trochanter & the peritrochanteric soft tissue (GTPS)",
      "Femoral neck cortex & marrow (stress fracture / AVN screen)",
      "SI joints, sacrum & the symphysis on the mid/posterior slices",
    ],
  },
  {
    id: "axi",
    label: "Axial T2-FS",
    plane: "Axial T2 FS",
    dir: "/images/teaching/stacks/normal-hip-axial",
    count: 44,
    startIndex: 22, // opens through the femoral head / hip joint
    checklist: [
      "Femoral head & the anterior/posterior acetabular rim",
      "Acetabular labrum — anterior & posterior (the instability/tear plane)",
      "Iliopsoas tendon & muscle anterior to the joint",
      "Sciatic nerve posterior to the joint / ischium",
      "Gluteal muscles & the greater trochanter",
      "Rectus femoris & sartorius anteriorly",
      "Femoral neck version & the head-neck junction (cam contour)",
    ],
  },
  {
    id: "sag",
    label: "Sagittal PD-FS",
    plane: "Sagittal PD FS",
    dir: "/images/teaching/stacks/normal-hip-sagittal",
    count: 24,
    startIndex: 12, // opens through the femoral head / hip joint
    checklist: [
      "Femoral head & neck — the anterior head-neck junction (cam contour)",
      "Acetabulum & the anterior/posterior labrum",
      "Iliopsoas tendon anterior to the joint",
      "Rectus femoris origin near the AIIS",
      "Gluteal muscles posteriorly",
      "Hamstring origin at the ischial tuberosity",
      "Anterior & posterior joint recesses",
    ],
  },
];

// Coronal, axial, and sagittal are loaded; a dedicated T1 sequence could be added later.
const COMING_SOON: string[] = [];

export default function NormalHipMriPage() {
  const { user, role } = useAuth();
  const isAdmin = role === "admin";
  const [activeId, setActiveId] = useState(SERIES[0].id);
  const [mode, setMode] = useState<Mode>("explore");
  const series = SERIES.find((s) => s.id === activeId) ?? SERIES[0];
  const learn = normalHipLearn[series.id];

  async function handleCheckComplete(planeId: string, score: number, total: number) {
    if (!user || total <= 0 || score / total < 0.7) return;
    const { markNormalPlanePassed } = await import("@/lib/firestore");
    markNormalPlanePassed(user.uid, user.email || "", planeId, score, total).catch(() => {});
  }

  function handleMiss(itemId: string) {
    if (!user || !getCourseById("hip-mri").features.reviewCards) return;
    import("@/lib/firestore")
      .then(({ addWrongAnswerToReview }) =>
        addWrongAnswerToReview(user.uid, workstationReviewId("hip-mri", itemId), "workstation", "hip-mri"),
      )
      .catch(() => {});
  }

  function handleShowInLearn() {
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
        onSeriesChange={setActiveId}
        comingSoon={COMING_SOON}
      />

      <NormalModeSwitcher modes={visibleModes} activeMode={mode} onModeChange={setMode} />

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
              structurePearl={structureHipPearl}
              structureReading={structureHipReading}
              structureCorrelate={hipStructureCorrelate}
              caseImageById={caseTeachingImageById}
              caseBasePath={HIP_CASE_BASE}
            />
          ) : (
            <ComingSoonForPlane label={series.label} kind="guided tour" />
          )}
        </div>
      )}

      {/* ── Knowledge Check ─────────────────────────────────────────── */}
      {mode === "check" && (
        <div className="mt-5">
          {learn ? (
            <KnowledgeCheck
              dir={series.dir}
              items={learn.quiz}
              planeLabel={series.label}
              onComplete={(s, t) => handleCheckComplete(`hip-${series.id}`, s, t)}
              onMiss={handleMiss}
              onShowInLearn={handleShowInLearn}
            />
          ) : (
            <ComingSoonForPlane label={series.label} kind="knowledge check" />
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
          <CrossPlaneDrill items={hipCrossPlane} />
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
          <ImageCaq questions={hipImageCaq} onMiss={handleMiss} />
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
