import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/* Guards the decision recorded in index.html: this SPA ships NO rel=canonical.
   firebase.json rewrites ** to a single index.html, so a hardcoded canonical was
   served on every route and claimed /privacy, /support and all /courses/* URLs
   were duplicates of "/". Asserting nothing leaves each URL self-canonical, which
   is correct; asserting the homepage everywhere is actively wrong. These tests
   exist so the tag is not "helpfully" restored, and so nobody adds a per-route
   canonical sync to FellowLayout — which could never run for a crawler, since
   everything that layout wraps is behind ProtectedRoute. */

const repoFile = (relative: string) =>
  readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

const indexHtml = repoFile("../../../index.html");
const fellowLayout = repoFile("./FellowLayout.tsx");

// The explanatory comment necessarily spells the tag out, so strip comments before
// asserting on markup — otherwise the note explaining the absence reads as a hit.
const indexHtmlMarkup = indexHtml.replace(/<!--[\s\S]*?-->/g, "");

describe("canonical link policy", () => {
  it("ships no rel=canonical in index.html, so every route stays self-canonical", () => {
    expect(indexHtmlMarkup).not.toMatch(/<link[^>]+rel=["']canonical["']/i);
  });

  it("keeps the explanation that stops the tag being restored", () => {
    expect(indexHtml).toContain('No <link rel="canonical"> on purpose');
  });

  it("does not sync a canonical element from the FellowLayout title effect", () => {
    expect(fellowLayout).not.toMatch(/querySelector\([^)]*canonical/i);
  });
});
