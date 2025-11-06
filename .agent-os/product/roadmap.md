# Product Roadmap

> Last Updated: 2025-11-06
> Version: 1.0.0
> Status: Planning

## Phase 1: Foundation & Core Timeline (3-4 weeks)

**Goal:** Establish core infrastructure and basic timeline functionality that allows users to create, view, and manually update event timelines.

**Success Criteria:** Users can create an account, create an event, build a basic timeline with time slots and descriptions, and view it in a clean interface.

### Must-Have Features

- [ ] Authentication setup with Supabase Auth - User registration, login, logout, and session management `M`
- [x] Database schema design - Core tables for events, timeline_items, teams, and RLS policies `M`
- [ ] Event creation and management - CRUD operations for events with basic metadata (name, date, location) `S`
- [ ] Basic timeline builder - Interface to add, edit, delete timeline items with time and description `L`
- [ ] Timeline viewing interface - Clean, chronological display of timeline items for an event `M`
- [x] Project structure and configuration - Next.js setup, Supabase configuration, Tailwind + DaisyUI integration `S`

### Should-Have Features

- [ ] Event list/dashboard - View all user's upcoming and past events `S`
- [ ] Basic responsive design - Mobile-friendly layouts for timeline viewing `M`

### Dependencies

- Next.js project initialized
- Supabase project created and configured
- Supabase MCP server connected for Claude's database management

## Phase 2: Real-Time Synchronization (2-3 weeks)

**Goal:** Implement Socket.io infrastructure for real-time updates so multiple users viewing the same event timeline see changes instantly.

**Success Criteria:** When a timeline is updated by one user, all other users viewing that timeline see the changes within 1 second without refreshing.

### Must-Have Features

- [ ] Socket.io server setup - Configure Socket.io with Next.js API routes for WebSocket connections `M`
- [ ] Real-time timeline updates - Broadcast timeline changes to all connected clients viewing the same event `L`
- [ ] Connection management - Handle user connections, disconnections, and room-based event subscriptions `M`
- [ ] Live view mode - Special interface that displays current timeline item and upcoming items with auto-scrolling `L`
- [ ] Optimistic UI updates - Immediate local updates with rollback on failure for better UX `M`

### Should-Have Features

- [ ] Connection status indicators - Visual feedback showing who's currently viewing the timeline `S`
- [ ] Reconnection logic - Automatic reconnection with state recovery if WebSocket drops `S`

### Dependencies

- Phase 1 complete (core timeline functionality)
- Socket.io client and server libraries installed

## Phase 3: Team Collaboration & Notifications (2-3 weeks)

**Goal:** Enable multi-user collaboration with role-based permissions and implement push notifications for timeline updates.

**Success Criteria:** Event coordinators can invite team members with specific roles, and team members receive notifications when timeline changes affect them.

### Must-Have Features

- [ ] Team invitation system - Email-based invitations to join specific events `M`
- [ ] Role-based permissions - Define roles (coordinator, vendor, viewer) with different access levels `L`
- [ ] Web Push notifications setup - Browser notification permissions and service worker configuration `M`
- [ ] Timeline change notifications - Push notifications when timeline items are updated, added, or deleted `L`
- [ ] Role-filtered timeline views - Team members see timeline items relevant to their role `M`

### Should-Have Features

- [ ] Notification preferences - User settings to control which types of notifications they receive `S`
- [ ] In-app notification center - Fallback notification display within the app `M`
- [ ] Team member management - Add, remove, and update team member roles `S`

### Dependencies

- Phase 2 complete (real-time updates)
- Email service configured (SendGrid or similar)
- SSL certificate for Push API (provided by Vercel)

## Phase 4: Advanced Planning & Templates (2 weeks)

**Goal:** Add calendar-based event planning, timeline templates, and enhanced timeline building features for efficient event preparation.

**Success Criteria:** Users can view all events in a calendar, create new events from templates, and use advanced timeline features like drag-and-drop reordering.

### Must-Have Features

- [ ] Calendar view - Monthly/weekly calendar displaying all user events `M`
- [ ] Timeline templates - Create, save, and reuse timeline templates for common event types `L`
- [ ] Drag-and-drop timeline builder - Reorder timeline items by dragging, auto-adjust times `L`
- [ ] Bulk timeline operations - Copy, move, or delete multiple timeline items at once `M`
- [ ] Timeline item categories - Color-coded categories (setup, performance, catering, breakdown, etc.) `S`

### Should-Have Features

- [ ] Recurring events - Support for weekly/monthly recurring event patterns `M`
- [ ] Timeline durations - Set duration for items instead of just start times, show overlaps `S`
- [ ] Notes and attachments - Add detailed notes and file attachments to timeline items `M`

### Dependencies

- Phase 3 complete (team collaboration)
- S3 and CloudFront configured for file attachments
- Calendar UI library evaluated and selected

## Phase 5: Polish, Analytics & Enterprise Features (3 weeks)

**Goal:** Add professional polish, usage analytics, and enterprise-grade features that make Timeline production-ready for paid customers.

**Success Criteria:** Application performs well under load, provides valuable insights to event coordinators, and includes enterprise features for larger teams.

### Must-Have Features

- [ ] Performance optimization - Database query optimization, caching strategy, bundle size reduction `L`
- [ ] Event analytics dashboard - Timeline completion rates, common delay points, team performance metrics `L`
- [ ] Timeline history and audit log - Track all timeline changes with timestamps and user attribution `M`
- [ ] Advanced search and filtering - Search across events, timeline items, and teams `M`
- [ ] Export functionality - Export timelines as PDF or CSV for printing and record-keeping `M`

### Should-Have Features

- [ ] Timeline comments and discussions - Contextual commenting on specific timeline items `M`
- [ ] Custom branding - Allow organizations to upload logos and customize colors `S`
- [ ] Multi-event coordination - Dashboard view for coordinators managing multiple simultaneous events `M`
- [ ] Integration webhooks - Webhook endpoints to integrate with external systems `L`
- [ ] Offline mode - Service worker caching for timeline viewing without internet `XL`

### Dependencies

- Phases 1-4 complete
- Sentry configured for error tracking
- Vercel Analytics enabled
- Load testing performed

## Future Considerations (Post-Launch)

### Potential Features for Version 2.0

- Mobile native apps (iOS/Android) for better push notifications and offline support
- Vendor marketplace integration (directory of caterers, DJs, etc.)
- Automated timeline suggestions based on event type and past events
- Integration with popular calendar tools (Google Calendar, Outlook)
- SMS notifications as fallback for users without app access
- Multi-language support for international events
- Advanced reporting and business intelligence features
- White-label solution for large event planning companies
- Public timeline sharing for attendees (limited view)
- Budget tracking integrated with timeline milestones
- Weather and traffic alerts that suggest timeline adjustments
- AI-powered timeline optimization suggestions
- Video conferencing integration for remote team coordination
