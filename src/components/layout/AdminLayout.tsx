import { Suspense } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PageLoader from "@/components/ui/PageLoader";

const adminNavItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "7/24 Session", path: "/admin/session" },
  { label: "Medical QA", path: "/admin/medical-qa" },
  { label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setRole } = useAuth();

  function isActive(path: string) {
    return location.pathname === path;
  }

  function previewAs(previewRole: "fellow" | "resident") {
    // Store that we're in preview mode so the banner shows
    sessionStorage.setItem("adminPreviewRole", previewRole);
    setRole(previewRole);
    navigate("/");
  }

  return (
    <div className="flex-1">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
          <span className="rounded-md bg-ucla-gold px-2 py-0.5 text-xs font-bold text-ucla-dark">
            ADMIN
          </span>
          <nav className="flex flex-wrap gap-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-ucla-blue text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Preview buttons */}
          <div className="order-last flex w-full items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 sm:order-none sm:w-auto">
            <span className="px-2 text-xs text-gray-500">Preview as:</span>
            <button
              onClick={() => previewAs("fellow")}
              className="rounded px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-white hover:shadow-sm transition-all"
            >
              Fellow
            </button>
            <button
              onClick={() => previewAs("resident")}
              className="rounded px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-white hover:shadow-sm transition-all"
            >
              Resident
            </button>
          </div>

          <div className="hidden flex-1 sm:block" />
          <Link
            to="/"
            className="ml-auto text-sm font-medium text-gray-500 hover:text-gray-700 sm:ml-0"
          >
            Back to Course View
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
