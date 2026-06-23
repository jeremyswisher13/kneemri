import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { coursePath } from "@/content/courses";

/**
 * Region-anchored learning paths. Each track runs the same spine —
 * 1) see it normal (the workstation) → 2) learn (the module) → 3) read the cases —
 * keeping the normal knee at the center of every structure track.
 */

interface Track {
  id: string;
  title: string;
  blurb: string;
  planes: string;
  modules: { id: string; title: string }[];
  cases: { id: string; label: string }[];
}

const KNEE_TRACKS: Track[] = [
  {
    id: "cruciates",
    title: "The Cruciates — ACL & PCL",
    blurb: "Lock in the normal taut, low-signal cruciate bands, then learn how they fail.",
    planes: "sagittal notch · coronal tibial spines",
    modules: [{ id: "ligaments", title: "Ligaments" }],
    cases: [
      { id: "acl-pivot-shift", label: "ACL + pivot-shift" },
      { id: "pcl-plc-dashboard", label: "PCL + PLC dashboard" },
      { id: "acl-graft-evaluation", label: "ACL graft evaluation" },
      { id: "multiligament", label: "Multiligament injury" },
    ],
  },
  {
    id: "menisci",
    title: "The Menisci",
    blurb: "Normal low-signal triangles and the bow-tie body — then tears, bucket-handles, and root/extrusion.",
    planes: "sagittal horns · coronal body",
    modules: [{ id: "menisci", title: "Menisci" }],
    cases: [
      { id: "bucket-handle", label: "Bucket-handle tear" },
      { id: "medial-root-tear", label: "Meniscal root tear" },
      { id: "post-repair-retear", label: "Post-repair re-tear" },
    ],
  },
  {
    id: "cartilage-bone",
    title: "Cartilage & Bone",
    blurb: "Normal cartilage and bright fatty marrow, then chondral loss, OCD, and subchondral fractures.",
    planes: "cartilage (sag/cor) · marrow (T1)",
    modules: [
      { id: "cartilage-osteochondral", title: "Cartilage & Osteochondral" },
      { id: "bones-marrow", title: "Bones & Marrow" },
    ],
    cases: [
      { id: "degenerative-knee-oa", label: "Tricompartmental OA" },
      { id: "ocd-stability", label: "OCD stability" },
      { id: "sifk-sonk", label: "SIFK / SONK" },
    ],
  },
  {
    id: "extensor-pf",
    title: "Extensor & Patellofemoral",
    blurb: "Normal patella, trochlea, MPFL and tendons — then dislocation, dysplasia, and tendon rupture.",
    planes: "axial patellofemoral · sagittal extensor",
    modules: [{ id: "extensor-synovium", title: "Extensor Mechanism & Synovium" }],
    cases: [
      { id: "patellar-dislocation-mpfl", label: "Patellar dislocation + MPFL" },
      { id: "patellar-tendon-rupture", label: "Patellar tendon rupture" },
    ],
  },
  {
    id: "collaterals",
    title: "Collaterals & Corners",
    blurb: "Normal MCL/LCL bands and the lateral corner, then sprains, avulsions, and PLC injury.",
    planes: "coronal medial & lateral edges",
    modules: [{ id: "ligaments", title: "Ligaments" }],
    cases: [
      { id: "mcl-distal-avulsion", label: "MCL avulsion" },
      { id: "pcl-plc-dashboard", label: "PLC injury" },
      { id: "multiligament", label: "Multiligament injury" },
    ],
  },
];

const SHOULDER_TRACKS: Track[] = [
  {
    id: "rotator-cuff",
    title: "The Rotator Cuff",
    blurb: "Lock in the normal low-signal cuff tendons and muscle bulk, then learn how they tear and atrophy.",
    planes: "coronal footprint · sagittal muscles",
    modules: [{ id: "shoulder-rotator-cuff", title: "Rotator Cuff" }],
    cases: [
      { id: "shoulder-cuff-tendinosis-bursitis", label: "Tendinosis + bursitis" },
      { id: "shoulder-acute-full-thickness-cuff-tear", label: "Full-thickness tear" },
      { id: "shoulder-massive-cuff-arthropathy", label: "Cuff tear arthropathy" },
      { id: "shoulder-calcific-tendinitis", label: "Calcific tendinitis" },
    ],
  },
  {
    id: "labrum-instability",
    title: "Labrum & Instability",
    blurb: "Normal labrum and capsule, then Bankart/Hill-Sachs and the SLAP / biceps-anchor spectrum.",
    planes: "axial labrum · sagittal & coronal",
    modules: [{ id: "shoulder-labrum-instability", title: "Labrum & Instability" }],
    cases: [
      { id: "shoulder-anterior-instability-bankart", label: "Bankart + Hill-Sachs" },
      { id: "shoulder-slap-biceps-anchor", label: "SLAP / biceps anchor" },
    ],
  },
  {
    id: "biceps-interval-ac",
    title: "Biceps, Interval & AC Joint",
    blurb: "Normal biceps in the rotator interval and a clean AC joint, then pulley/subscapularis lesions and AC pathology.",
    planes: "sagittal interval · axial groove",
    modules: [{ id: "shoulder-biceps-interval-ac", title: "Biceps, Interval & AC" }],
    cases: [
      { id: "shoulder-subscapularis-biceps-hidden-lesion", label: "Hidden subscap/biceps lesion" },
      { id: "shoulder-slap-biceps-anchor", label: "SLAP / biceps anchor" },
    ],
  },
  {
    id: "capsule-arthritis",
    title: "Capsule, Bursa & Don't-Miss",
    blurb: "Normal capsule and axillary recess, then adhesive capsulitis, bursitis, and cuff-tear arthropathy.",
    planes: "axillary recess · rotator interval",
    modules: [{ id: "shoulder-arthritis-bursa-dontmiss", title: "Arthritis, Bursa & Don't-Miss" }],
    cases: [
      { id: "shoulder-adhesive-capsulitis", label: "Adhesive capsulitis" },
      { id: "shoulder-cuff-tendinosis-bursitis", label: "Subacromial bursitis" },
    ],
  },
];

function StepChip({ n }: { n: number }) {
  return (
    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ucla-blue text-[11px] font-bold text-white">
      {n}
    </span>
  );
}

export default function LearningPathsPage() {
  const activeCourse = useActiveCourse();
  const isShoulder = activeCourse.bodyRegion === "shoulder";
  const tracks = isShoulder ? SHOULDER_TRACKS : KNEE_TRACKS;
  const normalMriPath = coursePath(activeCourse, `/normal-${activeCourse.bodyRegion}-mri`);
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Learning Paths</h1>
      <p className="mt-1 text-gray-500">
        Every track starts with the normal {activeCourse.bodyRegion}. For each structure:{" "}
        <span className="font-medium text-gray-600">see it normal → learn it → read the cases (optional).</span>
      </p>

      <div className="mt-6 space-y-5">
        {tracks.map((t) => (
          <Card key={t.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold text-gray-900">{t.title}</h2>
              <span className="text-xs font-medium text-gray-500">{t.planes}</span>
            </div>
            <p className="mt-1 text-sm text-gray-600">{t.blurb}</p>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {/* 1 — Normal */}
              <Link
                to={normalMriPath}
                className="group rounded-xl border border-ucla-blue/30 bg-ucla-light/60 p-3 transition-colors hover:bg-ucla-light"
              >
                <div className="flex items-center gap-2">
                  <StepChip n={1} />
                  <span className="text-sm font-semibold text-[#003B5C]">See it normal</span>
                </div>
                <p className="mt-1.5 pl-7 text-xs text-gray-600">
                  Scroll, tour & check it in the workstation.
                </p>
              </Link>

              {/* 2 — Learn */}
              <div className="rounded-xl border border-gray-200 p-3">
                <div className="flex items-center gap-2">
                  <StepChip n={2} />
                  <span className="text-sm font-semibold text-gray-800">Learn</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5 pl-7">
                  {t.modules.map((m) => (
                    <Link
                      key={m.id}
                      to={coursePath(activeCourse, `/modules/${m.id}`)}
                      className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                    >
                      {m.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* 3 — Cases */}
              <div className="rounded-xl border border-gray-200 p-3">
                <div className="flex items-center gap-2">
                  <StepChip n={3} />
                  <span className="text-sm font-semibold text-gray-800">Read the cases <span className="font-normal text-gray-500">(optional)</span></span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5 pl-7">
                  {t.cases.map((c) => (
                    <Link
                      key={c.id}
                      to={coursePath(activeCourse, `/cases/${c.id}`)}
                      className="inline-flex rounded-md bg-ucla-gold/15 px-2 py-0.5 text-xs font-medium text-[#7a5d00] hover:bg-ucla-gold/25"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
