# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-11-06-event-management/spec.md

> Created: 2025-11-06
> Version: 1.0.0

## Technical Requirements

### Database Integration

- Use existing database helper functions from `lib/database/events.ts`
- Leverage Supabase client for real-time data fetching
- Use TypeScript Database types for type safety
- Handle database errors gracefully with user-friendly messages

### Temporary User Management

Since authentication is deferred, we need a simple approach to identify users:

**Option A: Hardcoded User ID**

- Use a constant user ID for all operations
- Simple, no storage needed
- Easy to replace with real auth later

**Option B: localStorage User ID**

- Generate and store a UUID in localStorage on first visit
- Persists across sessions
- Simulates multi-user without auth

**Selected Approach: Option A (Hardcoded User ID)**

**Rationale:** Simpler for MVP development, fewer edge cases to handle, and easily replaced when auth is implemented. We'll use a constant like `TEMP_USER_ID` that can be globally replaced later.

### Event CRUD Operations

**Create Event:**

- Use `createEvent()` from database helpers
- Validate required fields (name, event_date)
- Set owner_id to TEMP_USER_ID
- Set status to 'planning' by default
- Redirect to event detail page on success

**Read Events:**

- Use `getUserEvents()` to fetch all events
- Use `getEventWithDetails()` for single event with timeline items
- Handle loading states during fetch
- Display empty state when no events exist

**Update Event:**

- Use `updateEvent()` with partial event data
- Validate fields before submission
- Show optimistic UI updates
- Display success/error messages

**Delete Event:**

- Use `deleteEvent()` with confirmation dialog
- Cascade delete handled by database foreign key constraints
- Redirect to events list after successful deletion

### UI/UX Requirements

- Responsive design for mobile and desktop
- Loading skeletons during data fetches
- Optimistic UI updates where appropriate
- Clear error messages for validation and database errors
- Confirmation dialogs for destructive actions
- Form validation with inline error display

### Routing Structure

```
app/
├── page.tsx                    # Root redirects to /events
├── events/
│   ├── page.tsx               # Events dashboard (list view)
│   ├── new/
│   │   └── page.tsx          # Create new event form
│   └── [id]/
│       ├── page.tsx          # Event detail view
│       └── edit/
│           └── page.tsx      # Edit event form
```

### State Management

- Use React Server Components for initial data loading
- Use client components for interactive forms
- No global state library needed yet (keep it simple)
- Use URL params for event ID routing

### Form Validation

**Event Name:**

- Required
- Minimum 3 characters
- Maximum 200 characters

**Event Date:**

- Required
- Must be valid date
- Can be past or future (no restriction)

**Location:**

- Optional
- Maximum 500 characters

**Description:**

- Optional
- Maximum 2000 characters

### Error Handling

- Database connection errors: Show generic error message, log to console
- Validation errors: Show inline field errors
- Not found errors: Redirect to 404 or events list
- Delete errors: Show error message, keep user on page

## Implementation Details

### Temporary User Constant

```typescript
// lib/constants.ts
export const TEMP_USER_ID = '00000000-0000-0000-0000-000000000001';
```

### Database Helper Usage

All database operations use existing helpers from `lib/database/events.ts`:

```typescript
import {
  createEvent,
  getUserEvents,
  getEventWithDetails,
  updateEvent,
  deleteEvent,
} from '@/lib/database';
import { TEMP_USER_ID } from '@/lib/constants';

// Create event
const newEvent = await createEvent(supabase, {
  name: 'Corporate Annual Gala',
  event_date: '2025-12-15',
  location: 'Grand Ballroom',
  description: 'Annual company celebration',
  owner_id: TEMP_USER_ID,
  status: 'planning',
});

// Get user events
const events = await getUserEvents(supabase);

// Get event with details
const event = await getEventWithDetails(supabase, eventId);

// Update event
await updateEvent(supabase, eventId, {
  name: 'Updated Event Name',
  location: 'New Venue',
});

// Delete event
await deleteEvent(supabase, eventId);
```

### Component Structure

**Server Components (data fetching):**

- `app/events/page.tsx` - Events list
- `app/events/[id]/page.tsx` - Event details

**Client Components (interactivity):**

- `components/events/event-form.tsx` - Reusable form for create/edit
- `components/events/event-card.tsx` - Event list item
- `components/events/delete-event-button.tsx` - Delete with confirmation
- `components/events/event-filters.tsx` - Filter and search controls

## External Dependencies

No new dependencies required! All functionality provided by:

- Next.js App Router (routing, server components)
- Supabase JS client (database operations)
- DaisyUI (form components, cards, modals)
- Existing database helpers (already implemented)
- TypeScript Database types (already generated)

## Success Criteria

- Users can create events with all fields
- Events list loads and displays correctly
- Event detail page shows event info
- Edit functionality updates events
- Delete functionality removes events with confirmation
- Filtering by upcoming/past works
- Search by name filters in real-time
- All forms have proper validation
- Mobile responsive design
- No console errors during normal operation
- TEMP_USER_ID constant is easy to find and replace when auth is added
