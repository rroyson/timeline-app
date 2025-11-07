'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  formatTime,
  CATEGORY_LABELS,
  CATEGORY_BADGE_CLASSES,
} from '@/lib/timeline-utils';
import { TimelineItemForm } from './timeline-item-form';
import { DeleteTimelineItemButton } from './delete-timeline-item-button';
import type { Tables } from '@/types/database';

type TimelineItem = Tables<'timeline_items'>;

interface TimelineItemCardProps {
  item: TimelineItem;
  eventDate: string;
}

export function TimelineItemCard({ item, eventDate }: TimelineItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="card card-bordered">
        <div className="card-body">
          {/* Header row: Time, Category badge, Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Clock className="text-base-content/70 h-5 w-5" />
                <div className="text-lg font-semibold">
                  {formatTime(item.start_time)}
                  {item.end_time && (
                    <span className="text-base-content/60">
                      {' '}
                      - {formatTime(item.end_time)}
                    </span>
                  )}
                </div>
              </div>
              <span
                className={cn('badge', CATEGORY_BADGE_CLASSES[item.category])}
              >
                {CATEGORY_LABELS[item.category]}
              </span>
            </div>

            <div className="flex gap-2 self-end sm:self-start">
              <button
                className="btn btn-ghost btn-sm gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <DeleteTimelineItemButton
                itemId={item.id}
                itemTitle={item.title}
              />
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-2 text-xl font-bold">{item.title}</h3>

          {/* Description (if present) */}
          {item.description && (
            <p className="text-base-content/80 whitespace-pre-wrap">
              {item.description}
            </p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="mb-4 text-lg font-bold">Edit Timeline Item</h3>
            <TimelineItemForm
              eventId={item.event_id}
              eventDate={eventDate}
              item={item}
              mode="modal"
              onSuccess={() => {
                setIsEditing(false);
                router.refresh();
              }}
              onCancel={() => setIsEditing(false)}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsEditing(false)}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
}
