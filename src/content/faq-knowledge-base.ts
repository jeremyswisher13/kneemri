export interface FAQEntry {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  relatedModule?: string;
  category:
    | 'app'
    | 'basics'
    | 'anatomy'
    | 'menisci'
    | 'ligaments'
    | 'bones'
    | 'cartilage'
    | 'extensor'
    | 'reporting'
    | 'general';
}

export const faqKnowledgeBase: FAQEntry[] = [
  // ─── APP NAVIGATION (15 entries) ───────────────────────────────────────────

  {
    id: 'app-start-course',
    keywords: ['start', 'begin', 'course', 'how', 'get started', 'beginning'],
    question: 'How do I start the course?',
    answer:
      'After signing in, open a course and follow the single "Next up" action on its Dashboard. Begin with the baseline knowledge quiz and confidence survey, then continue through Normal MRI, modules, three core cases, and the post-assessment.',
    relatedModule: '/pre-assessment',
    category: 'app',
  },
  {
    id: 'app-pre-assessment',
    keywords: ['pre-assessment', 'pretest', 'pre test', 'baseline', 'assessment before'],
    question: 'How do I take the pre-assessment?',
    answer:
      'Click "Pre-Assessment" in the Assessments section of the sidebar. Complete both the knowledge quiz and confidence survey before opening the teaching sequence so your baseline is measured cleanly.',
    relatedModule: '/pre-assessment',
    category: 'app',
  },
  {
    id: 'app-post-assessment',
    keywords: ['post-assessment', 'posttest', 'post test', 'final exam', 'assessment after'],
    question: 'How do I take the post-assessment?',
    answer:
      'The post-assessment unlocks after the baseline, Normal MRI mastery, all modules, and any three core cases are complete. Finish both the knowledge quiz and confidence survey; the knowledge score is compared with baseline to measure learning gains.',
    relatedModule: '/post-assessment',
    category: 'app',
  },
  {
    id: 'app-reference-card',
    keywords: ['reference', 'card', 'anatomy', 'measurements', 'quick reference', 'cheat sheet'],
    question: 'Where is the reference card?',
    answer:
      'Click "Anatomy & Measurements" under the Quick Reference section in the sidebar. This page contains normal measurements, anatomy diagrams, and key values you can reference while reading cases.',
    relatedModule: '/reference',
    category: 'app',
  },
  {
    id: 'app-review-queue',
    keywords: ['review', 'queue', 'spaced', 'repetition', 'review cards', 'due', 'flashcard review'],
    question: 'How does the review queue work?',
    answer:
      'The Review Cards system uses spaced repetition to reinforce learning. Cards become "due" at increasing intervals based on how well you recall them. Click "Review Cards" in the sidebar to see your due cards and practice.',
    relatedModule: '/review',
    category: 'app',
  },
  {
    id: 'app-certificate',
    keywords: ['certificate', 'completion', 'finish', 'done', 'cme', 'credit'],
    question: 'How do I get my certificate?',
    answer:
      'Open "Certificate" under Completion. Eligibility requires the baseline quiz and survey, every module, Normal MRI mastery, any three core cases, the post-course quiz and survey, and a post-course knowledge score of at least 70%.',
    relatedModule: '/certificate',
    category: 'app',
  },
  {
    id: 'app-flashcards',
    keywords: ['flashcard', 'flashcards', 'cards', 'study', 'memorize'],
    question: 'What are flashcards for?',
    answer:
      'Flashcards are generated from module content to reinforce key concepts. After completing a module, its flashcards are added to your review queue. The spaced repetition algorithm schedules reviews at optimal intervals for long-term retention.',
    relatedModule: '/review',
    category: 'app',
  },
  {
    id: 'app-modules-count',
    keywords: ['how many', 'modules', 'total', 'number of modules', 'count'],
    question: 'How many modules are there?',
    answer:
      'The module count varies by joint. The course Dashboard and the badge beside "Modules" show the exact total and your completed count for the active course.',
    relatedModule: '/modules',
    category: 'app',
  },
  {
    id: 'app-cases',
    keywords: ['cases', 'case', 'how many cases', 'practice', 'interactive cases'],
    question: 'How many cases are there?',
    answer:
      'The case library contains interactive teaching cases covering common and must-not-miss diagnoses. Each case walks you through image interpretation with guided questions. Your case completion count is shown in the sidebar next to "Cases."',
    relatedModule: '/cases',
    category: 'app',
  },
  {
    id: 'app-search-pattern',
    keywords: ['search pattern', 'systematic', 'checklist', 'reading pattern', 'how to read'],
    question: 'What is the search pattern?',
    answer:
      'The Search Pattern is a systematic 7-step approach for reading knee MRI: (1) Verify & Orient, (2) Bones & Marrow, (3) Cartilage, (4) Menisci, (5) Ligaments, (6) Extensor Mechanism, (7) Synovium/Bursae/Other. It reduces omission errors, but it does not replace a final review tied to the clinical question.',
    relatedModule: '/search-pattern',
    category: 'app',
  },
  {
    id: 'app-progress',
    keywords: ['progress', 'track', 'tracking', 'how am i doing', 'score', 'dashboard'],
    question: 'How do I track my progress?',
    answer:
      'Click "Progress" in the sidebar for a detailed view of your module completion, case attempts, assessment scores, and review card statistics. The Dashboard also gives a quick overview of your progress.',
    relatedModule: '/progress',
    category: 'app',
  },
  {
    id: 'app-search',
    keywords: ['search', 'find', 'look up', 'cmd k', 'ctrl k', 'global search'],
    question: 'How do I search for topics?',
    answer:
      'Use the search bar at the top of the page or press Cmd+K (Mac) or Ctrl+K (Windows) to open the global search. You can search for any topic, diagnosis, or anatomy term across all modules and cases.',
    category: 'app',
  },
  {
    id: 'app-resident-vs-fellow',
    keywords: ['resident', 'fellow', 'difference', 'role', 'access', 'content'],
    question: 'What is the difference between resident and fellow access?',
    answer:
      'Fellows have access to the full course including all modules, cases, and assessments. Residents see a curated subset of cases appropriate for their training level. Both roles have access to review cards and the reference page.',
    category: 'app',
  },
  {
    id: 'app-sign-out',
    keywords: ['sign out', 'log out', 'logout', 'signout', 'exit'],
    question: 'How do I sign out?',
    answer:
      'Click the "Sign Out" button at the bottom of the sidebar navigation panel.',
    category: 'app',
  },
  {
    id: 'app-mobile',
    keywords: ['mobile', 'phone', 'tablet', 'responsive', 'sidebar menu'],
    question: 'Can I use this on my phone?',
    answer:
      'Yes, the app is fully responsive. On smaller screens, the sidebar is hidden by default. Tap the blue menu button in the bottom-left corner to open the navigation sidebar.',
    category: 'app',
  },

  // ─── MRI BASICS (14 entries) ───────────────────────────────────────────────

  {
    id: 'basics-sequences',
    keywords: ['sequences', 'mri sequences', 'types', 'T1', 'T2', 'PD', 'proton density', 'what sequences'],
    question: 'What sequences are used in knee MRI?',
    answer:
      'Standard knee MRI uses three main sequences: T1 (best for anatomy, fracture lines, and marrow fat), PD FS (proton density fat-suppressed — the workhorse for menisci, ligaments, and fluid/edema), and T2 (highlights free fluid, effusion, and cysts). Images are acquired in sagittal, coronal, and axial planes.',
    relatedModule: '/modules/mri-basics',
    category: 'basics',
  },
  {
    id: 'basics-magic-angle',
    keywords: ['magic angle', 'artifact', '55 degrees', 'magic', 'angle artifact', 'artifactual signal'],
    question: 'What is the magic angle artifact?',
    answer:
      'The magic-angle artifact occurs when ordered collagen lies near 55 degrees to the main magnetic field, producing increased signal on short-TE sequences. It can affect tendons, ligaments, and intrameniscal signal, but it should not create convincing surface-reaching signal with matching morphology across planes. Compare longer-TE fluid-sensitive images and orthogonal planes without requiring every true meniscal tear to be fluid-bright on T2.',
    relatedModule: '/modules/mri-basics',
    category: 'basics',
  },
  {
    id: 'basics-pd-fs',
    keywords: ['PD FS', 'proton density', 'fat suppressed', 'fat sat', 'pd fat sat', 'what does pd show'],
    question: 'What does PD FS show?',
    answer:
      'PD FS (proton density fat-suppressed) is the workhorse sequence for knee MRI. It provides excellent contrast between fluid/edema (bright) and normal structures (intermediate to dark). It is the best sequence for evaluating menisci, ligaments, cartilage, and bone marrow edema.',
    relatedModule: '/modules/mri-basics',
    category: 'basics',
  },
  {
    id: 'basics-t1',
    keywords: ['T1', 'T1 weighted', 'what is T1', 'T1 best for', 'anatomy', 'fat bright'],
    question: 'What is T1 best for?',
    answer:
      'T1 images excel at showing anatomy because fat is bright and provides natural contrast. T1 is the best sequence for detecting fracture lines (dark lines against bright fatty marrow), evaluating marrow replacement processes, and assessing overall anatomy. Think of T1 as your "anatomy sequence."',
    relatedModule: '/modules/mri-basics',
    category: 'basics',
  },
  {
    id: 'basics-t2-bright',
    keywords: ['bright signal', 'T2 bright', 'hyperintense', 'bright on T2', 'fluid', 'edema', 'what is bright'],
    question: 'What does bright signal on T2 mean?',
    answer:
      'Bright signal on T2-weighted images indicates free water/fluid. This can represent joint effusion, bone marrow edema, soft tissue edema, cysts, or the fluid within a meniscal tear. T2 is your "fluid-finding" sequence — anything bright on T2 contains water.',
    relatedModule: '/modules/mri-basics',
    category: 'basics',
  },
  {
    id: 'basics-planes',
    keywords: ['planes', 'sagittal', 'coronal', 'axial', 'imaging planes', 'which plane'],
    question: 'What are the imaging planes and what do they show?',
    answer:
      'Sagittal is the workhorse plane for cruciate ligaments, the meniscal anterior and posterior horns, cartilage, and the extensor mechanism. Coronal images are critical for collateral ligaments, the meniscal body and roots, and alignment. Axial images are essential for the patellofemoral joint, patellar retinaculum, and MPFL.',
    relatedModule: '/modules/mri-basics',
    category: 'basics',
  },
  {
    id: 'basics-truncation',
    keywords: ['truncation', 'truncation artifact', 'gibbs', 'ringing artifact'],
    question: 'What is truncation artifact?',
    answer:
      'Truncation (Gibbs) artifact appears as alternating bright and dark lines at sharp interfaces between tissues of very different signal intensity (e.g., meniscus-fluid or cartilage-fluid). It can mimic a meniscal tear. It is most pronounced on low-matrix sequences and can be reduced by increasing the acquisition matrix.',
    relatedModule: '/modules/mri-basics',
    category: 'basics',
  },
  {
    id: 'basics-bone-marrow-edema',
    keywords: ['bone marrow edema', 'BME', 'edema', 'bone bruise', 'marrow signal'],
    question: 'What is bone marrow edema on MRI?',
    answer:
      'Edema-like marrow signal is bright on fluid-sensitive fat-suppressed sequences and often lower than adjacent fatty marrow on T1. It is nonspecific and can accompany trauma, stress injury, osteoarthritis, subchondral fracture, infection, inflammation, or neoplasm. Distribution can suggest a mechanism, but morphology, the rest of the protocol, and clinical context establish the diagnosis.',
    relatedModule: '/modules/mri-basics',
    category: 'basics',
  },
  {
    id: 'basics-fat-fluid-level',
    keywords: ['fat fluid level', 'lipohemarthrosis', 'fat fluid', 'fracture sign'],
    question: 'What is a fat-fluid level?',
    answer:
      'A fat-fluid level (lipohemarthrosis) in the suprapatellar recess is a sign of intra-articular fracture. Fat from the marrow cavity leaks into the joint and layers above the blood/fluid component. On a cross-table lateral or axial image, you see a flat horizontal line between the two layers. This finding should prompt a careful search for an occult fracture.',
    relatedModule: '/modules/mri-basics',
    category: 'basics',
  },
  {
    id: 'basics-effusion',
    keywords: ['effusion', 'joint effusion', 'fluid', 'swelling', 'how much fluid'],
    question: 'How do I assess joint effusion?',
    answer:
      'Joint effusion is graded as small, moderate, or large on fluid-sensitive sequences. Look at the suprapatellar recess — small effusion is a thin sliver of fluid, moderate fills the recess, and large distends the recess and gutters. A complex or hemorrhagic effusion (debris, fat-fluid level) suggests fracture or significant internal derangement.',
    category: 'basics',
  },
  {
    id: 'basics-window-level',
    keywords: ['window', 'level', 'brightness', 'contrast', 'viewing', 'optimize'],
    question: 'How should I adjust window and level settings?',
    answer:
      'Different structures require different window/level settings. For the dark meniscus, use a relatively narrow window with a low level and adjust interactively so subtle internal signal is visible without washing out surface contact; use a cartilage-focused setting that preserves contrast among cartilage, fluid, and subchondral bone. One display setting does not optimize every structure, and windowing cannot replace source-image morphology or multiplanar correlation.',
    relatedModule: '/modules/mri-basics',
    category: 'basics',
  },
  {
    id: 'basics-3t-vs-1point5t',
    keywords: ['3T', '1.5T', 'field strength', 'tesla', 'magnet strength'],
    question: 'What is the difference between 1.5T and 3T knee MRI?',
    answer:
      '3T provides higher signal-to-noise ratio and improved spatial resolution compared to 1.5T, which can improve detection of small tears and cartilage defects. However, 3T increases susceptibility artifacts and magic angle effect, which can lead to false-positive meniscal tear diagnoses. Be especially cautious of artifactually increased meniscal signal at 3T.',
    relatedModule: '/modules/mri-basics',
    category: 'basics',
  },
  {
    id: 'basics-anchor-slice',
    keywords: ['anchor', 'anchor slice', 'where to start', 'orientation', 'first slice'],
    question: 'What is the anchor slice?',
    answer:
      'The anchor slice is the mid-sagittal image through the intercondylar notch where you can identify both the ACL and PCL. This is your starting point for systematic interpretation. Before hunting for pathology, confirm you can identify the ACL, PCL, medial meniscus, and lateral meniscus on this reference slice.',
    relatedModule: '/search-pattern',
    category: 'basics',
  },
  {
    id: 'basics-motion-artifact',
    keywords: ['motion', 'motion artifact', 'blurring', 'ghosting', 'patient movement'],
    question: 'What causes motion artifact on knee MRI?',
    answer:
      'Motion artifact appears as ghosting or blurring in the phase-encoding direction, typically from patient movement during the scan. It degrades image quality and can obscure pathology. The knee is relatively stable, so motion artifact is less common than in abdominal imaging, but can still occur with restless patients.',
    relatedModule: '/modules/mri-basics',
    category: 'basics',
  },

  // ─── ANATOMY (14 entries) ──────────────────────────────────────────────────

  {
    id: 'anatomy-meniscus',
    keywords: ['meniscus', 'menisci', 'what is meniscus', 'fibrocartilage', 'meniscal anatomy'],
    question: 'What is the meniscus?',
    answer:
      'The menisci are C-shaped fibrocartilage structures between the femur and tibia that act as shock absorbers, distribute load, and stabilize the joint. Each knee has a medial and lateral meniscus. The medial meniscus is larger, more C-shaped, and firmly attached to the joint capsule and MCL, making it more prone to tearing. The lateral meniscus is more circular, more mobile, and has a gap posteriorly at the popliteal hiatus.',
    relatedModule: '/modules/menisci',
    category: 'anatomy',
  },
  {
    id: 'anatomy-cruciate-ligaments',
    keywords: ['cruciate', 'ligaments', 'ACL', 'PCL', 'cruciate ligament', 'cross'],
    question: 'What are the cruciate ligaments?',
    answer:
      'The anterior cruciate ligament (ACL) and posterior cruciate ligament (PCL) are intracapsular ligaments that cross within the intercondylar notch. The ACL is the more commonly injured cruciate ligament and primarily restrains anterior tibial translation; the PCL primarily restrains posterior tibial translation and is thicker. On appropriately oriented sagittal images, the ACL should form a taut, low-signal oblique band near the intercondylar roof.',
    relatedModule: '/modules/ligaments',
    category: 'anatomy',
  },
  {
    id: 'anatomy-mpfl',
    keywords: ['MPFL', 'medial patellofemoral ligament', 'patellar', 'stabilizer', 'patella ligament'],
    question: 'What is the MPFL?',
    answer:
      'The medial patellofemoral ligament (MPFL) is the primary soft-tissue restraint to lateral patellar displacement in early flexion, contributing approximately 50-60% of the restraining force in biomechanical studies. It extends from the medial patella to the femoral region between the medial epicondyle and adductor tubercle and is assessed best across axial and coronal images. Injury is common after lateral patellar dislocation, but the site is variable and combined sites occur, so evaluate the full course.',
    relatedModule: '/modules/extensor-synovium',
    category: 'anatomy',
  },
  {
    id: 'anatomy-plc',
    keywords: ['posterolateral corner', 'PLC', 'LCL', 'popliteus', 'popliteofibular', 'corner'],
    question: 'What is the posterolateral corner?',
    answer:
      'The posterolateral corner (PLC) is a complex of structures that resist varus and external-rotation forces. Its key stabilizers include the fibular collateral ligament, popliteus tendon, and popliteofibular ligament. A clinically significant unrecognized PLC injury can leave laxity that overloads a cruciate reconstruction, so trace each component and report the combined injury pattern rather than predicting graft failure from MRI alone.',
    relatedModule: '/modules/ligaments',
    category: 'anatomy',
  },
  {
    id: 'anatomy-mcl',
    keywords: ['MCL', 'medial collateral', 'medial collateral ligament', 'superficial MCL', 'deep MCL'],
    question: 'What is the MCL?',
    answer:
      'The medial collateral ligament (MCL) has superficial and deep components. The superficial MCL is a broad band running from the medial femoral epicondyle to the proximal tibia. The deep MCL (meniscotibial and meniscofemoral ligaments) attaches directly to the medial meniscus. MCL injuries are graded I-III and best evaluated on coronal images, tracing from proximal to distal.',
    relatedModule: '/modules/ligaments',
    category: 'anatomy',
  },
  {
    id: 'anatomy-meniscal-root',
    keywords: ['root', 'meniscal root', 'root attachment', 'root anatomy', 'tibial attachment'],
    question: 'What are the meniscal roots?',
    answer:
      'The meniscal roots are the tibial attachments of the anterior and posterior horns. A complete root-disrupting tear can abolish circumferential hoop-stress function. In a cadaveric medial posterior-root model, contact mechanics approached those after total medial meniscectomy; do not generalize that comparison to every partial or lateral root abnormality. The posterior medial root lies near the PCL tibial insertion.',
    relatedModule: '/modules/menisci',
    category: 'anatomy',
  },
  {
    id: 'anatomy-quadriceps-tendon',
    keywords: ['quadriceps', 'quad tendon', 'quadriceps tendon', 'trilaminar'],
    question: 'What is the quadriceps tendon?',
    answer:
      'The quadriceps tendon has a multilayered architecture at the superior patella, commonly described as superficial rectus femoris, middle vastus medialis/lateralis, and deep vastus intermedius contributions. A partial tear may involve only one layer while the remaining fibers stay intact, so inspect every layer on sagittal and axial images and correlate with extensor function.',
    relatedModule: '/modules/extensor-synovium',
    category: 'anatomy',
  },
  {
    id: 'anatomy-patellar-tendon',
    keywords: ['patellar tendon', 'patellar ligament', 'infrapatellar', 'tendon patella'],
    question: 'What is the patellar tendon?',
    answer:
      'The patellar tendon connects the inferior pole of the patella to the tibial tubercle. It is part of the extensor mechanism. It should appear as a uniform, low-signal band on all sequences. Patellar tendinopathy (jumper\'s knee) most commonly affects the proximal posterior fibers at the inferior patellar pole. Complete patellar tendon tears are less common than quadriceps tendon tears.',
    relatedModule: '/modules/extensor-synovium',
    category: 'anatomy',
  },
  {
    id: 'anatomy-popliteal-hiatus',
    keywords: ['popliteal hiatus', 'hiatus', 'popliteus', 'lateral meniscus gap'],
    question: 'What is the popliteal hiatus?',
    answer:
      'The popliteal hiatus is the normal posterolateral interval where the popliteus tendon passes beside the lateral meniscus and capsular attachment is interrupted. It and the popliteomeniscal fascicles can mimic a tear. Trace the tendon/hiatus across adjacent images and use surface contact, morphology, and orthogonal planes; signal reduction on long-TE images supports magic angle but does not exclude a tear.',
    relatedModule: '/modules/menisci',
    category: 'anatomy',
  },
  {
    id: 'anatomy-meniscal-zones',
    keywords: ['zones', 'red zone', 'white zone', 'red-white', 'vascular zone', 'meniscal zones'],
    question: 'What are the meniscal vascular zones?',
    answer:
      'The meniscus is commonly described in red-red (peripheral), red-white (intermediate), and white-white (central) vascular zones. Peripheral tears generally have greater healing potential, but repairability also depends on tear morphology, chronicity, tissue quality, alignment, associated injury, age, activity, and patient goals.',
    relatedModule: '/modules/menisci',
    category: 'anatomy',
  },
  {
    id: 'anatomy-bakers-cyst',
    keywords: ['baker', 'bakers cyst', 'baker\'s cyst', 'popliteal cyst', 'semimembranosus'],
    question: 'What is a Baker\'s cyst?',
    answer:
      'A Baker\'s cyst (popliteal cyst) is a fluid collection in the posteromedial aspect of the knee, located between the semimembranosus tendon and the medial gastrocnemius tendon. It communicates with the joint through a normal anatomic bursa. Most Baker\'s cysts are associated with underlying intra-articular pathology such as meniscal tears or osteoarthritis. Ruptured cysts can mimic deep vein thrombosis.',
    relatedModule: '/modules/menisci',
    category: 'anatomy',
  },
  {
    id: 'anatomy-pes-anserine',
    keywords: ['pes anserine', 'pes', 'anserine', 'sartorius', 'gracilis', 'semitendinosus'],
    question: 'What is the pes anserinus?',
    answer:
      'The pes anserinus ("goose foot") is the conjoined insertion of the sartorius, gracilis, and semitendinosus tendons on the anteromedial proximal tibia. The pes anserine bursa lies between these tendons and the MCL. Pes anserine bursitis presents as fluid and edema at this location and is a common cause of medial knee pain, especially in overweight patients with osteoarthritis.',
    category: 'anatomy',
  },
  {
    id: 'anatomy-it-band',
    keywords: ['IT band', 'iliotibial', 'iliotibial band', 'ITB', 'lateral knee'],
    question: 'What is the iliotibial band?',
    answer:
      'The iliotibial band (ITB) is a thick fascial band running along the lateral thigh that inserts on the Gerdy tubercle of the lateral tibial plateau. IT band friction syndrome causes lateral knee pain and appears on MRI as fluid or edema deep to the ITB at the level of the lateral femoral epicondyle. It is common in runners and cyclists.',
    category: 'anatomy',
  },
  {
    id: 'anatomy-transverse-ligament',
    keywords: ['transverse ligament', 'intermeniscal', 'anterior transverse', 'meniscal ligament'],
    question: 'What is the transverse ligament?',
    answer:
      'The anterior transverse (intermeniscal) ligament connects the anterior horns of the medial and lateral menisci. On sagittal images, it can mimic an anterior horn meniscal tear because it creates a linear signal at the anterior meniscus. Recognizing its typical location and orientation prevents this false-positive diagnosis.',
    relatedModule: '/modules/menisci',
    category: 'anatomy',
  },

  // ─── MENISCI (14 entries) ──────────────────────────────────────────────────

  {
    id: 'menisci-signal-grading',
    keywords: ['meniscal signal', 'grade', 'grading', 'signal grade', 'grade 1', 'grade 2', 'grade 3', 'meniscal grade'],
    question: 'How do I grade meniscal signal?',
    answer:
      'Meniscal signal is graded 1-3. Grade 1 is a small focus of intrameniscal signal not reaching a surface; grade 2 is more extensive linear signal that still does not reach a surface. Grade 3 signal unequivocally reaches at least one articular surface on proton-density/intermediate-weighted short-TE images. Contact on two or more matching images markedly increases positive predictive value; the images need not be contiguous and may be matching orthogonal images. Signal grade supports diagnosis but does not determine surgery.',
    relatedModule: '/modules/menisci',
    category: 'menisci',
  },
  {
    id: 'menisci-two-slice-touch',
    keywords: ['two slice', 'two-slice-touch', 'two slice touch', '2 slice', 'consecutive slices', 'false positive'],
    question: 'What is the two-slice-touch rule?',
    answer:
      'The two-slice-touch rule is a high-confidence rule: surface-reaching meniscal signal on at least two matching images has a much higher positive predictive value than contact on one image. The images need not be consecutive; one sagittal and one coronal image through the same site can count. It is not an absolute gate, so a one-image finding requires morphology, adjacent-image, and orthogonal-plane correlation.',
    relatedModule: '/modules/menisci',
    category: 'menisci',
  },
  {
    id: 'menisci-bucket-handle',
    keywords: ['bucket handle', 'bucket-handle', 'displaced', 'double PCL', 'absent bow-tie', 'fragment in notch'],
    question: 'What is a bucket-handle tear?',
    answer:
      'A bucket-handle tear is a displaced vertical longitudinal meniscal tear where the central fragment flips into the intercondylar notch. The three cardinal signs are: (1) absent bow-tie sign (fewer than 2 consecutive sagittal body images), (2) double PCL sign (displaced fragment parallels the PCL), and (3) fragment in the notch on coronal images. This is time-sensitive because it can cause mechanical locking and may be repairable when recognized early.',
    relatedModule: '/modules/menisci',
    category: 'menisci',
  },
  {
    id: 'menisci-root-tear',
    keywords: ['root tear', 'root', 'meniscal root tear', 'ghost sign', 'hoop stress'],
    question: 'What is a meniscal root tear?',
    answer:
      'A meniscal root tear is an avulsion or radial tear near the tibial attachment. A complete root-disrupting tear can abolish hoop-stress function and is associated with extrusion, compartment overload, subchondral insufficiency fracture, and accelerated osteoarthritis. The sagittal ghost sign and coronal extrusion are clues, not substitutes for direct multiplanar root assessment.',
    relatedModule: '/modules/menisci',
    category: 'menisci',
  },
  {
    id: 'menisci-extrusion',
    keywords: ['extrusion', 'meniscal extrusion', 'measure extrusion', 'how much extrusion', '3mm'],
    question: 'What is meniscal extrusion and how do I measure it?',
    answer:
      'Meniscal extrusion is displacement of the meniscal body beyond the tibial margin. Measure on a coronal mid-body image from the tibial plateau margin, excluding osteophytes, to the outer meniscal edge. Medial extrusion of at least 3 mm is a common major-extrusion threshold and should prompt a root, radial-tear, and cartilage/overload search; it is not independently diagnostic, and the same threshold should not be transferred automatically to the lateral meniscus.',
    relatedModule: '/modules/menisci',
    category: 'menisci',
  },
  {
    id: 'menisci-horizontal-tear',
    keywords: ['horizontal tear', 'horizontal cleavage', 'degenerative tear', 'horizontal meniscal'],
    question: 'What is a horizontal meniscal tear?',
    answer:
      'A horizontal (cleavage) tear runs roughly parallel to the tibial plateau, splitting the meniscus into superior and inferior leaves. It is common in degenerative menisci and may reach the superior surface, inferior surface, or both; trace the cleft in multiple planes and look for an associated parameniscal cyst.',
    relatedModule: '/modules/menisci',
    category: 'menisci',
  },
  {
    id: 'menisci-radial-tear',
    keywords: ['radial tear', 'radial', 'perpendicular', 'meniscal radial'],
    question: 'What is a radial meniscal tear?',
    answer:
      'A radial tear runs perpendicular to the free edge of the meniscus, disrupting the circumferential fibers and compromising hoop stress. On MRI, it appears as a cleft or truncation of the meniscus on the image where the tear intersects the imaging plane. Root tears are a specific type of radial tear at the tibial attachment.',
    relatedModule: '/modules/menisci',
    category: 'menisci',
  },
  {
    id: 'menisci-complex-tear',
    keywords: ['complex tear', 'complex meniscal', 'multiple tear patterns'],
    question: 'What is a complex meniscal tear?',
    answer:
      'A complex meniscal tear combines two or more patterns, such as horizontal and radial components. Describe the location, displaced tissue, peripheral extension, tissue loss, root involvement, and associated degeneration. Complex morphology can reduce repair potential, but MRI morphology alone does not dictate repair versus partial meniscectomy; tissue quality, reducibility, vascular zone, symptoms, alignment, and patient factors matter.',
    relatedModule: '/modules/menisci',
    category: 'menisci',
  },
  {
    id: 'menisci-parameniscal-cyst',
    keywords: ['parameniscal', 'cyst', 'meniscal cyst', 'cyst meniscus'],
    question: 'What is a parameniscal cyst?',
    answer:
      'A parameniscal cyst is a fluid collection adjacent to the meniscus that forms when synovial fluid tracks through a meniscal tear. Its presence strongly implies an underlying meniscal tear even if the tear is difficult to visualize directly. Reported side predominance varies in the literature (several series find medial parameniscal cysts somewhat more common); regardless of side, always search carefully for the causative tear.',
    relatedModule: '/modules/menisci',
    category: 'menisci',
  },
  {
    id: 'menisci-discoid',
    keywords: ['discoid', 'discoid meniscus', 'discoid lateral', 'thick meniscus', 'bow-tie'],
    question: 'What is a discoid meniscus?',
    answer:
      'A discoid meniscus is a congenital variant with broad disc-like coverage, most often lateral. Persistent meniscal continuity across more sagittal images than expected can be a clue, but the classic bow-tie count depends on slice thickness and should be confirmed on coronal images by increased width and tibial-plateau coverage. Report instability or tear morphology rather than diagnosing from the slice count alone.',
    relatedModule: '/modules/menisci',
    category: 'menisci',
  },
  {
    id: 'menisci-ramp-lesion',
    keywords: ['ramp', 'ramp lesion', 'meniscocapsular', 'peripheral tear', 'missed tear'],
    question: 'What is a ramp lesion?',
    answer:
      'A ramp lesion involves the peripheral posterior horn of the medial meniscus and its meniscocapsular or meniscotibial attachment, typically in an ACL-injured knee. Look for fluid or separation at the posteromedial junction on sagittal, coronal, and axial images. MRI sensitivity is limited, so report a seen or suspected lesion clearly and recognize that a negative MRI does not reliably exclude one when clinical or arthroscopic concern persists.',
    relatedModule: '/modules/menisci',
    category: 'menisci',
  },
  {
    id: 'menisci-flipped-meniscus',
    keywords: ['flipped', 'flipped meniscus', 'displaced fragment', 'meniscal displacement'],
    question: 'What is a flipped meniscus fragment?',
    answer:
      'A flipped meniscus occurs when a displaced meniscal fragment flips anteriorly or posteriorly rather than centrally into the notch. Look for an abnormally large anterior horn (suggesting a posteriorly originating fragment has flipped forward) or a "double anterior horn" sign. Correlate with the expected meniscal body on bow-tie images.',
    relatedModule: '/modules/menisci',
    category: 'menisci',
  },
  {
    id: 'menisci-vertical-longitudinal',
    keywords: ['vertical', 'longitudinal', 'vertical longitudinal', 'peripheral vertical'],
    question: 'What is a vertical longitudinal meniscal tear?',
    answer:
      'A vertical longitudinal tear runs parallel to the long axis of the meniscus in a vertical (perpendicular to the tibial plateau) orientation. It typically occurs in the peripheral (vascular) zone from trauma. When the inner fragment displaces centrally, it becomes a bucket-handle tear. Peripheral vertical tears in the red-red zone have good repair potential.',
    relatedModule: '/modules/menisci',
    category: 'menisci',
  },
  {
    id: 'menisci-medial-vs-lateral',
    keywords: ['medial vs lateral', 'which meniscus', 'medial meniscus', 'lateral meniscus', 'difference menisci'],
    question: 'What is the difference between medial and lateral meniscus?',
    answer:
      'The medial meniscus is C-shaped and firmly attached to the capsule and deep MCL, making it less mobile. The lateral meniscus is more circular and mobile and is interrupted peripherally by the popliteal hiatus. Acute ACL injuries commonly accompany lateral meniscal tears, whereas chronic ACL insufficiency increasingly stresses the medial meniscus; inspect both rather than relying on a single side rule.',
    relatedModule: '/modules/menisci',
    category: 'menisci',
  },

  // ─── LIGAMENTS (12 entries) ────────────────────────────────────────────────

  {
    id: 'ligaments-acl-signs',
    keywords: ['ACL tear', 'ACL signs', 'ACL injury', 'anterior cruciate', 'torn ACL', 'acl rupture'],
    question: 'What are the signs of an ACL tear?',
    answer:
      'Primary signs are fiber discontinuity and abnormal orientation/tension, supported by signal abnormality. Secondary signs include pivot-shift contusions, increased anterior tibial translation, PCL buckling, a deep lateral femoral-notch contour, a Segond fracture, and posterior-horn uncovering. Measurement thresholds vary by method, and the familiar 1.5 mm sulcus cutoff is radiographic; secondary signs raise confidence but do not independently prove a tear.',
    relatedModule: '/modules/ligaments',
    category: 'ligaments',
  },
  {
    id: 'ligaments-pivot-shift',
    keywords: ['pivot shift', 'pivot-shift', 'contusion pattern', 'bone bruise pattern', 'ACL bruise'],
    question: 'What is the pivot-shift contusion pattern?',
    answer:
      'The pivot-shift contusion pattern is bone marrow edema at the lateral femoral condyle sulcus and the posterolateral tibial plateau, resulting from the anterior subluxation and internal rotation that occurs during an ACL injury. This pattern is present in many acute ACL tears and is highly specific when combined with ACL disruption. It represents the "footprint" of the injury mechanism.',
    relatedModule: '/modules/ligaments',
    category: 'ligaments',
  },
  {
    id: 'ligaments-segond',
    keywords: ['Segond', 'Segond fracture', 'lateral capsular', 'avulsion', 'anterolateral ligament'],
    question: 'What is a Segond fracture?',
    answer:
      'A Segond fracture is a small avulsion fracture of the lateral tibial plateau rim at the anterolateral capsular/ligament complex. It is strongly associated with ACL injury and indicates a substantial rotational mechanism, so assess the ACL and menisci directly. On coronal images, look for a small flake of bone just lateral to the proximal tibia with associated soft-tissue edema.',
    relatedModule: '/modules/ligaments',
    category: 'ligaments',
  },
  {
    id: 'ligaments-dashboard-injury',
    keywords: ['dashboard', 'dashboard injury', 'PCL tear', 'posterior cruciate', 'posterior force'],
    question: 'What is the dashboard injury?',
    answer:
      'A dashboard injury occurs when a posteriorly directed force is applied to the proximal tibia with the knee flexed (classically from hitting the dashboard in a car accident). This mechanism primarily injures the PCL. On MRI, look for increased signal and thickening of the PCL on sagittal images. Associated injuries include posterior capsule tears and bone bruises on the anterior tibial plateau.',
    relatedModule: '/modules/ligaments',
    category: 'ligaments',
  },
  {
    id: 'ligaments-mcl-grading',
    keywords: ['MCL grade', 'MCL grading', 'MCL injury', 'MCL sprain', 'grade 1 2 3 MCL'],
    question: 'How do I grade MCL injuries?',
    answer:
      'MCL injuries are graded I-III. Grade I: edema surrounding the ligament but intact fibers (sprain). Grade II: partial-thickness tear with some disrupted fibers but partial continuity. Grade III: complete tear with full-thickness disruption. Evaluate on coronal images tracing proximal to distal. Always note whether the superficial MCL, deep MCL, or both are involved, and the location (femoral, midsubstance, or tibial).',
    relatedModule: '/modules/ligaments',
    category: 'ligaments',
  },
  {
    id: 'ligaments-pcl',
    keywords: ['PCL', 'posterior cruciate', 'PCL tear', 'PCL injury', 'buckling'],
    question: 'How do I evaluate the PCL?',
    answer:
      'The normal PCL appears as a smooth, uniformly dark band on sagittal images with a gentle arc. Signs of PCL injury include increased signal intensity within the ligament, thickening, and loss of the normal smooth curvature. PCL buckling (increased convexity) can be a secondary sign of ACL tear. Complete PCL tears show discontinuity, while partial tears show focal signal change with preserved continuity.',
    relatedModule: '/modules/ligaments',
    category: 'ligaments',
  },
  {
    id: 'ligaments-acl-partial',
    keywords: ['partial ACL', 'partial tear ACL', 'incomplete ACL', 'ACL sprain'],
    question: 'How do I diagnose a partial ACL tear?',
    answer:
      'Partial ACL tears are challenging. Look for focal bundle disruption, abnormal orientation or laxity of remaining fibers, and supportive secondary findings. Thickening and increased signal with continuous, appropriately oriented fibers can instead reflect sprain or mucoid degeneration. Report the morphology and bundles involved and correlate with stability examination because MRI does not determine functional competence by itself.',
    relatedModule: '/modules/ligaments',
    category: 'ligaments',
  },
  {
    id: 'ligaments-lcl',
    keywords: ['LCL', 'lateral collateral', 'fibular collateral', 'lateral ligament'],
    question: 'How do I evaluate the LCL?',
    answer:
      'The lateral collateral ligament (LCL, also called fibular collateral ligament) runs from the lateral femoral epicondyle to the fibular head. It is best seen on coronal images as a thin, dark, cord-like structure. LCL tears are graded similarly to MCL tears (I-III). An isolated LCL tear is uncommon — it usually occurs with posterolateral corner injury, so always check the popliteus tendon and popliteofibular ligament.',
    relatedModule: '/modules/ligaments',
    category: 'ligaments',
  },
  {
    id: 'ligaments-acl-associated',
    keywords: ['ACL associated', 'ACL associated injuries', 'what else ACL', 'ACL concomitant'],
    question: 'What injuries are commonly associated with ACL tears?',
    answer:
      'ACL tears are frequently associated with lateral meniscal tears, medial meniscal tears (especially bucket-handle and ramp lesions), bone contusions (pivot-shift pattern), MCL sprains (O\'Donoghue triad), osteochondral injuries, and Segond fractures. When you diagnose an ACL tear, systematically check for each of these associated findings.',
    relatedModule: '/modules/ligaments',
    category: 'ligaments',
  },
  {
    id: 'ligaments-mucoid-acl',
    keywords: ['mucoid', 'mucoid ACL', 'ACL mucoid degeneration', 'thickened ACL', 'celery stalk'],
    question: 'What is mucoid degeneration of the ACL?',
    answer:
      'Mucoid degeneration of the ACL is a non-traumatic condition where the ligament becomes thickened and infiltrated with mucoid material, appearing as a bulky, increased-signal ACL that retains its continuity (the "celery stalk" sign). It can mimic a partial tear but differs because the fibers remain intact and oriented. It is often an incidental finding but may cause posterior knee pain from impingement.',
    relatedModule: '/modules/ligaments',
    category: 'ligaments',
  },
  {
    id: 'ligaments-anterolateral',
    keywords: ['anterolateral', 'ALL', 'anterolateral ligament', 'rotatory instability'],
    question: 'What is the anterolateral ligament?',
    answer:
      'The anterolateral ligament (ALL) is a structure on the anterolateral aspect of the knee that resists internal rotation and contributes to rotational stability. It is closely associated with the Segond fracture avulsion site. Injury to the ALL combined with ACL tear may contribute to persistent rotational instability. Some surgeons now add a lateral extra-articular tenodesis to ACL reconstruction in patients at high risk of graft failure (young age, high-grade pivot shift, generalized ligamentous laxity, revision surgery, high posterior tibial slope, pivoting-sport athletes) — a decision driven by these clinical risk factors rather than by an MRI-demonstrated ALL injury alone.',
    relatedModule: '/modules/ligaments',
    category: 'ligaments',
  },
  {
    id: 'ligaments-multiligament',
    keywords: ['multiligament', 'dislocation', 'knee dislocation', 'multiple ligaments', 'vascular injury'],
    question: 'What is a multiligament knee injury?',
    answer:
      'A multiligament knee injury involves two or more of the four major knee ligaments (ACL, PCL, MCL, LCL) and often occurs in the setting of knee dislocation. These are urgent injuries because popliteal artery injury can be present even after spontaneous reduction. If you see bicruciate ligament injuries or three or more ligament tears, note the possibility of prior knee dislocation and recommend vascular assessment if not already performed.',
    relatedModule: '/modules/ligaments',
    category: 'ligaments',
  },

  // ─── BONES (8 entries) ─────────────────────────────────────────────────────

  {
    id: 'bones-ocd',
    keywords: ['OCD', 'osteochondral', 'osteochondritis dissecans', 'OCD stability', 'loose body'],
    question: 'What is an OCD and how do I assess stability?',
    answer:
      'Osteochondritis dissecans most often affects the lateral aspect of the medial femoral condyle. First check skeletal maturity. Joint-fluid-equivalent undermining, cartilage breach, displacement, and loose bodies support instability. In juvenile OCD, an isolated high-T2 rim is poorly specific; more specific criteria include a fluid-equivalent rim with an outer low-signal rim, multiple subchondral-plate breaks, or multiple cysts/a cyst larger than about 5 mm. Symptomatic or unstable lesions warrant orthopedic assessment.',
    relatedModule: '/modules/cartilage-osteochondral',
    category: 'bones',
  },
  {
    id: 'bones-sifk-sonk',
    keywords: ['SIFK', 'SONK', 'spontaneous osteonecrosis', 'subchondral insufficiency', 'osteonecrosis knee'],
    question: 'What is SIF and how does it relate to the term SONK?',
    answer:
      'Subchondral insufficiency fracture of the knee (SIF) most often affects the weight-bearing medial femoral condyle in skeletally mature or older adults. MRI may show a subchondral low-signal line or band with surrounding edema-like signal. Some SIF lesions heal; others progress to SIF with osteonecrosis and collapse, a spectrum historically labeled SONK. Assess lesion size/collapse, cartilage, medial meniscal root and extrusion, and compartment overload without assigning the root as the sole cause.',
    relatedModule: '/modules/bones-marrow',
    category: 'bones',
  },
  {
    id: 'bones-stress-fracture',
    keywords: ['stress fracture', 'stress reaction', 'fatigue fracture', 'insufficiency fracture'],
    question: 'How do I identify a stress fracture on MRI?',
    answer:
      'A low-signal fracture line or band with surrounding edema-like signal strongly supports stress fracture; T1 and fluid-sensitive sequences are complementary. Stress reaction can show edema without a visible line, but a subtle or occult line may be missed, so integrate location, load history, cortex/subchondral morphology, radiographs or CT when needed, and follow-up.',
    category: 'bones',
  },
  {
    id: 'bones-bone-bruise-patterns',
    keywords: ['bone bruise', 'contusion', 'bruise pattern', 'injury mechanism', 'bone bruise pattern'],
    question: 'How do bone bruise patterns indicate the injury mechanism?',
    answer:
      'Bone-bruise distributions are mechanism clues, not standalone diagnoses. A lateral-femoral-condyle plus posterolateral-tibial-plateau pattern supports a pivot-shift mechanism and prompts ACL assessment; anterior proximal tibial edema can accompany a dashboard/PCL mechanism; medial-patellar plus anterolateral-femoral edema supports transient lateral patellar dislocation; anterior kissing contusions can accompany hyperextension. Confirm the soft-tissue injury directly.',
    relatedModule: '/modules/ligaments',
    category: 'bones',
  },
  {
    id: 'bones-tibial-plateau-fracture',
    keywords: ['tibial plateau', 'fracture', 'plateau fracture', 'depression', 'split'],
    question: 'What should I look for in a tibial plateau fracture?',
    answer:
      'Evaluate fracture orientation and extent, articular depression and condylar widening, comminution, alignment, meniscal entrapment, and ligament/neurovascular injury; CT usually maps osseous detail best. Report measured depression rather than treating a single 2 mm cutoff as an operation rule, because management also depends on instability, displacement pattern, soft tissues, patient factors, and surgeon assessment. In acute nonoperative trauma, lipohemarthrosis strongly supports an intra-articular fracture.',
    category: 'bones',
  },
  {
    id: 'bones-avulsion',
    keywords: ['avulsion', 'avulsion fracture', 'bony avulsion', 'tibial spine'],
    question: 'What avulsion fractures should I look for?',
    answer:
      'Key avulsions include tibial-spine avulsion at the ACL insertion, Segond fracture at the lateral tibial rim (strongly associated with ACL injury), reverse Segond at the medial rim (often a complex PCL plus medial/posteromedial injury), and arcuate-sign fibular-styloid avulsion (a strong PLC marker). Gerdy-tubercle avulsion is uncommon. Each avulsion is a mechanism clue; map the associated soft-tissue injuries directly.',
    relatedModule: '/modules/ligaments',
    category: 'bones',
  },
  {
    id: 'bones-osteochondral-defect',
    keywords: ['osteochondral defect', 'cartilage defect', 'chondral', 'osteochondral injury'],
    question: 'How do I evaluate an osteochondral defect?',
    answer:
      'Report location and surface, AP/transverse size and depth, cartilage stability, subchondral-bone involvement, edema-like signal or cysts, loose bodies, and associated meniscal or ligamentous pathology. These features inform treatment, but no MRI grade or size alone chooses among rehabilitation, marrow stimulation, osteochondral grafting, or cell-based restoration; symptoms, age, alignment, containment, and prior treatment matter.',
    category: 'bones',
  },
  {
    id: 'bones-alignment',
    keywords: ['alignment', 'varus', 'valgus', 'malalignment', 'mechanical axis'],
    question: 'How do I assess alignment on knee MRI?',
    answer:
      'A limited-field, non-weight-bearing knee MRI can show a compartment-overload pattern but cannot measure the true hip-to-ankle mechanical axis. Describe asymmetric cartilage loss, meniscal extrusion, and subchondral change without assigning quantitative varus or valgus from MRI alone. Use standing long-leg radiographs when mechanical alignment will affect management.',
    category: 'bones',
  },

  // ─── CARTILAGE (6 entries) ─────────────────────────────────────────────────

  {
    id: 'cartilage-grading',
    keywords: ['cartilage grading', 'cartilage grade', 'cartilage classification', 'modified Outerbridge', 'ICRS'],
    question: 'How do I grade cartilage damage?',
    answer:
      'Cartilage is graded by modified Outerbridge and by ICRS — they diverge at the deepest lesions, so name the system. Grade 0 normal; 1 signal change, intact surface; 2 defect <50% depth; 3 defect >50% depth (ICRS 3 also includes full-thickness loss down to but not through the intact subchondral plate). Grade 4: modified Outerbridge = full-thickness cartilage loss with exposed subchondral bone; ICRS grade 4 = penetration THROUGH the subchondral bone plate (osteochondral). Report location, size, depth, and associated bone changes.',
    category: 'cartilage',
  },
  {
    id: 'cartilage-delamination',
    keywords: ['delamination', 'cartilage delamination', 'shear', 'cartilage flap'],
    question: 'What is cartilage delamination?',
    answer:
      'Cartilage delamination is a shear injury where the cartilage separates from the underlying subchondral bone along the tidemark (osteochondral junction). On MRI, look for a linear fluid-signal cleft at the base of the cartilage. Delamination injuries are easily missed because the cartilage surface may appear intact. They are common in acute pivot-shift injuries and patellar dislocations.',
    category: 'cartilage',
  },
  {
    id: 'cartilage-loose-bodies',
    keywords: ['loose body', 'loose bodies', 'joint mouse', 'intra-articular body', 'free fragment'],
    question: 'Where should I look for loose bodies?',
    answer:
      'Loose bodies collect in dependent recesses: the posterior joint recess, intercondylar notch, medial and lateral gutters, and suprapatellar pouch. They appear as low-signal structures on all sequences if ossified, or may show cartilage-signal intensity if purely chondral. Always search these locations when you see an osteochondral defect, OCD, or advanced osteoarthritis.',
    category: 'cartilage',
  },
  {
    id: 'cartilage-compartment',
    keywords: ['compartment', 'medial compartment', 'lateral compartment', 'patellofemoral', 'tricompartmental'],
    question: 'How do I assess cartilage by compartment?',
    answer:
      'Systematically scan cartilage in three compartments: medial (medial femoral condyle and medial tibial plateau), lateral (lateral femoral condyle and lateral tibial plateau), and patellofemoral (patellar and trochlear surfaces). For each, assess cartilage thickness, surface integrity, and the underlying subchondral bone. Report the specific compartment pattern (unimedial, bilateral, tricompartmental, or patellofemoral).',
    category: 'cartilage',
  },
  {
    id: 'cartilage-trochlear-dysplasia',
    keywords: ['trochlear dysplasia', 'trochlea', 'sulcus', 'patellar instability', 'trochlear depth'],
    question: 'What is trochlear dysplasia?',
    answer:
      'Trochlear dysplasia is a shallow or flat trochlear groove that predisposes to patellar instability. On axial images, look for a flat or convex trochlear sulcus instead of the normal concavity. The sulcus angle and trochlear depth can be measured — but match the cutoff to the modality and landmark: the familiar figures (normal ~138 degrees, dysplastic >=145 degrees) come from Merchant-view radiographs, and on axial MRI the validated cutoffs are higher and landmark-dependent (about >=145 degrees on bony landmarks, >=154 degrees on cartilaginous landmarks). Trochlear depth <3 mm (axial, 3 cm above the joint line) and lateral trochlear inclination <11 degrees are the MRI-native measures. Trochlear dysplasia is one of the key anatomic risk factors for recurrent patellar dislocation.',
    relatedModule: '/modules/extensor-synovium',
    category: 'cartilage',
  },
  {
    id: 'cartilage-subchondral-cyst',
    keywords: ['subchondral cyst', 'geode', 'subchondral', 'cyst bone'],
    question: 'What causes subchondral cysts?',
    answer:
      'Subchondral cyst-like lesions (geodes) are thought to arise through more than one mechanism, including fluid intrusion through damaged cartilage and subchondral microdamage/remodeling. They are common in osteoarthritis but can occur in other arthropathies. Describe their location and the overlying cartilage and marrow findings rather than using a cyst alone to assign severity or progression.',
    category: 'cartilage',
  },

  // ─── EXTENSOR MECHANISM (7 entries) ────────────────────────────────────────

  {
    id: 'extensor-insall-salvati',
    keywords: ['Insall-Salvati', 'Insall Salvati', 'ratio', 'patella alta', 'patella baja', 'patellar height'],
    question: 'What is the Insall-Salvati ratio?',
    answer:
      'The Insall-Salvati ratio divides intact patellar-tendon length by maximal patellar length. Values above about 1.2 support patella alta and below about 0.8 support baja, but modality, knee flexion, and technique affect the measurement. Do not calculate the ratio across a disrupted or reconstructed patellar tendon; describe patellar position and tendon injury directly.',
    relatedModule: '/modules/extensor-synovium',
    category: 'extensor',
  },
  {
    id: 'extensor-quad-tear',
    keywords: ['quadriceps tear', 'quad tear', 'quadriceps tendon tear', 'quad tendon rupture'],
    question: 'How do I diagnose a quadriceps tendon tear?',
    answer:
      'Quadriceps tendon tears are more common than patellar tendon tears and often occur in patients over 40. A partial tear may involve only one tendon layer while other fibers remain intact. Complete tears show full-thickness discontinuity and retraction, often with patella baja and hemorrhage/effusion. Report the involved layers, percentage width, gap, and retraction, and correlate with extensor function.',
    relatedModule: '/modules/extensor-synovium',
    category: 'extensor',
  },
  {
    id: 'extensor-jumpers-knee',
    keywords: ['jumper', 'jumpers knee', "jumper's knee", 'patellar tendinopathy', 'tendinosis'],
    question: "What is jumper's knee?",
    answer:
      "Jumper's knee is load-related patellar tendinopathy, usually proximal at the inferior patellar pole. MRI may show tendon thickening and increased intrasubstance signal with preserved overall continuity. A partial tear has focal fiber disruption, sometimes with a fluid-signal cleft; report its depth and width, because signal intensity alone does not cleanly separate tendinopathy from every partial tear.",
    relatedModule: '/modules/extensor-synovium',
    category: 'extensor',
  },
  {
    id: 'extensor-patellar-dislocation',
    keywords: ['patellar dislocation', 'patella dislocation', 'lateral dislocation', 'MPFL tear', 'transient dislocation'],
    question: 'What MRI findings indicate patellar dislocation?',
    answer:
      'The classic MRI pattern after lateral patellar dislocation includes: MPFL tear (variable site — often patellar-sided on MRI; check both patellar and femoral ends), bone contusions at the medial patellar facet and anterolateral femoral condyle (from the patella impacting the condyle during relocation), osteochondral injury, joint effusion, and lateral retinacular disruption. Always search for osteochondral loose bodies when you see this pattern.',
    relatedModule: '/modules/extensor-synovium',
    category: 'extensor',
  },
  {
    id: 'extensor-patellar-tendon-tear',
    keywords: ['patellar tendon tear', 'patellar tendon rupture', 'infrapatellar'],
    question: 'How do I diagnose a patellar tendon tear?',
    answer:
      'A complete tear shows full-thickness fiber discontinuity, usually with a gap/retraction and patella alta; partial tears retain some continuous fibers. Report level, width, gap, remaining fibers, retinacula, and postoperative context. Do not use an Insall-Salvati ratio across the disrupted tendon; correlate patellar position and active extension clinically.',
    relatedModule: '/modules/extensor-synovium',
    category: 'extensor',
  },
  {
    id: 'extensor-sinding-larsen',
    keywords: ['Sinding-Larsen', 'Johansson', 'inferior pole', 'traction apophysitis', 'skeletally immature'],
    question: 'What is Sinding-Larsen-Johansson syndrome?',
    answer:
      'Sinding-Larsen-Johansson syndrome is a traction apophysitis at the inferior pole of the patella in skeletally immature patients. It is the patellar analog of Osgood-Schlatter disease (which affects the tibial tubercle). MRI shows edema and fragmentation at the inferior patellar pole with adjacent soft tissue swelling. It is generally self-limiting and treated conservatively.',
    relatedModule: '/modules/extensor-synovium',
    category: 'extensor',
  },
  {
    id: 'extensor-osgood-schlatter',
    keywords: ['Osgood-Schlatter', 'tibial tubercle', 'apophysitis', 'adolescent knee pain'],
    question: 'What is Osgood-Schlatter disease?',
    answer:
      'Osgood-Schlatter disease is a traction apophysitis at the tibial tubercle in adolescents. MRI shows edema, fragmentation, and swelling at the patellar tendon insertion on the tibial tubercle, with thickening of the distal patellar tendon and infrapatellar bursa distension. Like Sinding-Larsen-Johansson syndrome, it is typically self-limiting and treated conservatively.',
    relatedModule: '/modules/extensor-synovium',
    category: 'extensor',
  },

  // ─── REPORTING (5 entries) ─────────────────────────────────────────────────

  {
    id: 'reporting-structured',
    keywords: ['reporting', 'structured report', 'report template', 'how to report', 'format'],
    question: 'How should I structure a knee MRI report?',
    answer:
      'Follow a systematic compartmental approach: (1) Extensor mechanism, (2) Medial compartment (meniscus, MCL, cartilage), (3) Lateral compartment (meniscus, LCL/PLC, cartilage), (4) Intercondylar notch (ACL, PCL), (5) Additional findings (effusion, bone marrow, bursae, soft tissues). Use specific diagnostic language and avoid vague terms like "signal abnormality" without characterization.',
    relatedModule: '/modules/top-10-dont-miss',
    category: 'reporting',
  },
  {
    id: 'reporting-impression',
    keywords: ['impression', 'summary', 'conclusion', 'impression section', 'what to include'],
    question: 'How should I write the impression section?',
    answer:
      'The impression should follow a hierarchy: (1) Primary diagnosis (e.g., "Complete ACL tear"), (2) Associated or secondary injuries (e.g., "lateral meniscus posterior horn tear, grade II MCL sprain"), (3) Consequential findings (e.g., "pivot-shift bone contusions, moderate joint effusion"). Make each item actionable and clinically relevant. Connect findings to their significance.',
    relatedModule: '/modules/top-10-dont-miss',
    category: 'reporting',
  },
  {
    id: 'reporting-confidence-language',
    keywords: ['confidence', 'language', 'probable', 'suspected', 'definite', 'cannot exclude'],
    question: 'What diagnostic confidence language should I use?',
    answer:
      'Use graduated language to convey certainty: "Tear" when findings are definitive, "Probable tear" when highly likely but not unequivocal, and "Suspected / Cannot be excluded" when findings are subtle. Avoid vague language such as "signal abnormality" without further characterization. Specific language helps referring clinicians understand your confidence level and make appropriate management decisions.',
    relatedModule: '/modules/top-10-dont-miss',
    category: 'reporting',
  },
  {
    id: 'reporting-meniscal-tear',
    keywords: ['report meniscal tear', 'describe tear', 'meniscal tear report', 'tear morphology'],
    question: 'How should I report a meniscal tear?',
    answer:
      'When reporting a meniscal tear, specify: which meniscus (medial or lateral), which horn (anterior, body, or posterior), tear morphology (horizontal, vertical, radial, complex), whether it is displaced (bucket-handle, flipped), zone (peripheral, middle, inner third), and size/extent. Also note associated findings like parameniscal cysts, extrusion measurement, and root integrity.',
    relatedModule: '/modules/top-10-dont-miss',
    category: 'reporting',
  },
  {
    id: 'reporting-ligament-injury',
    keywords: ['report ligament', 'ligament injury report', 'describe ligament tear'],
    question: 'How should I report a ligament injury?',
    answer:
      'For ligament injuries, specify: which ligament, grade (I-III), location within the ligament (proximal, midsubstance, distal), partial vs. complete tear, and associated findings. For ACL: note primary and secondary signs. For MCL: distinguish superficial vs. deep components. For PLC: describe each component (LCL, popliteus, popliteofibular ligament) individually.',
    relatedModule: '/modules/top-10-dont-miss',
    category: 'reporting',
  },

  // ─── GENERAL / MISCELLANEOUS (6 entries) ───────────────────────────────────

  {
    id: 'general-dont-miss',
    keywords: ['do not miss', "don't miss", 'must not miss', 'critical findings', 'important diagnoses'],
    question: 'What are the do-not-miss diagnoses on knee MRI?',
    answer:
      'Key do-not-miss diagnoses include posterior medial meniscal root tears with extrusion, displaced bucket-handle tears, ramp lesions in ACL-injured knees, posterolateral-corner injuries, multiligament patterns suggesting prior knee dislocation, osteochondral loose bodies, subchondral insufficiency fractures (SIF), and Segond fractures. Report them clearly and communicate according to the clinical urgency and local policy.',
    relatedModule: '/modules/menisci',
    category: 'general',
  },
  {
    id: 'general-odonoghue',
    keywords: ['O\'Donoghue', 'triad', 'terrible triad', 'unhappy triad', 'three structures'],
    question: 'What is the O\'Donoghue (unhappy) triad?',
    answer:
      'The classic O\'Donoghue triad is the combination of ACL tear, MCL tear, and medial meniscus tear. However, studies have shown that lateral meniscus tears are actually more commonly associated with acute ACL/MCL injuries than medial meniscus tears. When you see an ACL tear with MCL injury, carefully evaluate both menisci.',
    relatedModule: '/modules/ligaments',
    category: 'general',
  },
  {
    id: 'general-cyclops-lesion',
    keywords: ['cyclops', 'cyclops lesion', 'ACL graft', 'postoperative', 'extension block'],
    question: 'What is a cyclops lesion?',
    answer:
      'A cyclops lesion is localized fibrous tissue anterior to an ACL graft, best seen in the intercondylar notch on sagittal images. Many nodules are asymptomatic; the term cyclops syndrome is used when the nodule correlates with a clinically meaningful extension block. Arthroscopic excision is considered for symptomatic mechanical loss of extension, not for every MRI nodule.',
    category: 'general',
  },
  {
    id: 'general-hoffa-fat-pad',
    keywords: ['Hoffa', 'fat pad', 'infrapatellar fat', 'fat pad edema', 'impingement'],
    question: 'What is Hoffa\'s fat pad impingement?',
    answer:
      'Hoffa\'s fat pad (infrapatellar fat pad) lies behind the patellar tendon, below the patella, and in front of the femoral trochlea and tibia. It can become inflamed and edematous from repetitive anterior-compartment impingement — classically the superolateral portion pinched between the patellar tendon / inferior pole of the patella and the lateral femoral trochlea (often with patella alta). On MRI, it appears as increased signal within the fat pad on fluid-sensitive sequences. It is a clinical diagnosis requiring correlation with anterior knee pain that worsens with extension. Distinguish from normal vascular signal within the fat pad.',
    category: 'general',
  },
  {
    id: 'general-popliteal-artery',
    keywords: ['popliteal artery', 'vascular', 'popliteal', 'entrapment', 'aneurysm'],
    question: 'When should I evaluate the popliteal artery?',
    answer:
      'Inspect the popliteal neurovascular bundle whenever trauma involves a knee-dislocation pattern, bicruciate injury, or a posterior plateau fracture. Report gross occlusion, hematoma, or vessel abnormality, but a normal MRI flow void does not exclude intimal injury. Urgent vascular examination and ankle-brachial index, CT angiography when indicated, and serial assessment follow the trauma pathway; routine knee MRI is not vascular clearance.',
    category: 'general',
  },
  {
    id: 'general-pigmented-villonodular',
    keywords: ['TGCT', 'PVNS', 'pigmented villonodular', 'synovitis', 'hemosiderin', 'blooming'],
    question: 'What is diffuse-type tenosynovial giant cell tumor (TGCT)?',
    answer:
      'Diffuse-type TGCT, historically called PVNS, is a locally aggressive synovial neoplasm that often contains hemosiderin. MRI commonly shows lobulated synovial proliferation with low signal and susceptibility blooming, but blooming is not pathognomonic because hemorrhagic and postoperative synovial processes can mimic it. Describe extent and erosions; a mass diagnosis ultimately depends on the complete clinical, imaging, and tissue context.',
    category: 'general',
  },
];
