import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";

export const metadata: Metadata = {
  title: "DEVLOG_ARCHIVE — Nadhem Jbeli",
  description:
    "Technical writing on Backend Engineering, Distributed Systems, and AI microservices by Nadhem Jbeli.",
};

export const dynamic = "force-dynamic";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).replace(/ /g, ".").toUpperCase();
}

export default async function BlogPage() {
  await connectDB();
  const posts = await Post.find({ published: true })
    .select("title description slug date readTime tags")
    .sort({ date: -1 })
    .lean();

  return (
    <div className="min-h-screen bg-os-bg font-mono pb-24">
      {/* ── Header ─────────────────────────────── */}
      <header className="border-b border-os-border/20 bg-os-bg/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-0.5">
            <span className="text-xl font-black tracking-tighter uppercase group-hover:text-neon-primary transition-colors">NJ</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neon-primary shadow-[0_0_8px_#ccff00]" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-primary animate-pulse" />
            <span className="text-sm font-black tracking-[0.2em] uppercase text-neon-primary/80">
              DEVLOG_ARCHIVE
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-16 space-y-14">
        {/* ── Hero ─────────────────────────────── */}
        <div className="space-y-5">
          <div className="text-xs font-black tracking-[0.4em] uppercase text-os-text/50">
            CLASSIFIED // DEVLOG_ARCHIVE // NADHEM-OS-X9
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            DEVLOG
            <span className="text-neon-primary">_ARCHIVE</span>
          </h1>
          <p className="text-base text-os-text/60 tracking-wide max-w-md">
            Technical writing on Backend Engineering, Distributed Systems &amp; AI Microservices.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-os-text/50 hover:text-neon-primary transition-colors"
          >
            <span className="text-neon-primary">[</span>
            &lt; RETURN_ROOT
            <span className="text-neon-primary">]</span>
          </Link>
        </div>

        {/* ── Count ───────────────────────────── */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-os-border/20" />
          <span className="text-xs font-black tracking-[0.3em] uppercase text-os-text/50">
            {posts.length} TRANSMISSION{posts.length !== 1 ? "S" : ""}_FOUND
          </span>
          <div className="h-px flex-1 bg-os-border/20" />
        </div>

        {/* ── Post List ───────────────────────── */}
        {posts.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <div className="text-os-text/50 text-base tracking-widest uppercase">NO_TRANSMISSIONS_FOUND</div>
            <div className="text-os-text/40 text-sm">Check back soon.</div>
          </div>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.slug as string}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block glass-panel border border-os-border/20 rounded-xl p-7 hover:border-neon-primary/30 hover:shadow-[0_0_30px_rgba(204,255,0,0.06)] transition-all duration-300"
                >
                  {/* Date + Read time */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-black text-os-text/55 tracking-wider">
                      {formatDate(post.date as string)}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-os-border/60" />
                    <span className="text-sm font-black text-os-text/45 tracking-wider">
                      {post.readTime as number} MIN READ
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-os-text group-hover:text-neon-primary transition-colors duration-300 mb-3">
                    {post.title as string}
                  </h2>

                  {/* Description */}
                  <p className="text-base text-os-text/65 leading-relaxed mb-6">
                    {post.description as string}
                  </p>

                  {/* Tags + CTA */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex flex-wrap gap-2">
                      {(post.tags as string[]).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-black uppercase tracking-wider border border-os-border/40 text-os-text/60 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-black uppercase tracking-[0.15em] text-neon-primary/70 group-hover:text-neon-primary transition-colors">
                      [ ACCESS_FILE &gt; ]
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
