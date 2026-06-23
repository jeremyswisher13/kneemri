import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Button from "./Button";

describe("Button", () => {
  it("defaults to type button to avoid accidental form submission", () => {
    const html = renderToStaticMarkup(<Button>Continue</Button>);

    expect(html).toContain('type="button"');
    expect(html).toContain("Continue");
  });

  it("allows callers to opt into submit behavior", () => {
    const html = renderToStaticMarkup(<Button type="submit">Submit</Button>);

    expect(html).toContain('type="submit"');
  });
});
