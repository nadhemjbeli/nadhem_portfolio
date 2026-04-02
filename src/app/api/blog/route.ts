import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { verifyAdminToken } from "@/lib/adminAuth";

/* ─── GET /api/blog — list published posts ─── */
export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find({ published: true })
      .select("title description slug date readTime tags")
      .sort({ date: -1 })
      .lean();
    return NextResponse.json(posts);
  } catch (err) {
    console.error("[GET /api/blog]", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

/* ─── POST /api/blog — create post (admin only) ─── */
export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const post = new Post(body);
    await post.save();
    return NextResponse.json(post, { status: 201 });
  } catch (err: unknown) {
    console.error("[POST /api/blog]", err);
    const message = err instanceof Error ? err.message : "Failed to create post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
