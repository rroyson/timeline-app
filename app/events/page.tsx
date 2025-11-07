import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getUserEvents } from '@/lib/database';
import { EventsList } from '@/components/events/events-list';

export default async function EventsPage() {
  const supabase = await createClient();
  const events = await getUserEvents(supabase);

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Events</h1>
        <Link href="/events/new" className="btn btn-primary">
          <Plus className="mr-2 h-5 w-5" />
          Create Event
        </Link>
      </div>

      <EventsList events={events} />
    </main>
  );
}
