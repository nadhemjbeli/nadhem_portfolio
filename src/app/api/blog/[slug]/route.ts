import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { verifyAdminToken } from "@/lib/adminAuth";

type Params = { params: Promise<{ slug: string }> };

/* ─── GET /api/blog/[slug] ─── */
export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    await connectDB();
    const post = await Post.findOne({ slug, published: true }).lean();
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    console.error("[GET /api/blog/[slug]]", err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

/* ─── PUT /api/blog/[slug] — update (admin only) ─── */
export async function PUT(req: NextRequest, { params }: Params) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  try {
    await connectDB();
    const body = await req.json();

    // If slug changes, handle via body.slug
    const post = await Post.findOneAndUpdate({ slug }, body, {
      new: true,
      runValidators: true,
    });

    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err: unknown) {
    console.error("[PUT /api/blog/[slug]]", err);
    const message = err instanceof Error ? err.message : "Failed to update post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/* ─── DELETE /api/blog/[slug] — delete (admin only) ─── */
export async function DELETE(req: NextRequest, { params }: Params) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  try {
    await connectDB();
    const post = await Post.findOneAndDelete({ slug });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("[DELETE /api/blog/[slug]]", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
