-- ============================================
-- SPECIAL NEEDS WORLD - SUPABASE DATABASE SETUP
-- ============================================
-- Run these queries in your Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- ============================================

-- ============================================
-- 1. PROFILES TABLE (extends Supabase Auth)
-- ============================================
-- This table stores additional user information beyond what Supabase Auth provides

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  is_guest BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'parent', 'caregiver', 'therapist', 'admin')),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================
-- 2. CUSTOM IMAGES TABLE (for Visual Schedule)
-- ============================================
-- Stores custom activity images uploaded by users

CREATE TABLE IF NOT EXISTS public.custom_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_id TEXT NOT NULL,
  name TEXT NOT NULL,
  image_url TEXT, -- For Supabase Storage URL
  image_data TEXT, -- For base64 data (fallback/migration)
  category TEXT DEFAULT 'custom',
  is_shared BOOLEAN DEFAULT false, -- If true, visible to all users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_custom_images_user_id ON public.custom_images(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_images_activity_id ON public.custom_images(activity_id);
CREATE INDEX IF NOT EXISTS idx_custom_images_category ON public.custom_images(category);

-- Enable RLS
ALTER TABLE public.custom_images ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own images" 
  ON public.custom_images FOR SELECT 
  USING (auth.uid() = user_id OR is_shared = true);

CREATE POLICY "Users can insert their own images" 
  ON public.custom_images FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images" 
  ON public.custom_images FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images" 
  ON public.custom_images FOR DELETE 
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_custom_images_updated_at
  BEFORE UPDATE ON public.custom_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================
-- 3. SCHEDULES TABLE (for Visual Schedule)
-- ============================================
-- Stores saved schedules with their items

CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Schedule',
  description TEXT,
  items JSONB NOT NULL DEFAULT '[]', -- Array of schedule items
  is_template BOOLEAN DEFAULT false,
  is_shared BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true, -- Currently active schedule
  schedule_type TEXT DEFAULT 'daily' CHECK (schedule_type IN ('daily', 'morning', 'afternoon', 'evening', 'weekend', 'custom')),
  color TEXT DEFAULT '#E63B2E',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON public.schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_is_active ON public.schedules(is_active);
CREATE INDEX IF NOT EXISTS idx_schedules_is_template ON public.schedules(is_template);

-- Enable RLS
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own schedules and shared templates" 
  ON public.schedules FOR SELECT 
  USING (auth.uid() = user_id OR (is_template = true AND is_shared = true));

CREATE POLICY "Users can insert their own schedules" 
  ON public.schedules FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedules" 
  ON public.schedules FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedules" 
  ON public.schedules FOR DELETE 
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON public.schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================
-- 4. AAC BOARDS TABLE (for Point to Talk)
-- ============================================
-- Stores custom AAC communication boards

CREATE TABLE IF NOT EXISTS public.aac_boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'custom',
  buttons JSONB NOT NULL DEFAULT '[]', -- Array of button objects {id, text, emoji, color, image_url}
  grid_size INTEGER DEFAULT 12, -- Number of buttons per page
  is_shared BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_aac_boards_user_id ON public.aac_boards(user_id);
CREATE INDEX IF NOT EXISTS idx_aac_boards_category ON public.aac_boards(category);
CREATE INDEX IF NOT EXISTS idx_aac_boards_is_shared ON public.aac_boards(is_shared);

-- Enable RLS
ALTER TABLE public.aac_boards ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own boards and shared boards" 
  ON public.aac_boards FOR SELECT 
  USING (auth.uid() = user_id OR is_shared = true);

CREATE POLICY "Users can insert their own boards" 
  ON public.aac_boards FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boards" 
  ON public.aac_boards FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own boards" 
  ON public.aac_boards FOR DELETE 
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_aac_boards_updated_at
  BEFORE UPDATE ON public.aac_boards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================
-- 5. AAC USAGE LOG (for tracking & learning)
-- ============================================
-- Optional: Track button usage for insights

CREATE TABLE IF NOT EXISTS public.aac_usage_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  board_id UUID REFERENCES public.aac_boards(id) ON DELETE SET NULL,
  button_id TEXT NOT NULL,
  button_text TEXT NOT NULL,
  context TEXT, -- e.g., 'home', 'school', 'therapy'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_aac_usage_user_id ON public.aac_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_aac_usage_created_at ON public.aac_usage_log(created_at);

-- Enable RLS
ALTER TABLE public.aac_usage_log ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own usage log" 
  ON public.aac_usage_log FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage log" 
  ON public.aac_usage_log FOR INSERT 
  WITH CHECK (auth.uid() = user_id);


-- ============================================
-- 6. SCHEDULE COMPLETIONS (progress tracking)
-- ============================================
-- Track daily schedule completions

CREATE TABLE IF NOT EXISTS public.schedule_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  schedule_id UUID REFERENCES public.schedules(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_items JSONB DEFAULT '[]', -- Array of completed item IDs
  total_items INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, schedule_id, date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_schedule_completions_user_id ON public.schedule_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_schedule_completions_date ON public.schedule_completions(date);

-- Enable RLS
ALTER TABLE public.schedule_completions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own completions" 
  ON public.schedule_completions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completions" 
  ON public.schedule_completions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own completions" 
  ON public.schedule_completions FOR UPDATE 
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_schedule_completions_updated_at
  BEFORE UPDATE ON public.schedule_completions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================
-- 7. USER PREFERENCES TABLE
-- ============================================
-- Stores app-specific user preferences

CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  
  -- Visual Schedule preferences
  schedule_default_view TEXT DEFAULT 'builder',
  schedule_sound_enabled BOOLEAN DEFAULT true,
  schedule_vibration_enabled BOOLEAN DEFAULT true,
  
  -- Point to Talk preferences
  aac_voice_rate DECIMAL(3,2) DEFAULT 0.9,
  aac_voice_pitch DECIMAL(3,2) DEFAULT 1.0,
  aac_voice_name TEXT,
  aac_button_size TEXT DEFAULT 'medium' CHECK (aac_button_size IN ('small', 'medium', 'large')),
  aac_show_text BOOLEAN DEFAULT true,
  
  -- General preferences
  theme TEXT DEFAULT 'default',
  font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
  high_contrast BOOLEAN DEFAULT false,
  reduce_motion BOOLEAN DEFAULT false,
  
  -- Notification preferences
  notifications_enabled BOOLEAN DEFAULT true,
  reminder_time TIME,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own preferences" 
  ON public.user_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
  ON public.user_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON public.user_preferences FOR UPDATE 
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================
-- 8. STORAGE BUCKETS SETUP
-- ============================================
-- Run these in the Supabase Dashboard > Storage > Create Bucket
-- Or use the SQL below:

-- Create bucket for custom images (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'custom-images',
  'custom-images',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for custom-images bucket
CREATE POLICY "Users can upload their own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'custom-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'custom-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'custom-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );


-- ============================================
-- 9. HELPFUL VIEWS
-- ============================================

-- View for user's schedule summary
CREATE OR REPLACE VIEW public.user_schedule_summary AS
SELECT 
  s.user_id,
  s.id as schedule_id,
  s.name,
  s.schedule_type,
  jsonb_array_length(s.items) as total_items,
  sc.date as last_completion_date,
  sc.completion_percentage as last_completion_percentage
FROM public.schedules s
LEFT JOIN LATERAL (
  SELECT date, completion_percentage 
  FROM public.schedule_completions 
  WHERE schedule_id = s.id 
  ORDER BY date DESC 
  LIMIT 1
) sc ON true
WHERE s.is_active = true;


-- ============================================
-- 10. SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment and run if you want sample shared templates

/*
-- Sample shared AAC board template
INSERT INTO public.aac_boards (user_id, name, category, buttons, is_shared, is_default)
SELECT 
  auth.uid(),
  'Basic Needs Template',
  'basic',
  '[
    {"id": "yes", "text": "Yes", "emoji": "✅", "color": "#5CB85C"},
    {"id": "no", "text": "No", "emoji": "❌", "color": "#E63B2E"},
    {"id": "help", "text": "Help me", "emoji": "🙋", "color": "#F5A623"},
    {"id": "more", "text": "More please", "emoji": "➕", "color": "#4A9FD4"},
    {"id": "stop", "text": "Stop", "emoji": "🛑", "color": "#E63B2E"},
    {"id": "bathroom", "text": "Bathroom", "emoji": "🚽", "color": "#8E6BBF"}
  ]'::jsonb,
  true,
  true
WHERE auth.uid() IS NOT NULL;
*/


-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the setup:

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'custom_images', 'schedules', 'aac_boards', 'aac_usage_log', 'schedule_completions', 'user_preferences');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check storage bucket exists
SELECT * FROM storage.buckets WHERE id = 'custom-images';
