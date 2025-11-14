"use client";

import { FormEvent, useState } from "react";

type ShortScript = {
  hook: string;
  body: string[];
  cta: string;
};

export default function Home() {
  const [script, setScript] = useState("");
  const [platform, setPlatform] = useState("YouTube Shorts");
  const [tone, setTone] = useState("Educational");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ShortScript[]>([]);

  // For now, this is a FAKE generator (no AI yet) so you can see the UI working.
  function generateDummyShorts(): ShortScript[] {
    return [
      {
        hook: "Stop scrolling if you want to focus better.",
        body: [
          "Most people waste their best hours on random content.",
          "You can flip that with one simple rule.",
          "Turn your phone into a tool, not a distraction.",
        ],
        cta: "Follow for more short focus tactics you can use today.",
      },
      {
        hook: "You’re one habit away from doubling your output.",
        body: [
          "High performers don’t rely on motivation.",
          "They rely on boring, repeatable systems.",
          "You can build one in 10 minutes tonight.",
        ],
        cta: "Save this and try the 10-minute system tonight.",
      },
      {
        hook: "Here’s how to make your next video 10x easier to record.",
        body: [
          "Most creators improvise every line and burn out.",
          "Break your idea into 3 bullets before you press record.",
          "Each bullet becomes one clean, confident line.",
        ],
        cta: "Use this on your next video and tell me if it helped.",
      },
    ];
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!script.trim()) {
      setError("Please paste a script or transcript first.");
      return;
    }

    setError(null);
    setLoading(true);
    setResults([]);

    // API Short Generation Call via OpenAI API key
        try {
      const res = await fetch("/api/generate-shorts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script,
          platform,
          tone,
          count: 3, // free version: 3 shorts
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate shorts.");
        setLoading(false);
        return;
      }

      setResults(data.shorts || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }}


  function handleCopy(shortScript: ShortScript) {
    const text = `${shortScript.hook}\n\n${shortScript.body.join(
      "\n"
    )}\n\n${shortScript.cta}`;
    navigator.clipboard.writeText(text);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-6 py-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">
            Turn one video into Shorts in 30 seconds
          </h1>
          <p className="text-slate-300">
            Paste your script or transcript. Get short-form scripts with hooks &amp; CTAs.
          </p>
          <p className="text-sm text-slate-400 pt-1">
            Need more than 3?{" "}
            <a
              href="https://mrcapital.gumroad.com/l/shortskit-pro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center mt-3 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-400"
            >
              Get Pro Access
            </a>
          </p>
        </header>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Script or transcript
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="w-full h-40 rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Paste your YouTube script or transcript here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
              >
                <option>YouTube Shorts</option>
                <option>TikTok</option>
                <option>Instagram Reels</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
              >
                <option>Educational</option>
                <option>Storytelling</option>
                <option>Motivational</option>
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate 3 Shorts (demo)"}
          </button>
        </form>

        <section className="space-y-4">
          {results.length > 0 && (
            <h2 className="text-xl font-semibold">Generated Shorts</h2>
          )}
          <div className="space-y-3">
            {results.map((short, idx) => (
              <div
                key={idx}
                className="border border-slate-800 rounded-lg p-4 bg-slate-900/60"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-sky-400">
                      Short #{idx + 1}
                    </p>
                    <p className="mt-1 font-semibold">{short.hook}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(short)}
                    className="text-xs border border-slate-700 rounded px-2 py-1 hover:bg-slate-800"
                    type="button"
                  >
                    Copy
                  </button>
                </div>
                <div className="mt-3 space-y-1 text-sm text-slate-200">
                  {short.body.map((line, i) => (
                    <p key={i}>• {line}</p>
                  ))}
                </div>
                <p className="mt-3 text-sm font-medium text-sky-300">
                  CTA: {short.cta}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
} 
