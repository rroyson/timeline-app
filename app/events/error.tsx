'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Events error:', error);
  }, [error]);

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="text-error mb-4 h-16 w-16" />
        <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
        <p className="text-base-content/70 mb-6">
          We encountered an error loading your events. Please try again.
        </p>
        <div className="flex gap-4">
          <button onClick={reset} className="btn btn-primary">
            Try Again
          </button>
          <Link href="/events" className="btn btn-ghost">
            Back to Events
          </Link>
        </div>
      </div>
    </main>
  );
}
