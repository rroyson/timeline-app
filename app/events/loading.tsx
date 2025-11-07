export default function Loading() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="skeleton h-10 w-48" />
        <div className="skeleton h-12 w-36" />
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="skeleton h-12 w-72" />
        <div className="skeleton h-12 w-64" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card card-bordered">
            <div className="card-body">
              <div className="mb-4 flex items-start justify-between">
                <div className="skeleton h-6 w-32" />
                <div className="skeleton h-6 w-20" />
              </div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
