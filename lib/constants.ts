/**
 * Application Constants
 */

/**
 * Temporary user ID for development without authentication
 *
 * TODO: Replace this with real user authentication when auth is implemented.
 * This constant is used throughout the app to identify the current user.
 * Search for "TEMP_USER_ID" to find all usages when implementing auth.
 *
 * IMPORTANT: When implementing auth, also update:
 * 1. RLS policies in database to use auth.uid() instead of hardcoded UUID
 * 2. Re-add foreign key constraint: profiles.id -> auth.users.id
 * 3. Remove temporary profile record from profiles table
 */
export const TEMP_USER_ID = '00000000-0000-0000-0000-000000000001';
