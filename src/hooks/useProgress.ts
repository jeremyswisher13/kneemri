import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { defaultCourse, type CourseDefinition } from "@/content/courses";
import { isLocalPreviewSession } from "@/lib/local-preview-auth";
import type { UserProgress } from "@/types/progress";

const NORMAL_PLANE_TOTALS: Record<CourseDefinition["bodyRegion"], number> = {
  knee: 4,
  shoulder: 4,
  hip: 3,
  elbow: 3,
};

function emptyPreviewProgress(course: CourseDefinition): UserProgress {
  return {
    preQuizCompleted: false,
    preQuizScore: null,
    preQuizTotal: null,
    preSurveyCompleted: false,
    preSurveyResponses: null,
    preQuizResponses: null,
    postQuizCompleted: false,
    postQuizScore: null,
    postQuizTotal: null,
    postQuizResponses: null,
    postSurveyCompleted: false,
    postSurveyResponses: null,
    postRetroResponses: null,
    postQuizUnlocked: false,
    modulesCompleted: 0,
    totalModules: course.modules.length,
    casesCompleted: 0,
    totalCases: course.coreCases.length,
    normalMriComplete: false,
    normalPlanesPassed: 0,
    totalNormalPlanes: NORMAL_PLANE_TOTALS[course.bodyRegion],
    moduleProgress: [],
    caseAttempts: [],
  };
}

/**
 * Loads course-scoped progress for the signed-in user.
 * Pass the active course (from `useActiveCourse()`) so knee and shoulder
 * progress stay independent. Defaults to the knee course when omitted.
 */
export function useProgress(course: CourseDefinition = defaultCourse) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const localPreview = isLocalPreviewSession();

  const courseId = course.id;
  const previewProgress = useMemo(
    () => (localPreview ? emptyPreviewProgress(course) : null),
    [course, localPreview],
  );

  const refresh = useCallback(async () => {
    if (localPreview) return;
    if (!user) {
      setProgress(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setProgress(null);
    try {
      const { loadProgress } = await import("@/lib/firestore");
      const data = await loadProgress(user.uid, course);
      setProgress(data);
    } catch (err) {
      console.error("Failed to load progress:", err);
      setProgress(null);
    } finally {
      setLoading(false);
    }
    // course is keyed by id; refetch when the active course changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, courseId, localPreview]);

  useEffect(() => {
    let cancelled = false;
    if (localPreview) return;
    if (!user) {
      setProgress(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setProgress(null);
    import("@/lib/firestore")
      .then(({ loadProgress }) => loadProgress(user.uid, course))
      .then((data) => { if (!cancelled) setProgress(data); })
      .catch((err) => {
        console.error("Failed to load progress:", err);
        if (!cancelled) setProgress(null);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, courseId, localPreview]);

  return {
    progress: previewProgress ?? progress,
    loading: localPreview ? false : loading,
    refresh,
  };
}
