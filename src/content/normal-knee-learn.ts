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
 * NOTE: marker positions are a first pass to be verified/adjusted by the course
 * director. The cruciate markers in particular should be confirmed on the exact
 * slice before this is treated as final.
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
  "Bone marrow — T1's job": { caseId: "sifk-sonk", label: "Subchondral insufficiency fracture (SIFK)" },
};

/** title → inline "reading point" (variant + measurement) woven into the tour. */
export const structureReading: Record<string, StructureReading> = {
  "Anterior cruciate ligament": {
    variant:
      "A thick, bulbous ACL with increased signal but CONTINUOUS, parallel 'celery-stalk' fibers and no secondary signs is mucoid degeneration, not a tear — don't operate.",
    measure:
      "Quantify the secondary signs of a tear: anterior tibial translation >5 mm (lateral sagittal through the mid-lateral compartment) or a lateral femoral sulcus >1.5 mm deep.",
  },
  "Posterior cruciate ligament": {
    variant:
      "A PCL that is thickened with diffusely increased signal but keeps its general contour is a partial/interstitial tear, not simple contusion — correlate with the posterior drawer.",
  },
  "Medial collateral ligament": {
    measure:
      "The superficial MCL runs from the medial femoral epicondyle to ~5–7 cm below the joint line on the tibia — trace its full length on coronal before calling it intact.",
  },
  "Meniscus — the dark bow-ties": {
    measure:
      "Three or more contiguous bow-tie slices (4–5 mm sagittal) — or a central coronal body width >15 mm (or a meniscal-to-tibial-plateau-width ratio >20%) — is a discoid meniscus, not normal.",
  },
  Meniscus: {
    variant:
      "Linear grade-2 signal that does NOT reach an articular surface is degeneration, common after 40. Surface-reaching signal on two consecutive standard slices (two-slice-touch) gives high confidence for a tear; a one-slice finding is lower confidence and needs morphologic and orthogonal correlation. At the lateral meniscus, the popliteal hiatus and popliteomeniscal fascicles can create a smooth normal gap near the popliteus tendon; loss of fascicles, peripheral fluid, or hypermobile-meniscus context is abnormal.",
  },
  Patella: {
    variant:
      "A subchondral lucency in the SUPEROLATERAL quadrant with intact overlying cartilage is the benign dorsal defect of the patella — don't call it an osteochondral lesion or infection.",
  },
  "Femoral trochlea": {
    measure:
      "Trochlear dysplasia and elevated TT-TG are separate instability risk markers. TT-TG >20 mm is the classic abnormal cutoff, but MRI values vary with landmarks, slice choice, and knee position — do not use one number as a standalone surgical rule.",
  },
  "Trochlear groove": {
    measure:
      "Read the crossing sign on the sagittal/lateral view — the trochlear-floor line crossing the anterior cortex of the lateral femoral condyle marks a flat (dysplastic) groove.",
  },
  "MPFL / medial retinaculum": {
    measure:
      "Screen for predisposing anatomy: patella alta (Insall-Salvati >1.2) and elevated TT-TG. The classic >20 mm TT-TG cutoff is a risk marker, but MRI technique and landmarks can shift the value by a few millimeters.",
  },
  "Bone marrow — T1's job": {
    variant:
      "Patchy marrow that stays BRIGHTER than muscle and disc on T1, is symmetric, and spares the epiphyses is benign red-marrow reconversion — signal at/below muscle is the red flag for infiltration.",
  },
  "Femoral condyle": {
    variant:
      "An OCD interface line only as bright as cartilage (not fluid), especially in a skeletally immature knee, suggests granulation tissue and a STABLE fragment; a fluid-bright (T2) rim fully undercutting it means unstable.",
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
  "Extensor mechanism — top": "The quadriceps tendon is trilaminar — partial tears hide in the DEEP (vastus intermedius) layer with intact superficial fibers.",
  "Patellar tendon": "Normally a few mm thick and uniformly dark; focal thickening = tendinopathy (usually proximal), a fluid-filled gap = rupture.",
  "Hoffa's fat pad": "Edema in the superolateral fat pad is the clue to anterior (Hoffa) impingement — easy to overlook.",
  "Meniscus — the dark bow-ties": "Count the bow-ties on the body slices, then trace the lateral transverse/meniscofemoral/popliteal-hiatus relationships before calling a tear.",
  Meniscus: "Count the bow-ties on the body slices, then inspect the lateral popliteal hiatus so a normal fascicle/hiatus does not become a false-positive tear.",
  "Cartilage & joint fluid": "A small effusion is physiologic; the cartilage surface should be smooth and uniform — follow it slice to slice.",
  "Anterior cruciate ligament": "A normal ACL parallels Blumensaat's line; if the fibers bow, sag below the roof, or go wavy/edematous, suspect a tear. Secondary signs — a deep lateral notch sign, anterior tibial translation, and pivot-shift contusions — clinch it.",
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
  "MPFL / medial retinaculum": "After a dislocation the MPFL tears at the medial patella or the femoral (adductor tubercle) end — look at both.",
  "Bone marrow — T1's job": "A dark band within bright marrow = fracture; diffuse marrow darkening = infiltration. T1 is your marrow sequence.",
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
        "A striated, three-layer band over the medial joint line running from the medial femoral condyle to the proximal tibia — the superficial MCL is the key layer. A tear shows hypoechoic swelling, fibre disruption, or valgus laxity.",
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
        "A fibrillar, hyperechoic, trilaminar tendon inserting on the superior pole of the patella; partial tears hide in the deep (vastus intermedius) layer. Tilt the probe to defeat anisotropy (an artefactual hypoechoic band that mimics a tear).",
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
        "A uniform fibrillar band a few millimetres thick from the inferior patella to the tibial tubercle. Focal proximal hypoechoic thickening — often with neovascularity on Doppler — is patellar tendinopathy (jumper's knee); a fluid-filled gap is a tear.",
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
        "US shows the patellar cortex and the attached quadriceps and patellar tendons; the retropatellar cartilage and patellar tracking are MRI/CT questions, not US.",
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
        "The weight-bearing femoral condylar cartilage is screened behind the patella and tibia on US — only the anterior trochlear cartilage is reachable (knee flexed). MRI is the modality for weight-bearing chondral loss.",
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
        "Subchondral and marrow injury of the plateau are MRI findings; US sees only the cortical surface and adjacent soft tissue, not the marrow or a non-displaced fracture line.",
    },
  },
  "Bone marrow — T1's job": {
    ultrasound: {
      seen: false,
      appearance:
        "Ultrasound cannot assess marrow — sound does not penetrate cortical bone. Marrow oedema, contusions, and occult fractures are MRI-only (T1 plus a fluid-sensitive sequence).",
    },
  },
  "Popliteal vessels": {
    ultrasound: {
      seen: true,
      appearance:
        "US is first-line here: the popliteal vein and artery (compress the vein to exclude DVT), and a Baker's cyst — an anechoic collection with a neck between the medial gastrocnemius and semimembranosus. Look for rupture (fluid dissecting distally), a classic DVT mimic.",
      tip: "Transverse in the popliteal fossa; compress the vein to assess for thrombus.",
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
    prompt: "This is a meniscus on the sagittal — a low-signal “bow-tie.” Find the same meniscus on the coronal.",
    explanation:
      "Same structure, different shape: the sagittal “bow-tie” becomes a triangular WEDGE pointing into the joint on the coronal. Flipping between the two views is how you build a 3-D model of each structure.",
    from: { plane: "Sagittal PD-FS", dir: SAG, sliceIndex: 8, x: 61, y: 59.2, label: "Meniscus (bow-tie)" },
    to: {
      plane: "Coronal PD-FS",
      dir: COR,
      sliceIndex: 7,
      candidates: [
        { x: 27, y: 56 }, // medial meniscus wedge ✓
        { x: 48, y: 49 }, // tibial spines
        { x: 66.6, y: 44.9 }, // lateral femoral condyle
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
    from: { plane: "Sagittal PD-FS", dir: SAG, sliceIndex: 14, x: 64.3, y: 65.4, label: "Popliteal vessels" },
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
    from: { plane: "Sagittal PD-FS", dir: SAG, sliceIndex: 21, x: 54, y: 29, label: "Anterior cruciate ligament" },
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
      "Same shape, same plane - only the contrast flips. On T1 (no fat-sat) marrow fat is BRIGHT: your marrow and anatomy sequence. A discrete dark band = fracture; diffuse darkening = infiltration. Read marrow only on fat-suppressed and you overcall edema.",
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
      "Image-right is lateral on both planes. The rounded condyle cross-section on axial maps to the lateral of two side-by-side condyles on coronal - grab the right one. Coronal best assesses lateral compartment cartilage and tibiofemoral alignment.",
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
// grading/stability criteria, technique pitfalls. Each item was authored by an
// MSK-radiologist agent, then literature-fact-checked and single-best-answer
// audited (see the advanced-knee-mri-questions workflow). Optional by design.

export const advancedChallenge: AdvancedQ[] = [
  {
    id: "caq-1",
    topic: "ACL — Segond fracture / associated injury",
    prompt: "A 19-year-old soccer player sustains a non-contact pivoting injury. Radiographs show a small vertically oriented cortical avulsion off the proximal lateral tibia just below the joint line. Which intra-articular injury is most strongly associated with this radiographic finding?",
    options: ["Anterior cruciate ligament tear", "Posterior cruciate ligament tear", "Quadriceps tendon rupture", "Lateral meniscus discoid variant"],
    answer: 0,
    explanation: "A vertical cortical avulsion of the lateral tibia just below the joint line is a Segond fracture, an avulsion at the anterolateral capsular/iliotibial attachment that is highly associated (>75-90%) with ACL rupture. A PCL tear is instead linked with a medial (reverse Segond) tibial rim avulsion, not this lateral fragment, so it is the weaker association.",
  },
  {
    id: "caq-2",
    topic: "PCL — dashboard mechanism / next step",
    prompt: "A 28-year-old restrained front-seat passenger strikes the dashboard with a flexed knee in a head-on collision. He has a posterior sag of the tibia on exam and a posterior drawer is positive. Which finding on MRI would best confirm the suspected primary ligament injury?",
    options: ["Discontinuity and increased signal within the thick curved band in the posterior intercondylar notch", "A straight striated band paralleling Blumensaat's line that is wavy and lax", "Fluid signal at the posteromedial meniscocapsular junction", "A cortical avulsion at the anterolateral tibia"],
    answer: 0,
    explanation: "The dashboard mechanism drives the proximal tibia posteriorly and tears the PCL, the thick curved low-signal band in the posterior notch; disruption or increased intrasubstance signal there confirms it. A wavy band along Blumensaat's line describes the ACL, and the anterolateral tibial avulsion is a Segond fracture tied to ACL rather than PCL injury.",
  },
  {
    id: "caq-3",
    topic: "Meniscus — bucket-handle / displaced fragment",
    prompt: "A 23-year-old with a locked knee that will not fully extend has a sagittal MRI showing a low-signal band lying anteriorly within the intercondylar notch, paralleling and just inferior to the PCL. Body-slice images show fewer than two consecutive meniscal bow-ties. What is the most likely diagnosis?",
    options: ["Bucket-handle meniscal tear with a displaced fragment", "Mucoid degeneration of the ACL", "Normal meniscofemoral ligament of Humphry", "Cyclops lesion after ACL reconstruction"],
    answer: 0,
    explanation: "A displaced inner meniscal fragment lying in the notch inferior and parallel to the PCL produces the double-PCL sign, and an absent bow-tie (fewer than two consecutive) confirms a bucket-handle tear that mechanically blocks extension. The meniscofemoral ligament of Humphry runs anterior to the PCL but is a thin discrete band that does not abolish the bow-tie count or lock the knee.",
  },
  {
    id: "caq-4",
    topic: "Meniscal root tear — two-slice-touch / extrusion",
    prompt: "A 56-year-old reports a pop while rising from a squat and now has medial joint-line pain. Coronal MRI shows the medial meniscus body displaced 5 mm beyond the tibial margin, and the posterior horn near the root appears truncated. Which feature most reliably supports a posterior medial meniscal root tear?",
    options: ["Coronal extrusion of 5 mm with a truncated (ghost) posterior root", "Intrasubstance grade 2 signal not reaching a surface", "A double-PCL sign in the notch", "A parameniscal cyst at the anterior horn"],
    answer: 0,
    explanation: "Medial coronal extrusion of at least 3 mm together with an absent or truncated 'ghost' root at the posterior attachment is the signature of a posterior root tear, which functionally behaves like a total meniscectomy. Intrasubstance grade 2 signal that does not reach a surface is degeneration, not a full-thickness root detachment, so it does not establish the diagnosis.",
  },
  {
    id: "caq-5",
    topic: "Cartilage / OCD stability",
    prompt: "A 15-year-old gymnast has an osteochondritis dissecans lesion at the lateral aspect of the medial femoral condyle. On fluid-sensitive fat-suppressed images, which finding would most specifically indicate that the fragment is unstable and may warrant surgical fixation?",
    options: ["A fluid-signal-intensity line completely encircling and undercutting the fragment", "Mild marrow edema in the parent bone deep to the lesion", "A granulation interface line only as bright as articular cartilage", "An en-face fragment diameter of 6 mm with intact overlying cartilage"],
    answer: 0,
    explanation: "A rim of fluid-intensity signal that completely surrounds and undercuts the fragment indicates synovial fluid dissecting the interface and is the most reliable De Smet sign of instability. A high-signal interface line only as bright as cartilage usually reflects vascular granulation tissue, especially in skeletally immature patients, and is not by itself a sign of instability.",
  },
  {
    id: "caq-6",
    topic: "SIFK vs osteonecrosis / marrow",
    prompt: "A 65-year-old woman has sudden atraumatic medial knee pain. MRI shows a subchondral low-signal line in the weight-bearing medial femoral condyle paralleling and concave toward the articular surface, with surrounding diffuse marrow edema. What is the best diagnosis?",
    options: ["Subchondral insufficiency fracture", "Primary spontaneous osteonecrosis with epiphyseal infarct", "Transient bone marrow edema syndrome", "Medial femoral condyle osteochondroma"],
    answer: 0,
    explanation: "A subchondral fracture line paralleling the articular surface with adjacent marrow edema in an older patient with atraumatic pain is a subchondral insufficiency fracture (SIFK). Primary osteonecrosis instead shows a serpentine double-line sign demarcating an infarct away from the subchondral plate, so the subchondral, surface-parallel line favors SIFK over a true epiphyseal infarct.",
  },
  {
    id: "caq-7",
    topic: "Patellar dislocation / MPFL management",
    prompt: "A 16-year-old sustains a first-time lateral patellar dislocation that has spontaneously reduced. MRI shows an inferomedial patellar facet and anterolateral femoral condyle bone bruise and an MPFL tear, with no displaced osteochondral fragment and a TT-TG distance of 12 mm. What is the most appropriate initial management?",
    options: ["Nonoperative rehabilitation with bracing and quadriceps strengthening", "Acute MPFL reconstruction with tibial tubercle osteotomy", "Lateral retinacular release alone", "Immediate patellectomy"],
    answer: 0,
    explanation: "A first-time dislocation without a loose osteochondral body and with a normal TT-TG (well under the ~20 mm threshold) is managed nonoperatively with bracing and rehabilitation. Tibial tubercle osteotomy is reserved for an elevated TT-TG, so adding it here would be over-treatment given the normal alignment measurement.",
  },
  {
    id: "caq-8",
    topic: "Posterolateral corner — combined injury / graft failure",
    prompt: "A 27-year-old has an MRI-confirmed posterolateral corner injury with fibular collateral ligament, popliteus, and popliteofibular ligament disruption after a varus hyperextension blow. The surgeon plans cruciate reconstruction. Why is recognizing and addressing this posterolateral corner injury before isolated cruciate surgery most important?",
    options: ["Unrecognized posterolateral corner injury is a leading cause of cruciate graft failure from residual rotational and varus instability", "Posterolateral corner injuries reliably heal nonoperatively, so cruciate surgery can simply be delayed", "The posterolateral corner has no effect on cruciate graft loading once the cruciate is reconstructed", "Posterolateral corner injuries occur in isolation, so they rarely change the surgical plan"],
    answer: 0,
    explanation: "The posterolateral corner is the primary restraint to varus and external-rotation, and a missed combined injury leaves residual rotational/varus laxity that overloads and stretches out a cruciate graft, a recognized cause of reconstruction failure, so it must be addressed concurrently. The distractors are wrong because high-grade posterolateral corner injuries usually require repair or reconstruction rather than healing alone, and they very commonly accompany (rather than spare) cruciate injury.",
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
    prompt: "On MRI of a knee with an acute ACL tear, you measure anterior tibial translation by referencing the posterior margins of the lateral femoral condyle and lateral tibial plateau on a sagittal image. Which threshold of anterior tibial subluxation is most specific for a complete ACL tear?",
    options: ["≥ 1 mm", "≥ 3 mm", "≥ 5 mm", "≥ 10 mm"],
    answer: 2,
    explanation: "Anterior translation of the lateral tibial plateau of ≥ 5 mm relative to the lateral femoral condyle is highly specific (though not very sensitive) for a complete ACL tear; smaller degrees overlap with normal laxity.",
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
    explanation: "A lateral femoral (condylopatellar) sulcus depth greater than 1.5 mm is the classic threshold strongly associated with ACL disruption, reflecting an osteochondral impaction injury as the anteriorly subluxed tibia engages the lateral femoral condyle.",
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
    options: ["The 3 mm threshold is a useful high-specificity clue but relatively insensitive, so extrusion <3 mm does not exclude a root tear", "The 3 mm threshold is both highly sensitive and highly specific for root tears", "Extrusion is best and most reproducibly measured on sagittal rather than coronal images", "Meniscal extrusion of this degree is a normal finding and requires no root evaluation"],
    answer: 0,
    explanation: "Coronal medial meniscal extrusion >=3 mm is a significant clue in many root-tear studies, but it is only modestly sensitive and should not be treated as diagnostic by itself. Sub-3 mm extrusion does not exclude a root tear; the 'ghost' (absent/blunted root) sign should also be sought.",
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
    prompt: "On sagittal MRI of a knee with an ACL tear, you see vertical signal at the junction of the posterior horn lateral meniscus and an obliquely coursing structure passing toward the PCL. Which feature best favors a true posterior horn tear over a meniscofemoral (Wrisberg) ligament pseudotear?",
    options: ["The vertical signal can be traced contiguously into the PCL through the intercondylar notch", "The apparent meniscal cleft persists 4 or more sagittal images lateral to the PCL", "The structure lies posterior to the PCL on the Wrisberg side", "The signal is seen on only a single sagittal image near the midline"],
    answer: 1,
    explanation: "A Wrisberg/Humphrey pseudotear is created where the meniscofemoral ligament inserts on the posterior horn; an apparent cleft extending >=4 sagittal images lateral to the PCL exceeds the ligament's reach and should be treated as a true tear, especially with an ACL injury.",
  },
  {
    id: "cartilage-1",
    topic: "Cartilage & osteochondral",
    prompt: "A 16-year-old soccer player has a juvenile osteochondritis dissecans (OCD) lesion at the classic lateral aspect of the medial femoral condyle. On fluid-sensitive fat-suppressed sequences, which finding is MOST specific for an UNSTABLE fragment?",
    options: ["A thin, uninterrupted line of high T2 signal isointense to articular cartilage along the fragment interface", "A high-T2-signal rim completely surrounding the fragment that follows fluid signal intensity and undercuts it", "Mild bone-marrow edema in the parent bone deep to the lesion", "An en-face fragment diameter measuring 6 mm with intact overlying cartilage"],
    answer: 1,
    explanation: "A fluid-signal-intensity rim that completely encircles and undercuts the fragment indicates synovial fluid dissecting the interface and is the most reliable De Smet sign of instability; a granulation-tissue interface line is only as bright as cartilage, not fluid. Secondary signs include subchondral cysts >5 mm and a focal cartilage defect.",
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
    prompt: "A sports-medicine fellow measures a tibial tubercle–trochlear groove (TT-TG) distance of 22 mm on an axial MRI in a patient with recurrent lateral patellar instability. Above which commonly cited threshold does the TT-TG distance become a recognized risk factor for patellar instability and an indication potentially favoring tibial tubercle medialization?",
    options: ["8 mm", "12 mm", "20 mm", "30 mm"],
    answer: 2,
    explanation: "A TT-TG distance >=20 mm is the classic abnormal threshold associated with patellar instability, but it is a risk marker rather than a standalone surgical rule. MRI values measured on cartilaginous landmarks tend to run a few millimeters lower than CT-based bony measurements, so landmarks and clinical context matter.",
  },
  {
    id: "patellofemoral-2",
    topic: "Patellofemoral & extensor",
    prompt: "Which patella-alta index is least confounded by patellar tendon length variability because it uses the patellar articular surface relative to the tibial plateau rather than the tendon?",
    options: ["Insall-Salvati ratio", "Caton-Deschamps index", "Blackburne-Peel index measured to the patellar tendon insertion", "Modified Insall-Salvati ratio measured to the inferior pole of the patella"],
    answer: 1,
    explanation: "The Caton-Deschamps index (distance from the inferior articular margin of the patella to the anterosuperior tibial plateau divided by patellar articular surface length; alta if >1.2) avoids errors from a variable or thickened patellar tendon that confound the Insall-Salvati ratio. Note it is a RADIOGRAPHIC index — measure it on a lateral radiograph, since single-slice MRI inflates it by up to ~9%. It is not the most cross-modality-reliable index overall (Insall-Salvati is more reproducible across modalities); it is simply the one least affected by tendon variability.",
  },
  {
    id: "patellofemoral-3",
    topic: "Patellofemoral & extensor",
    prompt: "On a true lateral radiograph or sagittal MRI of a knee with trochlear dysplasia, the 'crossing sign' refers to which specific finding indicating a flat or shallow trochlea?",
    options: ["The line of the trochlear floor crosses the anterior cortex of the lateral femoral condyle", "The patellar tendon crosses the physeal scar at the level of the tibial tubercle", "The medial and lateral trochlear facet lines cross at the superior pole of the patella", "The supratrochlear spur crosses the Blumensaat line"],
    answer: 0,
    explanation: "The crossing sign is present when the line representing the floor of the trochlear groove crosses the anterior border of the lateral femoral condyle, meaning the groove becomes flat (flush with the condyle) at that point—a hallmark of trochlear dysplasia. A supratrochlear spur and double contour are additional Dejour signs of higher-grade dysplasia.",
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
    prompt: "On a coronal MRI of an acutely injured knee, you identify a curvilinear bone fragment avulsed from the fibula and displaced superomedially, accompanied by edema in the popliteus and fibular collateral ligament. Which anatomic structure is most specifically responsible for this 'arcuate sign' avulsion fragment?",
    options: ["The arcuate ligament / conjoined insertion of the posterolateral corner at the fibular styloid", "The proximal tibiofibular ligament at the fibular head", "The fibular insertion of the lateral head of gastrocnemius", "The fabellofibular ligament alone at the fibular apex"],
    answer: 0,
    explanation: "The arcuate sign is a small avulsion at the fibular styloid, the conjoined attachment site of the posterolateral corner (arcuate ligament complex), which is why it signals a high rate of associated cruciate (especially PCL) injury and should never be dismissed as trivial.",
  },
  {
    id: "corners-2",
    topic: "Collaterals & posterolateral corner",
    prompt: "A fellow shows you a coronal proton-density image with ossification along the expected course of the proximal MCL, paralleling the medial femoral condyle, in a patient with a remote valgus injury and no acute edema. To distinguish a healed grade I-II MCL injury (Pellegrini-Stieda) from an acute deep MCL tear, which feature most reliably indicates the chronic, healed process?",
    options: ["Curvilinear ossification at the femoral origin without surrounding marrow or soft-tissue edema", "Fluid signal interposed between the deep MCL and the medial meniscus", "A wavy, lax superficial MCL with surrounding T2-hyperintense fluid", "High T2 signal tracking along the meniscofemoral and meniscotibial ligaments"],
    answer: 0,
    explanation: "Pellegrini-Stieda represents post-traumatic ossification/calcification at the femoral attachment of the MCL; the absence of marrow and soft-tissue edema confirms a chronic healed lesion rather than acute injury, where edema and fluid would dominate.",
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
    prompt: "A 24-year-old presents after a non-contact pivoting injury. MRI shows ACL discontinuity. Regarding the classic pivot-shift contusion pattern, which paired location of marrow edema is MOST specific for this mechanism?",
    options: ["Posterolateral tibial plateau and mid-lateral femoral condyle (near the terminal sulcus)", "Anteromedial femoral condyle and anteromedial tibial plateau", "Posteromedial tibial plateau and medial femoral condyle", "Anterior tibia and anterior femur with patellar contusion"],
    answer: 0,
    explanation: "The pivot-shift (a valgus load on the flexed knee with rotation and anterior translation) drives the posterolateral tibial plateau against the mid-portion of the lateral femoral condyle at the condylopatellar (terminal) sulcus, producing the kissing contusions highly associated with ACL tears. A reciprocal posteromedial tibial plateau bruise from the tibia snapping back is a secondary sign. (The exact rotation direction is described inconsistently — the injury source describes external tibial rotation, the clinical pivot-shift test internal — so 'valgus with rotation' is the safe phrasing.)",
  },
  {
    id: "marrow-2",
    topic: "Bone marrow & fractures",
    prompt: "A 67-year-old woman has acute medial knee pain without trauma. MRI shows a subchondral focus in the weight-bearing medial femoral condyle. Which finding BEST distinguishes a subchondral insufficiency fracture (SIFK/SONK) from primary osteonecrosis (AVN)?",
    options: ["A subchondral T2-hypointense/low-signal line that is concave toward and roughly parallel to the subchondral plate, with adjacent diffuse marrow edema", "A serpentine double-line sign enclosing a fat-signal center remote from the articular surface", "Geographic fat-equivalent marrow signal bounded by a sclerotic rim", "Diffuse homogeneous marrow edema with no discrete line and an intact cortex"],
    answer: 0,
    explanation: "SIFK is identified by a subchondral low-signal fracture line paralleling the articular surface with surrounding marrow edema, whereas primary AVN shows the serpiginous double-line sign demarcating an epiphyseal infarct away from the subchondral plate. Line length/depth and overlying condylar collapse predict progression.",
  },
  {
    id: "marrow-3",
    topic: "Bone marrow & fractures",
    prompt: "A 31-year-old marathon runner has knee MRI showing patchy, slightly T1-hypointense marrow in the bilateral distal femoral and proximal tibial metadiaphyses, sparing the epiphyses. To confirm this is benign red-marrow reconversion rather than infiltrative disease, the MOST reliable feature is that the marrow signal remains:",
    options: ["Higher (brighter) than adjacent skeletal muscle and intervertebral disc on T1-weighted images", "Markedly lower than muscle on T1 but suppresses completely on STIR", "Isointense to fluid on T2 with avid homogeneous enhancement", "Lower than muscle on T1 with diffuse restricted diffusion"],
    answer: 0,
    explanation: "Normal hematopoietic (red) marrow always retains interspersed fat, so on T1 it stays brighter than skeletal muscle and disc; signal at or below muscle should raise concern for marrow-replacing infiltration. Reconversion is also typically symmetric, spares the epiphyses/apophyses, and follows the reverse order of normal conversion.",
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
    explanation: "Magic-angle signal arises from T2 lengthening in collagen oriented near 55 degrees and is seen only at short/intermediate TE; it fades or vanishes at long TE, whereas a true tear/degeneration persists. This is why a meniscal signal that does not extend to the surface and resolves on T2 should not be called a tear.",
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
    prompt: "A 24-year-old gymnast has lateral patellar maltracking on physical exam. On a sagittal MRI you measure the patellar tendon length and the greatest diagonal length of the patella to calculate the Insall-Salvati ratio. Which value confirms patella alta?",
    options: [">1.2", ">0.8", ">1.0", ">2.0"],
    answer: 0,
    explanation: "An Insall-Salvati ratio (patellar tendon length divided by patellar length) >1.2 indicates patella alta, a predisposing factor for instability; <0.8 indicates patella baja, and the normal range is approximately 0.8-1.2.",
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
        note: "Sagittal PD fat-sat. Anterior is to the LEFT, posterior to the RIGHT; fluid is bright, fat is suppressed. You scroll medial → lateral. This slice is through the intercondylar notch — the deepest part of the joint.",
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
        note: "The flat top of the tibia below the joint line. Marrow signal should be uniform — a discrete dark line within it would signal a fracture.",
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
        note: "The fat behind the patellar tendon and in front of the joint. Normally homogeneous; edema here is a clue to anterior impingement.",
      },
      {
        sliceIndex: 8,
        markers: [
          { x: 40, y: 61, label: "Anterior horn (meniscus)" },
          { x: 61, y: 59.2, label: "Posterior horn (meniscus)" },
        ],
        title: "Meniscus — the dark bow-ties",
        note: "On a compartment slice the meniscus appears as two low-signal triangles (anterior and posterior horns). The posterior horn is normally the larger of the two medially. Persistent high signal that reaches an articular surface on adjacent slices favors a tear; isolated single-slice clefts deserve correlation. Three normal lateral-meniscus relationships mimic tears: the transverse (intermeniscal) ligament at the anterior horn, the meniscofemoral ligament (Humphry/Wrisberg) at the posterior horn, and the popliteal hiatus/popliteomeniscal fascicles posterolaterally near the popliteus tendon. Trace the band or hiatus across adjacent slices before calling a tear.",
      },
      {
        sliceIndex: 7,
        markers: [{ x: 61.3, y: 50.8, label: "Articular cartilage / joint fluid" }],
        title: "Cartilage & joint fluid",
        note: "Cartilage is the smooth intermediate-signal layer on the bone ends; a thin bright rim of joint fluid outlines it. A small amount of fluid is normal.",
      },
      {
        sliceIndex: 21,
        markers: [{ x: 54, y: 29, label: "Anterior cruciate ligament" }],
        title: "Anterior cruciate ligament",
        note: "On this lateral notch slice the ACL is a straight, striated band running parallel to the roof of the notch (Blumensaat line), from the lateral femoral condyle down to the anterior tibial spine — more fibrillar and a touch brighter than the smooth, dark PCL. It is partly volume-averaged on any one slice, so trace it across a couple: normal fibers stay continuous and parallel to the notch roof.",
      },
      {
        sliceIndex: 16,
        markers: [{ x: 50, y: 47, label: "Posterior cruciate ligament" }],
        title: "Posterior cruciate ligament",
        note: "The PCL is a smooth, continuous low-signal band arcing through the posterior notch — a thick, dark, curved structure on this midline slice. Loss of its smooth arc suggests injury.",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 64.3, y: 65.4, label: "Popliteal vessels" }],
        title: "Popliteal vessels",
        note: "The popliteal artery and vein run vertically in the popliteal fossa behind the joint — a useful posterior landmark. Don't mistake the flow-related signal for pathology.",
      },
    ],
    quiz: [
      {
        id: "sag-sid-1",
        sliceIndex: 21,
        marker: { x: 54, y: 29 },
        prompt: "What is the straight striated band marked here, paralleling the roof of the intercondylar notch?",
        options: ["Anterior cruciate ligament", "Posterior cruciate ligament", "Meniscofemoral ligament", "Posterior joint capsule"],
        answer: 0,
        explanation: "On this lateral notch slice, the straight, slightly striated band running parallel to Blumensaat's line from the lateral femoral condyle to the anterior tibial spine is the ACL. The PCL is smoother, darker, more sharply curved, and sits more posteriorly and medially in the notch, so it would not lie along the notch roof on this lateral slice.",
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
        explanation: "The low-signal triangle at the posterior joint line is the posterior horn of the meniscus.",
      },
      {
        id: "sag-q8",
        sliceIndex: 8,
        marker: { x: 40, y: 61 },
        prompt: WHAT,
        options: ["Anterior horn of the meniscus", "Hoffa's fat pad", "ACL", "Transverse ligament"],
        answer: 0,
        explanation: "The low-signal triangle at the anterior joint line is the anterior horn of the meniscus.",
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
        marker: { x: 64.3, y: 65.4 },
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
          "Meniscal extrusion is graded on the CORONAL image at the mid-body — >3 mm past the tibial margin is significant and should trigger a deliberate posterior-root search. Build the habit of correlating planes.",
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
        note: "Each meniscus is a low-signal triangle pointing into the joint. On coronal, check that the medial body doesn't extrude past the tibial margin — >3 mm is significant, but it is a clue to inspect the posterior root rather than a root-tear diagnosis by itself. Laterally, do not mistake the normal popliteus hiatus/popliteomeniscal fascicle region for a peripheral tear.",
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
        note: "A thin, taut low-signal band along the medial edge from the femoral epicondyle to the proximal tibia. It has two layers — the superficial MCL (the long outer band) and the deep MCL (meniscofemoral + meniscotibial fibers anchoring the meniscus); fluid between the layers is the first sign of a sprain.",
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
        prompt: "This is the medial meniscus. Beyond how much extrusion past the tibial margin is considered significant and should trigger a root search?",
        options: [">3 mm", ">1 mm", ">8 mm", "Any extrusion at all"],
        answer: 0,
        explanation: "Medial meniscal extrusion >3 mm beyond the tibial margin is significant and should make you inspect the posterior root, but extrusion alone does not prove a root tear.",
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
  // SIDE NOTE: image-left assigned MEDIAL, image-right LATERAL — confirm.
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
        note: "The medial patellofemoral ligament runs from the medial patella toward the adductor tubercle — the main restraint against lateral dislocation, and what tears after a patellar dislocation.",
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
        prompt: "Which medial restraint of the patella is marked (the structure torn after a lateral patellar dislocation)?",
        options: ["MPFL / medial retinaculum", "Lateral retinaculum", "Patellar tendon", "Iliotibial band"],
        answer: 0,
        explanation: "The medial patellofemoral ligament (MPFL) is the main restraint against lateral dislocation and the structure injured after a patellar dislocation.",
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
          "Lateral patellar dislocation classically bruises the INFEROMEDIAL patellar facet and the ANTEROLATERAL femoral condyle as the patella relocates — and tears the MPFL. In pooled first-time-dislocation MRI data the tear is at the patellar attachment in ~48%, the femoral (adductor-tubercle) origin in ~34%, and mid-substance in ~18%, so inspect BOTH ends rather than assuming a femoral-sided tear (tear site does not reliably predict recurrence — a meta-analysis found no significant difference by site, p=0.17).",
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
        note: "Low-signal cortex with BRIGHT fatty marrow (unsuppressed on T1). T1 is the key sequence for marrow COMPOSITION — a focal dark line (fracture) or diffuse darkening (infiltration/replacement) stands out against the bright fat. For marrow EDEMA/contusion (the commonest acute finding), the fat-suppressed fluid-sensitive sequence (PD/T2-FS or STIR) is more sensitive — read them together.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 37.5, y: 62, label: "Tibial plateau" }],
        title: "Tibial plateau",
        note: "Uniform bright marrow below the joint. A discrete DARK line within the bright marrow is the classic T1 sign of a fracture.",
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
          { x: 40, y: 61, label: "Anterior horn (meniscus)" },
          { x: 61, y: 59.2, label: "Posterior horn (meniscus)" },
        ],
        title: "Meniscus",
        note: "Low-signal triangles at the joint line — dark on T1, as on PD-FS.",
      },
      {
        sliceIndex: 13,
        markers: [{ x: 34, y: 41, label: "Bone marrow" }],
        title: "Bone marrow — T1's job",
        note: "Normal marrow is uniformly bright (fatty) on T1. The key abnormal finding is FOCAL DARK signal — a fracture line, infiltration, or a lesion. (Joint fluid is dark on T1, so it is the PD-FS — not T1 — that you use for cartilage and effusion.)",
      },
      {
        sliceIndex: 16,
        markers: [{ x: 50.7, y: 53.6, label: "Posterior cruciate ligament" }],
        title: "Posterior cruciate ligament",
        note: "The PCL is a smooth, continuous low-signal arc through the posterior notch.",
      },
      {
        sliceIndex: 14,
        markers: [{ x: 64.3, y: 65.4, label: "Popliteal vessels" }],
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
        explanation: "The low-signal triangle at the posterior joint line is the posterior horn of the meniscus.",
      },
      {
        id: "t1-q8",
        sliceIndex: 8,
        marker: { x: 40, y: 61 },
        prompt: WHAT,
        options: ["Anterior horn of the meniscus", "Hoffa's fat pad", "ACL", "Transverse ligament"],
        answer: 0,
        explanation: "The low-signal triangle at the anterior joint line is the anterior horn of the meniscus.",
      },
      {
        id: "t1-q9",
        sliceIndex: 13,
        marker: { x: 34, y: 41 },
        prompt: "On this T1 image, how does normal bone marrow appear?",
        options: ["Bright (fatty)", "Dark (low signal)", "The same signal as joint fluid", "Bright only with fat suppression"],
        answer: 0,
        explanation: "Normal marrow is bright on T1 because fatty marrow is not suppressed. Focal DARK marrow signal (e.g., a fracture line) is the key abnormality T1 detects.",
      },
      {
        id: "t1-q10",
        sliceIndex: 14,
        marker: { x: 64.3, y: 65.4 },
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
          "T1 shows the fracture line and marrow replacement; the fat-suppressed fluid-sensitive sequence (PD/T2 FS) best shows the surrounding bright edema. Read marrow on both.",
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
    startIndex: 21,
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
    explanation: "This band is the PCL; an intact but abnormally buckled PCL arc is a recognized secondary sign of anterior tibial translation caused by an ACL tear, not a PCL injury itself. An acute PCL tear would instead show discontinuity or increased intrasubstance signal.",
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
    explanation: "The MPFL is the medial patellar restraint, and it tears during transient lateral patellar dislocation; the characteristic kissing contusions are at the inferomedial patellar facet and the anterolateral femoral condyle as the patella relocates. The posterolateral tibia/lateral femoral condyle pattern is the pivot-shift signature of an ACL tear, a different mechanism.",
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
      "Trace the popliteal hiatus/popliteomeniscal fascicles and meniscofemoral/transverse ligaments across adjacent slices, then require surface-reaching tear signal or abnormal fascicle disruption",
      "Call any cleft near the lateral meniscus a tear because normal ligaments do not contact the meniscus",
      "Ignore the finding entirely because lateral meniscal tears cannot occur at the posterior horn",
      "Measure medial meniscal extrusion; if it is under 3 mm, the lateral cleft is normal by definition",
    ],
    answer: 0,
    explanation: "The lateral meniscus has several normal relationships that create pseudotears: the anterior transverse intermeniscal ligament, the meniscofemoral ligaments near the posterior horn, and the popliteal hiatus/popliteomeniscal fascicles near the popliteus tendon. Trace them across slices and call a tear only when the signal behaves like a true surface-reaching tear or the fascicles/meniscocapsular support are disrupted.",
  },
];
