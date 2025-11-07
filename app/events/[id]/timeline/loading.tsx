export default function TimelineLoading() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <div className="skeleton mb-4 h-8 w-32" />
        <div className="skeleton mb-2 h-10 w-96" />
        <div className="skeleton h-6 w-64" />
      </div>

      {/* Add section skeleton */}
      <div className="card bg-base-100 mb-6 shadow">
        <div className="card-body">
          <div className="skeleton mb-4 h-8 w-48" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>

      {/* Timeline items skeleton */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="skeleton mb-4 h-8 w-48" />
          <div className="space-y-4">
            <div className="skeleton h-32 w-full" />
            <div className="skeleton h-32 w-full" />
            <div className="skeleton h-32 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
