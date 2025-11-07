# Spec Tasks

These are the tasks to be completed for the spec detailed in @.agent-os/specs/2025-11-06-timeline-builder/spec.md

> Created: 2025-11-06
> Status: Ready for Implementation

## Tasks

- [ ] 1. Database functions for timeline items
  - [ ] 1.1 Add TypeScript types for timeline operations to lib/database.ts
  - [ ] 1.2 Implement getTimelineItems() function with event_id filter and time sorting
  - [ ] 1.3 Implement createTimelineItem() function with validation
  - [ ] 1.4 Implement updateTimelineItem() function with partial updates support
  - [ ] 1.5 Implement deleteTimelineItem() function
  - [ ] 1.6 Add utility functions for time formatting and combination
  - [ ] 1.7 Add category configuration constants (labels and badge classes)

- [ ] 2. Timeline viewing page
  - [ ] 2.1 Create app/events/[id]/timeline/page.tsx as async Server Component
  - [ ] 2.2 Fetch event details and verify event exists (404 if not)
  - [ ] 2.3 Fetch timeline items sorted by start_time
  - [ ] 2.4 Implement page layout with event context header and back navigation
  - [ ] 2.5 Add loading.tsx and error.tsx for proper Next.js error boundaries
  - [ ] 2.6 Handle empty state when no timeline items exist
  - [ ] 2.7 Verify mobile responsive design

- [ ] 3. TimelineItemForm component
  - [ ] 3.1 Create components/timeline/timeline-item-form.tsx as Client Component
  - [ ] 3.2 Implement form state management for all fields (title, times, category, description)
  - [ ] 3.3 Add comprehensive validation logic for all fields
  - [ ] 3.4 Implement inline error display for each field
  - [ ] 3.5 Add submit handler for both create and update modes
  - [ ] 3.6 Implement time combination logic with event date
  - [ ] 3.7 Add loading states and error handling
  - [ ] 3.8 Add form reset after successful creation
  - [ ] 3.9 Style form with DaisyUI classes matching existing patterns

- [ ] 4. TimelineItemCard component
  - [ ] 4.1 Create components/timeline/timeline-item-card.tsx as Client Component
  - [ ] 4.2 Implement card layout with time, title, category, and description display
  - [ ] 4.3 Add formatted time display (12-hour format)
  - [ ] 4.4 Add category badge with color coding
  - [ ] 4.5 Implement edit button that opens modal
  - [ ] 4.6 Add edit modal with TimelineItemForm in modal mode
  - [ ] 4.7 Integrate DeleteTimelineItemButton component
  - [ ] 4.8 Add icons (Clock, Edit) from lucide-react
  - [ ] 4.9 Ensure mobile responsive layout

- [ ] 5. DeleteTimelineItemButton component
  - [ ] 5.1 Create components/timeline/delete-timeline-item-button.tsx as Client Component
  - [ ] 5.2 Implement confirmation dialog state management
  - [ ] 5.3 Add delete handler with error handling
  - [ ] 5.4 Implement DaisyUI modal for confirmation
  - [ ] 5.5 Add loading state during deletion
  - [ ] 5.6 Add Trash2 icon from lucide-react
  - [ ] 5.7 Ensure proper router.refresh() after deletion

- [ ] 6. TimelineList component
  - [ ] 6.1 Create components/timeline/timeline-list.tsx as Client Component
  - [ ] 6.2 Implement list container with proper spacing
  - [ ] 6.3 Map over timeline items rendering TimelineItemCard for each
  - [ ] 6.4 Pass necessary props (item, eventDate) to cards

- [ ] 7. Component exports and integration
  - [ ] 7.1 Create components/timeline/index.ts barrel export
  - [ ] 7.2 Export all timeline components
  - [ ] 7.3 Integrate components into timeline page
  - [ ] 7.4 Add "Timeline" link/button to event detail page

- [ ] 8. Testing and polish
  - [ ] 8.1 Test creating timeline items with various times and categories
  - [ ] 8.2 Test editing timeline items and verify updates persist
  - [ ] 8.3 Test deleting timeline items with confirmation
  - [ ] 8.4 Test validation for all required and optional fields
  - [ ] 8.5 Test empty state display when no items exist
  - [ ] 8.6 Test mobile responsive design on small screens
  - [ ] 8.7 Test chronological sorting of timeline items
  - [ ] 8.8 Verify all error states display properly
  - [ ] 8.9 Test end_time validation (must be after start_time)
  - [ ] 8.10 Verify router.refresh() updates display after mutations
