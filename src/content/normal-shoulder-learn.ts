/**
 * Interactive "master normal first" content for the Normal Shoulder MRI workstation.
 * Mirrors the knee: each plane (keyed by its SERIES id in NormalShoulderMriPage)
 * has a Guided Tour, a Knowledge Check, "watch for" pearls, and an Advanced bank.
 *
 * Marker coordinates are PERCENTAGES of the displayed slice image (x = left,
 * y = top). sliceIndex is 0-based into that plane's stack (slice_01.jpg = index 0).
 *
 * Marker positions AND the orientation (anterior/posterior on sagittal, medial/
 * lateral on coronal) were verified against the actual slices by independent
 * MSK-radiologist review (two reads per plane + a confirmation pass). Structure
 * names, teaching notes, and quiz keys are correct. Fine-tune further via Adjust.
 */
import type { PlaneLearn, AdvancedQ, CorrelationItem, ImageCaqQ, StructureCorrelate, StructureReading } from "./normal-mri-types";

const WHAT = "What is the marked structure?";

// Stack directories (under /public) for the cross-plane drill.
const SAG = "/images/teaching/stacks/normal-shoulder-sagittal";
const COR = "/images/teaching/stacks/normal-shoulder-coronal";
const AXI = "/images/teaching/stacks/normal-shoulder-axial";
const SAG_T1 = "/images/teaching/stacks/normal-shoulder-sagittal-t1";

export const normalShoulderLearn: Record<string, PlaneLearn> = {
  // ───────────────────────────────────────────────────────────────────────
  // OBLIQUE SAGITTAL T2-FS  (stack: normal-shoulder-sagittal, 28 slices)
  // THE plane for rotator-cuff muscle bulk/atrophy and acromial shape.
  // Scroll medial → lateral. Cuff muscle bellies ~ index 5; mid-glenoid ~ index 9;
  // humeral head ringed by the cuff ~ index 11–17.
  // ───────────────────────────────────────────────────────────────────────
  "sag-t2fs": {
    tour: [
      {
        sliceIndex: 11,
        markers: [],
        title: "Get oriented",
        note: "Oblique sagittal T2 fat-sat — cut PERPENDICULAR to the supraspinatus. The key plane for rotator-cuff muscle bulk/atrophy and acromial shape. Superior is up; on this right shoulder, anterior is image-left and posterior is image-right. Fluid is bright, fat suppressed. Scroll medial → lateral.",
      },
      {
        sliceIndex: 5,
        markers: [{ x: 45, y: 28, label: "Supraspinatus muscle" }],
        title: "Rotator-cuff muscles (medial slice)",
        note: "On the medial sagittal slices the four cuff muscle BELLIES are seen in cross-section around the scapula — supraspinatus on top (in the fossa above the spine), subscapularis anterior, infraspinatus and teres minor posterior. This is THE view to grade muscle bulk and fatty atrophy (Goutallier–Fuchs).",
      },
      {
        sliceIndex: 5,
        markers: [{ x: 27, y: 59, label: "Subscapularis" }],
        title: "Subscapularis",
        note: "The anterior cuff muscle and the largest of the four; its tendon inserts on the lesser tuberosity. Tears often pair with medial subluxation of the biceps tendon.",
      },
      {
        sliceIndex: 5,
        markers: [{ x: 60, y: 55, label: "Infraspinatus / teres minor" }],
        title: "Infraspinatus & teres minor",
        note: "The posterior cuff — infraspinatus superior, teres minor inferior. Isolated teres-minor fatty atrophy points to a quadrilateral-space / axillary-nerve problem.",
      },
      {
        sliceIndex: 9,
        markers: [{ x: 43, y: 51, label: "Glenoid & labrum" }],
        title: "Glenoid & labrum",
        note: "Through the glenoid you see the socket en face rimmed by the low-signal labrum, with the glenohumeral ligaments. Trace the labral clock-face; the 12 o'clock biceps anchor is the SLAP zone.",
      },
      {
        sliceIndex: 9,
        markers: [{ x: 47, y: 36, label: "Biceps / rotator interval" }],
        title: "Biceps & rotator interval",
        note: "Between the supraspinatus and subscapularis lies the rotator interval — the long head of biceps with its pulley (coracohumeral + superior glenohumeral ligaments). A torn pulley lets the biceps subluxate medially.",
      },
      {
        sliceIndex: 17,
        markers: [{ x: 43, y: 52, label: "Humeral head" }],
        title: "Humeral head",
        note: "On a lateral sagittal slice the humeral head is a round ball capped by the cuff tendons — smooth cortex, bright fatty marrow, even articular cartilage.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 44, y: 28, label: "Supraspinatus tendon" }],
        title: "Supraspinatus tendon",
        note: "The cuff tendon draped over the SUPERIOR humeral head toward its greater-tuberosity footprint — uniform low signal. Supraspinatus sits at the top of the cuff on sagittal.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 43, y: 19, label: "Acromion" }],
        title: "Acromion",
        note: "The bony arch over the cuff. On sagittal you judge acromial morphology (flat I, curved II, hooked III), down-sloping, and os acromiale as outlet-narrowing risk factors — not as a standalone diagnosis of impingement.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 20, y: 48, label: "Deltoid" }],
        title: "Deltoid",
        note: "The large superficial muscle wrapping the shoulder, separated from the cuff by the subacromial–subdeltoid fat plane.",
      },
      {
        sliceIndex: 11,
        markers: [
          { x: 44, y: 28, label: "Supraspinatus / cable region" },
          { x: 43, y: 19, label: "Acromion" },
        ],
        title: "Do-not-overcall checkpoint",
        note: "Before leaving the sagittal stack, pause on the common traps: a single short-TE bright cuff focus is not tendinosis until it persists on fluid-sensitive/orthogonal images; the rotator cable is a normal load-sharing band, not automatically retracted torn fibers; and acromion shape or AC arthrosis is a risk modifier, not a standalone impingement diagnosis.",
      },
    ],
    quiz: [
      {
        id: "ssag-q1",
        sliceIndex: 17,
        marker: { x: 43, y: 52 },
        prompt: WHAT,
        options: ["Humeral head", "Glenoid", "Acromion", "Coracoid"],
        answer: 0,
        explanation: "On a lateral sagittal slice the round ball capped by the cuff is the humeral head.",
      },
      {
        id: "ssag-q2",
        sliceIndex: 11,
        marker: { x: 44, y: 28 },
        prompt: "Which cuff tendon drapes over the superior humeral head?",
        options: ["Supraspinatus", "Subscapularis", "Teres minor", "Deltoid"],
        answer: 0,
        explanation: "The supraspinatus tendon caps the superior humeral head, running to the greater-tuberosity footprint.",
      },
      {
        id: "ssag-q3",
        sliceIndex: 5,
        marker: { x: 27, y: 59 },
        prompt: "Which cuff muscle is anterior, the largest, and inserts on the lesser tuberosity?",
        options: ["Subscapularis", "Infraspinatus", "Supraspinatus", "Teres minor"],
        answer: 0,
        explanation: "Subscapularis is the anterior and largest cuff muscle; its tendon inserts on the lesser tuberosity.",
      },
      {
        id: "ssag-q4",
        sliceIndex: 5,
        marker: { x: 60, y: 55 },
        prompt: WHAT,
        options: ["Infraspinatus / teres minor", "Subscapularis", "Supraspinatus", "Deltoid"],
        answer: 0,
        explanation: "The posterior cuff muscles are infraspinatus (superior) and teres minor (inferior).",
      },
      {
        id: "ssag-q5",
        sliceIndex: 9,
        marker: { x: 47, y: 36 },
        prompt: "Between supraspinatus and subscapularis, this space holds the biceps and its pulley — what is it?",
        options: ["Rotator interval", "Subacromial bursa", "Axillary recess", "Quadrilateral space"],
        answer: 0,
        explanation: "The rotator interval (between supraspinatus and subscapularis) contains the long head of biceps and the coracohumeral/superior glenohumeral ligament pulley.",
      },
      {
        id: "ssag-q6",
        sliceIndex: 11,
        marker: { x: 43, y: 19 },
        prompt: "A hooked or down-sloping shape of which structure can narrow the supraspinatus outlet?",
        options: ["Acromion", "Coracoid", "Greater tuberosity", "Clavicle"],
        answer: 0,
        explanation: "The acromion can narrow the subacromial outlet when hooked, down-sloping, or unfused as an os acromiale. Treat that morphology as a risk factor to correlate with symptoms, dynamic exam, bursal change, and cuff findings.",
      },
      {
        id: "ssag-q7",
        sliceIndex: 9,
        marker: { x: 43, y: 51 },
        prompt: WHAT,
        options: ["Glenoid & labrum", "Humeral head", "Acromion", "Coracoid"],
        answer: 0,
        explanation: "The socket of the scapula rimmed by the low-signal labrum is the glenoid and labrum.",
      },
      {
        id: "ssag-q8",
        sliceIndex: 11,
        marker: { x: 20, y: 48 },
        prompt: "What is the marked structure?",
        options: ["Deltoid", "Supraspinatus", "Infraspinatus", "Trapezius"],
        answer: 0,
        explanation: "The deltoid is the outer muscular envelope, NOT a rotator cuff (SITS) muscle; it lies superficial to the subacromial-subdeltoid bursa.",
      },
      {
        id: "ssag-q9",
        sliceIndex: 5,
        marker: { x: 45, y: 28 },
        prompt: "On this scapular-Y view, which rotator cuff muscle fills the fossa ABOVE the scapular spine?",
        options: ["Supraspinatus", "Infraspinatus", "Subscapularis", "Teres minor"],
        answer: 0,
        explanation: "On the scapular-Y the supraspinatus occupies the supraspinous fossa above the scapular spine; it is the most superior cuff muscle.",
      },
      {
        id: "ssag-q10",
        sliceIndex: 11,
        marker: { x: 44, y: 28 },
        prompt: "Most degenerative tears of the marked supraspinatus tendon begin ~1 cm from its footprint, in which region?",
        options: ["Critical zone", "Rotator interval", "Footprint enthesis", "Bare area"],
        answer: 0,
        explanation: "The hypovascular 'critical zone' ~1 cm proximal to the greater-tuberosity footprint is where most degenerative supraspinatus tears begin.",
      },
      {
        id: "ssag-q11",
        sliceIndex: 9,
        marker: { x: 47, y: 36 },
        prompt: "The marked rotator interval houses the biceps pulley. Which two ligaments form that pulley?",
        options: ["Coracohumeral + superior glenohumeral ligaments", "Coracoacromial + transverse ligaments", "Inferior glenohumeral ligament complex", "Middle glenohumeral + spiral glenoid ligaments"],
        answer: 0,
        explanation: "The rotator-interval biceps pulley is the coracohumeral (CHL) plus superior glenohumeral (SGHL) ligament; a pulley tear lets the biceps subluxate medially.",
      },
      {
        id: "ssag-q12",
        sliceIndex: 9,
        marker: { x: 43, y: 51 },
        prompt: "On this en-face glenoid, a tear of the anteroinferior labrum (3-6 o'clock) is which lesion?",
        options: ["Bankart (anteroinferior labral) lesion", "SLAP tear", "Hill-Sachs lesion", "Bennett lesion"],
        answer: 0,
        explanation: "On the sagittal-oblique en-face glenoid clock-face, the anteroinferior labrum (3-6 o'clock) is the Bankart zone torn after anterior dislocation.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // OBLIQUE CORONAL T2-FS  (stack: normal-shoulder-coronal, 24 slices)
  // Cut PARALLEL to the supraspinatus — the plane to follow the cuff tendon to
  // its footprint and judge the subacromial space. Mid-joint ~ index 11.
  // Orientation first pass: greater tuberosity / humeral head appear LATERAL =
  // image-LEFT, glenoid MEDIAL = image-RIGHT (confirm).
  // ───────────────────────────────────────────────────────────────────────
  "cor-t2fs": {
    tour: [
      {
        sliceIndex: 11,
        markers: [],
        title: "Get oriented",
        note: "Oblique coronal T2 fat-sat — cut PARALLEL to the supraspinatus, so you can follow the cuff tendon along its length to the greater-tuberosity footprint. Superior is up. On this right shoulder the greater tuberosity/humeral head are image-left/lateral and the glenoid is image-right/medial. Scroll anterior → posterior.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 34, y: 58, label: "Humeral head" }],
        title: "Humeral head",
        note: "The rounded proximal humerus — bright fatty marrow, smooth low-signal cortex, even articular cartilage over the surface.",
      },
      {
        sliceIndex: 7,
        markers: [{ x: 35, y: 33, label: "Supraspinatus tendon" }],
        title: "Supraspinatus tendon",
        note: "Followed along its length to the footprint — uniform low signal. Watch the hypovascular 'critical zone' ~1 cm from the footprint, where degenerative tears begin; a bright fluid gap = a tear. Also recognize the cable/crescent model: the thicker rotator cable sits just medial to the thinner distal crescent at the footprint, and cable disruption can make a small-appearing tear functionally important.",
      },
      {
        sliceIndex: 7,
        markers: [{ x: 24, y: 45, label: "Greater tuberosity (footprint)" }],
        title: "Greater tuberosity",
        note: "The lateral bony footprint of supraspinatus/infraspinatus. A subcortical cyst or marrow edema here is a clue to cuff pathology.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 53, y: 57, label: "Glenoid & labrum" }],
        title: "Glenoid & labrum",
        note: "The medial socket rimmed by the low-signal labrum. On coronal, check the superior and inferior labrum for the normal triangular shape — a sublabral recess superiorly is a normal variant not to overcall as a SLAP.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 33, y: 32, label: "Subacromial–subdeltoid bursa" }],
        title: "Subacromial–subdeltoid bursa",
        note: "The thin fat/fluid plane between the cuff and the overlying acromion/deltoid. A trace of fluid is normal; a distended bursa suggests bursitis or a full-thickness cuff tear.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 45, y: 19, label: "Acromion / AC joint" }],
        title: "Acromion & AC joint",
        note: "The acromion overhangs the cuff; the AC joint sits between it and the distal clavicle. Down-sloping morphology or inferior AC osteophytes can narrow the subacromial space, but do not diagnose impingement from morphology alone.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 16, y: 52, label: "Deltoid" }],
        title: "Deltoid",
        note: "The superficial muscle wrapping the lateral shoulder, separated from the cuff by the subacromial–subdeltoid fat.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 38, y: 82, label: "Axillary recess" }],
        title: "Axillary recess",
        note: "The dependent inferior U-shaped pouch of the joint capsule (inferior glenohumeral ligament complex) below the humeral head — thickened/edematous in adhesive capsulitis, and too small/patulous in some instability patterns.",
      },
      {
        sliceIndex: 11,
        markers: [
          { x: 35, y: 33, label: "Supraspinatus / cable" },
          { x: 53, y: 57, label: "Superior labrum region" },
          { x: 38, y: 82, label: "Axillary pouch" },
        ],
        title: "Do-not-overcall checkpoint",
        note: "Coronal shoulder false positives cluster here: the rotator cable is a normal band just medial to the thin crescent; a smooth superior sublabral recess should not be called a SLAP tear; trace isolated bursal fluid is nonspecific; and axillary-pouch thickening supports adhesive capsulitis only with the right clinical stiffness pattern and rotator-interval findings.",
      },
    ],
    quiz: [
      {
        id: "shcor-sid-1",
        sliceIndex: 11,
        marker: { x: 38, y: 82 },
        prompt: "What is the marked dependent inferior pouch of the joint capsule below the humeral head?",
        options: ["Axillary recess", "Subacromial-subdeltoid bursa", "Bicipital groove", "Subscapular recess"],
        answer: 0,
        explanation: "The dependent inferior capsular pouch below the humeral head is the axillary recess, formed by the inferior glenohumeral ligament complex; it is the site to assess for capsular thickening/edema in adhesive capsulitis. The subacromial-subdeltoid bursa lies superficial to the cuff, above the head, not inferior to it.",
      },
      {
        id: "shcor-sid-2",
        sliceIndex: 7,
        marker: { x: 24, y: 45 },
        prompt: "What is the marked lateral bony footprint onto which the supraspinatus and infraspinatus insert?",
        options: ["Greater tuberosity", "Lesser tuberosity", "Glenoid", "Coracoid"],
        answer: 0,
        explanation: "The greater tuberosity is the lateral footprint for the supraspinatus and infraspinatus; a subcortical cyst or marrow edema here is a soft sign of an adjacent cuff tear. The lesser tuberosity, anteriorly, is the subscapularis insertion, not the supraspinatus/infraspinatus footprint.",
      },
      {
        id: "scor-q2",
        sliceIndex: 7,
        marker: { x: 35, y: 33 },
        prompt: "The cuff tendon followed to its footprint here is the…",
        options: ["Supraspinatus", "Subscapularis", "Biceps", "Deltoid"],
        answer: 0,
        explanation: "On coronal the supraspinatus tendon is followed along its length to the greater-tuberosity footprint.",
      },
      {
        id: "scor-q4",
        sliceIndex: 11,
        marker: { x: 53, y: 57 },
        prompt: "Fluid undercuts the superior labrum with a smooth, medially-directed margin paralleling the glenoid. What is this most likely?",
        options: ["Sublabral recess (normal variant)", "Type II SLAP tear", "Bankart lesion", "Paralabral cyst"],
        answer: 0,
        explanation: "A smooth, medially-oriented cleft paralleling the glenoid is the normal sublabral recess; a laterally-curved, irregular cleft extending into the labral substance favors a SLAP tear.",
      },
      {
        id: "scor-q5",
        sliceIndex: 11,
        marker: { x: 33, y: 32 },
        prompt: "The thin fat/fluid plane between the cuff and the acromion/deltoid is the…",
        options: ["Subacromial–subdeltoid bursa", "Glenohumeral joint", "Axillary recess", "Rotator interval"],
        answer: 0,
        explanation: "The plane between the cuff and the overlying acromion/deltoid is the subacromial–subdeltoid bursa.",
      },
      {
        id: "scor-q6",
        sliceIndex: 11,
        marker: { x: 45, y: 19 },
        prompt: WHAT,
        options: ["Acromion / AC joint", "Greater tuberosity", "Humeral head", "Coracoid"],
        answer: 0,
        explanation: "The bony arch and its joint with the distal clavicle is the acromion / AC joint.",
      },
      {
        id: "scor-q8",
        sliceIndex: 11,
        marker: { x: 34, y: 58 },
        prompt: "What is the marked structure?",
        options: ["Humeral head", "Glenoid", "Acromion", "Coracoid"],
        answer: 0,
        explanation: "The round proximal humerus capped by the supraspinatus tendon on the coronal is the humeral head.",
      },
      {
        id: "scor-q9",
        sliceIndex: 11,
        marker: { x: 16, y: 52 },
        prompt: "What is the marked structure?",
        options: ["Deltoid", "Supraspinatus", "Trapezius", "Subscapularis"],
        answer: 0,
        explanation: "The deltoid drapes the greater tuberosity laterally as the outer envelope, separated from the cuff by the subacromial-subdeltoid bursa.",
      },
      {
        id: "scor-q10",
        sliceIndex: 11,
        marker: { x: 33, y: 32 },
        prompt: "Fluid in the marked subacromial-subdeltoid bursa AND the glenohumeral joint together most strongly suggests what?",
        options: ["Full-thickness rotator cuff tear", "Isolated subacromial bursitis", "Adhesive capsulitis", "Normal finding"],
        answer: 0,
        explanation: "Communicating fluid in BOTH the SASD bursa and the joint strongly suggests a full-thickness cuff tear; isolated bursal fluid is nonspecific and does not diagnose a full-thickness tear by itself.",
      },
      {
        id: "scor-q11",
        sliceIndex: 7,
        marker: { x: 24, y: 45 },
        prompt: "A subcortical cyst or marrow edema at the marked greater-tuberosity footprint is a soft sign of what?",
        options: ["Adjacent rotator cuff tear", "AC joint arthrosis", "Acute fracture", "Normal apophysis"],
        answer: 0,
        explanation: "A subcortical cyst or marrow edema at the greater-tuberosity footprint is a soft sign of an adjacent rotator cuff tear.",
      },
      {
        id: "scor-q12",
        sliceIndex: 7,
        marker: { x: 35, y: 33 },
        prompt: "The coronal is the best plane to measure which feature of this torn supraspinatus tendon?",
        options: ["Tendon gap / retraction (Patte stage)", "Which cuff tendons are torn", "Fatty muscle atrophy (Goutallier)", "Labral integrity"],
        answer: 0,
        explanation: "Coronal measures the tendon GAP and retraction (Patte); the sagittal-Y shows WHICH tendons are torn and T1 shows fatty atrophy (Goutallier).",
      },
      {
        id: "scor-q13",
        sliceIndex: 7,
        marker: { x: 35, y: 33 },
        prompt: "On the distal supraspinatus, why does the rotator cable/crescent concept matter?",
        options: [
          "An intact cable can preserve load transfer across a thin crescent tear, while cable disruption can make a tear more functionally important",
          "The cable is a normal labral variant and should not affect cuff interpretation",
          "The crescent is the biceps pulley, so crescent injury predicts medial biceps dislocation",
          "The cable is assessed only on axial images and is unrelated to the supraspinatus footprint",
        ],
        answer: 0,
        explanation:
          "The rotator cable is the thicker articular-sided bundle just medial to the thinner distal cuff crescent. Crescent tears are common near the footprint, but an intact cable can help preserve force transmission; cable disruption, especially anteriorly, makes the tear more clinically important.",
      },
    ],
  },

  // ── AXIAL PD-FS ──────────────────────────────────────────────────────────
  // stack: normal-shoulder-axial (30 slices, RIGHT shoulder). Orientation
  // verified by independent MSK review: anterior = TOP, posterior = bottom,
  // humeral head lateral (image LEFT), glenoid medial (RIGHT). This is the
  // plane for the labrum and the biceps in its groove.
  "axi-t2fs": {
    tour: [
      {
        sliceIndex: 14,
        markers: [],
        title: "Get oriented",
        note: "Axial PD-FS through the glenohumeral joint. Anterior is at the TOP, posterior at the bottom; the round humeral head is lateral (image left), the glenoid medial (right). This is your plane for the labrum and the biceps in its groove.",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 27, y: 40, label: "Humeral head" }],
        title: "Humeral head",
        note: "The round humeral head. On this fat-suppressed sequence the normal fatty marrow is SUPPRESSED (dark/intermediate) inside a thin dark cortex — so a focal BRIGHT area is marrow edema, not normal fat. Scan its posterolateral contour for a Hill-Sachs impaction (it engages the glenoid in anterior instability).",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 51, y: 54, label: "Glenoid" }],
        title: "Bony glenoid",
        note: "The shallow, comma-shaped glenoid of the scapula, medial to the head. Axial shows glenohumeral congruence and the bony rim — check the anteroinferior margin for a bony Bankart.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 50, y: 49, label: "Anterior labrum" }],
        title: "Anterior labrum",
        note: "The dark triangle at the anterior (upper) glenoid rim. The anteroinferior labrum is the Bankart site — the #1 lesion of anterior instability; trace it across slices.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 49, y: 63, label: "Posterior labrum" }],
        title: "Posterior labrum",
        note: "The dark triangle at the posterior (lower) glenoid rim. A torn or blunted posterior labrum points to posterior instability or a reverse Bankart.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 44, y: 40, label: "Biceps tendon (groove)" }],
        title: "Biceps in the bicipital groove",
        note: "The long head of biceps sits as a small dark dot in the bicipital groove between the greater and lesser tuberosities. An EMPTY groove = a torn or dislocated biceps; a little fluid alone can be normal.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 39, y: 33, label: "Subscapularis" }],
        title: "Subscapularis",
        note: "The subscapularis is the anterior rotator cuff — trace its striated tendon along the front of the head toward the lesser tuberosity. A subscapularis tear is a classic axial miss; medial biceps subluxation is its companion clue.",
      },
      {
        sliceIndex: 8,
        markers: [{ x: 48, y: 30, label: "Coracoid process" }],
        title: "Coracoid process",
        note: "The coracoid is the anteromedial bony hook — origin of the conjoint tendon and anchor for the coracoacromial and coracoclavicular ligaments. A handy anterior landmark on the higher slices.",
      },
      {
        sliceIndex: 13,
        markers: [
          { x: 50, y: 49, label: "Anterior labrum" },
          { x: 44, y: 40, label: "Biceps in groove" },
          { x: 49, y: 63, label: "Posterior labrum" },
        ],
        title: "Do-not-overcall checkpoint",
        note: "On axial, do the variant check before diagnosing instability: smooth 1-3 o'clock anterosuperior separation may be a sublabral foramen, and absent anterosuperior labrum with a cord-like MGHL is a Buford complex. But do not dismiss an irregular detachment, stripped periosteum, bony Bankart, or matching Hill-Sachs as a variant. Biceps-groove fluid alone can be normal; an empty or medialized groove is the real pulley/subscapularis alarm.",
      },
    ],
    quiz: [
      {
        id: "shaxi-sid-1",
        sliceIndex: 8,
        marker: { x: 48, y: 30 },
        prompt: "What is the marked anteromedial bony process of the scapula on this axial slice?",
        options: ["Coracoid process", "Lesser tuberosity", "Acromion", "Spine of the scapula"],
        answer: 0,
        explanation: "The hook-like anteromedial process of the scapula on the higher axial slices is the coracoid, the origin of the conjoint tendon and the anchor for the coracoclavicular and coracoacromial ligaments. The lesser tuberosity is on the humerus (laterally), not the scapula.",
      },
      {
        id: "shaxi-sid-2",
        sliceIndex: 13,
        marker: { x: 49, y: 63 },
        prompt: "On this axial slice with anterior at the top, what is the marked dark triangle at the lower glenoid rim?",
        options: ["Posterior labrum", "Anterior labrum", "Glenoid articular cartilage", "Infraspinatus tendon"],
        answer: 0,
        explanation: "With anterior at the top of the axial image, the dark fibrocartilage triangle at the LOWER (posterior) glenoid rim is the posterior labrum; blunting or a tear suggests posterior instability or a reverse Bankart. The anterior labrum is the dark triangle at the upper (anterior) rim on the same slice.",
      },
      {
        id: "axi-q1",
        sliceIndex: 14,
        marker: { x: 27, y: 40 },
        prompt: WHAT,
        options: ["Humeral head", "Glenoid", "Coracoid process", "Acromion"],
        answer: 0,
        explanation: "The round ball lateral in the image, with a thin dark cortex and fat-suppressed (dark/intermediate) marrow, is the humeral head. On this fat-sat sequence a focal bright marrow signal would be edema, not normal fat.",
      },
      {
        id: "axi-q2",
        sliceIndex: 14,
        marker: { x: 51, y: 54 },
        prompt: WHAT,
        options: ["Glenoid", "Humeral head", "Coracoid", "Acromion"],
        answer: 0,
        explanation: "The shallow comma-shaped articular face of the scapula, medial to the head, is the glenoid.",
      },
      {
        id: "axi-q3",
        sliceIndex: 13,
        marker: { x: 50, y: 49 },
        prompt: WHAT,
        options: ["Anterior labrum", "Posterior labrum", "Articular cartilage", "Subscapularis tendon"],
        answer: 0,
        explanation: "The dark triangle at the anterior glenoid rim is the anterior labrum — its anteroinferior part is the Bankart site of anterior instability.",
      },
      {
        id: "axi-q4",
        sliceIndex: 13,
        marker: { x: 44, y: 40 },
        prompt: "The small dark dot seated between the tuberosities here is the…",
        options: ["Long head of biceps tendon in its groove", "Subscapularis tendon", "Anterior labrum", "Joint fluid only"],
        answer: 0,
        explanation: "A small low-signal dot in the bicipital groove between the tuberosities is the long head of biceps. An empty groove signals a torn or dislocated tendon.",
      },
      {
        id: "axi-q6",
        sliceIndex: 13,
        marker: { x: 39, y: 33 },
        prompt: "This anterior tendon coursing toward the lesser tuberosity is the…",
        options: ["Subscapularis", "Supraspinatus", "Infraspinatus", "Long head of biceps"],
        answer: 0,
        explanation: "The anterior cuff tendon running to the lesser tuberosity is the subscapularis; its tears are easily missed — look for medial biceps subluxation as a clue.",
      },
      {
        id: "axi-q8",
        sliceIndex: 13,
        marker: { x: 44, y: 40 },
        prompt: "If the marked bicipital groove were EMPTY, what would that imply?",
        options: ["Torn or medially dislocated long head of biceps", "Normal fluid in the groove", "Os acromiale", "SLAP tear"],
        answer: 0,
        explanation: "An empty bicipital groove means the long head of biceps is torn or medially dislocated; medial dislocation implies a torn subscapularis or biceps pulley.",
      },
      {
        id: "axi-q9",
        sliceIndex: 13,
        marker: { x: 50, y: 49 },
        prompt: "A tear of the marked anteroinferior labrum, classically after anterior dislocation, is which lesion?",
        options: ["Bankart lesion", "SLAP tear", "Buford complex", "Hill-Sachs lesion"],
        answer: 0,
        explanation: "A torn anteroinferior labrum after anterior dislocation is a Bankart lesion; an attached osseous fragment makes it a bony Bankart.",
      },
      {
        id: "axi-q10",
        sliceIndex: 13,
        marker: { x: 49, y: 63 },
        prompt: "A torn posterior labrum (marked) paired with a reverse Hill-Sachs is the signature of what?",
        options: ["Posterior instability (often post-seizure/electric shock)", "Anterior Bankart instability", "SLAP tear", "AC joint separation"],
        answer: 0,
        explanation: "A blunted or torn posterior labrum plus a reverse Hill-Sachs on the anteromedial head signals posterior instability, classically after a seizure or electric shock.",
      },
      {
        id: "axi-q11",
        sliceIndex: 13,
        marker: { x: 39, y: 33 },
        prompt: "A tear of the marked subscapularis tendon most directly destabilizes which structure?",
        options: ["Long head of biceps (medial subluxation/dislocation)", "Supraspinatus tendon", "Posterior labrum", "Deltoid"],
        answer: 0,
        explanation: "A subscapularis tear at the lesser-tuberosity insertion disrupts the biceps pulley, so the long head subluxates or dislocates medially.",
      },
    ],
  },

  // ── SAGITTAL T1 ──────────────────────────────────────────────────────────
  // stack: normal-shoulder-sagittal-t1 (28 slices, RIGHT shoulder). Orientation
  // verified by independent MSK review: superior = TOP, anterior = LEFT,
  // slice_01 = most MEDIAL (scapular "Y") → slice_28 = most LATERAL. T1 (fat &
  // marrow bright, fluid dark) — the sequence for muscle bulk/atrophy & marrow.
  "sag-t1": {
    tour: [
      {
        sliceIndex: 4,
        markers: [],
        title: "Get oriented",
        note: "Oblique-sagittal T1. Superior is up, anterior is to the left; slice 1 is most medial (the scapular 'Y') and the slices climb laterally to the humeral head. T1 — fat & marrow BRIGHT, fluid dark — is your sequence for muscle bulk and marrow.",
      },
      {
        sliceIndex: 4,
        markers: [
          { x: 40, y: 28, label: "Supraspinatus" },
          { x: 31, y: 61, label: "Subscapularis" },
          { x: 57, y: 56, label: "Infraspinatus" },
          { x: 56, y: 76, label: "Teres minor" },
        ],
        title: "Rotator-cuff muscles (medial slice)",
        note: "The scapular 'Y' shows all four cuff bellies at once — supraspinatus above the spine, infraspinatus below it, subscapularis anterior, teres minor posteroinferior. This is THE slice to grade fatty atrophy (Goutallier–Fuchs): on T1, fatty streaks brighten within a wasted muscle, and high-grade atrophy predicts an irreparable tear.",
      },
      {
        sliceIndex: 4,
        markers: [{ x: 44, y: 45, label: "Spine of scapula" }],
        title: "Spine of scapula",
        note: "The scapular spine is the keystone of the 'Y' — it separates the supraspinatus (above) from the infraspinatus (below). Use it to be sure which muscle you are grading.",
      },
      {
        sliceIndex: 6,
        markers: [{ x: 33, y: 30, label: "Coracoid process" }],
        title: "Coracoid process",
        note: "The coracoid points anteriorly (to the left) with bright T1 marrow — origin of the conjoint tendon and a reliable 'anterior' landmark on the sagittal.",
      },
      {
        sliceIndex: 10,
        markers: [{ x: 42, y: 50, label: "Glenoid & labrum" }],
        title: "Glenoid & labrum",
        note: "On the glenoid-face slice the pear-shaped glenoid is rimmed by the low-signal labrum. Trace the labral clock-face for a tear — or a normal sublabral foramen / Buford variant.",
      },
      {
        sliceIndex: 16,
        markers: [{ x: 40, y: 48, label: "Humeral head" }],
        title: "Humeral head",
        note: "The humeral head fills the lateral slices with uniformly BRIGHT fatty marrow. T1 is your marrow sequence — a focal DARK area is the abnormal finding (edema, fracture, or a lesion).",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 45, y: 18, label: "Acromion" }],
        title: "Acromion",
        note: "The acromion caps the supraspinatus outlet superiorly, with the AC joint and distal clavicle just anteromedial. A hooked or down-sloping acromion can narrow the outlet, but correlate it with symptoms and cuff/bursal findings.",
      },
      {
        sliceIndex: 4,
        markers: [
          { x: 40, y: 28, label: "Supraspinatus bulk" },
          { x: 57, y: 56, label: "Infraspinatus bulk" },
          { x: 56, y: 76, label: "Teres minor bulk" },
        ],
        title: "Do-not-overcall checkpoint",
        note: "On T1, grade muscle and marrow deliberately: fatty streaks inside a wasted cuff muscle change reparability; residual red marrow should follow fat on non-fat-sat sequences; and focal T1-dark marrow is the finding that deserves explanation. Do not use this T1 muscle slice to diagnose a SLAP tear or full-thickness cuff gap.",
      },
    ],
    quiz: [
      {
        id: "shsagt1-sid-1",
        sliceIndex: 4,
        marker: { x: 44, y: 45 },
        prompt: "What is the marked bony shelf that separates the supraspinatus above from the infraspinatus below on this scapular-Y slice?",
        options: ["Spine of the scapula", "Coracoid process", "Acromion", "Clavicle"],
        answer: 0,
        explanation: "The scapular spine is the keystone of the Y, dividing the supraspinous fossa (supraspinatus, above) from the infraspinous fossa (infraspinatus, below); use it to be certain which muscle you are grading. The acromion is the lateral continuation of the spine forming the outlet roof, not the dividing shelf between the two fossae.",
      },
      {
        id: "shsagt1-sid-2",
        sliceIndex: 16,
        marker: { x: 40, y: 48 },
        prompt: "On this lateral sagittal T1 slice, what is the marked rounded structure filled with bright fatty marrow?",
        options: ["Humeral head", "Glenoid", "Acromion", "Coracoid"],
        answer: 0,
        explanation: "On the lateral T1 slices the humeral head fills the field with uniformly bright fatty marrow; a focal DARK region is the abnormal finding (edema, fracture, or a marrow-replacing lesion). The glenoid is the shallow scapular socket seen on the more medial slices, not this lateral rounded ball.",
      },
      {
        id: "t1-q1",
        sliceIndex: 4,
        marker: { x: 40, y: 28 },
        prompt: "On this scapular-'Y' slice, which cuff muscle sits ABOVE the scapular spine?",
        options: ["Supraspinatus", "Infraspinatus", "Subscapularis", "Teres minor"],
        answer: 0,
        explanation: "Supraspinatus occupies the supraspinatus fossa above the scapular spine; infraspinatus lies below it.",
      },
      {
        id: "t1-q2",
        sliceIndex: 4,
        marker: { x: 31, y: 61 },
        prompt: "The large anterior cuff muscle filling the anterior fossa is the…",
        options: ["Subscapularis", "Supraspinatus", "Infraspinatus", "Deltoid"],
        answer: 0,
        explanation: "Subscapularis is the anterior rotator cuff; it fills the subscapular fossa and inserts on the lesser tuberosity.",
      },
      {
        id: "t1-q3",
        sliceIndex: 16,
        marker: { x: 40, y: 48 },
        prompt: "On this T1 image, normal humeral-head marrow appears…",
        options: ["Bright (fatty marrow)", "Dark", "Identical to muscle", "Bright only after contrast"],
        answer: 0,
        explanation: "Normal marrow is bright on T1 (fat is not suppressed); a focal dark area signals edema, fracture, or a lesion.",
      },
      {
        id: "t1-q4",
        sliceIndex: 10,
        marker: { x: 42, y: 50 },
        prompt: WHAT,
        options: ["Glenoid & labrum", "Humeral head", "Acromion", "Coracoid"],
        answer: 0,
        explanation: "The pear-shaped scapular glenoid rimmed by the low-signal labrum is seen en face on this slice.",
      },
      {
        id: "t1-q5",
        sliceIndex: 4,
        marker: { x: 40, y: 28 },
        prompt: "T1 is the best sequence to grade which feature of a chronic cuff tear?",
        options: ["Fatty muscle atrophy (Goutallier)", "Subacromial bursal fluid", "Bone marrow edema", "Cartilage thickness"],
        answer: 0,
        explanation: "T1 shows fatty infiltration of the cuff muscles (Goutallier–Fuchs); high-grade atrophy predicts an irreparable tear and changes surgical planning.",
      },
      {
        id: "t1-q6",
        sliceIndex: 14,
        marker: { x: 45, y: 18 },
        prompt: WHAT,
        options: ["Acromion", "Coracoid", "Clavicle", "Greater tuberosity"],
        answer: 0,
        explanation: "The flat bone forming the roof of the outlet superiorly is the acromion.",
      },
      {
        id: "t1-q7",
        sliceIndex: 4,
        marker: { x: 57, y: 56 },
        prompt: "What is the marked structure?",
        options: ["Infraspinatus", "Supraspinatus", "Teres minor", "Subscapularis"],
        answer: 0,
        explanation: "The infraspinatus is the large posterior cuff muscle filling the infraspinous fossa below the scapular spine; supraspinatus lies above the spine.",
      },
      {
        id: "t1-q8",
        sliceIndex: 4,
        marker: { x: 56, y: 76 },
        prompt: "What is the marked structure?",
        options: ["Teres minor", "Infraspinatus", "Subscapularis", "Deltoid"],
        answer: 0,
        explanation: "Teres minor is the small posterior cuff muscle just below infraspinatus; isolated fatty atrophy points to axillary-nerve (quadrilateral-space) denervation.",
      },
      {
        id: "t1-q10",
        sliceIndex: 6,
        marker: { x: 33, y: 30 },
        prompt: "What is the marked structure?",
        options: ["Coracoid process", "Acromion", "Glenoid", "Clavicle"],
        answer: 0,
        explanation: "The coracoid is the anterior hook-like process, origin of the conjoint tendon and the coracoclavicular/coracoacromial ligaments, and a reliable 'anterior' landmark.",
      },
      {
        id: "t1-q11",
        sliceIndex: 4,
        marker: { x: 40, y: 28 },
        prompt: "Why is T1 the sequence used to grade rotator-cuff fatty atrophy (Goutallier)?",
        options: ["Fat is bright and unsuppressed on T1, so fatty muscle infiltration is conspicuous", "Fluid is brightest on T1", "Fat is suppressed on T1", "T1 has the highest spatial resolution"],
        answer: 0,
        explanation: "On T1 fat is bright and unsuppressed, so Goutallier fatty infiltration of the cuff muscles stands out -- and its grade predicts whether a tear is repairable.",
      },
    ],
  },
};

/**
 * High-yield "watch for" pearls per structure (keyed by tour-step title, so they
 * appear on whichever plane shows that structure). The thing to scrutinize / the
 * classic pitfall.
 */
export const structureShoulderReading: Record<string, StructureReading> = {
  "Rotator-cuff muscles (medial slice)": {
    measure:
      "Grade fatty infiltration on the oblique-sagittal 'Y' at the scapular spine (Goutallier 0–4); grade ≥3 = fat ≥ muscle.",
  },
  "Supraspinatus tendon": {
    variant:
      "Distal-supraspinatus intermediate signal that vanishes on T2 is magic angle (tendon curving ~55° to B0 on short-TE T1/PD), not a tear.",
    measure:
      "Partial tear is low-grade <50% vs high-grade >50% of thickness; stage retraction by Patte (1 = footprint, 2 = humeral head, 3 = glenoid). Also report cable involvement: the cable is the thicker load-sharing band just medial to the thin cuff crescent at the footprint.",
  },
  "Glenoid & labrum": {
    variant:
      "A smooth cleft under the SUPERIOR labrum that parallels the glenoid and stops at the biceps anchor is a sublabral recess — a SLAP curves laterally into the labrum with irregular margins.",
  },
  "Biceps & rotator interval": {
    variant:
      "Mild interval signal or fluid is nonspecific. A pulley lesion needs loss/defect of the SGHL/CHL sling, medial biceps subluxation, or a matching upper-subscapularis tear pattern.",
    measure:
      "In adhesive capsulitis, rotator-interval capsule thickness ≥7 mm and coracohumeral-ligament thickness ≥4 mm are relatively specific but not sensitive; use them with axillary-pouch findings and the clinical stiffness pattern.",
  },
  "Humeral head": {
    variant:
      "Patchy intermediate-signal residual red marrow that follows fat on non-fat-sat sequences is normal — a FOCAL T1-dark area is the worrisome finding (edema, fracture, lesion).",
  },
  Acromion: {
    variant:
      "Bigliani type/acromial slope and os acromiale are associations with outlet narrowing, not diagnoses by themselves; correlate with symptoms, bursal change, cuff findings, and radiographs when morphology is central.",
  },
  "Acromion & AC joint": {
    variant:
      "AC osteophytes are common and usually incidental — focal marrow edema on BOTH sides of the joint, not the osteophytes alone, is what makes the AC joint a pain generator.",
  },
  "Greater tuberosity": {
    measure:
      "Acromiohumeral interval ≤7 mm supports chronic cuff insufficiency/superior migration, especially on radiographs; MRI-based AHI is supportive but not interchangeable with a properly positioned radiographic measurement.",
  },
  "Subacromial–subdeltoid bursa": {
    variant:
      "Bursal fluid with a focal calcific deposit that stays LOW on T1 AND T2 explains an inflamed bursa from calcific tendinitis without any structural cuff tear.",
  },
  "Bony glenoid": {
    measure:
      "Quantify anteroinferior glenoid bone loss on CT (often 3D, humeral head subtracted) — MRI/MRA underestimates it.",
  },
  "Anterior labrum": {
    variant:
      "Normal anterosuperior variants live around 1-3 o'clock: a sublabral foramen is a smooth anterior-superior cleft, and a Buford complex is absent anterosuperior labrum with a cord-like MGHL. Irregular detachment, periosteal stripping, or bony injury is not a variant.",
  },
  "Posterior labrum": {
    variant:
      "Don't overcall age-related posterior labral fraying as a traumatic tear — reserve a 'reverse Bankart' read for a discrete detachment.",
  },
  "Biceps in the bicipital groove": {
    variant:
      "A thin rim of sheath fluid may communicate with the joint and be normal. The red flags are an empty groove, medial subluxation/dislocation, split tendon, or pulley/subscapularis injury.",
  },
  "Axillary recess": {
    variant:
      "Prominent synovial folds in the U-shaped pouch can mimic loose bodies; trace them as attached folds across slices before calling a free body.",
    measure:
      "Routine MRI axillary-pouch/IGHL thickness >4 mm supports adhesive capsulitis; MRA thresholds near >3 mm have been used. Treat the number as supportive, not diagnostic in isolation.",
  },
};

/**
 * High-yield "watch for" pearls per structure (keyed by tour-step title, so they
 * appear on whichever plane shows that structure). The thing to scrutinize / the
 * classic pitfall.
 */
export const structureShoulderPearl: Record<string, string> = {
  "Rotator-cuff muscles (medial slice)": "Grade fatty atrophy on this sagittal view (Goutallier–Fuchs) — it predicts whether a cuff tear is repairable.",
  Subscapularis: "Don't miss a subscapularis tear — look for biceps medial subluxation/dislocation out of the groove, its companion finding.",
  "Infraspinatus & teres minor": "Isolated teres-minor fatty atrophy = quadrilateral-space / axillary-nerve problem until proven otherwise.",
  "Glenoid & labrum": "Trace the labral clock-face; a sublabral foramen (1–3 o'clock) and a Buford complex (absent anterosuperior labrum + cord-like MGHL) are normal variants — don't call them tears.",
  "Biceps & rotator interval": "A torn biceps pulley lets the long head subluxate medially — often the first clue to a hidden subscapularis tear.",
  "Humeral head": "Scan the posterosuperior head for a Hill-Sachs impaction after anterior dislocation; a deep one that engages the glenoid matters.",
  "Supraspinatus tendon": "Scrutinize the 'critical zone' ~1 cm from the footprint, the articular surface for a PASTA tear, and whether the rotator cable is intact.",
  Acromion: "A hooked (type III) or down-sloping acromion and an os acromiale can narrow the outlet; correlate morphology with symptoms, bursal change, and cuff findings.",
  "Acromion & AC joint": "Inferior AC osteophytes and a down-sloping acromion can narrow the subacromial space; morphology alone does not prove impingement.",
  "Greater tuberosity": "A subcortical cyst or marrow edema at the footprint is a soft sign of an adjacent cuff tear.",
  "Subacromial–subdeltoid bursa": "Fluid in the SASD bursa AND the joint together strongly suggests a full-thickness cuff tear.",
  "Axillary recess": "Thickening/edema of the axillary recess and rotator interval is the MRI signature of adhesive capsulitis.",
  Deltoid: "The deltoid is spared in cuff disease and is the prime mover a reverse total shoulder arthroplasty depends on — confirm its bulk and integrity before reverse-arthroplasty planning.",
  "Bony glenoid": "Read the bony rim on the axial — an anteroinferior bony Bankart (osseous fragment or blunted rim) changes management; substantial bone loss (often ~20–25%, with lower subcritical ranges relevant in contact athletes) supports considering bony augmentation such as Latarjet, especially with an off-track Hill-Sachs.",
  "Anterior labrum": "Walk the labral clock-face: the anteroinferior labrum (3–6 o'clock) is the Bankart zone. Don't overcall the normal sublabral foramen (1–3 o'clock) or a Buford complex (absent anterosuperior labrum + cord-like middle glenohumeral ligament).",
  "Posterior labrum": "A blunted or torn posterior labrum — paired with a reverse Hill-Sachs on the anteromedial head — is the signature of posterior instability, classically after a seizure or electric shock.",
  "Biceps in the bicipital groove": "An empty bicipital groove means the long head is torn or medially dislocated — and medial dislocation implies a torn subscapularis/pulley. Fluid in the groove alone, communicating with the joint, can be normal.",
  "Coracoid process": "The coracoid anchors the conjoint tendon and the coracoclavicular ligaments; a short coracohumeral distance (<6 mm) can support subcoracoid impingement of the subscapularis in the right clinical/imaging context.",
};

/**
 * Normal → Abnormal bridges. Keyed by tour-step TITLE so the "See it injured →"
 * link appears on the matching structure in any shoulder plane. Each points at the
 * shoulder pathology case where that structure is seen injured.
 */
export const structureShoulderCase: Record<string, { caseId: string; label: string }> = {
  "Supraspinatus tendon": { caseId: "shoulder-acute-full-thickness-cuff-tear", label: "Full-thickness cuff tear" },
  "Greater tuberosity": { caseId: "shoulder-acute-full-thickness-cuff-tear", label: "Cuff tear at the footprint" },
  "Infraspinatus & teres minor": { caseId: "shoulder-acute-full-thickness-cuff-tear", label: "Rotator cuff tear" },
  "Rotator-cuff muscles (medial slice)": { caseId: "shoulder-massive-cuff-arthropathy", label: "Massive cuff tear + atrophy" },
  Subscapularis: { caseId: "shoulder-subscapularis-biceps-hidden-lesion", label: "Subscapularis tear + biceps subluxation" },
  "Biceps & rotator interval": { caseId: "shoulder-subscapularis-biceps-hidden-lesion", label: "Biceps subluxation (hidden lesion)" },
  "Glenoid & labrum": { caseId: "shoulder-anterior-instability-bankart", label: "Bankart + Hill-Sachs" },
  "Humeral head": { caseId: "shoulder-anterior-instability-bankart", label: "Hill-Sachs impaction" },
  "Subacromial–subdeltoid bursa": { caseId: "shoulder-cuff-tendinosis-bursitis", label: "Tendinosis + SASD bursitis" },
  Acromion: { caseId: "shoulder-cuff-tendinosis-bursitis", label: "Outlet narrowing + bursitis" },
  "Acromion & AC joint": { caseId: "shoulder-cuff-tendinosis-bursitis", label: "Outlet narrowing + bursitis" },
  "Axillary recess": { caseId: "shoulder-adhesive-capsulitis", label: "Adhesive capsulitis" },
  "Bony glenoid": { caseId: "shoulder-anterior-instability-bankart", label: "Bony Bankart + Hill-Sachs" },
  "Anterior labrum": { caseId: "shoulder-anterior-instability-bankart", label: "Bankart lesion" },
  "Posterior labrum": { caseId: "shoulder-anterior-instability-bankart", label: "Labral instability" },
  "Biceps in the bicipital groove": { caseId: "shoulder-subscapularis-biceps-hidden-lesion", label: "Biceps dislocation (hidden lesion)" },
};

/**
 * Advanced challenge bank for the shoulder — board-style questions, authored and
 * literature-fact-checked via the shoulder-advanced-questions workflow.
 */
export const shoulderAdvanced: AdvancedQ[] = [
  {
    id: "sh-caq-1",
    topic: "Rotator cuff - reparability",
    prompt: "A 64-year-old retired carpenter has a chronic full-thickness supraspinatus tear. On the sagittal-oblique Y-view, the supraspinatus muscle belly lies entirely below a line drawn from the superior border of the scapular spine to the superior border of the coracoid, and the muscle shows more fat than muscle on T1. Which finding most strongly predicts that an anatomic primary cuff repair will fail?",
    options: ["Positive tangent sign with Goutallier grade 3-4 fatty infiltration", "Tendon retraction to the apex of the humeral head", "A trace of fluid in the subacromial-subdeltoid bursa", "A type II (curved) acromion on the outlet view"],
    answer: 0,
    explanation: "A positive tangent sign (supraspinatus belly below the spine-coracoid line) plus high-grade Goutallier fatty infiltration (grade 3-4) reflects irreversible muscle degeneration and is the strongest predictor of repair failure and re-tear, often shifting management toward debridement, superior capsular reconstruction, or reverse arthroplasty. Tendon retraction to the humeral apex is concerning but, without advanced fatty atrophy, is more often still reparable; acromial shape and a trace of bursal fluid do not by themselves predict repair failure.",
  },
  {
    id: "sh-caq-2",
    topic: "Subscapularis & biceps pulley",
    prompt: "A 47-year-old falls onto an outstretched, externally rotated arm and now has anterior shoulder pain and weakness with the lift-off and belly-press tests. MRI shows the long head of the biceps displaced medially, lying over (superficial to) the lesser tuberosity. Which associated injury should you most specifically look for on the axial images?",
    options: ["A subscapularis tendon tear", "A SLAP type II tear", "An anteroinferior (Bankart) labral tear", "A supraspinatus footprint tear"],
    answer: 0,
    explanation: "Medial subluxation/dislocation of the long head of the biceps is the companion sign of a subscapularis tendon tear, because the subscapularis and the deep capsular fibers form the medial wall of the biceps pulley; positive lift-off and belly-press tests localize to the subscapularis. A SLAP tear involves the superior labral-biceps anchor, not the groove, and does not displace the biceps medially; a Bankart is an instability lesion of the anteroinferior labrum unrelated to biceps position.",
  },
  {
    id: "sh-caq-3",
    topic: "SLAP vs sublabral recess",
    prompt: "A 28-year-old overhead athlete has deep shoulder pain and a positive O'Brien test. MR arthrogram shows superior labral contrast that is irregular and laterally curved, extending lateral to the biceps anchor into the labral substance, and measuring more than 2-3 mm wide. Which is the most appropriate interpretation?",
    options: ["Type II SLAP tear", "Normal sublabral recess", "Buford complex", "Sublabral foramen"],
    answer: 0,
    explanation: "Contrast with an irregular, laterally curved contour that extends lateral to the biceps anchor into the labrum (the load-bearing morphologic finding, reinforced by a width greater than ~2-3 mm) is a type II SLAP tear. A normal sublabral recess is a smooth, thin, medially directed cleft that parallels the glenoid surface. The Buford complex (absent anterosuperior labrum with a cord-like middle glenohumeral ligament) and the sublabral foramen are anterosuperior variants, not superior labral tears, and should not be repaired.",
  },
  {
    id: "sh-caq-4",
    topic: "Instability - glenoid bone loss",
    prompt: "A 21-year-old contact athlete has had four anterior dislocations. CT shows 24% anteroinferior glenoid bone loss, and MRI shows an off-track Hill-Sachs lesion. Which surgical option gives the lowest recurrence risk?",
    options: ["Bony augmentation such as a coracoid transfer (Latarjet)", "Isolated arthroscopic Bankart soft-tissue repair", "Capsular plication without bony augmentation", "Physical therapy with activity modification"],
    answer: 0,
    explanation: "With substantial/critical glenoid bone loss (often ~20-25%, with lower subcritical thresholds relevant in high-risk contact athletes) and an off-track Hill-Sachs lesion, isolated arthroscopic Bankart repair has a high recurrence rate, so bony augmentation such as Latarjet is favored to restore the glenoid track and lower recurrence; remplissage may be added depending on the humeral defect strategy. Isolated Bankart repair and capsular plication do not address the bone deficit, and recurrent dislocations in a young contact athlete are not reliably controlled by nonoperative management.",
  },
  {
    id: "sh-caq-5",
    topic: "Instability - ALPSA vs Bankart",
    prompt: "A 26-year-old with recurrent anterior instability after multiple dislocations has a non-arthrogram MRI showing the anteroinferior labrum medially displaced and rotated down onto the scapular neck, healed in a medialized position, with an intact but stripped anterior scapular periosteum. Which lesion does this best describe?",
    options: ["ALPSA lesion", "Classic soft-tissue Bankart lesion", "Perthes lesion", "GLAD lesion"],
    answer: 0,
    explanation: "An ALPSA (anterior labroligamentous periosteal sleeve avulsion) shows medial and inferior displacement of the labroligamentous complex with an intact but stripped periosteum, so the labrum heals chronically in a medialized position - typical of recurrent instability. A classic Bankart has a torn periosteum with the labrum free at the rim; a Perthes has a nondisplaced labrum with intact periosteum that lifts only with stress; a GLAD is a superficial labral tear with an articular cartilage defect and is not an instability lesion.",
  },
  {
    id: "sh-caq-6",
    topic: "Adhesive capsulitis",
    prompt: "A 53-year-old woman with diabetes has 4 months of progressive shoulder stiffness with global loss of both active and passive motion and no antecedent trauma. Non-arthrogram fat-suppressed T2 MRI is most likely to show which combination of findings?",
    options: ["Thickening and edema of the axillary recess capsule with soft tissue obliterating the subcoracoid fat triangle in the rotator interval", "A full-thickness supraspinatus tear with fluid in the subacromial-subdeltoid bursa", "An anteroinferior labral tear with a Hill-Sachs lesion", "Fatty atrophy of the infraspinatus with a spinoglenoid notch cyst"],
    answer: 0,
    explanation: "Adhesive capsulitis produces capsular and synovial thickening with T2 edema in the axillary recess, plus rotator-interval soft-tissue thickening that obliterates the subcoracoid fat triangle - a highly specific sign - matching the clinical picture of painful global motion loss in a diabetic patient. A cuff tear, a labral-Hill-Sachs instability pattern, and a spinoglenoid notch cyst with infraspinatus denervation each produce focal mechanical or neurologic findings, not the diffuse capsular thickening of a frozen shoulder.",
  },
  {
    id: "sh-caq-7",
    topic: "Paralabral cyst & denervation",
    prompt: "A 34-year-old volleyball player has posterior shoulder aching and mild external-rotation weakness. MRI shows a paralabral cyst extending into the spinoglenoid notch but not reaching the suprascapular notch, with a posterosuperior labral tear. Which muscle is most likely to show denervation edema or atrophy?",
    options: ["Infraspinatus", "Supraspinatus", "Teres minor", "Both supraspinatus and infraspinatus"],
    answer: 0,
    explanation: "At the spinoglenoid notch the suprascapular nerve has already given off its supraspinatus branches more proximally, so compression there denervates the infraspinatus alone, producing isolated infraspinatus edema or atrophy. A lesion at the more proximal suprascapular notch would affect both the supraspinatus and infraspinatus; the teres minor is supplied by the axillary nerve in the quadrilateral space, not the suprascapular nerve.",
  },
  {
    id: "sh-caq-8",
    topic: "Postoperative cuff",
    prompt: "A 58-year-old returns 9 months after arthroscopic supraspinatus repair with recurrent pain and weakness. On fat-suppressed T2 imaging, which finding most reliably indicates a recurrent full-thickness re-tear rather than expected postoperative change?",
    options: ["A fluid-signal-intensity gap spanning the full tendon thickness with tendon retraction from the footprint", "Intermediate T2 signal within the tendon at the repair site", "Low-signal suture-anchor artifact at the greater tuberosity", "A small amount of fluid in the subacromial-subdeltoid bursa"],
    answer: 0,
    explanation: "A full-thickness, fluid-bright gap with tendon retraction off the footprint indicates a recurrent re-tear, because fluid-equivalent signal traversing the entire tendon is the same criterion used in the native cuff. Intermediate (not fluid-bright) intratendinous signal, susceptibility from suture anchors, and a small amount of bursal fluid are all expected postoperative findings and do not by themselves indicate a re-tear; granulation tissue can keep signal intermediate for months.",
  },
  {
    id: "cuff-1",
    topic: "Rotator cuff",
    prompt: "A 58-year-old laborer has a chronic full-thickness supraspinatus tear. On the sagittal-oblique T1-weighted image at the level of the scapular Y, the supraspinatus muscle belly does not cross a line drawn from the superior margin of the scapular spine to the superior margin of the coracoid. According to the tangent sign, this finding most specifically indicates which of the following?",
    options: ["Tendon retraction to the level of the glenoid (Patte stage 3)", "Goutallier grade 1 fatty infiltration", "Supraspinatus muscle atrophy", "An irreparable subscapularis tear"],
    answer: 2,
    explanation: "The tangent sign is positive when the supraspinatus muscle belly fails to cross (lies below) the line connecting the superior borders of the scapular spine and coracoid on the Y-shaped sagittal image, indicating significant supraspinatus muscle atrophy and predicting poorer repair outcomes. It assesses bulk/atrophy, distinct from tendon retraction (Patte) or fatty infiltration grading (Goutallier).",
  },
  {
    id: "cuff-2",
    topic: "Rotator cuff",
    prompt: "On an oblique-coronal fat-suppressed T2-weighted image, you identify focal high signal at the articular surface of the supraspinatus immediately adjacent to its insertion on the greater tuberosity footprint, with intact bursal-side fibers. This 'rim-rent' (PASTA-type) tear is most often UNDERESTIMATED on conventional MRI for which reason?",
    options: ["The magic-angle effect artifactually raises signal at the footprint, masking the tear", "Partial-volume averaging and the tear's deep footprint location cause it to be missed or undergraded without MR arthrography or ABER positioning", "Chemical-shift artifact obscures the articular margin in the frequency-encoding direction", "Fluid in the subacromial-subdeltoid bursa mimics articular signal"],
    answer: 1,
    explanation: "Articular-sided rim-rent tears at the deep tendon footprint are commonly underestimated on conventional MRI due to partial-volume averaging and their location; MR arthrography, especially with abduction-external-rotation (ABER) positioning, increases sensitivity by distending and offloading the articular fibers (Lee 2002; Li meta-analysis 2021). Magic angle affects short-TE sequences, not long-TE fluid-sensitive T2; chemical-shift artifact is suppressed on fat-suppressed images; bursal fluid does not mimic articular-surface signal at the footprint.",
  },
  {
    id: "cuff-4",
    topic: "Rotator cuff",
    prompt: "When grading fatty muscle degeneration of the rotator cuff, a key distinction between the Goutallier classification and the Fuchs modification is which of the following?",
    options: ["Goutallier was originally validated on MRI, whereas Fuchs uses CT", "Goutallier was originally described on axial CT (then adapted to MRI), while Fuchs simplified it to a 3-stage MRI grading on the sagittal-oblique image", "Fuchs grades only the supraspinatus, whereas Goutallier grades all four cuff muscles equally", "Goutallier uses a 3-stage system and Fuchs expanded it to 5 stages"],
    answer: 1,
    explanation: "Goutallier's original 5-stage (0-4) classification was described on axial CT and later applied to MRI, whereas the Fuchs modification simplified assessment into a 3-stage system performed on the sagittal-oblique (Y-view) MR image. Both grade fatty infiltration, but the staging granularity and original modality differ.",
  },
  {
    id: "labrum-1",
    topic: "Labrum & instability",
    prompt: "On a non-arthrogram MRI of a 24-year-old with recurrent anterior instability after a prior dislocation, the anteroinferior labrum is medially displaced and rotated against the scapular neck but remains attached to an intact, stripped anterior scapular periosteum, so no contrast or fluid insinuates between the labrum and glenoid. Which lesion does this BEST describe?",
    options: ["Perthes lesion", "ALPSA lesion", "Classic (soft-tissue) Bankart lesion", "GLAD lesion"],
    answer: 1,
    explanation: "An ALPSA (anterior labroligamentous periosteal sleeve avulsion) is characterized by medial displacement and inferomedial rotation of the labroligamentous complex with an intact but stripped periosteum, so the labrum heals in a medialized position; a Perthes has a nondisplaced labrum with intact periosteum, and a classic Bankart has a torn periosteum.",
  },
  {
    id: "labrum-2",
    topic: "Labrum & instability",
    prompt: "On glenoid bone-loss assessment, an en-face sagittal-oblique 'best-fit circle' is drawn on the inferior glenoid. The width of the bare anterior bone defect measures 7 mm and the maximum diameter of the circle is 28 mm. According to the glenoid track concept and contemporary surgical thresholds, this degree of bone loss is MOST appropriately classified as:",
    options: ["Critical/significant loss (~25%), favoring consideration of bony augmentation (e.g., Latarjet)", "Trivial loss (<10%), arthroscopic Bankart repair alone is reliably sufficient", "Critical loss (>40%), mandating total shoulder arthroplasty", "No measurable loss; the defect represents the normal bare area of the glenoid"],
    answer: 0,
    explanation: "Percent bone loss = defect width / best-fit circle diameter = 7/28 = 25%. This sits at the upper end of the historically cited 'critical' range (~20-25%), where isolated arthroscopic Bankart repair has higher recurrence/poorer functional scores and bony procedures such as Latarjet are increasingly favored. Lower 'subcritical' loss can still matter in contact athletes, so the number is a management risk marker, not a stand-alone rule.",
  },
  {
    id: "labrum-3",
    topic: "Labrum & instability",
    prompt: "On an MR arthrogram, contrast is seen tracking between the superior labrum and glenoid at the 12-o'clock position. Which feature MOST reliably distinguishes a true type II SLAP tear from a normal sublabral recess (sulcus)?",
    options: ["Contrast that is laterally curved/irregular, extending away from the glenoid and lateral to the biceps anchor into the labral substance", "A smooth, medially oriented cleft paralleling the glenoid surface, located at or anterior to the biceps anchor", "Contrast/signal in the cleft that follows fluid signal on all sequences", "Presence of a Buford complex on the same study"],
    answer: 0,
    explanation: "A type II SLAP tear shows contrast that is laterally curved and irregular, extending away from the glenoid (lateral to the biceps anchor) into the labral substance. A normal sublabral recess is a smooth, medially directed cleft that parallels the glenoid surface. Posterior extension is NOT reliable: per Jin et al. (AJR 2006), signal posterior to the biceps anchor occurs in ~91% of recesses and ~97% of SLAP tears, whereas a laterally curved configuration favors SLAP. Both fill with contrast, so following fluid signal does not help, and a Buford complex is an unrelated anterosuperior variant.",
  },
  {
    id: "labrum-4",
    topic: "Labrum & instability",
    prompt: "A pitcher has a Hill-Sachs lesion. On the glenoid-track method, the Hill-Sachs interval (the width of the Hill-Sachs lesion plus the bone bridge to the rotator cuff footprint) is compared with the glenoid track, calculated as 0.83 times the glenoid diameter minus the anterior bone-loss width. When a Hill-Sachs lesion is 'off-track,' the clinical implication is that:",
    options: ["The Hill-Sachs interval exceeds the glenoid track, so the lesion engages and isolated Bankart repair has a high failure rate", "The lesion is entirely contained within the track and will not engage regardless of glenoid loss", "The defect is purely a soft-tissue Bankart and bone loss is irrelevant", "Track width equals the full glenoid diameter because the 0.83 factor applies only to posterior lesions"],
    answer: 0,
    explanation: "An off-track Hill-Sachs has a Hill-Sachs interval wider than the glenoid track (0.83 x glenoid diameter - anterior bone loss), so the humeral defect engages the glenoid rim. Isolated Bankart repair then has high recurrence (Locher: ~33% vs 6% for on-track), favoring remplissage or bony augmentation.",
  },
  {
    id: "biceps-1",
    topic: "Biceps & rotator interval",
    prompt: "On an axial fat-suppressed proton-density MR image at the level of the bicipital groove, the long head of the biceps tendon is seen displaced MEDIALLY and lies superficial to the subscapularis tendon fibers, which themselves remain intact and inserting on the lesser tuberosity. Which structure's disruption MOST specifically explains this pattern of medial biceps subluxation while the subscapularis remains intact?",
    options: ["Superficial fibers of the subscapularis tendon at the lesser tuberosity", "The deep (capsular) fibers of the subscapularis tendon and superior glenohumeral ligament forming the floor/medial sling of the pulley", "The supraspinatus tendon footprint", "The transverse humeral ligament alone"],
    answer: 1,
    explanation: "Medial biceps subluxation with an intact-appearing subscapularis implies failure of the medial pulley sling — the deep capsular subscapularis fibers and the superior glenohumeral ligament — which can be torn while the more superficial subscapularis fibers remain intact; if the tendon lies deep to (dislocated into) a torn subscapularis it is a true medial dislocation. The transverse humeral ligament's role as a primary stabilizer is now considered minor compared with the SGHL/CHL/subscapularis pulley (Nakata 2011; the SGHL defect and biceps displacement sign are the most sensitive MR criteria for pulley lesions).",
  },
  {
    id: "biceps-2",
    topic: "Biceps & rotator interval",
    prompt: "In the Habermeyer/Martetschläger classification of biceps pulley (\"hidden\") lesions, a tear of the medial pulley sling is characteristically difficult to identify on standard arthroscopic inspection (and on non-arthrographic MRI) because of its location. A medial-sling pulley lesion most specifically involves tearing of which component, producing a defect best appreciated as loss of the normal medial sling on MR arthrography?",
    options: ["The lateral band of the coracohumeral ligament (lateral pulley sling)", "The medial band of the coracohumeral ligament and superior glenohumeral ligament (medial pulley sling) at the medial aspect of the rotator interval", "The anterosuperior labrum", "The bursal-side supraspinatus footprint"],
    answer: 1,
    explanation: "The medial pulley sling is formed by the medial band of the coracohumeral ligament (medial CHL) plus the superior glenohumeral ligament (SGHL) at the medial aspect of the rotator interval/entrance of the bicipital groove; the Martetschläger 2020 update defines a type 1 pulley lesion as a tear of this medial sling (medial CHL and/or SGHL). Such lesions are occult clinically and on standard arthroscopic inspection (the basis for the term 'hidden lesion') and are often associated with partial articular-side subscapularis and/or supraspinatus tears. MR arthrography is the modality of choice, showing contrast undermining or loss of the normal medial sling. The lateral band of the coracohumeral ligament forms the lateral (not medial) sling; the anterosuperior labrum and the bursal-side supraspinatus footprint are not components of the pulley at all.",
  },
  {
    id: "biceps-4",
    topic: "Biceps & rotator interval",
    prompt: "A sports-medicine fellow reviewing a shoulder MR notes the long head of the biceps tendon appears thickened and bright on a single axial image at the top of the groove, prompting concern for tendinopathy. Which technical/anatomic pitfall is the MOST likely benign explanation for apparent increased signal in the intra-articular/groove portion of a normal biceps tendon?",
    options: ["Magic-angle artifact where the tendon curves ~55° relative to B0 on short-TE sequences", "Chemical-shift artifact in the frequency-encoding direction", "Susceptibility artifact from adjacent cortical bone", "Partial volume averaging with the deltoid muscle"],
    answer: 0,
    explanation: "As the biceps tendon curves over the humeral head and into the groove it can approach the magic angle (~55° to the main field), producing artifactually increased intratendinous signal on short-TE sequences (T1/PD/GRE) that disappears on long-TE (T2) images. Recognizing this prevents overcalling tendinopathy on the curved intra-articular segment.",
  },
  {
    id: "impingement-1",
    topic: "Impingement & acromion",
    prompt: "A 22-year-old elite baseball pitcher has posterior shoulder pain in late cocking. ABER (abduction-external rotation) MR arthrography shows undersurface fraying of the posterosuperior rotator cuff with subtle cyst formation in the greater tuberosity and fraying of the posterosuperior labrum. Which mechanism best explains these findings?",
    options: ["Repetitive contact of the coracoacromial ligament against the bursal cuff surface", "Contact of the undersurface (articular side) of the posterosuperior cuff against the posterosuperior glenoid in abduction-external rotation", "Subcoracoid narrowing compressing the subscapularis against the lesser tuberosity", "Os acromiale instability producing downward traction on the supraspinatus"],
    answer: 1,
    explanation: "Posterosuperior (internal) impingement results from contact between the articular surface of the posterosuperior cuff and the posterosuperior glenoid/labrum in the ABER position, producing the triad of articular-sided cuff fraying, posterosuperior labral fraying, and greater tuberosity cystic change in overhead throwers. Bursal-sided contact from the coracoacromial ligament (option 1) is external/outlet impingement, subcoracoid narrowing (option 3) is a distinct anterior entity, and os acromiale (option 4) is unrelated.",
  },
  {
    id: "impingement-2",
    topic: "Impingement & acromion",
    prompt: "On a properly positioned anteroposterior radiograph, the critical shoulder angle (CSA) is measured. Which statement about the CSA is most accurate?",
    options: ["A CSA greater than ~35 degrees is associated with a higher prevalence of degenerative rotator cuff tears", "A CSA greater than ~35 degrees is associated with a higher prevalence of glenohumeral osteoarthritis", "The CSA is the angle between the acromion undersurface and a horizontal line, independent of glenoid inclination", "A low CSA (<30 degrees) predisposes to subacromial impingement and cuff tears"],
    answer: 0,
    explanation: "The CSA combines glenoid inclination and lateral acromial extension; a high CSA (>35 degrees) increases superiorly directed shear and is associated with degenerative rotator cuff tears, whereas a low CSA (<30 degrees) is associated with primary glenohumeral osteoarthritis.",
  },
  {
    id: "impingement-3",
    topic: "Impingement & acromion",
    prompt: "On a true AP radiograph of the shoulder, the acromiohumeral interval (AHI) measures 5 mm. Which interpretation is most appropriate?",
    options: ["This is within the normal range and excludes significant rotator cuff disease", "It indicates an os acromiale until proven otherwise", "It is narrowed and suggests a chronic full-thickness/massive rotator cuff tear with superior humeral migration", "It reflects subcoracoid impingement of the subscapularis"],
    answer: 2,
    explanation: "The normal radiographic acromiohumeral interval is approximately 7-14 mm; an AHI of 7 mm or less (especially <6 mm) suggests superior humeral head migration from chronic full-thickness/massive cuff insufficiency and predicts poorer reparability. Correlate with cuff continuity and remember MRI-based AHI is supportive, not interchangeable with a properly positioned radiograph.",
  },
  {
    id: "impingement-4",
    topic: "Impingement & acromion",
    prompt: "An os acromiale is incidentally identified. Regarding its imaging and clinical significance, which statement is correct?",
    options: ["It represents non-fusion of the basiacromion and is best confirmed on a sagittal-oblique MR sequence", "The most common symptomatic type is the meso-acromion, representing non-union at the junction of the meso- and meta-acromion, best seen on axial images", "It is always asymptomatic and never contributes to subacromial impingement", "It is reliably diagnosed on a standard AP radiograph because the unfused segment lies in the coronal plane"],
    answer: 1,
    explanation: "The acromion ossifies from up to four centers (pre-, meso-, meta-, basi-acromion); failure of fusion at the meso-meta junction (meso-acromion) is the most common type (~75%) and most often symptomatic, best demonstrated on axial images, and a mobile fragment can tilt with deltoid pull to narrow the subacromial space.",
  },
  {
    id: "acjoint-1",
    topic: "AC joint & distal clavicle",
    prompt: "A 24-year-old competitive powerlifter has chronic anterior shoulder pain. MRI shows subchondral marrow edema and small subchondral cysts confined to the DISTAL CLAVICLE, with preservation of the acromial side, and no marginal osteophytes. Which feature most specifically distinguishes distal clavicular osteolysis from ordinary AC osteoarthrosis?",
    options: ["Bilateral involvement of the AC joints", "Marrow edema and subchondral resorption predominantly on the clavicular side of the joint", "Capsular hypertrophy and joint-space narrowing", "Inferior AC joint osteophytes producing supraspinatus outlet narrowing"],
    answer: 1,
    explanation: "Distal clavicular osteolysis (a stress/overuse injury of weightlifters) characteristically produces marrow edema, subchondral microfracture, and resorption that PREDOMINATES on the clavicular side of the AC joint, whereas degenerative osteoarthrosis affects both sides with osteophytes and joint-space narrowing. Clavicular-side predominance is the key discriminator; secondary acromial marrow edema is not uncommon (seen in roughly a third to a half of cases on MRI: de la Puente 1999, Gulati 2025), so true acromial involvement does not exclude the diagnosis.",
  },
  {
    id: "acjoint-2",
    topic: "AC joint & distal clavicle",
    prompt: "On shoulder arthrography (or fluid-sensitive MRI), the 'geyser sign' refers to contrast/fluid tracking from the glenohumeral joint through a rotator cuff defect into the subacromial-subdeltoid bursa and then erupting superiorly through an incompetent acromioclavicular (AC) joint capsule. What does this sign most reliably indicate?",
    options: ["An isolated grade I AC sprain with intact capsule", "A chronic full-thickness rotator cuff tear allowing fluid to communicate from the glenohumeral joint up through the AC joint", "Os acromiale with a synovial pseudarthrosis", "Coracoclavicular ligament calcification"],
    answer: 1,
    explanation: "The geyser sign (Craig, 1984) reflects a chronic full-thickness rotator cuff tear: fluid/contrast passes from the glenohumeral joint through the cuff defect into the subacromial-subdeltoid bursa and then erupts superiorly through an incompetent (eroded) AC joint capsule, often forming an AC joint (Type II) cyst. It signals an irreparable cuff with AC erosion, classically seen on arthrography and on fluid-sensitive MRI.",
  },
  {
    id: "acjoint-3",
    topic: "AC joint & distal clavicle",
    prompt: "Using the Rockwood classification of AC joint separation, which combination of findings defines a TYPE IV injury and distinguishes it from a Type III?",
    options: ["Sprain of the AC ligament with intact coracoclavicular ligaments and normal alignment", "Disruption of both AC and CC ligaments with posterior displacement of the distal clavicle into or through the trapezius", "Disruption of both AC and CC ligaments with the clavicle displaced inferiorly beneath the coracoid", "Disruption of both AC and CC ligaments with 100–300% superior coracoclavicular widening and superior clavicle displacement"],
    answer: 1,
    explanation: "Type IV involves rupture of both AC and CC ligaments with POSTERIOR displacement of the distal clavicle into/through the trapezius (best appreciated on axial imaging), distinguishing it from the purely superior displacement of Type III. Inferior (subcoracoid) displacement is Type VI; massive 100–300% superior displacement is Type V.",
  },
  {
    id: "capsule-1",
    topic: "Capsule, ligaments & adhesive capsulitis",
    prompt: "On a non-arthrographic fat-suppressed T2 MRI of a 52-year-old with progressive shoulder stiffness and global motion loss, which combination of findings is the MOST specific for adhesive capsulitis?",
    options: ["T2-hyperintense edema and thickening of the capsule in the axillary recess plus soft-tissue thickening obliterating the subcoracoid fat triangle in the rotator interval", "A thickened middle glenohumeral ligament with a sublabral foramen at the anterosuperior labrum", "Fluid distending the subacromial-subdeltoid bursa with biceps tendon sheath fluid", "Thinning and attenuation of the axillary pouch capsule with a patulous joint recess"],
    answer: 0,
    explanation: "Adhesive capsulitis shows capsular/synovial THICKENING and T2 edema in the axillary recess plus rotator-interval soft-tissue thickening obliterating the subcoracoid fat triangle; the latter (subcoracoid triangle sign) is highly specific (Mengiardi reported ~100% specificity). Thinning/patulous capsule is the opposite (instability), bursal/biceps-sheath fluid is nonspecific, and a thickened MGHL with a sublabral foramen is a normal anterosuperior variant.",
  },
  {
    id: "capsule-2",
    topic: "Capsule, ligaments & adhesive capsulitis",
    prompt: "Using the inferior axillary pouch (capsule + synovium) thickness as a quantitative sign of adhesive capsulitis, which threshold best discriminates affected from normal shoulders on MRI?",
    options: ["Axillary capsule thickness > 4 mm", "Axillary capsule thickness > 1 mm", "Axillary capsule thickness > 8 mm", "Axillary capsule thickness > 12 mm"],
    answer: 0,
    explanation: "A combined capsule-synovium thickness exceeding ~4 mm in the axillary recess is the classic discriminating threshold for adhesive capsulitis (Emig 1995: mean 5.2 mm in affected vs 2.9 mm in normals; >4 mm was 95% specific, 70% sensitive). A >1 mm cutoff overlaps the normal range (~2-3 mm), while >8 mm and >12 mm are too high and insensitive.",
  },
  {
    id: "capsule-3",
    topic: "Capsule, ligaments & adhesive capsulitis",
    prompt: "Regarding the coracohumeral ligament (CHL) in the rotator interval, which MRI finding most reliably supports adhesive capsulitis rather than a normal interval?",
    options: ["CHL thickening greater than approximately 4 mm with enhancement/edema and obliteration of the rotator interval fat", "A normal CHL measuring 1-2 mm bridging the supraspinatus and subscapularis", "Visualization of the superior glenohumeral ligament forming the medial sling of the biceps pulley", "A high-riding biceps tendon with an intact pulley on the sagittal oblique image"],
    answer: 0,
    explanation: "In adhesive capsulitis the CHL becomes pathologically thickened (>~4 mm) with edema/enhancement and effacement of rotator-interval fat; a thin CHL and a normal biceps pulley/SGHL sling are normal anatomy.",
  },
  {
    id: "capsule-4",
    topic: "Capsule, ligaments & adhesive capsulitis",
    prompt: "On MR arthrography, a smooth focal outpouching of contrast at the anterior capsule near the level of the subscapularis is identified. Which capsular insertion variant does this MOST likely represent, and why is it important?",
    options: ["A type II/III (medial) capsular insertion variant of the anterior capsule, which is a normal variant and should not be mistaken for a capsular/periosteal stripping injury", "A reverse Bankart lesion indicating posterior instability", "An ALPSA lesion requiring surgical repair", "A HAGL lesion at the humeral attachment of the IGHL"],
    answer: 0,
    explanation: "Anterior capsular insertion is classified into types I-III by how medially the capsule attaches to the scapular neck; a more medial (type II/III) insertion is a normal variant that can mimic, but must be distinguished from, true capsuloperiosteal stripping (e.g., ALPSA). Insertion type alone does not predict instability (Palmer, Radiology 1995).",
  },
  {
    id: "nerve-1",
    topic: "Nerve entrapment & paralabral cysts",
    prompt: "A 34-year-old volleyball player has a posterosuperior paralabral cyst. On MRI the cyst extends from the glenoid margin into the spinoglenoid notch but does NOT reach the suprascapular notch. Which denervation pattern is MOST expected?",
    options: ["Isolated infraspinatus edema/atrophy", "Combined supraspinatus and infraspinatus edema/atrophy", "Isolated supraspinatus edema/atrophy", "Isolated teres minor edema/atrophy"],
    answer: 0,
    explanation: "At the spinoglenoid notch the suprascapular nerve has already given off its supraspinatus branches (which arise proximally near the suprascapular notch), so compression there denervates the infraspinatus alone; more proximal suprascapular-notch lesions affect both muscles. Teres minor is supplied by the axillary nerve.",
  },
  {
    id: "nerve-2",
    topic: "Nerve entrapment & paralabral cysts",
    prompt: "A pitcher with chronic posterior shoulder pain shows isolated teres minor fatty atrophy on MRI, with a normal infraspinatus and an unremarkable spinoglenoid notch. The MOST likely explanation is:",
    options: ["Quadrilateral space syndrome (axillary nerve, posterior branch)", "Spinoglenoid notch paralabral cyst", "Suprascapular notch ganglion cyst", "Parsonage–Turner involving the long thoracic nerve"],
    answer: 0,
    explanation: "Teres minor is supplied by the posterior branch of the axillary nerve within the quadrilateral space, so isolated teres minor denervation localizes there—classic in overhead throwers. The suprascapular nerve does not innervate teres minor, and a normal infraspinatus with an unremarkable spinoglenoid notch excludes spinoglenoid and suprascapular-notch cysts; the long thoracic nerve supplies serratus anterior, not teres minor.",
  },
  {
    id: "nerve-3",
    topic: "Nerve entrapment & paralabral cysts",
    prompt: "On a fluid-sensitive sequence, a denervated infraspinatus shows diffuse hyperintensity but preserved bulk and NO fatty infiltration on T1. Compared with established fatty atrophy, this finding indicates:",
    options: ["A more acute/subacute and potentially reversible stage of denervation", "A chronic irreversible process unlikely to recover with decompression", "Superimposed acute strain rather than denervation", "A normal variant of muscle signal with no clinical significance"],
    answer: 0,
    explanation: "Denervation edema (T2 hyperintensity without volume loss or T1 fatty change) reflects an earlier, often reversible phase; T1 fatty infiltration and atrophy mark chronic, less recoverable disease.",
  },
  {
    id: "nerve-4",
    topic: "Nerve entrapment & paralabral cysts",
    prompt: "A 41-year-old develops acute shoulder pain followed by weakness; MRI shows diffuse T2 hyperintense edema involving BOTH the supraspinatus and infraspinatus, plus the deltoid, with NO paralabral cyst or mass at either notch. The BEST diagnosis is:",
    options: ["Parsonage–Turner syndrome (neuralgic amyotrophy)", "Spinoglenoid notch ganglion cyst", "Quadrilateral space syndrome", "Suprascapular notch ganglion cyst"],
    answer: 0,
    explanation: "Multifocal denervation edema crossing several nerve territories—here both suprascapular (supra/infraspinatus) and axillary (deltoid)—without a compressive lesion is the hallmark of Parsonage–Turner. A suprascapular-notch ganglion would give supra+infraspinatus edema but spare the deltoid; a spinoglenoid cyst confines edema to the infraspinatus, and quadrilateral space syndrome confines it to the deltoid (and teres minor). The absence of any cyst/mass and the cross-territory pattern exclude all compressive causes.",
  },
  {
    id: "measure-3",
    topic: "Measurements, technique & normal values",
    prompt: "A sports-medicine fellow suspects a Perthes lesion in a young thrower with anterior instability, but the standard MR arthrogram in neutral position is equivocal. Which additional maneuver best demonstrates this lesion, and what is the mechanism?",
    options: ["ABER (abduction-external rotation) position, because tension on the inferior glenohumeral ligament lifts the medially synovialized labrum and allows contrast undercutting", "FADIR position, because internal rotation loads the posterosuperior labrum against the glenoid", "Traction with a weighted hand, because it widens the subacromial space", "Intravenous rather than intra-articular contrast, because it improves capsular enhancement"],
    answer: 0,
    explanation: "A Perthes lesion is an anteroinferior labral tear whose scapular periosteum stays intact but is medially stripped, so the labrum lies reduced against the glenoid and is often occult on neutral MR arthrography. ABER tensions the anterior band of the inferior glenohumeral ligament, lifting the labroligamentous complex off the glenoid so intra-articular contrast undercuts and reveals the tear. FADIR is a hip/FAI maneuver; subacromial traction doesn't affect the labrum; IV (rather than intra-articular) contrast defeats the joint distension arthrography depends on.",
  },
];

// ── Cross-plane correlation drill ────────────────────────────────────────────
// A structure is labeled on one plane; the learner finds the SAME structure on a
// different plane. Every coordinate reuses a verified tour marker, and the "to"
// candidates are all real, distinct structures on that slice (answer index 0 is
// the correct one; the drill shuffles the candidate order for display).
export const shoulderCrossPlane: CorrelationItem[] = [
  {
    id: "sxp-humeral-head",
    prompt: "You see the humeral head on the sagittal. Find the SAME humeral head on the coronal.",
    explanation:
      "The round humeral head is the ball of the ball-and-socket — on the coronal it sits below the supraspinatus, capped by its tendon.",
    from: { plane: "Sagittal T2-FS", dir: SAG, sliceIndex: 17, x: 43, y: 52, label: "Humeral head" },
    to: {
      plane: "Coronal T2-FS",
      dir: COR,
      sliceIndex: 11,
      candidates: [
        { x: 34, y: 58 }, // humeral head ✓
        { x: 53, y: 57 }, // glenoid & labrum
        { x: 45, y: 19 }, // acromion / AC
        { x: 16, y: 52 }, // deltoid
      ],
      answer: 0,
    },
  },
  {
    id: "sxp-subscapularis",
    prompt: "The subscapularis is the anterior cuff muscle on the sagittal. Find its TENDON on the axial.",
    explanation:
      "Subscapularis runs along the anterior humeral head to the lesser tuberosity. A tear is a classic axial miss — look for medial biceps subluxation.",
    from: { plane: "Sagittal T2-FS", dir: SAG, sliceIndex: 5, x: 27, y: 59, label: "Subscapularis muscle" },
    to: {
      plane: "Axial PD-FS",
      dir: AXI,
      sliceIndex: 13,
      candidates: [
        { x: 39, y: 33 }, // subscapularis tendon ✓
        { x: 44, y: 40 }, // biceps in groove
        { x: 50, y: 49 }, // anterior labrum
        { x: 49, y: 63 }, // posterior labrum
      ],
      answer: 0,
    },
  },
  {
    id: "sxp-biceps",
    prompt: "The long head of biceps sits in the rotator interval on the sagittal. Find it in its groove on the axial.",
    explanation:
      "On the axial the biceps is the small dark dot in the bicipital groove between the tuberosities. An EMPTY groove means a torn or dislocated tendon.",
    from: { plane: "Sagittal T2-FS", dir: SAG, sliceIndex: 9, x: 47, y: 36, label: "Biceps / rotator interval" },
    to: {
      plane: "Axial PD-FS",
      dir: AXI,
      sliceIndex: 13,
      candidates: [
        { x: 44, y: 40 }, // biceps in groove ✓
        { x: 39, y: 33 }, // subscapularis
        { x: 50, y: 49 }, // anterior labrum
        { x: 49, y: 63 }, // posterior labrum
      ],
      answer: 0,
    },
  },
  {
    id: "sxp-supraspinatus",
    prompt: "You see the supraspinatus tendon on the coronal. Find its MUSCLE belly on the sagittal T1 (the Goutallier slice).",
    explanation:
      "On the scapular 'Y' the supraspinatus sits above the spine; T1 is the sequence to grade its fatty atrophy (Goutallier), which predicts repairability.",
    from: { plane: "Coronal T2-FS", dir: COR, sliceIndex: 7, x: 35, y: 33, label: "Supraspinatus tendon" },
    to: {
      plane: "Sagittal T1",
      dir: SAG_T1,
      sliceIndex: 4,
      candidates: [
        { x: 40, y: 28 }, // supraspinatus ✓
        { x: 31, y: 61 }, // subscapularis
        { x: 57, y: 56 }, // infraspinatus
        { x: 56, y: 76 }, // teres minor
      ],
      answer: 0,
    },
  },
  {
    id: "sxp-glenoid",
    prompt: "You see the glenoid and labrum on the sagittal T1. Find the glenoid on the coronal.",
    explanation:
      "The glenoid is the shallow socket; on the coronal it carries the superior and inferior labrum at the joint margins.",
    from: { plane: "Sagittal T1", dir: SAG_T1, sliceIndex: 10, x: 42, y: 50, label: "Glenoid & labrum" },
    to: {
      plane: "Coronal T2-FS",
      dir: COR,
      sliceIndex: 11,
      candidates: [
        { x: 53, y: 57 }, // glenoid & labrum ✓
        { x: 34, y: 58 }, // humeral head
        { x: 45, y: 19 }, // acromion / AC
        { x: 38, y: 82 }, // axillary recess
      ],
      answer: 0,
    },
  },
  {
    id: "sxp-acromion",
    prompt: "The acromion roofs the outlet on the sagittal. Find the acromion / AC joint on the coronal.",
    explanation:
      "The acromion and AC joint form the roof of the supraspinatus outlet; a hooked acromion or inferior AC osteophytes can narrow it, but impingement remains a clinical-imaging correlation rather than a shape diagnosis.",
    from: { plane: "Sagittal T2-FS", dir: SAG, sliceIndex: 11, x: 43, y: 19, label: "Acromion" },
    to: {
      plane: "Coronal T2-FS",
      dir: COR,
      sliceIndex: 11,
      candidates: [
        { x: 45, y: 19 }, // acromion / AC ✓
        { x: 34, y: 58 }, // humeral head
        { x: 53, y: 57 }, // glenoid & labrum
        { x: 16, y: 52 }, // deltoid
      ],
      answer: 0,
    },
  },
  {
    id: "sxp-infraspinatus",
    prompt:
      "This is the infraspinatus on the sagittal T2-FS (posterior cuff). Find the same muscle on the sagittal T1 Goutallier slice -- don't grab teres minor below it.",
    explanation:
      "T1 is the fatty-atrophy slice that grades Goutallier and predicts repairability. Infraspinatus fills the infraspinous fossa BELOW the scapular spine; teres minor tucks beneath it. Track the spine and pick the larger upper belly.",
    from: { plane: "Sagittal T2-FS", dir: SAG, sliceIndex: 5, x: 60, y: 55, label: "Infraspinatus / teres minor" },
    to: {
      plane: "Sagittal T1",
      dir: SAG_T1,
      sliceIndex: 4,
      candidates: [
        { x: 57, y: 56 }, // Infraspinatus ✓
        { x: 40, y: 28 }, // Supraspinatus
        { x: 31, y: 61 }, // Subscapularis
        { x: 56, y: 76 }, // Teres minor
      ],
      answer: 0,
    },
  },
  {
    id: "sxp-humeral-head-axi-cor",
    prompt:
      "This is the humeral head on the axial PD-FS (round ball, bicipital groove anteriorly). Find the same head on the coronal T2-FS, capped by the supraspinatus.",
    explanation:
      "Same ball, two slices: axial shows the full circle with anterior groove; coronal shows the dome under the supraspinatus cap. Normal posterolateral flattening below the coracoid is physiologic -- true Hill-Sachs impactions sit at/above the coracoid level.",
    from: { plane: "Axial PD-FS", dir: AXI, sliceIndex: 14, x: 27, y: 40, label: "Humeral head" },
    to: {
      plane: "Coronal T2-FS",
      dir: COR,
      sliceIndex: 11,
      candidates: [
        { x: 34, y: 58 }, // Humeral head ✓
        { x: 53, y: 57 }, // Glenoid & labrum
        { x: 45, y: 19 }, // Acromion / AC joint
        { x: 16, y: 52 }, // Deltoid
      ],
      answer: 0,
    },
  },
  {
    id: "sxp-subscapularis-t1-axi",
    prompt:
      "This is the subscapularis muscle on the sagittal T1 Y-view (big anterior belly). Trace it to its tendon on the axial PD-FS, inserting on the lesser tuberosity.",
    explanation:
      "Follow the anterior cuff muscle into a flat tendon on the lesser tuberosity. The giveaway for a tear: an empty or medialized bicipital groove, because a torn subscapularis lets the long head of biceps medialize. Classic axial miss.",
    from: { plane: "Sagittal T1", dir: SAG_T1, sliceIndex: 4, x: 31, y: 61, label: "Subscapularis" },
    to: {
      plane: "Axial PD-FS",
      dir: AXI,
      sliceIndex: 13,
      candidates: [
        { x: 39, y: 33 }, // Subscapularis tendon ✓
        { x: 44, y: 40 }, // Biceps tendon (groove)
        { x: 50, y: 49 }, // Anterior labrum
        { x: 49, y: 63 }, // Posterior labrum
      ],
      answer: 0,
    },
  },
  {
    id: "sxp-deltoid",
    prompt:
      "This is the deltoid on the sagittal T2-FS -- the outer muscular envelope, NOT a cuff muscle. Find the same deltoid on the coronal T2-FS, superficial to the bursa.",
    explanation:
      "Deltoid is the outermost wrap, separated from the cuff by the subacromial-subdeltoid bursa; it is NOT one of the SITS muscles. On coronal it drapes the greater tuberosity. A negative landmark -- don't read deltoid bulk or edema as cuff disease.",
    from: { plane: "Sagittal T2-FS", dir: SAG, sliceIndex: 11, x: 20, y: 48, label: "Deltoid" },
    to: {
      plane: "Coronal T2-FS",
      dir: COR,
      sliceIndex: 11,
      candidates: [
        { x: 16, y: 52 }, // Deltoid ✓
        { x: 34, y: 58 }, // Humeral head
        { x: 53, y: 57 }, // Glenoid & labrum
        { x: 45, y: 19 }, // Acromion / AC joint
      ],
      answer: 0,
    },
  },
  {
    id: "sxp-supraspinatus-tendon-sag",
    prompt:
      "This is the supraspinatus tendon on the coronal T2-FS. Find the same tendon on the sagittal-Y, arcing over the humeral head beneath the acromial outlet.",
    explanation:
      "Coronal measures gap and retraction; the sag-Y shows WHICH cuff tendons are involved -- the board answer for extension. Most tears begin in the critical zone, about 1 cm proximal to the greater-tuberosity footprint.",
    from: { plane: "Coronal T2-FS", dir: COR, sliceIndex: 7, x: 35, y: 33, label: "Supraspinatus tendon" },
    to: {
      plane: "Sagittal T2-FS",
      dir: SAG,
      sliceIndex: 11,
      candidates: [
        { x: 44, y: 28 }, // Supraspinatus tendon ✓
        { x: 43, y: 19 }, // Acromion
        { x: 20, y: 48 }, // Deltoid
      ],
      answer: 0,
    },
  },
  {
    id: "sxp-acromion-cor-sag",
    prompt:
      "This is the acromion on the coronal T2-FS, roofing the cuff. Find the same acromion on the sagittal-Y outlet view, capping the supraspinatus from above.",
    explanation:
      "The sag-Y IS the outlet view: the acromion roofs it and the supraspinatus passes directly beneath. A hooked Bigliani type III acromion or inferior AC osteophytes can narrow the outlet, but correlate with symptoms, bursal change, and cuff findings -- read acromial shape there, not on coronal.",
    from: { plane: "Coronal T2-FS", dir: COR, sliceIndex: 11, x: 45, y: 19, label: "Acromion / AC joint" },
    to: {
      plane: "Sagittal T2-FS",
      dir: SAG,
      sliceIndex: 11,
      candidates: [
        { x: 43, y: 19 }, // Acromion ✓
        { x: 44, y: 28 }, // Supraspinatus tendon
        { x: 20, y: 48 }, // Deltoid
      ],
      answer: 0,
    },
  },
];


export const shoulderImageCaq: ImageCaqQ[] = [
  {
    id: "sh-icaq-1",
    topic: "Rotator cuff - reparability",
    dir: "/images/teaching/stacks/normal-shoulder-sagittal",
    count: 28,
    startIndex: 5,
    plane: "Sagittal T2-FS",
    vignette: "A 63-year-old has chronic shoulder weakness. This medial sagittal slice is the scapular-Y view used to grade the rotator cuff muscle bellies in cross-section.",
    options: ["Grade fatty atrophy of the cuff muscles (Goutallier-Fuchs), which predicts repairability", "Measure tendon gap and retraction to assign a Patte stage", "Assess the bicipital groove for an empty groove sign", "Evaluate the anteroinferior glenoid for a bony Bankart"],
    answer: 0,
    explanation: "This medial Y-view shows all four cuff bellies (supraspinatus, subscapularis, infraspinatus, teres minor) in cross-section, making it THE plane to grade fatty atrophy with the Goutallier-Fuchs system, which predicts whether a cuff tear is repairable. Patte tendon-gap/retraction is measured on the coronal that follows the tendon to its footprint, the empty-groove sign is an axial finding, and the bony glenoid rim is assessed on the axial - none of which is the purpose of this medial sagittal muscle slice.",
  },
  {
    id: "sh-icaq-2",
    topic: "Subscapularis & biceps pulley",
    dir: "/images/teaching/stacks/normal-shoulder-axial",
    count: 30,
    startIndex: 13,
    plane: "Axial PD-FS",
    vignette: "A 35-year-old has anterior shoulder pain and a positive belly-press test after a fall. On this axial slice, the anterior cuff tendon coursing toward the lesser tuberosity is the subscapularis.",
    options: ["The long head of the biceps may subluxate or dislocate medially out of its groove", "The supraspinatus footprint will show a full-thickness gap", "The posterior labrum will be torn (reverse Bankart)", "The acromion will show a type III hooked morphology"],
    answer: 0,
    explanation: "This is the subscapularis tendon; a tear here disrupts the medial wall of the biceps pulley, so the most specifically associated finding is medial subluxation or dislocation of the long head of the biceps out of the bicipital groove - the companion clue to a subscapularis tear. A supraspinatus footprint gap, a posterior (reverse Bankart) labral tear, and acromial hooking are not the direct consequence of a subscapularis tendon tear.",
  },
  {
    id: "sh-icaq-3",
    topic: "Instability - Bankart & Hill-Sachs",
    dir: "/images/teaching/stacks/normal-shoulder-axial",
    count: 30,
    startIndex: 13,
    plane: "Axial PD-FS",
    vignette: "A 23-year-old sustained an anterior shoulder dislocation in a wrestling match and now has apprehension. On this axial slice (anterior at the top), the dark triangle at the anterior glenoid rim is the anterior labrum.",
    options: ["A posterosuperolateral humeral head impaction (Hill-Sachs lesion)", "A superior labral tear extending into the biceps anchor (SLAP)", "An os acromiale at the meso-meta junction", "Distal clavicular osteolysis"],
    answer: 0,
    explanation: "A torn anteroinferior labrum (Bankart lesion) from anterior dislocation is classically paired with a Hill-Sachs lesion, the impaction fracture of the posterosuperolateral humeral head where it strikes the anterior glenoid rim. A SLAP tear involves the superior labral-biceps anchor (a different mechanism, overhead athletes); os acromiale and distal clavicular osteolysis are unrelated to the instability event shown here.",
  },
  {
    id: "sh-icaq-4",
    topic: "Rotator cuff - full-thickness tear",
    dir: "/images/teaching/stacks/normal-shoulder-coronal",
    count: 24,
    startIndex: 11,
    plane: "Coronal T2-FS",
    vignette: "A 55-year-old has chronic shoulder pain and weakness. On this coronal slice, the thin plane between the rotator cuff and the overlying acromion/deltoid is the subacromial-subdeltoid bursa.",
    options: ["Combined with joint fluid, distension of this bursa suggests a full-thickness cuff tear", "Isolated distension here is diagnostic of adhesive capsulitis", "Fluid here indicates a SLAP tear at the biceps anchor", "Fluid here localizes a quadrilateral-space syndrome"],
    answer: 0,
    explanation: "This is the subacromial-subdeltoid bursa; communicating fluid in BOTH this bursa and the glenohumeral joint strongly suggests a full-thickness rotator cuff tear that lets fluid pass from the joint into the bursa. A trace of isolated bursal fluid is nonspecific and does not diagnose a full-thickness tear or frozen shoulder (which thickens the axillary recess capsule); the bursa is unrelated to the superior labral anchor (SLAP) or the quadrilateral space.",
  },
  {
    id: "sh-icaq-5",
    topic: "Adhesive capsulitis",
    dir: "/images/teaching/stacks/normal-shoulder-coronal",
    count: 24,
    startIndex: 11,
    plane: "Coronal T2-FS",
    vignette: "A 52-year-old diabetic woman has months of painful global stiffness with no trauma. On this coronal slice, the dependent inferior pouch of the joint capsule is the axillary recess.",
    options: ["Capsular thickening and edema here support adhesive capsulitis", "Fluid distension here is a normal finding requiring no follow-up", "Thickening here indicates a full-thickness supraspinatus tear", "Edema here localizes a spinoglenoid notch paralabral cyst"],
    answer: 0,
    explanation: "This is the axillary recess; thickening and T2 edema of the axillary recess capsule (together with rotator-interval soft-tissue thickening that obliterates the subcoracoid fat) is the MRI signature of adhesive capsulitis, fitting this diabetic patient with non-traumatic global stiffness. The axillary recess is not where a supraspinatus tear or a spinoglenoid notch cyst is assessed, and capsular thickening here is not a normal finding to ignore.",
  },
  {
    id: "sh-icaq-6",
    topic: "Rotator cuff - Goutallier atrophy",
    dir: "/images/teaching/stacks/normal-shoulder-sagittal-t1",
    count: 28,
    startIndex: 4,
    plane: "Sagittal T1",
    vignette: "A 60-year-old with a chronic cuff tear is being evaluated for repair. This sagittal T1 scapular-Y slice shows the four cuff muscle bellies; the muscle filling the supraspinous fossa above the scapular spine is the supraspinatus.",
    options: ["High-grade fatty infiltration here predicts an irreparable tear", "Bright marrow signal here on T1 indicates marrow edema", "This slice is best for measuring the acromiohumeral interval", "This T1 slice best demonstrates a SLAP tear of the biceps anchor"],
    answer: 0,
    explanation: "The supraspinatus fills the supraspinous fossa, and T1 (fat bright, unsuppressed) is the sequence to grade Goutallier-Fuchs fatty infiltration; high-grade fatty atrophy of the supraspinatus predicts an irreparable tear and changes surgical planning. Bright signal in MUSCLE on T1 reflects fatty infiltration, not marrow edema (which is DARK on T1); the acromiohumeral interval is a radiographic/coronal measurement, and a SLAP tear is a labral lesion best shown on fluid-sensitive or arthrographic sequences, not this T1 muscle slice.",
  },
  {
    id: "sh-icaq-7",
    topic: "Rotator cuff - cable/crescent",
    dir: "/images/teaching/stacks/normal-shoulder-coronal",
    count: 24,
    startIndex: 7,
    plane: "Coronal T2-FS",
    vignette: "A 48-year-old overhead athlete has lateral shoulder pain and weakness. On this coronal slice, follow the supraspinatus tendon to the greater-tuberosity footprint and separate the thin distal crescent from the thicker rotator cable just medial to it. Why does that distinction matter when a small articular-sided tear is present?",
    options: [
      "Cable integrity helps determine functional importance; an intact cable may preserve load transfer, while cable disruption makes a small-appearing tear more consequential",
      "The cable is the same structure as the superior labrum, so its injury is reported as a SLAP tear",
      "A crescent tear is diagnosed only on axial imaging because the coronal cannot show the footprint",
      "The cable/crescent distinction applies only after surgery and should be ignored on the initial MRI",
    ],
    answer: 0,
    explanation: "The rotator cable/crescent model matters because the cable is a load-sharing band just medial to the thin distal cuff crescent. A limited crescent tear with an intact cable can behave differently from a tear that disrupts the cable, especially anteriorly, so the report should not describe only the footprint gap and retraction.",
  },
];


/**
 * Ultrasound correlate for each normal-shoulder tour structure (keyed by tour-step
 * title). One entry serves every plane that tours a title — the sonographic
 * appearance is plane-independent. Authored + adversarially verified against
 * standard MSK-US references (Jacobson; ESSR/AIUM shoulder protocol).
 */
export const shoulderStructureCorrelate: Record<string, StructureCorrelate> = {
  "Rotator-cuff muscles (medial slice)": {
    ultrasound: {
      seen: true,
      appearance:
        "US shows the cuff muscle bellies as hypoechoic muscle with hyperechoic perimysial striations, and can grossly suggest atrophy by bulk loss and increased echogenicity (fatty change). But Goutallier fatty-grading and the deep supraspinatus-fossa belly are an MRI/T1 job — US gives only a coarse impression.",
      tip: "Probe over the scapular spine and the supraspinatus/infraspinatus fossae, comparing bulk and echogenicity side-to-side.",
    },
  },
  "Subscapularis": {
    ultrasound: {
      seen: true,
      appearance:
        "A superficial, well-seen anterior cuff tendon; in external rotation its multipennate fibrillar bundles fan across the lesser tuberosity. Dynamic internal/external rotation unmasks tears, and remember a torn subscapularis is the lesion that lets the long head of biceps subluxate medially out of the groove — always check the two together.",
      tip: "Transverse over the lesser tuberosity, then externally rotate the arm to elongate and uncover the tendon; keep the probe perpendicular, as anisotropy at the curving insertion fakes a hypoechoic tear.",
      image: {
        src: "/images/teaching/us/subscapularis.jpg",
        caption: "Normal subscapularis tendon at the lesser tuberosity, deep to the deltoid (long-axis, arm externally rotated).",
        attribution: "Selame et al., Cureus 2021 (CC BY)",
      },
    },
  },
  "Infraspinatus & teres minor": {
    ultrasound: {
      seen: true,
      appearance:
        "Both posterior cuff tendons are superficial and well-seen, converging on the greater tuberosity with a fibrillar fan; teres minor sits more inferiorly with a trapezoidal belly. The posterior glenohumeral recess just deep to infraspinatus is the best US window for a joint effusion and the standard posterior injection target, while the spinoglenoid notch is where you chase a paralabral cyst causing isolated infraspinatus atrophy — though the deep notch itself is better resolved on MRI.",
      tip: "Posterior approach with the patient's hand on the opposite shoulder, scanning transverse below the scapular spine; toe-heel to stay perpendicular and defeat anisotropy.",
      image: {
        src: "/images/teaching/us/infraspinatus.jpg",
        caption: "Normal infraspinatus tendon over the posterior humeral head (long-axis, posterior approach).",
        attribution: "Selame et al., Cureus 2021 (CC BY)",
      },
    },
  },
  "Glenoid & labrum": {
    ultrasound: {
      seen: false,
      appearance:
        "The glenoid articular surface and labrum are deep and intra-articular, so routine US cannot reliably evaluate them — MRI or MR-arthrography (or CT for bone) is the modality. US may offer only indirect clues such as a paralabral/spinoglenoid cyst or a joint effusion.",
    },
  },
  "Biceps & rotator interval": {
    ultrasound: {
      seen: true,
      appearance:
        "On the long-axis interval view the long head of biceps sits in the rotator interval bounded by supraspinatus and subscapularis, stabilized by the biceps pulley (coracohumeral and superior glenohumeral ligaments). US shows interval fluid and lets you dynamically stress for pulley failure and medial biceps subluxation, but the pulley sling itself is best confirmed on MR-arthrography; a little anechoic fluid around the intra-articular biceps is normal.",
      tip: "Anterior long-axis at the interval; internally/externally rotate to test biceps stability within the pulley, keeping the probe perpendicular to avoid an anisotropic pseudo-tear.",
    },
  },
  "Humeral head": {
    ultrasound: {
      seen: false,
      appearance:
        "US sees only the hyperechoic cortex and the thin anechoic cartilage of the posterosuperior head, and a Hill-Sachs notch can become visible on the posterolateral head with the arm in internal rotation — but the head and its marrow overall are an MRI structure. Routine US cannot assess the articular surface or subchondral bone.",
    },
  },
  "Supraspinatus tendon": {
    ultrasound: {
      seen: true,
      appearance:
        "The flagship US tendon: a superficial, beak-shaped fibrillar band inserting on the greater tuberosity footprint, scanned in long and short axis over the anterolateral humeral head. Full- and partial-thickness tears, calcific tendinosis, and bursal-side defects are all well shown — but beware anisotropy, the #1 shoulder pitfall, where off-axis insonation fakes a hypoechoic 'tear.'",
      tip: "Modified Crass (hand in back pocket/on iliac wing, elbow flexed and pointed behind) to roll the tendon out from under the acromion; place the probe in long axis over the anterolateral head and toe-heel it perpendicular to defeat anisotropy.",
      image: {
        src: "/images/teaching/us/supraspinatus.jpg",
        caption: "Normal supraspinatus tendon — convex fibrillar band under the deltoid, inserting on the humeral head (long-axis).",
        attribution: "Selame et al., Cureus 2021 (CC BY)",
      },
    },
  },
  "Acromion": {
    ultrasound: {
      seen: true,
      appearance:
        "The acromion is a hyperechoic cortical line that serves as a key US landmark and the roof for dynamic impingement testing — you watch the cuff and bursa bunch or catch under it during abduction. Its shape, undersurface spurs, and os acromiale are better characterized on radiographs/MRI.",
      tip: "Coronal over the lateral acromion; abduct the arm and watch for bursal/supraspinatus catching beneath the acromial edge.",
    },
  },
  "Deltoid": {
    ultrasound: {
      seen: true,
      appearance:
        "The superficial deltoid is the first muscle layer the beam crosses — pennate, fibrillar, and an easy depth/quality reference overlying the bursa and cuff. It is rarely the target itself but orients every cuff view and can show deltoid tears or denervation change.",
      tip: "It sits immediately under the subcutaneous fat on essentially every anterior/lateral cuff window — use it as your top-of-image landmark.",
    },
  },
  "Greater tuberosity": {
    ultrasound: {
      seen: true,
      appearance:
        "The greater-tuberosity cortex and supraspinatus/infraspinatus footprint are well-seen as a smooth hyperechoic line. The high-yield pearl: cortical irregularity, pitting, or enthesophytes at the footprint is a reliable secondary sign of a chronic rotator-cuff tear — let an irregular cortex raise your suspicion before you even find the defect.",
      tip: "Follow the supraspinatus long-axis distally to its footprint and trace the cortex for steps, pits, or spurs that flag an underlying cuff tear.",
    },
  },
  "Subacromial–subdeltoid bursa": {
    ultrasound: {
      seen: true,
      appearance:
        "A thin hypo/anechoic stripe with hyperechoic peribursal fat sandwiched between deltoid and the cuff — US is the modality of choice. Distension (>2 mm fluid), wall thickening, or bunching/catching under the acromion on dynamic abduction signals bursitis or impingement.",
      tip: "Coronal over supraspinatus; abduct the arm and watch the bursa pool laterally and snag under the acromion.",
    },
  },
  "Acromion & AC joint": {
    ultrasound: {
      seen: true,
      appearance:
        "The AC joint is superficial and US-excellent: you see the clavicular and acromial cortices and the overlying capsule, with the intra-articular disc only variably resolved. US shows capsular hypertrophy, osteophytes, a ganglion, and the geyser sign (fluid tracking up into the joint from a full-thickness cuff tear decompressing superiorly), plus dynamic widening or pain on cross-body adduction.",
      tip: "Place the probe coronally directly over the palpable AC step; add cross-body adduction to provoke widening and pain.",
      image: {
        src: "/images/teaching/us/ac-joint.jpg",
        caption: "Normal acromioclavicular joint — the superficial step between acromion and distal clavicle (long-axis).",
        attribution: "Selame et al., Cureus 2021 (CC BY)",
      },
    },
  },
  "Axillary recess": {
    ultrasound: {
      seen: false,
      appearance:
        "The inferior axillary recess and deep capsule are not a routine US target — MRI/MR-arthrography characterizes capsular structures. That said, adhesive capsulitis has described US signs (thickened coracohumeral ligament and rotator interval, hypervascular axillary recess on Doppler, restricted dynamic motion), so US can support the clinical diagnosis even though the recess itself is deep.",
    },
  },
  "Bony glenoid": {
    ultrasound: {
      seen: false,
      appearance:
        "The bony glenoid articular surface is deep and intra-articular, so US cannot assess glenoid bone loss or version — CT (and MRI/MR-arthrography) is the modality. US reaches only the most posterior cortical rim as a hyperechoic line, not the articular face.",
    },
  },
  "Anterior labrum": {
    ultrasound: {
      seen: false,
      appearance:
        "The anterior labrum sits deep behind the subscapularis and humeral head, so US cannot reliably image it or detect a Bankart lesion — MR-arthrography is the modality. US may show only an associated anterior paralabral cyst as an indirect clue.",
    },
  },
  "Posterior labrum": {
    ultrasound: {
      seen: false,
      appearance:
        "The posterior labrum is the one labral segment US partially reaches via a posterior approach, appearing as a small hyperechoic triangle at the glenoid rim, and a posterior paralabral cyst may be an indirect clue. Still, sensitivity is limited and the labrum is deep, so default to MRI/MR-arthrography as the modality for a posterior labral tear.",
    },
  },
  "Biceps in the bicipital groove": {
    ultrasound: {
      seen: true,
      appearance:
        "On short-axis the long head of biceps is a hyperechoic oval in the bicipital groove between the tuberosities, ringed by the transverse ligament; a thin anechoic rim of sheath fluid is normal. US is the modality for tenosynovial fluid, tendinosis, and dynamic medial subluxation/dislocation on rotation — and an empty groove means either a full dislocation (look medially, suspect a subscapularis tear) or a complete proximal tear with distal retraction.",
      tip: "Transverse over the anterior humeral head with the arm in neutral/slight external rotation; add abduction–external rotation dynamically to test for the tendon jumping the medial wall, and if the groove looks empty, hunt medially and check the subscapularis.",
      image: {
        src: "/images/teaching/us/biceps-groove.jpg",
        caption: "Normal long head of biceps (*) seated in the bicipital groove between the tuberosities (transverse).",
        attribution: "Selame et al., Cureus 2021 (CC BY)",
      },
    },
  },
  "Coracoid process": {
    ultrasound: {
      seen: true,
      appearance:
        "The coracoid is a hyperechoic cortical bump that acts as a medial US landmark — the origin of the conjoint tendon and the medial anchor of the coracohumeral and coracoacromial ligaments. It orients the rotator interval and is gauged in coracohumeral-distance / subcoracoid impingement assessment.",
      tip: "Find the palpable coracoid below the clavicle and rock the probe medially from the rotator interval to land on its cortex.",
    },
  },
  "Spine of scapula": {
    ultrasound: {
      seen: true,
      appearance:
        "The scapular spine is a hyperechoic cortical ridge that serves as the posterior US landmark dividing the supraspinatus from the infraspinatus fossa and pointing you to the spinoglenoid notch. It is a navigation reference for posterior cuff scanning rather than a target in itself.",
      tip: "Lay the probe transversely across the palpable posterior ridge; scan above it for supraspinatus and below for infraspinatus.",
    },
  },
};
