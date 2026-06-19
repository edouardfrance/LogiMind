/**
 * GET / PATCH / DELETE /api/admin/books/[id]
 */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { requireAdminApi } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const slugRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const UpdateSchema = z.object({
  slug: z.string().min(2).max(80).regex(slugRe).optional(),
  title: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(300).nullable().optional(),
  author: z.string().max(200).optional(),
  descriptionShort: z.string().min(1).max(500).optional(),
  descriptionLong: z.string().min(1).max(20000).optional(),
  category: z.string().max(80).nullable().optional(),
  publishedYear: z.number().int().min(1900).max(2100).nullable().optional(),
  coverUrl: z.string().url().optional(),
  excerptUrl: z.string().url().nullable().optional(),
  amazonKindleUrl: z.string().url().nullable().optional(),
  isPublished: z.number().int().min(0).max(1).optional(),
  displayOrder: z.number().int().min(0).max(9999).optional(),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function parseId(params: RouteContext['params']): Promise<number | null> {
  const { id } = await params;
  const n = parseInt(id, 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return n;
}

export async function GET(_req: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth) return auth;
  const id = await parseId(params);
  if (!id) return NextResponse.json({ error: 'id invalide' }, { status: 400 });

  const [book] = await db.select().from(schema.books).where(eq(schema.books.id, id)).limit(1);
  if (!book) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const formats = await db
    .select()
    .from(schema.bookFormats)
    .where(eq(schema.bookFormats.bookId, id));

  return NextResponse.json({ book, formats });
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth) return auth;
  const id = await parseId(params);
  if (!id) return NextResponse.json({ error: 'id invalide' }, { status: 400 });

  let parsed: z.infer<typeof UpdateSchema>;
  try {
    parsed = UpdateSchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: 'Validation', detail: e instanceof z.ZodError ? e.issues : String(e) },
      { status: 400 }
    );
  }

  try {
    const [updated] = await db
      .update(schema.books)
      .set({
        ...parsed,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(schema.books.id, id))
      .returning();
    return NextResponse.json({ book: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/UNIQUE constraint/i.test(msg)) {
      return NextResponse.json({ error: 'Slug déjà utilisé' }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth) return auth;
  const id = await parseId(params);
  if (!id) return NextResponse.json({ error: 'id invalide' }, { status: 400 });

  await db.delete(schema.books).where(eq(schema.books.id, id));
  return NextResponse.json({ ok: true });
}
