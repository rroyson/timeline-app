export default function Loading() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <div className="skeleton h-9 w-64" />
            <div className="skeleton h-7 w-24" />
          </div>
          <div className="space-y-1">
            <div className="skeleton h-5 w-48" />
            <div className="skeleton h-5 w-56" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-12 w-24" />
          <div className="skeleton h-12 w-28" />
        </div>
      </div>

      <div className="card bg-base-100 mb-6 shadow">
        <div className="card-body">
          <div className="skeleton mb-4 h-6 w-32" />
          <div className="space-y-2">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-3/4" />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="mb-4 flex items-center justify-between">
            <div className="skeleton h-6 w-24" />
            <div className="skeleton h-10 w-40" />
          </div>
          <div className="skeleton h-32 w-full" />
        </div>
      </div>
    </main>
  );
}
