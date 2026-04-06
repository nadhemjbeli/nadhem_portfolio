import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Contact } from "@/models/Contact";
import { verifyAdminToken } from "@/lib/adminAuth";
import mongoose from "mongoose";

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

/* ── PATCH — mark read/unread ─────────────────────────── */

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const { read } = await req.json();
  await connectDB();
  await Contact.findByIdAndUpdate(id, { read: Boolean(read) });
  return NextResponse.json({ success: true });
}

/* ── DELETE — remove a contact ────────────────────────── */

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  await connectDB();
  await Contact.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
