import type { SearchPatternStep } from '@/types/content';

export const searchPatternSteps: SearchPatternStep[] = [
  {
    number: 1,
    name: 'Verify & Orient',
    shortName: 'Verify',
    description:
      'Confirm patient identity, laterality, and available sequences. Establish the clinical question and find the anchor slice before beginning interpretation.',
    checklistItems: [
      'Confirm correct patient and side',
      'Identify all available planes (sagittal, coronal, axial)',
      'Identify sequences (T1, PD FS, T2)',
      'State the clinical question in one sentence',
      'Find anchor slice: mid-sagittal through ACL/PCL + notch',
    ],
    pearls: [
      'Before hunting pathology, can you point to ACL, PCL, medial meniscus, lateral meniscus?',
    ],
  },
  {
    number: 2,
    name: 'Bones & Marrow',
    shortName: 'Bones',
    description:
      'Evaluate alignment, marrow signal, fracture lines, and subchondral changes. Identify bone bruise patterns that point to specific injury mechanisms.',
    checklistItems: [
      'Alignment: varus/valgus, patellar tracking',
      'Marrow edema: location and pattern',
      'Fracture lines (best on T1)',
      'Subchondral changes',
      'Bone bruise pattern (pivot-shift? dashboard? dislocation?)',
    ],
    pearls: [
      'In acute ACL injury, expect bone bruises at LFC + posterolateral tibial plateau',
      "If edema is present, always ask 'why?': Trauma? OA? Stress? Infection?",
    ],
  },
  {
    number: 3,
    name: 'Cartilage & Osteochondral',
    shortName: 'Cartilage',
    description:
      'Systematically scan articular cartilage by compartment, identify osteochondral defects, assess stability, and search for loose bodies.',
    checklistItems: [
      'Scan cartilage by compartment: medial, lateral, patellofemoral',
      'Look for thinning, fissures, delamination, focal defects',
      'Check subchondral bone: sclerosis, cysts, edema',
      'Search for loose bodies (notch, gutters, suprapatellar pouch)',
      'Assess OCD: location, size, stability signs',
    ],
    pearls: [
      'Full-thickness defect + marrow edema is often clinically significant',
      'Always report location + depth + size + edema + loose bodies',
    ],
  },
  {
    number: 4,
    name: 'Menisci',
    shortName: 'Menisci',
    description:
      'Trace each meniscus from anterior horn through body to posterior horn, evaluate roots, apply the two-slice-touch rule, and measure extrusion.',
    checklistItems: [
      'Evaluate medial meniscus: anterior horn, body, posterior horn',
      'Evaluate lateral meniscus: anterior horn, body, posterior horn',
      'Check both roots (posterior medial and posterior lateral)',
      'Apply two-slice-touch rule for tear diagnosis',
      'Assess for displacement: bucket-handle, flipped meniscus',
      'Measure extrusion on coronal images',
      'Look for parameniscal cysts',
    ],
    pearls: [
      'A true tear: grade 3 signal on \u22652 images reaching a surface',
      'If ACL is torn: look lateral, look posterior, look at the root',
      'Significant extrusion? Actively search for a root tear',
    ],
  },
  {
    number: 5,
    name: 'Ligaments',
    shortName: 'Ligaments',
    description:
      'Evaluate the cruciate ligaments with primary and secondary signs, assess collateral ligaments and corner structures, and check the MPFL when indicated.',
    checklistItems: [
      'ACL: continuity, orientation, signal (primary signs)',
      'ACL secondary signs: bone bruises, anterior tibial translation',
      'PCL: continuity, signal, buckling',
      'MCL: proximal to distal, deep vs superficial',
      'LCL and posterolateral corner: popliteus, popliteofibular ligament',
      'MPFL (if patellar instability indicated)',
    ],
    pearls: [
      'If ACL torn, slow down on menisci (bucket-handle, root, ramp)',
      'PLC injuries are easy to miss\u2014check LCL + popliteus systematically',
    ],
  },
  {
    number: 6,
    name: 'Extensor Mechanism',
    shortName: 'Extensor',
    description:
      'Evaluate the quadriceps tendon, patella, patellar tendon, and retinacula. Prioritize MPFL assessment when patellar instability is suspected.',
    checklistItems: [
      'Quadriceps tendon: thickness, continuity',
      'Patella: marrow signal, fracture, cartilage',
      'Patellar tendon: tendinopathy vs tear',
      'Retinacula and MPFL (especially after patellar dislocation)',
    ],
    pearls: [
      'If indication is patellar instability: prioritize MPFL and osteochondral fragments',
      "Don't call patellar tendinopathy unless signal + thickening localizes to the tendon",
    ],
  },
  {
    number: 7,
    name: 'Synovium/Bursae & Other',
    shortName: 'Synovium',
    description:
      'Assess the joint effusion, bursae, Baker\'s cyst, popliteal fossa, surrounding tendons, and neurovascular structures.',
    checklistItems: [
      'Effusion: quantify (small/moderate/large)',
      'Fat-fluid level (lipohemarthrosis \u2192 fracture)',
      'Bursae: prepatellar, infrapatellar, pes anserine',
      "Baker's cyst: location, rupture, complexity",
      'Popliteal fossa: masses, collections',
      'Tendons: hamstrings, IT band',
      'Neurovascular structures',
    ],
    pearls: [
      "Baker's cyst sits between semimembranosus and medial gastrocnemius",
      "If painful calf swelling, consider Baker's cyst rupture",
    ],
  },
];
