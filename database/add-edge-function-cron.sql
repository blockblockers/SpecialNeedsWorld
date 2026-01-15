-- =====================================================
-- SPECIAL NEEDS WORLD - ADD EDGE FUNCTION CRON JOB
-- =====================================================
-- Run this in Supabase SQL Editor AFTER enabling pg_net extension
-- 
-- PREREQUISITES:
-- 1. pg_net extension must be enabled (Database → Extensions → pg_net)
-- 2. Edge Function must be deployed
-- 3. VAPID secrets must be set on Edge Function
-- =====================================================

-- =====================================================
-- 1. ENABLE pg_net EXTENSION (if not already enabled)
-- =====================================================
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- =====================================================
-- 2. CREATE HELPER FUNCTION TO CALL EDGE FUNCTION
-- =====================================================
-- This function uses pg_net to make HTTP calls to the Edge Function

CREATE OR REPLACE FUNCTION call_send_notifications_function()
RETURNS void AS $$
DECLARE
  v_url TEXT;
  v_service_key TEXT;
BEGIN
  -- Your Supabase project URL for the Edge Function
  v_url := 'https://gwcfqhfxqkzztxrfwsed.supabase.co/functions/v1/send-notifications';
  
  -- Get the service role key from the vault or use a direct reference
  -- Note: In production, you should store this in Supabase Vault
  -- For now, we'll use the anon key which works with --no-verify-jwt deployment
  
  -- Make HTTP POST request to Edge Function
  PERFORM net.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'source', 'pg_cron',
      'timestamp', NOW()::text
    )
  );
  
  RAISE LOG 'send-notifications Edge Function called at %', NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. REMOVE OLD/DUPLICATE CRON JOBS (if any)
-- =====================================================
DO $$
BEGIN
  -- Remove send-notifications job if exists
  PERFORM cron.unschedule('send-notifications');
  RAISE NOTICE 'Removed existing send-notifications job';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'No existing send-notifications job to remove';
END;
$$;

DO $$
BEGIN
  -- Remove send-push-notifications job if exists  
  PERFORM cron.unschedule('send-push-notifications');
  RAISE NOTICE 'Removed existing send-push-notifications job';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'No existing send-push-notifications job to remove';
END;
$$;

DO $$
BEGIN
  -- Remove cleanup job if exists (we'll recreate it)
  PERFORM cron.unschedule('cleanup-old-notifications');
  RAISE NOTICE 'Removed existing cleanup-old-notifications job';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'No existing cleanup-old-notifications job to remove';
END;
$$;

-- =====================================================
-- 4. SCHEDULE THE CRON JOBS
-- =====================================================

-- Job 1: Call Edge Function every minute to send processed notifications
-- This runs AFTER process-notifications marks them as 'processing'
SELECT cron.schedule(
  'send-notifications',           -- Job name
  '* * * * *',                    -- Every minute
  $$ SELECT call_send_notifications_function(); $$
);

-- Job 2: Cleanup old notifications (daily at 3 AM to avoid peak hours)
SELECT cron.schedule(
  'cleanup-old-notifications',
  '0 3 * * *',                    -- Daily at 3:00 AM UTC
  $$
    DELETE FROM scheduled_notifications 
    WHERE status IN ('sent', 'cancelled', 'failed')
    AND created_at < NOW() - INTERVAL '7 days';
    
    -- Also clean up orphaned subscriptions (no activity in 90 days)
    DELETE FROM push_subscriptions
    WHERE last_used_at < NOW() - INTERVAL '90 days';
  $$
);

-- =====================================================
-- 5. GRANT NECESSARY PERMISSIONS
-- =====================================================
GRANT EXECUTE ON FUNCTION call_send_notifications_function() TO service_role;
GRANT EXECUTE ON FUNCTION call_send_notifications_function() TO postgres;

-- =====================================================
-- 6. VERIFY SETUP
-- =====================================================
-- Run this to see all scheduled jobs
SELECT 
  jobid, 
  jobname, 
  schedule, 
  active,
  command 
FROM cron.job
ORDER BY jobname;

-- =====================================================
-- 7. TEST THE SETUP (Optional)
-- =====================================================
-- Uncomment and run to test:

-- Test 1: Manually call the Edge Function
-- SELECT call_send_notifications_function();

-- Test 2: Insert a test notification (replace YOUR_USER_ID with actual user ID)
-- INSERT INTO scheduled_notifications (
--   user_id, 
--   title, 
--   body, 
--   scheduled_for, 
--   status
-- ) VALUES (
--   'YOUR_USER_ID',
--   '🌟 Test Notification',
--   'This is a test from Special Needs World!',
--   NOW() + INTERVAL '1 minute',
--   'pending'
-- );

-- =====================================================
-- EXPECTED OUTPUT
-- =====================================================
-- After running this, you should have 3 cron jobs:
-- 1. process-notifications    - Marks pending as 'processing'
-- 2. send-notifications       - Calls Edge Function to send
-- 3. cleanup-old-notifications - Daily cleanup

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================
/*
If send-notifications fails:

1. Check pg_net is enabled:
   SELECT * FROM pg_extension WHERE extname = 'pg_net';

2. Check Edge Function logs in Supabase Dashboard:
   Dashboard → Edge Functions → send-notifications → Logs

3. Check cron job run history:
   SELECT * FROM cron.job_run_details 
   ORDER BY start_time DESC 
   LIMIT 20;

4. Manually test Edge Function:
   curl -X POST 'https://gwcfqhfxqkzztxrfwsed.supabase.co/functions/v1/send-notifications'

5. Verify VAPID secrets are set:
   Dashboard → Edge Functions → send-notifications → Secrets
   Should have: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL
*/
