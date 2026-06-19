import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { requireAdminApi } from '@/lib/admin-auth';
import { estimateReadingMinutes } from '@/lib/blog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const slugRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const UpdateSchema = z.object({
  slug: z.string().min(2).max(120).regex(slugRe).optional(),
  title: z.string().min(1).max(200).optional(),
  excerpt: z.string().min(1).max(500).optional(),
  body: z.string().min(1).max(50000).optional(),
  coverUrl: z.string().url().nullable().optional(),
  author: z.string().max(200).optional(),
  category: z.string().max(80).nullable().optional(),
  relatedBookId: z.number().int().min(1).nullable().optional(),
  isPublished: z.number().int().min(0).max(1).optional(),
});

interface Ctx { params: Promise<{ id: string }>; }

export async function PATCH(req: Request, { params }: Ctx) {
  const auth = await requireAdminApi();
  if (auth) return auth;
  const { id } = await params;
  const n = parseInt(id, 10);
  if (!Number.isFinite(n)) return NextResponse.json({ error: 'id invalide' }, { status: 400 });

  let parsed: z.infer<typeof UpdateSchema>;
  try {
    parsed = UpdateSchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: 'Validation', detail: e instanceof z.ZodError ? e.issues : String(e) },
      { status: 400 }
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const patch: Record<string, unknown> = {
    ...parsed,
    updatedAt: now,
  };
  if (parsed.body) patch.readingMinutes = estimateReadingMinutes(parsed.body);

  // Si on publie maintenant et publishedAt vide, on le set
  if (parsed.isPublished === 1) {
    const [existing] = await db
      .select({ publishedAt: schema.blogPosts.publishedAt })
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.id, n))
      .limit(1);
    if (existing && !existing.publishedAt) {
      patch.publishedAt = now;
    }
  }

  try {
    const [updated] = await db
      .update(schema.blogPosts)
      .set(patch)
      .where(eq(schema.blogPosts.id, n))
      .returning();
    if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json({ post: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/UNIQUE constraint/i.test(msg)) {
      return NextResponse.json({ error: 'Slug déjà utilisé' }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireAdminApi();
  if (auth) return auth;
  const { id } = await params;
  const n = parseInt(id, 10);
  if (!Number.isFinite(n)) return NextResponse.json({ error: 'id invalide' }, { status: 400 });
  await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, n));
  return NextResponse.json({ ok: true });
}
