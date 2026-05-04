-- TripMate Database Schema
-- Run this in your Supabase SQL Editor

-- =============================================
-- Users table (extends Supabase auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Destinations (seed data + user-added)
-- =============================================
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  country TEXT,
  category TEXT CHECK (category IN ('beach','mountain','camping','heritage','city')),
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  unsplash_query TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Favourites
-- =============================================
CREATE TABLE IF NOT EXISTS public.favourites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, destination_id)
);

-- =============================================
-- Trips
-- =============================================
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id),
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  num_people INTEGER DEFAULT 1,
  budget DECIMAL(12,2),
  activities TEXT[],
  notes TEXT,
  status TEXT CHECK (status IN ('planned','active','completed')) DEFAULT 'planned',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Groups
-- =============================================
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trip_id UUID REFERENCES public.trips(id),
  destination TEXT,
  start_date DATE,
  end_date DATE,
  group_type TEXT DEFAULT 'on-app',
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Group Members
-- =============================================
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  name TEXT NOT NULL,
  mobile TEXT,
  email TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Expenses
-- =============================================
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id),
  total_budget DECIMAL(12,2),
  total_spent DECIMAL(12,2) DEFAULT 0,
  num_people INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Expense Items
-- =============================================
CREATE TABLE IF NOT EXISTS public.expense_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID REFERENCES public.expenses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category TEXT CHECK (category IN ('transport','food','stay','activities','shopping','medical'))
);

-- =============================================
-- Row Level Security
-- =============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public destinations read" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Authenticated insert destinations" ON public.destinations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users manage own profile" ON public.users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users read all profiles" ON public.users FOR SELECT USING (true);

CREATE POLICY "Users manage own favourites" ON public.favourites FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own trips" ON public.trips FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users read all trips" ON public.trips FOR SELECT USING (true);

CREATE POLICY "Users manage own groups" ON public.groups FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Users read all groups" ON public.groups FOR SELECT USING (true);

CREATE POLICY "Group members visible to all" ON public.group_members FOR SELECT USING (true);
CREATE POLICY "Authenticated manage group members" ON public.group_members FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated manage expenses" ON public.expenses FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated manage expense items" ON public.expense_items FOR ALL USING (auth.uid() IS NOT NULL);

-- =============================================
-- Seed Featured Destinations
-- =============================================
INSERT INTO public.destinations (name, location, country, category, lat, lng, unsplash_query, is_featured)
VALUES
  ('Taj Mahal', 'Agra, Uttar Pradesh', 'India', 'heritage', 27.1751, 78.0421, 'taj mahal', true),
  ('Goa Beaches', 'Goa', 'India', 'beach', 15.2993, 74.1240, 'goa beach', true),
  ('Manali', 'Himachal Pradesh', 'India', 'mountain', 32.2396, 77.1887, 'manali mountains', true),
  ('Jaipur', 'Rajasthan', 'India', 'heritage', 26.9124, 75.7873, 'jaipur palace', true),
  ('Bali', 'Indonesia', 'Indonesia', 'beach', -8.3405, 115.0920, 'bali temple', true),
  ('Santorini', 'Greece', 'Greece', 'city', 36.3932, 25.4615, 'santorini', true),
  ('Kashmir', 'Jammu & Kashmir', 'India', 'mountain', 34.0837, 74.7973, 'kashmir valley', true),
  ('Kerala Backwaters', 'Kerala', 'India', 'beach', 9.4981, 76.3388, 'kerala backwaters', true)
ON CONFLICT DO NOTHING;
