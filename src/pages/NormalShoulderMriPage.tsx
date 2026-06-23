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
  normalShoulderLearn,
  structureShoulderPearl,
  structureShoulderReading,
  structureShoulderCase,
  shoulderStructureCorrelate,
  shoulderAdvanced,
  shoulderImageCaq,
  shoulderCrossPlane,
} from "@/content/normal-shoulder-learn";
import { useAuth } from "@/contexts/AuthContext";
import { coursePath, getCourseById } from "@/content/courses";
import { workstationReviewId } from "@/content/review-id";
import { caseTeachingImageById } from "@/content/case-preview-images";

// Case links from the workstation must be explicitly scoped to the shoulder
// course (otherwise CasePage resolves them against the default/knee course and
// the case isn't found).
const SHOULDER_CASE_BASE = coursePath(getCourseById("shoulder-mri"), "/cases");

type Mode = "explore" | "tour" | "check" | "correlate" | "compare" | "advanced" | "caq" | "adjust";
const MODES: { id: Mode; label: string }[] = [
  { id: "explore", label: "Explore" },
  { id: "tour", label: "Guided Tour" },
  { id: "check", label: "Knowledge Check" },
];

/**
 * Interactive Normal Shoulder MRI — a "mini-workstation" of a real, de-identified
 * normal shoulder. Built on the same region-agnostic components as the knee.
 * Add a SERIES entry per plane/sequence as the stacks are captured.
 */

interface ShoulderSeries {
  id: string;
  label: string;
  plane: string;
  dir: string;
  count: number;
  startIndex?: number;
  checklist: string[];
}

const SERIES: ShoulderSeries[] = [
  {
    id: "sag-t2fs",
    label: "Sagittal T2-FS",
    plane: "Oblique Sagittal T2 FS",
    dir: "/images/teaching/stacks/normal-shoulder-sagittal",
    count: 28,
    startIndex: 11, // opens mid-humeral-head
    checklist: [
      "Rotator-cuff muscles en face — supraspinatus, infraspinatus, subscapularis, teres minor (bulk & fatty atrophy)",
      "Supraspinatus tendon capping the superior humeral head",
      "Acromial morphology (type I–III) & os acromiale",
      "Humeral head & articular cartilage",
      "Glenoid and the labrum",
      "Coracoid & the rotator interval (biceps + coracohumeral ligament)",
      "Deltoid and the subacromial–subdeltoid fat plane",
    ],
  },
  {
    id: "cor-t2fs",
    label: "Coronal T2-FS",
    plane: "Oblique Coronal T2 FS",
    dir: "/images/teaching/stacks/normal-shoulder-coronal",
    count: 24,
    startIndex: 11, // opens at the mid-glenohumeral joint
    checklist: [
      "Supraspinatus tendon — uniform low signal to its footprint; the critical zone",
      "Greater tuberosity footprint — marrow & cortical surface",
      "Humeral head, articular cartilage & glenohumeral alignment",
      "Glenoid and the superior/inferior labrum",
      "Subacromial–subdeltoid bursa — should be a thin fat/fluid plane",
      "Acromion shape & the AC joint (impingement)",
      "Deltoid and the axillary recess (inferior capsule)",
    ],
  },
  {
    id: "axi-t2fs",
    label: "Axial PD-FS",
    plane: "Axial PD FS",
    dir: "/images/teaching/stacks/normal-shoulder-axial",
    count: 30,
    startIndex: 14, // opens at the mid-glenohumeral joint (glenoid, labrum, biceps groove)
    checklist: [
      "Subscapularis tendon anteriorly; infraspinatus & teres minor posteriorly",
      "Long head of biceps tendon seated in the bicipital groove",
      "Anterior & posterior glenoid labrum — the plane for Bankart / instability",
      "Bony glenoid and glenohumeral congruence",
      "Posterolateral humeral head contour (the Hill-Sachs location)",
      "Coracoid process anteromedially",
      "Deltoid and the rotator interval superiorly",
    ],
  },
  {
    id: "sag-t1",
    label: "Sagittal T1",
    plane: "Oblique Sagittal T1",
    dir: "/images/teaching/stacks/normal-shoulder-sagittal-t1",
    count: 28,
    startIndex: 4, // opens on the scapular "Y" / cuff-muscle slice (Goutallier)
    checklist: [
      "Rotator-cuff muscle bulk & fatty atrophy (Goutallier–Fuchs) on the scapular 'Y'",
      "Supraspinatus, infraspinatus, subscapularis, teres minor — the four bellies",
      "Humeral-head & glenoid marrow — T1's strength (a focal dark area is the finding)",
      "Glenoid and the labral rim",
      "Coracoid and the anterior landmarks",
      "Acromion morphology & the AC joint",
    ],
  },
];

// All four planes are loaded.
const COMING_SOON: string[] = [];

export default function NormalShoulderMriPage() {
  const { user, role } = useAuth();
  const isAdmin = role === "admin";
  const [activeId, setActiveId] = useState(SERIES[0].id);
  const [mode, setMode] = useState<Mode>("explore");
  const series = SERIES.find((s) => s.id === activeId) ?? SERIES[0];
  const learn = normalShoulderLearn[series.id];

  // Passing a plane's Knowledge Check (70%+) records it toward completing the
  // Interactive Normal Shoulder MRI. Plane ids are "sh-"-prefixed so they never
  // collide with the knee course's plane passes.
  async function handleCheckComplete(planeId: string, score: number, total: number) {
    if (!user || total <= 0 || score / total < 0.7) return;
    const { markNormalPlanePassed } = await import("@/lib/firestore");
    markNormalPlanePassed(user.uid, user.email || "", planeId, score, total).catch(() => {});
  }

  // Missed Knowledge-Check / Advanced items feed the spaced-review queue.
  function handleMiss(itemId: string) {
    if (!user || !getCourseById("shoulder-mri").features.reviewCards) return;
    import("@/lib/firestore")
      .then(({ addWrongAnswerToReview }) =>
        addWrongAnswerToReview(user.uid, workstationReviewId("shoulder-mri", itemId), "workstation", "shoulder-mri"),
      )
      .catch(() => {});
  }

  // "Show me in Learn mode" from a missed Knowledge-Check item: switch to the
  // Guided Tour (Learn) on the item's plane. The check already runs on the
  // active plane, so the slice/structure the fellow missed is on this tour.
  function handleShowInLearn() {
    setMode("tour");
  }
  const baseModes: { id: Mode; label: string }[] = [
    ...MODES,
    ...(shoulderCrossPlane.length > 0 ? [{ id: "correlate" as Mode, label: "Cross-Plane" }] : []),
    { id: "compare" as Mode, label: "Compare" },
    ...(shoulderAdvanced.length > 0 ? [{ id: "advanced" as Mode, label: "Advanced" }] : []),
    ...(shoulderImageCaq.length > 0 ? [{ id: "caq" as Mode, label: "Image CAQ" }] : []),
  ];
  const visibleModes = isAdmin
    ? [...baseModes, { id: "adjust" as Mode, label: "Adjust (admin)" }]
    : baseModes;

  const slices = useMemo(
    () =>
      Array.from({ length: series.count }, (_, i) => ({
        src: `${series.dir}/slice_${String(i + 1).padStart(2, "0")}.jpg`,
        alt: `Normal shoulder — ${series.plane} — slice ${i + 1} of ${series.count}`,
      })),
    [series],
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Interactive Normal Shoulder MRI</h1>
      <p className="mt-1 text-gray-500">
        A real, de-identified normal shoulder MRI for anchoring cuff, labrum, biceps,
        cartilage, and marrow before pathology.
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
              title="Normal Shoulder"
              plane={series.plane}
              startIndex={series.startIndex}
              caption="Normal shoulder reference stack for comparing cuff, labrum, biceps, cartilage, and bone marrow across slices."
              attribution="De-identified normal shoulder MRI · UCLA Sports Medicine teaching collection"
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
          attribution="De-identified normal shoulder MRI · UCLA Sports Medicine teaching collection"
        />
      )}

      {/* ── Guided Tour ─────────────────────────────────────────────── */}
      {mode === "tour" && (
        <div className="mt-5">
          {learn ? (
            <GuidedTour
              dir={series.dir}
              steps={learn.tour}
              structureCase={structureShoulderCase}
              structurePearl={structureShoulderPearl}
              structureReading={structureShoulderReading}
              structureCorrelate={shoulderStructureCorrelate}
              caseImageById={caseTeachingImageById}
              caseBasePath={SHOULDER_CASE_BASE}
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
                Identify each marked structure on this normal {series.label} shoulder.{" "}
                <span className="text-gray-500">First pass — structures &amp; positions being refined.</span>
              </p>
              <KnowledgeCheck
                dir={series.dir}
                items={learn.quiz}
                planeLabel={series.label}
                onComplete={(s, t) => handleCheckComplete(`sh-${series.id}`, s, t)}
                onMiss={handleMiss}
                onShowInLearn={handleShowInLearn}
              />
            </>
          ) : (
            <ComingSoonForPlane label={series.label} kind="knowledge check" />
          )}
        </div>
      )}

      {/* ── Cross-plane correlation (spans all planes) ───────────────── */}
      {mode === "correlate" && (
        <div className="mt-5">
          <p className="mb-4 text-sm text-gray-500">
            Match the same structure across planes — the skill that turns four 2-D stacks into one 3-D
            shoulder in your head.{" "}
            <span className="text-gray-500">This drill spans all planes (the chips above don't change it).</span>
          </p>
          <CrossPlanePrimer
            rules={[
              {
                label: "Each plane has a job.",
                text: "Axial = labrum, biceps groove, subscapularis; coronal = supraspinatus, AC joint, tendon gap and retraction; sagittal-Y = which cuff tendons + Goutallier atrophy on T1.",
              },
              {
                label: "Muscle becomes tendon.",
                text: "Trace each cuff muscle on the sagittal-Y out to its tendon footprint on the coronal and axial.",
              },
              {
                label: "Jump on landmarks.",
                text: "The bicipital groove anchors anterior; the coracoid points anterior; the scapular spine splits supraspinatus from infraspinatus.",
              },
            ]}
          />
          <CrossPlaneDrill items={shoulderCrossPlane} />
        </div>
      )}

      {/* ── Advanced challenge (optional, spans the shoulder) ───────── */}
      {mode === "advanced" && (
        <div className="mt-5">
          <p className="mb-4 text-sm text-gray-500">
            Push your learning — higher-level shoulder-MRI questions beyond normal anatomy.{" "}
            <span className="text-gray-500">Optional; pick a topic and go as deep as you like.</span>
          </p>
          <AdvancedChallenge questions={shoulderAdvanced} onMiss={handleMiss} />
        </div>
      )}

      {/* ── Image-anchored CAQ (read off the real stack) ────────────── */}
      {mode === "caq" && (
        <div className="mt-5">
          <p className="mb-4 text-sm text-gray-500">
            Board-style questions anchored to the real MRI — review the image stack, then commit to your answer.{" "}
            <span className="text-gray-500">Misses return in your spaced review.</span>
          </p>
          <ImageCaq questions={shoulderImageCaq} onMiss={handleMiss} />
        </div>
      )}

      {/* ── Adjust (admin authoring workbench) ──────────────────────── */}
      {mode === "adjust" && isAdmin && (
        <div className="mt-5">
          {learn ? (
            <MarkerAdjuster
              key={series.id}
              planeId={`sh-${series.id}`}
              planeLabel={`Shoulder ${series.label}`}
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
