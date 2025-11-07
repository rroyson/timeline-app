# UI Components Specification

This document details all UI components for the Timeline Builder feature.

> Created: 2025-11-06
> Version: 1.0.0

## Component Architecture

```
app/events/[id]/timeline/page.tsx (Server Component)
└── TimelineList (Client Component)
    ├── TimelineItemCard (Client Component) [repeated for each item]
    │   ├── EditButton → opens TimelineItemForm modal
    │   └── DeleteTimelineItemButton (Client Component)
    ├── TimelineItemForm (Client Component) - Add mode
    └── EmptyState (Client Component) - when no items
```

## Page: Timeline Management

**Path**: `app/events/[id]/timeline/page.tsx`
**Type**: Server Component (async)

### Purpose

Main page for viewing and managing timeline items for a specific event.

### Data Fetching

```typescript
const event = await getEventWithDetails(supabase, id);
const timelineItems = await getTimelineItems(supabase, id);
```

### Layout Structure

```tsx
<main className="container mx-auto max-w-6xl px-4 py-8">
  {/* Header with event context */}
  <div className="mb-6">
    <Link href={`/events/${id}`}>← Back to Event</Link>
    <h1>Timeline: {event.name}</h1>
    <p>{formattedDate}</p>
  </div>

  {/* Add Timeline Item Section */}
  <div className="card bg-base-100 mb-6 shadow">
    <div className="card-body">
      <h2 className="card-title">Add Timeline Item</h2>
      <TimelineItemForm eventId={id} eventDate={event.event_date} />
    </div>
  </div>

  {/* Timeline Items List */}
  <div className="card bg-base-100 shadow">
    <div className="card-body">
      <h2 className="card-title">Timeline Items</h2>
      {timelineItems.length === 0 ? (
        <EmptyState
          title="No timeline items yet"
          description="Add your first timeline item to start building your event schedule"
        />
      ) : (
        <TimelineList items={timelineItems} eventDate={event.event_date} />
      )}
    </div>
  </div>
</main>
```

### Error Handling

- If event not found: call `notFound()` to show 404
- Database errors: Show error message, log to console

---

## Component: TimelineItemForm

**Path**: `components/timeline/timeline-item-form.tsx`
**Type**: Client Component

### Purpose

Reusable form component for adding and editing timeline items. Supports both inline add mode and modal edit mode.

### Props

```typescript
interface TimelineItemFormProps {
  eventId: string;
  eventDate: string; // YYYY-MM-DD format from event
  item?: TimelineItem; // If editing existing item
  onSuccess?: () => void; // Callback after save
  onCancel?: () => void; // Callback for cancel
  mode?: 'inline' | 'modal'; // Default: inline for add, modal for edit
}
```

### State

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [formData, setFormData] = useState({
  title: item?.title || '',
  start_time: item ? extractTime(item.start_time) : '',
  end_time: item?.end_time ? extractTime(item.end_time) : '',
  category: item?.category || 'general',
  description: item?.description || '',
});
const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
```

### Validation

```typescript
const validateForm = () => {
  const errors: Record<string, string> = {};

  if (!formData.title.trim()) {
    errors.title = 'Title is required';
  } else if (formData.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  } else if (formData.title.length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }

  if (!formData.start_time) {
    errors.start_time = 'Start time is required';
  }

  if (formData.end_time && formData.start_time) {
    if (formData.end_time <= formData.start_time) {
      errors.end_time = 'End time must be after start time';
    }
  }

  if (formData.description && formData.description.length > 2000) {
    errors.description = 'Description must be less than 2000 characters';
  }

  setFieldErrors(errors);
  return Object.keys(errors).length === 0;
};
```

### Form Fields

1. **Title** (Required)
   - Type: text input
   - Placeholder: "Guest Arrival", "Dinner Service", "Band Performance"
   - Error messages below field

2. **Start Time** (Required)
   - Type: time input
   - Label: "Scheduled Time"
   - 12-hour or 24-hour based on browser default

3. **End Time** (Optional)
   - Type: time input
   - Label: "End Time (optional)"
   - Only show error if before start time

4. **Category** (Required)
   - Type: select dropdown
   - Options: Setup, Performance, Catering, Breakdown, General
   - Default: General

5. **Description** (Optional)
   - Type: textarea
   - Rows: 4
   - Placeholder: "Add details about this timeline item..."
   - Character count shown

### Submit Handler

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);
  setError(null);

  try {
    const supabase = createClient();

    // Combine date and time
    const start_time = combineDateTime(eventDate, formData.start_time);
    const end_time = formData.end_time
      ? combineDateTime(eventDate, formData.end_time)
      : null;

    if (item) {
      // Update existing
      await updateTimelineItem(supabase, item.id, {
        title: formData.title,
        start_time,
        end_time,
        category: formData.category,
        description: formData.description || null,
      });
    } else {
      // Create new
      await createTimelineItem(supabase, {
        event_id: eventId,
        title: formData.title,
        start_time,
        end_time,
        category: formData.category,
        description: formData.description || null,
        created_by: TEMP_USER_ID,
      });
    }

    if (onSuccess) {
      onSuccess();
    } else {
      router.refresh(); // Refresh server component data
      // Reset form for add mode
      if (!item) {
        setFormData({
          title: '',
          start_time: '',
          end_time: '',
          category: 'general',
          description: '',
        });
      }
    }
  } catch (err) {
    console.error('Error saving timeline item:', err);
    setError('Failed to save timeline item. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### Visual Design

- Consistent with EventForm component styling
- DaisyUI form-control, input, textarea, select classes
- Error states with input-error class
- Loading spinner on submit button
- Mobile responsive (full width on small screens)

---

## Component: TimelineList

**Path**: `components/timeline/timeline-list.tsx`
**Type**: Client Component

### Purpose

Container component that displays all timeline items in chronological order.

### Props

```typescript
interface TimelineListProps {
  items: TimelineItem[];
  eventDate: string;
}
```

### Layout

```tsx
<div className="space-y-4">
  {items.map((item) => (
    <TimelineItemCard key={item.id} item={item} eventDate={eventDate} />
  ))}
</div>
```

---

## Component: TimelineItemCard

**Path**: `components/timeline/timeline-item-card.tsx`
**Type**: Client Component

### Purpose

Display individual timeline item with all details and action buttons.

### Props

```typescript
interface TimelineItemCardProps {
  item: TimelineItem;
  eventDate: string;
}
```

### State

```typescript
const [isEditing, setIsEditing] = useState(false);
```

### Layout Structure

```tsx
<div className="card card-bordered">
  <div className="card-body">
    {/* Header row: Time, Category badge, Actions */}
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <Clock className="text-base-content/70 h-5 w-5" />
        <div>
          <div className="text-lg font-semibold">
            {formatTime(item.start_time)}
            {item.end_time && (
              <span className="text-base-content/60">
                {' '}
                - {formatTime(item.end_time)}
              </span>
            )}
          </div>
        </div>
        <span className={cn('badge', CATEGORY_BADGE_CLASSES[item.category])}>
          {CATEGORY_LABELS[item.category]}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="h-4 w-4" />
        </button>
        <DeleteTimelineItemButton itemId={item.id} itemTitle={item.title} />
      </div>
    </div>

    {/* Title */}
    <h3 className="mt-2 text-xl font-bold">{item.title}</h3>

    {/* Description (if present) */}
    {item.description && (
      <p className="text-base-content/80 whitespace-pre-wrap">
        {item.description}
      </p>
    )}
  </div>
</div>;

{
  /* Edit Modal */
}
{
  isEditing && (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="mb-4 text-lg font-bold">Edit Timeline Item</h3>
        <TimelineItemForm
          eventId={item.event_id}
          eventDate={eventDate}
          item={item}
          mode="modal"
          onSuccess={() => {
            setIsEditing(false);
            router.refresh();
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setIsEditing(false)}>close</button>
      </form>
    </dialog>
  );
}
```

### Visual Design

- Card layout similar to EventCard
- Time prominently displayed with clock icon
- Category badge color-coded
- Edit and delete buttons on hover (always visible on mobile)
- Description with preserved line breaks
- Responsive: stacks vertically on mobile

---

## Component: DeleteTimelineItemButton

**Path**: `components/timeline/delete-timeline-item-button.tsx`
**Type**: Client Component

### Purpose

Handle timeline item deletion with confirmation dialog.

### Props

```typescript
interface DeleteTimelineItemButtonProps {
  itemId: string;
  itemTitle: string;
}
```

### State

```typescript
const [isOpen, setIsOpen] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
```

### Implementation

```typescript
const handleDelete = async () => {
  setIsDeleting(true);
  try {
    const supabase = createClient();
    await deleteTimelineItem(supabase, itemId);
    router.refresh();
    setIsOpen(false);
  } catch (err) {
    console.error('Error deleting timeline item:', err);
    alert('Failed to delete timeline item. Please try again.');
  } finally {
    setIsDeleting(false);
  }
};
```

### Layout

```tsx
<>
  <button
    className="btn btn-ghost btn-sm text-error"
    onClick={() => setIsOpen(true)}
  >
    <Trash2 className="h-4 w-4" />
  </button>

  {isOpen && (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Delete Timeline Item?</h3>
        <p className="py-4">
          Are you sure you want to delete "{itemTitle}"? This action cannot be
          undone.
        </p>
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <span className="loading loading-spinner" />}
            Delete
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setIsOpen(false)}>close</button>
      </form>
    </dialog>
  )}
</>
```

---

## Component Barrel Export

**Path**: `components/timeline/index.ts`

```typescript
export { TimelineItemForm } from './timeline-item-form';
export { TimelineList } from './timeline-list';
export { TimelineItemCard } from './timeline-item-card';
export { DeleteTimelineItemButton } from './delete-timeline-item-button';
```

---

## Mobile Responsive Considerations

- Forms: Full width on mobile, max-width on desktop
- Timeline cards: Stack elements vertically on small screens
- Action buttons: Always visible on mobile (no hover-only)
- Modals: Full height on mobile, centered on desktop
- Touch targets: Minimum 44px for all clickable elements
- Font sizes: Scale appropriately for mobile readability

## Accessibility

- Semantic HTML: Use proper heading hierarchy
- Labels: All form inputs have associated labels
- ARIA attributes: Add aria-label to icon-only buttons
- Keyboard navigation: Tab order follows visual flow
- Focus indicators: Visible focus states on all interactive elements
- Error announcements: Use aria-live for dynamic error messages
