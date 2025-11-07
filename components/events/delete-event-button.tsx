'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { deleteEvent } from '@/lib/database';
import { cn } from '@/lib/utils';

interface DeleteEventButtonProps {
  eventId: string;
  eventName: string;
  onSuccess?: () => void;
  className?: string;
}

export function DeleteEventButton({
  eventId,
  eventName,
  onSuccess,
  className,
}: DeleteEventButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      await deleteEvent(supabase, eventId);

      setShowModal(false);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/events');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={cn('btn btn-outline btn-error', className)}
        onClick={() => setShowModal(true)}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>

      {showModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Delete Event?</h3>

            <p className="py-4">
              Are you sure you want to delete{' '}
              <strong>&quot;{eventName}&quot;</strong>? This will permanently
              delete the event and all associated timeline items. This action
              cannot be undone.
            </p>

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading && <span className="loading loading-spinner" />}
                Delete
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowModal(false)}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
}
