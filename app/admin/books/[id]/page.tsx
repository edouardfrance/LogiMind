import { notFound } from 'next/navigation';
import { eq, asc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin-auth';
import { db, schema } from '@/lib/db';
import { BookForm } from '../BookForm';
import { FormatsManager } from '../FormatsManager';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const bookId = parseInt(id, 10);
  if (!Number.isFinite(bookId)) notFound();

  const [book] = await db
    .select()
    .from(schema.books)
    .where(eq(schema.books.id, bookId))
    .limit(1);
  if (!book) notFound();

  const formats = await db
    .select()
    .from(schema.bookFormats)
    .where(eq(schema.bookFormats.bookId, bookId))
    .orderBy(asc(schema.bookFormats.priceCents));

  return (
    <div style={{ padding: '32px 24px', maxWidth: 880, margin: '0 auto' }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: 'var(--ink-muted)' }}>
        <a href="/admin" style={{ color: 'var(--ink-muted)' }}>
          ← Tous les livres
        </a>
      </div>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>{book.title}</h1>
      <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 32 }}>
        Slug : <code>/{book.slug}</code> · Statut :{' '}
        <strong style={{ color: book.isPublished ? 'var(--success)' : 'var(--warning)' }}>
          {book.isPublished ? 'Publié' : 'Brouillon'}
        </strong>
      </div>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 18, marginBottom: 16, fontFamily: 'var(--font-sans)' }}>
          Métadonnées
        </h2>
        <BookForm mode="edit" book={book} />
      </section>

      <section>
        <h2 style={{ fontSize: 18, marginBottom: 16, fontFamily: 'var(--font-sans)' }}>
          Formats &amp; prix
        </h2>
        <FormatsManager bookId={book.id} bookSlug={book.slug} formats={formats} />
      </section>
    </div>
  );
}
