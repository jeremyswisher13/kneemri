/**
 * Interactive MRI blocks embedded inside reading modules (keyed by moduleId →
 * topicIndex → blocks[]). Phase 1 reuses the verified normal-knee stacks +
 * vetted markers; abnormal stills are pulled from the case bank for compare.
 * Rendered by ModuleInteractive within ModulePage. Decoupled from the prose so
 * the module content files stay clean.
 *
 * Every marker coordinate below is reused verbatim from the vision-verified
 * tour/quiz markers in normal-knee-learn.ts — no new, unvalidated positions.
 */
import type { Marker, QuizItem } from "@/content/normal-mri-types";

const SAG = "/images/teaching/stacks/normal-knee-sagittal"; // 29 slices
const COR = "/images/teaching/stacks/normal-knee-coronal"; // 19 slices

// Shoulder stacks (mirror the knee constants; counts verified against the dirs).
const SH_COR = "/images/teaching/stacks/normal-shoulder-coronal"; // 24 slices
const SH_AXI = "/images/teaching/stacks/normal-shoulder-axial"; // 30 slices

/** Shared attribution for the de-identified teaching stacks (matches the workstation). */
// Region-neutral: this attribution is shared across knee AND shoulder scroll-drills,
// so it must not name a body region (a shoulder stack was reading "knee").
export const STACK_ATTR = "De-identified normal MRI · UCLA Sports Medicine teaching collection";

export type InteractiveBlock =
  | {
      kind: "scroll-drill";
      title: string;
      dir: string;
      count: number;
      plane: string;
      startIndex?: number;
      instruction: string;
      teaching: string;
      /** Optional abnormal still for the "compare with abnormal" toggle. */
      compare?: { src: string; caption: string };
    }
  | {
      kind: "shape-shift";
      title: string;
      instruction: string;
      teaching: string;
      /** Toggle between these views of the SAME structure across planes. */
      views: { planeLabel: string; dir: string; sliceIndex: number; marker: Marker }[];
    }
  | {
      kind: "spot-quiz";
      title: string;
      instruction: string;
      dir: string;
      planeLabel: string;
      items: QuizItem[];
    }
  | {
      kind: "annotate";
      title: string;
      instruction: string;
      teaching: string;
      dir: string;
      sliceIndex: number;
      planeLabel: string;
      markers: Marker[];
    };

export const moduleInteractives: Record<string, Record<number, InteractiveBlock[]>> = {
  // ─────────────────────────── MENISCI ───────────────────────────
  menisci: {
    // Topic 1 (0-based): "Two-slice-touch rule for tear diagnosis"
    1: [
      {
        kind: "scroll-drill",
        title: "Scroll the meniscus — the two-slice-touch rule & bow-tie count",
        dir: SAG,
        count: 29,
        plane: "Sagittal PD-FS",
        startIndex: 8,
        instruction:
          "Scroll lateral → medial through the real stack. Watch each meniscus change shape, and count the bow-ties.",
        teaching:
          "On a compartment slice the meniscus is two dark triangles (the anterior and posterior horns); on the peripheral body slices it becomes a single solid dark BOW-TIE. A normal meniscal body usually spans at least two consecutive bow-tie slices. TWO-SLICE-TOUCH RULE: surface-reaching signal on ≥2 matching images gives high confidence for a tear; those images need not be contiguous and may be one sagittal plus one coronal image at the same site. A single-image finding has lower predictive value and needs morphology and orthogonal correlation. Fewer than two consecutive bow-ties is the absent-bow-tie sign of a displaced tear, provided prior meniscectomy and slice-thickness effects are excluded.",
        compare: {
          src: "/images/teaching/cases/bucket-handle/bh_donor_site.jpg",
          caption:
            "Abnormal — bucket-handle donor site: the posterior horn is truncated because the meniscal body has flipped into the notch (arrow). Compare with the full bow-ties on the normal stack above.",
        },
      },
    ],
    // Topic 2 (0-based): "Tear morphology: horizontal, vertical, radial, complex"
    2: [
      {
        kind: "shape-shift",
        title: "Same meniscus, two shapes — flip between planes",
        instruction: "Toggle between the sagittal and coronal view of the same lateral meniscus.",
        teaching:
          "The meniscus is one C-shaped structure, but each plane cuts it differently — a low-signal triangle (or bow-tie on the body slices) on the SAGITTAL, and a WEDGE pointing into the joint on the CORONAL. Seek an orthogonal correlate for a suspected tear because continuity across planes increases confidence and helps expose pseudotears or volume averaging. A subtle real tear may still be conspicuous in only one plane, so also use surface contact, morphology, and adjacent slices.",
        views: [
          {
            planeLabel: "Sagittal — triangle / bow-tie",
            dir: SAG,
            sliceIndex: 8,
            marker: { x: 61, y: 59.2, label: "Posterior horn (lateral meniscus)" },
          },
          {
            planeLabel: "Coronal — wedge",
            dir: COR,
            sliceIndex: 7,
            marker: { x: 69, y: 55, label: "Lateral meniscus (wedge)" },
          },
        ],
      },
      {
        kind: "spot-quiz",
        title: "Name the meniscal structure — and don’t overcall the pseudotears",
        instruction: "Identify the marked structure. Watch for the two ligaments that mimic tears.",
        dir: SAG,
        planeLabel: "Sagittal PD-FS",
        items: [
          {
            id: "men-int-q1",
            sliceIndex: 8,
            marker: { x: 40, y: 61 },
            prompt: "On this lateral-compartment slice, what is the marked anterior structure?",
            options: [
              "Anterior horn (lateral meniscus)",
              "Posterior horn",
              "Transverse (intermeniscal) ligament",
              "Anterior cruciate ligament",
            ],
            answer: 0,
            explanation:
              "The anterior horn of the lateral meniscus — a low-signal triangle anteriorly. PITFALL: the transverse (intermeniscal) ligament crosses the front of the joint to meet the anterior horns; the cleft where it inserts can mimic a tear, so trace the round band across the fat.",
          },
          {
            id: "men-int-q2",
            sliceIndex: 8,
            marker: { x: 66.6, y: 59.2 },
            prompt: "What is the marked posterior structure?",
            options: [
              "Posterior horn (lateral meniscus)",
              "Anterior horn",
              "Meniscofemoral ligament",
              "Posterior cruciate ligament",
            ],
            answer: 0,
            explanation:
              "The posterior horn of the lateral meniscus. The adjacent meniscofemoral ligament and popliteal hiatus can mimic tears. Surface-reaching signal on two or more matching images gives high confidence; the images need not be contiguous, and intrasubstance signal that does not reach a surface is degeneration rather than a tear.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────── BONES & MARROW ───────────────────────────
  "bones-marrow": {
    // Topic 0 (0-based): "Marrow edema patterns and injury mechanisms"
    0: [
      {
        kind: "annotate",
        title: "Where the marrow patterns live — the coronal landmarks",
        instruction:
          "Reveal the four landmarks, then learn where each classic contusion pattern lands.",
        teaching:
          "Bone-marrow edema-like signal is ill-defined LOW signal on T1 and HIGH signal on PD-FS/STIR; its DISTRIBUTION suggests a mechanism and directs the rest of the search. Anchor yourself on the coronal: the medial and lateral femoral condyles above the joint line, the tibial plateau below it, and the central tibial spines. PIVOT-SHIFT: lateral femoral condyle + posterolateral tibial plateau. A direct lateral blow/valgus mechanism may produce lateral-compartment contact edema plus medial-sided soft-tissue injury, but distribution varies. Paired opposing-surface edema supports an impaction mechanism. Re-check T1/non-fat-suppressed images for a fracture line, while remembering that edema without a visible line is nonspecific and does not by itself prove a contusion or exclude an occult/subchondral fracture.",
        dir: COR,
        sliceIndex: 7,
        planeLabel: "Coronal PD-FS",
        markers: [
          { x: 28.5, y: 45.9, label: "Medial femoral condyle" },
          { x: 66.6, y: 44.9, label: "Lateral femoral condyle" },
          { x: 40, y: 61.5, label: "Tibial plateau" },
          { x: 48, y: 49, label: "Tibial spines (intercondylar eminence)" },
        ],
      },
      {
        kind: "spot-quiz",
        title: "Name the marrow landmark — then place the pattern",
        instruction: "Identify the marked bony landmark on this mid-joint coronal slice.",
        dir: COR,
        planeLabel: "Coronal PD-FS",
        items: [
          {
            id: "bones-int-q1",
            sliceIndex: 7,
            marker: { x: 66.6, y: 44.9 },
            prompt:
              "Edema here, paired with the posterolateral tibial plateau, is the pivot-shift pattern. What is the marked bone?",
            options: [
              "Lateral femoral condyle",
              "Medial femoral condyle",
              "Tibial plateau",
              "Tibial spine",
            ],
            answer: 0,
            explanation:
              "The lateral femoral condyle (image-right). Its mid-weight-bearing surface plus the posterolateral tibial plateau is the pivot-shift contusion pattern, which should trigger careful direct assessment of the ACL in every plane.",
          },
          {
            id: "bones-int-q2",
            sliceIndex: 7,
            marker: { x: 40, y: 61.5 },
            prompt: "What is the marked structure below the joint line?",
            options: [
              "Tibial plateau",
              "Medial femoral condyle",
              "Tibial spine",
              "Fibular head",
            ],
            answer: 0,
            explanation:
              "The tibial plateau. Scan its marrow for a discrete low-signal fracture line on T1 and inspect the articular surface for depression. Diffuse edema-like signal is nonspecific, so use the clinical mechanism, T1 appearance, morphology, and CT when needed.",
          },
        ],
      },
    ],
  },

  // ─────────────────── CARTILAGE & OSTEOCHONDRAL ───────────────────
  "cartilage-osteochondral": {
    // Topic 0 (0-based): "Cartilage evaluation by compartment"
    0: [
      {
        kind: "annotate",
        title: "Trace the cartilage — compare compartments",
        instruction: "Reveal the structures, then trace the cartilage layer across each compartment.",
        teaching:
          "Articular cartilage is the smooth, intermediate-signal layer capping the bone ends, outlined by a thin bright rim of joint fluid on PD-FS. Trace it as an even gray band over each condyle and plateau, and compare MEDIAL vs LATERAL directly on the coronal. Focal thinning, a surface fissure, or a flap — especially with underlying bone-marrow edema — is a chondral lesion. The medial compartment bears the greater share of load, so early cartilage loss often shows there first.",
        dir: COR,
        sliceIndex: 7,
        planeLabel: "Coronal PD-FS",
        markers: [
          { x: 38, y: 53, label: "Articular cartilage (medial)" },
          { x: 28.5, y: 45.9, label: "Medial femoral condyle" },
          { x: 66.6, y: 44.9, label: "Lateral femoral condyle" },
          { x: 40, y: 61.5, label: "Tibial plateau" },
        ],
      },
    ],
  },

  // ─────────────────────────── LIGAMENTS ───────────────────────────
  ligaments: {
    // Topic 0: "ACL tear: primary and secondary signs"
    0: [
      {
        kind: "scroll-drill",
        title: "Trace the ACL — then check the secondary signs",
        dir: SAG,
        count: 29,
        plane: "Sagittal PD-FS",
        startIndex: 12,
        instruction: "Scroll to the lateral notch slices and trace the ACL from the lateral femoral condyle down to the anterior tibia.",
        teaching:
          "A normal ACL is a continuous, taut, low-signal fascicular band with an expected oblique course near the notch roof. Because it is volume-averaged on any one slice, trace femoral attachment, midsubstance, and tibial attachment across adjacent images and confirm continuity in another plane. Discontinuity, abnormal orientation/laxity, or edema with disrupted fibers are primary tear findings. A deep lateral femoral-notch contour, increased anterior tibial translation (thresholds vary by method), PCL buckling, and pivot-shift contusions are supportive secondary signs, not independent proof.",
        compare: {
          src: "/images/teaching/cases/acl-pivot-shift/02_ACL_Complete_Tear_Sagittal.jpg",
          caption: "Abnormal — complete ACL tear: the fibers are discontinuous with abnormal orientation. Compare with the continuous, taut normal ACL on the stack above.",
        },
      },
    ],
    // Topic 3: "PCL tear patterns and dashboard mechanism" (no image otherwise)
    3: [
      {
        kind: "annotate",
        title: "Find the PCL — the smooth dark arc",
        instruction: "Reveal the PCL on this midline sagittal slice, then trace its smooth curve.",
        teaching:
          "The PCL is a thick, smooth, low-signal band arcing through the posterior notch — darker and more uniform than the striated ACL. Fiber discontinuity is a direct tear sign; focal thickening and increased fluid-sensitive signal can support a partial/interstitial injury in the right clinical context. Buckling by itself is not a primary PCL-tear sign because it can reflect anterior tibial translation from ACL insufficiency. Pitfall: a second dark band paralleling the PCL in the notch can be the double-PCL sign of a displaced bucket-handle meniscal fragment.",
        dir: SAG,
        sliceIndex: 16,
        planeLabel: "Sagittal PD-FS",
        markers: [{ x: 50, y: 47, label: "Posterior cruciate ligament" }],
      },
    ],
    // Topic 5: "LCL and posterolateral corner (PLC) anatomy and injury"
    5: [
      {
        kind: "spot-quiz",
        title: "Name the collateral ligaments and the cruciate landmark",
        instruction: "Identify the marked structure on this coronal slice.",
        dir: COR,
        planeLabel: "Coronal PD-FS",
        items: [
          {
            id: "lig-int-q1",
            sliceIndex: 7,
            marker: { x: 14, y: 54 },
            prompt: "What is the marked MEDIAL peripheral structure?",
            options: ["Medial collateral ligament (MCL)", "Lateral collateral ligament", "Medial meniscus", "Iliotibial band"],
            answer: 0,
            explanation:
              "The MCL — a vertical band along the medial joint line. Grade it by layer (superficial vs deep), level, and displacement. A distal superficial-MCL tear displaced over the pes tendons is a Stener-like pattern that can impede anatomic healing. The deep MCL blends with the medial meniscus through its meniscofemoral and meniscotibial portions.",
          },
          {
            id: "lig-int-q2",
            sliceIndex: 7,
            marker: { x: 78, y: 53 },
            prompt: "What is the marked LATERAL peripheral structure?",
            options: ["Lateral collateral ligament (LCL)", "Medial collateral ligament", "Patellar tendon", "Posterior cruciate ligament"],
            answer: 0,
            explanation:
              "The LCL (fibular collateral ligament) runs from the lateral femoral epicondyle to the fibular head. It is part of the POSTEROLATERAL CORNER — the commonly-missed trio of LCL, popliteus tendon, and popliteofibular ligament. An arcuate (fibular styloid) avulsion fragment signals a PLC injury.",
          },
          {
            id: "lig-int-q3",
            sliceIndex: 7,
            marker: { x: 48, y: 49 },
            prompt: "The cruciate ligaments anchor in the intercondylar area beside these central bony peaks. What are the peaks?",
            options: ["Tibial spines (intercondylar eminence)", "The cruciate ligaments themselves", "Medial femoral condyle", "Trochlear groove"],
            answer: 0,
            explanation:
              "The tibial spines (intercondylar eminence) are the central bony peaks and your midline coronal landmark. The cruciates attach in the intercondylar AREAS just beside the spines — the ACL anteriorly, the PCL far posteriorly — not on the peaks themselves. A tibial-eminence avulsion in a child or adolescent is an osseous ACL-attachment injury; assess displacement, comminution, and associated soft-tissue injury.",
          },
        ],
      },
    ],
  },

  // ──────────────────── EXTENSOR MECHANISM & SYNOVIUM ────────────────────
  "extensor-synovium": {
    // Topic 0: "Quadriceps tendon tears: partial vs complete"
    0: [
      {
        kind: "annotate",
        title: "Trace the extensor mechanism",
        instruction: "Reveal the structures, then trace the extensor mechanism from the quadriceps tendon to the tibial tubercle.",
        teaching:
          "Follow the extensor mechanism on the sagittal. The QUADRICEPS TENDON is striated and multilayered — a partial tear can involve only one layer, including the deep vastus-intermedius contribution, while other fibers remain intact; it inserts on the superior pole of the patella. The PATELLAR TENDON runs from the inferior pole to the tibial tubercle, normally a few mm thick and uniformly dark — focal thickening (usually proximal) supports tendinopathy, while a fluid-filled fiber gap supports rupture. HOFFA'S fat pad sits behind the patellar tendon; focal superolateral edema can accompany patellofemoral maltracking/impingement but is not specific in isolation.",
        dir: SAG,
        sliceIndex: 13,
        planeLabel: "Sagittal PD-FS",
        markers: [
          { x: 14, y: 22, label: "Quadriceps tendon" },
          { x: 16, y: 36, label: "Patella" },
          { x: 20, y: 68, label: "Patellar tendon" },
          { x: 24, y: 60, label: "Hoffa's fat pad" },
        ],
      },
    ],
  },

  // ═══════════════════════════ SHOULDER MODULES ═══════════════════════════
  // Reuses the vision-verified normal-shoulder stacks + the markers/slices from
  // normalShoulderLearn — no new, unvalidated positions.

  // ──────────────────── SHOULDER ORIENTATION & ANATOMY ────────────────────
  "shoulder-mri-orientation": {
    // Topic 1 (0-based): "Oblique coronal, oblique sagittal, and axial orientation"
    1: [
      {
        kind: "annotate",
        title: "Name the structures on the oblique coronal",
        instruction:
          "Reveal the structures, then orient yourself on the cuff's working plane.",
        teaching:
          "The oblique CORONAL is cut PARALLEL to the supraspinatus, so you can follow the cuff tendon along its length to the greater-tuberosity footprint. Superior is up. On this right shoulder the humeral head/greater tuberosity sit LATERAL (image-left) and the glenoid is MEDIAL (image-right). The supraspinatus tendon caps the head toward its footprint; the thin subacromial–subdeltoid bursa is the fat/fluid plane between the cuff and the overlying acromion/deltoid; the axillary recess is the dependent inferior capsular pouch. Build the habit of saying which plane answers which question — coronal for cuff tendon length and retraction.",
        dir: SH_COR,
        sliceIndex: 11,
        planeLabel: "Oblique coronal T2-FS",
        markers: [
          { x: 34, y: 58, label: "Humeral head" },
          { x: 53, y: 57, label: "Glenoid & labrum" },
          { x: 33, y: 32, label: "Subacromial–subdeltoid bursa" },
          { x: 45, y: 19, label: "Acromion / AC joint" },
          { x: 16, y: 52, label: "Deltoid" },
          { x: 38, y: 82, label: "Axillary recess" },
        ],
      },
    ],
  },

  // ─────────────────────────── ROTATOR CUFF ───────────────────────────
  "shoulder-rotator-cuff": {
    // Topic 0 (0-based): "Tendinosis versus tear"
    0: [
      {
        kind: "scroll-drill",
        title: "Follow the supraspinatus to its footprint — tendinosis vs tear",
        dir: SH_COR,
        count: 24,
        plane: "Oblique coronal T2-FS",
        startIndex: 7,
        instruction:
          "Scroll anterior → posterior through the real stack and follow the supraspinatus tendon out to the greater tuberosity.",
        teaching:
          "On the coronal the supraspinatus tendon is a uniform LOW-signal band draped over the humeral head to its greater-tuberosity footprint. TENDINOSIS is tendon thickening with intermediate signal but NO discrete fluid-bright surface defect. A TEAR is fluid-bright signal that reaches a surface or spans the tendon — watch the hypovascular 'critical zone' ~1 cm from the footprint, where degenerative tears begin. Confirm any suspected tear on a second plane: a real defect tracks; an isolated bright focus from magic-angle or volume averaging does not. A subcortical cyst or marrow edema at the footprint is a soft sign of an adjacent cuff tear.",
        compare: {
          src: "/images/teaching/shoulder/fullthickness-supraspinatus.jpg",
          caption:
            "Abnormal — full-thickness supraspinatus tear: a fluid-bright gap at the footprint (arrowheads) interrupts the tendon. Compare with the continuous low-signal tendon on the normal stack above.",
        },
      },
    ],
  },

  // ─────────────────────── LABRUM & INSTABILITY ───────────────────────
  "shoulder-labrum-instability": {
    // Topic 0 (0-based): "Labral quadrants and normal variants"
    0: [
      {
        kind: "annotate",
        title: "Name the labrum and the biceps on the axial",
        instruction:
          "Reveal the structures, then walk the labral clock-face on the instability plane.",
        teaching:
          "The AXIAL is your plane for the labrum and the biceps in its groove. Anterior is at the TOP, posterior at the bottom; the round humeral head is lateral (image-left), the glenoid medial. The labrum is a low-signal triangle at each glenoid rim — the ANTERIOR (upper) and POSTERIOR (lower) labrum. The anteroinferior labrum is the BANKART zone, the #1 lesion of anterior instability; a blunted/torn posterior labrum points to posterior instability. The long head of biceps is a small dark dot in the bicipital groove — an EMPTY groove means it is torn or medially dislocated. Trace the subscapularis along the front toward the lesser tuberosity; its tears are a classic axial miss, and medial biceps subluxation is the companion clue.",
        dir: SH_AXI,
        sliceIndex: 13,
        planeLabel: "Axial PD-FS",
        markers: [
          { x: 50, y: 49, label: "Anterior labrum (Bankart zone)" },
          { x: 49, y: 63, label: "Posterior labrum" },
          { x: 44, y: 40, label: "Biceps tendon (groove)" },
          { x: 39, y: 33, label: "Subscapularis" },
        ],
      },
    ],
  },
};
