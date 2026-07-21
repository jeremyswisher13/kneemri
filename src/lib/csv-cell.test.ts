import { describe, expect, it } from "vitest";
import { csvCell } from "./csv-cell";

describe("csvCell", () => {
  it("quotes and escapes normal values", () => {
    expect(csvCell("Riley Coon")).toBe('"Riley Coon"');
    expect(csvCell('a "quoted" name')).toBe('"a ""quoted"" name"');
    expect(csvCell(null)).toBe('""');
    expect(csvCell(42)).toBe('"42"');
  });

  it("neutralizes formula-injection leaders", () => {
    // Each would execute as a formula in Excel/Sheets without the leading quote.
    expect(csvCell("=HYPERLINK(\"http://evil\",\"x\")")).toBe(
      '"\'=HYPERLINK(""http://evil"",""x"")"',
    );
    expect(csvCell("+1-800-EVIL")).toBe('"\'+1-800-EVIL"');
    expect(csvCell("-2+3")).toBe('"\'-2+3"');
    expect(csvCell("@SUM(A1)")).toBe('"\'@SUM(A1)"');
    expect(csvCell("\tstartswithtab")).toBe('"\'\tstartswithtab"');
  });

  it("leaves a formula char that is not leading alone", () => {
    expect(csvCell("2+2")).toBe('"2+2"');
    expect(csvCell("name@example.com")).toBe('"name@example.com"');
  });
});
