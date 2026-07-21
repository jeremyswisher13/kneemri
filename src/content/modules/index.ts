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
- **PD FS (proton density fat-suppressed)** — the **single most important sequence** for knee MRI. Fat suppression removes bright fat signal, so **edema and fluid** stand out as bright signal against a dark background. Detects most pathology: **bone marrow edema**, **meniscal tears**, **ligament injuries**, **cartilage defects**, and **joint effusion**.
- **T2-weighted** — similar to PD FS (fluid is bright), but with higher contrast between fluid and soft tissue. Useful for characterizing **cysts** and **effusions**.`,
        pearl:
          'If you only had one sequence to read, it should be the sagittal PD FS. This single series can show you ACL tears, meniscal tears, bone bruises, cartilage lesions, and effusion. But never read just one sequence — always cross-reference findings across sequences and planes.',
      },
      {
        content: `### Sequence Roles in Your Diagnostic Toolkit

**T1-weighted — Anatomy & Fracture Detection**

Normal marrow is fatty and therefore **bright on T1**. Any process that replaces normal marrow fat will appear **dark on T1**:
- Fracture
- Tumor
- Infection
- Edema

This makes T1 highly sensitive for marrow pathology when you compare it to the expected bright signal.

**PD FS — Edema & Soft Tissue Pathology**

Because fat signal is suppressed, any edema or fluid "lights up" as bright signal. Your primary sequence for:
- **Meniscal tears** — high signal reaching an articular surface
- **Ligament injuries** — disrupted fibers with surrounding edema
- **Bone marrow edema** — bright signal in the subchondral bone

**T2-weighted — Fluid Characterization**

Excellent for characterizing **fluid collections**. Often used in coronal and axial planes.`,
        pearl:
          'A finding that is dark on T1 and bright on PD FS is almost always edema or fluid. A finding that is bright on both T1 and PD FS could be subacute blood (methemoglobin) or proteinaceous fluid. Always correlate signal characteristics across sequences before making your diagnosis.',
      },
      {
        content: `### Common Artifacts and Pitfalls

**Magic Angle Artifact** — the most clinically important artifact. Structures oriented at **55 degrees to the main magnetic field** show artifactually increased signal on **short TE sequences** (T1 and PD). Commonly affects:
- **Posterior horn of the lateral meniscus** (where it curves upward)
- **Popliteus tendon**
- Portions of the **cruciate ligaments**

Key rule: **magic angle artifact disappears on T2**. If increased signal in a meniscus on PD disappears on T2, it is likely artifact, not a tear.

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
- **Meniscus** — widen the window slightly so the normally dark meniscus shows internal contrast, making **intrasubstance signal changes** easier to detect.
- **Cartilage** (PD FS) — narrow the window to maximize contrast between cartilage and adjacent fluid.

Develop the habit of adjusting window/level as you move through your search pattern, optimizing for each structure you evaluate.`,
        pearl:
          'When evaluating the meniscus, briefly widen your window to see the internal signal of the meniscus better. When evaluating cartilage, narrow your window to maximize contrast between the cartilage surface and any adjacent fluid that would indicate a defect.',
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

- **Tibial eminences** (medial and lateral intercondylar spines) — visible on coronal images; attachment sites for cruciate ligaments and meniscal roots. **Tibial eminence fractures** are common in adolescents and represent an **avulsion equivalent of an ACL tear**.
- **Segond fracture** — a small avulsion off the lateral tibial plateau and a **highly specific marker of associated ACL injury**. Best seen on coronal images; confirm the ACL directly.
- **Femoral intercondylar notch** — the "home" of the cruciate ligaments. **Notch stenosis** (narrow or A-frame notch) is a risk factor for ACL tears.
- **Tibial tubercle** — insertion of the patellar tendon; site of **Osgood-Schlatter disease** in adolescents.

### Alignment

The **mechanical axis** should pass through the center of the knee on coronal images:
- **Varus** malalignment — shifts load to the **medial** compartment
- **Valgus** malalignment — shifts load to the **lateral** compartment`,
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

**Root tears** are functionally equivalent to a **total meniscectomy** — they eliminate the meniscus's ability to distribute hoop stresses. Best evaluated on coronal and axial images; look for normal dark root fibers inserting on the tibial plateau. A **"ghost meniscus" sign** (absent meniscal tissue on sagittal images) combined with **meniscal extrusion** suggests a root tear.`,
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
          'When reading the ACL on sagittal images, use the lateral femoral condyle as your starting point and scroll medially until you see the ACL fibers. The normal ACL should be visualized across at least 2-3 consecutive sagittal slices. If you cannot identify intact fibers on any sagittal slice, assume it is torn until proven otherwise on coronal images.',
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
          'The popliteal hiatus is the single most common normal variant that mimics a lateral meniscal tear. The key: on sagittal images at the posterolateral corner, if you see the round popliteus tendon sitting in the "gap" in the meniscus, it is the hiatus, not a tear. Confirm by following the tendon on consecutive slices.',
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
          'When evaluating the quadriceps tendon, remember it has layers. Partial tears most commonly involve the deep (vastus intermedius) layer and can be subtle. On sagittal PD FS images, look for fluid signal interposed within the tendon layers at the superior patellar pole. Complete tears will show retraction of the tendon with a gap filled by hemorrhage or fluid.',
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
      'Satisfaction of search: the most common cognitive error',
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
        mistake: "Skipping Step 6 (synovium/bursae) because 'nothing is usually there'",
        correction: 'Baker cyst rupture, PVNS, plicae, and periarticular bursitis are often incidental but clinically important findings that change management.',
      },
    ],
    topicContent: [
      {
        content: `### Why Systematic Reading Prevents Missed Findings

A **systematic search pattern** is the single most effective tool for preventing missed diagnoses on knee MRI. Studies consistently show that missed findings are rarely due to the lesion being invisible — in most cases, the reader simply **never looked at the area** where the lesion was located.

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

**Satisfaction of search** is the most common cognitive error in image interpretation. Once you find a significant abnormality, your brain becomes **psychologically "satisfied"** and less attentive to additional findings. This is not laziness — it is a well-documented cognitive bias.

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

1. **Overall assessment** — effusion, alignment, and global marrow signal
2. **Bones and marrow** — contusion patterns, fractures, marrow lesions
3. **Cartilage and osteochondral surfaces** — all three compartments
4. **Menisci** — medial and lateral, including roots
5. **Ligaments** — cruciates, collaterals, posterolateral corner, MPFL
6. **Extensor mechanism and soft tissues** — tendons, bursae, synovium, cysts
7. **Final review** — return to the clinical question and ensure it is answered

### Why Step-by-Step Works

Each step focuses your attention on a **specific tissue type**, allowing you to:
- Optimize your **window/level settings** for that tissue
- **Mentally calibrate** for that tissue's normal appearance
- Maintain **focused attention** — more efficient and more sensitive than evaluating everything at once

When you are looking at cartilage, you are not trying to also evaluate ligaments — you are entirely focused on cartilage surfaces across all three compartments.`,
        pearl:
          'The 7-step pattern moves from "big picture" (effusion, alignment) to "specific structures" (menisci, ligaments) to "final check" (clinical correlation). If you find yourself jumping around — looking at the ACL, then cartilage, then back to the meniscus, then the ACL again — you are not using a systematic approach and you will miss things.',
        images: [
          {
            src: '/images/modules/search-pattern-flowchart.svg',
            alt: 'Flowchart of the 7-step knee MRI search pattern',
            caption: 'The 7-step systematic search pattern: from overall assessment through final review',
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
      'SIFK/SONK pattern recognition',
    ],
    learningObjectives: [
      'Recognize the pivot-shift, dashboard, and patellar dislocation contusion patterns',
      'Differentiate contusion from fracture using T1 signal characteristics',
      'Identify insufficiency and stress fractures on MRI',
      'Distinguish SIFK from OCD and AVN based on age, location, and imaging features',
      'Assess alignment on coronal images',
    ],
    commonMistakes: [
      {
        mistake: "Seeing bone marrow edema and stopping at 'bone contusion' without describing the pattern",
        correction: 'The edema PATTERN is the diagnosis. Posterolateral tibial plateau + lateral femoral condyle = pivot-shift = ACL tear until proven otherwise.',
      },
      {
        mistake: 'Missing a subtle fracture line within bone marrow edema',
        correction: 'Always check T1 for a discrete low-signal line within the edema. Edema alone is a contusion; a line within edema is a fracture — which changes weight-bearing status.',
      },
      {
        mistake: "Calling all subchondral femoral condyle lesions 'OCD'",
        correction: 'SIFK in a 60-year-old woman is NOT OCD. Check age, location, onset, and associated meniscal root tear. The differential (SIFK vs OCD vs AVN) has completely different management.',
      },
    ],
    topicContent: [
      {
        content: `### Bone Marrow Edema (BME)

**BME** appears as ill-defined areas of **low signal on T1** and **high signal on PD FS/STIR**, reflecting increased water content in the marrow space. In the trauma setting, BME represents **microtrabecular injury** (bone contusion or bone bruise).

The location and pattern of bone marrow edema is one of the most **powerful diagnostic clues** on knee MRI — specific injury mechanisms produce characteristic edema patterns.

### Three Questions When You See BME

1. **Where** is the edema?
2. **One side or both?** — one side suggests compressive injury on that side (or traction on the opposite side); both sides suggests impaction
3. **Does the pattern match a known injury mechanism?**

The answers guide you to **associated soft tissue injuries** that you need to actively seek.

### Prognostic Significance

- Extensive edema is associated with **longer recovery times**
- **Subchondral edema** adjacent to a cartilage defect suggests **mechanical overload**

### Contusion Pattern Summary

| Pattern | Mechanism | Edema Location | Associated Injuries |
|---|---|---|---|
| **Pivot-shift** | Valgus + rotation | Posterolateral tibial plateau + lateral femoral condyle | **ACL tear**, lateral meniscal tear, PLC injury |
| **Dashboard** | Anterior blow, knee flexed | Anterior proximal tibia | **PCL tear**, posterior capsule/tibial fracture |
| **Patellar dislocation** | Lateral patellar subluxation | Medial patellar facet + anterolateral femoral condyle | **MPFL tear**, osteochondral fragments, loose bodies |
| **Clip/valgus** | Direct lateral blow (valgus) | Lateral femoral condyle (larger, direct impaction) + medial femoral condyle (smaller, avulsive at the MCL) | **MCL tear**, medial meniscal tear |
| **Hyperextension** | Forced hyperextension | Anterior femoral condyles + anterior tibial plateau | **ACL tear**, **PCL tear**, posterior capsule injury |`,
        pearl:
          'Always evaluate bone marrow edema on both T1 and PD FS. The T1 sequence helps you determine if there is a discrete fracture line (which appears as a low-signal line within the edema) versus diffuse contusion (ill-defined low signal without a discrete line). This distinction matters: fractures may need protected weight-bearing.',
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

**Mechanism:** Valgus load + internal tibial rotation + anterior tibial translation — the lateral femoral condyle subluxates over the posterolateral tibial plateau, creating impaction contusions in both locations. (Hyperextension is a *different* mechanism — it produces anterior kissing contusions of the tibia and femur, not this pattern.)

**MRI findings:**
- **Posterolateral tibial plateau** edema (often the sulcus region, just posterior to the midpoint)
- **Lateral femoral condyle** edema (typically mid-to-anterior weight-bearing surface)

### Clinical Implications

This pattern is so characteristic that when you see it, **assume the ACL is torn until proven otherwise**. If the edema pattern is present but the ACL looks intact on sagittal images:
- The tear may be **partial**
- The ACL fibers may be **draped over the PCL** (giving a false appearance of continuity)

**Deep contusions** extending to the subchondral plate are associated with higher rates of **cartilage damage** and may predict worse long-term outcomes.`,
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
2. **Osteochondral injury** — look for cartilage/bone fragments off the **medial patellar facet** or **lateral femoral condyle**. This is the **most surgically urgent finding**.
3. **Loose bodies** — search the **suprapatellar pouch**, **intercondylar notch**, and **posterior recesses**
4. **Medial retinacular tear** — thickening and edema of the medial retinaculum on axial images`,
        pearl:
          'After identifying the patellar dislocation contusion pattern, immediately look at the axial images through the suprapatellar pouch and the intercondylar notch for loose bodies. Osteochondral fragments from the medial patellar facet are present in up to 50% of first-time patellar dislocations, and if they are displaced into the joint, they require surgical removal.',
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
        content: `### Insufficiency vs. Stress Fractures

- **Insufficiency fractures** — occur in **weakened bone** (typically osteoporotic) under normal physiologic loading
- **Stress fractures** — occur in **normal bone** subjected to repetitive abnormal loading

Both present as **linear low-signal lines on T1** surrounded by marrow edema.

### Common Locations

- **Insufficiency fractures** — medial tibial plateau, medial femoral condyle
- **Stress fractures** (athletes) — proximal medial tibia

### Key Distinguishing Feature

A **discrete, linear low-signal line on T1** within the area of marrow edema = fracture. **Diffuse marrow signal change** without a discrete line = contusion.

### What to Look For

- **Proximal tibial stress fractures** — linear band of low signal **perpendicular to the cortex**, often in the posterior medial tibial metaphysis. Subtle; best seen on **coronal T1**.
- **Tibial plateau insufficiency fractures** — may progress to **articular surface depression** if not protected with weight-bearing restrictions.`,
        pearl:
          'A subtle tibial plateau insufficiency fracture can be easily missed. The clue is a band of low T1 signal running parallel to and just below the subchondral plate of the medial tibial plateau, with surrounding edema on PD FS. If you see this pattern in an older patient with sudden onset of medial knee pain, report it as a possible insufficiency fracture and recommend protected weight-bearing.',
      },
      {
        content: `### Alignment Assessment on MRI

Alignment assessment on MRI is a **secondary evaluation** — weight-bearing radiographs are the standard for true alignment. However, coronal MRI images can demonstrate the **consequences of malalignment**.

**Varus-aligned knee** (medial compartment overload):
- Medial compartment **cartilage loss**
- **Meniscal degeneration**
- **Subchondral sclerosis** and **osteophytes**

**Valgus-aligned knee** — same changes predominate **laterally**.

### Practical Assessment

- Evaluate the **"bone-on-bone" pattern**: severe cartilage loss with subchondral contact in one compartment + relatively preserved cartilage in the other
- Report this compartment pattern — it influences surgical decision-making (**unicompartmental vs. total knee arthroplasty**)
- Evaluate the **tibial plateau slopes** on sagittal images — an increased **posterior tibial slope** is a risk factor for ACL injury`,
        pearl:
          'When reporting alignment on MRI, do not provide angle measurements — MRI is not reliable for this. Instead, describe the compartmental pattern: "Findings are consistent with varus overload, with near-complete cartilage loss in the medial compartment and relative preservation of the lateral compartment." Recommend weight-bearing radiographs if alignment quantification is needed.',
      },
      {
        content: `### SIFK / SONK Pattern Recognition

**Spontaneous osteonecrosis of the knee (SONK)**, now more accurately termed **subchondral insufficiency fracture of the knee (SIFK)**, most commonly affects the **weight-bearing surface of the medial femoral condyle** in patients **over 55**, presenting with **acute onset** of medial knee pain.

**Classic MRI appearance:** Focal, well-defined area of **low T1 signal** in the subchondral bone of the medial femoral condyle with surrounding **diffuse marrow edema** on PD FS.

### Key Distinguishing Features of SIFK

1. **Location** — almost always the weight-bearing surface of the medial femoral condyle (can occur in the medial tibial plateau)
2. **Subchondral fracture line** or subchondral plate depression, best seen on T1 or T2
3. **Disproportionate surrounding edema** — extensive edema relative to the small subchondral lesion
4. **Demographics** — older patients with acute pain onset

### SIFK vs. OCD vs. AVN

| Feature | SIFK | OCD | AVN |
|---|---|---|---|
| **Age** | >55 years | Adolescents/young adults | Variable |
| **Location** | Weight-bearing MFC | Lateral aspect of MFC | Weight-bearing condyle |
| **Onset** | Acute | Insidious | Variable |
| **Edema** | Disproportionately extensive | Less in chronic phase | Variable |
| **Key clue** | Subchondral fracture line | Well-defined fragment | Double-line sign on T2 |
| **Risk factors** | Osteoporosis, meniscal root tear | Activity-related | Steroids, alcohol, SLE |`,
        pearl:
          'Lesion size and morphology on MRI predict outcome. Higher risk of progression to subchondral collapse is signaled by larger anteroposterior/transverse lesion dimensions, a subchondral low-signal fracture line longer than ~14 mm or thicker than ~4 mm on T2 (Lecouvet), articular-surface collapse, and an associated medial meniscus posterior root tear with extrusion. (The classic ">40% of condylar width" figure is a radiographic width ratio, not an MRI area — do not apply it as a sagittal-MRI area cutoff.) Small lesions without collapse often respond to protected weight-bearing; always measure and report AP and transverse dimensions and note any surface collapse.',
        images: [
          {
            src: '/images/teaching/cases/sifk-sonk/26_ESSR_SIFK_SubchondralFracture_Edema.jpg',
            alt: 'SIFK — medial condyle edema + subchondral fracture line',
            caption: 'SIFK — medial condyle edema + subchondral fracture line',
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
    subtitle: 'Grading, OCD stability, SIFK, and loose bodies',
    searchPatternStep: 3,
    estimatedMinutes: 20,
    essentialTopics: [0, 1, 2, 6],
    topics: [
      'Cartilage evaluation by compartment',
      'Cartilage grading systems',
      'OCD: location, sizing, and stability criteria',
      'Juvenile vs adult OCD differences',
      'MRI signs of fragment instability',
      'SIFK vs OCD vs AVN differentiation',
      'Loose body identification and reporting',
    ],
    learningObjectives: [
      'Grade cartilage lesions using the modified ICRS classification on MRI',
      'Identify OCD lesions and assess stability using MRI criteria',
      'Differentiate juvenile from adult OCD based on imaging and prognosis',
      'Distinguish SIFK, OCD, and AVN using a systematic comparison approach',
      'Detect loose bodies and identify their source',
    ],
    commonMistakes: [
      {
        mistake: 'Grading cartilage loss without specifying the compartment and exact location',
        correction: 'Always report: compartment (medial/lateral/patellofemoral), surface (femoral/tibial/patellar/trochlear), and location (weight-bearing vs non-weight-bearing). Surgeons need this precision.',
      },
      {
        mistake: "Calling an OCD 'unstable' based on surrounding edema alone",
        correction: 'Edema is common in both stable and unstable lesions. Instability requires fluid signal between the fragment and parent bone, cystic change at the interface, or a displaced fragment.',
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
- Defects in the posterior condyles are **most clinically important** and more likely to be symptomatic`,
        pearl:
          'Patellofemoral cartilage is best evaluated on axial images, not sagittal. On axial PD FS, you can see the entire patellar articular surface and the opposing trochlear surface. The most common location for patellar cartilage loss is the lateral patellar facet — always look here.',
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

For surgical planning, size and location are as important as the grade. Full-thickness weight-bearing femoral-condyle defects are candidates for **cartilage restoration**, with technique guided by size: **microfracture for small lesions (<2 cm²)**, OATS/mosaicplasty for small-to-mid lesions (~2–4 cm²), and ACI/MACI or fresh osteochondral allograft for larger lesions (>~2–4 cm²). Accurate AP and transverse measurement matters because it drives the choice.`,
        pearl:
          'The distinction between grade 2 and grade 3 lesions is clinically important: grade 3 and 4 defects in the weight-bearing femoral condyle may be candidates for surgical cartilage restoration (microfracture, OATS, ACI/MACI), while grade 2 lesions are generally managed conservatively. Report the thickness involvement as precisely as you can.',
      },
      {
        content: `### Osteochondritis Dissecans (OCD)

A segment of **subchondral bone** and its overlying **cartilage** separates from the surrounding bone. On MRI: a well-defined osteochondral fragment separated from the parent bone by a line of **high signal** (fluid or fibrous tissue) on PD FS or T2.

### OCD Locations

- **Lateral aspect of the medial femoral condyle** — ~70–80% of knee OCD lesions (classic location)
- **Lateral femoral condyle** (particularly the weight-bearing surface) — less common
- **Patella** — less common

### OCD Reporting Checklist

1. **Location** — specify the condyle and zone (e.g., "lateral aspect of the medial femoral condyle")
2. **Size** — measure in two dimensions (sagittal and coronal); report both the **bony fragment size** and the **overlying cartilage involvement**
3. **Stability** — the **most important determination**. Guides whether the patient needs surgery:
   - **Stable OCD** → conservative management (especially in juveniles)
   - **Unstable OCD** → generally requires **surgical intervention**`,
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
| **Stable lesion management** | Conservative (high success rate) | Lower threshold for surgery |

### Key Imaging Step

When you identify an OCD, **look at the distal femoral physis** on coronal images to determine skeletal maturity:
- **Open physes** = juvenile OCD = note in your report (changes the clinical pathway)
- **Closed physes** = adult OCD = lower healing potential, earlier surgical intervention
- **Partially closed physes** = transition zone, more nuanced management decisions`,
        pearl:
          'Check the distal femoral physis on every OCD case. Open physes = juvenile OCD = better prognosis, more likely to heal conservatively. Closed physes = adult OCD = lower healing potential, earlier surgical intervention. This single observation can change the entire treatment plan.',
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

- **Juvenile patients** — the most reliable sign of instability is a high-signal rim **completely surrounding** the fragment on T2. A **partial rim** may represent **granulation tissue** at the healing interface (not true instability).
- **Adult patients** — any high-signal rim is **more concerning** for instability.
- **When in doubt** — report stability as **"indeterminate"** and recommend clinical correlation or arthroscopy.`,
        pearl:
          'A thin, partial-signal rim around an OCD in a juvenile patient may actually represent healing granulation tissue, not instability. The rim must be complete (surrounding the entire fragment) and clearly fluid-bright to confidently call it unstable. When the rim is equivocal, report it as "possible instability" and suggest close follow-up or arthrogram for further evaluation.',
        images: [
          {
            src: '/images/modules/ocd-stability-mri.svg',
            alt: 'OCD stability assessment on MRI comparing stable and unstable fragments',
            caption: 'OCD stability: stable (intact cartilage, no fluid rim, no cysts) vs unstable (complete fluid rim, subchondral cysts, cartilage breach)',
          },
        ],
      },
      {
        content: `### SIFK vs. OCD vs. AVN Differentiation

All three involve subchondral bone pathology and can be challenging to differentiate. The clinical context — **patient age**, **symptom onset**, and **risk factors** — is essential.

| Feature | SIFK | OCD | AVN |
|---|---|---|---|
| **Age** | >55 years | Adolescents / young adults | Variable |
| **Location** | Weight-bearing MFC surface | Lateral aspect of MFC (non-weight-bearing in extension) | Weight-bearing condylar surface |
| **Onset** | Acute pain | Insidious / activity-related | Variable |
| **Fragment** | Subchondral fracture line | Well-defined osteochondral fragment | Band pattern on T1 |
| **Edema** | Disproportionately extensive | Less in chronic phase | Variable |
| **T2 sign** | Subchondral plate depression | Fluid rim around fragment | **Double-line sign** |
| **Associations** | Meniscal root tear (may be inciting event) | Activity, repetitive loading | Steroids, alcohol, SLE, sickle cell |
| **Bilateral?** | Rarely | Sometimes | Often |

### Three Key Discriminators

1. **Patient age** — under 20 suggests OCD, over 55 suggests SIFK
2. **Location** — lateral aspect of MFC = classic OCD; central weight-bearing surface = SIFK or AVN
3. **Risk factors** — steroid use or alcohol points to AVN`,
        pearl:
          'When you see subchondral bone pathology in the medial femoral condyle, use three key discriminators: (1) Patient age — under 20 suggests OCD, over 55 suggests SIFK; (2) Location — lateral aspect of the MFC is classic OCD, central weight-bearing surface is SIFK or AVN; (3) Risk factors — steroid use or alcohol points to AVN. Always state your differential and the reasoning in the report.',
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
          'After identifying any osteochondral injury (patellar dislocation contusion pattern, OCD, or cartilage flap), actively search the suprapatellar pouch, intercondylar notch, and posterior recesses for loose bodies. These are frequently missed findings with direct surgical implications — a loose body in the joint needs to be removed.',
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
      'Identify root tears and understand their functional equivalence to total meniscectomy',
      'Recognize ramp lesions and their association with ACL injuries',
      'Identify bucket-handle tears using the three cardinal signs',
      'Measure meniscal extrusion and interpret its clinical significance',
    ],
    commonMistakes: [
      {
        mistake: 'Calling grade 2 intrasubstance signal a tear',
        correction: 'Grade 3 signal unequivocally reaches an articular surface; seeing that contact on two consecutive standard slices markedly increases confidence. Grade 2 signal remains intrasubstance and is common over age 40. A one-slice surface finding needs morphologic and orthogonal correlation rather than automatic dismissal or overcall.',
      },
      {
        mistake: "Missing a radial tear because it's only visible on one or two images",
        correction: "Radial tears are perpendicular to the imaging plane and may only appear as a blunted or absent meniscal segment on one slice. Look for the 'ghost meniscus' sign.",
      },
      {
        mistake: 'Not checking the meniscal root when you see extrusion >3mm',
        correction: 'Extrusion >3mm is pathologic and should trigger a careful root-tear search, especially when there is medial compartment overload or SIFK. Trace the root on coronal and axial images.',
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
        correction: 'The deep MCL (meniscotibial ligament) attaches to the meniscus. Its injury can cause meniscal displacement and has different surgical implications than superficial MCL injury.',
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
      'Synovial pathology: PVNS, synovial chondromatosis',
      "Muscle Strains, Myotendinous Injuries & Avulsions",
    ],
    learningObjectives: [
      'Evaluate the quadriceps tendon layers and identify partial vs complete tears',
      'Assess patellar tendon integrity and diagnose tendinopathy vs tear',
      'Differentiate bipartite patella from fracture',
      'Recognize common bursitis patterns around the knee',
      'Identify PVNS and synovial chondromatosis',
      "Apply the universal three-grade MRI muscle-strain framework to knee-region myotendinous injuries — proximal hamstring avulsion, medial gastrocnemius \"tennis leg,\" and adductor/rectus femoris strains — and generate a surgically actionable report that includes tear grade, percent cross-sectional involvement, retraction distance, and the relevant differential (DVT, Baker's cyst rupture).",
    ],
    commonMistakes: [
      {
        mistake: 'Missing a deep-layer quadriceps tendon partial tear',
        correction: 'The vastus intermedius (deepest layer) is the layer most often involved in a partial tear. Look for fluid signal between tendon layers at the superior patellar pole on sagittal PD FS.',
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
    title: "Top 10 Don't Miss",
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
        correction: 'Post-repair signal can persist for 12+ months. Only fluid-bright signal (matching joint fluid on T2) reaching the surface is a definitive re-tear. When in doubt, recommend MR arthrography.',
      },
      {
        mistake: 'Missing a posterolateral corner injury because you focused on the ACL',
        correction: 'Satisfaction of search! In ACL + PCL injuries, always check: fibular collateral ligament, popliteus tendon, popliteofibular ligament, and the arcuate complex. PLC injuries change surgical timing.',
      },
    ],
    topicContent: module10Content,
  },
];
