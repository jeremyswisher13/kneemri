import { useState } from "react";
import MeasurementsCard from "@/components/ui/MeasurementsCard";
import AnatomyReference from "@/components/ui/AnatomyReference";
import VisualAtlas from "@/components/ui/VisualAtlas";
import RedFlagCard from "@/components/ui/RedFlagCard";
import SurgicalCorrelates from "@/components/ui/SurgicalCorrelates";
import { shoulderAnatomySections, shoulderMeasurementSections } from "@/content/shoulder/reference";
import { hipAnatomySections, hipMeasurementSections } from "@/content/hip/reference";
import { elbowAnatomySections, elbowMeasurementSections } from "@/content/elbow/reference";

type Tab = "atlas" | "anatomy" | "measurements";

/**
 * The full "everything you need to read this MRI" reference body — red-flag
 * safety net, anatomy/planes/sequences + measurements/grading, and (when toggled)
 * surgical correlates. Region-driven and self-contained so it can be rendered on
 * the standalone Quick Reference page AND embedded as the workstation's "Learn
 * the read" mode, keeping the workstation a complete learning hub.
 */
export default function CourseReference({ region }: { region: string }) {
  const isKnee = region === "knee";

  // Knee ships the rich Visual Atlas + anatomy guide; shoulder and hip use the
  // concise collapsible text sections (MeasurementsCard) authored per course.
  const textSections =
    region === "shoulder"
      ? { anatomy: shoulderAnatomySections, measurements: shoulderMeasurementSections }
      : region === "hip"
        ? { anatomy: hipAnatomySections, measurements: hipMeasurementSections }
        : region === "elbow"
          ? { anatomy: elbowAnatomySections, measurements: elbowMeasurementSections }
          : null;

  const tabs: { key: Tab; label: string }[] = isKnee
    ? [
        { key: "atlas", label: "Visual Atlas" },
        { key: "anatomy", label: "Anatomy Text Guide" },
        { key: "measurements", label: "Measurements & Grading" },
      ]
    : [
        { key: "anatomy", label: "Anatomy & Protocol" },
        { key: "measurements", label: "Measurements & Grading" },
      ];

  const [activeTab, setActiveTab] = useState<Tab>(tabs[0].key);
  const effectiveTab: Tab = tabs.some((t) => t.key === activeTab) ? activeTab : tabs[0].key;

  return (
    <div>
      {/* Don't-miss safety net — the management-changing findings, up top. */}
      <RedFlagCard region={region} />

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
                effectiveTab === tab.key
                  ? "border-ucla-blue text-ucla-blue"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {textSections ? (
        <>
          {effectiveTab === "anatomy" && <MeasurementsCard sections={textSections.anatomy} />}
          {effectiveTab === "measurements" && <MeasurementsCard sections={textSections.measurements} />}
        </>
      ) : (
        <>
          {effectiveTab === "atlas" && <VisualAtlas />}
          {effectiveTab === "anatomy" && <AnatomyReference />}
          {effectiveTab === "measurements" && <MeasurementsCard />}
        </>
      )}

      {/* Surgical / arthroscopic correlate — only when the learner's toggle is on. */}
      <SurgicalCorrelates region={region} />
    </div>
  );
}
