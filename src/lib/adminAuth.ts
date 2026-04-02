import { createHmac } from "crypto";
import { NextRequest } from "next/server";

export function computeAdminToken(): string {
  return createHmac("sha256", process.env.BLOG_ADMIN_SECRET || "dev-secret")
    .update(process.env.BLOG_ADMIN_PASSWORD || "")
    .digest("hex");
}

export function verifyAdminToken(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  const token = auth.slice(7);
  return token === computeAdminToken();
}
