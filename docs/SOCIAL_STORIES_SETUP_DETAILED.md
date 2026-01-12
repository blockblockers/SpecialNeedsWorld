# Social Stories - Detailed Setup Guide (GUI)

This guide walks you through setting up Social Stories using the web interfaces only - no command line needed!

---

## Quick Answer: Do I need special Anthropic API skills?

**No!** The Anthropic API is simple:
- You just need an API key
- No special configurations, skills, or permissions needed
- The default API access includes everything we need (Claude messaging)

---

## Step 1: Set Up the Database

### 1.1 Open Supabase SQL Editor

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your **Special Needs World** project
3. In the left sidebar, click **SQL Editor** (looks like a document icon)

### 1.2 Run the Social Stories Schema

1. Click **+ New query** (top right)
2. Copy the ENTIRE contents of `social-stories-setup.sql`
3. Paste it into the editor
4. Click the green **Run** button (or press Ctrl+Enter)
5. You should see "Success. No rows returned" - this is correct!

### 1.3 Verify Tables Were Created

1. In the left sidebar, click **Table Editor**
2. You should see these new tables:
   - `social_stories` (should have 3 rows - the seed data)
   - `user_saved_stories`
   - `story_generation_queue`

✅ **Database setup complete!**

---

## Step 2: Get Your Anthropic API Key

### 2.1 Create an Anthropic Account (if needed)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Click **Sign up** or **Log in**
3. Complete the sign-up process (email verification, etc.)

### 2.2 Add Credits (Required for API use)

1. Once logged in, click **Settings** (gear icon) or go to **Billing**
2. Click **Add credits** or **Set up billing**
3. Add at least $5-10 to start (Social Stories cost ~$0.01 each)
4. Complete the payment

### 2.3 Create an API Key

1. In the Anthropic Console, click **API Keys** in the left sidebar
2. Click **+ Create Key**
3. Give it a name like `special-needs-world`
4. Click **Create Key**
5. **IMPORTANT**: Copy the key immediately! It looks like:
   ```
   sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
6. Save this key somewhere safe (you won't be able to see it again)

### 2.4 About API Permissions

The Anthropic Console is simple - there are NO special skills or permissions to configure:

| What you might expect | What Anthropic actually has |
|----------------------|----------------------------|
| ❌ Skills to enable | ✅ Just an API key |
| ❌ Model permissions | ✅ All models included |
| ❌ Feature toggles | ✅ Everything works by default |

Your API key automatically has access to:
- ✅ Claude Sonnet (what we use)
- ✅ Claude Opus
- ✅ Claude Haiku
- ✅ All API features

✅ **Anthropic API key ready!**

---

## Step 3: Deploy the Edge Function (GUI Method)

Unfortunately, Supabase **requires the CLI** for deploying Edge Functions. But I'll make it as simple as possible!

### 3.1 One-Time CLI Setup (5 minutes)

#### Install Node.js (if not already installed)
1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS** version
3. Run the installer, click Next through everything

#### Install Supabase CLI
1. Open **Terminal** (Mac) or **Command Prompt** (Windows)
2. Type this command and press Enter:
   ```
   npm install -g supabase
   ```
3. Wait for it to finish (takes ~1 minute)

### 3.2 Login to Supabase CLI

1. In Terminal/Command Prompt, type:
   ```
   supabase login
   ```
2. Press Enter - a browser window will open
3. Click **Authorize** in the browser
4. Return to Terminal - you should see "Token saved"

### 3.3 Link to Your Project

1. Go to your Supabase Dashboard
2. Click **Project Settings** (gear icon at bottom of sidebar)
3. Under **General**, find **Reference ID** - copy it (looks like `gwcfqhfxqkzztxrfwsed`)
4. In Terminal, type:
   ```
   supabase link --project-ref YOUR_REFERENCE_ID
   ```
   (Replace YOUR_REFERENCE_ID with the one you copied)
5. Press Enter

### 3.4 Deploy the Edge Function

1. In Terminal, navigate to your project folder:
   ```
   cd path/to/special-needs-world
   ```
   (Or wherever you extracted the zip file)

2. Deploy the function:
   ```
   supabase functions deploy generate-social-story
   ```
3. Wait for "Function deployed successfully"

### 3.5 Add the Anthropic API Key

1. In Terminal, type:
   ```
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   ```
   (Replace with your actual key from Step 2)
2. Press Enter
3. You should see "Secret ANTHROPIC_API_KEY set"

✅ **Edge Function deployed!**

---

## Step 4: Verify Everything Works

### 4.1 Check Edge Function in Dashboard

1. Go to your Supabase Dashboard
2. Click **Edge Functions** in the left sidebar
3. You should see `generate-social-story` listed
4. Click on it to see logs and details

### 4.2 Test in the App

1. Open your Special Needs World app
2. Go to **Activities** → **Social Stories**
3. Type a topic like "Going to the park"
4. Click **Create Story**
5. Wait 5-10 seconds for the story to generate
6. You should see a flip-book story appear!

### 4.3 Check for Errors

If the story doesn't generate:

1. Go to Supabase Dashboard → **Edge Functions** → `generate-social-story`
2. Click **Logs** tab
3. Look for error messages
4. Common issues:
   - "API key not configured" → Run the secrets command again
   - "Invalid API key" → Check you copied the full key
   - "Insufficient credits" → Add more credits in Anthropic Console

---

## Alternative: Skip Edge Function (Local-Only Mode)

If you don't want to set up the Edge Function, the app will still work!

**What happens without the Edge Function:**
- ✅ Pre-built stories (bath, dentist, making friends) will work
- ✅ Stories are stored locally on each device
- ❌ New AI-generated stories won't be created
- ❌ Stories won't sync across devices

This is fine for testing or if you want to add stories manually to the database.

---

## Adding Stories Manually (No AI)

If you prefer not to use the AI, you can add stories directly to the database:

1. Go to Supabase Dashboard → **Table Editor**
2. Click on `social_stories`
3. Click **+ Insert row**
4. Fill in:
   - `topic`: "Your topic here"
   - `topic_normalized`: "your topic here" (lowercase)
   - `pages`: JSON array of pages (see format below)
   - `character_name`: "Sam"
   - `is_public`: true

### Page JSON Format:
```json
[
  {
    "pageNumber": 1,
    "text": "First page text here.",
    "imageDescription": "Description of what to draw"
  },
  {
    "pageNumber": 2,
    "text": "Second page text here.",
    "imageDescription": "Description of what to draw"
  }
]
```

---

## Cost Summary

| Item | Cost |
|------|------|
| Supabase (Free tier) | $0 |
| Anthropic API (per story) | ~$0.005 - $0.01 |
| 100 stories | ~$0.50 - $1.00 |
| 1000 stories | ~$5 - $10 |

The caching system means popular stories (like "taking a bath") are only generated once, then reused for free!

---

## Troubleshooting

### "Failed to create story"
1. Check Edge Function logs in Supabase
2. Verify API key is set correctly
3. Make sure you have Anthropic credits

### Stories not loading
1. Check your internet connection
2. Verify Supabase URL and key in your `.env` file
3. Check browser console for errors (F12 → Console tab)

### "Command not found: supabase"
1. Close and reopen Terminal
2. Try: `npx supabase` instead of `supabase`

### Edge Function not showing in dashboard
1. Make sure you're in the correct project
2. Try deploying again: `supabase functions deploy generate-social-story`

---

## Summary Checklist

- [ ] Database schema created (SQL Editor)
- [ ] Anthropic account created
- [ ] Anthropic credits added ($5+)
- [ ] Anthropic API key created and copied
- [ ] Supabase CLI installed
- [ ] Logged into Supabase CLI
- [ ] Project linked
- [ ] Edge Function deployed
- [ ] API key secret set
- [ ] Test story created successfully!
