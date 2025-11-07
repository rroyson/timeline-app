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
  draft: 'Draft',
  scheduled: 'Scheduled',
  live: 'Live',
  paused: 'Paused',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_BADGE_CLASSES: Record<
  Database['public']['Enums']['event_status'],
  string
> = {
  draft: 'bg-base-300 text-base-content/70',
  scheduled: 'bg-primary/10 text-primary font-medium',
  live: 'bg-secondary/10 text-secondary font-medium shadow-sm',
  paused: 'bg-warning/10 text-warning font-medium shadow-sm',
  completed: 'bg-accent/10 text-accent font-medium',
  cancelled: 'bg-error/10 text-error font-medium',
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
        'group bg-base-100 relative overflow-hidden rounded-xl',
        'card-elevated',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {/* Gradient accent bar */}
      <div className="gradient-primary absolute top-0 left-0 h-1 w-full" />

      <div className="p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="text-base-content group-hover:text-primary transition-all-smooth text-xl leading-tight font-bold">
            {event.name}
          </h3>
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold',
              STATUS_BADGE_CLASSES[event.status]
            )}
          >
            {STATUS_LABELS[event.status]}
          </span>
        </div>

        <div className="text-base-content/60 space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <Calendar className="text-primary h-4 w-4" />
            </div>
            <span className="font-medium">{formattedDate}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <MapPin className="text-secondary h-4 w-4" />
              </div>
              <span className="truncate font-medium">{event.location}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="bg-accent/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <List className="text-accent h-4 w-4" />
            </div>
            <span className="font-medium">
              {timelineCount} timeline {timelineCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br via-transparent" />
      </div>
    </div>
  );
}
