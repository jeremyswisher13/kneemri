import { Fragment, useMemo, useState } from "react";
import type { CourseDefinition } from "@/content/courses";
import { domainLabel, UCLA_BLUE, type Fellow } from "@/components/admin/shared";
import { pointBiserial, interpretDiscrimination } from "@/lib/psychometrics";
import { csvCell } from "@/lib/csv-cell";

/** The closing action a flagged item suggests — the whole point of surfacing it. */
function suggestedAction(item: { needsRevision: boolean; tooEasy: boolean; discrimination: number | null }): string {
  if (item.needsRevision) {
    return item.discrimination !== null && item.discrimination < 0
      ? "Revise or retire — negative discrimination (stronger students miss it)"
      : "Revise — weak discrimination or very low post-test accuracy";
  }
  if (item.tooEasy) return "Consider retiring — near-ceiling, carries little information";
  return "";
}

interface ItemAnalysisTableProps {
  fellows: Fellow[];
  course: CourseDefinition;
}

interface ItemStat {
  id: string;
  stem: string;
  domain: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  preN: number;
  preC: number;
  postN: number;
  postC: number;
  prePct: number | null;
  postPct: number | null;
  delta: number | null;
  discrimination: number | null;
  needsRevision: boolean;
  tooEasy: boolean;
  postCounts: Record<string, number>;
}

type SortKey = "question" | "domain" | "pre" | "post" | "delta" | "disc" | "flags";
type SortState = { key: SortKey; dir: 1 | -1 } | null;

function cmpNullable(a: number | null, b: number | null, dir: 1 | -1): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return (a - b) * dir;
}

function flagRank(q: ItemStat): number {
  if (q.needsRevision) return 0;
  if (q.tooEasy) return 1;
  return 2;
}

function truncateStem(stem: string): string {
  return stem.length > 90 ? stem.slice(0, 90) + "…" : stem;
}

function postColor(postPct: number | null): string {
  if (postPct === null) return "#9ca3af";
  if (postPct < 60) return "#dc2626";
  if (postPct < 80) return "#d97706";
  return "#16a34a";
}

function discColor(r: number): string {
  const t = interpretDiscrimination(r);
  if (t === "good") return "#16a34a";
  if (t === "ok") return "#6b7280";
  if (t === "weak") return "#d97706";
  return "#dc2626"; // flawed / negative
}

const HEADERS: { key: SortKey; label: string; className?: string }[] = [
  { key: "question", label: "Question" },
  { key: "domain", label: "Domain" },
  { key: "pre", label: "Pre %" },
  { key: "post", label: "Post %" },
  { key: "delta", label: "Δ" },
  { key: "disc", label: "Disc." },
  { key: "flags", label: "Flags" },
];

export default function ItemAnalysisTable({ fellows, course }: ItemAnalysisTableProps) {
  const [sort, setSort] = useState<SortState>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allItems = useMemo<ItemStat[]>(() => {
    // The assessment uses matched parallel forms: each concept is a "-pre" variant
    // (answered only on the pre quiz) and a separate "-post" variant (answered only
    // on the post quiz) sharing a parallelId, with their OWN correct-answer keys.
    // Collapse each pair into one row — pre stats from the pre variant's id+key,
    // post stats (and distractor counts) from the post variant's id+key — so the
    // pre→post Δ and the revision/too-easy flags are actually computable.
    interface Group {
      key: string;
      domain: string;
      preId?: string;
      preCorrect?: string;
      postId?: string;
      postCorrect?: string;
      stem: string;
      options: { key: string; text: string }[];
      correctAnswer: string;
    }
    const groups = new Map<string, Group>();
    const order: string[] = [];
    for (const q of course.prePostQuizQuestions) {
      const key = q.parallelId ?? q.id;
      let g = groups.get(key);
      if (!g) {
        g = { key, domain: q.domain, stem: q.stem, options: q.options, correctAnswer: q.correctAnswer };
        groups.set(key, g);
        order.push(key);
      }
      const onPre =
        q.prePostMapping === "parallel-pre" || q.prePostMapping === "identical" || q.prePostMapping === "pre-only";
      const onPost =
        q.prePostMapping === "parallel-post" || q.prePostMapping === "identical" || q.prePostMapping === "post-only";
      if (onPre) {
        g.preId = q.id;
        g.preCorrect = q.correctAnswer;
      }
      if (onPost) {
        // Prefer the post variant for display (it's the form a fellow sees last,
        // and its key drives the distractor analysis).
        g.postId = q.id;
        g.postCorrect = q.correctAnswer;
        g.stem = q.stem;
        g.options = q.options;
        g.correctAnswer = q.correctAnswer;
      }
    }

    // Per-item discrimination (corrected point-biserial): does getting the post
    // variant right track with overall post-form score? Each fellow contributes
    // only the post items they actually answered.
    const postGroups = order.map((k) => groups.get(k)!).filter((g) => !!g.postId);
    const discAcc = new Map<string, { score: number; rest: number }[]>();
    for (const g of postGroups) discAcc.set(g.key, []);
    for (const f of fellows) {
      const resp = f.postQuizResponses;
      if (!resp || resp.length === 0) continue;
      const byQ = new Map(resp.map((r) => [r.questionId, r.selectedAnswer] as const));
      const scores: { gkey: string; score: number }[] = [];
      for (const g of postGroups) {
        const sel = byQ.get(g.postId!);
        if (sel === undefined) continue;
        scores.push({ gkey: g.key, score: sel === g.postCorrect ? 1 : 0 });
      }
      const total = scores.reduce((s, x) => s + x.score, 0);
      for (const { gkey, score } of scores) discAcc.get(gkey)!.push({ score, rest: total - score });
    }
    const discByKey = new Map<string, number | null>();
    for (const [gkey, arr] of discAcc) {
      discByKey.set(gkey, pointBiserial(arr.map((a) => a.score), arr.map((a) => a.rest)));
    }

    return order.map((key) => {
      const g = groups.get(key)!;
      let preN = 0;
      let preC = 0;
      let postN = 0;
      let postC = 0;
      const postCounts: Record<string, number> = {};
      for (const f of fellows) {
        if (g.preId) {
          for (const r of f.preQuizResponses ?? []) {
            if (r.questionId !== g.preId) continue;
            preN++;
            if (r.selectedAnswer === g.preCorrect) preC++;
          }
        }
        if (g.postId) {
          for (const r of f.postQuizResponses ?? []) {
            if (r.questionId !== g.postId) continue;
            postN++;
            if (r.selectedAnswer === g.postCorrect) postC++;
            postCounts[r.selectedAnswer] = (postCounts[r.selectedAnswer] ?? 0) + 1;
          }
        }
      }
      const prePct = preN > 0 ? Math.round((preC / preN) * 100) : null;
      const postPct = postN > 0 ? Math.round((postC / postN) * 100) : null;
      const delta = prePct !== null && postPct !== null ? postPct - prePct : null;
      const needsRevision =
        postN >= 3 && postPct !== null && (postPct < 40 || (prePct !== null && postPct < prePct));
      const tooEasy =
        preN >= 3 && postN >= 3 && prePct !== null && postPct !== null && prePct >= 90 && postPct >= 95;
      return {
        id: key,
        stem: g.stem,
        domain: g.domain,
        options: g.options,
        correctAnswer: g.correctAnswer,
        preN,
        preC,
        postN,
        postC,
        prePct,
        postPct,
        delta,
        discrimination: discByKey.get(key) ?? null,
        needsRevision,
        tooEasy,
        postCounts,
      };
    });
  }, [fellows, course]);

  const answered = useMemo(() => allItems.filter((q) => q.preN > 0 || q.postN > 0), [allItems]);
  const unansweredCount = allItems.length - answered.length;

  const sorted = useMemo(() => {
    const rows = [...answered];
    if (!sort) {
      rows.sort((a, b) => {
        const ra = a.needsRevision ? 0 : 1;
        const rb = b.needsRevision ? 0 : 1;
        if (ra !== rb) return ra - rb;
        return cmpNullable(a.postPct, b.postPct, 1);
      });
      return rows;
    }
    const { key, dir } = sort;
    rows.sort((a, b) => {
      switch (key) {
        case "question":
          return a.stem.localeCompare(b.stem) * dir;
        case "domain":
          return a.domain.localeCompare(b.domain) * dir;
        case "pre":
          return cmpNullable(a.prePct, b.prePct, dir);
        case "post":
          return cmpNullable(a.postPct, b.postPct, dir);
        case "delta":
          return cmpNullable(a.delta, b.delta, dir);
        case "disc":
          return cmpNullable(a.discrimination, b.discrimination, dir);
        case "flags":
          return (flagRank(a) - flagRank(b)) * dir;
      }
    });
    return rows;
  }, [answered, sort]);

  const handleSort = (key: SortKey) => {
    setSort((prev) => (prev && prev.key === key ? { key, dir: prev.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
  };

  // Item-retirement rollup: the flagged items with a suggested closing action.
  const flagged = useMemo(
    () => allItems.filter((q) => q.needsRevision || q.tooEasy),
    [allItems],
  );
  const revisionCount = flagged.filter((q) => q.needsRevision).length;
  const tooEasyCount = flagged.filter((q) => q.tooEasy && !q.needsRevision).length;

  const downloadFlaggedCsv = () => {
    const headers = ["Question", "Domain", "Pre %", "Post %", "Discrimination", "Flag", "Suggested action"];
    const rows = flagged.map((q) => [
      q.stem,
      domainLabel(q.domain),
      q.prePct ?? "",
      q.postPct ?? "",
      q.discrimination !== null ? q.discrimination.toFixed(2) : "",
      q.needsRevision ? "Needs revision" : "Too easy",
      suggestedAction(q),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c) => csvCell(c)).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${course.id}-flagged-items-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Item Analysis</h2>
          <p className="text-sm text-gray-500">
            Question quality workbench — click a row for options and distractor analysis
          </p>
        </div>
        {flagged.length > 0 && (
          <button
            type="button"
            onClick={downloadFlaggedCsv}
            className="shrink-0 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Download {flagged.length} flagged →
          </button>
        )}
      </div>

      {flagged.length > 0 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-900">
            {flagged.length} flagged {flagged.length === 1 ? "item" : "items"}
            {revisionCount > 0 && ` · ${revisionCount} need revision`}
            {tooEasyCount > 0 && ` · ${tooEasyCount} too easy`}
          </p>
          <p className="mt-0.5 text-xs text-amber-800">
            Retiring or revising the weakest items is the single biggest lever on KR-20 — export the
            list, then schedule any change at a cohort boundary so the pre/post comparison stays consistent.
          </p>
        </div>
      )}

      {allItems.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">No assessment items in this course.</p>
      ) : sorted.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">
          {unansweredCount} question{unansweredCount === 1 ? "" : "s"} not yet answered by anyone
        </p>
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b-2" style={{ borderColor: UCLA_BLUE }}>
                {HEADERS.map((h) => {
                  const active = sort?.key === h.key;
                  return (
                    <th
                      key={h.key}
                      onClick={() => handleSort(h.key)}
                      className="cursor-pointer select-none pb-3 pr-3 text-xs font-semibold uppercase tracking-wide text-gray-700 whitespace-nowrap hover:text-gray-900"
                    >
                      {h.label}
                      {active && (
                        <span className="ml-1" style={{ color: UCLA_BLUE }}>
                          {sort!.dir === 1 ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((q) => {
                const isExpanded = expandedId === q.id;
                const color = postColor(q.postPct);
                return (
                  <Fragment key={q.id}>
                    <tr
                      className="cursor-pointer transition-colors hover:bg-blue-50/40"
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    >
                      <td className="max-w-[380px] py-3 pr-3 text-gray-800">
                        <div className="flex items-start gap-2">
                          <span
                            className={`mt-0.5 text-[10px] transition-transform ${isExpanded ? "rotate-90" : ""}`}
                            style={{ color: UCLA_BLUE }}
                          >
                            &#9654;
                          </span>
                          <span>{truncateStem(q.stem)}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-3 whitespace-nowrap">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                          {domainLabel(q.domain)}
                        </span>
                      </td>
                      <td className="py-3 pr-3 whitespace-nowrap">
                        {q.prePct !== null ? (
                          <span>
                            <span className="font-semibold text-gray-700">{q.prePct}%</span>
                            <span className="ml-1 text-[10px] text-gray-500">n={q.preN}</span>
                          </span>
                        ) : (
                          <span className="text-gray-300">&mdash;</span>
                        )}
                      </td>
                      <td className="py-3 pr-3 whitespace-nowrap">
                        {q.postPct !== null ? (
                          <span>
                            <span className="font-semibold" style={{ color }}>
                              {q.postPct}%
                            </span>
                            <span className="ml-1 text-[10px] text-gray-500">n={q.postN}</span>
                          </span>
                        ) : (
                          <span className="text-gray-300">&mdash;</span>
                        )}
                      </td>
                      <td className="py-3 pr-3 whitespace-nowrap">
                        {q.delta !== null ? (
                          <span
                            className="font-semibold"
                            style={{ color: q.delta >= 0 ? "#16a34a" : "#dc2626" }}
                          >
                            {q.delta > 0 ? "+" : ""}
                            {q.delta}
                          </span>
                        ) : (
                          <span className="text-gray-300">&mdash;</span>
                        )}
                      </td>
                      <td className="py-3 pr-3 whitespace-nowrap">
                        {q.discrimination !== null ? (
                          <span className="font-semibold" style={{ color: discColor(q.discrimination) }}>
                            {q.discrimination.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-gray-300">&mdash;</span>
                        )}
                      </td>
                      <td className="py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {q.needsRevision && (
                            <span className="rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                              Needs revision
                            </span>
                          )}
                          {q.tooEasy && (
                            <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                              Too easy
                            </span>
                          )}
                          {!q.needsRevision && !q.tooEasy && <span className="text-gray-300">&mdash;</span>}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="border-l-4 bg-gray-50/80 px-6 py-5" style={{ borderColor: UCLA_BLUE }}>
                          <ExpandedItem item={q} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {sorted.length > 0 && unansweredCount > 0 && (
        <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
          {unansweredCount} question{unansweredCount === 1 ? "" : "s"} not yet answered by anyone
        </p>
      )}
    </div>
  );
}

function ExpandedItem({ item }: { item: ItemStat }) {
  const topDistractor = item.options.reduce<{ key: string; count: number }>(
    (best, o) => {
      if (o.key === item.correctAnswer) return best;
      const count = item.postCounts[o.key] ?? 0;
      return count > best.count ? { key: o.key, count } : best;
    },
    { key: "", count: 0 },
  );
  // Responses whose stored option key no longer exists on the question (e.g. a
  // renamed option) would otherwise vanish from the bars while still counting
  // toward n — surface them so the per-option counts visibly sum to n.
  const matchedCount = item.options.reduce((sum, o) => sum + (item.postCounts[o.key] ?? 0), 0);
  const legacyCount = item.postN - matchedCount;

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-800">{item.stem}</p>
      {(item.postPct !== null || item.discrimination !== null) && (
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-600">
          {item.postPct !== null && (
            <span>
              <span className="font-semibold">Difficulty (post p):</span> {(item.postPct / 100).toFixed(2)}
            </span>
          )}
          {item.discrimination !== null && (
            <span>
              <span className="font-semibold">Discrimination:</span> {item.discrimination.toFixed(2)}{" "}
              <span className="text-gray-500">({interpretDiscrimination(item.discrimination)})</span>
            </span>
          )}
        </div>
      )}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Options &amp; post-quiz distractor analysis
        </h3>
        <div className="space-y-1.5">
          {item.options.map((o) => {
            const isCorrect = o.key === item.correctAnswer;
            const count = item.postCounts[o.key] ?? 0;
            const share = item.postN > 0 ? Math.round((count / item.postN) * 100) : 0;
            const isTopDistractor = !isCorrect && topDistractor.count > 0 && o.key === topDistractor.key;
            const barColor = isCorrect ? "#16a34a" : isTopDistractor ? "#dc2626" : "#9ca3af";
            return (
              <div
                key={o.key}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-xs ${
                  isCorrect
                    ? "border-green-200 bg-green-50"
                    : isTopDistractor
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <span className="w-4 shrink-0 font-bold text-gray-500">{o.key.toUpperCase()}</span>
                <span className={`flex-1 ${isCorrect ? "text-gray-900" : "text-gray-700"}`}>
                  {o.text}
                  {isCorrect && (
                    <span className="ml-1.5 font-bold" style={{ color: "#16a34a" }}>
                      &#10003;
                    </span>
                  )}
                  {isTopDistractor && (
                    <span className="ml-1.5 rounded-full border border-red-200 bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
                      Top distractor
                    </span>
                  )}
                </span>
                {item.postN > 0 ? (
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="w-14 text-right text-gray-500">
                      {count} picked
                    </span>
                    <span className="block h-2.5 w-24 overflow-hidden rounded bg-gray-100">
                      <span
                        className="block h-full rounded"
                        style={{ width: `${share}%`, backgroundColor: barColor }}
                      />
                    </span>
                  </span>
                ) : (
                  <span className="shrink-0 text-gray-300">&mdash;</span>
                )}
              </div>
            );
          })}
        </div>
        {legacyCount > 0 && (
          <p className="mt-2 text-xs text-gray-500">
            {legacyCount} response{legacyCount === 1 ? "" : "s"} reference a no-longer-existing option key
            (question edited since) and aren't shown in the bars above.
          </p>
        )}
        {item.postN === 0 && (
          <p className="mt-2 text-xs text-gray-500">No post-quiz responses yet for this item.</p>
        )}
      </div>
    </div>
  );
}
