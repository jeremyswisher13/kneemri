import type { QuizQuestion } from '@/types/content';

export const prePostQuizQuestions: QuizQuestion[] = [
  // ─── Identical Pre/Post (8 questions) ───────────────────────────────

  {
    id: 'q01',
    domain: 'acl',
    prePostMapping: 'identical',
    stem: 'A 20-year-old football player presents after a noncontact pivoting injury. MRI shows marrow edema at the lateral femoral condyle and posterolateral tibial plateau. Which additional finding should you specifically search for?',
    options: [
      { key: 'A', text: 'Quadriceps tendon tear' },
      { key: 'B', text: 'ACL tear with associated meniscal injury (root, ramp, bucket-handle)' },
      { key: 'C', text: 'Patellar tendon rupture' },
      { key: 'D', text: 'Isolated distal MCL avulsion' },
    ],
    correctAnswer: 'B',
    explanation:
      'The pivot-shift contusion pattern (LFC + posterolateral tibial plateau) is strongly associated with ACL injury. When this pattern is identified, you must carefully evaluate for ACL discontinuity and systematically search for commonly associated injuries: lateral meniscal posterior root tear, medial meniscal ramp lesion, and bucket-handle tears.',
  },
  {
    id: 'q02',
    domain: 'menisci-roots',
    prePostMapping: 'identical',
    stem: 'A meniscal root tear is best described as functionally equivalent to which scenario?',
    options: [
      { key: 'A', text: 'A partial-thickness peripheral meniscal tear' },
      { key: 'B', text: 'A small tear that will heal spontaneously' },
      { key: 'C', text: 'Loss of meniscal hoop stress (functionally similar to a total meniscectomy)' },
      { key: 'D', text: 'A normal degenerative finding requiring no specific comment' },
    ],
    correctAnswer: 'C',
    explanation:
      "Root tears destroy the meniscus's ability to generate hoop stress, making them functionally equivalent to a total meniscectomy. This leads to rapid compartment overload and must be explicitly reported.",
  },
  {
    id: 'q03',
    domain: 'acl',
    prePostMapping: 'identical',
    stem: 'Which of the following is the most reliable direct MRI sign of a complete ACL tear?',
    options: [
      { key: 'A', text: 'Anterior tibial translation' },
      { key: 'B', text: 'Pivot-shift marrow edema pattern' },
      { key: 'C', text: 'Discontinuity of ACL fibers with abnormal signal' },
      { key: 'D', text: 'Deep lateral femoral notch sign' },
    ],
    correctAnswer: 'C',
    explanation:
      'The direct sign of ACL tear is fiber discontinuity with abnormal signal. Anterior tibial translation, bone bruise patterns, and notch signs are secondary/indirect signs that support the diagnosis.',
  },
  {
    id: 'q04',
    domain: 'patellofemoral',
    prePostMapping: 'identical',
    stem: 'On MRI, marrow edema at the medial patellar facet and lateral femoral condyle in a young patient most strongly suggests:',
    options: [
      { key: 'A', text: 'Osteoarthritis' },
      { key: 'B', text: 'Stress fracture' },
      { key: 'C', text: 'Transient lateral patellar dislocation' },
      { key: 'D', text: 'Spontaneous osteonecrosis (SIFK)' },
    ],
    correctAnswer: 'C',
    explanation:
      'This is the classic contusion pattern of transient lateral patellar dislocation. The report should describe MPFL/retinacular injury and search for osteochondral fragments and loose bodies.',
  },
  {
    id: 'q05',
    domain: 'reporting',
    prePostMapping: 'identical',
    stem: 'A well-structured knee MRI impression should include all of the following EXCEPT:',
    options: [
      { key: 'A', text: 'Dominant diagnosis with completeness and location' },
      { key: 'B', text: 'Every MRI sequence and slice number where findings were seen' },
      { key: 'C', text: 'Actionable associated injuries (root, ramp, corner, avulsion, displaced fragment)' },
      { key: 'D', text: 'Osteochondral consequences (donor site, loose body, unstable fragment)' },
    ],
    correctAnswer: 'B',
    explanation:
      'The impression should focus on diagnosis + associated injuries + osteochondral consequences. Sequence and slice numbers belong in the findings section, not the impression.',
  },
  {
    id: 'q06',
    domain: 'menisci-ramp',
    prePostMapping: 'identical',
    stem: 'In a patient with a confirmed ACL tear, where should you specifically inspect for a ramp lesion?',
    options: [
      { key: 'A', text: 'Anterior horn of the lateral meniscus' },
      { key: 'B', text: 'Posteromedial meniscocapsular junction' },
      { key: 'C', text: 'Popliteal hiatus' },
      { key: 'D', text: 'Anterior tibial spine' },
    ],
    correctAnswer: 'B',
    explanation:
      'Ramp lesions occur at the posteromedial meniscocapsular junction and are commonly associated with ACL injuries. They require deliberate inspection on sagittal and axial images.',
  },
  {
    id: 'q07',
    domain: 'acl',
    prePostMapping: 'identical',
    stem: 'Mucoid degeneration of the ACL is best differentiated from an ACL tear by:',
    options: [
      { key: 'A', text: 'The presence of any increased signal within the ligament' },
      { key: 'B', text: 'Continuous fibers with preserved tension despite abnormal signal' },
      { key: 'C', text: 'Associated bone marrow edema' },
      { key: 'D', text: 'Patient age over 40' },
    ],
    correctAnswer: 'B',
    explanation:
      'Mucoid degeneration shows increased intraligamentous signal but maintains fiber continuity and appropriate tension. A tear shows discontinuity with loss of normal tension.',
  },
  {
    id: 'q08',
    domain: 'search-pattern',
    prePostMapping: 'identical',
    stem: "According to the 'two-slice-touch' rule for meniscal tears, a tear should be diagnosed when:",
    options: [
      { key: 'A', text: 'Any bright signal is seen within the meniscus on a single image' },
      { key: 'B', text: 'Grade 3 signal reaches a meniscal surface on at least 2 images, ideally confirmed on a second plane' },
      { key: 'C', text: 'The meniscus appears dark on T1-weighted images' },
      { key: 'D', text: 'Signal changes are seen on only one sequence' },
    ],
    correctAnswer: 'B',
    explanation:
      'The two-slice-touch rule requires grade 3 linear signal reaching a meniscal surface (superior, inferior, or free edge) on \u22652 images, ideally confirmed on a second plane. A single bright dot does not meet criteria for a definite tear.',
  },

  // ─── Parallel Pre/Post (4 pairs = 8 questions) ─────────────────────

  {
    id: 'q09-pre',
    domain: 'marrow-patterns',
    prePostMapping: 'parallel-pre',
    parallelId: 'q09',
    stem: 'Which bone marrow edema pattern is most characteristic of a dashboard-mechanism injury?',
    options: [
      { key: 'A', text: 'Lateral femoral condyle + posterolateral tibial plateau' },
      { key: 'B', text: 'Anterior proximal tibia with posterior tibial translation' },
      { key: 'C', text: 'Medial patella + lateral femoral condyle' },
      { key: 'D', text: 'Isolated lateral tibial plateau' },
    ],
    correctAnswer: 'B',
    explanation:
      'Dashboard injuries produce a direct blow to the anterior proximal tibia, causing posterior tibial translation and PCL injury. The marrow edema is typically in the anterior proximal tibia.',
  },
  {
    id: 'q09-post',
    domain: 'marrow-patterns',
    prePostMapping: 'parallel-post',
    parallelId: 'q09',
    stem: 'A patient presents after a dashboard injury. MRI shows anterior proximal tibial edema and posterior capsule disruption. Which structures are most at risk?',
    options: [
      { key: 'A', text: 'MPFL and medial retinaculum' },
      { key: 'B', text: 'PCL, posterolateral corner structures, and meniscal roots' },
      { key: 'C', text: 'Quadriceps tendon and patellar tendon' },
      { key: 'D', text: 'ACL and lateral meniscus only' },
    ],
    correctAnswer: 'B',
    explanation:
      'Dashboard mechanism transmits force to the PCL and posterolateral corner. Associated injuries include PLC structures (popliteus, LCL, popliteofibular ligament) and meniscal root tears.',
  },
  {
    id: 'q10-pre',
    domain: 'menisci-roots',
    prePostMapping: 'parallel-pre',
    parallelId: 'q10',
    stem: 'What quantitative measurement should be reported when a meniscal root tear is identified?',
    options: [
      { key: 'A', text: 'Meniscal height in mm' },
      { key: 'B', text: 'Meniscal body width' },
      { key: 'C', text: 'Meniscal extrusion in millimeters' },
      { key: 'D', text: 'Tibial slope angle' },
    ],
    correctAnswer: 'C',
    explanation:
      'Meniscal extrusion (measured in mm on coronal images) is the key quantitative finding to report with root tears. Medial extrusion \u22653 mm is a strong clue to root pathology.',
  },
  {
    id: 'q10-post',
    domain: 'menisci-roots',
    prePostMapping: 'parallel-post',
    parallelId: 'q10',
    stem: 'A radial tear is found at the posterior root of the medial meniscus. Beyond describing the tear morphology, what quantitative finding is most important to include in the report?',
    options: [
      { key: 'A', text: 'Signal-to-noise ratio of the meniscus' },
      { key: 'B', text: 'Meniscal body extrusion in millimeters' },
      { key: 'C', text: 'Length of the tear in centimeters' },
      { key: 'D', text: 'Distance from the tibial spine in mm' },
    ],
    correctAnswer: 'B',
    explanation:
      'Extrusion measurement quantifies the functional impact of the root tear. It is the single most important quantitative measurement to include and directly influences clinical decision-making.',
  },
  {
    id: 'q11-pre',
    domain: 'cartilage',
    prePostMapping: 'parallel-pre',
    parallelId: 'q11',
    stem: 'Which MRI finding most strongly suggests instability of an osteochondral defect (OCD)?',
    options: [
      { key: 'A', text: 'Low signal on T1-weighted images' },
      { key: 'B', text: 'Fluid-equivalent signal at the fragment interface extending behind the fragment' },
      { key: 'C', text: 'Mild surrounding marrow edema' },
      { key: 'D', text: 'Location on the medial femoral condyle' },
    ],
    correctAnswer: 'B',
    explanation:
      'A fluid-equivalent rim extending behind the OCD fragment on T2/PD FS sequences is the most specific MRI sign of instability. Other signs include cartilage breach, large cysts (>5mm), and displaced fragments.',
  },
  {
    id: 'q11-post',
    domain: 'cartilage',
    prePostMapping: 'parallel-post',
    parallelId: 'q11',
    stem: 'A 15-year-old athlete has an osteochondral lesion of the medial femoral condyle with fluid signal at the interface. Compared to an adult, how should you interpret this finding?',
    options: [
      { key: 'A', text: 'It definitively proves instability regardless of age' },
      { key: 'B', text: 'Interface hyperintensity is less specific in juveniles (open physes); use a combination of signs and symptoms' },
      { key: 'C', text: 'It is always a normal finding in growing bone' },
      { key: 'D', text: 'Only subchondral cysts matter for stability in juveniles' },
    ],
    correctAnswer: 'B',
    explanation:
      'In juveniles with open physes, interface hyperintensity can be seen in stable lesions, making MRI less specific. Use a combination of signs (fluid rim, cysts, cartilage breach, fragment displacement) plus clinical correlation.',
  },

  // ─── Pre-Only (2 questions) ─────────────────────────────────────────

  {
    id: 'q12',
    domain: 'search-pattern',
    prePostMapping: 'pre-only',
    stem: 'What is the primary purpose of using a systematic search pattern when reading knee MRIs?',
    options: [
      { key: 'A', text: 'To make the report longer and more thorough' },
      { key: 'B', text: 'To ensure management-changing findings are not missed' },
      { key: 'C', text: 'To impress the referring clinician' },
      { key: 'D', text: 'To reduce total reading time' },
    ],
    correctAnswer: 'B',
    explanation:
      'A systematic search pattern is a safety net that prevents satisfaction of search\u2014stopping after finding the primary diagnosis\u2014which is the most common reason significant findings are missed.',
  },
  {
    id: 'q13',
    domain: 'search-pattern',
    prePostMapping: 'pre-only',
    stem: 'What is the most common reason a significant finding is missed on knee MRI?',
    options: [
      { key: 'A', text: 'The MRI was performed on a low-field-strength magnet' },
      { key: 'B', text: 'The finding was subtle across all sequences' },
      { key: 'C', text: 'Satisfaction of search\u2014stopping after finding the primary diagnosis' },
      { key: 'D', text: 'The patient moved during the scan' },
    ],
    correctAnswer: 'C',
    explanation:
      'Satisfaction of search is the most common cognitive error in imaging interpretation. A systematic checklist approach prevents this by ensuring all structures are evaluated regardless of the primary finding.',
  },

  // ─── Post-Only (2 questions) ────────────────────────────────────────

  {
    id: 'q14',
    domain: 'menisci-bucket-handle',
    prePostMapping: 'post-only',
    stem: 'A bucket-handle meniscal tear is identified. The report should specifically address all of the following EXCEPT:',
    options: [
      { key: 'A', text: 'Fragment location (e.g., displaced into intercondylar notch)' },
      { key: 'B', text: 'Donor site identification' },
      { key: 'C', text: 'Whether the fragment appears unstable/displaced' },
      { key: 'D', text: 'Signal intensity of the contralateral meniscus' },
    ],
    correctAnswer: 'D',
    explanation:
      'For bucket-handle tears, report the fragment location, identify the donor site, and describe instability/displacement. Contralateral meniscus signal intensity is not relevant to the current tear management.',
  },
  {
    id: 'q15',
    domain: 'anatomy',
    prePostMapping: 'post-only',
    stem: 'Which of the following is a normal anatomic variant that can mimic a peripheral lateral meniscal tear?',
    options: [
      { key: 'A', text: 'Ramp lesion' },
      { key: 'B', text: 'Popliteal hiatus' },
      { key: 'C', text: 'Medial meniscal root tear' },
      { key: 'D', text: 'Segond fracture' },
    ],
    correctAnswer: 'B',
    explanation:
      'The popliteal hiatus is a normal gap in the lateral meniscal periphery where the popliteus tendon passes. It can mimic a peripheral tear. Meniscofemoral ligaments (Humphrey/Wrisberg) can also create pseudotear appearances.',
  },
];
