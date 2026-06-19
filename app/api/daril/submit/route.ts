import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Endpoint de reception des soumissions QCM DARIL.
// Si RESEND_API_KEY est defini en environnement Vercel, on envoie un mail
// a daril@de-boysson.com via Resend (HTTP, sans SMTP). Sinon on logge le
// payload cote serveur Vercel et le client bascule sur mailto:.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.DARIL_INBOX || "daril@de-boysson.com";
    const from = process.env.DARIL_FROM || "DARIL <onboarding@resend.dev>";

    if (!apiKey) {
      console.log("[daril/submit] no RESEND_API_KEY, payload:", JSON.stringify(body));
      return NextResponse.json({ ok: true, delivered: false, reason: "no_provider" });
    }

    const subject = `DARIL QCM v1 — ${body?.timestamp || new Date().toISOString()}`;
    const text = `Reponses QCM DARIL\n\n${JSON.stringify(body, null, 2)}\n`;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
    });

    if (!r.ok) {
      const err = await r.text();
      console.error("[daril/submit] resend error", r.status, err);
      return NextResponse.json(
        { ok: true, delivered: false, reason: "provider_error" },
        { status: 200 }
      );
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "bad_payload" }, { status: 400 });
  }
}
