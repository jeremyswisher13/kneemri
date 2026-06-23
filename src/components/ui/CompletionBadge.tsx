import { Link } from "react-router-dom";

interface CompletionBadgeProps {
  fellowName: string;
  /** Short course name, e.g. "Knee MRI" / "Shoulder MRI" (course-correct). */
  courseTitle: string;
  /** Course-scoped certificate route (so shoulder users don't land on the knee certificate). */
  certificateHref: string;
}

export default function CompletionBadge({ fellowName, courseTitle, certificateHref }: CompletionBadgeProps) {
  return (
    <div className="mb-8 overflow-hidden rounded-xl border-2 border-ucla-gold bg-gradient-to-r from-ucla-dark to-ucla-blue p-6 text-white shadow-lg">
      <div className="flex items-center gap-5">
        {/* Trophy icon */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ucla-gold/20 ring-2 ring-ucla-gold">
          <svg
            className="h-8 w-8 text-ucla-gold"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 3h14c.6 0 1 .4 1 1v2c0 2.8-2 5.1-4.6 5.8-.4 1.4-1.5 2.5-2.9 2.9V17h3a1 1 0 110 2H8a1 1 0 110-2h3v-2.3c-1.4-.4-2.5-1.5-2.9-2.9C5.5 11.1 4 8.8 4 6V4c0-.6.4-1 1-1zm1 2v1c0 1.9 1.2 3.5 2.8 4.2.5-.3 1-.4 1.6-.4h1.2c.6 0 1.1.1 1.6.4C14.8 9.5 16 7.9 16 6V5H6z" />
          </svg>
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-bold">
            Congratulations, {fellowName}!
          </h2>
          <p className="mt-0.5 text-sm text-white/80">
            You have completed the {courseTitle} course.
          </p>
        </div>

        <Link
          to={certificateHref}
          className="shrink-0 rounded-lg bg-ucla-gold px-4 py-2 text-sm font-semibold text-ucla-dark shadow transition-colors hover:bg-yellow-300"
        >
          View Certificate
        </Link>
      </div>
    </div>
  );
}
