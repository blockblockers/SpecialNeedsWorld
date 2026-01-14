# ATLASassist Domain Change Guide

## Changing to atlasassist.netlify.app

Follow these steps to update your deployment from the old domain to `atlasassist.netlify.app`.

---

## 1. NETLIFY CONFIGURATION

### Change Site Name
1. Go to **Netlify Dashboard** → Your Site
2. Click **Site configuration** (or Site settings)
3. Under **Site details** → **Site information**
4. Click **Change site name**
5. Enter: `atlasassist`
6. Click **Save**

Your site will now be at: `https://atlasassist.netlify.app`

### Update Build Settings (if needed)
1. Go to **Build & deploy** → **Build settings**
2. Ensure these settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

---

## 2. SUPABASE CONFIGURATION

### Update Redirect URLs
1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **URL Configuration**
3. Update **Site URL**:
   ```
   https://atlasassist.netlify.app
   ```
4. Update **Redirect URLs** (add these):
   ```
   https://atlasassist.netlify.app/**
   https://atlasassist.netlify.app/auth/callback
   http://localhost:5173/**
   ```
5. Remove old URLs (if any):
   - Remove any `specialneedsworld` URLs
6. Click **Save**

### Update Email Templates (if customized)
1. Go to **Authentication** → **Email Templates**
2. If you have custom templates, update any URLs from old domain to:
   ```
   https://atlasassist.netlify.app
   ```

---

## 3. GOOGLE OAUTH CONFIGURATION

### Update Google Cloud Console
1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID**

### Update Authorized JavaScript Origins
Add:
```
https://atlasassist.netlify.app
```
Remove old domain if present.

### Update Authorized Redirect URIs
Keep your Supabase callback URL (it stays the same):
```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

Note: The Supabase callback URL doesn't change - only the JavaScript origins need updating.

5. Click **Save**

---

## 4. UPDATE YOUR CODE (if not already done)

### index.html
Update Open Graph URLs:
```html
<meta property="og:url" content="https://atlasassist.netlify.app/" />
<meta name="twitter:url" content="https://atlasassist.netlify.app/" />
```

### Already Updated Files:
- ✅ package.json (name: "atlasassist")
- ✅ manifest.webmanifest (name: "ATLASassist")
- ✅ index.html (title, meta tags)
- ✅ All React components

---

## 5. ENVIRONMENT VARIABLES

### Netlify Environment Variables
1. Go to **Site configuration** → **Environment variables**
2. Verify these are set:
   ```
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### Local Development (.env)
Update your `.env` file if you reference the production URL anywhere:
```
VITE_APP_URL=https://atlasassist.netlify.app
```

---

## 6. REDEPLOY

### Trigger New Deployment
1. Push your changes to GitHub (if using Git):
   ```bash
   git add .
   git commit -m "Rebrand to ATLASassist"
   git push
   ```
2. Or manually trigger in Netlify:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

---

## 7. POST-DEPLOYMENT CHECKLIST

### Test Authentication Flow
- [ ] Test Google Sign-In
- [ ] Test Email Sign-Up
- [ ] Test Email Sign-In
- [ ] Test Password Reset

### Test PWA
- [ ] Verify manifest loads correctly
- [ ] Test "Add to Home Screen" on mobile
- [ ] Check service worker registration

### Verify Redirects
- [ ] Old URLs redirect properly (if you set up redirects)
- [ ] Auth callbacks work
- [ ] Deep links work

---

## 8. OPTIONAL: CUSTOM DOMAIN

If you want a custom domain like `atlasassist.com`:

### Netlify Custom Domain
1. Go to **Domain management**
2. Click **Add custom domain**
3. Enter your domain
4. Follow DNS configuration instructions

### Update All Services
If using a custom domain, update URLs in:
- Supabase URL Configuration
- Google OAuth credentials
- index.html meta tags

---

## TROUBLESHOOTING

### OAuth "redirect_uri_mismatch" Error
- Ensure the exact URL is in Google Console authorized origins
- Check for trailing slashes
- Wait 5 minutes for Google changes to propagate

### Supabase Auth Not Working
- Verify Site URL matches exactly
- Check Redirect URLs include wildcards (`/**`)
- Clear browser cookies and try again

### PWA Not Updating
- Clear site data in browser
- Uninstall and reinstall PWA
- Check service worker is registered

---

## SUMMARY OF URLs TO UPDATE

| Service | Setting | New Value |
|---------|---------|-----------|
| Netlify | Site name | `atlasassist` |
| Supabase | Site URL | `https://atlasassist.netlify.app` |
| Supabase | Redirect URLs | `https://atlasassist.netlify.app/**` |
| Google OAuth | JS Origins | `https://atlasassist.netlify.app` |
| Google OAuth | Redirect URIs | (Supabase callback - no change) |
