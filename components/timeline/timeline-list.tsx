'use client';

import { TimelineItemCard } from './timeline-item-card';
import type { Tables } from '@/types/database';

type TimelineItem = Tables<'timeline_items'>;

interface TimelineListProps {
  items: TimelineItem[];
  eventDate: string;
}

export function TimelineList({ items, eventDate }: TimelineListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <TimelineItemCard key={item.id} item={item} eventDate={eventDate} />
      ))}
    </div>
  );
}
