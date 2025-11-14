import { NextResponse } from "next/server";


type ShortScript = {
  hook: string;
  body: string[];
  cta: string;
};

export async function POST(req: Request) {

    // Wire the frontend to the API
  try {
    const { script, platform, tone, count } = await req.json();

    if (!script || !script.trim()) {
      return NextResponse.json(
        { error: "Missing script content." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY on the server." },
        { status: 500 }
      );
    } 



    const safeCount = Math.min(Math.max(Number(count) || 3, 1), 20);

    const systemPrompt = `
You are an expert short-form content writer. 
You turn long YouTube scripts or transcripts into multiple short-form video scripts for platforms like YouTube Shorts, TikTok, and Instagram Reels.
You write viral hooks, concise bodies, and clear CTAs.
Always respond with ONLY valid JSON, no extra text.
The JSON must be an array of objects like:
[
  {
    "hook": "string",
    "body": ["line 1", "line 2"],
    "cta": "string"
  }
]
Each body line should be short and punchy (max ~15 words).
    `.trim();

    const userPrompt = `
Here is a long-form script or transcript:
---
${script}
---
Platform: ${platform}
Tone/style: ${tone}

Generate ${safeCount} short-form video scripts.

For each one, create:
- "hook": a scroll-stopping hook, max 15 words.
- "body": an array of 3-6 short lines (each under 15 words).
- "cta": one clear call-to-action line.

Return ONLY a JSON array with objects of shape:
{ "hook": string, "body": string[], "cta": string }
No explanation, no markdown, just the JSON.
    `.trim();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return NextResponse.json(
        { error: "Failed to generate shorts from OpenAI." },
        { status: 500 }
      );
    }

    const data = await response.json();

    const content =
      data.choices?.[0]?.message?.content ||
      "[]";

    let shorts: ShortScript[] = [];
    try {
      shorts = JSON.parse(content);
    } catch (e) {
      console.error("JSON parse error from OpenAI:", content);
      return NextResponse.json(
        { error: "Failed to parse AI response." },
        { status: 500 }
      );
    }

    return NextResponse.json({ shorts });
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}