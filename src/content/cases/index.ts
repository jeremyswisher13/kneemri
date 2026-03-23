export interface CaseMetadata {
  id: string;
  title: string;
  difficulty: 'foundational' | 'intermediate' | 'advanced';
  clinicalScenario: string;
  keyDiagnoses: string[];
  tags: string[];
}

export const caseRegistry: CaseMetadata[] = [
  {
    id: 'acl-pivot-shift',
    title: 'ACL Tear + Pivot-Shift Pattern',
    difficulty: 'foundational',
    clinicalScenario:
      'A 22-year-old soccer player presents with acute knee pain and instability after a noncontact pivoting injury during a game. The knee swelled rapidly within 2 hours.',
    keyDiagnoses: [
      'Complete ACL tear',
      'Pivot-shift bone contusion pattern',
      'Possible lateral meniscal root tear',
    ],
    tags: ['acl', 'pivot-shift', 'bone-bruise', 'meniscus', 'acute-injury'],
  },
  {
    id: 'patellar-dislocation-mpfl',
    title: 'Patellar Dislocation + MPFL Tear',
    difficulty: 'foundational',
    clinicalScenario:
      'A 17-year-old basketball player reports that the knee "popped out" while cutting and spontaneously reduced. There is medial tenderness and a moderate effusion.',
    keyDiagnoses: [
      'Transient lateral patellar dislocation',
      'MPFL tear',
      'Osteochondral injury with possible loose body',
    ],
    tags: ['patellofemoral', 'mpfl', 'dislocation', 'osteochondral', 'loose-body'],
  },
  {
    id: 'medial-root-tear',
    title: 'Medial Meniscal Root Tear',
    difficulty: 'intermediate',
    clinicalScenario:
      'A 55-year-old recreational runner presents with worsening medial knee pain over 3 months without a specific traumatic event. Weight-bearing radiographs show mild medial joint space narrowing.',
    keyDiagnoses: [
      'Posterior medial meniscal root tear',
      'Medial meniscal extrusion',
      'Early medial compartment overload',
    ],
    tags: ['meniscus', 'root-tear', 'extrusion', 'degenerative', 'medial-compartment'],
  },
  {
    id: 'pcl-plc-dashboard',
    title: 'PCL + PLC Dashboard Injury',
    difficulty: 'intermediate',
    clinicalScenario:
      'A 28-year-old presents after a motor vehicle accident with dashboard mechanism. There is posterior sag of the tibia on exam and posterolateral tenderness.',
    keyDiagnoses: [
      'PCL tear',
      'Posterolateral corner injury',
      'Dashboard bone contusion pattern',
    ],
    tags: ['pcl', 'plc', 'dashboard', 'multiligament', 'mva'],
  },
  {
    id: 'bucket-handle',
    title: 'Bucket-Handle Meniscal Tear',
    difficulty: 'foundational',
    clinicalScenario:
      'A 30-year-old presents with a locked knee after a twisting injury. The patient is unable to fully extend the knee. There is a moderate effusion and joint line tenderness.',
    keyDiagnoses: [
      'Bucket-handle meniscal tear with displaced fragment',
      'Double PCL sign',
      'Donor site identification',
    ],
    tags: ['meniscus', 'bucket-handle', 'locked-knee', 'displaced-fragment', 'mechanical-block'],
  },
  {
    id: 'ocd-stability',
    title: 'OCD Stability Assessment',
    difficulty: 'intermediate',
    clinicalScenario:
      'A 16-year-old multi-sport athlete presents with activity-related medial knee pain for 4 months. Radiographs show an osteochondral lesion at the medial femoral condyle. Physes remain open.',
    keyDiagnoses: [
      'Juvenile osteochondral defect (OCD)',
      'Stability assessment with juvenile-specific criteria',
      'Possible loose body',
    ],
    tags: ['ocd', 'cartilage', 'juvenile', 'stability', 'loose-body'],
  },
  {
    id: 'sifk-sonk',
    title: 'SIFK / SONK',
    difficulty: 'intermediate',
    clinicalScenario:
      'A 68-year-old woman presents with sudden onset of severe medial knee pain without a specific traumatic event. She has difficulty bearing weight and exam reveals medial femoral condyle tenderness.',
    keyDiagnoses: [
      'Subchondral insufficiency fracture of the knee (SIFK)',
      'Subchondral fracture line',
      'Associated meniscal pathology',
    ],
    tags: ['sifk', 'sonk', 'insufficiency-fracture', 'marrow-edema', 'medial-compartment'],
  },
  {
    id: 'mcl-distal-avulsion',
    title: 'MCL Distal Avulsion',
    difficulty: 'intermediate',
    clinicalScenario:
      'A 25-year-old skier presents after a valgus injury to the knee. There is medial-sided swelling extending distally and tenderness along the distal MCL insertion.',
    keyDiagnoses: [
      'Distal MCL avulsion (Stener-like lesion)',
      'Deep MCL vs superficial MCL involvement',
      'Possible associated medial meniscal injury',
    ],
    tags: ['mcl', 'collateral', 'valgus', 'avulsion', 'skiing-injury'],
  },
  {
    id: 'multiligament',
    title: 'Multiligament Knee Injury',
    difficulty: 'advanced',
    clinicalScenario:
      'A 35-year-old motorcyclist presents after a high-energy accident with gross knee instability. Clinical exam suggests multiplanar laxity and the vascular status is being monitored.',
    keyDiagnoses: [
      'Knee dislocation (ACL + PCL tears)',
      'Posterolateral corner disruption',
      'Possible popliteal artery injury',
      'Multiple meniscal and chondral injuries',
    ],
    tags: ['multiligament', 'dislocation', 'acl', 'pcl', 'plc', 'vascular', 'high-energy'],
  },
  {
    id: 'patellar-tendon-rupture',
    title: 'Patellar Tendon Rupture',
    difficulty: 'foundational',
    clinicalScenario:
      'A 32-year-old basketball player felt a pop and sharp pain while landing from a jump. He is unable to perform a straight leg raise. Patella alta is suspected on lateral radiograph.',
    keyDiagnoses: [
      'Complete patellar tendon rupture',
      'Patella alta',
      'Possible patellar sleeve avulsion',
    ],
    tags: ['extensor-mechanism', 'patellar-tendon', 'rupture', 'patella-alta', 'sports-injury'],
  },
  {
    id: 'post-repair-retear',
    title: 'Post-Meniscus Repair Re-tear',
    difficulty: 'advanced',
    clinicalScenario:
      'A 24-year-old presents 18 months after a medial meniscal repair with new onset of mechanical symptoms and medial joint line pain. The prior repair was performed at the time of ACL reconstruction.',
    keyDiagnoses: [
      'Meniscal re-tear at repair site',
      'Differentiation of healing signal vs re-tear',
      'ACL graft integrity assessment',
    ],
    tags: ['meniscus', 'post-surgical', 'retear', 'repair', 'acl-reconstruction'],
  },
  {
    id: 'acl-graft-evaluation',
    title: 'ACL Graft Evaluation',
    difficulty: 'advanced',
    clinicalScenario:
      'A 26-year-old presents 10 months after ACL reconstruction with a hamstring autograft. The patient reports a feeling of instability with cutting activities and a recent episode of giving way.',
    keyDiagnoses: [
      'ACL graft failure assessment',
      'Tunnel position evaluation',
      'Possible graft impingement or re-tear',
    ],
    tags: ['acl', 'graft', 'post-surgical', 'reconstruction', 'instability'],
  },
];
