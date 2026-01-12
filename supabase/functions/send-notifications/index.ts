// send-notifications/index.ts
// Supabase Edge Function to send Web Push notifications
// Deploy with: supabase functions deploy send-notifications

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Web Push library for Deno
import * as webpush from "https://esm.sh/web-push@3.6.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Encouraging messages for notifications
const ENCOURAGING_MESSAGES = [
  { title: "🌟 You've got this!", body: "I believe in you!" },
  { title: "⭐ Almost time!", body: "You're doing amazing today!" },
  { title: "🎈 Friendly reminder!", body: "You're a superstar!" },
  { title: "🌈 Hey there, friend!", body: "Take your time, you're wonderful!" },
  { title: "💪 You can do it!", body: "One step at a time!" },
  { title: "🎉 Great job today!", body: "Keep being awesome!" },
  { title: "🦋 Gentle reminder", body: "You're doing so well!" },
  { title: "🌻 Hello sunshine!", body: "I'm proud of you!" },
  { title: "🐢 No rush!", body: "Take a deep breath!" },
  { title: "💖 You matter!", body: "You're loved and capable!" },
];

const REPEAT_MESSAGES = [
  "Still on your list - take your time! 💙",
  "Gentle nudge! Whenever you're ready. 🌸",
  "No rush at all - just a friendly reminder! 🐌",
  "Checking in with love! You've got this! 💝",
  "Still here for you! One step at a time. 🌿",
  "Remember this one? I know you can do it! ⭐",
  "Just a soft reminder - you're doing great! 🦋",
  "Hey friend! This is still waiting for you. 🌼",
  "Sending encouragement your way! 🌈",
  "You haven't forgotten - and neither have I! 🤗",
];

const getRandomMessage = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY")!;
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY")!;
    const vapidEmail = Deno.env.get("VAPID_EMAIL") || "mailto:admin@specialneedsworld.app";

    // Configure web-push
    webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

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
        repeat_interval_minutes
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

    let sentCount = 0;
    let failedCount = 0;

    // Process each notification
    for (const notification of notifications) {
      // Get all push subscriptions for this user
      const { data: subscriptions, error: subError } = await supabase
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .eq("user_id", notification.user_id);

      if (subError || !subscriptions || subscriptions.length === 0) {
        // No subscriptions, mark as failed
        await supabase
          .from("scheduled_notifications")
          .update({ status: "failed" })
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

        const payload = JSON.stringify({
          title: notification.title,
          body: notification.body,
          icon: "/logo.jpeg",
          badge: "/favicon-32.png",
          tag: notification.id,
          data: {
            notificationId: notification.id,
            url: "/visual-schedule",
          },
          actions: [
            { action: "complete", title: "✓ Done" },
            { action: "snooze", title: "⏰ Snooze" },
          ],
        });

        try {
          await webpush.sendNotification(pushSubscription, payload);
          anySent = true;

          // Update last_used_at
          await supabase
            .from("push_subscriptions")
            .update({ last_used_at: new Date().toISOString() })
            .eq("endpoint", sub.endpoint);
        } catch (pushError) {
          console.error("Push failed:", pushError);
          
          // If subscription is invalid (410 Gone or 404), remove it
          if (pushError.statusCode === 410 || pushError.statusCode === 404) {
            await supabase
              .from("push_subscriptions")
              .delete()
              .eq("endpoint", sub.endpoint);
          }
        }
      }

      // Update notification status
      if (anySent) {
        await supabase
          .from("scheduled_notifications")
          .update({ 
            status: "sent",
            sent_at: new Date().toISOString()
          })
          .eq("id", notification.id);
        sentCount++;
      } else {
        await supabase
          .from("scheduled_notifications")
          .update({ status: "failed" })
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
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
