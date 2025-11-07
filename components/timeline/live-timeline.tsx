'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Play,
  Calendar,
  CheckCircle2,
  SkipForward,
  Edit3,
  AlertCircle,
  Pause,
  Square,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Database } from '@/types/database';

type TimelineItem = Database['public']['Tables']['timeline_items']['Row'];
type EventStatus = Database['public']['Enums']['event_status'];

interface LiveTimelineProps {
  eventId: string;
  eventStatus: EventStatus;
  timelineItems: TimelineItem[];
}

export function LiveTimeline({
  eventId,
  eventStatus,
  timelineItems,
}: LiveTimelineProps) {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isStarting, setIsStarting] = useState(false);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sort timeline items by order_index to maintain original timeline order
  const sortedItems = useMemo(() => {
    return [...timelineItems].sort((a, b) => a.order_index - b.order_index);
  }, [timelineItems]);

  // Find current and upcoming items based on time AND status
  const { currentItem, upcomingItems, completedItems } = useMemo(() => {
    const now = currentTime.getTime();

    let current: TimelineItem | null = null;
    const upcoming: TimelineItem[] = [];
    const completed: TimelineItem[] = [];

    sortedItems.forEach((item) => {
      const startTime = new Date(item.start_time).getTime();
      const endTime = item.end_time
        ? new Date(item.end_time).getTime()
        : startTime + 30 * 60 * 1000; // Default 30 min duration

      // Prioritize items marked as 'in_progress'
      if (item.status === 'in_progress') {
        current = item;
      }
      // Items marked completed or skipped go to completed
      else if (item.status === 'completed' || item.status === 'skipped') {
        completed.push(item);
      }
      // Items that are pending and within time window are current
      else if (
        item.status === 'pending' &&
        now >= startTime &&
        now <= endTime &&
        !current
      ) {
        current = item;
      }
      // Items that are pending and in the future are upcoming
      else if (item.status === 'pending' && now < startTime) {
        upcoming.push(item);
      }
      // Items that are pending but past their time go to completed
      else if (item.status === 'pending' && now > endTime) {
        completed.push(item);
      }
    });

    return {
      currentItem: current,
      upcomingItems: upcoming,
      completedItems: completed,
    };
  }, [sortedItems, currentTime]);

  // Calculate progress for current item
  const currentProgress = useMemo(() => {
    if (!currentItem) return 0;
    const start = new Date(currentItem.start_time).getTime();
    const end = currentItem.end_time
      ? new Date(currentItem.end_time).getTime()
      : start + 30 * 60 * 1000;
    const now = currentTime.getTime();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  }, [currentItem, currentTime]);

  const handleStartEvent = async () => {
    setIsStarting(true);
    try {
      const response = await fetch(`/api/events/${eventId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'live' }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to start event:', error);
    } finally {
      setIsStarting(false);
    }
  };

  // Format time helper
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (timelineItems.length === 0) {
    return (
      <div className="card-elevated bg-base-100 rounded-2xl p-12 text-center">
        <Calendar className="text-base-content/20 mx-auto mb-4 h-16 w-16" />
        <h3 className="mb-2 text-xl font-bold">No Timeline Items</h3>
        <p className="text-base-content/60 mb-6">
          Add timeline items to start your event
        </p>
        <button
          onClick={() => router.push(`/events/${eventId}/timeline`)}
          className="btn btn-primary"
        >
          Add Timeline Items
        </button>
      </div>
    );
  }

  if (eventStatus !== 'live' && eventStatus !== 'paused') {
    return (
      <div className="space-y-6">
        {/* Start Event Card */}
        <div className="card-elevated bg-base-100 rounded-2xl p-8 text-center">
          <div className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <Play className="text-primary h-10 w-10" />
          </div>
          <h2 className="mb-3 text-2xl font-bold">Ready to Start?</h2>
          <p className="text-base-content/60 mb-6 text-base">
            Your event has {timelineItems.length} timeline{' '}
            {timelineItems.length === 1 ? 'item' : 'items'} ready to go
          </p>
          <button
            onClick={handleStartEvent}
            disabled={isStarting}
            className="gradient-primary btn btn-lg btn-primary transition-all-smooth hover:shadow-glow shadow-lg hover:scale-105"
          >
            {isStarting ? 'Starting...' : 'Start Event'}
          </button>
        </div>

        {/* Preview Timeline */}
        <div className="card-elevated bg-base-100 rounded-2xl p-6">
          <h3 className="mb-4 text-lg font-bold">Timeline Preview</h3>
          <div className="space-y-3">
            {sortedItems.map((item, index) => (
              <div
                key={item.id}
                className="border-subtle bg-base-50 transition-all-smooth flex items-center gap-4 rounded-lg border p-4"
              >
                <div className="text-base-content/40 bg-base-200 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-base-content/60 text-sm">
                    {formatTime(new Date(item.start_time))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleSkipItem = async () => {
    if (!currentItem) return;

    try {
      // Mark current item as skipped
      const response = await fetch(
        `/api/timeline-items/${currentItem.id}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'skipped' }),
        }
      );

      if (!response.ok) {
        console.error('Failed to skip item');
        return;
      }

      // Mark next upcoming item as in_progress
      if (upcomingItems.length > 0) {
        const nextItem = upcomingItems[0];
        await fetch(`/api/timeline-items/${nextItem.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'in_progress' }),
        });
      }

      router.refresh();
    } catch (error) {
      console.error('Error skipping item:', error);
    }
  };

  const handleCompleteItem = async () => {
    if (!currentItem) return;

    try {
      // Mark current item as completed
      const response = await fetch(
        `/api/timeline-items/${currentItem.id}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'completed' }),
        }
      );

      if (!response.ok) {
        console.error('Failed to complete item');
        return;
      }

      // Mark next upcoming item as in_progress
      if (upcomingItems.length > 0) {
        const nextItem = upcomingItems[0];
        await fetch(`/api/timeline-items/${nextItem.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'in_progress' }),
        });
      }

      router.refresh();
    } catch (error) {
      console.error('Error completing item:', error);
    }
  };

  const handleJumpToItem = async (itemId: string) => {
    try {
      const response = await fetch('/api/timeline-items/jump-to', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) {
        console.error('Failed to jump to item');
        return;
      }

      router.refresh();
    } catch (error) {
      console.error('Error jumping to item:', error);
    }
  };

  const handlePauseEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paused' }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to pause event:', error);
    }
  };

  const handleResumeEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'live' }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to resume event:', error);
    }
  };

  const handleEndEvent = async () => {
    if (
      !confirm(
        'Are you sure you want to end this event? This will mark the event as completed.'
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to end event:', error);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col gap-6 lg:flex-row">
      {/* MAIN: Current Item - Takes up most of the screen */}
      <div className="flex-1 space-y-4 lg:space-y-6">
        {/* Current Time and Event Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative flex h-3 w-3">
                <span
                  className={cn(
                    'absolute inline-flex h-full w-full rounded-full opacity-75',
                    eventStatus === 'paused'
                      ? 'bg-warning animate-pulse'
                      : 'bg-secondary animate-ping'
                  )}
                ></span>
                <span
                  className={cn(
                    'relative inline-flex h-3 w-3 rounded-full',
                    eventStatus === 'paused' ? 'bg-warning' : 'bg-secondary'
                  )}
                ></span>
              </div>
              <span
                className={cn(
                  'text-sm font-semibold tracking-wide uppercase',
                  eventStatus === 'paused' ? 'text-warning' : 'text-secondary'
                )}
              >
                {eventStatus === 'paused' ? 'Paused' : 'Live'}
              </span>
            </div>

            {/* Event Control Buttons */}
            <div className="flex gap-2">
              {eventStatus === 'paused' ? (
                <button
                  onClick={handleResumeEvent}
                  className="btn btn-secondary btn-sm transition-all-smooth hover:shadow-glow shadow-md hover:scale-105"
                >
                  <Play className="h-4 w-4" />
                  Resume
                </button>
              ) : (
                <button
                  onClick={handlePauseEvent}
                  className="btn btn-warning btn-sm transition-all-smooth hover:shadow-glow shadow-md hover:scale-105"
                >
                  <Pause className="h-4 w-4" />
                  Pause
                </button>
              )}
              <button
                onClick={handleEndEvent}
                className="btn btn-error btn-sm transition-all-smooth hover:bg-error/90 border-2"
              >
                <Square className="h-4 w-4" />
                End Event
              </button>
            </div>
          </div>

          <div className="border-subtle bg-base-100 flex items-center gap-3 rounded-full border px-4 py-2 shadow-sm">
            <Clock className="text-primary h-4 w-4" />
            <span className="text-lg font-bold tabular-nums">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {/* Current Item - HUGE Display */}
        {currentItem ? (
          <div className="relative flex-1">
            {/* Animated border glow */}
            <div className="from-primary via-secondary to-accent absolute -inset-2 animate-pulse rounded-3xl bg-gradient-to-r opacity-20 blur-lg" />

            <div className="card-elevated bg-base-100 relative flex min-h-[500px] flex-col overflow-hidden rounded-3xl p-8 lg:p-12">
              <div className="gradient-primary absolute top-0 left-0 h-2 w-full" />

              {/* Header */}
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-6 w-6">
                    <span className="bg-secondary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                    <span className="bg-secondary relative inline-flex h-6 w-6 rounded-full"></span>
                  </div>
                  <span className="text-secondary text-lg font-bold tracking-wide uppercase">
                    Now Playing
                  </span>
                </div>
                <span className="bg-secondary/10 text-secondary rounded-full px-4 py-2 text-sm font-semibold">
                  {currentItem.category}
                </span>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <h2 className="mb-6 text-5xl leading-tight font-bold lg:text-6xl">
                  {currentItem.title}
                </h2>
                {currentItem.description && (
                  <p className="text-base-content/70 mb-8 text-xl leading-relaxed lg:text-2xl">
                    {currentItem.description}
                  </p>
                )}

                {/* Time Display */}
                <div className="mb-6 flex flex-wrap items-center gap-4">
                  <div className="text-base-content/60 flex items-center gap-3 text-lg">
                    <Clock className="h-6 w-6" />
                    <span className="font-medium">
                      {formatTime(new Date(currentItem.start_time))}
                      {currentItem.end_time &&
                        ` - ${formatTime(new Date(currentItem.end_time))}`}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-base-content/60 font-medium">
                      Progress
                    </span>
                    <span className="text-secondary font-bold">
                      {Math.round(currentProgress)}%
                    </span>
                  </div>
                  <div className="bg-base-200 h-3 w-full overflow-hidden rounded-full">
                    <div
                      className="gradient-secondary h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCompleteItem}
                  className="btn btn-accent btn-lg transition-all-smooth hover:shadow-glow flex-1 shadow-lg hover:scale-105"
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Mark Complete
                </button>
                <button
                  onClick={handleSkipItem}
                  className="btn btn-outline btn-lg transition-all-smooth hover:border-primary border-2"
                >
                  <SkipForward className="mr-2 h-5 w-5" />
                  Skip
                </button>
                <button
                  onClick={() => router.push(`/events/${eventId}/timeline`)}
                  className="btn btn-ghost btn-lg transition-all-smooth"
                >
                  <Edit3 className="mr-2 h-5 w-5" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ) : upcomingItems.length > 0 ? (
          <div className="card-elevated bg-base-100 flex min-h-[500px] flex-col items-center justify-center rounded-3xl p-12 text-center">
            <Calendar className="text-base-content/20 mb-6 h-20 w-20" />
            <h3 className="mb-3 text-3xl font-bold">Waiting for Next Item</h3>
            <p className="text-base-content/60 mb-6 text-xl">
              Next item starts at{' '}
              {formatTime(new Date(upcomingItems[0].start_time))}
            </p>
            <div className="text-base-content/40 text-lg">
              {Math.floor(
                (new Date(upcomingItems[0].start_time).getTime() -
                  currentTime.getTime()) /
                  1000 /
                  60
              )}{' '}
              minutes remaining
            </div>
          </div>
        ) : completedItems.length > 0 ? (
          <div className="card-elevated bg-base-100 flex min-h-[500px] flex-col items-center justify-center rounded-3xl p-12 text-center">
            <CheckCircle2 className="text-accent mb-6 h-20 w-20" />
            <h3 className="mb-3 text-3xl font-bold">Event Complete!</h3>
            <p className="text-base-content/60 text-xl">
              All timeline items have been completed
            </p>
          </div>
        ) : null}
      </div>

      {/* SIDEBAR: All Timeline Items in Original Order */}
      <div className="w-full space-y-4 lg:w-80 xl:w-96">
        <div className="card-elevated bg-base-100 rounded-2xl p-4">
          <h3 className="text-base-content/60 mb-3 flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
            <AlertCircle className="h-4 w-4" />
            Timeline ({sortedItems.length})
          </h3>
          <div className="space-y-2">
            {sortedItems.map((item) => {
              const timeUntil =
                new Date(item.start_time).getTime() - currentTime.getTime();
              const minutesUntil = Math.floor(timeUntil / 1000 / 60);
              const isCurrent = currentItem?.id === item.id;
              const isCompleted =
                item.status === 'completed' || item.status === 'skipped';

              return (
                <div
                  key={item.id}
                  onDoubleClick={() => handleJumpToItem(item.id)}
                  className={cn(
                    'transition-all-smooth flex cursor-pointer items-center gap-3 rounded-lg border p-3',
                    isCurrent
                      ? 'border-secondary/40 bg-secondary/10 hover:bg-secondary/20 ring-secondary/20 ring-2'
                      : isCompleted
                        ? 'border-subtle bg-base-50 opacity-60 hover:opacity-80'
                        : 'border-subtle bg-base-50 hover:bg-base-100'
                  )}
                  title="Double-click to jump to this item"
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold',
                      isCurrent
                        ? 'bg-secondary text-secondary-content'
                        : isCompleted
                          ? 'bg-base-200 text-base-content/40'
                          : 'bg-base-200 text-base-content/60'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isCurrent ? (
                      <div className="relative flex h-3 w-3">
                        <span className="bg-secondary-content absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                        <span className="bg-secondary-content relative inline-flex h-3 w-3 rounded-full"></span>
                      </div>
                    ) : minutesUntil > 0 ? (
                      `${minutesUntil}m`
                    ) : (
                      'Now'
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        'truncate text-sm font-semibold',
                        isCompleted && 'line-through'
                      )}
                    >
                      {item.title}
                    </div>
                    <div className="text-base-content/60 truncate text-xs">
                      {formatTime(new Date(item.start_time))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
