import { Suspense, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import OfflineStatusBanner from "@/components/ui/OfflineStatusBanner";
import InstallPrompt from "@/components/ui/InstallPrompt";
import PwaUpdatePrompt from "@/components/ui/PwaUpdatePrompt";
import PageLoader from "@/components/ui/PageLoader";

export default function AppLayout() {
  const location = useLocation();
  const showHeaderInstallPrompt = location.pathname !== "/";

  // React Router does not reset scroll on navigation, so moving from a long
  // page (e.g. a case or module) to a new route opened it mid-scroll. Keyed on
  // pathname ONLY — deep links that scroll within a page use the query string
  // (?topic=N, ?mode=) and must not be yanked back to the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col">
      <header className="bg-ucla-dark px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] text-white sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <h1 className="min-w-0 truncate text-lg font-bold">UCLA Sports MRI Courses</h1>
          {showHeaderInstallPrompt && <InstallPrompt variant="header" />}
        </div>
      </header>
      <OfflineStatusBanner />
      <PwaUpdatePrompt />
      <main className="flex min-h-0 flex-1 flex-col">
        {/* Lazy pages routed straight through AppLayout (the HomePage course
            picker, Account, Privacy/Support/Accessibility) have no other Suspense
            boundary above them — without this a cold chunk fetch paints a blank
            white frame instead of a loader. */}
        <Suspense fallback={<PageLoader fullHeight label="Loading…" />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="bg-white border-t border-gray-200 px-6 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 text-center text-sm text-gray-500">
        <div className="flex flex-wrap items-center justify-between gap-2 max-w-5xl mx-auto">
          <span>Created by Jeremy Swisher, MD | UCLA Division of Sports Medicine</span>
          <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <Link to="/privacy" className="font-medium text-ucla-blue hover:underline">Privacy</Link>
            <Link to="/support" className="font-medium text-ucla-blue hover:underline">Support</Link>
            <span>© 2026 UCLA Health</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
