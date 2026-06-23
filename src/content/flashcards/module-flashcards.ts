export interface Flashcard {
  /** Stable, globally-unique id: `fc-<moduleId>-t<topicIndex>-<n>` (n is 1-based). */
  id: string;
  question: string;
  answer: string;
}

export interface TopicFlashcards {
  topicIndex: number;
  cards: Flashcard[];
}

import { shoulderModuleFlashcards } from "@/content/shoulder/flashcards";
import { hipModuleFlashcards } from "@/content/hip/flashcards";

// Keyed by module ID. Module IDs are globally unique across courses, so the
// knee, shoulder, and hip card sets merge into one lookup without collision.
export const moduleFlashcards: Record<string, TopicFlashcards[]> = {
  // Shoulder course cards (keyed by shoulder-* module IDs).
  ...shoulderModuleFlashcards,

  // Hip course cards (keyed by hip-* module IDs).
  ...hipModuleFlashcards,

  // ─── Module 1: MRI Basics ───────────────────────────────────────────
  'mri-basics': [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-mri-basics-t0-1',
          question: 'Which imaging plane is the workhorse of knee MRI, and what structures does it best evaluate?',
          answer: 'Sagittal. It is the primary plane for evaluating the cruciate ligaments, the meniscal horns (the "bow-tie" body in cross-section), cartilage surfaces, and the extensor mechanism. (Meniscal body extrusion is measured on coronal.)',
        },
        {
          id: 'fc-mri-basics-t0-2',
          question: 'How do you confirm medial versus lateral orientation on coronal knee MRI images?',
          answer: 'Identify the fibular head, which is always on the lateral side.',
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-mri-basics-t1-1',
          question: 'What is the single most important sequence for knee MRI, and why?',
          answer: 'PD FS (proton density fat-suppressed). Fat suppression removes bright fat signal so edema and fluid stand out. It detects bone marrow edema, meniscal tears, ligament injuries, cartilage defects, and effusion.',
        },
        {
          id: 'fc-mri-basics-t1-2',
          question: 'On T1-weighted images, what does normal marrow look like and what causes it to appear dark?',
          answer: 'Normal marrow is fatty and therefore bright on T1. Any process that replaces marrow fat (fracture, tumor, infection, edema) appears dark on T1.',
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-mri-basics-t2-1',
          question: 'A finding is dark on T1 and bright on PD FS. What does this signal combination represent?',
          answer: 'Almost always edema or fluid. A finding bright on both T1 and PD FS could be subacute blood (methemoglobin) or proteinaceous fluid.',
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-mri-basics-t3-1',
          question: 'What is magic angle artifact, and how do you confirm it is not a true meniscal tear?',
          answer: 'Magic angle artifact causes increased signal in structures oriented at 55 degrees to the main magnetic field on short TE sequences (T1, PD). It disappears on T2. If meniscal signal on PD disappears on T2, it is artifact, not a tear.',
        },
        {
          id: 'fc-mri-basics-t3-2',
          question: 'What artifact produces a linear bright line within the meniscus parallel to its surface, mimicking a horizontal tear?',
          answer: 'Truncation (Gibbs) artifact. It runs parallel to, and a fixed short distance from, the meniscal surface and does NOT contact the articular surface (a true tear reaches a surface). Reduce it by increasing the acquisition matrix or changing the phase-encode direction.',
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: 'fc-mri-basics-t4-1',
          question: 'How should you adjust window/level differently when evaluating menisci versus cartilage?',
          answer: 'Widen the window for meniscal evaluation to reveal internal signal changes within the dark meniscus. Narrow the window for cartilage to maximize contrast between the cartilage surface and adjacent fluid.',
        },
      ],
    },
  ],

  // ─── Module 2: Anatomy ──────────────────────────────────────────────
  anatomy: [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-anatomy-t0-1',
          question: 'Name the three compartments of the knee.',
          answer: 'Medial tibiofemoral, lateral tibiofemoral, and patellofemoral.',
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-anatomy-t1-1',
          question: 'What is the Segond fracture and what is its clinical significance?',
          answer: 'A small avulsion fracture of the lateral tibial rim. It is pathognomonic for ACL injury.',
        },
        {
          id: 'fc-anatomy-t1-2',
          question: 'What is the significance of a tibial eminence fracture in an adolescent?',
          answer: 'It represents an avulsion equivalent of an ACL tear.',
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-anatomy-t2-1',
          question: 'Why is the medial meniscus more susceptible to tears than the lateral meniscus?',
          answer: 'The medial meniscus is firmly attached to the joint capsule and deep MCL, giving it limited mobility. The lateral meniscus is more circular, more mobile, and detaches from the capsule at the popliteal hiatus.',
        },
        {
          id: 'fc-anatomy-t2-2',
          question: 'What is the functional consequence of a meniscal root tear?',
          answer: 'A root tear is functionally equivalent to total meniscectomy because it eliminates the ability to distribute circumferential hoop stresses.',
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-anatomy-t3-1',
          question: 'On sagittal MRI, what is the expected appearance and orientation of a normal ACL?',
          answer: 'A taut, low-signal band extending from the lateral femoral condyle to the anterior tibial plateau, oriented approximately parallel to the Blumensaat line (intercondylar roof).',
        },
        {
          id: 'fc-anatomy-t3-2',
          question: 'What are the two layers of the MCL and what structure does the deep layer attach to?',
          answer: 'Superficial MCL (primary valgus stabilizer, extends 5-7 cm below the joint line) and deep MCL (meniscofemoral and meniscotibial ligaments that attach directly to the medial meniscus).',
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: 'fc-anatomy-t4-1',
          question: 'How do you distinguish the popliteal hiatus from a lateral meniscal tear on sagittal images?',
          answer: 'Look for the round popliteus tendon sitting within the gap. If the tendon is present, it is the normal popliteal hiatus, not a tear. Confirm by following the tendon on consecutive slices.',
        },
        {
          id: 'fc-anatomy-t4-2',
          question: 'Where do the meniscofemoral ligaments of Humphrey and Wrisberg run in relation to the PCL?',
          answer: 'Humphrey passes anterior to the PCL; Wrisberg passes posterior to the PCL. Both run from the posterior horn of the lateral meniscus to the medial femoral condyle.',
        },
      ],
    },
    {
      topicIndex: 5,
      cards: [
        {
          id: 'fc-anatomy-t5-1',
          question: 'What are the three layers of the quadriceps tendon from superficial to deep?',
          answer: 'Rectus femoris (superficial), vastus medialis and lateralis (middle), and vastus intermedius (deep).',
        },
        {
          id: 'fc-anatomy-t5-2',
          question: 'What is the MPFL and what is its primary function?',
          answer: 'The medial patellofemoral ligament runs from the adductor tubercle region to the superomedial patella. It is the primary soft tissue restraint preventing lateral patellar translation.',
        },
      ],
    },
  ],

  // ─── Module 3: Search Pattern Overview ──────────────────────────────
  'search-pattern-overview': [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-search-pattern-overview-t0-1',
          question: 'Why are most missed findings on knee MRI not due to lesion invisibility?',
          answer: 'Studies show that missed findings are rarely invisible. In most cases, the reader simply never looked at the area where the lesion was located. A systematic search pattern forces evaluation of every structure every time.',
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-search-pattern-overview-t1-1',
          question: 'What is satisfaction of search and how does it lead to missed diagnoses?',
          answer: 'Once you find a significant abnormality, your brain becomes psychologically satisfied and less attentive to additional findings. The antidote is to complete your entire search pattern before constructing the report.',
        },
        {
          id: 'fc-search-pattern-overview-t1-2',
          question: 'You correctly diagnose an ACL tear. Name three commonly associated injuries you must still actively search for.',
          answer: 'Lateral meniscal posterior horn tear, medial meniscal ramp lesion, posterolateral corner injury. Also: bone contusions in the lateral compartment and cartilage damage.',
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-search-pattern-overview-t2-1',
          question: 'List the 7 steps of the knee MRI search pattern in order.',
          answer: '1) Overall assessment (effusion, alignment, marrow), 2) Bones and marrow, 3) Cartilage and osteochondral surfaces, 4) Menisci, 5) Ligaments, 6) Extensor mechanism and soft tissues, 7) Final review (return to clinical question).',
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: 'fc-search-pattern-overview-t4-1',
          question: 'What is an anchor slice and what are the three key anchor slices for knee MRI?',
          answer: 'An anchor slice is a specific slice where you know normal anatomy and can navigate from. Key anchors: sagittal midline intercondylar notch (cruciates), coronal mid-condylar (meniscal bodies, collaterals), and axial patellofemoral joint (MPFL, trochlea).',
        },
      ],
    },
  ],

  // ─── Module 4: Bones & Marrow ───────────────────────────────────────
  'bones-marrow': [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-bones-marrow-t0-1',
          question: 'How do you differentiate a bone contusion from a fracture on MRI?',
          answer: 'Both show bone marrow edema on fluid-sensitive sequences. A fracture has a discrete low-signal line on T1 within the edema; a contusion does not. This distinction changes weight-bearing status.',
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-bones-marrow-t1-1',
          question: 'What is the pivot-shift bone contusion pattern and what injury does it suggest?',
          answer: 'Edema in the posterolateral tibial plateau and the lateral femoral condyle sulcus. This pattern is present in many acute ACL tears and should trigger direct ACL evaluation plus a search for associated meniscal injuries.',
        },
        {
          id: 'fc-bones-marrow-t1-2',
          question: 'What is the dashboard bone contusion pattern?',
          answer: 'Edema in the anterior tibial plateau from a posterior-directed force on the flexed knee. This pattern is associated with PCL tears.',
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-bones-marrow-t3-1',
          question: 'What is the classic bone bruise pattern of lateral patellar dislocation?',
          answer: 'Edema on the medial patellar facet and the anterolateral aspect of the lateral femoral condyle. This pattern results from the patella impacting the lateral condyle during transient dislocation.',
        },
      ],
    },
    {
      topicIndex: 6,
      cards: [
        {
          id: 'fc-bones-marrow-t6-1',
          question: 'What is SIFK (SONK) and how does it differ from OCD?',
          answer: 'SIFK (subchondral insufficiency fracture of the knee) occurs in older patients (typically women >55) with acute-onset pain and shows subchondral low-signal fracture line with surrounding edema, often in the medial femoral condyle. OCD occurs in younger patients (10-25) at the lateral aspect of the medial femoral condyle with a well-defined osteochondral fragment.',
        },
      ],
    },
  ],

  // ─── Module 5: Cartilage & Osteochondral ────────────────────────────
  'cartilage-osteochondral': [
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-cartilage-osteochondral-t1-1',
          question: 'What are the modified ICRS grades for cartilage loss on MRI?',
          answer: 'Grade 1: signal abnormality with intact surface. Grade 2: partial-thickness defect (<50%). Grade 3: partial-thickness defect (>50%) or full-thickness without bone exposure. Grade 4: full-thickness with subchondral bone exposure.',
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-cartilage-osteochondral-t2-1',
          question: 'Where is the most common location for OCD in the knee?',
          answer: 'The lateral aspect of the medial femoral condyle, accounting for approximately 70–80% of cases.',
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: 'fc-cartilage-osteochondral-t4-1',
          question: 'What is the most reliable MRI sign of OCD fragment instability?',
          answer: 'A high-signal-intensity rim (fluid signal on T2) surrounding the fragment at the interface with parent bone, indicating fluid undermining the lesion. A low-signal rim on T1 is nonspecific and can represent fibrous healing or a cleavage plane.',
        },
        {
          id: 'fc-cartilage-osteochondral-t4-2',
          question: 'Name four MRI signs of OCD instability.',
          answer: 'Fluid-signal line at fragment-bone interface on T2, fluid-filled cyst beneath the lesion, displaced or partially displaced fragment, and disruption of the overlying articular cartilage surface.',
        },
      ],
    },
    {
      topicIndex: 6,
      cards: [
        {
          id: 'fc-cartilage-osteochondral-t6-1',
          question: 'Where should you search for loose bodies on knee MRI?',
          answer: 'Posteromedial and posterolateral recesses, the intercondylar notch, and the suprapatellar pouch. Loose bodies preferentially settle in dependent recesses.',
        },
      ],
    },
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-cartilage-osteochondral-t0-1',
          question: 'How should you systematically report knee articular cartilage?',
          answer: 'Compartment by compartment — medial and lateral tibiofemoral plus patellofemoral — assessing BOTH surfaces of each. Patellofemoral cartilage is best seen on axial images; the patellar median ridge and lateral facet are common defect sites. The medial compartment bears the greater load, so early loss often shows there first.',
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-cartilage-osteochondral-t3-1',
          question: 'What single imaging check separates juvenile from adult OCD, and why does it matter?',
          answer: 'The distal femoral physis on coronal images: OPEN physes = juvenile OCD (greater healing potential, more often managed conservatively); CLOSED physes = adult OCD (poorer healing, more often surgical). Caveat: in skeletally immature patients a high-T2 rim alone is unreliable for instability — it can be vascular granulation in a stable lesion.',
        },
      ],
    },
  ],

  // ─── Module 6: Menisci ──────────────────────────────────────────────
  menisci: [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-menisci-t0-1',
          question: 'What grade of intrameniscal signal reaches the articular surface?',
          answer: 'Grade 3. Grade 1 is a globular dot of mucinous degeneration, Grade 2 is linear intrameniscal signal not reaching the surface, and Grade 3 contacts the articular surface (= tear).',
        },
        {
          id: 'fc-menisci-t0-2',
          question: 'On PD / short-TE images, does intrameniscal signal have to be as bright as fluid to call a tear?',
          answer: 'No — on PD / short-TE, surface-reaching intermediate-to-high signal is enough; it need not approach fluid intensity. (Requiring fluid-bright signal is the T2 / long-TE criterion, which is why T2 is less sensitive.) The key is signal unequivocally reaching an articular surface on ≥2 consecutive images.',
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-menisci-t1-1',
          question: 'What is the two-slice-touch rule?',
          answer: 'Meniscal signal must contact the articular surface on at least two consecutive sagittal images (at standard 3-4 mm slice thickness) to be diagnosed as a tear. This reduces false positives from volume averaging and truncation artifact.',
        },
        {
          id: 'fc-menisci-t1-2',
          question: 'Why does the two-slice-touch rule require caution at 3T?',
          answer: 'At 3T, magic angle effect and magnetization transfer can cause artifactually increased intrameniscal signal, particularly in the posterior horn of the lateral meniscus near the popliteal hiatus, mimicking tears.',
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-menisci-t2-1',
          question: 'Why are radial meniscal tears biomechanically significant even when small?',
          answer: 'Radial tears disrupt the circumferential hoop fibers of the meniscus, eliminating its ability to distribute axial load. This is true regardless of tear size.',
        },
        {
          id: 'fc-menisci-t2-2',
          question: 'What is the "ghost meniscus" sign and what tear type does it suggest?',
          answer: 'The meniscus appears absent or truncated on images through the tear. It is seen with radial tears (where the tear is parallel to the imaging plane) and with root tears on sagittal images.',
        },
        {
          id: 'fc-menisci-t2-3',
          question: 'What is the most common degenerative meniscal tear pattern and where does it typically originate?',
          answer: 'Horizontal (cleavage) tear, running parallel to the tibial plateau and splitting the meniscus into upper and lower leaves. It most commonly originates in the posterior horn of the medial meniscus.',
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-menisci-t3-1',
          question: 'A meniscal root tear is functionally equivalent to what procedure?',
          answer: 'Total meniscectomy. Root tears completely disrupt the circumferential hoop stresses that allow the meniscus to distribute axial load.',
        },
        {
          id: 'fc-menisci-t3-2',
          question: 'What is the root tear triad?',
          answer: 'Posterior medial root tear + meniscal extrusion (>3 mm) + subchondral insufficiency fracture of the medial femoral condyle or tibial plateau. The root tear is the underlying biomechanical cause.',
        },
        {
          id: 'fc-menisci-t3-3',
          question: 'What is the "ghost sign" on sagittal images in the context of a root tear?',
          answer: 'Absence of the normal dark posterior horn root attachment adjacent to the PCL insertion on sagittal images. It indicates the root has been avulsed or disrupted.',
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: 'fc-menisci-t4-1',
          question: 'What is a ramp lesion and how common is it in ACL-injured knees?',
          answer: 'A peripheral longitudinal tear of the posterior horn of the medial meniscus at the meniscocapsular junction. It is found in approximately 16-24% of ACL-deficient knees.',
        },
        {
          id: 'fc-menisci-t4-2',
          question: 'What is the reported MRI sensitivity for detecting ramp lesions?',
          answer: 'Only 48-65%. Ramp lesions are notoriously underdiagnosed on preoperative MRI, missed in up to half of cases. In every ACL tear, actively search the posterior meniscocapsular junction.',
        },
      ],
    },
    {
      topicIndex: 5,
      cards: [
        {
          id: 'fc-menisci-t5-1',
          question: 'What are the three cardinal signs of a bucket-handle tear?',
          answer: 'Absent bow-tie sign (fewer than two consecutive body sagittal images), double PCL sign (displaced fragment parallel to the PCL), and flipped meniscus sign (fragment adjacent to the anterior horn making it appear disproportionately large).',
        },
        {
          id: 'fc-menisci-t5-2',
          question: 'How many consecutive sagittal images should show the normal bow-tie configuration of the meniscal body?',
          answer: 'At least two. Fewer than two consecutive bow-tie images suggests a bucket-handle tear with displacement of the central fragment.',
        },
      ],
    },
    {
      topicIndex: 6,
      cards: [
        {
          id: 'fc-menisci-t6-1',
          question: 'How is meniscal extrusion measured, and what threshold is pathologic?',
          answer: 'Measured on coronal images at the meniscal mid-body: distance from the outer tibial plateau margin to the outermost meniscal edge. Greater than 3 mm is pathologic; greater than 5 mm suggests severe extrusion with major loss of hoop stress function.',
        },
        {
          id: 'fc-menisci-t6-2',
          question: 'At what meniscal extrusion threshold should you actively search for a meniscal root tear?',
          answer: 'Extrusion >3 mm is pathologic and should prompt an active search for a meniscal root tear on coronal and axial images; >5 mm indicates severe meniscal dysfunction with major loss of hoop-stress function.',
        },
      ],
    },
    {
      topicIndex: 7,
      cards: [
        {
          id: 'fc-menisci-t7-1',
          question: 'What is the relationship between parameniscal cysts and meniscal tears?',
          answer: 'Most parameniscal cysts have an underlying meniscal tear acting as a one-way valve. The tear allows joint fluid to decompress into parameniscal tissues. The cyst may recur if only the cyst is treated without addressing the causative tear.',
        },
        {
          id: 'fc-menisci-t7-2',
          question: 'What complication can a large lateral parameniscal cyst near the fibular head cause?',
          answer: 'Compression of the common peroneal nerve, presenting with foot drop.',
        },
      ],
    },
    {
      topicIndex: 8,
      cards: [
        {
          id: 'fc-menisci-t8-1',
          question: 'After meniscal repair, what signal criterion distinguishes re-tear from expected postoperative healing?',
          answer: 'Fluid-bright signal (matching joint fluid on T2) reaching the articular surface indicates re-tear. Intermediate signal at the repair site represents expected healing granulation tissue and should not be overcalled.',
        },
        {
          id: 'fc-menisci-t8-2',
          question: 'After partial meniscectomy, what does the normal meniscal remnant look like on MRI?',
          answer: 'Truncated and blunted with a smooth, well-defined free edge and uniformly low signal. Persistent grade 3 signal extending to the new articular surface suggests re-tear.',
        },
      ],
    },
  ],

  // ─── Module 7: Ligaments ────────────────────────────────────────────
  ligaments: [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-ligaments-t0-1',
          question: 'What are the primary MRI signs of an ACL tear?',
          answer: 'Discontinuity of ligament fibers, abnormal morphology (wavy, lax, or horizontally oriented), and abnormal signal intensity (edema/hemorrhage on T2). A complete tear shows amorphous edematous tissue replacing the ligament.',
        },
        {
          id: 'fc-ligaments-t0-2',
          question: 'Name three secondary signs of an ACL tear.',
          answer: 'Pivot-shift bone contusions (posterolateral tibial plateau + lateral femoral condyle sulcus), anterior tibial translation >5 mm, and PCL buckling. Others include deepened lateral femoral sulcus >1.5 mm, Segond fracture, and uncovered posterior horn sign.',
        },
        {
          id: 'fc-ligaments-t0-3',
          question: 'What is the Segond fracture and what is its association with ACL tears?',
          answer: 'A small avulsion of the lateral tibial rim representing anterolateral ligament avulsion. It is pathognomonic for ACL tear, with ACL injury present in approximately 75-100% of cases.',
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-ligaments-t1-1',
          question: 'How does ACL mucoid degeneration differ from an ACL tear on MRI?',
          answer: 'Mucoid degeneration shows a thickened, bulbous ACL with diffuse T2 signal but intact, continuous fibers ("celery stalk" appearance). Unlike tears, fiber tension and orientation are preserved, and secondary signs (bone contusions, tibial translation) are absent.',
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-ligaments-t2-1',
          question: 'What is the ACL graft ligamentization period, and how does it appear on MRI?',
          answer: 'During the first 6-12 months, the graft undergoes revascularization and remodeling with increased T2 signal. This is expected and should not be confused with graft failure. A mature graft (12-24 months) should be uniformly low signal.',
        },
        {
          id: 'fc-ligaments-t2-2',
          question: 'What is the most common technical error leading to ACL graft failure?',
          answer: 'Tunnel malposition. The two mechanisms differ: an anteriorly placed TIBIAL tunnel causes roof (notch) impingement in extension, while a too-anterior or vertical FEMORAL tunnel produces a non-isometric/vertical graft with persistent rotational (pivot-shift) instability. On sagittal MRI, the femoral tunnel should sit in the posterior aspect of the intercondylar notch.',
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-ligaments-t3-1',
          question: 'What is the classic mechanism for a PCL tear?',
          answer: 'A posterior-directed force on the proximal tibia with the knee flexed -- the "dashboard injury." Bone contusions are typically on the anterior tibial plateau.',
        },
        {
          id: 'fc-ligaments-t3-2',
          question: 'When does a PCL buckle anteriorly, and why is this important to recognize?',
          answer: 'The PCL may buckle anteriorly in the setting of an ACL tear with anterior tibial translation. This should not be confused with a primary PCL injury.',
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: 'fc-ligaments-t4-1',
          question: 'What are the three grades of MCL injury and their MRI findings?',
          answer: 'Grade I (sprain): periligamentous edema with intact fibers. Grade II (partial tear): partial discontinuity with surrounding edema. Grade III (complete tear): complete fiber disruption with fluid filling the gap.',
        },
        {
          id: 'fc-ligaments-t4-2',
          question: 'Why is it important to specify whether an MCL injury involves the superficial or deep layer?',
          answer: 'The deep MCL (meniscotibial ligament) attaches directly to the medial meniscus. Deep MCL tears can cause meniscocapsular separation, which may require surgical repair -- a different management path than an isolated superficial MCL sprain.',
        },
      ],
    },
    {
      topicIndex: 5,
      cards: [
        {
          id: 'fc-ligaments-t5-1',
          question: 'What are the three primary posterolateral corner (PLC) structures?',
          answer: 'LCL (fibular collateral ligament), popliteus tendon, and popliteofibular ligament.',
        },
        {
          id: 'fc-ligaments-t5-2',
          question: 'What is the arcuate fracture and what does it indicate?',
          answer: 'Avulsion of the fibular styloid. It is pathognomonic for a posterolateral corner injury.',
        },
        {
          id: 'fc-ligaments-t5-3',
          question: 'Why is an unrecognized PLC injury an important, frequently overlooked cause of cruciate graft failure?',
          answer: 'Unrecognized PLC injury allows persistent external rotation and varus laxity, which overloads cruciate ligament reconstructions. PLC injuries must be identified and addressed for successful graft outcomes.',
        },
      ],
    },
    {
      topicIndex: 6,
      cards: [
        {
          id: 'fc-ligaments-t6-1',
          question: 'What is the primary structure of the posteromedial corner and what instability pattern does PMC injury create?',
          answer: 'The posterior oblique ligament (POL). PMC injury contributes to anteromedial rotatory instability (AMRI), and when combined with ACL tear, creates greater rotational instability than an isolated ACL tear.',
        },
      ],
    },
    {
      topicIndex: 7,
      cards: [
        {
          id: 'fc-ligaments-t7-1',
          question: 'What bone bruise pattern is classic for transient lateral patellar dislocation?',
          answer: 'Edema on the medial patellar facet and the anterolateral aspect of the lateral femoral condyle.',
        },
        {
          id: 'fc-ligaments-t7-2',
          question: 'At what location is the MPFL most commonly torn?',
          answer: 'At its attachments far more than mid-substance. Classic adult teaching is femoral-sided predominance (~50%, Balcarek 2010), but in skeletally immature patients the patellar attachment predominates (~80-95%, Askenberger 2016) — scrutinize BOTH ends.',
        },
        {
          id: 'fc-ligaments-t7-3',
          question: 'What three anatomic risk factors for recurrent patellar dislocation should be assessed?',
          answer: 'Patella alta (Insall-Salvati ratio >1.2), trochlear dysplasia (Dejour classification), and increased TT-TG distance (>20 mm is pathologic).',
        },
      ],
    },
    {
      topicIndex: 8,
      cards: [
        {
          id: 'fc-ligaments-t8-1',
          question: 'What combination of ligament tears constitutes a knee dislocation until proven otherwise?',
          answer: 'Combined ACL + PCL disruption, even if the knee has spontaneously reduced. This carries a limb-threatening risk of occult popliteal artery injury, requiring urgent vascular assessment.',
        },
        {
          id: 'fc-ligaments-t8-2',
          question: 'What vascular injury must be excluded in a multiligament knee injury, and how should it be assessed?',
          answer: 'Popliteal artery injury must be excluded urgently. MRI signs include loss of the normal flow void, perivascular hematoma, and intimal irregularity; CTA/MRA is used when pulses, ABI, or clinical findings are abnormal or equivocal, or per trauma protocol.',
        },
      ],
    },
  ],

  // ─── Module 8: Extensor Mechanism & Synovium ────────────────────────
  'extensor-synovium': [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-extensor-synovium-t0-1',
          question: 'Which layer of the quadriceps tendon is most commonly involved in partial tears?',
          answer: 'The deep layer (vastus intermedius). On sagittal images, look for a fluid-signal defect at the deep aspect of the tendon near the patellar insertion. The superficial fibers may appear intact.',
        },
        {
          id: 'fc-extensor-synovium-t0-2',
          question: 'What finding on MRI distinguishes a complete quadriceps tendon tear from a partial tear?',
          answer: 'A complete tear shows full-thickness discontinuity with proximal retraction of the tendon stump, patella baja (low-riding patella), and often a large hemorrhagic joint effusion.',
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-extensor-synovium-t1-1',
          question: 'How does patellar tendinopathy (jumper\'s knee) differ from a partial patellar tendon tear on MRI?',
          answer: 'Tendinopathy shows thickening and intermediate signal (not fluid-bright on T2) with intact continuity. A partial tear shows a discrete fluid-signal defect within the tendon. This distinction matters: tendinopathy is managed conservatively; significant partial tears may need surgery.',
        },
        {
          id: 'fc-extensor-synovium-t1-2',
          question: 'After bone-patellar tendon-bone graft harvest for ACL reconstruction, what is the expected appearance of the patellar tendon?',
          answer: 'A thinned central portion of the tendon with surrounding scar tissue. This is a normal postoperative finding and should not be called a tear.',
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-extensor-synovium-t2-1',
          question: 'How do you differentiate bipartite patella from a patellar fracture?',
          answer: 'Bipartite patella has smooth, well-corticated margins, is located at the superolateral pole (~75% of cases), and is bilateral in ~50%. Fractures have sharp, irregular margins, most commonly occur at the mid-patella, and are usually unilateral.',
        },
        {
          id: 'fc-extensor-synovium-t2-2',
          question: 'What is a painful bipartite patella and what finding indicates it on MRI?',
          answer: 'When a bipartite patella becomes symptomatic from stress or trauma, bone marrow edema is seen at the synchondrosis between the accessory ossicle and the patella.',
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-extensor-synovium-t3-1',
          question: 'What does a lipohemarthrosis indicate and how does it appear on MRI?',
          answer: 'Lipohemarthrosis is pathognomonic for an intra-articular fracture. It appears as a fat-fluid level in the suprapatellar bursa: the superior fat layer is bright on T1, and the inferior layer is serous or hemorrhagic fluid.',
        },
        {
          id: 'fc-extensor-synovium-t3-2',
          question: 'When you identify a lipohemarthrosis but no obvious fracture, what should you do?',
          answer: 'Perform a dedicated second-look fracture search of the tibial plateaus, patella, and femoral condyles. Subtle lateral tibial plateau depression fractures are the most commonly missed finding.',
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: 'fc-extensor-synovium-t4-1',
          question: 'Where does a Baker\'s cyst arise and what associated pathology should you search for?',
          answer: 'Baker\'s cysts arise between the medial head of the gastrocnemius and the semimembranosus tendon posteromedially. They are commonly secondary to intra-articular pathology (meniscal tears, cartilage degeneration, inflammatory arthropathy).',
        },
        {
          id: 'fc-extensor-synovium-t4-2',
          question: 'What clinical condition does a ruptured Baker\'s cyst mimic?',
          answer: 'Deep venous thrombosis (pseudothrombophlebitis). On MRI, a ruptured Baker\'s cyst shows inferior extension of fluid along the medial gastrocnemius fascial planes.',
        },
      ],
    },
    {
      topicIndex: 5,
      cards: [
        {
          id: 'fc-extensor-synovium-t5-1',
          question: 'Where is the pes anserine bursa located and what clinical condition does pes anserine bursitis mimic?',
          answer: 'Located approximately 4-5 cm below the medial joint line, deep to the sartorius/gracilis/semitendinosus tendons. It commonly mimics medial meniscal tear or MCL injury clinically.',
        },
      ],
    },
    {
      topicIndex: 6,
      cards: [
        {
          id: 'fc-extensor-synovium-t6-1',
          question: 'What is the hallmark MRI finding of PVNS (tenosynovial giant cell tumor)?',
          answer: 'Low signal intensity on all pulse sequences due to hemosiderin deposition, with "blooming" artifact on gradient echo sequences. Diffuse PVNS also shows bone erosions on both sides of the joint with relative preservation of joint space.',
        },
        {
          id: 'fc-extensor-synovium-t6-2',
          question: 'How do you distinguish PVNS from synovial chondromatosis on MRI?',
          answer: 'PVNS shows low signal on all sequences with GRE blooming (hemosiderin). Synovial chondromatosis shows cartilage-signal bodies (intermediate T1, high T2) without blooming, often with ring-and-arc calcification.',
        },
      ],
    },
    {
      topicIndex: 7,
      cards: [
      {
        id: 'fc-extensor-synovium-t7-1',
        question: "On fluid-sensitive MRI, how do you distinguish a Grade 1 from a Grade 3 muscle strain?",
        answer: "Grade 1: feathery/stellate perifascial edema with intact architecture and NO fiber gap. Grade 3: complete fiber discontinuity with a retracted wavy/serpentine stump and hematoma filling the gap.",
      },
      {
        id: 'fc-extensor-synovium-t7-2',
        question: "What are the two tendinous components of the proximal hamstring origin at the ischial tuberosity, and what must the report specify in an avulsion?",
        answer: "(1) The conjoint tendon (biceps femoris long head + semitendinosus fused into one tendon) and (2) the separate semimembranosus tendon. Report which/how many components are torn, the retraction distance in cm, and proximity to the sciatic nerve.",
      },
      {
        id: 'fc-extensor-synovium-t7-3',
        question: "What is the signature MRI finding of medial gastrocnemius 'tennis leg,' and which two diagnoses must always be on the differential?",
        answer: "Fluid tracking between the medial gastrocnemius and the soleus aponeurosis at the distal myotendinous junction. Always exclude DVT (check the popliteal vein) and ruptured Baker's cyst (plantaris rupture is a less common mimic).",
      },
      ],
    },
  ],

  // ─── Module 9: Top 10 Don't Miss ───────────────────────────────────
  'top-10-dont-miss': [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t0-1',
          question: 'Why is a missed posterior medial meniscal root tear so consequential?',
          answer: 'It is functionally equivalent to total meniscectomy, disrupting circumferential hoop stresses. If missed, it leads to subchondral insufficiency fractures, accelerated cartilage loss, progressive varus malalignment, and eventual arthroplasty.',
        },
        {
          id: 'fc-top-10-dont-miss-t0-2',
          question: 'When you see a subchondral insufficiency fracture of the medial femoral condyle, what must you evaluate?',
          answer: 'The posterior medial meniscal root. The root tear is the underlying biomechanical cause. If you only report the fracture without identifying the root tear, the underlying problem will not be addressed.',
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t1-1',
          question: 'What should you include in every ACL tear report regarding ramp lesions?',
          answer: 'A specific statement about the presence or absence of a ramp lesion. Since MRI sensitivity is only ~50-65%, recommend intraoperative assessment through a posteromedial portal when findings are equivocal.',
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t2-1',
          question: 'If you see fewer than two bow-tie images on sagittal sequences, what should you do next?',
          answer: 'Immediately suspect a bucket-handle tear and search for the displaced fragment: in the intercondylar notch (double PCL sign) or flipped against the anterior horn (flipped meniscus sign). Check coronal images for a truncated donor site.',
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t3-1',
          question: 'What is the most reliable MRI sign of OCD fragment instability, and why is T1 signal unreliable for this assessment?',
          answer: 'Fluid-signal intensity (matching joint fluid) on T2 at the fragment-bone interface indicates undermining and instability. A low-signal rim on T1 is nonspecific -- it can represent either healing fibrous tissue or an unstable cleavage plane.',
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t4-1',
          question: 'Why is failure to diagnose a PLC injury the leading cause of cruciate graft failure?',
          answer: 'Unrecognized PLC injury allows persistent external rotation and varus laxity, which overloads the cruciate graft. All three PLC structures (LCL, popliteus tendon, popliteofibular ligament) must be systematically evaluated in every cruciate injury.',
        },
        {
          id: 'fc-top-10-dont-miss-t4-2',
          question: 'What fracture is pathognomonic for posterolateral corner injury?',
          answer: 'Arcuate fracture -- avulsion of the fibular styloid. This finding should never be dismissed as incidental.',
        },
      ],
    },
    {
      topicIndex: 5,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t5-1',
          question: 'After diagnosing lateral patellar dislocation with MPFL tear, what is the complete evaluation checklist?',
          answer: 'MPFL tear location, osteochondral injury and loose bodies (check suprapatellar pouch, lateral gutter, posterior recesses), trochlear dysplasia, patella alta (Insall-Salvati >1.2), and TT-TG distance (>20 mm pathologic).',
        },
      ],
    },
    {
      topicIndex: 6,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t6-1',
          question: 'What finding is pathognomonic for an intra-articular fracture?',
          answer: 'Lipohemarthrosis (fat-fluid level in the suprapatellar bursa). When identified, perform a systematic search for fractures of the tibial plateau, patella, and femoral condyles.',
        },
      ],
    },
    {
      topicIndex: 7,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t7-1',
          question: 'What is a Segond fracture, and how does a reverse Segond fracture differ in its ligamentous association?',
          answer: 'Segond fracture: lateral tibial rim avulsion, pathognomonic for ACL tear. Reverse Segond fracture: medial tibial rim avulsion, associated with PCL tears rather than ACL tears.',
        },
      ],
    },
    {
      topicIndex: 8,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t8-1',
          question: 'Why does combined ACL + PCL disruption require emergent vascular assessment?',
          answer: 'Combined cruciate disruption equals a knee dislocation pattern until proven otherwise. Popliteal artery injury can be occult after spontaneous reduction, so urgent vascular assessment is required; CTA/MRA is used when pulses, ABI, or clinical findings are abnormal or equivocal, or per trauma protocol.',
        },
      ],
    },
    {
      topicIndex: 9,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t9-1',
          question: 'How long after meniscal repair can increased signal at the repair site persist as a normal finding?',
          answer: 'At least 12 months, and it may persist indefinitely. Only fluid-bright signal (matching joint fluid on T2) reaching the articular surface constitutes a definitive re-tear.',
        },
        {
          id: 'fc-top-10-dont-miss-t9-2',
          question: 'At what time point should a mature ACL graft appear uniformly low signal, and what signal indicates failure?',
          answer: 'By 12-18 months. Fluid-signal intensity within the graft substance, discontinuity, or recurrence of secondary signs (anterior tibial translation, new pivot-shift contusions) indicates graft failure.',
        },
      ],
    },
    {
      topicIndex: 10,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t10-1',
          question: 'What three key questions should your knee MRI report answer for the surgeon?',
          answer: '(1) What is the diagnosis? (2) What associated injuries are present? (3) Does anything change my planned approach? Anticipate the surgeon\'s decision points and address them proactively.',
        },
        {
          id: 'fc-top-10-dont-miss-t10-2',
          question: 'For meniscal tears, what factors should you address to help the surgeon determine repairability?',
          answer: 'Location (peripheral red zone = repairable vs. central white zone = resection), morphology (vertical longitudinal = repairable vs. complex = usually resection), displacement status, and acuity.',
        },
      ],
    },
    {
      topicIndex: 11,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t11-1',
          question: 'Name four findings on knee MRI that require urgent or direct communication with the referring clinician.',
          answer: 'Knee dislocation/multiligament injury (needs urgent vascular assessment), locked bucket-handle tear, displaced osteochondral fragments in a weight-bearing compartment, and suspected septic arthritis.',
        },
        {
          id: 'fc-top-10-dont-miss-t11-2',
          question: 'What must you document per ACR practice parameters when directly communicating a significant finding?',
          answer: 'Who was contacted, the method of communication, and the time. This documentation should be included in your report.',
        },
      ],
    },
  ],
};

export function getFlashcardsForTopic(
  moduleId: string,
  topicIndex: number,
): Flashcard[] {
  const moduleCards = moduleFlashcards[moduleId];
  if (!moduleCards) return [];
  const topic = moduleCards.find((t) => t.topicIndex === topicIndex);
  return topic?.cards ?? [];
}
