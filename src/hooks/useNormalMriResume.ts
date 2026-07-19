import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCourseById, type CourseId } from "@/content/courses";
import { saveLearnerResume } from "@/lib/learner-resume";
import {
  isRestorableNormalMode,
  normalWorkstationResumePath,
} from "@/lib/normal-workstation-url";

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
    // Only persist a mode the pages can actually read back. Admin-only modes
    // (e.g. "adjust") would otherwise be written into the URL and the resume
    // card, then silently rejected on reload — landing the user in Explore with
    // a resume card that lied about where it would take them.
    const restorable = isRestorableNormalMode(modeId);
    const persistedModeId = restorable ? modeId : "explore";
    const persistedModeLabel = restorable ? modeLabel : "Explore";
    const path = normalWorkstationResumePath({
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      modeId: persistedModeId,
      seriesId,
    });
    saveLearnerResume({
      path,
      title,
      courseId,
      courseTitle: course.shortTitle,
      modeLabel: persistedModeLabel,
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
