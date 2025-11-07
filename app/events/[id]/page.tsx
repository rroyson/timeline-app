import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Edit, Plus, Radio } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getEventWithDetails } from '@/lib/database';
import { DeleteEventButton, EmptyState } from '@/components/events';
import { Breadcrumbs } from '@/components/layout';
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
    <main className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <Breadcrumbs
        items={[{ label: 'Events', href: '/events' }, { label: event.name }]}
      />

      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h1 className="from-base-content to-base-content/70 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
              {event.name}
            </h1>
            <span
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm',
                STATUS_BADGE_CLASSES[event.status]
              )}
            >
              {STATUS_LABELS[event.status]}
            </span>
          </div>
          <div className="text-base-content/60 space-y-3 text-base">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <Calendar className="text-primary h-5 w-5" />
              </div>
              <span className="font-medium">{formattedDate}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <MapPin className="text-secondary h-5 w-5" />
                </div>
                <span className="font-medium">{event.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 self-start">
          <Link
            href={`/events/${event.id}/live`}
            className="gradient-secondary btn btn-secondary transition-all-smooth hover:shadow-glow shadow-md hover:scale-105"
          >
            <Radio className="mr-2 h-4 w-4" />
            Live View
          </Link>
          <Link
            href={`/events/${event.id}/edit`}
            className="btn btn-outline transition-all-smooth hover:border-primary hover:bg-primary/5 border-2"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
          <DeleteEventButton eventId={event.id} eventName={event.name} />
        </div>
      </div>

      {event.description && (
        <div className="card-elevated bg-base-100 mb-6 overflow-hidden rounded-xl p-6">
          <div className="gradient-primary absolute top-0 left-0 h-1 w-full" />
          <h2 className="mb-3 text-xl font-bold">Description</h2>
          <p className="text-base-content/70 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </div>
      )}

      <div className="card-elevated bg-base-100 relative overflow-hidden rounded-xl p-6">
        <div className="gradient-primary absolute top-0 left-0 h-1 w-full" />
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">Timeline</h2>
          <Link
            href={`/events/${event.id}/timeline`}
            className="gradient-primary btn btn-primary transition-all-smooth hover:shadow-glow shadow-lg hover:scale-105"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Timeline Item
          </Link>
        </div>

        {timelineItems.length === 0 ? (
          <EmptyState
            title="No timeline items yet"
            description="Start building your event timeline by adding timeline items"
          />
        ) : (
          <div className="space-y-3">
            <p className="text-base-content/60 font-medium">
              {timelineItems.length} timeline{' '}
              {timelineItems.length === 1 ? 'item' : 'items'}
            </p>
            <Link
              href={`/events/${event.id}/timeline`}
              className="text-primary group transition-all-smooth inline-flex items-center gap-2 text-sm font-medium hover:gap-3"
            >
              View and manage timeline
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
