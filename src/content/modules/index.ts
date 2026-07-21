import { module6Content } from './module6-menisci';
import { module7Content } from './module7-ligaments';
import { module8Content } from './module8-extensor';
import { module10Content } from './module10-dontmiss';

export interface TopicImage {
  src: string;
  alt: string;
  caption: string;
  attribution?: string;
}

export interface TopicContent {
  content: string;
  pearl?: string;
  images?: TopicImage[];
}

export interface ModuleMetadata {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  searchPatternStep: number | null;
  estimatedMinutes: number;
  topics: string[];
  topicContent: TopicContent[];
  learningObjectives?: string[];
  commonMistakes?: { mistake: string; correction: string }[];
  essentialTopics?: number[];
}

export const moduleRegistry: ModuleMetadata[] = [
  {
    id: 'mri-basics',
    number: 1,
    title: 'MRI Basics',
    subtitle: 'Planes, sequences, and common pitfalls',
    searchPatternStep: null,
    estimatedMinutes: 15,
    essentialTopics: [0, 1, 2, 3],
    topics: [
      'Standard imaging planes: sagittal, coronal, axial',
      'Key sequences: T1, PD FS, T2',
      'What each sequence is best for (T1 for anatomy/fractures, PD FS for fluid/edema)',
      'Common artifacts and pitfalls (magic angle, truncation, motion)',
      'How to window/level for optimal viewing',
    ],
    learningObjectives: [
      'Identify the three standard imaging planes and their primary clinical applications',
      'Distinguish T1, PD FS, and T2 sequences by signal characteristics',
      'Recognize magic angle artifact, truncation artifact, and motion artifact',
      'Adjust window/level settings to optimize evaluation of different structures',
    ],
    commonMistakes: [
      {
        mistake: 'Calling increased signal in the posterolateral meniscus a tear on PD without checking T2',
        correction: 'Magic-angle signal is usually markedly reduced on long-TE T2. Signal reduction supports artifact, but diagnose a tear from surface extension, morphology, and adjacent or orthogonal images.',
      },
      {
        mistake: 'Reading only the sagittal PD FS series and skipping coronal and axial images',
        correction: 'Review findings across all three planes and seek orthogonal correlation when anatomy permits; lack of a second-plane correlate does not automatically exclude a subtle lesion. Coronal images are critical for collateral ligaments and meniscal roots; axial images for the patellofemoral joint and MPFL.',
      },
      {
        mistake: 'Not adjusting window/level when evaluating different structures',
        correction: 'Widen the window for meniscal internal signal; narrow it for cartilage surface defects. One setting does not optimize all structures.',
      },
    ],
    topicContent: [
      {
        content: `### Standard Imaging Planes

Knee MRI is acquired in three standard orthogonal planes:

- **Sagittal** — the workhorse of knee MRI. Evaluate the **cruciate ligaments**, **meniscal horns (anterior and posterior)**, **cartilage surfaces**, and the **extensor mechanism**. Prescribed parallel to the ACL or the intercondylar notch. (The meniscal body is best assessed on coronal.)
- **Coronal** — critical for the **collateral ligaments** and meniscal bodies, and overall alignment assessment.
- **Axial** — essential for the **patellofemoral joint**, the **patellar retinaculum**, and the **MPFL**.

### Orientation Checklist

When you sit down to read a knee MRI, start by orienting yourself:

- Identify the **patella** on sagittal images to confirm which side is anterior
- On coronal images, confirm **medial vs. lateral** — the **fibular head** is lateral
- Misorientation leads to embarrassing errors, especially when images are loaded in non-standard orientation`,
        pearl:
          'On sagittal images, the midline sagittal slice should show the intercondylar notch and the cruciate ligaments. If you cannot see the ACL on sagittal images, the scan may be poorly prescribed or the ACL may be torn — either way, you need to investigate further.',
      },
      {
        content: `### Core Sequences

The three sequences you must understand for knee MRI:

- **T1-weighted** — excellent anatomic detail. Fat is **bright** (high signal), fluid is **dark** (low signal), cortical bone is dark. Best for detecting **fracture lines** (low-signal lines against bright marrow fat) and evaluating **marrow replacement** processes.
- **PD FS (proton density fat-suppressed)** — a principal **workhorse sequence** for knee MRI. Fat suppression makes increased water content and fluid conspicuous. It is sensitive for marrow edema-like signal, meniscal and ligament injury, cartilage defects, and joint fluid, but it must be interpreted with T1 and orthogonal planes.
- **T2-weighted** — similar to PD FS (fluid is bright), but with higher contrast between fluid and soft tissue. Useful for characterizing **cysts** and **effusions**.`,
        pearl:
          'No single sequence or plane is sufficient for a knee MRI. Use fluid-sensitive images to find increased water content, T1 to assess marrow composition and fracture lines, and orthogonal planes to confirm morphology and continuity.',
      },
      {
        content: `### Sequence Roles in Your Diagnostic Toolkit

**T1-weighted — Anatomy & Fracture Detection**

Normal marrow is fatty and therefore **bright on T1**. Any process that replaces normal marrow fat will appear **dark on T1**:
- Fracture
- Tumor
- Infection
- Edema

This makes T1 sensitive to loss of the expected fat-rich marrow signal, but the finding remains nonspecific and must be interpreted by distribution, morphology, and fluid-sensitive correlation.

**PD FS — Edema & Soft Tissue Pathology**

Because fat signal is suppressed, any edema or fluid "lights up" as bright signal. Your primary sequence for:
- **Meniscal tears** — high signal reaching an articular surface
- **Ligament injuries** — disrupted fibers with surrounding edema
- **Bone marrow edema** — bright signal in the subchondral bone

**T2-weighted — Fluid Characterization**

Excellent for characterizing **fluid collections**. Often used in coronal and axial planes.`,
        pearl:
          'Low T1 plus high fluid-sensitive signal is a nonspecific increased-water or marrow-replacement pattern. Trauma, stress injury, insufficiency fracture, infection, inflammation, and neoplasm remain in the differential; use distribution, morphology, clinical context, and the other sequences before naming it.',
      },
      {
        content: `### Common Artifacts and Pitfalls

**Magic Angle Artifact** — the most clinically important artifact. Structures oriented at **55 degrees to the main magnetic field** show artifactually increased signal on **short TE sequences** (T1 and PD). Commonly affects:
- **Posterior horn of the lateral meniscus** (where it curves upward)
- **Popliteus tendon**
- Portions of the **cruciate ligaments**

Magic-angle signal is strongest on short-TE sequences and usually **decreases on longer-TE T2-weighted images**. Signal reduction supports artifact, but it does not exclude a tear; surface contact and morphology on adjacent and orthogonal images remain decisive.

**Truncation Artifact (Gibbs Artifact)** — produces alternating bright and dark lines parallel to high-contrast interfaces. Classically produces a **linear bright line through the meniscus** on sagittal images, mimicking a horizontal tear. Distinguishing clue: the truncation line runs parallel to, and at a fixed short distance from, the meniscal surface and does **NOT contact the articular surface** (a true tear's signal reaches a surface). It can be reduced by increasing the acquisition matrix or changing the phase-encode direction; confirm on a second plane.

**Motion Artifact** — produces ghosting in the phase-encoding direction and degrades overall image quality. Always note significant motion artifact in your report as it **limits diagnostic confidence**.`,
        pearl:
          'When you see increased signal in the posterior horn of the lateral meniscus on a single sagittal PD image, check the T2 sequence at the same location: if the signal drops out, it is magic-angle artifact (magic angle affects short-TE sequences and fades at long TE). But confirm a true tear by signal that unequivocally reaches the articular surface on 2 or more images (two-slice-touch) and by orthogonal/morphologic correlation — not by T2 brightness. Do not exclude a tear simply because its signal fades on T2; menisci are read most sensitively on short-TE (PD/intermediate) sequences.',
        images: [],
      },
      {
        content: `### Window/Level Adjustment

Window and level adjustment is one of the most underappreciated skills in MRI interpretation:

- **Window (width)** — controls contrast. Narrow = high contrast between tissues; wide = more uniform grey tones.
- **Level (center)** — controls overall brightness.

Most PACS viewers allow real-time adjustment by clicking and dragging.

### Optimal Settings by Structure

- **Bone marrow** (T1 or PD FS) — moderate window, level set to make marrow intermediate grey. Reveals subtle signal changes.
- **Meniscus** — center the level over the low-signal range and adjust width so the meniscus is not clipped to uniform black; a narrower local range can reveal subtle internal gradations.
- **Cartilage** (PD FS) — adjust width and level to preserve both the cartilage surface and bright joint fluid without saturation.

Develop the habit of adjusting window/level as you move through your search pattern, optimizing for each structure you evaluate.`,
        pearl:
          'Window/level is a display optimization, not a fixed recipe. For menisci, bring the low-signal tissue into the visible gray range without clipping it black; for cartilage, preserve the cartilage-fluid interface. Recheck the native display before deciding a subtle finding is real.',
      },
    ],
  },
  {
    id: 'anatomy',
    number: 2,
    title: 'Anatomy',
    subtitle: 'Compartments, landmarks, and what belongs where',
    searchPatternStep: null,
    estimatedMinutes: 20,
    essentialTopics: [0, 1, 2, 3],
    topics: [
      'Three compartments: medial, lateral, patellofemoral',
      'Key bony landmarks and alignment',
      'Meniscal anatomy: horns, body, roots, attachments',
      'Cruciate and collateral ligament anatomy',
      'Normal variants that mimic pathology (popliteal hiatus, meniscofemoral ligaments, transverse ligament)',
      'Extensor mechanism anatomy',
    ],
    learningObjectives: [
      'Identify the three knee compartments and their clinical significance',
      'Describe meniscal anatomy including horns, body, roots, and key attachments',
      'Trace the course of the ACL and PCL on sagittal images',
      'Recognize normal variants that mimic pathology (popliteal hiatus, meniscofemoral ligaments, transverse ligament)',
      'Describe the extensor mechanism components and MPFL anatomy',
    ],
    commonMistakes: [
      {
        mistake: 'Calling the popliteal hiatus a lateral meniscal tear',
        correction: "Look for the round popliteus tendon within the 'gap' — if present, it's the normal hiatus, not a tear. Follow the tendon on consecutive slices.",
      },
      {
        mistake: 'Confusing the meniscofemoral ligament (Wrisberg) for an intact posterior horn of the lateral meniscus',
        correction: 'Wrisberg lies posterior to the PCL and can mask a displaced posterior horn. Check axial images to confirm the meniscal horn is in its normal position.',
      },
      {
        mistake: 'Misidentifying the transverse ligament as an anterior horn lateral meniscal tear',
        correction: 'The transverse ligament runs between the anterior horns on sagittal images. It\'s linear, smooth, and does not disrupt the meniscal surface.',
      },
    ],
    topicContent: [
      {
        content: `### Three Compartments of the Knee

The knee is divided into three compartments — pathology often clusters within a compartment, and isolated compartment disease has different surgical implications than multi-compartment involvement.

- **Medial tibiofemoral** — medial femoral condyle + medial tibial plateau, with the **medial meniscus** interposed
- **Lateral tibiofemoral** — lateral femoral condyle + lateral tibial plateau, with the **lateral meniscus** interposed
- **Patellofemoral** — patellar articular surface + **femoral trochlea**

### Compartment-Based Evaluation

For each compartment, independently assess:
- Cartilage loss
- Osteophytes
- Subchondral changes
- Meniscal pathology

Organize your cartilage and osteochondral findings by compartment when reporting.`,
        pearl:
          'When you see bone marrow edema in the medial compartment, always check the lateral compartment for corresponding "kissing" lesions. Bipolar edema (edema on both sides of a joint) suggests an acute compressive injury or advanced degenerative disease, and the clinical context will differentiate.',
        images: [
          {
            src: '/images/modules/normal-knee-coronal.svg',
            alt: 'Normal knee MRI coronal view showing compartments and alignment',
            caption: 'Normal knee coronal view: medial and lateral compartments, alignment, and key landmarks',
          },
        ],
      },
      {
        content: `### Key Bony Landmarks

- **Tibial eminences** (medial and lateral intercondylar spines) — visible on coronal images; landmarks beside the cruciate and meniscal-root attachment areas. A **tibial eminence fracture** in a child or adolescent is an osseous ACL-attachment injury; report fragment displacement/comminution and associated soft-tissue injury rather than assuming the same morphology as an intrasubstance ACL tear.
- **Segond fracture** — a small avulsion off the lateral tibial plateau and a **highly specific marker of associated ACL injury**. Best seen on coronal images; confirm the ACL directly.
- **Femoral intercondylar notch** — the "home" of the cruciate ligaments. **Notch stenosis** (narrow or A-frame notch) is a risk factor for ACL tears.
- **Tibial tubercle** — insertion of the patellar tendon; site of **Osgood-Schlatter disease** in adolescents.

### Alignment

Routine limited-field, non-weight-bearing knee MRI cannot determine the true hip-to-ankle **mechanical axis**. It can show a compartment-overload pattern:
- **Varus overload** — changes predominate in the **medial** compartment
- **Valgus overload** — changes predominate in the **lateral** compartment

Quantify alignment with standing full-length hip-to-ankle radiographs when it will affect management.`,
        pearl:
          'On coronal images, look for small cortical avulsions at the lateral tibial plateau (Segond fracture), medial tibial plateau (reverse Segond/deep MCL avulsion), and the fibular head (arcuate sign, indicating PLC injury). These small fractures are often more important than the bone they break off — they tell you about the ligament injury.',
        images: [
          {
            src: '/images/modules/normal-knee-sagittal.svg',
            alt: 'Normal knee MRI sagittal view showing bony landmarks and alignment',
            caption: 'Normal knee sagittal view: femoral condyle, tibial plateau, and key bony landmarks',
          },
        ],
      },
      {
        content: `### Meniscal Anatomy

The menisci are C-shaped fibrocartilaginous structures serving as **shock absorbers**, **load distributors**, and **joint stabilizers**. Each meniscus has an **anterior horn**, **body**, and **posterior horn**.

- **Medial meniscus** — C-shaped, firmly attached to the joint capsule and the **deep MCL**. Limited mobility makes it **more susceptible to tear**.
- **Lateral meniscus** — more circular (nearly O-shaped), more mobile, detaches from the capsule posterolaterally at the **popliteal hiatus**.

### Meniscal Roots

The roots are critical structures anchoring the meniscus to the tibial plateau:

- **Posterior root of the medial meniscus** — attaches just anterior to the PCL tibial insertion
- **Anterior root of the lateral meniscus** — attaches adjacent to the ACL tibial insertion

Complete root-disrupting radial tears or avulsions can abolish hoop-stress function; in a cadaveric medial posterior-root model, contact mechanics approached those after total medial meniscectomy. Evaluate roots in multiple planes, especially sagittal and coronal images with axial confirmation. A **"ghost meniscus" sign** plus extrusion is supportive, but neither extrusion nor one plane alone establishes a root tear.`,
        pearl:
          'On sagittal images, the normal posterior horn of the medial meniscus should be approximately twice the size (AP dimension) of the anterior horn. If the posterior horn appears small or absent, think about a displaced tear (bucket-handle) or a root tear. Always cross-reference with coronal images to evaluate the root.',
        images: [
          {
            src: '/images/modules/meniscal-anatomy.svg',
            alt: 'Meniscal anatomy diagram showing horns, body, and root attachments',
            caption: 'Meniscal anatomy: anterior horn, body, posterior horn, and root attachments on the tibial plateau',
          },
        ],
      },
      {
        content: `### Cruciate Ligaments

**ACL** — runs from the posteromedial aspect of the **lateral femoral condyle** to the **anterior tibial plateau**, just anterior to the tibial eminence. On sagittal images: a taut band of low-signal fibers running roughly parallel to the **intercondylar roof (Blumensaat line)**. Look for intact, continuous fibers with a normal trajectory.

**PCL** — the **strongest ligament** in the knee. Runs from the lateral wall of the medial femoral condyle (intercondylar surface) to **a depression on the posterior tibia, approximately 1 cm below the articular surface**. Normal appearance: a smooth, curving arc of **uniformly low signal**. Warning signs of injury:
- **"Thick PCL" sign**
- Loss of the normal smooth curvature

### Collateral Ligaments

**MCL** — has superficial and deep layers:
- **Superficial MCL** — long band from the medial femoral epicondyle to the proximal medial tibia (~5-7 cm below the joint line)
- **Deep MCL** (meniscotibial and meniscofemoral ligaments) — attaches directly to the **medial meniscus**
- Best evaluated on **coronal images**

**LCL (fibular collateral ligament)** — cord-like structure from the lateral femoral epicondyle to the **fibular head**. Best seen on coronal images.`,
        pearl:
          'When reading the ACL, start at the lateral femoral condyle and trace the fibers toward the anterior tibial intercondylar area across adjacent sagittal images. If continuity is uncertain, inspect coronal and axial planes, image quality, and secondary signs; never declare a tear solely because one sagittal image does not show the full ligament.',
        images: [
          {
            src: '/images/modules/cruciate-ligaments.svg',
            alt: 'Cruciate ligament anatomy showing ACL and PCL origins and insertions',
            caption: 'ACL and PCL anatomy: femoral origins, tibial insertions, and normal sagittal MRI appearance',
          },
        ],
      },
      {
        content: `### Normal Variants That Mimic Pathology

**Popliteal Hiatus** — a region where the posterior horn of the lateral meniscus detaches from the posterolateral capsule, allowing the popliteus tendon to pass through. On sagittal images, this can mimic a **lateral meniscal tear**. Key: look for the smooth, round popliteus tendon within the gap to confirm it is a normal hiatus.

**Meniscofemoral Ligaments** (ligaments of **Humphrey** and **Wrisberg**) — run from the posterior horn of the lateral meniscus to the medial femoral condyle, adjacent to the PCL:
- **Humphrey** — passes **anterior** to the PCL
- **Wrisberg** — passes **posterior** to the PCL
- On sagittal images, these can mimic a **displaced meniscal fragment** or mask a tear by being confused with an intact posterior horn
- On axial images, they appear as small round structures adjacent to the PCL

**Transverse Meniscal Ligament** — connects the anterior horns of both menisci. Can mimic a tear of the **anterior horn of the lateral meniscus** on sagittal images.`,
        pearl:
          'The popliteal hiatus is an important normal relationship that can mimic a lateral meniscal tear. At the posterolateral corner, identify the popliteus tendon and trace the smooth hiatus and popliteomeniscal fascicles across adjacent images before calling a tear.',
      },
      {
        content: `### Extensor Mechanism

The extensor mechanism consists of:
- **Quadriceps tendon** — multi-layered structure from four muscles inserting on the superior pole of the patella
- **Patella**
- **Patellar tendon** (patellar ligament) — from the inferior pole of the patella to the **tibial tubercle**

### Quadriceps Tendon Layers (superficial to deep)

- **Rectus femoris** (superficial)
- **Vastus medialis and lateralis** (middle)
- **Vastus intermedius** (deep)

On sagittal MRI, the normal quadriceps tendon appears as a **layered structure of low signal intensity**.

### Patellar Tendon

Should be **uniformly low signal** on all sequences, with a normal AP thickness of roughly **4-7 mm** (thicker proximally at the inferior patellar pole). Focal thickening beyond ~7 mm with increased intrasubstance signal suggests **tendinopathy**.

### MPFL (Medial Patellofemoral Ligament)

The **primary restraint to lateral patellar translation** — key structure in **patellar instability**. Runs from the **adductor tubercle** region to the superomedial border of the patella. Best seen on **axial images**.`,
        pearl:
          'The quadriceps tendon is multilayered, and a partial tear can involve one layer while other fibers remain intact. Inspect every layer in sagittal and axial planes for a fluid-signal gap, fiber discontinuity, and retraction; do not infer tendon function from MRI alone.',
        images: [
          {
            src: '/images/modules/extensor-mechanism.svg',
            alt: 'Extensor mechanism anatomy showing quadriceps tendon, patella, and patellar tendon',
            caption: 'Extensor mechanism: quadriceps tendon layers, patella, patellar tendon, and MPFL',
          },
        ],
      },
    ],
  },
  {
    id: 'search-pattern-overview',
    number: 3,
    title: 'Search Pattern Overview',
    subtitle: 'The 7-step systematic approach',
    searchPatternStep: null,
    estimatedMinutes: 10,
    essentialTopics: [0, 1, 2],
    topics: [
      'Why systematic reading prevents missed findings',
      'Satisfaction of search: a common cognitive error',
      'Overview of the 7-step search pattern',
      'How to build the pattern into daily workflow',
      'Anchor slice concept',
    ],
    learningObjectives: [
      'Explain why systematic reading prevents missed findings',
      'Define satisfaction of search and describe how to overcome it',
      'List all 7 steps of the search pattern in order',
      'Describe the anchor slice concept and identify key anchor slices',
    ],
    commonMistakes: [
      {
        mistake: 'Starting your report before completing the full search pattern',
        correction: 'Complete all 7 steps before dictating. The clinical question may focus on the ACL, but the ramp lesion or root tear you find at step 4 changes surgical planning.',
      },
      {
        mistake: "Skipping Step 7 (synovium/bursae and other soft tissues) because 'nothing is usually there'",
        correction: 'Baker cyst rupture, diffuse-type TGCT, plicae, periarticular bursae, calf structures, and the neurovascular bundle can contain clinically relevant findings. Report them in proportion to the clinical context.',
      },
    ],
    topicContent: [
      {
        content: `### Why Systematic Reading Prevents Missed Findings

A **systematic search pattern** reduces perceptual and cognitive misses on knee MRI by ensuring that every compartment and tissue class is reviewed, even after an obvious abnormality is found.

A search pattern forces you to evaluate **every structure in every compartment, every time**, regardless of clinical history or obvious findings.

### Speed vs. Completeness

- Experienced readers execute a complete search pattern in **5-10 minutes**
- The goal is not to slow you down — it is to make your reading **comprehensive**
- The clinical history tells you what the referring physician is worried about, but **not what pathology is actually present**
- The knee with the "ACL tear" may also have a **root tear**, a **cartilage flap**, and a **posterolateral corner injury** — you will only find these if you look systematically`,
        pearl:
          'Develop a search pattern that you use identically every time, regardless of the clinical question. The pattern should become automatic — like a pilot\'s pre-flight checklist. You should not have to think about what to look at next; it should be reflexive.',
      },
      {
        content: `### Satisfaction of Search

**Satisfaction of search** is a common cognitive error in image interpretation. Once you find a significant abnormality, your brain becomes **psychologically "satisfied"** and less attentive to additional findings. This is not laziness — it is a well-documented cognitive bias.

**Classic scenario:** You correctly diagnose the ACL tear but miss:
- **Lateral meniscus posterior root tear** (or a **medial meniscal ramp lesion**) — the meniscal injuries classically associated with acute ACL tears
- **Posterolateral corner injury**
- Both are surgically relevant

### The Antidote

- After finding the first abnormality, **resist the urge to stop reading and start dictating**
- Complete your **entire search pattern**, then construct your report
- Many experienced readers note the obvious finding, then **deliberately set it aside** and continue their systematic review before returning to characterize it in detail`,
        pearl:
          'When you find an ACL tear, you are only halfway done. ACL injuries have well-known associated injuries: lateral meniscal posterior horn tears, medial meniscal ramp lesions, bone contusions in the lateral compartment, posterolateral corner injuries, and cartilage damage. After diagnosing the ACL tear, actively hunt for each of these associated findings.',
      },
      {
        content: `### The 7-Step Search Pattern

1. **Verify and orient** — patient, side, sequences, clinical question, and anchor slice
2. **Bones and marrow** — contusion patterns, fractures, marrow lesions
3. **Cartilage and osteochondral surfaces** — all three compartments
4. **Menisci** — medial and lateral, including roots
5. **Ligaments** — cruciates, collaterals, posterolateral corner, MPFL
6. **Extensor mechanism** — quadriceps tendon, patella, patellar tendon, retinacula
7. **Synovium, bursae, and other soft tissues** — effusion, cysts, bursae, popliteal fossa, tendons, and neurovascular structures

After step 7, return to the clinical question and perform a final satisfaction-of-search check.

### Why Step-by-Step Works

Each step focuses your attention on a **specific tissue type**, allowing you to:
- Optimize your **window/level settings** for that tissue
- **Mentally calibrate** for that tissue's normal appearance
- Maintain **focused attention** — more efficient and more sensitive than evaluating everything at once

When you are looking at cartilage, you are not trying to also evaluate ligaments — you are entirely focused on cartilage surfaces across all three compartments.`,
        pearl:
          'Use the same seven steps every time, then perform a separate final review of the clinical question and associated-injury checklist. The fixed order is a memory aid; careful multiplanar correlation remains essential.',
        images: [
          {
            src: '/images/modules/search-pattern-flowchart.svg',
            alt: 'Flowchart of the 7-step knee MRI search pattern',
            caption: 'The 7-step systematic search pattern: verify/orient through synovium, bursae, and other soft tissues, followed by a separate final review',
          },
        ],
      },
      {
        content: `### Building the Pattern Into Daily Workflow

Building a search pattern into your daily workflow requires **deliberate practice**:

- For the first **50-100 cases**, use a physical or mental checklist — literally check off each step as you complete it
- It will feel slow at first — that is expected
- With practice, the pattern becomes **automatic**, and reading speed actually **increases** because you are not wasting time deciding what to look at next

### Template-Driven Reading

Use a **structured reporting template** that mirrors your search pattern:

- Report template moves through **bones → cartilage → menisci → ligaments → soft tissues**
- Your reading pattern naturally follows the same sequence
- The **report drives the reading**, and the **reading populates the report**
- This creates a **closed loop** where your search pattern is reinforced every time you dictate`,
        pearl:
          'For your first 50 cases, keep a tally of how many additional findings you discover after completing your search pattern beyond the first obvious finding. This will convince you of the value of systematic reading — most readers are surprised how often disciplined review turns up further clinically relevant pathology (satisfaction of search is a well-documented reading bias).',
      },
      {
        content: `### The Anchor Slice Concept

An **anchor slice** is a specific slice in a specific plane where you know exactly what normal anatomy looks like, and from which you can navigate to evaluate surrounding structures. Starting at your anchor slice lets you immediately orient yourself and scroll in both directions with confidence.

### Key Anchor Slices

**Sagittal — midline intercondylar notch:**
- See the **PCL** in its entirety and the **ACL** (whose oblique course is best fully profiled on a slightly more lateral sagittal slice), the **intercondylar roof**, and the **tibial eminences**
- Scroll **laterally** → lateral compartment (lateral meniscus, lateral cartilage, LCL region)
- Scroll **medially** → medial compartment (medial meniscus, medial cartilage, MCL)

**Coronal — mid-condylar slice:**
- Both **meniscal bodies**, both **collateral ligaments**, and the **cruciates** in cross-section

**Axial — patellofemoral joint:**
- **Patellar articular surface**, **trochlea**, **MPFL**, and **patellar retinacula**

Developing familiarity with your anchor slices accelerates reading because you spend less time "getting oriented" on each case.`,
        pearl:
          'Identify 2-3 anchor slices that work for you — one sagittal (midline notch view), one coronal (mid-condylar), one axial (through the patellofemoral joint). Start every case at these anchors. Within a few weeks, you will be able to tell within seconds of looking at an anchor slice whether something is grossly abnormal.',
      },
    ],
  },
  {
    id: 'bones-marrow',
    number: 4,
    title: 'Bones & Marrow',
    subtitle: 'Edema patterns, fractures, and alignment',
    searchPatternStep: 2,
    estimatedMinutes: 15,
    essentialTopics: [0, 1, 2, 3, 6],
    topics: [
      'Marrow edema patterns and injury mechanisms',
      'Pivot-shift contusion pattern (ACL injury)',
      'Dashboard contusion pattern (PCL injury)',
      'Patellar dislocation contusion pattern',
      'Insufficiency and stress fractures',
      'Alignment assessment: varus/valgus',
      'Subchondral insufficiency fracture (SIF/SIF-ON) pattern recognition',
    ],
    learningObjectives: [
      'Recognize the pivot-shift, dashboard, and patellar dislocation contusion patterns',
      'Differentiate contusion from fracture using T1 signal characteristics',
      'Identify insufficiency and stress fractures on MRI',
      'Distinguish SIF from OCD and systemic osteonecrosis using age, location, morphology, and clinical context',
      'Recognize compartment-overload patterns on MRI and know when standing long-leg radiographs are needed for alignment',
    ],
    commonMistakes: [
      {
        mistake: "Seeing bone marrow edema and stopping at 'bone contusion' without describing the pattern",
        correction: 'The edema distribution suggests a mechanism and directs a targeted search. Posterolateral tibial plateau plus lateral femoral condyle strongly supports a pivot-shift injury, but the ACL still requires direct multiplanar assessment.',
      },
      {
        mistake: 'Missing a subtle fracture line within bone marrow edema',
        correction: 'Always check T1 and the subchondral plate for a low-signal fracture line or depression. Edema-like signal without a visible line is nonspecific and does not by itself prove a contusion or exclude an occult/subchondral fracture.',
      },
      {
        mistake: "Calling all subchondral femoral condyle lesions 'OCD'",
        correction: 'In an older adult, favor SIF over OCD when location, onset, and subchondral morphology fit, but do not diagnose by age alone. Assess the meniscal root/extrusion, cartilage, overload pattern, and osteonecrosis risk factors.',
      },
    ],
    topicContent: [
      {
        content: `### Bone Marrow Edema (BME)

**BME-like signal** appears as ill-defined **low signal on T1** and **high signal on PD FS/STIR**, reflecting increased water content and/or marrow replacement. In trauma it often represents microtrabecular injury, but the pattern is nonspecific and can also accompany stress/insufficiency injury, degeneration, inflammation, infection, or neoplasm.

The location and pattern of bone marrow edema is a useful diagnostic clue on knee MRI — several injury mechanisms produce characteristic distributions, but the pattern remains supportive rather than definitive.

### Three Questions When You See BME

1. **Where** is the edema?
2. **One surface or opposing surfaces?** — paired contact lesions can support an impaction mechanism, but a one-sided or bipolar pattern is not diagnostic by itself
3. **Does the pattern match a known injury mechanism?**

The answers guide you to **associated soft tissue injuries** that you need to actively seek.

### Prognostic Significance

- Edema extent may correlate with symptoms and recovery in some injuries, but is not a standalone prognosis measure
- **Subchondral edema-like signal** adjacent to a cartilage defect can support **mechanical overload**, while fracture, inflammation, and other causes remain context-dependent considerations

### Contusion Pattern Summary

| Pattern | Mechanism | Edema Location | Associated Injuries |
|---|---|---|---|
| **Pivot-shift** | Valgus + rotation | Posterolateral tibial plateau + lateral femoral condyle | **ACL tear**, lateral meniscal tear, PLC injury |
| **Dashboard** | Anterior blow, knee flexed | Anterior proximal tibia | **PCL tear**, posterior capsule/tibial fracture |
| **Patellar dislocation** | Lateral patellar subluxation | Medial patellar facet + anterolateral femoral condyle | **MPFL tear**, osteochondral fragments, loose bodies |
| **Direct lateral blow / valgus** | Lateral impact with valgus opening medially | Lateral-compartment contact edema may occur; medial-sided traction/soft-tissue findings vary | **MCL complex injury**; assess cruciates, menisci, and contact surfaces directly |
| **Hyperextension** | Forced hyperextension | Anterior femoral condyles + anterior tibial plateau | **ACL tear**, **PCL tear**, posterior capsule injury |`,
        pearl:
          'Evaluate marrow abnormalities on both T1 and fluid-sensitive images. A discrete low-signal line or subchondral deformity supports fracture, but diffuse edema-like signal without a visible line is nonspecific and can still reflect occult stress/SIF injury. Integrate morphology, mechanism, symptoms, and CT or follow-up when needed.',
        images: [
          {
            src: '/images/modules/contusion-patterns.svg',
            alt: 'Diagram of common bone contusion patterns and their associated injury mechanisms',
            caption: 'Common contusion patterns: pivot-shift (ACL), dashboard (PCL), and patellar dislocation',
          },
          {
            src: '/images/modules/bone-contusion-mri.svg',
            alt: 'MRI-style bone contusion patterns showing edema locations for pivot-shift, dashboard, and patellar dislocation injuries',
            caption: 'Bone contusion patterns on MRI: mechanism-based edema locations with associated injury alerts',
          },
          {
            src: '/images/teaching/modules/module4-bones/37_BoneContusion_ClipInjury_Sagittal.jpg',
            alt: 'Clip injury — LFC edema',
            caption: 'Clip injury — LFC edema',
            attribution: 'JCDR, 2016. PMC4866212. CC-BY-NC 3.0.',
          },
          {
            src: '/images/teaching/modules/module4-bones/39_BoneContusion_Hyperextension.jpg',
            alt: 'Hyperextension injury pattern on sagittal fat-suppressed MRI',
            caption: 'Hyperextension mechanism — the target finding is anterior "kissing" bone-marrow contusions of the femur and tibia; look for paired anterior subchondral edema on fat-suppressed images.',
            attribution: 'JCDR, 2016. PMC4866212. CC-BY-NC 3.0.',
          },
        ],
      },
      {
        content: `### Pivot-Shift Contusion Pattern (ACL Injury)

The **pivot-shift contusion pattern** is the most recognizable BME pattern on knee MRI and is **highly specific for ACL injury**.

**Mechanism:** Valgus load + rotation + anterior tibial translation — the lateral femoral condyle and posterolateral tibial plateau impact during the subluxation/reduction event. (Hyperextension is a *different* mechanism — it produces anterior kissing contusions of the tibia and femur, not this pattern.)

**MRI findings:**
- **Posterolateral tibial plateau** edema (often the sulcus region, just posterior to the midpoint)
- **Lateral femoral condyle** edema (typically mid-to-anterior weight-bearing surface)

### Clinical Implications

This pattern should create **high suspicion for ACL injury**. If it is present but the ACL looks intact on sagittal images:
- The tear may be **partial**
- The ACL fibers may be **draped over the PCL** (giving a false appearance of continuity)

**Deep contusions** extending to the subchondral plate can accompany osteochondral injury, but edema depth alone is not a deterministic long-term prognosis.`,
        pearl:
          'The posterolateral tibial plateau contusion in an ACL injury often has a geographic, sharp anterior margin — this represents the leading edge of the femoral condyle as it impacted during the pivot-shift event. If you see this sharp contusion edge, ACL injury becomes highly likely, but still confirm the ligament directly and check for associated meniscal injury.',
        images: [
          {
            src: '/images/teaching/cases/acl-pivot-shift/acl_kissing_contusions.jpg',
            alt: 'Pivot-shift bone contusions — posterolateral tibial plateau + LFC',
            caption: 'Pivot-shift bone contusions — lateral femoral condyle and posterolateral tibial plateau (arrows), the classic kissing-contusion pattern of ACL injury on sagittal fat-suppressed MRI.',
            attribution: 'Al Mohammad & Gharaibeh, Orthop Res Rev, 2024. PMC11463185. CC-BY-NC 3.0.',
          },
          {
            src: '/images/teaching/modules/module4-bones/35_BoneContusion_PivotShift_Sagittal.jpg',
            alt: 'Pivot-shift contusion — LFC + posterolateral tibial plateau',
            caption: 'Pivot-shift contusion — LFC + posterolateral tibial plateau',
            attribution: 'JCDR, 2016. PMC4866212. CC-BY-NC 3.0.',
          },
        ],
      },
      {
        content: `### Dashboard Contusion Pattern (PCL Injury)

**Mechanism:** Direct anterior blow to the proximal tibia with the knee flexed — classically, the knee hitting the dashboard in a motor vehicle accident. The tibia is driven **posteriorly** relative to the femur, stressing the **PCL**.

**MRI findings:**
- **Anterior proximal tibia** edema (from direct impact)
- Potentially the **anterior femoral condyles**

### Checklist When You See This Pattern

1. **PCL** — evaluate for partial tear (thickening, increased signal, some intact fibers) vs. complete tear (discontinuity, amorphous signal replacing normal smooth arc)
2. **Posterior tibial cortex** — look for fractures
3. **Posterolateral corner** — assess the **LCL**, **popliteus tendon**, and **popliteofibular ligament**

PCL injuries are less common than ACL injuries and are more frequently associated with **multi-ligament injury patterns**.`,
        pearl:
          'The normal PCL should have a smooth, gently curved arc of uniformly low signal on sagittal images. After dashboard injuries, look for loss of the normal curvature (the PCL appears "kinked" or redundant), thickening, or increased intrasubstance signal. A complete PCL tear shows frank discontinuity with surrounding hemorrhage.',
        images: [
          {
            src: '/images/teaching/modules/module4-bones/38_BoneContusion_Dashboard_Sagittal.jpg',
            alt: 'Dashboard injury — proximal tibia edema',
            caption: 'Dashboard injury — proximal tibia edema',
            attribution: 'JCDR, 2016. PMC4866212. CC-BY-NC 3.0.',
          },
        ],
      },
      {
        content: `### Patellar Dislocation Contusion Pattern

**Classic pattern:** bone marrow edema at the **medial patellar facet** and the **anterolateral aspect of the lateral femoral condyle**. Results from the patella impacting the lateral condyle as it dislocates laterally and then reduces. Even without a clinical history of patellar dislocation, this edema pattern should prompt focused evaluation for transient lateral patellar dislocation.

### Associated Injuries Checklist

1. **MPFL/medial retinacular injury** — present in approximately **90%** of acute traumatic patellar dislocations. Best seen on axial images as disruption and edema along the medial patellar retinacular region.
2. **Osteochondral injury** — look for cartilage/bone fragments off the **medial patella** or **lateral femoral condyle**. A displaced fragment is a time-sensitive, management-changing finding.
3. **Loose bodies** — search the **suprapatellar pouch**, **intercondylar notch**, and **posterior recesses**
4. **Medial retinacular tear** — thickening and edema of the medial retinaculum on axial images`,
        pearl:
          'After identifying the patellar dislocation contusion pattern, search the suprapatellar pouch, gutters, notch, and posterior recesses for chondral or osteochondral fragments. Report their size, composition, location, and donor site; when feasible, fragment fixation or cartilage restoration may be preferred to routine excision.',
        images: [
          {
            src: '/images/teaching/cases/patellar-dislocation/40_BoneContusion_PatellarDislocation.jpg',
            alt: 'Patellar dislocation — kissing contusions',
            caption: 'Patellar dislocation — kissing contusions',
            attribution: 'JCDR, 2016. PMC4866212. CC-BY-NC 3.0.',
          },
        ],
      },
      {
        content: `### Insufficiency vs. Fatigue Stress Fractures

- **Insufficiency fractures** — occur in **weakened bone** (typically osteoporotic) under normal physiologic loading
- **Fatigue stress fractures** — occur in **normal bone** subjected to repetitive excessive loading; insufficiency and fatigue injuries are both stress injuries

When a fracture line is visible, both can show a **linear low-signal line on T1/non-fat-suppressed images** with surrounding edema-like signal. Early stress injury or SIF may show edema-like signal before a discrete line becomes conspicuous.

### Common Locations

- **Insufficiency fractures** — medial tibial plateau, medial femoral condyle
- **Stress fractures** (athletes) — proximal medial tibia

### Key Distinguishing Feature

A discrete low-signal line or subchondral-plate deformity within edema-like signal strongly supports fracture. Diffuse signal without a visible line remains nonspecific; early stress injury and SIF can be occult, so integrate location, symptoms, follow-up, and CT when appropriate.

### What to Look For

- **Proximal tibial stress fractures** — linear band of low signal **perpendicular to the cortex**, often in the posterior medial tibial metaphysis. Subtle; best seen on **coronal T1**.
- **Tibial plateau insufficiency fractures** — may progress to **articular surface depression** if not protected with weight-bearing restrictions.`,
        pearl:
          'A subtle tibial plateau insufficiency fracture can be easily missed. The clue is a low-T1 band parallel to and just below the subchondral plate with surrounding edema-like signal. If this pattern fits the symptoms and location, communicate the suspected insufficiency fracture promptly so the treating team can determine weight-bearing precautions and follow-up.',
      },
      {
        content: `### Alignment Assessment on MRI

Alignment assessment on MRI is a **secondary evaluation** — weight-bearing radiographs are the standard for true alignment. However, coronal MRI images can demonstrate the **consequences of malalignment**.

**Medial compartment-overload pattern** (which may accompany varus mechanical alignment):
- Medial compartment **cartilage loss**
- **Meniscal degeneration**
- **Subchondral sclerosis** and **osteophytes**

**Lateral compartment-overload pattern** may accompany valgus mechanical alignment.

### Practical Assessment

- Evaluate the **"bone-on-bone" pattern**: severe cartilage loss with subchondral contact in one compartment + relatively preserved cartilage in the other
- Report this compartment pattern, while recognizing that arthroplasty selection also requires standing alignment, symptoms, examination, and radiographs
- Evaluate **posterior tibial slope** only with a named, reproducible method when it is clinically relevant; increased slope is one ACL-injury/graft-risk factor among many`,
        pearl:
          'When reporting alignment on MRI, do not provide angle measurements — MRI is not reliable for this. Instead, describe the compartmental pattern: "Findings are consistent with varus overload, with near-complete cartilage loss in the medial compartment and relative preservation of the lateral compartment." Recommend weight-bearing radiographs if alignment quantification is needed.',
      },
      {
        content: `### SIF / SIF-ON Pattern Recognition

Many lesions historically labeled **spontaneous osteonecrosis of the knee (SONK)** are now understood within the **subchondral insufficiency fracture (SIF)** spectrum. Some SIFs heal, while others develop secondary osteonecrosis (**SIF-ON**) and may progress to collapse. The medial femoral condyle is the most common site, but the tibial plateau and lateral compartment can also be involved.

**Classic MRI appearance:** Focal, well-defined area of **low T1 signal** in the subchondral bone of the medial femoral condyle with surrounding **diffuse marrow edema** on PD FS.

### Key Distinguishing Features of SIF

1. **Location** — usually the weight-bearing medial femoral condyle, while recognizing tibial and lateral-compartment lesions
2. **Subchondral fracture line** or subchondral plate depression, best seen on T1 or T2
3. **Disproportionate surrounding edema** — extensive edema relative to the small subchondral lesion
4. **Demographics** — older patients with acute pain onset

### SIF vs. OCD vs. Systemic Osteonecrosis

| Feature | SIF | OCD | Systemic osteonecrosis |
|---|---|---|---|
| **Age** | Typically skeletally mature/older | Adolescents/young adults | Variable |
| **Location** | Weight-bearing MFC | Lateral aspect of MFC | Weight-bearing condyle |
| **Onset** | Acute | Insidious | Variable |
| **Edema** | Disproportionately extensive | Less in chronic phase | Variable |
| **Key clue** | Subchondral fracture line | Well-defined fragment | Double-line sign on T2 |
| **Associations/risk** | Older age, meniscal root tear/extrusion, compartment overload; bone density may be normal or reduced | Activity-related | Steroids, alcohol, SLE |`,
        pearl:
          'Lesion size and morphology inform prognosis. Poorer-prognosis features include larger AP/transverse dimensions, a low-signal subchondral zone thicker than about 4 mm or longer than about 14 mm on fluid-sensitive imaging, and articular-surface flattening/collapse. Meniscal root tear/extrusion can contribute to compartment overload but is not the sole prognostic determinant. (The classic ">40% of condylar width" figure is a radiographic width ratio, not an MRI-area cutoff.) Report lesion dimensions, the low-signal zone, and the articular contour.',
        images: [
          {
            src: '/images/teaching/cases/sifk-sonk/26_ESSR_SIFK_SubchondralFracture_Edema.jpg',
            alt: 'SIF — medial-condyle edema-like signal with a subchondral fracture line',
            caption: 'SIF — medial-condyle edema-like signal with a subchondral fracture line',
            attribution: 'ESSR Practice Recommendations, Eur Radiol, 2024. PMC11399221. CC-BY 4.0.',
          },
        ],
      },
    ],
  },
  {
    id: 'cartilage-osteochondral',
    number: 5,
    title: 'Cartilage & Osteochondral',
    subtitle: 'Grading, OCD stability, SIF, and loose bodies',
    searchPatternStep: 3,
    estimatedMinutes: 20,
    essentialTopics: [0, 1, 2, 6],
    topics: [
      'Cartilage evaluation by compartment',
      'Cartilage grading systems',
      'OCD: location, sizing, and stability criteria',
      'Juvenile vs adult OCD differences',
      'MRI signs of fragment instability',
      'SIF vs OCD vs systemic osteonecrosis differentiation',
      'Loose body identification and reporting',
    ],
    learningObjectives: [
      'Grade cartilage lesions using a named system and distinguish modified Outerbridge from ICRS',
      'Identify OCD lesions and assess stability using MRI criteria',
      'Differentiate juvenile from adult OCD based on imaging and prognosis',
      'Distinguish SIF, OCD, and systemic osteonecrosis using a systematic comparison approach',
      'Detect loose bodies and identify their source',
    ],
    commonMistakes: [
      {
        mistake: 'Grading cartilage loss without specifying the compartment and exact location',
        correction: 'Always report: compartment (medial/lateral/patellofemoral), surface (femoral/tibial/patellar/trochlear), and location (weight-bearing vs non-weight-bearing). Surgeons need this precision.',
      },
      {
        mistake: "Calling an OCD 'unstable' based on surrounding edema alone",
        correction: 'Edema is nonspecific. Use skeletal maturity and age-specific criteria: joint-fluid-equivalent undermining, cartilage breach, displacement, and the appropriate cyst/subchondral-plate pattern.',
      },
      {
        mistake: 'Missing loose bodies in the posterior recesses',
        correction: 'Check the posteromedial and posterolateral recesses, the intercondylar notch, and the suprapatellar pouch on every case. Loose bodies preferentially settle in dependent recesses.',
      },
    ],
    topicContent: [
      {
        content: `### Systematic Cartilage Evaluation by Compartment

Evaluate cartilage systematically by compartment, assessing both surfaces independently:

- **Medial tibiofemoral** — medial femoral condyle + medial tibial plateau
- **Lateral tibiofemoral** — lateral femoral condyle + lateral tibial plateau
- **Patellofemoral** — patellar surface + femoral trochlea

**Best sequences:** **PD FS** and **T2 FS** — high contrast between intermediate-signal articular cartilage and bright joint fluid. Surface defects appear as fluid-signal "interruptions" in the cartilage layer.

### Normal Cartilage Parameters

- **Thickness:** 2-4 mm in weight-bearing zones; intermediate to high signal on PD FS
- **Thickest:** patella (up to **6-7 mm**)
- **Thinnest:** periphery of the tibial plateaus

### Reading Tips

- **Narrow your window** to maximize contrast
- Scroll **slowly** through each compartment
- Focus on the **weight-bearing zone** of the femoral condyles — the central-to-distal surface that contacts the tibia in extension (the more posterior condyle bears load in flexion, so don't neglect it when symptoms are flexion-related)
- Inspect posterior condylar cartilage as well as the extension weight-bearing surface; lesion relevance depends on location, size, depth, mechanics, and symptoms.`,
        pearl:
          'Axial images are primary for comparing patellar facets, the median ridge, and trochlear morphology, while sagittal images are complementary for craniocaudal extent and focal defects. Confirm suspected patellofemoral lesions in both planes.',
      },
      {
        content: `### Cartilage Grading System (Modified Outerbridge, MRI)

| Grade | Description | MRI Appearance |
|---|---|---|
| **0** | Normal | Homogeneous intermediate signal, smooth surface |
| **1** | Signal heterogeneity with intact surface | Swollen or internal signal change, **surface intact** |
| **2** | Partial-thickness defect **<50%** | Shallow surface irregularity, fluid signal partial depth |
| **3** | Partial-thickness defect **>50%** | Deep fissure or defect, does **not** reach subchondral bone |
| **4** | Full-thickness defect | **Exposed subchondral bone**, fluid signal extends to bone |

> **Outerbridge vs ICRS diverge at the deepest grades — name the system.** Full-thickness cartilage loss with an **intact** subchondral plate is **ICRS 3C** (modified Outerbridge IV); **ICRS grade 4** requires penetration **through** the subchondral bone plate (osteochondral).

### Reporting Checklist

When reporting cartilage lesions, specify:
- **Grade** (0-4)
- **Compartment and surface** (e.g., "medial femoral condyle")
- **Location within surface** (e.g., "weight-bearing zone")
- **Approximate size** (AP and transverse dimensions)

### Surgical Relevance

For treatment planning, size and location are as important as depth. Procedure selection is individualized using lesion size, containment, bone involvement, compartment, alignment, age, activity, symptoms, and prior treatment. Size ranges sometimes used for marrow stimulation, osteochondral transfer, cell-based repair, or allograft overlap substantially and should not be presented as MRI-only treatment rules. Report AP and transverse dimensions, depth, containment, and subchondral change.`,
        pearl:
          'Report the named grade, percentage depth, dimensions, location, containment, and subchondral changes. MRI describes the lesion; symptoms, examination, alignment, patient factors, and prior treatment determine whether an operation is appropriate.',
      },
      {
        content: `### Osteochondritis Dissecans (OCD)

OCD is a focal disorder of subchondral bone that can affect the overlying cartilage and may progress to fragment instability. MRI evaluates the lesion bed, cartilage, interface, and any displacement; interface high signal can represent fluid or healing tissue, so its significance depends on skeletal maturity and the complete pattern.

### OCD Locations

- **Lateral aspect of the medial femoral condyle** — ~70–80% of knee OCD lesions (classic location)
- **Lateral femoral condyle** (particularly the weight-bearing surface) — less common
- **Patella** — less common

### OCD Reporting Checklist

1. **Location** — specify the condyle and zone (e.g., "lateral aspect of the medial femoral condyle")
2. **Size** — measure in two dimensions (sagittal and coronal); report both the **bony fragment size** and the **overlying cartilage involvement**
3. **Stability** — a central determination that guides treatment urgency and options:
   - **Stable juvenile OCD** often begins with activity modification and follow-up
   - **Unstable lesions** merit orthopedic evaluation for fixation or other treatment, integrated with symptoms and skeletal maturity`,
        pearl:
          'The "classic" OCD location on the lateral aspect of the medial femoral condyle corresponds to the contact area of the tibial eminence during knee flexion. When you see a lesion here, trace the tibial eminence on coronal images — the tip of the eminence often points directly at the OCD, which can help distinguish OCD from other subchondral lesions.',
      },
      {
        content: `### Juvenile vs. Adult OCD

The distinction is **clinically critical** — it determines treatment approach and prognosis.

| Feature | Juvenile OCD | Adult OCD |
|---|---|---|
| **Physes** | Open | Closed |
| **Prognosis** | Much better | Significantly worse |
| **Healing** | Higher rates of spontaneous healing | Less likely to heal conservatively |
| **Stable lesion management** | Often begins nonoperatively | Individualized; lower healing potential than juvenile disease |

### Key Imaging Step

When you identify an OCD, **look at the distal femoral physis** on coronal images to determine skeletal maturity:
- **Open physes** = juvenile OCD = note in your report (changes the clinical pathway)
- **Closed physes** = adult OCD = lower spontaneous-healing potential and a different treatment discussion
- **Partially closed physes** = transition zone, more nuanced management decisions`,
        pearl:
          'Check the distal femoral physis on every OCD case. Open physes define juvenile OCD and generally confer better healing potential; closed physes lower spontaneous-healing potential. Stability, symptoms, lesion size/location, and clinical follow-up still drive management.',
      },
      {
        content: `### OCD Stability Criteria on MRI

Determining fragment stability is arguably the **most important assessment** when evaluating an OCD. These signs have been well-validated against arthroscopic findings.

### MRI Signs of Instability

| Sign | Description |
|---|---|
| **Complete fluid rim** | High-signal line (fluid on T2/PD FS) **completely surrounding** the fragment at the bone interface |
| **Subchondral cysts** | Fluid-filled cysts **beneath** the fragment |
| **Cartilage breach** | High-signal line extending **through the overlying cartilage** |
| **Fragment displacement** | Fragment partially or completely **dislodged** from its bed |
| **Empty crater** | Focal defect in the articular surface with **absent fragment** |

### Age-Specific Considerations

- **Juvenile patients** — an isolated T2-bright interface rim has poor specificity because vascular granulation tissue can be normal at the healing interface. Stronger criteria include a rim that matches joint-fluid signal with an outer low-signal rim, multiple breaks in the subchondral plate, or multiple/large (>5 mm) interface cysts; displacement is unequivocal.
- **Adults** — the classic fluid-rim, cyst, cartilage-breach, and displacement criteria are more specific than in juveniles.
- **When in doubt** — report stability as **indeterminate** and recommend orthopedic/clinical correlation rather than routinely prescribing arthrography.`,
        pearl:
          'Do not apply adult De Smet criteria unchanged to juvenile OCD. A T2-bright rim alone is unreliable in an open-physis knee; look for the more specific fluid-equivalent rim plus outer low-signal rim, multiple subchondral-plate breaks, multiple/large cysts, cartilage breach, or displacement.',
        images: [
          {
            src: '/images/modules/ocd-stability-mri.svg',
            alt: 'OCD stability assessment on MRI comparing stable and unstable fragments',
            caption: 'OCD stability: stable (intact cartilage, no fluid rim, no cysts) vs unstable (complete fluid rim, subchondral cysts, cartilage breach)',
          },
        ],
      },
      {
        content: `### SIF vs. OCD vs. Systemic Osteonecrosis

All three involve subchondral bone pathology and can be challenging to differentiate. The clinical context — **patient age**, **symptom onset**, and **risk factors** — is essential.

| Feature | SIF | OCD | Systemic osteonecrosis |
|---|---|---|---|
| **Age** | >55 years | Adolescents / young adults | Variable |
| **Location** | Weight-bearing MFC surface | Lateral aspect of MFC (non-weight-bearing in extension) | Weight-bearing condylar surface |
| **Onset** | Acute pain | Insidious / activity-related | Variable |
| **Fragment** | Subchondral fracture line | Well-defined osteochondral fragment | Band pattern on T1 |
| **Edema** | Disproportionately extensive | Less in chronic phase | Variable |
| **T2 sign** | Subchondral plate depression | Fluid rim around fragment | **Double-line sign** |
| **Associations** | Meniscal root tear/extrusion and compartment overload may contribute | Activity, repetitive loading | Steroids, alcohol, SLE, sickle cell |
| **Bilateral?** | Rarely | Sometimes | Often |

### Three Key Discriminators

1. **Skeletal maturity and age** — open physes support juvenile OCD; older age supports SIF, but neither is an absolute cutoff
2. **Location and morphology** — lateral aspect of the MFC is classic for OCD; a weight-bearing subchondral fracture band supports SIF; a serpiginous geographic rim supports systemic osteonecrosis
3. **Risk factors and onset** — acute/subacute pain without major trauma supports SIF, while glucocorticoid exposure, heavy alcohol use, or systemic disease supports osteonecrosis`,
        pearl:
          'For medial-femoral-condyle subchondral disease, combine skeletal maturity, age, exact location, fracture-band versus serpiginous morphology, onset, and osteonecrosis risk factors. These are weighted clues rather than hard age cutoffs; state the reasoning when the pattern is not definitive.',
      },
      {
        content: `### Loose Body Identification

Loose bodies should be **actively searched for on every knee MRI**. They can originate from:
- **Osteochondral fractures** (patellar dislocation, OCD fragment detachment)
- **Synovial chondromatosis**
- **Degenerative cartilage fragmentation**
- **Meniscal fragments**

### Imaging Appearance

- Best identified on **PD FS** and **T2** sequences
- **Calcified/ossified** loose bodies — **low-signal structures** surrounded by bright joint fluid
- **Purely cartilaginous** loose bodies — intermediate signal, may blend with surrounding soft tissues (more difficult to detect)

### Where to Look

Loose bodies collect in dependent or recessed areas:
- **Suprapatellar pouch** (most common location)
- **Posterior recesses** (behind the femoral condyles)
- **Intercondylar notch**
- **Popliteal fossa** (if a Baker cyst communicates with the joint)

### Reporting Checklist

- **Location**, **size**, **number** (if multiple), and whether **calcified**
- Look for a **"donor site"** — a focal osteochondral defect where the fragment originated
- If in a **Baker cyst**, note this (surgical approach may differ)`,
        pearl:
          'After identifying an osteochondral injury, actively search the suprapatellar pouch, gutters, notch, and posterior recesses for loose bodies. Report number, size, composition, location, and donor site; treatment depends on symptoms, fragment characteristics, and whether fixation or cartilage restoration is feasible.',
        images: [
          {
            src: '/images/teaching/modules/module5-cartilage/25_ESSR_Osteochondral_Defect_LooseBody.jpg',
            alt: 'Osteochondral defect with loose body',
            caption: 'Osteochondral defect with loose body',
            attribution: 'ESSR Practice Recommendations, Eur Radiol, 2024. PMC11399221. CC-BY 4.0.',
          },
        ],
      },
    ],
  },
  {
    id: 'menisci',
    number: 6,
    title: 'Menisci',
    subtitle: 'Tears, roots, ramp lesions, extrusion, and reporting',
    searchPatternStep: 4,
    estimatedMinutes: 25,
    essentialTopics: [0, 1, 2, 3, 4, 5],
    topics: [
      'Meniscal signal grading (grade 1-3)',
      'Two-slice-touch rule for tear diagnosis',
      'Tear morphology: horizontal, vertical, radial, complex',
      'Root tears: identification and functional significance',
      'Ramp lesions: location and ACL association',
      'Bucket-handle tears: donor site, fragment, double PCL sign',
      'Meniscal extrusion measurement technique',
      'Parameniscal cysts',
      'Post-surgical meniscus evaluation',
    ],
    learningObjectives: [
      'Grade meniscal signal (1, 2, 3) and apply the two-slice-touch rule',
      'Classify meniscal tears by morphology and understand their biomechanical significance',
      'Identify root tears and explain how a complete medial posterior-root disruption altered contact mechanics in the cadaveric model',
      'Recognize ramp lesions and their association with ACL injuries',
      'Identify bucket-handle tears using the three cardinal signs',
      'Measure meniscal extrusion and interpret its clinical significance',
    ],
    commonMistakes: [
      {
        mistake: 'Calling grade 2 intrasubstance signal a tear',
        correction: 'Grade 3 signal unequivocally reaches an articular surface; seeing that contact on two or more matching images markedly increases confidence. The images need not be contiguous and may be matching orthogonal images. Grade 2 remains intrasubstance; a one-image surface finding needs morphologic and orthogonal correlation.',
      },
      {
        mistake: "Missing a radial tear because it's only visible on one or two images",
        correction: "Radial tears are perpendicular to the imaging plane and may only appear as a blunted or absent meniscal segment on one slice. Look for the 'ghost meniscus' sign.",
      },
      {
        mistake: 'Not checking the meniscal root when you see extrusion >3mm',
        correction: 'At least 3 mm is a conventional major medial-extrusion threshold, not a diagnosis. Exclude osteophytes, report the continuous measurement, and search for root/radial tear and cartilage loss in multiple planes; smaller extrusion does not exclude dysfunction.',
      },
      {
        mistake: 'Forgetting to look for a ramp lesion in every ACL tear',
        correction: 'Ramp lesions are present in 16-24% of ACL-deficient knees and are missed on up to half of preoperative MRIs. Check the posterior meniscocapsular junction on sagittal and axial images.',
      },
    ],
    topicContent: module6Content,
  },
  {
    id: 'ligaments',
    number: 7,
    title: 'Ligaments',
    subtitle: 'ACL/PCL, MCL/LCL, PLC, and MPFL',
    searchPatternStep: 5,
    estimatedMinutes: 20,
    essentialTopics: [0, 1, 3, 4, 5, 7],
    topics: [
      'ACL tear: primary and secondary signs',
      'ACL mucoid degeneration vs tear',
      'ACL graft evaluation',
      'PCL tear patterns and dashboard mechanism',
      'MCL injury grading and deep vs superficial layers',
      'LCL and posterolateral corner (PLC) anatomy and injury',
      'Posteromedial corner structures',
      'MPFL evaluation in patellar instability',
      'Combined injury patterns',
    ],
    learningObjectives: [
      'Evaluate the ACL on sagittal images and identify primary and secondary tear signs',
      'Assess the PCL for partial and complete tears',
      'Grade MCL injuries (I, II, III) based on MRI findings',
      'Identify posterolateral corner structures and injury patterns',
      'Evaluate the MPFL and its role in patellar stability',
    ],
    commonMistakes: [
      {
        mistake: 'Calling the ACL intact because fibers are visible on sagittal images',
        correction: 'ACL fibers can drape over the PCL after a tear, mimicking continuity. Check fiber tension, trajectory (should parallel the intercondylar roof), and secondary signs (contusions, anterior tibial translation).',
      },
      {
        mistake: 'Not recognizing a mucoid ACL degeneration as different from a tear',
        correction: "Mucoid degeneration shows a bulky, hyperintense ACL that is still continuous and under tension. It has a 'celery stalk' appearance. The ACL is intact but abnormal-looking.",
      },
      {
        mistake: 'Grading an MCL injury without specifying superficial vs deep layer involvement',
        correction: 'The deep MCL includes meniscofemoral and meniscotibial attachments to the medial meniscus. Describe involved layers, location, displacement, and associated meniscocapsular injury because these can alter prognosis and treatment planning.',
      },
    ],
    topicContent: module7Content,
  },
  {
    id: 'extensor-synovium',
    number: 8,
    title: 'Extensor Mechanism & Synovium/Bursae',
    subtitle: "Quad/patellar tendon, Baker's cyst, and effusion",
    searchPatternStep: 6,
    estimatedMinutes: 15,
    essentialTopics: [0, 1, 2, 3],
    topics: [
      'Quadriceps tendon tears: partial vs complete',
      'Patellar tendon pathology: tendinopathy vs tear',
      'Patellar fractures and bipartite patella',
      'Effusion characterization and lipohemarthrosis',
      "Baker's cyst: anatomy, rupture, mimics",
      'Bursitis patterns: prepatellar, infrapatellar, pes anserine',
      'Synovial pathology: tenosynovial giant cell tumor (formerly PVNS), synovial chondromatosis',
      "Muscle Strains, Myotendinous Injuries & Avulsions",
    ],
    learningObjectives: [
      'Evaluate the quadriceps tendon layers and identify partial vs complete tears',
      'Assess patellar tendon integrity and diagnose tendinopathy vs tear',
      'Differentiate bipartite patella from fracture',
      'Recognize common bursitis patterns around the knee',
      'Identify tenosynovial giant cell tumor and synovial chondromatosis',
      "Apply a practical three-grade descriptive muscle-strain framework within the knee field of view, report structure/extent/retraction/hematoma, and recognize that routine knee MRI cannot exclude DVT in a patient with calf pain.",
    ],
    commonMistakes: [
      {
        mistake: 'Missing a deep-layer quadriceps tendon partial tear',
        correction: 'A partial tear may involve only one quadriceps-tendon layer while the remaining fibers stay intact. Inspect superficial, middle, and deep contributions on sagittal and axial images for a discrete fluid-signal gap and fiber discontinuity.',
      },
      {
        mistake: 'Calling patellar tendinopathy a tear',
        correction: 'Tendinopathy shows thickening and increased signal but maintains continuity. A tear shows a discrete defect with fiber discontinuity. The distinction matters for treatment.',
      },
      {
        mistake: "Diagnosing a patellar fracture when it's a bipartite patella",
        correction: 'Bipartite patella has smooth, corticated margins (superolateral location is classic). Fractures have irregular, non-corticated margins with surrounding edema and effusion.',
      },
    ],
    topicContent: module8Content,
  },
  {
    id: 'top-10-dont-miss',
    number: 9,
    title: "12 Don't-Miss Findings",
    subtitle: 'High-yield findings that change management',
    searchPatternStep: null,
    estimatedMinutes: 15,
    essentialTopics: [0, 2, 3, 6, 7, 10, 11],
    topics: [
      'Root tears with extrusion',
      'Ramp lesions in ACL injuries',
      'Bucket-handle tears (displaced fragment)',
      'Unstable OCD fragments',
      'PLC injuries (LCL + popliteus)',
      'MPFL tear with osteochondral fragment',
      'Lipohemarthrosis (occult fracture)',
      'Segond fracture (lateral capsular sign)',
      'Multiligament injury patterns',
      'Post-surgical re-tear vs expected appearance',
      'What surgeons need from your MRI read',
      'Critical findings requiring direct communication',
    ],
    learningObjectives: [
      'Identify bucket-handle tears by their three cardinal signs',
      'Assess OCD fragment stability using MRI criteria',
      'Recognize posterolateral corner injury including the arcuate sign',
      'Evaluate post-surgical meniscus and distinguish healing from re-tear',
      'Identify lipohemarthrosis and understand its clinical significance',
    ],
    commonMistakes: [
      {
        mistake: 'Seeing a normal-appearing meniscus on sagittal body images and moving on',
        correction: 'Count your body segments. Normally you should see at least two consecutive sagittal images with a bow-tie configuration. Fewer than two = absent bow-tie sign = possible bucket-handle.',
      },
      {
        mistake: 'Calling intermediate signal in a repaired meniscus a re-tear',
        correction: 'Post-repair signal can persist for years. Re-tear is favored by new fluid-equivalent surface signal plus changed morphology, displaced tissue, or interval change; use operative details and prior images, and reserve MR arthrography for selected equivocal cases when it will change care.',
      },
      {
        mistake: 'Missing a posterolateral corner injury because you focused on the ACL',
        correction: 'Satisfaction of search! In ACL + PCL injuries, always check: fibular collateral ligament, popliteus tendon, popliteofibular ligament, and the arcuate complex. PLC injuries change surgical timing.',
      },
    ],
    topicContent: module10Content,
  },
];
