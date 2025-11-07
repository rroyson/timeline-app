import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getEventWithDetails } from '@/lib/database';
import { EventForm } from '@/components/events';
import { Breadcrumbs } from '@/components/layout';

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
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

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Events', href: '/events' },
          { label: event.name, href: `/events/${id}` },
          { label: 'Edit' },
        ]}
      />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Edit Event</h1>
        <p className="text-base-content/70">Update event details below</p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <EventForm event={event} />
        </div>
      </div>
    </main>
  );
}
