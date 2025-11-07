# UI Components Specification

This is the UI components specification for the spec detailed in @.agent-os/specs/2025-11-06-event-management/spec.md

> Created: 2025-11-06
> Version: 1.0.0

## Component Structure

### EventForm Component

**Purpose:** Reusable form for creating and editing events

**Props:**

```typescript
interface EventFormProps {
  event?: Event; // If editing, pass existing event
  onSuccess?: (event: Event) => void;
  onCancel?: () => void;
}
```

**UI Elements:**

- Event name input (text, required)
- Event date input (date, required)
- Location input (text, optional)
- Description textarea (optional)
- Submit button with loading state
- Cancel button (if onCancel provided)
- Error message display area

**DaisyUI Components Used:**

- `input` with `input-bordered` classes
- `textarea` with `textarea-bordered`
- `btn` with `btn-primary` for submit
- `btn` with `btn-ghost` for cancel
- `alert` with `alert-error` for errors
- `form-control` and `label` for form structure

**Validation:**

- Event name: required, 3-200 characters
- Event date: required, valid date
- Location: max 500 characters
- Description: max 2000 characters
- Show validation errors inline

**States:**

- Default: Empty form or pre-filled with event data
- Loading: Submitting to database
- Error: Show validation or database errors
- Success: Call onSuccess callback

### EventCard Component

**Purpose:** Display event summary in list view

**Props:**

```typescript
interface EventCardProps {
  event: Event;
  onClick?: () => void;
}
```

**UI Elements:**

- Event name (heading)
- Event date (formatted)
- Location (if present)
- Status badge (planning, in_progress, completed, cancelled)
- Timeline items count
- Click to view details

**DaisyUI Components Used:**

- `card` with `card-bordered` and `card-compact`
- `badge` for status
- `card-title` for event name
- Hover effects with `hover:shadow-lg`

**Layout:**

```tsx
<div className="card card-bordered card-compact cursor-pointer transition-shadow hover:shadow-lg">
  <div className="card-body">
    <div className="flex items-start justify-between">
      <h3 className="card-title text-lg">{event.name}</h3>
      <span className="badge badge-primary">{status}</span>
    </div>
    <div className="text-base-content/70 space-y-1 text-sm">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4" />
        <span>{formattedDate}</span>
      </div>
      {location && (
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4" />
          <span>{location}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <ListIcon className="h-4 w-4" />
        <span>{timelineCount} timeline items</span>
      </div>
    </div>
  </div>
</div>
```

### DeleteEventButton Component

**Purpose:** Delete event with confirmation dialog

**Props:**

```typescript
interface DeleteEventButtonProps {
  eventId: string;
  eventName: string;
  onSuccess?: () => void;
  className?: string;
}
```

**UI Elements:**

- Delete button (danger styling)
- Confirmation modal
- Loading state during deletion
- Error display if deletion fails

**DaisyUI Components Used:**

- `btn` with `btn-error` or `btn-outline btn-error`
- `modal` for confirmation dialog
- `modal-box` for content
- `modal-action` for buttons
- `loading` class for spinner

**Confirmation Modal:**

```tsx
<dialog className="modal">
  <div className="modal-box">
    <h3 className="text-lg font-bold">Delete Event?</h3>
    <p className="py-4">
      Are you sure you want to delete "{eventName}"? This will permanently
      delete the event and all associated timeline items. This action cannot be
      undone.
    </p>
    <div className="modal-action">
      <button className="btn btn-ghost" onClick={onCancel}>
        Cancel
      </button>
      <button className="btn btn-error" onClick={handleDelete}>
        {loading ? <span className="loading loading-spinner" /> : 'Delete'}
      </button>
    </div>
  </div>
</dialog>
```

### EventFilters Component

**Purpose:** Filter and search events

**Props:**

```typescript
interface EventFiltersProps {
  onFilterChange: (filter: 'all' | 'upcoming' | 'past') => void;
  onSearchChange: (query: string) => void;
  currentFilter: 'all' | 'upcoming' | 'past';
  searchQuery: string;
}
```

**UI Elements:**

- Filter tabs (All, Upcoming, Past)
- Search input with icon
- Clear search button

**DaisyUI Components Used:**

- `tabs` with `tabs-boxed` for filter controls
- `tab` with `tab-active` for selected filter
- `input` with `input-bordered` for search
- `btn` with `btn-ghost btn-sm` for clear search

**Layout:**

```tsx
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div className="tabs tabs-boxed">
    <button className={cn('tab', currentFilter === 'all' && 'tab-active')}>
      All Events
    </button>
    <button className={cn('tab', currentFilter === 'upcoming' && 'tab-active')}>
      Upcoming
    </button>
    <button className={cn('tab', currentFilter === 'past' && 'tab-active')}>
      Past
    </button>
  </div>

  <div className="form-control w-full sm:w-auto">
    <div className="input-group">
      <input
        type="text"
        placeholder="Search events..."
        className="input input-bordered w-full sm:w-64"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchQuery && (
        <button className="btn btn-ghost btn-sm" onClick={clearSearch}>
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  </div>
</div>
```

### EmptyState Component

**Purpose:** Show helpful message when no events exist

**Props:**

```typescript
interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

**UI Elements:**

- Icon or illustration
- Title and description
- Optional call-to-action button

**DaisyUI Components Used:**

- `card` with centered content
- `btn` with `btn-primary` for action

**Layout:**

```tsx
<div className="flex flex-col items-center justify-center p-12 text-center">
  <CalendarIcon className="text-base-content/30 mb-4 h-16 w-16" />
  <h3 className="mb-2 text-xl font-semibold">{title}</h3>
  <p className="text-base-content/70 mb-6 max-w-md">{description}</p>
  {actionLabel && onAction && (
    <button className="btn btn-primary" onClick={onAction}>
      {actionLabel}
    </button>
  )}
</div>
```

## Page Layouts

### Events Dashboard Page

**Purpose:** List all events with filters and search

**Layout:**

```tsx
<main className="container mx-auto max-w-6xl px-4 py-8">
  <div className="mb-8 flex items-center justify-between">
    <h1 className="text-3xl font-bold">My Events</h1>
    <Link href="/events/new" className="btn btn-primary">
      <PlusIcon className="mr-2 h-5 w-5" />
      Create Event
    </Link>
  </div>

  <EventFilters
    currentFilter={filter}
    searchQuery={search}
    onFilterChange={setFilter}
    onSearchChange={setSearch}
  />

  {filteredEvents.length === 0 ? (
    <EmptyState
      title={search ? 'No events found' : 'No events yet'}
      description={
        search
          ? 'Try adjusting your search'
          : 'Create your first event to get started'
      }
      actionLabel={!search ? 'Create Event' : undefined}
      onAction={() => router.push('/events/new')}
    />
  ) : (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredEvents.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onClick={() => router.push(`/events/${event.id}`)}
        />
      ))}
    </div>
  )}
</main>
```

### Create/Edit Event Page

**Purpose:** Form to create or edit event

**Layout:**

```tsx
<main className="container mx-auto max-w-2xl px-4 py-8">
  <div className="mb-8">
    <h1 className="mb-2 text-3xl font-bold">
      {event ? 'Edit Event' : 'Create Event'}
    </h1>
    <p className="text-base-content/70">
      {event
        ? 'Update event details below'
        : 'Fill in the details to create a new event'}
    </p>
  </div>

  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <EventForm
        event={event}
        onSuccess={(event) => router.push(`/events/${event.id}`)}
        onCancel={() => router.back()}
      />
    </div>
  </div>
</main>
```

### Event Detail Page

**Purpose:** Show event details and timeline preview

**Layout:**

```tsx
<main className="container mx-auto max-w-6xl px-4 py-8">
  <div className="mb-8 flex items-start justify-between">
    <div>
      <div className="mb-2 flex items-center gap-3">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <span className="badge badge-lg badge-primary">{status}</span>
      </div>
      <div className="text-base-content/70 space-y-1">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        )}
      </div>
    </div>

    <div className="flex gap-2">
      <Link href={`/events/${event.id}/edit`} className="btn btn-outline">
        <EditIcon className="mr-2 h-4 w-4" />
        Edit
      </Link>
      <DeleteEventButton
        eventId={event.id}
        eventName={event.name}
        onSuccess={() => router.push('/events')}
      />
    </div>
  </div>

  {event.description && (
    <div className="card bg-base-100 mb-6 shadow">
      <div className="card-body">
        <h2 className="card-title text-lg">Description</h2>
        <p className="text-base-content/80 whitespace-pre-wrap">
          {event.description}
        </p>
      </div>
    </div>
  )}

  <div className="card bg-base-100 shadow">
    <div className="card-body">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="card-title text-lg">Timeline</h2>
        <Link
          href={`/events/${event.id}/timeline`}
          className="btn btn-primary btn-sm"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Timeline Item
        </Link>
      </div>

      {event.timeline_items.length === 0 ? (
        <EmptyState
          title="No timeline items yet"
          description="Start building your event timeline"
          actionLabel="Add First Item"
          onAction={() => router.push(`/events/${event.id}/timeline`)}
        />
      ) : (
        <div className="space-y-2">
          {/* Timeline items preview - will build in next spec */}
          <p className="text-base-content/70">
            {event.timeline_items.length} timeline item(s)
          </p>
        </div>
      )}
    </div>
  </div>
</main>
```

## Styling Guidelines

### Color Usage

- **Primary (Blue):** Create buttons, active filters, status badges
- **Error (Red):** Delete buttons, error messages
- **Base variants:** Cards, backgrounds, text

### Responsive Breakpoints

- **Mobile (< 640px):** Single column, full-width buttons, stacked layout
- **Tablet (640px - 1024px):** 2-column grid for events
- **Desktop (> 1024px):** 3-column grid for events, side-by-side controls

### Loading States

- Show skeleton cards while fetching events
- Show spinner in buttons during submission
- Disable form inputs while loading
- Use DaisyUI `loading loading-spinner` classes

### Icons

Using Lucide React:

- `CalendarIcon` - Event dates
- `MapPinIcon` - Locations
- `ListIcon` - Timeline items count
- `PlusIcon` - Create buttons
- `EditIcon` - Edit buttons
- `TrashIcon` - Delete buttons
- `XIcon` - Close/clear buttons
- `SearchIcon` - Search inputs

## Accessibility

- All form inputs have associated labels
- Error messages announced to screen readers
- Keyboard navigation supported
- Focus states visible on all interactive elements
- Confirmation dialogs trap focus
- ARIA labels on icon-only buttons
- Sufficient color contrast (DaisyUI handles this)
