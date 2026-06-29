// Interactive Normal MRI Knowledge Check passes required for each workstation.
// The Firestore collection name remains "normalKnee" for legacy reasons, but
// these IDs are course-disambiguated across knee, shoulder, hip, and elbow.
export const NORMAL_KNEE_PLANE_IDS = ["sag-pdfs", "cor-pdfs", "axi-t2fs", "sag-t1"];
export const NORMAL_SHOULDER_PLANE_IDS = ["sh-sag-t2fs", "sh-cor-t2fs", "sh-axi-t2fs", "sh-sag-t1"];
export const NORMAL_HIP_PLANE_IDS = ["hip-cor-t2fs", "hip-axi", "hip-sag"];
export const NORMAL_ELBOW_PLANE_IDS = ["elbow-cor-t2fs", "elbow-axi-t2fs", "elbow-sag-ir"];
export const NORMAL_KNEE_PASS_PCT = 0.7;

export function normalPlaneIdsFor(bodyRegion: string): string[] {
  if (bodyRegion === "knee") return NORMAL_KNEE_PLANE_IDS;
  if (bodyRegion === "shoulder") return NORMAL_SHOULDER_PLANE_IDS;
  if (bodyRegion === "hip") return NORMAL_HIP_PLANE_IDS;
  if (bodyRegion === "elbow") return NORMAL_ELBOW_PLANE_IDS;
  return [];
}
