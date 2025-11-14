"use client";

import { FormEvent, useState } from "react";

type ShortScript = {
  hook: string;
  body: string[];
  cta: string;
};

const MAX_PRO_RUNS_PER_DAY = 100;

function getTodayKey() {
  const today = new Date().toISOString().slice(0, 10); // e.g. "2025-11-14"
  return `shortskit_pro_runs_${today}`;
}

function getRunsToday(): number {
  if (typeof window === "undefined") return 0;
  const key = getTodayKey();
  const value = window.localStorage.getItem(key);
  return value ? Number(value) || 0 : 0;
}

function incrementRunsToday() {
  if (typeof window === "undefined") return;
  const key = getTodayKey();
  const current = getRunsToday();
  window.localStorage.setItem(key, String(current + 1));
}

export default function ProPage() {
  const [script, setScript] = useState("");
  const [platform, setPlatform] = useState("YouTube Shorts");
  const [tone, setTone] = useState("Educational");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ShortScript[]>([]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!script.trim()) {
      setError("Please paste a script or transcript first.");
      return;
    }

    const runs = getRunsToday();
    if (runs >= MAX_PRO_RUNS_PER_DAY) {
      setError(
        "You’ve hit today’s fair use limit for Pro generations. Please try again tomorrow."
      );
      return;
    }

    setError(null);
    setLoading(true);
    setResults([]);

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
          count: 15, // PRO VERSION: up to 15 shorts
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate shorts.");
        setLoading(false);
        return;
      }

      setResults(data.shorts || []);
      incrementRunsToday();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(shortScript: ShortScript) {
    const text = `${shortScript.hook}\n\n${shortScript.body.join(
      "\n"
    )}\n\n${shortScript.cta}`;
    navigator.clipboard.writeText(text);
  }

  const runsToday = typeof window !== "undefined" ? getRunsToday() : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-6 py-10">
        {/* PRO HERO */}
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">
              ShortsKit Pro
            </span>
            <span className="text-[10px] uppercase tracking-wide text-emerald-200/80">
              You&apos;re a Pro user 🎯
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">
              Turn one long video into up to 15 Shorts in 30 seconds
            </h1>
            <p className="text-slate-300">
              Paste your YouTube script or transcript. Generate a batch of Shorts,
              Reels, or TikToks with hooks, punchy lines, and CTAs — all in one go.
            </p>
          </div>

          <p className="text-[11px] text-slate-500">
            This is your personal Pro workspace. Please don&apos;t share this link
            publicly.
          </p>

          <p className="text-[11px] text-slate-500">
            Fair use: up to {MAX_PRO_RUNS_PER_DAY} Pro generations per day per browser.
            You&apos;ve used <span className="font-semibold">{runsToday}</span> today.
          </p>

          <p className="text-xs text-slate-500">
            Need to test quickly with fewer ideas?{" "}
            <a
              href="/"
              className="text-sky-400 underline underline-offset-2 hover:text-sky-300"
            >
              Use the free 3-shorts version
            </a>
            .
          </p>
        </header>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Script or transcript
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="w-full h-40 rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate up to 15 Shorts (Pro)"}
          </button>
        </form>

        {/* PRO INFO */}
        <section className="mt-4 border border-emerald-500/30 rounded-lg p-4 bg-slate-900/70 space-y-2">
          <h2 className="text-sm font-semibold text-emerald-300">
            Pro perks
          </h2>
          <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
            <li>
              Batch up to{" "}
              <span className="font-medium">15 Shorts per script</span> so one video
              can cover a whole week of content.
            </li>
            <li>
              Explore multiple hooks and angles for the same idea to find the most
              viral take.
            </li>
            <li>
              Perfect for editors and tiny agencies running channels for multiple
              clients.
            </li>
          </ul>
        </section>

        {/* GENERATED SHORTS RESULTS */}
        <section className="mt-6 space-y-4">
          {results.length > 0 && (
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-xl font-semibold">Generated Shorts</h2>
              <p className="text-xs text-slate-400">
                Showing {results.length} Shorts from this script
              </p>
            </div>
          )}
          <div className="space-y-3">
            {results.map((short, idx) => (
              <div
                key={idx}
                className="border border-slate-800 rounded-lg p-4 bg-slate-900/60"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-emerald-400">
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
                <p className="mt-3 text-sm font-medium text-emerald-300">
                  CTA: {short.cta}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SMALL NOTE */}
        <section className="mt-6 space-y-2 text-xs text-slate-500 border-t border-slate-800 pt-4">
          <p>
            Tip: Run the same script with different tones (Educational vs Storytelling
            vs Motivational) to get multiple angles for the same core idea.
          </p>
          <p>
            You can also paste outlines or cleaned-up transcripts – the clearer your
            input, the better your Shorts scripts.
          </p>
        </section>
      </div>
    </main>
  );
}
