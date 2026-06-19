import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Stub : on logge côté serveur Vercel. Pipeline SMTP DARIL = ITER 2.
    // À brancher : Resend / Nodemailer Gmail vers daril@de-boysson.com.
    console.log("[daril/submit]", JSON.stringify(body));
    return NextResponse.json({ ok: true, received: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "bad_payload" }, { status: 400 });
  }
}
