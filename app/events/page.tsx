import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getUserEvents } from '@/lib/database';
import { EventsList } from '@/components/events/events-list';

export default async function EventsPage() {
  const supabase = await createClient();
  const events = await getUserEvents(supabase);

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="from-base-content to-base-content/70 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            My Events
          </h1>
          <p className="text-base-content/60 mt-2 text-base sm:text-lg">
            Manage and coordinate your event timelines
          </p>
        </div>
        <Link
          href="/events/new"
          className="gradient-primary btn btn-primary transition-all-smooth hover:shadow-glow shadow-lg hover:scale-105"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Event
        </Link>
      </div>

      <EventsList events={events} />
    </main>
  );
}
