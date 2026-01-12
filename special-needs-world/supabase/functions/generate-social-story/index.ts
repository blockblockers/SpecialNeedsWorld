// generate-social-story/index.ts
// Supabase Edge Function to generate Social Stories using Claude API
// Deploy with: supabase functions deploy generate-social-story

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompt for Claude to generate social stories
const SYSTEM_PROMPT = `You are a specialist in creating Social Stories for children with autism and special needs. Social Stories were developed by Carol Gray to help individuals understand social situations.

Rules for creating Social Stories:
1. Use simple, clear language appropriate for children
2. Write from a first-person perspective using the character's name
3. Include descriptive sentences (what happens), perspective sentences (how people feel), and directive sentences (what to do)
4. Be positive and supportive - never scary or negative
5. Focus on building understanding, not compliance
6. Each page should have 1-2 short sentences
7. Include sensory details where appropriate (sounds, feelings)
8. Always end on a positive, encouraging note
9. Avoid idioms, metaphors, or figurative language
10. Be specific and concrete, not abstract

Format your response as a JSON array of pages, each with:
- pageNumber: number
- text: the story text for that page (1-2 sentences)
- imageDescription: a simple description for an illustration (child-friendly, cartoon style)

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, characterName = "Sam", ageGroup = "child", pageCount = 6 } = await req.json();

    if (!topic) {
      return new Response(
        JSON.stringify({ error: "Topic is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the prompt
    const userPrompt = `Create a ${pageCount}-page Social Story about "${topic}" for a ${ageGroup}. 
The main character's name is ${characterName}.

The story should:
- Help ${characterName} understand what to expect
- Include what ${characterName} might see, hear, or feel
- Give simple guidance on what to do
- End with encouragement

Return ONLY a JSON array like this:
[
  {"pageNumber": 1, "text": "Story text here.", "imageDescription": "Description for illustration"},
  ...
]`;

    // Call Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Claude API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to generate story" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No content generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response
    let pages;
    try {
      // Clean up any markdown formatting
      const cleanContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      pages = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse story:", parseError, content);
      return new Response(
        JSON.stringify({ error: "Failed to parse generated story" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate pages structure
    if (!Array.isArray(pages) || pages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid story format" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        topic,
        characterName,
        pages,
        generatedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
