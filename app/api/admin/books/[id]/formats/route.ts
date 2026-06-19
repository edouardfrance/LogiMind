/**
 * POST /api/admin/books/[id]/formats — créer un format.
 */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { requireAdminApi } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FormatSchema = z.object({
  format: z.enum(['pdf', 'kindle', 'paperback', 'hardcover']),
  isbn: z.string().max(30).nullable().optional(),
  priceCents: z.number().int().min(0).max(99999),
  currency: z.string().length(3).default('EUR'),
  pdfBlobKey: z.string().nullable().optional(),
  pdfSizeBytes: z.number().int().min(0).nullable().optional(),
  luluUrl: z.string().url().nullable().optional(),
  pageCount: z.number().int().min(1).max(9999).nullable().optional(),
  weightGrams: z.number().int().min(1).max(99999).nullable().optional(),
  stripePriceId: z.string().nullable().optional(),
  isAvailable: z.number().int().min(0).max(1).default(1),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth) return auth;
  const { id } = await params;
  const bookId = parseInt(id, 10);
  if (!Number.isFinite(bookId)) {
    return NextResponse.json({ error: 'id invalide' }, { status: 400 });
  }

  const [book] = await db
    .select()
    .from(schema.books)
    .where(eq(schema.books.id, bookId))
    .limit(1);
  if (!book) return NextResponse.json({ error: 'livre introuvable' }, { status: 404 });

  let parsed: z.infer<typeof FormatSchema>;
  try {
    parsed = FormatSchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: 'Validation', detail: e instanceof z.ZodError ? e.issues : String(e) },
      { status: 400 }
    );
  }

  try {
    const [row] = await db
      .insert(schema.bookFormats)
      .values({
        bookId,
        format: parsed.format,
        isbn: parsed.isbn ?? null,
        priceCents: parsed.priceCents,
        currency: parsed.currency,
        pdfBlobKey: parsed.pdfBlobKey ?? null,
        pdfSizeBytes: parsed.pdfSizeBytes ?? null,
        luluUrl: parsed.luluUrl ?? null,
        pageCount: parsed.pageCount ?? null,
        weightGrams: parsed.weightGrams ?? null,
        stripePriceId: parsed.stripePriceId ?? null,
        isAvailable: parsed.isAvailable,
      })
      .returning();
    return NextResponse.json({ format: row }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/UNIQUE constraint/i.test(msg)) {
      return NextResponse.json(
        { error: 'Ce format existe déjà pour ce livre' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
