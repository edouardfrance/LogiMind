/**
 * POST /api/admin/books — créer un livre.
 * GET /api/admin/books — lister (utilisé via server component, mais expose pour future use).
 */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { asc } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { requireAdminApi } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const slugRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const CreateSchema = z.object({
  slug: z.string().min(2).max(80).regex(slugRe, 'slug doit être kebab-case (a-z, 0-9, tirets)'),
  title: z.string().min(1).max(200),
  subtitle: z.string().max(300).optional().nullable(),
  author: z.string().max(200).optional(),
  descriptionShort: z.string().min(1).max(500),
  descriptionLong: z.string().min(1).max(20000),
  category: z.string().max(80).optional().nullable(),
  publishedYear: z.number().int().min(1900).max(2100).optional().nullable(),
  coverUrl: z.string().url(),
  excerptUrl: z.string().url().optional().nullable(),
  amazonKindleUrl: z.string().url().optional().nullable(),
  isPublished: z.number().int().min(0).max(1).default(0),
  displayOrder: z.number().int().min(0).max(9999).default(0),
});

export async function GET() {
  const auth = await requireAdminApi();
  if (auth) return auth;
  const rows = await db.select().from(schema.books).orderBy(asc(schema.books.displayOrder));
  return NextResponse.json({ books: rows });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth) return auth;

  let parsed: z.infer<typeof CreateSchema>;
  try {
    parsed = CreateSchema.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: 'Validation', detail: e instanceof z.ZodError ? e.issues : String(e) },
      { status: 400 }
    );
  }

  try {
    const [row] = await db
      .insert(schema.books)
      .values({
        slug: parsed.slug,
        title: parsed.title,
        subtitle: parsed.subtitle ?? null,
        author: parsed.author || 'Édouard de Boysson',
        descriptionShort: parsed.descriptionShort,
        descriptionLong: parsed.descriptionLong,
        category: parsed.category ?? null,
        publishedYear: parsed.publishedYear ?? null,
        coverUrl: parsed.coverUrl,
        excerptUrl: parsed.excerptUrl ?? null,
        amazonKindleUrl: parsed.amazonKindleUrl ?? null,
        isPublished: parsed.isPublished,
        displayOrder: parsed.displayOrder,
      })
      .returning();
    return NextResponse.json({ book: row }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/UNIQUE constraint/i.test(msg)) {
      return NextResponse.json({ error: 'Slug déjà utilisé' }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
