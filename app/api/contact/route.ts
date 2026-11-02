import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateContact } from "@/lib/contactSchema";
import { CONTACT } from "@/lib/site";

// The Resend SDK needs Node APIs, so pin this off the edge runtime.
export const runtime = "nodejs";

/** Bots fill every field they can see; humans never see this one. */
const HONEYPOT = "company_website";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Silently accept honeypot hits: a bot told "success" stops retrying, and a
  // real visitor can never trip this because the field is hidden from them.
  const trap = (payload as Record<string, unknown> | null)?.[HONEYPOT];
  if (typeof trap === "string" && trap.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Same schema the client uses - the browser can be bypassed, this cannot.
  const result = validateContact(payload);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "[contact] RESEND_API_KEY is not set - cannot send. Add it to .env.local."
    );
    return NextResponse.json(
      { error: `Email isn't set up yet. Please reach me at ${CONTACT.email}.` },
      { status: 503 }
    );
  }

  const { name, email, organization, services, message } = result.data;

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Organization: ${organization || "-"}`,
    `Services: ${services || "-"}`,
    "",
    "Message:",
    message,
  ];

  try {
    const { error } = await new Resend(apiKey).emails.send({
      // Override once your own domain is verified in Resend.
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: [CONTACT.email],
      // Hitting reply in your inbox replies straight to the enquirer.
      replyTo: email,
      subject: `New project enquiry from ${name}`,
      text: lines.join("\n"),
      html: `<div style="font-family:system-ui,sans-serif;line-height:1.6">
  <h2 style="margin:0 0 16px">New project enquiry</h2>
  <p><strong>Name:</strong> ${escapeHtml(name)}</p>
  <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
  <p><strong>Organization:</strong> ${escapeHtml(organization || "-")}</p>
  <p><strong>Services:</strong> ${escapeHtml(services || "-")}</p>
  <p style="margin-top:20px"><strong>Message</strong></p>
  <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
</div>`,
    });

    if (error) {
      console.error("[contact] Resend rejected the send:", error);
      return NextResponse.json(
        { error: "That didn't send. Please try again in a moment." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (cause) {
    console.error("[contact] Unexpected failure sending mail:", cause);
    return NextResponse.json(
      { error: "That didn't send. Please try again in a moment." },
      { status: 500 }
    );
  }
}
