import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin-auth';
import { db, schema } from '@/lib/db';
import { PostForm } from '../PostForm';

export const dynamic = 'force-dynamic';

interface PageProps { params: Promise<{ id: string }>; }

export default async function EditPost({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const n = parseInt(id, 10);
  if (!Number.isFinite(n)) notFound();
  const [post] = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.id, n))
    .limit(1);
  if (!post) notFound();
  return (
    <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 8 }}>
        <a href="/admin/blog" style={{ color: 'var(--ink-muted)' }}>← Journal</a>
      </div>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>{post.title}</h1>
      <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 24 }}>
        /blog/{post.slug} · Statut :{' '}
        <strong style={{ color: post.isPublished ? 'var(--success)' : 'var(--warning)' }}>
          {post.isPublished ? 'Publié' : 'Brouillon'}
        </strong>
      </div>
      <PostForm mode="edit" post={post} />
    </div>
  );
}
