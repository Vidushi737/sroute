-- Supabase PostgreSQL Migration: Initial Schema Setup
-- Timestamp: 20260626000000_schema.sql

-- Enable required extensions
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not enable uuid-ossp extension: %', SQLERRM;
END;
$$;

DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS postgis;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not enable postgis extension: %', SQLERRM;
END;
$$;

DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS vector;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not enable vector extension: %', SQLERRM;
END;
$$;

-- Ensure auth schema and auth.users exist for local dev environments
DO $$
BEGIN
  CREATE SCHEMA IF NOT EXISTS auth;
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'Skipping auth schema creation due to insufficient privilege.';
END;
$$;

DO $$
BEGIN
  CREATE TABLE IF NOT EXISTS auth.users (
    id uuid primary key default gen_random_uuid(),
    email text,
    raw_user_meta_data jsonb
  );
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'Skipping auth.users table creation due to insufficient privilege.';
END;
$$;

-- Drop existing tables/types if they exist to start clean
DO $$
BEGIN
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Skipping drop trigger on auth.users: %', SQLERRM;
END;
$$;
drop function if exists public.handle_new_user();
drop table if exists public.notifications cascade;
drop table if exists public.bookmarks cascade;
drop table if exists public.reviews cascade;
drop table if exists public.place_embeddings cascade;
drop table if exists public.authenticity_scores cascade;
drop table if exists public.itineraries cascade;
drop table if exists public.trips cascade;
drop table if exists public.places cascade;
drop table if exists public.profiles cascade;
drop type if exists place_category cascade;
drop type if exists trip_status cascade;
drop type if exists itinerary_activity_type cascade;
drop type if exists notification_type cascade;

-- Create Enums
create type place_category as enum ('restaurant', 'hotel', 'attraction', 'cafe', 'bar', 'museum', 'park', 'shopping');
create type trip_status as enum ('planning', 'active', 'completed', 'cancelled');
create type itinerary_activity_type as enum ('visit', 'transit', 'meal', 'accommodation', 'activity');
create type notification_type as enum ('review_reply', 'trip_shared', 'place_recommendation', 'system', 'bookmark_update');

-- 1. Profiles Table (linked to Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  home_location geography(Point, 4326),
  travel_preferences jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Places Table
create table public.places (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category place_category not null,
  location geography(Point, 4326),
  address text,
  city text,
  country text,
  phone text,
  website text,
  price_level integer check (price_level >= 1 and price_level <= 4),
  opening_hours jsonb,
  images text[] default '{}'::text[],
  average_rating numeric(3,2) default 0.00,
  review_count integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Trips Table
create table public.trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  start_date date,
  end_date date,
  status trip_status default 'planning',
  cover_image_url text,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Itinerary Stops Table
create table public.itineraries (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  place_id uuid references public.places(id) on delete set null,
  day_number integer not null check (day_number > 0),
  position integer not null check (position >= 0),
  title text not null,
  notes text,
  start_time time,
  end_time time,
  type itinerary_activity_type default 'visit',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 5. Authenticity Scores Table
create table public.authenticity_scores (
  id uuid default gen_random_uuid() primary key,
  place_id uuid references public.places(id) on delete cascade unique not null,
  overall_score numeric(5,2) default 0.00 check (overall_score >= 0 and overall_score <= 100),
  local_ratio numeric(5,2) default 0.00,
  sentiment_score numeric(5,2) default 0.00,
  price_anomaly_score numeric(5,2) default 0.00,
  repeat_visitor_ratio numeric(5,2) default 0.00,
  red_flags text[] default '{}'::text[],
  good_signs text[] default '{}'::text[],
  data_sources jsonb default '{}'::jsonb,
  last_calculated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 6. Place Embeddings Table (pgvector)
create table public.place_embeddings (
  id uuid default gen_random_uuid() primary key,
  place_id uuid references public.places(id) on delete cascade unique not null,
  embedding vector(384) not null, -- Dimension matches all-MiniLM-L6-v2 (384)
  content_hash text,
  model_name text default 'all-MiniLM-L6-v2',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. Reviews Table
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  place_id uuid references public.places(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  content text,
  visit_date date,
  images text[] default '{}'::text[],
  helpful_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, place_id)
);

-- 8. Bookmarks Table
create table public.bookmarks (
  user_id uuid references public.profiles(id) on delete cascade not null,
  place_id uuid references public.places(id) on delete cascade not null,
  collection text default 'default',
  notes text,
  created_at timestamptz default now(),
  primary key (user_id, place_id)
);

-- 9. Notifications Table
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  actor_id uuid references public.profiles(id) on delete set null,
  type notification_type not null,
  title text not null,
  body text,
  data jsonb default '{}'::jsonb,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- =========================================
-- INDEXES & PERFORMANCE OPTIMIZATIONS
-- =========================================

-- Geospatial Index for Spatial Queries (Map and radius search)
create index idx_places_location on public.places using gist (location);

-- HNSW Vector Index for Semantic Similarities
create index idx_place_embeddings_hnsw
  on public.place_embeddings
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- Foreign Key Indexes for fast RLS Policy evaluation and joins
create index idx_trips_user_id on public.trips(user_id);
create index idx_itineraries_trip_id on public.itineraries(trip_id);
create index idx_reviews_user_id on public.reviews(user_id);
create index idx_reviews_place_id on public.reviews(place_id);
create index idx_bookmarks_user_id on public.bookmarks(user_id);
create index idx_notifications_recipient_id on public.notifications(recipient_id);
create index idx_notifications_unread on public.notifications(recipient_id) where is_read = false;

-- =========================================
-- TRIGGERS & FUNCTIONS
-- =========================================

-- Auto-Sync Auth User to public.profiles on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public, pg_catalog
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

DO $$
BEGIN
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Skipping create trigger on auth.users: %', SQLERRM;
END;
$$;

-- Trigger to recalculate ratings averages when a review is added, updated, or deleted
create or replace function public.recalculate_place_rating()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  target_place_id uuid;
begin
  if (tg_op = 'DELETE') then
    target_place_id := old.place_id;
  else
    target_place_id := new.place_id;
  end if;

  update public.places
  set 
    average_rating = coalesce((select avg(rating)::numeric(3,2) from public.reviews where place_id = target_place_id), 0.00),
    review_count = coalesce((select count(*) from public.reviews where place_id = target_place_id), 0)
  where id = target_place_id;

  return null;
end;
$$;

create trigger on_review_changed
  after insert or update or delete on public.reviews
  for each row execute procedure public.recalculate_place_rating();

-- =========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================

alter table public.profiles enable row level security;
alter table public.places enable row level security;
alter table public.trips enable row level security;
alter table public.itineraries enable row level security;
alter table public.authenticity_scores enable row level security;
alter table public.place_embeddings enable row level security;
alter table public.reviews enable row level security;
alter table public.bookmarks enable row level security;
alter table public.notifications enable row level security;

-- Profiles: Public can read all, owner can update
create policy "Allow public read access to profiles" on public.profiles for select using (true);
create policy "Allow users to update their own profile" on public.profiles for update to authenticated using (auth.uid() = id);

-- Places: Anyone can view places
create policy "Allow public read access to places" on public.places for select using (true);

-- Trips: Owner can do all, public can read if is_public = true
create policy "Allow read access to public/own trips" on public.trips for select using (is_public = true or (auth.uid() = user_id));
create policy "Allow authenticated users to create trips" on public.trips for insert to authenticated with check (auth.uid() = user_id);
create policy "Allow users to update their own trips" on public.trips for update to authenticated using (auth.uid() = user_id);
create policy "Allow users to delete their own trips" on public.trips for delete to authenticated using (auth.uid() = user_id);

-- Itineraries: Link access to Trip ownership
create policy "Allow read access to itineraries of public/own trips" on public.itineraries for select
  using ((select is_public or user_id = auth.uid() from public.trips where id = trip_id));
create policy "Allow users to insert itinerary stops" on public.itineraries for insert to authenticated
  with check ((select user_id = auth.uid() from public.trips where id = trip_id));
create policy "Allow users to update their itinerary stops" on public.itineraries for update to authenticated
  using ((select user_id = auth.uid() from public.trips where id = trip_id));
create policy "Allow users to delete their itinerary stops" on public.itineraries for delete to authenticated
  using ((select user_id = auth.uid() from public.trips where id = trip_id));

-- Authenticity Scores: Public read
create policy "Allow public read access to authenticity scores" on public.authenticity_scores for select using (true);

-- Reviews: Public read, authenticated create/update/delete own
create policy "Allow public read access to reviews" on public.reviews for select using (true);
create policy "Allow authenticated to write reviews" on public.reviews for insert to authenticated with check (auth.uid() = user_id);
create policy "Allow users to edit their reviews" on public.reviews for update to authenticated using (auth.uid() = user_id);
create policy "Allow users to delete their reviews" on public.reviews for delete to authenticated using (auth.uid() = user_id);

-- Bookmarks: Private to user
create policy "Allow users to manage own bookmarks" on public.bookmarks for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Notifications: Private to recipient
create policy "Allow users to manage own notifications" on public.notifications for all to authenticated
  using (auth.uid() = recipient_id) with check (auth.uid() = recipient_id);
