import type { CaseMetadata } from "@/content/cases";

/**
 * Hip MRI teaching cases (primary-care sports-medicine audience).
 * Text authored + adversarially verified (MSK radiologist / sports-med management).
 * teachingImages are CC-licensed real MRI figures (verified license + content).
 */
export const hipCaseRegistry: CaseMetadata[] = [
  {
    id: "hip-cam-fai-labral-tear",
    title: "Cam-Type FAI with Anterosuperior Labral Tear and Rim Chondral Injury",
    difficulty: "foundational",
    tier: "core",
    residentVisible: true,
    clinicalScenario:
      "A 27-year-old male ice-hockey player presents with 8 months of deep anterior groin pain (positive C-sign) worse with prolonged sitting and pivoting. FADIR (flexion-adduction-internal rotation) impingement test reproduces his pain, and internal rotation in flexion is limited to 10 degrees.",
    keyDiagnoses: [
      "Cam-type femoroacetabular impingement (alpha angle >55 degrees)",
      "Anterosuperior acetabular labral tear",
      "Anterosuperior acetabular rim chondral delamination",
      "Femoral head-neck junction subchondral cyst (herniation pit)",
    ],
    tags: ["cam-fai", "labral-tear", "chondral-injury", "alpha-angle", "referral", "groin-pain"],
    radiopaediaUrl: "https://radiopaedia.org/search?lang=us&scope=cases&q=cam%20femoroacetabular%20impingement",
    radiopaediaTitle: "Cam-type FAI — Radiopaedia cases",
    modelReport: {
      findings:
        "PROTOCOL: Non-contrast 3T hip MRI with dedicated oblique-axial sequences along the femoral neck and radial reformats. Clinical question: rule out FAI/labral pathology in a young athlete with mechanical groin pain.\n\nBONES & MARROW: Femoral head and neck are well seen and well corticated without stress reaction. There is an osseous bump at the anterosuperior femoral head-neck junction with loss of the normal concave waist. A small subchondral fibrocystic change (herniation pit) is noted at the anterosuperior head-neck junction. No marrow edema to suggest stress fracture or AVN.\n\nJOINT & CARTILAGE: Small physiologic joint effusion. Focal full-thickness chondral loss/delamination is present at the anterosuperior acetabular rim (12-3 o'clock) with adjacent subchondral marrow edema. The femoral head cartilage is preserved.\n\nLABRUM: Anterosuperior acetabular labrum demonstrates intrasubstance and undersurface signal extending to the articular margin, consistent with a tear at the chondrolabral junction (12-3 o'clock). No paralabral cyst. Posterior and inferior labrum intact.\n\nFAI MORPHOLOGY: Alpha angle measures 68 degrees on the oblique-axial sequence (normal <55), confirming cam morphology. Lateral center-edge angle is normal (32 degrees) without pincer over-coverage. No crossover sign.\n\nCAPSULE/LIGAMENTS: Iliofemoral ligament and capsule intact. Ligamentum teres normal.\n\nTENDONS/MUSCLES: Hip flexors, abductors, adductors, and hamstring origins are normal. No iliopsoas bursitis.",
      impression:
        "1. Cam-type femoroacetabular impingement: alpha angle 68 degrees with anterosuperior head-neck bump.\n2. Anterosuperior acetabular labral tear at the chondrolabral junction (12-3 o'clock).\n3. Full-thickness anterosuperior acetabular RIM chondral delamination with subchondral edema - the surgically significant lesion.\n4. Findings are concordant with the patient's FADIR-positive mechanical symptoms. Recommend a structured hip-preservation pathway: physical therapy and activity modification first-line, with orthopedic/hip-preservation referral for the symptomatic chondral injury or if a dedicated rehab trial fails.",
    },
    teachingPoints: [
      "The alpha angle is measured on oblique-axial (along the neck) or radial images; >55 degrees defines cam morphology. Do not eyeball it on a standard axial - measure it.",
      "The LABRAL tear gets the headlines, but it is the acetabular RIM chondral injury (delamination/full-thickness loss) that most drives surgical weighting and prognosis. Always report chondral status explicitly.",
      "Pitfall: cam morphology is common in asymptomatic athletes (especially hockey, football, soccer). Imaging morphology alone does NOT equal a surgical lesion - it must concord with FADIR-positive mechanical symptoms.",
      "Management/disposition pearl: symptomatic cam FAI is NOT an automatic operation. First-line is a structured rehab program (hip and core strengthening, activity modification); hip-preservation (orthopedic) referral for arthroscopic osteochondroplasty and labral repair is for failed conservative care or a significant chondral lesion like this one. An intra-articular steroid injection is diagnostic/temporizing, not definitive treatment.",
      "An intra-articular diagnostic anesthetic injection that relieves pain confirms an intra-articular source and supports surgical candidacy when the clinical picture is mixed (e.g., concurrent lateral or pubic complaints).",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Confirm dedicated FAI protocol with oblique-axial (radial) sequences for alpha-angle measurement", "Clinical question is mechanical groin pain / impingement in a young athlete", "Verify field strength and that femoral neck obliques are present"] },
      { step: 2, stepName: "Bones, Marrow & Stress Injury", expectedFindings: ["Anterosuperior head-neck osseous bump with loss of normal concavity", "Small herniation pit (fibrocystic change) at head-neck junction", "No femoral neck stress fracture or marrow edema"] },
      { step: 3, stepName: "Cartilage, Joint Surface & Effusion", expectedFindings: ["Full-thickness anterosuperior acetabular RIM chondral delamination (12-3 o'clock)", "Adjacent subchondral marrow edema - the surgically significant lesion", "Small physiologic effusion; femoral cartilage preserved"] },
      { step: 4, stepName: "Labrum & FAI Morphology", expectedFindings: ["Anterosuperior labral tear at chondrolabral junction (12-3 o'clock)", "Alpha angle 68 degrees confirming cam morphology", "Normal lateral center-edge angle, no crossover/pincer component"] },
      { step: 5, stepName: "Abductors, Lateral & Posterior Soft Tissue", expectedFindings: ["Gluteus medius/minimus footprints intact", "No greater trochanteric bursitis or lateral soft-tissue edema", "Posterior labrum and structures normal"] },
      { step: 6, stepName: "Flexors, Adductors & Pubic Symphysis", expectedFindings: ["Iliopsoas and rectus femoris origins normal, no iliopsoas bursitis", "Adductor origins and pubic symphysis unremarkable", "No secondary cleft sign to suggest competing pubalgia"] },
      { step: 7, stepName: "Don't-Miss & Final Management Review", expectedFindings: ["Confirm chondral injury severity is documented (drives prognosis)", "Confirm morphology concords with FADIR-positive symptoms before calling it surgical", "Disposition: structured rehab first-line; hip-preservation referral for the chondral lesion or failed conservative care, not injection as definitive care"] },
    ],
  },
  {
    id: "hip-femoral-neck-stress-fracture",
    title: "Tension-Side (Superolateral) Femoral Neck Stress Fracture - Surgical Urgency",
    difficulty: "intermediate",
    tier: "core",
    residentVisible: true,
    clinicalScenario:
      "A 22-year-old female collegiate distance runner with a recent training-volume spike and a history of amenorrhea/RED-S presents with 3 weeks of progressively worsening groin pain, now painful at rest and with weight-bearing. She has an antalgic gait, pain on the hop test, and pain at the extremes of internal rotation. Radiographs were read as normal.",
    keyDiagnoses: [
      "Tension-side (superolateral) femoral neck stress fracture",
      "Relative energy deficiency in sport (RED-S) / female athlete triad as contributing risk",
      "High-risk stress fracture requiring urgent orthopedic management",
    ],
    tags: ["femoral-neck-stress-fracture", "tension-side", "surgical-urgency", "high-risk-stress-fracture", "red-s", "non-weight-bearing"],
    radiopaediaUrl: "https://radiopaedia.org/search?lang=us&scope=cases&q=femoral%20neck%20stress%20fracture",
    radiopaediaTitle: "Femoral neck stress fracture — Radiopaedia cases",
    modelReport: {
      findings:
        "PROTOCOL: Non-contrast hip MRI including fluid-sensitive (T2 fat-saturated/STIR) coronal sequences and T1 coronal. Clinical question: occult stress injury in a runner with mechanical groin pain and normal radiographs.\n\nBONES & MARROW: There is extensive ill-defined marrow edema within the femoral neck. Critically, a linear hypointense fracture line is present along the SUPEROLATERAL (tension-side) cortex of the femoral neck, extending from the cortex toward the medullary canal. The fracture line involves an estimated >50% of the neck width. No discrete displacement. T1 confirms the corresponding low-signal fracture line. No findings of AVN (no double-line sign).\n\nJOINT & CARTILAGE: Moderate reactive joint effusion. Articular cartilage of the head and acetabulum is preserved.\n\nLABRUM: Acetabular labrum is intact without tear. No FAI morphology that would account for symptoms.\n\nCAPSULE/LIGAMENTS: Capsule distended by effusion. Ligamentum teres intact.\n\nTENDONS/MUSCLES: Hip flexors, abductors, adductors, and hamstring origins are intact. No additional muscle edema.",
      impression:
        "1. SUPEROLATERAL (TENSION-SIDE) femoral neck stress fracture with a discrete fracture line involving >50% of the neck width and surrounding marrow edema - a HIGH-RISK, surgically urgent injury.\n2. Reactive joint effusion.\n3. URGENT orthopedic management. The patient should be made NON-weight-bearing immediately and NOT ambulate from the department; arrange same-day orthopedic evaluation given the tension-side location and high risk of fracture completion/displacement and resultant AVN. This typically proceeds to percutaneous internal fixation.\n4. Clinical correlation for RED-S / female athlete triad and bone-health workup advised.",
    },
    teachingPoints: [
      "Location dictates everything: TENSION-side fractures are SUPEROLATERAL, are under distraction forces, and are high-risk for completion and displacement - they are a surgical urgency (urgent ortho, non-weight-bearing, usually percutaneous fixation).",
      "COMPRESSION-side fractures are INFEROMEDIAL, are under compressive load, and are usually managed conservatively (protected weight-bearing) when small - BUT a compression-side fracture line crossing >50% of the neck, or one that progresses or fails to settle on follow-up, also crosses into surgical territory. Compression-side is not a free pass.",
      "Management/disposition pearl: a tension-side line, OR any fracture line involving more than ~50% of the neck width, mandates non-weight-bearing and urgent orthopedic referral for fixation. Do not let the patient walk out of the clinic or the scanner - mobilize them by wheelchair and arrange same-day ortho.",
      "Pitfall: radiographs are frequently normal early - a normal X-ray does NOT exclude a femoral neck stress fracture. MRI is the standard for the occult high-risk hip.",
      "Always look for and document the underlying driver (RED-S/female athlete triad, training-load spike); the fracture is a sentinel for a bone-health problem that will recur if unaddressed.",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Confirm fluid-sensitive coronal (STIR/T2 FS) and T1 coronal sequences are present", "Clinical question is occult stress fracture with normal radiographs", "Note risk factors in the history (runner, RED-S, training spike)"] },
      { step: 2, stepName: "Bones, Marrow & Stress Injury", expectedFindings: ["Linear hypointense fracture line along the SUPEROLATERAL (tension-side) cortex - the critical finding", "Extensive femoral neck marrow edema on STIR with low-signal line on T1", "Estimate the percentage of neck width involved (>50% raises urgency)"] },
      { step: 3, stepName: "Cartilage, Joint Surface & Effusion", expectedFindings: ["Moderate reactive joint effusion", "Preserved head and acetabular cartilage", "No subchondral collapse"] },
      { step: 4, stepName: "Labrum & FAI Morphology", expectedFindings: ["Labrum intact - exclude a competing labral cause for the groin pain", "No cam/pincer morphology accounting for symptoms", "Confirm the stress fracture is the dominant pain generator"] },
      { step: 5, stepName: "Abductors, Lateral & Posterior Soft Tissue", expectedFindings: ["Abductor tendons intact", "No lateral soft-tissue edema or bursitis", "Posterior structures normal"] },
      { step: 6, stepName: "Flexors, Adductors & Pubic Symphysis", expectedFindings: ["Adductor and flexor origins normal", "Pubic symphysis normal - exclude competing pubalgia/stress injury", "No additional pelvic stress reaction (but consider screening sacrum if edema pattern suggests)"] },
      { step: 7, stepName: "Don't-Miss & Final Management Review", expectedFindings: ["Explicitly classify as TENSION-side and high-risk in the impression", "Disposition: strict non-weight-bearing, keep the patient off their feet, and arrange same-day/URGENT orthopedic referral for fixation", "Flag bone-health/RED-S workup as the don't-miss systemic driver"] },
    ],
  },
  {
    id: "hip-avn-femoral-head",
    title: "Avascular Necrosis of the Femoral Head (Double-Line Sign), Pre-Collapse",
    difficulty: "intermediate",
    tier: "core",
    residentVisible: true,
    clinicalScenario:
      "A 41-year-old man on a recent prolonged corticosteroid course (for an inflammatory flare) reports several weeks of insidious groin and buttock pain, worse with weight-bearing and at rest. Range of motion is mildly restricted but radiographs are normal. There is no history of acute trauma.",
    keyDiagnoses: [
      "Avascular necrosis (osteonecrosis) of the femoral head",
      "Pre-collapse disease (ARCO I — MRI-only changes with a normal radiograph; double-line sign without subchondral collapse)",
      "Corticosteroid-associated osteonecrosis",
    ],
    tags: ["avascular-necrosis", "double-line-sign", "pre-collapse", "arco-staging", "referral", "joint-preservation"],
    radiopaediaUrl: "https://radiopaedia.org/search?lang=us&scope=cases&q=avascular%20necrosis%20femoral%20head",
    radiopaediaTitle: "AVN of the femoral head — Radiopaedia cases",
    modelReport: {
      findings:
        "PROTOCOL: Non-contrast hip MRI with T1 coronal, T2 fat-saturated/STIR coronal and sagittal sequences. Clinical question: occult osteonecrosis in a patient with corticosteroid exposure and atraumatic groin pain. NOTE: protocol should include the contralateral hip, as osteonecrosis is frequently bilateral.\n\nBONES & MARROW: There is a geographic, serpiginous subchondral lesion in the anterosuperior weight-bearing femoral head, demarcated by a peripheral reactive interface. On T2 fat-saturated images this interface shows the classic DOUBLE-LINE SIGN (inner hyperintense granulation tissue paralleling an outer hypointense sclerotic rim). The necrotic segment encloses fat-signal marrow on T1. Surrounding reactive marrow edema extends into the neck. Importantly, the overlying subchondral cortex remains CONGRUENT - there is NO subchondral fracture line (no crescent) and NO articular surface flattening/collapse.\n\nJOINT & CARTILAGE: Small joint effusion. Overlying articular cartilage is preserved and congruent.\n\nLABRUM: Acetabular labrum intact.\n\nCAPSULE/LIGAMENTS: Capsule and ligamentum teres normal.\n\nTENDONS/MUSCLES: Periarticular tendons and muscles unremarkable.\n\nLESION SIZE / CONTRALATERAL: The necrotic segment involves a moderate portion of the weight-bearing surface (modified Kerboul / arc estimate to be correlated for collapse risk; larger lesions and >2/3 head involvement portend higher collapse risk and lower core-decompression success). The contralateral hip should be specifically reviewed for early (often asymptomatic) disease.",
      impression:
        "1. Avascular necrosis of the femoral head with the classic double-line sign - PRE-COLLAPSE disease (ARCO I; advances to II only once radiographic sclerosis/cysts appear): NO subchondral crescent and NO articular flattening.\n2. Reactive marrow edema and small effusion.\n3. The management hinge is collapse: this is PRE-collapse, so it is potentially amenable to joint-preserving treatment. Recommend prompt orthopedic referral and protected weight-bearing. Note that joint-preserving surgery (e.g., core decompression) efficacy is lesion-size dependent - it works best in small/medium pre-collapse lesions.\n4. Specifically image and evaluate the CONTRALATERAL hip (osteonecrosis is frequently bilateral), and correlate corticosteroid exposure and other AVN risk factors.",
    },
    teachingPoints: [
      "The DOUBLE-LINE SIGN on T2 (inner bright granulation tissue + outer dark sclerosis) is pathognomonic for osteonecrosis and distinguishes AVN from transient bone-marrow edema, which lacks it.",
      "The single most important thing to determine is COLLAPSE: pre-collapse (no subchondral crescent, congruent surface) vs post-collapse (subchondral fracture/crescent, flattening). This is the management hinge.",
      "Management/disposition pearl: PRE-collapse AVN is the window for joint-preserving surgery (e.g., core decompression) - refer promptly. But efficacy is lesion-size dependent (best in small/medium lesions); large lesions involving the lateral weight-bearing pillar do poorly and may head toward arthroplasty even pre-collapse. Once the head collapses, the conversation shifts toward arthroplasty. Time and size both matter.",
      "Use ARCO staging to communicate: stage I (MRI-only changes, e.g. the double-line sign; radiograph normal), II (radiographic sclerosis/cysts, still pre-collapse), III (subchondral crescent/collapse), IV (secondary OA).",
      "Pitfall: AVN is bilateral in a large fraction of cases, especially steroid- and alcohol-associated - always image and explicitly comment on the contralateral hip, which may be asymptomatic but early and salvageable.",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Confirm T1 and fluid-sensitive (T2 FS/STIR) sequences in coronal and sagittal planes", "Clinical question is atraumatic groin pain with steroid exposure - AVN must be excluded", "Confirm BOTH hips are imaged (or recommend it) - osteonecrosis is frequently bilateral"] },
      { step: 2, stepName: "Bones, Marrow & Stress Injury", expectedFindings: ["Geographic serpiginous anterosuperior subchondral lesion with double-line sign on T2", "Necrotic segment retains fat signal on T1 with a reactive peripheral interface", "Reactive marrow edema in the neck; NO discrete tension-side stress line"] },
      { step: 3, stepName: "Cartilage, Joint Surface & Effusion", expectedFindings: ["Critically assess for subchondral crescent/fracture line - ABSENT here (pre-collapse)", "Articular surface remains congruent without flattening", "Small effusion; cartilage preserved"] },
      { step: 4, stepName: "Labrum & FAI Morphology", expectedFindings: ["Labrum intact", "No FAI morphology", "Exclude a labral/mechanical alternative explanation"] },
      { step: 5, stepName: "Abductors, Lateral & Posterior Soft Tissue", expectedFindings: ["Abductor tendons and lateral soft tissues normal", "No bursitis", "Posterior structures normal"] },
      { step: 6, stepName: "Flexors, Adductors & Pubic Symphysis", expectedFindings: ["Flexor and adductor origins normal", "Pubic symphysis normal", "No competing soft-tissue cause"] },
      { step: 7, stepName: "Don't-Miss & Final Management Review", expectedFindings: ["Explicitly state PRE- vs POST-collapse status and assign an ARCO stage", "Estimate lesion size (collapse risk and core-decompression success depend on it)", "Don't-miss: evaluate and report the contralateral hip; disposition is prompt orthopedic referral while the joint is still preservable"] },
    ],
    teachingImages: [
      {
        src: "/images/teaching/cases/hip-avn/avn-coronal-t1.jpg",
        alt: "Bilateral femoral head avascular necrosis on coronal T1 MRI",
        caption:
          "Coronal T1 — bilateral femoral-head AVN: a serpiginous reactive interface (arrows) demarcates the necrotic anterosuperior segment; the heads remain spherical (pre-collapse). On T2 this interface is the double-line sign.",
        attribution: "Kalekar et al., Cureus 2024;16(9):e68888, Fig 3. PMC11458061. CC BY 4.0.",
        step: 2,
      },
    ],
  },
  {
    id: "hip-gluteus-medius-tear-gtps",
    title: "Gluteus Medius/Minimus Tendinopathy and Tear (Greater Trochanteric Pain Syndrome)",
    difficulty: "foundational",
    tier: "core",
    residentVisible: true,
    clinicalScenario:
      "A 58-year-old recreational walker reports chronic lateral hip pain that is worst lying on the affected side at night and with single-leg stance. Exam shows point tenderness over the greater trochanter, a positive single-leg stance (Trendelenburg) test, and pain with resisted abduction.",
    keyDiagnoses: [
      "Gluteus medius and minimus tendinopathy",
      "Gluteus medius footprint partial-thickness (undersurface) tear",
      "Greater trochanteric pain syndrome (GTPS) with trochanteric bursitis",
    ],
    tags: ["gluteus-medius-tear", "gtps", "abductor-tendinopathy", "trochanteric-bursitis", "rehab-first", "lateral-hip-pain"],
    radiopaediaUrl: "https://radiopaedia.org/search?lang=us&scope=cases&q=gluteus%20medius%20tendon%20tear",
    radiopaediaTitle: "Gluteus medius tear (GTPS) — Radiopaedia cases",
    modelReport: {
      findings:
        "PROTOCOL: Non-contrast hip MRI with attention to the greater trochanter; coronal and axial fluid-sensitive (T2 FS/STIR) and T1 sequences. Clinical question: cause of lateral hip pain with abductor weakness.\n\nBONES & MARROW: Mild reactive marrow edema and small enthesophytes at the greater trochanteric facets. Femoral head/neck normal; no stress fracture or AVN.\n\nJOINT & CARTILAGE: No significant intra-articular effusion. Articular cartilage preserved. Findings are extra-articular and lateralized.\n\nLABRUM: Acetabular labrum intact - no intra-articular source to explain lateral pain.\n\nCAPSULE/LIGAMENTS: Capsule normal.\n\nTENDONS/MUSCLES (ABDUCTORS - key region): Gluteus minimus tendon shows tendinopathy with increased intrasubstance signal at its insertion on the anterior facet. The gluteus medius tendon demonstrates tendinosis with a focal UNDERSURFACE (partial-thickness) tear at the lateral facet footprint; fluid signal undercuts the tendon but the tendon is NOT fully detached and there is NO retraction. T2-hyperintense fluid distends the trochanteric (subgluteus maximus) bursa. There is mild fatty infiltration of the gluteus minimus but the gluteus medius muscle belly is preserved without significant atrophy or fatty replacement.\n\nOTHER SOFT TISSUE: Iliotibial band normal. Hamstring origin, adductors, and flexors unremarkable.",
      impression:
        "1. Gluteus medius and minimus tendinopathy with a PARTIAL-THICKNESS (undersurface) gluteus medius footprint tear - NOT full-thickness and NOT retracted.\n2. Trochanteric (subgluteus maximus) bursitis - consistent with greater trochanteric pain syndrome.\n3. Preserved abductor muscle bulk without significant fatty atrophy.\n4. Picture is amenable to a REHAB-FIRST approach: load management and progressive abductor strengthening are first-line, with an image-guided peritendinous/bursal corticosteroid or PRP injection reserved as an adjunct for refractory pain. There is NO full-thickness retracted tear and NO advanced fatty atrophy to mandate surgical referral at this time.",
    },
    teachingPoints: [
      "GTPS is the 'rotator cuff of the hip' - the abductor footprint (gluteus medius/minimus on the greater trochanter facets) is where tendinopathy and tears live; the trochanteric bursitis is usually secondary, not the primary driver.",
      "The management hinge is tear depth and retraction PLUS muscle quality: tendinopathy and partial/undersurface tears are REHAB-first (load management, progressive abductor strengthening). Injection is an adjunct, not the headline - and repeated peritendinous steroid can degrade tendon, so use it judiciously.",
      "Management/disposition pearl: a FULL-THICKNESS, RETRACTED abductor tear - especially with gluteal fatty atrophy (Goutallier/fatty infiltration) - shifts management from rehab/injection to surgical (orthopedic) referral for repair, because retracted, fatty-degenerated tendon is the point of diminishing surgical return. Always grade tear thickness, retraction, AND muscle fatty infiltration explicitly.",
      "Pitfall: lateral hip pain is frequently mislabeled as 'just bursitis.' The bursa fluid is often a red herring; look hard at the tendons - missing an abductor tear changes the treatment plan.",
      "Pitfall: localize the pain source. GTPS is extra-articular and lateralized; do not confuse it with intra-articular FAI/labral pain (deep groin, C-sign) OR with referred pain from lumbar (L4-L5) radiculopathy - a positive resisted-abduction and single-leg-stance test points to the abductors, not the spine.",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Confirm coronal and axial fluid-sensitive sequences with coverage of the greater trochanter", "Clinical question is lateral hip pain with abductor weakness, not deep groin pain", "Recognize this is an extra-articular/lateral problem to focus the search"] },
      { step: 2, stepName: "Bones, Marrow & Stress Injury", expectedFindings: ["Reactive marrow edema and enthesophytes at the greater trochanteric facets", "Normal femoral head/neck - no stress fracture or AVN", "No intraosseous lesion to explain symptoms"] },
      { step: 3, stepName: "Cartilage, Joint Surface & Effusion", expectedFindings: ["No significant intra-articular effusion", "Cartilage preserved - findings are extra-articular", "Reinforces a lateral rather than intra-articular source"] },
      { step: 4, stepName: "Labrum & FAI Morphology", expectedFindings: ["Labrum intact", "No FAI morphology", "Excludes a competing intra-articular pain generator"] },
      { step: 5, stepName: "Abductors, Lateral & Posterior Soft Tissue", expectedFindings: ["Gluteus minimus insertional tendinopathy at the anterior facet", "Gluteus medius undersurface (partial-thickness) footprint tear, NOT retracted", "Trochanteric bursal fluid; grade gluteal muscle bulk/fatty atrophy (key for the surgical decision)"] },
      { step: 6, stepName: "Flexors, Adductors & Pubic Symphysis", expectedFindings: ["Flexor and adductor origins normal", "Pubic symphysis normal", "No additional pain generator"] },
      { step: 7, stepName: "Don't-Miss & Final Management Review", expectedFindings: ["Explicitly grade tear thickness, retraction, AND muscle fatty infiltration", "Don't-miss: a full-thickness retracted tear with fatty atrophy converts this to a surgical referral", "Disposition here: rehab-first (load management + abductor strengthening) with image-guided injection as an adjunct only"] },
    ],
    teachingImages: [
      {
        src: "/images/teaching/cases/hip-gluteus/gluteus-footprint-tear.jpg",
        alt: "Abductor (gluteus minimus) tendon footprint tear on coronal T2 fat-saturated MRI",
        caption:
          "Coronal T2 FS — fluid-bright signal undercutting the abductor (here gluteus minimus) tendon at its greater-trochanter footprint (arrowhead) with peritrochanteric bursal fluid: the footprint tear of greater trochanteric pain syndrome.",
        attribution: "Bajuri et al., Cureus 2022;14(3):e23056, Fig 2. PMC8994867. CC BY.",
        step: 5,
      },
    ],
  },
  {
    id: "hip-proximal-hamstring-avulsion",
    title: "Proximal Hamstring Origin Tear/Avulsion at the Ischial Tuberosity",
    difficulty: "intermediate",
    tier: "core",
    residentVisible: true,
    clinicalScenario:
      "A 46-year-old masters water-skier felt a sudden 'pop' and tearing in the buttock during a forced hip-flexion/knee-extension load, followed by inability to sprint and difficulty sitting. Exam shows posterior thigh ecchymosis, tenderness at the ischial tuberosity, and weak resisted knee flexion.",
    keyDiagnoses: [
      "Proximal hamstring origin tear/avulsion at the ischial tuberosity",
      "Complete (3-tendon) conjoint avulsion with retraction",
      "Sciatic nerve proximity/contact (no transection)",
    ],
    tags: ["proximal-hamstring-avulsion", "ischial-tuberosity", "tendon-retraction", "surgical-referral", "sciatic-nerve", "posterior-thigh"],
    radiopaediaUrl: "https://radiopaedia.org/search?lang=us&scope=cases&q=proximal%20hamstring%20avulsion",
    radiopaediaTitle: "Proximal hamstring avulsion — Radiopaedia cases",
    modelReport: {
      findings:
        "PROTOCOL: Non-contrast hip/pelvis MRI with fluid-sensitive (STIR/T2 FS) axial and coronal/sagittal sequences covering the ischial tuberosities and proximal thighs. Clinical question: acute proximal hamstring injury with mechanical pop.\n\nBONES & MARROW: Reactive marrow edema at the ischial tuberosity at the hamstring origin. No discrete bony avulsion fragment in this adult (apophysis fused). Femoral neck normal.\n\nJOINT & CARTILAGE: Hip joint unremarkable; no effusion. Cartilage preserved.\n\nLABRUM: Acetabular labrum intact - not the source of pain.\n\nCAPSULE/LIGAMENTS: Normal.\n\nTENDONS/MUSCLES (HAMSTRING ORIGIN - key region): The conjoint tendon of the semitendinosus/long head of biceps femoris and the semimembranosus tendon are torn off the ischial tuberosity. This is a complete (all THREE-tendon / conjoint + semimembranosus) avulsion. The torn stump is retracted approximately 3 cm distally with an intervening fluid-filled gap and hematoma. The sciatic nerve lies immediately adjacent to the retracted stump/hematoma (contacts but is in continuity; no transection). Surrounding muscle edema and feathery hemorrhage in the proximal hamstring bellies.\n\nOTHER SOFT TISSUE: Abductors, adductors, and flexors otherwise intact.",
      impression:
        "1. COMPLETE proximal hamstring avulsion at the ischial tuberosity - all three tendons (conjoint + semimembranosus) torn with approximately 3 cm of retraction.\n2. Adjacent ischial marrow edema and proximal hamstring hematoma; sciatic nerve in close contact with the retracted stump but in continuity.\n3. Tendon number (3) and retraction (~3 cm) meet thresholds for SURGICAL referral - recommend prompt orthopedic/sports-surgery evaluation for primary repair, which is time-sensitive in the acute setting.",
    },
    teachingPoints: [
      "Quantify two things at the hamstring origin: the NUMBER of tendons torn (semimembranosus + conjoint semitendinosus/long-head biceps = up to 3) and the amount of RETRACTION (measure in cm).",
      "Management/disposition pearl: a complete (2–3 tendon) proximal hamstring avulsion with significant retraction (≥2 cm) triggers surgical referral for primary repair; partial or single-tendon injuries are typically managed conservatively (rehab). Report tendon count AND retraction explicitly — both drive the decision. Acute repair is time-sensitive, so do not delay the report or the referral.",
      "Pitfall: in skeletally immature athletes the injury is often an apophyseal AVULSION FRACTURE of the ischial tuberosity rather than a pure tendon tear - look for a displaced bony fragment and a different (often nonoperative-vs-operative by displacement) decision tree.",
      "Always comment on the SCIATIC NERVE: proximity to the retracted stump and hematoma matters for symptoms and for surgical planning; chronic scarring can tether the nerve.",
      "Pitfall: a partially torn but non-retracted tendon (free margin still apposed to the tuberosity) is a different, usually nonoperative entity - do not overcall retraction; measure it on the sagittal/coronal plane.",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Confirm coverage of ischial tuberosities and proximal thighs on fluid-sensitive sequences", "Clinical question is acute proximal hamstring injury after a pop", "Ensure a sagittal/long-axis plane is available to measure retraction"] },
      { step: 2, stepName: "Bones, Marrow & Stress Injury", expectedFindings: ["Reactive marrow edema at the ischial tuberosity hamstring origin", "In adults, no bony avulsion fragment (fused apophysis) - in youth, look for an apophyseal avulsion fracture", "Femoral neck normal"] },
      { step: 3, stepName: "Cartilage, Joint Surface & Effusion", expectedFindings: ["Hip joint unremarkable, no effusion", "Cartilage preserved", "Confirms an extra-articular posterior process"] },
      { step: 4, stepName: "Labrum & FAI Morphology", expectedFindings: ["Labrum intact", "No FAI morphology", "Excludes intra-articular pain source"] },
      { step: 5, stepName: "Abductors, Lateral & Posterior Soft Tissue", expectedFindings: ["Complete 3-tendon proximal hamstring avulsion with ~3 cm retraction - the key finding", "Hematoma in the retraction gap and proximal hamstring muscle edema", "Sciatic nerve in close contact with the retracted stump but in continuity"] },
      { step: 6, stepName: "Flexors, Adductors & Pubic Symphysis", expectedFindings: ["Adductor and flexor origins intact", "Pubic symphysis normal", "No competing groin pathology"] },
      { step: 7, stepName: "Don't-Miss & Final Management Review", expectedFindings: ["State tendon count and retraction distance explicitly - these drive the surgical decision", "Don't-miss: comment on sciatic nerve relationship and (in youth) apophyseal avulsion", "Disposition: prompt surgical referral; acute primary repair is time-sensitive"] },
    ],
    teachingImages: [
      {
        src: "/images/teaching/cases/hip-hamstring/hamstring-avulsion-gap.jpg",
        alt: "Proximal hamstring avulsion with retraction gap on coronal fat-suppressed MRI",
        caption:
          "Coronal fat-suppressed MRI — the proximal hamstring tendons are avulsed from the ischial tuberosity and retracted distally with a measurable gap (here ~7 cm). Tendon count and a retraction gap of this size drive surgical referral.",
        attribution: "Gali et al., Cureus 2025;17(10):e93722, Fig 1. PMC12579506. CC BY 4.0.",
        step: 5,
      },
    ],
  },
  {
    id: "hip-athletic-pubalgia",
    title: "Athletic Pubalgia / Core-Muscle Injury (Rectus Abdominis-Adductor Aponeurosis, Secondary Cleft Sign)",
    difficulty: "intermediate",
    tier: "core",
    residentVisible: true,
    clinicalScenario:
      "A 29-year-old male soccer midfielder reports several months of exertional lower-abdominal and groin pain provoked by cutting, kicking, and sit-ups, with relief at rest. Exam shows tenderness at the pubic tubercle/rectus insertion and pain on resisted hip adduction and resisted sit-up; there is no inguinal hernia bulge.",
    keyDiagnoses: [
      "Athletic pubalgia / core-muscle injury (rectus abdominis-adductor longus aponeurosis disruption)",
      "Adductor longus origin tendinopathy/microtearing",
      "Secondary cleft sign at the pubic symphysis",
      "Pubic symphyseal stress reaction (osteitis pubis spectrum)",
    ],
    tags: ["athletic-pubalgia", "core-muscle-injury", "secondary-cleft-sign", "adductor-aponeurosis", "rehab-first", "groin-pain"],
    radiopaediaUrl: "https://radiopaedia.org/search?lang=us&scope=cases&q=athletic%20pubalgia",
    radiopaediaTitle: "Athletic pubalgia — Radiopaedia cases",
    modelReport: {
      findings:
        "PROTOCOL: Dedicated pubic symphysis / athletic-pubalgia protocol on non-contrast MRI: large field-of-view coronal/axial-oblique fluid-sensitive sequences centered at the symphysis with thin sections through the rectus-adductor aponeurosis. Clinical question: exertional groin/lower-abdominal pain in a kicking athlete.\n\nBONES & MARROW: Subchondral marrow edema and mild irregularity at the pubic symphyseal margins consistent with symphyseal stress reaction (osteitis pubis spectrum). Femoral heads/necks normal; no stress fracture.\n\nJOINT & CARTILAGE (HIP): Hip joints unremarkable - no effusion, cartilage preserved. The intra-articular hip is NOT the source.\n\nLABRUM: Acetabular labrum intact bilaterally.\n\nPUBIC SYMPHYSIS & APONEUROSIS (key region): There is detachment/disruption at the common rectus abdominis-adductor longus aponeurosis at its insertion on the anteroinferior pubis on the symptomatic side, with adjacent edema. A SECONDARY CLEFT SIGN is present - a curvilinear fluid cleft extending inferolaterally from the primary symphyseal cleft along the undersurface of the pubis toward the adductor/aponeurosis attachment, indicating microtearing at the enthesis. The adductor longus origin shows tendinosis with partial microtearing; it is NOT a full-thickness avulsion and is not retracted.\n\nTENDONS/MUSCLES: Rectus abdominis lower fibers edematous near the insertion. Iliopsoas, abductors, and hamstring origins normal. No inguinal/femoral hernia or focal fascial defect demonstrated.",
      impression:
        "1. Athletic pubalgia / core-muscle injury: disruption of the rectus abdominis-adductor longus aponeurosis with a SECONDARY CLEFT SIGN and adductor longus origin tendinosis/microtearing on the symptomatic side.\n2. Pubic symphyseal stress reaction (osteitis pubis spectrum).\n3. No full-thickness adductor avulsion/retraction and no intra-articular hip or labral pathology to explain symptoms.\n4. This is an extra-articular core-muscle injury - REHAB-FIRST (activity modification, structured core/adductor rehabilitation); image-guided injection and surgical/core-repair consultation reserved for refractory cases.",
    },
    teachingPoints: [
      "Athletic pubalgia is an injury of the rectus abdominis-adductor longus APONEUROSIS at the pubis - it is NOT a true hernia and not intra-articular. The classic MRI clue is the SECONDARY CLEFT SIGN: a fluid cleft tracking inferolaterally off the symphysis toward the aponeurotic attachment.",
      "The critical clinical job is to DISTINGUISH this extra-articular pubic source from intra-articular/labral hip pain - they are managed completely differently. A diagnostic intra-articular anesthetic injection can help arbitrate when the picture is mixed.",
      "Management/disposition pearl: athletic pubalgia is REHAB-first (progressive core and adductor strengthening, load management); image-guided injection and surgical core repair / adductor tenotomy are reserved for cases refractory to a dedicated rehab program.",
      "Pitfall: do not overcall a competing diagnosis - many of these athletes also have asymptomatic cam morphology or symphyseal edema on MRI; concordance with the focal aponeurotic injury and exam is what matters.",
      "Look for and grade the adductor longus origin: a full-thickness, RETRACTED adductor avulsion is a different, more surgical entity than the microtearing/tendinosis seen in athletic pubalgia.",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Confirm a dedicated pubic symphysis / athletic-pubalgia protocol centered on the symphysis and aponeurosis", "Clinical question is exertional groin/lower-abdominal pain in a kicking athlete", "Ensure thin fluid-sensitive sections through the rectus-adductor aponeurosis"] },
      { step: 2, stepName: "Bones, Marrow & Stress Injury", expectedFindings: ["Pubic symphyseal subchondral marrow edema/irregularity (osteitis pubis spectrum)", "Normal femoral heads/necks - no stress fracture", "Mild symphyseal degenerative change"] },
      { step: 3, stepName: "Cartilage, Joint Surface & Effusion", expectedFindings: ["Hip joints unremarkable with no effusion", "Cartilage preserved - intra-articular hip is not the source", "Reinforces an extra-articular pubic process"] },
      { step: 4, stepName: "Labrum & FAI Morphology", expectedFindings: ["Acetabular labrum intact bilaterally", "Note any incidental cam morphology but do not over-attribute symptoms to it", "Distinguish this extra-articular source from intra-articular/labral pain"] },
      { step: 5, stepName: "Abductors, Lateral & Posterior Soft Tissue", expectedFindings: ["Abductors and hamstring origins normal", "No posterior or lateral soft-tissue pain generator", "Focus stays anterior/medial"] },
      { step: 6, stepName: "Flexors, Adductors & Pubic Symphysis", expectedFindings: ["Rectus abdominis-adductor longus aponeurosis disruption with SECONDARY CLEFT SIGN - the key finding", "Adductor longus origin tendinosis/microtearing, NOT a retracted full-thickness avulsion", "Lower rectus abdominis edema near the insertion"] },
      { step: 7, stepName: "Don't-Miss & Final Management Review", expectedFindings: ["Don't-miss: exclude an inguinal/femoral hernia and a retracted adductor avulsion", "Confirm the injury is extra-articular and concordant with exam", "Disposition: rehab-first; injection/core repair only if refractory"] },
    ],
  },
  {
    id: "hip-transient-bme-vs-sifk",
    title: "Transient Bone-Marrow-Edema Syndrome vs Subchondral Insufficiency Fracture of the Femoral Head",
    difficulty: "advanced",
    tier: "advanced",
    residentVisible: false,
    clinicalScenario:
      "A 52-year-old woman with no trauma presents with several weeks of progressive, weight-bearing groin pain and a markedly antalgic gait; she has osteopenia risk factors. Radiographs are normal or show only subtle osteopenia. The clinical question is whether her diffuse femoral head edema represents benign transient bone-marrow-edema syndrome or a subchondral insufficiency fracture at risk of collapse.",
    keyDiagnoses: [
      "Subchondral insufficiency fracture of the femoral head (SIFK)",
      "Transient bone-marrow-edema syndrome (the key differential)",
      "Avascular necrosis (excluded - no double-line sign)",
    ],
    tags: ["subchondral-insufficiency-fracture", "transient-bone-marrow-edema", "collapse-risk", "protected-weight-bearing", "referral", "femoral-head-edema"],
    radiopaediaUrl: "https://radiopaedia.org/search?lang=us&scope=cases&q=subchondral%20insufficiency%20fracture%20femoral%20head",
    radiopaediaTitle: "Subchondral insufficiency fracture / transient BME — Radiopaedia cases",
    modelReport: {
      findings:
        "PROTOCOL: Non-contrast hip MRI with high-resolution T1 and fluid-sensitive (T2 FS/STIR) coronal and sagittal sequences. Clinical question: differentiate transient bone-marrow-edema syndrome from subchondral insufficiency fracture.\n\nBONES & MARROW: There is DIFFUSE marrow edema throughout the femoral head extending into the neck (high T2/STIR, low T1). Within the subchondral weight-bearing anterosuperior femoral head there is a focal, low-signal, irregular SUBCHONDRAL FRACTURE LINE paralleling the articular surface, with a small adjacent focus of subchondral hypointensity/marrow signal abnormality. There is NO serpiginous double-line sign and NO well-demarcated necrotic segment (arguing against AVN).\n\nJOINT & CARTILAGE: Moderate reactive joint effusion. Overlying articular cartilage is preserved; assess closely for early subchondral surface flattening - the cortex remains essentially congruent at this time, but there is incipient subchondral involvement.\n\nLABRUM: Acetabular labrum intact.\n\nCAPSULE/LIGAMENTS: Capsule distended by effusion; ligamentum teres normal.\n\nTENDONS/MUSCLES: Periarticular tendons and muscles unremarkable.",
      impression:
        "1. Diffuse femoral head/neck marrow edema with a focal SUBCHONDRAL FRACTURE LINE - findings indicate SUBCHONDRAL INSUFFICIENCY FRACTURE (SIFK), NOT benign transient bone-marrow-edema syndrome.\n2. The presence of the subchondral fracture line places the head at RISK FOR COLLAPSE - this is the management-defining feature distinguishing SIFK from self-limiting transient BME.\n3. No double-line sign or demarcated necrotic segment to suggest classic AVN.\n4. Recommend PROTECTED (reduced) weight-bearing and prompt orthopedic referral; correlate with bone-density evaluation given likely insufficiency etiology. Short-interval follow-up MRI to assess for progression/collapse.",
    },
    teachingPoints: [
      "Both transient bone-marrow-edema syndrome and SIFK show diffuse femoral head edema - the DISCRIMINATOR is the subchondral fracture LINE. Transient BME has edema WITHOUT a subchondral fracture line or double-line and is self-limiting; SIFK has a subchondral fracture line and risks collapse.",
      "Management/disposition pearl: transient BME syndrome is benign and self-limiting (protected weight-bearing, time, symptomatic care). SIFK is a structural fracture at risk of collapse - it needs protected weight-bearing, orthopedic referral, and short-interval follow-up to detect progression.",
      "Distinguish both from AVN: AVN has the serpiginous DOUBLE-LINE sign and a demarcated necrotic segment; transient BME and SIFK do not. Calling AVN incorrectly changes the entire prognosis conversation.",
      "Pitfall: the most dangerous error is over-reading diffuse edema as 'just transient BME' and missing the subtle low-signal subchondral fracture line of SIFK - scrutinize the anterosuperior subchondral region on every plane and on T1.",
      "SIFK is an INSUFFICIENCY fracture - look for and recommend workup of the underlying bone-quality problem (osteoporosis/osteopenia, vitamin D); the fracture is a marker of fragile bone.",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Confirm high-resolution T1 and fluid-sensitive coronal/sagittal sequences", "Clinical question is transient BME vs SIFK in an atraumatic painful hip", "Recognize the discriminator will be presence/absence of a subchondral fracture line"] },
      { step: 2, stepName: "Bones, Marrow & Stress Injury", expectedFindings: ["Diffuse femoral head/neck marrow edema (low T1, high STIR)", "Focal low-signal SUBCHONDRAL FRACTURE LINE in the anterosuperior weight-bearing head - the key finding making this SIFK", "No serpiginous double-line and no demarcated necrotic segment (against AVN)"] },
      { step: 3, stepName: "Cartilage, Joint Surface & Effusion", expectedFindings: ["Moderate reactive joint effusion", "Scrutinize the subchondral cortex for early flattening/collapse - currently congruent but at risk", "Cartilage preserved"] },
      { step: 4, stepName: "Labrum & FAI Morphology", expectedFindings: ["Labrum intact", "No FAI morphology", "Exclude a mechanical/labral alternative explanation"] },
      { step: 5, stepName: "Abductors, Lateral & Posterior Soft Tissue", expectedFindings: ["Abductor tendons and lateral soft tissues normal", "No bursitis", "Posterior structures normal"] },
      { step: 6, stepName: "Flexors, Adductors & Pubic Symphysis", expectedFindings: ["Flexor and adductor origins normal", "Pubic symphysis normal", "No competing extra-articular pain source"] },
      { step: 7, stepName: "Don't-Miss & Final Management Review", expectedFindings: ["Don't-miss: the subtle subchondral fracture line that converts benign transient BME into collapse-prone SIFK", "State collapse risk and recommend protected weight-bearing plus short-interval follow-up", "Disposition: orthopedic referral and bone-density/insufficiency workup"] },
    ],
    teachingImages: [
      {
        src: "/images/teaching/cases/hip-bme-sifk/transient-bme.jpg",
        alt: "Transient bone marrow edema of the femoral head on axial fat-suppressed MRI",
        caption:
          "Axial fat-suppressed MRI — diffuse marrow edema throughout the left femoral head (arrow) with NO subchondral fracture line: transient bone-marrow-edema syndrome, which is self-limiting.",
        attribution: "Abu-Nayla et al., Cureus 2024;16(12):e75571, Fig 2. PMC11724217. CC BY 4.0.",
        step: 2,
      },
      {
        src: "/images/teaching/cases/hip-bme-sifk/sifk-subchondral-line.jpg",
        alt: "Subchondral insufficiency fracture of the femoral head on coronal fat-suppressed MRI",
        caption:
          "Coronal fat-suppressed MRI — diffuse left femoral-head marrow edema WITH a subchondral low-signal fracture line paralleling the articular surface (arrow): subchondral insufficiency fracture (SIFK), which risks collapse (right hip normal). The fracture line is what separates SIFK from transient BME.",
        attribution: "Ghate & Samant, J Orthop Case Rep 2012;2(2):7-9, Fig 2. PMC4719180. CC BY-NC-SA 3.0.",
        step: 2,
      },
    ],
  },
  {
    id: "hip-pincer-fai-retroversion",
    title: "Pincer-Type FAI with Acetabular Retroversion/Over-Coverage and Contrecoup Posteroinferior Chondral Injury",
    difficulty: "advanced",
    tier: "advanced",
    residentVisible: false,
    clinicalScenario:
      "A 34-year-old female recreational dancer/yoga instructor reports anterior groin pain at the extremes of hip flexion and external rotation, with mechanical catching. FADIR is positive; radiographs show a crossover sign and a prominent ischial spine. The clinical question is FAI subtype and its chondral consequences.",
    keyDiagnoses: [
      "Pincer-type femoroacetabular impingement (acetabular retroversion/over-coverage)",
      "Anterosuperior labral degeneration/intrasubstance tear (crushed labrum)",
      "Contrecoup POSTEROINFERIOR acetabular chondral injury",
    ],
    tags: ["pincer-fai", "acetabular-retroversion", "crossover-sign", "contrecoup-chondral-injury", "referral", "groin-pain"],
    radiopaediaUrl: "https://radiopaedia.org/search?lang=us&scope=cases&q=pincer%20femoroacetabular%20impingement",
    radiopaediaTitle: "Pincer FAI / acetabular retroversion — Radiopaedia cases",
    modelReport: {
      findings:
        "PROTOCOL: Non-contrast 3T hip MRI with oblique-axial sequences and radial reformats; assessment of acetabular version and coverage. Clinical question: FAI subtype and chondral status in an athlete with impingement at flexion/external rotation.\n\nBONES & MARROW: Femoral head-neck junction shows a NORMAL concave waist - alpha angle measures 44 degrees (no cam morphology). The acetabulum demonstrates OVER-COVERAGE with focal cranial retroversion: there is a crossover configuration (anterior wall projecting lateral to the posterior wall cranially) and a prominent ischial spine sign. Lateral center-edge angle is increased at 42 degrees consistent with over-coverage/global pincer. No stress fracture or AVN.\n\nJOINT & CARTILAGE: Small effusion. Critically, there is focal chondral thinning/full-thickness loss at the POSTEROINFERIOR acetabulum with subchondral edema - the CONTRECOUP lesion - in addition to a narrow rim of anterosuperior chondral wear. Femoral head cartilage largely preserved.\n\nLABRUM: The anterosuperior labrum is degenerated, intrasubstance-torn, and appears 'crushed' between the over-covering rim and the femoral neck; small intralabral ossification/ganglion at the rim. Posteroinferior labrum is intact.\n\nFAI MORPHOLOGY: Pincer-type over-coverage with cranial acetabular retroversion (crossover and ischial-spine signs); alpha angle normal (no cam). Mixed picture is pincer-dominant.\n\nCAPSULE/LIGAMENTS: Iliofemoral ligament and capsule intact. Ligamentum teres normal.\n\nTENDONS/MUSCLES: Abductors, flexors, adductors, and hamstring origins normal.",
      impression:
        "1. PINCER-type femoroacetabular impingement: acetabular over-coverage with focal cranial RETROVERSION (crossover and prominent ischial-spine signs), increased lateral center-edge angle; alpha angle normal (no cam component).\n2. CONTRECOUP POSTEROINFERIOR acetabular chondral loss with subchondral edema - the characteristic pincer chondral pattern - plus anterosuperior labral 'crush' degeneration/tear.\n3. Findings concordant with flexion/external-rotation impingement symptoms; recommend hip-preservation (orthopedic) referral for evaluation of rim trimming/labral treatment, with attention to NOT over-resecting in a retroverted/over-covered acetabulum.",
    },
    teachingPoints: [
      "Pincer FAI is an ACETABULAR over-coverage/retroversion problem (crossover sign, prominent ischial spine, increased center-edge angle) - the femoral head-neck junction and alpha angle are typically NORMAL, unlike cam.",
      "The signature chondral lesion of pincer is CONTRECOUP - posteroinferior acetabular chondral injury - from the femoral head levering against the posterior rim when the anterior rim impinges. Always look posteroinferiorly, not just at the symptomatic anterior rim.",
      "Pincer characteristically 'CRUSHES' the labrum (intrasubstance degeneration, ganglia, rim ossification) rather than producing the clean detachment-type tear of cam - the labral appearance differs by subtype.",
      "Management/disposition pearl: symptomatic pincer FAI with chondrolabral injury warrants hip-preservation referral. The surgical nuance is that over-resection of a retroverted/over-covered rim risks iatrogenic instability/dysplasia - so report version and coverage carefully to guide the surgeon.",
      "Pitfall: do not stop at the cam checklist. Measure acetabular version/coverage and inspect the posteroinferior cartilage; many real-world cases are MIXED cam-pincer, and missing the pincer component or the contrecoup lesion understages the disease.",
    ],
    searchPatternFindings: [
      { step: 1, stepName: "Verify Protocol & Clinical Question", expectedFindings: ["Confirm oblique-axial/radial sequences and the ability to assess acetabular version and coverage", "Clinical question is FAI subtype with impingement at flexion/external rotation", "Note radiographic crossover and ischial-spine signs to direct the search"] },
      { step: 2, stepName: "Bones, Marrow & Stress Injury", expectedFindings: ["NORMAL femoral head-neck concavity with alpha angle 44 degrees (no cam bump)", "Acetabular over-coverage with cranial retroversion (crossover, prominent ischial-spine sign)", "No stress fracture or AVN"] },
      { step: 3, stepName: "Cartilage, Joint Surface & Effusion", expectedFindings: ["CONTRECOUP posteroinferior acetabular chondral loss with subchondral edema - the key pincer lesion", "Narrow rim of anterosuperior chondral wear", "Small effusion; femoral cartilage largely preserved"] },
      { step: 4, stepName: "Labrum & FAI Morphology", expectedFindings: ["Anterosuperior labral 'crush' degeneration/intrasubstance tear with rim ossification/ganglion", "Increased lateral center-edge angle (42 degrees) confirming over-coverage; normal alpha angle (pincer, not cam)", "Posteroinferior labrum intact"] },
      { step: 5, stepName: "Abductors, Lateral & Posterior Soft Tissue", expectedFindings: ["Abductor tendons intact", "No lateral bursitis", "Posterior soft tissues normal (distinguish from the bony posteroinferior chondral lesion)"] },
      { step: 6, stepName: "Flexors, Adductors & Pubic Symphysis", expectedFindings: ["Flexor and adductor origins normal", "Pubic symphysis normal", "No competing extra-articular groin source"] },
      { step: 7, stepName: "Don't-Miss & Final Management Review", expectedFindings: ["Don't-miss: the contrecoup posteroinferior chondral lesion and the pincer component in a mixed picture", "Report acetabular version/coverage to guide rim management and avoid over-resection", "Disposition: hip-preservation orthopedic referral"] },
    ],
    teachingImages: [
      {
        src: "/images/teaching/cases/hip-pincer/pincer-retroversion.jpg",
        alt: "Acetabular retroversion on axial-oblique MRI (MRI crossover-sign equivalent)",
        caption:
          "Axial-oblique MRI through the superior acetabulum — the anterior acetabular rim (arrow) lies LATERAL to the posterior rim (arrowhead): acetabular retroversion/over-coverage, the MRI equivalent of the radiographic crossover sign in pincer FAI.",
        attribution: "Li et al., Insights Imaging 2016;7(2):187-198, Fig 5. PMC4805622. CC BY 4.0.",
        step: 4,
      },
    ],
  },
];
