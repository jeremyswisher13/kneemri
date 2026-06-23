import { useState } from "react";

interface RoleSelectionProps {
  onSelectRole: (role: "fellow" | "resident") => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const [selecting, setSelecting] = useState(false);

  async function handleSelect(role: "fellow" | "resident") {
    setSelecting(true);
    try {
      await onSelectRole(role);
    } finally {
      setSelecting(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#005587]">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to UCLA Sports MRI Courses</h1>
          <p className="mt-2 text-gray-500">
            Select your training level to personalize your curriculum.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Fellow Card */}
          <button
            onClick={() => handleSelect("fellow")}
            disabled={selecting}
            className="group relative flex flex-col rounded-xl border-2 border-gray-200 bg-white p-6 text-left transition-all hover:border-[#005587] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#005587] focus:ring-offset-2 disabled:opacity-60"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#005587]/10">
              <svg className="h-6 w-6 text-[#005587]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[#005587]">
              Sports Medicine Fellow
            </h2>
            <p className="mt-2 flex-1 text-sm text-gray-500">
              Complete MRI interpretation curriculum with advanced topics, all cases, and comprehensive assessments
            </p>
            <div className="mt-4 inline-flex items-center text-sm font-medium text-[#005587]">
              Select
              <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </button>

          {/* Resident Card */}
          <button
            onClick={() => handleSelect("resident")}
            disabled={selecting}
            className="group relative flex flex-col rounded-xl border-2 border-gray-200 bg-white p-6 text-left transition-all hover:border-[#005587] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#005587] focus:ring-offset-2 disabled:opacity-60"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#005587]/10">
              <svg className="h-6 w-6 text-[#005587]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[#005587]">
              Resident Physician
            </h2>
            <p className="mt-2 flex-1 text-sm text-gray-500">
              Focused MRI fundamentals covering essential topics, core cases, and key pathology recognition
            </p>
            <div className="mt-4 inline-flex items-center text-sm font-medium text-[#005587]">
              Select
              <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Contact the course director if you need to change your role.
        </p>
      </div>
    </div>
  );
}
