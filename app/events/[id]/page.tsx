import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Edit, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getEventWithDetails } from '@/lib/database';
import { DeleteEventButton, EmptyState } from '@/components/events';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/database';

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const STATUS_LABELS: Record<
  Database['public']['Enums']['event_status'],
  string
> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  live: 'Live',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_BADGE_CLASSES: Record<
  Database['public']['Enums']['event_status'],
  string
> = {
  draft: 'badge-ghost',
  scheduled: 'badge-primary',
  live: 'badge-secondary',
  completed: 'badge-accent',
  cancelled: 'badge-error',
};

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  let event;
  try {
    event = await getEventWithDetails(supabase, id);
  } catch (error) {
    console.error('Error fetching event:', error);
    notFound();
  }

  if (!event) {
    notFound();
  }

  const formattedDate = new Date(event.event_date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timelineItems = event.timeline_items || [];

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{event.name}</h1>
            <span
              className={cn(
                'badge badge-lg',
                STATUS_BADGE_CLASSES[event.status]
              )}
            >
              {STATUS_LABELS[event.status]}
            </span>
          </div>
          <div className="text-base-content/70 space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 self-start">
          <Link href={`/events/${event.id}/edit`} className="btn btn-outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
          <DeleteEventButton eventId={event.id} eventName={event.name} />
        </div>
      </div>

      {event.description && (
        <div className="card bg-base-100 mb-6 shadow">
          <div className="card-body">
            <h2 className="card-title text-lg">Description</h2>
            <p className="text-base-content/80 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        </div>
      )}

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="card-title text-lg">Timeline</h2>
            <Link
              href={`/events/${event.id}/timeline`}
              className="btn btn-primary btn-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Timeline Item
            </Link>
          </div>

          {timelineItems.length === 0 ? (
            <EmptyState
              title="No timeline items yet"
              description="Start building your event timeline by adding timeline items"
            />
          ) : (
            <div className="space-y-2">
              <p className="text-base-content/70">
                {timelineItems.length} timeline{' '}
                {timelineItems.length === 1 ? 'item' : 'items'}
              </p>
              <Link
                href={`/events/${event.id}/timeline`}
                className="text-primary text-sm hover:underline"
              >
                View and manage timeline →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
