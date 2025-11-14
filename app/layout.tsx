import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShortsKit – Turn one script into 15 Shorts",
  description:
    "Paste your YouTube script or transcript and get ready-to-record Shorts, Reels, or TikToks with hooks, punchy lines, and CTAs.",
  openGraph: {
    title: "ShortsKit – Turn one script into 15 Shorts",
    description:
      "Turn a single long-form video script into a batch of short-form scripts in 30 seconds.",
    url: "https://shortskit.vercel.app", // 🔁 change if your live URL is different
    siteName: "ShortsKit",
    images: [
      {
        url: "/shortskit-icon.png", // or your og image, e.g. /shortskit-og.png
        width: 1200,
        height: 630,
        alt: "ShortsKit app – turn one script into multiple Shorts",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShortsKit – Turn one script into 15 Shorts",
    description:
      "Paste your YouTube script or transcript and get ready-to-record Shorts scripts with hooks and CTAs.",
    images: ["/shortskit-icon.png"], // or /shortskit-og.png if you made a wide image
  },
  // 👇 This replaces the favicon.io <link> tags
  icons: {
    icon: [
      // default favicon
      { url: "/favicon.ico" },
      // PNG favicons from favicon.io folder
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicon_io/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/favicon_io/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
