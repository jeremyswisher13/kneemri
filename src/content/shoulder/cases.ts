import type { CaseMetadata } from "@/content/cases";

export const shoulderCaseRegistry: CaseMetadata[] = [
  {
    id: "shoulder-cuff-tendinosis-bursitis",
    title: "Rotator Cuff Tendinosis with Subacromial-Subdeltoid Bursitis",
    difficulty: "foundational",
    tier: "core",
    residentVisible: true,
    clinicalScenario:
      "A 47-year-old recreational tennis player has 4 months of atraumatic lateral shoulder pain, worse with overhead activity and sleeping on the affected side. Strength is preserved but painful with resisted abduction.",
    keyDiagnoses: [
      "Supraspinatus tendinosis without full-thickness tear",
      "Mild subacromial-subdeltoid bursitis",
      "Mild AC joint osteoarthritis",
    ],
    tags: ["cuff", "tendinosis", "bursitis", "atraumatic-pain", "rehab-first"],
    radiopaediaUrl: "https://radiopaedia.org/cases/supraspinatus-tendinosis-and-peritendinitis",
    radiopaediaTitle: "Supraspinatus tendinosis and peritendinitis (MRI)",
    teachingImages: [
      {
        src: "/images/teaching/shoulder/tendinosis-real.jpg",
        alt: "Proton-density shoulder MRI showing rotator cuff tendinosis",
        caption: "Real MRI (proton-density) — a subacromial spur impinging the supraspinatus (black arrow) and intrasubstance subscapularis tendinosis (white arrow): intermediate tendon signal/thickening WITHOUT a surface-reaching fluid-bright defect = tendinosis, not a tear.",
        attribution: "Cureus 2024. PMC11600663. CC-BY 4.0.",
        step: 3,
      },
      {
        src: "/images/teaching/shoulder/cuff-tear-spectrum.svg",
        alt: "Schematic comparing rotator cuff tendinosis, partial-thickness, and full-thickness tear",
        caption: "Tendinosis = thickened, intermediate (gray) signal with NO surface-reaching defect — not a tear. A partial tear reaches one surface; a full-thickness tear spans both and lets joint fluid communicate with the bursa.",
        attribution: "UCLA Shoulder MRI Course — original schematic illustration.",
        step: 3,
      },
    ],
    modelReport: {
      findings:
        "ROTATOR CUFF: Mild-to-moderate supraspinatus tendinosis with tendon thickening and intermediate signal. No discrete articular-sided, bursal-sided, or full-thickness tear. Infraspinatus, subscapularis, and teres minor tendons are intact.\n\nMUSCLES: No rotator cuff muscle atrophy or fatty infiltration.\n\nBURSA/AC JOINT: Mild subacromial-subdeltoid bursal fluid and mild AC joint osteoarthrosis with small inferior osteophytes. No aggressive marrow edema.\n\nLABRUM/BICEPS: No displaced labral tear on this non-arthrogram study. Long head biceps tendon is normally positioned in the groove.",
      impression:
        "1. Supraspinatus tendinosis without rotator cuff tear.\n2. Mild subacromial-subdeltoid bursitis and mild AC joint osteoarthritis.\n3. No muscle atrophy or management-changing structural cuff defect.",
    },
    teachingPoints: [
      "Intermediate tendon signal plus thickening without a surface defect is tendinosis, not a tear.",
      "Mild bursitis should prompt a cuff search but does not automatically mean full-thickness tear.",
      "For primary care sports medicine, this is typically a rehab-first pattern unless symptoms or exam suggest another driver.",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Non-contrast shoulder MRI", "Clinical question: atraumatic overhead/lateral shoulder pain"] },
      { step: 2, stepName: "Bones, Alignment & AC Joint", expectedFindings: ["Mild AC joint osteoarthritis", "No fracture or aggressive marrow lesion", "Normal glenohumeral alignment"] },
      { step: 3, stepName: "Rotator Cuff Tendons", expectedFindings: ["Supraspinatus tendinosis", "No partial-thickness or full-thickness tear", "Subscapularis intact"] },
      { step: 4, stepName: "Rotator Cuff Muscles", expectedFindings: ["No atrophy", "No fatty infiltration"] },
      { step: 5, stepName: "Labrum & Instability Lesions", expectedFindings: ["No displaced labral tear on non-arthrogram MRI", "No instability osseous pattern"] },
      { step: 6, stepName: "Biceps, Pulley & Rotator Interval", expectedFindings: ["Biceps tendon normally positioned", "No pulley red flag"] },
      { step: 7, stepName: "Cartilage, Capsule, Bursa & Synovium", expectedFindings: ["Mild subacromial-subdeltoid bursitis", "No adhesive capsulitis support pattern"] },
      { step: 8, stepName: "Nerves, Masses & Final Management Review", expectedFindings: ["No denervation or mass", "Rehab-first impression language"] },
    ],
  },
  {
    id: "shoulder-acute-full-thickness-cuff-tear",
    title: "Acute Traumatic Full-Thickness Rotator Cuff Tear",
    difficulty: "intermediate",
    tier: "core",
    residentVisible: true,
    clinicalScenario:
      "A 58-year-old active cyclist falls onto an outstretched arm and develops immediate shoulder pain with new weakness in forward elevation and external rotation.",
    keyDiagnoses: [
      "Full-thickness supraspinatus tear with posterior extension",
      "Early tendon retraction without advanced fatty atrophy",
      "Reactive subacromial-subdeltoid bursal fluid",
    ],
    tags: ["trauma", "rotator-cuff", "full-thickness", "weakness", "surgical-referral"],
    radiopaediaUrl: "https://radiopaedia.org/cases/full-thickness-partial-width-supraspinatus-tear",
    radiopaediaTitle: "Full-thickness supraspinatus tear (MRI)",
    teachingImages: [
      {
        src: "/images/teaching/shoulder/fullthickness-supraspinatus.jpg",
        alt: "Full-thickness supraspinatus tear on fluid-sensitive MRI (three planes)",
        caption: "Real MRI — full-thickness supraspinatus tear: a fluid-bright defect spanning the tendon at the footprint (arrowheads), with fluid communicating into the subacromial-subdeltoid bursa.",
        attribution: "Cureus 2020. PMC7370661. CC-BY 4.0.",
        step: 3,
      },
      {
        src: "/images/teaching/shoulder/retraction-muscle-quality.svg",
        alt: "Schematic of rotator cuff tear retraction (Patte) and muscle fatty infiltration (Goutallier)",
        caption: "Report retraction (Patte 1 = footprint → 3 = glenoid) and muscle quality (Goutallier; grade ≥3 = poor healing / possibly irreparable). These features drive reparability — not just 'tear present.'",
        attribution: "UCLA Shoulder MRI Course — original schematic illustration.",
        step: 4,
      },
    ],
    teachingStacks: [
      {
        id: "supraspinatus-tear-coronal",
        title: "Full-thickness supraspinatus tear — scroll the coronal series",
        plane: "Oblique coronal, fluid-sensitive MR arthrogram",
        caption:
          "Scroll through four consecutive oblique-coronal slices (anterior → posterior). Yellow arrows mark the torn, retracted supraspinatus tendon edge; blue arrows (slices C–D) mark the aponeurotic expansion over the humeral head where the tendon should insert. Use the slider, drag, a horizontal trackpad gesture, or the arrow keys.",
        attribution: "Uludag V et al., Cureus 2024;16(8):e66272, Fig 1. PMC11376144. CC BY 4.0.",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11376144/",
        slices: [
          { src: "/images/teaching/shoulder/stacks/cuff-tear/supraspinatus-tear-coronal_slice_1.jpg", alt: "Coronal slice 1 of 4 — anterior; yellow arrow at the torn supraspinatus tendon" },
          { src: "/images/teaching/shoulder/stacks/cuff-tear/supraspinatus-tear-coronal_slice_2.jpg", alt: "Coronal slice 2 of 4 — yellow arrows at the retracted tendon edge" },
          { src: "/images/teaching/shoulder/stacks/cuff-tear/supraspinatus-tear-coronal_slice_3.jpg", alt: "Coronal slice 3 of 4 — blue arrows at the aponeurotic expansion" },
          { src: "/images/teaching/shoulder/stacks/cuff-tear/supraspinatus-tear-coronal_slice_4.jpg", alt: "Coronal slice 4 of 4 — posterior extension of the tear" },
        ],
        step: 3,
      },
    ],
    modelReport: {
      findings:
        "ROTATOR CUFF: Full-thickness tear of the supraspinatus tendon at the footprint with posterior extension into the anterior infraspinatus fibers. Fluid signal spans the articular to bursal surface. Mild tendon retraction to the humeral head apex. Subscapularis remains intact.\n\nMUSCLES: No advanced fatty infiltration. Mild edema at the musculotendinous junction compatible with acute injury.\n\nBURSA/JOINT: Moderate subacromial-subdeltoid bursal fluid communicating with the cuff defect. Small glenohumeral effusion.\n\nBONES: No acute fracture. Mild greater tuberosity reactive marrow edema.",
      impression:
        "1. Acute full-thickness supraspinatus tear with anterior infraspinatus extension and mild retraction.\n2. No advanced cuff muscle fatty atrophy, supporting potentially repairable acute tear pattern.\n3. Moderate reactive subacromial-subdeltoid bursal fluid.",
    },
    teachingPoints: [
      "Acute traumatic weakness plus full-thickness tear is a timely referral pattern.",
      "Retraction and muscle quality are essential because they influence repairability.",
      "Bursal fluid can be a secondary sign of full-thickness cuff communication.",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Acute traumatic weakness is the management question", "Assess tear acuity and reparability clues"] },
      { step: 2, stepName: "Bones, Alignment & AC Joint", expectedFindings: ["No fracture", "Mild greater tuberosity marrow edema", "No dislocation pattern"] },
      { step: 3, stepName: "Rotator Cuff Tendons", expectedFindings: ["Full-thickness supraspinatus tear", "Anterior infraspinatus extension", "Mild retraction (humeral head apex)", "Subscapularis intact"] },
      { step: 4, stepName: "Rotator Cuff Muscles", expectedFindings: ["No advanced fatty infiltration", "Mild acute edema", "No severe chronic atrophy"] },
      { step: 5, stepName: "Labrum & Instability Lesions", expectedFindings: ["No primary instability pattern"] },
      { step: 6, stepName: "Biceps, Pulley & Rotator Interval", expectedFindings: ["Biceps remains located", "No clear pulley lesion"] },
      { step: 7, stepName: "Cartilage, Capsule, Bursa & Synovium", expectedFindings: ["Moderate subacromial-subdeltoid bursal fluid", "Small glenohumeral effusion"] },
      { step: 8, stepName: "Nerves, Masses & Final Management Review", expectedFindings: ["Surgical referral priority due to acute full-thickness tear with weakness", "No mass or denervation"] },
    ],
  },
  {
    id: "shoulder-anterior-instability-bankart",
    title: "Anterior Instability with Bankart and Hill-Sachs Lesions",
    difficulty: "intermediate",
    tier: "core",
    residentVisible: true,
    clinicalScenario:
      "A 22-year-old rugby player sustains a first-time anterior shoulder dislocation reduced on the field. They now report apprehension and pain in abduction/external rotation.",
    keyDiagnoses: [
      "Anteroinferior labral tear compatible with Bankart lesion",
      "Hill-Sachs impaction injury",
      "Glenohumeral effusion after dislocation",
    ],
    tags: ["instability", "bankart", "hill-sachs", "dislocation", "labrum"],
    radiopaediaUrl: "https://radiopaedia.org/cases/fibrous-bankart-lesion-3",
    radiopaediaTitle: "Bankart lesion with Hill-Sachs (MR arthrogram)",
    teachingImages: [
      {
        src: "/images/teaching/shoulder/bankart-real.jpg",
        alt: "Axial MR arthrogram of the shoulder showing a soft-tissue Bankart lesion and a Hill-Sachs lesion",
        caption: "Real axial MR arthrogram of chronic anterior instability. Black arrow: detachment of the anteroinferior labrum with a torn glenoid periosteum (soft-tissue Bankart). White arrow: the posterolateral humeral-head impaction (Hill-Sachs). Both poles of the bipolar lesion are visible on one slice.",
        attribution: "Omoumi P. J Belg Soc Radiol 2016;100(1):97, Fig. 8. DOI: 10.5334/jbr-btr.1217 (PMC6100670). Licensed CC BY 4.0.",
        step: 5,
      },
      {
        src: "/images/teaching/shoulder/bankart-hill-sachs.svg",
        alt: "Axial schematic of a Bankart lesion and Hill-Sachs impaction",
        caption: "Schematic of the same pattern: anteroinferior labral detachment (Bankart) plus posterolateral humeral-head impaction (Hill-Sachs). On a first dislocation, don't stop at the labrum — grade glenoid bone loss and look for an engaging Hill-Sachs.",
        attribution: "UCLA Shoulder MRI Course — original schematic illustration.",
        step: 5,
      },
    ],
    modelReport: {
      findings:
        "ALIGNMENT/BONES: Glenohumeral alignment is currently reduced. Posterolateral humeral head impaction marrow edema consistent with Hill-Sachs lesion. No large displaced osseous fragment identified on MRI.\n\nLABRUM/CAPSULE: Anteroinferior labral detachment at the glenoid rim compatible with Bankart lesion. Inferior glenohumeral ligament complex remains attached to the humerus without clear HAGL lesion.\n\nROTATOR CUFF: Rotator cuff tendons are intact without full-thickness tear.\n\nJOINT: Moderate glenohumeral effusion. No loose body identified.",
      impression:
        "1. Anterior instability injury pattern with anteroinferior labral Bankart lesion and Hill-Sachs impaction injury.\n2. No full-thickness rotator cuff tear.\n3. No definite HAGL lesion or large displaced osseous fragment on this study.",
    },
    teachingPoints: [
      "Instability MRI should connect labral injury with humeral head and glenoid osseous findings.",
      "Do not stop at Bankart; inspect for bony Bankart, Hill-Sachs, HAGL, cuff tear, and loose body.",
      "Primary care sports medicine should recognize bone loss patterns that make surgical consultation more likely.",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["First-time anterior dislocation", "Question: instability lesion pattern and associated injuries"] },
      { step: 2, stepName: "Bones, Alignment & AC Joint", expectedFindings: ["Reduced glenohumeral alignment", "Hill-Sachs marrow edema", "No large displaced bony Bankart seen"] },
      { step: 3, stepName: "Rotator Cuff Tendons", expectedFindings: ["No full-thickness cuff tear"] },
      { step: 4, stepName: "Rotator Cuff Muscles", expectedFindings: ["No denervation or atrophy"] },
      { step: 5, stepName: "Labrum & Instability Lesions", expectedFindings: ["Anteroinferior labral Bankart lesion", "Check for ALPSA/Perthes/bony Bankart", "No definite HAGL"] },
      { step: 6, stepName: "Biceps, Pulley & Rotator Interval", expectedFindings: ["Biceps anchor not dominant abnormality"] },
      { step: 7, stepName: "Cartilage, Capsule, Bursa & Synovium", expectedFindings: ["Moderate effusion", "No loose body"] },
      { step: 8, stepName: "Nerves, Masses & Final Management Review", expectedFindings: ["Instability referral discussion", "No mass or denervation"] },
    ],
  },
  {
    id: "shoulder-slap-biceps-anchor",
    title: "Superior Labrum/Biceps Anchor Injury in an Overhead Athlete",
    difficulty: "intermediate",
    tier: "core",
    residentVisible: true,
    clinicalScenario:
      "A 28-year-old baseball pitcher reports deep shoulder pain and loss of velocity. Exam suggests pain with O'Brien testing and biceps load maneuver.",
    keyDiagnoses: [
      "Suspected SLAP tear involving the biceps anchor",
      "Mild undersurface supraspinatus/infraspinatus fraying",
      "No full-thickness rotator cuff tear",
    ],
    tags: ["slap", "biceps-anchor", "overhead-athlete", "labrum", "thrower"],
    radiopaediaUrl: "https://radiopaedia.org/cases/slap-lesion-type-viii-1",
    radiopaediaTitle: "SLAP lesion of the superior labrum (MR arthrogram)",
    teachingImages: [
      {
        src: "/images/teaching/shoulder/slap-real.jpg",
        alt: "MR arthrogram and arthroscopy of a type II SLAP lesion",
        caption: "Real MR arthrogram (panels b–d, with arthroscopic correlation in e) — contrast undercutting the superior labrum at the biceps anchor (arrows): the hallmark of a Type II SLAP tear. Panel (a) is the labeled illustration.",
        attribution: "SA J Radiol 2023. PMC10879901. CC-BY 4.0.",
        step: 5,
      },
      {
        src: "/images/teaching/shoulder/slap-vs-recess.svg",
        alt: "Schematic comparing a SLAP tear with a normal sublabral recess",
        caption: "A sublabral recess is smooth, medial, and parallels the glenoid (stopping at the biceps anchor). A SLAP extends laterally into the labral substance or posterior to the anchor with irregular margins.",
        attribution: "UCLA Shoulder MRI Course — original schematic illustration.",
        step: 5,
      },
    ],
    teachingStacks: [
      {
        id: "slap-labrum-axial",
        title: "Labral tear — scroll the axial MR-arthrogram series",
        plane: "Axial, fat-suppressed T1 MR arthrogram",
        caption:
          "Scroll four consecutive axial MR-arthrogram slices (superior → inferior) through the labrum. Arrows mark contrast undercutting the torn labrum at successive clock positions (here a Type IX / circumferential pattern). Use the slider, drag, a horizontal trackpad gesture, or the arrow keys.",
        attribution: "SA J Radiol 2023. PMC10879901, Fig 14 (panels b–e). CC BY 4.0.",
        sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10879901/",
        slices: [
          { src: "/images/teaching/shoulder/stacks/slap/slap-labrum-axial_slice_1.jpg", alt: "Axial slice 1 of 4 (superior) — arrows at the torn superior labrum" },
          { src: "/images/teaching/shoulder/stacks/slap/slap-labrum-axial_slice_2.jpg", alt: "Axial slice 2 of 4 — torn labrum at successive clock positions" },
          { src: "/images/teaching/shoulder/stacks/slap/slap-labrum-axial_slice_3.jpg", alt: "Axial slice 3 of 4 — torn labrum at successive clock positions" },
          { src: "/images/teaching/shoulder/stacks/slap/slap-labrum-axial_slice_4.jpg", alt: "Axial slice 4 of 4 (inferior) — torn labrum" },
        ],
        step: 5,
      },
    ],
    modelReport: {
      findings:
        "LABRUM/BICEPS ANCHOR: Abnormal signal and irregularity at the superior labrum extending into the biceps anchor, suspicious for SLAP-type injury in the appropriate clinical setting. No displaced labral fragment.\n\nROTATOR CUFF: Mild articular-sided fraying of the posterior supraspinatus/anterior infraspinatus undersurface. No high-grade partial or full-thickness rotator cuff tear.\n\nBICEPS: Long head biceps tendon remains intact and located in the groove without dislocation.\n\nBONES/JOINT: No acute osseous injury. No significant glenohumeral cartilage loss.",
      impression:
        "1. Superior labral/biceps anchor abnormality suspicious for SLAP injury in this symptomatic overhead athlete.\n2. Mild undersurface posterosuperior cuff fraying without full-thickness tear.\n3. Biceps tendon remains located; no full-thickness cuff tear.",
    },
    teachingPoints: [
      "SLAP interpretation depends heavily on age, sport, exam, and whether MRI was arthrographic.",
      "Throwers may have posterosuperior cuff undersurface fraying associated with internal impingement patterns.",
      "Avoid overcalling superior labral variants; correlate with symptoms and exam.",
      "Confidence calibration: labral interpretation (especially SLAP and posterosuperior variants) has only moderate inter-observer agreement even among experts. A borderline MRI finding should NOT drive surgery unless imaging, exam, sport, and symptoms all align.",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Overhead athlete with biceps/labral symptoms", "Consider whether arthrogram detail is needed"] },
      { step: 2, stepName: "Bones, Alignment & AC Joint", expectedFindings: ["No acute osseous injury", "No major arthritis"] },
      { step: 3, stepName: "Rotator Cuff Tendons", expectedFindings: ["Mild undersurface cuff fraying", "No high-grade or full-thickness tear"] },
      { step: 4, stepName: "Rotator Cuff Muscles", expectedFindings: ["No atrophy or denervation"] },
      { step: 5, stepName: "Labrum & Instability Lesions", expectedFindings: ["Superior labral/biceps anchor abnormality", "No displaced labral fragment", "Distinguish from normal recess"] },
      { step: 6, stepName: "Biceps, Pulley & Rotator Interval", expectedFindings: ["Biceps tendon intact and located", "Anchor is the dominant biceps-related finding"] },
      { step: 7, stepName: "Cartilage, Capsule, Bursa & Synovium", expectedFindings: ["No significant cartilage loss", "No adhesive capsulitis pattern"] },
      { step: 8, stepName: "Nerves, Masses & Final Management Review", expectedFindings: ["Management depends on clinical correlation and sport demands", "No cyst or denervation"] },
    ],
  },
  {
    id: "shoulder-adhesive-capsulitis",
    title: "Adhesive Capsulitis Support Pattern",
    difficulty: "foundational",
    tier: "core",
    residentVisible: true,
    clinicalScenario:
      "A 52-year-old patient with diabetes has progressive shoulder pain and global loss of passive range of motion. Radiographs show no advanced arthritis.",
    keyDiagnoses: [
      "MRI findings supportive of adhesive capsulitis",
      "Rotator interval edema and capsular thickening",
      "No full-thickness cuff tear",
    ],
    tags: ["adhesive-capsulitis", "frozen-shoulder", "capsule", "diabetes", "injection-planning"],
    radiopaediaUrl: "https://radiopaedia.org/cases/adhesive-capsulitis-frozen-shoulder-1",
    radiopaediaTitle: "Adhesive capsulitis / frozen shoulder (MRI)",
    teachingImages: [
      {
        src: "/images/teaching/shoulder/adhesive-real.jpg",
        alt: "MRI showing thickened coracohumeral ligament in adhesive capsulitis",
        caption: "Real MRI (T2) — thickened coracohumeral ligament / rotator-interval soft tissue (arrows) adjacent to the humeral head (H): a supportive MRI sign of adhesive capsulitis.",
        attribution: "Insights Imaging 2016. PMC4877356. CC-BY 4.0.",
        step: 6,
      },
      {
        src: "/images/teaching/shoulder/adhesive-capsulitis.svg",
        alt: "Schematic of adhesive capsulitis MRI findings",
        caption: "Inspect the rotator interval (coracohumeral ligament thickening, loss of the subcoracoid fat triangle) and the thickened, edematous axillary pouch / inferior capsule. MRI supports the clinical diagnosis and excludes mimics.",
        attribution: "UCLA Shoulder MRI Course — original schematic illustration.",
        step: 6,
      },
    ],
    modelReport: {
      findings:
        "CAPSULE/ROTATOR INTERVAL: Thickening and edema of the inferior glenohumeral ligament/axillary capsule with edema in the rotator interval and thickening of the coracohumeral ligament. Findings support adhesive capsulitis in the appropriate clinical setting.\n\nROTATOR CUFF: Mild supraspinatus tendinosis without full-thickness tear.\n\nBICEPS/LABRUM: Long head biceps tendon is intact and normally located. No displaced labral tear.\n\nJOINT: No advanced glenohumeral osteoarthritis. Small joint effusion.",
      impression:
        "1. Capsular and rotator interval findings supportive of adhesive capsulitis in the appropriate clinical setting.\n2. Mild supraspinatus tendinosis without rotator cuff tear.\n3. No advanced glenohumeral arthritis.",
    },
    teachingPoints: [
      "Adhesive capsulitis remains a clinical diagnosis; MRI supports and excludes competing pathology.",
      "Key imaging regions are the rotator interval, coracohumeral ligament, and axillary capsule.",
      "Primary care relevance: supports capsular-focused therapy and image-guided injection planning when clinically appropriate.",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Global passive ROM loss", "Question: adhesive capsulitis support and exclusion of arthritis/cuff tear"] },
      { step: 2, stepName: "Bones, Alignment & AC Joint", expectedFindings: ["No advanced arthritis", "No fracture"] },
      { step: 3, stepName: "Rotator Cuff Tendons", expectedFindings: ["Mild supraspinatus tendinosis", "No full-thickness tear"] },
      { step: 4, stepName: "Rotator Cuff Muscles", expectedFindings: ["No atrophy"] },
      { step: 5, stepName: "Labrum & Instability Lesions", expectedFindings: ["No displaced labral tear or instability pattern"] },
      { step: 6, stepName: "Biceps, Pulley & Rotator Interval", expectedFindings: ["Rotator interval edema", "Coracohumeral ligament thickening", "Biceps normally located"] },
      { step: 7, stepName: "Cartilage, Capsule, Bursa & Synovium", expectedFindings: ["Axillary capsular thickening/edema", "Small effusion", "No advanced cartilage loss"] },
      { step: 8, stepName: "Nerves, Masses & Final Management Review", expectedFindings: ["Findings support clinical diagnosis", "No red flag mass or denervation"] },
    ],
  },
  {
    id: "shoulder-subscapularis-biceps-hidden-lesion",
    title: "Upper Subscapularis Tear with Medial Biceps Subluxation (the “hidden lesion”)",
    difficulty: "intermediate",
    tier: "core",
    residentVisible: true,
    clinicalScenario:
      "A 46-year-old recreational golfer has anterior shoulder pain and weakness with internal rotation. The belly-press and lift-off tests are positive. A prior outside report called the cuff “tendinopathic.”",
    keyDiagnoses: [
      "Tear of the upper-border subscapularis tendon",
      "Medial subluxation/dislocation of the long head of biceps (pulley lesion)",
      "Pattern commonly missed on a quick coronal-only read",
    ],
    tags: ["subscapularis", "biceps-pulley", "medial-subluxation", "hidden-lesion", "anterior-pain"],
    radiopaediaUrl: "https://radiopaedia.org/cases/subscapularis-tendon-tear-the-hidden-lesion?lang=us",
    radiopaediaTitle: "Subscapularis tendon tear — the hidden lesion (MRI)",
    teachingImages: [
      {
        src: "/images/teaching/shoulder/subscap-biceps-dislocation.jpg",
        alt: "Axial MR arthrogram showing medial displacement of the long head of biceps",
        caption: "Axial MR arthrogram — the long head of biceps is displaced MEDIALLY out of the bicipital groove (arrowhead). Medial biceps displacement is the tip-off: deliberately hunt for an upper-border subscapularis tear.",
        attribution: "Lee SU et al., BioMed Research International 2018. PMC6151251. CC-BY 4.0.",
        step: 6,
      },
      {
        src: "/images/teaching/shoulder/subscap-sublux-vs-disloc.jpg",
        alt: "Axial MRI comparing biceps subluxation and dislocation",
        caption: "The spectrum — medial SUBLUXATION (biceps perched over the lesser tuberosity, left) vs frank DISLOCATION (biceps fully out of the groove, right). Either should trigger a subscapularis/pulley search.",
        attribution: "Lee SU et al., BioMed Research International 2018. PMC6151251. CC-BY 4.0.",
        step: 3,
      },
    ],
    modelReport: {
      findings:
        "ROTATOR CUFF: Tear involving the superior fibers of the subscapularis tendon at the lesser tuberosity footprint. Supraspinatus shows tendinosis without a full-thickness tear.\n\nBICEPS/PULLEY: The long head of biceps is medially subluxed/dislocated relative to the bicipital groove, consistent with a biceps pulley lesion (coracohumeral ligament / superior glenohumeral ligament / upper subscapularis complex).\n\nMUSCLES: No advanced subscapularis muscle atrophy.\n\nLABRUM/JOINT: No displaced labral tear on this study. Small joint effusion.",
      impression:
        "1. Upper-border subscapularis tendon tear with an associated biceps pulley lesion and medial biceps subluxation/dislocation.\n2. Supraspinatus tendinosis without full-thickness tear.\n3. Symptomatic upper-subscapularis/biceps lesions are surgically relevant — report the combined lesion explicitly rather than “cuff tendinopathy.”",
    },
    teachingPoints: [
      "Medial biceps displacement is a red flag for an upper-subscapularis / pulley lesion until proven otherwise — the classic “hidden lesion.”",
      "Read the subscapularis on AXIAL and sagittal images; a coronal-only glance at the supraspinatus misses it.",
      "Naming “upper subscapularis tear + medial biceps subluxation” changes the surgical conversation far more than “rotator cuff tendinopathy.”",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Anterior pain + internal-rotation weakness (positive belly-press/lift-off)", "Question: subscapularis and biceps pulley integrity"] },
      { step: 2, stepName: "Bones, Alignment & AC Joint", expectedFindings: ["Lesser tuberosity footprint intact", "No fracture", "Normal alignment"] },
      { step: 3, stepName: "Rotator Cuff Tendons", expectedFindings: ["Upper-border subscapularis tear at the lesser tuberosity", "Supraspinatus tendinosis without full-thickness tear"] },
      { step: 4, stepName: "Rotator Cuff Muscles", expectedFindings: ["No advanced subscapularis atrophy"] },
      { step: 5, stepName: "Labrum & Instability Lesions", expectedFindings: ["No displaced labral tear on this study"] },
      { step: 6, stepName: "Biceps, Pulley & Rotator Interval", expectedFindings: ["Medial biceps subluxation/dislocation", "Pulley lesion (CHL / SGHL / upper subscapularis)", "Rotator interval involvement"] },
      { step: 7, stepName: "Cartilage, Capsule, Bursa & Synovium", expectedFindings: ["Small effusion", "No advanced cartilage loss"] },
      { step: 8, stepName: "Nerves, Masses & Final Management Review", expectedFindings: ["Report the combined upper-subscapularis + biceps lesion explicitly", "Surgically relevant if symptomatic — orthopedic referral conversation"] },
    ],
  },
  {
    id: "shoulder-massive-cuff-arthropathy",
    title: "Massive Chronic Cuff Tear with Cuff Tear Arthropathy",
    difficulty: "advanced",
    tier: "advanced",
    residentVisible: true,
    clinicalScenario:
      "A 72-year-old active retiree has chronic shoulder pain, pseudoparalysis, and marked weakness. Symptoms worsened gradually over several years.",
    keyDiagnoses: [
      "Massive chronic supraspinatus/infraspinatus tear",
      "Advanced muscle atrophy/fatty infiltration",
      "Superior humeral migration and cuff tear arthropathy",
    ],
    tags: ["massive-cuff-tear", "atrophy", "fatty-infiltration", "arthropathy", "advanced"],
    radiopaediaUrl: "https://radiopaedia.org/cases/complete-rotator-cuff-tear",
    radiopaediaTitle: "Complete (massive) rotator cuff tear with retraction (MRI)",
    teachingImages: [
      {
        src: "/images/teaching/shoulder/massive-real.jpg",
        alt: "Coronal MRI of a massive cuff tear with superior humeral migration",
        caption: "Real fluid-sensitive MRI (panel A coronal) — massive rotator cuff tear with superior migration of the humeral head, tendon retraction, and advanced muscle fatty infiltration (cuff tear arthropathy).",
        attribution: "Medicine (Baltimore) 2025. PMC12499805. CC-BY 4.0.",
        step: 4,
      },
      {
        src: "/images/teaching/shoulder/cuff-arthropathy.svg",
        alt: "Schematic of a massive cuff tear with cuff tear arthropathy",
        caption: "Massive retracted tear with superior humeral migration and a narrowed acromiohumeral interval (<7 mm). At this stage the reparability comment matters more than naming the tear.",
        attribution: "UCLA Shoulder MRI Course — original schematic illustration.",
        step: 4,
      },
    ],
    modelReport: {
      findings:
        "ROTATOR CUFF: Massive chronic full-thickness tear involving the supraspinatus and infraspinatus tendons with tendon retraction to the glenoid level. Subscapularis demonstrates partial tearing/tendinosis.\n\nMUSCLES: Advanced supraspinatus and infraspinatus atrophy with fatty infiltration.\n\nALIGNMENT/ARTHROPATHY: Superior migration of the humeral head with narrowing of the acromiohumeral interval. Glenohumeral cartilage thinning and subchondral cystic change consistent with cuff tear arthropathy.\n\nBICEPS: Long head biceps tendon is attenuated and may be chronically torn.",
      impression:
        "1. Massive chronic rotator cuff tear involving supraspinatus and infraspinatus with retraction to the glenoid and advanced muscle atrophy/fatty infiltration.\n2. Superior humeral migration and degenerative changes compatible with cuff tear arthropathy.\n3. Findings suggest limited primary repairability; orthopedic shoulder referral for treatment options is appropriate.",
    },
    teachingPoints: [
      "Massive chronic cuff tear assessment must include retraction and muscle quality.",
      "Superior migration and arthropathy shift the conversation away from simple repair.",
      "Primary care sports medicine should recognize this as a referral pattern but with different expectations than acute repairable tear.",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Chronic pseudoparalysis/weakness", "Question: tear chronicity and salvage pattern"] },
      { step: 2, stepName: "Bones, Alignment & AC Joint", expectedFindings: ["Superior humeral head migration", "Narrowed acromiohumeral interval", "Degenerative glenohumeral changes"] },
      { step: 3, stepName: "Rotator Cuff Tendons", expectedFindings: ["Massive full-thickness supraspinatus/infraspinatus tear", "Retraction to glenoid level", "Subscapularis tendinosis/partial tearing"] },
      { step: 4, stepName: "Rotator Cuff Muscles", expectedFindings: ["Advanced supraspinatus/infraspinatus atrophy", "Fatty infiltration"] },
      { step: 5, stepName: "Labrum & Instability Lesions", expectedFindings: ["Degenerative labral changes may coexist", "No acute instability pattern"] },
      { step: 6, stepName: "Biceps, Pulley & Rotator Interval", expectedFindings: ["Attenuated or chronically torn biceps tendon possible"] },
      { step: 7, stepName: "Cartilage, Capsule, Bursa & Synovium", expectedFindings: ["Glenohumeral cartilage loss", "Subchondral cystic change", "Cuff tear arthropathy pattern"] },
      { step: 8, stepName: "Nerves, Masses & Final Management Review", expectedFindings: ["Referral appropriate but primary repairability limited", "No mass or acute denervation"] },
    ],
  },
  {
    id: "shoulder-calcific-tendinitis",
    title: "Calcific Tendinitis of the Rotator Cuff",
    difficulty: "intermediate",
    tier: "advanced",
    residentVisible: true,
    clinicalScenario:
      "A 50-year-old has an acute, severe atraumatic shoulder pain crisis — far worse than a typical tendinopathy flare, with night pain and guarding. Radiographs show a rounded calcific density near the greater tuberosity.",
    keyDiagnoses: [
      "Hydroxyapatite (calcific) deposit in the supraspinatus tendon",
      "Reactive subacromial-subdeltoid bursitis",
      "Distinct management from tendinosis (NSAIDs, image-guided barbotage/injection)",
    ],
    tags: ["calcific-tendinitis", "hydroxyapatite", "acute-pain-crisis", "bursitis", "injection-planning"],
    radiopaediaUrl: "https://radiopaedia.org/cases/calcific-tendinitis-supraspinatus-tendon",
    radiopaediaTitle: "Calcific tendinitis of the supraspinatus (MRI)",
    teachingImages: [
      {
        src: "/images/teaching/shoulder/calcific-tendinitis.jpg",
        alt: "Calcific tendinitis of the supraspinatus on T1, T2, and sagittal MRI",
        caption: "Calcific (hydroxyapatite) deposit at the supraspinatus insertion (arrows) — LOW signal on T1 and T2/fluid-sensitive sequences, so it is easy to overlook on MRI. Note the surrounding edema/bursitis. Radiographs/ultrasound show the deposit best — correlate.",
        attribution: "Cureus 2025. PMC12659715. CC-BY 4.0.",
        step: 3,
      },
    ],
    modelReport: {
      findings:
        "ROTATOR CUFF: Focal low-signal (on T1 and T2) hydroxyapatite deposit within the distal supraspinatus near the footprint, with adjacent intratendinous and peritendinous edema. No discrete full-thickness tear.\n\nBURSA: Reactive subacromial-subdeltoid bursal fluid adjacent to the deposit.\n\nMUSCLES/LABRUM/JOINT: No muscle atrophy. No labral tear. Small joint effusion.\n\nNOTE: Deposits are inconspicuous on MRI because they are low signal on all sequences — radiographs and ultrasound are more sensitive.",
      impression:
        "1. Calcific tendinitis of the supraspinatus with reactive subacromial-subdeltoid bursitis, in an acute pain crisis (resorptive-phase) pattern.\n2. No full-thickness rotator cuff tear.\n3. Management differs from tendinosis: NSAIDs and image-guided barbotage/aspiration or subacromial injection — correlate with radiographs, which display the deposit best.",
    },
    teachingPoints: [
      "A calcific (hydroxyapatite) deposit is LOW signal on all MRI sequences and is easy to miss — radiographs and ultrasound show it best, so always correlate.",
      "Acute (resorptive-phase) calcific tendinitis causes a pain crisis out of proportion to routine tendinopathy, often with florid surrounding edema ± bursal involvement.",
      "Management diverges from a structural cuff tear: usually conservative first (NSAIDs, activity modification, PT), with image-guided barbotage/aspiration or a subacromial injection for refractory or acute resorptive-phase pain — the deposit, not a tear, drives the plan.",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Acute atraumatic pain crisis", "Radiograph shows a calcific density", "Question: calcific deposit vs tear vs infection"] },
      { step: 2, stepName: "Bones, Alignment & AC Joint", expectedFindings: ["No fracture", "Calcific density may be seen near the greater tuberosity"] },
      { step: 3, stepName: "Rotator Cuff Tendons", expectedFindings: ["Low-signal calcific deposit in the supraspinatus", "Surrounding tendon/peritendinous edema", "No full-thickness tear"] },
      { step: 4, stepName: "Rotator Cuff Muscles", expectedFindings: ["No atrophy"] },
      { step: 5, stepName: "Labrum & Instability Lesions", expectedFindings: ["No labral tear or instability pattern"] },
      { step: 6, stepName: "Biceps, Pulley & Rotator Interval", expectedFindings: ["Biceps normally located"] },
      { step: 7, stepName: "Cartilage, Capsule, Bursa & Synovium", expectedFindings: ["Reactive subacromial-subdeltoid bursitis", "Small effusion"] },
      { step: 8, stepName: "Nerves, Masses & Final Management Review", expectedFindings: ["Recognize calcific disease (correlate with radiographs)", "Conservative first (NSAIDs/PT); barbotage or injection if refractory — deposit-directed, not cuff repair"] },
    ],
  },
];

export const shoulderCoreCases = shoulderCaseRegistry.filter((c) => c.tier === "core");
export const shoulderAdvancedCases = shoulderCaseRegistry.filter((c) => c.tier === "advanced");
