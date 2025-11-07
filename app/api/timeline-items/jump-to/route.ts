import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the clicked item
    const { data: clickedItem, error: clickedError } = await supabase
      .from('timeline_items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (clickedError || !clickedItem) {
      return NextResponse.json(
        { error: 'Timeline item not found' },
        { status: 404 }
      );
    }

    // Get all timeline items for this event, sorted by order_index (original timeline order)
    const { data: allItems, error: allItemsError } = await supabase
      .from('timeline_items')
      .select('*')
      .eq('event_id', clickedItem.event_id)
      .order('order_index', { ascending: true });

    if (allItemsError || !allItems) {
      return NextResponse.json(
        { error: 'Failed to fetch timeline items' },
        { status: 500 }
      );
    }

    // Find the index of the clicked item
    const clickedIndex = allItems.findIndex((item) => item.id === itemId);

    if (clickedIndex === -1) {
      return NextResponse.json(
        { error: 'Timeline item not found in event' },
        { status: 404 }
      );
    }

    // Calculate the time intervals between consecutive items based on original times
    const intervals: number[] = [];
    for (let i = 0; i < allItems.length - 1; i++) {
      const currentStart = new Date(allItems[i].start_time).getTime();
      const nextStart = new Date(allItems[i + 1].start_time).getTime();
      intervals.push(nextStart - currentStart);
    }

    // Prepare updates for all items
    const now = new Date();
    const updates = [];

    for (let i = 0; i < allItems.length; i++) {
      const item = allItems[i];
      let newStartTime: Date;
      let newEndTime: Date | null = null;
      let newStatus: string;

      if (i < clickedIndex) {
        // Items before clicked item: mark as skipped, keep original times
        newStartTime = new Date(item.start_time);
        newEndTime = item.end_time ? new Date(item.end_time) : null;
        newStatus = 'skipped';

        updates.push({
          id: item.id,
          start_time: newStartTime.toISOString(),
          end_time: newEndTime ? newEndTime.toISOString() : null,
          status: newStatus,
          updated_at: new Date().toISOString(),
        });
      } else if (i === clickedIndex) {
        // Clicked item: set start time to now, mark as in_progress
        newStartTime = now;
        // Calculate duration and set end time
        if (item.end_time) {
          const originalDuration =
            new Date(item.end_time).getTime() -
            new Date(item.start_time).getTime();
          newEndTime = new Date(now.getTime() + originalDuration);
        }
        newStatus = 'in_progress';

        updates.push({
          id: item.id,
          start_time: newStartTime.toISOString(),
          end_time: newEndTime ? newEndTime.toISOString() : null,
          status: newStatus,
          updated_at: new Date().toISOString(),
        });
      } else {
        // Items after clicked item: adjust times to maintain original intervals
        // Calculate the cumulative interval from clicked item
        let cumulativeInterval = 0;
        for (let j = clickedIndex; j < i; j++) {
          cumulativeInterval += intervals[j];
        }
        newStartTime = new Date(now.getTime() + cumulativeInterval);

        // Calculate duration and set end time
        if (item.end_time) {
          const originalDuration =
            new Date(item.end_time).getTime() -
            new Date(item.start_time).getTime();
          newEndTime = new Date(newStartTime.getTime() + originalDuration);
        }
        newStatus = 'pending';

        updates.push({
          id: item.id,
          start_time: newStartTime.toISOString(),
          end_time: newEndTime ? newEndTime.toISOString() : null,
          status: newStatus,
          updated_at: new Date().toISOString(),
        });
      }
    }

    // Update all items in the database
    const updatePromises = updates.map((update) =>
      supabase
        .from('timeline_items')
        .update({
          start_time: update.start_time,
          end_time: update.end_time,
          status: update.status,
          updated_at: update.updated_at,
        })
        .eq('id', update.id)
    );

    const results = await Promise.all(updatePromises);

    // Check for errors
    const errors = results.filter((result) => result.error);
    if (errors.length > 0) {
      console.error('Errors updating timeline items:', errors);
      return NextResponse.json(
        { error: 'Failed to update some timeline items' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Timeline updated successfully',
      updates,
    });
  } catch (error) {
    console.error('Error in POST /api/timeline-items/jump-to:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
