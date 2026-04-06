"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Mail, CheckCircle, Circle, Trash2, RefreshCw } from "lucide-react";

interface ContactEntry {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const SUBJECT_LABELS: Record<string, string> = {
  project: "New Project Proposal",
  freelance: "Freelance Inquiry",
  hiring: "Hiring / Recruitment",
  chat: "General Chat",
};

/* ── Login Screen ─────────────────────────────────────── */

function LoginScreen({ onLogin }: { onLogin: () => void }) {
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
      localStorage.setItem("contact_admin_token", data.token);
      onLogin();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-os-bg font-mono flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="text-[9px] font-black tracking-[0.5em] uppercase text-os-text/25">
            CLASSIFIED // CONTACT_INBOX
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            CONTACT
            <span className="text-neon-secondary">_ADMIN</span>
          </h1>
          <p className="text-[10px] text-os-text/30 tracking-widest uppercase">
            Enter admin credentials to access messages
          </p>
        </div>

        <div className="glass-panel border border-os-border/20 rounded-2xl p-7 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[9px] font-black tracking-[0.4em] text-os-text/30 uppercase">
              AUTHENTICATION_REQUIRED
            </span>
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
              className="w-full bg-transparent border border-os-border/30 rounded px-4 py-3 text-[13px] font-mono text-os-text/80 focus:outline-none focus:border-neon-secondary/50 placeholder:text-os-text/15 transition-colors"
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
            className="w-full py-3.5 bg-neon-secondary text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-xl shadow-[0_0_20px_rgba(0,255,204,0.2)] hover:shadow-[0_0_30px_rgba(0,255,204,0.4)] transition-all active:scale-95 disabled:opacity-40"
          >
            {loading ? "AUTHENTICATING..." : "ACCESS_INBOX"}
          </button>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-[9px] font-black uppercase tracking-[0.3em] text-os-text/20 hover:text-os-text/50 transition-colors"
          >
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Contact Admin ─────────────────────────────────────── */

export default function ContactAdminPage() {
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("contact_admin_token");
    if (stored) { setToken(stored); setAuthed(true); }
  }, []);

  const fetchContacts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (authed && token) fetchContacts();
  }, [authed, token, fetchContacts]);

  const handleLogin = () => {
    const stored = localStorage.getItem("contact_admin_token");
    setToken(stored);
    setAuthed(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("contact_admin_token");
    setAuthed(false);
    setToken(null);
    setContacts([]);
  };

  const markRead = async (id: string, read: boolean) => {
    await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token!}` },
      body: JSON.stringify({ read }),
    });
    setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, read } : c)));
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    setDeletingId(id);
    await fetch(`/api/contact/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token!}` },
    });
    setContacts((prev) => prev.filter((c) => c._id !== id));
    setDeletingId(null);
  };

  if (!authed) return <LoginScreen onLogin={handleLogin} />;

  const unread = contacts.filter((c) => !c.read).length;

  return (
    <div className="min-h-screen bg-os-bg font-mono">
      {/* Header */}
      <header className="border-b border-os-border/20 bg-os-bg/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" className="group flex items-center gap-0.5">
              <span className="text-xl font-black tracking-tighter uppercase group-hover:text-neon-primary transition-colors">NJ</span>
              <span className="w-1.5 h-1.5 rounded-full bg-neon-primary shadow-[0_0_8px_#ccff00]" />
            </Link>
            <div className="w-px h-4 bg-os-border/30" />
            <div className="flex items-center gap-2">
              <Mail size={12} className="text-neon-secondary" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-neon-secondary/70">
                CONTACT_INBOX
              </span>
              {unread > 0 && (
                <span className="px-1.5 py-0.5 text-[8px] font-black bg-neon-secondary text-black rounded-full">
                  {unread}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchContacts}
              disabled={loading}
              className="text-[9px] font-black uppercase tracking-widest text-os-text/30 hover:text-os-text transition-colors flex items-center gap-1.5"
            >
              <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
              REFRESH
            </button>
            <Link
              href="/blog/admin"
              className="text-[9px] font-black uppercase tracking-widest text-os-text/30 hover:text-os-text transition-colors"
            >
              BLOG_ADMIN
            </Link>
            <button
              onClick={handleLogout}
              className="text-[9px] font-black uppercase tracking-widest text-red-400/50 hover:text-red-400 transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-10 pb-24">
        {/* Title */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="text-[9px] font-black tracking-[0.5em] text-os-text/25 uppercase mb-1">
              INCOMING_TRANSMISSIONS
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tight">
              Contact Inbox
            </h1>
          </div>
          <span className="text-[10px] text-os-text/30 font-black uppercase tracking-widest">
            {contacts.length} TOTAL · {unread} UNREAD
          </span>
        </div>

        {/* Messages */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel border border-os-border/10 rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-24 space-y-2">
            <Mail size={32} className="mx-auto text-os-text/10" />
            <div className="text-os-text/20 text-[11px] tracking-widest uppercase">
              NO_TRANSMISSIONS_RECEIVED
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((c) => (
              <div
                key={c._id}
                className={`glass-panel border rounded-xl overflow-hidden transition-colors ${
                  c.read ? "border-os-border/15" : "border-neon-secondary/20 shadow-[0_0_20px_rgba(0,255,204,0.04)]"
                }`}
              >
                {/* Row */}
                <div
                  className="p-5 flex flex-wrap items-center gap-4 justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpanded(expanded === c._id ? null : c._id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {c.read
                      ? <CheckCircle size={14} className="text-os-text/20 shrink-0" />
                      : <Circle size={14} className="text-neon-secondary shrink-0" />
                    }
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-black text-os-text truncate">{c.name}</span>
                        <span className="text-[9px] text-os-text/30 truncate hidden sm:inline">{c.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider text-neon-secondary/60">
                          {SUBJECT_LABELS[c.subject] ?? c.subject}
                        </span>
                        <span className="text-[8px] text-os-text/25">
                          · {new Date(c.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); markRead(c._id, !c.read); }}
                      className="px-3 py-1.5 text-[8px] font-black uppercase tracking-widest border border-os-border/30 text-os-text/30 hover:text-os-text rounded transition-colors"
                    >
                      {c.read ? "MARK_UNREAD" : "MARK_READ"}
                    </button>
                    <a
                      href={`mailto:${c.email}?subject=Re: ${SUBJECT_LABELS[c.subject] ?? c.subject}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 text-[8px] font-black uppercase tracking-widest border border-neon-secondary/30 text-neon-secondary/60 hover:text-neon-secondary hover:border-neon-secondary rounded transition-colors"
                    >
                      REPLY
                    </a>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteContact(c._id); }}
                      disabled={deletingId === c._id}
                      className="px-3 py-1.5 text-[8px] font-black uppercase tracking-widest border border-red-500/20 text-red-400/40 hover:text-red-400 hover:border-red-500/50 rounded transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>

                {/* Expanded message */}
                {expanded === c._id && (
                  <div className="px-5 pb-5 border-t border-os-border/15 pt-4">
                    <div className="text-[9px] font-black tracking-[0.3em] text-os-text/25 uppercase mb-2">
                      MESSAGE_CONTENT
                    </div>
                    <p className="text-sm text-os-text/70 leading-relaxed whitespace-pre-wrap">
                      {c.message}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
