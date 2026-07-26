/**
 * Interactive "master normal first" content for the Normal Hip MRI workstation.
 * Mirrors the knee/shoulder: each plane (keyed by its SERIES id in
 * NormalHipMriPage) has a Guided Tour, a Knowledge Check, "watch for" pearls,
 * and an anatomy + ultrasound correlate.
 *
 * Marker coordinates are PERCENTAGES of the displayed slice image (x = left,
 * y = top). sliceIndex is 0-based into that plane's stack (slice_01.jpg = index 0).
 *
 * Teaching notes + quiz keys were authored and MSK-radiologist–verified per plane.
 * The marker (x, y) positions are STARTER coordinates placed by eye on the real
 * slices — fine-tune them on the actual images via the Adjust (admin) workbench.
 */
import type {
  PlaneLearn,
  AdvancedQ,
  ImageCaqQ,
  CorrelationItem,
  StructureCorrelate,
  StructureReading,
} from "./normal-mri-types";

export type { PlaneLearn, AdvancedQ, ImageCaqQ, CorrelationItem, StructureCorrelate, StructureReading };

export const normalHipLearn: Record<string, PlaneLearn> = {
  // ───────────────────────────────────────────────────────────────────────
  // CORONAL T2 FS DIXON  (stack: normal-hip-coronal, 34 slices)
  // Large-FOV pelvis — both hips + sacrum + symphysis on one image. Water image:
  // fluid/edema bright, marrow fat dark. Scroll posterior → anterior. Femoral
  // heads / acetabula are mid-stack (~index 16–20); sacrum/SI posterior (~15).
  // ───────────────────────────────────────────────────────────────────────
  "cor-t2fs": {
    tour: [
      {
        sliceIndex: 19,
        markers: [],
        title: "Get oriented",
        note: "Coronal T2 FS Dixon, large field of view — both hips, the sacrum, and the pubic symphysis on one image. This is the Dixon WATER (fat-suppressed) image, so fluid and marrow edema are bright while normal fatty marrow is dark. Scroll posterior → anterior: SI joints and sacrum posteriorly, the femoral heads and acetabula through the mid slices, the symphysis anteriorly.",
      },
      {
        sliceIndex: 19,
        markers: [{ x: 72, y: 55, label: "Femoral head" }],
        title: "Femoral head",
        note: "On this coronal T2 FS Dixon the femoral head is the rounded epiphysis seated in the acetabulum; on the water (fat-suppressed) image its normal fatty marrow is uniformly dark because the marrow fat signal has been nulled. Confirm the head is spherical and that the marrow stays homogeneously low — coronal is your screening plane for the subchondral abnormalities of AVN and subchondral insufficiency fracture.",
      },
      {
        sliceIndex: 19,
        markers: [{ x: 70.5, y: 46, label: "Sourcil" }],
        title: "Acetabulum & sourcil",
        note: "The acetabulum is the cup of subchondral bone roofing the head; the sourcil is its dense superior weight-bearing roof, seen here as the low-signal subchondral plate over the head. Check that the sourcil marrow is dark and uniform and that the roof gives the head normal lateral coverage (lateral center-edge angle) — undercoverage suggests dysplasia, while excessive/retroverted over-coverage suggests pincer morphology that needs symptom and chondrolabral correlation.",
      },
      {
        sliceIndex: 19,
        markers: [{ x: 77, y: 47, label: "Labrum" }],
        title: "Acetabular labrum",
        note: "On coronal images the labrum is the small triangular low-signal fibrocartilage capping the superolateral acetabular rim. Normally it is uniformly dark with a sharp triangular apex — but the tear-prone zone is anterosuperior, so use dedicated small-field-of-view radial/oblique-axial imaging. High-quality 3-T MRI may be sufficient; direct MR arthrography is a selective problem-solving study when routine MRI is equivocal.",
      },
      {
        sliceIndex: 19,
        markers: [{ x: 69.5, y: 50, label: "Cartilage" }],
        title: "Articular cartilage",
        note: "The hyaline articular cartilage is the thin intermediate-signal layer between the dark subchondral cortex of the head and the acetabulum; at the hip the femoral and acetabular layers are usually inseparable as a single stripe. Trace it as smooth and uniform over the weight-bearing dome — the coronal plane lets you compare the superior joint-space cartilage side to side for focal loss.",
      },
      {
        sliceIndex: 19,
        markers: [{ x: 71, y: 63, label: "Femoral neck" }],
        title: "Femoral neck & head-neck junction",
        note: "The femoral neck connects head to trochanters; on this coronal slice assess the marrow signal and both cortices and follow the head-neck contour up to the junction. The tension (superolateral) side of the neck is the high-stakes location — it is where the dangerous stress fracture occurs — and the head-neck junction is also where you screen for AVN extension and (with the sagittal cam contour) FAI.",
      },
      {
        sliceIndex: 19,
        markers: [{ x: 88, y: 52, label: "Abductors" }],
        title: "Gluteus medius & minimus (abductors)",
        note: "On coronal images the gluteus medius and minimus sweep down to insert on the greater trochanter — the abductor 'rotator cuff of the hip,' best evaluated for footprint integrity in this plane. Confirm the tendons are dark and continuous onto the lateral and superoposterior trochanteric facets, with no fluid undercutting the footprint or peritrochanteric edema.",
      },
      {
        sliceIndex: 19,
        markers: [{ x: 85.5, y: 62, label: "Gr. trochanter" }],
        title: "Greater trochanter & trochanteric bursa",
        note: "On the coronal T2 FS Dixon, the greater trochanter is the lateral bony prominence of the proximal femur that serves as the footprint for the gluteus medius and minimus tendons (the hip's abductor 'rotator cuff'), with the trochanteric and subgluteus bursae normally collapsed and imperceptible just superficial to those tendons. You check it because this is the GTPS hot spot: peritrochanteric edema plus a footprint tendon defect distinguishes true abductor tendinopathy/tear from the loose label of 'trochanteric bursitis.'",
      },
      {
        sliceIndex: 19,
        markers: [{ x: 48, y: 77, label: "Symphysis" }],
        title: "Adductors & pubic symphysis",
        note: "Inferomedially on this large-FOV coronal, the adductor longus/brevis origins and the rectus abdominis–adductor aponeurosis converge on the pubis flanking the fibrocartilaginous pubic symphysis. Keep the symphysis marrow symmetric and the adductor origins dark and uniform — this aponeurosis is the athletic-pubalgia ('sports hernia'/core-muscle injury) hot spot.",
      },
      {
        sliceIndex: 15,
        markers: [{ x: 34, y: 45, label: "SI joint" }],
        title: "Sacrum & SI joint",
        note: "On the posterior coronal slices the sacrum sits in the midline with the sacroiliac joints articulating against the iliac bones bilaterally. Confirm symmetric, dark subchondral marrow across both SI joints and sacral alae — this is your screening plane for sacroiliitis and for the sacral/parasymphyseal insufficiency fractures that mimic hip or groin pain.",
      },
      {
        sliceIndex: 19,
        markers: [
          { x: 77, y: 47, label: "Labrum" },
          { x: 71, y: 63, label: "Femoral neck" },
          { x: 85.5, y: 62, label: "Trochanter / abductors" },
          { x: 48, y: 77, label: "Symphysis" },
        ],
        title: "Do-not-overcall checkpoint",
        note: "Before leaving the coronal stack, pause on the traps: cam or pincer morphology is not symptomatic FAI without concordant pain plus labral/cartilage injury; GTPS is usually abductor tendon disease, not bursal fluid alone; pubic marrow or aponeurotic signal can be seen in asymptomatic athletes; and any hip marrow edema deserves a deliberate AVN, femoral-neck stress, and subchondral-insufficiency screen.",
      },
    ],
    quiz: [
      {
        id: "hc-q1",
        sliceIndex: 19,
        marker: { x: 72, y: 55 },
        prompt: "On this coronal T2 FS Dixon image, what is the marked structure seated within the acetabulum?",
        options: ["Femoral head", "Greater trochanter", "Acetabular roof (sourcil)", "Femoral neck"],
        answer: 0,
        explanation:
          "The spherical epiphysis articulating within the acetabular cup is the femoral head, the surface you screen for AVN and subchondral insufficiency fracture of the femoral head (SIFFH). The greater trochanter is the lateral cortical prominence at the abductor footprint — well lateral to and below the joint, not seated within the acetabulum.",
      },
      {
        id: "hc-q2",
        sliceIndex: 19,
        marker: { x: 70.5, y: 46 },
        prompt: "The dense subchondral weight-bearing roof of the acetabulum marked here is best termed the:",
        options: ["Triradiate cartilage", "Sourcil (acetabular roof)", "Acetabular labrum", "Fovea capitis"],
        answer: 1,
        explanation:
          "The sclerotic superolateral weight-bearing roof of the acetabulum is the sourcil, the surface you assess for coverage and stress change. The acetabular labrum is the triangular fibrocartilage at the rim peripheral to the bony roof — a soft-tissue structure, not the bony subchondral plate.",
      },
      {
        id: "hc-q3",
        sliceIndex: 19,
        marker: { x: 77, y: 47 },
        prompt: "The small triangular low-signal structure capping the superolateral acetabular rim is the:",
        options: ["Ligamentum teres", "Transverse acetabular ligament", "Acetabular labrum", "Zona orbicularis"],
        answer: 2,
        explanation:
          "The triangular fibrocartilage seating on the bony rim and deepening the socket is the acetabular labrum. The anterosuperior segment is the most common tear site and should be assessed on dedicated small-field-of-view MRI, with direct MR arthrography reserved for selected equivocal cases. The transverse acetabular ligament bridges the inferior notch; the zona orbicularis is the capsular waist around the neck.",
      },
      {
        id: "hc-q4",
        sliceIndex: 19,
        marker: { x: 69.5, y: 50 },
        prompt: "The thin intermediate-signal layer marked between the femoral head cortex and the acetabular cortex represents the:",
        options: ["Joint effusion", "Hyaline articular cartilage", "Acetabular labrum", "Subchondral marrow"],
        answer: 1,
        explanation:
          "The smooth intermediate-signal stripe covering the bony surfaces is hyaline articular cartilage, scrutinized for focal chondral loss in FAI. A joint effusion would be bright fluid distending the capsule and recesses rather than a thin layer conforming to the subchondral cortex.",
      },
      {
        id: "hc-q5",
        sliceIndex: 19,
        marker: { x: 71, y: 63 },
        prompt: "The bony segment connecting the femoral head to the trochanters, marked here, is the:",
        options: ["Femoral neck", "Intertrochanteric line", "Acetabular column", "Femoral shaft"],
        answer: 0,
        explanation:
          "The segment between the head and the trochanteric region is the femoral neck, where you must clear the superolateral tension-side cortex for stress fracture. The intertrochanteric line lies distal to the neck between the greater and lesser trochanters, not the head-neck connecting segment marked here.",
      },
      {
        id: "hc-q6",
        sliceIndex: 19,
        marker: { x: 88, y: 52 },
        prompt: "The tendons marked inserting onto the greater trochanter — the abductor 'rotator cuff of the hip' — are the:",
        options: [
          "Iliopsoas and rectus femoris",
          "Gluteus medius and minimus",
          "Piriformis and obturator internus",
          "Tensor fasciae latae and sartorius",
        ],
        answer: 1,
        explanation:
          "The gluteus medius and minimus insert on the greater trochanter and are the hip abductor 'rotator cuff' implicated in GTPS. The iliopsoas inserts on the lesser trochanter (and rectus femoris arises anteriorly at the AIIS), so neither forms the greater-trochanteric abductor footprint marked here.",
      },
      {
        id: "hc-q7",
        sliceIndex: 19,
        marker: { x: 48, y: 77 },
        prompt: "The midline fibrocartilaginous joint marked inferiorly between the two pubic bones is the:",
        options: ["Sacroiliac joint", "Pubic symphysis", "Hip joint", "Iliopubic eminence"],
        answer: 1,
        explanation:
          "The midline fibrocartilaginous articulation between the pubic bones is the pubic symphysis, the focus of the athletic pubalgia workup with the adductor aponeurosis. The sacroiliac joint lies posterosuperiorly between the sacrum and ilium — a separate joint, not in this anterior midline location.",
      },
      {
        id: "hc-q8",
        // SI-joint marker kept in sync with the tour step (Codex moved the tour
        // marker to (34,45) but left this quiz at the old (40,45)).
        sliceIndex: 15,
        marker: { x: 34, y: 45 },
        prompt: "The paired articulations marked between the sacrum and the iliac bones on this posterior coronal slice are the:",
        options: ["Hip (femoroacetabular) joints", "Sacroiliac joints", "Pubic symphysis", "Lumbosacral facet joints"],
        answer: 1,
        explanation:
          "The articulations between the sacrum and the ilia are the sacroiliac joints, screened here for sacroiliitis and sacral insufficiency fracture. The femoroacetabular (hip) joints lie laterally between the femoral heads and acetabula — separate, more anterolateral joints not formed by the sacrum.",
      },
      {
        id: "hc-q9",
        sliceIndex: 19,
        marker: { x: 85.5, y: 62 },
        prompt: "On this coronal T2 FS Dixon image, the marked lateral bony prominence of the proximal femur — the footprint of the gluteus medius and minimus tendons — is which structure?",
        options: ["Greater trochanter", "Lesser trochanter", "Femoral head", "Iliac crest"],
        answer: 0,
        explanation:
          "The greater trochanter is the lateral proximal-femoral prominence and the abductor (gluteus medius/minimus) footprint, with the trochanteric/subgluteus bursae normally collapsed superficial to the tendons — the GTPS hot spot. The lesser trochanter is also a proximal-femoral apophysis but lies posteromedially as the iliopsoas insertion, not the lateral abductor footprint.",
      },
      // hc-q10…hc-q15 reuse the SAME faculty-reviewed coronal anchors as the
      // identification items above, but ask the reading question that hangs on
      // each landmark. Every item keeps a distinct correct answer so the two
      // checks at one anchor never render as the same question twice.
      {
        id: "hc-q10",
        sliceIndex: 19,
        marker: { x: 71, y: 63 },
        prompt:
          "A 19-year-old recruit has groin pain with running, and this femoral neck shows marrow edema with a low-signal line. Which cortex carries the high-risk, urgent-referral pattern?",
        options: [
          "The superolateral (tension) cortex",
          "The inferomedial (compression) cortex",
          "The posterior cortex at the intertrochanteric line",
          "Either cortex — the side does not affect management",
        ],
        answer: 0,
        explanation:
          "A fracture line touching the superolateral (tension) cortex is the high-risk pattern: it is prone to completion, displacement, and subsequent AVN, so it means non-weight-bearing and urgent orthopedic referral. The inferomedial (compression) cortex is the tempting answer because it is the more frequent site, but an incomplete compression-side line is the lower-risk pattern usually managed with protected weight-bearing and close review — which is exactly why the report must state WHICH cortex the line touches rather than just 'femoral neck stress fracture.'",
      },
      {
        id: "hc-q11",
        sliceIndex: 19,
        marker: { x: 72, y: 55 },
        prompt:
          "You are screening this femoral head marrow in a 58-year-old with osteopenia and acute atraumatic hip pain. Which finding most specifically indicates a subchondral insufficiency fracture (SIFFH) rather than AVN?",
        options: [
          "An irregular subchondral low-signal band paralleling the articular surface with surrounding edema",
          "A geographic serpiginous interface with a T2 double-line sign",
          "Diffuse homogeneous marrow edema extending into the neck with no discrete line",
          "A small well-corticated subcortical cyst at the anterosuperior head-neck junction",
        ],
        answer: 0,
        explanation:
          "SIFFH is defined by a structural fracture: an irregular subchondral low-signal band, often convex toward the articular surface, with surrounding marrow edema — and it carries real collapse risk, so it is offloaded and reviewed promptly. The double-line sign is the strongest distractor because it also sits subchondrally in a painful head, but it marks the demarcating interface of AVN (outer sclerotic rim, inner granulation line) rather than a fracture band. Diffuse edema with no discrete line is most consistent with transient bone-marrow-edema syndrome, but that remains a diagnosis of exclusion — early subchondral insufficiency fracture and early osteonecrosis can look identical before a line appears — so protect weight-bearing and re-image at short interval rather than reassure on one study. A corticated neck cyst is a benign herniation pit.",
      },
      {
        id: "hc-q12",
        sliceIndex: 19,
        marker: { x: 85.5, y: 62 },
        prompt:
          "A 62-year-old has lateral hip pain over this trochanter. Which finding best supports true abductor tendon disease rather than the loose label 'trochanteric bursitis'?",
        options: [
          "Tendon thickening and fluid signal at the gluteus medius/minimus footprint with peritrochanteric edema",
          "A thin sliver of fluid in the trochanteric bursa with a normal-looking footprint",
          "Normal fatty marrow signal within the greater trochanter",
          "A thin fluid layer in the anterior joint recess",
        ],
        answer: 0,
        explanation:
          "GTPS is usually abductor tendon disease, so the finding that carries weight is at the footprint itself: tendinosis or partial tearing on the trochanteric facets with surrounding peritrochanteric edema (and, when present, retraction or fatty atrophy). Isolated bursal fluid is the strongest distractor because it is what the historical label points at, but the trochanteric and subgluteus bursae can carry a small amount of fluid without being the pain generator — bursal fluid is a signpost to interrogate the tendons underneath, not a stand-alone diagnosis.",
      },
      {
        id: "hc-q13",
        sliceIndex: 19,
        marker: { x: 70.5, y: 46 },
        prompt:
          "On this Dixon WATER image a thin bright line with adjacent marrow signal appears beneath the marked acetabular roof. Which interpretation deserves the most consideration?",
        options: [
          "Subchondral stress response or insufficiency fracture of the weight-bearing roof",
          "Degenerative subchondral sclerosis, which is bright on the water image",
          "Normal fatty marrow, which is expected to be bright in this location",
          "The sourcil cannot be assessed on a fat-suppressed image",
        ],
        answer: 0,
        explanation:
          "On the water (fat-suppressed) image marrow fat is nulled and therefore dark, so bright subchondral signal under the sourcil is edema — in the weight-bearing roof that raises a stress response or insufficiency fracture, especially alongside a thin low-signal line. Sclerosis is the strongest distractor because it lives in exactly this location in a degenerative hip, but sclerotic bone is LOW signal on every sequence and cannot account for bright fluid-sensitive signal. Correlate with age, load history, and radiographs rather than committing from one image.",
      },
      {
        id: "hc-q14",
        sliceIndex: 19,
        marker: { x: 69.5, y: 50 },
        prompt:
          "You are tracing this acetabular cartilage for the chondral injury that accompanies FAI. Where does that damage characteristically sit?",
        options: [
          "The anterosuperior weight-bearing rim, at the chondrolabral junction",
          "The superomedial roof, medial to the supra-acetabular fossa",
          "The floor of the cotyloid (acetabular) fossa",
          "Uniformly around the entire circumference of the socket",
        ],
        answer: 0,
        explanation:
          "FAI-related chondral injury clusters where the impingement lands — the anterosuperior rim at the chondrolabral junction — which is why delamination there is the finding that weights management toward surgical referral. The superomedial roof is the tempting miss: the normal stellate lesion is a star-shaped bare area of absent cartilage sitting medial to the supra-acetabular fossa with clean margins and no marrow edema, so it looks like a defect without being one. The cotyloid fossa is non-articular (fat and ligamentum teres), and diffuse circumferential loss suggests osteoarthritis rather than focal impingement.",
      },
      {
        id: "hc-q15",
        sliceIndex: 15,
        marker: { x: 34, y: 45 },
        prompt:
          "You are screening these sacroiliac joints on the posterior coronal slices. Which finding best supports inflammatory sacroiliitis?",
        options: [
          "Periarticular subchondral marrow edema with erosive change",
          "Bilateral symmetric thin subchondral sclerosis without erosion",
          "An H-shaped band of sacral-ala marrow edema",
          "Bright signal within the sacral neural foramina",
        ],
        answer: 0,
        explanation:
          "True periarticular subchondral marrow edema — read together with erosions and the clinical picture — is what supports inflammatory sacroiliitis; the ASAS definition rests on clear subchondral bone-marrow edema in a typical periarticular location, not on which side it sits. Laterality is not the discriminator: established axial spondyloarthritis is classically bilateral and symmetric, and asymmetric or unilateral disease is more typical of psoriatic or reactive arthritis — but EARLY axSpA is itself often one-sided, so laterality alone neither confirms nor excludes it. What a strictly unilateral, severe pattern does demand is excluding INFECTION: in published series of unilateral sacroiliitis infection is the majority cause, favoured by severe marrow edema, joint-space widening, and intra-articular or peri-articular abscess. Bilateral symmetric sclerosis without erosion is the strongest distractor because it is also 'signal at the SI joints,' but it is a degenerative/mechanical pattern. The complete H (Honda) pattern — bilateral vertical sacral-ala bands bridged by a transverse component — is the classic sacral insufficiency-fracture look, but it is complete in only about two-thirds of cases and was originally described on bone scintigraphy; incomplete variants, including a single vertical ala band, are common, so keep insufficiency fracture in the differential for unilateral ala edema too in an osteoporotic or running patient.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // AXIAL T2 FS  (stack: normal-hip-axial, 44 slices)
  // Dedicated single (left) hip. THE plane for the anterior/posterior labrum,
  // the iliopsoas tendon, and the sciatic nerve. Find anterior by the iliopsoas
  // tendon (a round dark dot in front of the head); the sciatic nerve is posterior.
  // ───────────────────────────────────────────────────────────────────────
  axi: {
    tour: [
      {
        sliceIndex: 23,
        markers: [],
        title: "Get oriented",
        note: "Axial T2 FS, dedicated single (left) hip. Orient yourself with the soft-tissue landmarks rather than by eye: the round dark iliopsoas tendon sits ANTERIOR to the femoral head, and the fascicular sciatic nerve lies POSTERIOR between the ischium and the greater trochanter. This is the plane to read the anterior and posterior labrum, the iliopsoas, and the sciatic nerve.",
      },
      {
        sliceIndex: 23,
        markers: [{ x: 42, y: 45, label: "Femoral head" }],
        title: "Femoral head",
        note: "On axial T2 FS the femoral head is the round, spherical ball seated in the acetabular socket — check its sphericity and confirm uniformly dark (fat-suppressed) marrow with no bright edema. It is the screening target for AVN (subchondral edema, later a serpiginous double-line) and for a non-spherical anterior contour bump that can create cam morphology when symptoms and chondrolabral injury fit.",
      },
      {
        sliceIndex: 23,
        markers: [{ x: 32, y: 35, label: "Labrum" }],
        title: "Acetabular labrum",
        note: "The labrum is the small low-signal triangular fibrocartilage rimming the bony acetabulum; the axial plane is where you read the anterior and posterior labrum, with the anterosuperior segment being the dominant tear site. A clean, uniformly dark triangular labrum with no intrasubstance bright signal or paralabral cyst is normal.",
      },
      {
        sliceIndex: 23,
        markers: [{ x: 54, y: 54, label: "Post. wall" }],
        title: "Acetabulum & sourcil",
        note: "The acetabulum is the bony socket; on axial T2 FS you assess the intact anterior and posterior walls and columns, with normal dark cortex and bright fatty marrow. The sourcil — the dense subchondral arc of the weight-bearing roof — is a roof structure best profiled on coronal/radiographic views, so on axial you are mainly confirming wall integrity and looking for subchondral roof marrow edema.",
      },
      {
        sliceIndex: 23,
        markers: [{ x: 26, y: 30, label: "Iliopsoas" }],
        title: "Iliopsoas tendon & bursa",
        note: "On axial T2 FS the iliopsoas tendon is the round low-signal dot anterior to the joint/femoral head, with the muscle belly lateral to it; the iliopsoas bursa sits just deep (posterior) to the musculotendon. Normal: a small dark tendon, no distending bursal fluid, lying anteromedial to the hip.",
      },
      {
        sliceIndex: 23,
        markers: [{ x: 72, y: 42, label: "Abductors" }],
        title: "Gluteus medius & minimus (abductors)",
        note: "These are the hip abductors — the 'rotator cuff of the hip' — converging on the greater trochanter; on axial T2 FS follow gluteus minimus (deeper/anterior, to the anterior facet) and gluteus medius (to the lateral/posterosuperior facets). Normal muscle bellies and tendons are uniformly dark with no peritrochanteric fluid or footprint edema.",
      },
      {
        sliceIndex: 23,
        markers: [{ x: 42, y: 66, label: "Sciatic n." }],
        title: "Sciatic nerve",
        note: "On axial T2 FS the sciatic nerve is the rounded, fascicular soft-tissue structure posterior to the hip, lying just posterior to the ischium between the ischial tuberosity and greater trochanter, deep to gluteus maximus. Normal: smooth fascicular nerve, not enlarged or hyperintense, with preserved surrounding fat.",
      },
      {
        sliceIndex: 23,
        markers: [
          { x: 32, y: 35, label: "Labrum" },
          { x: 26, y: 30, label: "Iliopsoas" },
          { x: 42, y: 66, label: "Sciatic nerve" },
        ],
        title: "Do-not-overcall checkpoint",
        note: "On axial, do not call every labral-base cleft a tear: posteroinferior sublabral sulci/perilabral sulci and labral-shape variation are common pitfalls. Iliopsoas bursal fluid may communicate with the joint, so it can be secondary. Sciatic-neuralgia imaging needs nerve enlargement or T2 hyperintensity with clinical localization, not just seeing the nerve.",
      },
    ],
    quiz: [
      {
        id: "ha-q1",
        sliceIndex: 23,
        marker: { x: 42, y: 45 },
        prompt: "What is the marked spherical structure seated in the acetabular socket?",
        options: ["Greater trochanter", "Femoral head", "Femoral neck", "Ischial tuberosity"],
        answer: 1,
        explanation:
          "The round ball articulating within the acetabulum is the femoral head. The femoral neck is the narrower column connecting the head to the trochanters and is not spherical, so it is the best distractor but wrong here.",
      },
      {
        id: "ha-q2",
        sliceIndex: 23,
        marker: { x: 32, y: 35 },
        prompt: "What is the marked low-signal triangular structure at the rim of the acetabulum?",
        options: ["Acetabular labrum", "Ligamentum teres", "Transverse acetabular ligament", "Iliofemoral ligament"],
        answer: 0,
        explanation:
          "The triangular low-signal fibrocartilage capping the bony rim is the acetabular labrum. The ligamentum teres runs centrally from the fovea to the acetabular notch, not at the peripheral rim, so it is the closest distractor but incorrect.",
      },
      {
        id: "ha-q3",
        sliceIndex: 23,
        marker: { x: 54, y: 54 },
        prompt: "On this axial image, the marked intact bony column behind the femoral head is the:",
        options: [
          "Anterior wall/column of the acetabulum",
          "Posterior wall/column of the acetabulum",
          "Quadrilateral plate",
          "Teardrop",
        ],
        answer: 1,
        explanation:
          "Behind (posterior to) the femoral head the marked bone is the posterior wall/column of the acetabulum. The anterior wall/column lies in front of the head; the quadrilateral plate is the medial wall and the teardrop is a medial-floor radiographic structure, so all three are plausible but wrong for a posterior marker.",
      },
      {
        id: "ha-q4",
        sliceIndex: 23,
        marker: { x: 26, y: 30 },
        prompt: "The marked round low-signal tendon lying directly anterior to the femoral head is the:",
        options: ["Rectus femoris tendon", "Sartorius tendon", "Iliopsoas tendon", "Gluteus minimus tendon"],
        answer: 2,
        explanation:
          "The tendon immediately anterior to the hip joint/femoral head is the iliopsoas tendon. The rectus femoris (direct head at the AIIS, indirect head along the acetabular rim) lies more anterolateral and superficial, so it is the best distractor but not in this position.",
      },
      {
        id: "ha-q5",
        sliceIndex: 23,
        marker: { x: 72, y: 42 },
        prompt: "The marked muscles converging on the greater trochanter — the hip's abductor 'rotator cuff' — are the:",
        options: [
          "Gluteus medius & minimus",
          "Piriformis & obturator internus",
          "Tensor fasciae latae & sartorius",
          "Quadratus femoris & obturator externus",
        ],
        answer: 0,
        explanation:
          "Gluteus medius and minimus are the abductors that insert on the greater trochanter and form the hip's 'rotator cuff.' Piriformis (superomedial trochanter) and obturator internus (medial trochanter) attach in the same region and are short external rotators, making them the strongest distractor, but they are not the abductors.",
      },
      {
        id: "ha-q6",
        sliceIndex: 23,
        marker: { x: 42, y: 66 },
        prompt: "The marked fascicular structure posterior to the ischium, between the ischial tuberosity and greater trochanter, is the:",
        options: ["Femoral nerve", "Obturator nerve", "Pudendal nerve", "Sciatic nerve"],
        answer: 3,
        explanation:
          "The large fascicular nerve coursing posterior to the hip between the ischial tuberosity and greater trochanter is the sciatic nerve. The femoral nerve lies anteriorly within the iliopsoas groove lateral to the femoral artery, so it is a plausible but anatomically opposite distractor.",
      },
      // ha-q7…ha-q11 hang the axial reading questions on the same reviewed
      // anchors as the identification items, with distinct correct answers.
      {
        id: "ha-q7",
        sliceIndex: 23,
        marker: { x: 32, y: 35 },
        prompt:
          "A fluid-signal cleft sits at the base of this labrum. Which feature best supports a true tear rather than a normal sublabral/perilabral sulcus?",
        options: [
          "Irregular fluid extending into the labral substance with blunting or displacement, or an adjacent paralabral cyst",
          "A smooth-walled cleft paralleling the labral base with no displacement",
          "Any cleft seen in the posteroinferior labrum",
          "Uniformly low signal throughout the labral triangle",
        ],
        answer: 0,
        explanation:
          "Trajectory and margins decide it: fluid tracking INTO the substance of the labrum, a blunted or displaced fragment, or a paralabral cyst supports a tear. The smooth basal cleft is the strongest distractor because a sublabral/perilabral sulcus produces exactly that fluid signal — but it stays at the base, does not displace the labrum, and carries no cyst or adjacent chondral injury. Location alone does not settle it either way, so confirm a suspected tear in a second plane on dedicated small-field-of-view imaging; a uniformly dark triangle is the normal labrum.",
      },
      {
        id: "ha-q8",
        sliceIndex: 23,
        marker: { x: 26, y: 30 },
        prompt:
          "Fluid distends the bursa deep to this iliopsoas tendon. Which statement about that finding is most accurate?",
        options: [
          "The iliopsoas bursa communicates with the hip in roughly 15% of people, so a distended bursa can flag intra-articular pathology",
          "A distended iliopsoas bursa establishes primary iliopsoas bursitis as the pain source",
          "Bursal distension on this static image confirms internal snapping hip",
          "Any fluid deep to the tendon indicates a full-thickness iliopsoas tendon tear",
        ],
        answer: 0,
        explanation:
          "Because the iliopsoas bursa communicates with the joint in about 15% of people, a distended bursa is often secondary — a marker of effusion, synovitis, or degenerative joint disease — so the read should turn back to the joint before settling on bursitis. Calling it primary bursitis is the tempting error: a small bursa can be normal and a large one may simply be decompressing the joint. Internal snapping is a DYNAMIC event (the tendon flicking over the iliopectineal eminence), diagnosed on real-time ultrasound rather than a static MR image.",
      },
      {
        id: "ha-q9",
        sliceIndex: 23,
        marker: { x: 42, y: 66 },
        prompt:
          "Seeing this sciatic nerve is normal. Which combination best supports deep gluteal (sciatic) entrapment?",
        options: [
          "A concordant buttock-pain pattern PLUS nerve enlargement or T2 hyperintensity with loss of the surrounding fat plane",
          "Clear visualization of the nerve between the ischial tuberosity and greater trochanter",
          "Preserved fascicular architecture of the nerve",
          "Lateral hip pain with point tenderness over the greater trochanter",
        ],
        answer: 0,
        explanation:
          "Deep gluteal syndrome is a clinical-plus-imaging diagnosis made after competing causes are considered: it needs a concordant posterior-pain pattern together with nerve enlargement, T2 hyperintensity, fat-plane loss, or a compressive lesion. Simply seeing the nerve is the classic over-call — the sciatic nerve is normally well visualized in the subgluteal space, and a normal fascicular pattern is reassuring rather than diagnostic. Lateral pain with trochanteric tenderness points to GTPS, a different compartment entirely.",
      },
      {
        id: "ha-q10",
        sliceIndex: 23,
        marker: { x: 42, y: 45 },
        prompt:
          "You suspect cam morphology at the anterior head-neck junction of this femoral head. On which images is the alpha angle most reliably measured?",
        options: [
          "Oblique-axial images prescribed along the femoral neck axis, or radial reformats",
          "This straight axial slice through the mid femoral head",
          "The large-field-of-view coronal through the mid acetabulum",
          "Any sagittal slice through the joint",
        ],
        answer: 0,
        explanation:
          "The cam bump lives at the anterosuperior head-neck junction, which only the oblique-axial-along-the-neck plane (or radial reformats, which add the clock-face map) profiles properly. A standard axial is the strongest distractor because it looks like the same plane and will happily yield a number — but it can under-sample the anterosuperior peak and misrepresent the angle. Report the measured value and the plane: the historic >55° cutoff is widely cited while ≥60° is the better-supported classification threshold, and morphology is not symptomatic FAI by itself.",
      },
      {
        id: "ha-q11",
        sliceIndex: 23,
        marker: { x: 54, y: 54 },
        prompt:
          "In pincer-type impingement from anterior acetabular over-coverage, where does the characteristic contrecoup chondral injury appear?",
        options: [
          "Posteroinferiorly, opposite the impinging anterior rim",
          "At the anterosuperior rim, exactly at the point of contact",
          "In the superomedial bare area of the acetabular roof",
          "At the gluteal tendon footprint on the greater trochanter",
        ],
        answer: 0,
        explanation:
          "In pincer impingement the over-covering anterior rim levers the femoral head, which pivots away and loads the posteroinferior surface — so the contrecoup lesion sits opposite the point of contact, and finding it should send you looking for anterior over-coverage. The anterosuperior rim is the strongest distractor because it IS where pincer rim-side labral degeneration and cam-related delamination occur; the teaching point is that pincer produces both a narrow rim lesion anteriorly AND the posteroinferior contrecoup loss. The superomedial bare area is a normal variant, and the trochanteric footprint is extra-articular.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // SAGITTAL PD FS  (stack: normal-hip-sagittal, 24 slices)
  // Dedicated single (left) hip. THE plane for the anterior head-neck (cam)
  // contour and the anterior joint recess. Anterior = the iliopsoas/anterior
  // recess side; posterior = the gluteal side.
  // ───────────────────────────────────────────────────────────────────────
  sag: {
    tour: [
      {
        sliceIndex: 11,
        markers: [],
        title: "Get oriented",
        note: "Sagittal PD FS, dedicated single (left) hip. The femoral head-neck is seen in profile. Orient by landmarks: the iliopsoas tendon and the anterior joint recess mark ANTERIOR, the gluteal muscles mark POSTERIOR. This is the plane to judge the anterior head-neck (cam) contour and to find a hip effusion in the anterior recess.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 43, y: 60, label: "Femoral head" }],
        title: "Femoral head",
        note: "On this sagittal PD FS the femoral head is the large round epiphysis capped by smooth low-signal articular cartilage and seated in the acetabulum. Confirm it is spherical with normal marrow (fatty signal that suppresses uniformly on this fat-sat sequence) and an intact subchondral cortex — the marrow and subchondral contour are your AVN and subchondral insufficiency fracture of the femoral head (SIFFH) screen.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 36, y: 70, label: "Head-neck" }],
        title: "Femoral neck & head-neck junction",
        note: "The sagittal plane profiles the femoral neck and shows the anterior head-neck junction contour. Trace a smooth concave anterior waist from head to neck — loss of that concavity (a convex 'bump') suggests cam morphology, though the alpha angle itself is measured on oblique-axial-along-the-neck or radial images, not here; the neck marrow is also your tension-side stress-fracture and AVN territory.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 46, y: 54, label: "Labrum" }],
        title: "Acetabular labrum",
        note: "On sagittal PD FS the acetabular labrum is the small low-signal triangle on the bony rim, and this plane helps localize it around the clock face — the anterosuperior quadrant is the tear hotspot. Confirm a uniformly dark, sharply pointed triangle blending with the rim; rounded, blunted, displaced, or irregular fluid signal raises concern. Direct MR arthrography can clarify subtle defects when a dedicated routine MRI is equivocal.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 23, y: 54, label: "Iliopsoas" }],
        title: "Iliopsoas tendon & bursa",
        note: "Anterior to the joint, the iliopsoas tendon is the rounded low-signal structure crossing the femoral head/anterior capsule toward the lesser trochanter, with its bursa interposed between tendon and the iliopectineal eminence/capsule. Normally the tendon is uniformly dark and the bursa imperceptible or a thin fluid sliver; a distended iliopsoas bursa or thickened tendon is the substrate for anterior groin pain and internal snapping hip.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 72, y: 38, label: "Abductors" }],
        title: "Gluteus medius & minimus (abductors)",
        note: "The lateral sagittal images show the gluteus medius and minimus tendons converging onto the greater trochanter — the 'rotator cuff of the hip.' Confirm uniformly low-signal tendons and a dry trochanteric footprint; peritendinous edema, tendon thickening, or footprint fluid is the imaging substrate of greater trochanteric pain syndrome (GTPS) and frank abductor tears.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 33, y: 57, label: "Ant. recess" }],
        title: "Anterior joint recess",
        note: "Between the anterior femoral head-neck and the overlying iliofemoral ligament/capsule, the anterior joint recess is the potential space where a hip effusion first collects on this sagittal. Normally it is a thin, smooth fluid sliver hugging the neck; convex distension or synovial thickening signals effusion or synovitis, and it is the target plane for fluoroscopic/US joint access and aspiration.",
      },
      {
        sliceIndex: 11,
        markers: [{ x: 30, y: 51, label: "Capsule / IFL" }],
        title: "Joint capsule & iliofemoral ligament",
        note: "On the sagittal PD FS, the anterior fibrous joint capsule — reinforced by the iliofemoral (Y) ligament of Bigelow — drapes over the anterior femoral head-neck as the low-signal roof of the anterior synovial recess, normally thin and closely apposed to the bone. You check it because distension of this anterior recess by bright fluid is the sign of an effusion/synovitis, and the capsule is the landmark targeted for image-guided hip aspiration and intra-articular injection.",
      },
      {
        sliceIndex: 11,
        markers: [
          { x: 36, y: 70, label: "Head-neck junction" },
          { x: 46, y: 54, label: "Labrum" },
          { x: 33, y: 57, label: "Anterior recess" },
        ],
        title: "Do-not-overcall checkpoint",
        note: "Sagittal is a profile view, not the whole FAI answer. Use it to notice head-neck asphericity and the chondrolabral junction, but measure alpha angle on oblique-axial/radial images when available. A thin anterior recess can be normal; convex distension is effusion. A bright labral-adjacent cleft needs shape, displacement, cartilage injury, and orthogonal confirmation before you call a tear.",
      },
    ],
    quiz: [
      {
        id: "hs-q1",
        sliceIndex: 11,
        marker: { x: 43, y: 60 },
        prompt: "What is the marked spherical epiphyseal structure seated in the acetabulum?",
        options: ["Greater trochanter", "Acetabular dome (sourcil)", "Femoral head", "Ischial tuberosity"],
        answer: 2,
        explanation:
          "The large, round, cartilage-capped epiphysis articulating with the acetabular cup is the femoral head; its sphericity and marrow are the key normal checks. The acetabular dome (sourcil) is the curved acetabular roof ABOVE the head, not the rounded ball itself, so it is the closest miss.",
      },
      {
        id: "hs-q2",
        sliceIndex: 11,
        marker: { x: 36, y: 70 },
        prompt: "What is the marked structure connecting the femoral head to the shaft, seen here in profile?",
        options: [
          "Femoral neck & head-neck junction",
          "Acetabular labrum",
          "Iliopsoas tendon",
          "Anterior inferior iliac spine",
        ],
        answer: 0,
        explanation:
          "The waisted column of bone linking the round head to the trochanteric region is the femoral neck and its head-neck junction, where you judge anterior offset (cam) and tension-side stress. The acetabular labrum is the small triangular fibrocartilage at the socket rim, not the tubular bony bridge, making it the tempting distractor.",
      },
      {
        id: "hs-q3",
        sliceIndex: 11,
        marker: { x: 46, y: 54 },
        prompt: "What is the marked low-signal triangle along the acetabular rim?",
        options: ["Ligamentum teres", "Transverse acetabular ligament", "Acetabular labrum", "Zona orbicularis"],
        answer: 2,
        explanation:
          "The triangular low-signal fibrocartilage seated on the bony acetabular rim is the labrum, with the anterosuperior segment the classic tear site. Assess it on dedicated small-field-of-view MRI and use direct MR arthrography selectively when the routine study is equivocal. The ligamentum teres runs from the fovea to the acetabular notch inside the joint, not along the outer rim.",
      },
      {
        id: "hs-q4",
        sliceIndex: 11,
        marker: { x: 23, y: 54 },
        prompt: "What is the marked rounded low-signal tendon coursing anterior to the hip joint toward the lesser trochanter?",
        options: ["Iliopsoas tendon", "Rectus femoris tendon", "Sartorius", "Gluteus minimus tendon"],
        answer: 0,
        explanation:
          "The rounded tendon gliding over the anterior capsule and femoral head toward the lesser trochanter is the iliopsoas — the internal-snapping and anterior bursa structure. The rectus femoris (direct head off the AIIS, indirect head off the acetabular rim) lies more superolateral on the anterior pelvis, so it is the closest anatomic mimic.",
      },
      {
        id: "hs-q5",
        sliceIndex: 11,
        marker: { x: 72, y: 38 },
        prompt: "What is the marked tendon group inserting on the greater trochanter (the 'rotator cuff of the hip')?",
        options: ["Piriformis tendon", "Iliopsoas tendon", "Gluteus medius & minimus (abductors)", "Quadratus femoris"],
        answer: 2,
        explanation:
          "The tendons converging on the greater trochanter are the gluteus medius and minimus — the hip abductors, analogous to the shoulder rotator cuff and the source of GTPS. The piriformis also reaches the trochanter but inserts on its superomedial tip and is an external rotator, not the lateral-facet abductor footprint, so it is the strongest distractor.",
      },
      {
        id: "hs-q6",
        sliceIndex: 11,
        marker: { x: 33, y: 57 },
        prompt: "What is the marked thin fluid-containing space along the anterior femoral neck beneath the capsule?",
        options: ["Anterior joint recess", "Iliopsoas bursa", "Zona orbicularis", "Rectus femoris origin"],
        answer: 0,
        explanation:
          "The thin capsular space hugging the anterior head-neck deep to the iliofemoral ligament is the anterior joint recess, the first site effusion collects and the access point for aspiration. The iliopsoas bursa lies superficial to the capsule around the iliopsoas tendon and can communicate with the joint, but it is extracapsular, making it the most plausible miss.",
      },
      {
        id: "hs-q7",
        sliceIndex: 11,
        marker: { x: 30, y: 51 },
        prompt: "On this sagittal PD FS image, the marked anterior fibrous layer draped over the femoral head-neck and reinforced by the Y ligament of Bigelow is which structure?",
        options: ["Acetabular labrum", "Joint capsule with iliofemoral ligament", "Ligamentum teres", "Iliopsoas tendon"],
        answer: 1,
        explanation:
          "The anterior joint capsule reinforced by the iliofemoral ligament forms the roof of the anterior synovial recess, and its distension by fluid indicates effusion/synovitis — also the target for image-guided aspiration/injection. The acetabular labrum is the triangular fibrocartilage rim at the acetabular margin, not the fibrous capsular layer draped over the femoral neck.",
      },
      // hs-q8…hs-q12 reuse the reviewed sagittal anchors for the variant,
      // measurement, and next-study questions that belong to each landmark.
      {
        id: "hs-q8",
        sliceIndex: 11,
        marker: { x: 36, y: 70 },
        prompt:
          "A small, well-corticated T1-dark / T2-bright cyst sits in the anterosuperior cortex of this femoral neck. What is it, and what should you do?",
        options: [
          "A herniation (fibrocystic) pit — benign, but a prompt to assess cam morphology in the correct plane",
          "An intraosseous abscess requiring urgent aspiration",
          "A subchondral insufficiency fracture of the femoral head",
          "An aggressive lytic lesion requiring an oncologic workup",
        ],
        answer: 0,
        explanation:
          "A small corticated subcortical cyst at the anterosuperior head-neck junction is a herniation pit — classically benign, often incidental, and associated with cam morphology, so the reasonable next move is a measured alpha angle on an oblique-axial-along-the-neck or radial image rather than escalation. Subchondral insufficiency fracture is the strongest distractor because it is also a low-signal subchondral finding in a painful hip, but SIFFH is a fracture BAND paralleling the articular surface of the femoral HEAD, not a corticated cyst in the neck cortex. Aggressive lesions lack this thin sclerotic rim.",
      },
      {
        id: "hs-q9",
        sliceIndex: 11,
        marker: { x: 33, y: 57 },
        prompt:
          "You move to the ultrasound correlate of this anterior joint recess. Which measurement supports an effusion or synovitis?",
        options: [
          "Capsule-to-bone distance greater than about 7 mm at the head-neck junction, or more than 1 mm side-to-side asymmetry",
          "Any visible anechoic sliver within the recess",
          "A hyperechoic triangle at the acetabular rim",
          "Loss of the fibrillar pattern of the iliopsoas tendon",
        ],
        answer: 0,
        explanation:
          "The anterior recess is the one part of the hip joint ultrasound reads well, and the working thresholds are a bone-to-capsule distance above roughly 7 mm at the head-neck junction or more than 1 mm of side-to-side asymmetry — which is also why this is the window used for guided aspiration and injection. 'Any anechoic sliver' is the tempting answer because fluid is what you are looking for, but a thin physiologic sliver is normal; it is distension that matters. Ultrasound cannot tell you the cause — the labrum and cartilage stay hidden.",
      },
      {
        id: "hs-q10",
        sliceIndex: 11,
        marker: { x: 30, y: 51 },
        prompt:
          "Which appearance of this anterior capsule / iliofemoral ligament indicates a true joint effusion rather than a normal capsule?",
        options: [
          "A convex, outwardly bulging capsular margin with distension of the underlying recess",
          "A thin, flat-to-concave capsular margin closely apposed to the femoral neck",
          "Uniformly low signal of the iliofemoral ligament fibers",
          "A thin fluid sliver in the iliopsoas bursa superficial to the capsule",
        ],
        answer: 0,
        explanation:
          "The normal anterior capsule hugs the head-neck junction with a flat or slightly concave outer margin; when the recess fills, that margin becomes CONVEX and bulges the iliofemoral ligament outward — the sign of effusion or synovitis. The concave margin is the strongest distractor precisely because there is normally a thin sliver of fluid there, so learners call any visible recess an effusion. Uniform low signal of the ligament is normal, and iliopsoas bursal fluid lies superficial to the capsule (extracapsular), so it is a separate compartment.",
      },
      {
        id: "hs-q11",
        sliceIndex: 11,
        marker: { x: 72, y: 38 },
        prompt:
          "Following these abductor tendons onto the greater trochanter, which footprint assignment is correct?",
        options: [
          "Gluteus minimus onto the anterior facet; gluteus medius onto the lateral and superoposterior facets",
          "Gluteus medius onto the anterior facet; gluteus minimus onto the lateral facet",
          "Both tendons converge onto the lesser trochanter",
          "Piriformis onto the lateral facet; gluteus medius onto the superomedial tip",
        ],
        answer: 0,
        explanation:
          "Minimus takes the anterior facet and medius the lateral and superoposterior facets — worth knowing by name because the ultrasound examination and the operative note are both written facet by facet, and a footprint defect is what separates true abductor tearing from 'bursitis.' Swapping the two is the easy error since both tendons converge on the same bone. The lesser trochanter is the iliopsoas insertion, and the piriformis reaches the superomedial tip of the trochanter as a short external rotator, not the abductor footprint.",
      },
      {
        id: "hs-q12",
        sliceIndex: 11,
        marker: { x: 46, y: 54 },
        prompt:
          "A 25-year-old with FADIR-positive groin pain has an equivocal routine MRI of this labrum, and detailed chondrolabral mapping would change management. What is the most appropriate next step?",
        options: [
          "Direct MR arthrography as a selective problem-solving study",
          "Direct MR arthrography routinely, because every suspected labral tear needs it",
          "Dynamic ultrasound, which is the reference standard for labral tears",
          "CT arthrography as the first-line labral examination",
        ],
        answer: 0,
        explanation:
          "Direct MR arthrography earns its needle here because joint distension can outline a subtle labral or chondrolabral defect and the result would change the plan — that is the standard for ordering it. Making it routine is the strongest distractor: a high-quality dedicated 3-T non-contrast study can approach MR-arthrography performance for the labrum and is often the appropriate first examination, so reflex arthrography adds cost and a needle without changing decisions. Dynamic ultrasound belongs to the snapping-hip syndromes; the labrum is too deep for it.",
      },
    ],
  },
};

/** title → "Watch for" teaching pearl (keyed by tour-step title). */
export const structureHipPearl: Record<string, string> = {
  "Femoral head":
    "Watch for a geographic serpiginous subchondral interface with a double-line pattern (AVN) or an irregular subchondral low-signal fracture band with surrounding edema (SIFFH) — both can appear before the head loses its sphericity.",
  "Acetabulum & sourcil":
    "Watch for sourcil subchondral edema or a thin bright line beneath it on the water image — early stress response or insufficiency fracture in the weight-bearing roof, not just degenerative sclerosis.",
  "Acetabular labrum":
    "Watch for irregular fluid extending into the labral substance, blunting/displacement, a paralabral cyst, or adjacent chondral injury — but don't overcall a smooth sublabral sulcus. Confirm a suspected tear in another plane on dedicated small-field-of-view MRI; use direct MR arthrography selectively when routine imaging remains equivocal.",
  "Articular cartilage":
    "Watch for focal full-thickness cartilage loss with a subchondral cyst or edema at the superolateral joint — the chondral counterpart of the chondrolabral injury seen in FAI.",
  "Femoral neck & head-neck junction":
    "Watch the SUPEROLATERAL (tension) cortex of the neck — a stress fracture there is the surgical-urgency miss prone to displacement; the inferomedial (compression) side is the lower-risk pattern.",
  "Gluteus medius & minimus (abductors)":
    "Watch for fluid signal at the trochanteric footprint or T2-bright tendinosis with peritrochanteric edema — abductor tendinopathy/tear is the true cause of most 'trochanteric bursitis'/GTPS.",
  "Adductors & pubic symphysis":
    "Watch for the 'secondary cleft sign' (fluid tracking inferolaterally from the symphysis) and edema at the rectus-adductor aponeurosis — this supports athletic pubalgia/core-muscle injury in the right clinical context, not simple osteitis pubis.",
  "Sacrum & SI joint":
    "Watch for periarticular subchondral SI marrow edema with erosion (inflammatory sacroiliitis — bilateral and symmetric in established axSpA, asymmetric in psoriatic/reactive disease, though early axSpA is often one-sided; if it is strictly unilateral and severe, exclude infection) or a sacral-ala marrow-edema pattern — the complete H-/butterfly-shaped (Honda) form is classic for insufficiency fracture but is complete in only about two-thirds of cases and was described on bone scintigraphy, so a single vertical ala band counts too — the fracture that masquerades as 'hip' pain in runners and older patients.",
  "Iliopsoas tendon & bursa":
    "Watch for a fluid-filled iliopsoas bursa communicating with the joint — and remember internal snapping (the tendon flicking over the iliopectineal eminence/femoral head) is a DYNAMIC ultrasound diagnosis, not a static MR one.",
  "Sciatic nerve":
    "Watch for nerve enlargement or bright edema-like signal as it passes the piriformis or hamstring origin — the clue to piriformis (deep gluteal) syndrome or proximal-hamstring-avulsion entrapment.",
  "Anterior joint recess":
    "A convex (rather than the normal concave) anterior capsular margin with capsular distension indicates a true effusion/synovitis — and is where you aim the needle for an image-guided hip aspiration or injection.",
  "Greater trochanter & trochanteric bursa":
    "Most clinical 'trochanteric bursitis' is actually gluteus medius/minimus tendinopathy at the footprint — fluid signal should track to the tendon insertion, not just sit in a bursa.",
  "Joint capsule & iliofemoral ligament":
    "A convex, fluid-distended anterior recess bulging the iliofemoral ligament outward signals a joint effusion — a flat or concave anterior capsular margin is the normal, non-distended appearance.",
};

/** title → inline "reading point" (variant + measurement) woven into the tour. */
export const structureHipReading: Record<string, StructureReading> = {
  "Femoral head": {
    variant:
      "Do not treat marrow edema as a diagnosis. AVN is a geographic/serpiginous subchondral lesion often with a T2 double-line; SIF is a low-signal subchondral fracture band paralleling the articular surface; transient marrow edema lacks a discrete fracture/necrosis line — but that absence is a diagnosis of exclusion, since early SIF and early osteonecrosis can look identical before a line appears, so protect weight-bearing and re-image at short interval rather than reassure on one study.",
  },
  "Acetabulum & sourcil": {
    variant:
      "A corticated os acetabuli with smooth margins at the anterosuperior rim is a chronic rim variant/fragment, not an acute fracture (sharp margins + marrow edema).",
    measure:
      "Read coverage by the lateral center-edge angle on radiographs: <20° = dysplasia/undercoverage, 20–25° = borderline, roughly 26–40° = normal, and >40° supports overcoverage/pincer morphology. Landmark choice and symptoms matter.",
  },
  "Acetabular labrum": {
    variant:
      "A smooth-walled cleft paralleling the labral base with no displacement, cartilage injury, or paralabral cyst can be a sublabral/perilabral sulcus, especially posteroinferiorly. Anterosuperior clefts deserve extra scrutiny, but location alone does not prove a tear.",
  },
  "Articular cartilage": {
    variant:
      "The superomedial stellate lesion is a normal bare-area cartilage gap (medial to the supra-acetabular fossa, no marrow edema) — not the anterosuperior weight-bearing dome where real chondral loss lives.",
    measure:
      "Grade on the modified Outerbridge (MRI) scale and name the system: II = partial-thickness defect <50% of cartilage depth, III = >50% of depth down to but not through the subchondral plate, IV = full-thickness loss with exposed subchondral bone. (The original arthroscopic Outerbridge separates II from III chiefly by lesion DIAMETER — fissures under vs over half an inch, with grade III also reaching subchondral bone — not by percentage depth; and ICRS reserves grade 4 for penetration THROUGH the subchondral plate, which is modified-Outerbridge IV's near-equivalent only at ICRS 3C.)",
  },
  "Femoral neck & head-neck junction": {
    variant:
      "A small, well-corticated T1-dark/T2-bright herniation pit at the anterosuperior neck is benign (a cam marker) — note it and check the alpha angle rather than escalate.",
    measure:
      "For stress injury, side the low-signal line first: any superolateral/tension-side fracture is high-risk, while the ~50% neck-width threshold helps stratify an inferomedial/compression-side fracture. For cam morphology, measure the alpha angle on oblique-axial-along-the-neck or radial images: >55° is historically common and ≥60° is a better-supported classification threshold, but morphology is not symptomatic FAI by itself.",
  },
  "Gluteus medius & minimus (abductors)": {
    variant:
      "GTPS should not be reduced to 'trochanteric bursitis.' Look for gluteus medius/minimus tendinosis, footprint partial tearing, retraction, fatty atrophy, and peritrochanteric edema; isolated tiny bursal fluid is nonspecific.",
  },
  "Greater trochanter & trochanteric bursa": {
    variant:
      "Trochanteric and subgluteus bursae are normally collapsed. Distended bursal fluid can accompany abductor disease, but bursal fluid alone is not the primary diagnosis when the footprint is abnormal.",
  },
  "Adductors & pubic symphysis": {
    variant:
      "Symphyseal marrow edema and adductor-aponeurotic signal can be present in asymptomatic athletes. Athletic pubalgia is supported by the right pain pattern plus aponeurotic injury/secondary cleft, not by isolated symphyseal signal alone.",
  },
  "Sacrum & SI joint": {
    variant:
      "Bilateral symmetric tiny SI-margin signal or degenerative change is not automatically inflammatory sacroiliitis. Confirm true periarticular marrow edema/erosions and keep sacral-ala insufficiency fracture in the differential for buttock or groin pain.",
  },
  "Iliopsoas tendon & bursa": {
    variant:
      "A small iliopsoas bursa can be normal, and because it communicates with the joint in ~15%, a distended bursa can simply flag intra-articular pathology rather than primary bursitis.",
  },
  "Sciatic nerve": {
    variant:
      "Seeing the sciatic nerve is normal. Deep-gluteal entrapment needs a clinical posterior-pain pattern plus nerve enlargement, T2 hyperintensity, fat-plane loss, or a compressive lesion.",
  },
  "Anterior joint recess": {
    measure:
      "On the US correlate, an anterior capsule-to-bone distance >~7 mm at the head-neck junction (or >1 mm side-to-side asymmetry) indicates effusion/synovitis.",
  },
  "Joint capsule & iliofemoral ligament": {
    variant:
      "A thin, concave anterior capsular margin is normal. Convex distension supports effusion/synovitis; capsular thickening or laxity should be interpreted with symptoms and surgical/instability history.",
  },
};

/** title → pathology case bridge ("See it injured →"), keyed by tour-step title. */
export const structureHipCase: Record<string, { caseId: string; label: string }> = {
  "Femoral head": { caseId: "hip-avn-femoral-head", label: "AVN — the double-line sign" },
  "Acetabulum & sourcil": { caseId: "hip-pincer-fai-retroversion", label: "Pincer FAI / acetabular retroversion" },
  "Acetabular labrum": { caseId: "hip-cam-fai-labral-tear", label: "Cam FAI + anterosuperior labral tear" },
  "Articular cartilage": { caseId: "hip-cam-fai-labral-tear", label: "Rim chondral injury in FAI" },
  "Femoral neck & head-neck junction": {
    caseId: "hip-femoral-neck-stress-fracture",
    label: "Tension-side femoral-neck stress fracture",
  },
  "Gluteus medius & minimus (abductors)": { caseId: "hip-gluteus-medius-tear-gtps", label: "Gluteal tear / GTPS" },
  "Greater trochanter & trochanteric bursa": {
    caseId: "hip-gluteus-medius-tear-gtps",
    label: "GTPS / abductor footprint tear",
  },
  "Adductors & pubic symphysis": { caseId: "hip-athletic-pubalgia", label: "Athletic pubalgia / secondary cleft" },
};

/**
 * title → anatomy + ultrasound correlate panel (keyed by tour-step title).
 * Authored + adversarially MSK-verified. Only structures that appear as a
 * tour-step title are included (the registry validates key ↔ title matching).
 */
export const hipStructureCorrelate: Record<string, StructureCorrelate> = {
  "Femoral head": {
    ultrasound: {
      seen: false,
      appearance:
        "The femoral head is intra-articular and deep, so US sees only its hyperechoic anterior cortical line beneath the iliofemoral ligament — the curved surface and head-neck junction form the floor of the anterior synovial recess. Articular cartilage, marrow, and AVN are MRI questions, not US.",
    },
  },
  "Acetabulum & sourcil": {
    ultrasound: {
      seen: false,
      appearance:
        "US shows only the hyperechoic anterior acetabular rim as a cortical line; the weight-bearing roof (the sourcil), subchondral bone, joint-space narrowing, and acetabular coverage/dysplasia are radiograph/CT/MRI assessments in the adult. The one exception is the infant hip, where US — not radiographs — is the modality for developmental dysplasia.",
    },
  },
  "Acetabular labrum": {
    ultrasound: {
      seen: false,
      appearance:
        "The labrum is deep and the high-yield anterosuperior tear is essentially beyond US. Dedicated small-field-of-view hip MRI is the first-line cross-sectional study; high-quality 3-T MRI can approach MR-arthrography for labral tears, while direct MR-arthrography remains useful when routine MRI is equivocal or detailed chondrolabral mapping will change management. A normal-looking anterior labrum on US never excludes a tear.",
    },
  },
  "Articular cartilage": {
    ultrasound: {
      seen: false,
      appearance:
        "The femoral-head and acetabular hyaline cartilage sit deep within the joint and are not reliably assessed on US — MRI grades chondral loss. Unlike the anterior trochlea in the knee, there is no good superficial US window onto hip articular cartilage.",
    },
  },
  "Femoral neck & head-neck junction": {
    ultrasound: {
      seen: false,
      appearance:
        "On US the anterior femoral neck and head-neck junction read as a smooth hyperechoic cortical curve — a useful landmark that forms the floor of the anterior recess and the target for joint aspiration/injection. But marrow, a femoral-neck stress fracture, and the bony cam/alpha-angle morphology of FAI are all judged on radiographs/CT/MRI.",
    },
  },
  "Gluteus medius & minimus (abductors)": {
    ultrasound: {
      seen: true,
      appearance:
        "This is prime US territory and the imaging workhorse of greater-trochanteric pain syndrome: the gluteus minimus inserts on the anterior facet and the gluteus medius on the lateral and superoposterior facets, both fibrillar hyperechoic bands. Tendinopathy shows hypoechoic swelling and footprint irregularity; a tear shows fibre discontinuity or an anechoic cleft — the 'rotator cuff of the hip.'",
      tip: "Lateral decubitus, affected side up; long-axis over the greater trochanter, identify each facet (anterior = minimus, lateral/posterior = medius), and tilt the probe to defeat anisotropy at the curved footprint.",
      image: { src: "/images/teaching/us/hip-gluteal-abductors.jpg", caption: "TRANSVERSE US over the greater trochanter — the bony apex (asterisk) separates the gluteus MINIMUS insertion on the anterior facet (A) from the gluteus MEDIUS insertion on the lateral facet (L). Naming the facet is what makes an abductor-tendon report useful.", attribution: "Yeap PM & Robinson P, J Belg Soc Radiol, 2017;101(S2):6. PMC6251072. CC-BY 4.0." },
    },
  },
  "Adductors & pubic symphysis": {
    ultrasound: {
      seen: true,
      appearance:
        "The adductor longus/common-adductor origin at the pubis is superficial and well seen as a fibrillar tendon; tendinopathy, the athletic-pubalgia/core-muscle-injury complex, enthesophytes, and any parasymphyseal fluid are demonstrable. But the pubic-symphysis fibrocartilage, the rectus-adductor aponeurotic plate, and the marrow edema of osteitis pubis are MRI questions — US owns the adductor enthesis, MRI owns the symphysis.",
      tip: "Supine, hip slightly abducted/externally rotated (frog-leg); long-axis over the adductor longus origin onto the pubic body, and tilt to beat anisotropy at the enthesis.",
      image: { src: "/images/teaching/us/hip-adductor-origin.jpg", caption: "Sagittal US of the anterior pubic attachments — rectus abdominis (RA) and the adductor longus (AL) merging at the pubis (P), with the common aponeurosis (arrows) and adductor tendon (asterisk). PROX = proximal, DIS = distal.", attribution: "Yeap PM & Robinson P, J Belg Soc Radiol, 2017;101(S2):6. PMC6251072. CC-BY 4.0." },
    },
  },
  "Iliopsoas tendon & bursa": {
    ultrasound: {
      seen: true,
      appearance:
        "The iliopsoas tendon is well seen as a rounded hyperechoic structure anterior to the femoral head/acetabular (iliopectineal) eminence and just lateral to the femoral vessels, with the muscle belly wrapping behind it; the iliopsoas bursa is visible only when distended. US owns the dynamic diagnosis of internal snapping hip — the tendon abruptly flicking over the iliopectineal eminence/femoral head as the hip moves from flexion-abduction-external rotation back toward extension.",
      tip: "Transverse over the femoral head, lateral to the femoral vessels; scan dynamically through FABER-to-extension to capture the snap in real time (a normal static image does not exclude it), and use US guidance for tendon-sheath/bursal injection.",
      image: { src: "/images/teaching/us/hip-iliopsoas.jpg", caption: "Transverse US — the iliopsoas (ILP) lies anterior to the joint and lateral to the femoral artery (FA).", attribution: "Yeap PM, Robinson P. J Belg Soc Radiol 2017;101(S2). CC BY 4.0." },
    },
  },
  "Anterior joint recess": {
    ultrasound: {
      seen: true,
      appearance:
        "The anterior synovial recess is the one part of the hip joint US assesses well: anechoic distension of the recess over the femoral head-neck junction (bone-to-capsule > ~7 mm or > 1 mm asymmetry) indicates effusion or synovitis. US cannot tell you the cause (the labrum and cartilage stay hidden), but it is the modality for real-time guided aspiration and intra-articular injection.",
      tip: "Sagittal-oblique along the femoral neck, anterior approach; measure the head-neck-junction-to-capsule distance and use an in-plane needle from the distal end for aspiration/injection.",
      image: { src: "/images/teaching/us/hip-anterior-recess.jpg", caption: "Anterior sagittal-oblique US — femoral head (H), neck (N), and the anterior joint recess at the head-neck junction.", attribution: "Yeap PM, Robinson P. J Belg Soc Radiol 2017;101(S2), via Wikimedia Commons. CC BY 4.0." },
    },
  },
  "Sciatic nerve": {
    ultrasound: {
      seen: true,
      appearance:
        "US shows the sciatic nerve as a flat hyperechoic honeycomb (fascicular) band in the subgluteal space, between the ischial tuberosity and the greater trochanter, deep to gluteus maximus as it passes beneath piriformis. It is the modality for deep-gluteal/piriformis-syndrome evaluation, post-operative or hamstring-avulsion-related neuropathy, and US-guided perineural injection, and it pairs naturally with the proximal-hamstring exam.",
      tip: "Prone; short-axis between the ischial tuberosity and greater trochanter at the subgluteal space, then trace proximally toward piriformis — dynamic internal/external rotation can show the nerve being compressed in deep-gluteal syndrome.",
      image: { src: "/images/teaching/us/hip-sciatic-nerve.jpg", caption: "Short-axis US in the subgluteal space — the sciatic nerve (sn) lies deep to piriformis (Pm) and gluteus maximus.", attribution: "Elsawy AGS et al., via Wikimedia Commons. CC BY 4.0." },
    },
  },
  "Greater trochanter & trochanteric bursa": {
    ultrasound: {
      seen: true,
      appearance:
        "US shows the trochanteric cortex as a hyperechoic line and the abductor footprints upon it; the trochanteric/subgluteus bursae are normally collapsed and become visible only when distended (anechoic/hypoechoic fluid superficial to the tendons). US also makes the dynamic diagnosis of external snapping hip — the ITB/gluteus maximus catching over the trochanter on active flexion-extension.",
      tip: "Lateral decubitus, long- and short-axis over the trochanter; scan dynamically with hip flexion-extension/rotation to provoke external snapping, and use US guidance for bursal injection.",
      image: { src: "/images/teaching/us/hip-trochanteric-bursa.jpg", caption: "Short-axis US over the greater trochanter — anterior (A) and lateral (L) facets; the trochanteric bursa lies superficial to the abductor tendons.", attribution: "Yeap PM, Robinson P. J Belg Soc Radiol 2017;101(S2). CC BY 4.0." },
    },
  },
  "Joint capsule & iliofemoral ligament": {
    ultrasound: {
      seen: true,
      appearance:
        "The anterior capsule and overlying iliofemoral (Y) ligament are well seen as a hyperechoic layer draped over the femoral head-neck junction — the roof of the anterior synovial recess. Capsular distension by anechoic fluid (a recess depth > ~7 mm or > 1 mm side-to-side asymmetry) signals an effusion or synovitis.",
      tip: "Sagittal-oblique probe along the femoral neck (parallel to it), anterior approach; measure the bone-to-capsule distance at the head-neck junction.",
    },
  },
};

/** Advanced board-style challenge bank — higher-level hip-MRI questions. */
export const hipAdvanced: AdvancedQ[] = [
  {
    id: "hadv-1",
    topic: "Cam-type FAI — aspherical anterior head-neck / alpha angle plane",
    prompt:
      "A 24-year-old male ice-hockey player has insidious right groin pain and a positive flexion-adduction-internal-rotation (FADIR) impingement test. Radiographs show a bony prominence at the anterolateral head-neck junction. To quantify the lesion driving his impingement, you elect to measure the alpha angle. On which imaging plane is the alpha angle most reliably measured for this morphology?",
    options: [
      "Oblique-axial (or radial) images through the femoral head-neck axis",
      "Standard coronal images at the mid-acetabular level",
      "Sagittal images centered on the ischial tuberosity",
      "Axial images through the lesser trochanter",
    ],
    answer: 0,
    explanation:
      "Cam morphology is an aspherical anterior/anterolateral head-neck junction (loss of the normal head-neck offset) that can lever against the acetabulum in flexion/internal rotation when symptoms and labral/cartilage injury fit. The alpha angle is measured on oblique-axial images aligned to the femoral neck axis, or on radial reformats, because these planes display the anterosuperior 'bump' where cam lesions predominate; standard coronal images underestimate the anterior deformity and miss the lesion, which is why coronal-only measurement is wrong. Lesser-trochanter axial images assess version, not the alpha angle.",
  },
  {
    id: "hadv-2",
    topic: "Pincer-type FAI — acetabular retroversion / over-coverage (crossover sign)",
    prompt:
      "A 41-year-old female recreational dancer has anterior hip pain with deep flexion. On a properly oriented AP pelvic radiograph the anterior acetabular wall line projects lateral to the posterior wall line in the superior acetabulum before they meet inferiorly. Her femoral head-neck offset and alpha angle are normal. Which diagnosis best explains these findings?",
    options: [
      "Cam-type femoroacetabular impingement",
      "Developmental dysplasia of the hip with acetabular undercoverage",
      "Pincer-type femoroacetabular impingement from acetabular retroversion",
      "Femoral anteversion with iliopsoas impingement",
    ],
    answer: 2,
    explanation:
      "The described anterior-wall-crosses-posterior-wall pattern is the crossover sign, indicating cranial acetabular retroversion/over-coverage — a pincer morphology pattern in which an over-covering acetabular rim can contact a normal head-neck junction. The normal measured alpha angle/offset argues against appreciable cam morphology on the available images: cam is a femoral-side aspherical bump, whereas pincer is an acetabular-side over-coverage problem. Dysplasia is the opposite (undercoverage, lateral center-edge angle too low), not a crossover sign.",
  },
  {
    id: "hadv-3",
    topic: "Acetabular labral tear — anterosuperior location & selective MR-arthrography",
    prompt:
      "A 29-year-old soccer player has mechanical clicking and catching anterior groin pain. A routine lower-field non-contrast MRI is equivocal, and more detailed chondrolabral assessment will change management. Where is a tear most likely to be located, and what is a reasonable next study?",
    options: [
      "Posteroinferior labrum on CT arthrography",
      "Anterosuperior labrum on MR arthrography",
      "Posterosuperior labrum on non-contrast MRI",
      "Anteroinferior labrum on bone scintigraphy",
    ],
    answer: 1,
    explanation:
      "Acetabular labral tears occur predominantly at the anterosuperior labrum. Direct MR arthrography is a reasonable problem-solving study after an equivocal routine or lower-field MRI because joint distension can better outline subtle labral and chondrolabral defects. It is not mandatory after every study: high-quality dedicated 3-T non-contrast MRI has sensitivity close to MR arthrography in meta-analysis and can be an appropriate first-line examination. CT arthrography and scintigraphy are not the usual labral workhorses.",
  },
  {
    id: "hadv-4",
    topic: "Femoral-neck stress fracture — tension vs compression side & management",
    prompt:
      "A 19-year-old female military recruit has weeks of progressive groin pain with running. MRI shows marrow edema and a low-signal fracture line along the SUPEROLATERAL cortex of the femoral neck. Which statement about this finding is correct?",
    options: [
      "This is a compression-side fracture and can be managed with protected weight-bearing alone",
      "This is a tension-side fracture and warrants urgent orthopedic referral for likely surgical fixation",
      "This is a transient bone-marrow-edema pattern requiring only observation",
      "This represents subchondral insufficiency fracture of the femoral head",
    ],
    answer: 1,
    explanation:
      "A fracture line on the superolateral (tension) side of the femoral neck is the high-risk pattern: it is prone to propagation, displacement, and AVN, so it warrants urgent orthopedic referral and often surgical fixation. The strongest distractor is the compression-side scenario — inferomedial fractures are lower-risk when incomplete and can often be managed conservatively with protected weight-bearing — but the stem specifies superolateral. Transient marrow edema lacks a discrete fracture line, and SIFFH is a subchondral femoral-head process, not femoral-neck cortex.",
  },
  {
    id: "hadv-5",
    topic: "AVN femoral head — double-line sign & ARCO staging",
    prompt:
      "A 35-year-old man on chronic corticosteroids has dull hip pain. Radiographs of the hip are normal. MRI shows a serpentine subchondral lesion in the anterosuperior femoral head with a 'double-line sign' on T2 imaging. The articular surface is intact and there is no subchondral collapse. Which classification best fits?",
    options: [
      "ARCO stage I (MRI-positive, radiograph-negative)",
      "ARCO stage III (subchondral collapse/crescent sign)",
      "ARCO stage II (radiographic sclerosis without collapse)",
      "Transient osteoporosis of the hip",
    ],
    answer: 0,
    explanation:
      "The double-line sign (inner T2-hyperintense granulation tissue, outer hypointense sclerotic rim) is the classic, highly specific MRI pattern for AVN. With a NORMAL radiograph but a positive MRI and no collapse, this is ARCO stage I. The strongest distractor, ARCO stage II, requires radiographic changes (sclerosis/lucency) without collapse — but here the radiograph is normal, so it cannot be stage II. Stage III requires subchondral fracture/collapse (crescent sign), which is absent. Transient osteoporosis shows diffuse edema without a demarcated double-line lesion.",
  },
  {
    id: "hadv-6",
    topic: "Transient bone-marrow-edema syndrome vs SIFFH",
    prompt:
      "A 58-year-old woman with osteopenia has acute, non-traumatic hip pain. MRI shows extensive femoral-head and neck marrow edema, AND a focal subchondral curvilinear LOW-signal line paralleling the articular surface with a small amount of adjacent subchondral hyperintensity. Which diagnosis is most likely, and why does it matter?",
    options: [
      "Transient bone-marrow-edema syndrome — self-limited, treat conservatively",
      "Subchondral insufficiency fracture — risk of articular collapse",
      "Septic arthritis — urgent aspiration required",
      "Avascular necrosis, ARCO stage I — no fracture line present",
    ],
    answer: 1,
    explanation:
      "The discriminating feature is the irregular subchondral LOW-signal fracture band — this defines subchondral insufficiency fracture of the femoral head (SIFFH), which carries articular-collapse risk and changes management. Transient bone-marrow-edema syndrome can also show diffuse edema but lacks a discrete fracture band or geographic necrotic segment. AVN instead has a smoother geographic/serpiginous interface and may show the characteristic double-line pattern.",
  },
  {
    id: "hadv-7",
    topic: "GTPS — gluteal (abductor) tendinopathy/tear vs trochanteric bursitis",
    prompt:
      "A 62-year-old woman has chronic lateral hip pain, worse lying on that side, with tenderness over the greater trochanter and a positive single-leg-stance (Trendelenburg) test. MRI shows increased signal and partial-thickness tearing at the gluteus medius footprint on the greater trochanter with surrounding peritrochanteric edema. What is the best characterization of her condition?",
    options: [
      "Isolated trochanteric bursitis — the abductor tendons are normal",
      "Greater trochanteric pain syndrome from gluteus medius tendinopathy/tear (the hip's 'rotator cuff')",
      "Iliotibial band friction over the trochanter causing external snapping hip",
      "Hip osteoarthritis referring pain laterally",
    ],
    answer: 1,
    explanation:
      "The gluteus medius and minimus are the abductor 'rotator cuff of the hip,' and footprint tendinopathy/tear with peritrochanteric edema is the substrate of greater trochanteric pain syndrome (GTPS), matching the lateral pain, trochanteric tenderness, and abductor weakness. The strongest distractor — isolated trochanteric bursitis — is the historical label, but most clinically diagnosed 'bursitis' is actually gluteal tendinopathy; here the MRI explicitly shows footprint tendon tearing, so 'normal tendons/bursitis only' is wrong. External snapping is a dynamic ITB phenomenon, not a footprint tendon tear.",
  },
  {
    id: "hadv-8",
    topic: "Proximal hamstring avulsion — surgical-referral criteria & sciatic proximity",
    prompt:
      "A 47-year-old water-skier felt a sudden pop in the buttock during a forced hip-flexion/knee-extension fall, with bruising tracking down the thigh. MRI shows avulsion of the conjoint tendon and semimembranosus from the ischial tuberosity (2 of 3 tendons) with 3 cm of retraction. Which management decision is best supported?",
    options: [
      "Conservative management; surgical referral is never indicated for hamstring avulsions",
      "Refer for surgical repair — ≥2 tendons torn with ≥2 cm retraction meets operative criteria, and the adjacent sciatic nerve is at risk",
      "Observe; only complete 3-tendon avulsions with >5 cm retraction warrant surgery",
      "Refer urgently for piriformis release given deep gluteal pain",
    ],
    answer: 1,
    explanation:
      "Proximal hamstring avulsions meet surgical-referral criteria when ≥2 tendons are torn AND there is ≥2 cm retraction — both satisfied here (2 tendons, 3 cm) — and the proximally retracting stump lies near the sciatic nerve, adding a neural-risk rationale for early repair. The strongest distractor sets an inflated threshold (3 tendons/>5 cm); that overstates the bar and would inappropriately deny repair to a patient who already meets the ≥2-tendon/≥2-cm rule. Piriformis release addresses deep gluteal syndrome, not a tendon avulsion.",
  },
  {
    id: "hadv-9",
    topic: "Athletic pubalgia / core-muscle injury — rectus-adductor aponeurosis & secondary cleft sign",
    prompt:
      "A 26-year-old male soccer player has lower-abdominal/groin pain with sit-ups and kicking, without a palpable inguinal hernia. Dedicated MRI shows disruption of the rectus abdominis–adductor longus aponeurosis at the pubic symphysis with a 'secondary cleft sign.' Which diagnosis is most consistent?",
    options: [
      "Athletic pubalgia (core-muscle injury) at the rectus-adductor aponeurosis",
      "Osteitis pubis as the primary and isolated diagnosis",
      "Indirect inguinal hernia",
      "Adductor longus muscle-belly strain (myotendinous junction)",
    ],
    answer: 0,
    explanation:
      "Athletic pubalgia/core-muscle injury is an injury of the rectus abdominis–adductor longus aponeurosis at the pubic symphysis; the secondary cleft sign (contrast/fluid extending inferolaterally from the symphyseal cleft) reflects this aponeurotic detachment and is the classic MRI marker. The strongest distractor, osteitis pubis, frequently coexists and can mimic it, but osteitis pubis is symphyseal bone-marrow edema/degeneration rather than the aponeurotic injury defined by the secondary cleft sign. There is no hernia, and the lesion is at the aponeurosis/symphysis, not the adductor muscle belly.",
  },
  {
    id: "hadv-10",
    topic: "Snapping hip — internal (iliopsoas) vs external (ITB) & dynamic ultrasound",
    prompt:
      "A 23-year-old ballet dancer reports an audible, reproducible deep ANTERIOR groin clunk when moving the hip from a flexed-abducted-externally-rotated position into extension. Static MRI of the hip is unremarkable. Which diagnosis and confirmatory test are most appropriate?",
    options: [
      "External snapping hip from the iliotibial band over the greater trochanter; confirm with static MRI",
      "Internal snapping hip from the iliopsoas tendon over the iliopectineal eminence; confirm with dynamic ultrasound",
      "Intra-articular labral tear; confirm with non-contrast MRI",
      "Deep gluteal (piriformis) syndrome; confirm with static MRI",
    ],
    answer: 1,
    explanation:
      "A deep anterior snap as the hip moves from flexion-abduction-external-rotation into extension is classic internal snapping hip, caused by the iliopsoas tendon catching over the iliopectineal eminence (or femoral head); because it is a dynamic event, real-time dynamic ultrasound (not static MRI) is the confirmatory test. The strongest distractor, external snapping hip, is a lateral phenomenon — the ITB/gluteus maximus flicking over the greater trochanter — not an anterior groin snap, and it too would be confirmed dynamically, not on static MRI. The unremarkable static MRI argues against a structural intra-articular cause.",
  },
  {
    id: "hadv-11",
    topic: "Deep gluteal / piriformis syndrome — sciatic nerve",
    prompt:
      "A 44-year-old cyclist has deep buttock pain with radiation down the posterior thigh, worse with prolonged sitting, but no back pain and a normal lumbar MRI. Examination reproduces symptoms with piriformis stretch. MR neurography shows the sciatic nerve coursing adjacent to a hypertrophied piriformis with perineural changes in the deep gluteal space. Which diagnosis best fits?",
    options: [
      "Lumbar disc herniation with L5-S1 radiculopathy",
      "Deep gluteal (piriformis) syndrome with sciatic nerve entrapment",
      "Greater trochanteric pain syndrome",
      "Ischiofemoral impingement of the quadratus femoris alone",
    ],
    answer: 1,
    explanation:
      "Deep buttock pain radiating down the leg, piriformis/deep-gluteal provocation, and concordant sciatic-nerve abnormality in the deep gluteal space support an extraspinal entrapment diagnosis after competing causes are considered. A normal lumbar MRI lowers but does not eliminate radiculopathy, so the diagnosis remains clinical-imaging and exclusion based rather than defined by one scan. GTPS causes lateral pain, and isolated quadratus-femoris narrowing would suggest a different deep-gluteal mechanism.",
  },
  {
    id: "hadv-12",
    topic: "Sacral / parasymphyseal insufficiency fracture — Honda sign",
    prompt:
      "An 81-year-old woman with osteoporosis has low back and buttock pain after no significant trauma; radiographs are unremarkable. Bone scintigraphy (and corresponding MRI marrow edema) shows bilateral vertical sacral-ala uptake connected by a horizontal transverse band across the sacrum, forming an 'H' pattern. What is the diagnosis?",
    options: [
      "Sacral metastatic disease",
      "Sacral insufficiency fracture (Honda/H-sign)",
      "Sacroiliitis",
      "Coccygeal stress fracture",
    ],
    answer: 1,
    explanation:
      "Bilateral vertical sacral-ala fractures bridged by a transverse component produce the classic 'H' (Honda) pattern, which strongly supports sacral insufficiency fracture in the right clinical setting. It is characteristic rather than an absolute stand-alone diagnosis: marrow-replacing disease can coexist or mimic parts of the pattern, so confirm fracture lines, T1 marrow behavior, symmetry, and clinical context. Sacroiliitis instead centers on the SI joints.",
  },
  {
    id: "hadv-13",
    topic: "FAI chondral injury — delamination vs diffuse loss and the surgical hinge",
    prompt:
      "A 28-year-old with cam morphology and an anterosuperior labral tear is being considered for hip arthroscopy. Which cartilage finding argues MOST strongly against a good joint-preserving outcome?",
    options: [
      "Focal anterosuperior acetabular delamination with a preserved joint space",
      "Diffuse full-thickness cartilage loss with joint-space narrowing (Tönnis 2–3)",
      "A smooth star-shaped cartilage gap in the superomedial acetabular roof",
      "A thin bright rim of joint fluid outlining otherwise smooth cartilage",
    ],
    answer: 1,
    explanation:
      "Diffuse full-thickness loss with joint-space narrowing predicts poor arthroscopic outcomes, so that patient is steered toward conservative care or the arthroplasty conversation rather than osteochondroplasty with chondrolabral repair. Focal delamination is the strongest distractor because it is a genuine, management-relevant lesion that can look dramatic — fluid undercutting a deceptively intact surface — but a focal, well-shouldered lesion with a preserved joint space is the repairable pattern that favors joint preservation. The superomedial star-shaped gap is the normal stellate bare area, and a thin fluid rim outlining cartilage is normal.",
  },
  {
    id: "hadv-14",
    topic: "Protocol selection — large-FOV pelvis screen vs small-FOV dedicated hip",
    prompt:
      "A 26-year-old runner has poorly localized deep groin and buttock pain that could be hip, sacrum, or referred. Which initial MRI protocol is the best first choice?",
    options: [
      "Large-field-of-view pelvis screen, covering both hips, the sacrum, and the pelvic ring",
      "Small-field-of-view dedicated hip, because its resolution answers every hip question",
      "Small-field-of-view dedicated hip with direct MR arthrography, since contrast is needed before any hip MRI is interpretable",
      "A single coronal STIR of the symptomatic hip only, to keep the study short",
    ],
    answer: 0,
    explanation:
      "When the pain generator is unclear, the large-FOV screen is right because it covers the sacrum, pubic ring, marrow, and contralateral hip — exactly where insufficiency fractures, referred causes, and second lesions hide. The dedicated small-FOV hip is the strongest distractor and is genuinely the better study once the question is intra-articular (labrum, cartilage, cam/pincer morphology), but its field simply does not include the sacrum or symphysis, so it cannot answer an undifferentiated presentation. Arthrography is selective, not a precondition, and a single-sequence look recreates the same coverage gap.",
  },
  {
    id: "hadv-15",
    topic: "Fat suppression — chemical fat-sat failure vs true marrow edema",
    prompt:
      "On a large-FOV coronal chemically fat-suppressed T2 of the pelvis, marrow at the lateral edge of the field looks bright and 'unsuppressed' on one side, with no corresponding abnormality on T1. What is the best next step?",
    options: [
      "Recognize probable fat-suppression failure at the edge of a large field and confirm with STIR alongside T1",
      "Report unilateral marrow edema and recommend urgent orthopedic review",
      "Report marrow-replacing disease, since bright fat-sat signal is specific for tumor",
      "Repeat the identical chemical fat-sat sequence with a smaller flip angle",
    ],
    answer: 0,
    explanation:
      "Chemical (spectral) fat saturation depends on a homogeneous main field and characteristically fails at the edges of a large FOV and near metal, producing regional bright pseudo-edema; STIR suppresses fat uniformly across a wide field, so STIR plus T1 settles it. Calling it marrow edema is the tempting error because that is literally what the image looks like — but a finding seen on one artifact-prone image and nowhere else should be corroborated before it drives management. Bright fat-sat signal is not specific for tumor, and repeating the same failing technique does not fix field inhomogeneity.",
  },
  {
    id: "hadv-16",
    topic: "Marrow red flag — lesser-trochanter avulsion in an adult",
    prompt:
      "A 68-year-old with several weeks of hip pain and no significant trauma has an avulsion fracture of the lesser trochanter. What should this be assumed to represent?",
    options: [
      "A pathologic fracture through an underlying marrow-replacing lesion until proven otherwise",
      "An iliopsoas apophyseal avulsion, as seen in adolescent athletes",
      "An unfused secondary ossification center, a normal variant",
      "A simple osteoporotic insufficiency fracture needing only bone-density evaluation",
    ],
    answer: 0,
    explanation:
      "The lesser trochanter rarely avulses through normal adult bone without major trauma, so this pattern is a classic pathologic-fracture marker: scrutinize the marrow for confluent low-T1 signal darker than skeletal muscle or intervertebral disc and pursue an oncologic workup. The adolescent apophyseal avulsion is the strongest distractor because the mechanism and site are correct — the iliopsoas does avulse the lesser trochanter — but that injury belongs to a skeletally immature athlete with an unfused apophysis and a sudden forceful flexion. Osteoporosis may coexist, yet treating this as a pure bone-density problem risks missing the lesion underneath.",
  },
  {
    id: "hadv-17",
    topic: "Acetabular normal variants — supra-acetabular fossa and stellate lesion",
    prompt:
      "A dedicated hip MRI shows a smooth midline cartilage-filled notch at the acetabular dome and a star-shaped bare area in the superomedial roof, neither with surrounding marrow edema. How should these be reported?",
    options: [
      "As normal variants — the supra-acetabular fossa and the stellate lesion",
      "As focal full-thickness chondral defects warranting arthroscopic referral",
      "As early osteoarthritis with subchondral cystic change",
      "As post-traumatic osteochondral lesions from prior impaction",
    ],
    answer: 0,
    explanation:
      "Both are predictable midline/bare-area variants: the supra-acetabular fossa sits at the dome and the stellate lesion superomedially, medial to that fossa and continuous with the acetabular notch, each with clean margins and no marrow reaction. 'Full-thickness chondral defect' is the strongest distractor because cartilage really is absent in these spots, so the appearance overlaps — but true FAI chondral loss is eccentric, sits at the anterosuperior weight-bearing rim, and usually shows subchondral reaction. Calling the variants defects sends a normal hip toward arthroscopy.",
  },
  {
    id: "hadv-18",
    topic: "Paralabral cyst as a secondary sign of a labral tear",
    prompt:
      "A 30-year-old with groin pain has a lobulated T2-bright collection along the anterosuperior acetabular rim; the adjacent labrum looks only subtly irregular. Which interpretation is best?",
    options: [
      "Treat the cyst as a strong secondary sign and re-scrutinize the adjacent labrum for the tear that decompresses into it",
      "Call it a soft-tissue ganglion unrelated to the joint; no further labral assessment is needed",
      "Conclude that the cyst excludes a labral tear, because the joint has decompressed",
      "Report a full-thickness labral tear on the strength of the cyst alone and refer for repair",
    ],
    answer: 0,
    explanation:
      "Paralabral cysts form when joint fluid is pumped through a labral tear as through a one-way valve, so the cyst is a high-value secondary sign: trace its neck back to the labrum and look again at that segment. The last option is the strongest distractor because it gets the association right but over-reaches — describe the tear only when its location and morphology actually support it, and let symptoms plus chondrolabral findings, not the cyst alone, drive the surgical conversation. A cyst never excludes a tear; it argues for one.",
  },
  {
    id: "hadv-19",
    topic: "SCFE in the skeletally immature — an orthopedic urgency",
    prompt:
      "A 12-year-old with obesity has several weeks of vague knee and thigh pain and a limp. MRI shows physeal widening with physeal and metaphyseal edema and subtle posteromedial displacement of the capital femoral epiphysis. What is the appropriate action?",
    options: [
      "Make the patient non-weight-bearing and refer promptly to pediatric orthopedics",
      "Reassure the family — physeal widening is an expected growth variant at this age",
      "Begin rehabilitation for a hip-flexor strain and review in six weeks",
      "Obtain MR arthrography to assess the labrum before any referral",
    ],
    answer: 0,
    explanation:
      "Even a subtle slipped capital femoral epiphysis is an orthopedic urgency: continued loading risks further slip and osteonecrosis, so the answer is non-weight-bearing plus prompt pediatric-orthopedic referral. Treating it as a strain is the dangerous distractor precisely because SCFE classically presents with referred knee or thigh pain and an unimpressive hip examination — that is how it gets missed, and the harm comes from delay. Arthrography answers a labral question that is not the issue, and physeal widening with edema and epiphyseal displacement is not a normal variant.",
  },
  {
    id: "hadv-20",
    topic: "Effusion with synovitis — septic arthritis vs a degenerative flare",
    prompt:
      "A 55-year-old with diabetes has three days of severe hip pain, fever, and raised inflammatory markers. MRI shows a tense effusion with synovial thickening, periarticular soft-tissue edema, and marrow edema on both sides of the joint. What is the correct next step?",
    options: [
      "Treat as septic arthritis until proven otherwise and arrange urgent joint aspiration",
      "Perform an intra-articular corticosteroid injection for an osteoarthritis flare",
      "Arrange outpatient physical therapy and NSAIDs with review in six weeks",
      "Assume transient bone-marrow-edema syndrome and simply offload the joint",
    ],
    answer: 0,
    explanation:
      "In the right clinical setting — fever and raised inflammatory markers — a tense effusion with synovitis and periarticular edema is septic arthritis until proven otherwise, and aspiration is both the diagnostic test and the urgent step, because MRI cannot exclude infection. The steroid injection is the strongest distractor since a large effusion with synovitis genuinely overlaps a degenerative or inflammatory flare on imaging, but injecting a potentially infected joint can cause harm and delays source control. Transient bone-marrow-edema syndrome is atraumatic and lacks this systemic inflammatory picture.",
  },
  {
    id: "hadv-21",
    topic: "Pelvic apophyseal avulsions — matching the site to the muscle",
    prompt:
      "A 15-year-old felt a sudden pop while kicking a football and has anterior hip pain. Imaging shows a displaced ossific fragment at the anterior inferior iliac spine (AIIS). Which muscle origin has avulsed?",
    options: [
      "Direct (straight) head of rectus femoris",
      "Sartorius",
      "Iliopsoas",
      "Hamstring conjoint tendon",
    ],
    answer: 0,
    explanation:
      "The AIIS is the origin of the direct (straight) head of rectus femoris, and forceful kicking is its classic mechanism. Sartorius is the strongest distractor because it avulses the immediately adjacent ASIS — one spine higher and more anterior — but with a sprinting rather than kicking mechanism. Iliopsoas avulses the lesser trochanter and the hamstrings the ischial tuberosity. Most of these are managed conservatively; large displacement (commonly cited as >1.5–2 cm, especially at the ischium) prompts a surgical discussion.",
  },
  {
    id: "hadv-22",
    topic: "Acetabular dysplasia — undercoverage and the lateral center-edge angle",
    prompt:
      "A 23-year-old woman has activity-related groin pain and a sense that the hip 'gives way.' On a standing AP pelvic radiograph the lateral center-edge angle measures 17°, with a normal alpha angle and no crossover sign. Which morphology does this describe?",
    options: [
      "Acetabular dysplasia with lateral undercoverage",
      "Pincer morphology from lateral over-coverage",
      "Cam morphology at the anterosuperior head-neck junction",
      "Coxa profunda with global over-coverage",
    ],
    answer: 0,
    explanation:
      "A lateral center-edge angle below 20° indicates undercoverage/dysplasia (20–25° borderline, roughly 26–40° normal, >40° supporting over-coverage), and the distinction matters because a dysplastic hip overloads the anterosuperior rim and labrum yet needs stability, not the rim trimming used for over-coverage. Pincer is the strongest distractor because both present with rim and labral pathology and groin pain — but pincer sits at the opposite end of this same measurement, and the normal alpha angle with no crossover sign argues against cam and against retroversion. Landmark choice and symptoms still matter: the angle classifies morphology, not the patient.",
  },
];

/** Image-anchored CAQ bank — board questions read off the real normal stacks. */
export const hipImageCaq: ImageCaqQ[] = [
  {
    id: "hicaq-1",
    topic: "AVN vs subchondral insufficiency fracture of the femoral head (SIFFH)",
    dir: "/images/teaching/stacks/normal-hip-coronal",
    count: 34,
    startIndex: 19,
    plane: "Coronal T2-FS",
    vignette:
      "On this coronal water (T2 fat-suppressed) image, find the femoral head marrow superior to the physeal scar — this is the screening location for marrow pathology. A 52-year-old man on chronic corticosteroids has 6 weeks of groin pain; radiographs are normal. If this femoral head marrow instead showed a serpentine subchondral line with the classic 'double-line sign' (T2-bright inner / T2-dark outer rim) and NO sclerosis on radiograph, what is the most appropriate staging and management?",
    options: [
      "ARCO stage I osteonecrosis (MRI-positive, radiograph-negative) — joint-preserving management may be considered before collapse",
      "ARCO stage III osteonecrosis — subchondral collapse already present, proceed to arthroplasty",
      "Transient bone-marrow-edema syndrome — reassure, protected weight-bearing, expect self-resolution",
      "Subchondral insufficiency fracture — restricted weight-bearing for a stress-type fracture with no necrosis",
    ],
    answer: 0,
    explanation:
      "Key: a classic geographic/double-line AVN pattern with a normal radiograph fits MRI-positive pre-collapse disease (ARCO I); joint-preserving management may be considered based on symptoms, lesion size/location, and patient factors. ARCO III requires subchondral fracture/collapse. Transient BMES shows diffuse edema without a demarcated necrotic lesion, while SIFFH shows an irregular subchondral fracture band and is not staged by ARCO.",
  },
  {
    id: "hicaq-2",
    topic: "Greater trochanteric pain syndrome (GTPS) / abductor (gluteus medius–minimus) tendon tear",
    dir: "/images/teaching/stacks/normal-hip-coronal",
    count: 34,
    startIndex: 19,
    plane: "Coronal T2-FS",
    vignette:
      "On this coronal T2-FS image, find the gluteus medius and minimus tendon footprint on the greater trochanter (the medius inserts on the lateral and superoposterior facets; the minimus on the anterior facet). A 58-year-old woman has chronic lateral hip pain, point tenderness over the trochanter, and a positive single-leg-stance (Trendelenburg) test; she failed a corticosteroid injection. If this footprint instead showed tendon delamination with peritrochanteric T2 hyperintensity, which statement is most accurate?",
    options: [
      "The gluteus medius/minimus are the 'rotator cuff of the hip,' and most clinically labeled 'trochanteric bursitis' is actually gluteal tendinopathy/tearing",
      "Isolated greater trochanteric bursa fluid is the dominant pain generator, so the tendon footprint is rarely involved",
      "Lateral hip pain with a positive Trendelenburg sign points to iliopsoas (internal snapping) tendinopathy",
      "A footprint tear here is a surgical emergency requiring acute open repair regardless of tendon quality",
    ],
    answer: 0,
    explanation:
      "Key: the gluteus medius/minimus act as the abductor 'rotator cuff of the hip,' and the modern understanding is that most 'trochanteric bursitis' is really gluteal tendinopathy/footprint tearing — the core of GTPS. The bursitis distractor is wrong because isolated bursal fluid is usually secondary; the tendon footprint is the primary lesion. Iliopsoas is wrong — that is an anterior/internal snapping problem, not lateral footprint pathology, and snapping is a dynamic-ultrasound diagnosis. 'Surgical emergency' is wrong — GTPS is managed conservatively first (load management, PT), with repair reserved for refractory full-thickness/retracted tears.",
  },
  {
    id: "hicaq-3",
    topic: "Acetabular labral tear and FAI — site and problem-solving imaging",
    dir: "/images/teaching/stacks/normal-hip-axial",
    count: 44,
    startIndex: 23,
    plane: "Axial T2-FS",
    vignette:
      "On this axial T2-FS image, find the anterior/anterosuperior acetabular labrum at the rim of the joint — the segment most prone to tearing in FAI. A 24-year-old hockey player has anterior groin pain and a positive anterior impingement (FADIR) test. A routine lower-field MRI is equivocal, and detailed chondrolabral assessment would change management. Which choice best reflects the likely site and a reasonable next study?",
    options: [
      "Anterosuperior labrum; direct MR arthrography can clarify an equivocal routine MRI",
      "Posteroinferior labrum; direct MR arthrography is required for every suspected tear",
      "Anterosuperior labrum; repeat the same large-field 1.5-T protocol because technique does not affect accuracy",
      "Anterosuperior labrum; dynamic ultrasound is the gold standard for diagnosing the tear",
    ],
    answer: 0,
    explanation:
      "Key: acetabular labral tears are predominantly anterosuperior. Direct MR arthrography can clarify a subtle tear after an equivocal routine or lower-field study, but it is not universally required: a dedicated small-field-of-view 3-T MRI can approach MR-arthrography sensitivity and may be the appropriate first examination. Repeating the same limited technique does not solve the problem, and dynamic ultrasound is for snapping-hip syndromes rather than intra-articular labral tears.",
  },
  {
    id: "hicaq-4",
    topic: "Deep gluteal / piriformis syndrome and the sciatic nerve",
    dir: "/images/teaching/stacks/normal-hip-axial",
    count: 44,
    startIndex: 23,
    plane: "Axial T2-FS",
    vignette:
      "On this axial T2-FS image, find the sciatic nerve in the deep gluteal space — between the posterior acetabulum/ischium and the gluteus maximus, just deep to the piriformis. A 40-year-old runner has buttock pain with sitting and non-dermatomal posterior thigh radiation; lumbar MRI is unremarkable. If imaging here showed an enlarged/T2-hyperintense sciatic nerve adjacent to the piriformis, which is the most accurate characterization?",
    options: [
      "Deep gluteal syndrome — extraspinal sciatic nerve entrapment in the subgluteal space (piriformis is one cause)",
      "A lumbar L5–S1 disc radiculopathy that simply was not captured on the spine MRI",
      "Meralgia paresthetica from lateral femoral cutaneous nerve compression",
      "Pudendal neuralgia from entrapment within Alcock's canal",
    ],
    answer: 0,
    explanation:
      "Key: sciatic nerve findings in the deep gluteal (subgluteal) space with buttock pain and non-radicular sciatica describe deep gluteal syndrome / extraspinal sciatic entrapment, of which piriformis syndrome is one cause. The disc-radiculopathy distractor is wrong because the spine MRI is normal and the entrapment is extraspinal at the hip. Meralgia paresthetica is wrong — that is the lateral femoral cutaneous nerve causing anterolateral thigh symptoms, not the sciatic nerve. Pudendal neuralgia is wrong — that involves the pudendal nerve/perineum, a different nerve and territory.",
  },
  {
    id: "hicaq-5",
    topic: "Cam-type femoroacetabular impingement and the alpha angle",
    dir: "/images/teaching/stacks/normal-hip-sagittal",
    count: 24,
    startIndex: 11,
    plane: "Sagittal PD-FS",
    vignette:
      "On this sagittal PD-FS image, find the anterior femoral head–neck junction in profile and trace its contour/offset — the region that loses sphericity in cam morphology. A 27-year-old soccer player has anterior groin pain and limited internal rotation; you suspect cam FAI. Regarding measuring the alpha angle to quantify cam morphology, which statement is correct?",
    options: [
      "The alpha angle is best measured on oblique-axial (and radial) images aligned to the femoral neck, not on the coronal plane",
      "The alpha angle is measured on the straight coronal image, where the superolateral head-neck offset is shown",
      "An alpha angle below ~40° is diagnostic of cam morphology and predicts a labral tear",
      "Cam FAI reflects acetabular over-coverage, so the crossover sign is the measurement of choice",
    ],
    answer: 0,
    explanation:
      "Key: measure the alpha angle on oblique-axial images aligned along the femoral neck and/or radial reformats, which best profile anterior/anterosuperior head-neck asphericity — not on a straight coronal plane. The historic >55° cutoff remains common, while ≥60° is better supported for classifying cam morphology. The crossover sign describes acetabular retroversion/over-coverage (pincer morphology), not a femoral cam. No angle alone establishes symptomatic FAI; symptoms, examination, and chondrolabral findings must correlate.",
  },
  {
    id: "hicaq-6",
    topic: "Athletic pubalgia (sports hernia) and the secondary cleft sign",
    dir: "/images/teaching/stacks/normal-hip-coronal",
    count: 34,
    startIndex: 19,
    plane: "Coronal T2-FS",
    vignette:
      "On this coronal T2-FS image, follow the joint inferomedially to the pubic symphysis and the rectus abdominis–adductor longus aponeurosis at the pubic body — the focus of athletic pubalgia. A 30-year-old soccer player has chronic lower-abdominal/groin pain worse with cutting and sit-ups, no palpable inguinal hernia. If imaging here showed fluid tracking inferolaterally from the symphysis along the adductor origin, what is this finding and its significance?",
    options: [
      "The 'secondary cleft sign' — fluid extending from the symphysis indicating a rectus–adductor aponeurosis/common-origin injury of athletic pubalgia",
      "The normal 'primary cleft' — a midline symphyseal cleft that is an expected variant and excludes pathology",
      "A femoral-neck tension-side stress fracture requiring urgent surgical fixation",
      "An inguinal canal lipoma confirming a true (palpable) inguinal hernia as the pain source",
    ],
    answer: 0,
    explanation:
      "Key: fluid extending inferolaterally from the symphysis along the rectus-adductor aponeurosis is the secondary cleft sign, marking a common rectus abdominis–adductor longus aponeurotic injury at the symphysis — the imaging hallmark of athletic pubalgia. The 'primary cleft' distractor is wrong because the primary cleft is the normal midline symphyseal cleft; it is the SECONDARY cleft that signals injury. The femoral-neck stress-fracture option is wrong — that is a superolateral (tension-side) femoral-neck process, an unrelated location and entity. The inguinal-hernia option is wrong because athletic pubalgia is a non-hernia aponeurotic/musculotendinous injury without a true palpable hernia.",
  },
];

// Stack directories (under /public) for the cross-plane drill.
const HIP_COR = "/images/teaching/stacks/normal-hip-coronal";
const HIP_AXI = "/images/teaching/stacks/normal-hip-axial";
const HIP_SAG = "/images/teaching/stacks/normal-hip-sagittal";

/**
 * Cross-plane correlation drill: a structure labeled on one plane, found on
 * another. Coordinates reuse the workstation marker anchors (starter positions —
 * fine-tune in Adjust mode); the candidate set on the target plane is the other
 * labeled structures on that anchor slice.
 */
export const hipCrossPlane: CorrelationItem[] = [
  {
    id: "xp-hip-head",
    prompt: "This is the femoral head on the coronal — the ball seated in the socket. Find the same femoral head on the axial.",
    explanation:
      "The round ball filling the acetabular cup is the femoral head on both planes. On axial it sits centrally with the iliopsoas tendon ANTERIOR and the sciatic nerve POSTERIOR — don't grab a muscle or the nerve.",
    from: { plane: "Coronal T2-FS", dir: HIP_COR, sliceIndex: 19, x: 72, y: 55, label: "Femoral head" },
    to: {
      plane: "Axial T2-FS",
      dir: HIP_AXI,
      sliceIndex: 23,
      candidates: [
        { x: 42, y: 45 }, // femoral head ✓
        { x: 26, y: 30 }, // iliopsoas tendon
        { x: 72, y: 42 }, // abductors
        { x: 42, y: 66 }, // sciatic nerve
      ],
      answer: 0,
    },
  },
  {
    id: "xp-hip-iliopsoas",
    prompt: "This is the iliopsoas tendon anterior to the joint on the axial. Find it on the sagittal — the anterior landmark.",
    explanation:
      "The iliopsoas tendon is the rounded dark structure ANTERIOR to the head on both planes, gliding toward the lesser trochanter. The anterior joint recess sits just deep to it (a tempting distractor), but the recess is the fluid space, not the tendon.",
    from: { plane: "Axial T2-FS", dir: HIP_AXI, sliceIndex: 23, x: 26, y: 30, label: "Iliopsoas tendon" },
    to: {
      plane: "Sagittal PD-FS",
      dir: HIP_SAG,
      sliceIndex: 11,
      candidates: [
        { x: 23, y: 54 }, // iliopsoas tendon ✓
        { x: 43, y: 60 }, // femoral head
        { x: 72, y: 38 }, // abductors
        { x: 33, y: 57 }, // anterior joint recess
      ],
      answer: 0,
    },
  },
  {
    id: "xp-hip-abductors",
    prompt: "These are the gluteus medius/minimus abductors heading to the greater trochanter on the coronal. Find them on the axial.",
    explanation:
      "The abductors ('rotator cuff of the hip') wrap the lateral/posterolateral trochanter on both planes. On axial they're the muscle mass LATERAL to the head — not the anterior iliopsoas or the posterior sciatic nerve.",
    from: { plane: "Coronal T2-FS", dir: HIP_COR, sliceIndex: 19, x: 88, y: 52, label: "Abductors" },
    to: {
      plane: "Axial T2-FS",
      dir: HIP_AXI,
      sliceIndex: 23,
      candidates: [
        { x: 72, y: 42 }, // abductors ✓
        { x: 42, y: 45 }, // femoral head
        { x: 26, y: 30 }, // iliopsoas tendon
        { x: 42, y: 66 }, // sciatic nerve
      ],
      answer: 0,
    },
  },
  {
    id: "xp-hip-labrum",
    prompt: "This is the acetabular labrum at the rim on the axial. Find the labrum on the coronal — the small triangle at the superolateral rim.",
    explanation:
      "The labrum is the low-signal TRIANGLE capping the bony rim on both planes. On coronal it's superolateral, just peripheral to the sourcil (the bony roof) — don't grab the sourcil, which is the bone deep to the labrum.",
    from: { plane: "Axial T2-FS", dir: HIP_AXI, sliceIndex: 23, x: 32, y: 35, label: "Acetabular labrum" },
    to: {
      plane: "Coronal T2-FS",
      dir: HIP_COR,
      sliceIndex: 19,
      candidates: [
        { x: 77, y: 47 }, // labrum ✓
        { x: 70.5, y: 46 }, // sourcil
        { x: 72, y: 55 }, // femoral head
        { x: 71, y: 63 }, // femoral neck
      ],
      answer: 0,
    },
  },
  {
    id: "xp-hip-neck",
    prompt: "This is the femoral neck/head-neck junction in profile on the sagittal. Find the femoral neck on the coronal.",
    explanation:
      "The neck is the waist of bone between the head and the trochanters on both planes. On coronal, scrutinize its SUPEROLATERAL (tension) cortex — the high-risk stress-fracture line — not the head above it.",
    from: { plane: "Sagittal PD-FS", dir: HIP_SAG, sliceIndex: 11, x: 36, y: 70, label: "Femoral neck" },
    to: {
      plane: "Coronal T2-FS",
      dir: HIP_COR,
      sliceIndex: 19,
      candidates: [
        { x: 71, y: 63 }, // femoral neck ✓
        { x: 72, y: 55 }, // femoral head
        { x: 70.5, y: 46 }, // sourcil
        { x: 48, y: 77 }, // pubic symphysis
      ],
      answer: 0,
    },
  },
];
