/**
 * Build-time stub for html2canvas (aliased in vite.config.ts).
 *
 * jsPDF declares html2canvas as an optional dependency and dynamically imports
 * it inside doc.html(), which this app never calls — CertificatePage draws the
 * PDF directly with jsPDF's vector API. Without this alias, Vite still emits a
 * ~199KB lazy chunk for jsPDF's dynamic import. The stub keeps it out of dist;
 * if doc.html() is ever introduced, this throws loudly instead of failing quietly.
 */
export default function html2canvasStub(): never {
  throw new Error(
    "html2canvas is stubbed out of the bundle (see vite.config.ts). Remove the alias before using jsPDF's doc.html().",
  );
}
