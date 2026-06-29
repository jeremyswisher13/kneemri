import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCourseById, type CourseId } from "@/content/courses";
import { saveLearnerResume } from "@/lib/learner-resume";
import { normalWorkstationResumePath } from "@/lib/normal-workstation-url";

interface UseNormalMriResumeArgs {
  courseId: CourseId;
  title: string;
  modeId: string;
  modeLabel: string;
  seriesId: string;
  seriesLabel: string;
}

export function useNormalMriResume({
  courseId,
  title,
  modeId,
  modeLabel,
  seriesId,
  seriesLabel,
}: UseNormalMriResumeArgs) {
  const location = useLocation();
  useEffect(() => {
    const course = getCourseById(courseId);
    const path = normalWorkstationResumePath({
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      modeId,
      seriesId,
    });
    saveLearnerResume({
      path,
      title,
      courseId,
      courseTitle: course.shortTitle,
      modeLabel,
      seriesLabel,
    });
    if (typeof window !== "undefined") {
      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (currentPath !== path) window.history.replaceState(window.history.state, "", path);
    }
  }, [
    courseId,
    location.hash,
    location.pathname,
    location.search,
    modeId,
    modeLabel,
    seriesId,
    seriesLabel,
    title,
  ]);
}
