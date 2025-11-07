'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { deleteTimelineItem } from '@/lib/database';

interface DeleteTimelineItemButtonProps {
  itemId: string;
  itemTitle: string;
}

export function DeleteTimelineItemButton({
  itemId,
  itemTitle,
}: DeleteTimelineItemButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const supabase = createClient();
      await deleteTimelineItem(supabase, itemId);
      router.refresh();
      setIsOpen(false);
    } catch (err) {
      console.error('Error deleting timeline item:', err);
      alert('Failed to delete timeline item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-ghost btn-sm text-error gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="hidden sm:inline">Delete</span>
      </button>

      {isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Delete Timeline Item?</h3>
            <p className="py-4">
              Are you sure you want to delete{' '}
              <strong>&quot;{itemTitle}&quot;</strong>? This action cannot be
              undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting && <span className="loading loading-spinner" />}
                Delete
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
}
