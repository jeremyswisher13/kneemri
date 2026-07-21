/**
 * Quote a value for a CSV cell AND neutralize spreadsheet formula injection.
 *
 * Learner-controlled text (Google display names, emails, free-text) is written
 * verbatim into cohort/QA exports. A value beginning with `= + - @` (or a
 * leading tab/CR) is interpreted as a FORMULA when the file is opened in
 * Excel/Google Sheets — e.g. a display name of `=HYPERLINK("http://evil","hi")`
 * becomes a live link in the faculty member's spreadsheet. Prefixing such a
 * value with a single quote forces it to render as text.
 */
export function csvCell(value: unknown): string {
  let s = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}
