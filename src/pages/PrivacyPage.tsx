import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wide text-ucla-blue">Privacy</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">UCLA Sports MRI Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: July 1, 2026</p>

      <div className="mt-6 space-y-5">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900">What this app is for</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            UCLA Sports MRI is an educational app for sports medicine MRI learning. It is not a
            diagnostic device, treatment tool, or substitute for professional clinical judgment.
            Learners should verify clinical decisions with qualified supervising clinicians and
            institutional policy.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Data we collect</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-600">
            <li>Account information from sign-in, such as name, email address, profile photo, and user ID.</li>
            <li>Learning activity, such as course role, module progress, quiz attempts, case attempts, normal MRI plane completion, and spaced-review cards.</li>
            <li>Administrative review activity for course directors, such as medical QA review status and audit events.</li>
            <li>Technical data needed to operate the app, secure accounts, and troubleshoot access issues.</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900">How data is used</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Data is used for app functionality: saving progress, unlocking course steps, showing
            spaced-review items, supporting faculty/admin QA, and maintaining account security. The app
            does not sell personal data and does not use third-party advertising or cross-app tracking.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Service providers</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            The app uses Firebase/Google services for authentication, hosting, and database storage.
            Google sign-in and Sign in with Apple may be used to authenticate learners and faculty.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Account deletion</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Signed-in users can request account deletion from the Account page in the app. Deletion
            requests remove or de-identify account and learning-progress records after administrative
            review. Some audit records may be retained where needed for security, integrity, legal, or
            institutional compliance.
          </p>
          <div className="mt-4">
            <Link to="/account" className="text-sm font-semibold text-ucla-blue hover:underline">
              Open Account page
            </Link>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            For privacy, support, or deletion questions, use the Support page or contact the course
            director through the UCLA Sports Medicine education team.
          </p>
          <div className="mt-4">
            <Link to="/support" className="text-sm font-semibold text-ucla-blue hover:underline">
              Open Support
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
