import type { CourseDefinition } from "@/content/courses";

export const COURSE_REGION_ACCENTS: Record<CourseDefinition["bodyRegion"], string> = {
  knee: "from-[#003B5C] to-[#2774AE]",
  shoulder: "from-[#2774AE] to-[#0ea5e9]",
  hip: "from-[#155e75] to-[#0891b2]",
  elbow: "from-[#7f1d1d] to-[#e11d48]",
};

export function courseRegionAccent(region: CourseDefinition["bodyRegion"]): string {
  return COURSE_REGION_ACCENTS[region];
}
