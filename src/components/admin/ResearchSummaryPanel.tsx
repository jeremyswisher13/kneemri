import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CourseDefinition } from "@/content/courses";
import { UCLA_BLUE, type Fellow } from "@/components/admin/shared";
import {
  buildCohortReport,
  buildResearchDataset,
  datasetToCsv,
  type CohortReport,
} from "@/lib/research-export";

interface Props {
  fellows: Fellow[];
  course: CourseDefinition;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function triggerDownload(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const fmt0 = (x: number | null) => (x === null ? "—" : `${Math.round(x)}`);
const signed1 = (x: number | null) =>
  x === null ? "—" : `${x >= 0 ? "+" : ""}${(Math.round(x * 10) / 10).toFixed(1)}`;
const signedPp = (x: number | null) =>
  x === null ? "—" : `${x >= 0 ? "+" : ""}${Math.round(x)} pp`;

async function buildPdf(report: CohortReport, course: CourseDefinition) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const left = 56;
  let y = 60;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(course.title, left, y);
  y += 20;
  doc.setFontSize(12);
  doc.text("Cohort Effectiveness Summary", left, y);
  y += 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    `Generated ${new Date().toLocaleDateString()}  ·  de-identified aggregate  ·  n = ${report.nPaired} paired of ${report.enrolled} enrolled`,
    left,
    y,
  );
  y += 26;

  doc.setTextColor(20);
  doc.setFontSize(11);
  const stat = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, left, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, left + 190, y);
    y += 17;
  };
  stat("Pre-test mean", report.preMean === null ? "—" : `${fmt0(report.preMean)}%  (SD ${fmt0(report.preSd)})`);
  stat("Post-test mean", report.postMean === null ? "—" : `${fmt0(report.postMean)}%  (SD ${fmt0(report.postSd)})`);
  stat("Knowledge gain", signedPp(report.gainPts));
  stat(
    "Effect size (Cohen's d)",
    report.cohensD === null ? "—" : `${report.cohensD.toFixed(2)}  (${report.cohensDInterp})`,
  );
  stat(
    "Reliability (KR-20)",
    report.kr20 === null ? "—" : `${report.kr20.toFixed(2)}  (${report.kr20Interp})`,
  );
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Knowledge gain by domain", left, y);
  y += 16;
  doc.setFontSize(10);
  report.domains.forEach((d) => {
    doc.setFont("helvetica", "normal");
    doc.text(d.label, left, y);
    doc.text(signedPp(d.quizGain), left + 250, y);
    doc.text(d.honestConfGain === null ? "" : `conf ${signed1(d.honestConfGain)}`, left + 340, y);
    y += 15;
  });
  y += 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Results (draft)", left, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const wrapped = doc.splitTextToSize(report.resultsText, 500) as string[];
  doc.text(wrapped, left, y);

  doc.save(`${course.id}-cohort-summary-${today()}.pdf`);
}

/**
 * Research & Publication panel — de-identified dataset export + a paper-ready
 * cohort summary. Complements TestQualityPanel (which shows the headline d/KR-20
 * on screen) by turning that evidence into shareable, manuscript-ready outputs.
 */
export default function ResearchSummaryPanel({ fellows, course }: Props) {
  const report = useMemo(() => buildCohortReport(fellows, course), [fellows, course]);
  const [copied, setCopied] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  const hasData = report.nPre > 0 || report.nPost > 0;

  const handleCsv = useCallback(() => {
    const { headers, rows } = buildResearchDataset(fellows, course);
    triggerDownload(
      `${course.id}-research-deidentified-${today()}.csv`,
      datasetToCsv(headers, rows),
      "text/csv;charset=utf-8;",
    );
  }, [fellows, course]);

  const handlePdf = useCallback(async () => {
    setPdfBusy(true);
    try {
      await buildPdf(report, course);
    } finally {
      setPdfBusy(false);
    }
  }, [report, course]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(report.resultsText);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard may be blocked; the text is also selectable in the box below */
    }
  }, [report]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-lg font-bold text-gray-900">Research &amp; Publication</h2>
        <p className="text-sm text-gray-500">
          De-identified dataset export and a manuscript-ready effectiveness summary for this cohort —
          for a paper, an IRB submission, or a program / ACGME report.
        </p>
      </div>

      {!hasData ? (
        <p className="py-8 text-center text-sm text-gray-500">
          No completed assessments yet — the research summary populates once learners finish the
          pre/post.
        </p>
      ) : (
        <>
          {/* Headline line — n + completion not surfaced elsewhere */}
          <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-700">
            <span>
              <span className="font-semibold">{report.nPaired}</span> analyzed (both pre &amp; post)
              of <span className="font-semibold">{report.enrolled}</span> enrolled
            </span>
            <span>
              Gain <span className="font-semibold">{signedPp(report.gainPts)}</span>
            </span>
            <span>
              Cohen&apos;s d{" "}
              <span className="font-semibold">
                {report.cohensD === null ? "—" : report.cohensD.toFixed(2)}
              </span>
              {report.cohensDInterp ? ` (${report.cohensDInterp})` : ""}
            </span>
            <span>
              KR-20{" "}
              <span className="font-semibold">
                {report.kr20 === null ? "—" : report.kr20.toFixed(2)}
              </span>
            </span>
          </div>

          {/* Per-domain gain table */}
          <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-[11px] uppercase tracking-wide text-gray-500">
                  <th className="px-3 py-2 font-semibold">Domain</th>
                  <th className="px-3 py-2 text-right font-semibold">Knowledge gain</th>
                  <th className="px-3 py-2 text-right font-semibold">Honest conf. gain</th>
                  <th className="px-3 py-2 text-right font-semibold">n</th>
                </tr>
              </thead>
              <tbody>
                {report.domains.map((d) => (
                  <tr key={d.domain} className="border-t border-gray-100">
                    <td className="px-3 py-2 text-gray-800">{d.label}</td>
                    <td
                      className="px-3 py-2 text-right font-medium"
                      style={{ color: d.quizGain !== null && d.quizGain >= 0 ? "#16a34a" : "#6b7280" }}
                    >
                      {signedPp(d.quizGain)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-600">{signed1(d.honestConfGain)}</td>
                    <td className="px-3 py-2 text-right text-gray-400">{d.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Manuscript-ready paragraph */}
          <div className="mb-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Results paragraph (draft)
            </p>
            <p className="select-all rounded-lg border border-gray-200 bg-gray-50/70 p-3 text-sm leading-relaxed text-gray-700">
              {report.resultsText}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCsv}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
              style={{ backgroundColor: UCLA_BLUE }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#005587")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = UCLA_BLUE)}
            >
              De-identified data (CSV)
            </button>
            <button
              onClick={handlePdf}
              disabled={pdfBusy}
              className="inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-semibold shadow-sm transition-colors disabled:opacity-60"
              style={{ borderColor: UCLA_BLUE, color: UCLA_BLUE, backgroundColor: "white" }}
            >
              {pdfBusy ? "Building…" : "Summary report (PDF)"}
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              {copied ? "Copied ✓" : "Copy results text"}
            </button>
          </div>

          <p className="mt-3 border-t border-gray-100 pt-3 text-[11px] leading-snug text-gray-500">
            Exports carry <span className="font-medium text-gray-600">no direct identifiers</span> (no
            names, emails, ids, or timestamps) — only stable “P001”-style participant codes. Note that{" "}
            <span className="font-medium text-gray-600">role and a small cohort size are quasi-identifiers</span>{" "}
            that can narrow identity, so treat exports as sensitive and share per your IRB/data-use terms.
            The results paragraph is a starting draft; verify against your study design before publication.
          </p>
        </>
      )}
    </div>
  );
}
