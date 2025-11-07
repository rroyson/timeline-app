import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getEvent, getTimelineItems } from '@/lib/database';
import { EmptyState } from '@/components/events';
import { TimelineItemForm, TimelineList } from '@/components/timeline';

interface TimelinePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TimelinePage({ params }: TimelinePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  let event;
  let timelineItems;

  try {
    event = await getEvent(supabase, id);
    timelineItems = await getTimelineItems(supabase, id);
  } catch (error) {
    console.error('Error fetching data:', error);
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

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header with event context */}
      <div className="mb-6">
        <Link
          href={`/events/${id}`}
          className="btn btn-ghost btn-sm mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Event
        </Link>

        <div>
          <h1 className="mb-2 text-3xl font-bold">Timeline: {event.name}</h1>
          <p className="text-base-content/70">{formattedDate}</p>
          {event.location && (
            <p className="text-base-content/60 text-sm">{event.location}</p>
          )}
        </div>
      </div>

      {/* Add Timeline Item Section */}
      <div className="card bg-base-100 mb-6 shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Add Timeline Item</h2>
          <TimelineItemForm eventId={id} eventDate={event.event_date} />
        </div>
      </div>

      {/* Timeline Items List */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="card-title">
              Timeline Items ({timelineItems.length})
            </h2>
          </div>

          {timelineItems.length === 0 ? (
            <EmptyState
              title="No timeline items yet"
              description="Add your first timeline item to start building your event schedule"
            />
          ) : (
            <TimelineList items={timelineItems} eventDate={event.event_date} />
          )}
        </div>
      </div>
    </main>
  );
}
