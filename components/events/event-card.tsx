'use client';

import { Calendar, MapPin, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/database';

type Event = Database['public']['Tables']['events']['Row'];

interface EventCardProps {
  event: Event & {
    timeline_items_count?: number;
  };
  onClick?: () => void;
}

const STATUS_LABELS: Record<
  Database['public']['Enums']['event_status'],
  string
> = {
  planning: 'Planning',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_BADGE_CLASSES: Record<
  Database['public']['Enums']['event_status'],
  string
> = {
  planning: 'badge-primary',
  in_progress: 'badge-secondary',
  completed: 'badge-accent',
  cancelled: 'badge-ghost',
};

export function EventCard({ event, onClick }: EventCardProps) {
  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timelineCount = event.timeline_items_count || 0;

  return (
    <div
      className={cn(
        'card card-bordered card-compact transition-shadow',
        onClick && 'cursor-pointer hover:shadow-lg'
      )}
      onClick={onClick}
    >
      <div className="card-body">
        <div className="flex items-start justify-between">
          <h3 className="card-title text-lg">{event.name}</h3>
          <span className={cn('badge', STATUS_BADGE_CLASSES[event.status])}>
            {STATUS_LABELS[event.status]}
          </span>
        </div>

        <div className="text-base-content/70 space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>
              {timelineCount} timeline {timelineCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
