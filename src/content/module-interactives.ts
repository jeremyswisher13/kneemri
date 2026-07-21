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
          "Scroll medial → lateral through the real stack. Watch the meniscus change shape, and count the bow-ties.",
        teaching:
          "On a compartment slice the meniscus is two dark triangles (the anterior and posterior horns); on the peripheral body slices it becomes a single solid dark BOW-TIE. The normal meniscal body spans at least two consecutive bow-tie slices. TWO-SLICE-TOUCH RULE: only call a tear when abnormal signal reaches the articular surface on ≥2 consecutive images — signal on a single slice is usually volume averaging or a pseudotear. Fewer than two consecutive bow-ties is the “absent bow-tie” sign — a bucket-handle tear until proven otherwise.",
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
        instruction: "Toggle between the sagittal and coronal view of the same medial meniscus.",
        teaching:
          "The meniscus is one C-shaped structure, but each plane cuts it differently — a low-signal triangle (or bow-tie on the body slices) on the SAGITTAL, and a WEDGE pointing into the joint on the CORONAL. Seek an orthogonal correlate for a suspected tear because continuity across planes increases confidence and helps expose pseudotears or volume averaging. A subtle real tear may still be conspicuous in only one plane, so also use surface contact, morphology, and adjacent slices.",
        views: [
          {
            planeLabel: "Sagittal — triangle / bow-tie",
            dir: SAG,
            sliceIndex: 8,
            marker: { x: 66.6, y: 59.2, label: "Posterior horn (medial meniscus)" },
          },
          {
            planeLabel: "Coronal — wedge",
            dir: COR,
            sliceIndex: 7,
            marker: { x: 27, y: 56, label: "Medial meniscus (wedge)" },
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
            prompt: "On this medial compartment slice, what is the marked anterior structure?",
            options: [
              "Anterior horn (medial meniscus)",
              "Posterior horn",
              "Transverse (intermeniscal) ligament",
              "Anterior cruciate ligament",
            ],
            answer: 0,
            explanation:
              "The anterior horn of the medial meniscus — a low-signal triangle anteriorly. PITFALL: the transverse (intermeniscal) ligament crosses the front of the joint to meet the anterior horns; the cleft where it inserts is a PSEUDOTEAR — trace the round band across the fat before calling a tear.",
          },
          {
            id: "men-int-q2",
            sliceIndex: 8,
            marker: { x: 66.6, y: 59.2 },
            prompt: "What is the marked posterior structure?",
            options: [
              "Posterior horn (medial meniscus)",
              "Anterior horn",
              "Meniscofemoral ligament",
              "Posterior cruciate ligament",
            ],
            answer: 0,
            explanation:
              "The posterior horn of the medial meniscus — normally the LARGER horn medially. Only call a tear when bright signal reaches the articular surface on ≥2 consecutive slices; intrasubstance signal that does not reach a surface is degeneration (grade 1-2), not a tear. (At the lateral meniscus, the meniscofemoral ligament near the PCL makes a similar pseudotear.)",
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
          "Bone-marrow edema is ill-defined LOW signal on T1 and HIGH signal on PD-FS/STIR — and on a knee MRI its LOCATION is the diagnosis. Anchor yourself on the coronal: the medial and lateral femoral condyles above the joint line, the tibial plateau below it, and the central tibial spines. PIVOT-SHIFT (ACL tear): edema at the LATERAL femoral condyle + posterolateral tibial plateau. CLIP/valgus (MCL): LATERAL condyle + lateral plateau. Compare medial vs lateral side-by-side here — bipolar (both-sides-of-the-joint) edema means an impaction injury. Always re-check T1: a discrete dark LINE inside the edema is a fracture (changes weight-bearing), edema without a line is a contusion.",
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
              "The lateral femoral condyle (image-right). Its mid-weight-bearing surface + the posterolateral tibial plateau is the pivot-shift kissing-contusion pattern — assume the ACL is torn until proven otherwise.",
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
              "The tibial plateau. Scan its marrow for a discrete dark fracture LINE on T1 (a depressed plateau fracture) versus diffuse contusion edema — the distinction changes weight-bearing status.",
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
        startIndex: 21,
        instruction: "Scroll to the lateral notch slices and trace the ACL from the lateral femoral condyle down to the anterior tibia.",
        teaching:
          "A normal ACL is a straight, striated band running PARALLEL to Blumensaat's line (the roof of the intercondylar notch). It is volume-averaged on any one slice, so trace it across a couple: normal fibers stay continuous and parallel to the roof. If the fibers bow, sag below the roof, or go wavy/edematous — suspect a tear. Then confirm with the SECONDARY signs: a deep lateral femoral notch (terminal sulcus) sign, anterior tibial translation (>5 mm), and the pivot-shift bone contusions (posterolateral tibial plateau + mid lateral femoral condyle).",
        compare: {
          src: "/images/teaching/cases/acl-pivot-shift/02_ACL_Complete_Tear_Sagittal.jpg",
          caption: "Abnormal — complete ACL tear: the fibers are discontinuous and no longer parallel to Blumensaat's line. Compare with the straight, taut normal ACL on the stack above.",
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
          "The PCL is a thick, smooth, uniformly LOW-signal band arcing through the posterior notch — darker and more uniform than the striated ACL. Loss of its smooth arc, a buckled (wavy) contour, or focal thickening/edema suggests injury. A buckled PCL is also a SECONDARY sign of anterior tibial translation from an ACL tear. Pitfall: a second dark band paralleling the PCL in the notch is the DOUBLE PCL sign of a displaced bucket-handle meniscal fragment — not a second ligament.",
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
              "The MCL — a vertical band along the medial joint line. Grade it by depth (superficial vs deep) and level: proximal/femoral injuries tend to scar and heal, while distal (Stener-like) injuries may not. The deep MCL blends with the medial meniscus via its meniscofemoral and meniscotibial portions.",
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
              "The tibial spines (intercondylar eminence) are the central bony peaks and your midline coronal landmark. The cruciates attach in the intercondylar AREAS just beside the spines — the ACL anteriorly, the PCL far posteriorly — not on the peaks themselves. A tibial-eminence avulsion is the pediatric ACL-equivalent injury.",
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
          "Follow the extensor mechanism on the sagittal. The QUADRICEPS TENDON is striated and trilaminar — partial tears most often involve the DEEP (vastus intermedius) layer with intact superficial fibers, so they can be clinically subtle; it inserts on the superior pole of the patella. The PATELLAR TENDON runs from the inferior pole to the tibial tubercle, normally a few mm thick and uniformly dark — focal thickening (usually proximal) = tendinopathy, a fluid-filled gap with patella alta = rupture. HOFFA'S fat pad sits behind the patellar tendon; focal superolateral edema is the clue to anterior (Hoffa) impingement.",
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
