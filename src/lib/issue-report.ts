import type { CourseId } from "@/content/courses";

declare const __APP_VERSION__: string;

export const ISSUE_REPORT_CATEGORIES = [
  {
    id: "marker-location",
    label: "Marker location",
    description: "A marker or tap target appears misplaced.",
  },
  {
    id: "medical-content",
    label: "Medical content",
    description: "An anatomy label, explanation, or answer may need review.",
  },
  {
    id: "interaction",
    label: "Interaction",
    description: "A control, image, question, or navigation action did not work.",
  },
  {
    id: "display",
    label: "Display or layout",
    description: "Something is clipped, overlapping, or difficult to use.",
  },
  {
    id: "progress-sync",
    label: "Progress or sync",
    description: "Completion, resume state, or progress appears incorrect.",
  },
] as const;

export type IssueReportCategory = (typeof ISSUE_REPORT_CATEGORIES)[number]["id"];
export type IssueReportStatus = "open" | "reviewing" | "resolved";
export type IssuePageKind = "course" | "normal-mri";

/**
 * Authored app state only. No learner-entered text, patient details, name, or
 * email belongs in this object.
 */
export interface IssuePageContext {
  pageKind?: IssuePageKind;
  mode?: string | null;
  seriesId?: string | null;
  seriesLabel?: string | null;
  sliceIndex?: number | null;
  landmark?: string | null;
  itemId?: string | null;
}

export interface IssueReportEnvironment {
  pathname: string;
  search: string;
  userAgent: string;
  platform: string;
  maxTouchPoints: number;
  viewportWidth: number;
  viewportHeight: number;
  online: boolean;
  standalone: boolean;
}

export interface IssueReportInput {
  schemaVersion: 1;
  category: IssueReportCategory;
  courseId: CourseId;
  route: string;
  pageKind: IssuePageKind;
  mode: string | null;
  seriesId: string | null;
  seriesLabel: string | null;
  sliceNumber: number | null;
  landmark: string | null;
  itemId: string | null;
  appVersion: string;
  deviceClass: "ios" | "android" | "desktop";
  displayMode: "standalone" | "browser";
  viewport: string;
  online: boolean;
}

export interface IssueReportRecord extends IssueReportInput {
  id: string;
  status: IssueReportStatus;
  createdAt: { seconds: number } | null;
  updatedAt: { seconds: number } | null;
}

function authoredText(value: string | null | undefined, maxLength: number): string | null {
  if (!value) return null;
  const normalized = value.replace(/\s+/g, " ").trim().slice(0, maxLength);
  return normalized || null;
}

function appVersion(): string {
  return typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : "web-test";
}

export function deviceClassFor(environment: IssueReportEnvironment): IssueReportInput["deviceClass"] {
  const userAgent = environment.userAgent.toLowerCase();
  const platform = environment.platform.toLowerCase();
  if (
    /iphone|ipad|ipod/.test(userAgent) ||
    /iphone|ipad|ipod/.test(platform) ||
    (platform === "macintel" && environment.maxTouchPoints > 1)
  ) {
    return "ios";
  }
  if (/android/.test(userAgent) || /android/.test(platform)) return "android";
  return "desktop";
}

export function browserIssueEnvironment(): IssueReportEnvironment {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    online: navigator.onLine,
    standalone,
  };
}

export function createIssueReportInput(
  category: IssueReportCategory,
  courseId: CourseId,
  context: IssuePageContext,
  environment: IssueReportEnvironment,
): IssueReportInput {
  const rawSlice = context.sliceIndex;
  const sliceNumber =
    typeof rawSlice === "number" && Number.isInteger(rawSlice) && rawSlice >= 0 && rawSlice < 10_000
      ? rawSlice + 1
      : null;
  const route = `${environment.pathname}${environment.search}`.slice(0, 240);

  return {
    schemaVersion: 1,
    category,
    courseId,
    route: route.startsWith("/") && !route.startsWith("//") ? route : "/",
    pageKind: context.pageKind === "normal-mri" ? "normal-mri" : "course",
    mode: authoredText(context.mode, 40),
    seriesId: authoredText(context.seriesId, 80),
    seriesLabel: authoredText(context.seriesLabel, 100),
    sliceNumber,
    landmark: authoredText(context.landmark, 160),
    itemId: authoredText(context.itemId, 120),
    appVersion: appVersion().slice(0, 80),
    deviceClass: deviceClassFor(environment),
    displayMode: environment.standalone ? "standalone" : "browser",
    viewport: `${Math.max(0, Math.round(environment.viewportWidth))}x${Math.max(
      0,
      Math.round(environment.viewportHeight),
    )}`.slice(0, 30),
    online: environment.online,
  };
}

export function issueCategoryLabel(category: IssueReportCategory): string {
  return ISSUE_REPORT_CATEGORIES.find((item) => item.id === category)?.label ?? category;
}
