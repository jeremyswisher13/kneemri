import { useState } from "react";

interface AnatomySection {
  title: string;
  subsections: {
    heading: string;
    items: { structure: string; detail: string }[];
  }[];
}

const anatomySections: AnatomySection[] = [
  {
    title: "Bones & Alignment",
    subsections: [
      {
        heading: "Key Bony Landmarks",
        items: [
          { structure: "Femoral condyles", detail: "Medial is larger, extends more distally. Lateral has a flatter articular surface and the sulcus terminalis (where pivot-shift contusions occur)." },
          { structure: "Tibial plateau", detail: "Medial is concave (congruent), lateral is convex (less stable). Lateral plateau sits slightly higher." },
          { structure: "Tibial eminences", detail: "Medial and lateral intercondylar spines. Attachment sites for cruciate ligaments and meniscal roots. Avulsion = ACL-equivalent injury in adolescents." },
          { structure: "Fibular head", detail: "Lateral structure. Attachment of LCL and biceps femoris. Arcuate fracture (fibular styloid avulsion) = PLC injury." },
          { structure: "Tibial tubercle", detail: "Patellar tendon insertion. Site of Osgood-Schlatter in adolescents." },
          { structure: "Gerdy's tubercle", detail: "Anterolateral tibial plateau. IT band insertion." },
        ],
      },
      {
        heading: "Three Compartments",
        items: [
          { structure: "Medial tibiofemoral", detail: "Medial femoral condyle + medial tibial plateau + medial meniscus. Bears ~60% of load in neutral alignment." },
          { structure: "Lateral tibiofemoral", detail: "Lateral femoral condyle + lateral tibial plateau + lateral meniscus. More mobile compartment." },
          { structure: "Patellofemoral", detail: "Patellar articular surface + femoral trochlea. Evaluate tracking, tilt, and subluxation on axial images." },
        ],
      },
    ],
  },
  {
    title: "Menisci",
    subsections: [
      {
        heading: "Medial Meniscus",
        items: [
          { structure: "Shape", detail: "C-shaped (semicircular). Less mobile due to firm capsular and deep MCL attachments." },
          { structure: "Anterior horn", detail: "Smallest portion. Attaches to anterior tibial plateau in front of ACL insertion." },
          { structure: "Body", detail: "Firmly attached to deep MCL (meniscotibial and meniscofemoral ligaments)." },
          { structure: "Posterior horn", detail: "Largest portion (~2× the AP dimension of the anterior horn). If it appears small, think displaced tear or root avulsion." },
          { structure: "Posterior root", detail: "Attaches just anterior to PCL tibial insertion. Root tear = functional total meniscectomy." },
        ],
      },
      {
        heading: "Lateral Meniscus",
        items: [
          { structure: "Shape", detail: "Nearly O-shaped (more circular). More mobile — detaches from capsule posterolaterally at the popliteal hiatus." },
          { structure: "Popliteal hiatus", detail: "Normal gap in posterolateral capsule where popliteus tendon passes. Can mimic a tear — look for the round tendon within the gap." },
          { structure: "Meniscofemoral ligaments", detail: "Humphrey (anterior to PCL) and Wrisberg (posterior to PCL). Connect posterior horn of lateral meniscus to medial femoral condyle. Can mask a displaced posterior horn." },
          { structure: "Anterior root", detail: "Attaches adjacent to ACL tibial insertion." },
          { structure: "Transverse ligament", detail: "Connects anterior horns of both menisci. Can mimic anterior horn tear on sagittal images." },
        ],
      },
      {
        heading: "Normal MRI Appearance",
        items: [
          { structure: "Signal", detail: "Uniformly low (dark) on all sequences. Any internal signal is graded 1-3." },
          { structure: "Shape on sagittal", detail: "Body appears as a bow-tie on 2+ consecutive images. Anterior and posterior horns are triangular." },
          { structure: "Shape on coronal", detail: "Triangular cross-section. Body should not extend beyond tibial plateau margin (extrusion)." },
        ],
      },
    ],
  },
  {
    title: "Cruciate Ligaments",
    subsections: [
      {
        heading: "ACL (Anterior Cruciate Ligament)",
        items: [
          { structure: "Origin", detail: "Posteromedial aspect of the lateral femoral condyle (inner wall of intercondylar notch)." },
          { structure: "Insertion", detail: "Anterior tibial plateau, just anterior to the tibial eminence and lateral to the anterior horn of the medial meniscus." },
          { structure: "Course", detail: "Runs anteriorly, medially, and distally. Should be parallel to the intercondylar roof (Blumensaat line) on sagittal images." },
          { structure: "Normal MRI", detail: "Taut, low-signal band visible on 2-3 consecutive sagittal slices. Best evaluated on sagittal images starting from the lateral femoral condyle." },
          { structure: "Bundles", detail: "Anteromedial bundle (tight in flexion) and posterolateral bundle (tight in extension)." },
        ],
      },
      {
        heading: "PCL (Posterior Cruciate Ligament)",
        items: [
          { structure: "Origin", detail: "Anterolateral aspect of the medial femoral condyle." },
          { structure: "Insertion", detail: "Posterior tibial plateau, below the articular surface in a fovea." },
          { structure: "Course", detail: "Smooth, gently curved arc on sagittal images. Strongest ligament in the knee." },
          { structure: "Normal MRI", detail: "Uniformly low signal with a smooth, curved trajectory. Thicker and darker than ACL. Any loss of curvature, kinking, or increased signal suggests injury." },
        ],
      },
    ],
  },
  {
    title: "Collateral Ligaments",
    subsections: [
      {
        heading: "MCL (Medial Collateral Ligament)",
        items: [
          { structure: "Superficial MCL", detail: "Long band from medial femoral epicondyle to proximal medial tibia (5-7 cm below joint line). Primary valgus stabilizer." },
          { structure: "Deep MCL", detail: "Short fibers (meniscotibial and meniscofemoral ligaments) attaching directly to medial meniscus. Injury can displace the meniscus." },
          { structure: "Normal MRI", detail: "Thin, low-signal band on coronal images. Superficial layer is longer and more distinct; deep layer is closely applied to the meniscus and capsule." },
          { structure: "Best plane", detail: "Coronal images. Evaluate both layers — deep MCL injury has different surgical implications." },
        ],
      },
      {
        heading: "LCL (Lateral/Fibular Collateral Ligament)",
        items: [
          { structure: "Course", detail: "Lateral femoral epicondyle to fibular head. Cord-like structure (not flat like MCL)." },
          { structure: "Normal MRI", detail: "Round, low-signal structure on coronal images at the posterolateral knee. Separated from the lateral meniscus by the popliteus tendon." },
          { structure: "Clinical note", detail: "Isolated LCL tears are rare. Usually part of posterolateral corner (PLC) injury." },
        ],
      },
    ],
  },
  {
    title: "Posterolateral Corner (PLC)",
    subsections: [
      {
        heading: "Key Structures",
        items: [
          { structure: "LCL (fibular collateral)", detail: "Lateral epicondyle to fibular head. Primary lateral stabilizer." },
          { structure: "Popliteus tendon", detail: "Runs from lateral femoral condyle through the popliteal hiatus to the posterior tibia. Resists external rotation and posterior tibial translation." },
          { structure: "Popliteofibular ligament", detail: "Connects popliteus to fibular styloid. Small but biomechanically important." },
          { structure: "Arcuate ligament", detail: "Y-shaped ligament over the popliteus. Avulsion of its fibular attachment = arcuate fracture (pathognomonic for PLC injury)." },
          { structure: "Biceps femoris tendon", detail: "Inserts on fibular head. Can be injured in PLC trauma." },
        ],
      },
    ],
  },
  {
    title: "Extensor Mechanism",
    subsections: [
      {
        heading: "Components (Proximal to Distal)",
        items: [
          { structure: "Quadriceps tendon", detail: "Multi-layered: rectus femoris (superficial), vastus medialis/lateralis (middle), vastus intermedius (deep). Inserts on superior pole of patella." },
          { structure: "Patella", detail: "Largest sesamoid bone. Articular surface has medial and lateral facets + odd facet. Wiberg classification for morphology." },
          { structure: "Patellar tendon", detail: "Inferior patellar pole to tibial tubercle. 3-5 mm thick, uniformly low signal. Any thickening or signal increase = tendinopathy." },
          { structure: "MPFL", detail: "Medial patellofemoral ligament. Adductor tubercle region → superomedial patella. Primary restraint to lateral patellar translation. Best seen on axial images." },
          { structure: "Retinacula", detail: "Medial and lateral patellar retinacula. Thin fascial bands stabilizing the patella. Medial retinaculum tears in patellar dislocation." },
        ],
      },
      {
        heading: "Normal MRI Appearance",
        items: [
          { structure: "Quadriceps tendon", detail: "Layered structure on sagittal images at the superior patellar pole. Low signal with distinct laminar pattern." },
          { structure: "Patellar tendon", detail: "Uniformly low signal on all sequences. Posterior surface should be smooth. Any posterior surface signal increase = early tendinopathy." },
          { structure: "MPFL", detail: "Thin, low-signal band on axial images from the adductor tubercle to the superomedial patella. Often best seen with surrounding fat contrast." },
        ],
      },
    ],
  },
  {
    title: "Bursae & Recesses",
    subsections: [
      {
        heading: "Clinically Important Bursae",
        items: [
          { structure: "Suprapatellar bursa", detail: "Communicates with joint space. Largest recess — where effusions accumulate first. Check for loose bodies." },
          { structure: "Prepatellar bursa", detail: "Anterior to patella, superficial. Bursitis = 'housemaid's knee'. Does NOT communicate with joint." },
          { structure: "Deep infrapatellar bursa", detail: "Between patellar tendon and anterior tibia. Communicates with joint in some patients." },
          { structure: "Pes anserine bursa", detail: "Medial proximal tibia, deep to pes anserinus tendons (sartorius, gracilis, semitendinosus). Common cause of medial knee pain." },
          { structure: "Baker cyst (popliteal)", detail: "Posteromedial, between semimembranosus and medial gastrocnemius. Communicates with joint via a one-way valve. Rupture mimics DVT." },
          { structure: "Iliotibial bursa", detail: "Between IT band and lateral femoral condyle. IT band friction syndrome causes fluid here." },
        ],
      },
    ],
  },
  {
    title: "MRI Sequences & What They Show",
    subsections: [
      {
        heading: "Key Sequences",
        items: [
          { structure: "T1-weighted", detail: "Fat = bright, fluid = dark, cortical bone = dark. Best for: anatomy, fracture lines (low-signal line in bright marrow), marrow replacement." },
          { structure: "PD fat-suppressed (PD FS)", detail: "The workhorse. Fat suppressed, fluid/edema = bright. Best for: meniscal tears, ligament injuries, bone marrow edema, cartilage defects, effusion." },
          { structure: "T2-weighted", detail: "Fluid = very bright, high contrast. Best for: cyst characterization, effusion, confirming findings seen on PD FS. Magic angle artifact disappears on T2." },
          { structure: "STIR", detail: "Alternative to PD FS for edema detection. More uniform fat suppression but lower resolution. Used when PD FS has poor fat suppression." },
        ],
      },
      {
        heading: "Normal Signal by Structure",
        items: [
          { structure: "Menisci", detail: "Uniformly low (dark) on all sequences. Any internal signal is abnormal (graded 1-3)." },
          { structure: "Ligaments (ACL, PCL, MCL, LCL)", detail: "Low signal (dark) on all sequences. ACL may show mild intermediate signal normally (more fibers, less compact than PCL)." },
          { structure: "Tendons", detail: "Low signal on all sequences. Any increased signal or thickening suggests pathology." },
          { structure: "Articular cartilage", detail: "Intermediate signal on PD FS (brighter than bone, darker than fluid). Smooth, uniform thickness 2-3 mm on femoral condyles." },
          { structure: "Bone marrow", detail: "Bright on T1 (fatty marrow). Any dark signal on T1 that is bright on PD FS = edema. Discrete low-signal line within edema = fracture." },
          { structure: "Joint fluid", detail: "Dark on T1, bright on T2/PD FS. Amount: trace (normal), small, moderate, large. Fat-fluid level = lipohemarthrosis." },
        ],
      },
    ],
  },
];

export default function AnatomyReference() {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));

  function toggleSection(index: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function expandAll() {
    setOpenSections(new Set(anatomySections.map((_, i) => i)));
  }

  function collapseAll() {
    setOpenSections(new Set());
  }

  return (
    <div>
      <div className="mb-4 flex justify-end gap-3">
        <button onClick={expandAll} className="text-xs text-ucla-blue hover:underline">
          Expand all
        </button>
        <button onClick={collapseAll} className="text-xs text-gray-500 hover:underline">
          Collapse all
        </button>
      </div>
      <div className="space-y-4">
        {anatomySections.map((section, idx) => (
          <div
            key={section.title}
            className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleSection(idx)}
              className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-semibold text-ucla-dark">
                {section.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {section.subsections.reduce((n, s) => n + s.items.length, 0)} items
                </span>
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    openSections.has(idx) ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {openSections.has(idx) && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-5">
                {section.subsections.map((sub) => (
                  <div key={sub.heading}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      {sub.heading}
                    </h4>
                    <div className="space-y-2.5">
                      {sub.items.map((item) => (
                        <div key={item.structure}>
                          <p className="text-sm font-medium text-ucla-blue">
                            {item.structure}
                          </p>
                          <p className="mt-0.5 text-sm text-gray-600 leading-relaxed">
                            {item.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
