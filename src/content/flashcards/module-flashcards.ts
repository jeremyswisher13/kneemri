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
          question: 'What is the workhorse fluid-sensitive sequence for knee MRI, and why must it be read with the rest of the protocol?',
          answer: 'PD FS (proton density fat-suppressed) is a common workhorse because fat suppression makes edema and fluid conspicuous while preserving anatomic detail. It helps evaluate marrow, menisci, ligaments, cartilage, and effusion, but no single sequence answers every question: correlate with T1 or another non-fat-suppressed sequence and with orthogonal planes.',
        },
        {
          id: 'fc-mri-basics-t1-2',
          question: 'On T1-weighted images, what does normal marrow look like and what causes it to appear dark?',
          answer: 'Adult yellow marrow is usually bright on T1. Edema-like change, fracture, infection, tumor, and hematopoietic red marrow can all lower T1 signal to different degrees, so low T1 is sensitive but nonspecific; compare with muscle and subcutaneous fat, distribution, fluid-sensitive images, and morphology.',
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-mri-basics-t2-1',
          question: 'A finding is dark on T1 and bright on PD FS. What does this signal combination represent?',
          answer: 'It indicates water-rich or otherwise T1-lowering tissue, commonly edema-like marrow signal, but it is not a diagnosis. Trauma, stress injury, degeneration, infection, inflammation, and neoplasm can overlap; use location, morphology, other sequences, and clinical context.',
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-mri-basics-t3-1',
          question: 'What is magic angle artifact, and how do you confirm it is not a true meniscal tear?',
          answer: 'Magic-angle effect can increase signal in collagen near 55 degrees to the main field on short-TE sequences. Signal that decreases on a long-TE fluid-sensitive image supports artifact, but does not by itself exclude a tear. Confirm intact morphology, absence of convincing surface contact, adjacent-image behavior, and orthogonal-plane findings.',
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
          answer: 'Narrow the window for meniscal evaluation, centering the level low on the dark meniscus, so the small range of low signal is spread across the gray scale and faint intrasubstance signal becomes visible (widening compresses contrast and hides it). Narrow the window for cartilage as well, to maximize contrast between the cartilage surface and adjacent fluid.',
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
          answer: 'A small avulsion fracture of the lateral tibial rim. It is highly specific for associated ACL injury and should prompt direct ACL evaluation.',
        },
        {
          id: 'fc-anatomy-t1-2',
          question: 'What is the significance of a tibial eminence fracture in an adolescent?',
          answer: 'It is an osseous injury of the ACL tibial attachment. The ACL may remain attached to the avulsed fragment, so describe fragment displacement and associated injuries rather than calling every tibial-spine avulsion a midsubstance ACL tear.',
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
          answer: 'A complete root-disrupting tear can abolish circumferential hoop-stress function. In a cadaveric medial posterior-root model, contact mechanics approached those after total medial meniscectomy; partial and lateral root abnormalities should not be treated as automatically equivalent.',
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
          answer: 'Trace the popliteus tendon through the expected posterolateral hiatus and confirm the smooth normal interval on adjacent images and an orthogonal plane. Seeing the tendon supports the normal landmark but does not exclude a nearby tear; look for definite meniscal surface disruption or abnormal morphology.',
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
          answer: 'Perceptual and search errors contribute to missed findings, especially after attention locks onto an initial abnormality. A reproducible search pattern improves coverage of every structure, but image quality, lesion conspicuity, knowledge, and interpretation also affect detection.',
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
          answer: '1) Verify and orient, 2) Bones and marrow, 3) Cartilage and osteochondral surfaces, 4) Menisci, 5) Ligaments, 6) Extensor mechanism, 7) Synovium, bursae, and other soft tissues. Then perform a separate final review tied to the clinical question.',
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
          answer: 'Both can show edema-like marrow signal. A visible low-signal fracture line, cortical disruption, depression, or a characteristic subchondral band supports fracture, but an occult fracture line may be subtle or absent on MRI. Integrate morphology, mechanism, radiographs/CT when needed, and clinical management rather than diagnosing contusion from edema alone.',
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
          question: 'How does subchondral insufficiency fracture of the knee differ from OCD?',
          answer: 'SIF usually presents in a skeletally mature or older patient with acute or subacute pain and a subchondral low-signal fracture line or band with surrounding edema-like signal, often at the medial femoral condyle. Some lesions heal; others develop SIF with osteonecrosis and collapse, historically called SONK. OCD usually begins in a younger patient at a characteristic osteochondral site and must be assessed with age-specific stability criteria.',
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
          answer: 'Grade 1: signal abnormality with intact surface. Grade 2: partial-thickness defect (<50%). Grade 3: >50% partial-thickness, OR full-thickness down to but not through the (intact) subchondral bone plate — ICRS 3C. Grade 4: defect that penetrates THROUGH the subchondral bone plate (osteochondral). (Note: modified Outerbridge instead calls full-thickness cartilage loss with exposed bone "grade IV" — state which system you are using.)',
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
          question: 'What MRI finding strongly supports OCD instability, and what age caveat matters?',
          answer: 'A joint-fluid-equivalent interface that completely undermines the fragment, cartilage breach, or displacement strongly supports instability. In juvenile OCD, an isolated high-T2 rim is not sufficiently specific; use the juvenile criteria and assess the open physis. A low-signal rim on T1 is nonspecific.',
        },
        {
          id: 'fc-cartilage-osteochondral-t4-2',
          question: 'Name four MRI signs of OCD instability.',
          answer: 'Joint-fluid-equivalent undermining, disruption of the overlying cartilage, fragment displacement or a loose body, and concerning subchondral cysts. Apply age-specific criteria: in juvenile OCD, multiple cysts or a cyst larger than about 5 mm and multiple subchondral-plate breaks are more specific than a high-T2 rim alone.',
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
          answer: 'Grade 3 signal reaches an articular surface. That is the conventional tear criterion, while confidence rises when surface contact appears on at least two matching images or has convincing morphology and orthogonal confirmation. Grade 1 is focal and grade 2 is linear signal that remains intrasubstance.',
        },
        {
          id: 'fc-menisci-t0-2',
          question: 'On PD / short-TE images, does intrameniscal signal have to be as bright as fluid to call a tear?',
          answer: 'No. On PD/short-TE images, surface-reaching intermediate-to-high signal is sufficient; it need not equal fluid. Contact on two or more matching images gives high confidence, and those images need not be contiguous or in the same plane.',
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-menisci-t1-1',
          question: 'What is the two-slice-touch rule?',
          answer: 'Surface-reaching meniscal signal on at least two matching images gives high confidence for a tear. The images need not be consecutive; matching sagittal and coronal images can count. It is not an absolute gate, so a one-image finding needs morphology and orthogonal correlation.',
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
          answer: 'Radial tears disrupt circumferential hoop fibers. Complete or near-complete radial tears can markedly impair load distribution; the biomechanical effect depends on tear width and location, although even a small radial tear deserves careful characterization.',
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
          question: 'What biomechanical comparison is used for a complete posterior medial root-disrupting tear, and what is the caveat?',
          answer: 'In a cadaveric model, contact mechanics approached total medial meniscectomy because hoop-stress function was lost. This is not a blanket equivalence for every partial, degenerative, or lateral root abnormality.',
        },
        {
          id: 'fc-menisci-t3-2',
          question: 'What is the root tear triad?',
          answer: 'Posterior medial root tear + major medial extrusion (commonly ≥3 mm) + subchondral insufficiency fracture. The root tear may be an important biomechanical contributor, but cartilage loss, alignment/overload, and bone factors also matter.',
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
          answer: 'Pooled MRI sensitivity is only ~65-71% (specificity ~88-94%); ramp lesions are notoriously underdiagnosed and missed in up to half of cases in some series. In every ACL tear, actively search the posterior meniscocapsular junction.',
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
          question: 'How is meniscal extrusion measured, and how should the common 3 mm threshold be used?',
          answer: 'Measure on a coronal mid-body image from the tibial plateau margin, excluding osteophytes, to the outer meniscal edge. Medial extrusion of at least 3 mm is a common major-extrusion threshold and should trigger a root, radial-tear, and cartilage/overload search, but extrusion alone does not diagnose a root tear and the same threshold should not be automatically transferred to the lateral meniscus.',
        },
        {
          id: 'fc-menisci-t6-2',
          question: 'At what meniscal extrusion threshold should you actively search for a meniscal root tear?',
          answer: 'Medial extrusion of at least 3 mm is a useful trigger for direct multiplanar root assessment, plus a search for radial tear and compartment degeneration. Report the measured value, exclude osteophytes from the reference margin, and avoid treating extrusion alone as diagnostic or applying the medial threshold uncritically to the lateral meniscus.',
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
          answer: 'New fluid-equivalent signal reaching an articular surface raises concern for re-tear, particularly when morphology has changed or a fragment is displaced. Intermediate signal at the repair site can persist despite healing, so compare preoperative and prior postoperative images; selected equivocal cases may benefit from MR arthrography.',
        },
        {
          id: 'fc-menisci-t8-2',
          question: 'After partial meniscectomy, what does the normal meniscal remnant look like on MRI?',
          answer: 'Expected findings include a smaller, truncated or blunted remnant and postoperative signal at the resection margin. Re-tear is favored by a new or changed surface-reaching fluid-equivalent line, new morphologic distortion, or a displaced fragment compared with the preoperative and prior postoperative studies.',
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
          answer: 'Direct signs include fiber discontinuity or absence, abnormal course/tension, and abnormal morphology with fluid-sensitive signal at the disrupted segment. Increased signal alone is not enough; a complete tear requires loss of continuous fibers across the ligament course, supported by secondary signs and clinical stability testing.',
        },
        {
          id: 'fc-ligaments-t0-2',
          question: 'Name three secondary signs of an ACL tear.',
          answer: 'Pivot-shift bone contusions (posterolateral tibial plateau + lateral femoral condyle sulcus), anterior tibial translation >5 mm, and PCL buckling. Others include deepened lateral femoral sulcus >1.5 mm, Segond fracture, and uncovered posterior horn sign.',
        },
        {
          id: 'fc-ligaments-t0-3',
          question: 'What is the Segond fracture and what is its association with ACL tears?',
          answer: 'A small avulsion of the lateral tibial rim representing anterolateral-ligament complex avulsion. It is highly specific for associated ACL injury, reported with ACL injury in approximately 75-100% of cases; confirm the ACL directly.',
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-ligaments-t1-1',
          question: 'How does ACL mucoid degeneration differ from an ACL tear on MRI?',
          answer: 'Mucoid degeneration typically shows a thickened ACL with diffuse increased signal interspersed among intact longitudinal fibers (the "celery stalk" appearance). Preserved continuity and clinical stability favor mucoid change; secondary signs can help but are not required to be absent, and coexisting degeneration does not exclude superimposed injury.',
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-ligaments-t2-1',
          question: 'What is the ACL graft ligamentization period, and how does it appear on MRI?',
          answer: 'ACL graft signal commonly increases during ligamentization and then trends lower, but timing and intensity vary with graft type, technique, field strength, and patient. Signal alone does not diagnose failure; assess fiber continuity, orientation/tension, tunnels, impingement, fixation, arthrofibrosis, secondary signs, symptoms, and stability examination.',
        },
        {
          id: 'fc-ligaments-t2-2',
          question: 'What is the most common technical error leading to ACL graft failure?',
          answer: 'Tunnel malposition is an important technical contributor. An anterior tibial tunnel can cause roof impingement in extension; a vertical femoral tunnel can leave rotational instability; and an excessively anterior femoral tunnel can over-tension the graft in flexion. Describe the actual tunnel positions, graft course, impingement, and associated findings rather than predicting failure from one measurement alone.',
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
          answer: 'Avulsion of the fibular styloid. It is a strong marker of posterolateral-corner injury and should trigger direct evaluation of the LCL, popliteus tendon, and popliteofibular ligament.',
        },
        {
          id: 'fc-ligaments-t5-3',
          question: 'Why is an unrecognized PLC injury an important, frequently overlooked cause of cruciate graft failure?',
          answer: 'Unrecognized clinically significant PLC injury can leave external-rotation and varus laxity that overloads a cruciate reconstruction. Identify the injured components and report the combined pattern; treatment depends on grade, chronicity, examination, alignment, and the full reconstruction plan.',
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
          question: 'How should the MPFL be evaluated after transient lateral patellar dislocation?',
          answer: 'Trace the full medial patellofemoral complex from the medial patella through its mid-substance to the femoral/adductor-tubercle region. Tear location is variable by cohort and method, and combined sites occur, so do not stop after finding one abnormal attachment.',
        },
        {
          id: 'fc-ligaments-t7-3',
          question: 'What three anatomic risk factors for recurrent patellar dislocation should be assessed?',
          answer: 'Patella alta, trochlear dysplasia, and lateralized tibial tubercle/TT-TG. The classic >20 mm TT-TG cutoff is CT-derived; state the modality/method and use modality-appropriate reference values rather than applying it directly to MRI.',
        },
      ],
    },
    {
      topicIndex: 8,
      cards: [
        {
          id: 'fc-ligaments-t8-1',
          question: 'What ligament pattern should raise concern for a spontaneously reduced knee dislocation?',
          answer: 'Combined ACL and PCL disruption is a high-grade multiligament/dislocation pattern even when alignment has returned to normal. It should prompt assessment of the collateral/corner structures, common peroneal nerve, and urgent popliteal-artery evaluation through the trauma pathway.',
        },
        {
          id: 'fc-ligaments-t8-2',
          question: 'What vascular injury must be excluded in a multiligament knee injury, and how should it be assessed?',
          answer: 'Popliteal artery injury must be excluded urgently. A routine knee MRI is not a vascular clearance test, even if flow voids look normal. Perform and document a vascular examination and ankle-brachial index; obtain CT angiography for abnormal or equivocal findings, hard signs, or according to the trauma pathway, with serial examinations when indicated.',
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
          question: 'Why can a layer-specific partial quadriceps-tendon tear be subtle?',
          answer: 'The quadriceps tendon is multilayered, so one contribution can tear while others remain continuous and preserve some extensor function. Inspect superficial, middle, and deep fibers on sagittal and axial images; no single layer should be assumed to be the most common tear site.',
        },
        {
          id: 'fc-extensor-synovium-t0-2',
          question: 'What finding on MRI distinguishes a complete quadriceps tendon tear from a partial tear?',
          answer: 'A complete quadriceps tear shows full-thickness fiber discontinuity and usually some proximal retraction. Patella baja, retinacular tearing, and hemorrhage may support the diagnosis but are not required. Correlate with active extension because intact retinacula can preserve partial function.',
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-extensor-synovium-t1-1',
          question: 'How does patellar tendinopathy (jumper\'s knee) differ from a partial patellar tendon tear on MRI?',
          answer: 'Tendinopathy usually shows proximal thickening and increased intrasubstance signal with preserved overall continuity. A partial tear has focal fiber disruption, sometimes with a fluid-signal cleft. Report tear depth/width and remaining fibers; treatment depends on symptoms, function, tear extent, and response to rehabilitation rather than MRI alone.',
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
          answer: 'Edema-like signal across a bipartite synchondrosis supports symptomatic stress or trauma when it matches the pain location, but it is not required or independently diagnostic. Use corticated morphology, history, examination, and comparison imaging when available.',
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-extensor-synovium-t3-1',
          question: 'What does a lipohemarthrosis indicate and how does it appear on MRI?',
          answer: 'In acute nonoperative trauma, lipohemarthrosis strongly indicates an intra-articular fracture. It is a fat-fluid level in the suprapatellar recess, best appreciated on a non-fat-suppressed sequence; recent surgery or an intra-articular procedure is an important exception.',
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
          question: 'What MRI pattern suggests diffuse-type TGCT (formerly PVNS)?',
          answer: 'Hemosiderin-rich nodular synovial proliferation with low signal and susceptibility blooming. The pattern is strongly suggestive but not pathognomonic because other hemorrhagic or postoperative synovial processes can bloom.',
        },
        {
          id: 'fc-extensor-synovium-t6-2',
          question: 'How do you distinguish diffuse-type TGCT from synovial chondromatosis on MRI?',
          answer: 'TGCT often shows hemosiderin-related low signal and blooming. Synovial chondromatosis usually shows cartilage-signal nodules/bodies, sometimes with ring-and-arc mineralization. Radiographs or CT can help characterize mineralization.',
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
        question: "Which distal hamstring structures are within a routine knee MRI field, and what should a tear report include?",
        answer: "Trace semimembranosus and semitendinosus posteromedially and biceps femoris to the fibular head. Report the specific tendon, fiber gap, retraction, hematoma, and associated corner or common-peroneal-nerve abnormality. Proximal ischial origins need a pelvis/hip or dedicated thigh study.",
      },
      {
        id: 'fc-extensor-synovium-t7-3',
        question: "What is the signature MRI finding of medial gastrocnemius 'tennis leg,' and which two diagnoses must always be on the differential?",
        answer: "Fluid tracking between the medial gastrocnemius and the soleus aponeurosis at the distal myotendinous junction. Ruptured Baker's cyst is an important mimic. A routine knee MRI view of the popliteal vein does not exclude DVT; obtain dedicated venous duplex ultrasound when clinical concern remains.",
      },
      ],
    },
  ],

  // ─── Module 9: 12 Don't-Miss Findings ──────────────────────────────
  'top-10-dont-miss': [
    {
      topicIndex: 0,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t0-1',
          question: 'Why is a missed posterior medial meniscal root tear so consequential?',
          answer: 'A complete posterior medial root-disrupting tear can abolish hoop-stress function and accelerate compartment overload. It is associated with extrusion, cartilage loss, SIF, and osteoarthritis progression, but outcomes are not inevitable and depend on the whole joint and treatment context.',
        },
        {
          id: 'fc-top-10-dont-miss-t0-2',
          question: 'When you see a subchondral insufficiency fracture of the medial femoral condyle, what must you evaluate?',
          answer: 'Scrutinize the posterior medial meniscal root and measure extrusion. A root tear may be a major contributor to overload, but report cartilage, alignment/overload, and subchondral morphology rather than assigning a single cause.',
        },
      ],
    },
    {
      topicIndex: 1,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t1-1',
          question: 'What should you include in every ACL tear report regarding ramp lesions?',
          answer: 'Document the posteromedial meniscocapsular junction when a ramp lesion is seen or suspected, and recognize that a negative MRI does not reliably exclude one. In an ACL-injured knee with persistent clinical or surgical concern, the treating surgeon may perform targeted arthroscopic inspection, including posteromedial visualization.',
        },
      ],
    },
    {
      topicIndex: 2,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t2-1',
          question: 'If you see fewer than two bow-tie images on sagittal sequences, what should you do next?',
          answer: 'Trigger a displaced-fragment search: trace the meniscus for a notch fragment (including a double-PCL configuration), a fragment flipped near the anterior horn, and a donor site on coronal and axial images. Confirm the fragment and exclude prior meniscectomy, small meniscal size, and slice-thickness effects before calling a bucket-handle tear.',
        },
      ],
    },
    {
      topicIndex: 3,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t3-1',
          question: 'What MRI findings support OCD instability, and why must skeletal maturity be checked?',
          answer: 'Joint-fluid-equivalent undermining, cartilage breach, displacement, and loose bodies support instability. In juvenile OCD, an isolated high-T2 rim is poorly specific; more specific combinations include a fluid-equivalent rim with an outer low-signal rim, multiple subchondral-plate breaks, or multiple/large cysts. A low-signal T1 rim is nonspecific.',
        },
      ],
    },
    {
      topicIndex: 4,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t4-1',
          question: 'Why can an unrecognized PLC injury contribute to cruciate graft failure?',
          answer: 'Persistent external-rotation and varus laxity can overload a cruciate graft. Systematically assess the LCL, popliteus tendon, popliteofibular ligament, related capsule, and osseous avulsions in a cruciate-injured knee.',
        },
        {
          id: 'fc-top-10-dont-miss-t4-2',
          question: 'What fracture is a strong marker of posterolateral-corner injury?',
          answer: 'Arcuate fracture -- avulsion of the fibular styloid. It should trigger direct evaluation of every PLC component rather than being dismissed as incidental.',
        },
      ],
    },
    {
      topicIndex: 5,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t5-1',
          question: 'After diagnosing lateral patellar dislocation with MPFL tear, what is the complete evaluation checklist?',
          answer: 'MPFL tear location, chondral/osteochondral injury and fragments, trochlear dysplasia, patellar height, tilt/translation, and TT-TG with the modality/method stated. The classic >20 mm TT-TG threshold is CT-derived and should not be applied mechanically to MRI.',
        },
      ],
    },
    {
      topicIndex: 6,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t6-1',
          question: 'In acute nonoperative knee trauma, what finding strongly indicates an intra-articular fracture?',
          answer: 'Lipohemarthrosis, a fat-fluid level in the suprapatellar recess. Search the tibial plateaus, patella, femoral condyles, and osteochondral surfaces; recent surgery or an intra-articular procedure is an important exception.',
        },
      ],
    },
    {
      topicIndex: 7,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t7-1',
          question: 'What is a Segond fracture, and how does a reverse Segond fracture differ in its ligamentous association?',
          answer: 'Segond fracture is a lateral tibial-rim avulsion strongly associated with ACL injury. Reverse Segond fracture is a medial tibial-rim avulsion that can accompany PCL plus medial/posteromedial and other multiligament injuries; it is not a one-to-one PCL sign. Map each structure directly.',
        },
      ],
    },
    {
      topicIndex: 8,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t8-1',
          question: 'Why does combined ACL + PCL disruption require emergent vascular assessment?',
          answer: 'Combined cruciate disruption is a high-grade multiligament/dislocation pattern. Popliteal artery injury can be occult after spontaneous reduction, so urgent vascular examination and ankle-brachial index are required, with CT angiography and serial examinations according to findings and the trauma pathway; routine knee MRI cannot provide vascular clearance.',
        },
      ],
    },
    {
      topicIndex: 9,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t9-1',
          question: 'How long after meniscal repair can increased signal at the repair site persist as a normal finding?',
          answer: 'Increased signal can persist for years or indefinitely. New fluid-equivalent signal reaching a surface is concerning but should be integrated with changed morphology, displaced tissue, prior images, symptoms, and surgical details; selected equivocal cases may benefit from MR arthrography.',
        },
        {
          id: 'fc-top-10-dont-miss-t9-2',
          question: 'How should ACL graft signal and suspected failure be assessed?',
          answer: 'Graft signal generally trends lower with maturation but varies widely and is not required to become uniformly low by a fixed date. Failure is supported by fiber discontinuity or abnormal orientation/tension together with clinical instability, tunnel or hardware problems, impingement, and secondary signs; increased signal alone is insufficient.',
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
          answer: 'Report tear pattern, exact location and distance from the capsule, length, displacement, tissue loss/degeneration, root or ramp involvement, associated ligament injury, cartilage status, and chronicity when known. Vascular zone informs healing potential, but repair versus resection also depends on tissue quality, reducibility, alignment, patient factors, and surgeon assessment.',
        },
      ],
    },
    {
      topicIndex: 11,
      cards: [
        {
          id: 'fc-top-10-dont-miss-t11-1',
          question: 'Name four findings on knee MRI that require urgent or direct communication with the referring clinician.',
          answer: 'A knee-dislocation/multiligament pattern needing urgent vascular assessment, a clinically locked knee with displaced meniscal tissue, a displaced osteochondral fragment, and imaging findings concerning for infection when septic arthritis is clinically possible. The local communication policy and full clinical context determine urgency.',
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
