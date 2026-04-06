import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Contact } from "@/models/Contact";
import nodemailer from "nodemailer";
import { verifyAdminToken } from "@/lib/adminAuth";

/* ── Gmail transporter (created once, reused across requests) ── */

function createTransporter() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "").trim();

  if (!user || !pass) {
    throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD");
  }

  return nodemailer.createTransport({
    service: "gmail",
    logger: true,
    debug: true,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false // Helps in some restricted local environments
    }
  });
}

/* ── Email template ─────────────────────────────────────────── */

function buildEmailHtml({
  name,
  email,
  subjectLabel,
  message,
  receivedAt,
}: {
  name: string;
  email: string;
  subjectLabel: string;
  message: string;
  receivedAt: string;
}) {
  const escaped = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const encodedSubject = encodeURIComponent(`Re: ${subjectLabel}`);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact — Portfolio</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Courier New',Courier,monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- Top bar -->
          <tr>
            <td style="background:#050505;border:1px solid #1e1e1e;border-bottom:2px solid #ccff00;border-radius:12px 12px 0 0;padding:18px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size:20px;font-weight:900;color:#ccff00;letter-spacing:-0.03em;text-transform:uppercase;font-style:italic;">NJ<span style="color:#ffffff;font-size:8px;vertical-align:middle;">●</span></span>
                  </td>
                  <td align="right">
                    <span style="font-size:9px;color:#333;letter-spacing:0.35em;text-transform:uppercase;">CYBER-OS&nbsp;//&nbsp;INCOMING_TRANSMISSION</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero banner -->
          <tr>
            <td style="background:#080808;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;padding:36px 28px 24px;">
              <p style="margin:0 0 10px;font-size:9px;color:#444;letter-spacing:0.4em;text-transform:uppercase;">NEW_TRANSMISSION_RECEIVED</p>
              <h1 style="margin:0;font-size:24px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:-0.02em;line-height:1.1;">${subjectLabel}</h1>
              <p style="margin:8px 0 0;font-size:10px;color:#444;letter-spacing:0.15em;">${receivedAt}</p>
            </td>
          </tr>

          <!-- Sender metadata -->
          <tr>
            <td style="background:#060606;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;padding:0 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #181818;">
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #121212;width:110px;vertical-align:top;">
                    <span style="font-size:8px;color:#3a3a3a;letter-spacing:0.35em;text-transform:uppercase;">FROM</span>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #121212;vertical-align:top;">
                    <span style="font-size:14px;font-weight:700;color:#e0e0e0;">${name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-bottom:1px solid #121212;vertical-align:top;">
                    <span style="font-size:8px;color:#3a3a3a;letter-spacing:0.35em;text-transform:uppercase;">EMAIL</span>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #121212;vertical-align:top;">
                    <a href="mailto:${email}" style="color:#00ffcc;text-decoration:none;font-size:13px;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;vertical-align:top;">
                    <span style="font-size:8px;color:#3a3a3a;letter-spacing:0.35em;text-transform:uppercase;">SUBJECT</span>
                  </td>
                  <td style="padding:14px 0;vertical-align:top;">
                    <span style="background:#ccff0015;border:1px solid #ccff0030;border-radius:4px;padding:3px 10px;font-size:11px;color:#ccff00;font-weight:700;letter-spacing:0.1em;">${subjectLabel}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message body -->
          <tr>
            <td style="background:#060606;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;padding:4px 28px 28px;">
              <p style="margin:20px 0 12px;font-size:8px;color:#3a3a3a;letter-spacing:0.35em;text-transform:uppercase;">MESSAGE_CONTENT</p>
              <div style="background:#040404;border:1px solid #1a1a1a;border-left:3px solid #ccff0040;border-radius:6px;padding:20px 18px;">
                <pre style="margin:0;font-size:13px;color:#b0b0b0;line-height:1.85;white-space:pre-wrap;word-break:break-word;font-family:'Courier New',Courier,monospace;">${escaped}</pre>
              </div>
            </td>
          </tr>

          <!-- CTA Reply -->
          <tr>
            <td style="background:#060606;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;padding:0 28px 36px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background:#ccff00;border-radius:6px;mso-padding-alt:0;">
                    <a href="mailto:${email}?subject=${encodedSubject}"
                       style="display:inline-block;padding:14px 30px;font-size:10px;font-weight:900;color:#000000;text-decoration:none;letter-spacing:0.3em;text-transform:uppercase;border-radius:6px;">
                      &#8594;&nbsp;&nbsp;REPLY_TO_SENDER
                    </a>
                  </td>
                  <td width="12"></td>
                  <td align="center" style="border:1px solid #2a2a2a;border-radius:6px;">
                    <a href="http://localhost:3000/contact-admin"
                       style="display:inline-block;padding:14px 24px;font-size:10px;font-weight:900;color:#555;text-decoration:none;letter-spacing:0.25em;text-transform:uppercase;border-radius:6px;">
                      VIEW_INBOX
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="background:#060606;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;padding:0 28px;">
              <div style="border-top:1px solid #111;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#040404;border:1px solid #1a1a1a;border-top:none;border-radius:0 0 12px 12px;padding:16px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td><span style="font-size:8px;color:#222;letter-spacing:0.3em;text-transform:uppercase;">PORTFOLIO&nbsp;//&nbsp;NADHEMJBELI.DEV&nbsp;//&nbsp;SECURE_CHANNEL</span></td>
                  <td align="right"><span style="font-size:8px;color:#222;letter-spacing:0.2em;">AES-256&nbsp;//&nbsp;ENCRYPTED</span></td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ── GET — list all contacts (admin only) ───────────────────── */

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(contacts);
}

/* ── POST — accept new contact submission ───────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Save to MongoDB — always happens regardless of email outcome
    await connectDB();
    await Contact.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Build display values
    const subjectLabels: Record<string, string> = {
      project: "New Project Proposal",
      freelance: "Freelance Inquiry",
      hiring: "Hiring / Recruitment",
      chat: "General Chat",
    };
    const subjectLabel = subjectLabels[subject] ?? subject;
    const receivedAt = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    // Send email — decoupled so a failure never blocks the user's submission
    try {
      const transporter = createTransporter();
      const info = await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
        to: process.env.CONTACT_EMAIL ?? process.env.GMAIL_USER,
        replyTo: email,
        subject: `[Portfolio] ${subjectLabel} — from ${name}`,
        html: buildEmailHtml({ name, email, subjectLabel, message, receivedAt }),
      });
      console.log("[contact] Email sent:", info.messageId);
    } catch (emailErr) {
      console.error("[contact] Email failed (message still saved in DB):", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] fatal error:", err);
    return NextResponse.json({ error: "Transmission failed. Please try again." }, { status: 500 });
  }
}
