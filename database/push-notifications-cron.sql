-- =====================================================
-- PUSH NOTIFICATIONS - pg_cron Setup
-- =====================================================
-- Run this in Supabase SQL Editor AFTER deploying the Edge Function
-- 
-- Prerequisites:
-- 1. Enable pg_cron extension: Database → Extensions → pg_cron
-- 2. Enable pg_net extension: Database → Extensions → pg_net  
-- 3. Deploy the Edge Function: supabase functions deploy send-push-notifications
-- 4. Set VAPID keys in Edge Function secrets

-- =====================================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- =====================================================

-- pg_cron for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- pg_net for HTTP requests to Edge Functions
CREATE EXTENSION IF NOT EXISTS pg_net;

-- =====================================================
-- 2. CREATE HELPER FUNCTION TO CALL EDGE FUNCTION
-- =====================================================

-- IMPORTANT: Replace YOUR_PROJECT_REF with your actual Supabase project reference
-- You can find this in your Supabase project URL: https://YOUR_PROJECT_REF.supabase.co

CREATE OR REPLACE FUNCTION call_push_notifications_function()
RETURNS void AS $$
DECLARE
  v_url TEXT;
  v_service_key TEXT;
BEGIN
  -- REPLACE with your actual project URL
  v_url := 'https://gwcfqhfxqkzztxrfwsed.supabase.co/functions/v1/send-push-notifications';
  
  -- Get service role key from vault (if configured) or use anon key
  -- For cron jobs, you may need to hardcode this or use vault
  v_service_key := current_setting('app.settings.service_role_key', true);
  
  -- Make HTTP request to Edge Function using pg_net
  PERFORM net.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(v_service_key, current_setting('request.jwt.claims', true)::jsonb->>'role')
    )::jsonb,
    body := '{}'::jsonb
  );
  
  RAISE LOG 'Push notifications function called at %', NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. ALTERNATIVE: Direct Database Processing
-- =====================================================
-- If pg_net is not available or you prefer not to use Edge Functions,
-- this approach processes notifications directly in the database
-- and stores them in a queue for the client to poll

CREATE OR REPLACE FUNCTION process_pending_notifications_v2()
RETURNS TABLE (
  notification_id UUID,
  user_id UUID,
  endpoint TEXT,
  p256dh TEXT,
  auth TEXT,
  title TEXT,
  body TEXT
) AS $$
DECLARE
  v_notification RECORD;
BEGIN
  -- Get all notifications due now
  FOR v_notification IN
    SELECT 
      sn.id,
      sn.user_id,
      sn.title,
      sn.body,
      sn.repeat_until_complete,
      sn.repeat_interval_minutes,
      sn.schedule_id,
      sn.activity_index
    FROM scheduled_notifications sn
    WHERE sn.status = 'pending'
      AND sn.scheduled_for <= NOW()
      AND sn.scheduled_for > NOW() - INTERVAL '10 minutes'
  LOOP
    -- Get user's push subscriptions and return them
    RETURN QUERY
    SELECT 
      v_notification.id,
      v_notification.user_id,
      ps.endpoint,
      ps.p256dh,
      ps.auth,
      v_notification.title,
      v_notification.body
    FROM push_subscriptions ps
    WHERE ps.user_id = v_notification.user_id;
    
    -- Mark as sent
    UPDATE scheduled_notifications
    SET status = 'sent', sent_at = NOW()
    WHERE id = v_notification.id;
    
    -- Handle repeating notifications
    IF v_notification.repeat_until_complete AND v_notification.schedule_id IS NOT NULL THEN
      -- Check if activity is still incomplete
      PERFORM 1 FROM calendar_schedules cs
      WHERE cs.id = v_notification.schedule_id
        AND (cs.activities->v_notification.activity_index->>'completed')::boolean = false;
      
      IF FOUND THEN
        -- Schedule repeat
        INSERT INTO scheduled_notifications (
          user_id, schedule_id, activity_index, title, body,
          scheduled_for, repeat_until_complete, repeat_interval_minutes, status
        ) VALUES (
          v_notification.user_id,
          v_notification.schedule_id,
          v_notification.activity_index,
          '🔁 ' || v_notification.title,
          'Gentle reminder - you''ve got this! 💪',
          NOW() + (v_notification.repeat_interval_minutes || ' minutes')::INTERVAL,
          true,
          v_notification.repeat_interval_minutes,
          'pending'
        );
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. SCHEDULE THE CRON JOBS
-- =====================================================

-- First, remove any existing jobs with these names
DO $$
BEGIN
  PERFORM cron.unschedule('send-push-notifications');
EXCEPTION WHEN OTHERS THEN
  NULL;
END;
$$;

DO $$
BEGIN
  PERFORM cron.unschedule('cleanup-old-notifications');
EXCEPTION WHEN OTHERS THEN
  NULL;
END;
$$;

-- Schedule push notification processing every minute
SELECT cron.schedule(
  'send-push-notifications',
  '* * * * *',  -- Every minute
  $$ SELECT call_push_notifications_function(); $$
);

-- Schedule cleanup of old notifications (daily at midnight)
SELECT cron.schedule(
  'cleanup-old-notifications',
  '0 0 * * *',  -- Daily at midnight
  $$
    DELETE FROM scheduled_notifications 
    WHERE status IN ('sent', 'cancelled', 'failed')
    AND created_at < NOW() - INTERVAL '7 days';
  $$
);

-- =====================================================
-- 5. VERIFY SETUP
-- =====================================================

-- Check scheduled jobs
SELECT jobid, jobname, schedule, command FROM cron.job;

-- =====================================================
-- 6. GRANT PERMISSIONS FOR EDGE FUNCTION
-- =====================================================

-- Allow the service role to execute our functions
GRANT EXECUTE ON FUNCTION call_push_notifications_function() TO service_role;
GRANT EXECUTE ON FUNCTION process_pending_notifications_v2() TO service_role;

-- =====================================================
-- NOTES & TROUBLESHOOTING
-- =====================================================
/*
SETUP STEPS:
1. Enable pg_cron and pg_net extensions in Supabase Dashboard → Database → Extensions
2. Run sync-notifications-setup.sql first (creates tables)
3. Deploy Edge Function:
   cd your-project
   supabase functions deploy send-push-notifications --no-verify-jwt
4. Set Edge Function secrets in Dashboard → Edge Functions → send-push-notifications → Secrets:
   - VAPID_PUBLIC_KEY: (your public key)
   - VAPID_PRIVATE_KEY: (your private key)
   - VAPID_EMAIL: mailto:your@email.com
5. Update the URL in call_push_notifications_function() with your project ref
6. Run this SQL file

GENERATING VAPID KEYS:
npx web-push generate-vapid-keys

This will output:
- Public Key: Store in both app (.env) and Edge Function secrets
- Private Key: Store ONLY in Edge Function secrets (never in frontend)

TESTING:
1. Add a test notification:
   INSERT INTO scheduled_notifications (user_id, title, body, scheduled_for, status)
   VALUES ('YOUR_USER_ID', 'Test', 'Hello!', NOW() + INTERVAL '1 minute', 'pending');

2. Check if job runs:
   SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

3. Check notification status:
   SELECT * FROM scheduled_notifications ORDER BY created_at DESC LIMIT 10;

COMMON ISSUES:
- pg_cron not running: Make sure extension is enabled
- pg_net errors: Check Supabase logs for HTTP errors
- No notifications sent: Verify push_subscriptions has valid entries
- Edge Function errors: Check function logs in Supabase Dashboard
*/
