import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getEvent, getTimelineItems } from '@/lib/database';
import { LiveTimeline } from '@/components/timeline';
import { Breadcrumbs } from '@/components/layout';

interface LiveViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LiveViewPage({ params }: LiveViewPageProps) {
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
    <main className="gradient-surface min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Breadcrumbs
          items={[
            { label: 'Events', href: '/events' },
            { label: event.name, href: `/events/${id}` },
            { label: 'Live View' },
          ]}
        />

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="bg-secondary/10 mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5">
            <div className="relative flex h-3 w-3">
              <span className="bg-secondary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-secondary relative inline-flex h-3 w-3 rounded-full"></span>
            </div>
            <span className="text-secondary text-sm font-semibold">
              LIVE EVENT
            </span>
          </div>
          <h1 className="from-base-content to-base-content/70 mb-2 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            {event.name}
          </h1>
          <p className="text-base-content/60 text-lg">{formattedDate}</p>
          {event.location && (
            <p className="text-base-content/50 text-sm">{event.location}</p>
          )}
        </div>

        {/* Live Timeline Component */}
        <LiveTimeline
          eventId={id}
          eventStatus={event.status}
          timelineItems={timelineItems}
        />
      </div>
    </main>
  );
}
