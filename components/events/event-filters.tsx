'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'upcoming' | 'past';

interface EventFiltersProps {
  onFilterChange: (filter: FilterType) => void;
  onSearchChange: (query: string) => void;
  currentFilter: FilterType;
  searchQuery: string;
}

export function EventFilters({
  onFilterChange,
  onSearchChange,
  currentFilter,
  searchQuery,
}: EventFiltersProps) {
  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="tabs tabs-boxed">
        <button
          className={cn('tab', currentFilter === 'all' && 'tab-active')}
          onClick={() => onFilterChange('all')}
        >
          All Events
        </button>
        <button
          className={cn('tab', currentFilter === 'upcoming' && 'tab-active')}
          onClick={() => onFilterChange('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={cn('tab', currentFilter === 'past' && 'tab-active')}
          onClick={() => onFilterChange('past')}
        >
          Past
        </button>
      </div>

      <div className="form-control w-full sm:w-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            className="input input-bordered w-full pr-10 sm:w-64"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="btn btn-ghost btn-sm btn-circle absolute top-1/2 right-2 -translate-y-1/2"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
