# Spec Tasks

These are the tasks to be completed for the spec detailed in @.agent-os/specs/2025-11-06-database-schema/spec.md

> Created: 2025-11-06
> Status: Ready for Implementation

## Tasks

- [x] 1. Create Supabase Migration File
  - [x] 1.1 Create migration files using Supabase MCP server
  - [x] 1.2 Add enum type definitions (event_status, participant_role, timeline_item_category)
  - [x] 1.3 Add table definitions (profiles, events, timeline_items, event_participants)
  - [x] 1.4 Add indexes for query performance
  - [x] 1.5 Add RLS policies for all tables
  - [x] 1.6 Add triggers for updated_at and auto-owner assignment
  - [x] 1.7 Enable realtime on events, timeline_items, and event_participants

- [x] 2. Apply Migration to Supabase
  - [x] 2.1 Apply migration to development Supabase project
  - [x] 2.2 Verify all tables created successfully
  - [x] 2.3 Verify RLS policies are enabled
  - [x] 2.4 Verify indexes exist
  - [x] 2.5 Verify triggers are active

- [x] 3. Generate TypeScript Types
  - [x] 3.1 Run Supabase MCP to generate types from schema
  - [x] 3.2 Save generated types to types/database.ts
  - [x] 3.3 Verify types match schema structure
  - [x] 3.4 Add type exports to types/index.ts

- [x] 4. Create Database Helper Functions
  - [x] 4.1 Create helper functions for common queries (lib/database/)
  - [x] 4.2 Create type-safe query builders using generated types
  - [x] 4.3 Add error handling utilities (throw on error pattern)
  - [x] 4.4 Create Supabase clients with Database typing

- [ ] 5. Test RLS Policies (Deferred - will test during feature implementation)
  - [ ] 5.1 Test profile policies (read own, read co-participants)
  - [ ] 5.2 Test event policies (read, create, update, delete)
  - [ ] 5.3 Test timeline item policies (CRUD operations)
  - [ ] 5.4 Test event participant policies (manage team)
  - [ ] 5.5 Verify unauthorized access is blocked

- [ ] 6. Verify Realtime Subscriptions (Deferred - will test during feature implementation)
  - [ ] 6.1 Test realtime updates on events table
  - [ ] 6.2 Test realtime updates on timeline_items table
  - [ ] 6.3 Test realtime updates on event_participants table
  - [ ] 6.4 Verify subscription filters work correctly

- [x] 7. Documentation
  - [x] 7.1 Document schema structure in sub-specs/database-schema.md
  - [x] 7.2 Add entity relationship diagram (ASCII diagram in schema doc)
  - [x] 7.3 Document RLS policy patterns in technical-spec.md
  - [x] 7.4 Add migration rollback script in database-schema.md
