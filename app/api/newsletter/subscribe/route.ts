import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { isValidEmail, normalizeEmail } from '@/lib/newsletter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  email: z.string().min(5).max(254),
  source: z.string().max(80).optional(),
});

// Rate limit ultra simple par IP : max 5 inscriptions / minute
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX = 5;
const WINDOW_MS = 60_000;

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.resetAt > now && rec.count >= MAX) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessaye dans une minute.' },
      { status: 429 }
    );
  }
  attempts.set(
    ip,
    !rec || rec.resetAt < now
      ? { count: 1, resetAt: now + WINDOW_MS }
      : { count: rec.count + 1, resetAt: rec.resetAt }
  );

  let body: { email: string; source?: string };
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
  }

  const email = normalizeEmail(body.email);

  try {
    // Si déjà inscrit non désabonné : on renvoie un OK silencieux (UX honnête)
    const [existing] = await db
      .select()
      .from(schema.newsletterSubscribers)
      .where(eq(schema.newsletterSubscribers.email, email))
      .limit(1);

    if (existing) {
      // Si désabonné précédemment : on réactive
      if (existing.unsubscribedAt) {
        await db
          .update(schema.newsletterSubscribers)
          .set({ unsubscribedAt: null })
          .where(eq(schema.newsletterSubscribers.id, existing.id));
      }
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }

    await db.insert(schema.newsletterSubscribers).values({
      email,
      source: body.source ?? null,
      ip,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[newsletter] insert error', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
