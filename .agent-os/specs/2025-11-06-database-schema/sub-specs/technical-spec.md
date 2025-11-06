# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-11-06-database-schema/spec.md

> Created: 2025-11-06
> Version: 1.0.0

## Technical Requirements

### Schema Design Principles

- Use UUID primary keys for all tables (Supabase generates these by default)
- Include `created_at` and `updated_at` timestamps on all tables
- Use foreign key constraints with appropriate CASCADE/RESTRICT behavior
- Leverage PostgreSQL enums for status and role fields
- Use TIMESTAMPTZ for all timestamp fields to handle timezones correctly
- Follow Supabase naming conventions (snake_case for tables and columns)

### Row Level Security Strategy

- Enable RLS on ALL tables
- Create policies that reference `auth.uid()` for user-based access control
- Implement role-based policies using event_participants table
- Default deny all access, then explicitly grant permissions
- Separate policies for SELECT, INSERT, UPDATE, DELETE operations
- Use security definer functions where complex authorization logic is needed

### Supabase-Specific Features

- Leverage `auth.users` table for user authentication (no custom users table needed)
- Create `profiles` table that extends auth.users with additional user data
- Use Supabase Realtime subscriptions for timeline updates
- Enable realtime on events and timeline_items tables
- Use Supabase's automatic `created_at` and `updated_at` triggers

### Data Types and Constraints

- UUIDs for all primary keys and foreign keys
- TEXT for variable-length strings (names, descriptions)
- TIMESTAMPTZ for dates and times
- ENUM types for fixed sets of values (roles, statuses, categories)
- NOT NULL constraints on required fields
- CHECK constraints for data validation (e.g., end_time > start_time)

## Approach Options

**Option A: Denormalized Schema**
- Pros: Faster reads, simpler queries, fewer joins
- Cons: Data redundancy, harder to maintain consistency, more storage

**Option B: Normalized Schema with Explicit Relationships**
- Pros: Data integrity, no redundancy, flexible queries, easier to extend
- Cons: More joins required, slightly more complex queries, multiple tables

**Selected Approach: Option B (Normalized Schema)**

**Rationale:** Timeline is a collaborative platform where data relationships are critical (users-events, events-timeline items, users-teams). Normalized design ensures data integrity, makes it easier to implement RLS policies at the relationship level, and provides flexibility for future features. PostgreSQL handles joins efficiently, and Supabase provides excellent query optimization. The slight complexity in queries is worth the benefits of data integrity and maintainability.

## Database Schema

### Core Tables

#### profiles
Extends Supabase auth.users with additional user profile information.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**
- Users can read their own profile
- Users can update their own profile
- Event participants can read profiles of other participants in shared events

#### events
Main event entity containing event metadata.

```sql
CREATE TYPE event_status AS ENUM ('draft', 'scheduled', 'live', 'completed', 'cancelled');

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  status event_status DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**
- Users can read events they're participants in
- Event coordinators can create events
- Event owners and coordinators can update events
- Only event owners can delete events

#### timeline_items
Individual items on an event timeline.

```sql
CREATE TYPE timeline_item_category AS ENUM (
  'setup',
  'performance',
  'catering',
  'breakdown',
  'general'
);

CREATE TABLE timeline_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  category timeline_item_category DEFAULT 'general',
  assigned_to UUID[] DEFAULT '{}',  -- Array of profile UUIDs
  order_index INT NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT end_time_after_start_time CHECK (end_time IS NULL OR end_time > start_time)
);
```

**RLS Policies:**
- Users can read timeline items for events they participate in
- Coordinators and owners can create/update/delete timeline items
- Vendors can update items they're assigned to (status updates only - future feature)

#### event_participants
Join table linking users to events with roles.

```sql
CREATE TYPE participant_role AS ENUM ('owner', 'coordinator', 'vendor', 'viewer');

CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role participant_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(event_id, user_id)
);
```

**RLS Policies:**
- Users can read their own participation records
- Event owners and coordinators can manage participants
- Cannot remove the event owner

### Indexes

```sql
-- Foreign key indexes for join performance
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_timeline_items_event_id ON timeline_items(event_id);
CREATE INDEX idx_timeline_items_created_by ON timeline_items(created_by);
CREATE INDEX idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX idx_event_participants_user_id ON event_participants(user_id);

-- Query optimization indexes
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_timeline_items_start_time ON timeline_items(start_time);
CREATE INDEX idx_timeline_items_order_index ON timeline_items(event_id, order_index);
```

### Realtime Configuration

```sql
-- Enable realtime on tables that need live updates
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE timeline_items;
ALTER PUBLICATION supabase_realtime ADD TABLE event_participants;
```

## Implementation Details

### Migration Strategy

1. Create enums first (they're dependencies for tables)
2. Create profiles table (extends auth.users)
3. Create events table
4. Create timeline_items table
5. Create event_participants table
6. Create all indexes
7. Enable RLS on all tables
8. Create RLS policies
9. Enable realtime on relevant tables

### RLS Policy Patterns

**Profile Access:**
```sql
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

**Event Access:**
```sql
-- Users can read events they participate in
CREATE POLICY "Users can read events they participate in"
  ON events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM event_participants
      WHERE event_participants.event_id = events.id
      AND event_participants.user_id = auth.uid()
    )
  );

-- Coordinators can create events
CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = created_by);
```

### TypeScript Type Generation

Use Supabase CLI to generate TypeScript types:

```bash
npx supabase gen types typescript --project-id <project-id> > types/database.ts
```

This will create type-safe interfaces for all tables, enums, and relationships.

## Success Criteria

- All tables created successfully with proper constraints
- RLS policies prevent unauthorized data access
- Queries perform efficiently with appropriate indexes
- TypeScript types generated and imported in codebase
- Realtime subscriptions work for timeline updates
- Migration can be safely rolled back if needed
