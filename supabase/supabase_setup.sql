-- =============================================
-- SROUTE COMPLETE DATABASE SCHEMA FOR SUPABASE
-- Copy this ENTIRE file and paste into Supabase SQL Editor, then click Run.
-- =============================================

-- Step 1: Enable Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 2: Clean up any previous runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_review_changed ON public.reviews;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.recalculate_place_rating() CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.bookmarks CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.place_embeddings CASCADE;
DROP TABLE IF EXISTS public.authenticity_scores CASCADE;
DROP TABLE IF EXISTS public.itineraries CASCADE;
DROP TABLE IF EXISTS public.trips CASCADE;
DROP TABLE IF EXISTS public.places CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TYPE IF EXISTS place_category CASCADE;
DROP TYPE IF EXISTS trip_status CASCADE;
DROP TYPE IF EXISTS itinerary_activity_type CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;

-- Step 3: Create Enums
CREATE TYPE place_category AS ENUM ('restaurant', 'hotel', 'attraction', 'cafe', 'bar', 'museum', 'park', 'shopping');
CREATE TYPE trip_status AS ENUM ('planning', 'active', 'completed', 'cancelled');
CREATE TYPE itinerary_activity_type AS ENUM ('visit', 'transit', 'meal', 'accommodation', 'activity');
CREATE TYPE notification_type AS ENUM ('review_reply', 'trip_shared', 'place_recommendation', 'system', 'bookmark_update');

-- Step 4: Create Tables
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  bio text,
  home_location geography(Point, 4326),
  travel_preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.places (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category place_category NOT NULL,
  location geography(Point, 4326),
  address text,
  city text,
  country text,
  phone text,
  website text,
  price_level integer CHECK (price_level >= 1 AND price_level <= 4),
  opening_hours jsonb,
  images text[] DEFAULT '{}'::text[],
  average_rating numeric(3,2) DEFAULT 0.00,
  review_count integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.trips (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  start_date date,
  end_date date,
  status trip_status DEFAULT 'planning',
  cover_image_url text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.itineraries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id uuid REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  place_id uuid REFERENCES public.places(id) ON DELETE SET NULL,
  day_number integer NOT NULL CHECK (day_number > 0),
  position integer NOT NULL CHECK (position >= 0),
  title text NOT NULL,
  notes text,
  start_time time,
  end_time time,
  type itinerary_activity_type DEFAULT 'visit',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.authenticity_scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id uuid REFERENCES public.places(id) ON DELETE CASCADE UNIQUE NOT NULL,
  overall_score numeric(5,2) DEFAULT 0.00 CHECK (overall_score >= 0 AND overall_score <= 100),
  local_ratio numeric(5,2) DEFAULT 0.00,
  sentiment_score numeric(5,2) DEFAULT 0.00,
  price_anomaly_score numeric(5,2) DEFAULT 0.00,
  repeat_visitor_ratio numeric(5,2) DEFAULT 0.00,
  red_flags text[] DEFAULT '{}'::text[],
  good_signs text[] DEFAULT '{}'::text[],
  data_sources jsonb DEFAULT '{}'::jsonb,
  last_calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.place_embeddings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id uuid REFERENCES public.places(id) ON DELETE CASCADE UNIQUE NOT NULL,
  embedding vector(384) NOT NULL,
  content_hash text,
  model_name text DEFAULT 'all-MiniLM-L6-v2',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  place_id uuid REFERENCES public.places(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text,
  visit_date date,
  images text[] DEFAULT '{}'::text[],
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, place_id)
);

CREATE TABLE public.bookmarks (
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  place_id uuid REFERENCES public.places(id) ON DELETE CASCADE NOT NULL,
  collection text DEFAULT 'default',
  notes text,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, place_id)
);

CREATE TABLE public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  type notification_type NOT NULL,
  title text NOT NULL,
  body text,
  data jsonb DEFAULT '{}'::jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Step 5: Create Indexes
CREATE INDEX idx_places_location ON public.places USING gist (location);
CREATE INDEX idx_place_embeddings_hnsw ON public.place_embeddings USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_itineraries_trip_id ON public.itineraries(trip_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_place_id ON public.reviews(place_id);
CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX idx_notifications_recipient_id ON public.notifications(recipient_id);
CREATE INDEX idx_notifications_unread ON public.notifications(recipient_id) WHERE is_read = false;

-- Step 6: Create Functions & Triggers
CREATE OR REPLACE FUNCTION public.recalculate_place_rating()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  UPDATE public.places SET
    average_rating = COALESCE((SELECT avg(rating)::numeric(3,2) FROM public.reviews WHERE place_id = COALESCE(NEW.place_id, OLD.place_id)), 0.00),
    review_count = COALESCE((SELECT count(*) FROM public.reviews WHERE place_id = COALESCE(NEW.place_id, OLD.place_id)), 0)
  WHERE id = COALESCE(NEW.place_id, OLD.place_id);
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_review_changed AFTER INSERT OR UPDATE OR DELETE ON public.reviews FOR EACH ROW EXECUTE PROCEDURE public.recalculate_place_rating();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Step 7: Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authenticity_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS Policies
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "places_select" ON public.places FOR SELECT USING (true);
CREATE POLICY "trips_select" ON public.trips FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "trips_insert" ON public.trips FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trips_update" ON public.trips FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "trips_delete" ON public.trips FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "itineraries_select" ON public.itineraries FOR SELECT USING ((SELECT is_public OR user_id = auth.uid() FROM public.trips WHERE id = trip_id));
CREATE POLICY "itineraries_insert" ON public.itineraries FOR INSERT TO authenticated WITH CHECK ((SELECT user_id = auth.uid() FROM public.trips WHERE id = trip_id));
CREATE POLICY "itineraries_update" ON public.itineraries FOR UPDATE TO authenticated USING ((SELECT user_id = auth.uid() FROM public.trips WHERE id = trip_id));
CREATE POLICY "itineraries_delete" ON public.itineraries FOR DELETE TO authenticated USING ((SELECT user_id = auth.uid() FROM public.trips WHERE id = trip_id));
CREATE POLICY "auth_scores_select" ON public.authenticity_scores FOR SELECT USING (true);
CREATE POLICY "reviews_select" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "bookmarks_all" ON public.bookmarks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_all" ON public.notifications FOR ALL TO authenticated USING (auth.uid() = recipient_id) WITH CHECK (auth.uid() = recipient_id);

-- Step 9: Seed test profile
INSERT INTO public.profiles (id, username, full_name, avatar_url, travel_preferences)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'testdeveloper',
  'Test Developer',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  '{"style": "cultural-adventure", "budget": 100}'::jsonb
) ON CONFLICT (id) DO NOTHING;
