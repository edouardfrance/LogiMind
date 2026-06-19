import { NextResponse } from 'next/server';
import { z } from 'zod';
import { desc } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { requireAdminApi } from '@/lib/admin-auth';
import { estimateReadingMinutes } from '@/lib/blog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const slugRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const CreateSchema = z.object({
  slug: z.string().min(2).max(120).regex(slugRe),
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  body: z.string().min(1).max(50000),
  coverUrl: z.string().url().nullable().optional(),
  author: z.string().max(200).optional(),
  category: z.string().max(80).nullable().optional(),
  relatedBookId: z.number().int().min(1).nullable().optional(),
  isPublished: z.number().int().min(0).max(1).default(0),
});

export async function GET() {
  const auth = await requireAdminApi();
  if (auth) return auth;
  const rows = await db
    .select()
    .from(schema.blogPosts)
    .orderBy(desc(schema.blogPosts.createdAt));
  return NextResponse.json({ posts: rows });
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
    const now = Math.floor(Date.now() / 1000);
    const [row] = await db
      .insert(schema.blogPosts)
      .values({
        slug: parsed.slug,
        title: parsed.title,
        excerpt: parsed.excerpt,
        body: parsed.body,
        coverUrl: parsed.coverUrl ?? null,
        author: parsed.author || 'Édouard de Boysson',
        category: parsed.category ?? null,
        relatedBookId: parsed.relatedBookId ?? null,
        readingMinutes: estimateReadingMinutes(parsed.body),
        isPublished: parsed.isPublished,
        publishedAt: parsed.isPublished ? now : null,
      })
      .returning();
    return NextResponse.json({ post: row }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/UNIQUE constraint/i.test(msg)) {
      return NextResponse.json({ error: 'Slug déjà utilisé' }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
