# Push Notifications & Cloud Sync Setup Guide

This guide covers setting up server-side push notifications and cloud sync for Special Needs World.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [VAPID Keys](#vapid-keys)
4. [Edge Function Deployment](#edge-function-deployment)
5. [Cron Job Setup](#cron-job-setup)
6. [Environment Variables](#environment-variables)
7. [Testing](#testing)

---

## Prerequisites

- Supabase project (already configured)
- Supabase CLI installed (`npm install -g supabase`)
- Node.js 18+ for local development

---

## Database Setup

Run the SQL file in Supabase SQL Editor:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open `/database/sync-notifications-setup.sql`
4. Click **Run** to execute

This creates:
- `calendar_schedules` - Visual Schedule data per date
- `aac_customizations` - Point to Talk custom buttons
- `push_subscriptions` - Web Push subscription endpoints
- `scheduled_notifications` - Pending notification queue
- `notification_settings` - User notification preferences
- Helper functions for scheduling and processing

---

## VAPID Keys

Web Push requires VAPID (Voluntary Application Server Identification) keys.

### Generate Keys

```bash
npx web-push generate-vapid-keys
```

This outputs:
```
=======================================

Public Key:
BEl62iUYgUivxIkv69yViEuiBIa-...

Private Key:
UUxI4O8-FbRx-...

=======================================
```

### Store Keys

**In Supabase (for Edge Function):**
1. Go to **Project Settings** → **Edge Functions**
2. Add these secrets:
   - `VAPID_PUBLIC_KEY` = your public key
   - `VAPID_PRIVATE_KEY` = your private key
   - `VAPID_EMAIL` = `mailto:your@email.com`

**In Netlify (for client):**
1. Go to **Site Settings** → **Environment Variables**
2. Add:
   - `VITE_VAPID_PUBLIC_KEY` = your public key

**In local `.env`:**
```env
VITE_VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa-...
```

---

## Edge Function Deployment

### Login to Supabase CLI

```bash
supabase login
```

### Link to your project

```bash
supabase link --project-ref gwcfqhfxqkzztxrfwsed
```

### Deploy the function

```bash
supabase functions deploy send-notifications
```

### Set secrets for the function

```bash
supabase secrets set VAPID_PUBLIC_KEY=your_public_key
supabase secrets set VAPID_PRIVATE_KEY=your_private_key
supabase secrets set VAPID_EMAIL=mailto:your@email.com
```

---

## Cron Job Setup

The push notification system needs a cron job to process the queue.

### Option 1: pg_cron (Recommended)

1. Enable pg_cron in Supabase:
   - Go to **Database** → **Extensions**
   - Enable `pg_cron`

2. Schedule the job (run in SQL Editor):

```sql
-- Schedule notification processing every minute
SELECT cron.schedule(
  'process-notifications',
  '* * * * *',
  $$SELECT process_pending_notifications()$$
);

-- Then call the Edge Function to send
SELECT cron.schedule(
  'send-notifications',
  '* * * * *',
  $$SELECT net.http_post(
    url := 'https://gwcfqhfxqkzztxrfwsed.supabase.co/functions/v1/send-notifications',
    headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  )$$
);
```

### Option 2: External Cron (Alternative)

Use an external service like:
- **cron-job.org** (free)
- **Upstash QStash**
- **GitHub Actions**

Set up a cron to call your Edge Function every minute:

```
URL: https://gwcfqhfxqkzztxrfwsed.supabase.co/functions/v1/send-notifications
Method: POST
Headers:
  Authorization: Bearer YOUR_SUPABASE_ANON_KEY
Schedule: * * * * * (every minute)
```

---

## Environment Variables

### Client-Side (.env)

```env
# Supabase
VITE_SUPABASE_URL=https://gwcfqhfxqkzztxrfwsed.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Web Push
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key
```

### Supabase Edge Function Secrets

```bash
# Required for the send-notifications function
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_EMAIL=mailto:admin@specialneedsworld.app
```

### Netlify Environment Variables

Same as client-side `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_VAPID_PUBLIC_KEY`

---

## Testing

### 1. Test Database Tables

```sql
-- Check tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('calendar_schedules', 'aac_customizations', 'push_subscriptions', 'scheduled_notifications');
```

### 2. Test Push Subscription (in browser console)

```javascript
// Check if push is supported
console.log('Push supported:', 'PushManager' in window);

// Request notification permission
const permission = await Notification.requestPermission();
console.log('Permission:', permission);
```

### 3. Test Edge Function

```bash
curl -X POST \
  'https://gwcfqhfxqkzztxrfwsed.supabase.co/functions/v1/send-notifications' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

### 4. Test Notification Flow

1. Sign in to the app
2. Go to Settings → Enable notifications
3. Go to Visual Schedule
4. Create a schedule with a time 2 minutes from now
5. Save the schedule
6. Wait for the notification

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Visual    │  │  Point to   │  │      Settings       │  │
│  │  Schedule   │  │    Talk     │  │  (Notifications)    │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         ▼                ▼                     ▼             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Sync Services (calendarSync, aacSync)      ││
│  │              Push Subscription Service                   ││
│  └─────────────────────────┬───────────────────────────────┘│
└────────────────────────────┼────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase                                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Database                              ││
│  │  calendar_schedules │ aac_customizations │ push_subs    ││
│  │  scheduled_notifications │ notification_settings        ││
│  └─────────────────────────────────────────────────────────┘│
│                             │                                │
│                    ┌────────┴────────┐                       │
│                    ▼                 ▼                       │
│  ┌─────────────────────┐  ┌─────────────────────────────┐   │
│  │      pg_cron        │  │      Edge Function          │   │
│  │  (every minute)     │──│   send-notifications        │   │
│  │                     │  │   (Web Push API)            │   │
│  └─────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Push Service   │
                    │  (FCM/APNs/WNS) │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  User Device    │
                    │  Notification   │
                    └─────────────────┘
```

---

## Troubleshooting

### Notifications not appearing

1. Check browser console for errors
2. Verify notification permission is granted
3. Check push subscription exists in database
4. Verify Edge Function is running (check Supabase logs)
5. Verify cron job is scheduled

### Sync not working

1. Check Supabase connection (browser Network tab)
2. Verify user is authenticated
3. Check RLS policies allow access
4. Look for errors in browser console

### Edge Function failing

1. Check function logs: **Supabase Dashboard** → **Edge Functions** → **Logs**
2. Verify secrets are set correctly
3. Test with curl command above

---

## Security Notes

- VAPID private key must be kept secret (only in Edge Function)
- Push subscriptions are tied to user IDs via RLS
- Notifications can only be scheduled for own schedules
- All data is encrypted in transit (HTTPS)
