// generate-coloring-page/index.ts
// Supabase Edge Function to generate SVG coloring pages using Claude API
// Deploy with: supabase functions deploy generate-coloring-page

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompt for Claude to generate coloring page SVGs
const SYSTEM_PROMPT = `You are an expert at creating simple SVG coloring pages for children. Your SVGs should be:

1. SIMPLE - Use basic shapes (circles, rectangles, ellipses, paths)
2. CLEAR OUTLINES - Black strokes (stroke-width="3") with white fills
3. COLORABLE - Each shape should have: fill="white" stroke="black" data-colorable="true"
4. CHILD-FRIENDLY - Age-appropriate, fun, and recognizable
5. PROPER SIZE - Use viewBox="0 0 400 400" for square designs

Structure rules:
- Start with <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
- Give each colorable shape a unique id (e.g., id="body", id="head")
- Use simple paths, not complex curves
- Keep shapes large and easy to tap/click
- Maximum 15-20 shapes per design
- All colorable elements must have: data-colorable="true"

IMPORTANT: Return ONLY the SVG code, no markdown, no explanation, no backticks.`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, category = "general" } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
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

    // Create the user prompt
    const userPrompt = `Create a simple SVG coloring page of: "${prompt}"

Requirements:
- Simple, child-friendly design
- Clear black outlines (stroke-width="3")
- White fills ready to be colored
- Each shape must have data-colorable="true" attribute
- Use viewBox="0 0 400 400"
- Keep it simple with 10-15 shapes maximum

Return ONLY the SVG code, nothing else.`;

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
        max_tokens: 4000,
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
        JSON.stringify({ error: "Failed to generate coloring page" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    let svgContent = data.content[0]?.text;

    if (!svgContent) {
      return new Response(
        JSON.stringify({ error: "No content generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clean up the response - remove any markdown formatting
    svgContent = svgContent
      .replace(/```svg\n?/g, "")
      .replace(/```xml\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Validate it's actually SVG
    if (!svgContent.includes("<svg") || !svgContent.includes("</svg>")) {
      console.error("Invalid SVG:", svgContent);
      return new Response(
        JSON.stringify({ error: "Generated content is not valid SVG" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        svg_content: svgContent,
        prompt,
        category,
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
