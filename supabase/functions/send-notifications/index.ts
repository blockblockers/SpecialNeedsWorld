// send-notifications/index.ts
// Supabase Edge Function to send Web Push notifications for Special Needs World
// Deploy with: supabase functions deploy send-notifications --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Web Push library for Deno
import * as webpush from "https://esm.sh/web-push@3.6.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables - CORRECTED: Use proper env var names
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // VAPID keys - these must be set as Edge Function secrets
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
    const vapidEmail = Deno.env.get("VAPID_EMAIL") || "mailto:kcassel888@gmail.com";

    // Validate VAPID keys are configured
    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error("VAPID keys not configured!");
      return new Response(
        JSON.stringify({ 
          error: "VAPID keys not configured. Please set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY secrets.",
          setup_required: true 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Configure web-push with mailto: prefix for email
    const emailWithPrefix = vapidEmail.startsWith("mailto:") ? vapidEmail : `mailto:${vapidEmail}`;
    webpush.setVapidDetails(emailWithPrefix, vapidPublicKey, vapidPrivateKey);

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get notifications ready to send (status = 'processing')
    const { data: notifications, error: fetchError } = await supabase
      .from("scheduled_notifications")
      .select(`
        id,
        user_id,
        title,
        body,
        scheduled_for,
        repeat_until_complete,
        repeat_interval_minutes,
        data
      `)
      .eq("status", "processing")
      .limit(100);

    if (fetchError) {
      throw fetchError;
    }

    if (!notifications || notifications.length === 0) {
      return new Response(
        JSON.stringify({ message: "No notifications to send", count: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${notifications.length} notifications`);

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Process each notification
    for (const notification of notifications) {
      // Get all push subscriptions for this user
      const { data: subscriptions, error: subError } = await supabase
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .eq("user_id", notification.user_id);

      if (subError) {
        console.error(`Error fetching subscriptions for user ${notification.user_id}:`, subError);
        errors.push(`User ${notification.user_id}: ${subError.message}`);
      }

      if (!subscriptions || subscriptions.length === 0) {
        // No subscriptions, mark as failed
        await supabase
          .from("scheduled_notifications")
          .update({ 
            status: "failed",
            error_message: "No push subscriptions found for user"
          })
          .eq("id", notification.id);
        failedCount++;
        continue;
      }

      // Send to all user's devices
      let anySent = false;
      for (const sub of subscriptions) {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        // Build notification payload with Special Needs World theming
        const payload = JSON.stringify({
          title: notification.title || "Special Needs World",
          body: notification.body || "You have a notification",
          // Themed icons for Special Needs World
          icon: "/logo.jpeg",           // Main app logo (192x192 recommended)
          badge: "/badge-icon.png",     // Monochrome badge for status bar (96x96)
          tag: `snw-${notification.id}`, // Unique tag to prevent duplicate notifications
          // Vibration pattern: short-pause-long (friendly, not alarming)
          vibrate: [100, 50, 200],
          // Keep notification visible until user interacts
          requireInteraction: true,
          // Custom data for click handling
          data: {
            notificationId: notification.id,
            url: notification.data?.url || "/visual-schedule",
            timestamp: new Date().toISOString(),
            ...notification.data
          },
          // Action buttons themed for special needs (clear, simple)
          actions: [
            { 
              action: "complete", 
              title: "✓ Done",
              icon: "/icons/check-circle.png"
            },
            { 
              action: "snooze", 
              title: "⏰ Later",
              icon: "/icons/clock.png"
            },
          ],
        });

        try {
          await webpush.sendNotification(pushSubscription, payload);
          anySent = true;
          console.log(`Sent notification ${notification.id} to endpoint: ${sub.endpoint.substring(0, 50)}...`);

          // Update last_used_at for this subscription
          await supabase
            .from("push_subscriptions")
            .update({ last_used_at: new Date().toISOString() })
            .eq("endpoint", sub.endpoint);
        } catch (pushError: any) {
          console.error("Push failed:", pushError.message || pushError);
          
          // If subscription is invalid (410 Gone or 404), remove it
          if (pushError.statusCode === 410 || pushError.statusCode === 404) {
            console.log(`Removing invalid subscription: ${sub.endpoint.substring(0, 50)}...`);
            await supabase
              .from("push_subscriptions")
              .delete()
              .eq("endpoint", sub.endpoint);
          }
        }
      }

      // Update notification status based on results
      if (anySent) {
        const updateData: any = { 
          status: "sent",
          sent_at: new Date().toISOString()
        };

        // If repeat is enabled, create a follow-up notification
        if (notification.repeat_until_complete && notification.repeat_interval_minutes) {
          // Create next reminder
          const nextTime = new Date();
          nextTime.setMinutes(nextTime.getMinutes() + notification.repeat_interval_minutes);
          
          await supabase
            .from("scheduled_notifications")
            .insert({
              user_id: notification.user_id,
              title: `🔔 Reminder: ${notification.title}`,
              body: notification.body,
              scheduled_for: nextTime.toISOString(),
              repeat_until_complete: true,
              repeat_interval_minutes: notification.repeat_interval_minutes,
              status: "pending",
              data: notification.data
            });
          
          console.log(`Created follow-up notification for ${notification.repeat_interval_minutes} minutes from now`);
        }

        await supabase
          .from("scheduled_notifications")
          .update(updateData)
          .eq("id", notification.id);
        sentCount++;
      } else {
        await supabase
          .from("scheduled_notifications")
          .update({ 
            status: "failed",
            error_message: "Failed to send to any device"
          })
          .eq("id", notification.id);
        failedCount++;
      }
    }

    return new Response(
      JSON.stringify({
        message: "Notifications processed",
        sent: sentCount,
        failed: failedCount,
        total: notifications.length,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
