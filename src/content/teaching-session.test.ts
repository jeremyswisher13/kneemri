import { describe, expect, it } from "vitest";
import { getCourseById } from "./courses";
import { normalKneeSeries } from "./normal-workstation-series";
import { isRestorableNormalMode } from "@/lib/normal-workstation-url";
import {
  SESSION_CASES,
  SESSION_HOUR_ONE,
  TEACHING_SESSION,
  fellowInviteText,
} from "./teaching-session";

/**
 * The run-sheet is used LIVE with three fellows in the room. A dead deep-link
 * discovered at 2:05 PM on a Friday is not recoverable, so every id it points at
 * is asserted against the real registries here.
 */
describe("teaching session run-sheet", () => {
  const course = getCourseById(TEACHING_SESSION.courseId);

  it("targets a real course", () => {
    expect(course.id).toBe(TEACHING_SESSION.courseId);
  });

  it("points at case ids that exist in the knee course", () => {
    const known = new Set(course.cases.map((c) => c.id));
    for (const plan of SESSION_CASES) {
      expect(known, `unknown case id: ${plan.caseId}`).toContain(plan.caseId);
    }
  });

  it("runs three distinct cases, one per fellow", () => {
    expect(SESSION_CASES).toHaveLength(3);
    expect(new Set(SESSION_CASES.map((c) => c.caseId)).size).toBe(3);
  });

  it("gives every case a supporting role and a closing impression prompt", () => {
    for (const plan of SESSION_CASES) {
      expect(plan.supportingRole.length).toBeGreaterThan(0);
      expect(plan.impressionPrompt.length).toBeGreaterThan(0);
      expect(plan.teachingFocus.length).toBeGreaterThan(0);
    }
  });

  /**
   * Projector-safe mode renders ONLY these fields. Anything a fellow must not see
   * before reading the study themselves has to live in a faculty-only field, so
   * this asserts the public fields are clean of the finding vocabulary. The first
   * pass of this page leaked "MPFL" and "extrusion" through the impression
   * prompts — hence the word list, not just the full diagnosis strings.
   */
  const SPOILER_WORDS = [
    "acl",
    "mpfl",
    "extrusion",
    "root tear",
    "contusion",
    "pivot-shift",
    "dislocation",
    "loose body",
    "osteochondral",
    "blumensaat",
  ];

  it("keeps every projector-safe field free of findings", () => {
    const publicText = [
      ...SESSION_CASES.map((c) => c.scenario),
      ...SESSION_HOUR_ONE.map((s) => `${s.minutes} ${s.label}`),
    ]
      .join(" ")
      .toLowerCase();

    for (const word of SPOILER_WORDS) {
      expect(publicText, `projector-safe text leaks "${word}"`).not.toContain(word);
    }
  });

  it("keeps the scenario free of the case's own key diagnoses", () => {
    for (const plan of SESSION_CASES) {
      const scenario = plan.scenario.toLowerCase();
      for (const diagnosis of course.cases.find((c) => c.id === plan.caseId)!.keyDiagnoses) {
        expect(scenario).not.toContain(diagnosis.toLowerCase());
      }
    }
  });

  it("hour 1 deep-links to real knee series and restorable modes", () => {
    const seriesIds = new Set(normalKneeSeries.map((s) => s.id));
    for (const step of SESSION_HOUR_ONE) {
      expect(seriesIds, `unknown series: ${step.seriesId}`).toContain(step.seriesId);
      expect(isRestorableNormalMode(step.mode), `mode ${step.mode} won't survive a reload`).toBe(
        true,
      );
    }
  });

  it("invite text carries the live course URL", () => {
    expect(fellowInviteText()).toContain(TEACHING_SESSION.appUrl);
  });
});
