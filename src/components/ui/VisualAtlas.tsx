import { useState } from "react";

interface AtlasEntry {
  title: string;
  diagram?: { src: string; alt: string; caption: string };
  radiopaediaLinks: { label: string; url: string; description: string }[];
}

interface AtlasSection {
  title: string;
  entries: AtlasEntry[];
}

const atlasSections: AtlasSection[] = [
  {
    title: "Menisci",
    entries: [
      {
        title: "Meniscal Anatomy",
        diagram: {
          src: "/images/modules/meniscal-anatomy.svg",
          alt: "Meniscal anatomy — tibial plateau superior view",
          caption: "Medial (C-shaped) and lateral (O-shaped) menisci with horns, body, roots, popliteal hiatus, and key attachments.",
        },
        radiopaediaLinks: [
          { label: "Normal meniscal anatomy on MRI", url: "https://radiopaedia.org/articles/knee-menisci", description: "Normal appearance on sagittal and coronal sequences" },
          { label: "Popliteomeniscal fascicles (popliteal hiatus)", url: "https://radiopaedia.org/articles/popliteomeniscal-fascicles", description: "Fascicles forming the popliteal hiatus — distinguish from lateral meniscal tear" },
        ],
      },
      {
        title: "Meniscal Signal Grading",
        diagram: {
          src: "/images/modules/meniscal-signal-grading.svg",
          alt: "Meniscal signal grading — grades 1, 2, and 3",
          caption: "Grade 1 (globular, intrasubstance), Grade 2 (linear, intrasubstance), Grade 3 (surface-reaching = tear).",
        },
        radiopaediaLinks: [
          { label: "Meniscal tear grading", url: "https://radiopaedia.org/articles/meniscal-tear", description: "Grading system with MRI examples" },
          { label: "Meniscal degeneration vs tear", url: "https://radiopaedia.org/articles/meniscal-degeneration", description: "How to differentiate grade 2 from grade 3" },
        ],
      },
      {
        title: "Meniscal Tear Types",
        diagram: {
          src: "/images/modules/meniscal-tear-types.svg",
          alt: "Meniscal tear morphology — 5 types",
          caption: "Horizontal, vertical longitudinal, radial, bucket-handle (displaced), and root tear patterns.",
        },
        radiopaediaLinks: [
          { label: "Horizontal cleavage tear", url: "https://radiopaedia.org/articles/horizontal-meniscal-tear", description: "Most common degenerative tear pattern" },
          { label: "Bucket-handle tear", url: "https://radiopaedia.org/articles/bucket-handle-meniscal-tear", description: "Double PCL sign, absent bow-tie sign, flipped meniscus sign" },
          { label: "Radial meniscal tear", url: "https://radiopaedia.org/articles/radial-meniscal-tear", description: "Ghost meniscus sign, disrupts hoop stress" },
          { label: "Meniscal root tear", url: "https://radiopaedia.org/articles/meniscal-root-tear", description: "Ghost sign, extrusion, functional meniscectomy equivalent" },
          { label: "Ramp lesion", url: "https://radiopaedia.org/articles/ramp-lesion-meniscus", description: "Peripheral meniscocapsular tear associated with ACL injuries" },
        ],
      },
      {
        title: "Meniscal Extrusion",
        diagram: {
          src: "/images/modules/meniscal-extrusion.svg",
          alt: "Meniscal extrusion measurement technique",
          caption: "Measure on coronal image at mid-body. >3mm pathologic, >5mm suggests severe extrusion and major functional loss.",
        },
        radiopaediaLinks: [
          { label: "Meniscal extrusion", url: "https://radiopaedia.org/articles/meniscal-extrusion", description: "Measurement technique and clinical significance" },
        ],
      },
    ],
  },
  {
    title: "Ligaments",
    entries: [
      {
        title: "Cruciate Ligaments (ACL & PCL)",
        diagram: {
          src: "/images/modules/cruciate-ligaments.svg",
          alt: "ACL and PCL on sagittal view",
          caption: "ACL: posterolateral femoral condyle to anterior tibia. PCL: anteromedial femoral condyle to posterior tibia.",
        },
        radiopaediaLinks: [
          { label: "Normal ACL anatomy", url: "https://radiopaedia.org/articles/anterior-cruciate-ligament", description: "Course, appearance, and evaluation on sagittal MRI" },
          { label: "ACL tear", url: "https://radiopaedia.org/articles/anterior-cruciate-ligament-tear", description: "Primary and secondary signs of complete and partial tears" },
          { label: "Normal PCL anatomy", url: "https://radiopaedia.org/articles/posterior-cruciate-ligament", description: "Smooth arc, dark signal on all sequences" },
          { label: "PCL tear", url: "https://radiopaedia.org/articles/posterior-cruciate-ligament-injury", description: "Dashboard mechanism, discontinuity, thickening, and increased signal" },
        ],
      },
      {
        title: "Collateral & Posterolateral Corner",
        radiopaediaLinks: [
          { label: "MCL injury", url: "https://radiopaedia.org/articles/medial-collateral-ligament-injury-knee", description: "Grade I-III sprains, superficial vs deep layer" },
          { label: "LCL anatomy and injury", url: "https://radiopaedia.org/articles/lateral-collateral-ligament-of-the-knee", description: "Cord-like structure, usually part of PLC injury" },
          { label: "Posterolateral corner injury", url: "https://radiopaedia.org/articles/posterolateral-corner-injury", description: "LCL, popliteus, popliteofibular ligament, arcuate sign" },
          { label: "MPFL tear", url: "https://radiopaedia.org/articles/medial-patellofemoral-ligament", description: "Primary restraint to lateral patellar dislocation" },
        ],
      },
    ],
  },
  {
    title: "Bone & Contusion Patterns",
    entries: [
      {
        title: "Bone Contusion Patterns",
        diagram: {
          src: "/images/modules/contusion-patterns.svg",
          alt: "Bone contusion patterns — pivot-shift, dashboard, patellar dislocation",
          caption: "Pivot-shift (ACL): posterolateral tibia + LFC. Dashboard (PCL): anterior tibia. Patellar dislocation: medial patella + anterolateral LFC.",
        },
        radiopaediaLinks: [
          { label: "Bone contusion patterns (pivot-shift & others)", url: "https://radiopaedia.org/articles/patterns-of-bone-bruise-in-knee-injury", description: "Five classic patterns including pivot-shift — posterolateral tibial plateau + lateral femoral condyle" },
          { label: "PCL tear (dashboard mechanism)", url: "https://radiopaedia.org/articles/posterior-cruciate-ligament-tear", description: "Dashboard injury — anterior tibial contusion with PCL tear" },
          { label: "Patellar dislocation contusions", url: "https://radiopaedia.org/articles/transient-lateral-patellar-dislocation", description: "Kissing contusions: medial patella + anterolateral LFC" },
          { label: "Segond fracture", url: "https://radiopaedia.org/articles/segond-fracture", description: "Lateral capsular avulsion — pathognomonic for ACL tear" },
        ],
      },
      {
        title: "Subchondral Lesions",
        radiopaediaLinks: [
          { label: "SIFK / SONK", url: "https://radiopaedia.org/articles/subchondral-insufficiency-fracture-of-the-knee", description: "Subchondral insufficiency fracture — older patients, medial femoral condyle" },
          { label: "Osteochondritis dissecans (OCD)", url: "https://radiopaedia.org/articles/osteochondritis-dissecans", description: "Juvenile vs adult, stability assessment on MRI" },
          { label: "Avascular necrosis of the knee", url: "https://radiopaedia.org/articles/avascular-necrosis", description: "Serpentine low-signal line, double-line sign" },
        ],
      },
    ],
  },
  {
    title: "Extensor Mechanism & Patellofemoral",
    entries: [
      {
        title: "Extensor Mechanism Anatomy",
        diagram: {
          src: "/images/modules/extensor-mechanism.svg",
          alt: "Extensor mechanism — quad tendon, patella, patellar tendon, MPFL",
          caption: "Quadriceps tendon (3 layers) → patella → patellar tendon → tibial tubercle. Inset: MPFL on axial view.",
        },
        radiopaediaLinks: [
          { label: "Quadriceps tendon tear", url: "https://radiopaedia.org/articles/quadriceps-tendon-tear", description: "Partial (deep layer) vs complete. Sagittal PD FS evaluation." },
          { label: "Patellar tendon rupture", url: "https://radiopaedia.org/articles/patellar-tendon-rupture", description: "Patella alta, tendon discontinuity, infrapatellar fat pad edema" },
          { label: "Patellar tendinopathy", url: "https://radiopaedia.org/articles/patellar-tendinopathy", description: "Jumper's knee — thickening and signal at proximal insertion" },
          { label: "Bipartite patella", url: "https://radiopaedia.org/articles/bipartite-patella", description: "Superolateral accessory ossicle — smooth corticated margins vs fracture" },
        ],
      },
      {
        title: "Patellofemoral Instability",
        radiopaediaLinks: [
          { label: "Lateral patellar dislocation", url: "https://radiopaedia.org/articles/transient-lateral-patellar-dislocation", description: "MPFL tear, osteochondral injury, loose bodies, predisposing anatomy" },
          { label: "Trochlear dysplasia", url: "https://radiopaedia.org/articles/trochlear-dysplasia", description: "Dejour classification — crossing sign, supratrochlear spur, double contour" },
          { label: "Patella alta", url: "https://radiopaedia.org/articles/patella-alta", description: "Insall-Salvati ratio >1.2, instability risk factor" },
        ],
      },
    ],
  },
  {
    title: "Cartilage & Joint",
    entries: [
      {
        title: "Cartilage Pathology",
        radiopaediaLinks: [
          { label: "Articular cartilage of the knee", url: "https://radiopaedia.org/articles/articular-cartilage", description: "Normal appearance, grading, and evaluation on MRI" },
          { label: "Cartilage injury (overview)", url: "https://radiopaedia.org/articles/cartilage-injury-overview", description: "Spectrum of chondral lesions — grading, partial and full-thickness loss on MRI" },
          { label: "Osteochondral fracture", url: "https://radiopaedia.org/articles/osteochondral-fracture", description: "Acute cartilage/bone injury, loose body formation" },
        ],
      },
      {
        title: "Effusion & Synovial Pathology",
        radiopaediaLinks: [
          { label: "Knee joint effusion", url: "https://radiopaedia.org/articles/joint-effusion", description: "Grading, distribution, and diagnostic significance" },
          { label: "Lipohemarthrosis", url: "https://radiopaedia.org/articles/lipohemarthrosis", description: "Fat-fluid level = intra-articular fracture" },
          { label: "Baker cyst", url: "https://radiopaedia.org/articles/popliteal-cyst", description: "Posteromedial, between semimembranosus and medial gastrocnemius" },
          { label: "PVNS", url: "https://radiopaedia.org/articles/pigmented-villonodular-synovitis", description: "Blooming artifact on gradient echo, hemosiderin deposition" },
        ],
      },
    ],
  },
  {
    title: "Systematic Search Pattern",
    entries: [
      {
        title: "7-Step Search Pattern",
        diagram: {
          src: "/images/modules/search-pattern-flowchart.svg",
          alt: "7-step systematic search pattern flowchart",
          caption: "Verify & Orient → Bones & Marrow → Cartilage → Menisci → Ligaments → Extensor Mechanism → Synovium/Bursae.",
        },
        radiopaediaLinks: [
          { label: "Approach to knee MRI", url: "https://radiopaedia.org/articles/knee-mri-an-approach", description: "Systematic approach to interpreting knee MRI" },
          { label: "Knee joint anatomy", url: "https://radiopaedia.org/articles/knee-joint-1", description: "Comprehensive knee anatomy — bones, ligaments, menisci, and normal MRI appearance" },
        ],
      },
    ],
  },
];

export default function VisualAtlas() {
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
    setOpenSections(new Set(atlasSections.map((_, i) => i)));
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
        {atlasSections.map((section, idx) => (
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
                  {section.entries.length} {section.entries.length === 1 ? "topic" : "topics"}
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
              <div className="border-t border-gray-100 px-5 py-4 space-y-6">
                {section.entries.map((entry) => (
                  <div key={entry.title}>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">
                      {entry.title}
                    </h4>

                    {/* SVG Diagram */}
                    {entry.diagram && (
                      <figure className="mb-4 overflow-hidden rounded-lg border border-gray-200">
                        <img
                          src={entry.diagram.src}
                          alt={entry.diagram.alt}
                          loading="lazy"
                          className="w-full bg-white"
                        />
                        <figcaption className="bg-gray-50 px-4 py-2 text-xs text-gray-500">
                          {entry.diagram.caption}
                        </figcaption>
                      </figure>
                    )}

                    {/* Radiopaedia Links */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        MRI Examples (Radiopaedia)
                      </p>
                      {entry.radiopaediaLinks.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 hover:border-ucla-blue/30 hover:bg-ucla-light/20 transition-colors group"
                        >
                          <svg
                            className="h-4 w-4 shrink-0 mt-0.5 text-gray-500 group-hover:text-ucla-blue transition-colors"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-ucla-blue group-hover:underline">
                              {link.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {link.description}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-500 text-center">
        MRI examples link to Radiopaedia.org (CC BY-NC-SA 3.0). Diagrams are original illustrations.
      </p>
    </div>
  );
}
