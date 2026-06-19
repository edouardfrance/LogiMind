/**
 * PATCH / DELETE /api/admin/books/[id]/formats/[fid]
 */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { requireAdminApi } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UpdateSchema = z.object({
  isbn: z.string().max(30).nullable().optional(),
  priceCents: z.number().int().min(0).max(99999).optional(),
  currency: z.string().length(3).optional(),
  pdfBlobKey: z.string().nullable().optional(),
  pdfSizeBytes: z.number().int().min(0).nullable().optional(),
  luluUrl: z.string().url().nullable().optional(),
  pageCount: z.number().int().min(1).max(9999).nullable().optional(),
  weightGrams: z.number().int().min(1).max(99999).nullable().optional(),
  stripePriceId: z.string().nullable().optional(),
  isAvailable: z.number().int().min(0).max(1).optional(),
});

interface RouteContext {
  params: Promise<{ id: string; fid: string }>;
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth) return auth;
  const { id, fid } = await params;
  const bookId = parseInt(id, 10);
  const formatId = parseInt(fid, 10);
  if (!Number.isFinite(bookId) || !Number.isFinite(formatId)) {
    return NextResponse.json({ error: 'id invalide' }, { status: 400 });
  }

  let parsed: z.infer<typeof UpdateSchema>;
  try {
    parsed = UpdateSchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: 'Validation', detail: e instanceof z.ZodError ? e.issues : String(e) },
      { status: 400 }
    );
  }

  const [updated] = await db
    .update(schema.bookFormats)
    .set(parsed)
    .where(
      and(eq(schema.bookFormats.id, formatId), eq(schema.bookFormats.bookId, bookId))
    )
    .returning();

  if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ format: updated });
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth) return auth;
  const { id, fid } = await params;
  const bookId = parseInt(id, 10);
  const formatId = parseInt(fid, 10);
  if (!Number.isFinite(bookId) || !Number.isFinite(formatId)) {
    return NextResponse.json({ error: 'id invalide' }, { status: 400 });
  }

  await db
    .delete(schema.bookFormats)
    .where(
      and(eq(schema.bookFormats.id, formatId), eq(schema.bookFormats.bookId, bookId))
    );
  return NextResponse.json({ ok: true });
}
