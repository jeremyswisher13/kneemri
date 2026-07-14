import { expect, type BrowserContext, type Page } from "@playwright/test";

export const LOCAL_PREVIEW_AUTH_KEY = "localPreviewAuth";
export const LOCAL_PREVIEW_ROLE_KEY = "localPreviewRole";
export const LOCAL_PREVIEW_PROGRESS_KEY = "uclaSportsMri.localPreviewProgress.v1";
export const LOCAL_ISSUE_REPORTS_KEY = "uclaSportsMri.localIssueReports.v1";

export const ELBOW_PATH = "/courses/elbow-mri";
export const ELBOW_MODULE_IDS = [
  "elbow-mri-orientation",
  "elbow-search-pattern",
  "elbow-bones-marrow",
  "elbow-ucl-valgus",
  "elbow-lcl-plri",
  "elbow-tendons",
  "elbow-nerves",
  "elbow-dont-miss",
];
export const ELBOW_NORMAL_PLANE_IDS = [
  "elbow-cor-t2fs",
  "elbow-axi-t2fs",
  "elbow-sag-ir",
];
export const ELBOW_CORE_CASE_IDS = [
  "elbow-ucl-tear-thrower",
  "elbow-capitellar-ocd",
  "elbow-distal-biceps-tear",
];

type PreviewStage = "empty" | "baseline" | "normal" | "modules" | "cases" | "complete";

export function buildElbowPreviewProgress(stage: PreviewStage) {
  const seconds = Math.floor(Date.now() / 1000);
  const at = { seconds };
  const state = {
    quizAttempts: [] as object[],
    surveyResponses: [] as object[],
    moduleProgress: {} as Record<string, object>,
    caseAttempts: [] as object[],
    normalPlanes: {} as Record<string, object>,
    reviewCards: {},
  };

  if (stage === "empty") return state;

  state.quizAttempts.push({
    id: "e2e-pre-quiz",
    courseId: "elbow-mri",
    quizType: "pre",
    score: 6,
    totalQuestions: 10,
    answers: [],
    completedAt: at,
  });
  state.surveyResponses.push({
    id: "e2e-pre-survey",
    courseId: "elbow-mri",
    surveyType: "pre",
    responses: [],
    completedAt: at,
  });
  if (stage === "baseline") return state;

  for (const id of ELBOW_NORMAL_PLANE_IDS) {
    state.normalPlanes[id] = { id, passed: true, score: 8, total: 10, completedAt: at };
  }
  if (stage === "normal") return state;

  for (const id of ELBOW_MODULE_IDS) {
    state.moduleProgress[id] = {
      id,
      courseId: "elbow-mri",
      completed: true,
      quizScore: 4,
      quizTotal: 5,
      completedAt: at,
    };
  }
  if (stage === "modules") return state;

  state.caseAttempts = ELBOW_CORE_CASE_IDS.map((caseId, index) => ({
    id: `e2e-case-${index + 1}`,
    courseId: "elbow-mri",
    caseId,
    searchPatternChecklist: {},
    report: "",
    completedAt: at,
  }));
  if (stage === "cases") return state;

  state.quizAttempts.push({
    id: "e2e-post-quiz",
    courseId: "elbow-mri",
    quizType: "post",
    score: 9,
    totalQuestions: 10,
    answers: [],
    completedAt: at,
  });
  state.surveyResponses.push({
    id: "e2e-post-survey",
    courseId: "elbow-mri",
    surveyType: "post",
    responses: [],
    retroResponses: [],
    completedAt: at,
  });
  return state;
}

export async function installPreviewSession(
  target: BrowserContext | Page,
  role: "admin" | "fellow" | "resident" = "fellow",
) {
  await target.addInitScript(
    ({ authKey, roleKey, activeRole }) => {
      window.sessionStorage.setItem(authKey, "1");
      window.sessionStorage.setItem(roleKey, activeRole);
    },
    { authKey: LOCAL_PREVIEW_AUTH_KEY, roleKey: LOCAL_PREVIEW_ROLE_KEY, activeRole: role },
  );
}

export async function loginThroughPreviewButton(page: Page, returnTo = ELBOW_PATH) {
  await page.goto(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  await page.getByRole("button", { name: "Continue in local preview" }).click();
  await expect(page).toHaveURL(new RegExp(returnTo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

export async function setPreviewProgress(page: Page, stage: PreviewStage) {
  const state = buildElbowPreviewProgress(stage);
  await page.evaluate(
    ({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new Event("uclaSportsMri:localPreviewProgress"));
    },
    { key: LOCAL_PREVIEW_PROGRESS_KEY, value: state },
  );
}

export function collectRuntimeErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  return errors;
}

export async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth, JSON.stringify(dimensions)).toBeLessThanOrEqual(
    dimensions.clientWidth + 1,
  );
}

export async function expectLoadedImages(page: Page, minimum = 1) {
  await expect
    .poll(() =>
      page.locator("img").evaluateAll((images) =>
        images.filter((image) => image.complete && image.naturalWidth > 0).length,
      ),
    )
    .toBeGreaterThanOrEqual(minimum);
}
