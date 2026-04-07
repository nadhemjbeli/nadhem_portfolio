"use client";

import { useState, useEffect, useCallback } from "react";
import type { IPost, PostSection } from "@/models/Post";

interface PostFormData {
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  date: string;
  published: boolean;
  content: {
    intro: string;
    sections: (PostSection & { _key: number })[];
    lessonsLearned: string[];
    techStack: string[];
    performanceMetrics: string[];
  };
}

const defaultForm = (): PostFormData => ({
  title: "",
  description: "",
  slug: "",
  coverImage: "",
  date: new Date().toISOString().split("T")[0],
  published: false,
  content: {
    intro: "",
    sections: [],
    lessonsLearned: [],
    techStack: [],
    performanceMetrics: [],
  },
});

function toSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface Props {
  token: string;
  editPost?: IPost | null;
  onSaved: () => void;
  onCancel?: () => void;
}

export default function PostEditor({ token, editPost, onSaved, onCancel }: Props) {
  const isEdit = !!editPost;
  const [form, setForm] = useState<PostFormData>(defaultForm);
  const [tagInputs, setTagInputs] = useState({ lessons: "", tech: "", metrics: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyCounter, setKeyCounter] = useState(0);

  /* Populate form when editing */
  useEffect(() => {
    if (editPost) {
      setForm({
        title: editPost.title,
        description: editPost.description,
        slug: editPost.slug,
        coverImage: editPost.coverImage ?? "",
        date: editPost.date,
        published: editPost.published,
        content: {
          intro: editPost.content.intro,
          sections: editPost.content.sections.map((s, i) => ({ ...s, _key: i })),
          lessonsLearned: [...editPost.content.lessonsLearned],
          techStack: [...editPost.content.techStack],
          performanceMetrics: [...editPost.content.performanceMetrics],
        },
      });
    } else {
      setForm(defaultForm());
    }
  }, [editPost]);

  /* Auto-generate slug from title (new posts only) */
  useEffect(() => {
    if (!isEdit) {
      setForm((f) => ({ ...f, slug: toSlug(f.title) }));
    }
  }, [form.title, isEdit]);

  /* Section helpers */
  const addSection = () => {
    const key = keyCounter + 1;
    setKeyCounter(key);
    setForm((f) => ({
      ...f,
      content: {
        ...f.content,
        sections: [...f.content.sections, { heading: "", description: "", codeSnippet: "", codeLanguage: "python", _key: key }],
      },
    }));
  };

  const updateSection = (idx: number, field: keyof PostSection, value: string) => {
    setForm((f) => {
      const sections = [...f.content.sections];
      sections[idx] = { ...sections[idx], [field]: value };
      return { ...f, content: { ...f.content, sections } };
    });
  };

  const removeSection = (idx: number) => {
    setForm((f) => {
      const sections = f.content.sections.filter((_, i) => i !== idx);
      return { ...f, content: { ...f.content, sections } };
    });
  };

  /* Tag helpers */
  type TagField = "lessonsLearned" | "techStack" | "performanceMetrics";
  type InputKey = "lessons" | "tech" | "metrics";

  const addTag = (field: TagField, inputKey: InputKey) => {
    const val = tagInputs[inputKey].trim();
    if (!val) return;
    setForm((f) => ({ ...f, content: { ...f.content, [field]: [...f.content[field], val] } }));
    setTagInputs((t) => ({ ...t, [inputKey]: "" }));
  };

  const removeTag = (field: TagField, idx: number) => {
    setForm((f) => {
      const arr = f.content[field].filter((_, i) => i !== idx);
      return { ...f, content: { ...f.content, [field]: arr } };
    });
  };

  /* Submit */
  const handleSubmit = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        content: {
          ...form.content,
          // Strip internal _key before sending
          sections: form.content.sections.map(({ _key: _k, ...s }) => s),
        },
      };

      const url = isEdit ? `/api/blog/${editPost!.slug}` : "/api/blog";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Unknown error");
      }

      onSaved();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }, [form, token, isEdit, editPost, onSaved]);

  /* ─ UI Helpers ─────────────────────────────── */

  const inputCls =
    "w-full bg-transparent border border-os-border/30 rounded px-3 py-2 text-[12px] text-os-text/80 font-mono focus:outline-none focus:border-neon-primary/50 placeholder:text-os-text/20 transition-colors";
  const labelCls = "block text-[9px] font-black uppercase tracking-[0.3em] text-os-text/30 mb-1.5";

/* ── Tag Input Component (Defined outside to avoid re-mounting & focus loss) ── */

interface TagInputProps {
  label: string;
  placeholder: string;
  value: string;
  items: string[];
  onChange: (val: string) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
}

const TagInput = ({ label, placeholder, value, items, onChange, onAdd, onRemove }: TagInputProps) => {
  const inputCls = "w-full bg-transparent border border-os-border/30 rounded px-3 py-2 text-[12px] text-os-text/80 font-mono focus:outline-none focus:border-neon-primary/50 placeholder:text-os-text/20 transition-colors";
  const labelCls = "block text-[9px] font-black uppercase tracking-[0.3em] text-os-text/30 mb-1.5";

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          className={`${inputCls} flex-1`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(); } }}
        />
        <button onClick={(e) => { e.preventDefault(); onAdd(); }} className="px-3 py-2 text-[10px] font-black uppercase tracking-widest border border-neon-primary/30 text-neon-primary hover:bg-neon-primary/10 rounded transition-colors">
          + ADD
        </button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-6">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onRemove(i)}
            className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider border border-os-border/30 text-os-text/40 rounded hover:border-red-500/50 hover:text-red-400 transition-colors"
          >
            {item} ×
          </button>
        ))}
      </div>
    </div>
  );
};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[9px] font-black tracking-[0.5em] text-os-text/25 uppercase mb-1">
            {isEdit ? "EDITING_TRANSMISSION" : "NEW_TRANSMISSION"}
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-os-text">
            {isEdit ? "Edit Post" : "Create Post"}
          </h2>
        </div>
        {onCancel && (
          <button onClick={onCancel} className="text-[10px] uppercase tracking-widest text-os-text/30 hover:text-os-text transition-colors font-black">
            × CANCEL
          </button>
        )}
      </div>

      {/* ── Metadata ─────────────────────────────── */}
      <div className="glass-panel border border-os-border/20 rounded-xl p-6 space-y-5">
        <div className="text-[9px] font-black tracking-[0.4em] text-neon-primary/60 uppercase mb-2">METADATA</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Title</label>
            <input className={inputCls} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Post title..." />
          </div>
          <div>
            <label className={labelCls}>Slug</label>
            <input className={inputCls} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" />
          </div>
        </div>

        <div>
          <label className={labelCls}>Cover Image (URL/Path)</label>
          <input className={inputCls} value={form.coverImage} onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))} placeholder="/graph.png or https://..." />
        </div>

        <div>
          <label className={labelCls}>Short Description</label>
          <textarea className={`${inputCls} resize-none`} rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="One or two sentences summarizing the post..." />
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <div>
            <label className={labelCls}>Date</label>
            <input type="date" className={inputCls} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
              className={`w-10 h-5 rounded-full transition-colors flex items-center ${form.published ? "bg-neon-primary" : "bg-os-border/40"}`}
            >
              <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${form.published ? "translate-x-5" : ""}`} />
            </button>
            <label className={`${labelCls} mb-0 cursor-pointer`} onClick={() => setForm((f) => ({ ...f, published: !f.published }))}>
              {form.published ? "PUBLISHED" : "DRAFT"}
            </label>
          </div>
        </div>
      </div>

      {/* ── Intro ─────────────────────────────────── */}
      <div className="glass-panel border border-os-border/20 rounded-xl p-6">
        <div className="text-[9px] font-black tracking-[0.4em] text-neon-primary/60 uppercase mb-4">INTRO_PARAGRAPH</div>
        <textarea className={`${inputCls} resize-y`} rows={5} value={form.content.intro} onChange={(e) => setForm((f) => ({ ...f, content: { ...f.content, intro: e.target.value } }))} placeholder="Opening paragraph — explain the problem and context..." />
      </div>

      {/* ── Sections ──────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-[9px] font-black tracking-[0.4em] text-neon-primary/60 uppercase">
            SECTIONS ({form.content.sections.length})
          </div>
          <button onClick={addSection} className="px-4 py-2 text-[9px] font-black uppercase tracking-widest border border-neon-primary/40 text-neon-primary hover:bg-neon-primary/10 rounded transition-colors">
            + ADD_SECTION
          </button>
        </div>

        {form.content.sections.length === 0 && (
          <div className="glass-panel border border-os-border/15 rounded-xl p-8 text-center">
            <div className="text-os-text/20 text-[11px] tracking-widest uppercase">No sections yet</div>
            <div className="text-os-text/15 text-[9px] mt-1">Click ADD_SECTION to create your first section</div>
          </div>
        )}

        {form.content.sections.map((section, idx) => (
          <div key={section._key} className="glass-panel border border-os-border/20 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black tracking-widest text-neon-primary/40 uppercase">SECTION_{idx + 1}</span>
              <button onClick={() => removeSection(idx)} className="text-[9px] font-black text-os-text/20 hover:text-red-400 transition-colors uppercase tracking-widest">
                × REMOVE
              </button>
            </div>

            <div>
              <label className={labelCls}>Heading</label>
              <input className={inputCls} value={section.heading} onChange={(e) => updateSection(idx, "heading", e.target.value)} placeholder="Section title..." />
            </div>

            <div>
              <label className={labelCls}>Description</label>
              <textarea className={`${inputCls} resize-y`} rows={3} value={section.description} onChange={(e) => updateSection(idx, "description", e.target.value)} placeholder="Explain this section..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-3">
                <label className={labelCls}>Code Snippet (optional)</label>
                <textarea className={`${inputCls} resize-y font-mono text-[11px]`} rows={6} value={section.codeSnippet ?? ""} onChange={(e) => updateSection(idx, "codeSnippet", e.target.value)} placeholder="Paste code here..." />
              </div>
              <div>
                <label className={labelCls}>Language</label>
                <input className={inputCls} value={section.codeLanguage ?? ""} onChange={(e) => updateSection(idx, "codeLanguage", e.target.value)} placeholder="python, ts, go..." />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tags ──────────────────────────────────── */}
      <div className="glass-panel border border-os-border/20 rounded-xl p-6 space-y-6">
        <div className="text-[9px] font-black tracking-[0.4em] text-neon-primary/60 uppercase mb-2">LISTS_&amp;_TAGS</div>
        <TagInput 
          label="Lessons Learned" 
          placeholder="Add a lesson and press Enter..." 
          value={tagInputs.lessons}
          items={form.content.lessonsLearned}
          onChange={(val) => setTagInputs(t => ({ ...t, lessons: val }))}
          onAdd={() => addTag("lessonsLearned", "lessons")}
          onRemove={(idx) => removeTag("lessonsLearned", idx)}
        />
        <TagInput 
          label="Tech Stack" 
          placeholder="Python, FastAPI, Redis..." 
          value={tagInputs.tech}
          items={form.content.techStack}
          onChange={(val) => setTagInputs(t => ({ ...t, tech: val }))}
          onAdd={() => addTag("techStack", "tech")}
          onRemove={(idx) => removeTag("techStack", idx)}
        />
        <TagInput 
          label="Performance Metrics" 
          placeholder="<50ms, 10k req/s..." 
          value={tagInputs.metrics}
          items={form.content.performanceMetrics}
          onChange={(val) => setTagInputs(t => ({ ...t, metrics: val }))}
          onAdd={() => addTag("performanceMetrics", "metrics")}
          onRemove={(idx) => removeTag("performanceMetrics", idx)}
        />
      </div>

      {/* ── Error ─────────────────────────────────── */}
      {error && (
        <div className="border border-red-500/40 bg-red-500/5 rounded-xl p-4 text-[12px] text-red-400 font-black uppercase tracking-wider">
          ✗ ERROR: {error}
        </div>
      )}

      {/* ── Submit ────────────────────────────────── */}
      <button
        onClick={handleSubmit}
        disabled={saving || !form.title || !form.slug}
        className="w-full py-4 bg-neon-primary text-black font-black text-sm uppercase tracking-[0.3em] rounded-xl shadow-[0_0_30px_rgba(204,255,0,0.2)] hover:shadow-[0_0_40px_rgba(204,255,0,0.4)] transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {saving ? "SAVING..." : isEdit ? "SAVE_CHANGES" : "PUBLISH_TRANSMISSION"}
      </button>
    </div>
  );
}
