import { useParams } from "react-router-dom";
import { getCourseById } from "@/content/courses";

export function useActiveCourse() {
  const { courseId } = useParams<{ courseId?: string }>();
  return getCourseById(courseId);
}
