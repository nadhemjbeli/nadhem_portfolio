import mongoose, { Schema, Document, Model } from "mongoose";

/* ─── Sub-types ─────────────────────────────── */

export interface PostSection {
  heading: string;
  description: string;
  codeSnippet?: string;
  codeLanguage?: string;
}

export interface PostContent {
  intro: string;
  sections: PostSection[];
  lessonsLearned: string[];
  techStack: string[];
  performanceMetrics: string[];
}

/* ─── Document interface ────────────────────── */

export interface IPost extends Document {
  title: string;
  description: string;
  slug: string;
  coverImage?: string;
  date: string;        // "YYYY-MM-DD"
  readTime: number;    // auto-computed in pre-save
  tags: string[];      // mirrors techStack for listing
  content: PostContent;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/* ─── Sub-schemas ───────────────────────────── */

const SectionSchema = new Schema<PostSection>(
  {
    heading: { type: String, required: true },
    description: { type: String, required: true },
    codeSnippet: { type: String },
    codeLanguage: { type: String },
  },
  { _id: false }
);

const ContentSchema = new Schema<PostContent>(
  {
    intro: { type: String, required: true },
    sections: { type: [SectionSchema], default: [] },
    lessonsLearned: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    performanceMetrics: { type: [String], default: [] },
  },
  { _id: false }
);

/* ─── Main schema ───────────────────────────── */

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    coverImage: { type: String },
    date: { type: String, required: true },
    readTime: { type: Number, default: 5 },
    tags: { type: [String], default: [] },
    content: { type: ContentSchema, required: true },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ─── Pre-save hooks ────────────────────────── */

PostSchema.pre("save", async function () {
  // Auto-compute read time (~200 wpm)
  const content = this.content as PostContent;
  const words = [
    content.intro,
    ...content.sections.map((s) => `${s.heading} ${s.description}`),
    ...content.lessonsLearned,
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  this.readTime = Math.max(1, Math.ceil(words / 200));

  // Mirror tech stack as tags for the listing view
  (this as unknown as { tags: string[] }).tags = content.techStack.slice(0, 6);
});

/* ─── Export singleton ──────────────────────── */

export const Post: Model<IPost> =
  (mongoose.models.Post as Model<IPost>) ||
  mongoose.model<IPost>("Post", PostSchema);
