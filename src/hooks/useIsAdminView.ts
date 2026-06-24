import { useAuth } from "@/contexts/AuthContext";
import { isLocalPreviewSession } from "@/lib/local-preview-auth";

/**
 * True when the current viewer is the course director — either signed in as an
 * admin, or an admin currently previewing the course as a fellow/resident
 * (sessionStorage 'adminPreviewRole'). Used to show "Skip (admin)" controls and
 * to bypass learner gating (e.g., the post-assessment unlock) without touching
 * real learner data — writes are already no-ops in preview mode.
 */
export function useIsAdminView(): boolean {
  const { role } = useAuth();
  if (role === "admin") return true;
  if (isLocalPreviewSession()) return true;
  try {
    return !!sessionStorage.getItem("adminPreviewRole");
  } catch {
    return false;
  }
}
