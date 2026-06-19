/**
 * GET /api/admin/newsletter — liste inscrits.
 * GET /api/admin/newsletter?format=csv — export CSV téléchargeable.
 */
import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { requireAdminApi } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth) return auth;

  const rows = await db
    .select()
    .from(schema.newsletterSubscribers)
    .orderBy(desc(schema.newsletterSubscribers.createdAt));

  const { searchParams } = new URL(req.url);
  if (searchParams.get('format') === 'csv') {
    const csv = [
      'email,source,subscribed_at,unsubscribed_at',
      ...rows.map((r) =>
        [
          r.email,
          r.source ?? '',
          new Date(r.createdAt * 1000).toISOString(),
          r.unsubscribedAt ? new Date(r.unsubscribedAt * 1000).toISOString() : '',
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="logimind-newsletter-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ subscribers: rows });
}
