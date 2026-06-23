import { useState } from "react";

interface SpecialtySelectionProps {
  onSelect: (specialty: "sports-med" | "ortho") => void;
}

/**
 * Second first-run step (after the Fellow/Resident level): the training
 * specialty. Orthopedic Surgery defaults the surgical/arthroscopy correlates ON;
 * either way it's changeable later from the sidebar.
 */
export default function SpecialtySelection({ onSelect }: SpecialtySelectionProps) {
  const [selecting, setSelecting] = useState(false);

  async function handleSelect(specialty: "sports-med" | "ortho") {
    setSelecting(true);
    try {
      await onSelect(specialty);
    } finally {
      setSelecting(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#005587]">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">What&apos;s your specialty?</h1>
          <p className="mt-2 text-gray-500">
            This tailors what you see — Orthopedic Surgery turns on surgical &amp; arthroscopy correlates alongside the
            MRI. You can change it anytime from the sidebar.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <button
            onClick={() => handleSelect("sports-med")}
            disabled={selecting}
            className="group relative flex flex-col rounded-xl border-2 border-gray-200 bg-white p-6 text-left transition-all hover:border-[#005587] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#005587] focus:ring-offset-2 disabled:opacity-60"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#005587]/10">
              <svg className="h-6 w-6 text-[#005587]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[#005587]">Sports Medicine</h2>
            <p className="mt-2 flex-1 text-sm text-gray-500">
              Fellow or resident — focused on MRI interpretation and management. (No surgical correlates by default.)
            </p>
            <div className="mt-4 inline-flex items-center text-sm font-medium text-[#005587]">
              Select
              <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => handleSelect("ortho")}
            disabled={selecting}
            className="group relative flex flex-col rounded-xl border-2 border-gray-200 bg-white p-6 text-left transition-all hover:border-[#005587] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#005587] focus:ring-offset-2 disabled:opacity-60"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#005587]/10">
              <svg className="h-6 w-6 text-[#005587]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.42 15.17 5.69 5.69a2.25 2.25 0 0 0 3.182-3.182l-5.69-5.69m-2.182 3.182-8.49-8.49a2.25 2.25 0 0 1 3.182-3.182l8.49 8.49m-6.18 6.18 1.06-1.06m4-4 1.06-1.06" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[#005587]">Orthopedic Surgery</h2>
            <p className="mt-2 flex-1 text-sm text-gray-500">
              Resident or fellow — adds surgical &amp; arthroscopy correlates to the MRI teaching to anchor the anatomy.
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
          You can switch specialty or toggle surgical correlates anytime from the sidebar.
        </p>
      </div>
    </div>
  );
}
