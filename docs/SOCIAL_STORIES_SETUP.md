# Social Stories Setup Guide

This guide covers setting up the Social Stories feature for Special Needs World.

## Overview

Social Stories are short, personalized visual narratives that help individuals with autism and special needs understand everyday situations. This feature uses Claude AI to generate custom stories based on user prompts.

## Features

- **AI-Generated Stories**: Claude creates personalized 6-page stories
- **Story Caching**: Previously generated stories are reused to save API calls
- **Favorites**: Users can save stories for quick access
- **Suggested Topics**: Pre-built topic suggestions for common situations
- **Flip Book Interface**: Touch-friendly story viewing with swipe support

## Setup Steps

### 1. Database Setup

Run the SQL file in Supabase SQL Editor:

```bash
# File: database/social-stories-setup.sql
```

This creates:
- `social_stories` - Stores generated stories with caching
- `user_saved_stories` - User favorites
- `story_generation_queue` - For async generation (optional)

### 2. Edge Function Deployment

Deploy the story generation function:

```bash
# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy generate-social-story

# Set the Anthropic API key
supabase secrets set ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. Environment Variables

**Supabase Edge Function Secrets:**
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

You can get an Anthropic API key from: https://console.anthropic.com/

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                               │
│                                                              │
│   User enters topic → Check cache → Generate if not found   │
│                              ↓                               │
└──────────────────────────────┼──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        Supabase                              │
│                                                              │
│  ┌─────────────────┐    ┌──────────────────────────────┐   │
│  │  social_stories │←───│    generate-social-story     │   │
│  │    (cache)      │    │      Edge Function           │   │
│  └─────────────────┘    │                              │   │
│                         │    Calls Claude API          │   │
│                         │    Returns story JSON        │   │
│                         └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Claude API       │
                    │  (Anthropic)        │
                    └─────────────────────┘
```

## Cost Considerations

- **Claude API costs**: ~$0.003-0.015 per story generated
- **Caching reduces costs**: Popular stories are reused
- **Seed data included**: 3 pre-built stories in the SQL

## Story Structure

Each story contains:
- 6-8 pages
- First-person narrative from character's perspective
- Simple, clear language
- Image descriptions for each page (for future illustration support)

Example page structure:
```json
{
  "pageNumber": 1,
  "text": "Sometimes I need to take a bath to stay clean and healthy.",
  "imageDescription": "A friendly child looking at a bathtub with warm water and bubbles"
}
```

## Local Fallback

If Supabase is not configured or API fails:
- Stories are generated using a simple template locally
- Stories are stored in localStorage
- Basic functionality preserved

## Future Enhancements

1. **AI Image Generation**: Generate illustrations using DALL-E or Stable Diffusion
2. **Text-to-Speech**: Read stories aloud
3. **Printable PDF**: Export stories for offline use
4. **Custom Characters**: Upload photos for personalized characters
5. **Story Sharing**: Share stories with other users

## Testing

1. Go to Activities → Social Stories
2. Enter a topic (e.g., "Going to the grocery store")
3. Click "Create Story"
4. Swipe through the generated story
5. Save to favorites

## Troubleshooting

### "Failed to create story"
- Check Edge Function logs in Supabase Dashboard
- Verify ANTHROPIC_API_KEY is set correctly
- Check API quota/limits

### Stories not saving
- Verify database tables exist
- Check RLS policies
- Verify user authentication

### Slow generation
- First-time stories take 5-10 seconds
- Cached stories load instantly
- Consider showing loading animation
