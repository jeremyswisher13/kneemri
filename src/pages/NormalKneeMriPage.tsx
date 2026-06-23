import { useMemo, useState } from "react";
import MriStackViewer from "@/components/ui/MriStackViewer";
import Card from "@/components/ui/Card";
import GuidedTour from "@/components/normal/GuidedTour";
import KnowledgeCheck from "@/components/normal/KnowledgeCheck";
import CrossPlaneDrill from "@/components/normal/CrossPlaneDrill";
import CrossPlanePrimer from "@/components/normal/CrossPlanePrimer";
import AdvancedChallenge from "@/components/normal/AdvancedChallenge";
import ImageCaq from "@/components/normal/ImageCaq";
import PlaneCompare from "@/components/normal/PlaneCompare";
import ExploreChecklist from "@/components/normal/ExploreChecklist";
import NormalModeSwitcher from "@/components/normal/NormalModeSwitcher";
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
import MarkerAdjuster from "@/components/normal/MarkerAdjuster";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdminView } from "@/hooks/useIsAdminView";
import { coursePath, getCourseById } from "@/content/courses";
import { workstationReviewId } from "@/content/review-id";
import { caseTeachingImageById } from "@/content/case-preview-images";

const KNEE_CASE_BASE = coursePath(getCourseById("knee-mri"), "/cases");

type Mode = "explore" | "tour" | "check" | "correlate" | "compare" | "advanced" | "caq" | "adjust";
const MODES: { id: Mode; label: string }[] = [
  { id: "explore", label: "Explore" },
  { id: "tour", label: "Guided Tour" },
  { id: "check", label: "Knowledge Check" },
  { id: "correlate", label: "Cross-Plane" },
  { id: "compare", label: "Compare" },
  // "Advanced" appended at render time only when the bank has questions.
];

/**
 * Interactive Normal Knee MRI — a "mini-workstation" of a real, de-identified
 * normal knee. Built to be extended: add a new entry to SERIES for each plane /
 * sequence as the stacks are captured (coronal, axial, T1, etc.).
 */

interface KneeSeries {
  id: string;
  label: string; // selector chip label
  plane: string; // viewer plane badge, e.g. "Sagittal PD FS"
  dir: string; // folder under /public holding slice_01.jpg, slice_02.jpg, ...
  count: number; // number of slices in the folder
  startIndex?: number; // 0-based slice to open on (e.g. the intercondylar notch)
  checklist: string[]; // high-yield structures to identify on this plane
}

const SERIES: KneeSeries[] = [
  {
    id: "sag-pdfs",
    label: "Sagittal PD-FS",
    plane: "Sagittal PD FS",
    dir: "/images/teaching/stacks/normal-knee-sagittal",
    count: 29,
    startIndex: 13, // opens at the intercondylar notch
    checklist: [
      "PCL — smooth, continuous low-signal posterior arc",
      "ACL — taut band parallel to Blumensaat's line (lateral slices)",
      "Menisci — anterior & posterior horns; “bow-tie” on body slices",
      "Articular cartilage — femoral condyle & tibial plateau",
      "Extensor mechanism — quadriceps & patellar tendons",
      "Hoffa's fat pad and the joint recesses",
    ],
  },
  {
    id: "cor-pdfs",
    label: "Coronal PD-FS",
    plane: "Coronal PD FS",
    dir: "/images/teaching/stacks/normal-knee-coronal",
    count: 19,
    startIndex: 7, // opens at the mid-joint (tibial spines / cruciate origins)
    checklist: [
      "Medial & lateral menisci — triangular body & free edge",
      "Meniscal extrusion — medial body past the tibial margin (>3 mm is pathologic)",
      "MCL — superficial & deep (meniscofemoral/meniscotibial) layers",
      "LCL & popliteus — the lateral corner",
      "Tibial spines / eminence & the cruciate origins (intercondylar)",
      "Weight-bearing femoral condyle & tibial plateau cartilage",
    ],
  },
  {
    id: "axi-t2fs",
    label: "Axial T2-FS",
    plane: "Axial T2 FS",
    dir: "/images/teaching/stacks/normal-knee-axial",
    count: 28,
    startIndex: 13, // opens at the patellofemoral joint (patella + trochlea)
    checklist: [
      "Patella & trochlea — facets and the trochlear groove (dysplasia)",
      "Patellar & trochlear articular cartilage",
      "MPFL — medial, coursing toward the adductor tubercle",
      "Medial & lateral retinacula; patellar tilt / translation",
      "Cruciates in cross-section (intercondylar notch)",
      "Popliteal vessels and the popliteal fossa",
    ],
  },
  {
    id: "sag-t1",
    label: "Sagittal T1",
    plane: "Sagittal T1",
    dir: "/images/teaching/stacks/normal-knee-sagittal-t1",
    count: 29,
    startIndex: 13, // opens at the intercondylar notch (same level as the PD-FS)
    checklist: [
      "Bone marrow — normal bright fatty marrow (a fracture line or lesion is dark)",
      "Anatomy & fat planes — high detail, no fat suppression",
      "Cruciates, menisci & cartilage — morphology",
      "Compare at the same level: T1 for anatomy/marrow, PD-FS for fluid & edema",
    ],
  },
];

// Planes/sequences not yet loaded — shown as disabled chips to signal what's coming.
const COMING_SOON: string[] = [];

export default function NormalKneeMriPage() {
  const { user, role } = useAuth();
  const isAdmin = role === "admin";
  const isAdminView = useIsAdminView();
  const [activeId, setActiveId] = useState(SERIES[0].id);
  const [mode, setMode] = useState<Mode>("explore");
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

  // Passing a plane's Knowledge Check (70%+) records it toward completing the
  // Interactive Normal Knee MRI — a required part of the course.
  async function handleCheckComplete(planeId: string, score: number, total: number) {
    if (!user || isAdminView || total <= 0 || score / total < 0.7) return;
    const { markNormalPlanePassed } = await import("@/lib/firestore");
    markNormalPlanePassed(user.uid, user.email || "", planeId, score, total).catch(() => {});
  }

  // Missed Knowledge-Check / Advanced items feed the spaced-review queue.
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
  function handleShowInLearn() {
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
              title="Normal Knee"
              plane={series.plane}
              startIndex={series.startIndex}
              caption="Normal knee reference stack for comparing marrow, cartilage, menisci, ligaments, and recesses across slices."
              attribution="De-identified normal knee MRI · UCLA Sports Medicine teaching collection"
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
              structurePearl={structurePearl}
              structureReading={structureReading}
              structureCorrelate={structureCorrelate}
              caseImageById={caseTeachingImageById}
              caseBasePath={KNEE_CASE_BASE}
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
            <>
              <p className="mb-4 text-sm text-gray-500">
                Identify each marked structure on this normal {series.label} knee.{" "}
                <span className="text-gray-500">
                  Score 70%+ on all four planes to complete the Normal Knee MRI — a required part of the course.
                </span>
              </p>
              <KnowledgeCheck
                dir={series.dir}
                items={learn.quiz}
                planeLabel={series.label}
                onComplete={(s, t) => handleCheckComplete(series.id, s, t)}
                onMiss={handleMiss}
                onShowInLearn={handleShowInLearn}
              />
            </>
          ) : (
            <ComingSoonForPlane label={series.label} kind="knowledge check" />
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
          <CrossPlaneDrill items={crossPlane} />
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
          <ImageCaq questions={kneeImageCaq} onMiss={handleMiss} />
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
