'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function TimelineError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Timeline page error:', error);
  }, [error]);

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <AlertCircle className="text-error mb-4 h-16 w-16" />
        <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
        <p className="text-base-content/70 mb-6 max-w-md">
          There was an error loading the timeline. Please try again.
        </p>
        <div className="flex gap-4">
          <button onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <Link href="/events" className="btn btn-ghost gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
        </div>
      </div>
    </main>
  );
}
