import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkPassword, setSessionCookie } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  password: z.string().min(1).max(200),
});

// Rate limiter naïf in-memory (suffisant pour usage solo)
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000;

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.resetAt > now && rec.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessaye dans 1 minute.' },
      { status: 429 }
    );
  }

  let body: { password: string };
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  if (!checkPassword(body.password)) {
    const next = !rec || rec.resetAt < now
      ? { count: 1, resetAt: now + WINDOW_MS }
      : { count: rec.count + 1, resetAt: rec.resetAt };
    attempts.set(ip, next);
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  }

  attempts.delete(ip);
  await setSessionCookie();
  return NextResponse.json({ ok: true });
}
