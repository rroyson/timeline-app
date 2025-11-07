# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-11-06-timeline-builder/spec.md

> Created: 2025-11-06
> Version: 1.0.0

## Technical Requirements

### Database Operations

- Query timeline items for an event using `event_id` foreign key relationship
- Sort timeline items by `start_time` in ascending order (chronological)
- Create new timeline items with required fields: `event_id`, `title`, `start_time`, `created_by`
- Update timeline items allowing changes to all user-editable fields
- Delete timeline items with confirmation to prevent accidental removal
- Handle optional fields: `description`, `end_time`

### Time Handling

- Display times in user's local timezone using browser's timezone detection
- Input times using HTML `<input type="time">` for consistent UX across browsers
- Combine event date with time input to create full `timestamp with time zone`
- Format display times as "h:mm AM/PM" (12-hour format) for readability
- Support optional end_time for timeline items that have a duration

### Category Management

- Use existing `timeline_item_category` enum: setup, performance, catering, breakdown, general
- Default to 'general' category if not specified
- Display categories with consistent color coding using DaisyUI badge classes
- Allow category selection via dropdown/select in add/edit forms

### Validation Rules

- Title: Required, 3-200 characters, non-empty after trim
- Start time: Required, must be a valid time input
- End time: Optional, if provided must be after start_time
- Description: Optional, max 2000 characters
- Category: Required, must be one of enum values
- Event ID: Required, must reference an existing event

## Approach

We'll implement this feature following the established patterns from the Event Management implementation:

1. **Database Layer** (`lib/database.ts`):
   - Add functions: `getTimelineItems()`, `createTimelineItem()`, `updateTimelineItem()`, `deleteTimelineItem()`
   - Use Supabase client for all database operations
   - Include proper error handling and type safety

2. **Page Routes**:
   - `/events/[id]/timeline` - Main timeline viewing and management page (Server Component)
   - Use nested route under events for clear hierarchy
   - Fetch timeline items on server for initial render

3. **Client Components**:
   - `TimelineItemForm` - Reusable form for add/edit operations (modal-based)
   - `TimelineItemCard` - Display individual timeline item with actions
   - `TimelineList` - Container for all timeline items
   - `DeleteTimelineItemButton` - Confirmation dialog and delete action
   - `EmptyState` - Already exists, reuse for empty timeline

4. **UI/UX Pattern**:
   - Follow same design language as Events pages
   - Use DaisyUI modal for add/edit forms (consistent with existing patterns)
   - Use card components for timeline item display
   - Mobile-first responsive design with Tailwind classes

## Database Functions Implementation

```typescript
// lib/database.ts additions

export async function getTimelineItems(
  supabase: SupabaseClient<Database>,
  eventId: string
): Promise<TimelineItem[]> {
  const { data, error } = await supabase
    .from('timeline_items')
    .select('*')
    .eq('event_id', eventId)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createTimelineItem(
  supabase: SupabaseClient<Database>,
  item: TimelineItemInsert
): Promise<TimelineItem> {
  const { data, error } = await supabase
    .from('timeline_items')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTimelineItem(
  supabase: SupabaseClient<Database>,
  id: string,
  updates: TimelineItemUpdate
): Promise<void> {
  const { error } = await supabase
    .from('timeline_items')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteTimelineItem(
  supabase: SupabaseClient<Database>,
  id: string
): Promise<void> {
  const { error } = await supabase.from('timeline_items').delete().eq('id', id);

  if (error) throw error;
}
```

## Time Handling Implementation

```typescript
// Combine event date with time input
function combineDateTime(eventDate: string, timeInput: string): string {
  // eventDate is from event.event_date (YYYY-MM-DD)
  // timeInput is from HTML time input (HH:MM)
  return `${eventDate}T${timeInput}:00`;
}

// Format time for display
function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Extract time for input field
function extractTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
```

## Category Configuration

```typescript
// Category labels and badge classes
const CATEGORY_LABELS: Record<
  Database['public']['Enums']['timeline_item_category'],
  string
> = {
  setup: 'Setup',
  performance: 'Performance',
  catering: 'Catering',
  breakdown: 'Breakdown',
  general: 'General',
};

const CATEGORY_BADGE_CLASSES: Record<
  Database['public']['Enums']['timeline_item_category'],
  string
> = {
  setup: 'badge-info',
  performance: 'badge-secondary',
  catering: 'badge-accent',
  breakdown: 'badge-warning',
  general: 'badge-ghost',
};
```

## External Dependencies

No new external dependencies required. We'll use existing libraries:

- Next.js (app router, server/client components)
- Supabase JS Client (database operations)
- TailwindCSS + DaisyUI (styling)
- Lucide React (icons)
- React Hook Form (form handling - if not already installed, use native React state)

## Error Handling

- Database errors: Display user-friendly messages, log to console
- Validation errors: Inline field-level error messages
- Network errors: Show retry option with clear error message
- Optimistic updates: Not in MVP, save then refresh for simplicity
- 404 errors: Redirect to events list if event not found

## Security Considerations

- RLS policies: Currently allow all operations for MVP (already configured)
- Input sanitization: Use TypeScript types and validation
- XSS prevention: React automatically escapes content
- CSRF protection: Supabase client handles auth tokens
- Future: Implement proper auth and row-level security when authentication is added
