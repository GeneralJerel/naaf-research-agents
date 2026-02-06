const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { country } = await req.json();

    if (!country) {
      return new Response(
        JSON.stringify({ error: 'Country is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'AI gateway not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are a news analyst specializing in AI policy, technology, and industry developments. Return ONLY valid JSON — no markdown, no code fences. Today is ${today}.`,
          },
          {
            role: 'user',
            content: `Give me 6 recent and notable AI-related news items about ${country}. Cover topics like: government AI policy, major AI company announcements, AI research breakthroughs, AI regulation, AI infrastructure investments, and AI workforce developments.

Return a JSON array where each item has:
- "title": concise headline (max 15 words)
- "summary": 2-3 sentence summary
- "category": one of "Policy", "Industry", "Research", "Regulation", "Infrastructure", "Workforce"
- "date": approximate date in YYYY-MM-DD format (should be recent, within last 3 months)
- "source": plausible source name (e.g. "Reuters", "TechCrunch", "Government Press Release")

Return ONLY the JSON array, nothing else.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI Gateway error:', errText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch news' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '[]';

    // Parse the JSON from the AI response
    let news;
    try {
      // Strip potential markdown fences
      const cleaned = content.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
      news = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse AI response:', content);
      news = [];
    }

    return new Response(
      JSON.stringify({ news }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
