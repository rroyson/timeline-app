import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from '@/types/database';

type EventParticipant = Tables<'event_participants'>;
type EventParticipantInsert = TablesInsert<'event_participants'>;
type EventParticipantUpdate = TablesUpdate<'event_participants'>;

/**
 * Get all participants for an event
 */
export async function getEventParticipants(
  supabase: SupabaseClient<Database>,
  eventId: string
) {
  const { data, error } = await supabase
    .from('event_participants')
    .select(
      `
      *,
      profiles (
        id,
        email,
        full_name,
        avatar_url
      )
    `
    )
    .eq('event_id', eventId);

  if (error) throw error;
  return data;
}

/**
 * Add a participant to an event
 */
export async function addEventParticipant(
  supabase: SupabaseClient<Database>,
  participant: EventParticipantInsert
) {
  const { data, error } = await supabase
    .from('event_participants')
    .insert(participant)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a participant's role
 */
export async function updateEventParticipant(
  supabase: SupabaseClient<Database>,
  participantId: string,
  updates: EventParticipantUpdate
) {
  const { data, error } = await supabase
    .from('event_participants')
    .update(updates)
    .eq('id', participantId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove a participant from an event
 */
export async function removeEventParticipant(
  supabase: SupabaseClient<Database>,
  participantId: string
) {
  const { error } = await supabase
    .from('event_participants')
    .delete()
    .eq('id', participantId);

  if (error) throw error;
}

/**
 * Get current user's role in an event
 */
export async function getCurrentUserRole(
  supabase: SupabaseClient<Database>,
  eventId: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('event_participants')
    .select('role')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  return data.role;
}
