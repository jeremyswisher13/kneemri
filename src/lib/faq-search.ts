import { faqKnowledgeBase, type FAQEntry } from '@/content/faq-knowledge-base';

export interface FAQSearchResult {
  entry: FAQEntry;
  score: number;
}

/** Common stop words to ignore during matching */
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'about', 'between',
  'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down',
  'out', 'off', 'over', 'under', 'and', 'but', 'or', 'nor', 'not', 'so',
  'if', 'then', 'than', 'too', 'very', 'just', 'also', 'it', 'its',
  'my', 'your', 'our', 'their', 'this', 'that', 'these', 'those',
  'i', 'me', 'we', 'you', 'he', 'she', 'they', 'them', 'what', 'which',
  'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same',
  'tell', 'show', 'explain', 'describe', 'help',
]);

/** Normalize a string for comparison: lowercase, remove punctuation, trim */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "'")
    // Treat hyphens as word separators so "bucket-handle" and "bucket handle"
    // tokenize and match identically, regardless of how the author wrote the
    // keyword or how the user typed the query.
    .replace(/[^\w\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tokenize input into meaningful words */
function tokenize(input: string): string[] {
  return normalize(input)
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

/** Simple Levenshtein distance for fuzzy matching (max distance 2) */
function levenshtein(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3; // early exit
  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[a.length][b.length];
}

/** Check if two tokens are a fuzzy match */
function fuzzyMatch(token: string, keyword: string): boolean {
  // Substring match — but only when BOTH strings are reasonably long, so short
  // tokens like "mr"/"ac"/"oa" don't substring-match unrelated keywords
  // ("mri", "access", "magic", "truncation") and surface a confidently-wrong
  // FAQ answer instead of the no-match fallback.
  if (
    token.length >= 4 &&
    keyword.length >= 4 &&
    (keyword.includes(token) || token.includes(keyword))
  ) {
    return true;
  }
  // Levenshtein distance <= 1 for short words, <= 2 for longer ones
  const maxDist = token.length <= 4 ? 1 : 2;
  return levenshtein(token, keyword) <= maxDist;
}

/** Score a single FAQ entry against the user's query tokens */
function scoreEntry(tokens: string[], entry: FAQEntry): number {
  let score = 0;
  const normalizedQuestion = normalize(entry.question);
  const normalizedAnswer = normalize(entry.answer);
  const normalizedKeywords = entry.keywords.map(normalize);

  // Check for multi-word keyword phrase matches first (higher weight)
  const queryNormalized = tokens.join(' ');
  for (const kw of normalizedKeywords) {
    if (kw.includes(' ') && queryNormalized.includes(kw)) {
      score += 5; // strong bonus for multi-word phrase match
    }
  }

  for (const token of tokens) {
    // Exact keyword match (highest weight)
    for (const kw of normalizedKeywords) {
      const kwParts = kw.split(/\s+/);
      for (const kwPart of kwParts) {
        if (kwPart === token) {
          score += 3;
          break;
        }
      }
    }

    // Fuzzy keyword match
    let fuzzyKeywordMatch = false;
    for (const kw of normalizedKeywords) {
      const kwParts = kw.split(/\s+/);
      for (const kwPart of kwParts) {
        if (kwPart !== token && fuzzyMatch(token, kwPart)) {
          fuzzyKeywordMatch = true;
          break;
        }
      }
      if (fuzzyKeywordMatch) break;
    }
    if (fuzzyKeywordMatch) {
      score += 1.5;
    }

    // Question text match
    if (normalizedQuestion.includes(token)) {
      score += 1;
    }

    // Answer text match (lower weight)
    if (normalizedAnswer.includes(token)) {
      score += 0.5;
    }
  }

  // Normalize by number of tokens so shorter queries aren't penalized
  return tokens.length > 0 ? score / Math.sqrt(tokens.length) : 0;
}

/** Minimum score threshold for returning results */
const SCORE_THRESHOLD = 1.5;

/**
 * Search the FAQ knowledge base for the best matches to a user query.
 * Returns top 3 results with scores, or an empty array if below threshold.
 */
export function searchFAQ(query: string): FAQSearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored: FAQSearchResult[] = faqKnowledgeBase.map((entry) => ({
    entry,
    score: scoreEntry(tokens, entry),
  }));

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 3).filter((r) => r.score >= SCORE_THRESHOLD);
  return top;
}

/** Get a random selection of suggested questions */
export function getSuggestedQuestions(count = 5): FAQEntry[] {
  const curated: string[] = [
    'basics-magic-angle',
    'menisci-two-slice-touch',
    'ligaments-mcl-grading',
    'extensor-insall-salvati',
    'menisci-bucket-handle',
    'ligaments-pivot-shift',
    'menisci-root-tear',
    'bones-sifk-sonk',
    'ligaments-segond',
    'bones-ocd',
    'menisci-extrusion',
    'app-search-pattern',
  ];

  // Shuffle using Fisher-Yates
  const shuffled = [...curated];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const result: FAQEntry[] = [];
  for (const id of shuffled) {
    if (result.length >= count) break;
    const entry = faqKnowledgeBase.find((e) => e.id === id);
    if (entry) result.push(entry);
  }
  return result;
}
