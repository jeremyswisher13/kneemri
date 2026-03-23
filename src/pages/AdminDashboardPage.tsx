import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { getAllFellows } from "@/lib/firestore";
import { moduleRegistry } from "@/content/modules";
import { caseRegistry } from "@/content/cases";

interface Fellow {
  id: string;
  name?: string;
  displayName?: string;
  email?: string;
  preQuizScore: number | null;
  postQuizScore: number | null;
  modulesCompleted: number;
  casesCompleted: number;
}

export default function AdminDashboardPage() {
  const [fellows, setFellows] = useState<Fellow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllFellows()
      .then((data) => setFellows(data as Fellow[]))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
        <p className="text-red-700 font-medium">Error loading fellows</p>
        <p className="text-sm text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  const totalModules = moduleRegistry.length;
  const totalCases = caseRegistry.length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-1 text-gray-500">
        Overview of fellow progress through the Knee MRI course.
      </p>

      <div className="mt-8">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 pr-6 font-semibold text-gray-900">
                    Name
                  </th>
                  <th className="pb-3 pr-6 font-semibold text-gray-900">
                    Pre-Quiz Score
                  </th>
                  <th className="pb-3 pr-6 font-semibold text-gray-900">
                    Post-Quiz Score
                  </th>
                  <th className="pb-3 pr-6 font-semibold text-gray-900">
                    Modules Completed
                  </th>
                  <th className="pb-3 font-semibold text-gray-900">
                    Cases Completed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fellows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No fellows enrolled yet.
                    </td>
                  </tr>
                ) : (
                  fellows.map((fellow) => (
                    <tr key={fellow.id} className="hover:bg-gray-50">
                      <td className="py-3 pr-6 font-medium text-gray-900">
                        {fellow.displayName || fellow.name || fellow.email || "Unknown"}
                      </td>
                      <td className="py-3 pr-6 text-gray-600">
                        {fellow.preQuizScore !== null ? (
                          <span
                            className={
                              fellow.preQuizScore >= 70
                                ? "text-green-600"
                                : "text-amber-600"
                            }
                          >
                            {fellow.preQuizScore}
                          </span>
                        ) : (
                          <span className="text-gray-400">Not started</span>
                        )}
                      </td>
                      <td className="py-3 pr-6 text-gray-600">
                        {fellow.postQuizScore !== null ? (
                          <span
                            className={
                              fellow.postQuizScore >= 70
                                ? "text-green-600"
                                : "text-amber-600"
                            }
                          >
                            {fellow.postQuizScore}
                          </span>
                        ) : (
                          <span className="text-gray-400">Not started</span>
                        )}
                      </td>
                      <td className="py-3 pr-6">
                        <span className="text-gray-900">
                          {fellow.modulesCompleted}
                        </span>
                        <span className="text-gray-400">/{totalModules}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-gray-900">
                          {fellow.casesCompleted}
                        </span>
                        <span className="text-gray-400">/{totalCases}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
