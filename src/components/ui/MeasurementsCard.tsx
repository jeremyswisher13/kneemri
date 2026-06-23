/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";

export interface MeasurementSection {
  title: string;
  items: { label: string; detail: string }[];
}

export const measurementSections: MeasurementSection[] = [
  {
    title: "Meniscal Measurements",
    items: [
      {
        label: "Meniscal extrusion",
        detail:
          ">3 mm = pathologic; >5 mm suggests severe extrusion with major loss of hoop function. Measure on coronal image at mid-body, referenced to tibial plateau margin.",
      },
      {
        label: "Two-slice-touch rule",
        detail:
          "Signal must reach articular surface on \u22652 consecutive sagittal images (3\u20134 mm slices) to diagnose a tear.",
      },
      {
        label: "Normal posterior horn size",
        detail:
          "Medial meniscus posterior horn should be ~2\u00d7 the AP dimension of the anterior horn. If smaller, consider displaced tear or root avulsion.",
      },
    ],
  },
  {
    title: "Meniscal Signal Grading",
    items: [
      {
        label: "Grade 1",
        detail:
          "Small globular focus of intrameniscal signal, not reaching articular surface. Represents early mucinous degeneration. Not surgical.",
      },
      {
        label: "Grade 2",
        detail:
          "Linear intrameniscal signal (often horizontal), not reaching articular surface. Degenerative change. Very common over age 40. Not surgical.",
      },
      {
        label: "Grade 3",
        detail:
          "Signal extending to at least one articular surface on proton density / intermediate-weighted (short-TE) sequences. This is a TRUE TEAR. Confirm on \u22652 consecutive slices.",
      },
    ],
  },
  {
    title: "Cartilage Grading (Modified ICRS)",
    items: [
      {
        label: "Grade 0",
        detail: "Normal cartilage. Uniform thickness, smooth surface, homogeneous signal.",
      },
      {
        label: "Grade 1",
        detail:
          "Signal heterogeneity with intact surface. May see mild signal changes on PD FS without surface irregularity.",
      },
      {
        label: "Grade 2",
        detail:
          "Partial-thickness defect (<50% depth). Visible surface irregularity or fissure not extending to subchondral bone.",
      },
      {
        label: "Grade 3",
        detail:
          "Deep defect (>50% depth) extending to but not through subchondral plate. Fluid signal fills the defect.",
      },
      {
        label: "Grade 4",
        detail:
          "Full-thickness defect with exposed subchondral bone. May see reactive marrow edema. Report size, compartment, and weight-bearing status.",
      },
    ],
  },
  {
    title: "MCL Injury Grading",
    items: [
      {
        label: "Grade I (Sprain)",
        detail:
          "Edema surrounding intact MCL fibers. No fiber discontinuity. Ligament may appear thickened but continuous. Treated conservatively.",
      },
      {
        label: "Grade II (Partial tear)",
        detail:
          "Partial fiber disruption with surrounding edema. Ligament thickened with some intact fibers visible. May have focal discontinuity.",
      },
      {
        label: "Grade III (Complete tear)",
        detail:
          "Complete fiber discontinuity. Fluid-filled gap between torn ends. Specify: superficial MCL, deep MCL (meniscotibial), or both. Surgical consideration.",
      },
      {
        label: "Location matters",
        detail:
          "Femoral attachment (most common), mid-substance, or tibial insertion (distal avulsion). Deep MCL injury can cause meniscal displacement.",
      },
    ],
  },
  {
    title: "Patellar Measurements",
    items: [
      {
        label: "Insall-Salvati ratio",
        detail:
          "Patellar tendon length / patellar length. Normal 0.8\u20131.2. >1.2 = patella alta (instability risk), <0.8 = patella baja.",
      },
      {
        label: "TT-TG distance",
        detail:
          "<15 mm normal, 15\u201320 mm borderline, >20 mm = increased risk of patellar instability. Measure on axial images.",
      },
      {
        label: "Trochlear dysplasia",
        detail:
          "Dejour classification: Type A (shallow trochlea, crossing sign), Type B (flat/convex trochlea, supratrochlear spur), Types C/D (asymmetric facets, cliff pattern).",
      },
    ],
  },
  {
    title: "Ligament Assessments",
    items: [
      {
        label: "Anterior tibial translation",
        detail:
          ">5 mm of anterior tibial translation on the mid-lateral sagittal image is a specific secondary sign of ACL insufficiency. Measure from the posterior cortex of the lateral femoral condyle to the posterior tibial plateau.",
      },
      {
        label: "PCL angle",
        detail:
          "Normal PCL has a smooth low-signal arc on sagittal images. PCL tear is suggested by discontinuity, thickening, and increased intrasubstance signal. A low PCL angle/buckled contour is more often a secondary sign of anterior tibial translation from ACL insufficiency.",
      },
      {
        label: "ACL evaluation checklist",
        detail:
          "Check: fiber continuity, trajectory (parallel to Blumensaat line), signal intensity, tension. Secondary signs: anterior tibial translation, pivot-shift contusions, empty notch sign.",
      },
    ],
  },
  {
    title: "Effusion Classification",
    items: [
      {
        label: "Small effusion",
        detail:
          "Fluid in suprapatellar pouch only. Thin layer without significant distension. Common incidental finding.",
      },
      {
        label: "Moderate effusion",
        detail:
          "Distension of suprapatellar pouch with fluid extending into parapatellar and posterior recesses. Usually symptomatic.",
      },
      {
        label: "Large effusion",
        detail:
          "Marked distension of all recesses. May cause patellar floating sign. Consider: acute injury (hemarthrosis), inflammatory, or infectious.",
      },
      {
        label: "Lipohemarthrosis",
        detail:
          "Fat-fluid level on axial images (fat floats on blood). Pathognomonic for intra-articular fracture, even if fracture line is occult.",
      },
    ],
  },
  {
    title: "OCD Stability Criteria",
    items: [
      {
        label: "Stable (likely intact)",
        detail:
          "Low-signal rim without fluid undermining the fragment. No cystic change at interface. Fragment in anatomic position. May have surrounding edema (not specific).",
      },
      {
        label: "Unstable (likely loose)",
        detail:
          "High T2 signal (fluid) at fragment-parent bone interface. Cystic change beneath fragment. Fragment displacement or rotation. Breach of overlying cartilage.",
      },
      {
        label: "Key pearl",
        detail:
          "Surrounding edema alone does NOT mean unstable. Must see fluid signal at the interface, cysts, or displacement to call it unstable.",
      },
    ],
  },
  {
    title: "Bone Measurements",
    items: [
      {
        label: "Notch width index",
        detail:
          "<0.2 suggests notch stenosis and increased risk of ACL impingement. Measure on coronal image at level of popliteal groove.",
      },
      {
        label: "Contusion pattern recognition",
        detail:
          "Pivot-shift: posterolateral tibial plateau + lateral femoral condyle (ACL). Dashboard: anterior proximal tibia (PCL). Patellar dislocation: medial patellar facet + anterolateral LFC.",
      },
      {
        label: "Fracture vs. contusion on T1",
        detail:
          "Discrete low-signal LINE within marrow edema = fracture (changes weight-bearing protocol). Ill-defined low signal without line = contusion.",
      },
    ],
  },
];

export default function MeasurementsCard({
  sections = measurementSections,
}: {
  sections?: MeasurementSection[];
} = {}) {
  const [openSections, setOpenSections] = useState<Set<number>>(
    new Set(sections.map((_, i) => i))
  );

  function toggleSection(index: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function collapseAll() {
    setOpenSections(new Set());
  }

  function expandAll() {
    setOpenSections(new Set(sections.map((_, i) => i)));
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
        {sections.map((section, idx) => (
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
                  {section.items.length} items
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {openSections.has(idx) && (
              <div className="border-t border-gray-100 px-5 py-3 space-y-3">
                {section.items.map((item) => (
                  <div key={item.label}>
                    <p className="text-sm font-medium text-ucla-blue">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-600">
                      {item.detail}
                    </p>
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
