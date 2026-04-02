import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { SEED_POSTS } from "@/lib/seed/posts";

/* Only runs in development */
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Forbidden in production" }, { status: 403 });
  }

  try {
    await connectDB();

    const results = await Promise.allSettled(
      SEED_POSTS.map(async (data) => {
        const post = await Post.findOneAndUpdate(
          { slug: data.slug },
          data,
          { upsert: true, new: true, runValidators: true }
        );
        return { slug: post.slug, status: "upserted" };
      })
    );

    const summary = results.map((r) =>
      r.status === "fulfilled" ? r.value : { error: r.reason?.message }
    );

    return NextResponse.json({ seeded: summary.length, results: summary });
  } catch (err) {
    console.error("[POST /api/blog/seed]", err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
