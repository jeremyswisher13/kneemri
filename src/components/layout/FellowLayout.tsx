import { useState, useEffect, useCallback, useRef, Suspense, lazy } from "react";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import PageLoader from "@/components/ui/PageLoader";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/lib/auth";

// On-demand UI — code-split so their content imports (pearls, quizzes, shoulder
// reference, the FAQ knowledge base) stay out of the initial layout bundle.
const GlobalSearch = lazy(() => import("@/components/ui/GlobalSearch"));
const FAQChatbot = lazy(() => import("@/components/ui/FAQChatbot"));
import { useProgress } from "@/hooks/useProgress";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { saveLearnerResume } from "@/lib/learner-resume";
import {
  coursePath,
  courseRegistry,
  getVisibleCoreCases,
  hasNormalMriWorkstation,
  interactiveNormalMriTitle,
  normalMriPath,
} from "@/content/courses";
import { pageTitleForRouteSegment } from "@/components/layout/fellow-route-title";

const assessmentItems = [
  { label: "Pre-Assessment", path: "/pre-assessment" },
  { label: "Post-Assessment", path: "/post-assessment" },
];

type NavItem = { label: string; path: string; highlight?: boolean };

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: { platform?: string };
};

function isMacPlatform() {
  const nav = navigator as NavigatorWithUserAgentData;
  return (nav.userAgentData?.platform || nav.platform || nav.userAgent || "")
    .toLowerCase()
    .includes("mac");
}

export default function FellowLayout() {
  const { user, role, showSurgical, setRole, setShowSurgical } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const activeCourse = useActiveCourse();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { progress } = useProgress(activeCourse);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  // Mobile drawer = managed dialog: close on Escape, move focus into the drawer
  // when it opens, and restore focus to the menu button when it closes.
  useEffect(() => {
    if (!sidebarOpen) return;
    const menuButton = menuButtonRef.current; // stable node; restore focus on close
    sidebarRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      menuButton?.focus();
    };
  }, [sidebarOpen]);

  // Per-route document title (WCAG 2.4.2) so a screen-reader user hears where they
  // are on navigation, and tabs/history are distinguishable.
  useEffect(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "";
    const isCourseRoot = parts[0] === "courses" && parts.length === 2;
    const page = pageTitleForRouteSegment(last, activeCourse, isCourseRoot);
    document.title = `${page} · ${activeCourse.title} · UCLA`;
  }, [location.pathname, activeCourse]);

  useEffect(() => {
    if (location.pathname === "/" || /\/normal-(knee|shoulder|hip|elbow)-mri/.test(location.pathname)) {
      return;
    }
    const page = document.title.split(" · ")[0] || activeCourse.shortTitle;
    saveLearnerResume({
      path: `${location.pathname}${location.search}${location.hash}`,
      title: page === "Dashboard" ? `${activeCourse.shortTitle} Dashboard` : page,
      courseId: activeCourse.id,
      courseTitle: activeCourse.shortTitle,
    });
  }, [activeCourse.id, activeCourse.shortTitle, location.hash, location.pathname, location.search]);

  // A present-but-unknown :courseId (e.g. a mistyped/stale URL) should redirect
  // home rather than silently render the default (knee) course.
  const { courseId: routeCourseId } = useParams<{ courseId?: string }>();
  const unknownCourse = !!routeCourseId && !courseRegistry.some((c) => c.id === routeCourseId);
  useEffect(() => {
    if (unknownCourse) navigate("/", { replace: true });
  }, [unknownCourse, navigate]);

  const previewRole = typeof window !== "undefined" ? sessionStorage.getItem("adminPreviewRole") : null;
  const isPreviewMode = !!previewRole;

  const exitPreview = useCallback(() => {
    sessionStorage.removeItem("adminPreviewRole");
    setRole("admin");
    navigate("/admin");
  }, [setRole, navigate]);

  // Surgical-correlate toggle — optimistic context update + persist to Firestore.
  const toggleSurgical = useCallback(() => {
    if (!user) return;
    const next = !showSurgical;
    setShowSurgical(next);
    import("@/lib/firestore")
      .then((m) => m.setShowSurgical(user.uid, next))
      .catch(() => {});
  }, [user, showSurgical, setShowSurgical]);

  const isResident = role === "resident";
  const totalModules = activeCourse.modules.length;
  const activeModuleIds = new Set(activeCourse.modules.map((m) => m.id));
  const modulesCompleted = (progress?.moduleProgress ?? []).filter(
    (m) => m.completed && activeModuleIds.has(m.id)
  ).length;
  const requiredCases = getVisibleCoreCases(activeCourse, isResident);
  const requiredCaseIds = new Set(requiredCases.map((c) => c.id));
  const completedCaseIds = new Set(
    (progress?.caseAttempts ?? [])
      .filter((a) => requiredCaseIds.has(a.caseId))
      .map((a) => a.caseId)
  );
  const casesCompleted = completedCaseIds.size;
  const totalCases = requiredCaseIds.size;
  // The interactive workstation is the course's starting point, so it sits at the
  // top (right under Dashboard, above Modules) and renders as a highlighted card.
  const isWorkstationCourse = hasNormalMriWorkstation(activeCourse);
  const workstationItem: NavItem | null = isWorkstationCourse
    ? {
        label: interactiveNormalMriTitle(activeCourse),
        path: normalMriPath(activeCourse),
        highlight: true,
      }
    : null;

  // Workstation courses track plane completion; a course is "completed" once
  // every plane's knowledge check is passed.
  const workstationComplete =
    isWorkstationCourse && !!progress?.normalMriComplete && (progress?.totalNormalPlanes ?? 0) > 0;

  const navItems: NavItem[] = [
    { label: "Dashboard", path: coursePath(activeCourse, "/") },
    ...(workstationItem ? [workstationItem] : []),
    { label: "Modules", path: coursePath(activeCourse, "/modules") },
    { label: "Search Pattern", path: coursePath(activeCourse, "/search-pattern") },
    { label: "Cases", path: coursePath(activeCourse, "/cases") },
    ...(activeCourse.bodyRegion === "knee" || activeCourse.bodyRegion === "shoulder"
      ? [{ label: "Learning Paths", path: coursePath(activeCourse, "/learning-paths") }]
      : []),
    { label: "Progress", path: coursePath(activeCourse, "/progress") },
  ];

  const [dueCardCount, setDueCardCount] = useState(0);
  const dueCardRequestRef = useRef(0);

  // Refetch the due-card badge once per (user, course) and on tab refocus — NOT
  // on every in-app navigation, which previously re-scanned the whole reviewCards
  // collection on each page change. (Focus refresh keeps it current after a
  // review session in another tab / on returning to the app.)
  const refreshDueCount = useCallback(() => {
    const requestId = ++dueCardRequestRef.current;
    if (!user || !activeCourse.features.reviewCards) {
      setDueCardCount(0);
      return;
    }
    setDueCardCount(0);
    import("@/lib/firestore")
      .then(({ getDueCards }) => getDueCards(user.uid, activeCourse))
      .then((cards) => {
        if (dueCardRequestRef.current === requestId) setDueCardCount(cards.length);
      })
      .catch(() => {});
  }, [user, activeCourse]);

  useEffect(() => {
    refreshDueCount();
  }, [refreshDueCount]);
  useEffect(() => {
    window.addEventListener("focus", refreshDueCount);
    return () => window.removeEventListener("focus", refreshDueCount);
  }, [refreshDueCount]);

  function progressBadge(completed: number, total: number, active: boolean) {
    const isComplete = completed === total;
    return (
      <span
        className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
          isComplete
            ? active
              ? "bg-green-200 text-green-800"
              : "bg-green-100 text-green-700"
            : active
              ? "bg-white/20 text-white"
              : "bg-gray-100 text-gray-500"
        }`}
      >
        {completed}/{total}
      </span>
    );
  }

  // Cmd+K / Ctrl+K global shortcut
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  function isActive(path: string) {
    if (path === "/" || path === coursePath(activeCourse, "/")) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Skip link — first focusable element; jumps keyboard/SR users past the
          nav straight to the page content (WCAG 2.4.1). */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ucla-blue focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>
      {/* Admin Preview Banner */}
      {isPreviewMode && (
        <div className="flex items-center justify-between bg-amber-50 border-b border-amber-200 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-800">
              PREVIEW
            </span>
            <span className="text-sm text-amber-700">
              Viewing as <strong>{previewRole === "resident" ? "Resident Physician" : "Sports Medicine Fellow"}</strong>
            </span>
          </div>
          <button
            onClick={exitPreview}
            className="min-h-11 rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700 sm:min-h-0 sm:py-1 sm:text-xs"
          >
            Exit Preview → Admin
          </button>
        </div>
      )}
      {/* Top bar with search */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
        <button
          ref={menuButtonRef}
          onClick={() => setSidebarOpen(true)}
          className="-ml-2 flex h-11 w-11 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
          aria-expanded={sidebarOpen}
          aria-controls="mobile-sidebar"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-[#005587] hidden sm:block">
          {activeCourse.title}
        </span>
        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Open search"
          className="ml-auto flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-100 sm:min-h-0 sm:min-w-0 sm:justify-start sm:py-1.5"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-500 sm:inline-block">
            {isMacPlatform() ? "\u2318K" : "Ctrl+K"}
          </kbd>
        </button>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — a persistent landmark on desktop; a managed dialog when open
          as the mobile drawer (role/aria-modal applied only while open). */}
      <aside
        ref={sidebarRef}
        id="mobile-sidebar"
        tabIndex={-1}
        aria-label="Course navigation"
        role={sidebarOpen ? "dialog" : undefined}
        aria-modal={sidebarOpen ? true : undefined}
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white border-r border-gray-200 pt-[calc(3rem+env(safe-area-inset-top))] outline-none transition-transform lg:static lg:z-auto lg:pt-0 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* User info */}
        <div className="border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ucla-blue text-white text-sm font-bold">
                {user?.displayName?.[0] || "?"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{user?.displayName}</p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="mt-4 flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 lg:min-h-0 lg:py-1.5"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            All courses
          </Link>
          <div className="mt-2">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Course
            </p>
            <div className="space-y-1">
              {courseRegistry.map((course) => {
                const selected = course.id === activeCourse.id;
                return (
                  <Link
                    key={course.id}
                    to={coursePath(course, "/")}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex min-h-11 items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:min-h-0 ${
                      selected
                        ? "bg-ucla-light text-ucla-dark"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{course.shortTitle}</span>
                    {course.status === "building" && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                        Build
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) =>
              item.highlight ? (
                <li key={item.path} className="py-0.5">
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    aria-label={`${item.label}${workstationComplete ? " — completed" : " — start here"}`}
                    className={`block rounded-xl bg-gradient-to-br from-[#003B5C] to-[#2774AE] px-3 py-2.5 text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 ${
                      isActive(item.path) ? "ring-2 ring-ucla-gold" : "ring-1 ring-ucla-gold/40"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <svg className="h-3.5 w-3.5 shrink-0 text-white/90" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                      </svg>
                      <span className="inline-flex items-center rounded-full bg-ucla-gold px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#003B5C]">
                        {workstationComplete ? "Completed" : "Start here"}
                      </span>
                      {progress && progress.totalNormalPlanes > 0 && (
                        <span className="ml-auto inline-flex items-center rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {progress.normalPlanesPassed}/{progress.totalNormalPlanes}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm font-semibold leading-snug">{item.label}</p>
                  </Link>
                </li>
              ) : (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:min-h-0 ${
                      isActive(item.path)
                        ? "bg-ucla-blue text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                    {item.label === "Modules" && progressBadge(modulesCompleted, totalModules, isActive(item.path))}
                    {item.label === "Cases" && progressBadge(casesCompleted, totalCases, isActive(item.path))}
                  </Link>
                </li>
              )
            )}
          </ul>

          {activeCourse.features.reference && (
            <div className="mt-6">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Quick Reference
              </p>
              <ul className="space-y-1">
                <li>
                  <Link
                    to={coursePath(activeCourse, "/reference")}
                    onClick={() => setSidebarOpen(false)}
                    className={`block min-h-11 rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:min-h-0 ${
                      isActive(coursePath(activeCourse, "/reference"))
                        ? "bg-ucla-blue text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Anatomy & Measurements
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {activeCourse.features.reviewCards && (
          <div className="mt-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Spaced Review
            </p>
            <ul className="space-y-1">
              {activeCourse.features.reviewCards && (
              <li>
                <Link
                  to={coursePath(activeCourse, "/review")}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:min-h-0 ${
                    isActive(coursePath(activeCourse, "/review"))
                      ? "bg-ucla-blue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                  </svg>
                  Review Cards
                  {dueCardCount > 0 && (
                    <span
                      className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        isActive(coursePath(activeCourse, "/review"))
                          ? "bg-white/20 text-white"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {dueCardCount} due
                    </span>
                  )}
                </Link>
              </li>
              )}
            </ul>
          </div>
          )}

          {activeCourse.features.assessments && (
          <div className="mt-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Assessments
            </p>
            <ul className="space-y-1">
              {assessmentItems.map((item) => {
                const scopedPath = coursePath(activeCourse, item.path);
                return (
                <li key={item.path}>
                  <Link
                    to={scopedPath}
                    onClick={() => setSidebarOpen(false)}
                    className={`block min-h-11 rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:min-h-0 ${
                      isActive(scopedPath)
                        ? "bg-ucla-blue text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
                );
              })}
            </ul>
          </div>
          )}

          {activeCourse.features.certificate && (
          <div className="mt-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Completion
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  to={coursePath(activeCourse, "/certificate")}
                  onClick={() => setSidebarOpen(false)}
                  className={`block min-h-11 rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:min-h-0 ${
                    isActive(coursePath(activeCourse, "/certificate"))
                      ? "bg-ucla-blue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Certificate
                </Link>
              </li>
            </ul>
          </div>
          )}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-gray-200 px-3 py-3 space-y-1">
          <button
            type="button"
            onClick={toggleSurgical}
            role="switch"
            aria-checked={showSurgical}
            className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 lg:min-h-0"
            title="Show surgical & arthroscopic correlates alongside the MRI"
          >
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.42 15.17 5.69 5.69a2.25 2.25 0 0 0 3.182-3.182l-5.69-5.69m-2.182 3.182L4.93 6.69a2.25 2.25 0 0 1 3.182-3.182l8.49 8.49" />
              </svg>
              Surgical correlates
            </span>
            <span
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                showSurgical ? "bg-emerald-500" : "bg-gray-300"
              }`}
              aria-hidden="true"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  showSurgical ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>
          {role === "admin" && (
            <Link
              to="/admin"
              className="block min-h-11 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 lg:min-h-0"
            >
              Admin Panel
            </Link>
          )}
          <Link
            to="/account"
            onClick={() => setSidebarOpen(false)}
            className="block min-h-11 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 lg:min-h-0"
          >
            Account & Privacy
          </Link>
          <button
            onClick={() => signOutUser()}
            className="min-h-11 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 lg:min-h-0"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main id="main-content" tabIndex={-1} className="min-h-0 flex-1 overflow-auto overscroll-contain outline-none">
        <div className="mx-auto max-w-5xl px-4 pt-6 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:pb-6">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      </div>

      {/* Global search palette (code-split; mounts on first open) */}
      {searchOpen && (
        <Suspense fallback={null}>
          <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
        </Suspense>
      )}

      {/* FAQ Chatbot (code-split; loads after first paint) */}
      {activeCourse.id === "knee-mri" && (
        <Suspense fallback={null}>
          <FAQChatbot />
        </Suspense>
      )}
    </div>
  );
}
