import type { MeasurementSection } from "@/components/ui/MeasurementsCard";

/**
 * Shoulder MRI Quick Reference content. Rendered with the shared collapsible
 * section renderer (MeasurementsCard). Kept deliberately concise and
 * management-focused for primary care sports medicine fellows.
 */

// ── Tab 1: Normal anatomy, planes, sequences, variants ──────────────────────
export const shoulderAnatomySections: MeasurementSection[] = [
  {
    title: "Planes — what each one answers",
    items: [
      {
        label: "Oblique coronal (parallel to supraspinatus)",
        detail:
          "Workhorse for supraspinatus and infraspinatus tears, tendon footprint, retraction, marrow edema, and the AC joint. Trace the cuff from musculotendinous junction to the greater tuberosity.",
      },
      {
        label: "Oblique sagittal (parallel to the glenoid face)",
        detail:
          "Best for muscle bulk and fatty infiltration (Goutallier grading on the 'Y' view), localizing which tendon is torn, the rotator interval, and acromial morphology / os acromiale.",
      },
      {
        label: "Axial",
        detail:
          "Best for the subscapularis, the long head of biceps in/out of its groove (medial subluxation), the labrum (Bankart, reverse Bankart, ALPSA), glenoid bone loss, and Hill-Sachs / reverse Hill-Sachs.",
      },
    ],
  },
  {
    title: "Sequences — what they're for",
    items: [
      {
        label: "Fluid-sensitive fat-saturated (T2 / PD FS)",
        detail:
          "Shows edema, bursitis, fluid filling a cuff defect, and marrow injury. A tear is more convincing when fluid-bright signal reaches a tendon surface.",
      },
      {
        label: "T1-weighted",
        detail:
          "Anatomy, marrow replacement, muscle fatty infiltration, and arthrogram contrast (bright) when present.",
      },
      {
        label: "Intermediate / PD (non-fat-sat)",
        detail:
          "Helpful for tendon morphology and labral signal. Confirm a suspected finding on at least two planes.",
      },
    ],
  },
  {
    title: "Normal rotator cuff",
    items: [
      {
        label: "Normal tendon",
        detail:
          "Uniformly low signal, smooth, inserting on the footprint without surface-reaching fluid-bright defect. Tendinosis = thickening + intermediate signal WITHOUT a surface defect.",
      },
      {
        label: "Magic-angle pitfall",
        detail:
          "Intermediate signal in the distal supraspinatus where the tendon curves ~55° to B0 on short-TE (T1/PD) sequences. It resolves on T2 — do not call it a tear.",
      },
    ],
  },
  {
    title: "Normal labrum & 'don't-overcall' variants",
    items: [
      {
        label: "Normal labrum",
        detail:
          "Triangular, uniformly low signal, firmly attached to the glenoid rim. Interpret superior labral signal in the context of age and sport before calling a SLAP tear.",
      },
      {
        label: "Sublabral recess",
        detail:
          "Normal smooth cleft under the superior labrum that parallels the glenoid and stops at the biceps anchor. A SLAP extends laterally into the labrum or posterior to the anchor with irregular margins.",
      },
      {
        label: "Sublabral foramen & Buford complex",
        detail:
          "Anterosuperior variants (1–3 o'clock). A Buford complex = absent anterosuperior labrum + cord-like middle glenohumeral ligament. Do not mistake either for a torn/detached labrum.",
      },
    ],
  },
  {
    title: "Normal biceps, pulley & capsule",
    items: [
      {
        label: "Long head of biceps",
        detail:
          "Centered in the bicipital groove on axial images. Medial perching/subluxation should trigger a search for an upper-border subscapularis / pulley lesion.",
      },
      {
        label: "Rotator interval & capsule",
        detail:
          "Normal subcoracoid fat triangle and a thin coracohumeral ligament. Obliteration of that fat + CHL thickening + a thickened axillary pouch supports adhesive capsulitis.",
      },
    ],
  },
];

// ── Tab 2: Measurements, grading & protocol decisions ───────────────────────
export const shoulderMeasurementSections: MeasurementSection[] = [
  {
    title: "Rotator cuff tear — what to report every time",
    items: [
      {
        label: "Five-part description",
        detail:
          "(1) Which tendon(s); (2) surface — articular-sided, bursal-sided, or full-thickness; (3) AP tear size; (4) retraction (Patte); (5) muscle atrophy / fatty infiltration (Goutallier). Surface + muscle quality are what change management.",
      },
      {
        label: "Tendinosis vs partial vs full-thickness",
        detail:
          "Tendinosis = thickening + intermediate signal, no surface defect. Partial = fluid-bright signal reaching ONE surface. Full-thickness = defect spanning articular-to-bursal with joint–bursa fluid communication.",
      },
      {
        label: "Partial-tear depth",
        detail:
          "Low-grade < 50% vs high-grade > 50% of tendon thickness. A high-grade partial tear behaves clinically closer to a significant structural lesion — not 'just tendinosis.'",
      },
    ],
  },
  {
    title: "Goutallier fatty infiltration (0–4)",
    items: [
      { label: "Grade 0", detail: "Normal muscle, no fat." },
      { label: "Grade 1", detail: "Some fatty streaks within the muscle." },
      { label: "Grade 2", detail: "Fatty infiltration present, but muscle > fat." },
      { label: "Grade 3", detail: "Fat = muscle (50/50)." },
      { label: "Grade 4", detail: "Fat > muscle." },
      {
        label: "Why it matters",
        detail:
          "Grade ≥ 3 predicts poor healing / higher retear and may indicate an irreparable tear. Assess on the oblique-sagittal 'Y' view at the scapular spine.",
      },
    ],
  },
  {
    title: "Patte retraction stage (1–3)",
    items: [
      { label: "Stage 1", detail: "Tendon stump near the footprint / greater tuberosity (minimal)." },
      { label: "Stage 2", detail: "Retraction to the level of the humeral head (moderate)." },
      { label: "Stage 3", detail: "Retraction to the glenoid level (advanced)." },
      {
        label: "Why it matters",
        detail:
          "Greater retraction + high Goutallier grade = harder repair and earlier surgical conversation.",
      },
    ],
  },
  {
    title: "Acromiohumeral interval",
    items: [
      {
        label: "Normal > 7 mm",
        detail:
          "Distance from the humeral head to the undersurface of the acromion on the coronal image.",
      },
      {
        label: "< 7 mm",
        detail: "Suggests cuff insufficiency with superior humeral migration.",
      },
      {
        label: "< 5 mm",
        detail:
          "Severe — consistent with chronic massive cuff tear / cuff-tear arthropathy.",
      },
    ],
  },
  {
    title: "Instability — bone loss & the glenoid track",
    items: [
      {
        label: "Critical glenoid bone loss",
        detail:
          "Attritional or fracture-related glenoid bone loss approaching ~20–25% shifts management from isolated soft-tissue (Bankart) repair toward a bony procedure (e.g., Latarjet).",
      },
      {
        label: "Glenoid track / engaging Hill-Sachs",
        detail:
          "An 'off-track' Hill-Sachs engages the anterior glenoid rim and predicts recurrent instability — it changes the surgical plan even with limited glenoid loss.",
      },
      {
        label: "Best test for bone loss",
        detail:
          "CT (often 3D with the humeral head subtracted) quantifies glenoid and humeral bone loss most accurately. MRI/MRA may underestimate it.",
      },
    ],
  },
  {
    title: "Lesion vocabulary — anterior instability",
    items: [
      { label: "Bankart", detail: "Anteroinferior labrum detached with disrupted/torn periosteum (± bony Bankart = glenoid rim fracture)." },
      { label: "Perthes", detail: "Anteroinferior labrum stripped but the periosteum is INTACT and the labrum is minimally displaced — easily missed; ABER view helps." },
      { label: "ALPSA", detail: "Labroligamentous complex displaced MEDIALLY along an intact periosteum and 'rolled up' on the glenoid neck — chronic/recurrent." },
      { label: "Hill-Sachs", detail: "Posterolateral humeral head impaction from an anterior dislocation." },
      { label: "HAGL", detail: "Humeral Avulsion of the Glenohumeral Ligament — IGHL torn from the HUMERAL neck with a 'J-sign' axillary pouch. A classic miss because attention is on the glenoid." },
    ],
  },
  {
    title: "Protocol — MRI vs MR arthrogram vs CT",
    items: [
      {
        label: "Non-contrast MRI (most primary care questions)",
        detail:
          "Excellent for cuff tendinosis/tears, subacromial-subdeltoid bursitis, AC joint, marrow/occult fracture, and adhesive-capsulitis support.",
      },
      {
        label: "MR arthrogram",
        detail:
          "Improves subtle labral/instability lesions, partial undersurface (articular-sided) cuff tears, and the postoperative labrum — when non-contrast MRI is equivocal or discordant with the exam.",
      },
      {
        label: "CT (often 3D)",
        detail:
          "Add when precise glenoid/humeral bone-loss quantification will change instability management.",
      },
    ],
  },
  {
    title: "Don't-miss: calcific tendinitis",
    items: [
      {
        label: "MRI appearance",
        detail:
          "A hydroxyapatite (calcific) deposit is LOW signal on T1 AND T2/fluid-sensitive sequences, so it is easy to overlook on MRI. Look for a focal low-signal focus in the tendon (often supraspinatus near the footprint) with surrounding edema. Radiographs and ultrasound show the deposit best — correlate.",
      },
      {
        label: "Acute pain crisis",
        detail:
          "Resorptive-phase calcific tendinitis causes severe atraumatic pain out of proportion to routine tendinopathy, often with florid peritendinous edema ± subacromial-subdeltoid bursitis (occasionally bursal rupture).",
      },
      {
        label: "Management differs from tendinosis",
        detail:
          "Usually conservative first (NSAIDs, activity modification, physical therapy); image-guided barbotage/aspiration or a subacromial injection is added for refractory or acute resorptive-phase pain. The point: it is not a structural cuff-repair problem — recognizing it changes the next step.",
      },
    ],
  },
];
