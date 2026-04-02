import { NextRequest, NextResponse } from "next/server";
import { computeAdminToken } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const expected = process.env.BLOG_ADMIN_PASSWORD;

    if (!expected || password !== expected) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = computeAdminToken();
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
