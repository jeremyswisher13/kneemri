import { Link, Outlet, useLocation } from "react-router-dom";

const adminNavItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Settings", path: "/admin/settings" },
];

export default function AdminLayout() {
  const location = useLocation();

  function isActive(path: string) {
    return location.pathname === path;
  }

  return (
    <div className="flex-1">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <span className="rounded-md bg-ucla-gold px-2 py-0.5 text-xs font-bold text-ucla-dark">
            ADMIN
          </span>
          <nav className="flex gap-1">
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
          <div className="flex-1" />
          <Link
            to="/"
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Back to Fellow View
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}
