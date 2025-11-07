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
      <div className="bg-base-200/50 inline-flex rounded-lg p-1 backdrop-blur-sm">
        <button
          className={cn(
            'transition-all-smooth rounded-md px-4 py-2 text-sm font-medium',
            currentFilter === 'all'
              ? 'bg-base-100 text-base-content shadow-md'
              : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50'
          )}
          onClick={() => onFilterChange('all')}
        >
          All Events
        </button>
        <button
          className={cn(
            'transition-all-smooth rounded-md px-4 py-2 text-sm font-medium',
            currentFilter === 'upcoming'
              ? 'bg-base-100 text-base-content shadow-md'
              : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50'
          )}
          onClick={() => onFilterChange('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={cn(
            'transition-all-smooth rounded-md px-4 py-2 text-sm font-medium',
            currentFilter === 'past'
              ? 'bg-base-100 text-base-content shadow-md'
              : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50'
          )}
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
            className="input input-bordered border-subtle transition-all-smooth focus:border-primary w-full pr-10 shadow-sm focus:shadow-md sm:w-64"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-base-content transition-all-smooth hover:bg-base-200 absolute top-1/2 right-2 -translate-y-1/2"
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
