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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!script.trim()) {
      setError("Please paste a script or transcript first.");
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
    }
  }

  function handleCopy(shortScript: ShortScript) {
    const text = `${shortScript.hook}\n\n${shortScript.body.join(
      "\n"
    )}\n\n${shortScript.cta}`;
    navigator.clipboard.writeText(text);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-6 py-10">
        {/* HERO */}
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">
            Turn one long video into 3–15 Shorts in 30 seconds
          </h1>
          <p className="text-slate-300">
            Paste your YouTube script or transcript. Get ready-to-record Shorts, Reels, or
            TikToks with hooks, punchy lines, and CTAs.
          </p>
          <p className="text-sm text-slate-400 pt-1">
            Built for solo creators and tiny agencies who don&apos;t want to stare at a
            blank doc ever again.
          </p>
          <p className="text-sm text-slate-400 pt-1">
            Need more than 3?{" "}
            <a
              href="/pro"
              className="text-sky-400 underline underline-offset-2 hover:text-sky-300"
            >
              Try the Pro version (15 Shorts)
            </a>
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

        {/* HOW IT WORKS */}
        <section className="mt-4 border border-slate-800 rounded-lg p-4 bg-slate-900/60 space-y-2">
          <h2 className="text-sm font-semibold text-slate-100">
            How it works
          </h2>
          <ol className="list-decimal list-inside text-sm text-slate-300 space-y-1">
            <li>
              <span className="font-medium">Paste your script or transcript</span> – drop in a YouTube script, video notes, or a cleaned-up transcript.
            </li>
            <li>
              <span className="font-medium">Pick platform &amp; tone</span> – Shorts, Reels, TikTok + Educational, Storytelling, or Motivational.
            </li>
            <li>
              <span className="font-medium">Get ready-to-record scripts</span> – hooks, 3–6 punchy lines, and a clear CTA for each short.
            </li>
          </ol>
        </section>

        {/* UPGRADE CARD */}
        <section className="mt-4 border border-slate-800 rounded-lg p-4 bg-slate-900/60">
          <p className="text-sm text-slate-100">
            Want more than 3 Shorts per script?
          </p>
          <p className="text-xs text-slate-400 mt-1">
            The free version generates 3 Shorts. Pro users generate up to 15 Shorts per script
            and batch a whole week of content ideas in one go.
          </p>
          <a
            href="https://mrcapital.gumroad.com/l/shortskit-pro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center mt-3 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-400"
          >
            Get Pro Access
          </a>
        </section>

        {/* EXAMPLE BLOCK */}
        <section className="mt-6 border border-slate-800 rounded-lg p-4 bg-slate-900/60 space-y-3">
          <h2 className="text-sm font-semibold text-slate-100">
            See it in action (real example)
          </h2>
          <div className="space-y-2 text-sm text-slate-300">
            <p className="font-medium text-slate-200">
              Input (excerpt from a long-form script):
            </p>
            <p className="text-slate-400">
              &quot;Today we&apos;re talking about how to stay focused in a world of constant notifications.
              Most people try to fight distractions with willpower, but that never works for long.
              Instead, you need a simple system that makes distraction harder and deep work easier...&quot;
            </p>
          </div>
          <div className="space-y-2 text-sm text-slate-300">
            <p className="font-medium text-slate-200">
              One of the Shorts generated:
            </p>
            <p>
              <span className="font-semibold">Hook:</span> &quot;Your phone is the reason you can&apos;t focus more than 5 minutes.&quot;
            </p>
            <div>
              <p className="font-semibold">Body:</p>
              <ul className="list-disc list-inside text-slate-300">
                <li>Most people try to fight distraction with willpower.</li>
                <li>That&apos;s like bringing a spoon to a gunfight.</li>
                <li>You need a system that makes distraction harder by default.</li>
                <li>Here&apos;s the 10-second rule I use every day.</li>
              </ul>
            </div>
            <p>
              <span className="font-semibold">CTA:</span> &quot;Save this and use the 10-second rule before your next deep work session.&quot;
            </p>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="mt-6 space-y-2">
          <h2 className="text-sm font-semibold text-slate-100">
            Why use ShortsKit instead of doing it by hand?
          </h2>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
            <li>
              <span className="font-medium">Batch ideas fast</span> – turn one long script into a full week of Shorts ideas in one go.
            </li>
            <li>
              <span className="font-medium">No more blank docs</span> – start from strong hooks instead of staring at an empty page.
            </li>
            <li>
              <span className="font-medium">Keep your voice</span> – platform- and tone-aware outputs that still sound like a human, not a robot.
            </li>
            <li>
              <span className="font-medium">Built for real creators</span> – optimized for YouTube + short-form, not generic &quot;AI content&quot;.
            </li>
          </ul>
        </section>

        {/* GENERATED SHORTS RESULTS */}
        <section className="mt-6 space-y-4">
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

        {/* FAQ */}
        <section className="mt-8 space-y-3 border-t border-slate-800 pt-4">
          <h2 className="text-sm font-semibold text-slate-100">
            FAQ
          </h2>

          <div className="space-y-1 text-sm text-slate-300">
            <p className="font-medium">What do I paste?</p>
            <p>
              A YouTube script, video outline, cleaned-up transcript, or even a long Twitter thread.
              The clearer your input, the better the Shorts.
            </p>
          </div>

          <div className="space-y-1 text-sm text-slate-300">
            <p className="font-medium">Can I use this for TikTok and Reels too?</p>
            <p>
              Yes. Just select the platform in the dropdown. The structure works across all short-form platforms.
            </p>
          </div>

          <div className="space-y-1 text-sm text-slate-300">
            <p className="font-medium">Does Pro unlock better AI?</p>
            <p>
              Pro gives you more outputs per script (up to 15) so you can batch a full week or more of content at once.
            </p>
          </div>

          <div className="space-y-1 text-sm text-slate-300">
            <p className="font-medium">Do you store my scripts?</p>
            <p>
              Right now everything runs through the model and shows in your browser.
              I&apos;m not building a fancy account system yet.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
