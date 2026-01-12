// supabase/functions/generate-pronunciation-content/index.ts
// Edge Function to generate new pronunciation categories and words using Claude API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateCategoryRequest {
  type: 'category';
  categoryName: string;
  description?: string;
}

interface GenerateWordsRequest {
  type: 'words';
  categoryId: string;
  categoryName: string;
  existingWords: string[];
  count?: number;
}

type RequestBody = GenerateCategoryRequest | GenerateWordsRequest;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);
    
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    const body: RequestBody = await req.json();

    if (body.type === 'category') {
      // Generate a new category with words
      return await generateCategory(body, ANTHROPIC_API_KEY, supabase, userId);
    } else if (body.type === 'words') {
      // Generate additional words for existing category
      return await generateWords(body, ANTHROPIC_API_KEY, supabase);
    } else {
      throw new Error('Invalid request type');
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate content' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function generateCategory(
  request: GenerateCategoryRequest,
  apiKey: string,
  supabase: any,
  userId: string | null
) {
  const { categoryName, description } = request;

  // Check if category already exists
  const { data: existing } = await supabase
    .from('pronunciation_categories')
    .select('id, name')
    .ilike('name', categoryName)
    .single();

  if (existing) {
    // Return existing category with its words
    const { data: words } = await supabase
      .from('pronunciation_words')
      .select('*')
      .eq('category_id', existing.id);

    return new Response(
      JSON.stringify({ 
        category: existing,
        words: words || [],
        fromCache: true,
        message: 'Category already exists'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Generate new category with Claude
  const prompt = `Generate a pronunciation practice category for children with special needs.

Category requested: "${categoryName}"
${description ? `Description: ${description}` : ''}

Please generate:
1. A suitable emoji for this category
2. A hex color code that fits the theme
3. A short description (under 50 characters)
4. 10-15 simple, common words that fit this category

Requirements for words:
- Single words only (1-2 syllables preferred for beginners)
- Common, everyday vocabulary
- Age-appropriate for children
- Include a helpful hint for each word
- Assign difficulty: 1 (easy), 2 (medium), or 3 (hard)

Respond in this exact JSON format:
{
  "emoji": "🎯",
  "color": "#4A9FD4",
  "description": "Short description here",
  "words": [
    {"word": "example", "hint": "A helpful hint", "difficulty": 1},
    ...
  ]
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: prompt }
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse Claude response');
  }

  const generated = JSON.parse(jsonMatch[0]);

  // Save category to database
  const { data: newCategory, error: categoryError } = await supabase
    .from('pronunciation_categories')
    .insert({
      name: categoryName,
      emoji: generated.emoji,
      color: generated.color,
      description: generated.description,
      is_default: false,
      created_by: userId,
    })
    .select()
    .single();

  if (categoryError) {
    throw new Error(`Failed to save category: ${categoryError.message}`);
  }

  // Save words to database
  const wordsToInsert = generated.words.map((w: any) => ({
    category_id: newCategory.id,
    word: w.word.toLowerCase(),
    hint: w.hint,
    difficulty: w.difficulty || 1,
  }));

  const { data: savedWords, error: wordsError } = await supabase
    .from('pronunciation_words')
    .insert(wordsToInsert)
    .select();

  if (wordsError) {
    console.error('Failed to save some words:', wordsError);
  }

  return new Response(
    JSON.stringify({
      category: newCategory,
      words: savedWords || [],
      fromCache: false,
      message: 'New category created successfully'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateWords(
  request: GenerateWordsRequest,
  apiKey: string,
  supabase: any
) {
  const { categoryId, categoryName, existingWords, count = 10 } = request;

  const prompt = `Generate ${count} NEW words for a pronunciation practice category.

Category: "${categoryName}"
Existing words (DO NOT repeat these): ${existingWords.join(', ')}

Requirements:
- Single words only (1-2 syllables preferred)
- Common, everyday vocabulary
- Age-appropriate for children with special needs
- Must be DIFFERENT from the existing words listed above
- Include a helpful hint for each word
- Assign difficulty: 1 (easy), 2 (medium), or 3 (hard)

Respond in this exact JSON format:
{
  "words": [
    {"word": "example", "hint": "A helpful hint", "difficulty": 1},
    ...
  ]
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: prompt }
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse Claude response');
  }

  const generated = JSON.parse(jsonMatch[0]);

  // Filter out any words that might still be duplicates
  const existingLower = existingWords.map(w => w.toLowerCase());
  const newWords = generated.words.filter(
    (w: any) => !existingLower.includes(w.word.toLowerCase())
  );

  // Save new words to database
  const wordsToInsert = newWords.map((w: any) => ({
    category_id: categoryId,
    word: w.word.toLowerCase(),
    hint: w.hint,
    difficulty: w.difficulty || 1,
  }));

  const { data: savedWords, error: wordsError } = await supabase
    .from('pronunciation_words')
    .insert(wordsToInsert)
    .select();

  if (wordsError) {
    // Some words might already exist, that's okay
    console.error('Some words may not have been saved:', wordsError);
  }

  return new Response(
    JSON.stringify({
      words: savedWords || [],
      message: `Added ${savedWords?.length || 0} new words`
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
