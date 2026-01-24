/// generate-social-story/index.ts
// Supabase Edge Function to generate Social Stories using Claude API
// FIXED: Better error handling and response formatting
// DEPLOY WITH: supabase functions deploy generate-social-story --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// System prompt for Claude to generate social stories
const SYSTEM_PROMPT = `You are a specialist in creating Social Stories for children with autism and special needs. Social Stories were developed by Carol Gray to help individuals understand social situations.

Rules for creating Social Stories:
1. Use simple, clear language appropriate for children
2. Write from a second-person perspective ("you") to allow story reuse
3. Include descriptive sentences (what happens), perspective sentences (how people feel), and directive sentences (what to do)
4. Be positive and supportive - never scary or negative
5. Focus on building understanding, not compliance
6. Each page should have 1-2 short sentences
7. Include sensory details where appropriate (sounds, feelings)
8. Always end on a positive, encouraging note
9. Avoid idioms, metaphors, or figurative language
10. Be specific and concrete, not abstract

Also determine the story category from: daily, social, emotions, safety, school, health, general

Format your response as JSON with this structure:
{
  "title": "Story title",
  "category": "category_id",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Story text for this page",
      "imageDescription": "Simple description for an illustration",
      "emoji": "🏠"
    }
  ]
}

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, no explanation.`;

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { 
        status: 405, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }

  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const { topic, pageCount = 6, generateImages = false } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Topic is required and must be a non-empty string" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get API key from secrets
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicApiKey) {
      console.error("ANTHROPIC_API_KEY not configured");
      return new Response(
        JSON.stringify({ 
          error: "API key not configured",
          details: "Please set ANTHROPIC_API_KEY in Edge Function secrets"
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create the prompt
    const userPrompt = `Create a ${pageCount}-page Social Story about "${topic.trim()}".

The story should:
- Help the reader understand what to expect
- Include what they might see, hear, or feel
- Give simple guidance on what to do
- End with encouragement
- Use "you" instead of a character name so anyone can use the story

Return ONLY valid JSON with title, category, and pages array.`;

    console.log(`Generating story for topic: "${topic}"`);

    // Call Claude API
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
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

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error("Claude API error:", anthropicResponse.status, errorText);
      
      // Check for specific error types
      if (anthropicResponse.status === 401) {
        return new Response(
          JSON.stringify({ 
            error: "Invalid API key",
            details: "The Anthropic API key is invalid or expired"
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      if (anthropicResponse.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Rate limited",
            details: "Too many requests. Please try again in a moment."
          }),
          { 
            status: 429, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate story",
          details: `Claude API returned status ${anthropicResponse.status}`
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const anthropicData = await anthropicResponse.json();
    
    // Extract the text content
    const textContent = anthropicData.content?.find((c: any) => c.type === "text");
    if (!textContent?.text) {
      console.error("No text content in Claude response:", anthropicData);
      return new Response(
        JSON.stringify({ 
          error: "Invalid response from Claude",
          details: "No text content was returned"
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Parse the JSON response
    let storyData;
    try {
      // Clean up the response - remove any markdown code blocks if present
      let cleanedText = textContent.text.trim();
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.slice(7);
      }
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.slice(0, -3);
      }
      cleanedText = cleanedText.trim();
      
      storyData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse Claude response:", textContent.text);
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse story data",
          details: "Claude returned invalid JSON",
          raw: textContent.text.substring(0, 200)
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Validate story structure
    if (!storyData.pages || !Array.isArray(storyData.pages) || storyData.pages.length === 0) {
      console.error("Invalid story structure:", storyData);
      return new Response(
        JSON.stringify({ 
          error: "Invalid story structure",
          details: "Story must have a pages array"
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Ensure each page has required fields
    const validatedPages = storyData.pages.map((page: any, index: number) => ({
      pageNumber: page.pageNumber || index + 1,
      text: page.text || "",
      imageDescription: page.imageDescription || "",
      emoji: page.emoji || "📖",
      imageUrl: null,
      imageGenerated: false,
    }));

    console.log(`Successfully generated ${validatedPages.length} page story for "${topic}"`);

    // Return the story
    return new Response(
      JSON.stringify({
        success: true,
        title: storyData.title || `Story about ${topic}`,
        category: storyData.category || "general",
        pages: validatedPages,
        imagesGenerated: 0, // Image generation not implemented yet
        insufficientCredits: false,
        message: "Story generated successfully!",
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error.message || "An unexpected error occurred"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
