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
        'BONES AND MARROW: Subchondral sclerosis and cyst formation in the medial compartment involving both the medial femoral condyle and medial tibial plateau. Marginal osteophytes at the medial and patellofemoral compartments. No acute fracture. Medial-compartment overload pattern; the true mechanical axis cannot be quantified on this limited-field, non-weight-bearing MRI.\n\nCARTILAGE: Modified Outerbridge grade IV (full-thickness) cartilage loss along the weight-bearing medial femoral condyle with exposed subchondral bone. Grade III loss at the medial tibial plateau. Grade II-III patellofemoral thinning and fissuring. Lateral compartment relatively preserved with grade I-II changes.\n\nMENISCI: Complex degenerative posterior-horn medial meniscal tear with a horizontal component. Medial extrusion measures 5 mm beyond the tibial margin (excluding osteophytes). Degenerative signal in the lateral meniscal body without a surface-reaching tear.\n\nLIGAMENTS: ACL fibers remain continuous but are thickened with a celery-stalk appearance of mucoid degeneration; functional stability requires clinical examination. PCL is normal. Mild nonspecific signal along the deep MCL likely relates to chronic medial-compartment degeneration/osteophytes. LCL is normal.\n\nEXTENSOR MECHANISM: Moderate proximal patellar tendinosis with thickening and intermediate signal. Quadriceps tendon is intact.\n\nSYNOVIUM AND BURSAE: Moderate joint effusion. Baker cyst measuring 3.5 cm, communicating through the posteromedial gastrocnemius-semimembranosus bursa. Mild synovial thickening. No loose bodies identified.',
      impression:
        '1. Advanced medial-compartment osteoarthritis with full-thickness cartilage loss and subchondral changes.\n2. Complex degenerative posterior-horn medial meniscal tear with 5 mm extrusion.\n3. Moderate patellofemoral osteoarthritis.\n4. Baker cyst.\n5. Mucoid ACL degeneration with continuous fibers and no MRI secondary signs of insufficiency; correlate with stability examination.',
    },
    teachingPoints: [
      'For degenerative meniscal tears with osteoarthritis, arthroscopic partial meniscectomy generally does not improve pain or function over structured nonoperative care in randomized trials; true mechanical locking and other selected indications require separate clinical judgment.',
      'At least 3 mm is a conventional major medial-extrusion threshold. It should trigger a root/radial-tear and cartilage search, but extrusion is not specific for a root tear and should be reported as a continuous measurement.',
      'Mucoid ACL degeneration is common in OA knees and should not be reported as an ACL tear.',
      'Subchondral cysts (geodes) are thought to form either by synovial-fluid intrusion through damaged cartilage or by microfracture/necrosis of denuded subchondral bone (bony-contusion theory); the exact mechanism remains debated.',
      'When reporting OA, describe compartment-by-compartment severity to help surgical planning (unicompartmental vs total knee arthroplasty).',
      'Baker cysts are commonly secondary to intra-articular pathology, so look for an underlying cause.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: [
        'Right knee, standard sequences',
        'Medial-compartment overload pattern; quantify mechanical axis with standing long-leg radiographs if needed',
      ] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: [
        'Subchondral sclerosis and cyst formation in medial compartment',
        'Marginal osteophytes medial femoral condyle, medial tibial plateau, and patellofemoral joint',
        'No acute fracture',
      ] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: [
        'Modified Outerbridge grade IV loss at medial femoral condyle weight-bearing surface',
        'Modified Outerbridge grade III loss at medial tibial plateau',
        'Modified Outerbridge grade II-III patellofemoral changes',
        'Lateral compartment relatively preserved (grade I-II)',
      ] },
      { step: 4, stepName: 'Menisci', expectedFindings: [
        'Complex degenerative tear posterior horn medial meniscus with horizontal cleavage component and meniscal extrusion (5mm)',
        'Degenerative signal lateral meniscus body without definite tear',
        'Distinguish intrasubstance degeneration from a surface-reaching tear',
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
    ],
    tags: ['acl', 'pivot-shift', 'bone-bruise', 'meniscus', 'acute-injury'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/pivot-shift-injury-with-acl-tear?lang=us',
    radiopaediaTitle: 'Pivot shift injury with ACL tear',
    modelReport: {
      findings: 'ACL: Complete discontinuity of the ACL with abnormal signal and morphology. The ligament fibers are lax and irregular.\n\nBones/Marrow: Characteristic pivot-shift contusion pattern with marrow edema-like signal at the posterolateral tibial plateau and lateral femoral condyle sulcus terminalis region. No fracture line or articular collapse is identified.\n\nMenisci: Evaluate carefully for lateral posterior-root injury and a medial ramp lesion.\n\nCartilage: No focal cartilage defects.\n\nOther ligaments: MCL, LCL, PCL intact. No posterolateral-corner injury.\n\nEffusion: Large hemarthrosis without a fat-fluid level. Absence of lipohemarthrosis does not by itself exclude fracture; no fracture is identified on the available images.',
      impression: '1. Complete ACL tear with classic pivot-shift bone contusion pattern (LFC + posterolateral tibial plateau).\n2. Carefully evaluate for associated meniscal injuries (root tear, ramp lesion, bucket-handle) which are commonly associated.\n3. Large hemarthrosis; no fat-fluid level to indicate an intra-articular fracture.',
    },
    teachingPoints: [
      'The pivot-shift contusion pattern (lateral femoral condyle + posterolateral tibial plateau) is a common bone-bruise pattern in acute ACL injury.',
      'When this contusion pattern is present, directly assess the ACL and systematically search for associated lateral-root, ramp, and displaced meniscal tears.',
      'A Segond fracture (lateral capsular avulsion) is highly specific for associated ACL injury and should prompt direct ACL assessment.',
      'In acute nonoperative trauma, lipohemarthrosis strongly indicates an intra-articular fracture; its absence does not exclude one.',
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
      findings: 'Patellofemoral: Lateral patellar subluxation/tilt. Characteristic bone contusion pattern at the medial patellar facet and anterolateral aspect of the lateral femoral condyle ("kissing contusions").\n\nMPFL: Complete tear of the medial patellofemoral ligament at its femoral insertion with surrounding edema. Medial retinacular disruption.\n\nCartilage: Osteochondral injury at the medial patellar facet with possible chondral shear fragment. Evaluate for loose body in the joint.\n\nPredisposing factors: Assess trochlear morphology, patellar height with a named index, and TT-TG with modality and measurement method stated; do not apply the CT-derived 20 mm threshold mechanically to MRI.\n\nEffusion: Moderate joint effusion.',
      impression: '1. Transient lateral patellar dislocation with characteristic kissing contusions (medial patella + anterolateral LFC).\n2. Complete MPFL tear at femoral insertion.\n3. Osteochondral injury at medial patellar facet — evaluate for loose body.\n4. Assess predisposing anatomy (trochlear dysplasia, patella alta).',
    },
    teachingPoints: [
      'The patellar dislocation contusion pattern is medial patellar facet + anterolateral LFC — these are "kissing contusions."',
      'The MPFL tear site is variable — on MRI it is most often patellar-sided (~47%), with femoral (adductor-tubercle) and mid-substance tears also common; inspect both ends. Tear site does not reliably predict recurrence (a meta-analysis found no significant difference — femoral 37.6% vs patellar 32.3%, p=0.17); recurrence is driven more by trochlear dysplasia, patella alta, elevated TT-TG, and younger age.',
      'Always look for osteochondral fragments and loose bodies after patellar dislocation.',
      'Report predisposing factors: trochlear dysplasia, patella alta, increased TT-TG distance, and lateral patellar tilt / excessive lateral patellar translation.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Moderate to large effusion', 'Possible hemarthrosis'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['Contusion at medial patellar facet', 'Contusion at anterolateral aspect of the lateral femoral condyle', 'Assess trochlear morphology'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Osteochondral defect at medial patella', 'Search for loose body in joint recesses', 'Evaluate trochlear cartilage'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Menisci typically intact in patellar dislocation'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['MPFL tear — locate the site (femoral, midsubstance, or patellar)', 'Medial retinacular disruption', 'Cruciate and collateral ligaments intact'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Assess patellar height with a named, modality-appropriate index', 'Vastus medialis obliquus edema'] },
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
      findings: 'Menisci: Complete radial tear at the posterior root attachment of the medial meniscus. The sagittal ghost sign and direct coronal/axial root defect are present. Medial extrusion measures greater than 3 mm beyond the tibial margin, excluding osteophytes.\n\nBones/Marrow: Subchondral edema-like signal at the medial femoral condyle and medial tibial plateau, compatible with compartment overload. No discrete subchondral fracture line or collapse.\n\nCartilage: Modified Outerbridge grade II-III thinning in the weight-bearing medial compartment.\n\nLigaments: All ligaments intact.\n\nEffusion: Small joint effusion.',
      impression: '1. Complete posterior medial meniscal root-disrupting tear with major medial extrusion and loss of hoop-stress function.\n2. Early medial-compartment overload with subchondral edema-like signal and cartilage thinning; no discrete SIF line or collapse.\n3. Correlate clinically for treatment candidacy, integrating cartilage, alignment, chronicity, and patient factors.',
    },
    teachingPoints: [
      'A complete posterior medial root-disrupting tear can abolish hoop-stress function. Cadaveric contact mechanics approached total medial meniscectomy, but this comparison should not be generalized to every partial or lateral root abnormality.',
      'The "ghost meniscus" sign: at the posterior root attachment the normally uniformly low-signal (black) meniscus is replaced by intermediate/high signal and is poorly defined or not visualized — a faint "ghost" rather than a discrete black triangle. Confirm with the radial cleft/defect on coronal and axial images.',
      'Major medial extrusion (commonly ≥3 mm) is a secondary clue, not a diagnosis; exclude osteophytes and assess the root directly in multiple planes.',
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
      findings: 'PCL: Complete tear with fiber discontinuity, abnormal signal intensity, and loss of normal taut morphology. The torn fibers are thickened and lax.\n\nBones/Marrow: Dashboard contusion pattern — edema-like marrow signal at the anterior proximal tibia from the direct-blow mechanism.\n\nPosterolateral corner: Edema and partial tearing of the LCL. Abnormal signal in the popliteus tendon at its femoral origin. Disruption of the popliteofibular ligament and arcuate ligament complex.\n\nMenisci: Medial and lateral menisci intact.\n\nACL: Intact. MCL: Intact.\n\nEffusion: Moderate joint effusion.',
      impression: '1. Complete PCL tear with dashboard contusion pattern (anterior tibial marrow edema).\n2. Posterolateral corner injury involving the LCL, popliteus tendon, and popliteofibular ligament.\n3. Combined PCL + PLC injury warrants prompt specialist assessment; treatment depends on clinical instability, injury grade, chronicity, alignment, associated injuries, and patient goals.\n4. ACL and MCL intact.',
    },
    teachingPoints: [
      'The dashboard contusion pattern (anterior proximal tibia) results from a posteriorly directed force on the flexed knee — think PCL injury.',
      'PLC injuries are present in up to 60% of PCL ruptures — always evaluate the posterolateral corner when you see a PCL tear.',
      'PLC structures to evaluate: LCL, popliteus tendon, popliteofibular ligament, arcuate ligament, biceps femoris.',
      'An unrecognized PLC injury can leave posterolateral/varus laxity that overloads a cruciate graft. It is an important preventable contributor to reconstruction failure; tunnel malposition and other technical or biologic factors must also be assessed.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Moderate joint effusion'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['Dashboard contusion: anterior proximal tibial marrow edema', 'No fracture'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Cartilage intact'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Medial and lateral menisci intact'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['Complete PCL tear', 'LCL partial tear', 'Popliteus tendon abnormal signal', 'Popliteofibular ligament disruption', 'ACL intact', 'MCL intact'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Extensor mechanism intact'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['Posterolateral soft tissue edema', 'Inspect for gross neurovascular abnormality; routine knee MRI cannot provide vascular clearance'] },
    ],
    teachingImages: [
      {
        src: '/images/teaching/cases/pcl-plc/31_KneeMRI_PCL_Intrasubstance_Tear.jpg',
        alt: 'PCL intrasubstance tear',
        caption: 'Published partial/intrasubstance PCL-tear example illustrating abnormal thickening and internal signal. The teaching case describes a complete tear, which additionally requires fiber discontinuity.',
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
      impression: '1. Bucket-handle tear of the medial meniscus with displaced fragment into the intercondylar notch.\n2. Double-PCL and absent-bow-tie signs support the directly visualized displaced tear.\n3. Evaluate ACL integrity because concomitant injury can occur.\n4. The displaced fragment provides a structural correlate for the locked-knee presentation.',
    },
    teachingPoints: [
      'The double-PCL sign strongly supports a displaced medial-meniscal bucket-handle fragment anteroinferior to the native PCL. It is classically seen with an intact ACL; still assess ACL integrity directly and confirm the donor site and fragment in other planes.',
      'The absent-bow-tie sign is fewer than two consecutive body segments on standard-thickness sagittal images. It supports a displaced tear but is technique-dependent and has mimics, including prior meniscectomy and a small or variant meniscus.',
      'The "fragment in notch" sign on coronal images shows the displaced meniscal fragment in the intercondylar notch.',
      'A displaced bucket-handle tear is an important structural cause of a mechanically locked knee in a young patient; loose bodies, displaced osteochondral fragments, and other mechanical causes remain in the differential.',
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
    ],
    tags: ['ocd', 'cartilage', 'juvenile', 'stability', 'loose-body'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/juvenile-osteochondritis-dissecans-unstable',
    radiopaediaTitle: 'Juvenile osteochondritis dissecans - unstable',
    modelReport: {
      findings: 'Cartilage/Osteochondral: Well-defined 15 x 10 mm juvenile OCD lesion at the lateral aspect of the medial femoral condyle. A joint-fluid-equivalent interface rim is accompanied by an outer low-signal rim and multiple focal breaks in the subchondral plate; the overlying cartilage is focally breached.\n\nStability assessment: This combination satisfies juvenile-specific MRI criteria for instability. An isolated high-T2 rim would not be sufficient in a skeletally immature patient.\n\nBones: Open physes.\n\nEffusion: Small joint effusion. No displaced fragment or definite loose body.',
      impression: '1. Juvenile OCD of the medial femoral condyle with juvenile-specific MRI signs of instability (fluid-equivalent interface plus outer low-signal rim, multiple subchondral-plate breaks, and focal cartilage breach).\n2. Open physes confer greater healing potential than adult OCD but do not negate the instability findings.\n3. No displaced fragment or definite loose body.',
    },
    teachingPoints: [
      'Classic OCD location: lateral aspect of the medial femoral condyle (~70–80% of cases).',
      'Do not apply adult De Smet criteria unchanged to juvenile OCD. In juveniles, an isolated high-T2 rim is unreliable; specific signs include a fluid-equivalent rim with an outer low-signal rim, multiple subchondral-plate breaks, multiple or >5 mm cysts, cartilage breach, or displacement.',
      'Juvenile OCD with open physes generally has better healing potential, but treatment still incorporates stability, symptoms, lesion size/location, and response to nonoperative care.',
      'Measure lesion size and report age-specific stability features. Stability is central, but symptoms, skeletal maturity, lesion location, and response to nonoperative care also drive treatment.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Small joint effusion', 'Search for loose bodies in all recesses'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['OCD lesion at lateral aspect of MFC', 'Assess fragment size', 'Open physes (juvenile form)', 'Surrounding marrow edema'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Focal cartilage breach', 'Fluid-equivalent interface rim with outer low-signal rim', 'Multiple subchondral-plate breaks', 'No displaced fragment or definite loose body'] },
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
    title: 'Subchondral Insufficiency Fracture (SIF)',
    difficulty: 'intermediate',
    tier: 'advanced',
    residentVisible: true,
    clinicalScenario:
      'A 68-year-old woman presents with sudden onset of severe medial knee pain without a specific traumatic event. She has difficulty bearing weight and exam reveals medial femoral condyle tenderness.',
    keyDiagnoses: [
      'Subchondral insufficiency fracture of the knee (SIF)',
      'Subchondral fracture line',
      'Associated meniscal pathology',
    ],
    tags: ['sifk', 'sonk', 'insufficiency-fracture', 'marrow-edema', 'medial-compartment'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/subchondral-insufficiency-fracture-of-the-knee-with-meniscal-root-tear',
    radiopaediaTitle: 'Subchondral insufficiency fracture of the knee with meniscal root tear',
    modelReport: {
      findings: 'Bones/Marrow: Extensive edema-like marrow signal centered at the weight-bearing medial femoral condyle. A low-signal subchondral fracture line parallels the articular surface on T1- and fluid-sensitive images. The articular contour is preserved without subchondral flattening or collapse.\n\nCartilage: Overlying articular cartilage is relatively preserved at the medial femoral condyle, without advanced compartmental osteoarthritis at this site.\n\nMenisci: Associated posterior medial meniscal root tear with meniscal extrusion, a recognized contributor to medial-compartment overload in SIF.\n\nLigaments: Intact.\n\nEffusion: Small to moderate joint effusion.',
      impression: '1. Subchondral insufficiency fracture of the medial femoral condyle (SIF), with a subchondral fracture line and extensive surrounding edema-like signal.\n2. Preserved articular contour without subchondral collapse; report lesion dimensions and the size of any low-signal subchondral zone for prognosis.\n3. Associated posterior medial meniscal root tear and extrusion, contributing to compartment overload.\n4. Morphology and clinical context favor SIF over OCD or systemic osteonecrosis.',
    },
    teachingPoints: [
      'Many lesions formerly called SONK begin as subchondral insufficiency fracture. Some heal, while others develop secondary osteonecrosis (SIF-ON) and collapse.',
      'A subchondral low-signal line or band with surrounding edema-like signal strongly supports SIF, although the fracture line may be subtle or occult.',
      'SIF is associated with posterior medial meniscal root tears and extrusion; check the root, cartilage, compartment-overload pattern, and subchondral morphology together.',
      'Differential diagnosis: OCD favors a younger patient and characteristic location; systemic osteonecrosis favors a serpiginous geographic rim and relevant risk factors. Age alone is not diagnostic.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Small to moderate effusion'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['Extensive edema-like marrow signal at the medial femoral condyle', 'Subchondral fracture line (low signal on T1 and fluid-sensitive images)', 'Articular contour preserved without collapse'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Overlying cartilage relatively preserved', 'No advanced compartmental osteoarthritis or chondral collapse at the lesion'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Check for posterior medial meniscal root tear', 'Meniscal extrusion measurement', 'This association is commonly present'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['Ligaments intact'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Intact'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['No significant periarticular findings'] },
    ],
    teachingImages: [
      {
        src: '/images/teaching/cases/sifk-sonk/sifk_coronal.jpg',
        alt: 'SIF with subchondral fracture line on coronal MRI',
        caption: 'SIF coronal — subchondral fracture line (arrow) with surrounding edema-like signal (asterisk).',
        attribution: 'Hirschmann A et al., Jpn J Radiol, 2022. PMC9068663. CC-BY 4.0.',
        step: 2,
      },
      {
        src: '/images/teaching/cases/sifk-sonk/sifk_sagittal.jpg',
        alt: 'SIF on sagittal MRI',
        caption: 'SIF sagittal — subchondral fracture plane with extensive edema-like signal (asterisk) and preserved overlying cartilage.',
        attribution: 'Hirschmann A et al., Jpn J Radiol, 2022. PMC9068663. CC-BY 4.0.',
        step: 2,
      },
      {
        src: '/images/teaching/cases/sifk-sonk/26_ESSR_SIFK_SubchondralFracture_Edema.jpg',
        alt: 'SIF with subchondral fracture and edema-like signal',
        caption: 'SIF — medial-condyle edema-like signal plus a subchondral fracture line',
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
      impression: '1. Distal superficial MCL avulsion with Stener-like configuration, displaced superficial to the pes anserinus; interposition may impede spontaneous healing and alters treatment planning.\n2. Deep MCL (meniscotibial ligament) disruption.\n3. Associated peripheral medial meniscocapsular tear.\n4. Cruciates and lateral structures intact.',
    },
    teachingPoints: [
      'A Stener-like MCL lesion occurs when torn distal superficial fibers displace superficial to the pes anserinus; interposition may impede healing and should be highlighted for orthopedic planning.',
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
      'Popliteal artery injury must be urgently excluded',
      'Multiple meniscal and chondral injuries',
    ],
    tags: ['multiligament', 'dislocation', 'acl', 'pcl', 'plc', 'vascular', 'high-energy'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/extensive-internal-derangement-of-the-knee',
    radiopaediaTitle: 'Extensive internal derangement of the knee',
    modelReport: {
      findings: 'ACL: Complete tear with full discontinuity.\n\nPCL: Complete tear — thickened, lax, with abnormal signal throughout.\n\nPosterolateral corner: Complete disruption of the LCL, popliteus tendon, and popliteofibular ligament. Biceps femoris tendon edema.\n\nMCL: High-grade partial tear.\n\nMenisci: Complex tear of the medial meniscus posterior horn. Lateral meniscus body tear.\n\nBones: Diffuse edema-like marrow signal medially and laterally. Possible periarticular fracture fragments.\n\nCartilage: Multiple chondral injuries.\n\nPopliteal fossa: Perivascular edema/hematoma is present. Routine knee MRI does not establish arterial lumen patency or exclude an intimal injury.\n\nEffusion: Large hemarthrosis.',
      impression: '1. Knee-dislocation pattern with complete ACL and PCL tears.\n2. Complete posterolateral-corner disruption (LCL, popliteus, and popliteofibular ligament) plus high-grade partial MCL tear, constituting a KD-IV-pattern multiligament injury; final Schenck classification should integrate clinical and operative grading of both sides.\n3. Multiple meniscal and chondral injuries.\n4. CRITICAL: Urgent vascular assessment of the popliteal artery is required if not already completed; routine knee MRI cannot exclude an intimal or other luminal injury.',
    },
    teachingPoints: [
      'A knee dislocation is usually a bicruciate injury (ACL + PCL) and still counts when the knee has spontaneously reduced; the uncommon Schenck KD-I pattern is a documented tibiofemoral dislocation with only one cruciate torn.',
      'The Schenck (KD) classification: KD-I (single cruciate torn — ACL or PCL — with the other cruciate intact; ± collateral), KD-II (both cruciates, collaterals intact), KD-III (both cruciates + one collateral; IIIM = medial, IIIL = lateral), KD-IV (both cruciates + both collaterals), KD-V (fracture-dislocation).',
      'Popliteal artery injury can be occult after knee dislocation. Follow the trauma vascular pathway with serial examinations and ankle-brachial index (ABI); obtain CT angiography when pulses, ABI, or clinical findings are abnormal or equivocal. Routine knee MRI cannot clear the artery.',
      'Report every structure systematically. An unrecognized PLC injury can cause persistent instability and compromise a cruciate reconstruction.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Large hemarthrosis', 'Possible lipohemarthrosis'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['Diffuse marrow edema medially and laterally', 'Evaluate for periarticular fractures', 'Assess tibial eminence'] },
      { step: 3, stepName: 'Cartilage & Osteochondral', expectedFindings: ['Multiple chondral injuries likely', 'Osteochondral fragments possible'] },
      { step: 4, stepName: 'Menisci', expectedFindings: ['Medial and lateral meniscal tears likely', 'Complex tear patterns'] },
      { step: 5, stepName: 'Ligaments', expectedFindings: ['ACL complete tear', 'PCL complete tear', 'LCL tear (PLC disruption)', 'Popliteus and popliteofibular ligament disruption', 'MCL tear — grade it'] },
      { step: 6, stepName: 'Extensor Mechanism', expectedFindings: ['Evaluate for associated extensor mechanism injury'] },
      { step: 7, stepName: 'Synovium/Bursae & Other', expectedFindings: ['CRITICAL: Trigger urgent clinical vascular examination, ABI, and CT angiography when indicated; routine knee MRI cannot exclude arterial injury', 'Peroneal nerve at risk with PLC injury', 'Diffuse soft tissue edema'] },
    ],
  },
  {
    id: 'patellar-tendon-rupture',
    title: 'Patellar Tendon Rupture',
    difficulty: 'foundational',
    tier: 'advanced',
    residentVisible: false,
    clinicalScenario:
      'A 58-year-old man has anterior knee pain and swelling after a road-traffic injury. He has a palpable patellar-tendon defect and cannot actively extend the knee. Patella alta is present on the lateral radiograph.',
    keyDiagnoses: [
      'Complete distal patellar tendon avulsion from the tibial tubercle',
      'Patella alta',
    ],
    tags: ['extensor-mechanism', 'patellar-tendon', 'rupture', 'patella-alta', 'trauma'],
    radiopaediaUrl: 'https://radiopaedia.org/cases/patellar-tendon-rupture-complete',
    radiopaediaTitle: 'Patellar tendon rupture - complete',
    modelReport: {
      findings: 'Extensor mechanism: Complete avulsion of the distal patellar tendon from its tibial-tubercle insertion, with proximal retraction of the tendon and a fluid/hemorrhage-filled gap.\n\nPatella: High-riding patella from loss of the distal tether. Because the tendon is disrupted, do not rely on a formal Insall-Salvati measurement as though the tendon were intact.\n\nQuadriceps tendon: Intact.\n\nEffusion: Joint effusion with anterior soft-tissue edema.',
      impression: '1. Complete distal patellar tendon avulsion from the tibial tubercle, with retraction and patella alta.\n2. Intact quadriceps tendon.\n3. Prompt orthopedic evaluation is warranted for this extensor-mechanism disruption; timing and repair technique are clinical/surgical decisions.',
    },
    teachingPoints: [
      'Most patellar tendon ruptures occur at the inferior patellar attachment; distal tibial-tubercle avulsions are uncommon, so the report must state the exact tear level.',
      'Patella alta supports patellar tendon disruption, but a formal Insall-Salvati ratio assumes a measurable intact tendon and should not be used mechanically across a rupture gap.',
      'Risk factors: prior tendinopathy, corticosteroid injections, fluoroquinolone use, diabetes, renal disease.',
      'Always evaluate the quadriceps tendon as well — combined injuries can occur.',
    ],
    searchPatternFindings: [
      { step: 1, stepName: 'Verify & Orient', expectedFindings: ['Moderate effusion', 'Prepatellar and infrapatellar soft tissue edema'] },
      { step: 2, stepName: 'Bones & Marrow', expectedFindings: ['Patella alta', 'Assess the tibial tubercle for an osseous avulsion', 'Do not rely on Insall-Salvati across a disrupted tendon'] },
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
        caption: 'Complete distal patellar tendon avulsion — sagittal MRI shows discontinuity at the tibial-tubercle insertion with proximal tendon retraction.',
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
      'Post-repair meniscal signal can persist for years. New fluid-signal extension, changed morphology, a displaced fragment, and comparison with prior imaging are more useful than a fixed time cutoff.',
      'Clinical correlation is essential — MRI alone cannot always distinguish healing signal from re-tear.',
      'Conventional MRI has reduced specificity after repair. Displaced fragments, fluid-signal extending into a morphologically changed defect, or a new finding versus prior imaging raise confidence. Direct MR arthrography is a selective problem-solver, especially after substantial resection or without a helpful effusion, not an automatic next test.',
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
      'ACL graft signal evolves with graft type, sequence, and patient; it generally decreases over time, but no rigid signal timeline proves integrity.',
      'During ligamentization, increased signal may be expected, yet graft failure can occur at any time; continuity, orientation, tunnel position, examination, and secondary signs are more important than signal alone.',
      'Key signs of graft failure include fiber discontinuity or abnormal orientation/laxity, supported by anterior tibial translation and compatible examination findings. Increased graft signal alone is not diagnostic.',
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
