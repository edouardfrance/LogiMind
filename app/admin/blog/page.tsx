import Link from 'next/link';
import { desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin-auth';
import { db, schema } from '@/lib/db';
import { formatPublishedDate } from '@/lib/blog';
import { BlogTable } from './BlogTable';

export const dynamic = 'force-dynamic';

export default async function AdminBlogList() {
  await requireAdmin();
  const posts = await db
    .select()
    .from(schema.blogPosts)
    .orderBy(desc(schema.blogPosts.createdAt));

  return (
    <div style={{ padding: '32px 24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 4 }}>Journal</h1>
          <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
            {posts.length} article{posts.length > 1 ? 's' : ''} ·{' '}
            {posts.filter((p) => p.isPublished).length} publié
            {posts.filter((p) => p.isPublished).length > 1 ? 's' : ''}
          </div>
        </div>
        <Link
          href="/admin/blog/new"
          style={{
            padding: '10px 18px',
            background: 'var(--accent)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: 14,
            border: '1px solid var(--accent)',
          }}
        >
          + Nouvel article
        </Link>
      </div>

      {posts.length === 0 ? (
        <div
          style={{
            border: '1px dashed var(--border-strong)',
            padding: '60px 32px',
            textAlign: 'center',
            color: 'var(--ink-muted)',
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          <p>Aucun article pour l&apos;instant.</p>
        </div>
      ) : (
        <BlogTable
          posts={posts.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            category: p.category,
            isPublished: p.isPublished,
            publishedAtLabel: formatPublishedDate(p.publishedAt),
          }))}
        />
      )}
    </div>
  );
}
