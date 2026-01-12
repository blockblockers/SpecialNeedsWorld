-- ============================================
-- SUPABASE AUTHENTICATION SETUP
-- ============================================
-- Additional configuration for authentication providers
-- Configure these in Supabase Dashboard > Authentication > Providers

/*
============================================
GOOGLE OAUTH SETUP
============================================

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or select existing
3. Go to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: Special Needs World
   - Authorized JavaScript origins: 
     - http://localhost:3000 (development)
     - https://your-domain.com (production)
   - Authorized redirect URIs:
     - https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback

5. Copy Client ID and Client Secret
6. In Supabase Dashboard > Authentication > Providers > Google:
   - Enable Google
   - Paste Client ID and Client Secret
   - Save

============================================
APPLE SIGN IN SETUP (for iOS)
============================================

1. Go to Apple Developer Portal: https://developer.apple.com/
2. Certificates, Identifiers & Profiles > Identifiers
3. Register a new App ID with Sign In with Apple capability
4. Create a Services ID for web authentication
5. Configure domains and redirect URLs
6. Generate a private key for Sign In with Apple
7. In Supabase Dashboard > Authentication > Providers > Apple:
   - Enable Apple
   - Add Service ID, Team ID, Key ID, and Private Key
   - Save

============================================
EMAIL TEMPLATES (Customize in Dashboard)
============================================

Go to Supabase Dashboard > Authentication > Email Templates

Customize:
- Confirm signup
- Invite user  
- Magic Link
- Change Email Address
- Reset Password

============================================
URL CONFIGURATION
============================================

Go to Supabase Dashboard > Authentication > URL Configuration

Set:
- Site URL: https://your-production-domain.com
- Redirect URLs:
  - http://localhost:3000/** (development)
  - https://your-domain.com/** (production)
  - https://your-app.netlify.app/** (if using Netlify)

*/

-- ============================================
-- ENVIRONMENT VARIABLES NEEDED
-- ============================================
-- Create a .env file in your project root with:

/*
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For admin operations (keep secret, never expose to client)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Find these values in:
# Supabase Dashboard > Settings > API
*/

-- ============================================
-- ROW LEVEL SECURITY VERIFICATION
-- ============================================
-- Run this to verify all RLS policies are correctly set up:

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- HELPFUL ADMIN QUERIES
-- ============================================

-- Get all users with their profile info
-- (Run as service_role, not in client)
/*
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created,
  p.display_name,
  p.role,
  p.created_at as profile_created
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
*/

-- Get usage statistics
/*
SELECT 
  (SELECT COUNT(*) FROM public.profiles) as total_users,
  (SELECT COUNT(*) FROM public.schedules) as total_schedules,
  (SELECT COUNT(*) FROM public.custom_images) as total_custom_images,
  (SELECT COUNT(*) FROM public.aac_boards WHERE is_shared = false) as custom_aac_boards,
  (SELECT COUNT(*) FROM public.schedule_completions WHERE date = CURRENT_DATE) as completions_today;
*/

-- Get most used AAC buttons (last 30 days)
/*
SELECT 
  button_text,
  COUNT(*) as usage_count
FROM public.aac_usage_log
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY button_text
ORDER BY usage_count DESC
LIMIT 20;
*/
