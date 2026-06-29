import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { defaultCourse, type CourseDefinition } from "@/content/courses";
import { isLocalPreviewSession } from "@/lib/local-preview-auth";
import { getLocalPreviewProgress, LOCAL_PREVIEW_PROGRESS_EVENT } from "@/lib/local-preview-progress";
import type { UserProgress } from "@/types/progress";

/**
 * Loads course-scoped progress for the signed-in user.
 * Pass the active course (from `useActiveCourse()`) so knee and shoulder
 * progress stay independent. Defaults to the knee course when omitted.
 */
export function useProgress(course: CourseDefinition = defaultCourse) {
  const { user, role } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setPreviewVersion] = useState(0);
  const localPreview = isLocalPreviewSession();

  const courseId = course.id;
  const previewProgress = localPreview ? getLocalPreviewProgress(course, role) : null;

  const refresh = useCallback(async () => {
    if (localPreview) {
      setPreviewVersion((version) => version + 1);
      return;
    }
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
    if (!localPreview || typeof window === "undefined") return;
    const refreshPreview = () => setPreviewVersion((version) => version + 1);
    window.addEventListener(LOCAL_PREVIEW_PROGRESS_EVENT, refreshPreview);
    window.addEventListener("storage", refreshPreview);
    return () => {
      window.removeEventListener(LOCAL_PREVIEW_PROGRESS_EVENT, refreshPreview);
      window.removeEventListener("storage", refreshPreview);
    };
  }, [localPreview]);

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
