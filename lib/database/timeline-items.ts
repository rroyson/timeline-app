import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@/types/database';

type TimelineItemInsert = TablesInsert<'timeline_items'>;
type TimelineItemUpdate = TablesUpdate<'timeline_items'>;

/**
 * Get all timeline items for an event, sorted chronologically
 */
export async function getTimelineItems(
  supabase: SupabaseClient<Database>,
  eventId: string
) {
  const { data, error } = await supabase
    .from('timeline_items')
    .select('*')
    .eq('event_id', eventId)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get a single timeline item by ID
 */
export async function getTimelineItem(
  supabase: SupabaseClient<Database>,
  itemId: string
) {
  const { data, error } = await supabase
    .from('timeline_items')
    .select('*')
    .eq('id', itemId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new timeline item
 */
export async function createTimelineItem(
  supabase: SupabaseClient<Database>,
  item: TimelineItemInsert
) {
  const { data, error } = await supabase
    .from('timeline_items')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing timeline item
 */
export async function updateTimelineItem(
  supabase: SupabaseClient<Database>,
  itemId: string,
  updates: TimelineItemUpdate
) {
  const { data, error } = await supabase
    .from('timeline_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a timeline item
 */
export async function deleteTimelineItem(
  supabase: SupabaseClient<Database>,
  itemId: string
) {
  const { error } = await supabase
    .from('timeline_items')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
}

/**
 * Reorder timeline items
 */
export async function reorderTimelineItems(
  supabase: SupabaseClient<Database>,
  items: Array<{ id: string; order_index: number }>
) {
  const updates = items.map((item) =>
    supabase
      .from('timeline_items')
      .update({ order_index: item.order_index })
      .eq('id', item.id)
  );

  const results = await Promise.all(updates);
  const errors = results.filter((result) => result.error);

  if (errors.length > 0) {
    throw errors[0].error;
  }
}
