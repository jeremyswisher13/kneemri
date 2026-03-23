import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-ucla-dark px-6 py-3 text-white">
        <h1 className="text-lg font-bold">UCLA Knee MRI Fellows</h1>
      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 px-6 py-4 text-center text-sm text-gray-500">
        <div className="flex flex-wrap items-center justify-between gap-2 max-w-5xl mx-auto">
          <span>Created by Jeremy Swisher, MD — UCLA Department of Orthopaedic Surgery</span>
          <span>© 2026 UCLA Health</span>
        </div>
      </footer>
    </div>
  );
}
