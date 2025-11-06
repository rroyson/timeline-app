import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert, TablesUpdate } from '@/types/database';

type Event = Tables<'events'>;
type EventInsert = TablesInsert<'events'>;
type EventUpdate = TablesUpdate<'events'>;

/**
 * Get all events for the current user
 */
export async function getUserEvents(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get a single event by ID
 */
export async function getEvent(
  supabase: SupabaseClient<Database>,
  eventId: string
) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new event
 */
export async function createEvent(
  supabase: SupabaseClient<Database>,
  event: EventInsert
) {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing event
 */
export async function updateEvent(
  supabase: SupabaseClient<Database>,
  eventId: string,
  updates: EventUpdate
) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', eventId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete an event
 */
export async function deleteEvent(
  supabase: SupabaseClient<Database>,
  eventId: string
) {
  const { error } = await supabase.from('events').delete().eq('id', eventId);

  if (error) throw error;
}

/**
 * Get event with participants and timeline items
 */
export async function getEventWithDetails(
  supabase: SupabaseClient<Database>,
  eventId: string
) {
  const { data, error } = await supabase
    .from('events')
    .select(
      `
      *,
      event_participants (
        id,
        role,
        user_id,
        profiles (
          id,
          email,
          full_name,
          avatar_url
        )
      ),
      timeline_items (
        id,
        title,
        description,
        start_time,
        end_time,
        category,
        order_index,
        assigned_to
      )
    `
    )
    .eq('id', eventId)
    .single();

  if (error) throw error;
  return data;
}
