/**
 * Shared types for the interactive "master normal first" MRI workstations
 * (Normal Knee MRI, Normal Shoulder MRI, …). Region-agnostic so the same
 * components — GuidedTour, KnowledgeCheck, CrossPlaneDrill, AdvancedChallenge,
 * MarkerAdjuster — serve every body region; each region supplies its own data.
 *
 * Marker coordinates are PERCENTAGES of the displayed slice image (x = left,
 * y = top). sliceIndex is 0-based into that plane's stack (slice_01.jpg = index 0).
 */

export interface Marker {
  x: number; // % from left
  y: number; // % from top
  label?: string; // shown in the tour (and as the answer in the check)
}

export interface TourStep {
  sliceIndex: number;
  markers: Marker[];
  title: string;
  note: string;
}

export interface QuizItem {
  id: string;
  sliceIndex: number;
  marker: { x: number; y: number };
  /** Verified anatomy at the marker, used for localization prompts. */
  locateLabel?: string;
  /** Landmark-specific feedback for localization practice. */
  locateExplanation?: string;
  prompt: string;
  options: string[];
  answer: number; // index into options
  explanation: string;
}

export interface PlaneLearn {
  tour: TourStep[];
  quiz: QuizItem[];
}

/**
 * Anatomy + ultrasound correlate for a normal structure, shown beside the MRI in
 * the Guided Tour. Lets fellows build the MRI ↔ anatomy ↔ US mental model while
 * they scroll. `ultrasound.seen` tells fellows whether US can even show the
 * structure (a high-yield teaching point in itself — US is great for superficial
 * tendons/ligaments/fluid, blind to the cruciates, cartilage surface, and marrow).
 */
export interface StructureCorrelate {
  /** Labeled anatomy diagram (SVG). */
  anatomy?: { src: string; caption: string };
  ultrasound: {
    /** Does ultrasound reliably show this structure? */
    seen: boolean;
    /** US appearance when seen, or why it can't be imaged when not. */
    appearance: string;
    /** Probe position / scanning technique (when seen). */
    tip?: string;
    /** A real US still (CC-licensed), dropped in once sourced + approved. */
    image?: { src: string; caption: string; attribution: string };
  };
}

/**
 * Inline "reading point" woven into a Guided Tour step — the normal variant a
 * beginner should NOT over-call, and/or the key measurement for that structure.
 * Keyed by tour-step title; either field optional (omit when not high-yield).
 */
export interface StructureReading {
  /** The normal variant / "don't over-call" pitfall for this structure. */
  variant?: string;
  /** The key measurement or quantified threshold tied to this structure. */
  measure?: string;
}

/** Cross-plane correlation: a structure labeled on one plane, found on another. */
export interface CorrelationItem {
  id: string;
  prompt: string;
  explanation: string;
  from: { plane: string; dir: string; sliceIndex: number; x: number; y: number; label: string };
  to: { plane: string; dir: string; sliceIndex: number; candidates: { x: number; y: number }[]; answer: number };
}

/** Higher-level, board-style multiple-choice question for the Advanced challenge. */
export interface AdvancedQ {
  id: string;
  topic: string;
  prompt: string;
  options: string[];
  answer: number; // 0-based index of the correct option
  explanation: string;
}

/**
 * Image-anchored CAQ question: a clinical vignette tied to a specific verified
 * slice of a real stack. The fellow scrolls the actual MRI (opened at startIndex)
 * before committing to a board-style single-best-answer — "read it like a
 * radiologist, then answer."
 */
export interface ImageCaqQ {
  id: string;
  topic: string;
  /** Stack folder to display (e.g. /images/teaching/stacks/normal-knee-sagittal). */
  dir: string;
  /** Number of slices in the stack. */
  count: number;
  /** 0-based slice the question is anchored to (the viewer opens here). */
  startIndex: number;
  /** Plane label shown on the viewer (e.g. "Sagittal PD-FS"). */
  plane: string;
  vignette: string;
  options: string[];
  answer: number; // 0-based index of the correct option
  explanation: string;
}
