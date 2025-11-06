# Spec Requirements Document

> Spec: Database Schema Design
> Created: 2025-11-06
> Status: Planning

## Overview

Design and implement the core database schema for Timeline including tables for users, events, timeline items, teams, and participants. Establish Row Level Security (RLS) policies to ensure proper data access control and implement indexes for optimal query performance.

## User Stories

### Event Coordinator Data Management

As an event coordinator, I want my event data to be securely stored and only accessible to authorized team members, so that sensitive event information remains private and team members can only see events they're assigned to.

The coordinator creates an event, adds timeline items, and invites team members. Each team member sees only the events they're assigned to, and can only modify data based on their role permissions. The database enforces these access controls automatically through RLS policies.

### Multi-User Collaboration

As a team member, I want to see real-time updates when coordinators modify timelines, so that I always have the latest information without manual refreshes.

When a coordinator updates a timeline item, the database change triggers real-time subscriptions via Supabase Realtime. All connected clients viewing that event receive instant updates showing the modified timeline item.

## Spec Scope

1. **Core Tables** - Users (profiles), events, timeline_items, teams, team_members, event_participants
2. **Row Level Security Policies** - Policies for all tables ensuring users can only access authorized data
3. **Database Indexes** - Performance indexes on foreign keys and frequently queried columns
4. **Enums and Constraints** - Role types, event statuses, timeline item categories, check constraints
5. **Migration Script** - Complete Supabase migration to create all tables, policies, and indexes

## Out of Scope

- Authentication tables (handled by Supabase Auth automatically)
- Timeline templates (Phase 4 feature)
- Comments/discussions (Phase 3 feature)
- Audit logging (Phase 5 feature)
- File attachments storage schema (Phase 4 feature)

## Expected Deliverable

1. Complete database schema migration script that creates all tables with proper relationships
2. RLS policies that enforce role-based access control at the database level
3. Database indexes that optimize query performance for common access patterns
4. TypeScript types generated from the schema for type-safe database queries
5. Documentation of the schema structure, relationships, and RLS policies

## Spec Documentation

- Tasks: @.agent-os/specs/2025-11-06-database-schema/tasks.md
- Technical Specification: @.agent-os/specs/2025-11-06-database-schema/sub-specs/technical-spec.md
- Database Schema: @.agent-os/specs/2025-11-06-database-schema/sub-specs/database-schema.md
