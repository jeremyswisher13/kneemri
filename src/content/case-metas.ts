// AUTO-GENERATED lightweight case metadata (run `npm run gen:metas` to refresh).
// The eager course registry uses these so the heavy case bodies (modelReport,
// teachingPoints, searchPatternFindings, images) stay OUT of the initial bundle
// — only the lazy CasePage/GlobalSearch import the full registry. A drift test
// (case-metas.test.ts) keeps these in sync.

export interface CaseMeta {
  id: string;
  title: string;
  difficulty: 'foundational' | 'intermediate' | 'advanced';
  tier: 'core' | 'advanced';
  residentVisible: boolean;
  clinicalScenario: string;
  keyDiagnoses: string[];
  tags: string[];
}

export const kneeCaseMetas: CaseMeta[] = [
  {
    "id": "degenerative-knee-oa",
    "title": "Degenerative Knee — Tricompartmental Osteoarthritis",
    "difficulty": "foundational",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 62-year-old retired teacher with progressive bilateral knee pain, worse on the right, for 3 years. Pain is worse with stairs and prolonged walking. BMI 31. No history of trauma. Physical exam shows bilateral varus alignment, small cool effusions, crepitus with ROM, and decreased flexion (0-120°).",
    "keyDiagnoses": [
      "Tricompartmental osteoarthritis, most severe medial compartment",
      "Complex degenerative medial meniscal tear with 5mm extrusion",
      "Baker cyst",
      "Mucoid degeneration of ACL"
    ],
    "tags": [
      "osteoarthritis",
      "degenerative",
      "meniscal degeneration",
      "cartilage loss",
      "subchondral changes",
      "alignment"
    ]
  },
  {
    "id": "acl-pivot-shift",
    "title": "ACL Tear + Pivot-Shift Pattern",
    "difficulty": "foundational",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 22-year-old soccer player presents with acute knee pain and instability after a noncontact pivoting injury during a game. The knee swelled rapidly within 2 hours.",
    "keyDiagnoses": [
      "Complete ACL tear",
      "Pivot-shift bone contusion pattern"
    ],
    "tags": [
      "acl",
      "pivot-shift",
      "bone-bruise",
      "meniscus",
      "acute-injury"
    ]
  },
  {
    "id": "patellar-dislocation-mpfl",
    "title": "Patellar Dislocation + MPFL Tear",
    "difficulty": "foundational",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 17-year-old basketball player reports that the knee \"popped out\" while cutting and spontaneously reduced. There is medial tenderness and a moderate effusion.",
    "keyDiagnoses": [
      "Transient lateral patellar dislocation",
      "MPFL tear",
      "Osteochondral injury with possible loose body"
    ],
    "tags": [
      "patellofemoral",
      "mpfl",
      "dislocation",
      "osteochondral",
      "loose-body"
    ]
  },
  {
    "id": "medial-root-tear",
    "title": "Medial Meniscal Root Tear",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": false,
    "clinicalScenario": "A 55-year-old recreational runner presents with worsening medial knee pain over 3 months without a specific traumatic event. Weight-bearing radiographs show mild medial joint space narrowing.",
    "keyDiagnoses": [
      "Posterior medial meniscal root tear",
      "Medial meniscal extrusion",
      "Early medial compartment overload"
    ],
    "tags": [
      "meniscus",
      "root-tear",
      "extrusion",
      "degenerative",
      "medial-compartment"
    ]
  },
  {
    "id": "pcl-plc-dashboard",
    "title": "PCL + PLC Dashboard Injury",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": false,
    "clinicalScenario": "A 28-year-old presents after a motor vehicle accident with dashboard mechanism. There is posterior sag of the tibia on exam and posterolateral tenderness.",
    "keyDiagnoses": [
      "PCL tear",
      "Posterolateral corner injury",
      "Dashboard bone contusion pattern"
    ],
    "tags": [
      "pcl",
      "plc",
      "dashboard",
      "multiligament",
      "mva"
    ]
  },
  {
    "id": "bucket-handle",
    "title": "Bucket-Handle Meniscal Tear",
    "difficulty": "foundational",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 30-year-old presents with a locked knee after a twisting injury. The patient is unable to fully extend the knee. There is a moderate effusion and joint line tenderness.",
    "keyDiagnoses": [
      "Bucket-handle meniscal tear with displaced fragment",
      "Double PCL sign",
      "Donor site identification"
    ],
    "tags": [
      "meniscus",
      "bucket-handle",
      "locked-knee",
      "displaced-fragment",
      "mechanical-block"
    ]
  },
  {
    "id": "ocd-stability",
    "title": "OCD Stability Assessment",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": false,
    "clinicalScenario": "A 16-year-old multi-sport athlete presents with activity-related medial knee pain for 4 months. Radiographs show an osteochondral lesion at the medial femoral condyle. Physes remain open.",
    "keyDiagnoses": [
      "Juvenile osteochondritis dissecans (OCD)",
      "Stability assessment with juvenile-specific criteria"
    ],
    "tags": [
      "ocd",
      "cartilage",
      "juvenile",
      "stability",
      "loose-body"
    ]
  },
  {
    "id": "sifk-sonk",
    "title": "Subchondral Insufficiency Fracture (SIF)",
    "difficulty": "intermediate",
    "tier": "advanced",
    "residentVisible": true,
    "clinicalScenario": "A 68-year-old woman presents with sudden onset of severe medial knee pain without a specific traumatic event. She has difficulty bearing weight and exam reveals medial femoral condyle tenderness.",
    "keyDiagnoses": [
      "Subchondral insufficiency fracture of the knee (SIF)",
      "Subchondral fracture line",
      "Associated meniscal pathology"
    ],
    "tags": [
      "sifk",
      "sonk",
      "insufficiency-fracture",
      "marrow-edema",
      "medial-compartment"
    ]
  },
  {
    "id": "mcl-distal-avulsion",
    "title": "MCL Distal Avulsion",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 25-year-old skier presents after a valgus injury to the knee. There is medial-sided swelling extending distally and tenderness along the distal MCL insertion.",
    "keyDiagnoses": [
      "Distal MCL avulsion (Stener-like lesion)",
      "Deep MCL vs superficial MCL involvement",
      "Possible associated medial meniscal injury"
    ],
    "tags": [
      "mcl",
      "collateral",
      "valgus",
      "avulsion",
      "skiing-injury"
    ]
  },
  {
    "id": "multiligament",
    "title": "Multiligament Knee Injury",
    "difficulty": "advanced",
    "tier": "advanced",
    "residentVisible": false,
    "clinicalScenario": "A 35-year-old motorcyclist presents after a high-energy accident with gross knee instability. Clinical exam suggests multiplanar laxity and the vascular status is being monitored.",
    "keyDiagnoses": [
      "Knee dislocation (ACL + PCL tears)",
      "Posterolateral corner disruption",
      "Popliteal artery injury must be urgently excluded",
      "Multiple meniscal and chondral injuries"
    ],
    "tags": [
      "multiligament",
      "dislocation",
      "acl",
      "pcl",
      "plc",
      "vascular",
      "high-energy"
    ]
  },
  {
    "id": "patellar-tendon-rupture",
    "title": "Patellar Tendon Rupture",
    "difficulty": "foundational",
    "tier": "advanced",
    "residentVisible": false,
    "clinicalScenario": "A 58-year-old man has anterior knee pain and swelling after a road-traffic injury. He has a palpable patellar-tendon defect and cannot actively extend the knee. Patella alta is present on the lateral radiograph.",
    "keyDiagnoses": [
      "Complete distal patellar tendon avulsion from the tibial tubercle",
      "Patella alta"
    ],
    "tags": [
      "extensor-mechanism",
      "patellar-tendon",
      "rupture",
      "patella-alta",
      "trauma"
    ]
  },
  {
    "id": "post-repair-retear",
    "title": "Post-Meniscus Repair Re-tear",
    "difficulty": "advanced",
    "tier": "advanced",
    "residentVisible": false,
    "clinicalScenario": "A 24-year-old presents 18 months after a medial meniscal repair with new onset of mechanical symptoms and medial joint line pain. The prior repair was performed at the time of ACL reconstruction.",
    "keyDiagnoses": [
      "Meniscal re-tear at repair site",
      "Differentiation of healing signal vs re-tear",
      "ACL graft integrity assessment"
    ],
    "tags": [
      "meniscus",
      "post-surgical",
      "retear",
      "repair",
      "acl-reconstruction"
    ]
  },
  {
    "id": "acl-graft-evaluation",
    "title": "ACL Graft Evaluation",
    "difficulty": "advanced",
    "tier": "advanced",
    "residentVisible": false,
    "clinicalScenario": "A 26-year-old presents 10 months after ACL reconstruction with a hamstring autograft. The patient reports a feeling of instability with cutting activities and a recent episode of giving way.",
    "keyDiagnoses": [
      "ACL graft failure assessment",
      "Tunnel position evaluation",
      "Possible graft impingement or re-tear"
    ],
    "tags": [
      "acl",
      "graft",
      "post-surgical",
      "reconstruction",
      "instability"
    ]
  }
];

export const shoulderCaseMetas: CaseMeta[] = [
  {
    "id": "shoulder-cuff-tendinosis-bursitis",
    "title": "Rotator Cuff Tendinosis with Subacromial-Subdeltoid Bursitis",
    "difficulty": "foundational",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 47-year-old recreational tennis player has 4 months of atraumatic lateral shoulder pain, worse with overhead activity and sleeping on the affected side. Strength is preserved but painful with resisted abduction.",
    "keyDiagnoses": [
      "Supraspinatus tendinosis without full-thickness tear",
      "Mild subacromial-subdeltoid bursitis",
      "Mild AC joint osteoarthritis"
    ],
    "tags": [
      "cuff",
      "tendinosis",
      "bursitis",
      "atraumatic-pain",
      "rehab-first"
    ]
  },
  {
    "id": "shoulder-acute-full-thickness-cuff-tear",
    "title": "Acute Traumatic Full-Thickness Rotator Cuff Tear",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 58-year-old active cyclist falls onto an outstretched arm and develops immediate shoulder pain with new weakness in forward elevation and external rotation.",
    "keyDiagnoses": [
      "Full-thickness supraspinatus tear with posterior extension",
      "Early tendon retraction without advanced fatty atrophy",
      "Reactive subacromial-subdeltoid bursal fluid"
    ],
    "tags": [
      "trauma",
      "rotator-cuff",
      "full-thickness",
      "weakness",
      "surgical-referral"
    ]
  },
  {
    "id": "shoulder-anterior-instability-bankart",
    "title": "Anterior Instability with Bankart and Hill-Sachs Lesions",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 22-year-old rugby player sustains a first-time anterior shoulder dislocation reduced on the field. They now report apprehension and pain in abduction/external rotation.",
    "keyDiagnoses": [
      "Anteroinferior labral tear compatible with Bankart lesion",
      "Hill-Sachs impaction injury",
      "Glenohumeral effusion after dislocation"
    ],
    "tags": [
      "instability",
      "bankart",
      "hill-sachs",
      "dislocation",
      "labrum"
    ]
  },
  {
    "id": "shoulder-slap-biceps-anchor",
    "title": "Superior Labrum/Biceps Anchor Injury in an Overhead Athlete",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 28-year-old baseball pitcher reports deep shoulder pain and loss of velocity. Exam suggests pain with O'Brien testing and biceps load maneuver.",
    "keyDiagnoses": [
      "Suspected SLAP tear involving the biceps anchor",
      "Mild undersurface supraspinatus/infraspinatus fraying",
      "No full-thickness rotator cuff tear"
    ],
    "tags": [
      "slap",
      "biceps-anchor",
      "overhead-athlete",
      "labrum",
      "thrower"
    ]
  },
  {
    "id": "shoulder-adhesive-capsulitis",
    "title": "Adhesive Capsulitis Support Pattern",
    "difficulty": "foundational",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 52-year-old patient with diabetes has progressive shoulder pain and global loss of passive range of motion. Radiographs show no advanced arthritis.",
    "keyDiagnoses": [
      "MRI findings supportive of adhesive capsulitis",
      "Rotator interval edema and capsular thickening",
      "No full-thickness cuff tear"
    ],
    "tags": [
      "adhesive-capsulitis",
      "frozen-shoulder",
      "capsule",
      "diabetes",
      "injection-planning"
    ]
  },
  {
    "id": "shoulder-subscapularis-biceps-hidden-lesion",
    "title": "Upper Subscapularis Tear with Medial Biceps Subluxation (the “hidden lesion”)",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 46-year-old recreational golfer has anterior shoulder pain and weakness with internal rotation. The belly-press and lift-off tests are positive. A prior outside report called the cuff “tendinopathic.”",
    "keyDiagnoses": [
      "Tear of the upper-border subscapularis tendon",
      "Medial subluxation/dislocation of the long head of biceps (pulley lesion)",
      "Pattern commonly missed on a quick coronal-only read"
    ],
    "tags": [
      "subscapularis",
      "biceps-pulley",
      "medial-subluxation",
      "hidden-lesion",
      "anterior-pain"
    ]
  },
  {
    "id": "shoulder-massive-cuff-arthropathy",
    "title": "Massive Chronic Cuff Tear with Cuff Tear Arthropathy",
    "difficulty": "advanced",
    "tier": "advanced",
    "residentVisible": true,
    "clinicalScenario": "A 72-year-old active retiree has chronic shoulder pain, pseudoparalysis, and marked weakness. Symptoms worsened gradually over several years.",
    "keyDiagnoses": [
      "Massive chronic supraspinatus/infraspinatus tear",
      "Advanced muscle atrophy/fatty infiltration",
      "Superior humeral migration and cuff tear arthropathy"
    ],
    "tags": [
      "massive-cuff-tear",
      "atrophy",
      "fatty-infiltration",
      "arthropathy",
      "advanced"
    ]
  },
  {
    "id": "shoulder-calcific-tendinitis",
    "title": "Calcific Tendinitis of the Rotator Cuff",
    "difficulty": "intermediate",
    "tier": "advanced",
    "residentVisible": true,
    "clinicalScenario": "A 50-year-old has an acute, severe atraumatic shoulder pain crisis — far worse than a typical tendinopathy flare, with night pain and guarding. Radiographs show a rounded calcific density near the greater tuberosity.",
    "keyDiagnoses": [
      "Hydroxyapatite (calcific) deposit in the supraspinatus tendon",
      "Reactive subacromial-subdeltoid bursitis",
      "Distinct management from tendinosis (NSAIDs, image-guided barbotage/injection)"
    ],
    "tags": [
      "calcific-tendinitis",
      "hydroxyapatite",
      "acute-pain-crisis",
      "bursitis",
      "injection-planning"
    ]
  }
];

export const hipCaseMetas: CaseMeta[] = [
  {
    "id": "hip-cam-fai-labral-tear",
    "title": "Cam-Type FAI with Anterosuperior Labral Tear and Rim Chondral Injury",
    "difficulty": "foundational",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 27-year-old male ice-hockey player presents with 8 months of deep anterior groin pain (positive C-sign) worse with prolonged sitting and pivoting. FADIR (flexion-adduction-internal rotation) impingement test reproduces his pain, and internal rotation in flexion is limited to 10 degrees.",
    "keyDiagnoses": [
      "Cam-type femoroacetabular impingement (alpha angle >55 degrees)",
      "Anterosuperior acetabular labral tear",
      "Anterosuperior acetabular rim chondral delamination",
      "Femoral head-neck junction subchondral cyst (herniation pit)"
    ],
    "tags": [
      "cam-fai",
      "labral-tear",
      "chondral-injury",
      "alpha-angle",
      "referral",
      "groin-pain"
    ]
  },
  {
    "id": "hip-femoral-neck-stress-fracture",
    "title": "Tension-Side (Superolateral) Femoral Neck Stress Fracture - Surgical Urgency",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 22-year-old female collegiate distance runner with a recent training-volume spike and a history of amenorrhea/RED-S presents with 3 weeks of progressively worsening groin pain, now painful at rest and with weight-bearing. She has an antalgic gait, pain on the hop test, and pain at the extremes of internal rotation. Radiographs were read as normal.",
    "keyDiagnoses": [
      "Tension-side (superolateral) femoral neck stress fracture",
      "Relative energy deficiency in sport (RED-S) / female athlete triad as contributing risk",
      "High-risk stress fracture requiring urgent orthopedic management"
    ],
    "tags": [
      "femoral-neck-stress-fracture",
      "tension-side",
      "surgical-urgency",
      "high-risk-stress-fracture",
      "red-s",
      "non-weight-bearing"
    ]
  },
  {
    "id": "hip-avn-femoral-head",
    "title": "Avascular Necrosis of the Femoral Head (Double-Line Sign), Pre-Collapse",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 41-year-old man on a recent prolonged corticosteroid course (for an inflammatory flare) reports several weeks of insidious groin and buttock pain, worse with weight-bearing and at rest. Range of motion is mildly restricted but radiographs are normal. There is no history of acute trauma.",
    "keyDiagnoses": [
      "Avascular necrosis (osteonecrosis) of the femoral head",
      "Pre-collapse disease (ARCO I — MRI-only changes with a normal radiograph; double-line sign without subchondral collapse)",
      "Corticosteroid-associated osteonecrosis"
    ],
    "tags": [
      "avascular-necrosis",
      "double-line-sign",
      "pre-collapse",
      "arco-staging",
      "referral",
      "joint-preservation"
    ]
  },
  {
    "id": "hip-gluteus-medius-tear-gtps",
    "title": "Gluteus Medius/Minimus Tendinopathy and Tear (Greater Trochanteric Pain Syndrome)",
    "difficulty": "foundational",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 58-year-old recreational walker reports chronic lateral hip pain that is worst lying on the affected side at night and with single-leg stance. Exam shows point tenderness over the greater trochanter, a positive single-leg stance (Trendelenburg) test, and pain with resisted abduction.",
    "keyDiagnoses": [
      "Gluteus medius and minimus tendinopathy",
      "Gluteus medius footprint partial-thickness (undersurface) tear",
      "Greater trochanteric pain syndrome (GTPS) with trochanteric bursitis"
    ],
    "tags": [
      "gluteus-medius-tear",
      "gtps",
      "abductor-tendinopathy",
      "trochanteric-bursitis",
      "rehab-first",
      "lateral-hip-pain"
    ]
  },
  {
    "id": "hip-proximal-hamstring-avulsion",
    "title": "Proximal Hamstring Origin Tear/Avulsion at the Ischial Tuberosity",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 46-year-old masters water-skier felt a sudden 'pop' and tearing in the buttock during a forced hip-flexion/knee-extension load, followed by inability to sprint and difficulty sitting. Exam shows posterior thigh ecchymosis, tenderness at the ischial tuberosity, and weak resisted knee flexion.",
    "keyDiagnoses": [
      "Proximal hamstring origin tear/avulsion at the ischial tuberosity",
      "Complete (3-tendon) conjoint avulsion with retraction",
      "Sciatic nerve proximity/contact (no transection)"
    ],
    "tags": [
      "proximal-hamstring-avulsion",
      "ischial-tuberosity",
      "tendon-retraction",
      "surgical-referral",
      "sciatic-nerve",
      "posterior-thigh"
    ]
  },
  {
    "id": "hip-athletic-pubalgia",
    "title": "Athletic Pubalgia / Core-Muscle Injury (Rectus Abdominis-Adductor Aponeurosis, Secondary Cleft Sign)",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 29-year-old male soccer midfielder reports several months of exertional lower-abdominal and groin pain provoked by cutting, kicking, and sit-ups, with relief at rest. Exam shows tenderness at the pubic tubercle/rectus insertion and pain on resisted hip adduction and resisted sit-up; there is no inguinal hernia bulge.",
    "keyDiagnoses": [
      "Athletic pubalgia / core-muscle injury (rectus abdominis-adductor longus aponeurosis disruption)",
      "Adductor longus origin tendinopathy/microtearing",
      "Secondary cleft sign at the pubic symphysis",
      "Pubic symphyseal stress reaction (osteitis pubis spectrum)"
    ],
    "tags": [
      "athletic-pubalgia",
      "core-muscle-injury",
      "secondary-cleft-sign",
      "adductor-aponeurosis",
      "rehab-first",
      "groin-pain"
    ]
  },
  {
    "id": "hip-transient-bme-vs-sifk",
    "title": "Transient Bone-Marrow-Edema Syndrome vs Subchondral Insufficiency Fracture of the Femoral Head",
    "difficulty": "advanced",
    "tier": "advanced",
    "residentVisible": false,
    "clinicalScenario": "A 52-year-old woman with no trauma presents with several weeks of progressive, weight-bearing groin pain and a markedly antalgic gait; she has osteopenia risk factors. Radiographs are normal or show only subtle osteopenia. The clinical question is whether her diffuse femoral head edema represents benign transient bone-marrow-edema syndrome or a subchondral insufficiency fracture at risk of collapse.",
    "keyDiagnoses": [
      "Subchondral insufficiency fracture of the femoral head (SIFK)",
      "Transient bone-marrow-edema syndrome (the key differential)",
      "Avascular necrosis (excluded - no double-line sign)"
    ],
    "tags": [
      "subchondral-insufficiency-fracture",
      "transient-bone-marrow-edema",
      "collapse-risk",
      "protected-weight-bearing",
      "referral",
      "femoral-head-edema"
    ]
  },
  {
    "id": "hip-pincer-fai-retroversion",
    "title": "Pincer-Type FAI with Acetabular Retroversion/Over-Coverage and Contrecoup Posteroinferior Chondral Injury",
    "difficulty": "advanced",
    "tier": "advanced",
    "residentVisible": false,
    "clinicalScenario": "A 34-year-old female recreational dancer/yoga instructor reports anterior groin pain at the extremes of hip flexion and external rotation, with mechanical catching. FADIR is positive; radiographs show a crossover sign and a prominent ischial spine. The clinical question is FAI subtype and its chondral consequences.",
    "keyDiagnoses": [
      "Pincer-type femoroacetabular impingement (acetabular retroversion/over-coverage)",
      "Anterosuperior labral degeneration/intrasubstance tear (crushed labrum)",
      "Contrecoup POSTEROINFERIOR acetabular chondral injury"
    ],
    "tags": [
      "pincer-fai",
      "acetabular-retroversion",
      "crossover-sign",
      "contrecoup-chondral-injury",
      "referral",
      "groin-pain"
    ]
  }
];

export const elbowCaseMetas: CaseMeta[] = [
  {
    "id": "elbow-ucl-tear-thrower",
    "title": "UCL Tear in a Thrower (Distal Avulsion + T-Sign)",
    "difficulty": "foundational",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 19-year-old collegiate pitcher reports progressive medial elbow pain and loss of velocity over a single season, culminating in a 'pop' and sharp pain at ball release. The moving-valgus stress test is positive, reproducing his pain through the late-cocking/acceleration arc. The clinical question is a thrower's UCL injury versus isolated medial epicondylitis versus ulnar neuritis.",
    "keyDiagnoses": [
      "Partial undersurface (distal/sublime-tubercle) tear of the UCL anterior bundle with the T-sign",
      "Sublime-tubercle and adjacent ulnar marrow edema (chronic valgus traction)",
      "Flexor-pronator (common flexor) origin tendinosis",
      "Ulnar neuritis as the third member of the valgus-overload triad (interrogated, low-grade)"
    ],
    "tags": [
      "ucl-tear",
      "t-sign",
      "thrower",
      "valgus-overload",
      "mr-arthrography",
      "moving-valgus-test",
      "flexor-pronator-tendinosis"
    ]
  },
  {
    "id": "elbow-capitellar-ocd",
    "title": "Capitellar Osteochondritis Dissecans — Stable vs Unstable",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 13-year-old competitive gymnast (also pitches Little League) presents with several months of progressive lateral elbow pain, intermittent catching, and a fixed 15-degree loss of terminal extension (flexion contracture). Pain worsens with weight-bearing on the arms and with throwing; radiographs show a focal anterolateral capitellar lucency, prompting MRI to characterize the lesion and judge its stability.",
    "keyDiagnoses": [
      "Capitellar osteochondritis dissecans (OCD) of the adolescent thrower/gymnast",
      "Stability assessment: fluid undercutting / subchondral cyst(s) / cartilage breach / displaced fragment as the management hinge",
      "Panner disease (the key age-based differential — excluded here)",
      "Radiocapitellar (lateral compartment) valgus-overload osteochondral injury"
    ],
    "tags": [
      "capitellar-ocd",
      "osteochondritis-dissecans",
      "stability-assessment",
      "panner-vs-ocd",
      "thrower-elbow",
      "surgical-referral",
      "lateral-elbow-pain"
    ]
  },
  {
    "id": "elbow-distal-biceps-tear",
    "title": "Distal Biceps Tendon Tear (Retraction + Lacertus)",
    "difficulty": "foundational",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 48-year-old man felt a sudden tearing sensation in the front of the elbow while lifting a heavy box with the elbow flexed at about 90 degrees. He has antecubital ecchymosis, weak and painful resisted supination, and a positive hook test (the examiner cannot hook a finger under an intact distal biceps tendon laterally).",
    "keyDiagnoses": [
      "Complete distal biceps tendon tear (avulsion) from the radial tuberosity",
      "Bicipitoradial bursitis (reactive fluid at the footprint)",
      "Lacertus fibrosus status as the retraction-limiting variable (intact vs disrupted)",
      "Empty radial tuberosity footprint with proximal tendon retraction"
    ],
    "tags": [
      "distal-biceps-tear",
      "radial-tuberosity",
      "lacertus-fibrosus",
      "tendon-retraction",
      "fabs-view",
      "surgical-referral",
      "hook-test"
    ]
  },
  {
    "id": "elbow-lateral-epicondylitis-lucl",
    "title": "Lateral Epicondylitis + Partial Common Extensor / LUCL Tear",
    "difficulty": "foundational",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 45-year-old recreational tennis player presents with chronic lateral elbow pain refractory to a dedicated rehabilitation program, tender over the lateral epicondyle. The clinical question is the grade of common-extensor pathology and, critically, whether the adjacent lateral ulnar collateral ligament is involved.",
    "keyDiagnoses": [
      "Common extensor origin (ECRB) tendinosis with a deep partial-thickness tear (lateral epicondylitis)",
      "Deep common-extensor tear undercutting/communicating with the radiocapitellar joint and INVOLVING the lateral ulnar collateral ligament (LUCL) — the PLRI-implying lesion",
      "Posterolateral rotatory instability (PLRI) pattern from LUCL incompetence",
      "Reactive lateral-epicondyle marrow edema and thin RCL signal — NOT, by themselves, an LCL tear"
    ],
    "tags": [
      "lateral-epicondylitis",
      "common-extensor-tear",
      "lucl-tear",
      "plri",
      "ligament-reconstruction",
      "tennis-elbow",
      "surgical-referral"
    ]
  },
  {
    "id": "elbow-medial-epicondylitis-ulnar",
    "title": "Medial Epicondylitis with Adjacent Ulnar Neuritis",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": false,
    "clinicalScenario": "A 50-year-old right-handed recreational golfer reports several months of medial elbow pain that worsens with the golf swing and resisted wrist flexion/pronation, now accompanied by intermittent tingling along the ring and small fingers. Exam shows tenderness just distal to the medial epicondyle over the flexor-pronator origin, a positive Tinel sign over the cubital tunnel, and pain with resisted forearm pronation; there is no frank valgus instability.",
    "keyDiagnoses": [
      "Medial (common flexor-pronator) epicondylitis with a partial-thickness origin tear",
      "Ulnar neuritis in the cubital tunnel (enlarged, T2-hyperintense ulnar nerve)",
      "Intact anterior-bundle ulnar collateral ligament (the third member of the medial triad - interrogated and cleared)",
      "Ulnar nerve without flexion subluxation (stable in the groove)"
    ],
    "tags": [
      "medial-epicondylitis",
      "ulnar-neuritis",
      "cubital-tunnel",
      "flexor-pronator",
      "medial-triad",
      "selective-transposition",
      "medial-elbow-pain"
    ]
  },
  {
    "id": "elbow-cubital-tunnel-ulnar-neuritis",
    "title": "Cubital Tunnel Syndrome — Ulnar Neuritis ± Subluxation",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": false,
    "clinicalScenario": "A 38-year-old recreational thrower presents with several weeks of numbness and tingling in the ulnar two digits (ring and small fingers), worse with sustained elbow flexion such as holding a phone or sleeping with the elbow bent. Tinel sign is positive over the cubital tunnel, the flexion-compression test reproduces the paresthesias, and there is early grip-fatigue but no fixed clawing yet.",
    "keyDiagnoses": [
      "Cubital tunnel syndrome — ulnar neuritis at the medial epicondyle",
      "Dynamic ulnar nerve subluxation over the medial epicondyle in flexion",
      "Anconeus epitrochlearis accessory muscle (structural contributor)",
      "Subacute FCU / ulnar-FDP denervation edema (no fixed fatty atrophy)"
    ],
    "tags": [
      "cubital-tunnel",
      "ulnar-neuritis",
      "nerve-subluxation",
      "anconeus-epitrochlearis",
      "snapping-triceps",
      "transposition",
      "denervation-edema"
    ]
  },
  {
    "id": "elbow-veo-posteromedial-loose-body",
    "title": "Valgus Extension Overload — Posteromedial Loose Body",
    "difficulty": "advanced",
    "tier": "advanced",
    "residentVisible": false,
    "clinicalScenario": "A 34-year-old veteran right-handed professional baseball pitcher reports deep posterior elbow pain that is sharpest at ball release (terminal extension), a 10-degree loss of terminal extension, and an intermittent painful catching/locking sensation. He has a long history of high-volume throwing, and on exam there is posteromedial olecranon tenderness, pain on forced extension with valgus (the valgus-extension-overload provocation), and equivocal medial laxity on the moving-valgus test.",
    "keyDiagnoses": [
      "Valgus extension overload (VEO) of the throwing elbow",
      "Posteromedial olecranon osteophyte with posteromedial trochlear chondral wear (kissing lesion)",
      "Intra-articular loose body in the posterior compartment / olecranon fossa",
      "Co-existing ulnar collateral ligament (UCL) insufficiency - the upstream driver"
    ],
    "tags": [
      "valgus-extension-overload",
      "posteromedial-olecranon-osteophyte",
      "loose-body",
      "ucl-insufficiency",
      "thrower-elbow",
      "surgical-referral",
      "posterior-impingement"
    ]
  },
  {
    "id": "elbow-occult-radial-head-fracture",
    "title": "Occult Radial Head Fracture vs Normal Variant (Pseudodefect)",
    "difficulty": "intermediate",
    "tier": "core",
    "residentVisible": true,
    "clinicalScenario": "A 30-year-old presents after a fall on the outstretched hand (FOOSH) with lateral elbow pain, tenderness over the radial head, and painful, mechanically limited forearm pronation/supination. Radiographs show a displaced posterior fat-pad sign (elbow effusion/hemarthrosis) but no definite fracture line. MRI is requested to confirm an occult fracture and exclude an osteochondral lesion.",
    "keyDiagnoses": [
      "Non-displaced radial head/neck fracture (occult on radiograph)",
      "Hemarthrosis with a displaced posterior fat-pad sign",
      "Capitellar pseudodefect and transverse trochlear ridge — normal variants (NOT osteochondral lesions)",
      "No mechanical block to forearm rotation and no comminution (non-operative Mason I pattern)"
    ],
    "tags": [
      "occult-radial-head-fracture",
      "posterior-fat-pad-sign",
      "pseudodefect",
      "trochlear-ridge",
      "normal-variant",
      "mason-framework",
      "foosh"
    ]
  }
];
