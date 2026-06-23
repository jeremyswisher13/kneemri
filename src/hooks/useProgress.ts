import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { defaultCourse, type CourseDefinition } from "@/content/courses";
import type { UserProgress } from "@/types/progress";

/**
 * Loads course-scoped progress for the signed-in user.
 * Pass the active course (from `useActiveCourse()`) so knee and shoulder
 * progress stay independent. Defaults to the knee course when omitted.
 */
export function useProgress(course: CourseDefinition = defaultCourse) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const courseId = course.id;

  const refresh = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { loadProgress } = await import("@/lib/firestore");
      const data = await loadProgress(user.uid, course);
      setProgress(data);
    } catch (err) {
      console.error("Failed to load progress:", err);
    } finally {
      setLoading(false);
    }
    // course is keyed by id; refetch when the active course changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, courseId]);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    import("@/lib/firestore")
      .then(({ loadProgress }) => loadProgress(user.uid, course))
      .then((data) => { if (!cancelled) setProgress(data); })
      .catch((err) => console.error("Failed to load progress:", err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, courseId]);

  return { progress, loading, refresh };
}
