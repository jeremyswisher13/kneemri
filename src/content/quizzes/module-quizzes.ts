export interface ModuleQuizQuestion {
  id: string;
  stem: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  /** 0-based topic index this question tests (used to filter for resident track) */
  topicIndex: number;
}

export const moduleQuizzes: Record<string, ModuleQuizQuestion[]> = {
  // ─── Module 1: MRI Basics (3 questions) ────────────────────────────

  'mri-basics': [
    {
      id: 'm1-q1',
      stem: 'You are reviewing a knee MRI and want to evaluate the ACL in its full length. Which is the primary clinical plane used to evaluate the ACL from femoral origin to tibial insertion?',
      options: [
        { key: 'A', text: 'Axial' },
        { key: 'B', text: 'Coronal' },
        { key: 'C', text: 'Sagittal' },
        { key: 'D', text: 'Sagittal oblique (parallel to the intercondylar roof)' },
      ],
      correctAnswer: 'C',
      explanation:
        'The sagittal plane is the primary plane for evaluating the ACL, as it displays the ligament along its course from the lateral femoral condyle to the anterior tibial insertion. While sagittal oblique sequences can be helpful, standard sagittal images are the workhorse for ACL assessment in routine clinical practice.',
      topicIndex: 0,
    },
    {
      id: 'm1-q2',
      stem: 'A fellow notices that a structure near the posterior tibial plateau appears abnormally bright on a single sagittal image but looks normal on all other sequences. The structure is oriented approximately 55 degrees to the main magnetic field. What is the most likely explanation?',
      options: [
        { key: 'A', text: 'Partial-thickness tear of the structure' },
        { key: 'B', text: 'Mucoid degeneration' },
        { key: 'C', text: 'Magic angle artifact' },
        { key: 'D', text: 'Motion artifact from patient movement' },
      ],
      correctAnswer: 'C',
      explanation:
        'The magic-angle artifact causes increased signal in ordered collagen near 55 degrees to B0, particularly on short-TE sequences. It usually decreases markedly on longer-TE images, but signal behavior alone does not exclude injury; surface extension, fiber morphology, and orthogonal-plane correlation remain decisive.',
      topicIndex: 3,
    },
    {
      id: 'm1-q3',
      stem: 'In a routine knee MRI protocol, which fluid-sensitive sequence is the standard workhorse for evaluating marrow edema, soft-tissue edema, and meniscal/ligamentous pathology?',
      options: [
        { key: 'A', text: 'Proton density fat-suppressed (PD FS)' },
        { key: 'B', text: 'T1-weighted' },
        { key: 'C', text: 'Gradient echo' },
        { key: 'D', text: 'Short tau inversion recovery (STIR)' },
      ],
      correctAnswer: 'A',
      explanation:
        'PD FS (proton density fat-suppressed) is the fluid-sensitive workhorse of knee MRI: it shows marrow and soft-tissue edema while also giving the SNR and spatial resolution needed for meniscal and ligamentous detail, so most protocols use it as the primary edema-sensitive sequence. STIR is also fluid-sensitive and gives more uniform fat suppression (so it is comparably sensitive for marrow edema in isolation), but its lower SNR and resolution make it a supplement rather than the routine workhorse. T1 excels at anatomy and marrow replacement but does not highlight edema; gradient echo is prone to susceptibility/T2* effects and is not used as the primary edema sequence.',
      topicIndex: 2,
    },
    {
      id: 'm1-q4',
      stem: 'A knee MRI is acquired with T1, PD FS, and T2 sequences. When evaluating bone marrow for traumatic contusions, which sequence combination best distinguishes the extent of injury and detects marrow edema with optimal sensitivity and resolution?',
      options: [
        { key: 'A', text: 'T1 alone, because normal marrow is bright and any pathology appears dark' },
        { key: 'B', text: 'T1 to detect discrete fracture lines within edema (dark line in bright marrow), and PD FS to visualize the full extent of marrow edema with good spatial resolution and signal-to-noise ratio for soft-tissue detail.' },
        { key: 'C', text: 'T2 alone, because it shows fluid/edema the brightest and is the most sensitive sequence' },
        { key: 'D', text: 'PD FS alone, because it is the single most important sequence and eliminates the need for other sequences' },
      ],
      correctAnswer: 'B',
      explanation:
        'Each sequence has complementary roles: T1 reveals marrow replacement and fracture lines (dark lines against bright fat); PD FS shows edema and soft-tissue pathology with excellent resolution; T2 characterizes fluid collections. A complete evaluation uses all three strategically.',
      topicIndex: 1,
    },
    {
      id: 'm1-q5',
      stem: 'You are evaluating a knee MRI for a suspected meniscal tear on a PD/T2 sequence. The meniscus appears uniformly dark (low signal) at your current window/level, making subtle internal signal hard to detect. How should you adjust window width and level to best reveal faint intrasubstance meniscal signal?',
      options: [
        { key: 'A', text: 'Narrow the window width and set the level low, centered on the dark meniscus, so the small range of low signal intensities is spread across the full gray scale and faint internal gradations become visible.' },
        { key: 'B', text: 'Widen the window as much as possible, since a larger window width always increases contrast between adjacent low-signal voxels.' },
        { key: 'C', text: 'Raise the level to the maximum and keep the window wide, making the whole image brighter to expose hidden signal.' },
        { key: 'D', text: 'Leave the window/level unchanged and instead rely solely on the radial and sagittal images, since window/level settings do not affect detection of internal signal.' },
      ],
      correctAnswer: 'A',
      explanation:
        'Detecting faint internal meniscal signal is a contrast task. Narrowing the window width and centering a low level on the dark meniscus spreads a small range of low intensities across the full gray scale, amplifying subtle gradations. Widening the window compresses gray levels and reduces contrast; simply raising overall brightness does not improve low-signal discrimination.',
      topicIndex: 4,
    },
  ],

  // ─── Module 2: Anatomy (4 questions) ───────────────────────────────

  'anatomy': [
    {
      id: 'm2-q1',
      stem: 'When evaluating the menisci on sagittal MRI, you note that the medial meniscus posterior horn is significantly larger than its anterior horn. In contrast, the lateral meniscus anterior and posterior horns appear roughly equal in size. Which statement best characterizes normal meniscal anatomy?',
      options: [
        { key: 'A', text: 'Both menisci are symmetric C-shaped structures with equal-sized horns' },
        { key: 'B', text: 'The lateral meniscus is C-shaped with a larger posterior horn; the medial meniscus is O-shaped' },
        { key: 'C', text: 'Both menisci are O-shaped with larger anterior horns' },
        { key: 'D', text: 'The medial meniscus is C-shaped with a larger posterior horn; the lateral meniscus is more circular (O-shaped) with roughly equal-sized horns' },
      ],
      correctAnswer: 'D',
      explanation:
        'The medial meniscus is C-shaped with a wider posterior horn relative to its anterior horn, while the lateral meniscus is more circular (O-shaped) with anterior and posterior horns of roughly equal size. Recognizing this normal asymmetry is critical so that a normal large medial posterior horn is not mistaken for pathology.',
      topicIndex: 2,
    },
    {
      id: 'm2-q2',
      stem: 'On axial images at the level of the joint line, you notice a gap in the posterolateral capsule where no meniscal tissue is attached. This area is adjacent to the popliteus tendon. What is the correct interpretation?',
      options: [
        { key: 'A', text: 'Peripheral meniscal tear of the lateral meniscus' },
        { key: 'B', text: 'Normal popliteal hiatus' },
        { key: 'C', text: 'Lateral meniscal root avulsion' },
        { key: 'D', text: 'Parameniscal cyst indicating an underlying tear' },
      ],
      correctAnswer: 'B',
      explanation:
        'The popliteal hiatus is a normal anatomic opening in the posterolateral capsule where the popliteus tendon passes from its intracapsular course to its femoral origin. It is a common mimic of a peripheral lateral meniscal tear and should not be reported as pathology.',
      topicIndex: 4,
    },
    {
      id: 'm2-q3',
      stem: 'On a sagittal MRI, the ACL should be evaluated for its expected course and signal. In a normal knee, the ACL fibers course from the posteromedial aspect of the lateral femoral condyle to the anterior tibial plateau. What is the expected signal of a normal ACL on PD FS images?',
      options: [
        { key: 'A', text: 'Uniformly bright (high signal) throughout' },
        { key: 'B', text: 'Uniformly dark (low signal) like the PCL' },
        { key: 'C', text: 'Predominantly low signal with some intermediate signal striations from interposed fat and fascicles' },
        { key: 'D', text: 'Absent signal (the normal ACL is not visible on MRI)' },
      ],
      correctAnswer: 'C',
      explanation:
        'The normal ACL has a striated appearance with predominantly low signal fibers interspersed with intermediate signal from interfascicular fat and connective tissue. This is in contrast to the PCL, which is typically uniformly dark (low signal). Recognizing normal ACL signal helps avoid overcalling partial tears.',
      topicIndex: 3,
    },
    {
      id: 'm2-q4',
      stem: 'The meniscal roots are critical attachment points. Where does the posterior root of the medial meniscus insert?',
      options: [
        { key: 'A', text: 'Anterior to the ACL tibial insertion' },
        { key: 'B', text: 'Just posterior to the tibial spine, between the attachments of the lateral meniscus posterior root and the PCL' },
        { key: 'C', text: 'On the posterior tibial cortex, below the joint line' },
        { key: 'D', text: 'On the medial femoral condyle, adjacent to the MCL' },
      ],
      correctAnswer: 'B',
      explanation:
        'The medial meniscus posterior root inserts on the posterior tibial plateau just anterior to the PCL insertion and posterior to the lateral meniscus posterior root. Evaluate it in sagittal and coronal planes with axial confirmation. A complete root-disrupting tear can abolish hoop-stress function; cadaveric medial-root mechanics approached total medial meniscectomy, but that comparison is not universal for every root abnormality.',
      topicIndex: 2,
    },
    {
      id: 'm2-q5',
      stem: 'A 23-year-old soccer player sustains a noncontact knee injury. Coronal MRI shows a small cortical avulsion fracture at the lateral tibial plateau. Which ligamentous injury should this fracture make you suspect most strongly?',
      options: [
        { key: 'A', text: 'LCL tear; indicates posterolateral corner injury' },
        { key: 'B', text: 'Segond fracture; strongly associated with ACL injury' },
        { key: 'C', text: 'MCL tear; indicates medial compartment varus stress' },
        { key: 'D', text: 'Patellar dislocation; indicates MPFL injury' },
      ],
      correctAnswer: 'B',
      explanation:
        'The Segond fracture (lateral tibial rim avulsion) is a key radiographic sign of ACL injury that should raise suspicion even when the ACL is not directly visible or appears intact on initial assessment.',
      topicIndex: 1,
    },
    {
      id: 'm2-q6',
      stem: 'When organizing a knee MRI report, you evaluate cartilage loss, osteophytes, and meniscal pathology in three separate anatomic units. Which statement best describes this compartment-based approach?',
      options: [
        { key: 'A', text: 'It is redundant because all three compartments always degenerate together' },
        { key: 'B', text: 'It is designed to minimize the report length by grouping findings' },
        { key: 'C', text: 'This approach independently assesses the medial tibiofemoral, lateral tibiofemoral, and patellofemoral compartments — essential because pathology often clusters within one compartment, and isolated compartment disease has different surgical implications than multi-compartment involvement.' },
        { key: 'D', text: 'It is only necessary if varus or valgus malalignment is present' },
      ],
      correctAnswer: 'C',
      explanation:
        'Compartment-based evaluation maps disease distribution and helps frame treatment. Arthroplasty selection is not made from MRI compartment count alone; symptoms, examination, standing radiographs/alignment, ligament status, and patient factors also matter.',
      topicIndex: 0,
    },
    {
      id: 'm2-q7',
      stem: 'On sagittal MRI, you identify a smooth, linear structure connecting the anterior horns of the medial and lateral menisci. This structure can mimic a tear of the anterior horn of the lateral meniscus. What is this normal anatomic variant?',
      options: [
        { key: 'A', text: 'Meniscofemoral ligament (Wrisberg); runs from posterior horn of lateral meniscus to medial femoral condyle posterior to the PCL' },
        { key: 'B', text: 'ACL tibial attachment; represents the ACL insertion site' },
        { key: 'C', text: 'Anterior intermeniscal ligament avulsion; indicates an acute meniscal injury' },
        { key: 'D', text: 'Transverse meniscal ligament; a normal interconnecting ligament between anterior meniscal horns that should not be reported as pathology' },
      ],
      correctAnswer: 'D',
      explanation:
        'The transverse ligament is a key normal variant that can be misinterpreted as an anterior horn lateral meniscal tear if not recognized—it is linear, smooth, and does not disrupt normal meniscal morphology.',
      topicIndex: 4,
    },
    {
      id: 'm2-q8',
      stem: 'A 45-year-old with knee pain undergoes MRI. Coronal images show decreased space and cartilage loss predominantly in the medial tibiofemoral compartment with relative preservation of the lateral compartment. The tibial plateau shows a mild varus inclination. What does this pattern indicate?',
      options: [
        { key: 'A', text: 'A medial compartment-overload pattern that may accompany varus mechanical alignment; standing long-leg radiographs are needed to quantify the true axis' },
        { key: 'B', text: 'Normal aging without malalignment; compartmental asymmetry is expected in all knees' },
        { key: 'C', text: 'Valgus malalignment; shifts load laterally, which would cause lateral cartilage loss' },
        { key: 'D', text: 'Patellofemoral joint disease; does not explain the asymmetric tibiofemoral cartilage loss' },
      ],
      correctAnswer: 'A',
      explanation:
        'MRI can demonstrate a compartment-overload pattern, but a limited-field, non-weight-bearing knee MRI cannot measure the hip-to-ankle mechanical axis. Describe the medial-predominant disease and use standing long-leg radiographs when quantitative varus/valgus alignment will affect management.',
      topicIndex: 1,
    },
  ],

  // ─── Module 3: Search Pattern Overview (3 questions) ───────────────

  'search-pattern-overview': [
    {
      id: 'm3-q1',
      stem: 'A fellow reads a knee MRI and correctly identifies an ACL tear but fails to notice a displaced bucket-handle tear of the medial meniscus on the same study. This type of diagnostic error is best described as:',
      options: [
        { key: 'A', text: 'Satisfaction of search' },
        { key: 'B', text: 'Anchoring bias' },
        { key: 'C', text: 'Availability bias' },
        { key: 'D', text: 'Premature closure' },
      ],
      correctAnswer: 'A',
      explanation:
        'Satisfaction of search occurs when identification of one abnormality reduces the vigilance for detecting additional findings on the same study. Using a systematic checklist-based approach to every knee MRI helps prevent this error by ensuring all structures are evaluated regardless of initial findings.',
      topicIndex: 1,
    },
    {
      id: 'm3-q2',
      stem: 'A sports medicine fellow wants to adopt a systematic approach to reading knee MRI. Which strategy is most effective for avoiding missed findings?',
      options: [
        { key: 'A', text: 'Focus on the area of clinical concern first, then briefly scan the rest of the knee' },
        { key: 'B', text: 'Use a consistent structured checklist that evaluates every anatomic compartment in a fixed order, regardless of clinical history' },
        { key: 'C', text: 'Read only the sequences that are most relevant to the clinical question' },
        { key: 'D', text: 'Start with the radiologist report and then verify the findings on the images' },
      ],
      correctAnswer: 'B',
      explanation:
        'A consistent, structured search pattern that evaluates every compartment in the same order on every study is the most effective way to minimize missed findings. While clinical history provides important context, it should not limit which structures are evaluated. The goal is to look at everything, every time.',
      topicIndex: 0,
    },
    {
      id: 'm3-q3',
      stem: 'Which approach to a systematic knee MRI search is the most reliable way to organize the evaluation so that nothing is missed?',
      options: [
        { key: 'A', text: 'Read one plane at a time — every structure on the sagittals, then the coronals, then the axials — before integrating the findings.' },
        { key: 'B', text: 'Work through the knee one anatomic category at a time (bones, cartilage, menisci, ligaments, extensor mechanism, soft tissues), checking each across all relevant sequences and planes.' },
        { key: 'C', text: 'Evaluate only the structures implicated by the clinical history and request, deferring the rest unless symptoms warrant.' },
        { key: 'D', text: 'Start from the most conspicuous abnormality and work outward, stopping once a finding explains the symptoms.' },
      ],
      correctAnswer: 'B',
      explanation:
        'A robust search organizes by anatomic category and reviews each category across every relevant sequence and plane. This promotes complete coverage and multiplanar correlation. Restricting the search to the clinical question or stopping at the first conspicuous finding invites satisfaction-of-search misses.',
      topicIndex: 2,
    },
    {
      id: 'm3-q4',
      stem: 'A radiologist is training residents on systematic knee MRI reading. Over the first 50 cases, residents complete the full 7-step search pattern on every study. Which outcome best demonstrates successful integration of the pattern into clinical workflow?',
      options: [
        { key: 'A', text: 'The residents should restrict the search pattern to the clinical question to save time after the first 20 cases.' },
        { key: 'B', text: 'Residents will continue to feel the pattern is slow for the first 100 cases and should expect no improvement in speed until they have completed 200+ studies.' },
        { key: 'C', text: 'Once the pattern is memorized, residents can skip any step if they find an obvious abnormality, since the clinical question has been answered.' },
        { key: 'D', text: 'With repetition, residents complete the search pattern without an increase in errors; the pattern becomes automatic and reading speed increases because they no longer spend time deciding what to evaluate next.' },
      ],
      correctAnswer: 'D',
      explanation:
        'Systematic search patterns take sustained repetition to become automatic. Speed increases with practice as decision-making time is eliminated — the pattern is not a permanent burden but a path to efficiency. (The specific number of cases and minutes varies by reader and is offered as faculty experience, not a published benchmark.) Template-driven reporting reinforces the pattern by aligning the reading workflow with the report structure.',
      topicIndex: 3,
    },
    {
      id: 'm3-q5',
      stem: 'When setting up anchor slices for knee MRI reading, which combination of three anchor slices provides the fastest orientation and most reliable navigation for a complete systematic search?',
      options: [
        { key: 'A', text: 'Sagittal image through the midline intercondylar notch (to evaluate cruciates and navigate medially/laterally for menisci), coronal mid-condylar image (to see meniscal bodies, collateral ligaments, and alignment), and axial image through the patellofemoral joint (to evaluate patellar articular surface, trochlea, and MPFL).' },
        { key: 'B', text: 'The three anchor slices should always be the most lateral sagittal slice, the posterior coronal slice, and the most superior axial slice, as these show the most pathology.' },
        { key: 'C', text: 'A single anchor slice (sagittal midline) is sufficient if the radiologist has enough experience; multiple anchor slices slow down reading and should be avoided after the first month of training.' },
        { key: 'D', text: 'Anchor slices should be selected differently for each case based on the clinical question, rather than remaining consistent, to adapt the search to the specific pathology being evaluated.' },
      ],
      correctAnswer: 'A',
      explanation:
        'Anchor slices are fixed reference points that remain consistent across every case. Starting at the same anchor slices on every study accelerates orientation and prevents disorientation mid-read. Within weeks of consistent anchor-slice use, readers can rapidly assess whether a case is grossly abnormal just from the appearance of the anchor slice itself. Consistency is the key to speed and reliability.',
      topicIndex: 4,
    },
  ],

  // ─── Module 4: Bones & Marrow (4 questions) ───────────────────────

  'bones-marrow': [
    {
      id: 'm4-q1',
      stem: 'A 22-year-old soccer player sustains a noncontact pivot injury. MRI shows bone marrow edema at the lateral femoral condyle and the posterolateral tibial plateau. Which injury mechanism does this contusion pattern indicate?',
      options: [
        { key: 'A', text: 'Direct blow to the anterior knee (dashboard injury)' },
        { key: 'B', text: 'Lateral patellar dislocation' },
        { key: 'C', text: 'Hyperextension injury' },
        { key: 'D', text: 'Pivot-shift mechanism with likely ACL injury' },
      ],
      correctAnswer: 'D',
      explanation:
        'The combination of lateral femoral condyle and posterolateral tibial plateau marrow edema is the classic pivot-shift contusion pattern. It results from transient anterior subluxation of the lateral tibial compartment and is strongly associated with ACL tears. When you see this pattern, carefully evaluate the ACL and associated meniscal structures.',
      topicIndex: 1,
    },
    {
      id: 'm4-q2',
      stem: 'A 35-year-old presents after a motor vehicle accident with a knee-to-dashboard impact. MRI shows marrow edema in the anterior proximal tibia and a large joint effusion. What associated ligamentous injury should you specifically evaluate for?',
      options: [
        { key: 'A', text: 'ACL tear' },
        { key: 'B', text: 'PCL tear' },
        { key: 'C', text: 'Lateral collateral ligament tear' },
        { key: 'D', text: 'Patellar tendon rupture' },
      ],
      correctAnswer: 'B',
      explanation:
        'A dashboard injury drives a posteriorly directed force on the flexed proximal tibia, producing a bone contusion at the ANTERIOR proximal tibia (the impact site). This pattern is strongly associated with PCL injury, so the PCL should be carefully evaluated for partial or complete disruption, and the posterolateral corner should also be assessed.',
      topicIndex: 2,
    },
    {
      id: 'm4-q3',
      stem: 'A 16-year-old presents after a first-time lateral patellar dislocation. Which bone marrow edema pattern would you expect on MRI?',
      options: [
        { key: 'A', text: 'Lateral femoral condyle and posterolateral tibial plateau' },
        { key: 'B', text: 'Medial patellar facet and anterior lateral femoral condyle' },
        { key: 'C', text: 'Medial and lateral tibial plateaus symmetrically' },
        { key: 'D', text: 'Posterior femoral condyles bilaterally' },
      ],
      correctAnswer: 'B',
      explanation:
        'Lateral patellar dislocation produces a characteristic kissing contusion pattern: paired edema at the medial patellar facet and the anterolateral femoral condyle, produced as the medial patella impacts the condyle during relocation. When this pattern is identified, evaluate for MPFL injury, osteochondral fracture, and loose bodies.',
      topicIndex: 3,
    },
    {
      id: 'm4-q4',
      stem: 'A 60-year-old female presents with acute-onset medial knee pain without trauma. MRI shows a low-signal subchondral lesion on T1 with surrounding marrow edema in the medial femoral condyle weight-bearing surface. The overlying articular cartilage is intact. What is the most likely diagnosis?',
      options: [
        { key: 'A', text: 'Osteochondritis dissecans (OCD)' },
        { key: 'B', text: 'Avascular necrosis (AVN)' },
        { key: 'C', text: 'Stress fracture of the femoral condyle' },
        { key: 'D', text: 'Subchondral insufficiency fracture of the knee (SIF)' },
      ],
      correctAnswer: 'D',
      explanation:
        'The acute atraumatic presentation, weight-bearing subchondral location, and low-signal focus with surrounding edema-like signal support SIF. Some SIF lesions heal; others progress to SIF with osteonecrosis and collapse, historically called SONK. OCD and systemic osteonecrosis have different typical morphology and context, but age alone is not diagnostic.',
      topicIndex: 6,
    },
    {
      id: 'm4-q5',
      stem: 'A 45-year-old woman with osteoporosis presents with acute medial knee pain after minor trauma. MRI shows a band of low signal on T1 running through the medial tibial plateau with surrounding marrow edema. What is the most likely diagnosis, and what distinguishes it from a fatigue (stress) fracture?',
      options: [
        { key: 'A', text: 'Insufficiency fracture. Insufficiency fractures occur in weakened bone (e.g., osteoporosis) under normal physiologic loading, whereas fatigue fractures occur in normal bone under abnormal repetitive loading. Both appear as a discrete linear low-T1 line within surrounding marrow edema; the distinction is made clinically by bone quality, age, and mechanism, with the osteoporotic history being the key clue here.' },
        { key: 'B', text: 'Fatigue (stress) fracture, which occurs in athletes or military recruits with normal bone density subjected to repetitive abnormal loading and presents with gradual, activity-related onset rather than acute pain after minor trauma.' },
        { key: 'C', text: 'Bone contusion, which would be favored by an appropriate impact pattern without a fracture line, cortical disruption, depression, or characteristic subchondral band.' },
        { key: 'D', text: 'Degenerative joint disease with osteophytes, which produces cartilage loss, subchondral sclerosis, and osteophytes rather than a discrete linear fracture line within marrow edema.' },
      ],
      correctAnswer: 'A',
      explanation:
        'A discrete low-signal line within edema-like marrow signal strongly supports fracture. Diffuse signal without a visible line remains nonspecific and does not prove contusion or exclude early stress/SIF injury. Insufficiency and fatigue fractures are both stress injuries, distinguished by bone quality and loading mechanism.',
      topicIndex: 4,
    },
    {
      id: 'm4-q6',
      stem: 'A 68-year-old man with knee pain undergoes MRI. Coronal images show near-complete cartilage loss in the medial compartment with subchondral sclerosis and prominent osteophytes, while the lateral compartment cartilage appears relatively preserved. What does this pattern indicate, and what additional study best assesses alignment?',
      options: [
        { key: 'A', text: 'Valgus malalignment, which would show the opposite pattern: lateral compartment cartilage loss with medial preservation and lateral osteophytes.' },
        { key: 'B', text: 'This is a medial compartment-overload pattern that may accompany varus alignment. Recommend standing full-length hip-to-ankle radiographs when the mechanical axis will affect treatment.' },
        { key: 'C', text: 'Normal neutral alignment, which would show symmetric cartilage loss and changes across all three compartments rather than compartment-specific overload.' },
        { key: 'D', text: 'Secondary to a meniscal root tear, which would present with meniscal extrusion and acute subchondral insufficiency fracture rather than chronic degenerative changes and osteophytes.' },
      ],
      correctAnswer: 'B',
      explanation:
        'Coronal knee MRI can show a medial compartment-overload pattern, but it cannot establish the true weight-bearing hip-to-ankle mechanical axis. Describe the compartmental disease and use standing long-leg radiographs for quantitative alignment; operation selection still depends on the full clinical and radiographic context.',
      topicIndex: 5,
    },
    {
      id: 'm4-q7',
      stem: 'You identify bone marrow edema in the knee on a sagittal PD FS image. Before assigning a diagnosis, you ask several questions about the edema to direct your search for associated injuries. Which question is LEAST useful for directing those next diagnostic steps?',
      options: [
        { key: 'A', text: 'Where is the edema located? (e.g., posterolateral tibial plateau + lateral femoral condyle edema points to a pivot-shift mechanism, prompting a focused search of the ACL and lateral meniscus).' },
        { key: 'B', text: 'Is the edema on one side of the joint or paired on both opposing surfaces? Paired (kissing) edema implies direct impaction of the two surfaces and should prompt assessment of the apposed bone, cartilage, and adjacent ligaments.' },
        { key: 'C', text: 'In what order were the image series downloaded into the viewer? This does not characterize the edema or its clinical context.' },
        { key: 'D', text: 'Does the edema pattern match a recognized injury mechanism (pivot-shift, dashboard, transient patellar dislocation)? This tells you which specific ligaments and structures to scrutinize.' },
      ],
      correctAnswer: 'C',
      explanation:
        'Location, distribution, mechanism, age, loading history, and symptoms can all direct the differential and associated-injury search. The order in which series reached the viewer has no diagnostic value.',
      topicIndex: 0,
    },
  ],

  // ─── Module 5: Cartilage & Osteochondral (4 questions) ────────────

  'cartilage-osteochondral': [
    {
      id: 'm5-q1',
      stem: 'On MRI, a medial femoral-condyle cartilage defect extends deeper than 50% of cartilage thickness but does not expose subchondral bone. Using the modified Outerbridge system taught in this module, how is it graded?',
      options: [
        { key: 'A', text: 'Grade 1 — superficial softening or fibrillation' },
        { key: 'B', text: 'Grade 2 — defect less than 50% of cartilage thickness' },
        { key: 'C', text: 'Grade 3 — defect greater than 50% of cartilage thickness without full-thickness loss' },
        { key: 'D', text: 'Grade 4 — full-thickness cartilage loss with exposed subchondral bone' },
      ],
      correctAnswer: 'C',
      explanation:
        'Modified Outerbridge grade III is a deep partial-thickness defect involving more than 50% of cartilage without exposed bone; grade IV is full-thickness loss with exposed subchondral bone. Name the system because ICRS differs at the deepest grades: full-thickness loss to an intact subchondral plate is ICRS 3C, while ICRS 4 penetrates the plate.',
      topicIndex: 1,
    },
    {
      id: 'm5-q2',
      stem: 'A skeletally immature basketball player has a juvenile OCD lesion of the medial femoral condyle. Which MRI finding is most specific for instability?',
      options: [
        { key: 'A', text: 'A joint-fluid-equivalent interface rim with an outer low-signal rim, multiple subchondral-plate breaks, or multiple/large (>5 mm) interface cysts' },
        { key: 'B', text: 'Low signal on T1 images within the lesion' },
        { key: 'C', text: 'The lesion is located on the weight-bearing surface' },
        { key: 'D', text: 'Mild surrounding marrow edema' },
      ],
      correctAnswer: 'A',
      explanation:
        'In juvenile OCD, an isolated T2-bright interface line has poor specificity because vascular granulation tissue can be present in a stable lesion. Specific signs include a fluid-equivalent rim with an outer low-signal rim, multiple breaks in the subchondral plate, or multiple/large (>5 mm) cysts; cartilage breach or displacement also supports instability.',
      topicIndex: 4,
    },
    {
      id: 'm5-q3',
      stem: 'A 14-year-old athlete has an OCD lesion at the classic lateral aspect of the medial femoral condyle. A 65-year-old instead has acute atraumatic pain and a low-signal subchondral band with surrounding edema-like signal at the weight-bearing medial femoral condyle. What is the leading diagnosis in the older patient?',
      options: [
        { key: 'A', text: 'OCD in both cases — age does not influence the differential' },
        { key: 'B', text: 'Traumatic osteochondral fracture despite the absence of trauma' },
        { key: 'C', text: 'Subchondral insufficiency fracture of the knee (SIF)' },
        { key: 'D', text: 'AVN in the adolescent' },
      ],
      correctAnswer: 'C',
      explanation:
        'The older age, acute atraumatic pain, weight-bearing location, and subchondral low-signal band support SIF. OCD is favored in a younger patient at its characteristic site. Age is a weighted clue rather than a hard cutoff; morphology, onset, and osteonecrosis risk factors complete the distinction.',
      topicIndex: 5,
    },
    {
      id: 'm5-q4',
      stem: 'On MRI of the knee, you identify a well-defined low-signal structure within the joint that is separate from all articular surfaces, seen within the suprapatellar recess. It demonstrates peripheral low signal on all sequences. What is the most likely diagnosis?',
      options: [
        { key: 'A', text: 'Meniscal ossicle' },
        { key: 'B', text: 'Loose body (osteochondral fragment)' },
        { key: 'C', text: 'Synovial chondromatosis' },
        { key: 'D', text: 'Fabella' },
      ],
      correctAnswer: 'B',
      explanation:
        'A well-defined structure separate from articular surfaces within the joint space, particularly within a recess, is consistent with an intra-articular loose body. Loose bodies can arise from osteochondral fractures, OCD, or synovial chondromatosis. Reporting their number, size, and location is important as they can cause mechanical symptoms and cartilage damage.',
      topicIndex: 6,
    },
    {
      id: 'm5-q5',
      stem: 'What is the classic location of knee osteochondritis dissecans (OCD), and which feature most drives surgical decision-making?',
      options: [
        { key: 'A', text: 'Patellar median ridge; lesion size' },
        { key: 'B', text: 'Lateral (posterolateral) aspect of the medial femoral condyle; fragment stability' },
        { key: 'C', text: 'Central weight-bearing lateral femoral condyle; patient age' },
        { key: 'D', text: 'Tibial plateau; presence of effusion' },
      ],
      correctAnswer: 'B',
      explanation:
        'The classic OCD location is the lateral/posterolateral aspect of the medial femoral condyle. Size and location are reported, but fragment stability is the key imaging determinant; treatment also incorporates symptoms, skeletal maturity, lesion size, activity, and response to nonoperative care.',
      topicIndex: 2,
    },
    {
      id: 'm5-q6',
      stem: 'A 13-year-old and a 35-year-old each have a femoral-condyle OCD lesion. Which single imaging check best identifies the better-prognosis (juvenile) form?',
      options: [
        { key: 'A', text: 'Lesion location on the patella' },
        { key: 'B', text: 'Status of the distal femoral physis — open physes = juvenile OCD, with greater healing potential and more frequent conservative success' },
        { key: 'C', text: 'Presence of a joint effusion' },
        { key: 'D', text: 'Signal intensity of the overlying cartilage' },
      ],
      correctAnswer: 'B',
      explanation:
        'Check the distal femoral physis on coronal images: open physes define juvenile OCD, which generally has greater healing potential. Closed physes lower spontaneous-healing potential but do not determine treatment alone. In juveniles, a high-T2 rim by itself is unreliable for instability because it can be vascular granulation tissue.',
      topicIndex: 3,
    },
  ],

  // ─── Module 6: Menisci (5 questions) ───────────────────────────────

  'menisci': [
    {
      id: 'm6-q1',
      stem: 'On sagittal PD images, you see increased signal within the posterior horn of the medial meniscus that does not extend to an articular surface. How is this signal classified, and what is the clinical significance?',
      options: [
        { key: 'A', text: 'Grade 3 signal — represents a definite meniscal tear' },
        { key: 'B', text: 'Grade 1 signal — always represents an acute traumatic injury' },
        { key: 'C', text: 'Grade 2 signal — requires arthroscopic confirmation of a tear' },
        { key: 'D', text: 'Grade 2 signal — intrameniscal signal without surface extension; it does not by itself meet MRI criteria for a tear' },
      ],
      correctAnswer: 'D',
      explanation:
        'Grade 2 signal is linear intrameniscal signal without articular-surface contact and commonly reflects intrasubstance degeneration. It does not by itself meet surface-signal criteria for a tear; morphology, truncation, displacement, and orthogonal planes still matter because not every tear is diagnosed by signal grade alone.',
      topicIndex: 0,
    },
    {
      id: 'm6-q2',
      stem: 'When evaluating the meniscus for tears on sagittal MRI, the "two-slice-touch" rule is applied. What does this rule state?',
      options: [
        { key: 'A', text: 'A tear is present if abnormal signal is seen on at least two consecutive sagittal images' },
        { key: 'B', text: 'The meniscus must be visible on at least two sagittal slices to be considered normal' },
        { key: 'C', text: 'Grade 3 signal must contact an articular surface on at least two images to confidently diagnose a tear' },
        { key: 'D', text: 'The meniscal body should be seen on exactly two sagittal bow-tie images' },
      ],
      correctAnswer: 'C',
      explanation:
        'Surface-reaching signal on at least two matching images gives high confidence for a tear. The images need not be contiguous; matching sagittal and coronal images can count. A one-image finding has lower predictive value and should be integrated with morphology and orthogonal correlation. Small radial or root tears may be conspicuous on only one image, but that is a reason for targeted confirmation, not an automatic call.',
      topicIndex: 1,
    },
    {
      id: 'm6-q3',
      stem: 'A coronal PD FS image shows a linear high signal extending from the inner free edge of the lateral meniscus body perpendicular to the long axis of the meniscus toward the periphery. What type of tear does this represent?',
      options: [
        { key: 'A', text: 'Horizontal tear' },
        { key: 'B', text: 'Radial tear' },
        { key: 'C', text: 'Longitudinal-vertical tear' },
        { key: 'D', text: 'Complex tear' },
      ],
      correctAnswer: 'B',
      explanation:
        'A radial tear extends perpendicular to the meniscal circumference from the free edge toward the periphery. Its effect on hoop-stress transmission depends on width and location; complete or near-complete tears and root-adjacent tears are most consequential.',
      topicIndex: 2,
    },
    {
      id: 'm6-q4',
      stem: 'A sagittal MRI shows the "ghost meniscus" sign at the expected location of the medial meniscus posterior root, and the coronal shows meniscal extrusion greater than 3 mm over the medial tibial plateau. Which diagnosis should you strongly consider?',
      options: [
        { key: 'A', text: 'Medial meniscus posterior root tear' },
        { key: 'B', text: 'Peripheral longitudinal tear of the medial meniscus' },
        { key: 'C', text: 'Normal variant of meniscal morphology' },
        { key: 'D', text: 'Discoid medial meniscus' },
      ],
      correctAnswer: 'A',
      explanation:
        'The ghost sign at the root plus major medial extrusion is highly suggestive of a posterior medial root tear. A complete root-disrupting tear can abolish hoop-stress function; a cadaveric medial-root model produced contact mechanics similar to total medial meniscectomy, but this comparison does not apply automatically to every partial or lateral root abnormality.',
      topicIndex: 3,
    },
    {
      id: 'm6-q5',
      stem: 'You notice only one bow-tie image on the sagittal series where you would normally expect at least two meniscal-body images. On a sagittal notch image, a second low-signal band lies parallel and anteroinferior to the PCL. What is the most likely diagnosis?',
      options: [
        { key: 'A', text: 'Normal meniscal variant' },
        { key: 'B', text: 'Radial tear of the meniscal body' },
        { key: 'C', text: 'Bucket-handle tear with a displaced fragment (double PCL sign)' },
        { key: 'D', text: 'Discoid meniscus with a horizontal tear' },
      ],
      correctAnswer: 'C',
      explanation:
        'Fewer than the expected two bow-tie body images should trigger a displaced-fragment search after excluding prior meniscectomy, a small meniscus, and slice-thickness effects. A separate low-signal notch band paralleling the PCL is the double-PCL sign. Together with a donor site, these findings strongly support a displaced bucket-handle tear.',
      topicIndex: 5,
    },
    {
      id: 'm6-q6',
      stem: 'On a knee MRI showing an ACL tear, which easily-missed meniscal injury must you specifically search for at the posterior meniscocapsular junction of the medial meniscus?',
      options: [
        { key: 'A', text: 'Bucket-handle tear of the lateral meniscus' },
        { key: 'B', text: 'Ramp lesion' },
        { key: 'C', text: 'Radial tear of the lateral meniscus posterior root' },
        { key: 'D', text: 'Discoid meniscus' },
      ],
      correctAnswer: 'B',
      explanation:
        'A ramp lesion involves the peripheral posterior horn of the medial meniscus and its meniscocapsular or meniscotibial attachment in an ACL-injured knee. MRI sensitivity is limited, so a negative study does not exclude it. Inspect the posteromedial junction in multiple planes and report a seen or suspected lesion clearly; stability and repairability are determined in the full clinical and arthroscopic context.',
      topicIndex: 4,
    },
    {
      id: 'm6-q7',
      stem: 'Medial meniscal extrusion is measured on the coronal mid-body image, excluding osteophytes from the tibial margin. Which threshold defines major extrusion and what should it prompt?',
      options: [
        { key: 'A', text: '>1 mm; bucket-handle tear' },
        { key: 'B', text: '≥3 mm; a deliberate root/radial-tear and cartilage search, without diagnosing a root tear from extrusion alone' },
        { key: 'C', text: '>8 mm; horizontal cleavage tear' },
        { key: 'D', text: 'Any extrusion; discoid meniscus' },
      ],
      correctAnswer: 'B',
      explanation:
        'At least 3 mm is the conventional major medial-extrusion threshold. Measure from the tibial margin without osteophytes and report the continuous value. It is a search trigger, not a diagnosis: degeneration, radial/root tears, cartilage loss, loading, and positioning can affect extrusion, and the same threshold should not be transferred mechanically to the lateral meniscus.',
      topicIndex: 6,
    },
    {
      id: 'm6-q8',
      stem: 'A parameniscal cyst is identified adjacent to the meniscus. What is it commonly associated with, and what should the report do?',
      options: [
        { key: 'A', text: 'An intact meniscus; the cyst is incidental' },
        { key: 'B', text: 'An underlying, often horizontal meniscal tear; trace and report the communication because it may affect treatment and recurrence risk' },
        { key: 'C', text: 'An ACL tear; the cyst resolves after ACL reconstruction' },
        { key: 'D', text: 'Chondrocalcinosis; no treatment needed' },
      ],
      correctAnswer: 'B',
      explanation:
        'Parameniscal cysts are commonly associated with a horizontal or complex meniscal tear and may communicate through a one-way-valve mechanism. Trace and report the tear/communication because it affects treatment and recurrence risk. A lateral cyst near the fibular head can affect the common peroneal nerve.',
      topicIndex: 7,
    },
    {
      id: 'm6-q9',
      stem: 'On MRI after meniscal repair, which finding most reliably indicates a RE-TEAR rather than expected post-operative healing signal?',
      options: [
        { key: 'A', text: 'Any intrameniscal signal at the repair site' },
        { key: 'B', text: 'New fluid-signal extension into the repair with changed morphology or a displaced fragment, or contrast tracking into the defect on selected MR arthrography' },
        { key: 'C', text: 'Mild intermediate signal that does not reach a surface' },
        { key: 'D', text: 'A small joint effusion' },
      ],
      correctAnswer: 'B',
      explanation:
        'Signal can persist for years after successful repair. Re-tear is favored by new fluid-signal extension together with changed morphology, a displaced fragment, or comparison showing a new defect. Direct MR arthrography is useful selectively, especially after substantial resection or when conventional MRI lacks a helpful effusion; it is not required for every postoperative meniscus.',
      topicIndex: 8,
    },
  ],

  // ─── Module 7: Ligaments (5 questions) ─────────────────────────────

  'ligaments': [
    {
      id: 'm7-q1',
      stem: 'You identify discontinuity and abnormal signal of the ACL on sagittal images. Which of the following secondary signs on MRI would most strongly support the diagnosis of an ACL tear?',
      options: [
        { key: 'A', text: 'Isolated medial tibial plateau marrow edema' },
        { key: 'B', text: 'Isolated prepatellar bursitis' },
        { key: 'C', text: 'Patellar alta' },
        { key: 'D', text: 'Anterior tibial translation relative to the femur, deep lateral femoral notch sign, and Segond fracture' },
      ],
      correctAnswer: 'D',
      explanation:
        'Secondary signs include anterior tibial translation measured at the mid-lateral femoral condyle (≥5 mm was ~93% specific but ~58% sensitive; every knee with ≥7 mm had a tear in the original Vahey cohort), a deep lateral femoral sulcus, uncovering of the lateral posterior horn, Segond fracture, PCL buckling, and pivot-shift contusions. The classic >1.5 mm deep-sulcus cutoff came from lateral radiographs, so use MRI morphology qualitatively. Marked translation and a Segond fracture are particularly specific; other secondary signs vary in performance. Their absence does not exclude a tear.',
      topicIndex: 0,
    },
    {
      id: 'm7-q2',
      stem: 'After a dashboard injury with posterior laxity on examination, sagittal MRI shows diffuse PCL thickening, increased fluid-sensitive signal, and partial fiber disruption with residual continuity. How would you characterize this injury?',
      options: [
        { key: 'A', text: 'Normal PCL' },
        { key: 'B', text: 'Complete PCL tear (grade 3)' },
        { key: 'C', text: 'Partial PCL tear (grade 1-2)' },
        { key: 'D', text: 'PCL mucoid degeneration' },
      ],
      correctAnswer: 'C',
      explanation:
        'A thickened PCL with increased intrasubstance signal but residual intact fibers represents a partial (incomplete) PCL tear. A complete tear shows full discontinuity or a diffusely amorphous, edematous ligament. PCL mucoid degeneration also causes thickening and increased signal but typically occurs without an acute injury history and has a characteristic striated pattern.',
      topicIndex: 3,
    },
    {
      id: 'm7-q3',
      stem: 'A skier presents after a valgus injury. MRI shows partial discontinuity, thickening, and high signal of superficial MCL fibers near the femoral origin with surrounding edema; some fibers and the deep MCL remain intact. What grade MCL injury is this?',
      options: [
        { key: 'A', text: 'Grade 1 — mild sprain with intact fibers' },
        { key: 'B', text: 'Grade 2 — partial tear with some disrupted fibers but the ligament is not completely torn' },
        { key: 'C', text: 'Grade 3 — complete disruption of both superficial and deep MCL' },
        { key: 'D', text: 'Normal MCL with adjacent soft-tissue contusion' },
      ],
      correctAnswer: 'B',
      explanation:
        'MCL Grade 2 injuries show partial disruption of fibers with thickening and high signal within the ligament on fluid-sensitive sequences, but some fibers remain intact. Grade 1 shows edema around an intact ligament; Grade 3 shows complete disruption. The location of injury (femoral, tibial, or mid-substance) should also be reported as it influences surgical planning.',
      topicIndex: 4,
    },
    {
      id: 'm7-q4',
      stem: 'A patient sustains a combined varus and external rotation injury. On MRI, you identify tears of the fibular collateral ligament (LCL), popliteus tendon, and popliteofibular ligament. This constellation of findings represents injury to which anatomic structure?',
      options: [
        { key: 'A', text: 'Medial patellofemoral ligament (MPFL) complex' },
        { key: 'B', text: 'Posterolateral corner (PLC)' },
        { key: 'C', text: 'Posteromedial corner' },
        { key: 'D', text: 'Iliotibial band complex' },
      ],
      correctAnswer: 'B',
      explanation:
        'The posterolateral corner (PLC) includes the fibular collateral ligament, popliteus tendon, and popliteofibular ligament as key stabilizers. PLC injuries frequently accompany cruciate tears and, if unrecognized, can leave rotational/varus instability that compromises a cruciate reconstruction.',
      topicIndex: 5,
    },
    {
      id: 'm7-q5',
      stem: 'Following a first-time lateral patellar dislocation, which ligamentous structure is most commonly injured and should be specifically evaluated on axial MRI?',
      options: [
        { key: 'A', text: 'Medial patellofemoral ligament (MPFL)' },
        { key: 'B', text: 'Anterior cruciate ligament (ACL)' },
        { key: 'C', text: 'Lateral collateral ligament (LCL)' },
        { key: 'D', text: 'Posterior cruciate ligament (PCL)' },
      ],
      correctAnswer: 'A',
      explanation:
        'The MPFL/medial patellofemoral complex is the primary soft-tissue restraint to lateral patellar translation and is injured in most acute lateral dislocations. Inspect patellar, femoral, and midsubstance portions on axial images and report the site, while recognizing that recurrence risk and treatment depend more on the complete anatomy, skeletal maturity, and clinical instability than on tear site alone.',
      topicIndex: 7,
    },
    {
      id: 'm7-q6',
      stem: 'An ACL shows diffuse increased intrasubstance signal and is thickened, but its fibers remain CONTINUOUS and parallel to Blumensaat\'s line, with no secondary signs of instability. What is the most likely diagnosis?',
      options: [
        { key: 'A', text: 'Acute complete ACL tear' },
        { key: 'B', text: 'Mucoid degeneration of the ACL ("celery stalk" appearance)' },
        { key: 'C', text: 'Acute partial ACL tear with instability' },
        { key: 'D', text: 'ACL graft re-tear' },
      ],
      correctAnswer: 'B',
      explanation:
        'Mucoid degeneration thickens the ACL with increased T2 signal between intact, continuous fibers, producing a celery-stalk appearance; intraosseous ganglion cysts may coexist. The key is preserved fiber continuity and no instability pattern attributable to the ACL finding. Many cases are incidental; symptomatic patients may have deep pain or motion restriction, and functional stability requires clinical examination.',
      topicIndex: 1,
    },
    {
      id: 'm7-q7',
      stem: 'When evaluating an ACL reconstruction graft, which tunnel/graft configuration most directly contributes to persistent rotational (pivot-shift) instability despite acceptable anterior-translation control?',
      options: [
        { key: 'A', text: 'A vertical, nonanatomic femoral tunnel producing a vertical graft trajectory' },
        { key: 'B', text: 'An anterior tibial tunnel producing graft-roof impingement in extension' },
        { key: 'C', text: 'An anterior femoral aperture producing excessive graft tension in flexion' },
        { key: 'D', text: 'The patellar-tendon donor site' },
      ],
      correctAnswer: 'A',
      explanation:
        'A vertical nonanatomic femoral tunnel produces a vertical graft that may control anterior translation yet inadequately control rotation. Keep other mechanisms separate: an anterior tibial aperture can predispose to roof impingement in extension, while an anterior femoral aperture can over-tension the graft in flexion. Assess both apertures and the three-dimensional trajectory with graft morphology and clinical stability.',
      topicIndex: 2,
    },
    {
      id: 'm7-q8',
      stem: 'In a patient with combined ACL + MCL injury, why must you specifically evaluate the posteromedial corner (posterior oblique ligament, semimembranosus expansions)?',
      options: [
        { key: 'A', text: 'It is the donor site for ACL reconstruction' },
        { key: 'B', text: 'Combined ACL + MCL + PMC injury produces anteromedial rotatory instability that may need PMC repair in addition to ACL surgery' },
        { key: 'C', text: 'The PMC is the primary restraint to anterior translation' },
        { key: 'D', text: 'PMC injury is purely incidental and does not affect management' },
      ],
      correctAnswer: 'B',
      explanation:
        'The posteromedial corner (posterior oblique ligament + semimembranosus expansions) is a key rotational stabilizer. Combined ACL + MCL + PMC injury creates ANTEROMEDIAL rotatory instability; an unrecognized PMC injury is a cause of residual instability/graft failure and may require PMC repair or reconstruction alongside the ACL. Always scrutinize the PMC when you see an MCL tear with an ACL injury.',
      topicIndex: 6,
    },
    {
      id: 'm7-q9',
      stem: 'A high-energy knee injury shows tears of BOTH cruciates plus a posterolateral corner injury (knee-dislocation pattern). Beyond the ligaments, which structure must be specifically assessed?',
      options: [
        { key: 'A', text: 'The popliteal artery (and common peroneal nerve)' },
        { key: 'B', text: 'The anterior tibial recurrent artery' },
        { key: 'C', text: 'The saphenous vein' },
        { key: 'D', text: 'The descending genicular artery' },
      ],
      correctAnswer: 'A',
      explanation:
        'A bicruciate/corner injury is a knee-dislocation pattern even after spontaneous reduction and carries limb-threatening popliteal-artery risk plus possible common-peroneal-nerve injury. Routine knee MRI cannot exclude an intimal injury: urgent vascular examination and ankle-brachial index, CT angiography when abnormal/equivocal or per protocol, and serial examinations are the safety pathway. MRI should still map the nerve and gross neurovascular abnormalities.',
      topicIndex: 8,
    },
  ],

  // ─── Module 8: Extensor Mechanism (9 questions) ────────────────────

  'extensor-synovium': [
    {
      id: 'm8-q1',
      stem: 'On sagittal MRI, a partial quadriceps-tendon tear is confined to the deep vastus-intermedius contribution while the superficial and middle fibers remain continuous. Why can this injury be clinically and visually subtle?',
      options: [
        { key: 'A', text: 'A deep-layer defect is always magic-angle artifact and cannot represent a tear' },
        { key: 'B', text: 'Remaining intact layers can preserve continuity and some extensor function, so every tendon layer must be inspected' },
        { key: 'C', text: 'The other layers are never involved in quadriceps-tendon injury' },
        { key: 'D', text: 'The tendon is homogeneous, so a layer-specific defect is impossible' },
      ],
      correctAnswer: 'B',
      explanation:
        'The quadriceps tendon has a multilayered architecture. A tear can involve only one contribution while the remaining fibers stay intact, preserving some continuity and extensor function. Inspect all layers on sagittal and axial images; the question does not imply that the deep layer is the most common tear site.',
      topicIndex: 0,
    },
    {
      id: 'm8-q2',
      stem: 'A 40-year-old male presents with inability to extend the knee after jumping. MRI shows complete discontinuity of the patellar tendon with retraction and a superiorly displaced patella. What additional finding should you evaluate for?',
      options: [
        { key: 'A', text: 'ACL tear' },
        { key: 'B', text: 'Associated meniscal tear' },
        { key: 'C', text: 'Patella alta and degree of tendon retraction' },
        { key: 'D', text: 'Lateral collateral ligament tear' },
      ],
      correctAnswer: 'C',
      explanation:
        'In patellar-tendon rupture, loss of the distal tether allows proximal displacement of the patella from quadriceps pull. A formal Insall-Salvati ratio assumes a measurable intact tendon and should not be applied across the rupture gap. Report patellar position, tear level, fiber gap, retraction of the torn tendon ends, retinacular injury, and any avulsion fragment.',
      topicIndex: 1,
    },
    {
      id: 'm8-q3',
      stem: 'An MRI shows a well-corticated osseous fragment at the superolateral pole of the patella with smooth margins and no surrounding marrow edema. The patient is asymptomatic in this region. What is the most likely diagnosis?',
      options: [
        { key: 'A', text: 'Acute patellar sleeve fracture' },
        { key: 'B', text: 'Bipartite patella (normal variant)' },
        { key: 'C', text: 'Osteochondral fracture from patellar dislocation' },
        { key: 'D', text: 'Avulsion fracture of the quadriceps tendon insertion' },
      ],
      correctAnswer: 'B',
      explanation:
        'Bipartite patella is a normal developmental variant, most commonly located at the superolateral pole, with smooth, well-corticated margins and no associated marrow edema. In contrast, an acute fracture would show irregular margins, marrow edema, and surrounding soft-tissue changes. Bipartite patella can occasionally become symptomatic with overuse.',
      topicIndex: 2,
    },
    {
      id: 'm8-q4',
      stem: 'On axial and sagittal MRI, you see a well-defined fluid collection anterior to the patellar tendon, superficial to the tibial tubercle. The patient is a carpet layer who works on his knees. What is the most likely diagnosis?',
      options: [
        { key: 'A', text: 'Prepatellar bursitis' },
        { key: 'B', text: 'Superficial infrapatellar bursitis' },
        { key: 'C', text: 'Deep infrapatellar bursitis (behind the patellar tendon)' },
        { key: 'D', text: 'Baker cyst (popliteal cyst)' },
      ],
      correctAnswer: 'B',
      explanation:
        'The superficial infrapatellar bursa is located anterior to the distal patellar tendon and tibial tubercle. It is commonly inflamed in people who frequently kneel (clergyman\'s knee / carpet layer\'s knee). The prepatellar bursa is more superior, anterior to the patella itself. Distinguishing these bursae helps correlate imaging findings with the patient\'s occupational history.',
      topicIndex: 5,
    },
    {
      id: 'm8-q5',
      stem: 'A knee MRI shows a fat-fluid level in the suprapatellar bursa (lipohemarthrosis). What does this finding tell you, and what must you do next?',
      options: [
        { key: 'A', text: 'It is a benign reactive effusion; no further action' },
        { key: 'B', text: 'In an acute nonoperative trauma setting it strongly indicates an intra-articular fracture; systematically search for the source' },
        { key: 'C', text: 'It indicates septic arthritis; aspirate urgently' },
        { key: 'D', text: 'It is a sign of PVNS; obtain a gradient-echo sequence' },
      ],
      correctAnswer: 'B',
      explanation:
        'In acute nonoperative trauma, a lipohemarthrosis strongly indicates communication between marrow and the joint, usually from an intra-articular fracture. Search the tibial plateaus, patella, femoral condyles, and osteochondral surfaces. Recent surgery or an intra-articular procedure is an important contextual exception.',
      topicIndex: 3,
    },
    {
      id: 'm8-q6',
      stem: 'A popliteal (Baker\'s) cyst is identified. Between which two structures does it characteristically arise, and what should you always look for?',
      options: [
        { key: 'A', text: 'Between the biceps femoris and LCL; look for a Segond fracture' },
        { key: 'B', text: 'Between the medial head of gastrocnemius and the semimembranosus tendon; look for an underlying internal derangement (meniscal tear, cartilage loss, synovitis)' },
        { key: 'C', text: 'Anterior to the patellar tendon; look for Hoffa impingement' },
        { key: 'D', text: 'Within the popliteus tendon sheath; look for a PCL tear' },
      ],
      correctAnswer: 'B',
      explanation:
        'A Baker\'s cyst arises posteromedially between the medial head of gastrocnemius and the semimembranosus tendon. It is usually SECONDARY to intra-articular pathology, so always search for the cause (meniscal tear, cartilage loss, synovitis). A ruptured Baker\'s cyst dissects inferiorly into the calf and mimics a DVT clinically.',
      topicIndex: 4,
    },
    {
      id: 'm8-q7',
      stem: 'Diffusely low-signal synovial thickening with marked susceptibility blooming on gradient-echo imaging most strongly suggests which condition?',
      options: [
        { key: 'A', text: 'Synovial (osteo)chondromatosis' },
        { key: 'B', text: 'Diffuse-type tenosynovial giant cell tumor (TGCT; formerly PVNS)' },
        { key: 'C', text: 'Inflammatory (rheumatoid) synovitis' },
        { key: 'D', text: 'Lipoma arborescens' },
      ],
      correctAnswer: 'B',
      explanation:
        'Diffuse-type TGCT often contains hemosiderin, producing low signal and susceptibility blooming. The pattern is strongly suggestive but not pathognomonic because hemorrhagic and postoperative synovial processes can also bloom; morphology, distribution, and tissue diagnosis matter for a mass.',
      topicIndex: 6,
    },
    {
      id: 'm8-q8',
      stem: "A routine knee MRI after a varus injury shows a distal biceps femoris tendon tear at the fibular head with 2 cm retraction. Which additional reporting step is most important for this knee-region injury?",
      options: [
        { key: 'A', text: "Measure only the edema length; nearby ligament and nerve findings are unrelated" },
        { key: 'B', text: "Report retraction and assess the LCL/PLC attachments and common peroneal nerve around the fibular neck" },
        { key: 'C', text: "Diagnose a proximal ischial-tuberosity avulsion from this limited knee field" },
        { key: 'D', text: "Measure the adductor longus origin at the pubis" },
      ],
      correctAnswer: 'B',
      explanation: "The distal biceps femoris inserts at the fibular head near the LCL/PLC complex and common peroneal nerve. Report tendon continuity and retraction, then assess associated corner injury and the nerve. The ischial hamstring and adductor origins are outside a routine knee MRI field and should not be inferred from this examination.",
      topicIndex: 7,
    },
    {
      id: 'm8-q9',
      stem: "A 45-year-old recreational tennis player feels a sudden calf 'pop.' Knee MRI shows fluid tracking between the medial gastrocnemius and soleus aponeurosis. Which safety statement is most appropriate?",
      options: [
        { key: 'A', text: "Routine knee MRI cannot exclude DVT; assess for gross venous abnormality and recommend dedicated venous duplex ultrasound when clinical concern remains" },
        { key: 'B', text: "The proximal tibiofibular joint, for a ganglion" },
        { key: 'C', text: "The quadriceps tendon insertion on the patella" },
        { key: 'D', text: "The adductor longus origin at the pubis" },
      ],
      correctAnswer: 'A',
      explanation: "Medial gastrocnemius injury and ruptured Baker's cyst can mimic DVT clinically. A routine knee MRI cannot assess venous compressibility or reliably exclude thrombosis; dedicated duplex ultrasound is required when DVT remains clinically possible.",
      topicIndex: 7,
    },
  ],

  // ─── Module 9: 12 Don't-Miss Findings (5 questions) ──────────────

  'top-10-dont-miss': [
    {
      id: 'm10-q1',
      stem: 'On sagittal MRI, you see only one bow-tie configuration of the medial meniscus body instead of the expected two. On the coronal images, there is a low-signal fragment in the intercondylar notch deep to the PCL. What is the unifying diagnosis?',
      options: [
        { key: 'A', text: 'Discoid medial meniscus' },
        { key: 'B', text: 'Displaced bucket-handle tear of the medial meniscus' },
        { key: 'C', text: 'Medial meniscus posterior root tear' },
        { key: 'D', text: 'Normal variant — the medial meniscus can have variable body width' },
      ],
      correctAnswer: 'B',
      explanation:
        'The absent-bow-tie pattern plus a confirmed notch fragment and donor site supports a displaced bucket-handle tear. The double-PCL sign specifically describes a sagittal fragment paralleling the PCL. Prompt orthopedic assessment is warranted when the knee is clinically locked; MRI alone does not prove that every displaced tear is mechanically blocking extension.',
      topicIndex: 2,
    },
    {
      id: 'm10-q2',
      stem: 'A 15-year-old presents with knee pain. MRI shows an OCD lesion of the medial femoral condyle with a 1.5 cm fragment. Which finding would make this fragment STABLE and potentially amenable to conservative management?',
      options: [
        { key: 'A', text: 'A joint-fluid-equivalent interface rim with an outer low-signal rim' },
        { key: 'B', text: 'Multiple interface cysts or a cyst larger than about 5 mm' },
        { key: 'C', text: 'Intact overlying articular cartilage with no fluid at the fragment interface and no underlying cysts' },
        { key: 'D', text: 'Fragment displaced into the joint space' },
      ],
      correctAnswer: 'C',
      explanation:
        'Intact cartilage, an in-situ fragment, and absence of the more specific juvenile instability criteria support stability. In juvenile OCD, an isolated high-T2 interface rim or a solitary small cyst is not enough; stronger findings include a fluid-equivalent rim with an outer low-signal rim, multiple subchondral-plate breaks, multiple cysts or a cyst larger than about 5 mm, cartilage breach, and displacement. Treatment still integrates symptoms and follow-up.',
      topicIndex: 3,
    },
    {
      id: 'm10-q3',
      stem: 'On a coronal MRI of the knee, you identify a small avulsion fracture at the tip of the fibular head. What associated injury pattern should this finding immediately raise concern for?',
      options: [
        { key: 'A', text: 'Isolated LCL sprain' },
        { key: 'B', text: 'Posterolateral corner injury (arcuate sign) — evaluate for associated cruciate ligament tears' },
        { key: 'C', text: 'Proximal tibiofibular joint dislocation' },
        { key: 'D', text: 'Iliotibial band friction syndrome' },
      ],
      correctAnswer: 'B',
      explanation:
        'The classic small fibular-styloid arcuate fragment localizes to the popliteofibular/arcuate-ligament insertions and is a strong posterolateral-corner search trigger. A larger lateral fibular-head fragment may carry the FCL/biceps-femoris conjoined insertion. Map the PLC and cruciates directly, because unrecognized residual instability can compromise reconstruction.',
      topicIndex: 4,
    },
    {
      id: 'm10-q4',
      stem: 'A patient is 6 months post partial meniscectomy and presents with recurrent medial knee pain. On MRI, you see high signal within the residual meniscus on PD FS sequences. How do you differentiate a re-tear from normal post-surgical signal changes?',
      options: [
        { key: 'A', text: 'Any high signal in a post-surgical meniscus is always a re-tear' },
        { key: 'B', text: 'Post-surgical menisci never show signal abnormalities on MRI' },
        { key: 'C', text: 'The only reliable way to assess a post-surgical meniscus is with MR arthrography' },
        { key: 'D', text: 'New fluid-signal extension plus changed morphology or a displaced fragment favors re-tear; persistent intermediate signal alone may be postoperative' },
      ],
      correctAnswer: 'D',
      explanation:
        'Postoperative menisci commonly retain surface-reaching signal, so conventional preoperative criteria lose specificity. Re-tear is favored by a new or changed fluid-signal defect, morphology not explained by resection, or a displaced fragment. Direct MR arthrography can help selected equivocal cases, especially after substantial resection; it is not mandatory for every patient.',
      topicIndex: 9,
    },
    {
      id: 'm10-q5',
      stem: 'After acute nonoperative knee trauma, a lateral radiograph and sagittal MRI show a fat-fluid level in the suprapatellar recess. What is the clinical significance?',
      options: [
        { key: 'A', text: 'This is a normal finding after knee aspiration' },
        { key: 'B', text: 'It indicates a simple joint effusion from synovitis' },
        { key: 'C', text: 'It represents a ruptured Baker cyst' },
        { key: 'D', text: 'It indicates an intra-articular fracture, as fat from the bone marrow has entered the joint space through the fracture site' },
      ],
      correctAnswer: 'D',
      explanation:
        'In acute nonoperative trauma, a lipohemarthrosis strongly indicates communication between marrow and the joint, usually from an intra-articular fracture. Search the tibial plateaus, patella, femoral condyles, and osteochondral surfaces. Recent surgery, aspiration, or another intra-articular procedure is an important contextual exception.',
      topicIndex: 6,
    },
  ],

  // ─── Shoulder MRI MVP Modules ──────────────────────────────────────

  'shoulder-mri-orientation': [
    {
      id: 'shoulder-m1-q1',
      stem: 'A primary care sports medicine fellow is reviewing shoulder MRI for suspected instability and subtle labral pathology. Which protocol most often improves labral and capsuloligamentous evaluation compared with routine non-contrast MRI?',
      options: [
        { key: 'A', text: 'MR arthrography' },
        { key: 'B', text: 'T1-only non-contrast MRI' },
        { key: 'C', text: 'Ultrasound of the biceps groove only' },
        { key: 'D', text: 'Radiographs with internal rotation view only' },
      ],
      correctAnswer: 'A',
      explanation:
        'MR arthrography distends the joint and can improve visualization of subtle labral, capsular, and undersurface cuff abnormalities. Routine MRI remains excellent for many cuff, bursa, marrow, arthritis, and adhesive capsulitis questions.',
      topicIndex: 0,
    },
    {
      id: 'shoulder-m1-q2',
      stem: 'Which shoulder MRI plane is most useful for assessing rotator cuff muscle bulk and fatty infiltration across the supraspinatus and infraspinatus fossae?',
      options: [
        { key: 'A', text: 'Axial' },
        { key: 'B', text: 'Oblique sagittal' },
        { key: 'C', text: 'Coronal localizer only' },
        { key: 'D', text: 'Scout images only' },
      ],
      correctAnswer: 'B',
      explanation:
        'Oblique sagittal images are parallel to the glenoid face (i.e., perpendicular to the long axis of the supraspinatus tendon) and are the key plane for evaluating rotator cuff muscle bulk, atrophy, and fatty infiltration (Goutallier grading on the scapular-Y view).',
      topicIndex: 1,
    },
    {
      id: 'shoulder-m1-q3',
      stem: 'A fellow is reading a shoulder MRI for a possible full-thickness supraspinatus tear. The protocol includes T1-weighted, proton-density fat-suppressed (PD FS), and PD sequences. Which statement best describes how these sequences complement one another to confirm a surface-reaching fluid-filled defect and assess associated muscle/marrow changes?',
      options: [
        { key: 'A', text: 'PD FS best demonstrates the bright fluid signal tracking through a full-thickness defect into the subacromial bursa, while non-fat-suppressed PD/T1 best depict tendon and muscle anatomy and any fatty muscle atrophy.' },
        { key: 'B', text: 'PD FS alone is sufficient; the non-fat-suppressed sequences add no diagnostic value and only waste acquisition time.' },
        { key: 'C', text: 'T1 alone suffices, because joint and bursal fluid appears bright on T1 and is therefore the most conspicuous sign of a tear.' },
        { key: 'D', text: 'Gradient-echo sequences alone are preferred, because their magnetic-susceptibility effects maximize conspicuity of cuff tears and fluid.' },
      ],
      correctAnswer: 'A',
      explanation:
        'On fluid-sensitive PD FS, fluid is bright and tracks through a full-thickness cuff defect into the subacromial-subdeltoid bursa, confirming a surface-reaching tear. Non-fat-suppressed PD and T1 give higher-SNR anatomic detail and show fatty muscle atrophy (Goutallier). Fluid is not bright on T1, and GRE blooming degrades cuff/fluid assessment.',
      topicIndex: 2,
    },
    {
      id: 'shoulder-m1-q4',
      stem: 'A 58-year-old primary care sports medicine patient presents with 3 weeks of severe shoulder pain and global passive range-of-motion loss after a minor rotator cuff strain. You obtain a shoulder MRI and want to assess whether adhesive capsulitis findings support the clinical presentation. Which sequences and imaging findings are most useful for this question?',
      options: [
        { key: 'A', text: 'T1-weighted images alone, because they show anatomy best and are sufficient to rule out a tear.' },
        { key: 'B', text: 'Axial and coronal fluid-sensitive fat-suppressed sequences to visualize rotator interval edema, coracohumeral ligament thickening, and axillary pouch capsular thickening—findings that support adhesive capsulitis in the appropriate clinical setting and help guide injection or therapy planning.' },
        { key: 'C', text: 'Gradient-echo sequences are essential because adhesive capsulitis produces blooming artifact that proves the diagnosis.' },
        { key: 'D', text: 'Sagittal images are the only plane needed; axial and coronal images are redundant for assessing capsular inflammation.' },
      ],
      correctAnswer: 'B',
      explanation:
        'Adhesive capsulitis imaging findings—rotator interval edema, CHL thickening, axillary recess capsular thickening—are best seen on fluid-sensitive sequences and axial/coronal planes. MRI supports but does not replace the clinical diagnosis of global ROM loss; these imaging findings are management-relevant when they match the exam and guide injection-planning or exclusion of competing pathology.',
      topicIndex: 3,
    },
  ],

  'shoulder-search-pattern': [
    {
      id: 'shoulder-m2-q1',
      stem: 'After finding mild supraspinatus tendinosis, the reader stops and misses medial biceps subluxation from an upper-border subscapularis tear. What cognitive error does the search pattern help prevent?',
      options: [
        { key: 'A', text: 'Satisfaction of search' },
        { key: 'B', text: 'Recency bias' },
        { key: 'C', text: 'Lead-time bias' },
        { key: 'D', text: 'Verification bias' },
      ],
      correctAnswer: 'A',
      explanation:
        'Satisfaction of search occurs when finding one abnormality reduces vigilance for additional findings. The shoulder search pattern forces a complete review even after an obvious pain generator is found.',
      topicIndex: 1,
    },
    {
      id: 'shoulder-m2-q2',
      stem: 'Which impression is most useful for a primary care sports medicine clinician?',
      options: [
        { key: 'A', text: 'Abnormal shoulder MRI.' },
        { key: 'B', text: 'Signal abnormality in the cuff and labrum.' },
        { key: 'C', text: 'Acute full-thickness supraspinatus tear with mild retraction and no advanced fatty atrophy; timely surgical referral is appropriate.' },
        { key: 'D', text: 'Degenerative changes are present.' },
      ],
      correctAnswer: 'C',
      explanation:
        'Management-relevant impressions name the dominant diagnosis, severity, chronicity/reparability clues, and clinical implication. Vague signal descriptions do not help the next-step decision.',
      topicIndex: 2,
    },
    {
      id: 'shoulder-m2-q3',
      stem: 'You are implementing a systematic shoulder MRI search pattern as a primary care sports medicine fellow. Which step sequence is most logical for ensuring you capture management-changing pathology while avoiding satisfaction-of-search errors?',
      options: [
        { key: 'A', text: 'Start with the clinically suspected pathology, then skip any regions that appear normal to save time and move to the next case quickly.' },
        { key: 'B', text: 'Read the supraspinatus alone first; if it is normal, conclude the rotator cuff is intact and move to the labrum without checking the subscapularis, infraspinatus, or muscles.' },
        { key: 'C', text: 'Begin with protocol and clinical context, then evaluate bones and alignment, followed by rotator cuff tendons and muscles, labrum and instability lesions, biceps/pulley/rotator interval, capsule and bursa, and finally nerves and red flags—in that fixed order every time.' },
        { key: 'D', text: 'Use a different search order for each patient based on the clinical question, adapting the pattern to what you think is most likely to be abnormal.' },
      ],
      correctAnswer: 'C',
      explanation:
        'A fixed eight-step checklist is not a crutch—it is how experts protect themselves from predictable human misses like medial biceps subluxation, posterior labral tears, and denervation. Finishing the full pattern on every case is what keeps satisfactory findings (mild tendinosis) from hiding management-changing lesions (subscapularis tear with pulley involvement).',
      topicIndex: 0,
    },
    {
      id: 'shoulder-m2-q4',
      stem: 'A fellow dictates an impression: \'Slight supraspinatus signal change; consider tendinosis versus small tear.\' This phrasing has several problems for a primary care clinician. Which revised impression is most useful?',
      options: [
        { key: 'A', text: 'Signal abnormality present in the supraspinatus; clinical correlation needed.' },
        { key: 'B', text: 'Possible rotator cuff pathology; recommendation: advance imaging if symptoms persist.' },
        { key: 'C', text: 'Mild degenerative signal change in the cuff; significance unknown from imaging alone.' },
        { key: 'D', text: 'Low-grade supraspinatus tendinosis without discrete surface-reaching tear or retraction; no acute traumatic features; rehab-first strategy remains reasonable, though patient correlation advised.' },
      ],
      correctAnswer: 'D',
      explanation:
        'Structured impressions answer four questions: (1) What is the dominant diagnosis? (2) How severe? (3) What associated findings matter? (4) What is the management implication? Vague phrases like \'signal change\' and \'consider\' place the clinical burden back on the referring provider. Instead, name the severity, state whether a surface is involved, and guide the next visit (rehab-first vs. injection vs. referral).',
      topicIndex: 3,
    },
    {
      id: 'shoulder-m2-q5',
      stem: 'On an MR arthrogram, you identify a smooth band of contrast undercutting the superior labrum at the biceps-labral junction, following the glenoid contour and stopping precisely at the biceps anchor. The margins are sharp and regular. What is the correct interpretation?',
      options: [
        { key: 'A', text: 'Normal sublabral recess—a common variant that should not be reported as a tear and does not require surgical follow-up.' },
        { key: 'B', text: 'SLAP tear with posterior extension; recommend arthroscopy for confirmation.' },
        { key: 'C', text: 'Sublabral foramen with partial labral detachment; borderline for referral.' },
        { key: 'D', text: 'Type II SLAP with biceps anchor instability; surgical consultation advised.' },
      ],
      correctAnswer: 'A',
      explanation:
        'A sublabral recess is a normal variant with a smooth, medial cleft that parallels the glenoid contour and stops at the biceps anchor. A true SLAP tear, by contrast, extends LATERALLY into the labral substance or POSTERIOR to the anchor with irregular, jagged margins. Mistaking a recess for a tear is a classic overcall that exposes an asymptomatic patient to unnecessary imaging and referral; two-plane confirmation and arthrographic morphology are key to the differentiation.',
      topicIndex: 4,
    },
  ],

  'shoulder-rotator-cuff': [
    {
      id: 'shoulder-m3-q1',
      stem: 'A supraspinatus tendon is thickened with intermediate signal but has no fluid-filled surface defect or fiber discontinuity. What is the best description?',
      options: [
        { key: 'A', text: 'Full-thickness tear' },
        { key: 'B', text: 'Tendinosis' },
        { key: 'C', text: 'Complete tendon rupture with retraction' },
        { key: 'D', text: 'Bankart lesion' },
      ],
      correctAnswer: 'B',
      explanation:
        'Tendinosis produces tendon thickening and intermediate signal without a discrete articular-sided, bursal-sided, or full-thickness defect.',
      topicIndex: 0,
    },
    {
      id: 'shoulder-m3-q2',
      stem: 'Which additional information is most important when reporting a full-thickness rotator cuff tear?',
      options: [
        { key: 'A', text: 'Only whether bursal fluid is present' },
        { key: 'B', text: 'Only the patient age' },
        { key: 'C', text: 'Tendons involved, tear size, retraction, muscle atrophy, and fatty infiltration' },
        { key: 'D', text: 'The number of localizer images' },
      ],
      correctAnswer: 'C',
      explanation:
        'Tendons involved, AP size, retraction, and muscle quality are management-changing details that influence referral urgency and repairability.',
      topicIndex: 2,
    },
    {
      id: 'shoulder-m3-q3',
      stem: 'A partial-thickness supraspinatus tear shows fluid-bright signal reaching only the deep surface that faces the glenohumeral joint. How is this best classified?',
      options: [
        { key: 'A', text: 'Bursal-sided partial tear' },
        { key: 'B', text: 'Articular-sided (PASTA) partial tear' },
        { key: 'C', text: 'Full-thickness tear' },
        { key: 'D', text: 'Tendinosis' },
      ],
      correctAnswer: 'B',
      explanation:
        'The articular (deep) surface faces the joint; an articular-sided partial tear (PASTA) is the most common partial tear. Bursal-sided tears involve the superficial surface, and a full-thickness tear reaches both surfaces.',
      topicIndex: 1,
    },
    {
      id: 'shoulder-m3-q4',
      stem: 'On axial images the long head of biceps is displaced medially out of the bicipital groove. Which tendon should you deliberately scrutinize?',
      options: [
        { key: 'A', text: 'Infraspinatus' },
        { key: 'B', text: 'Teres minor' },
        { key: 'C', text: 'Upper-border subscapularis' },
        { key: 'D', text: 'Supraspinatus only' },
      ],
      correctAnswer: 'C',
      explanation:
        'Medial biceps displacement is a red flag for a biceps pulley / upper-border subscapularis lesion — the classic "hidden lesion." Inspect the subscapularis on axial and sagittal images.',
      topicIndex: 4,
    },
    {
      id: 'shoulder-m3-q5',
      stem: 'A 58-year-old with a full-thickness supraspinatus tear is referred for surgical evaluation. On oblique-sagittal MRI at the scapular Y-view, the supraspinatus muscle shows intramuscular fat streaks that are approximately equal to the residual muscle volume. Using Goutallier grading, what does this finding indicate, and how should it influence surgical decision-making?',
      options: [
        { key: 'A', text: 'Goutallier grade 1 (minimal streaking); this is a favorable prognostic sign that predicts excellent repair outcomes regardless of tear size.' },
        { key: 'B', text: 'Goutallier grade 3 (fat ≥ muscle); this predicts poor healing and may indicate an irreparable tear or mandate low-expectation repair counseling because advanced fatty infiltration significantly reduces repairability and functional outcome.' },
        { key: 'C', text: 'Goutallier grade 2 (fat < muscle); this is irrelevant to repair potential and does not change the surgical recommendation beyond standard repair.' },
        { key: 'D', text: 'Goutallier grade 4 (complete fatty replacement); although severe, grade 4 is still suitable for routine rotator cuff repair with the same success rates as lower grades.' },
      ],
      correctAnswer: 'B',
      explanation:
        'Goutallier grades reflect muscle quality and predict repairability: grades 0–2 generally favor repair; grades 3–4 indicate potential irreparability or poor functional outcome even if repair is technically possible. Assessment on the oblique-sagittal Y-view is essential for accurate grading and informs preoperative counseling.',
      topicIndex: 3,
    },
  ],

  'shoulder-labrum-instability': [
    {
      id: 'shoulder-m4-q1',
      stem: 'A first-time anterior shoulder dislocation MRI shows an anteroinferior labral detachment and a posterolateral humeral head impaction injury. What is the most coherent diagnosis?',
      options: [
        { key: 'A', text: 'Adhesive capsulitis' },
        { key: 'B', text: 'Bankart lesion with Hill-Sachs injury' },
        { key: 'C', text: 'Isolated AC joint arthritis' },
        { key: 'D', text: 'Quadrilateral space syndrome' },
      ],
      correctAnswer: 'B',
      explanation:
        'Anterior instability commonly produces an anteroinferior labral Bankart lesion and a posterolateral humeral head Hill-Sachs impaction injury.',
      topicIndex: 2,
    },
    {
      id: 'shoulder-m4-q2',
      stem: 'A spinoglenoid notch paralabral cyst is identified. What associated finding should be actively checked?',
      options: [
        { key: 'A', text: 'Infraspinatus denervation edema or atrophy' },
        { key: 'B', text: 'Patellar tendon rupture' },
        { key: 'C', text: 'Medial meniscal extrusion' },
        { key: 'D', text: 'Achilles tendinosis' },
      ],
      correctAnswer: 'A',
      explanation:
        'A spinoglenoid notch cyst can compress the suprascapular nerve branch to infraspinatus, causing denervation edema acutely or fatty atrophy chronically.',
      topicIndex: 3,
    },
    {
      id: 'shoulder-m4-q3',
      stem: 'On an MR arthrogram of the superior labrum, which feature favors a true SLAP tear over a normal sublabral recess?',
      options: [
        { key: 'A', text: 'A smooth medial cleft that parallels the glenoid and stops at the biceps anchor' },
        { key: 'B', text: 'Contrast extending laterally into the labral substance or posterior to the biceps anchor with irregular margins' },
        { key: 'C', text: 'A cleft located at the 12 o’clock position' },
        { key: 'D', text: 'A cleft that measures less than 2 mm' },
      ],
      correctAnswer: 'B',
      explanation:
        'A sublabral recess is smooth, medial, parallels the glenoid, and stops at the biceps anchor. Lateral extension into the labrum or posterior to the anchor with irregular margins favors a SLAP tear. A 12 o’clock location is common to both and does not discriminate.',
      topicIndex: 1,
    },
    {
      id: 'shoulder-m4-q4',
      stem: 'In recurrent anterior instability, which finding most increases the importance of surgical referral and may warrant CT for precise quantification?',
      options: [
        { key: 'A', text: 'A small soft-tissue Bankart with no osseous injury' },
        { key: 'B', text: 'Significant glenoid bone loss or an engaging / off-track Hill-Sachs lesion' },
        { key: 'C', text: 'Mild subacromial-subdeltoid bursitis' },
        { key: 'D', text: 'A normal sublabral recess' },
      ],
      correctAnswer: 'B',
      explanation:
        'Significant glenoid bone loss (approaching ~20%) or an engaging / off-track Hill-Sachs shifts management toward a bony procedure (e.g., Latarjet) and is best quantified by CT, often 3D. An isolated soft-tissue Bankart does not carry the same implication.',
      topicIndex: 4,
    },
    {
      id: 'shoulder-m4-q5',
      stem: 'A 28-year-old overhead athlete with posterior shoulder pain undergoes shoulder MRI with non-contrast and MR arthrography. Axial images show a hypoattenuating cleft at the posterior labrum with irregular margins and edema in the adjacent soft tissue. The referring clinician\'s note only states "labral tear." Which additional information is essential to guide the next diagnostic and management step?',
      options: [
        { key: 'A', text: 'Report only the tear size in millimeters, because that is the only measurement that influences surgical decision-making.' },
        { key: 'B', text: 'Describe the signal intensity of the tear relative to fluid, since signal alone is sufficient to communicate the clinical urgency.' },
        { key: 'C', text: 'Specify the quadrant location (e.g., posterior or 6-9 o\'clock position) and pattern (tear vs. degenerative fraying vs. reverse Bankart), as posterior labral injuries require different imaging follow-up and surgical considerations than anterior or superior patterns.' },
        { key: 'D', text: 'Simply confirm that a labral abnormality is present and defer all further characterization to the orthopedic surgeon, as MRI interpretation should not include quadrant or pattern details.' },
      ],
      correctAnswer: 'C',
      explanation:
        'Labral pathology must be localized by quadrant and classified by pattern (traumatic tear, degenerative fraying, instability variant, or associated with cyst/denervation) because the clinical significance, likelihood of symptoms, and surgical approach differ between anterior (Bankart), superior (SLAP), and posterior labral injuries. \'Labral tear\' alone does not guide management.',
      topicIndex: 0,
    },
  ],

  'shoulder-biceps-interval-ac': [
    {
      id: 'shoulder-m5-q1',
      stem: 'Medial subluxation of the long head biceps tendon from the groove should trigger a deliberate search for which associated lesion?',
      options: [
        { key: 'A', text: 'Upper-border subscapularis tear or biceps pulley lesion' },
        { key: 'B', text: 'Posterior horn medial meniscus tear' },
        { key: 'C', text: 'Distal radius fracture' },
        { key: 'D', text: 'Achilles rupture' },
      ],
      correctAnswer: 'A',
      explanation:
        'The biceps pulley and upper subscapularis stabilize the long head biceps. Medial biceps subluxation is a red flag for pulley/subscapularis pathology.',
      topicIndex: 1,
    },
    {
      id: 'shoulder-m5-q2',
      stem: 'MRI shows rotator interval edema, coracohumeral ligament thickening, and axillary capsular thickening in a patient with global passive range-of-motion loss. What clinical diagnosis do these findings support?',
      options: [
        { key: 'A', text: 'Adhesive capsulitis' },
        { key: 'B', text: 'Anterior shoulder dislocation' },
        { key: 'C', text: 'Massive acute pectoralis tear' },
        { key: 'D', text: 'Normal variant with no clinical relevance' },
      ],
      correctAnswer: 'A',
      explanation:
        'Rotator interval edema, coracohumeral ligament thickening, and axillary capsular thickening support adhesive capsulitis when the clinical exam shows global passive range-of-motion loss.',
      topicIndex: 2,
    },
    {
      id: 'shoulder-m5-q3',
      stem: 'A 52-year-old recreational tennis player presents with anterior shoulder pain and clicking in the bicipital groove. MRI shows signal abnormality and mild thickening of the long head biceps tendon in the intra-articular segment with surrounding synovial fluid. The biceps anchor is intact and the tendon remains centered in the groove. No rotator cuff tear is identified. Which term best describes this finding, and what management approach is most appropriate?',
      options: [
        { key: 'A', text: 'Biceps rupture; this requires urgent surgical referral and tenodesis to restore elbow flexion and supination strength.' },
        { key: 'B', text: 'SLAP tear; this requires MR arthrography confirmation and typically surgical referral in active patients, as an anchor tear would show contrast undercutting the labral attachment.' },
        { key: 'C', text: 'Biceps pulley failure; this would present with medial biceps subluxation or dislocation out of the groove, which is not seen here with the tendon centered.' },
        { key: 'D', text: 'Biceps tenosynovitis; this is a synovial inflammatory response around the tendon that is typically managed conservatively with NSAIDs, activity modification, and physical therapy focused on scapular stability and rotator cuff strengthening.' },
      ],
      correctAnswer: 'D',
      explanation:
        'Biceps tenosynovitis manifests as fluid surrounding an intact, centered tendon without surface-reaching defects or rupture. The distinction between tendinosis (tendon thickening and signal change) versus tenosynovitis (sheath fluid) versus tear is critical—tenosynovitis and low-grade tendinosis are often rehab-first findings, whereas partial or complete rupture and pulley failure warrant referral consideration.',
      topicIndex: 0,
    },
    {
      id: 'shoulder-m5-q4',
      stem: 'A 58-year-old with superior shoulder pain localized to the AC joint on cross-body adduction testing undergoes shoulder MRI. Coronal and axial images show joint-space narrowing, hypertrophic osteophytes, and marrow edema in both the distal clavicle and the lateral acromial process. There is no AC joint capsular hypertrophy, and the adjacent supraspinatus tendon is intact. How should you interpret these findings in your report?',
      options: [
        { key: 'A', text: 'AC joint osteoarthritis with acute-on-chronic change; the marrow edema in both articulating surfaces indicates recent stress or microtrauma. This finding is clinically relevant and should be matched to the patient\'s focal AC tenderness and cross-body adduction pain before concluding it is the pain generator, and inferior osteophytes should be assessed for contact with the cuff or bursa.' },
        { key: 'B', text: 'Incidental AC joint changes of no clinical significance; AC osteophytes are common incidental findings, but the presence of marrow edema indicates acute inflammation that may be symptomatic and warrant correlation with clinical exam.' },
        { key: 'C', text: 'AC joint septic arthritis requiring urgent intervention; while aggressive edema and effusion can suggest infection, uncomplicated osteoarthritis with reactive marrow edema is far more common in this age group without systemic signs.' },
        { key: 'D', text: 'Supraspinatus impingement from AC osteophytes requiring surgical distal clavicle resection; inferior AC osteophytes can contact the cuff, but this finding alone does not mandate surgery—correlation with symptoms, exam, and conservative treatment response guides referral.' },
      ],
      correctAnswer: 'A',
      explanation:
        'AC joint osteoarthritis is common, but the clinically relevant finding is often marrow edema or capsular hypertrophy, not the mere presence of osteophytes. Match MRI findings to focal AC tenderness and cross-body adduction pain; imaging alone should not drive surgery. Always assess whether inferior osteophytes contact the rotator cuff or bursa, as this influences the surgical discussion. The distinction between asymptomatic degenerative changes and clinically important AC pathology rests on imaging sign (edema, capsular thickening) plus clinical correlation.',
      topicIndex: 3,
    },
  ],

  'shoulder-arthritis-bursa-dontmiss': [
    {
      id: 'shoulder-m6-q1',
      stem: 'A massive chronic supraspinatus/infraspinatus tear has retraction to the glenoid, advanced fatty infiltration, and superior humeral migration. What is the best interpretation?',
      options: [
        { key: 'A', text: 'Low-grade tendinosis suitable for routine reassurance only' },
        { key: 'B', text: 'Cuff tear arthropathy pattern with limited primary repairability' },
        { key: 'C', text: 'Normal age-related finding that should not be reported' },
        { key: 'D', text: 'Isolated SLAP tear' },
      ],
      correctAnswer: 'B',
      explanation:
        'Massive chronic cuff tear with advanced fatty atrophy and superior migration suggests cuff tear arthropathy and changes referral expectations away from simple primary repair.',
      topicIndex: 0,
    },
    {
      id: 'shoulder-m6-q2',
      stem: 'A paralabral cyst with infraspinatus denervation edema is seen on shoulder MRI. Why is this management-relevant?',
      options: [
        { key: 'A', text: 'It may indicate suprascapular nerve compression and should not be dismissed as an incidental small labral tear.' },
        { key: 'B', text: 'It proves the ACL is torn.' },
        { key: 'C', text: 'It means all rotator cuff tendons are normal.' },
        { key: 'D', text: 'It is always a contraindication to physical therapy.' },
      ],
      correctAnswer: 'A',
      explanation:
        'Paralabral cysts can compress the suprascapular nerve, producing denervation changes. This is a referral-relevant finding even when the labral tear itself appears small.',
      topicIndex: 2,
    },
    {
      id: 'shoulder-m6-q3',
      stem: 'A 52-year-old with chronic shoulder pain undergoes MRI. Oblique coronal images show a fluid-distended subacromial-subdeltoid bursa with multiple small intra-bursal filling defects. The supraspinatus and infraspinatus tendons are intact without full-thickness tear. Which additional finding should prompt you to reconsider the diagnosis beyond simple mechanical bursitis?',
      options: [
        { key: 'A', text: 'Mild AC joint osteophytes contacting the bursa, which explains reactive bursitis from subacromial impingement.' },
        { key: 'B', text: 'Synovitis with rice bodies on the bursal fluid-sensitive images, raising suspicion for an inflammatory or rheumatologic process rather than a structural cuff tear or impingement.' },
        { key: 'C', text: 'Low-signal calcific deposit within the supraspinatus tendon, indicating acute calcific tendinitis with secondary reactive bursitis.' },
        { key: 'D', text: 'Small bursal fluid collection measuring <2 mL, which is a normal variant not requiring clinical follow-up.' },
      ],
      correctAnswer: 'B',
      explanation:
        'Bursitis is a finding, not always a diagnosis. Always pair bursal fluid assessment with cuff integrity, synovial character (rice bodies, enhancement), and marrow/capsular changes to direct the differential toward mechanical, inflammatory, or infectious etiologies.',
      topicIndex: 1,
    },
    {
      id: 'shoulder-m6-q4',
      stem: 'A 68-year-old male presents with acute shoulder pain after a minor fall. MRI shows diffuse humeral head marrow edema on PD FS images with a subtle subchondral low-signal band on T1 at the weight-bearing surface of the humeral head. The overlying articular cartilage appears intact. There is no history of prior shoulder trauma or steroid use. What is the most likely diagnosis?',
      options: [
        { key: 'A', text: 'Acute traumatic full-thickness rotator cuff tear with superior humeral migration, which would show a tendon defect with retraction.' },
        { key: 'B', text: 'Avascular necrosis of the humeral head, which typically shows a larger geographic zone of necrosis and is associated with corticosteroid use or sickle cell disease.' },
        { key: 'C', text: 'Subchondral insufficiency fracture (analogous to SIFK in the knee), occurring in osteoporotic bone under normal loading without a known prior major trauma.' },
        { key: 'D', text: 'Simple bone contusion from the fall, which would show diffuse marrow edema without a discrete low-T1 subchondral line.' },
      ],
      correctAnswer: 'C',
      explanation:
        'A discrete low-T1 subchondral line (best seen on T1) with surrounding marrow edema in the appropriate clinical context (older patient, acute onset, no major trauma) should raise suspicion for insufficiency fracture. This changes weight-bearing and surgical considerations and may not fit the typical sports-medicine pain pattern.',
      topicIndex: 3,
    },
    {
      id: 'shoulder-m6-q5',
      stem: 'You are formulating the MRI impression for a primary care sports medicine clinician. Which statement best reflects how to structure a high-yield shoulder MRI impression for maximum clinical utility?',
      options: [
        { key: 'A', text: 'List all anatomic findings in order of location (AC joint, bursa, labrum, cuff) regardless of clinical relevance, to ensure comprehensive documentation.' },
        { key: 'B', text: 'Focus exclusively on the most obvious finding (e.g., \'mild AC joint arthritis\') and defer mention of coexisting pathology to avoid cluttering the impression.' },
        { key: 'C', text: 'Avoid any reference to severity or urgency unless the finding is clearly life-threatening, so as not to over-triage routine findings.' },
        { key: 'D', text: 'Lead with the finding most likely to change management (e.g., \'Spinoglenoid notch paralabral cyst with infraspinatus denervation edema\') and include severity language, associated findings, and the next-step hierarchy so the clinician can prioritize referral and treatment decisions.' },
      ],
      correctAnswer: 'D',
      explanation:
        'A useful shoulder MRI impression answers: (1) What is the dominant diagnosis? (2) How severe is it? (3) What associated findings matter? (4) What should not be missed? Lead with the finding that changes management, not the most obvious one—the second finding often matters more than the first.',
      topicIndex: 4,
    },
    {
      id: 'shoulder-m6-q6',
      stem: "A 28-year-old competitive powerlifter feels a sudden 'pop' at the bottom of a heavy bench press, with the arm extended and abducted. He develops medial chest bruising and a soft, dropped-out anterior axillary fold. MRI shows a hematoma with a medially retracted tendon and no tissue at the lateral lip of the intertubercular groove. Which finding most directly indicates the need for surgical referral?",
      options: [
        { key: 'A', text: "Feathery perifascial edema within the pectoralis major belly with intact architecture" },
        { key: 'B', text: "Complete avulsion of the tendon from its humeral insertion with an empty bicipital groove" },
        { key: 'C', text: "Fluid in the subacromial-subdeltoid bursa communicating with the joint" },
        { key: 'D', text: "Intermediate signal and thickening of the pectoralis tendon without a discrete gap" },
      ],
      correctAnswer: 'B',
      explanation: "The mechanism (eccentric load, arm extended/abducted at the bottom of a bench press), medial ecchymosis, and axillary-fold defect are classic for pectoralis major rupture, and the empty bicipital groove with a retracted tendon localizes a complete avulsion at the humeral insertion — the surgically relevant lesion that warrants repair in an active patient. Feathery intramuscular edema (A) is a grade 1 strain managed with rehab, and intermediate tendon signal without a gap (D) is tendinosis, not an avulsion; bursal fluid (C) is a cuff/bursa finding unrelated to the pectoralis.",
      topicIndex: 5,
    },
    {
      id: 'shoulder-m6-q7',
      stem: "A 24-year-old wakeboarder is jerked forward when the tow rope catches with the arm flexed and abducted, and reports posterior axillary pain. MRI shows feathery edema PLUS a discrete fluid cleft with partial fiber disruption at the myotendinous junction of the latissimus dorsi/teres major, with most fibers intact and no retraction. How is this best characterized and managed?",
      options: [
        { key: 'A', text: "Grade 1 overstretch injury with no fiber disruption, managed with rest" },
        { key: 'B', text: "Grade 2 partial myotendinous strain, generally managed conservatively" },
        { key: 'C', text: "Deltoid denervation from axillary nerve injury" },
        { key: 'D', text: "Pectoralis major humeral avulsion with an empty bicipital groove" },
      ],
      correctAnswer: 'B',
      explanation: "Partial fiber disruption with a discrete fluid cleft but preserved continuity and no retraction is a grade 2 partial strain, and the myotendinous junction is the expected site; latissimus dorsi/teres major strains in water-skiers/wakeboarders and throwers are typically treated conservatively. A grade 1 injury (A) shows only perifascial feathery edema with intact architecture and no fiber disruption or fluid cleft, deltoid denervation (C) produces diffuse muscle edema in a nerve territory rather than an MTJ cleft, and a pectoralis avulsion (D) involves a different muscle and the bicipital groove.",
      topicIndex: 5,
    },
  ],

  // ─── Hip course module quizzes (keyed by hip-* module IDs) ───
  "hip-mri-basics": [
    {
      id: "hip-mri-basics-q1",
      stem: "A 19-year-old soccer player has deep groin pain and a positive FADIR impingement test. The ordering note asks: \"Cam lesion? Measure alpha angle.\" The tech is about to acquire a standard large-FOV pelvis screen with true-axial images only.",
      options: [{ key: "A", text: "Proceed — a true-axial large-FOV screen reliably measures the alpha angle" }, { key: "B", text: "Switch to a small-FOV dedicated hip protocol and add oblique-axial images along the femoral neck" }, { key: "C", text: "Add intravenous contrast to the screen to see the cam lesion" }, { key: "D", text: "Cancel imaging; cam morphology cannot be measured on MRI" }],
      correctAnswer: "B",
      explanation: "Cam morphology and the alpha angle are assessed at the anterosuperior head-neck junction, which is laid flat only on oblique-axial (or radial) planes off a high-resolution dedicated hip protocol. A true-axial slice cuts the neck obliquely and mismeasures the angle (A wrong). IV contrast does not define cam bone morphology (C). MRI measures the alpha angle well when the correct plane and FOV are used (D).",
      topicIndex: 1,
    },
    {
      id: "hip-mri-basics-q2",
      stem: "A 55-year-old with bilateral buttock and groin ache after marathon training gets a pelvis MRI. On the chemical fat-sat coronal, fat suppression looks patchy and failed at the lateral edges of the field, obscuring the sacrum and proximal femurs.",
      options: [{ key: "A", text: "The chemical fat-sat is adequate; read it as is" }, { key: "B", text: "Repeat with a small-FOV dedicated single-hip protocol" }, { key: "C", text: "Rely on the STIR sequence, which suppresses fat uniformly across the large FOV" }, { key: "D", text: "Add MR arthrography to evaluate the marrow" }],
      correctAnswer: "C",
      explanation: "Chemical (spectral) fat-sat fails at the edges of a large FOV due to B0 inhomogeneity; STIR provides uniform fat suppression across a wide field and is the edema screen of choice here, ideal for a bilateral stress-fracture question. Reading failed fat-sat risks missing or mimicking marrow edema (A). A single-hip protocol abandons the bilateral question (B). Arthrography is intra-articular and adds nothing to a marrow evaluation (D).",
      topicIndex: 2,
    },
    {
      id: "hip-mri-basics-q3",
      stem: "A 16-year-old gymnast with FAI signs has a 3T non-contrast hip MRI suggesting a possible anterosuperior labral detachment, but the surgeon wants confirmation before offering arthroscopy. Marrow and tendons are normal.",
      options: [{ key: "A", text: "Order an MR arthrogram to better outline the labrum and confirm a surgically relevant tear" }, { key: "B", text: "Order a STIR-only pelvis screen to characterize the marrow" }, { key: "C", text: "No further imaging is useful; labral tears cannot be confirmed by MRI" }, { key: "D", text: "Order a large-FOV pelvis screen to improve labral resolution" }],
      correctAnswer: "A",
      explanation: "MR arthrography distends the joint and lets contrast track into a labral detachment, adding management-relevant detail when a positive finding would push toward arthroscopy. A STIR marrow screen does not address the labrum, which is already normal here (B). MRA reliably demonstrates labral tears, so further imaging is in fact useful (C). A large-FOV screen has lower spatial resolution and would blur the labrum further (D).",
      topicIndex: 4,
    },
  ],
  "hip-anatomy": [
    {
      id: "hip-anatomy-q1",
      stem: "A 24-year-old soccer player has chronic groin pain. MR arthrogram shows a smooth, corticated ossicle along the anterosuperior acetabular rim with no marrow edema and intact adjacent cartilage. The labrum is normal. What is the best management implication?",
      options: [{ key: "A", text: "Treat as a normal os acetabuli variant; reassure and correlate clinically rather than refer for acute fracture fixation" }, { key: "B", text: "Refer urgently for open reduction and internal fixation of an acute rim fracture" }, { key: "C", text: "Start a marrow-replacement tumor protocol for an osseous lesion" }, { key: "D", text: "Aspirate an associated paralabral cyst" }],
      correctAnswer: "A",
      explanation: "A smooth, corticated ossicle at the anterosuperior rim without marrow edema is an os acetabuli, a benign secondary-ossification variant — reassure and correlate clinically. An acute rim fracture (B) has sharp, non-corticated margins with marrow edema, absent here. A normal corticated ossicle is not a marrow-replacing tumor (C), and there is no cyst to aspirate (D).",
      topicIndex: 5,
    },
    {
      id: "hip-anatomy-q2",
      stem: "A 62-year-old woman has lateral hip pain and a Trendelenburg gait. Coronal fluid-sensitive MRI shows distended peritrochanteric bursal fluid AND a full-thickness gap with tendon retraction at the gluteus medius footprint on the greater trochanter. What is the most appropriate management?",
      options: [{ key: "A", text: "Diagnose isolated trochanteric bursitis and offer only a bursal corticosteroid injection" }, { key: "B", text: "Refer for surgical evaluation of a full-thickness retracted abductor tendon tear" }, { key: "C", text: "Reassure that bursal fluid is always a normal physiologic finding" }, { key: "D", text: "Begin anticoagulation for suspected venous thrombosis" }],
      correctAnswer: "B",
      explanation: "A full-thickness, retracted gluteus medius tear is the hip's rotator-cuff failure and warrants surgical referral; the bursal fluid is the flag for the underlying tendon tear, not an isolated bursitis. Treating it as isolated bursitis (A) misses the surgical lesion. Distended bursal fluid is not always physiologic (C), and the findings are musculotendinous, not vascular (D).",
      topicIndex: 2,
    },
    {
      id: "hip-anatomy-q3",
      stem: "A 27-year-old hockey player has insidious lower-abdominal and proximal-adductor groin pain that worsens with cutting and resisted sit-ups. Coronal fluid-sensitive MRI shows fluid tracking inferolaterally from the pubic symphysis at the rectus abdominis–adductor aponeurosis (secondary cleft sign). Which structure and referral pathway is implicated?",
      options: [{ key: "A", text: "Ligamentum teres tear; refer for hip arthroscopy" }, { key: "B", text: "Tension-side femoral neck stress fracture; make non-weight-bearing emergently" }, { key: "C", text: "Rectus abdominis–adductor aponeurosis (athletic pubalgia); refer to a core-muscle-injury specialist" }, { key: "D", text: "Iliopsoas bursitis; aspirate the iliopsoas bursa" }],
      correctAnswer: "C",
      explanation: "The secondary cleft sign at the rectus abdominis–adductor aponeurosis localizes athletic pubalgia (core muscle injury) at the symphysis — refer to a core-muscle-injury/sports-hernia specialist. The ligamentum teres (A) is intra-articular at the fovea, not the symphysis. There is no femoral-neck fracture line (B). The iliopsoas bursa (D) is anteromedial to the joint, not at the symphyseal aponeurosis.",
      topicIndex: 3,
    },
  ],
  "hip-search-pattern": [
    {
      id: "hip-search-pattern-q1",
      stem: "A 24-year-old runner has an MRI for groin pain. You immediately spot an anterosuperior labral tear and a small paralabral cyst, and begin dictating. Before you finalize, which action best protects against satisfaction of search on this study?",
      options: [{ key: "A", text: "Re-measure the alpha angle on a third radial image to confirm the cam" }, { key: "B", text: "Complete the fixed search order, including a dedicated bone/marrow and pelvic-ring pass" }, { key: "C", text: "Add T1 post-contrast sequences to better characterize the paralabral cyst" }, { key: "D", text: "Recommend a follow-up arthrogram to grade the labral tear" }],
      correctAnswer: "B",
      explanation: "Satisfaction of search is defeated by completing the fixed order regardless of the first finding — a deliberate marrow/bone pass catches a tension-side neck stress fracture or confluent low-T1 marrow that the labral tear distracted you from. A is redundant characterization of an already-seen finding; C and D further work up the lesion you already found, which is exactly the trap — they do nothing to surface a silent second lesion.",
      topicIndex: 4,
    },
    {
      id: "hip-search-pattern-q2",
      stem: "A 19-year-old distance runner has 3 weeks of activity-related groin pain and normal radiographs. MRI shows marrow edema in the femoral neck with a thin hypointense fracture line abutting the superolateral cortex. What is the appropriate disposition?",
      options: [{ key: "A", text: "Begin a progressive running rehab program with follow-up in 6 weeks" }, { key: "B", text: "Image-guided corticosteroid injection of the hip joint" }, { key: "C", text: "Make non-weight-bearing and refer urgently for surgical evaluation" }, { key: "D", text: "Reassure that this is transient bone marrow edema and continue training" }],
      correctAnswer: "C",
      explanation: "A fracture line touching the superolateral (tension) cortex is a tension-side femoral-neck stress fracture — a surgical emergency at high risk of completion and displacement; it requires non-weight-bearing and urgent surgical referral. A and D would be reasonable only for a compression-side reaction or transient BME with NO fracture line; the line on the tension side is the hinge. B does not address an unstable fracture and could worsen it.",
      topicIndex: 5,
    },
    {
      id: "hip-search-pattern-q3",
      stem: "A 31-year-old hockey player has anterior groin pain. The hip joint, labrum, and cartilage are unremarkable. Where should you focus next, given the pain location, before calling the study negative?",
      options: [{ key: "A", text: "The rectus-adductor aponeurosis and pubic symphysis for athletic pubalgia" }, { key: "B", text: "The gluteus medius and minimus footprints on the greater trochanter" }, { key: "C", text: "The proximal hamstring origin at the ischial tuberosity" }, { key: "D", text: "The sciatic nerve in the deep gluteal space" }],
      correctAnswer: "A",
      explanation: "Groin pain has both an intra-articular and an extra-articular answer; with a clean joint, the extra-articular source — athletic pubalgia at the rectus-adductor aponeurosis (look for the secondary cleft sign) and the symphysis — must be read before calling the study negative. B is for lateral pain (abductors/GTPS); C and D are for posterior/buttock pain — wrong region for this anterior/groin presentation.",
      topicIndex: 3,
    },
  ],
  "hip-bones-stress": [
    {
      id: "hip-bones-stress-q1",
      stem: "A 22-year-old female cross-country runner has 4 weeks of groin pain and a normal radiograph. Coronal STIR shows neck marrow edema, and T1 reveals a discrete low-signal fracture line along the SUPEROLATERAL femoral neck.",
      options: [{ key: "A", text: "Reassure and allow return to running as tolerated" }, { key: "B", text: "Order a follow-up MRI in 6 weeks to reassess" }, { key: "C", text: "Make her non-weight-bearing and arrange urgent surgical fixation" }, { key: "D", text: "Begin a graded swimming program and recheck radiographs monthly" }],
      correctAnswer: "C",
      explanation: "A superolateral (tension-side) femoral-neck fracture line is at high risk of completion and displacement with resulting AVN; it is a surgical emergency requiring non-weight-bearing and same-day orthopedic referral for percutaneous fixation. Conservative paths (A, B, D) are appropriate only for infero-medial compression-side injuries, not a tension-side line, so they are unsafe here.",
      topicIndex: 0,
    },
    {
      id: "hip-bones-stress-q2",
      stem: "A 41-year-old man on chronic corticosteroids has hip pain. MRI shows a geographic antero-superior subchondral lesion with an outer low-signal rim and an inner high-signal line on T2, but the articular surface is intact and contour is preserved.",
      options: [{ key: "A", text: "ARCO III — refer for arthroplasty" }, { key: "B", text: "Pre-collapse AVN (ARCO I–II) — joint-preserving options such as core decompression" }, { key: "C", text: "Transient osteoporosis — protected weight-bearing only" }, { key: "D", text: "Subchondral insufficiency fracture — treat osteoporosis" }],
      correctAnswer: "B",
      explanation: "The double-line sign with an intact subchondral plate and preserved contour is pre-collapse AVN — the joint-preserving window — where the femoral head can still be salvaged with treatment like core decompression. On MRI alone this is ARCO I (radiograph normal); ARCO II requires radiographic sclerosis/cysts, and both stages are pre-collapse. ARCO III (A) requires a subchondral fracture/crescent with collapse, which is absent. BMES (C) lacks a double-line and necrotic segment, and SIFK (D) shows a subchondral fracture line, not a serpiginous double-line interface.",
      topicIndex: 1,
    },
    {
      id: "hip-bones-stress-q3",
      stem: "A 58-year-old woman, no major trauma, presents with limping hip pain. Pelvic MRI shows a displaced ossific fragment at the lesser trochanter, and the visualized proximal femur and pelvis contain patchy confluent low-T1 marrow that is darker than the adjacent muscle and intervertebral disc.",
      options: [{ key: "A", text: "Treat as a benign iliopsoas avulsion with rest and physical therapy" }, { key: "B", text: "Diagnose transient osteoporosis and start protected weight-bearing" }, { key: "C", text: "Attribute findings to age-related red-marrow reconversion and reassure" }, { key: "D", text: "Treat as a pathologic fracture and work up for metastatic disease" }],
      correctAnswer: "D",
      explanation: "A lesser-trochanter avulsion in an adult without significant trauma is a classic pathologic-fracture red flag, and confluent low-T1 marrow darker than muscle/disc indicates tumor infiltration rather than normal hematopoietic marrow. This mandates a metastatic/malignancy work-up. A and C dangerously dismiss it; B describes a diffuse-edema syndrome, not an avulsion with marrow replacement.",
      topicIndex: 4,
    },
  ],
  "hip-fai-labrum": [
    {
      id: "hip-fai-labrum-q1",
      stem: "A 24-year-old soccer player has anterior hip pain reproduced by flexion-adduction-internal rotation. On standard axial MR images the alpha angle measures 48°. You suspect cam FAI clinically. What is the most appropriate next interpretive step?",
      options: [{ key: "A", text: "Report no cam morphology, since 48° is below threshold" }, { key: "B", text: "Remeasure the alpha angle on oblique-axial/radial images angled along the femoral neck" }, { key: "C", text: "Diagnose pincer FAI instead based on the symptoms" }, { key: "D", text: "Recommend hip arthroplasty given the positive impingement test" }],
      correctAnswer: "B",
      explanation: "The cam bump peaks anterosuperiorly (1–2 o'clock), which a straight axial under-samples and can falsely normalize. Oblique-axial/radial reformats angled along the neck capture the peak; the pathologic threshold is >55°. A is wrong because a single normal axial value does not exclude cam. C is unsupported — the symptoms fit cam, and pincer requires bony over-coverage findings. D skips conservative management and is far premature.",
      topicIndex: 0,
    },
    {
      id: "hip-fai-labrum-q2",
      stem: "On a true AP pelvis radiograph the anterior acetabular rim line crosses the posterior rim line cranially, the acetabular floor touches the ilioischial line, and the lateral center-edge angle is 43°. On MRI the femoral head-neck junction is normally concave. Which diagnosis best fits?",
      options: [{ key: "A", text: "Cam-type FAI" }, { key: "B", text: "Acetabular dysplasia" }, { key: "C", text: "Pincer-type FAI" }, { key: "D", text: "Normal hip morphology" }],
      correctAnswer: "C",
      explanation: "Crossover sign (cranial retroversion/anterior over-coverage), coxa profunda (floor at the ilioischial line), and LCEA >40° are all over-coverage findings — pincer FAI. A is excluded because the head-neck junction is concave (no cam bump). B is wrong: dysplasia is under-coverage with LCEA <20–25°, the opposite. D is excluded by three abnormal over-coverage signs. Pincer is corrected by rim trimming with labral refixation.",
      topicIndex: 1,
    },
    {
      id: "hip-fai-labrum-q3",
      stem: "MR arthrogram in a 30-year-old runner shows contrast extending into the substance of the anterosuperior labrum with a frayed, blunted margin, plus an adjacent T2-bright lobulated fluid collection along the rim. How should you interpret these findings?",
      options: [{ key: "A", text: "Normal sublabral recess with an incidental bursa" }, { key: "B", text: "Anterosuperior labral tear, with the paralabral cyst confirming a full-thickness tear" }, { key: "C", text: "Contrecoup chondral injury of pincer FAI" }, { key: "D", text: "Os acetabuli with reactive marrow edema" }],
      correctAnswer: "B",
      explanation: "Contrast entering the labral substance (not just tracking smoothly along the cartilage base) with irregular margins indicates a tear, and the anterosuperior location is the classic cam zone. The lobulated T2-bright paralabral cyst is a specific secondary sign of a full-thickness tear acting as a one-way valve. A is wrong because a recess is smooth and does not enter the labral body. C describes posteroinferior cartilage loss, not a labral tear. D is a corticated bony fragment, not a fluid collection.",
      topicIndex: 2,
    },
  ],
  "hip-cartilage-oa": [
    {
      id: "hip-cartilage-oa-q1",
      stem: "A 24-year-old soccer player has cam morphology and anterior groin pain. Standard MRI shows anterosuperior acetabular cartilage of normal thickness but with a thin line of fluid signal beneath it at the chondrolabral junction. What is the most likely lesion?",
      options: [{ key: "A", text: "Chondral delamination from cam shear" }, { key: "B", text: "Diffuse early osteoarthritis" }, { key: "C", text: "Aggressive subchondral tumor" }, { key: "D", text: "Normal cartilage, no lesion" }],
      correctAnswer: "A",
      explanation: "A thin fluid signal undercutting normal-thickness anterosuperior cartilage at the chondrolabral junction is the classic cam-shear delamination (the \"carpet lifting off the floor\") and is arthroscopically treatable alongside cam osteoplasty. Early OA (B) is diffuse and circumferential, not a focal undercut flap. A tumor (C) would show marrow-replacing confluent low-T1 signal darker than muscle/disc, not a surface cleavage line. Calling it normal (D) misses an unstable flap that fails after isolated cam correction.",
      topicIndex: 1,
    },
    {
      id: "hip-cartilage-oa-q2",
      stem: "A 38-year-old runner has hip pain. MRI shows a well-defined, rounded, T2-bright/T1-dark subchondral lesion located right at an anterosuperior cartilage defect, with no soft-tissue mass. How should you characterize and manage this?",
      options: [{ key: "A", text: "Aggressive lytic lesion requiring biopsy" }, { key: "B", text: "Benign geode confirming mechanical overload" }, { key: "C", text: "Infection requiring aspiration" }, { key: "D", text: "Insufficiency fracture needing protected weightbearing" }],
      correctAnswer: "B",
      explanation: "A small, well-corticated subchondral cyst at the cartilage defect/load point is a degenerative geode that confirms a mechanical, treatable problem. The red flag for an aggressive lesion is confluent marrow signal darker than muscle/disc and away from the joint surface (A), which is absent here. There is no rim-enhancing collection or surrounding marrow edema to suggest infection (C), and a geode is a fluid-filled cyst, not a subchondral fracture line (D).",
      topicIndex: 2,
    },
    {
      id: "hip-cartilage-oa-q3",
      stem: "A 52-year-old has groin pain and a non-weightbearing MRI suggesting preserved joint space but diffuse cartilage thinning of both acetabular and femoral surfaces with marginal osteophytes. A surgeon is considering hip arthroscopy. What is the best next step to guide the procedure decision?",
      options: [{ key: "A", text: "Proceed directly to arthroscopy based on the MRI" }, { key: "B", text: "Order traction MR arthrography to find a focal flap" }, { key: "C", text: "Obtain a weightbearing radiograph to confirm joint-space narrowing" }, { key: "D", text: "Repeat the MRI with contrast in 6 weeks" }],
      correctAnswer: "C",
      explanation: "MRI is non-weightbearing and overcalls preserved joint space, so diffuse loss with osteophytes should be confirmed on a weightbearing radiograph; established narrowing (Tönnis grade ≥2) shifts the patient toward arthroplasty and predicts arthroscopy failure, so A is wrong. Traction MRA (B) helps unmask focal delamination in equivocal focal disease, not a diffuse-OA picture. A repeat contrast MRI (D) adds nothing to the weightbearing question.",
      topicIndex: 3,
    },
  ],
  "hip-tendons-muscles": [
    {
      id: "hip-tendons-muscles-q1",
      stem: "A 64-year-old woman has 6 months of lateral hip pain and a limp. MRI shows a fluid-filled gap at the lateral facet of the greater trochanter with 2.5 cm retraction of the gluteus medius tendon and fatty atrophy of the muscle belly. What is the best next step?",
      options: [{ key: "A", text: "Reassure and treat as routine trochanteric bursitis" }, { key: "B", text: "Surgical referral for abductor tendon repair" }, { key: "C", text: "Repeat MRI in 6 months to assess progression" }, { key: "D", text: "Intra-articular hip corticosteroid injection" }],
      correctAnswer: "B",
      explanation: "A full-thickness, retracted gluteus medius tear with fatty muscle atrophy is the 'rotator cuff tear of the hip' and warrants surgical referral, especially when atrophy signals chronicity. Calling it bursitis (A) misses the tendon pathology; surveillance (C) wastes the window before further atrophy worsens repair outcomes; an intra-articular injection (D) targets the wrong compartment for an extra-articular abductor tear.",
      topicIndex: 0,
    },
    {
      id: "hip-tendons-muscles-q2",
      stem: "A 38-year-old recreational sprinter felt a pop while hurdling. MRI shows discontinuity of all three proximal hamstring tendons at the ischial tuberosity with 3 cm retraction and a fluid-filled gap. Which feature most strongly drives the decision to refer for surgery?",
      options: [{ key: "A", text: "Presence of peri-tendinous edema" }, { key: "B", text: "Intermediate T2 signal within the tendon" }, { key: "C", text: "A 2–3 tendon avulsion retracted >2 cm" }, { key: "D", text: "Bone marrow edema at the ischial tuberosity" }],
      correctAnswer: "C",
      explanation: "Tendon count and retraction distance are the two surgical decision metrics: a 2–3 tendon avulsion retracted >2 cm in an active patient favors operative repair. Peri-tendinous edema (A) and intermediate intratendinous signal (B) indicate tendinopathy/partial injury without quantifying the surgical lesion; marrow edema (D) is a nonspecific reactive finding.",
      topicIndex: 1,
    },
    {
      id: "hip-tendons-muscles-q3",
      stem: "A 22-year-old soccer player has chronic groin pain that worsens with sit-ups and kicking. A large-FOV pelvic MRI shows fluid tracking inferolaterally from the pubic symphysis along the adductor longus origin, with edema at the rectus-adductor aponeurosis. The hip joint and labrum are normal. What is the most likely diagnosis?",
      options: [{ key: "A", text: "Athletic pubalgia at the rectus-adductor aponeurosis" }, { key: "B", text: "Internal snapping hip from the iliopsoas" }, { key: "C", text: "Anterosuperior labral tear" }, { key: "D", text: "Femoral neck stress fracture" }],
      correctAnswer: "A",
      explanation: "The secondary cleft sign (fluid extending inferolaterally from the symphysis) plus aponeurotic edema localizes the pathology to the rectus-adductor aponeurosis — athletic pubalgia. Internal snapping (B) is a dynamic iliopsoas diagnosis, typically MRI-negative and without an aponeurotic cleft; a labral tear (C) is intra-articular with mechanical/C-sign symptoms and is reported normal here; a femoral neck stress fracture (D) would show a marrow-edema/fracture line in the neck, not this peri-symphyseal distribution.",
      topicIndex: 4,
    },
  ],
  "hip-dont-miss": [
    {
      id: "hip-dont-miss-q1",
      stem: "A 22-year-old female collegiate distance runner has 3 weeks of progressive groin pain and now pain at rest. Radiographs are normal. MRI shows femoral-neck marrow edema with a linear T1-hypointense fracture line abutting the superolateral cortex of the neck. What is the most appropriate next step?",
      options: [{ key: "A", text: "Make the patient non-weight-bearing and obtain urgent orthopedic surgical referral" }, { key: "B", text: "Continue running at reduced volume and repeat MRI in 6 weeks" }, { key: "C", text: "Begin protected weight-bearing with crutches and routine follow-up in 3 months" }, { key: "D", text: "Treat as routine osteitis pubis with a core-strengthening program" }],
      correctAnswer: "A",
      explanation: "A fracture line along the superolateral (tension-side) femoral neck is unstable and prone to displacement with AVN — it is a surgical emergency requiring non-weight-bearing status and same-day ortho referral. Continued running (B) or merely protected weight-bearing with routine follow-up (C) is appropriate for compression-side or edema-only injuries, not a tension-side line. Osteitis pubis (D) is symphyseal and unrelated to a femoral-neck fracture line.",
      topicIndex: 0,
    },
    {
      id: "hip-dont-miss-q2",
      stem: "A 58-year-old man with prostate cancer has new left hip pain. MRI shows diffuse low signal replacing the left femoral and acetabular marrow on T1 images; the abnormal marrow is darker than the adjacent obturator muscle and the visualized intervertebral disc. What is the most appropriate interpretation and action?",
      options: [{ key: "A", text: "Benign red-marrow reconversion; reassure and treat the pain symptomatically" }, { key: "B", text: "Marrow replacement (metastatic disease) is likely; pursue oncologic staging/workup" }, { key: "C", text: "Transient bone-marrow edema syndrome; protected weight-bearing only" }, { key: "D", text: "Normal post-treatment marrow; no further action needed" }],
      correctAnswer: "B",
      explanation: "Normal hematopoietic (red) marrow stays brighter than skeletal muscle on T1; marrow that is DARKER than muscle or disc indicates replacement and is a tumor red flag — in a prostate-cancer patient this is metastatic until proven otherwise and warrants oncologic workup. Red-marrow reconversion (A) stays brighter than muscle. Transient marrow edema (C) is bright on T2/STIR with preserved T1 fat signal, not confluent T1 replacement. Calling it normal (D) misses metastatic disease.",
      topicIndex: 3,
    },
    {
      id: "hip-dont-miss-q3",
      stem: "A 13-year-old boy with obesity reports several weeks of left groin and medial knee pain and walks with the leg externally rotated. MRI shows widening of the proximal femoral physis with metaphyseal marrow edema and slight posteromedial displacement of the capital epiphysis. What is the most appropriate management?",
      options: [{ key: "A", text: "Outpatient physical therapy for a hip flexor strain" }, { key: "B", text: "Continue sports with activity modification and recheck in 4 weeks" }, { key: "C", text: "Reassure that referred knee pain indicates a benign knee problem" }, { key: "D", text: "Make the patient non-weight-bearing and refer urgently for in-situ pinning" }],
      correctAnswer: "D",
      explanation: "These findings are diagnostic of SCFE, which is urgent: continued weight-bearing risks further slippage and AVN, so the patient should be made non-weight-bearing and referred for prompt in-situ pinning. PT for a strain (A) or continued sport (B) allows progression of the slip. The referred medial-knee pain (C) is a classic SCFE presentation, not a benign knee problem, and must not anchor the workup away from the hip.",
      topicIndex: 5,
    },
  ],

  // ─── Elbow course module quizzes (keyed by elbow-* module IDs) ───
  "elbow-mri-orientation": [
    {
      "id": "elbow-mri-orientation-q1",
      "stem": "A 14-year-old gymnast with lateral elbow pain and catching has a radiograph showing a capitellar lucency. To assess the osteochondral lesion and judge its stability, which approach best fits how capitellar OCD should be read on MRI?",
      "options": [
        {
          "key": "A",
          "text": "Read it on the sagittal plane alone, since the sagittal best profiles the capitellar cartilage"
        },
        {
          "key": "B",
          "text": "Read it on coronal and sagittal planes together, confirming the lesion in at least two planes"
        },
        {
          "key": "C",
          "text": "Read it on the axial plane, which best shows the radiocapitellar joint"
        },
        {
          "key": "D",
          "text": "Read it on a single fluid-sensitive coronal image, since one fluid-sensitive plane is sufficient"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Capitellar OCD must be read on coronal AND sagittal together — the coronal shows the lesion at the radiocapitellar contact zone where it lives, while the sagittal defines its anterior-to-posterior extent and contour. Reading any single plane (sagittal alone, coronal alone, or axial) risks both missing the lesion and over-calling a partial-volume artifact, which is why confirming every osteochondral finding in at least two planes is the orientation rule. The axial plane is for nerves, origins, and the annular ligament, not for the capitellar OCD face.",
      "topicIndex": 0
    },
    {
      "id": "elbow-mri-orientation-q2",
      "stem": "A 47-year-old man felt a tearing sensation lifting a heavy box with the elbow flexed and now has antecubital ecchymosis and weak supination. On standard planes the distal biceps tendon is foreshortened and hard to grade. Which positioning best lays the tendon in-plane to its footprint so you can grade a partial-vs-complete tear and measure retraction?",
      "options": [
        {
          "key": "A",
          "text": "A valgus-applied (elbow 'ABER') positioning adjunct, the validated routine for tendon grading"
        },
        {
          "key": "B",
          "text": "MR arthrography, because intra-articular contrast is required to see the footprint"
        },
        {
          "key": "C",
          "text": "FABS — flexed elbow, abducted shoulder, supinated forearm, prone"
        },
        {
          "key": "D",
          "text": "Standard axial imaging alone, which already profiles the bicipitoradial footprint"
        }
      ],
      "correctAnswer": "C",
      "explanation": "FABS (Flexed elbow, ABducted shoulder, Supinated forearm, prone) lays the obliquely-running distal biceps tendon flat and in-plane all the way to its radial-tuberosity footprint, allowing you to distinguish partial from complete tears and measure retraction — the features that drive repair urgency. A valgus-applied/'ABER' adjunct is for opening the medial joint to improve UCL undersurface-tear conspicuity and is not a validated routine for the biceps. MR arthrography is not required to grade the biceps footprint, and standard axial imaging foreshortens the tendon (axial is, however, where you read the lacertus fibrosus).",
      "topicIndex": 1
    },
    {
      "id": "elbow-mri-orientation-q3",
      "stem": "A 19-year-old pitcher has medial elbow pain and a positive moving-valgus stress test; non-contrast 3T MRI is equivocal for a partial undersurface UCL tear at the sublime tubercle. Which statement best reflects when to add MR arthrography?",
      "options": [
        {
          "key": "A",
          "text": "Add MR arthrography here, because it is the most sensitive study for the partial undersurface UCL (T-sign) tear when non-contrast imaging is equivocal"
        },
        {
          "key": "B",
          "text": "MR arthrography should be ordered routinely on every elbow MRI for completeness"
        },
        {
          "key": "C",
          "text": "Avoid MR arthrography; an elbow 'ABER' sequence is a validated routine that replaces it"
        },
        {
          "key": "D",
          "text": "Avoid MR arthrography; non-contrast MRI is equally sensitive for the T-sign, so contrast never changes management"
        }
      ],
      "correctAnswer": "A",
      "explanation": "Direct MR arthrography is the most sensitive study for the partial undersurface UCL tear (the T-sign), because intra-articular contrast undercuts the deep fibers at the sublime tubercle; it is the right addition when a thrower's exam says UCL but non-contrast MRI is equivocal (and likewise for loose-body detection/counting or when OCD stability will change the operation). It is not a routine for every elbow — non-contrast 3T answers most cases. An elbow valgus-applied/'ABER' adjunct can help open the medial joint but is NOT a validated routine like the shoulder ABER, and non-contrast MRI is genuinely less sensitive than arthrography for the T-sign, so contrast can indeed change management.",
      "topicIndex": 2
    }
  ],
  "elbow-search-pattern": [
    {
      "id": "elbow-search-pattern-q1",
      "stem": "A 45-year-old recreational tennis player has chronic lateral elbow pain that has failed rehab. Coronal T2-FS MRI shows a thickened, hyperintense common extensor origin. When you apply the elbow search pattern, which adjacent structure must you specifically interrogate before signing off, because a tear there would change management from debridement to ligament surgery?",
      "options": [
        {
          "key": "A",
          "text": "The anterior bundle of the ulnar collateral ligament at the sublime tubercle"
        },
        {
          "key": "B",
          "text": "The lateral ulnar collateral ligament (LUCL) traced to the supinator crest"
        },
        {
          "key": "C",
          "text": "The distal biceps footprint on the radial tuberosity"
        },
        {
          "key": "D",
          "text": "The annular ligament around the radial neck"
        }
      ],
      "correctAnswer": "B",
      "explanation": "The RCL/LUCL origin lies deep to the common extensor tendon, so a deep undersurface tear hides beneath what looks like simple lateral epicondylitis. A deep/full-thickness common-extensor tear with a fluid-bright gap that undercuts or communicates with the radiocapitellar joint and involves the LUCL implies posterolateral rotatory instability (PLRI) — a surgical problem and a classic complication of prior lateral steroid injection or release. Tracing the LUCL to the supinator crest is the required next step that defeats this satisfaction-of-search trap. The UCL/sublime tubercle is the partner of MEDIAL epicondylitis, not lateral.",
      "topicIndex": 2
    },
    {
      "id": "elbow-search-pattern-q2",
      "stem": "An MRI/CT of a post-dislocation elbow shows a small anteromedial coronoid facet fracture fragment. Why does the search pattern require you to flag this rather than dismiss it as incidental because it looks small on radiographs?",
      "options": [
        {
          "key": "A",
          "text": "A small fragment is reliably stable and can be managed with early motion"
        },
        {
          "key": "B",
          "text": "It indicates valgus instability and a torn UCL anterior bundle"
        },
        {
          "key": "C",
          "text": "It implies varus posteromedial rotatory instability and is surgical; untreated it drives early arthrosis"
        },
        {
          "key": "D",
          "text": "It confirms a coexisting distal biceps avulsion that needs urgent repair"
        }
      ],
      "correctAnswer": "C",
      "explanation": "At the coronoid, small does not mean stable. The anteromedial-facet fracture looks small on radiographs but is highly unstable, implies varus posteromedial rotatory instability (VPMRI) — a distinct mechanism from valgus and from PLRI — and is surgical; untreated VPMRI drives early arthrosis. In any dislocation/terrible-triad elbow, the search pattern closes the O'Driscoll circle (LCL/LUCL, coronoid including the anteromedial facet, radial head, Osborne-Cotterill impaction, heterotopic ossification), and the coronoid and LCL are the reconstructive keystones.",
      "topicIndex": 3
    },
    {
      "id": "elbow-search-pattern-q3",
      "stem": "Which sequencing principle most directly explains why the eight-step elbow search pattern places bones and marrow at step 2 rather than at the end of the read?",
      "options": [
        {
          "key": "A",
          "text": "Bone findings are usually incidental, so reading them early gets them out of the way"
        },
        {
          "key": "B",
          "text": "The high-consequence osseous lesions are vulnerable to satisfaction-of-search and end-of-read fatigue after an obvious tendinopathy"
        },
        {
          "key": "C",
          "text": "Marrow can only be assessed on the first sequence acquired in the protocol"
        },
        {
          "key": "D",
          "text": "Ligament and tendon findings must always be confirmed before any bone finding is reported"
        }
      ],
      "correctAnswer": "B",
      "explanation": "A fixed order calibrates attention so the high-consequence compartment (bones/marrow) is read while attention is freshest. The unstable OCD, the posteromedial olecranon stress fracture, the occult radial-head fracture, the anteromedial coronoid facet, and a confluent low-T1 marrow-replacing lesion are exactly the disposition-changing findings that get lost to satisfaction-of-search and end-of-read fatigue once an obvious tendinopathy has captured the eye. These lesions are not incidental (ruling out A), and marrow is assessed across T1 and fluid-sensitive sequences in every plane (ruling out C).",
      "topicIndex": 1
    }
  ],
  "elbow-bones-marrow": [
    {
      "id": "elbow-bones-marrow-q1",
      "stem": "A 14-year-old competitive gymnast has lateral elbow pain and catching. MRI shows a focal anterolateral capitellar osteochondral lesion. Which single finding most reliably indicates that the lesion is UNSTABLE and should prompt surgical referral?",
      "options": [
        {
          "key": "A",
          "text": "Surrounding capitellar marrow edema on fluid-sensitive images"
        },
        {
          "key": "B",
          "text": "A T2 fluid-bright line, matching joint-fluid signal, completely undercutting the fragment at the interface"
        },
        {
          "key": "C",
          "text": "Involvement of the entire capitellar ossific nucleus"
        },
        {
          "key": "D",
          "text": "An isolated high-T2 line at the interface with intact overlying cartilage and no subchondral cyst"
        }
      ],
      "correctAnswer": "B",
      "explanation": "A T2 fluid-bright line that completely undercuts the fragment and matches joint-fluid signal is the most reliable adult criterion for an unstable osteochondral fragment; a sizeable/multiple subchondral cyst, a cartilage cleft reaching the fragment, or a displaced fragment/loose body are the other instability signs. Surrounding marrow edema (A) is present in both stable and unstable lesions and is NOT a stability sign. Whole-nucleus involvement (C) describes Panner disease in a younger child, not a focal adolescent OCD. An isolated high-T2 line without a cyst or cartilage breach (D) is INDETERMINATE — it can be healing granulation tissue — and warrants MR/CT arthrography rather than an automatic 'unstable' call.",
      "topicIndex": 1
    },
    {
      "id": "elbow-bones-marrow-q2",
      "stem": "A 30-year-old falls on an outstretched hand and has lateral elbow pain. Radiographs show a displaced posterior fat pad but no visible fracture line. What is the most appropriate interpretation and management driver?",
      "options": [
        {
          "key": "A",
          "text": "The normal radiograph excludes fracture; the displaced posterior fat pad is a normal finding"
        },
        {
          "key": "B",
          "text": "An occult intra-articular fracture (radial head most likely) is present until proven otherwise; the surgical trigger is a mechanical block to forearm rotation or comminution, not 2 mm of displacement alone"
        },
        {
          "key": "C",
          "text": "Any radial-head fracture displaced 2 mm or more (Mason II) requires operative fixation regardless of motion"
        },
        {
          "key": "D",
          "text": "The posterolateral pseudodefect of the capitellum accounts for the finding and needs no further work-up"
        }
      ],
      "correctAnswer": "B",
      "explanation": "A visible (displaced) posterior fat pad in an adult after trauma signifies hemarthrosis from an occult intra-articular fracture — radial head most common — until proven otherwise; MRI shows the low-signal line plus marrow edema and separates a true fracture from a bone bruise. The surgical trigger is a mechanical block to forearm rotation, an articular fragment that impedes motion, or comminution (Mason III), NOT the 2 mm number alone (C), so many Mason II fractures without a block are managed nonoperatively. A normal radiograph does not exclude fracture (A). The pseudodefect (D) is a normal posterolateral bare-area groove and does not explain a post-traumatic effusion.",
      "topicIndex": 3
    },
    {
      "id": "elbow-bones-marrow-q3",
      "stem": "A 9-year-old presents after an elbow injury. The radiograph shows an effusion (displaced posterior fat pad) but no clear fracture line, and the ossified trochlea is visible while the medial epicondyle ossification center is not seen. Which conclusion is best supported?",
      "options": [
        {
          "key": "A",
          "text": "The medial epicondyle has been avulsed — possibly incarcerated in the joint — because the trochlea never ossifies before the medial epicondyle (CRITOE)"
        },
        {
          "key": "B",
          "text": "This is Panner disease of the capitellum, which is self-limited and needs only rest"
        },
        {
          "key": "C",
          "text": "The finding represents primary elbow osteoarthritis, the most common source of loose bodies in this age group"
        },
        {
          "key": "D",
          "text": "A simple stress reaction of the olecranon apophysis explains the effusion and no further evaluation is needed"
        }
      ],
      "correctAnswer": "A",
      "explanation": "By CRITOE (Capitellum, Radial head, Internal/medial epicondyle, Trochlea, Olecranon, External/lateral epicondyle), the trochlea NEVER ossifies before the medial epicondyle. Seeing the trochlea without the medial epicondyle means the epicondyle has been avulsed — classically after a transient dislocation that spontaneously reduced — and it may be incarcerated intra-articularly, a high-stakes pediatric miss. Panner disease (B) affects the capitellum and would not explain a missing medial epicondyle. Primary OA (C) is a non-thrower adult loose-body source, not a pediatric entity. An olecranon stress reaction (D) ignores the CRITOE clue and the need to exclude an incarcerated fragment.",
      "topicIndex": 4
    }
  ],
  "elbow-ucl-valgus": [
    {
      "id": "elbow-ucl-valgus-q1",
      "stem": "A 19-year-old collegiate pitcher has medial elbow pain. You are setting up to evaluate the band that is the primary valgus restraint and the structure reconstructed in Tommy John surgery. Which structure and course should you trace?",
      "options": [
        {
          "key": "A",
          "text": "The posterior bundle of the UCL, forming the floor of the cubital tunnel"
        },
        {
          "key": "B",
          "text": "The transverse (Cooper) ligament, running from the coronoid to the olecranon"
        },
        {
          "key": "C",
          "text": "The anterior bundle of the UCL, from the anteroinferior medial epicondyle to the sublime tubercle of the coronoid"
        },
        {
          "key": "D",
          "text": "The common flexor-pronator tendon, from the medial epicondyle to the proximal forearm flexors"
        }
      ],
      "correctAnswer": "C",
      "explanation": "The anterior bundle of the UCL is the primary valgus restraint across the functional throwing arc (~20–120°), running from the anteroinferior medial epicondyle to the sublime tubercle of the medial coronoid, and it is the band reconstructed in Tommy John surgery. The posterior bundle (cubital tunnel floor) and the transverse/Cooper ligament contribute little to valgus restraint. The flexor-pronator tendon is a muscle-tendon origin that overlies the UCL but is not the valgus-restraining ligament; it is read as the second leg of the medial triad, not as the reconstructed band.",
      "topicIndex": 0
    },
    {
      "id": "elbow-ucl-valgus-q2",
      "stem": "On a coronal fluid-sensitive image of a thrower's elbow, you see fluid tracking medially along the sublime tubercle, undercutting the distal UCL attachment beyond the edge of the articular cartilage and meeting the joint-fluid column at a right angle, while the more proximal ligament fibers remain attached. What does this represent?",
      "options": [
        {
          "key": "A",
          "text": "A partial-thickness undersurface (articular-sided) distal tear — the T-sign"
        },
        {
          "key": "B",
          "text": "A normal distal synovial recess that requires no further comment"
        },
        {
          "key": "C",
          "text": "A full-thickness UCL tear with retraction"
        },
        {
          "key": "D",
          "text": "Flexor-pronator tendinosis overlying an intact UCL"
        }
      ],
      "correctAnswer": "A",
      "explanation": "The described pattern is the T-sign: fluid/contrast undercutting the distal/sublime-tubercle attachment BEYOND the articular-cartilage edge, forming a right-angle 'T' with the joint-fluid column while the proximal fibers stay attached. That is the signature of a partial-thickness undersurface (articular-sided) distal tear — the classic, frequently undercalled throwing injury. A normal recess undercuts only the most distal fibers by a couple of millimeters and does NOT cross the cartilage edge, which is the key discriminator. A full-thickness tear would show fluid-bright signal spanning the entire thickness with a gap, retraction, or medial extravasation, not preserved proximal fibers. MR arthrography is the most sensitive study to confirm the T-sign when non-contrast MRI is equivocal.",
      "topicIndex": 2
    },
    {
      "id": "elbow-ucl-valgus-q3",
      "stem": "An 18-year-old high-demand pitcher has a symptomatic partial UCL tear that has not improved after a structured rehab and return-to-throwing program. He is considering surgery. Which statement best reflects how the repair-vs-reconstruction decision and adjunctive findings should be framed?",
      "options": [
        {
          "key": "A",
          "text": "A <50% vs >50% partial-thickness measurement is a validated grading scale that, by itself, dictates whether to reconstruct"
        },
        {
          "key": "B",
          "text": "Ulnar nerve transposition should be performed routinely with every UCL reconstruction to prevent later neuritis"
        },
        {
          "key": "C",
          "text": "Distal sublime-tubercle tears are the most common pattern in throwers and respond best to nonoperative management"
        },
        {
          "key": "D",
          "text": "The decision is driven by lesion features plus athlete demand and the moving-valgus exam, with dynamic valgus-stress ultrasound supplying a side-to-side gapping number MRI cannot give"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Management is driven by the lesion plus the athlete's demand and the moving-valgus exam, not by the MRI grade in isolation; reconstruction is the conversation for full-thickness tears in high-demand throwers, high-grade or symptomatic partials that fail roughly 3–6 months of rehab, or instability discordant with demand, while repair ± internal brace has re-emerged for acute avulsion-type tears with good tissue. The <50%/>50% split is a descriptive heuristic, not a validated named scale (A is wrong). Ulnar nerve transposition is selective — done for preoperative ulnar symptoms or instability, not routinely, because routine transposition adds morbidity (B is wrong). Distal tears do worse nonoperatively and their predominance is not uniform in the literature, so calling them both the most common and the best nonoperative responders is wrong (C). Dynamic valgus-stress ultrasound quantifies side-to-side medial gapping (commonly cited ~1.5–2 mm), the functional threshold static MRI cannot provide.",
      "topicIndex": 4
    }
  ],
  "elbow-lcl-plri": [
    {
      "id": "elbow-lcl-plri-q1",
      "stem": "A 45-year-old recreational tennis player has chronic lateral elbow pain refractory to rehab and two prior corticosteroid injections. Coronal and axial T2-FS images show a thickened, T2-hyperintense common extensor origin with a deep fluid-bright gap that undercuts and communicates with the radiocapitellar joint and extends into the lateral ulnar collateral ligament; there is mild posterolateral radial subluxation. Which interpretation best explains these findings?",
      "options": [
        {
          "key": "A",
          "text": "Isolated common extensor (ECRB) tendinosis that should continue conservative rehab"
        },
        {
          "key": "B",
          "text": "Reactive lateral-epicondyle marrow edema that should not be called a ligament tear"
        },
        {
          "key": "C",
          "text": "A deep tear involving the LUCL implying posterolateral rotatory instability — a surgical problem"
        },
        {
          "key": "D",
          "text": "A normal RCL signal variant that requires no further comment"
        }
      ],
      "correctAnswer": "C",
      "explanation": "The LUCL/RCL origin lies deep to the common extensor tendon, so a deep undersurface tear can hide beneath what looks like simple lateral epicondylitis. A fluid-bright gap that undercuts or communicates with the radiocapitellar joint AND involves the LUCL implies posterolateral rotatory instability (PLRI), supported here by the secondary sign of posterolateral radial subluxation. This converts a routine 'tennis elbow' debridement into a ligament repair/reconstruction and is a classic complication of prior lateral steroid injection or release. Tendinosis with intact deep fibers (A) and reactive epicondyle edema or thin RCL signal alone (B, D) would be conservative and should NOT be over-called as an LCL tear — but those are not what is described here.",
      "topicIndex": 1
    },
    {
      "id": "elbow-lcl-plri-q2",
      "stem": "A 28-year-old sustains a simple elbow dislocation that is reduced in the emergency department. Applying the O'Driscoll circle of dislocation, which statement most accurately describes the expected pattern of soft-tissue injury?",
      "options": [
        {
          "key": "A",
          "text": "The MCL is the primary lesion, and valgus instability dominates the clinical picture"
        },
        {
          "key": "B",
          "text": "The LCL/LUCL is the primary lesion because disruption proceeds lateral-to-medial, often sparing valgus stability"
        },
        {
          "key": "C",
          "text": "The anterior capsule fails first, before either collateral ligament"
        },
        {
          "key": "D",
          "text": "Both collateral ligaments always fail simultaneously, so side does not matter"
        }
      ],
      "correctAnswer": "B",
      "explanation": "The O'Driscoll circle describes soft-tissue disruption proceeding lateral-to-medial: LCL/LUCL first, then the anterior and posterior capsule, and finally the MCL. This is precisely why the LCL is the primary lesion in most simple dislocations and why valgus stability is often preserved (the MCL fails last). The practical consequence is that you must comment explicitly on LUCL integrity in every post-dislocation and post-lateral-surgery elbow. The MCL is not the primary lesion (A), the capsule does not fail before the LCL (C), and the failure is sequential rather than simultaneous (D).",
      "topicIndex": 2
    },
    {
      "id": "elbow-lcl-plri-q3",
      "stem": "A post-trauma elbow CT/MRI in a patient with persistent instability shows a small anteromedial coronoid facet fracture together with an LUCL injury. The fragment looks small on radiographs. What is the correct interpretation and disposition?",
      "options": [
        {
          "key": "A",
          "text": "It implies varus posteromedial rotatory instability (VPMRI) and is surgical despite its small size"
        },
        {
          "key": "B",
          "text": "Because the fragment is small on radiographs, it is stable and can be managed nonoperatively"
        },
        {
          "key": "C",
          "text": "It represents the same mechanism as PLRI and is treated identically"
        },
        {
          "key": "D",
          "text": "It indicates valgus instability and warrants UCL reconstruction"
        }
      ],
      "correctAnswer": "A",
      "explanation": "An anteromedial coronoid facet fracture combined with LUCL injury is the signature of varus posteromedial rotatory instability (VPMRI) — a third, distinct instability mechanism separate from both valgus instability and PLRI. The fragment looks small on radiographs but is highly unstable and surgical, and untreated VPMRI drives early arthrosis: small does NOT mean stable at the coronoid (so B is wrong). VPMRI is a different mechanism from PLRI (C is wrong) and is not a valgus/UCL problem (D is wrong). Classify the anteromedial facet with the O'Driscoll system (use Regan-Morrey only for coronoid height); CT maps the osseous fragment best.",
      "topicIndex": 3
    }
  ],
  "elbow-tendons": [
    {
      "id": "elbow-tendons-q1",
      "stem": "A 44-year-old recreational athlete felt a pop lifting a heavy box and now has anterior elbow pain. Axial fluid-sensitive images show full discontinuity of the distal biceps tendon with a balled-up stump, but the tendon is only minimally retracted and the stump sits close to the radial tuberosity. The exam is surprisingly preserved. Which single feature best explains this picture and should be reported explicitly?",
      "options": [
        {
          "key": "A",
          "text": "An intact lacertus fibrosus tethering the completely torn tendon"
        },
        {
          "key": "B",
          "text": "A distended bicipitoradial bursa splinting the tendon"
        },
        {
          "key": "C",
          "text": "An intact short-head (flexion) limb of the footprint"
        },
        {
          "key": "D",
          "text": "Preserved brachialis function masking the tear"
        }
      ],
      "correctAnswer": "A",
      "explanation": "A complete distal biceps tear with an INTACT lacertus fibrosus does not retract (or only minimally) and can keep a near-normal exam — this is the commonly missed complete tear. The lacertus arises from the medial musculotendinous junction and blends into the forearm flexor fascia, tethering the torn tendon. You must report partial-vs-complete AND lacertus-intact-vs-torn AND retraction in centimeters; do not be reassured by the preserved exam and undercall it as a partial. A bicipitoradial bursa is a clue, not the cause of non-retraction; and while the brachialis does preserve some flexion, it is the lacertus that explains the lack of retraction in a complete tear.",
      "topicIndex": 1
    },
    {
      "id": "elbow-tendons-q2",
      "stem": "A 38-year-old powerlifter on long-term anabolic steroids has posterior elbow pain and cannot extend against resistance. The lateral radiograph shows a small avulsed olecranon flake. MRI shows the deep central triceps fibers torn with a fluid gap, while the superficial expansion appears continuous. What is the most appropriate interpretation and next step?",
      "options": [
        {
          "key": "A",
          "text": "Triceps tendinosis; reassure and treat conservatively"
        },
        {
          "key": "B",
          "text": "An isolated bursal process; the tendon is intact because the superficial fibers are continuous"
        },
        {
          "key": "C",
          "text": "A high-grade/effectively complete triceps avulsion; report the percentage of width torn and refer for repair"
        },
        {
          "key": "D",
          "text": "An incidental olecranon flake unrelated to the tendon"
        }
      ],
      "correctAnswer": "C",
      "explanation": "The triceps deep central fibers fail first while the superficial expansion can stay intact, so a clinically near-complete avulsion can look partial — the analog of the biceps lacertus. The job is to report the PERCENTAGE of tendon width torn and the gap, not just 'partial.' Complete ruptures and high-grade partials (commonly >50% width, or ANY tear with extension weakness against resistance) are repaired. The avulsed olecranon flake is the classic tip-off, and anabolic steroids are a recognized risk factor. Do not undercall this as tendinosis just because the superficial fibers look continuous.",
      "topicIndex": 2
    },
    {
      "id": "elbow-tendons-q3",
      "stem": "A 50-year-old with refractory lateral elbow pain after two prior corticosteroid injections has a full-thickness common-extensor (ECRB) tear at the lateral epicondyle. Following the fluid-bright gap, you see it undercut and communicate with the radiocapitellar joint and extend into the LUCL toward the supinator crest. What does this combination most likely indicate?",
      "options": [
        {
          "key": "A",
          "text": "Reactive lateral-epicondyle marrow edema overcalled as ligament injury"
        },
        {
          "key": "B",
          "text": "Posterolateral rotatory instability (PLRI), converting a debridement into a ligament repair/reconstruction"
        },
        {
          "key": "C",
          "text": "Valgus instability from an associated UCL tear"
        },
        {
          "key": "D",
          "text": "A capitellar pseudodefect mimicking a chondral lesion"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Always trace the LUCL to the supinator crest with high-grade lateral epicondylitis: a deep/full-thickness common-extensor tear with a fluid-bright gap that undercuts or communicates with the radiocapitellar joint AND involves the LUCL implies PLRI. That converts a routine 'tennis elbow' extensor debridement into a ligament repair/reconstruction, and it is a known complication of prior lateral steroid injection or surgical release. Option A is the opposite error (do NOT over-call reactive epicondyle edema or thin RCL signal as an LCL tear), valgus/UCL instability is the medial-sided problem, and the pseudodefect is a normal posterolateral bare-area variant, not a tear.",
      "topicIndex": 3
    }
  ],
  "elbow-nerves": [
    {
      "id": "elbow-nerves-q1",
      "stem": "A 34-year-old develops forearm weakness. MRI three weeks after symptom onset shows diffuse T2/STIR hyperintensity of pronator quadratus with normal T1 signal and no fatty change. How should the muscle finding be characterized, and what does it imply?",
      "options": [
        {
          "key": "A",
          "text": "Acute denervation occurring within the first few days of nerve injury"
        },
        {
          "key": "B",
          "text": "Subacute denervation edema, potentially reversible with reinnervation"
        },
        {
          "key": "C",
          "text": "Chronic denervation with established fatty atrophy"
        },
        {
          "key": "D",
          "text": "A myotendinous strain of pronator quadratus"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Denervation has three phases, not two. There is NO MRI muscle change in the first ~2–4 weeks, then SUBACUTE T2/STIR edema (which can reverse if the muscle is reinnervated), and only later CHRONIC T1 fatty atrophy. Visible muscle edema therefore dates the process to weeks and should be labeled subacute, not acute — there is no MRI change in the first few days, so 'acute' is wrong. T1 is normal, so there is no chronic fatty atrophy. Isolated pronator quadratus edema is the classic localizing pattern for an AIN (pure-motor) lesion, not a myotendinous strain.",
      "topicIndex": 0
    },
    {
      "id": "elbow-nerves-q2",
      "stem": "On a thrower's elbow MRI, the ulnar nerve at the medial epicondyle shows mild T2 hyperintensity but a caliber similar to the contralateral side and to the ipsilateral median nerve, with no FCU or ulnar-intrinsic denervation. What is the most appropriate interpretation?",
      "options": [
        {
          "key": "A",
          "text": "The T2 hyperintensity alone is diagnostic of cubital tunnel neuritis"
        },
        {
          "key": "B",
          "text": "Compare cross-sectional area to a universal CSA cutoff to confirm entrapment"
        },
        {
          "key": "C",
          "text": "Mild signal without caliber change or denervation may be normal; correlate clinically rather than calling neuritis on signal alone"
        },
        {
          "key": "D",
          "text": "Absence of denervation excludes any ulnar nerve pathology"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Mild ulnar nerve T2 brightness occurs in asymptomatic elbows, and there is no validated universal cross-sectional-area cutoff, so option B is wrong. The diagnosis is anchored to caliber enlargement (compared to the contralateral ulnar nerve and the ipsilateral median nerve as internal controls) PLUS target-muscle denervation (FCU, ulnar FDP, ulnar intrinsics) PLUS clinical correlation — not signal alone (A is wrong). Absence of denervation does not exclude all pathology (early or mild entrapment may lack it), so D overstates the case; the correct posture is to call it potentially normal and correlate clinically.",
      "topicIndex": 1
    },
    {
      "id": "elbow-nerves-q3",
      "stem": "During the lateral-compartment read for a patient with lateral forearm pain and a clinical PIN/radial tunnel question, which finding is the most management-changing to report?",
      "options": [
        {
          "key": "A",
          "text": "Denervation of the supinator, which is a constant feature of PIN compression"
        },
        {
          "key": "B",
          "text": "A ganglion or lipoma at the arcade of Frohse compressing the nerve"
        },
        {
          "key": "C",
          "text": "Mild reactive marrow edema at the lateral epicondyle"
        },
        {
          "key": "D",
          "text": "A normal MRI, which excludes radial tunnel syndrome"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Always hunt for a mass/cyst/ganglion as the compressive cause: a space-occupying lesion (ganglion, lipoma, distended bicipitoradial bursa) at the arcade of Frohse changes management from splinting/therapy to surgical referral, making it the highest-value finding. The supinator is variably involved and often SPARED in PIN syndrome (its branches frequently arise proximal to the arcade), so it is not a constant feature (A is wrong). Radial tunnel syndrome is pain without a motor deficit and often has a NORMAL MRI, so a normal study does not exclude it (D is wrong). Reactive lateral-epicondyle edema is a non-specific finding, not the management driver.",
      "topicIndex": 4
    }
  ],
  "elbow-dont-miss": [
    {
      "id": "elbow-dont-miss-q1",
      "stem": "A 34-year-old falls on an outstretched hand and presents with a painful, swollen elbow. The radiograph is read as showing no fracture, but a fat-pad sign is noted. On MRI, which finding behind a 'normal' radiograph should you search for most actively in this adult?",
      "options": [
        {
          "key": "A",
          "text": "A supracondylar fracture, the most common occult elbow fracture in adults"
        },
        {
          "key": "B",
          "text": "An occult radial-head fracture, with a low-signal line on T1 and surrounding marrow edema"
        },
        {
          "key": "C",
          "text": "A lateral condyle (Salter-Harris IV) fracture, which is prone to non-union"
        },
        {
          "key": "D",
          "text": "A medial epicondyle apophyseal avulsion from valgus traction"
        }
      ],
      "correctAnswer": "B",
      "explanation": "In an adult after trauma, a displaced posterior fat pad indicates hemarthrosis from an occult intra-articular fracture until proven otherwise, and the radial head is the most common culprit. MRI shows the low-signal fracture line on T1 with surrounding marrow edema and distinguishes a true fracture from a bone bruise. Supracondylar and the non-union-prone lateral condyle (Salter-Harris IV) fractures are the pediatric pattern, not the adult one; medial epicondyle apophyseal injury is a skeletally immature thrower's problem.",
      "topicIndex": 0
    },
    {
      "id": "elbow-dont-miss-q2",
      "stem": "A 45-year-old weightlifter felt a pop at the elbow during a heavy curl. On exam, flexion and supination strength are only mildly reduced and there is no obvious gap. MRI shows full-thickness discontinuity of the distal biceps tendon at the radial tuberosity, but the tendon stump has not retracted. What best explains the preserved exam, and what should the report state?",
      "options": [
        {
          "key": "A",
          "text": "The tear is only partial; report it as a partial undersurface tear and recommend rehab"
        },
        {
          "key": "B",
          "text": "An intact lacertus fibrosus is tethering the completely torn tendon; report it as complete, give retraction in cm, and state lacertus integrity"
        },
        {
          "key": "C",
          "text": "Magic-angle artifact is mimicking a tear; report the tendon as intact"
        },
        {
          "key": "D",
          "text": "The brachialis is compensating, so no surgical referral is needed regardless of tendon status"
        }
      ],
      "correctAnswer": "B",
      "explanation": "An intact lacertus fibrosus tethers a completely torn distal biceps so it neither retracts nor produces an obvious clinical gap — the great mimic that is routinely undercalled as a partial tear. The report must state partial-vs-complete, retraction in cm, and lacertus integrity explicitly, and the patient should be referred promptly while the tendon still reaches the tuberosity. There is no hard repair deadline, but a preserved exam should not be reassuring when the lacertus is intact.",
      "topicIndex": 1
    },
    {
      "id": "elbow-dont-miss-q3",
      "stem": "A 60-year-old gardener has a red, warm, fluctuant swelling over the olecranon. MRI shows a distended olecranon bursa with mild surrounding edema and no definite marrow signal abnormality. What is the most appropriate next step?",
      "options": [
        {
          "key": "A",
          "text": "Reassure the patient that the absence of marrow edema on MRI excludes infection"
        },
        {
          "key": "B",
          "text": "Treat empirically as gout, since gout and RA cause this aseptic picture"
        },
        {
          "key": "C",
          "text": "Aspirate the bursa, because MRI cannot reliably exclude infection"
        },
        {
          "key": "D",
          "text": "Repeat the MRI with contrast to definitively rule infection in or out before any intervention"
        }
      ],
      "correctAnswer": "C",
      "explanation": "MRI cannot reliably exclude infection in olecranon bursitis, so a red, warm, fluctuant bursa needs aspiration, not just imaging. Gout, rheumatoid arthritis, and repetitive trauma cause an aseptic bursitis that overlaps with the septic picture, so empiric gout treatment without a tap is unsafe, and contrast does not confer the certainty that aspiration provides. A joint effusion with aggressive periarticular edema and rim enhancement would prompt urgent escalation for a possible septic joint.",
      "topicIndex": 3
    }
  ],
};
