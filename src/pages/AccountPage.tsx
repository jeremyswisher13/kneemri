import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { requestAccountDeletion } from "@/lib/auth";

export default function AccountPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submitDeletionRequest() {
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await requestAccountDeletion();
      setMessage("Your account deletion request has been recorded. You have been signed out.");
      navigate("/login", { replace: true, state: { notice: "Your account deletion request has been recorded." } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit the deletion request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-wide text-ucla-blue">Account</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">Account and Privacy</h1>

      <div className="mt-6 space-y-5">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Signed-in account</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="font-semibold text-gray-700">Name</dt>
              <dd className="text-gray-600">{user?.displayName || "Not provided"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">Email</dt>
              <dd className="text-gray-600">{user?.email || "Not provided"}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900">Request account deletion</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            This submits an in-app deletion request for your UCLA Sports MRI account and learning
            records. You will be signed out after the request is recorded. Some audit records may be
            retained where needed for security, integrity, legal, or institutional compliance.
          </p>

          {message && (
            <p role="status" className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              {message}
            </p>
          )}
          {error && (
            <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            {!confirming ? (
              <Button variant="secondary" onClick={() => setConfirming(true)}>
                Request deletion
              </Button>
            ) : (
              <>
                <Button onClick={submitDeletionRequest} disabled={submitting}>
                  {submitting ? "Submitting..." : "Confirm deletion request"}
                </Button>
                <Button variant="secondary" onClick={() => setConfirming(false)} disabled={submitting}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Card>

        <p className="text-sm text-gray-500">
          Read the <Link to="/privacy" className="font-semibold text-ucla-blue hover:underline">privacy policy</Link>
          {" "}or visit <Link to="/support" className="font-semibold text-ucla-blue hover:underline">support</Link>.
        </p>
      </div>
    </div>
  );
}
