/**
 * Fallback shown while a lazily-loaded route chunk is fetched. Matches the
 * spinner used elsewhere (e.g. ReviewPage) so navigation feels consistent.
 */
export default function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-ucla-blue" />
    </div>
  );
}
