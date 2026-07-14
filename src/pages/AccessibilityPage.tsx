import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";

const commonTasks = [
  "Sign in or enter App Review demo mode.",
  "Choose a sports medicine MRI course.",
  "Read modules, references, pearls, and case explanations.",
  "Use normal MRI workstations, guided tours, formative practice, mastery checks, and cross-plane drills.",
  "Review progress, spaced-review cards, and account settings.",
  "Request account deletion or contact support.",
];

const currentSupport = [
  "Public pages, account pages, and learning pages use semantic headings, links, buttons, and form controls where practical.",
  "Primary controls are reachable without time limits, and the app does not require audio, video, camera, microphone, location, or motion sensors.",
  "Text-based teaching content can be zoomed by browser and system text settings; layouts are responsive for iPhone and iPad screens.",
  "Image-based MRI learning includes visible labels and written explanations, but some educational tasks still depend on interpreting image anatomy.",
];

export default function AccessibilityPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wide text-ucla-blue">Accessibility</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">UCLA Sports MRI Accessibility</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: July 1, 2026</p>
      <p className="mt-4 text-sm leading-6 text-gray-600">
        UCLA Sports MRI is an educational app for sports medicine MRI learning. We want fellows,
        faculty, and App Review users to understand what accessibility support is available and where
        image-based MRI teaching may still need visual interpretation.
      </p>

      <div className="mt-6 grid gap-5">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Common tasks</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-600">
            {commonTasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Current support</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-600">
            {currentSupport.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Accessibility Nutrition Labels</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Accessibility Nutrition Label responses in App Store Connect should be entered only after
            testing the common tasks on each supported device. The current release packet prepares this
            accessibility URL and flags VoiceOver, Voice Control, Larger Text, Differentiate Without
            Color Alone, Sufficient Contrast, Reduced Motion, and Dark Interface for device-level
            evaluation before any support labels are claimed.
          </p>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Captions and audio descriptions are not part of the current core experience because the app
            does not use required audio or video content.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            If an accessibility issue blocks a common task, use the Support page and include the page,
            device, browser or app shell, assistive technology, and a short description of what happened.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/support" className="text-sm font-semibold text-ucla-blue hover:underline">
              Open Support
            </Link>
            <Link to="/privacy" className="text-sm font-semibold text-ucla-blue hover:underline">
              Privacy policy
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
