import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPearlsForRegion } from "@/content/daily-pearls";
import { moduleQuizzes } from "@/content/quizzes/module-quizzes";
import { moduleContentById } from "@/content/modules/content-by-id";
import { caseContentById } from "@/content/cases/content-by-id";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { coursePath, getVisibleCoreCases, getVisibleAdvancedCases, type CourseDefinition } from "@/content/courses";
import { moduleTopicSearchRoute, referenceSectionsForCourse } from "@/lib/course-search";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SearchCategory = "module" | "case" | "pearl" | "quiz" | "reference";

interface SearchItem {
  id: string;
  title: string;
  body: string; // full searchable text
  category: SearchCategory;
  route: string;
}

interface SearchResult extends SearchItem {
  excerpt: string; // snippet with match context
}

// ---------------------------------------------------------------------------
// Category metadata (labels + icons)
// ---------------------------------------------------------------------------

const categoryMeta: Record<
  SearchCategory,
  { label: string; icon: React.ReactNode }
> = {
  module: {
    label: "Modules",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  case: {
    label: "Cases",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  pearl: {
    label: "Daily Pearls",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  quiz: {
    label: "Quiz Questions",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  reference: {
    label: "Reference",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
};

const CATEGORY_ORDER: SearchCategory[] = [
  "module",
  "case",
  "pearl",
  "quiz",
  "reference",
];

// ---------------------------------------------------------------------------
// Build search index
// ---------------------------------------------------------------------------

function buildIndex(role: string | null, course: CourseDefinition): SearchItem[] {
  const items: SearchItem[] = [];
  const isResident = role === 'resident';
  const courseModuleIds = new Set(course.modules.map((mod) => mod.id));

  // Modules — each topic is a searchable entry. The lightweight registry metas
  // carry titles/topics; the heavy topicContent comes from the lazy content map
  // (this index is built in GlobalSearch's own lazy chunk).
  course.modules.forEach((mod) => {
    const topicContent = moduleContentById[mod.id]?.topicContent ?? [];
    // Module-level entry
    const topicTexts = mod.topics.join(" ");
    const contentTexts = topicContent.map((t) => t.content).join(" ");
    items.push({
      id: `mod-${mod.id}`,
      title: `Module ${mod.number}: ${mod.title}`,
      body: `${mod.title} ${mod.subtitle} ${topicTexts} ${contentTexts}`,
      category: "module",
      route: coursePath(course, `/modules/${mod.id}`),
    });

    // Individual topics
    mod.topics.forEach((topic, idx) => {
      const tc = topicContent[idx];
      items.push({
        id: `mod-${mod.id}-t${idx}`,
        title: topic,
        body: `${topic} ${tc?.content ?? ""} ${tc?.pearl ?? ""}`,
        category: "module",
        route: moduleTopicSearchRoute(course, mod.id, idx),
      });
    });
  });

  // Cases (filter by role)
  const visibleCases = [
    ...getVisibleCoreCases(course, isResident),
    ...getVisibleAdvancedCases(course, isResident),
  ];
  visibleCases.forEach((c) => {
    const full = caseContentById[c.id];
    const deep = full
      ? `${full.teachingPoints.join(" ")} ${full.modelReport.findings} ${full.modelReport.impression}`
      : "";
    items.push({
      id: `case-${c.id}`,
      title: c.title,
      body: `${c.title} ${c.clinicalScenario} ${c.keyDiagnoses.join(" ")} ${c.tags.join(" ")} ${deep}`,
      category: "case",
      route: coursePath(course, `/cases/${c.id}`),
    });
  });

  // Daily pearls (course-scoped to the active body region)
  getPearlsForRegion(course.bodyRegion).forEach((p) => {
    items.push({
      id: `pearl-${p.id}`,
      title: `Pearl #${p.id}`,
      body: p.text,
      category: "pearl",
      route: coursePath(course, "/#daily-pearl"), // pearls show on dashboard
    });
  });

  // Quiz questions
  Object.entries(moduleQuizzes).forEach(([moduleId, questions]) => {
    if (!courseModuleIds.has(moduleId)) return;
    questions.forEach((q) => {
      const optionTexts = q.options.map((o) => o.text).join(" ");
      items.push({
        id: `quiz-${q.id}`,
        title: q.stem.length > 80 ? q.stem.slice(0, 80) + "..." : q.stem,
        body: `${q.stem} ${optionTexts} ${q.explanation}`,
        category: "quiz",
        route: moduleTopicSearchRoute(course, moduleId, q.topicIndex),
      });
    });
  });

  // Measurement / reference items — course-appropriate dataset and route
  if (course.features.reference) {
    const refSections = referenceSectionsForCourse(course);
    refSections.forEach((section) => {
      section.items.forEach((item) => {
        items.push({
          id: `ref-${section.title}-${item.label}`,
          title: `${item.label} (${section.title})`,
          body: `${item.label} ${item.detail} ${section.title}`,
          category: "reference",
          route: coursePath(course, "/reference"),
        });
      });
    });
  }

  return items;
}

// ---------------------------------------------------------------------------
// Search logic (case-insensitive, partial-word matching)
// ---------------------------------------------------------------------------

function search(index: SearchItem[], query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  const scored: { item: SearchItem; score: number; excerpt: string }[] = [];

  for (const item of index) {
    const haystack = `${item.title} ${item.body}`.toLowerCase();

    // Every term must appear somewhere
    const allMatch = terms.every((t) => haystack.includes(t));
    if (!allMatch) continue;

    // Scoring: title matches weigh more
    let score = 0;
    const titleLower = item.title.toLowerCase();
    for (const t of terms) {
      if (titleLower.includes(t)) score += 10;
      // Count occurrences in body (capped)
      let idx = 0;
      let count = 0;
      const bodyLower = item.body.toLowerCase();
      while (count < 5) {
        idx = bodyLower.indexOf(t, idx);
        if (idx === -1) break;
        count++;
        idx += t.length;
      }
      score += count;
    }

    // Build excerpt around first match in body
    const bodyLower = item.body.toLowerCase();
    const firstTerm = terms[0];
    const matchIdx = bodyLower.indexOf(firstTerm);
    let excerpt = "";
    if (matchIdx !== -1) {
      const start = Math.max(0, matchIdx - 40);
      const end = Math.min(item.body.length, matchIdx + firstTerm.length + 80);
      excerpt =
        (start > 0 ? "..." : "") +
        item.body.slice(start, end).trim() +
        (end < item.body.length ? "..." : "");
    } else {
      excerpt = item.body.slice(0, 120).trim() + "...";
    }

    scored.push({ item, score, excerpt });
  }

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 30).map((s) => ({ ...s.item, excerpt: s.excerpt }));
}

// ---------------------------------------------------------------------------
// Highlight component
// ---------------------------------------------------------------------------

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const regex = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        terms.some(t => part.toLowerCase().includes(t.toLowerCase())) ? (
          <mark key={i} className="rounded bg-yellow-200 px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// GlobalSearch component
// ---------------------------------------------------------------------------

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const navigate = useNavigate();
  const { role } = useAuth();
  const activeCourse = useActiveCourse();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // Build index once (rebuild if role changes)
  const index = useMemo(() => buildIndex(role, activeCourse), [role, activeCourse]);

  // Search results
  const results = useMemo(() => search(index, query), [index, query]);

  // Group results by category
  const grouped = useMemo(() => {
    const map = new Map<SearchCategory, SearchResult[]>();
    for (const r of results) {
      const arr = map.get(r.category) || [];
      arr.push(r);
      map.set(r.category, arr);
    }
    // ordered flat list for keyboard nav
    const ordered: { category: SearchCategory; result: SearchResult }[] = [];
    for (const cat of CATEGORY_ORDER) {
      const items = map.get(cat);
      if (items) {
        for (const result of items) {
          ordered.push({ category: cat, result });
        }
      }
    }
    return { map, ordered };
  }, [results]);

  // Lock body scroll when open; save + restore the PRIOR value (don't hardcode
  // '') so closing this palette doesn't clobber another overlay's lock — e.g. a
  // CasePage lightbox still open underneath when Cmd/Ctrl+K was used over it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus input when opening; restore focus to the trigger when closing so
  // keyboard/AT users are not dropped at the top of the page.
  useEffect(() => {
    if (open) {
      previouslyFocused.current = (document.activeElement as HTMLElement) ?? null;
      setQuery("");
      setActiveIndex(0);
      // Small delay so the DOM is painted
      requestAnimationFrame(() => inputRef.current?.focus());
      return () => {
        previouslyFocused.current?.focus?.();
      };
    }
  }, [open]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const selectResult = useCallback(
    (result: SearchResult) => {
      onClose();
      navigate(result.route);
    },
    [navigate, onClose]
  );

  // Keyboard handling
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const count = grouped.ordered.length;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % Math.max(count, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + Math.max(count, 1)) % Math.max(count, 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = grouped.ordered[activeIndex];
        if (item) selectResult(item.result);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        // Trap focus inside the dialog so Tab can't wander into the page behind it.
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const activeEl = document.activeElement;
        if (e.shiftKey && activeEl === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [grouped.ordered, activeIndex, selectResult, onClose]
  );

  // Reset active when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  let flatIndex = -1; // running counter for keyboard nav

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] sm:pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search course content"
        className="relative mx-4 flex w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-200"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
          <svg
            className="h-5 w-5 shrink-0 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${activeCourse.shortTitle.toLowerCase()} modules, cases, and quizzes...`}
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
          />
          <kbd className="hidden rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 sm:inline-block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto overscroll-contain"
        >
          {query.trim() === "" ? (
            <div className="px-4 py-10 text-center text-sm text-gray-500">
              Start typing to search across all content
            </div>
          ) : grouped.ordered.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-medium text-gray-500">
                No results found
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Try different keywords or check your spelling
              </p>
            </div>
          ) : (
            CATEGORY_ORDER.map((cat) => {
              const items = grouped.map.get(cat);
              if (!items || items.length === 0) return null;
              const meta = categoryMeta[cat];
              return (
                <div key={cat}>
                  {/* Category header */}
                  <div className="sticky top-0 z-10 flex items-center gap-2 bg-gray-50 px-4 py-2">
                    <span className="text-[#005587]">{meta.icon}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {meta.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({items.length})
                    </span>
                  </div>

                  {/* Results in this category */}
                  {items.map((result) => {
                    flatIndex++;
                    const idx = flatIndex; // capture for closure
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={result.id}
                        data-index={idx}
                        onClick={() => selectResult(result)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`flex w-full flex-col gap-0.5 px-4 py-2.5 text-left transition-colors ${
                          isActive
                            ? "bg-[#2774AE]/10"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            isActive ? "text-[#005587]" : "text-gray-900"
                          }`}
                        >
                          <Highlight text={result.title} query={query} />
                        </span>
                        <span className="line-clamp-1 text-xs text-gray-500">
                          <Highlight text={result.excerpt} query={query} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        {grouped.ordered.length > 0 && query.trim() !== "" && (
          <div className="flex items-center gap-4 border-t border-gray-200 px-4 py-2 text-[10px] text-gray-500">
            <span>
              <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-mono">
                &uarr;
              </kbd>{" "}
              <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-mono">
                &darr;
              </kbd>{" "}
              navigate
            </span>
            <span>
              <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-mono">
                &crarr;
              </kbd>{" "}
              open
            </span>
            <span>
              <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-mono">
                esc
              </kbd>{" "}
              close
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
