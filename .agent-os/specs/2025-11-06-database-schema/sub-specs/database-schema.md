# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-11-06-database-schema/spec.md

> Created: 2025-11-06
> Version: 1.0.0

## Migration Script

This migration creates all core tables, enums, indexes, RLS policies, and enables realtime subscriptions.

```sql
-- =====================================================
-- TIMELINE DATABASE SCHEMA
-- Version: 1.0.0
-- Description: Core schema for Timeline event coordination platform
-- =====================================================

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE event_status AS ENUM (
  'draft',
  'scheduled',
  'live',
  'completed',
  'cancelled'
);

CREATE TYPE participant_role AS ENUM (
  'owner',
  'coordinator',
  'vendor',
  'viewer'
);

CREATE TYPE timeline_item_category AS ENUM (
  'setup',
  'performance',
  'catering',
  'breakdown',
  'general'
);

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles table extends Supabase auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users with additional metadata';

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  status event_status DEFAULT 'draft' NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE events IS 'Events that can have multiple timeline items and participants';

-- Timeline items table
CREATE TABLE timeline_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  category timeline_item_category DEFAULT 'general' NOT NULL,
  assigned_to UUID[] DEFAULT '{}' NOT NULL,
  order_index INT DEFAULT 0 NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT end_time_after_start_time CHECK (end_time IS NULL OR end_time > start_time)
);

COMMENT ON TABLE timeline_items IS 'Individual timeline items belonging to events';
COMMENT ON COLUMN timeline_items.assigned_to IS 'Array of profile UUIDs assigned to this timeline item';
COMMENT ON COLUMN timeline_items.order_index IS 'Display order within the event timeline';

-- Event participants table (join table)
CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role participant_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(event_id, user_id)
);

COMMENT ON TABLE event_participants IS 'Links users to events with specific roles';

-- =====================================================
-- INDEXES
-- =====================================================

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

-- Composite index for event participant role lookups
CREATE INDEX idx_event_participants_event_user_role ON event_participants(event_id, user_id, role);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read profiles of event co-participants"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM event_participants ep1
      JOIN event_participants ep2 ON ep1.event_id = ep2.event_id
      WHERE ep1.user_id = auth.uid()
      AND ep2.user_id = profiles.id
    )
  );

-- =====================================================
-- EVENTS POLICIES
-- =====================================================

CREATE POLICY "Users can read events they participate in"
  ON events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM event_participants
      WHERE event_participants.event_id = events.id
      AND event_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Event owners and coordinators can update events"
  ON events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM event_participants
      WHERE event_participants.event_id = events.id
      AND event_participants.user_id = auth.uid()
      AND event_participants.role IN ('owner', 'coordinator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM event_participants
      WHERE event_participants.event_id = events.id
      AND event_participants.user_id = auth.uid()
      AND event_participants.role IN ('owner', 'coordinator')
    )
  );

CREATE POLICY "Only event owners can delete events"
  ON events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM event_participants
      WHERE event_participants.event_id = events.id
      AND event_participants.user_id = auth.uid()
      AND event_participants.role = 'owner'
    )
  );

-- =====================================================
-- TIMELINE ITEMS POLICIES
-- =====================================================

CREATE POLICY "Users can read timeline items for events they participate in"
  ON timeline_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM event_participants
      WHERE event_participants.event_id = timeline_items.event_id
      AND event_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Event owners and coordinators can create timeline items"
  ON timeline_items FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM event_participants
      WHERE event_participants.event_id = timeline_items.event_id
      AND event_participants.user_id = auth.uid()
      AND event_participants.role IN ('owner', 'coordinator')
    )
  );

CREATE POLICY "Event owners and coordinators can update timeline items"
  ON timeline_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM event_participants
      WHERE event_participants.event_id = timeline_items.event_id
      AND event_participants.user_id = auth.uid()
      AND event_participants.role IN ('owner', 'coordinator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM event_participants
      WHERE event_participants.event_id = timeline_items.event_id
      AND event_participants.user_id = auth.uid()
      AND event_participants.role IN ('owner', 'coordinator')
    )
  );

CREATE POLICY "Event owners and coordinators can delete timeline items"
  ON timeline_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM event_participants
      WHERE event_participants.event_id = timeline_items.event_id
      AND event_participants.user_id = auth.uid()
      AND event_participants.role IN ('owner', 'coordinator')
    )
  );

-- =====================================================
-- EVENT PARTICIPANTS POLICIES
-- =====================================================

CREATE POLICY "Users can read their own participation records"
  ON event_participants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read participants of events they participate in"
  ON event_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM event_participants ep
      WHERE ep.event_id = event_participants.event_id
      AND ep.user_id = auth.uid()
    )
  );

CREATE POLICY "Event owners and coordinators can add participants"
  ON event_participants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM event_participants
      WHERE event_participants.event_id = event_participants.event_id
      AND event_participants.user_id = auth.uid()
      AND event_participants.role IN ('owner', 'coordinator')
    )
  );

CREATE POLICY "Event owners and coordinators can update participants"
  ON event_participants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM event_participants ep
      WHERE ep.event_id = event_participants.event_id
      AND ep.user_id = auth.uid()
      AND ep.role IN ('owner', 'coordinator')
    )
  )
  WITH CHECK (
    -- Cannot change the owner role
    event_participants.role != 'owner'
    AND EXISTS (
      SELECT 1 FROM event_participants ep
      WHERE ep.event_id = event_participants.event_id
      AND ep.user_id = auth.uid()
      AND ep.role IN ('owner', 'coordinator')
    )
  );

CREATE POLICY "Event owners and coordinators can remove participants"
  ON event_participants FOR DELETE
  USING (
    -- Cannot remove the owner
    event_participants.role != 'owner'
    AND EXISTS (
      SELECT 1 FROM event_participants ep
      WHERE ep.event_id = event_participants.event_id
      AND ep.user_id = auth.uid()
      AND ep.role IN ('owner', 'coordinator')
    )
  );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timeline_items_updated_at
  BEFORE UPDATE ON timeline_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically add creator as event owner
CREATE OR REPLACE FUNCTION add_event_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO event_participants (event_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_event_owner_trigger
  AFTER INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION add_event_owner();

-- Function to handle profile creation when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- REALTIME
-- =====================================================

-- Enable realtime on tables that need live updates
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE timeline_items;
ALTER PUBLICATION supabase_realtime ADD TABLE event_participants;
```

## Schema Diagram

```
┌─────────────┐
│ auth.users  │
│ (Supabase)  │
└──────┬──────┘
       │
       │ 1:1
       ▼
┌─────────────┐
│  profiles   │
│─────────────│
│ id (PK)     │◄────┐
│ email       │     │
│ full_name   │     │
│ avatar_url  │     │
└─────────────┘     │
                    │
       ┌────────────┤
       │            │
       │ created_by │
       ▼            │
┌──────────────┐    │
│   events     │    │
│──────────────│    │
│ id (PK)      │◄───┼──┐
│ name         │    │  │
│ description  │    │  │
│ event_date   │    │  │
│ location     │    │  │
│ status       │    │  │
│ created_by   │────┘  │
└──────┬───────┘       │
       │               │
       │ 1:N           │
       ▼               │
┌──────────────┐       │
│timeline_items│       │
│──────────────│       │
│ id (PK)      │       │
│ event_id(FK) │───────┘
│ title        │
│ description  │
│ start_time   │
│ end_time     │
│ category     │
│ assigned_to[]│
│ order_index  │
│ created_by   │────┐
└──────────────┘    │
                    │
       ┌────────────┘
       │
       ▼
┌──────────────────┐
│event_participants│
│──────────────────│
│ id (PK)          │
│ event_id (FK)    │───┐
│ user_id (FK)     │───┼──┐
│ role             │   │  │
└──────────────────┘   │  │
       │               │  │
       └───────────────┘  │
                          │
                          └─────► profiles.id
```

## Rollback Script

```sql
-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS add_event_owner_trigger ON events;
DROP TRIGGER IF EXISTS update_timeline_items_updated_at ON timeline_items;
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS add_event_owner();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Remove from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS event_participants;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS timeline_items;
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS events;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS event_participants CASCADE;
DROP TABLE IF EXISTS timeline_items CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop enums
DROP TYPE IF EXISTS timeline_item_category;
DROP TYPE IF EXISTS participant_role;
DROP TYPE IF EXISTS event_status;
```

## Testing Queries

```sql
-- Test profile creation
SELECT * FROM profiles WHERE id = auth.uid();

-- Test event creation with auto-owner assignment
INSERT INTO events (name, event_date, created_by)
VALUES ('Test Event', NOW() + INTERVAL '1 day', auth.uid())
RETURNING *;

-- Verify owner was added automatically
SELECT * FROM event_participants WHERE event_id = '<event-id>';

-- Test timeline item creation
INSERT INTO timeline_items (
  event_id,
  title,
  start_time,
  category,
  created_by
) VALUES (
  '<event-id>',
  'Setup Stage',
  NOW() + INTERVAL '1 day',
  'setup',
  auth.uid()
)
RETURNING *;

-- Test RLS: Verify users can only see their events
SELECT * FROM events;

-- Test realtime subscription
-- (In application code, subscribe to changes on events table)
```
