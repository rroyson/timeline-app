'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { EventCard } from './event-card';
import { EventFilters } from './event-filters';
import { EmptyState } from './empty-state';
import type { Database } from '@/types/database';

type Event = Database['public']['Tables']['events']['Row'];
type FilterType = 'all' | 'upcoming' | 'past';

interface EventsListProps {
  events: Event[];
}

export function EventsList({ events }: EventsListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Apply time filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') {
      result = result.filter((event) => new Date(event.event_date) >= today);
    } else if (filter === 'past') {
      result = result.filter((event) => new Date(event.event_date) < today);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((event) =>
        event.name.toLowerCase().includes(query)
      );
    }

    // Sort by date (upcoming first)
    result.sort((a, b) => {
      const dateA = new Date(a.event_date).getTime();
      const dateB = new Date(b.event_date).getTime();
      return dateA - dateB;
    });

    return result;
  }, [events, filter, searchQuery]);

  const showEmptyState = filteredEvents.length === 0;
  const emptyStateTitle = searchQuery
    ? 'No events found'
    : events.length === 0
      ? 'No events yet'
      : filter === 'upcoming'
        ? 'No upcoming events'
        : 'No past events';

  const emptyStateDescription = searchQuery
    ? 'Try adjusting your search query'
    : events.length === 0
      ? 'Create your first event to get started with Timeline'
      : filter === 'upcoming'
        ? 'You have no upcoming events scheduled'
        : 'You have no past events';

  return (
    <>
      <EventFilters
        currentFilter={filter}
        searchQuery={searchQuery}
        onFilterChange={setFilter}
        onSearchChange={setSearchQuery}
      />

      {showEmptyState ? (
        <div className="mt-12">
          <EmptyState
            title={emptyStateTitle}
            description={emptyStateDescription}
            actionLabel={
              !searchQuery && events.length === 0 ? 'Create Event' : undefined
            }
            onAction={() => router.push('/events/new')}
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => router.push(`/events/${event.id}`)}
            />
          ))}
        </div>
      )}
    </>
  );
}
