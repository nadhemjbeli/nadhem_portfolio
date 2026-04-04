import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import hljs from "highlight.js";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import type { IPost, PostSection } from "@/models/Post";
import BlogScrollEnhancer from "./BlogScrollEnhancer";

export const dynamic = "force-dynamic";

/* ── Helpers ──────────────────────────────────────────────── */

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function highlightCode(code: string, language?: string): string {
  try {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    }
    return hljs.highlightAuto(code).value;
  } catch {
    return hljs.highlightAuto(code).value;
  }
}

/* ── Metadata ─────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const post = await Post.findOne({ slug, published: true }).lean<IPost>();
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Nadhem Jbeli`,
    description: post.description,
  };
}

/* ── Page ─────────────────────────────────────────────────── */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();
  const post = await Post.findOne({ slug, published: true }).lean<IPost>();
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-os-bg font-mono pb-24">
      <BlogScrollEnhancer />
      {/* ── Sticky header ───────────────────────── */}
      <header className="border-b border-os-border/20 bg-os-bg/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-0.5 shrink-0">
            <span className="text-xl font-black tracking-tighter uppercase group-hover:text-neon-primary transition-colors">NJ</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neon-primary shadow-[0_0_8px_#ccff00]" />
          </Link>
          <p className="text-sm text-os-text/55 tracking-wide font-black truncate hidden md:block">
            {post.title}
          </p>
          <Link
            href="/blog"
            className="shrink-0 text-sm font-black uppercase tracking-[0.2em] text-os-text/55 hover:text-neon-primary transition-colors"
          >
            &lt; ARCHIVES
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-14 space-y-0">
        {/* ── Back nav ──────────────────────────── */}
        <div className="mb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-os-text/55 hover:text-neon-primary transition-colors"
          >
            <span className="text-neon-primary">[</span>
            &lt; RETURN_TO_ARCHIVES
            <span className="text-neon-primary">]</span>
          </Link>
        </div>

        {/* ── Post hero ─────────────────────────── */}
        <div className="space-y-5 mb-14">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-black text-os-text/60 tracking-wider uppercase">
              {formatDate(post.date)}
            </span>
            <span className="text-os-text/40">·</span>
            <span className="text-sm font-black text-os-text/55 tracking-wider uppercase">
              {post.readTime} MIN READ
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight leading-tight text-os-text">
            {post.title}
          </h1>
          <p className="text-lg text-os-text/70 leading-relaxed max-w-2xl">
            {post.description}
          </p>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-black uppercase tracking-wider border border-neon-primary/30 text-neon-primary/80 rounded bg-neon-primary/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Divider ───────────────────────────── */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-os-border/20" />
          <span className="text-xs font-black tracking-[0.4em] text-os-text/40 uppercase">SYSTEM_LOG_START</span>
          <div className="h-px flex-1 bg-os-border/20" />
        </div>

        {/* ── Intro ─────────────────────────────── */}
        <div className="blog-content mb-12">
          <p className="text-lg text-os-text/80 leading-[1.85] border-l-2 border-neon-primary/40 pl-6">
            {post.content.intro}
          </p>
        </div>

        {/* ── Sections ──────────────────────────── */}
        {post.content.sections.length > 0 && (
          <div className="space-y-12 mb-14">
            {post.content.sections.map((section: PostSection, idx: number) => (
              <div key={idx} className="space-y-4">
                {/* Section heading */}
                <h2 className="text-xl font-black uppercase tracking-wide text-os-text flex items-center gap-3">
                  <span className="text-neon-primary text-base">▸</span>
                  {section.heading}
                </h2>
                {/* Description */}
                <p className="text-base text-os-text/75 leading-relaxed pl-6">
                  {section.description}
                </p>
                {/* Code block */}
                {section.codeSnippet && (
                  <div className="rounded-xl overflow-hidden border border-os-border/30 ml-6">
                    {/* Terminal title bar */}
                    <div className="bg-os-surface border-b border-os-border/30 px-4 py-2.5 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-neon-primary/50" />
                      </div>
                      <span className="text-xs font-black tracking-[0.2em] text-os-text/50 uppercase ml-2">
                        {section.codeLanguage ?? "code"}
                      </span>
                    </div>
                    {/* Code */}
                    <pre className="p-6 overflow-x-auto text-sm leading-relaxed bg-os-bg">
                      <code
                        className="hljs blog-content"
                        // Server-side syntax highlighted — safe, no user input
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                          __html: highlightCode(
                            section.codeSnippet,
                            section.codeLanguage
                          ),
                        }}
                      />
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Lessons Learned ───────────────────── */}
        {post.content.lessonsLearned.length > 0 && (
          <div className="glass-panel border border-os-border/20 rounded-xl p-8 mb-10">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-neon-primary mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-neon-primary rounded-full" />
              LESSONS_LEARNED
            </h2>
            <ul className="space-y-4">
              {post.content.lessonsLearned.map((lesson, idx) => (
                <li key={idx} className="flex items-start gap-4 text-base text-os-text/80 leading-relaxed">
                  <span className="text-neon-primary font-black text-sm mt-0.5 shrink-0">
                    {String(idx + 1).padStart(2, "0")}.
                  </span>
                  {lesson}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Performance Metrics ────────────────── */}
        {post.content.performanceMetrics.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-os-text/65 mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-neon-secondary rounded-full" />
              PERFORMANCE_METRICS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {post.content.performanceMetrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="glass-panel border border-neon-secondary/15 rounded-xl p-5 text-center"
                >
                  <div className="w-2 h-2 rounded-full bg-neon-secondary mx-auto mb-3 shadow-[0_0_8px_#00ffcc]" />
                  <p className="text-sm font-black text-neon-secondary/85 leading-snug uppercase tracking-wide">
                    {metric}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tech Stack ────────────────────────── */}
        {post.content.techStack.length > 0 && (
          <div className="mb-14">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-os-text/55 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-os-text/30 rounded-full" />
              TECH_STACK
            </h2>
            <div className="flex flex-wrap gap-2">
              {post.content.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 text-sm font-black uppercase tracking-wider border border-os-border/40 text-os-text/65 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer divider ────────────────────── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-os-border/20" />
          <span className="text-xs font-black tracking-[0.4em] text-os-text/40 uppercase">END_OF_LOG</span>
          <div className="h-px flex-1 bg-os-border/20" />
        </div>

        {/* ── Exit nav ──────────────────────────── */}
        <div className="text-center pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-os-text/50 hover:text-neon-primary transition-colors"
          >
            <span className="text-neon-primary">[</span>
            &lt;/ EXIT_SYSTEM_LOG &gt;
            <span className="text-neon-primary">]</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
