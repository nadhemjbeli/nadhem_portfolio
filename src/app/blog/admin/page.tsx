"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import PostEditor from "./components/PostEditor";
import type { IPost } from "@/models/Post";

type Tab = "posts" | "editor";

interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  date: string;
  readTime: number;
  published: boolean;
  tags: string[];
}

/* ─── Login Screen ───────────────────────────────────────── */

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!password) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/blog/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Auth failed");
      localStorage.setItem("blog_admin_token", data.token);
      onLogin(data.token);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-os-bg font-mono flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="text-[9px] font-black tracking-[0.5em] uppercase text-os-text/25">
            CLASSIFIED // SYSTEM_ACCESS
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            BLOG
            <span className="text-neon-primary">_ADMIN</span>
          </h1>
          <p className="text-[10px] text-os-text/30 tracking-widest uppercase">
            Enter admin credentials to continue
          </p>
        </div>

        {/* Form */}
        <div className="glass-panel border border-os-border/20 rounded-2xl p-7 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[9px] font-black tracking-[0.4em] text-os-text/30 uppercase">AUTHENTICATION_REQUIRED</span>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-os-text/30 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Enter password..."
              className="w-full bg-transparent border border-os-border/30 rounded px-4 py-3 text-[13px] font-mono text-os-text/80 focus:outline-none focus:border-neon-primary/50 placeholder:text-os-text/15 transition-colors"
            />
          </div>

          {error && (
            <div className="text-[11px] font-black text-red-400 uppercase tracking-wider">
              ✗ {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !password}
            className="w-full py-3.5 bg-neon-primary text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-xl shadow-[0_0_20px_rgba(204,255,0,0.2)] hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] transition-all active:scale-95 disabled:opacity-40"
          >
            {loading ? "AUTHENTICATING..." : "ACCESS_SYSTEM"}
          </button>
        </div>

        <div className="text-center">
          <Link href="/blog" className="text-[9px] font-black uppercase tracking-[0.3em] text-os-text/20 hover:text-os-text/50 transition-colors">
            ← Return to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Post List ──────────────────────────────────────────── */

function PostList({
  token,
  onNew,
  onEdit,
}: {
  token: string;
  onNew: () => void;
  onEdit: (post: IPost) => void;
}) {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const togglePublish = async (post: PostListItem) => {
    const res = await fetch(`/api/blog/${post.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ published: !post.published }),
    });
    if (res.ok) fetchPosts();
  };

  const deletePost = async (slug: string) => {
    if (!confirm(`Delete "${slug}"? This is permanent.`)) return;
    setDeleting(slug);
    await fetch(`/api/blog/${slug}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeleting(null);
    fetchPosts();
  };

  const handleEdit = async (slug: string) => {
    const res = await fetch(`/api/blog/${slug}`);
    if (res.ok) {
      const post = await res.json();
      onEdit(post);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-panel border border-os-border/10 rounded-xl p-5 animate-pulse h-20" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 space-y-3">
        <div className="text-os-text/20 text-[11px] tracking-widest uppercase">NO_TRANSMISSIONS_FOUND</div>
        <button onClick={onNew} className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-primary hover:underline">
          Write your first post →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <div
          key={post.slug}
          className="glass-panel border border-os-border/20 rounded-xl p-5 flex flex-wrap items-center gap-4 justify-between"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${post.published ? "bg-neon-primary shadow-[0_0_6px_#ccff00]" : "bg-os-border/60"}`}
              />
              <span className="text-[8px] font-black tracking-widest text-os-text/30 uppercase">
                {post.published ? "LIVE" : "DRAFT"}
              </span>
              <span className="text-[8px] text-os-text/20 ml-1">· {post.date} · {post.readTime} min</span>
            </div>
            <h3 className="text-[14px] font-black uppercase truncate text-os-text pr-4">{post.title}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {post.tags.slice(0, 3).map((t) => (
                <span key={t} className="text-[8px] text-os-text/25 uppercase tracking-wider">#{t}</span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-os-border/30 text-os-text/30 hover:text-os-text rounded transition-colors"
            >
              VIEW
            </Link>
            <button
              onClick={() => togglePublish(post)}
              className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-os-border/30 text-os-text/30 hover:text-neon-primary hover:border-neon-primary/40 rounded transition-colors"
            >
              {post.published ? "UNPUBLISH" : "PUBLISH"}
            </button>
            <button
              onClick={() => handleEdit(post.slug)}
              className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-neon-primary/30 text-neon-primary/60 hover:text-neon-primary hover:border-neon-primary rounded transition-colors"
            >
              EDIT
            </button>
            <button
              onClick={() => deletePost(post.slug)}
              disabled={deleting === post.slug}
              className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border border-red-500/30 text-red-400/50 hover:text-red-400 hover:border-red-500 rounded transition-colors disabled:opacity-40"
            >
              {deleting === post.slug ? "..." : "DELETE"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Admin Page ────────────────────────────────────── */

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("posts");
  const [editPost, setEditPost] = useState<IPost | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /* Check for stored token on mount */
  useEffect(() => {
    const stored = localStorage.getItem("blog_admin_token");
    if (stored) setToken(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("blog_admin_token");
    setToken(null);
  };

  const handleEdit = (post: IPost) => {
    setEditPost(post);
    setTab("editor");
  };

  const handleSaved = () => {
    setTab("posts");
    setEditPost(null);
    setRefreshKey((k) => k + 1);
  };

  if (!token) {
    return <LoginScreen onLogin={setToken} />;
  }

  return (
    <div className="min-h-screen bg-os-bg font-mono">
      {/* Header */}
      <header className="border-b border-os-border/20 bg-os-bg/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center gap-0.5">
              <span className="text-xl font-black tracking-tighter uppercase group-hover:text-neon-primary transition-colors">NJ</span>
              <span className="w-1.5 h-1.5 rounded-full bg-neon-primary shadow-[0_0_8px_#ccff00]" />
            </Link>
            <div className="w-px h-4 bg-os-border/30" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-primary animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-neon-primary/70">BLOG_ADMIN</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-[9px] font-black uppercase tracking-widest text-os-text/30 hover:text-os-text transition-colors">
              VIEW_BLOG
            </Link>
            <button onClick={handleLogout} className="text-[9px] font-black uppercase tracking-widest text-red-400/50 hover:text-red-400 transition-colors">
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-10 pb-24">
        {/* Tabs */}
        <div className="flex items-center gap-0 mb-10 border-b border-os-border/20">
          {([
            { id: "posts" as Tab, label: "ARCHIVES" },
            { id: "editor" as Tab, label: tab === "editor" && editPost ? "EDITING" : "NEW_TRANSMISSION" },
          ] as { id: Tab; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); if (t.id === "editor") setEditPost(null); }}
              className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] border-b-2 transition-all ${
                tab === t.id
                  ? "border-neon-primary text-neon-primary"
                  : "border-transparent text-os-text/30 hover:text-os-text/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "posts" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-[9px] font-black tracking-[0.5em] text-os-text/25 uppercase mb-1">MANAGE</div>
                <h1 className="text-3xl font-black italic uppercase tracking-tight">ARCHIVES</h1>
              </div>
              <button
                onClick={() => { setEditPost(null); setTab("editor"); }}
                className="px-5 py-2.5 bg-neon-primary text-black font-black text-[11px] uppercase tracking-[0.2em] rounded shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_25px_rgba(204,255,0,0.5)] transition-all active:scale-95"
              >
                + NEW_POST
              </button>
            </div>
            <PostList key={refreshKey} token={token} onNew={() => setTab("editor")} onEdit={handleEdit} />
          </div>
        )}

        {tab === "editor" && (
          <PostEditor
            token={token}
            editPost={editPost}
            onSaved={handleSaved}
            onCancel={() => { setTab("posts"); setEditPost(null); }}
          />
        )}
      </main>
    </div>
  );
}
