/**
 * Interactive "master normal first" content for the Normal Knee MRI workstation.
 *
 * Each plane (keyed by its SERIES id in NormalKneeMriPage) has:
 *   - a Guided Tour: stepped, labeled walkthrough of the key normal structures
 *   - a Knowledge Check: marker -> multiple-choice ("what is the marked structure?")
 *
 * Marker coordinates are PERCENTAGES of the displayed slice image (x = left, y = top).
 * sliceIndex is 0-based into that plane's stack (slice_01.jpg = index 0).
 *
 * Marker positions have been reviewed against the exact de-identified source
 * stacks. They remain teaching annotations rather than diagnostic overlays and
 * should retain faculty sign-off when the source images are replaced.
 */

import type {
  Marker,
  TourStep,
  QuizItem,
  PlaneLearn,
  CorrelationItem,
  AdvancedQ,
  ImageCaqQ,
  StructureCorrelate,
  StructureReading,
} from "./normal-mri-types";
export type { Marker, TourStep, QuizItem, PlaneLearn, CorrelationItem, AdvancedQ, ImageCaqQ, StructureCorrelate, StructureReading };

// Convenience for the standard "what is the marked structure?" stem.
const WHAT = "What is the marked structure?";

/**
 * Normal → Abnormal bridges. Keyed by tour-step TITLE so the link is shown on
 * the matching structure in any plane (incl. the T1 mirror). Each points at the
 * knee pathology case where that structure is seen injured.
 */
export const structureCase: Record<string, { caseId: string; label: string }> = {
  // Cruciates
  "Anterior cruciate ligament": { caseId: "acl-pivot-shift", label: "ACL tear + pivot-shift" },
  "Posterior cruciate ligament": { caseId: "pcl-plc-dashboard", label: "PCL + PLC dashboard injury" },
  "Tibial spines (intercondylar eminence)": { caseId: "acl-pivot-shift", label: "ACL tear + pivot-shift" },
  // Menisci
  "Meniscus — the dark bow-ties": { caseId: "bucket-handle", label: "Bucket-handle meniscal tear" },
  Meniscus: { caseId: "bucket-handle", label: "Bucket-handle meniscal tear" },
  "Menisci — the wedges": { caseId: "medial-root-tear", label: "Medial meniscal root tear" },
  // Extensor / patellofemoral
  "Extensor mechanism — top": { caseId: "patellar-dislocation-mpfl", label: "Patellar dislocation + MPFL tear" },
  "Patellar tendon": { caseId: "patellar-tendon-rupture", label: "Patellar tendon rupture" },
  Patella: { caseId: "patellar-dislocation-mpfl", label: "Patellar dislocation + MPFL tear" },
  "Femoral trochlea": { caseId: "patellar-dislocation-mpfl", label: "Patellar dislocation + MPFL tear" },
  "Trochlear groove": { caseId: "patellar-dislocation-mpfl", label: "Patellar dislocation + MPFL tear" },
  "MPFL / medial retinaculum": { caseId: "patellar-dislocation-mpfl", label: "Patellar dislocation + MPFL tear" },
  // Collaterals
  "Medial collateral ligament": { caseId: "mcl-distal-avulsion", label: "MCL distal avulsion" },
  // Cartilage & bone
  "Femoral condyle": { caseId: "ocd-stability", label: "Osteochondritis dissecans (OCD)" },
  "Cartilage & joint fluid": { caseId: "degenerative-knee-oa", label: "Tricompartmental osteoarthritis" },
  "Weight-bearing cartilage": { caseId: "degenerative-knee-oa", label: "Tricompartmental osteoarthritis" },
  "Tibial plateau": { caseId: "acl-pivot-shift", label: "ACL tear + pivot-shift contusions" },
  "Bone marrow — T1's job": { caseId: "sifk-sonk", label: "Subchondral insufficiency fracture (SIF)" },
};

/** title → inline "reading point" (variant + measurement) woven into the tour. */
export const structureReading: Record<string, StructureReading> = {
  "Anterior cruciate ligament": {
    variant:
      "A thick, bulbous ACL with increased signal but CONTINUOUS, parallel 'celery-stalk' fibers favors mucoid degeneration rather than fiber disruption. Correlate with morphology, secondary signs, and the examination instead of diagnosing a tear from signal alone.",
    measure:
      "Secondary signs include anterior tibial translation >5 mm on a lateral sagittal compartment image and a deep lateral femoral sulcus. The classic >1.5 mm sulcus cutoff was established on lateral radiographs; on MRI, use it as supportive morphology rather than a standalone rule.",
  },
  "Posterior cruciate ligament": {
    variant:
      "A PCL that is thickened with diffusely increased signal but keeps its general contour may represent a partial/interstitial tear. Correlate with fiber continuity, trauma timing, other planes, and the posterior-drawer examination.",
  },
  "Medial collateral ligament": {
    measure:
      "The superficial MCL runs from the medial femoral epicondyle to ~5–7 cm below the joint line on the tibia — trace its full length on coronal before calling it intact.",
  },
  "Meniscus — the dark bow-ties": {
    measure:
      "Three or more contiguous bow-tie body segments on 4–5 mm sagittal images — or a central coronal body width >15 mm (or meniscal-to-tibial-plateau-width ratio >20%) — supports a discoid meniscus; account for slice thickness and confirm morphology in both planes.",
  },
  Meniscus: {
    variant:
      "Linear grade-2 signal that does NOT reach an articular surface is intrasubstance degeneration, common after 40. Surface-reaching signal on two or more matching images gives high confidence for a tear; the images need not be contiguous and may be matching sagittal and coronal images. A one-image finding is lower confidence and needs morphologic and orthogonal correlation. At the lateral meniscus, the popliteal hiatus and popliteomeniscal fascicles can create a smooth normal gap near the popliteus tendon; loss of fascicles, peripheral fluid, or hypermobile-meniscus context is abnormal.",
  },
  Patella: {
    variant:
      "A subchondral lucency in the SUPEROLATERAL quadrant with intact overlying cartilage is the benign dorsal defect of the patella — don't call it an osteochondral lesion or infection.",
  },
  "Femoral trochlea": {
    measure:
      "Trochlear dysplasia and elevated TT-TG are separate instability risk markers. TT-TG >20 mm is the classic CT-based cutoff; MRI measurements often run lower and vary with landmarks, slice choice, and knee position. Report the modality and method, and never use one number as a standalone surgical rule.",
  },
  "Trochlear groove": {
    measure:
      "The crossing sign is a true-lateral-radiograph sign: the trochlear-floor line crosses the anterior cortex of the lateral femoral condyle. On MRI, assess trochlear morphology directly with method-specific axial and sagittal measurements.",
  },
  "MPFL / medial retinaculum": {
    measure:
      "Screen for patella alta and elevated TT-TG using named, modality-appropriate methods. An Insall-Salvati ratio >1.2 is a classic true-lateral-radiograph threshold; the classic >20 mm TT-TG cutoff is CT-derived. State the modality/method and never let one measurement dictate treatment.",
  },
  "Bone marrow — T1's job": {
    variant:
      "Patchy marrow that remains brighter than skeletal muscle on T1, is lower than subcutaneous fat, and follows a symmetric expected distribution supports red-marrow reconversion. Signal at or below muscle, focal aggressive morphology, or an asymmetric distribution warrants further evaluation.",
  },
  "Femoral condyle": {
    variant:
      "In juvenile OCD, an isolated bright interface can represent vascular granulation tissue and is not enough to classify instability. More specific MRI signs include a fluid-equivalent rim with an outer low-signal rim, multiple subchondral-plate breaks, multiple or >5 mm cysts, cartilage breach, or displacement.",
  },
  "Cartilage & joint fluid": {
    variant:
      "Focal meniscal/cartilage signal near 55° to B0 (e.g., posterior horn lateral meniscus by the popliteal hiatus) that brightens on short-TE PD but fades on T2 is magic-angle artifact — don't call it a tear.",
  },
  "Patellofemoral cartilage": {
    variant:
      "A thin low-signal line paralleling the cartilage surface that does NOT reach a surface and shifts when the phase-encode direction is changed is Gibbs (truncation) artifact, not a fissure or delamination.",
  },
};

/**
 * High-yield "watch for" pearls per structure (keyed by tour-step title, so they
 * appear in every plane incl. the T1 mirror). The thing to scrutinize / the
 * classic pitfall — teaching HOW to read the structure, not just name it.
 */
export const structurePearl: Record<string, string> = {
  "Femoral condyle": "Trace the cartilage as an even gray layer over the condyle — focal thinning, a fissure, or a flap is a chondral injury.",
  "Tibial plateau": "Scan the marrow for a discrete dark fracture line; pivot-shift contusions sit at the posterolateral plateau.",
  "Extensor mechanism — top": "The quadriceps tendon is multilayered — a partial tear can involve only one layer, including the deep vastus-intermedius contribution, while other fibers remain intact.",
  "Patellar tendon": "Normally a few mm thick and uniformly dark; focal thickening = tendinopathy (usually proximal), a fluid-filled gap = rupture.",
  "Hoffa's fat pad": "Edema in the superolateral fat pad is the clue to anterior (Hoffa) impingement — easy to overlook.",
  "Meniscus — the dark bow-ties": "Count the bow-ties on the body slices, then trace the lateral transverse/meniscofemoral/popliteal-hiatus relationships before calling a tear.",
  Meniscus: "Count the bow-ties on the body slices, then inspect the lateral popliteal hiatus so a normal fascicle/hiatus does not become a false-positive tear.",
  "Cartilage & joint fluid": "A trace or small amount of joint fluid may be physiologic depending on the clinical setting; the cartilage surface should be smooth and uniform — follow it slice to slice.",
  "Anterior cruciate ligament": "A normal ACL generally parallels Blumensaat's line; if the fibers bow, sag below the roof, or become wavy/edematous, scrutinize the ligament in every plane. A deep lateral notch, anterior tibial translation, and pivot-shift contusions support a tear but do not replace direct assessment of fiber continuity.",
  "Posterior cruciate ligament": "Loss of the smooth PCL arc or a buckled contour points to anterior tibial translation from an ACL tear.",
  "Popliteal vessels": "Don't mistake flow-related signal for thrombus; a Baker's cyst sits medially, between the medial gastrocnemius and semimembranosus.",
  "Tibial spines (intercondylar eminence)": "Use the spines as your landmark for the true mid-joint slice and the cruciate origins.",
  "Menisci — the wedges": "Measure medial extrusion at the mid-body — >3 mm beyond the tibial margin is significant and should prompt a deliberate root/cartilage search; extrusion alone is not a root tear.",
  "Weight-bearing cartilage": "Compare medial vs lateral cartilage thickness directly — coronal makes early, subtle loss obvious.",
  "Medial collateral ligament": "Grade by depth (superficial vs deep) and note the level — proximal/femoral injuries scar; distal (Stener-like) may not.",
  "Lateral collateral ligament (LCL)": "The posterolateral corner is commonly missed — trace the LCL, popliteus tendon, and popliteofibular ligament on the more posterior slices.",
  Patella: "Check patellar tilt and the cartilage of the median ridge and facets — the thickest cartilage in the body.",
  "Femoral trochlea": "A shallow or flat trochlea (dysplasia) is the key predisposing factor for lateral patellar dislocation.",
  "Trochlear groove": "Flattening of the sulcus is the cardinal dysplasia sign — assess the sulcus angle.",
  "Patellofemoral cartilage": "Scrutinize the median ridge for fissures; patellar chondral loss is a common cause of anterior knee pain.",
  "MPFL / medial retinaculum": "After lateral patellar dislocation, inspect the full MPFL/medial-retinacular complex; injury may be patellar-sided, femoral-sided, midsubstance, multifocal, or occasionally not visible as a discrete tear.",
  "Bone marrow — T1's job": "A dark band within bright marrow raises concern for a fracture line; diffuse or focal T1 marrow replacement has a broad differential. Compare T1 with fluid-sensitive sequences and the distribution rather than assigning a diagnosis from signal alone.",
};

/**
 * Ultrasound correlate per structure (keyed by tour-step title), so a fellow
 * builds the MRI ↔ US model while scrolling. Authored for the sports-med fellow
 * who also scans US: it teaches WHERE US helps (superficial tendons, ligaments,
 * fluid, Baker's cyst) and — just as important — where US is blind (the cruciates,
 * the weight-bearing cartilage surface, marrow). The anatomy-diagram slot was
 * dropped from the workstation (the SVGs felt clunky inline); those diagrams live
 * in the reading modules. `ultrasound.image` is a CC-licensed still.
 */

export const structureCorrelate: Record<string, StructureCorrelate> = {
  "Anterior cruciate ligament": {
    ultrasound: {
      seen: false,
      appearance:
        "The cruciates are deep and intra-articular, so standard knee ultrasound cannot reliably image the ACL — MRI (or arthroscopy) is the modality. US may show only indirect clues such as an effusion or a Segond cortical avulsion fragment.",
    },
  },
  "Posterior cruciate ligament": {
    ultrasound: {
      seen: false,
      appearance:
        "Like the ACL, the PCL sits deep in the notch and is not assessable on routine US; a posterior approach occasionally glimpses the proximal PCL, but MRI is the modality.",
    },
  },
  "Medial collateral ligament": {
    ultrasound: {
      seen: true,
      appearance:
        "A fibrillar band over the medial joint line running from the medial femoral condyle to the proximal tibia. Trace the superficial MCL separately from the deeper meniscofemoral/meniscotibial complex. Hypoechoic swelling, fiber disruption, and dynamic valgus laxity support injury when they fit the clinical context.",
      tip: "Coronal long-axis over the medial joint line; gentle valgus stress can unmask laxity.",
      image: {
        src: "/images/teaching/us/mcl.jpg",
        caption: "Normal MCL — striated band over the medial joint line (coronal long-axis).",
        attribution: "Lutz et al., KSSTA 2021 (CC BY 4.0)",
      },
    },
  },
  "Lateral collateral ligament (LCL)": {
    ultrasound: {
      seen: true,
      appearance:
        "A discrete cord-like ligament from the lateral femoral condyle to the fibular head. Trace the rest of the posterolateral corner on adjacent images — the biceps femoris, popliteus tendon, and popliteofibular ligament.",
      tip: "Coronal long-axis toward the fibular head; a crossed-leg ('figure-4') position tightens and highlights it.",
      image: {
        src: "/images/teaching/us/lcl.jpg",
        caption: "Normal LCL — cord-like ligament toward the fibular head (long-axis).",
        attribution: "Wu et al., Insights into Imaging 2024 (CC BY 4.0)",
      },
    },
  },
  "Extensor mechanism — top": {
    ultrasound: {
      seen: true,
      appearance:
        "A fibrillar, hyperechoic, multilayered tendon inserting on the superior pole of the patella; a partial tear may involve only one layer while other fibers remain intact. Tilt the probe to defeat anisotropy (an artefactual hypoechoic band that mimics a tear).",
      tip: "Longitudinal over the suprapatellar region, knee slightly flexed to put the tendon under tension.",
      image: {
        src: "/images/teaching/us/quad-tendon.jpg",
        caption: "Normal quadriceps tendon — fibrillar, hyperechoic, inserting on the patella (long-axis).",
        attribution: "Vomer et al., Cureus 2023 (CC BY 4.0)",
      },
    },
  },
  "Patellar tendon": {
    ultrasound: {
      seen: true,
      appearance:
        "A uniform fibrillar band a few millimetres thick from the inferior patella to the tibial tubercle. Focal proximal hypoechoic thickening with loss of fibrillar architecture and possible Doppler hyperemia supports patellar tendinopathy in the appropriate clinical setting; a fiber-disrupting fluid gap supports a tear.",
      tip: "Longitudinal from the inferior patellar pole down to the tibial tubercle; flex the knee to reduce anisotropy.",
      image: {
        src: "/images/teaching/us/patellar-tendon.jpg",
        caption: "Normal patellar tendon — uniform fibrillar band (long-axis).",
        attribution: "Priyanka et al., Cureus 2026 (CC BY 4.0)",
      },
    },
  },
  Patella: {
    ultrasound: {
      seen: true,
      appearance:
        "US shows the accessible patellar cortex and attached quadriceps/patellar tendons. Radiographs and MRI/CT provide the standard assessment of retropatellar cartilage, alignment, and instability anatomy; dynamic US can supplement selected tracking questions but is not a substitute for that evaluation.",
      tip: "Slide longitudinally from the quadriceps tendon across the patella to the patellar tendon.",
    },
  },
  "Femoral trochlea": {
    ultrasound: {
      seen: true,
      appearance:
        "With the knee maximally flexed, the anterior trochlear hyaline cartilage appears as a smooth anechoic band over the trochlea — useful for anterior chondral loss. Trochlear DYSPLASIA (sulcus depth/shape) is judged on axial MRI/CT, not US.",
      tip: "Maximal knee flexion, transverse suprapatellar window over the trochlea.",
      image: {
        src: "/images/teaching/us/trochlear-cartilage.jpg",
        caption: "Normal trochlear hyaline cartilage — anechoic band (*) over the trochlea (transverse, knee flexed).",
        attribution: "Kauppinen et al., 2021 (CC BY 4.0)",
      },
    },
  },
  "Trochlear groove": {
    ultrasound: {
      seen: true,
      appearance:
        "The anterior trochlear cartilage is visible as an anechoic band with the knee flexed, but the sulcus angle/depth that defines dysplasia is an axial MRI/CT measurement.",
      tip: "Maximal knee flexion, transverse suprapatellar window.",
    },
  },
  "Meniscus — the dark bow-ties": {
    ultrasound: {
      seen: true,
      appearance:
        "US reaches only the PERIPHERAL meniscus and parameniscal cysts at the joint line (a triangular hyperechoic wedge); the body, roots, and intrasubstance tears are an MRI domain.",
      tip: "Coronal over the medial or lateral joint line, leg slightly stressed open.",
    },
  },
  Meniscus: {
    ultrasound: {
      seen: true,
      appearance:
        "US reaches only the PERIPHERAL meniscus and parameniscal cysts at the joint line; the body, roots, and intrasubstance signal are MRI territory.",
      tip: "Coronal over the joint line.",
    },
  },
  "Menisci — the wedges": {
    ultrasound: {
      seen: true,
      appearance:
        "Only the peripheral meniscus and a parameniscal cyst are accessible on US; meniscal extrusion can be measured at the joint line, but root and intrasubstance tears need MRI.",
      tip: "Coronal over the mid-joint line to assess peripheral extrusion.",
    },
  },
  "Cartilage & joint fluid": {
    ultrasound: {
      seen: true,
      appearance:
        "US excels at JOINT FLUID — anechoic distension of the suprapatellar recess, and it is more sensitive than the exam for a small effusion. For CARTILAGE, only the anterior femoral (trochlear) surface is reachable (knee flexed); the weight-bearing condylar surface stays hidden.",
      tip: "Suprapatellar recess long-axis for effusion; maximal flexion + transverse for trochlear cartilage.",
      image: {
        src: "/images/teaching/us/effusion.jpg",
        caption: "Joint effusion (star) distending the suprapatellar recess — anechoic fluid (long-axis).",
        attribution: "Vomer et al., Cureus 2023 (CC BY 4.0)",
      },
    },
  },
  "Weight-bearing cartilage": {
    ultrasound: {
      seen: false,
      appearance:
        "The weight-bearing femoral condylar cartilage is largely obscured from standard US by the patella and tibia; the accessible anterior trochlear cartilage can be seen with knee flexion. MRI evaluates the full weight-bearing chondral surface.",
    },
  },
  "Femoral condyle": {
    ultrasound: {
      seen: false,
      appearance:
        "The condylar weight-bearing cartilage is not accessible on standard US; MRI grades chondral injury. (The anterior trochlear cartilage IS visible with the knee flexed.)",
    },
  },
  "Tibial plateau": {
    ultrasound: {
      seen: false,
      appearance:
        "US sees the accessible cortical surface and adjacent soft tissue but cannot assess tibial-plateau marrow. MRI is sensitive to occult marrow/subchondral injury, while radiographs or CT define cortical fracture morphology when indicated.",
    },
  },
  "Bone marrow — T1's job": {
    ultrasound: {
      seen: false,
      appearance:
        "Ultrasound cannot assess marrow because sound does not penetrate cortical bone. MRI (non-fat-suppressed/T1 plus fluid-sensitive imaging) is the principal modality for edema-like marrow signal and occult trabecular injury; radiographs and CT remain complementary for fracture assessment.",
    },
  },
  "Popliteal vessels": {
    ultrasound: {
      seen: true,
      appearance:
        "US can evaluate the popliteal vessels and a Baker's cyst — an anechoic collection with a neck between the medial gastrocnemius and semimembranosus. A ruptured cyst can dissect distally and mimic DVT. When DVT is a clinical concern, use a validated limited or whole-leg venous-ultrasound protocol with the required follow-up pathway; a single popliteal image does not exclude DVT.",
      tip: "Transverse in the popliteal fossa; demonstrate venous compressibility as one component of a complete DVT protocol.",
      image: {
        src: "/images/teaching/us/bakers-cyst.jpg",
        caption: "Baker's (popliteal) cyst — well-defined anechoic fluid collection on B-mode US.",
        attribution: "Intermedichbo, Wikimedia Commons (CC BY-SA 3.0)",
      },
    },
  },
  "MPFL / medial retinaculum": {
    ultrasound: {
      seen: true,
      appearance:
        "The MPFL runs from the superomedial patella toward the adductor tubercle; after a lateral patellar dislocation US can show a tear at the patellar attachment as hypoechoic disruption.",
      tip: "Transverse at the superomedial patella, following the retinaculum toward the femur.",
    },
  },
};

// ── Cross-plane correlation drill ───────────────────────────────────────────
// "The real 3-D builder": a structure is labeled on one plane; the learner finds
// the SAME structure on a different plane. Every coordinate below is reused from
// the verified tour/quiz markers above — no new, unvalidated positions.
const SAG = "/images/teaching/stacks/normal-knee-sagittal";
const COR = "/images/teaching/stacks/normal-knee-coronal";
const AXI = "/images/teaching/stacks/normal-knee-axial";
const SAG_T1 = "/images/teaching/stacks/normal-knee-sagittal-t1";


export const crossPlane: CorrelationItem[] = [
  {
    id: "xp-meniscus",
    prompt: "This is the lateral meniscus on the sagittal — a low-signal “bow-tie.” Find the lateral meniscus on the coronal.",
    explanation:
      "Same structure, different shape: the sagittal “bow-tie” becomes a triangular WEDGE pointing into the joint on the coronal. Flipping between the two views is how you build a 3-D model of each structure.",
    from: { plane: "Sagittal PD-FS", dir: SAG, sliceIndex: 8, x: 61, y: 59.2, label: "Lateral meniscus (bow-tie)" },
    to: {
      plane: "Coronal PD-FS",
      dir: COR,
      sliceIndex: 7,
      candidates: [
        { x: 69, y: 55 }, // lateral meniscus wedge ✓
        { x: 48, y: 49 }, // tibial spines
        { x: 27, y: 56 }, // medial meniscus (side distractor)
        { x: 40, y: 61.5 }, // tibial plateau
      ],
      answer: 0,
    },
  },
  {
    id: "xp-cruciate",
    prompt:
      "This is the PCL in the intercondylar notch on the sagittal. On the coronal, find the central intercondylar region — the tibial spines that flank the notch.",
    explanation:
      "The tibial spines (intercondylar eminence) mark the notch midline on the coronal. The cruciates run through the notch — PCL posterior, ACL anterior — not on the spines themselves; it's the same midline you track on the sagittal.",
    from: { plane: "Sagittal PD-FS", dir: SAG, sliceIndex: 16, x: 50, y: 47, label: "PCL (notch)" },
    to: {
      plane: "Coronal PD-FS",
      dir: COR,
      sliceIndex: 7,
      candidates: [
        { x: 48, y: 49 }, // tibial spines ✓
        { x: 28.5, y: 45.9 }, // medial femoral condyle
        { x: 66.6, y: 44.9 }, // lateral femoral condyle
        { x: 27, y: 56 }, // medial meniscus
      ],
      answer: 0,
    },
  },
  {
    id: "xp-condyle",
    prompt: "This is the LATERAL femoral condyle on the coronal (image-right). Find the lateral femoral condyle on the axial — mind the side.",
    explanation:
      "Image-left is medial, image-right is lateral on BOTH planes. Behind the trochlea the two condyles flank the notch in cross-section — grab the lateral (right) one, not the medial.",
    from: { plane: "Coronal PD-FS", dir: COR, sliceIndex: 7, x: 66.6, y: 44.9, label: "Lateral femoral condyle" },
    to: {
      plane: "Axial T2-FS",
      dir: AXI,
      sliceIndex: 13,
      candidates: [
        { x: 63, y: 52 }, // lateral femoral condyle ✓
        { x: 37, y: 52 }, // medial femoral condyle (side distractor)
        { x: 50, y: 19 }, // patella
        { x: 50, y: 34 }, // trochlea
      ],
      answer: 0,
    },
  },
  {
    id: "xp-plateau",
    prompt: "This is the tibial plateau on the sagittal. Find the tibial plateau on the coronal.",
    explanation:
      "The flat top of the tibia below the joint line. Coronal lets you compare the concave medial vs the convex lateral plateau side-by-side — the view for plateau fractures and depression.",
    from: { plane: "Sagittal PD-FS", dir: SAG, sliceIndex: 13, x: 36.9, y: 64.5, label: "Tibial plateau" },
    to: {
      plane: "Coronal PD-FS",
      dir: COR,
      sliceIndex: 7,
      candidates: [
        { x: 40, y: 61.5 }, // tibial plateau ✓
        { x: 48, y: 49 }, // tibial spines
        { x: 28.5, y: 45.9 }, // medial femoral condyle
        { x: 27, y: 56 }, // medial meniscus
      ],
      answer: 0,
    },
  },
  {
    id: "xp-cartilage",
    prompt: "This is weight-bearing articular cartilage on the sagittal. Find the weight-bearing articular cartilage on the coronal.",
    explanation:
      "Cartilage is the smooth intermediate-signal layer on the bone ends, outlined by a thin bright rim of fluid. On coronal you compare medial vs lateral cartilage thickness directly.",
    from: { plane: "Sagittal PD-FS", dir: SAG, sliceIndex: 7, x: 61.3, y: 50.8, label: "Articular cartilage" },
    to: {
      plane: "Coronal PD-FS",
      dir: COR,
      sliceIndex: 7,
      candidates: [
        { x: 38, y: 53 }, // articular cartilage ✓
        { x: 48, y: 49 }, // tibial spines
        { x: 66.6, y: 44.9 }, // lateral femoral condyle
        { x: 27, y: 56 }, // medial meniscus
      ],
      answer: 0,
    },
  },
  {
    id: "xp-popliteal",
    prompt: "These are the popliteal vessels behind the knee on the sagittal. Find them on the axial.",
    explanation:
      "The popliteal artery and vein sit in the popliteal fossa posteriorly — the bottom of the axial image. A reliable posterior landmark on every plane.",
    from: { plane: "Sagittal PD-FS", dir: SAG, sliceIndex: 14, x: 66, y: 55, label: "Popliteal vessels" },
    to: {
      plane: "Axial T2-FS",
      dir: AXI,
      sliceIndex: 13,
      candidates: [
        { x: 55, y: 70 }, // popliteal vessels ✓
        { x: 50, y: 19 }, // patella
        { x: 32, y: 24 }, // MPFL
        { x: 50, y: 34 }, // trochlea
      ],
      answer: 0,
    },
  },
  {
    id: "xp-patella",
    prompt: "This is the patella on the axial. Find the patella on the sagittal.",
    explanation:
      "On the sagittal, the patella is the anterior bone with the quadriceps tendon above and the patellar tendon below — the extensor mechanism. Anterior is to the LEFT.",
    from: { plane: "Axial T2-FS", dir: AXI, sliceIndex: 13, x: 50, y: 19, label: "Patella" },
    to: {
      plane: "Sagittal PD-FS",
      dir: SAG,
      sliceIndex: 13,
      candidates: [
        { x: 16, y: 36 }, // patella ✓
        { x: 37, y: 48 }, // femoral condyle
        { x: 36.9, y: 64.5 }, // tibial plateau
        { x: 20, y: 68 }, // patellar tendon
      ],
      answer: 0,
    },
  },
  {
    id: "xp-medial-condyle",
    prompt:
      "This is the MEDIAL femoral condyle on the coronal (image-left). Find the medial femoral condyle on the axial - mind the side.",
    explanation:
      "Image-left is medial on BOTH planes. Behind the trochlea the two condyles flank the notch in cross-section - grab the medial (left) one, not the lateral. The mirror of the lateral drill; pick wrong and you mis-side a condylar lesion.",
    from: { plane: "Coronal PD-FS", dir: COR, sliceIndex: 7, x: 28.5, y: 45.9, label: "Medial femoral condyle" },
    to: {
      plane: "Axial T2-FS",
      dir: AXI,
      sliceIndex: 13,
      candidates: [
        { x: 37, y: 52 }, // Medial femoral condyle ✓
        { x: 63, y: 52 }, // Lateral femoral condyle
        { x: 50, y: 19 }, // Patella
        { x: 50, y: 34 }, // Femoral trochlea
      ],
      answer: 0,
    },
  },
  {
    id: "xp-acl-origin",
    prompt:
      "This is the ACL on the sagittal, attaching in the anterior intercondylar area. Find that region on the coronal - just in front of the central eminence.",
    explanation:
      "The ACL is volume-averaged on coronal, so localize it to the anterior intercondylar area, in front of and between the tibial spines - not on a condyle. The PCL inserts far posteriorly, not here. Don't mistake normal spines for a tibial eminence avulsion and overcall.",
    from: { plane: "Sagittal PD-FS", dir: SAG, sliceIndex: 12, x: 49, y: 55, label: "Anterior cruciate ligament" },
    to: {
      plane: "Coronal PD-FS",
      dir: COR,
      sliceIndex: 7,
      candidates: [
        { x: 48, y: 49 }, // Tibial spines / eminence ✓
        { x: 28.5, y: 45.9 }, // Medial femoral condyle
        { x: 66.6, y: 44.9 }, // Lateral femoral condyle
        { x: 27, y: 56 }, // Medial meniscus
      ],
      answer: 0,
    },
  },
  {
    id: "xp-patella-sag-axi",
    prompt:
      "This is the PATELLA on the sagittal - a teardrop anterior to the femur. Find the same patella on the axial, where tracking is judged.",
    explanation:
      "Rotate the sagittal teardrop 90 degrees and it becomes an inverted chevron, its median-ridge cartilage (thickest in the body) facing the trochlear groove. THE plane for tilt and lateral subluxation. Do not grab the trochlea - that is femur facing the patella.",
    from: { plane: "Sagittal PD-FS", dir: SAG, sliceIndex: 13, x: 16, y: 36, label: "Patella" },
    to: {
      plane: "Axial T2-FS",
      dir: AXI,
      sliceIndex: 13,
      candidates: [
        { x: 50, y: 19 }, // Patella ✓
        { x: 50, y: 34 }, // Femoral trochlea
        { x: 32, y: 24 }, // MPFL / medial retinaculum
        { x: 63, y: 52 }, // Lateral femoral condyle
      ],
      answer: 0,
    },
  },
  {
    id: "xp-marrow-t1",
    prompt:
      "This is FEMORAL CONDYLE marrow on the PD-FS. Find the same condyle on the T1 - same slice, switched sequence.",
    explanation:
      "Same shape, same plane - only the contrast flips. On T1 (no fat-sat) marrow fat is BRIGHT, which makes it the key sequence for marrow composition and anatomy. A discrete dark band raises concern for fracture; diffuse or focal replacement has a broad differential. Reading only the fat-suppressed sequence can overcall nonspecific bright marrow signal as traumatic edema.",
    from: { plane: "Sagittal PD-FS", dir: SAG, sliceIndex: 13, x: 37, y: 48, label: "Femoral condyle marrow" },
    to: {
      plane: "Sagittal T1",
      dir: SAG_T1,
      sliceIndex: 13,
      candidates: [
        { x: 34, y: 41 }, // Femoral condyle ✓
        { x: 37.5, y: 62 }, // Tibial plateau
        { x: 16, y: 36 }, // Patella
        { x: 20, y: 68 }, // Patellar tendon
      ],
      answer: 0,
    },
  },
  {
    id: "xp-condyle-axi-cor",
    prompt:
      "This is the LATERAL femoral condyle on the axial (image-right). Find the lateral femoral condyle on the coronal - mind the side.",
    explanation:
      "Image-right is lateral on both planes. The rounded condyle cross-section on axial maps to the lateral of two side-by-side condyles on coronal - grab the right one. Coronal MRI compares the compartments and overload pattern; quantify the true mechanical axis on standing hip-to-ankle radiographs.",
    from: { plane: "Axial T2-FS", dir: AXI, sliceIndex: 13, x: 63, y: 52, label: "Lateral femoral condyle" },
    to: {
      plane: "Coronal PD-FS",
      dir: COR,
      sliceIndex: 7,
      candidates: [
        { x: 66.6, y: 44.9 }, // Lateral femoral condyle ✓
        { x: 28.5, y: 45.9 }, // Medial femoral condyle
        { x: 48, y: 49 }, // Tibial spines
        { x: 69, y: 55 }, // Lateral meniscus
      ],
      answer: 0,
    },
  },
  {
    id: "xp-plateau-cor-sag",
    prompt:
      "This is the TIBIAL PLATEAU on the coronal - the top articular surface of the tibia. Find the same plateau on the sagittal, where you read it in profile.",
    explanation:
      "Coronal shows the plateau head-on (concave medial, convex lateral); rotate to sagittal and you see it edge-on, in PROFILE with anterior and posterior slopes. That profile is the view for posterior-slope and depression-fracture assessment.",
    from: { plane: "Coronal PD-FS", dir: COR, sliceIndex: 7, x: 40, y: 61.5, label: "Tibial plateau" },
    to: {
      plane: "Sagittal PD-FS",
      dir: SAG,
      sliceIndex: 13,
      candidates: [
        { x: 36.9, y: 64.5 }, // Tibial plateau ✓
        { x: 37, y: 48 }, // Femoral condyle
        { x: 16, y: 36 }, // Patella
        { x: 20, y: 68 }, // Patellar tendon
      ],
      answer: 0,
    },
  },
];

// ── Advanced challenge bank ──────────────────────────────────────────────────
// Higher-level, board-style questions for fellows who want to push past normal
// anatomy — measurements, normal variants that mimic pathology, secondary signs,
// grading/stability criteria, and technique pitfalls. Optional by design.

export const advancedChallenge: AdvancedQ[] = [
  {
    id: "caq-1",
    topic: "ACL — Segond fracture / associated injury",
    prompt: "A 19-year-old soccer player sustains a non-contact pivoting injury. Radiographs show a small vertically oriented cortical avulsion off the proximal lateral tibia just below the joint line. Which intra-articular injury is most strongly associated with this radiographic finding?",
    options: ["Anterior cruciate ligament tear", "Posterior cruciate ligament tear", "Quadriceps tendon rupture", "Lateral meniscus discoid variant"],
    answer: 0,
    explanation: "A vertical cortical avulsion of the lateral tibia just below the joint line is a Segond fracture, an avulsion of the anterolateral complex that is highly associated with ACL rupture. A reverse Segond is a different medial tibial-rim avulsion associated with a variable pattern of PCL, medial-meniscal, and medial/posteromedial injury; it does not explain this lateral fragment.",
  },
  {
    id: "caq-2",
    topic: "PCL — dashboard mechanism / next step",
    prompt: "A 28-year-old restrained front-seat passenger strikes the dashboard with a flexed knee in a head-on collision. He has a posterior sag of the tibia on exam and a posterior drawer is positive. Which MRI finding most directly demonstrates the suspected primary ligament injury?",
    options: ["Discontinuity and increased signal within the thick curved band in the posterior intercondylar notch", "A straight striated band paralleling Blumensaat's line that is wavy and lax", "Fluid signal at the posteromedial meniscocapsular junction", "A cortical avulsion at the anterolateral tibia"],
    answer: 0,
    explanation: "The dashboard mechanism drives the proximal tibia posteriorly and can tear the PCL, the thick curved low-signal band in the posterior notch. Fiber discontinuity with abnormal morphology establishes a tear; increased intrasubstance signal is supportive but not independently diagnostic. A wavy band along Blumensaat's line describes the ACL, and the anterolateral tibial avulsion is a Segond fracture associated with ACL injury.",
  },
  {
    id: "caq-3",
    topic: "Meniscus — bucket-handle / displaced fragment",
    prompt: "A 23-year-old with a locked knee that will not fully extend has a sagittal MRI showing a low-signal band lying anteriorly within the intercondylar notch, paralleling and just inferior to the PCL. Body-slice images show fewer than two consecutive meniscal bow-ties. What is the most likely diagnosis?",
    options: ["Bucket-handle meniscal tear with a displaced fragment", "Mucoid degeneration of the ACL", "Normal meniscofemoral ligament of Humphry", "Cyclops lesion after ACL reconstruction"],
    answer: 0,
    explanation: "A displaced inner meniscal fragment lying in the notch inferior and parallel to the PCL produces the double-PCL sign. Fewer than two consecutive body segments on standard-thickness images is a supportive absent-bow-tie sign, but the diagnosis rests on tracing the displaced fragment and donor site across planes. The meniscofemoral ligament of Humphry is a thinner normal band anterior to the PCL and should be traced to its expected attachments.",
  },
  {
    id: "caq-4",
    topic: "Meniscal root tear — two-slice-touch / extrusion",
    prompt: "A 56-year-old reports a pop while rising from a squat and now has medial joint-line pain. Coronal MRI shows the medial meniscus body displaced 5 mm beyond the tibial margin, and the posterior horn near the root appears truncated. Which feature most reliably supports a posterior medial meniscal root tear?",
    options: ["Coronal extrusion of 5 mm with a truncated (ghost) posterior root", "Intrasubstance grade 2 signal not reaching a surface", "A double-PCL sign in the notch", "A parameniscal cyst at the anterior horn"],
    answer: 0,
    explanation: "Medial coronal extrusion of at least 3 mm plus an absent/truncated root is highly suggestive of a posterior medial root tear. A complete root-disrupting tear can abolish hoop-stress function; a cadaveric medial-root model approached total medial-meniscectomy contact mechanics, but that comparison is not universal for every root abnormality.",
  },
  {
    id: "caq-5",
    topic: "Cartilage / OCD stability",
    prompt: "A 15-year-old gymnast has an osteochondritis dissecans lesion at the lateral aspect of the medial femoral condyle. On fluid-sensitive fat-suppressed images, which finding would most specifically indicate instability and prompt specialist treatment planning?",
    options: ["A fluid-equivalent rim with an outer low-signal rim, multiple subchondral-plate breaks, or multiple/large (>5 mm) interface cysts", "Mild marrow edema in the parent bone deep to the lesion", "An isolated high-T2 interface line without another instability sign", "An en-face fragment diameter of 6 mm with intact overlying cartilage"],
    answer: 0,
    explanation: "Juvenile OCD requires age-specific criteria because an isolated T2-bright rim often represents vascular granulation tissue. A fluid-equivalent rim with an outer low-signal rim, multiple subchondral-plate breaks, multiple or >5 mm cysts, cartilage breach, or displacement is more specific for instability.",
  },
  {
    id: "caq-6",
    topic: "SIF vs systemic osteonecrosis / marrow",
    prompt: "A 65-year-old woman has sudden atraumatic medial knee pain. MRI shows a subchondral low-signal line in the weight-bearing medial femoral condyle paralleling and concave toward the articular surface, with surrounding diffuse marrow edema. What is the best diagnosis?",
    options: ["Subchondral insufficiency fracture", "Systemic osteonecrosis with a serpiginous epiphyseal infarct", "Transient bone marrow edema syndrome", "Medial femoral condyle osteochondroma"],
    answer: 0,
    explanation: "A subchondral fracture line paralleling the articular surface with adjacent edema-like signal in an older patient with atraumatic pain supports a subchondral insufficiency fracture (SIF). Systemic osteonecrosis more often shows a serpiginous geographic rim/double-line pattern around an epiphyseal infarct, so morphology and clinical risk factors should be interpreted together.",
  },
  {
    id: "caq-7",
    topic: "Patellar dislocation / MPFL management",
    prompt: "A 16-year-old sustains a first-time lateral patellar dislocation that has spontaneously reduced. MRI shows an inferomedial patellar facet and anterolateral femoral condyle bone bruise and an MPFL tear, with no displaced osteochondral fragment and a TT-TG distance of 12 mm. What is the most appropriate initial management?",
    options: ["Nonoperative rehabilitation with bracing and quadriceps strengthening", "Acute MPFL reconstruction with tibial tubercle osteotomy", "Lateral retinacular release alone", "Immediate patellectomy"],
    answer: 0,
    explanation: "A first-time dislocation without a displaced osteochondral fragment and without a markedly elevated modality-appropriate TT-TG commonly begins with nonoperative rehabilitation. The classic 20 mm cutoff is CT-derived, and no single MRI measurement independently determines tibial-tubercle surgery.",
  },
  {
    id: "caq-8",
    topic: "Posterolateral corner — combined injury / graft failure",
    prompt: "A 27-year-old has an MRI-confirmed posterolateral corner injury with fibular collateral ligament, popliteus, and popliteofibular ligament disruption after a varus hyperextension blow. The surgeon plans cruciate reconstruction. Why is recognizing and addressing this posterolateral corner injury before isolated cruciate surgery most important?",
    options: ["Unrecognized posterolateral-corner injury can leave rotational/varus instability that overloads a cruciate graft", "Posterolateral-corner injuries reliably heal nonoperatively, so cruciate surgery can simply be delayed", "The posterolateral corner has no effect on cruciate graft loading once the cruciate is reconstructed", "Posterolateral-corner injuries occur in isolation, so they rarely change the surgical plan"],
    answer: 0,
    explanation: "The posterolateral corner restrains varus and external rotation. A missed combined injury can leave residual laxity that overloads a cruciate graft and compromises reconstruction. PLC injury grade, chronicity, alignment, examination, and the complete multiligament pattern determine whether and how it is addressed operatively.",
  },
  {
    id: "cruciates-1",
    topic: "Cruciate ligaments (ACL/PCL)",
    prompt: "A 24-year-old presents after a pivoting injury. Sagittal MRI shows the ACL is poorly visualized. To use the posterior cruciate ligament (PCL) line sign as a secondary indicator of ACL tear, you draw a line along the straight distal segment of the PCL and extend it proximally and anteriorly. In an intact knee, where should this line intersect?",
    options: ["It should intersect the femur, crossing the distal femoral metaphysis/medullary canal", "It should intersect the tibial plateau just anterior to the tibial tubercle", "It should fail to intersect the femur and instead pass anterior to it", "It should intersect the patella at its lower pole"],
    answer: 0,
    explanation: "Normally the extended PCL line intersects the femoral medullary cavity; with a torn ACL the PCL becomes more buckled/redundant (more sharply curved) from anterior tibial translation, so the line falls short and fails to intersect the femur (a positive sign). It is a secondary sign best combined with primary findings.",
  },
  {
    id: "cruciates-2",
    topic: "Cruciate ligaments (ACL/PCL)",
    prompt: "On MRI you measure anterior tibial translation at the midsagittal plane of the lateral femoral condyle, using lines through the posterior lateral-femoral-condyle and lateral-tibial-plateau margins. Which threshold was completely specific for ACL tear in the original validation cohort and remains a strong secondary sign?",
    options: ["≥ 1 mm", "≥ 3 mm", "≥ 7 mm", "≥ 15 mm"],
    answer: 2,
    explanation: "In the original study, at least 5 mm had 93% specificity and 58% sensitivity for ACL tear, while every knee with at least 7 mm had a torn ACL. Translation remains a secondary sign whose value depends on the stated measurement method; directly assess ACL continuity, morphology, and the rest of the injury pattern.",
  },
  {
    id: "cruciates-3",
    topic: "Cruciate ligaments (ACL/PCL)",
    prompt: "A 52-year-old with chronic, atraumatic knee pain has an ACL that is diffusely thickened and ill-defined with intermediate-to-high T2 signal, yet the individual fibers remain continuous and parallel, producing a 'celery-stalk' appearance. There is often an associated finding in the adjacent bone. Which is the single best diagnosis and its characteristic associated feature?",
    options: ["Acute complete ACL tear with a Segond fracture of the lateral tibia", "ACL mucoid degeneration, frequently associated with subchondral/intraosseous ganglion cysts at the tibial or femoral attachment", "ACL graft impingement with a cyclops lesion in Hoffa's fat pad", "ACL ganglion arising from the PCL with a deep lateral femoral notch sign"],
    answer: 1,
    explanation: "Mucoid degeneration shows a thickened ACL with continuous, intact fibers ('celery stalk' / increased signal but preserved striations) and is commonly accompanied by intraosseous ganglion cysts at the ligament insertions — distinguishing it from a tear, where fibers are discontinuous.",
  },
  {
    id: "cruciates-4",
    topic: "Cruciate ligaments (ACL/PCL)",
    prompt: "Reviewing the radiograph and MRI of an acute knee injury, you identify a deep lateral femoral notch (terminal/condylopatellar sulcus). Beyond simply suggesting an ACL tear, an abnormally deep notch is considered a useful marker. Which depth threshold is the accepted cutoff that strongly suggests an associated ACL injury?",
    options: ["Greater than 0.5 mm", "Greater than 1.5 mm", "Greater than 4 mm", "Greater than 8 mm"],
    answer: 1,
    explanation: "Greater than 1.5 mm is the classic lateral-radiograph threshold for a deep lateral femoral sulcus associated with ACL injury. On MRI, describe the impaction morphology and use it as a secondary sign rather than transferring the radiographic measurement as a standalone diagnostic rule.",
  },
  {
    id: "menisci-1",
    topic: "Menisci",
    prompt: "On sagittal MR images with 4-5 mm slice thickness, which finding most reliably distinguishes a discoid lateral meniscus from a normal lateral meniscus?",
    options: ["A minimum coronal body width of 6-8 mm on the central coronal image", "The 'bow-tie' (continuous body) appearance on 3 or more contiguous sagittal slices", "Absence of the normal meniscofemoral ligament on the Wrisberg side", "Increased intrameniscal grade 2 signal in the posterior horn"],
    answer: 1,
    explanation: "A normal meniscus shows the contiguous 'bow-tie' body on at most 2 consecutive 4-5 mm sagittal slices; 3 or more contiguous bow-tie segments (or a central coronal width >15 mm, or a meniscal-to-tibial-width ratio >20%) indicates a discoid meniscus.",
  },
  {
    id: "menisci-2",
    topic: "Menisci",
    prompt: "A 58-year-old has acute medial knee pain. Coronal MRI shows the posterior root signal disrupted with the meniscal body displaced 4 mm beyond the tibial margin. Regarding the 3 mm extrusion threshold for a medial meniscal posterior root tear, which statement is most accurate?",
    options: ["The 3 mm threshold defines major medial extrusion and is a useful but imperfect clue; it neither proves nor excludes a root tear", "The 3 mm threshold is both highly sensitive and highly specific for root tears", "Extrusion is best and most reproducibly measured on sagittal rather than coronal images", "Meniscal extrusion of this degree is a normal finding and requires no root evaluation"],
    answer: 0,
    explanation: "Coronal medial extrusion ≥3 mm is a common major-extrusion threshold and a useful search trigger, but it is not diagnostic by itself. A smaller value does not exclude a root tear. Exclude osteophytes from the reference margin and assess the root directly in multiple planes.",
  },
  {
    id: "menisci-3",
    topic: "Menisci",
    prompt: "During ACL reconstruction planning, you are asked about a suspected ramp lesion. Which statement is most accurate regarding its MRI and arthroscopic evaluation?",
    options: ["It is a radial tear of the posterior horn lateral meniscus best seen on coronal images", "Standard anterior-portal arthroscopy reliably visualizes it, so MRI adds little", "Fluid signal between the posterior horn medial meniscus and the joint capsule on fluid-sensitive sequences is a key sign, and the lesion is frequently missed without posteromedial probing", "It is defined as extrusion of the medial meniscus body greater than 5 mm"],
    answer: 2,
    explanation: "A ramp lesion is a tear at the posteromedial meniscocapsular junction; high T2 fluid signal/edema posterior to the posterior horn raises suspicion, and a substantial proportion are missed on standard anterior-portal viewing without a posteromedial (trans-notch) probing approach.",
  },
  {
    id: "menisci-4",
    topic: "Menisci",
    prompt: "On sagittal MRI you see an apparent cleft where a meniscofemoral ligament leaves the posterior horn of the lateral meniscus and courses toward the PCL. Which feature best supports a normal meniscofemoral-ligament interface rather than a true posterior-horn tear?",
    options: ["A thin low-signal band can be followed from the posterior horn toward the PCL, with a smooth interface and no independent meniscal defect", "A surface-reaching meniscal defect persists on matching images and is accompanied by abnormal meniscal morphology", "A displaced fragment is present in the intercondylar notch", "A parameniscal cyst communicates with the apparent cleft"],
    answer: 0,
    explanation: "Humphry and Wrisberg ligaments can create a normal pseudotear where they separate from the lateral posterior horn. Trace the low-signal ligament to the PCL/femur in multiple planes and look for a smooth meniscal contour. A reproducible surface-reaching defect, altered morphology, displaced tissue, or a communicating cyst favors a true tear; no universal four-slice cutoff replaces that correlation.",
  },
  {
    id: "cartilage-1",
    topic: "Cartilage & osteochondral",
    prompt: "A 16-year-old soccer player has a juvenile osteochondritis dissecans (OCD) lesion at the classic lateral aspect of the medial femoral condyle. On fluid-sensitive fat-suppressed sequences, which finding is MOST specific for an UNSTABLE fragment?",
    options: ["A thin interface line without another instability sign", "A joint-fluid-equivalent rim with an outer low-signal rim or multiple subchondral-plate breaks", "Mild bone-marrow edema in the parent bone deep to the lesion", "An en-face fragment diameter measuring 6 mm with intact overlying cartilage"],
    answer: 1,
    explanation: "In juvenile OCD, an isolated bright interface line is unreliable. A joint-fluid-equivalent rim with an outer low-signal rim, multiple subchondral-plate breaks, multiple or >5 mm cysts, cartilage breach, or displacement is more specific for instability.",
  },
  {
    id: "cartilage-2",
    topic: "Cartilage & osteochondral",
    prompt: "When applying the De Smet MRI criteria for OCD fragment instability, the SPECIFICITY of a T2-bright line at the fragment-parent interface improves substantially when which additional qualifier is present?",
    options: ["The patient is skeletally immature with open physes", "The high-signal line is matched by a breach (defect) in the overlying articular cartilage on fluid-sensitive images", "The lesion is located in the patellofemoral compartment", "The fragment measures less than 5 mm in greatest dimension"],
    answer: 1,
    explanation: "In skeletally immature patients a T2-bright interface line frequently reflects vascular granulation tissue rather than fluid, lowering specificity; instability is far more reliable when that line is accompanied by a discontinuity in the overlying cartilage, confirming communication with the joint.",
  },
  {
    id: "cartilage-4",
    topic: "Cartilage & osteochondral",
    prompt: "A surgeon asks you to distinguish chondral DELAMINATION from a simple partial-thickness fissure on knee MRI. Which finding is MOST characteristic of delamination?",
    options: ["A linear high-signal cleft extending perpendicularly from the articular surface into but not through the cartilage", "A fluid-signal line at the cartilage-bone (osteochondral) junction with the overlying cartilage surface still intact", "Focal full-thickness cartilage loss with exposed but intact subchondral bone plate (ICRS grade 3C; modified Outerbridge IV)", "Diffuse intrachondral T2 hyperintensity without a discrete defect"],
    answer: 1,
    explanation: "Delamination is a shear separation of cartilage from subchondral bone at the deep tidemark/calcified-cartilage zone, seen as a fluid-signal line paralleling the bone with a deceptively intact articular surface; it can be missed at arthroscopic probing of the surface.",
  },
  {
    id: "patellofemoral-1",
    topic: "Patellofemoral & extensor",
    prompt: "A sports-medicine fellow measures a TT-TG distance of 22 mm on axial MRI in recurrent lateral patellar instability. Which interpretation is most accurate?",
    options: ["It is normal on every MRI protocol", "It mandates tibial tubercle medialization by itself", "It is elevated, but must be reported with the MRI method and integrated with modality-appropriate references and the rest of the instability anatomy", "TT-TG cannot be measured on MRI"],
    answer: 2,
    explanation: "The classic >20 mm threshold is CT-derived. MRI commonly yields lower values, but the difference depends on landmarks, slice selection, knee position, and protocol. A 22 mm MRI value is elevated, yet it remains one risk factor and never mandates an operation by itself.",
  },
  {
    id: "patellofemoral-2",
    topic: "Patellofemoral & extensor",
    prompt: "On a true lateral radiograph, which patella-alta index avoids patellar-tendon length by comparing the inferior patellar articular margin with the anterosuperior tibial plateau?",
    options: ["Insall-Salvati ratio", "Caton-Deschamps index", "Blackburne-Peel index measured to the patellar tendon insertion", "Modified Insall-Salvati ratio measured to the inferior pole of the patella"],
    answer: 1,
    explanation: "The Caton-Deschamps index divides the distance from the inferior patellar articular margin to the anterosuperior tibial plateau by patellar articular-surface length; a radiographic value above 1.2 supports patella alta. It was developed for true lateral radiographs. If an MRI-based method is used, state the method and apply MRI-validated reference values rather than silently transferring a radiographic cutoff.",
  },
  {
    id: "patellofemoral-3",
    topic: "Patellofemoral & extensor",
    prompt: "On a true lateral knee radiograph, the 'crossing sign' refers to which finding indicating a flat or shallow trochlea?",
    options: ["The line of the trochlear floor crosses the anterior cortex of the lateral femoral condyle", "The patellar tendon crosses the physeal scar at the level of the tibial tubercle", "The medial and lateral trochlear facet lines cross at the superior pole of the patella", "The supratrochlear spur crosses the Blumensaat line"],
    answer: 0,
    explanation: "The crossing sign is present when the radiographic line representing the trochlear floor crosses the anterior cortex of the lateral femoral condyle, indicating loss of normal groove depth. A supratrochlear spur and double contour are additional Dejour radiographic signs. On MRI, assess trochlear morphology directly on appropriate axial and sagittal images with method-specific measurements.",
  },
  {
    id: "patellofemoral-4",
    topic: "Patellofemoral & extensor",
    prompt: "A 16-year-old presents after a transient lateral patellar dislocation. Beyond the classic medial patellar and lateral femoral condyle bone bruise pattern and MPFL injury, which additional finding is a well-described NORMAL VARIANT of the patella that should NOT be mistaken for an osteochondral injury or osteomyelitis?",
    options: ["Dorsal defect of the patella in the superolateral quadrant", "Bipartite patella fragment in the inferomedial pole", "Osteochondral fracture of the median ridge", "Avulsion at the adductor tubercle MPFL origin"],
    answer: 0,
    explanation: "The dorsal defect of the patella is a benign subchondral lucency in the superolateral quadrant of the patella with intact overlying cartilage on MRI; recognizing the intact cartilage and typical location prevents misdiagnosis as an osteochondral lesion or infection. In lateral patellar dislocation the MPFL can tear at its patellar attachment, its femoral (adductor tubercle) attachment, or both — the tear site is variable.",
  },
  {
    id: "corners-1",
    topic: "Collaterals & posterolateral corner",
    prompt: "On a coronal MRI of an acutely injured knee, you identify a small avulsion fragment from the posterior-medial fibular styloid, the classic 'arcuate sign.' Which insertions most directly localize to this small-fragment pattern?",
    options: ["Popliteofibular and arcuate-ligament insertions", "The lateral fibular-head conjoined FCL/biceps-femoris insertion", "The iliotibial-band insertion at Gerdy tubercle", "The lateral head of gastrocnemius alone"],
    answer: 0,
    explanation: "The popliteofibular and arcuate ligaments attach to the posterior/medial fibular styloid and produce the classic small-fragment pattern. The FCL and biceps femoris attach together farther lateral, anterior, and inferior; their avulsion tends to be larger with broader proximal-fibular edema. Either pattern should trigger a complete PLC, cruciate, proximal-tibiofibular-joint, and peroneal-nerve assessment.",
  },
  {
    id: "corners-2",
    topic: "Collaterals & posterolateral corner",
    prompt: "A fellow shows you a coronal proton-density image with ossification along the expected course of the proximal MCL, paralleling the medial femoral condyle, in a patient with a remote valgus injury and no acute edema. To distinguish a healed grade I-II MCL injury (Pellegrini-Stieda) from an acute deep MCL tear, which feature most reliably indicates the chronic, healed process?",
    options: ["Curvilinear ossification at the femoral origin without surrounding marrow or soft-tissue edema", "Fluid signal interposed between the deep MCL and the medial meniscus", "A wavy, lax superficial MCL with surrounding T2-hyperintense fluid", "High T2 signal tracking along the meniscofemoral and meniscotibial ligaments"],
    answer: 0,
    explanation: "Pellegrini-Stieda describes post-traumatic ossification/calcification near the medial femoral condyle, commonly related to the proximal MCL complex. Mature corticated mineralization without adjacent edema supports a chronic process; radiographs help confirm mineralization, and acute-on-chronic injury still requires assessment of the fibers and surrounding soft tissues.",
  },
  {
    id: "corners-3",
    topic: "Collaterals & posterolateral corner",
    prompt: "When grading a medial collateral ligament injury on MRI for a sports-medicine fellow, which finding is MOST consistent with a high-grade (grade III) complete tear rather than a grade II partial injury?",
    options: ["Complete discontinuity of the superficial MCL fibers with fluid spanning the full ligament width and a wavy, retracted free edge", "Edema superficial to an intact, thickened MCL with preserved continuous low-signal fibers", "Periligamentous edema with partial fiber thickening but no fluid-filled defect", "Increased T2 signal within the deep MCL with intact superficial fibers"],
    answer: 0,
    explanation: "Grade III is defined by complete fiber discontinuity with a fluid-filled gap and often a wavy/retracted ligament, whereas grade I shows only periligamentous edema over intact fibers and grade II shows partial-thickness fiber disruption or thickening with preserved continuity.",
  },
  {
    id: "corners-4",
    topic: "Collaterals & posterolateral corner",
    prompt: "On axial and sagittal MRI at the level of the lateral knee, you trace a tendon to the fibular head, where it blends with the fibular (lateral) collateral ligament to form a 'conjoined tendon.' Recognizing this conjoined insertion is key because injury here implicates posterolateral instability. Which structure forms this conjoined insertion with the fibular collateral ligament?",
    options: ["The biceps femoris tendon, whose long-head direct and anterior arms blend with the FCL at the fibular head", "The iliotibial band, which inserts at Gerdy tubercle on the lateral tibia and does not conjoin with the FCL", "The popliteus tendon, which passes deep to the FCL to insert on the lateral femoral condyle", "The lateral patellar retinaculum, which extends to the fibular head"],
    answer: 0,
    explanation: "The long head of the biceps femoris and the fibular (lateral) collateral ligament merge into a conjoined tendon at the fibular head; the IT band inserts separately at Gerdy tubercle and the popliteus inserts on the femur, so recognizing the conjoined insertion helps localize posterolateral corner injury.",
  },
  {
    id: "marrow-1",
    topic: "Bone marrow & fractures",
    prompt: "A 24-year-old presents after a non-contact pivoting injury. MRI shows ACL discontinuity. Which paired distribution is the characteristic pivot-shift contusion pattern?",
    options: ["Posterolateral tibial plateau and mid-lateral femoral condyle (near the terminal sulcus)", "Anteromedial femoral condyle and anteromedial tibial plateau", "Posteromedial tibial plateau and medial femoral condyle", "Anterior tibia and anterior femur with patellar contusion"],
    answer: 0,
    explanation: "The pivot-shift (a valgus load on the flexed knee with rotation and anterior translation) drives the posterolateral tibial plateau against the mid-portion of the lateral femoral condyle at the condylopatellar (terminal) sulcus, producing the kissing contusions highly associated with ACL tears. A reciprocal posteromedial tibial plateau bruise from the tibia snapping back is a secondary sign. (The exact rotation direction is described inconsistently — the injury source describes external tibial rotation, the clinical pivot-shift test internal — so 'valgus with rotation' is the safe phrasing.)",
  },
  {
    id: "marrow-2",
    topic: "Bone marrow & fractures",
    prompt: "A 67-year-old woman has acute medial knee pain without trauma. MRI shows a subchondral focus in the weight-bearing medial femoral condyle. Which finding most strongly favors subchondral insufficiency fracture (SIF) over systemic osteonecrosis?",
    options: ["A subchondral T2-hypointense/low-signal line that is concave toward and roughly parallel to the subchondral plate, with adjacent diffuse marrow edema", "A serpentine double-line sign enclosing a fat-signal center remote from the articular surface", "Geographic fat-equivalent marrow signal bounded by a sclerotic rim", "Diffuse homogeneous marrow edema with no discrete line and an intact cortex"],
    answer: 0,
    explanation: "SIF is supported by a subchondral low-signal fracture line paralleling the articular surface with surrounding edema-like signal. Systemic osteonecrosis more often has a serpiginous geographic rim/double-line pattern and relevant risk factors. Report the dimensions of the low-signal subchondral zone and any articular flattening or collapse because those features carry prognostic value.",
  },
  {
    id: "marrow-3",
    topic: "Bone marrow & fractures",
    prompt: "A 31-year-old marathon runner has knee MRI showing symmetric patchy T1-intermediate marrow in the distal femoral and proximal tibial metadiaphyses. Which T1 relationship most strongly supports benign red-marrow reconversion rather than a marrow-replacing process?",
    options: ["Higher signal than adjacent skeletal muscle but lower than subcutaneous fat", "Markedly lower signal than skeletal muscle", "The same signal as joint fluid", "Complete loss of all internal fat signal"],
    answer: 0,
    explanation: "Red marrow retains interspersed fat, so on T1 it should remain brighter than skeletal muscle while staying darker than subcutaneous fat. Symmetry and an expected distribution support reconversion; signal at or below muscle, aggressive focal morphology, cortical change, or an atypical asymmetric pattern raises concern for replacement and requires clinical correlation.",
  },
  {
    id: "marrow-4",
    topic: "Bone marrow & fractures",
    prompt: "After an acute lateral patellar dislocation that has spontaneously reduced, which combination of marrow contusions on MRI is the characteristic signature of this mechanism?",
    options: ["Inferomedial patellar facet and anterolateral femoral condyle (lateral aspect)", "Superolateral patella and posteromedial tibial plateau", "Lateral patellar facet and lateral tibial plateau", "Medial patellar facet and medial femoral condyle"],
    answer: 0,
    explanation: "As the patella dislocates laterally and relocates, the medial patellar facet impacts the anterolateral (lateral) femoral condyle, producing edema at both sites along with medial patellofemoral ligament (MPFL) injury (tear site variable — patellar, femoral, or both). Recognizing this bruise pattern lets you infer a transient dislocation even when the patella is reduced.",
  },
  {
    id: "technique-1",
    topic: "MRI technique & artifacts",
    prompt: "On a sagittal intermediate-TE PD sequence, the posterior horn of the lateral meniscus shows a focal increase in internal signal that does not extend to an articular surface. The signal is most conspicuous where the meniscus curves and the collagen fibers are oriented near 55 degrees to the main magnetic field. Which feature most reliably distinguishes this magic-angle phenomenon from a true intrasubstance degeneration/tear?",
    options: ["The signal reaches an articular surface on at least one image", "The increased signal disappears or markedly decreases on a long-TE (T2-weighted) sequence", "The signal is brightest on the fat-suppressed T2 image", "The signal is associated with a parameniscal cyst"],
    answer: 1,
    explanation: "Magic-angle signal arises when ordered collagen lies near 55 degrees to the main field and is most conspicuous at short/intermediate TE; it markedly decreases at longer TE. A non-surface-reaching focus that fades on T2 favors artifact, while a tear requires reproducible surface communication or definite morphologic disruption with multiplanar correlation.",
  },
  {
    id: "technique-2",
    topic: "MRI technique & artifacts",
    prompt: "A sagittal PD image of the knee shows a thin, sharply defined low-signal line paralleling the high-signal articular cartilage surface, mimicking a delamination or a surface fissure. The line is most pronounced at high-contrast interfaces and its position shifts if the phase- and frequency-encoding directions are swapped. What is the most effective way to reduce this truncation (Gibbs) artifact?",
    options: ["Decrease the receiver bandwidth", "Increase the matrix size (more phase-encoding steps) to improve spatial resolution", "Add fat suppression", "Increase the echo train length"],
    answer: 1,
    explanation: "Truncation (Gibbs ringing) results from finite sampling of high-contrast edges and produces parallel lines that can mimic cartilage or meniscal abnormality; increasing the matrix/spatial resolution narrows the oscillations and reduces the artifact. It is most pronounced along the phase-encode direction and shifts when the encoding axes are swapped.",
  },
  {
    id: "technique-3",
    topic: "MRI technique & artifacts",
    prompt: "After ACL reconstruction with an interference screw, fluid-sensitive images near the tibial tunnel are degraded by susceptibility artifact obscuring the graft. Which single parameter change does the MOST to reduce metallic susceptibility distortion?",
    options: ["Increasing the receiver bandwidth", "Switching from fast spin-echo to gradient-echo acquisition", "Using spectral (chemical-shift selective) fat saturation instead of STIR", "Increasing the echo time (TE)"],
    answer: 0,
    explanation: "Higher receiver bandwidth shortens the readout and compresses the per-pixel frequency shift, directly reducing metal-induced geometric distortion and signal pile-up. Gradient-echo worsens susceptibility, spectral fat-sat fails near metal (favoring STIR/Dixon), and longer TE increases dephasing.",
  },
  {
    id: "technique-4",
    topic: "MRI technique & artifacts",
    prompt: "On a coronal fat-suppressed T2 image of the knee, the marrow on the lateral side of the field appears bright and inhomogeneously 'unsuppressed,' while the medial side is well suppressed. There is no corresponding finding on T1. What is the most likely explanation for this fat-suppression failure?",
    options: ["Bone marrow edema from a stress reaction", "B0 field inhomogeneity at the periphery causing the fat resonance to fall outside the saturation band", "A true infiltrative marrow process", "Chemical-shift artifact of the second kind"],
    answer: 1,
    explanation: "Spectral fat saturation depends on B0 homogeneity; toward the edges of the FOV (or near large off-isocenter curvature) the fat peak drifts and is incompletely saturated, producing regional 'failed' fat-sat that mimics marrow signal but has no T1 correlate. STIR or Dixon techniques, which are insensitive to B0 inhomogeneity, are the remedy.",
  },
  {
    id: "measurements-3",
    topic: "Measurements & normal values",
    prompt: "On a true lateral radiograph, which Insall-Salvati ratio supports patella alta?",
    options: [">1.2", ">0.8", ">1.0", ">2.0"],
    answer: 0,
    explanation: "On a true lateral radiograph, an Insall-Salvati ratio (patellar tendon length divided by patellar length) above 1.2 supports patella alta; below 0.8 supports patella baja. MRI can use patellar-height measurements, but the report should name the method and use modality-appropriate technique and reference values.",
  },
];

export const normalKneeLearn: Record<string, PlaneLearn> = {
  // ─────────────────────────────────────────────────────────────────────────
  // SAGITTAL PD-FS  (stack: normal-knee-sagittal, 29 slices; notch ~ index 13)
  // ─────────────────────────────────────────────────────────────────────────
  "sag-pdfs": {
    tour: [
      {
        sliceIndex: 13,
        markers: [],
        title: "Get oriented",
        note: "Sagittal PD fat-sat. Anterior is to the LEFT, posterior to the RIGHT; fluid is bright, fat is suppressed. As the slice number increases, this stack scrolls lateral → medial. This slice is through the intercondylar notch — the deepest part of the joint.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 37, y: 48, label: "Femoral condyle" }],
        title: "Femoral condyle",
        note: "The large rounded bone with smooth low-signal cortex and bright fatty marrow. Its articular surface should be covered by a thin, even layer of cartilage.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 36.9, y: 64.5, label: "Tibial plateau" }],
        title: "Tibial plateau",
        note: "The flat top of the tibia below the joint line. Assess marrow on T1/non-fat-suppressed and fluid-sensitive images together; a discrete low-signal subchondral line raises concern for fracture but still requires morphologic and multiplanar correlation.",
      },
      {
        sliceIndex: 13,
        markers: [
          { x: 14, y: 22, label: "Quadriceps tendon" },
          { x: 16, y: 36, label: "Patella" },
        ],
        title: "Extensor mechanism — top",
        note: "The quadriceps tendon (striated, multi-layered) inserts on the superior pole of the patella. Trace it down to the patella, then to the patellar tendon below.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 20, y: 68, label: "Patellar tendon" }],
        title: "Patellar tendon",
        note: "Runs from the inferior pole of the patella to the tibial tubercle — uniformly low signal and a few mm thick. Hoffa's fat pad sits just behind it.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 24, y: 60, label: "Hoffa's (infrapatellar) fat pad" }],
        title: "Hoffa's fat pad",
        note: "The fat behind the patellar tendon and in front of the joint. Edema-like signal here is nonspecific and can reflect trauma, synovitis, postoperative change, or an impingement pattern depending on its distribution and the clinical context.",
      },
      {
        sliceIndex: 8,
        markers: [
          { x: 40, y: 61, label: "Anterior horn (lateral meniscus)" },
          { x: 61, y: 59.2, label: "Posterior horn (lateral meniscus)" },
        ],
        title: "Meniscus — the dark bow-ties",
        note: "This is the LATERAL compartment: on a sagittal compartment slice the meniscus appears as two low-signal triangles (anterior and posterior horns). Surface-reaching signal on two or more matching images favors a tear; the images need not be contiguous and may be in different planes. Three normal lateral-meniscus relationships mimic tears: the transverse (intermeniscal) ligament at the anterior horn, the meniscofemoral ligament (Humphry/Wrisberg) at the posterior horn, and the popliteal hiatus/popliteomeniscal fascicles posterolaterally near the popliteus tendon. Trace the band or hiatus across adjacent slices before calling a tear.",
      },
      {
        sliceIndex: 7,
        markers: [{ x: 61.3, y: 50.8, label: "Articular cartilage / joint fluid" }],
        title: "Cartilage & joint fluid",
        note: "Cartilage is the smooth intermediate-signal layer on the bone ends; a thin bright rim of joint fluid outlines it. A small amount of fluid is normal.",
      },
      {
        sliceIndex: 12,
        markers: [{ x: 49, y: 55, label: "Anterior cruciate ligament" }],
        title: "Anterior cruciate ligament",
        note: "On this lateral notch slice the ACL is the oblique, striated band running from the lateral femoral condyle toward the anterior tibial intercondylar area. It generally parallels the roof of the notch (Blumensaat line) and is more fibrillar than the smooth, dark PCL. It is partly volume-averaged on any one image, so trace it across adjacent slices and correlate all planes before calling it intact or torn.",
      },
      {
        sliceIndex: 16,
        markers: [{ x: 50, y: 47, label: "Posterior cruciate ligament" }],
        title: "Posterior cruciate ligament",
        note: "The PCL is a smooth, continuous low-signal band arcing through the posterior notch — a thick, dark, curved structure on this midline slice. Loss of its smooth arc suggests injury.",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 66, y: 55, label: "Popliteal vessels" }],
        title: "Popliteal vessels",
        note: "The popliteal artery and vein run vertically in the popliteal fossa behind the joint — a useful posterior landmark. Don't mistake the flow-related signal for pathology.",
      },
    ],
    quiz: [
      {
        id: "sag-sid-1",
        sliceIndex: 12,
        marker: { x: 49, y: 55 },
        prompt: "What is the straight striated band marked here, paralleling the roof of the intercondylar notch?",
        options: ["Anterior cruciate ligament", "Posterior cruciate ligament", "Meniscofemoral ligament", "Posterior joint capsule"],
        answer: 0,
        explanation: "On this lateral notch slice, the oblique striated band running from the lateral femoral condyle toward the anterior tibial intercondylar area is the ACL. The PCL is smoother, darker, more sharply curved, and sits farther posteriorly and medially. Trace the ACL across adjacent slices and correlate all planes rather than judging it from this image alone.",
      },
      {
        id: "sag-q1",
        sliceIndex: 13,
        marker: { x: 37, y: 48 },
        prompt: WHAT,
        options: ["Femoral condyle", "Patella", "Tibial plateau", "Fabella"],
        answer: 0,
        explanation: "The large rounded bone forming the top of the joint, with low-signal cortex and bright fatty marrow, is the femoral condyle.",
      },
      {
        id: "sag-q2",
        sliceIndex: 7,
        marker: { x: 42, y: 70 },
        prompt: WHAT,
        options: ["Femoral condyle", "Tibial plateau", "Patella", "Fibular head"],
        answer: 1,
        explanation: "The flat bone below the joint line is the tibial plateau (proximal tibia).",
      },
      {
        id: "sag-q3",
        sliceIndex: 13,
        marker: { x: 16, y: 36 },
        prompt: WHAT,
        options: ["Patella", "Femoral condyle", "Quadriceps tendon", "Tibial tubercle"],
        answer: 0,
        explanation: "The anterior bone at the front of the knee, with marrow signal, is the patella.",
      },
      {
        id: "sag-q4",
        sliceIndex: 13,
        marker: { x: 14, y: 22 },
        prompt: WHAT,
        options: ["Quadriceps tendon", "Patellar tendon", "Iliotibial band", "Prepatellar bursa"],
        answer: 0,
        explanation: "The striated multi-layered tendon inserting on the superior pole of the patella is the quadriceps tendon.",
      },
      {
        id: "sag-q5",
        sliceIndex: 13,
        marker: { x: 20, y: 68 },
        prompt: WHAT,
        options: ["Patellar tendon", "Quadriceps tendon", "ACL", "Popliteus tendon"],
        answer: 0,
        explanation: "The uniformly low-signal band from the inferior pole of the patella to the tibial tubercle is the patellar tendon.",
      },
      {
        id: "sag-q6",
        sliceIndex: 13,
        marker: { x: 24, y: 60 },
        prompt: WHAT,
        options: ["Hoffa's infrapatellar fat pad", "Joint effusion", "Baker's cyst", "Prefemoral fat"],
        answer: 0,
        explanation: "The fat behind the patellar tendon and in front of the joint is Hoffa's (infrapatellar) fat pad.",
      },
      {
        id: "sag-q7",
        sliceIndex: 8,
        marker: { x: 61, y: 59.2 },
        prompt: WHAT,
        options: ["Posterior horn of the meniscus", "PCL", "Posterior joint capsule", "Popliteus tendon"],
        answer: 0,
        explanation: "The low-signal triangle at the posterior joint line is the posterior horn of the lateral meniscus on this lateral-compartment slice.",
      },
      {
        id: "sag-q8",
        sliceIndex: 8,
        marker: { x: 40, y: 61 },
        prompt: WHAT,
        options: ["Anterior horn of the meniscus", "Hoffa's fat pad", "ACL", "Transverse ligament"],
        answer: 0,
        explanation: "The low-signal triangle at the anterior joint line is the anterior horn of the lateral meniscus on this lateral-compartment slice.",
      },
      {
        id: "sag-q9",
        sliceIndex: 7,
        marker: { x: 61.3, y: 50.8 },
        prompt: "The bright line outlining the joint surface here is normal — what is it?",
        options: ["Articular cartilage with a thin rim of joint fluid", "A meniscal tear", "Subchondral edema", "Synovitis"],
        answer: 0,
        explanation: "Smooth cartilage over the bone ends, outlined by a thin bright rim of joint fluid, is the normal articular surface. A small amount of fluid is expected.",
      },
      {
        id: "sag-q10",
        sliceIndex: 14,
        marker: { x: 66, y: 55 },
        prompt: WHAT,
        options: ["Popliteal vessels", "PCL", "Baker's cyst", "Semimembranosus tendon"],
        answer: 0,
        explanation: "The vertical tubular structures in the popliteal fossa behind the joint are the popliteal artery and vein.",
      },
      {
        id: "sag-q11",
        sliceIndex: 8,
        marker: { x: 40, y: 61 },
        prompt:
          "You've found this meniscus on the sagittal. To judge how far it extrudes (a root-tear clue), which plane do you switch to?",
        options: ["Coronal", "Axial", "A different sagittal slice", "Extrusion can't be measured on MRI"],
        answer: 0,
        explanation:
          "Meniscal body position and extrusion are assessed on CORONAL images. For the medial meniscus, at least 3 mm beyond the tibial margin (excluding osteophytes) is a commonly used major-extrusion threshold and should prompt a deliberate root and cartilage search, but extrusion is neither specific for nor required by a root tear.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // CORONAL PD-FS  (stack: normal-knee-coronal, 19 slices; mid-joint ~ index 7)
  // Orientation confirmed by the course director: image-left = MEDIAL, right = LATERAL.
  // ───────────────────────────────────────────────────────────────────────
  "cor-pdfs": {
    tour: [
      {
        sliceIndex: 7,
        markers: [],
        title: "Get oriented",
        note: "Coronal PD fat-sat through the mid-joint. Superior is up, inferior down; medial is to the LEFT and lateral to the RIGHT. Coronal's strength is comparing the two compartments side-by-side.",
      },
      {
        sliceIndex: 7,
        markers: [{ x: 28.5, y: 45.9, label: "Medial femoral condyle" }],
        title: "Medial femoral condyle",
        note: "Sits to the left here, articulating with the (concave) medial tibial plateau. Smooth cortex, uniform fatty marrow.",
      },
      {
        sliceIndex: 7,
        markers: [{ x: 66.6, y: 44.9, label: "Lateral femoral condyle" }],
        title: "Lateral femoral condyle",
        note: "On the right, articulating with the convex lateral tibial plateau (the medial plateau is concave) — coronal is where you compare the two side-by-side.",
      },
      {
        sliceIndex: 7,
        markers: [{ x: 40, y: 61.5, label: "Tibial plateau" }],
        title: "Tibial plateau",
        note: "The proximal tibia below the joint line. Compare the medial (concave) and lateral (convex) plateaus.",
      },
      {
        sliceIndex: 7,
        markers: [{ x: 48, y: 49, label: "Tibial spines / eminence" }],
        title: "Tibial spines (intercondylar eminence)",
        note: "The central bony peaks (intercondylar eminence) — your landmark for the true mid-joint coronal slice. The cruciates anchor in the intercondylar areas just beside the spines, not on the peaks themselves.",
      },
      {
        sliceIndex: 7,
        markers: [
          { x: 27, y: 56, label: "Medial meniscus (body)" },
          { x: 69, y: 55, label: "Lateral meniscus (body)" },
        ],
        title: "Menisci — the wedges",
        note: "Each meniscus is a low-signal triangle pointing into the joint. On coronal images, measure medial extrusion from the tibial margin while excluding osteophytes; at least 3 mm is a conventional major-extrusion threshold and a root/radial-tear search trigger, not a diagnosis. Do not transfer that threshold uncritically to the lateral meniscus or mistake the normal popliteus-hiatus/fascicle region for a tear.",
      },
      {
        sliceIndex: 7,
        markers: [{ x: 38, y: 53, label: "Articular cartilage" }],
        title: "Weight-bearing cartilage",
        note: "The smooth intermediate-signal layer on the condyle and plateau, outlined by a thin bright rim of joint fluid. Compare medial vs lateral for symmetry.",
      },
      {
        sliceIndex: 7,
        markers: [{ x: 14, y: 54, label: "Medial collateral ligament" }],
        title: "Medial collateral ligament",
        note: "A thin, taut low-signal band along the medial edge from the femoral epicondyle to the proximal tibia. Distinguish the long superficial MCL from the deep meniscofemoral and meniscotibial fibers. Periligamentous edema with preserved fibers can support a low-grade sprain; partial or complete fiber disruption determines higher grade.",
      },
      {
        sliceIndex: 7,
        markers: [{ x: 78, y: 53, label: "Lateral collateral ligament (LCL)" }],
        title: "Lateral collateral ligament (LCL)",
        note: "The cord-like LCL runs down the lateral edge from the lateral femoral epicondyle to the fibular head — the lateral counterpart of the MCL. The popliteus and posterolateral corner are confirmed on more posterior slices.",
      },
    ],
    quiz: [
      {
        id: "cor-sid-1",
        sliceIndex: 7,
        marker: { x: 14, y: 54 },
        prompt: "What is the marked structure running along the medial edge of the joint?",
        options: ["Medial collateral ligament", "Pes anserine tendons", "Medial meniscus body", "Semimembranosus tendon"],
        answer: 0,
        explanation: "The thin, taut low-signal band coursing along the medial margin from the medial femoral epicondyle to the proximal tibia is the medial collateral ligament. The pes anserine tendons lie more superficial and anteromedial and insert lower on the tibia, not as a single taut femorotibial band at the joint line.",
      },
      {
        id: "cor-sid-2",
        sliceIndex: 7,
        marker: { x: 78, y: 53 },
        prompt: "What is the cord-like structure at the lateral margin coursing toward the fibular head?",
        options: ["Lateral (fibular) collateral ligament", "Iliotibial band", "Popliteus tendon", "Biceps femoris tendon"],
        answer: 0,
        explanation: "The discrete cord-like ligament descending from the lateral femoral epicondyle to the fibular head is the lateral (fibular) collateral ligament. The iliotibial band inserts more anteriorly at Gerdy tubercle on the tibia, not the fibular head, so it would not converge on the fibular apex like the marked structure.",
      },
      {
        id: "cor-sid-3",
        sliceIndex: 7,
        marker: { x: 48, y: 49 },
        prompt: "What are the central bony peaks marked here at the mid-joint?",
        options: ["Tibial spines (intercondylar eminence)", "Femoral intercondylar notch roof", "Avulsed cruciate fragment", "Osteophytes of the tibial plateau"],
        answer: 0,
        explanation: "The paired central peaks rising from the tibia between the condyles are the tibial spines (intercondylar eminence), the landmark for the true mid-joint coronal slice. They are a normal osseous structure, not an avulsed fragment; an eminence avulsion would show a displaced bone fragment with a donor-site defect and marrow edema.",
      },
      {
        id: "cor-q1",
        sliceIndex: 7,
        marker: { x: 28.5, y: 45.9 },
        prompt: WHAT,
        options: ["Medial femoral condyle", "Lateral femoral condyle", "Medial tibial plateau", "Patella"],
        answer: 0,
        explanation: "The condyle on the medial (left) side, over the medial tibial plateau, is the medial femoral condyle.",
      },
      {
        id: "cor-q2",
        sliceIndex: 7,
        marker: { x: 66.6, y: 44.9 },
        prompt: WHAT,
        options: ["Lateral femoral condyle", "Medial femoral condyle", "Lateral tibial plateau", "Fibular head"],
        answer: 0,
        explanation: "The condyle on the lateral (right) side is the lateral femoral condyle.",
      },
      {
        id: "cor-q3",
        sliceIndex: 7,
        marker: { x: 40, y: 61.5 },
        prompt: WHAT,
        options: ["Tibial plateau", "Femoral condyle", "Tibial spine", "Fibula"],
        answer: 0,
        explanation: "The flat bone below the joint line is the tibial plateau.",
      },
      {
        id: "cor-q5",
        sliceIndex: 7,
        marker: { x: 27, y: 56 },
        prompt: WHAT,
        options: ["Medial meniscus (body)", "Lateral meniscus (body)", "MCL", "Medial femoral condyle"],
        answer: 0,
        explanation: "The low-signal triangle at the medial joint margin is the body of the medial meniscus.",
      },
      {
        id: "cor-q6",
        sliceIndex: 7,
        marker: { x: 69, y: 55 },
        prompt: WHAT,
        options: ["Lateral meniscus (body)", "Medial meniscus (body)", "LCL", "Popliteus tendon"],
        answer: 0,
        explanation: "The low-signal triangle at the lateral joint margin is the body of the lateral meniscus.",
      },
      {
        id: "cor-q9",
        sliceIndex: 7,
        marker: { x: 38, y: 53 },
        prompt: "The bright line outlining the joint surface here is normal — what is it?",
        options: ["Articular cartilage with a thin rim of joint fluid", "A chondral defect", "Subchondral cyst", "Meniscal tear"],
        answer: 0,
        explanation: "Smooth cartilage over the bone ends, outlined by a thin bright fluid rim, is the normal articular surface.",
      },
      {
        id: "cor-q10",
        sliceIndex: 7,
        marker: { x: 27, y: 56 },
        prompt: "This is the medial meniscus. At least how much extrusion past the tibial margin is a conventional major-extrusion threshold that should trigger a root/radial-tear search?",
        options: ["3 mm", "1 mm", "8 mm", "Any extrusion at all"],
        answer: 0,
        explanation: "Medial meniscal extrusion of at least 3 mm beyond the tibial margin, measured without osteophytes, is a common major-extrusion threshold. It should prompt direct root/radial-tear and cartilage assessment, but extrusion alone neither proves nor excludes a root tear.",
      },
      {
        id: "cor-q11",
        sliceIndex: 7,
        marker: { x: 47, y: 51 },
        prompt:
          "The cruciate ligaments arise near these central tibial spines. On which plane do you actually trace the ACL along Blumensaat's line?",
        options: ["Sagittal", "Coronal", "Axial", "All planes equally"],
        answer: 0,
        explanation:
          "The ACL is best traced on the SAGITTAL plane, paralleling Blumensaat's line (the intercondylar roof); coronal and axial confirm. Correlate planes for every ligament.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // AXIAL T2-FS  (stack: normal-knee-axial, 28 slices; patellofemoral ~ index 13)
  // Orientation verified: image-left = MEDIAL, image-right = LATERAL.
  // ───────────────────────────────────────────────────────────────────────
  "axi-t2fs": {
    tour: [
      {
        sliceIndex: 13,
        markers: [],
        title: "Get oriented",
        note: "Axial T2 fat-sat at the patellofemoral joint. Anterior (the patella) is up, posterior is down; medial is to the LEFT, lateral to the RIGHT. The axial is THE plane for the patella, trochlea, retinacula/MPFL, and patellar tracking.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 50, y: 19, label: "Patella" }],
        title: "Patella",
        note: "The anterior sesamoid bone, with its own articular cartilage on the deep surface. Note its position and tilt relative to the trochlea.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 50, y: 34, label: "Femoral trochlea" }],
        title: "Femoral trochlea",
        note: "The grooved anterior femur the patella tracks in. The lateral facet is normally longer, forming a higher buttress against the patella; loss of that asymmetry — a flat, shallow groove — is trochlear dysplasia.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 50, y: 31, label: "Trochlear groove (sulcus)" }],
        title: "Trochlear groove",
        note: "The deepest point of the trochlea. A shallow, flat groove is trochlear dysplasia — a key predisposing factor for patellar instability.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 50, y: 26, label: "Patellofemoral cartilage" }],
        title: "Patellofemoral cartilage",
        note: "The cartilage on the patellar and trochlear surfaces, outlined by a thin bright rim of fluid. Assess thickness and symmetry of the facets.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 32, y: 24, label: "MPFL / medial retinaculum" }],
        title: "MPFL / medial retinaculum",
        note: "The medial patellofemoral ligament runs from the superomedial patella toward the region between the adductor tubercle and medial epicondyle. It is the principal passive restraint in early lateral translation and is commonly injured after lateral patellar dislocation; inspect its full course because the tear site varies.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 68, y: 24, label: "Lateral retinaculum" }],
        title: "Lateral retinaculum",
        note: "The lateral retinacular soft tissues tethering the patella laterally.",
      },
      {
        sliceIndex: 13,
        markers: [
          { x: 37, y: 52, label: "Medial femoral condyle" },
          { x: 63, y: 52, label: "Lateral femoral condyle" },
        ],
        title: "Femoral condyles",
        note: "Behind the trochlea, the two condyles flank the intercondylar notch (where the cruciates are seen in cross-section).",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 55, y: 70, label: "Popliteal vessels" }],
        title: "Popliteal vessels",
        note: "The popliteal artery and vein in the popliteal fossa posteriorly — a reliable posterior landmark.",
      },
    ],
    quiz: [
      {
        id: "axi-sid-1",
        sliceIndex: 13,
        marker: { x: 50, y: 34 },
        prompt: "What is the marked grooved anterior femoral structure the patella tracks within?",
        options: ["Femoral trochlea", "Intercondylar notch", "Median patellar ridge", "Tibial tuberosity"],
        answer: 0,
        explanation: "The grooved anterior femur against which the patella articulates is the femoral trochlea; its lateral facet is normally longer, forming a buttress against lateral patellar subluxation. The median patellar ridge belongs to the patella (the anterior bone), not the femur, so it is on the opposite side of the patellofemoral joint.",
      },
      {
        id: "axi-sid-2",
        sliceIndex: 13,
        marker: { x: 68, y: 24 },
        prompt: "What is the marked soft-tissue band on the lateral side of the patella?",
        options: ["Lateral retinaculum", "MPFL (medial retinaculum)", "Iliotibial band", "Vastus lateralis tendon"],
        answer: 0,
        explanation: "The retinacular soft tissue tethering the patella on its lateral aspect is the lateral retinaculum. The MPFL is the principal medial restraint and lies on the opposite (medial) side of the patella, so a lateral marker cannot be the MPFL.",
      },
      {
        id: "axi-q1",
        sliceIndex: 13,
        marker: { x: 50, y: 19 },
        prompt: WHAT,
        options: ["Patella", "Femoral trochlea", "Quadriceps tendon", "Tibial tubercle"],
        answer: 0,
        explanation: "The anterior sesamoid bone at the front of the knee is the patella.",
      },
      {
        id: "axi-q3",
        sliceIndex: 13,
        marker: { x: 50, y: 26 },
        prompt: "The bright line between the patella and the trochlea is normal — what is it?",
        options: ["Patellofemoral articular cartilage with joint fluid", "A chondral fissure", "Synovitis", "Plica"],
        answer: 0,
        explanation: "Smooth patellar and trochlear cartilage outlined by a thin bright fluid rim is the normal patellofemoral articulation.",
      },
      {
        id: "axi-q4",
        sliceIndex: 13,
        marker: { x: 50, y: 31 },
        prompt: WHAT,
        options: ["Trochlear groove (sulcus)", "Intercondylar notch", "Median patellar ridge", "Trochlear cartilage defect"],
        answer: 0,
        explanation: "The deepest central point of the trochlea is the trochlear groove (sulcus); flattening here indicates dysplasia.",
      },
      {
        id: "axi-q5",
        sliceIndex: 13,
        marker: { x: 32, y: 24 },
        prompt: "Which principal medial restraint of the patella is marked (a structure commonly injured after lateral patellar dislocation)?",
        options: ["MPFL / medial retinaculum", "Lateral retinaculum", "Patellar tendon", "Iliotibial band"],
        answer: 0,
        explanation: "The medial patellofemoral ligament (MPFL) is the principal passive restraint to early lateral patellar translation and is commonly injured after lateral patellar dislocation. The injury may be patellar-sided, femoral-sided, midsubstance, or multifocal.",
      },
      {
        id: "axi-q7",
        sliceIndex: 13,
        marker: { x: 37, y: 52 },
        prompt: WHAT,
        options: ["Medial femoral condyle", "Lateral femoral condyle", "Medial tibial plateau", "Patella"],
        answer: 0,
        explanation: "The condyle on the medial (left) side behind the trochlea is the medial femoral condyle.",
      },
      {
        id: "axi-q8",
        sliceIndex: 13,
        marker: { x: 63, y: 52 },
        prompt: WHAT,
        options: ["Lateral femoral condyle", "Medial femoral condyle", "Fibular head", "Lateral meniscus"],
        answer: 0,
        explanation: "The condyle on the lateral (right) side is the lateral femoral condyle.",
      },
      {
        id: "axi-q9",
        sliceIndex: 13,
        marker: { x: 55, y: 70 },
        prompt: WHAT,
        options: ["Popliteal vessels", "PCL", "Baker's cyst", "Semimembranosus tendon"],
        answer: 0,
        explanation: "The tubular structures in the popliteal fossa posteriorly are the popliteal artery and vein.",
      },
      {
        id: "axi-q10",
        sliceIndex: 13,
        marker: { x: 50, y: 31 },
        prompt: "A shallow, flat trochlear groove on the axial images predisposes to which problem?",
        options: ["Patellar instability / dislocation", "ACL tear", "Meniscal root tear", "Baker's cyst"],
        answer: 0,
        explanation: "A flat/shallow trochlea (trochlear dysplasia) is a key predisposing factor for recurrent patellar instability and lateral dislocation.",
      },
      {
        id: "axi-q11",
        sliceIndex: 13,
        marker: { x: 32, y: 24 },
        prompt:
          "This is the MPFL. After a transient lateral patellar dislocation, where do you expect the classic bone bruises?",
        options: [
          "Medial patella + anterolateral femoral condyle",
          "Posterolateral tibia + lateral femoral condyle",
          "Anterior tibial plateau",
          "Medial femoral condyle alone",
        ],
        answer: 0,
        explanation:
          "Lateral patellar dislocation classically bruises the inferomedial patella and anterolateral femoral condyle as the patella relocates, commonly with MPFL/medial-retinacular injury. Tear location varies, so inspect the patellar attachment, femoral attachment, and midsubstance rather than assuming one site from the bruise pattern.",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────
  // SAGITTAL T1  (stack: normal-knee-sagittal-t1, 29 slices; registered to the
  // PD-FS, so positions mirror sag-pdfs — adapted for T1 contrast.)
  // ───────────────────────────────────────────────────────────────────────
  "sag-t1": {
    tour: [
      {
        sliceIndex: 13,
        markers: [],
        title: "Get oriented",
        note: "Sagittal T1 (non-fat-sat). Fat and bone marrow are BRIGHT; joint fluid is dark — the reverse of the PD-FS. Anterior is left, posterior right. T1's strength is marrow and anatomy; read it alongside the PD-FS (fluid/edema) at the same level.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 34, y: 41, label: "Femoral condyle" }],
        title: "Femoral condyle",
        note: "Low-signal cortex surrounds bright fatty marrow on T1. A focal dark line raises concern for fracture, while focal or diffuse marrow replacement has a broad differential. Fluid-sensitive sequences are more sensitive to increased water content, but bright signal is nonspecific; read both sequence types together.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 37.5, y: 62, label: "Tibial plateau" }],
        title: "Tibial plateau",
        note: "Predominantly bright fatty marrow lies below the joint. A discrete low-signal line can be a fracture clue, but correlate its shape across planes and look for surrounding edema-like signal because sclerosis, vascular channels, and other low-signal structures can mimic a line.",
      },
      {
        sliceIndex: 13,
        markers: [
          { x: 14, y: 22, label: "Quadriceps tendon" },
          { x: 16, y: 36, label: "Patella" },
        ],
        title: "Extensor mechanism — top",
        note: "The quadriceps tendon inserts on the superior pole of the patella. Tendons are low signal on T1, just as on PD-FS.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 20, y: 68, label: "Patellar tendon" }],
        title: "Patellar tendon",
        note: "Uniformly low signal from the inferior pole of the patella to the tibial tubercle.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 24, y: 60, label: "Hoffa's (infrapatellar) fat pad" }],
        title: "Hoffa's fat pad",
        note: "Bright fat (unsuppressed on T1) behind the patellar tendon.",
      },
      {
        sliceIndex: 8,
        markers: [
          { x: 40, y: 61, label: "Anterior horn (lateral meniscus)" },
          { x: 61, y: 59.2, label: "Posterior horn (lateral meniscus)" },
        ],
        title: "Meniscus",
        note: "Low-signal triangles of the lateral meniscus at the joint line — dark on T1, as on PD-FS.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 34, y: 41, label: "Bone marrow" }],
        title: "Bone marrow — T1's job",
        note: "Adult knee marrow is usually predominantly bright on T1, but residual or reconverted red marrow can be heterogeneous and should remain brighter than skeletal muscle. Assess unexpected focal low signal by its distribution, margin, relation to the cortex/subchondral plate, and fluid-sensitive correlate rather than labeling every dark focus as a lesion. Joint fluid is dark on T1, so use fluid-sensitive images for edema-like signal and effusion.",
      },
      {
        sliceIndex: 16,
        markers: [{ x: 50.7, y: 53.6, label: "Posterior cruciate ligament" }],
        title: "Posterior cruciate ligament",
        note: "The PCL is a smooth, continuous low-signal arc through the posterior notch.",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 66, y: 55, label: "Popliteal vessels" }],
        title: "Popliteal vessels",
        note: "The popliteal artery and vein in the popliteal fossa posteriorly.",
      },
    ],
    quiz: [
      {
        id: "t1-q1",
        sliceIndex: 13,
        marker: { x: 34, y: 41 },
        prompt: WHAT,
        options: ["Femoral condyle", "Patella", "Tibial plateau", "Fabella"],
        answer: 0,
        explanation: "The large rounded bone with low-signal cortex and bright fatty marrow is the femoral condyle.",
      },
      {
        id: "t1-q2",
        sliceIndex: 7,
        marker: { x: 42, y: 70 },
        prompt: WHAT,
        options: ["Tibial plateau", "Femoral condyle", "Patella", "Fibular head"],
        answer: 0,
        explanation: "The bone below the joint line is the tibial plateau.",
      },
      {
        id: "t1-q3",
        sliceIndex: 13,
        marker: { x: 16, y: 36 },
        prompt: WHAT,
        options: ["Patella", "Femoral condyle", "Quadriceps tendon", "Tibial tubercle"],
        answer: 0,
        explanation: "The anterior bone at the front of the knee is the patella.",
      },
      {
        id: "t1-q4",
        sliceIndex: 13,
        marker: { x: 14, y: 22 },
        prompt: WHAT,
        options: ["Quadriceps tendon", "Patellar tendon", "Iliotibial band", "Prepatellar bursa"],
        answer: 0,
        explanation: "The tendon inserting on the superior pole of the patella is the quadriceps tendon.",
      },
      {
        id: "t1-q5",
        sliceIndex: 13,
        marker: { x: 20, y: 68 },
        prompt: WHAT,
        options: ["Patellar tendon", "Quadriceps tendon", "ACL", "Popliteus tendon"],
        answer: 0,
        explanation: "The low-signal band from the inferior patella to the tibial tubercle is the patellar tendon.",
      },
      {
        id: "t1-q6",
        sliceIndex: 13,
        marker: { x: 24, y: 60 },
        prompt: WHAT,
        options: ["Hoffa's infrapatellar fat pad", "Joint effusion", "Baker's cyst", "Prefemoral fat"],
        answer: 0,
        explanation: "The bright fat behind the patellar tendon is Hoffa's (infrapatellar) fat pad.",
      },
      {
        id: "t1-q7",
        sliceIndex: 8,
        marker: { x: 61, y: 59.2 },
        prompt: WHAT,
        options: ["Posterior horn of the meniscus", "PCL", "Posterior joint capsule", "Popliteus tendon"],
        answer: 0,
        explanation: "The low-signal triangle at the posterior joint line is the posterior horn of the lateral meniscus on this lateral-compartment slice.",
      },
      {
        id: "t1-q8",
        sliceIndex: 8,
        marker: { x: 40, y: 61 },
        prompt: WHAT,
        options: ["Anterior horn of the meniscus", "Hoffa's fat pad", "ACL", "Transverse ligament"],
        answer: 0,
        explanation: "The low-signal triangle at the anterior joint line is the anterior horn of the lateral meniscus on this lateral-compartment slice.",
      },
      {
        id: "t1-q9",
        sliceIndex: 13,
        marker: { x: 34, y: 41 },
        prompt: "On this T1 image, how does normal bone marrow appear?",
        options: ["Bright (fatty)", "Dark (low signal)", "The same signal as joint fluid", "Bright only with fat suppression"],
        answer: 0,
        explanation: "Fatty marrow is bright on T1 because it is not suppressed. Residual or reconverted red marrow may be less bright but normally retains enough fat to remain brighter than skeletal muscle; suspicious low signal must be interpreted by pattern and with fluid-sensitive images.",
      },
      {
        id: "t1-q10",
        sliceIndex: 14,
        marker: { x: 66, y: 55 },
        prompt: WHAT,
        options: ["Popliteal vessels", "PCL", "Baker's cyst", "Semimembranosus tendon"],
        answer: 0,
        explanation: "The tubular structures in the popliteal fossa posteriorly are the popliteal artery and vein.",
      },
      {
        id: "t1-q11",
        sliceIndex: 13,
        marker: { x: 34, y: 41 },
        prompt:
          "On T1 you spot a faint dark line in the bright marrow. Which sequence best confirms the surrounding marrow edema?",
        options: ["Fluid-sensitive PD/T2 fat-sat", "T1 (this sequence)", "Gradient echo", "The localizer"],
        answer: 0,
        explanation:
          "T1/non-fat-suppressed images help define a fracture line and marrow composition; fat-suppressed fluid-sensitive images best show surrounding edema-like signal. Read both together, because neither finding alone is specific.",
      },
    ],
  },
};


export const kneeImageCaq: ImageCaqQ[] = [
  {
    id: "icaq-1",
    topic: "ACL tear — pivot-shift secondary signs",
    dir: "/images/teaching/stacks/normal-knee-sagittal",
    count: 29,
    startIndex: 12,
    plane: "Sagittal PD-FS",
    vignette: "A 22-year-old has a non-contact pivoting injury. On this lateral sagittal slice through the intercondylar notch, identify the straight striated band that parallels Blumensaat's line. If that band were wavy, edematous, and discontinuous, which associated lateral injury should you most actively search for?",
    options: ["Posterolateral tibial plateau bone contusion", "Anteromedial femoral condyle fracture", "Medial patellar facet bruise", "Quadriceps tendon avulsion"],
    answer: 0,
    explanation: "A wavy, discontinuous ACL on this notch slice would indicate a tear, and the classic associated finding is the pivot-shift kissing contusion at the posterolateral tibial plateau and mid-lateral femoral condyle. A medial patellar facet bruise belongs to lateral patellar dislocation, a different mechanism, so it is not the expected ACL-associated finding.",
  },
  {
    id: "icaq-2",
    topic: "PCL buckling — secondary sign of ACL tear",
    dir: "/images/teaching/stacks/normal-knee-sagittal",
    count: 29,
    startIndex: 16,
    plane: "Sagittal PD-FS",
    vignette: "On this midline sagittal slice, find the thick curved low-signal band arcing through the posterior notch — the PCL. In a patient after a non-contact knee injury, if this intact band took on an exaggerated, buckled curve, what would that contour most likely indicate?",
    options: ["Anterior tibial translation from an ACL tear", "An acute complete tear of this band", "Mucoid degeneration of this band", "A normal variant requiring no further evaluation"],
    answer: 0,
    explanation: "This band is the PCL; an intact but abnormally buckled PCL arc is a recognized secondary sign of anterior tibial translation associated with ACL insufficiency. A PCL tear is established by abnormal fiber continuity or morphology, with increased internal signal as a supportive finding rather than a diagnosis by itself.",
  },
  {
    id: "icaq-3",
    topic: "Meniscal extrusion threshold prompting root search",
    dir: "/images/teaching/stacks/normal-knee-coronal",
    count: 19,
    startIndex: 7,
    plane: "Coronal PD-FS",
    vignette: "A 58-year-old felt a pop rising from a squat. On this mid-joint coronal slice, locate the medial meniscus body at the tibial margin. Measuring extrusion from the tibial cortex, beyond what amount at the mid-body should strongly prompt a posterior-root search?",
    options: ["3 mm", "1 mm", "8 mm", "Any visible extrusion"],
    answer: 0,
    explanation: "Coronal medial meniscal extrusion of 3 mm or more beyond the tibial margin is a significant clue that should send you to the posterior root, especially with a compatible history. It is not diagnostic by itself: a 1 mm cutoff would overcall normal positioning, and requiring 8 mm would miss many clinically important root injuries.",
  },
  {
    id: "icaq-4",
    topic: "MPFL tear — patellar dislocation bruise pattern",
    dir: "/images/teaching/stacks/normal-knee-axial",
    count: 28,
    startIndex: 13,
    plane: "Axial T2-FS",
    vignette: "A 16-year-old presents after the kneecap briefly slipped out laterally and snapped back. On this axial patellofemoral slice, identify the medial patellar restraint (MPFL) along the medial patellar margin. If it were thickened with surrounding edema and fiber disruption, which paired bone-bruise pattern would most support the suspected mechanism?",
    options: ["Inferomedial patellar facet and anterolateral femoral condyle", "Posterolateral tibial plateau and mid-lateral femoral condyle", "Medial femoral condyle and medial tibial plateau", "Lateral patellar facet and lateral tibial plateau"],
    answer: 0,
    explanation: "The MPFL is the principal medial patellar restraint and is commonly injured during transient lateral patellar dislocation. The characteristic contact contusions are at the inferomedial patella and anterolateral femoral condyle as the patella relocates. The posterolateral tibia/lateral femoral condyle pattern instead supports a pivot-shift ACL mechanism.",
  },
  {
    id: "icaq-5",
    topic: "Trochlear dysplasia and patellar instability",
    dir: "/images/teaching/stacks/normal-knee-axial",
    count: 28,
    startIndex: 13,
    plane: "Axial T2-FS",
    vignette: "A 24-year-old gymnast has recurrent lateral patellar instability. On this axial slice the patella tracks within the grooved anterior femur — the trochlea. If this groove were abnormally shallow and flat, which condition would that finding represent, and why does it matter here?",
    options: ["Trochlear dysplasia, a key predisposing factor for lateral patellar dislocation", "Trochlear chondral defect causing mechanical locking", "Intercondylar notch stenosis predisposing to ACL tear", "Patella alta causing extensor lag"],
    answer: 0,
    explanation: "The grooved anterior femur is the femoral trochlea; a shallow, flat groove with loss of the normal lateral-facet buttress is trochlear dysplasia, the principal bony risk factor for recurrent lateral patellar instability. Notch stenosis relates to ACL injury risk, not patellar tracking, so it does not explain this patient's lateral instability.",
  },
  {
    id: "icaq-6",
    topic: "LCL / posterolateral corner — associated PCL injury",
    dir: "/images/teaching/stacks/normal-knee-coronal",
    count: 19,
    startIndex: 7,
    plane: "Coronal PD-FS",
    vignette: "A 30-year-old had a varus hyperextension injury. On this mid-joint coronal slice, identify the cord-like lateral structure descending toward the fibular head — the LCL. If it were thickened and edematous with a small avulsion at the fibular styloid, which additional ligament would be most important to scrutinize for associated injury?",
    options: ["Posterior cruciate ligament", "Medial collateral ligament", "Anterior cruciate ligament alone", "Transverse intermeniscal ligament"],
    answer: 0,
    explanation: "This is the lateral (fibular) collateral ligament; injury here with a fibular styloid avulsion (arcuate sign) signals posterolateral corner disruption, which carries a high rate of associated PCL injury. The MCL is a medial-side structure on the opposite compartment and is not mechanically coupled to this lateral corner injury.",
  },
  {
    id: "icaq-7",
    topic: "Lateral meniscus - normal pseudotears",
    dir: "/images/teaching/stacks/normal-knee-sagittal",
    count: 29,
    startIndex: 8,
    plane: "Sagittal PD-FS",
    vignette: "On this sagittal compartment slice, identify the dark meniscal horns. A fellow sees a small cleft at the lateral meniscus near the popliteus tendon region and wants to call a tear. What should they do before making that diagnosis?",
    options: [
      "Trace the popliteal hiatus/popliteomeniscal fascicles and meniscofemoral/transverse ligaments across adjacent slices, then look for reproducible surface-reaching signal or definite morphologic/fascicle disruption",
      "Call any cleft near the lateral meniscus a tear because normal ligaments do not contact the meniscus",
      "Ignore the finding entirely because lateral meniscal tears cannot occur at the posterior horn",
      "Measure medial meniscal extrusion; if it is under 3 mm, the lateral cleft is normal by definition",
    ],
    answer: 0,
    explanation: "The lateral meniscus has several normal relationships that create pseudotears: the anterior transverse intermeniscal ligament, the meniscofemoral ligaments near the posterior horn, and the popliteal hiatus/popliteomeniscal fascicles near the popliteus tendon. Trace them across planes and require reproducible surface communication on matching images or definite morphologic/fascicle disruption before diagnosing a tear at that interface.",
  },
];
