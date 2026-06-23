import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { togglePostQuizUnlock } from "@/lib/firestore";
import { courseRegistry, defaultCourse } from "@/content/courses";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/db";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  // Per-course unlock state, keyed by courseId.
  const [unlockedByCourse, setUnlockedByCourse] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [togglingCourse, setTogglingCourse] = useState<string | null>(null);

  useEffect(() => {
    getDoc(doc(db, "settings", "cohort"))
      .then((snap) => {
        const data = snap.exists() ? snap.data() : {};
        const next: Record<string, boolean> = {};
        for (const c of courseRegistry) {
          next[c.id] =
            data[`postQuizUnlocked_${c.id}`] === true ||
            (c.id === defaultCourse.id && data.postQuizUnlocked === true);
        }
        setUnlockedByCourse(next);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(courseId: string) {
    if (!user) return;
    setTogglingCourse(courseId);
    try {
      const newValue = !unlockedByCourse[courseId];
      await togglePostQuizUnlock(user.uid, user.email || "", newValue, courseId as typeof courseRegistry[number]["id"]);
      setUnlockedByCourse((prev) => ({ ...prev, [courseId]: newValue }));
    } catch (err) {
      console.error("Failed to toggle post-quiz unlock:", err);
      alert("Failed to save setting. Please try again.");
    } finally {
      setTogglingCourse(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
      <p className="mt-1 text-gray-500">
        Manage course settings and assessments.
      </p>

      <div className="mt-8 space-y-6">
        {courseRegistry.map((c) => {
          const unlocked = !!unlockedByCourse[c.id];
          const toggling = togglingCourse === c.id;
          return (
            <Card key={c.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Post-Assessment Access — {c.shortTitle}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Control whether {c.shortTitle} fellows can access the post-assessment
                    quiz and survey.
                  </p>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={() => handleToggle(c.id)}
                  disabled={toggling}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ucla-blue/50 focus:ring-offset-2 disabled:opacity-60 ${
                    unlocked ? "bg-green-500" : "bg-gray-300"
                  }`}
                  role="switch"
                  aria-checked={unlocked}
                  aria-label={`Toggle post-assessment access for ${c.shortTitle}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                      unlocked ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Status Indicator */}
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`inline-flex h-2.5 w-2.5 rounded-full ${
                    unlocked ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    unlocked ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>
            </Card>
          );
        })}

        {/* Warning */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex items-start gap-2">
            <svg
              className="h-5 w-5 shrink-0 text-amber-600 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <p className="text-sm text-amber-700">
              Once unlocked, fellows in that course can take the post-assessment quiz and
              survey. This should typically be done after they have completed the modules
              and case practice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
