import type { CourseDefinition } from "@/content/courses";

const KNOWN_ROUTE_TITLES: Record<string, string> = {
  "pre-assessment": "Pre-Assessment",
  "post-assessment": "Post-Assessment",
  "pre-survey": "Pre-Survey",
  "post-survey": "Post-Survey",
  modules: "Modules",
  cases: "Cases",
  review: "Spaced Review",
  reference: "Reference",
  certificate: "Certificate",
  "search-pattern": "Search Pattern",
  "normal-knee-mri": "Normal Knee MRI",
  "normal-shoulder-mri": "Normal Shoulder MRI",
  "normal-hip-mri": "Normal Hip MRI",
  "normal-elbow-mri": "Normal Elbow MRI",
};

const ACRONYM_TITLES: Record<string, string> = {
  ac: "AC",
  acl: "ACL",
  avn: "AVN",
  caq: "CAQ",
  ct: "CT",
  fai: "FAI",
  fadir: "FADIR",
  faber: "FABER",
  gtps: "GTPS",
  lcl: "LCL",
  lucl: "LUCL",
  mcl: "MCL",
  mpfl: "MPFL",
  mr: "MR",
  mri: "MRI",
  ocd: "OCD",
  pcl: "PCL",
  plc: "PLC",
  rcl: "RCL",
  sifk: "SIFK",
  tttg: "TT-TG",
  ucl: "UCL",
};

export function fallbackRouteTitle(segment: string) {
  return segment
    .split("-")
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      return ACRONYM_TITLES[lower] ?? `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
    })
    .join(" ");
}

export function pageTitleForRouteSegment(segment: string, activeCourse: CourseDefinition, isCourseRoot: boolean) {
  if (isCourseRoot) return "Dashboard";
  const authoredTitle =
    activeCourse.modules.find((module) => module.id === segment)?.title ??
    activeCourse.cases.find((studyCase) => studyCase.id === segment)?.title;
  return KNOWN_ROUTE_TITLES[segment] || authoredTitle || fallbackRouteTitle(segment) || "Dashboard";
}
