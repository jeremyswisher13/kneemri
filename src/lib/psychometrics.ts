/**
 * Classical-test-theory psychometrics for the matched parallel-form pre/post
 * assessment. Pure functions (no React/Firestore) so they are unit-tested and
 * reused by the Course Director dashboard.
 *
 * What we compute and why a fellowship program cares:
 *  - Item DIFFICULTY (p) — proportion answering correctly. Very high (>0.9) or
 *    very low (<0.2) items carry little measurement information.
 *  - Item DISCRIMINATION — corrected point-biserial item-total correlation:
 *    does getting THIS item right track with doing well overall? <0.2 is weak,
 *    negative means the item is likely flawed (strong students miss it).
 *  - KR-20 reliability — internal consistency of the post form (0–1). ≥0.8 is
 *    strong for a fixed-form test; <0.7 means scores are noisy.
 *  - Cohen's d — standardized pre→post gain (effect size). 0.2/0.5/0.8 =
 *    small/medium/large. Lets the program report "the course produced a LARGE
 *    knowledge gain (d=0.9)" rather than just "+18 points."
 */

export interface PrePostItemLite {
  id: string;
  correctAnswer: string;
  domain: string;
  prePostMapping: string;
}

export interface ResponseLite {
  questionId: string;
  selectedAnswer: string;
}

export interface AssessmentFellow {
  preQuizScore: number | null;
  preQuizTotal: number | null;
  postQuizScore: number | null;
  postQuizTotal: number | null;
  preQuizResponses: ResponseLite[] | null;
  postQuizResponses: ResponseLite[] | null;
}

// ── Primitive statistics ───────────────────────────────────────────────────

export function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((s, x) => s + x, 0) / xs.length;
}

/** Variance. `sample=true` → divide by n−1 (Bessel); else population (n). */
export function variance(xs: number[], sample = false): number {
  const n = xs.length;
  const denom = sample ? n - 1 : n;
  if (denom <= 0) return 0;
  const m = mean(xs);
  return xs.reduce((s, x) => s + (x - m) * (x - m), 0) / denom;
}

export function sd(xs: number[], sample = false): number {
  return Math.sqrt(variance(xs, sample));
}

/**
 * Cohen's d for a pre→post group gain, pooled-SD form:
 *   d = (mean_post − mean_pre) / sqrt((sd_pre² + sd_post²) / 2)
 * Computed on PAIRED observations (same length, fellow-aligned). Returns null
 * when there are <2 pairs or the pooled SD is 0.
 */
export function cohensD(pre: number[], post: number[]): number | null {
  if (pre.length !== post.length || pre.length < 2) return null;
  const sdPre = sd(pre, true);
  const sdPost = sd(post, true);
  const pooled = Math.sqrt((sdPre * sdPre + sdPost * sdPost) / 2);
  if (pooled === 0) return null;
  return (mean(post) - mean(pre)) / pooled;
}

export function interpretCohensD(d: number): string {
  const a = Math.abs(d);
  if (a < 0.2) return "negligible";
  if (a < 0.5) return "small";
  if (a < 0.8) return "medium";
  return "large";
}

/**
 * Corrected point-biserial item-total correlation.
 * @param itemScores 0/1 per person (correct on this item)
 * @param restTotals total score on the OTHER items (this item excluded)
 * Returns null when one group is empty or the rest-total has no spread.
 */
export function pointBiserial(itemScores: number[], restTotals: number[]): number | null {
  const n = itemScores.length;
  if (n < 3 || restTotals.length !== n) return null;
  const ones: number[] = [];
  const zeros: number[] = [];
  for (let i = 0; i < n; i++) (itemScores[i] === 1 ? ones : zeros).push(restTotals[i]);
  if (ones.length === 0 || zeros.length === 0) return null;
  const sdTotal = sd(restTotals, false);
  if (sdTotal === 0) return null;
  const p = ones.length / n;
  const q = 1 - p;
  return ((mean(ones) - mean(zeros)) / sdTotal) * Math.sqrt(p * q);
}

export function interpretDiscrimination(r: number): "weak" | "ok" | "good" | "flawed" {
  if (r < 0) return "flawed";
  if (r < 0.2) return "weak";
  if (r < 0.3) return "ok";
  return "good";
}

/**
 * KR-20 internal-consistency reliability from a complete 0/1 matrix
 * (rows = people who answered every item, cols = items).
 *   KR-20 = (k / (k−1)) · (1 − Σ pᵢqᵢ / σ²_total)
 * Returns null when <2 items, <2 people, or total-score variance is 0.
 */
export function kr20(matrix: number[][]): number | null {
  const nPeople = matrix.length;
  if (nPeople < 2) return null;
  const k = matrix[0]?.length ?? 0;
  if (k < 2) return null;
  let sumPQ = 0;
  for (let j = 0; j < k; j++) {
    const col = matrix.map((row) => row[j]);
    const p = mean(col);
    sumPQ += p * (1 - p);
  }
  const totals = matrix.map((row) => row.reduce((s, x) => s + x, 0));
  const varTotal = variance(totals, false);
  if (varTotal === 0) return null;
  return (k / (k - 1)) * (1 - sumPQ / varTotal);
}

export function interpretKr20(r: number): string {
  if (r < 0.5) return "poor";
  if (r < 0.7) return "questionable";
  if (r < 0.8) return "acceptable";
  if (r < 0.9) return "good";
  return "excellent";
}

// ── Orchestration over a cohort + the course's assessment items ─────────────

export interface ItemPsych {
  /** difficulty p (proportion correct on the post form) */
  difficulty: number | null;
  /** corrected point-biserial item-total correlation on the post form */
  discrimination: number | null;
  n: number;
}

export interface TestPsychometrics {
  pre: { n: number; meanPct: number; sdPct: number } | null;
  post: { n: number; meanPct: number; sdPct: number; kr20: number | null } | null;
  gain: { meanPct: number; cohensD: number | null; interpretation: string; nPaired: number } | null;
  /** keyed by the POST-form question id */
  items: Record<string, ItemPsych>;
}

const onPostForm = (m: string) => m === "parallel-post" || m === "identical" || m === "post-only";

function pctOf(score: number | null, total: number | null): number | null {
  if (score === null || !total) return null;
  return (score / total) * 100;
}

export function computePsychometrics(
  fellows: AssessmentFellow[],
  items: PrePostItemLite[],
): TestPsychometrics {
  const postItems = items.filter((q) => onPostForm(q.prePostMapping));
  const postKey = new Map(postItems.map((q) => [q.id, q.correctAnswer] as const));

  // ── Test-level: pre/post means + paired Cohen's d ──
  const prePcts: number[] = [];
  const postPcts: number[] = [];
  const pairedPre: number[] = [];
  const pairedPost: number[] = [];
  for (const f of fellows) {
    const pre = pctOf(f.preQuizScore, f.preQuizTotal);
    const post = pctOf(f.postQuizScore, f.postQuizTotal);
    if (pre !== null) prePcts.push(pre);
    if (post !== null) postPcts.push(post);
    if (pre !== null && post !== null) {
      pairedPre.push(pre);
      pairedPost.push(post);
    }
  }

  // ── Per-fellow post item correctness + complete matrix for KR-20 ──
  const completeRows: number[][] = []; // fellows who answered EVERY post item
  // For discrimination: per item, the answering fellows' 0/1 + their rest-total.
  const itemAnswers = new Map<string, { score: number; total: number }[]>();
  for (const q of postItems) itemAnswers.set(q.id, []);

  for (const f of fellows) {
    const resp = f.postQuizResponses;
    if (!resp || resp.length === 0) continue;
    const byQ = new Map(resp.map((r) => [r.questionId, r.selectedAnswer] as const));
    // this fellow's score on each post item they answered
    const perItem = new Map<string, number>();
    let answeredAll = true;
    for (const q of postItems) {
      const sel = byQ.get(q.id);
      if (sel === undefined) {
        answeredAll = false;
        continue;
      }
      perItem.set(q.id, sel === postKey.get(q.id) ? 1 : 0);
    }
    const total = [...perItem.values()].reduce((s, x) => s + x, 0);
    for (const [qid, score] of perItem) {
      itemAnswers.get(qid)!.push({ score, total: total - score }); // rest-total (item excluded)
    }
    if (answeredAll && perItem.size === postItems.length) {
      completeRows.push(postItems.map((q) => perItem.get(q.id)!));
    }
  }

  const itemsOut: Record<string, ItemPsych> = {};
  for (const q of postItems) {
    const rows = itemAnswers.get(q.id)!;
    const n = rows.length;
    const difficulty = n > 0 ? mean(rows.map((r) => r.score)) : null;
    const discrimination = pointBiserial(
      rows.map((r) => r.score),
      rows.map((r) => r.total),
    );
    itemsOut[q.id] = { difficulty, discrimination, n };
  }

  const pre = prePcts.length > 0 ? { n: prePcts.length, meanPct: mean(prePcts), sdPct: sd(prePcts, true) } : null;
  const post =
    postPcts.length > 0
      ? { n: postPcts.length, meanPct: mean(postPcts), sdPct: sd(postPcts, true), kr20: kr20(completeRows) }
      : null;
  const d = cohensD(pairedPre, pairedPost);
  const gain =
    pairedPre.length >= 2
      ? {
          meanPct: mean(pairedPost) - mean(pairedPre),
          cohensD: d,
          interpretation: d === null ? "n/a" : interpretCohensD(d),
          nPaired: pairedPre.length,
        }
      : null;

  return { pre, post, gain, items: itemsOut };
}
