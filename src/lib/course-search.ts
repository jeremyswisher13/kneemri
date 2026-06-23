import { coursePath, type CourseDefinition } from "@/content/courses";
import { measurementSections, type MeasurementSection } from "@/components/ui/MeasurementsCard";
import { shoulderAnatomySections, shoulderMeasurementSections } from "@/content/shoulder/reference";
import { hipAnatomySections, hipMeasurementSections } from "@/content/hip/reference";
import { elbowAnatomySections, elbowMeasurementSections } from "@/content/elbow/reference";

export function moduleTopicSearchRoute(course: CourseDefinition, moduleId: string, topicIndex: number): string {
  return coursePath(course, `/modules/${moduleId}?topic=${topicIndex}`);
}

export function referenceSectionsForCourse(course: CourseDefinition): MeasurementSection[] {
  if (course.bodyRegion === "shoulder") {
    return [...shoulderAnatomySections, ...shoulderMeasurementSections];
  }
  if (course.bodyRegion === "hip") {
    return [...hipAnatomySections, ...hipMeasurementSections];
  }
  if (course.bodyRegion === "elbow") {
    return [...elbowAnatomySections, ...elbowMeasurementSections];
  }
  return measurementSections;
}
