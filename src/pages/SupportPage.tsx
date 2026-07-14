import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";

export default function SupportPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wide text-ucla-blue">Support</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">UCLA Sports MRI Support</h1>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        For access, account, privacy, or content-review questions, contact the UCLA Sports Medicine
        course team or your fellowship/course director.
      </p>

      <div className="mt-6 grid gap-5">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Access issues</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            If Google sign-in fails, confirm you are using the correct account and that you have been
            added to the course roster. App Review and TestFlight reviewers should be given a demo
            account or demo-mode instructions in the review notes.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Content concerns</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            If an MRI marker, quiz explanation, case, or teaching statement seems unclear or medically
            inaccurate, use Report Issue in the course toolbar. The app securely captures the course,
            page, series/plane, slice, and active authored landmark without asking for free text or patient
            information.
          </p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Accessibility</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            If an accessibility issue blocks a common task, include the page, device, assistive
            technology, and what happened when you contact the course team.
          </p>
          <div className="mt-4">
            <Link to="/accessibility" className="text-sm font-semibold text-ucla-blue hover:underline">
              Accessibility statement
            </Link>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Privacy and account deletion</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Signed-in users can request account deletion from the Account page.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/account" className="text-sm font-semibold text-ucla-blue hover:underline">
              Account page
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
