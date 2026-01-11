# Google OAuth Setup Guide for Special Needs World

## Overview

This guide walks you through setting up Google Sign-In for your Special Needs World app using Supabase authentication.

---

## Part 1: Google Cloud Console Setup

### Step 1: Create or Select a Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click **"New Project"** or select an existing project
4. Name it: `Special Needs World` (or similar)
5. Click **Create**

### Step 2: Configure OAuth Consent Screen

1. In the left sidebar, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (unless you have Google Workspace)
3. Click **Create**

Fill in the form:

| Field | Value |
|-------|-------|
| App name | `Special Needs World` |
| User support email | Your email |
| App logo | Upload your logo (optional) |
| App domain | Your production URL (e.g., `https://special-needs-world.netlify.app`) |
| Developer contact email | Your email |

4. Click **Save and Continue**

### Step 3: Add Scopes

1. Click **Add or Remove Scopes**
2. Select these scopes:
   - `email`
   - `profile`
   - `openid`
3. Click **Update**
4. Click **Save and Continue**

### Step 4: Add Test Users (Development Only)

1. While in "Testing" mode, add your email as a test user
2. Click **Save and Continue**

### Step 5: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Select **Web application**

Fill in:

| Field | Value |
|-------|-------|
| Name | `Special Needs World Web Client` |
| Authorized JavaScript origins | See below |
| Authorized redirect URIs | See below |

**Authorized JavaScript Origins:**
```
http://localhost:5173
http://localhost:3000
https://your-app.netlify.app
https://your-custom-domain.com
```

**Authorized Redirect URIs:**
```
https://gwcfqhfxqkzztxrfwsed.supabase.co/auth/v1/callback
```

> ⚠️ **Important**: Replace `gwcfqhfxqkzztxrfwsed` with your actual Supabase project reference ID

4. Click **Create**
5. **Copy the Client ID and Client Secret** - you'll need these next!

---

## Part 2: Supabase Configuration

### Step 1: Enable Google Provider

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** and click to expand
5. Toggle **Enable Sign in with Google** to ON

### Step 2: Enter Google Credentials

| Field | Value |
|-------|-------|
| Client ID | Paste from Google Cloud Console |
| Client Secret | Paste from Google Cloud Console |

6. Click **Save**

### Step 3: Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Set the following:

| Field | Value |
|-------|-------|
| Site URL | `https://your-app.netlify.app` (your production URL) |
| Redirect URLs | Add all these: |

**Redirect URLs to add:**
```
http://localhost:5173/**
http://localhost:3000/**
https://your-app.netlify.app/**
https://your-custom-domain.com/**
```

3. Click **Save**

---

## Part 3: Verify Your Setup

### Test Checklist

- [ ] Google Cloud Console project created
- [ ] OAuth consent screen configured
- [ ] OAuth credentials created
- [ ] Client ID and Secret copied
- [ ] Supabase Google provider enabled
- [ ] Credentials entered in Supabase
- [ ] Redirect URLs configured in Supabase
- [ ] App deployed with updated code

### Testing Locally

1. Run your app: `npm run dev`
2. Click "Sign in with Google"
3. You should see the Google sign-in popup
4. After signing in, you should be redirected to `/hub`

### Common Issues

**Error: "redirect_uri_mismatch"**
- Make sure the redirect URI in Google Cloud Console exactly matches:
  `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
- Check for trailing slashes

**Error: "Access blocked: This app's request is invalid"**
- Check that your OAuth consent screen is properly configured
- Make sure you added your email as a test user (during development)

**Error: "Invalid client"**
- Double-check that you copied the Client ID and Secret correctly
- Make sure there are no extra spaces

**Popup closes immediately**
- Check browser console for errors
- Make sure popups aren't blocked
- Try using redirect mode instead of popup

---

## Part 4: Going to Production

### Publish Your OAuth App

1. In Google Cloud Console, go to **OAuth consent screen**
2. Click **Publish App**
3. This allows anyone with a Google account to sign in

### Update URLs

Make sure all production URLs are added to:
- Google Cloud Console → Authorized JavaScript origins
- Google Cloud Console → Authorized redirect URIs
- Supabase → Authentication → URL Configuration

---

## Environment Variables Summary

### Local Development (`.env`)
```env
VITE_SUPABASE_URL=https://gwcfqhfxqkzztxrfwsed.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Netlify Production
Add these in Netlify Dashboard → Site Settings → Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Quick Reference

| Service | URL |
|---------|-----|
| Google Cloud Console | https://console.cloud.google.com |
| Supabase Dashboard | https://supabase.com/dashboard |
| Your Supabase Auth Callback | `https://gwcfqhfxqkzztxrfwsed.supabase.co/auth/v1/callback` |

---

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all URLs match exactly
3. Test with an incognito/private window
4. Clear browser cache and cookies
