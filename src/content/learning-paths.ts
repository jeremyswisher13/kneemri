import type { CourseDefinition } from "@/content/courses";

export interface LearningTrack {
  id: string;
  title: string;
  blurb: string;
  planes: string;
  modules: { id: string; title: string }[];
  cases: { id: string; label: string }[];
}

type BodyRegion = CourseDefinition["bodyRegion"];

const KNEE_TRACKS: LearningTrack[] = [
  {
    id: "cruciates",
    title: "The Cruciates: ACL & PCL",
    blurb: "Lock in the normal taut, low-signal cruciate bands, then learn how they fail.",
    planes: "sagittal notch / coronal tibial spines",
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
    blurb: "Normal low-signal triangles and the bow-tie body, then tears, displaced fragments, roots, and extrusion.",
    planes: "sagittal horns / coronal body",
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
    blurb: "Anchor normal cartilage and fatty marrow, then work through chondral loss, OCD, and subchondral fracture.",
    planes: "sagittal/coronal cartilage / T1 marrow",
    modules: [
      { id: "cartilage-osteochondral", title: "Cartilage & Osteochondral" },
      { id: "bones-marrow", title: "Bones & Marrow" },
    ],
    cases: [
      { id: "degenerative-knee-oa", label: "Tricompartmental OA" },
      { id: "ocd-stability", label: "OCD stability" },
      { id: "sifk-sonk", label: "SIF / SIF-ON" },
    ],
  },
  {
    id: "extensor-pf",
    title: "Extensor & Patellofemoral",
    blurb: "Trace the normal extensor mechanism and MPFL, then connect dislocation patterns and tendon failure.",
    planes: "axial patellofemoral / sagittal extensor",
    modules: [{ id: "extensor-synovium", title: "Extensor Mechanism & Synovium" }],
    cases: [
      { id: "patellar-dislocation-mpfl", label: "Patellar dislocation + MPFL" },
      { id: "patellar-tendon-rupture", label: "Patellar tendon rupture" },
    ],
  },
  {
    id: "collaterals",
    title: "Collaterals & Corners",
    blurb: "Trace the normal MCL, LCL, and posterolateral corner before grading sprains and avulsions.",
    planes: "coronal medial/lateral edges",
    modules: [{ id: "ligaments", title: "Ligaments" }],
    cases: [
      { id: "mcl-distal-avulsion", label: "MCL avulsion" },
      { id: "pcl-plc-dashboard", label: "PLC injury" },
      { id: "multiligament", label: "Multiligament injury" },
    ],
  },
];

const SHOULDER_TRACKS: LearningTrack[] = [
  {
    id: "rotator-cuff",
    title: "The Rotator Cuff",
    blurb: "Lock in the normal low-signal cuff tendons and muscle bulk, then grade tears and chronicity.",
    planes: "coronal footprint / sagittal muscles",
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
    blurb: "Anchor the normal labrum and capsule, then connect Bankart, Hill-Sachs, and SLAP patterns.",
    planes: "axial labrum / sagittal and coronal",
    modules: [{ id: "shoulder-labrum-instability", title: "Labrum & Instability" }],
    cases: [
      { id: "shoulder-anterior-instability-bankart", label: "Bankart + Hill-Sachs" },
      { id: "shoulder-slap-biceps-anchor", label: "SLAP / biceps anchor" },
    ],
  },
  {
    id: "biceps-interval-ac",
    title: "Biceps, Interval & AC Joint",
    blurb: "Follow the normal biceps through the interval and groove, then find pulley and hidden subscapularis lesions.",
    planes: "sagittal interval / axial groove",
    modules: [{ id: "shoulder-biceps-interval-ac", title: "Biceps, Interval & AC" }],
    cases: [
      { id: "shoulder-subscapularis-biceps-hidden-lesion", label: "Hidden subscap/biceps lesion" },
      { id: "shoulder-slap-biceps-anchor", label: "SLAP / biceps anchor" },
    ],
  },
  {
    id: "capsule-arthritis",
    title: "Capsule, Bursa & Arthritis",
    blurb: "Read the capsule, axillary recess, bursae, and cartilage before separating stiffness, inflammation, and arthropathy.",
    planes: "axillary recess / rotator interval",
    modules: [{ id: "shoulder-arthritis-bursa-dontmiss", title: "Arthritis, Bursa & Don't-Miss" }],
    cases: [
      { id: "shoulder-adhesive-capsulitis", label: "Adhesive capsulitis" },
      { id: "shoulder-cuff-tendinosis-bursitis", label: "Subacromial bursitis" },
      { id: "shoulder-massive-cuff-arthropathy", label: "Cuff tear arthropathy" },
    ],
  },
];

const HIP_TRACKS: LearningTrack[] = [
  {
    id: "fai-labrum",
    title: "FAI, Labrum & Cartilage",
    blurb: "Build the normal head-neck, acetabular-rim, and cartilage map before interpreting impingement morphology and chondrolabral injury.",
    planes: "axial/sagittal head-neck / coronal roof",
    modules: [
      { id: "hip-fai-labrum", title: "FAI & Labrum" },
      { id: "hip-cartilage-oa", title: "Cartilage & OA" },
    ],
    cases: [
      { id: "hip-cam-fai-labral-tear", label: "Cam FAI + labral tear" },
      { id: "hip-pincer-fai-retroversion", label: "Pincer FAI + retroversion" },
    ],
  },
  {
    id: "marrow-stress",
    title: "Marrow, Stress Injury & AVN",
    blurb: "Anchor normal T1 marrow and the subchondral contour, then separate stress fracture, AVN, and transient or insufficiency patterns.",
    planes: "coronal T1/fluid-sensitive / sagittal head-neck",
    modules: [
      { id: "hip-bones-stress", title: "Bones & Stress Injury" },
      { id: "hip-dont-miss", title: "Don't-Miss Findings" },
    ],
    cases: [
      { id: "hip-femoral-neck-stress-fracture", label: "Femoral-neck stress fracture" },
      { id: "hip-avn-femoral-head", label: "Femoral-head AVN" },
      { id: "hip-transient-bme-vs-sifk", label: "Transient BME vs SIFK" },
    ],
  },
  {
    id: "lateral-hip",
    title: "Abductors & Lateral Hip",
    blurb: "Trace gluteus medius and minimus to their facets, then connect tendon failure and peritrochanteric findings to symptoms.",
    planes: "coronal/axial greater trochanter",
    modules: [{ id: "hip-tendons-muscles", title: "Tendons & Muscles" }],
    cases: [{ id: "hip-gluteus-medius-tear-gtps", label: "Gluteus medius tear / GTPS" }],
  },
  {
    id: "posterior-groin",
    title: "Posterior Hip & Groin",
    blurb: "Follow the hamstring origin and pubic/aponeurotic anatomy before reading avulsion and athletic-groin patterns.",
    planes: "axial pelvis / coronal ischium and pubis",
    modules: [
      { id: "hip-anatomy", title: "Normal Anatomy" },
      { id: "hip-tendons-muscles", title: "Tendons & Muscles" },
    ],
    cases: [
      { id: "hip-proximal-hamstring-avulsion", label: "Proximal hamstring avulsion" },
      { id: "hip-athletic-pubalgia", label: "Athletic pubalgia" },
    ],
  },
];

const ELBOW_TRACKS: LearningTrack[] = [
  {
    id: "thrower-medial",
    title: "Thrower's Elbow & UCL",
    blurb: "Trace the normal anterior UCL bundle and medial valgus structures before interpreting overload and instability.",
    planes: "coronal UCL / axial medial compartment",
    modules: [
      { id: "elbow-ucl-valgus", title: "UCL & Valgus Overload" },
      { id: "elbow-nerves", title: "Nerves" },
    ],
    cases: [
      { id: "elbow-ucl-tear-thrower", label: "Thrower's UCL tear" },
      { id: "elbow-veo-posteromedial-loose-body", label: "Valgus-extension overload" },
      { id: "elbow-cubital-tunnel-ulnar-neuritis", label: "Cubital tunnel neuritis" },
    ],
  },
  {
    id: "radiocapitellar",
    title: "Radiocapitellar Bone & Cartilage",
    blurb: "Anchor the normal capitellum, radial head, and marrow before assessing OCD stability and occult fracture.",
    planes: "coronal face / sagittal contour",
    modules: [
      { id: "elbow-bones-marrow", title: "Bones & Marrow" },
      { id: "elbow-dont-miss", title: "Don't-Miss Findings" },
    ],
    cases: [
      { id: "elbow-capitellar-ocd", label: "Capitellar OCD" },
      { id: "elbow-occult-radial-head-fracture", label: "Occult radial-head fracture" },
    ],
  },
  {
    id: "lateral-stability",
    title: "Lateral Tendon & Stability",
    blurb: "Read the common extensor origin together with the RCL/LUCL complex so deep tears and PLRI are not missed.",
    planes: "coronal lateral origin / axial complex",
    modules: [
      { id: "elbow-lcl-plri", title: "LCL Complex & PLRI" },
      { id: "elbow-tendons", title: "Tendons" },
    ],
    cases: [{ id: "elbow-lateral-epicondylitis-lucl", label: "Lateral epicondylitis + LUCL" }],
  },
  {
    id: "anterior-posterior-tendons",
    title: "Distal Biceps & Triceps",
    blurb: "Follow anterior and posterior tendon continuity, footprint, retraction, and associated muscle findings across planes.",
    planes: "axial footprint / sagittal continuity",
    modules: [{ id: "elbow-tendons", title: "Tendons" }],
    cases: [{ id: "elbow-distal-biceps-tear", label: "Distal biceps tear" }],
  },
  {
    id: "medial-nerve",
    title: "Medial Tendon & Ulnar Nerve",
    blurb: "Pair the flexor-pronator origin with the UCL and cubital tunnel instead of reading each finding in isolation.",
    planes: "coronal medial origin / axial cubital tunnel",
    modules: [
      { id: "elbow-tendons", title: "Tendons" },
      { id: "elbow-nerves", title: "Nerves" },
    ],
    cases: [
      { id: "elbow-medial-epicondylitis-ulnar", label: "Medial epicondylitis + ulnar nerve" },
      { id: "elbow-cubital-tunnel-ulnar-neuritis", label: "Cubital tunnel neuritis" },
    ],
  },
];

export const LEARNING_TRACKS_BY_REGION: Record<BodyRegion, LearningTrack[]> = {
  knee: KNEE_TRACKS,
  shoulder: SHOULDER_TRACKS,
  hip: HIP_TRACKS,
  elbow: ELBOW_TRACKS,
};
