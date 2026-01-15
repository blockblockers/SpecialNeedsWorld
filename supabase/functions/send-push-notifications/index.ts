// Supabase Edge Function: send-push-notifications
// This function is called by pg_cron to send pending push notifications
// Deploy with: supabase functions deploy send-push-notifications

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

// Web Push library for Deno
import webpush from 'https://esm.sh/web-push@3.6.6';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configure web-push with VAPID keys
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY') || '';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') || '';
const VAPID_EMAIL = Deno.env.get('VAPID_EMAIL') || 'mailto:support@specialneedsworld.com';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get pending notifications that are due
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
    
    const { data: pendingNotifications, error: fetchError } = await supabase
      .from('scheduled_notifications')
      .select(`
        id,
        user_id,
        title,
        body,
        scheduled_for,
        activity_index,
        schedule_id,
        repeat_until_complete,
        repeat_interval_minutes
      `)
      .eq('status', 'pending')
      .lte('scheduled_for', fiveMinutesFromNow.toISOString())
      .gte('scheduled_for', new Date(now.getTime() - 5 * 60 * 1000).toISOString())
      .limit(100);

    if (fetchError) {
      throw fetchError;
    }

    if (!pendingNotifications || pendingNotifications.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending notifications', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${pendingNotifications.length} notifications`);

    let sentCount = 0;
    let failedCount = 0;
    const processedIds: string[] = [];
    const repeatNotifications: any[] = [];

    for (const notification of pendingNotifications) {
      // Get user's push subscriptions
      const { data: subscriptions, error: subError } = await supabase
        .from('push_subscriptions')
        .select('endpoint, p256dh, auth')
        .eq('user_id', notification.user_id);

      if (subError || !subscriptions || subscriptions.length === 0) {
        console.log(`No subscriptions for user ${notification.user_id}`);
        processedIds.push(notification.id);
        continue;
      }

      // Send to all user's devices
      for (const subscription of subscriptions) {
        try {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          };

          const payload = JSON.stringify({
            title: notification.title,
            body: notification.body,
            icon: '/logo.jpeg',
            badge: '/favicon-32.png',
            tag: `notification-${notification.id}`,
            requireInteraction: true,
            vibrate: [200, 100, 200],
            data: {
              notificationId: notification.id,
              activityIndex: notification.activity_index,
              scheduleId: notification.schedule_id,
            },
            actions: [
              { action: 'complete', title: '✓ Done' },
              { action: 'snooze', title: '⏰ Snooze' },
            ],
          });

          await webpush.sendNotification(pushSubscription, payload);
          sentCount++;
          console.log(`Sent notification to ${subscription.endpoint.slice(0, 50)}...`);
        } catch (pushError: any) {
          console.error(`Push error: ${pushError.message}`);
          
          // If subscription is invalid, remove it
          if (pushError.statusCode === 410 || pushError.statusCode === 404) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('endpoint', subscription.endpoint);
            console.log('Removed invalid subscription');
          }
          
          failedCount++;
        }
      }

      processedIds.push(notification.id);

      // Handle repeat notifications
      if (notification.repeat_until_complete && notification.repeat_interval_minutes) {
        // Check if activity is still incomplete
        if (notification.schedule_id) {
          const { data: schedule } = await supabase
            .from('calendar_schedules')
            .select('activities')
            .eq('id', notification.schedule_id)
            .single();

          if (schedule?.activities && notification.activity_index !== null) {
            const activity = schedule.activities[notification.activity_index];
            if (activity && !activity.completed) {
              // Schedule repeat notification
              const repeatTime = new Date(now.getTime() + notification.repeat_interval_minutes * 60 * 1000);
              repeatNotifications.push({
                user_id: notification.user_id,
                schedule_id: notification.schedule_id,
                activity_index: notification.activity_index,
                title: `🔁 Reminder: ${notification.title}`,
                body: `Still on your list - you've got this! 💪`,
                scheduled_for: repeatTime.toISOString(),
                repeat_until_complete: true,
                repeat_interval_minutes: notification.repeat_interval_minutes,
                status: 'pending',
              });
            }
          }
        }
      }
    }

    // Mark processed notifications as sent
    if (processedIds.length > 0) {
      await supabase
        .from('scheduled_notifications')
        .update({ 
          status: 'sent',
          sent_at: now.toISOString()
        })
        .in('id', processedIds);
    }

    // Insert repeat notifications
    if (repeatNotifications.length > 0) {
      await supabase
        .from('scheduled_notifications')
        .insert(repeatNotifications);
      console.log(`Scheduled ${repeatNotifications.length} repeat notifications`);
    }

    return new Response(
      JSON.stringify({
        message: 'Notifications processed',
        sent: sentCount,
        failed: failedCount,
        repeatsScheduled: repeatNotifications.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
