import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { moduleRegistry } from "@/content/modules";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { completeModule } from "@/lib/firestore";

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user } = useAuth();
  const { progress, loading: progressLoading, refresh } = useProgress();

  const moduleIndex = moduleRegistry.findIndex((m) => m.id === moduleId);
  const mod = moduleRegistry[moduleIndex];
  const prevModule = moduleIndex > 0 ? moduleRegistry[moduleIndex - 1] : null;
  const nextModule =
    moduleIndex < moduleRegistry.length - 1
      ? moduleRegistry[moduleIndex + 1]
      : null;

  const [completing, setCompleting] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set());

  const completed = !progressLoading && progress?.moduleProgress?.some(
    (m: any) => m.id === moduleId && m.completed
  );

  if (!mod) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Module Not Found</h1>
        <p className="mt-2 text-gray-500">
          The requested module could not be found.
        </p>
        <Link to="/modules" className="mt-4 inline-block">
          <Button variant="secondary">Back to Modules</Button>
        </Link>
      </div>
    );
  }

  function toggleTopic(index: number) {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function expandAll() {
    setExpandedTopics(new Set(mod.topics.map((_, i) => i)));
  }

  async function handleComplete() {
    if (!user) return;
    setCompleting(true);
    try {
      await completeModule(user.uid, user.email || "", mod.id);
      await refresh();
    } catch {
      // silently fail
    } finally {
      setCompleting(false);
    }
  }

  // Generate teaching content for each topic based on module context
  const topicTeachingContent: Record<number, { content: string; pearl?: string }> = {};
  mod.topics.forEach((topic, i) => {
    topicTeachingContent[i] = {
      content: `This section covers ${topic.toLowerCase()}. Review this topic carefully and consider how it applies to clinical knee MRI interpretation. Understanding this concept is essential for systematic reading.`,
      pearl:
        mod.searchPatternStep !== null
          ? `Search Pattern Step ${mod.searchPatternStep}: Always evaluate this finding as part of your systematic approach.`
          : undefined,
    };
  });

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/modules" className="hover:text-ucla-blue transition-colors">
          Modules
        </Link>
        <span>/</span>
        <span className="text-gray-600">Module {mod.number}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ucla-blue text-white text-sm font-bold">
            {mod.number}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{mod.title}</h1>
            <p className="text-gray-500">{mod.subtitle}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {mod.estimatedMinutes} min estimated
          </span>
          <span>{mod.topics.length} topics</span>
          {completed && (
            <span className="inline-flex items-center gap-1 text-green-600 font-medium">
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Completed
            </span>
          )}
        </div>
      </div>

      {/* Expand All Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={expandAll}
          className="text-sm text-ucla-blue hover:underline"
        >
          Expand all sections
        </button>
      </div>

      {/* Topics as expandable sections */}
      <div className="space-y-3">
        {mod.topics.map((topic, i) => {
          const isExpanded = expandedTopics.has(i);
          const teaching = topicTeachingContent[i];

          return (
            <Card key={i} className="overflow-hidden !p-0">
              <button
                onClick={() => toggleTopic(i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ucla-light text-ucla-blue text-xs font-semibold">
                    {i + 1}
                  </span>
                  <span className="font-medium text-gray-900">{topic}</span>
                </div>
                <svg
                  className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 px-6 py-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {teaching.content}
                  </p>

                  {teaching.pearl && (
                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
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
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-amber-800">
                            Clinical Pearl
                          </p>
                          <p className="mt-1 text-sm text-amber-700">
                            {teaching.pearl}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Completion Section */}
      <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 text-center">
        {completed ? (
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-gray-900">
              Module Complete
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Great work! You have completed this module.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Finished reviewing this module?
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Mark it complete to track your progress.
            </p>
            <Button
              className="mt-4"
              size="lg"
              onClick={handleComplete}
              disabled={completing}
            >
              {completing ? "Saving..." : "Mark Module Complete"}
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          {prevModule ? (
            <Link to={`/modules/${prevModule.id}`}>
              <Button variant="secondary" size="sm">
                &larr; Module {prevModule.number}: {prevModule.title}
              </Button>
            </Link>
          ) : (
            <Link to="/modules">
              <Button variant="secondary" size="sm">
                &larr; Back to Modules
              </Button>
            </Link>
          )}
        </div>
        <div>
          {nextModule && (
            <Link to={`/modules/${nextModule.id}`}>
              <Button size="sm">
                Module {nextModule.number}: {nextModule.title} &rarr;
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
