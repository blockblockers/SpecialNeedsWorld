-- =====================================================
-- SPECIAL NEEDS WORLD - SYNC & NOTIFICATIONS SCHEMA
-- =====================================================
-- Run this in Supabase SQL Editor
-- Adds: calendar schedules, AAC customizations, push subscriptions

-- =====================================================
-- 1. CALENDAR SCHEDULES (Visual Schedule sync)
-- =====================================================

CREATE TABLE IF NOT EXISTS calendar_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Schedule',
  activities JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Each user can have one schedule per date
  UNIQUE(user_id, schedule_date)
);

-- Activities JSONB structure:
-- [
--   {
--     "id": "wake-up-1234567890",
--     "activityId": "wake-up",
--     "name": "Wake Up",
--     "color": "#FCE94F",
--     "time": "07:00",
--     "completed": false,
--     "notify": true,
--     "customImage": null or "base64 string or URL"
--   }
-- ]

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_calendar_schedules_user_date 
  ON calendar_schedules(user_id, schedule_date);

CREATE INDEX IF NOT EXISTS idx_calendar_schedules_date 
  ON calendar_schedules(schedule_date);

-- RLS Policies
ALTER TABLE calendar_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own schedules"
  ON calendar_schedules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules"
  ON calendar_schedules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules"
  ON calendar_schedules FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules"
  ON calendar_schedules FOR DELETE
  USING (auth.uid() = user_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_calendar_schedule_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calendar_schedules_updated
  BEFORE UPDATE ON calendar_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_schedule_timestamp();


-- =====================================================
-- 2. AAC CUSTOMIZATIONS (Point to Talk sync)
-- =====================================================

CREATE TABLE IF NOT EXISTS aac_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  button_id TEXT NOT NULL,
  custom_image TEXT, -- base64 or URL
  custom_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Each user can have one customization per button
  UNIQUE(user_id, button_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_aac_customizations_user 
  ON aac_customizations(user_id);

-- RLS Policies
ALTER TABLE aac_customizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AAC customizations"
  ON aac_customizations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AAC customizations"
  ON aac_customizations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AAC customizations"
  ON aac_customizations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own AAC customizations"
  ON aac_customizations FOR DELETE
  USING (auth.uid() = user_id);

-- Updated at trigger
CREATE TRIGGER aac_customizations_updated
  BEFORE UPDATE ON aac_customizations
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_schedule_timestamp();


-- =====================================================
-- 3. PUSH SUBSCRIPTIONS (Web Push)
-- =====================================================

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,  -- Public key
  auth TEXT NOT NULL,     -- Auth secret
  device_name TEXT,       -- Optional device identifier
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One subscription per endpoint per user
  UNIQUE(user_id, endpoint)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user 
  ON push_subscriptions(user_id);

-- RLS Policies
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own push subscriptions"
  ON push_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own push subscriptions"
  ON push_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own push subscriptions"
  ON push_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own push subscriptions"
  ON push_subscriptions FOR DELETE
  USING (auth.uid() = user_id);


-- =====================================================
-- 4. SCHEDULED NOTIFICATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS scheduled_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES calendar_schedules(id) ON DELETE CASCADE,
  activity_index INTEGER,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- pending, sent, failed, cancelled
  repeat_until_complete BOOLEAN DEFAULT FALSE,
  repeat_interval_minutes INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for the cron job
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_pending 
  ON scheduled_notifications(scheduled_for, status) 
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_user 
  ON scheduled_notifications(user_id);

-- RLS Policies
ALTER TABLE scheduled_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON scheduled_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications"
  ON scheduled_notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON scheduled_notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON scheduled_notifications FOR DELETE
  USING (auth.uid() = user_id);


-- =====================================================
-- 5. NOTIFICATION SETTINGS
-- =====================================================

CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  global_enabled BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{
    "visualSchedule": {"enabled": true, "reminderMinutes": [5], "repeatInterval": 5},
    "nutrition": {"enabled": true, "reminderMinutes": [5]},
    "health": {"enabled": true, "reminderMinutes": [5]},
    "pointToTalk": {"enabled": false}
  }',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification settings"
  ON notification_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification settings"
  ON notification_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification settings"
  ON notification_settings FOR UPDATE
  USING (auth.uid() = user_id);


-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

-- Function to get upcoming notifications for a user
CREATE OR REPLACE FUNCTION get_upcoming_notifications(p_user_id UUID, p_hours INTEGER DEFAULT 24)
RETURNS TABLE (
  id UUID,
  title TEXT,
  body TEXT,
  scheduled_for TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sn.id,
    sn.title,
    sn.body,
    sn.scheduled_for
  FROM scheduled_notifications sn
  WHERE sn.user_id = p_user_id
    AND sn.status = 'pending'
    AND sn.scheduled_for BETWEEN NOW() AND NOW() + (p_hours || ' hours')::INTERVAL
  ORDER BY sn.scheduled_for;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark activity complete and cancel its notifications
CREATE OR REPLACE FUNCTION mark_activity_complete(
  p_user_id UUID,
  p_schedule_date DATE,
  p_activity_index INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_schedule_id UUID;
  v_activities JSONB;
BEGIN
  -- Get the schedule
  SELECT id, activities INTO v_schedule_id, v_activities
  FROM calendar_schedules
  WHERE user_id = p_user_id AND schedule_date = p_schedule_date;
  
  IF v_schedule_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Update the activity as completed
  v_activities = jsonb_set(
    v_activities,
    ARRAY[p_activity_index::TEXT, 'completed'],
    'true'::jsonb
  );
  
  UPDATE calendar_schedules
  SET activities = v_activities
  WHERE id = v_schedule_id;
  
  -- Cancel pending notifications for this activity
  UPDATE scheduled_notifications
  SET status = 'cancelled'
  WHERE schedule_id = v_schedule_id
    AND activity_index = p_activity_index
    AND status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to schedule notifications for a day's activities
CREATE OR REPLACE FUNCTION schedule_day_notifications(
  p_user_id UUID,
  p_schedule_date DATE
)
RETURNS INTEGER AS $$
DECLARE
  v_schedule RECORD;
  v_settings RECORD;
  v_activity JSONB;
  v_activity_index INTEGER;
  v_reminder_minutes INTEGER;
  v_activity_time TIME;
  v_scheduled_time TIMESTAMPTZ;
  v_count INTEGER := 0;
BEGIN
  -- Get the schedule
  SELECT * INTO v_schedule
  FROM calendar_schedules
  WHERE user_id = p_user_id AND schedule_date = p_schedule_date;
  
  IF v_schedule IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Get notification settings
  SELECT * INTO v_settings
  FROM notification_settings
  WHERE user_id = p_user_id;
  
  IF v_settings IS NULL OR NOT v_settings.global_enabled THEN
    RETURN 0;
  END IF;
  
  IF NOT (v_settings.settings->'visualSchedule'->>'enabled')::BOOLEAN THEN
    RETURN 0;
  END IF;
  
  -- Cancel existing pending notifications for this schedule
  UPDATE scheduled_notifications
  SET status = 'cancelled'
  WHERE schedule_id = v_schedule.id AND status = 'pending';
  
  -- Loop through activities
  FOR v_activity_index IN 0..jsonb_array_length(v_schedule.activities) - 1 LOOP
    v_activity := v_schedule.activities->v_activity_index;
    
    -- Skip if no time set or already completed or notifications disabled
    IF v_activity->>'time' IS NULL 
       OR (v_activity->>'completed')::BOOLEAN = TRUE
       OR (v_activity->>'notify')::BOOLEAN = FALSE THEN
      CONTINUE;
    END IF;
    
    v_activity_time := (v_activity->>'time')::TIME;
    
    -- Schedule for each reminder interval
    FOR v_reminder_minutes IN 
      SELECT jsonb_array_elements_text(v_settings.settings->'visualSchedule'->'reminderMinutes')::INTEGER
    LOOP
      v_scheduled_time := (p_schedule_date + v_activity_time) - (v_reminder_minutes || ' minutes')::INTERVAL;
      
      -- Only schedule future notifications
      IF v_scheduled_time > NOW() THEN
        INSERT INTO scheduled_notifications (
          user_id, schedule_id, activity_index, title, body, scheduled_for,
          repeat_until_complete, repeat_interval_minutes
        ) VALUES (
          p_user_id,
          v_schedule.id,
          v_activity_index,
          '⏰ ' || (v_activity->>'name'),
          CASE 
            WHEN v_reminder_minutes = 0 THEN 'Time to start!'
            ELSE 'Starting in ' || v_reminder_minutes || ' minutes!'
          END,
          v_scheduled_time,
          v_reminder_minutes = 0, -- Only repeat for "at time" notifications
          (v_settings.settings->'visualSchedule'->>'repeatInterval')::INTEGER
        );
        v_count := v_count + 1;
      END IF;
    END LOOP;
  END LOOP;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================
-- 7. CRON JOB FUNCTION (for pg_cron)
-- =====================================================
-- This function should be called by pg_cron every minute
-- It finds due notifications and calls the Edge Function to send them

CREATE OR REPLACE FUNCTION process_pending_notifications()
RETURNS INTEGER AS $$
DECLARE
  v_notification RECORD;
  v_count INTEGER := 0;
BEGIN
  -- Get all notifications due in the next minute
  FOR v_notification IN
    SELECT sn.*, ps.endpoint, ps.p256dh, ps.auth
    FROM scheduled_notifications sn
    JOIN push_subscriptions ps ON sn.user_id = ps.user_id
    WHERE sn.status = 'pending'
      AND sn.scheduled_for <= NOW() + INTERVAL '1 minute'
      AND sn.scheduled_for > NOW() - INTERVAL '5 minutes' -- Don't send very old ones
  LOOP
    -- Mark as processing (will be updated by Edge Function)
    UPDATE scheduled_notifications
    SET status = 'processing'
    WHERE id = v_notification.id;
    
    v_count := v_count + 1;
    
    -- The actual sending is done by the Edge Function
    -- which polls for 'processing' status notifications
  END LOOP;
  
  -- Handle repeat notifications
  INSERT INTO scheduled_notifications (
    user_id, schedule_id, activity_index, title, body, scheduled_for,
    repeat_until_complete, repeat_interval_minutes
  )
  SELECT 
    user_id, schedule_id, activity_index, 
    title, '🔁 Reminder: ' || body, 
    NOW() + (repeat_interval_minutes || ' minutes')::INTERVAL,
    repeat_until_complete, repeat_interval_minutes
  FROM scheduled_notifications
  WHERE status = 'sent'
    AND repeat_until_complete = TRUE
    AND sent_at > NOW() - INTERVAL '1 minute'
    -- Check activity is still incomplete
    AND EXISTS (
      SELECT 1 FROM calendar_schedules cs
      WHERE cs.id = schedule_id
        AND NOT (cs.activities->activity_index->>'completed')::BOOLEAN
    );
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================
-- 8. ENABLE PG_CRON (if available)
-- =====================================================
-- Note: pg_cron must be enabled in your Supabase project settings
-- Go to Database > Extensions and enable pg_cron

-- Then run this to schedule the job:
-- SELECT cron.schedule(
--   'process-notifications',
--   '* * * * *',  -- Every minute
--   'SELECT process_pending_notifications()'
-- );

-- To check scheduled jobs:
-- SELECT * FROM cron.job;

-- To remove the job:
-- SELECT cron.unschedule('process-notifications');


-- =====================================================
-- NOTES
-- =====================================================
-- 
-- Permissions are handled by RLS policies above.
-- No additional GRANT statements needed in Supabase.
--
-- After running this file:
-- 1. Enable pg_cron extension in Database → Extensions
-- 2. Run the cron.schedule() command to start processing notifications
--
