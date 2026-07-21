export interface TeachingImage {
  src: string;
  alt: string;
  caption: string;
  attribution: string;
  step?: number;
}

export interface TeachingStack {
  id: string;
  title: string;
  plane: string; // e.g. "Sagittal PD FS"
  caption?: string;
  attribution: string;
  sourceUrl?: string;
  slices: { src: string; alt: string }[];
  step?: number; // which search-pattern step this stack maps to
}

export interface CaseMetadata {
  id: string;
  title: string;
  difficulty: 'foundational' | 'intermediate' | 'advanced';
  tier: 'core' | 'advanced';
  clinicalScenario: string;
  keyDiagnoses: string[];
  tags: string[];
  radiopaediaUrl: string;
  radiopaediaTitle: string;
  modelReport: {
    findings: string;
    impression: string;
  };
  teachingPoints: string[];
  searchPatternFindings: {
    step: number;
    stepName: string;
    expectedFindings: string[];
  }[];
  teachingImages?: TeachingImage[];
  teachingStacks?: TeachingStack[];
  residentVisible: boolean;
}

export const caseRegistry: CaseMetadata[] = [
  {
    id: 'degenerative-knee-oa',
    title: 'Degenerative Knee — Tricompartmental Osteoarthritis',
    difficulty: 'foundational',
    tier: 'core',
    residentVisible: true,
    clinicalScenario:
      'A 62-year-old retired teacher with progressive bilateral knee pain, worse on the right, for 3 years. Pain is worse with stairs and prolonged walking. BMI 31. No history of trauma. Physical exam shows bilateral varus alignment, small cool effusions, crepitus with ROM, and decreased flexion (0-120°).',
    keyDiagnoses: [
      'Tricompartmental osteoarthritis, most severe medial compartment',
      'Complex degenerative medial meniscal tear with 5mm extrusion',
      'Baker cyst',
      'Mucoid degeneration of ACL',
    ],
    tags: ['osteoarthritis', 'degenerative', 'meniscal degeneration', 'cartilage loss', 'subchondral changes', 'alignment'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/osteoarthritis-of-the-knee-3',
    radiopaediaTitle: 'Osteoarthritis of the knee (MRI)',
    modelReport: {
      findings:
        'BONES AND MARROW: Subchondral sclerosis and cyst formation in the medial compartment involving both the medial femoral condyle and medial tibial plateau. Marginal osteophytes arising from the medial femoral condyle, medial tibial plateau, and patellofemoral joint. No acute fracture. Varus alignment noted on coronal images.\n\nCARTILAGE: Grade 4 (full-thickness) cartilage loss along the medial femoral condyle weight-bearing surface with exposed subchondral bone. Grade 3 cartilage loss at the medial tibial plateau. Grade 2-3 changes in the patellofemoral joint with thinning and fissuring of the trochlear and patellar cartilage. Lateral compartment relatively preserved with Grade 1-2 changes.\n\nMENISCI: Complex degenerative tear of the posterior horn of the medial meniscus with a horizontal cleavage component. Medial meniscal extrusion measuring 5mm beyond the tibial margin on coronal images. Degenerative signal within the lateral meniscus body without a definite tear extending to an articular surface. It is important to distinguish degenerative intrasubstance signal from a surgically significant tear.\n\nLIGAMENTS: ACL is intact but demonstrates mucoid degeneration with increased intrasubstance signal on all sequences and thickened appearance. PCL is normal. MCL shows mild nonspecific periligamentous signal along its deep fibers, likely related to chronic medial-compartment degeneration and osteophyte change (note: a varus knee tensions the LATERAL collateral, not the MCL). LCL is normal.\n\nEXTENSOR MECHANISM: Moderate patellar tendinosis with thickening and intermediate signal in the proximal patellar tendon. Trochlear cartilage thinning as noted above. Quadriceps tendon is intact.\n\nSYNOVIUM AND BURSAE: Moderate joint effusion. Baker cyst measuring 3.5 cm in greatest dimension communicating with the joint via the posteromedial capsule. Mild synovial thickening. No loose bodies identified.',
      impression:
        '1. Advanced medial compartment osteoarthritis with full-thickness cartilage loss and subchondral changes.\n2. Complex degenerative tear of the posterior horn of the medial meniscus with 5 mm extrusion, in the setting of severe medial compartment degeneration.\n3. Moderate patellofemoral osteoarthritis.\n4. Baker cyst, likely reactive.\n5. Mucoid ACL degeneration — ligament functionally intact.',
    },
    teachingPoints: [
      'Degenerative meniscal tears in the setting of OA rarely benefit from arthroscopic surgery — multiple RCTs show no benefit over physical therapy.',
      'Meniscal extrusion >3mm is a marker of root tear or severe degeneration and correlates with accelerated OA progression.',
      'Mucoid ACL degeneration is common in OA knees and should not be reported as an ACL tear.',
      'Subchondral cysts (geodes) are thought to form either by synovial-fluid intrusion through damaged cartilage or by microfracture/necrosis of denuded subchondral bone (bony-contusion theory); the exact mechanism remains debated.',
      'When reporting OA, describe compartment-by-compartment severity to help surgical planning (unicompartmental vs total knee arthroplasty).',
      'Baker cysts are commonly secondary to intra-articular pathology, so look for an underlying cause.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: [
        'Right knee, standard sequences',
        'Varus alignment visible on coronal images',
      ] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: [
        'Subchondral sclerosis and cyst formation in medial compartment',
        'Marginal osteophytes medial femoral condyle, medial tibial plateau, and patellofemoral joint',
        'No acute fracture',
      ] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: [
        'Grade 4 (full-thickness) cartilage loss medial femoral condyle weight-bearing surface',
        'Grade 3 cartilage loss medial tibial plateau',
        'Grade 2-3 changes patellofemoral joint',
        'Lateral compartment relatively preserved (Grade 1-2)',
      ] },
      { step: 4, stepName: 'Menisci', expectedFindings: [
        'Complex degenerative tear posterior horn medial meniscus with horizontal cleavage component and meniscal extrusion (5mm)',
        'Degenerative signal lateral meniscus body without definite tear',
        'Distinguish degenerative signal from surgical tear',
      ] },
      { step: 5, stepName: 'Ligaments', expectedFindings: [
        'ACL intact but shows mucoid degeneration (increased signal, thickened)',
        'PCL normal',
        'Mild nonspecific deep-MCL periligamentous signal (chronic medial-compartment degeneration; a varus knee tensions the LCL, not the MCL)',
        'LCL normal',
      ] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: [
        'Moderate patellar tendinosis',
        'Trochlear cartilage thinning',
        'Quad tendon intact',
      ] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: [
        'Moderate joint effusion',
        'Baker cyst (3.5 cm) communicating with joint',
        'Mild synovial thickening',
        'No loose bodies',
      ] },
    ],
    teachingImages: [
      {
        src: '/images/teaching/cases/baker-cyst/baker_cyst_sagittal.jpg',
        alt: 'Baker cyst on sagittal MRI',
        caption: 'Baker cyst on sagittal PD FS — bright fluid-filled collection in the posteromedial knee, extending distally (arrow).',
        attribution: 'Feiler & Rosenberg, Cureus, 2025. PMC11828661. CC-BY 4.0.',
        step: 7,
      },
      {
        src: '/images/teaching/cases/baker-cyst/baker_cyst_axial.jpg',
        alt: 'Baker cyst neck on ultrasound',
        caption: 'Baker cyst on ultrasound — the characteristic cyst neck (arrow) between the medial head of gastrocnemius and the semimembranosus tendon.',
        attribution: 'Feiler & Rosenberg, Cureus, 2025. PMC11828661. CC-BY 4.0.',
        step: 7,
      },
    ],
  },
  {
    id: 'acl-pivot-shift',
    title: 'ACL Tear + Pivot-Shift Pattern',
    difficulty: 'foundational',
    tier: 'core',
    residentVisible: true,
    clinicalScenario:
      'A 22-year-old soccer player presents with acute knee pain and instability after a noncontact pivoting injury during a game. The knee swelled rapidly within 2 hours.',
    keyDiagnoses: [
      'Complete ACL tear',
      'Pivot-shift bone contusion pattern',
      'Possible lateral meniscal root tear',
    ],
    tags: ['acl', 'pivot-shift', 'bone-bruise', 'meniscus', 'acute-injury'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/pivot-shift-injury-of-the-knee-anterior-cruciate-ligament-rupture',
    radiopaediaTitle: 'Pivot shift injury of the knee - ACL rupture',
    modelReport: {
      findings: 'ACL: Complete discontinuity of the ACL with abnormal signal and morphology. The ligament fibers are lax and irregular.\n\nBones/Marrow: Characteristic pivot-shift contusion pattern with marrow edema at the posterolateral tibial plateau and lateral femoral condyle sulcus terminalis region.\n\nMenisci: Evaluate carefully for lateral meniscal posterior root tear and medial meniscal ramp lesion (peripheral tear at meniscocapsular junction).\n\nCartilage: No focal cartilage defects. Subchondral contusion without collapse.\n\nOther ligaments: MCL, LCL, PCL intact. No posterolateral corner injury.\n\nEffusion: Large joint effusion (hemarthrosis); no fat-fluid level — a lipohemarthrosis would require an intra-articular fracture, which is absent here.',
      impression: '1. Complete ACL tear with classic pivot-shift bone contusion pattern (LFC + posterolateral tibial plateau).\n2. Carefully evaluate for associated meniscal injuries (root tear, ramp lesion, bucket-handle) which are commonly associated.\n3. Large hemarthrosis; no fat-fluid level to indicate an intra-articular fracture.',
    },
    teachingPoints: [
      'The pivot-shift contusion pattern (LFC + posterolateral tibial plateau) is the most common bone bruise pattern and is strongly associated with ACL tears.',
      'When you see this contusion pattern, you MUST search for: (1) ACL tear, (2) lateral meniscal root tear, (3) ramp lesion, (4) bucket-handle tear.',
      'A Segond fracture (lateral capsular avulsion) is highly specific for associated ACL injury and should prompt direct ACL assessment.',
      'Lipohemarthrosis (fat-fluid level on axial images) indicates an intra-articular fracture.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Large joint effusion (hemarthrosis)', 'No fat-fluid level (a lipohemarthrosis would indicate an intra-articular fracture)'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['Marrow edema at posterolateral tibial plateau', 'Marrow edema at lateral femoral condyle (sulcus terminalis)', 'No fracture or subchondral collapse'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['No focal cartilage defects', 'Contusion without chondral injury'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Evaluate lateral meniscal posterior root', 'Evaluate for ramp lesion at meniscocapsular junction', 'Check for bucket-handle tear'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['Complete ACL tear — discontinuity, abnormal signal', 'PCL intact', 'MCL and LCL intact'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Quadriceps and patellar tendons intact'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['Soft tissue edema laterally', 'Check for Segond fracture (lateral capsular avulsion)'] },
    ],
    teachingImages: [
      {
        src: '/images/teaching/cases/acl-pivot-shift/02_ACL_Complete_Tear_Sagittal.jpg',
        alt: 'Complete ACL tear on sagittal MRI',
        caption: 'Complete ACL tear — abnormal angulation, mid-substance rupture',
        attribution: 'Al Mohammad & Gharaibeh, Orthop Res Rev, 2024. PMC11463185. CC-BY-NC 3.0.',
        step: 5,
      },
      {
        src: '/images/teaching/cases/acl-pivot-shift/acl_variant_A.jpg',
        alt: 'ACL tear variant — sagittal PD FS',
        caption: 'ACL tear appearance variant 1 — discontinuous fibers, abnormal signal.',
        attribution: 'Al Mohammad & Gharaibeh, Orthop Res Rev, 2024. PMC11463185. CC-BY-NC 3.0.',
        step: 5,
      },
      {
        src: '/images/teaching/cases/acl-pivot-shift/acl_variant_C.jpg',
        alt: 'ACL tear variant — sagittal MRI',
        caption: 'ACL tear appearance variant 2 — bulky proximal stump.',
        attribution: 'Al Mohammad & Gharaibeh, Orthop Res Rev, 2024. PMC11463185. CC-BY-NC 3.0.',
        step: 5,
      },
      {
        src: '/images/teaching/cases/acl-pivot-shift/acl_tear_sagittal.jpg',
        alt: 'ACL tear sagittal view',
        caption: 'ACL tear on sagittal PD FS with fibers lax and wavy.',
        attribution: 'Al Mohammad & Gharaibeh, Orthop Res Rev, 2024. PMC11463185. CC-BY-NC 3.0.',
        step: 5,
      },
      {
        src: '/images/teaching/cases/acl-pivot-shift/acl_tear_coronal.jpg',
        alt: 'ACL tear coronal view',
        caption: 'ACL tear on coronal — disrupted ligament in intercondylar notch.',
        attribution: 'Al Mohammad & Gharaibeh, Orthop Res Rev, 2024. PMC11463185. CC-BY-NC 3.0.',
        step: 5,
      },
      {
        src: '/images/teaching/cases/acl-pivot-shift/acl_coronal.jpg',
        alt: 'ACL attachment on coronal proton-density',
        caption: 'Coronal PD — empty notch sign at ACL attachment site (arrow).',
        attribution: 'Al Mohammad & Gharaibeh, Orthop Res Rev, 2024. PMC11463185. CC-BY-NC 3.0.',
        step: 5,
      },
      {
        src: '/images/teaching/cases/acl-pivot-shift/acl_pcl_buckling.jpg',
        alt: 'Anterior tibial translation measurement on sagittal MRI',
        caption: 'Anterior tibial translation — the tibia is displaced anteriorly relative to the femur (measured here, 15.4 mm); a secondary sign of ACL deficiency.',
        attribution: 'Al Mohammad & Gharaibeh, Orthop Res Rev, 2024. PMC11463185. CC-BY-NC 3.0.',
        step: 5,
      },
      {
        src: '/images/teaching/cases/acl-pivot-shift/acl_kissing_contusions.jpg',
        alt: 'Pivot-shift kissing contusions',
        caption: 'Pivot-shift kissing contusions — anterior LFC + posterolateral tibial plateau (arrows).',
        attribution: 'Al Mohammad & Gharaibeh, Orthop Res Rev, 2024. PMC11463185. CC-BY-NC 3.0.',
        step: 2,
      },
      {
        src: '/images/teaching/cases/acl-pivot-shift/acl_blumensaat_angle.jpg',
        alt: "Blumensaat's angle on sagittal MRI",
        caption: "Blumensaat's angle — useful when assessing ACL graft orientation and position.",
        attribution: 'Al Mohammad & Gharaibeh, Orthop Res Rev, 2024. PMC11463185. CC-BY-NC 3.0.',
        step: 5,
      },
      {
        src: '/images/teaching/cases/acl-pivot-shift/04_ACL_Secondary_Signs.jpg',
        alt: 'Coronal view of the ACL tibial attachment',
        caption: 'Coronal image through the intercondylar notch — abnormal signal at the ACL tibial attachment (arrow). The sagittal secondary signs (anterior tibial translation, deep lateral femoral notch, PCL buckling) are assessed on sagittal images.',
        attribution: 'Al Mohammad & Gharaibeh, Orthop Res Rev, 2024. PMC11463185. CC-BY-NC 3.0.',
        step: 5,
      },
      {
        src: '/images/teaching/cases/acl-pivot-shift/05_ACL_Bone_Contusion_Pattern.jpg',
        alt: 'Bone contusion pattern with ACL tear',
        caption: 'Bone contusion — posterolateral tibial plateau + LFC',
        attribution: 'Al Mohammad & Gharaibeh, Orthop Res Rev, 2024. PMC11463185. CC-BY-NC 3.0.',
        step: 2,
      },
      {
        src: '/images/teaching/modules/module7-ligaments/23_ESSR_ACL_Tear_TibialTranslation.jpg',
        alt: 'ACL tear with anterior tibial translation',
        caption: 'ACL tear + anterior tibial translation',
        attribution: 'ESSR Practice Recommendations, Eur Radiol, 2024. PMC11399221. CC-BY 4.0.',
        step: 5,
      },
      {
        src: '/images/teaching/modules/module4-bones/35_BoneContusion_PivotShift_Sagittal.jpg',
        alt: 'Pivot-shift contusion on sagittal MRI',
        caption: 'Pivot-shift contusion — LFC + posterolateral tibial plateau',
        attribution: 'JCDR, 2016. PMC4866212. CC-BY-NC 3.0.',
        step: 2,
      },
    ],
  },
  {
    id: 'patellar-dislocation-mpfl',
    title: 'Patellar Dislocation + MPFL Tear',
    difficulty: 'foundational',
    tier: 'core',
    residentVisible: true,
    clinicalScenario:
      'A 17-year-old basketball player reports that the knee "popped out" while cutting and spontaneously reduced. There is medial tenderness and a moderate effusion.',
    keyDiagnoses: [
      'Transient lateral patellar dislocation',
      'MPFL tear',
      'Osteochondral injury with possible loose body',
    ],
    tags: ['patellofemoral', 'mpfl', 'dislocation', 'osteochondral', 'loose-body'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/recent-patella-dislocation-mri-1',
    radiopaediaTitle: 'Recent patella dislocation (MRI)',
    modelReport: {
      findings: 'Patellofemoral: Lateral patellar subluxation/tilt. Characteristic bone contusion pattern at the medial patellar facet and anterolateral aspect of the lateral femoral condyle ("kissing contusions").\n\nMPFL: Complete tear of the medial patellofemoral ligament at its femoral insertion with surrounding edema. Medial retinacular disruption.\n\nCartilage: Osteochondral injury at the medial patellar facet with possible chondral shear fragment. Evaluate for loose body in the joint.\n\nPredisposing factors: Assess trochlear morphology (dysplasia?), patella alta (Insall-Salvati ratio), and TT-TG distance.\n\nEffusion: Moderate joint effusion.',
      impression: '1. Transient lateral patellar dislocation with characteristic kissing contusions (medial patella + anterolateral LFC).\n2. Complete MPFL tear at femoral insertion.\n3. Osteochondral injury at medial patellar facet — evaluate for loose body.\n4. Assess predisposing anatomy (trochlear dysplasia, patella alta).',
    },
    teachingPoints: [
      'The patellar dislocation contusion pattern is medial patellar facet + anterolateral LFC — these are "kissing contusions."',
      'The MPFL tear site is variable — on MRI it is most often patellar-sided (~47%), with femoral (adductor-tubercle) and mid-substance tears also common; inspect both ends. Femoral-sided tears carry higher recurrence risk.',
      'Always look for osteochondral fragments and loose bodies after patellar dislocation.',
      'Report predisposing factors: trochlear dysplasia, patella alta, increased TT-TG distance, and lateral patellar tilt / excessive lateral patellar translation.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Moderate to large effusion', 'Possible hemarthrosis'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['Contusion at medial patellar facet', 'Contusion at anterolateral aspect of the lateral femoral condyle', 'Assess trochlear morphology'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Osteochondral defect at medial patella', 'Search for loose body in joint recesses', 'Evaluate trochlear cartilage'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Menisci typically intact in patellar dislocation'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['MPFL tear — locate the site (femoral, midsubstance, or patellar)', 'Medial retinacular disruption', 'Cruciate and collateral ligaments intact'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Assess patella alta (Insall-Salvati ratio)', 'Vastus medialis obliquus edema'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['Medial soft tissue edema and swelling', 'Lateral patellar tilt or subluxation'] },
    ],
    teachingImages: [
      {
        src: '/images/teaching/cases/patellar-dislocation/pd_mpfl_tear_axial.jpg',
        alt: 'MPFL tear with kissing contusions on axial MRI',
        caption: 'MPFL tear (blue arrow) + kissing contusions (white arrow = medial patella, red arrow = anterolateral LFC).',
        attribution: 'Garrison et al., Cureus, 2019. PMC6384034. CC-BY 3.0.',
        step: 5,
      },
      {
        src: '/images/teaching/cases/patellar-dislocation/patellar-dislocation-contusions-axial.jpg',
        alt: 'Kissing bone contusions of lateral patellar dislocation on axial MRI',
        caption: "Axial MRI — the 'kissing' bone-contusion pattern of lateral patellar dislocation: paired marrow edema at the medial patellar facet and the lateral femoral condyle (stars, panel B), with avulsion of the MPFL from the femur (panel A, arrow).",
        attribution: 'Tsai CH et al., J Orthop Surg Res 2012;7:21, Fig 2. PMC3511801. CC BY.',
        step: 2,
      },
      {
        src: '/images/teaching/cases/patellar-dislocation/pd_osteochondral_fragment.jpg',
        alt: 'Osteochondral fragment after patellar dislocation',
        caption: 'Post-relocation knee with a joint effusion — always scan every recess for a displaced osteochondral fragment, a common companion of patellar dislocation.',
        attribution: 'Garrison et al., Cureus, 2019. PMC6384034. CC-BY 3.0.',
        step: 3,
      },
      {
        src: '/images/teaching/cases/patellar-dislocation/40_BoneContusion_PatellarDislocation.jpg',
        alt: 'Kissing contusions from patellar dislocation',
        caption: 'Patellar dislocation — kissing contusions (medial patella + anterolateral LFC)',
        attribution: 'JCDR, 2016. PMC4866212. CC-BY-NC 3.0.',
        step: 2,
      },
      {
        src: '/images/teaching/cases/patellar-dislocation/41_PatellarDislocation_MPFL_Tear_Axial.jpg',
        alt: 'MPFL tear on axial MRI',
        caption: 'MPFL tear on axial MRI',
        attribution: 'Cureus, 2019. PMC6384034. CC-BY 3.0.',
        step: 5,
      },
      {
        src: '/images/teaching/cases/patellar-dislocation/lateral-patellar-dislocation-axial.jpg',
        alt: 'Frank lateral patellar dislocation on axial MRI',
        caption: 'Axial MRI — frank lateral patellar dislocation: the patella is displaced laterally off the trochlea (white arrow), with bony avulsion of the MPFL (purple arrow) and a shallow, dysplastic trochlea (red arrow).',
        attribution: 'Mohan K et al., Cureus 2018;10(12):e3730, Fig 2. PMC6384034. CC BY.',
        step: 6,
      },
    ],
  },
  {
    id: 'medial-root-tear',
    title: 'Medial Meniscal Root Tear',
    difficulty: 'intermediate',
    tier: 'core',
    residentVisible: false,
    clinicalScenario:
      'A 55-year-old recreational runner presents with worsening medial knee pain over 3 months without a specific traumatic event. Weight-bearing radiographs show mild medial joint space narrowing.',
    keyDiagnoses: [
      'Posterior medial meniscal root tear',
      'Medial meniscal extrusion',
      'Early medial compartment overload',
    ],
    tags: ['meniscus', 'root-tear', 'extrusion', 'degenerative', 'medial-compartment'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/meniscal-root-tear-annotated-mri',
    radiopaediaTitle: 'Meniscal root tear (annotated MRI)',
    modelReport: {
      findings: 'Menisci: Complete radial tear at the posterior root attachment of the medial meniscus. The "ghost meniscus" sign is present on sagittal images — the posterior horn signal is absent at the root attachment level. Coronal images demonstrate meniscal extrusion >3mm beyond the tibial margin.\n\nBones/Marrow: Subchondral marrow edema at the medial femoral condyle and medial tibial plateau consistent with early overload. No subchondral fracture line.\n\nCartilage: Grade 2-3 chondral thinning in the medial compartment, weight-bearing surfaces.\n\nLigaments: All ligaments intact.\n\nEffusion: Small joint effusion.',
      impression: '1. Posterior medial meniscal root tear — functionally equivalent to total meniscectomy.\n2. Meniscal extrusion >3mm indicating loss of hoop stress.\n3. Early medial compartment overload with subchondral edema and cartilage thinning.\n4. Clinical correlation for surgical candidacy (root repair vs conservative management).',
    },
    teachingPoints: [
      'A root tear is functionally equivalent to a total meniscectomy — loss of hoop stress leads to accelerated compartment degeneration.',
      'The "ghost meniscus" sign: at the posterior root attachment the normally uniformly low-signal (black) meniscus is replaced by intermediate/high signal and is poorly defined or not visualized — a faint "ghost" rather than a discrete black triangle. Confirm with the radial cleft/defect on coronal and axial images.',
      'Meniscal extrusion >3mm on coronal images is a secondary sign of root tear.',
      'Root tears are often missed — the posterior root attachment is a mandatory check area on every knee MRI.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Small joint effusion'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['Subchondral marrow edema medial femoral condyle', 'Subchondral edema medial tibial plateau', 'No subchondral fracture line'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Grade 2-3 chondral thinning medial compartment', 'Lateral and patellofemoral compartments preserved'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Posterior medial meniscal root tear (ghost meniscus sign)', 'Meniscal extrusion >3mm on coronal images', 'Lateral meniscus intact'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['All ligaments intact'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Extensor mechanism intact'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['No significant periarticular findings'] },
    ],
    teachingImages: [
      {
        src: '/images/teaching/cases/meniscal-root-tear/32_KneeMRI_Medial_Root_Tear_Coronal.jpg',
        alt: 'Medial meniscal root tear on coronal MRI',
        caption: 'Medial meniscal root tear — sequential coronal images (A–C) with a correlating sagittal image (D).',
        attribution: 'Sports Health, 2013. PMC3548666. CC-BY-NC 3.0.',
        step: 4,
      },
      {
        src: '/images/teaching/cases/meniscal-root-tear/33_KneeMRI_Lateral_Root_Tear_GhostMeniscus.jpg',
        alt: 'Ghost meniscus sign of a posterior root tear (lateral example)',
        caption: 'Ghost meniscus sign of a posterior root tear. This published example is a LATERAL root tear; this case is a MEDIAL root tear — the sign looks the same, but the finding sits at the medial root, anteromedial to the PCL.',
        attribution: 'Sports Health, 2013. PMC3548666. CC-BY-NC 3.0.',
        step: 4,
      },
    ],
  },
  {
    id: 'pcl-plc-dashboard',
    title: 'PCL + PLC Dashboard Injury',
    difficulty: 'intermediate',
    tier: 'core',
    residentVisible: false,
    clinicalScenario:
      'A 28-year-old presents after a motor vehicle accident with dashboard mechanism. There is posterior sag of the tibia on exam and posterolateral tenderness.',
    keyDiagnoses: [
      'PCL tear',
      'Posterolateral corner injury',
      'Dashboard bone contusion pattern',
    ],
    tags: ['pcl', 'plc', 'dashboard', 'multiligament', 'mva'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/posterolateral-corner-injury-of-the-knee-1',
    radiopaediaTitle: 'Posterolateral corner injury of the knee',
    modelReport: {
      findings: 'PCL: Complete tear with abnormal signal intensity and loss of normal taut morphology. The ligament is thickened and lax.\n\nBones/Marrow: Dashboard contusion pattern — marrow edema at the anterior proximal tibia from the direct blow mechanism.\n\nPosterolateral corner: Edema and partial tearing of the LCL. Abnormal signal in the popliteus tendon at its femoral origin. Disruption of the popliteofibular ligament and arcuate ligament complex.\n\nMenisci: Medial and lateral menisci intact.\n\nACL: Intact. MCL: Intact.\n\nEffusion: Moderate joint effusion.',
      impression: '1. Complete PCL tear with dashboard contusion pattern (anterior tibial marrow edema).\n2. Posterolateral corner injury involving the LCL, popliteus tendon, and popliteofibular ligament.\n3. Combined PCL + PLC injury — surgical consultation recommended as untreated PLC injuries lead to graft failure.\n4. ACL and MCL intact.',
    },
    teachingPoints: [
      'The dashboard contusion pattern (anterior proximal tibia) results from a posteriorly directed force on the flexed knee — think PCL injury.',
      'PLC injuries are present in up to 60% of PCL ruptures — always evaluate the posterolateral corner when you see a PCL tear.',
      'PLC structures to evaluate: LCL, popliteus tendon, popliteofibular ligament, arcuate ligament, biceps femoris.',
      'Unrecognized PLC injury is possibly the most common IDENTIFIABLE cause of ACL and PCL reconstruction graft failure — always address it, because residual posterolateral/varus laxity overloads the cruciate graft. (The most common cause of ACL graft failure overall is technical error, chiefly femoral tunnel malposition.)',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Moderate joint effusion'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['Dashboard contusion: anterior proximal tibial marrow edema', 'No fracture'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Cartilage intact'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Medial and lateral menisci intact'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['Complete PCL tear', 'LCL partial tear', 'Popliteus tendon abnormal signal', 'Popliteofibular ligament disruption', 'ACL intact', 'MCL intact'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Extensor mechanism intact'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['Posterolateral soft tissue edema', 'Evaluate popliteal fossa for vascular injury'] },
    ],
    teachingImages: [
      {
        src: '/images/teaching/cases/pcl-plc/31_KneeMRI_PCL_Intrasubstance_Tear.jpg',
        alt: 'PCL intrasubstance tear',
        caption: 'PCL intrasubstance tear',
        attribution: 'Sports Health, 2013. PMC3548666. CC-BY-NC 3.0.',
        step: 5,
      },
      {
        src: '/images/teaching/modules/module4-bones/38_BoneContusion_Dashboard_Sagittal.jpg',
        alt: 'Dashboard bone contusion pattern',
        caption: 'Dashboard injury — proximal tibia edema',
        attribution: 'JCDR, 2016. PMC4866212. CC-BY-NC 3.0.',
        step: 2,
      },
    ],
    teachingStacks: [
      {
        id: 'normal-pcl-pd-fs',
        title: 'Normal PCL (baseline)',
        plane: 'Sagittal PD FS',
        caption: 'Intact PCL — uniformly dark, taut, continuous posterior arc from medial femoral condyle to posterior tibia.',
        attribution: 'Wilson KJ et al., J Exp Orthop, 2019. PMC6538732. CC-BY 4.0.',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6538732/',
        slices: [
          { src: '/images/teaching/stacks/pcl-tear/normal-pd-fs_slice_1.jpg', alt: 'Normal PCL sagittal PD FS, slice 1 of 3' },
          { src: '/images/teaching/stacks/pcl-tear/normal-pd-fs_slice_2.jpg', alt: 'Normal PCL sagittal PD FS, slice 2 of 3' },
          { src: '/images/teaching/stacks/pcl-tear/normal-pd-fs_slice_3.jpg', alt: 'Normal PCL sagittal PD FS, slice 3 of 3' },
        ],
        step: 5,
      },
      {
        id: 'torn-pcl-pd-fs',
        title: 'PCL tear',
        plane: 'Sagittal PD FS',
        caption: 'Intrasubstance PCL tear — thickened, increased T2 signal, loss of normal taut morphology (arrow on central slice).',
        attribution: 'Wilson KJ et al., J Exp Orthop, 2019. PMC6538732. CC-BY 4.0.',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6538732/',
        slices: [
          { src: '/images/teaching/stacks/pcl-tear/torn-pd-fs_slice_1.jpg', alt: 'Torn PCL sagittal PD FS, slice 1 of 3' },
          { src: '/images/teaching/stacks/pcl-tear/torn-pd-fs_slice_2.jpg', alt: 'Torn PCL sagittal PD FS, slice 2 of 3 (arrow at tear)' },
          { src: '/images/teaching/stacks/pcl-tear/torn-pd-fs_slice_3.jpg', alt: 'Torn PCL sagittal PD FS, slice 3 of 3' },
        ],
        step: 5,
      },
    ],
  },
  {
    id: 'bucket-handle',
    title: 'Bucket-Handle Meniscal Tear',
    difficulty: 'foundational',
    tier: 'core',
    residentVisible: true,
    clinicalScenario:
      'A 30-year-old presents with a locked knee after a twisting injury. The patient is unable to fully extend the knee. There is a moderate effusion and joint line tenderness.',
    keyDiagnoses: [
      'Bucket-handle meniscal tear with displaced fragment',
      'Double PCL sign',
      'Donor site identification',
    ],
    tags: ['meniscus', 'bucket-handle', 'locked-knee', 'displaced-fragment', 'mechanical-block'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/bucket-handle-medial-meniscus-tear-with-double-pcl-sign',
    radiopaediaTitle: 'Bucket handle medial meniscus tear with double PCL sign',
    modelReport: {
      findings: 'Menisci: Bucket-handle tear of the medial meniscus. The displaced inner fragment is flipped into the intercondylar notch, lying anteroinferior to the PCL creating the "double PCL sign" on sagittal images. The donor site shows a truncated and blunted posterior horn (absent bow-tie sign on consecutive sagittal slices). The "fragment in notch" sign is present on coronal images.\n\nACL: Evaluate carefully — ACL tears coexist in a substantial minority of bucket-handle tears (reported ~10–50%, varying with medial vs lateral location and acuity).\n\nEffusion: Moderate joint effusion.\n\nBones: No significant marrow edema.',
      impression: '1. Bucket-handle tear of the medial meniscus with displaced fragment into the intercondylar notch.\n2. Double PCL sign and absent bow-tie sign confirm the diagnosis.\n3. Evaluate ACL integrity — commonly associated injury.\n4. Mechanical block explains the locked knee presentation.',
    },
    teachingPoints: [
      'The "double PCL sign" is highly specific for a MEDIAL-meniscus bucket-handle tear WHEN THE ACL IS INTACT — the intact ACL holds the flipped fragment beneath the PCL, mimicking a second PCL. If the ACL is torn the fragment is less constrained and may not lie in this position, so always confirm ACL integrity.',
      'The absent "bow tie" sign: normally you see 2 consecutive sagittal slices with a bow-tie shaped meniscal body. If fewer, suspect a bucket-handle tear.',
      'The "fragment in notch" sign on coronal images shows the displaced meniscal fragment in the intercondylar notch.',
      'Bucket-handle tears are the most common cause of a mechanically locked knee in young patients.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Moderate joint effusion'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['May have pivot-shift contusions if associated ACL tear', 'Otherwise minimal bone edema'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['No primary cartilage injury'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Displaced meniscal fragment in intercondylar notch', 'Double PCL sign on sagittal images', 'Absent bow-tie sign', 'Fragment in notch sign on coronal images', 'Identify donor site (truncated posterior horn)'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['Evaluate ACL — associated tear in a substantial minority (~10–50%, higher for lateral than medial bucket-handle tears)', 'PCL intact (but appears to have a "companion")'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Intact'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['No significant periarticular findings'] },
    ],
    teachingImages: [
      {
        src: '/images/teaching/cases/bucket-handle/bh_donor_site.jpg',
        alt: 'Bucket-handle donor site on sagittal MRI',
        caption: 'Bucket-handle donor site — truncated posterior horn (arrow). Fragment has migrated elsewhere.',
        attribution: 'Nacey NC et al., Cureus, 2023. PMC10493472. CC-BY 4.0.',
        step: 4,
      },
      {
        src: '/images/teaching/cases/bucket-handle/bh_sagittal_tear.jpg',
        alt: 'Bucket-handle fragment in intercondylar notch',
        caption: 'Displaced meniscal fragment sitting in the intercondylar notch (arrow).',
        attribution: 'Nacey NC et al., Cureus, 2023. PMC10493472. CC-BY 4.0.',
        step: 4,
      },
      {
        src: '/images/teaching/cases/bucket-handle/bh_displaced_fragment.jpg',
        alt: 'Displaced bucket-handle fragment',
        caption: 'Displaced bucket-handle fragment flipped anteriorly (arrow).',
        attribution: 'Nacey NC et al., Cureus, 2023. PMC10493472. CC-BY 4.0.',
        step: 4,
      },
      {
        src: '/images/teaching/cases/bucket-handle/bh_double_pcl_sign.jpg',
        alt: 'Double PCL sign',
        caption: 'Double PCL sign — displaced meniscal fragment anteroinferior to the native PCL, mimicking a second PCL (arrow).',
        attribution: 'Nacey NC et al., Cureus, 2023. PMC10493472. CC-BY 4.0.',
        step: 4,
      },
      {
        src: '/images/teaching/cases/bucket-handle/bh_axial_fragment.jpg',
        alt: 'Bucket-handle fragment on axial MRI',
        caption: 'Axial PD FS — meniscal fragment in intercondylar notch (arrow).',
        attribution: 'Nacey NC et al., Cureus, 2023. PMC10493472. CC-BY 4.0.',
        step: 4,
      },
      {
        src: '/images/teaching/cases/bucket-handle/bh_axial_double_pcl.jpg',
        alt: 'Axial view of double PCL sign',
        caption: 'Axial view — native PCL (blue arrow) + displaced fragment (red arrow) in the intercondylar notch.',
        attribution: 'Nacey NC et al., Cureus, 2023. PMC10493472. CC-BY 4.0.',
        step: 4,
      },
      {
        src: '/images/teaching/cases/bucket-handle/08_Meniscus_Complex_Tear_Sagittal.jpg',
        alt: 'Complex meniscal tear on sagittal MRI',
        caption: 'Complex meniscal tear — two parallel vertical longitudinal tears',
        attribution: 'Insights Imaging, 2016. PMC4877346. CC-BY 4.0.',
        step: 4,
      },
    ],
  },
  {
    id: 'ocd-stability',
    title: 'OCD Stability Assessment',
    difficulty: 'intermediate',
    tier: 'core',
    residentVisible: false,
    clinicalScenario:
      'A 16-year-old multi-sport athlete presents with activity-related medial knee pain for 4 months. Radiographs show an osteochondral lesion at the medial femoral condyle. Physes remain open.',
    keyDiagnoses: [
      'Juvenile osteochondritis dissecans (OCD)',
      'Stability assessment with juvenile-specific criteria',
      'Possible loose body',
    ],
    tags: ['ocd', 'cartilage', 'juvenile', 'stability', 'loose-body'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/juvenile-osteochondritis-dissecans-unstable',
    radiopaediaTitle: 'Juvenile osteochondritis dissecans - unstable',
    modelReport: {
      findings: 'Cartilage/Osteochondral: Well-defined osteochondral lesion at the classic location — lateral aspect of the medial femoral condyle. The fragment measures approximately 15 x 10 mm. High T2 signal rim surrounds the fragment, extending to the articular surface (rim sign). A thin line of fluid signal is seen between the fragment and the parent bone.\n\nStability assessment: The high signal rim sign and fluid between fragment and parent bone suggest instability. Evaluate for secondary signs: cyst-like lesions beneath the fragment, disruption of the overlying cartilage.\n\nBones: Open physes consistent with juvenile form.\n\nEffusion: Small joint effusion. Evaluate for loose bodies in joint recesses.',
      impression: '1. Juvenile OCD of the medial femoral condyle (classic location) with MRI signs suggesting instability.\n2. Rim sign and fluid interface between fragment and parent bone — unstable fragment.\n3. Open physes — juvenile form, which has better healing potential than adult OCD.\n4. No definite loose body identified. Small effusion.',
    },
    teachingPoints: [
      'Classic OCD location: lateral aspect of the medial femoral condyle (~70–80% of cases).',
      'Adult (De Smet) MRI instability criteria: (1) high-T2 rim at the fragment–parent-bone interface, (2) fluid (matching fluid signal) undercutting the fragment, (3) cyst-like lesions beneath the fragment, (4) a focal articular-cartilage breach. JUVENILE caveat: in skeletally immature patients the high-T2 rim alone is unreliable — it can be vascular granulation tissue in a STABLE lesion — and counts toward instability only when the high signal matches fluid intensity or a second low-signal line/secondary sign is present.',
      'Juvenile OCD (open physes) has better healing potential than adult OCD — but unstable fragments still often need surgery.',
      'Always measure the lesion size and report stability features — this directly drives surgical decision-making.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Small joint effusion', 'Search for loose bodies in all recesses'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['OCD lesion at lateral aspect of MFC', 'Assess fragment size', 'Open physes (juvenile form)', 'Surrounding marrow edema'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Evaluate overlying cartilage integrity', 'Rim sign (high T2 signal around fragment)', 'Fluid between fragment and parent bone', 'Cyst-like lesions beneath fragment'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Menisci typically intact'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['All ligaments intact'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Intact'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['No significant periarticular findings'] },
    ],
    teachingImages: [
      {
        src: '/images/teaching/cases/ocd/ocd_medial_femoral_condyle_t1_t2.jpg',
        alt: 'Osteochondritis dissecans of the medial femoral condyle on coronal T1 and T2 MRI',
        caption: 'Juvenile OCD of the medial femoral condyle — T1 (left) shows the osteochondral defect with subchondral disruption; T2 (right) highlights bone-marrow edema, consistent with an active lesion (arrows).',
        attribution: 'Rodas et al., Cureus, 2025. PMC12331197. CC-BY 4.0.',
      },
    ],
  },
  {
    id: 'sifk-sonk',
    title: 'SIFK / SONK',
    difficulty: 'intermediate',
    tier: 'advanced',
    residentVisible: true,
    clinicalScenario:
      'A 68-year-old woman presents with sudden onset of severe medial knee pain without a specific traumatic event. She has difficulty bearing weight and exam reveals medial femoral condyle tenderness.',
    keyDiagnoses: [
      'Subchondral insufficiency fracture of the knee (SIFK)',
      'Subchondral fracture line',
      'Associated meniscal pathology',
    ],
    tags: ['sifk', 'sonk', 'insufficiency-fracture', 'marrow-edema', 'medial-compartment'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/subchondral-insufficiency-fracture-of-the-knee-with-meniscal-root-tear',
    radiopaediaTitle: 'Subchondral insufficiency fracture of the knee with meniscal root tear',
    modelReport: {
      findings: 'Bones/Marrow: Extensive marrow edema centered at the weight-bearing surface of the medial femoral condyle. A low signal subchondral fracture line is present on T1 and T2 sequences, running parallel to the articular surface. Early subchondral flattening/collapse may be present.\n\nCartilage: Overlying articular cartilage is relatively preserved at the medial femoral condyle — a key feature distinguishing early SIFK from primary osteoarthritis.\n\nMenisci: Associated posterior medial meniscal root tear with meniscal extrusion — this is a common association with SIFK.\n\nLigaments: Intact.\n\nEffusion: Small to moderate joint effusion.',
      impression: '1. Subchondral insufficiency fracture of the medial femoral condyle (SIFK/SONK) with subchondral fracture line and extensive marrow edema.\n2. Evaluate for early subchondral collapse which worsens prognosis.\n3. Associated posterior medial meniscal root tear — common association that contributes to accelerated degeneration.\n4. Differentiate from OCD (younger patients, different location) and AVN (different signal pattern).',
    },
    teachingPoints: [
      'SIFK (formerly SONK) is NOT true osteonecrosis — it is a subchondral insufficiency fracture that may progress to secondary osteonecrosis.',
      'The key MRI finding is a low-signal subchondral fracture line on T1, surrounded by extensive marrow edema.',
      'SIFK is strongly associated with posterior medial meniscal root tears — always check the root.',
      'Differential diagnosis: OCD (younger; classically the lateral aspect of the medial femoral condyle), AVN (bilateral, multifocal), stress fracture (linear orientation).',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Small to moderate effusion'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['Extensive marrow edema medial femoral condyle', 'Subchondral fracture line (low T1 signal)', 'Assess for subchondral collapse/flattening'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Overlying cartilage relatively preserved (distinguishes early SIFK from OA)', 'Assess for chondral fissuring/collapse'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Check for posterior medial meniscal root tear', 'Meniscal extrusion measurement', 'This association is commonly present'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['Ligaments intact'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Intact'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['No significant periarticular findings'] },
    ],
    teachingImages: [
      {
        src: '/images/teaching/cases/sifk-sonk/sifk_coronal.jpg',
        alt: 'SIFK with subchondral fracture line on coronal MRI',
        caption: 'SIFK coronal — subchondral fracture line (arrow) with surrounding marrow edema (asterisk).',
        attribution: 'Hirschmann A et al., Jpn J Radiol, 2022. PMC9068663. CC-BY 4.0.',
        step: 2,
      },
      {
        src: '/images/teaching/cases/sifk-sonk/sifk_sagittal.jpg',
        alt: 'SIFK on sagittal MRI',
        caption: 'SIFK sagittal — subchondral fracture plane with extensive marrow edema (asterisk) and overlying cartilage preserved.',
        attribution: 'Hirschmann A et al., Jpn J Radiol, 2022. PMC9068663. CC-BY 4.0.',
        step: 2,
      },
      {
        src: '/images/teaching/cases/sifk-sonk/26_ESSR_SIFK_SubchondralFracture_Edema.jpg',
        alt: 'SIFK with subchondral fracture and edema',
        caption: 'SIFK — medial condyle edema + subchondral fracture line',
        attribution: 'ESSR Practice Recommendations, Eur Radiol, 2024. PMC11399221. CC-BY 4.0.',
        step: 2,
      },
    ],
  },
  {
    id: 'mcl-distal-avulsion',
    title: 'MCL Distal Avulsion',
    difficulty: 'intermediate',
    tier: 'core',
    residentVisible: true,
    clinicalScenario:
      'A 25-year-old skier presents after a valgus injury to the knee. There is medial-sided swelling extending distally and tenderness along the distal MCL insertion.',
    keyDiagnoses: [
      'Distal MCL avulsion (Stener-like lesion)',
      'Deep MCL vs superficial MCL involvement',
      'Possible associated medial meniscal injury',
    ],
    tags: ['mcl', 'collateral', 'valgus', 'avulsion', 'skiing-injury'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/medial-collateral-ligament-avulsion-injury',
    radiopaediaTitle: 'Medial collateral ligament avulsion injury',
    modelReport: {
      findings: 'MCL: Complete tear of the distal superficial MCL with retraction and displacement superficial to the pes anserinus tendons (Stener-like lesion). The torn distal fibers are folded back upon themselves. Deep MCL (meniscotibial ligament) is also disrupted with fluid at the meniscocapsular junction.\n\nMenisci: Peripheral tear at the posterior horn of the medial meniscus at the meniscocapsular junction (associated with deep MCL disruption).\n\nBones: Mild marrow edema at the medial tibial plateau. No fracture.\n\nACL/PCL/LCL: Intact.\n\nEffusion: Moderate joint effusion with extensive medial soft tissue edema.',
      impression: '1. Distal superficial MCL avulsion with Stener-like configuration (displaced superficial to pes anserinus) — this prevents healing and may require surgical repair.\n2. Deep MCL (meniscotibial ligament) disruption.\n3. Associated peripheral medial meniscal tear at meniscocapsular junction.\n4. Cruciates and lateral structures intact.',
    },
    teachingPoints: [
      'A Stener-like lesion of the MCL occurs when the torn distal superficial MCL is displaced superficial to the pes anserinus — this prevents healing.',
      'Always differentiate superficial MCL from deep MCL (meniscotibial/meniscofemoral ligaments) — deep MCL injuries affect meniscal stability.',
      'MCL injuries are graded 1-3: Grade 1 (edema, intact fibers), Grade 2 (partial tear), Grade 3 (complete disruption).',
      'Peripheral medial meniscal / meniscocapsular injury can accompany an MCL tear, because the deep MCL attaches to the meniscus (meniscofemoral and meniscotibial portions). Note: the eponymous "ramp lesion" of the posteromedial meniscocapsular junction is classically associated with ACL tears, not isolated MCL injury.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Moderate effusion', 'Extensive medial soft tissue edema'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['Mild medial tibial marrow edema', 'No fracture'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Cartilage intact'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Peripheral medial meniscal tear at meniscocapsular junction', 'Deep MCL disruption at meniscotibial level'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['Distal superficial MCL complete tear', 'Stener-like configuration (displaced over pes anserinus)', 'Deep MCL disruption', 'ACL, PCL, LCL intact'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Intact'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['Pes anserinus tendons — MCL displaced superficial to them', 'Medial subcutaneous edema'] },
    ],
    teachingImages: [
      {
        src: '/images/teaching/cases/mcl-avulsion/44_MCL_Injury_MRI_sMCL_dMCL.jpg',
        alt: 'MCL injury showing sMCL and dMCL on MRI',
        caption: 'MCL injury — sMCL on T1 + dMCL tear on T2',
        attribution: 'Arch Bone Jt Surg, 2021. PMC8221433. CC-BY-NC 4.0.',
        step: 5,
      },
    ],
  },
  {
    id: 'multiligament',
    title: 'Multiligament Knee Injury',
    difficulty: 'advanced',
    tier: 'advanced',
    residentVisible: false,
    clinicalScenario:
      'A 35-year-old motorcyclist presents after a high-energy accident with gross knee instability. Clinical exam suggests multiplanar laxity and the vascular status is being monitored.',
    keyDiagnoses: [
      'Knee dislocation (ACL + PCL tears)',
      'Posterolateral corner disruption',
      'Possible popliteal artery injury',
      'Multiple meniscal and chondral injuries',
    ],
    tags: ['multiligament', 'dislocation', 'acl', 'pcl', 'plc', 'vascular', 'high-energy'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/extensive-internal-derangement-of-the-knee',
    radiopaediaTitle: 'Extensive internal derangement of the knee',
    modelReport: {
      findings: 'ACL: Complete tear with full discontinuity.\n\nPCL: Complete tear — thickened, lax, with abnormal signal throughout.\n\nPosterolateral corner: Complete disruption of the LCL, popliteus tendon, and popliteofibular ligament. Biceps femoris tendon edema.\n\nMCL: High-grade partial tear.\n\nMenisci: Complex tear of the medial meniscus posterior horn. Lateral meniscus body tear.\n\nBones: Diffuse marrow edema medially and laterally. Possible periarticular fracture fragments.\n\nCartilage: Multiple chondral injuries.\n\nVascular: Evaluate for popliteal artery injury — signal abnormality in the popliteal fossa.\n\nEffusion: Large hemarthrosis.',
      impression: '1. Knee dislocation pattern with bicruciate tear (ACL + PCL).\n2. Posterolateral corner disruption (LCL, popliteus, popliteofibular ligament).\n3. MCL high-grade partial tear — this is a KD-IV multiligament knee injury (both cruciates plus both collaterals; the medial-side injury places it beyond KD-IIIL, which requires an intact MCL).\n4. Multiple meniscal and chondral injuries.\n5. CRITICAL: Recommend urgent vascular assessment of the popliteal artery if not already performed.',
    },
    teachingPoints: [
      'A knee dislocation is usually a bicruciate injury (ACL + PCL) and still counts when the knee has spontaneously reduced; the uncommon Schenck KD-I pattern is a documented tibiofemoral dislocation with only one cruciate torn.',
      'The Schenck (KD) classification: KD-I (single cruciate torn — ACL or PCL — with the other cruciate intact; ± collateral), KD-II (both cruciates, collaterals intact), KD-III (both cruciates + one collateral; IIIM = medial, IIIL = lateral), KD-IV (both cruciates + both collaterals), KD-V (fracture-dislocation).',
      'Popliteal artery injury can be occult in knee dislocation — urgent vascular assessment is required; CTA/MRA is appropriate when pulses, ABI, or clinical findings are abnormal or equivocal.',
      'Report every structure systematically — missing a PLC injury in a multiligament knee leads to graft failure.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Large hemarthrosis', 'Possible lipohemarthrosis'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['Diffuse marrow edema medially and laterally', 'Evaluate for periarticular fractures', 'Assess tibial eminence'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Multiple chondral injuries likely', 'Osteochondral fragments possible'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Medial and lateral meniscal tears likely', 'Complex tear patterns'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['ACL complete tear', 'PCL complete tear', 'LCL tear (PLC disruption)', 'Popliteus and popliteofibular ligament disruption', 'MCL tear — grade it'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Evaluate for associated extensor mechanism injury'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['CRITICAL: Evaluate popliteal artery', 'Peroneal nerve at risk with PLC injury', 'Diffuse soft tissue edema'] },
    ],
  },
  {
    id: 'patellar-tendon-rupture',
    title: 'Patellar Tendon Rupture',
    difficulty: 'foundational',
    tier: 'advanced',
    residentVisible: false,
    clinicalScenario:
      'A 32-year-old basketball player felt a pop and sharp pain while landing from a jump. He is unable to perform a straight leg raise. Patella alta is suspected on lateral radiograph.',
    keyDiagnoses: [
      'Complete patellar tendon rupture',
      'Patella alta',
      'Possible bony avulsion fragment from the inferior patellar pole',
    ],
    tags: ['extensor-mechanism', 'patellar-tendon', 'rupture', 'patella-alta', 'sports-injury'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/patellar-tendon-rupture-complete',
    radiopaediaTitle: 'Patellar tendon rupture - complete',
    modelReport: {
      findings: 'Extensor mechanism: Complete rupture of the patellar tendon at its proximal attachment (inferior pole of patella). The torn tendon is retracted distally and may form a "ball" of tissue. Gap between the inferior patella and the proximal tendon stump filled with fluid/hemorrhage.\n\nPatella: Patella alta — the patella rides superiorly due to loss of the distal tether. Insall-Salvati ratio markedly elevated.\n\nQuadriceps tendon: Intact but assess carefully for concomitant injury.\n\nBones: Possible small avulsion fragment from the inferior pole of the patella.\n\nEffusion: Moderate joint effusion with prepatellar and infrapatellar soft tissue edema.',
      impression: '1. Complete patellar tendon rupture at its proximal attachment with tendon retraction.\n2. Patella alta secondary to the tendon rupture.\n3. Intact quadriceps tendon.\n4. This is an urgent extensor-mechanism injury — early primary repair (ideally within ~2–3 weeks, before tendon retraction) is recommended; delayed repair (past ~6 weeks) often requires graft augmentation or reconstruction.',
    },
    teachingPoints: [
      'Patellar tendon rupture is more common in patients <40; quadriceps tendon rupture is more common >40.',
      'Patella alta (high-riding patella) is a hallmark of patellar tendon rupture — measure the Insall-Salvati ratio (normal ~1.0, alta >1.2).',
      'Risk factors: prior tendinopathy, corticosteroid injections, fluoroquinolone use, diabetes, renal disease.',
      'Always evaluate the quadriceps tendon as well — combined injuries can occur.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Moderate effusion', 'Prepatellar and infrapatellar soft tissue edema'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['Patella alta', 'Possible inferior patellar pole avulsion fragment', 'Measure Insall-Salvati ratio'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Patellar cartilage — assess for pre-existing chondromalacia'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Menisci typically intact'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['Cruciate and collateral ligaments intact'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Complete patellar tendon rupture', 'Tendon retraction and gap', 'Quadriceps tendon — intact or injured?', 'Patella alta confirmed'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['Hoffa fat pad edema', 'Subcutaneous edema anteriorly'] },
    ],
    teachingImages: [
      {
        src: '/images/teaching/cases/patellar-tendon-rupture/patellar_tendon_rupture_sagittal_t2.jpg',
        alt: 'Patellar tendon rupture on sagittal T2 MRI',
        caption: 'Patellar tendon rupture (illustrative) — sagittal T2 shows tendon discontinuity at the distal tibial-tubercle insertion. Rupture can occur at either end; this case describes the more common proximal (inferior-pole) avulsion.',
        attribution: 'Pagdal et al., Cureus, 2021. PMC8547195. CC-BY 4.0.',
      },
    ],
  },
  {
    id: 'post-repair-retear',
    title: 'Post-Meniscus Repair Re-tear',
    difficulty: 'advanced',
    tier: 'advanced',
    residentVisible: false,
    clinicalScenario:
      'A 24-year-old presents 18 months after a medial meniscal repair with new onset of mechanical symptoms and medial joint line pain. The prior repair was performed at the time of ACL reconstruction.',
    keyDiagnoses: [
      'Meniscal re-tear at repair site',
      'Differentiation of healing signal vs re-tear',
      'ACL graft integrity assessment',
    ],
    tags: ['meniscus', 'post-surgical', 'retear', 'repair', 'acl-reconstruction'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/lateral-meniscal-tear-primary-repair',
    radiopaediaTitle: 'Meniscal repair — pre- and post-operative MRI (lateral-meniscus example illustrating post-repair appearance)',
    modelReport: {
      findings: 'Menisci: Post-surgical changes at the medial meniscus with suture artifacts. At the prior repair site, there is recurrent linear high signal extending to the articular surface on proton density sequences. The signal pattern and morphology are concerning for re-tear rather than expected post-repair signal.\n\nACL graft: The ACL graft is intact with low signal throughout. The tibial and femoral tunnels are appropriately positioned. No tunnel widening.\n\nPost-repair signal interpretation: increased intrameniscal/surface signal can persist for many months after a successful repair, so persistent grade-3 signal alone is not diagnostic of re-tear. Re-tear is favored here by the morphology together with fluid-signal extending into the tear, particularly with new mechanical symptoms; comparison with prior post-operative imaging is ideal.\n\nEffusion: Small to moderate effusion.',
      impression: '1. Findings concerning for meniscal re-tear at the prior repair site — surface-reaching (grade 3) signal with fluid extending into the tear, in the setting of recurrent mechanical symptoms; comparison with prior post-operative imaging would strengthen the assessment.\n2. ACL graft intact with appropriate tunnel positions.\n3. Clinical correlation recommended — arthroscopic evaluation may be indicated for definitive diagnosis.',
    },
    teachingPoints: [
      'Post-repair meniscal MRI interpretation is challenging: grade 3 signal within 6 months may be normal healing, but new or persistent signal after 12 months with symptoms suggests re-tear.',
      'Clinical correlation is essential — MRI alone cannot always distinguish healing signal from re-tear.',
      'Conventional MRI has REDUCED specificity after meniscal repair, because persistent intrasubstance or surface-reaching (grade 3) signal can mimic re-tear even in a healed meniscus. Findings that raise confidence for a true re-tear include displaced fragments, fluid-signal extending into the tear, or new grade-3 signal compared with priors; MR arthrography (contrast imbibing into the tear) is the standard problem-solver. Symptom correlation raises pre-test probability but does not give a fixed accuracy figure.',
      'Always evaluate the ACL graft when assessing a post-repair meniscus — graft integrity affects meniscal healing.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Small to moderate effusion'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['ACL graft tunnel positions', 'No significant marrow edema'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Evaluate for interval chondral changes'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Recurrent signal at repair site', 'Grade 3 signal extending to articular surface', 'Suture artifacts', 'Compare to prior imaging if available'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['ACL graft — signal, tension, continuity', 'Tunnel position assessment', 'No tunnel widening'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Intact'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['Post-surgical changes', 'No new findings'] },
    ],
  },
  {
    id: 'acl-graft-evaluation',
    title: 'ACL Graft Evaluation',
    difficulty: 'advanced',
    tier: 'advanced',
    residentVisible: false,
    clinicalScenario:
      'A 26-year-old presents 10 months after ACL reconstruction with a hamstring autograft. The patient reports a feeling of instability with cutting activities and a recent episode of giving way.',
    keyDiagnoses: [
      'ACL graft failure assessment',
      'Tunnel position evaluation',
      'Possible graft impingement or re-tear',
    ],
    tags: ['acl', 'graft', 'post-surgical', 'reconstruction', 'instability'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/anterior-cruciate-ligament-graft-tear',
    radiopaediaTitle: 'Anterior cruciate ligament graft tear',
    modelReport: {
      findings: 'ACL graft: The hamstring autograft demonstrates abnormal increased signal on all sequences with loss of the normal taut, low-signal morphology. There is discontinuity of the graft fibers in the mid-substance. The graft appears lax with anterior tibial translation.\n\nTunnel assessment: The femoral tunnel is positioned slightly anterior — this tends to make the graft non-isometric (excessively tight in flexion) and is a recognized contributor to graft stretch/failure. The tibial tunnel position appears acceptable, so roof (intercondylar-notch) impingement — which results from an anteriorly placed TIBIAL tunnel — is not expected here. Mild tunnel widening noted.\n\nBones: Pivot-shift contusion pattern (LFC + posterolateral tibial plateau) indicating re-injury mechanism.\n\nMenisci: Evaluate for new meniscal tears — common with re-injury.\n\nEffusion: Moderate joint effusion.',
      impression: '1. ACL graft failure with complete graft tear (abnormal signal, discontinuity, laxity).\n2. Pivot-shift bone contusion pattern indicating re-injury through the same mechanism.\n3. Femoral tunnel may be slightly anterior — a contributing factor to graft over-tensioning and failure (an anterior tibial tunnel, not femoral, would be the cause of roof impingement).\n4. Evaluate menisci for new injuries associated with the instability episode.\n5. Revision ACL reconstruction consultation recommended.',
    },
    teachingPoints: [
      'A normal ACL graft should be uniformly low signal on all sequences by 12-24 months post-operatively.',
      'Between 6-12 months, the graft undergoes "ligamentization" and may show intermediate signal — this is normal.',
      'Key signs of graft failure: increased signal on all sequences, discontinuity, laxity, anterior tibial translation.',
      'Tunnel malposition is a leading technical cause of graft failure: an anterior TIBIAL tunnel causes roof (notch) impingement, while a too-anterior FEMORAL tunnel makes the graft non-isometric (excessively tight in flexion), predisposing to stretch and failure.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Moderate effusion', 'Possible cyclops lesion (anterior interval nodule)'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['Pivot-shift contusion if re-injury', 'Tunnel positions (femoral and tibial)', 'Tunnel widening assessment'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Interval chondral changes', 'Assess for new osteochondral injury'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['New meniscal tears with instability episode', 'Prior meniscal surgery changes'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['ACL graft: signal, continuity, tension', 'Anterior tibial translation', 'Graft impingement by roof or cyclops lesion', 'Other ligaments — PCL, MCL, LCL'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Intact', 'Patellar tendon donor site (if BTB graft)'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['Hardware artifacts', 'Tunnel cysts', 'Post-surgical changes'] },
    ],
  },
];

export const coreCases = caseRegistry.filter(c => c.tier === 'core');
export const advancedCases = caseRegistry.filter(c => c.tier === 'advanced');
