import { EventForm } from '@/components/events';
import { Breadcrumbs } from '@/components/layout';

export default function NewEventPage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <Breadcrumbs
        items={[{ label: 'Events', href: '/events' }, { label: 'New Event' }]}
      />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Create Event</h1>
        <p className="text-base-content/70">
          Fill in the details to create a new event
        </p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <EventForm />
        </div>
      </div>
    </main>
  );
}
