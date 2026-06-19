/**
 * Admin home — sheet-style table de tous les livres + leurs formats.
 * Inline edit pour les champs simples, modal/page dédiée pour les autres.
 */
import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { db, schema } from '@/lib/db';
import { asc } from 'drizzle-orm';
import { formatLabel, formatPrice } from '@/lib/books';
import { BooksTable } from './BooksTable';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  await requireAdmin();

  const books = await db
    .select()
    .from(schema.books)
    .orderBy(asc(schema.books.displayOrder), asc(schema.books.title));

  const formats = await db.select().from(schema.bookFormats);

  const booksWithFormats = books.map((b) => ({
    ...b,
    formats: formats.filter((f) => f.bookId === b.id),
  }));

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
          <h1 style={{ fontSize: 28, marginBottom: 4 }}>Livres</h1>
          <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
            {books.length} livre{books.length > 1 ? 's' : ''} ·{' '}
            {formats.length} format{formats.length > 1 ? 's' : ''} ·{' '}
            {books.filter((b) => b.isPublished).length} publié
            {books.filter((b) => b.isPublished).length > 1 ? 's' : ''}
          </div>
        </div>
        <Link
          href="/admin/books/new"
          style={{
            padding: '10px 18px',
            background: 'var(--accent)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: 14,
            border: '1px solid var(--accent)',
          }}
        >
          + Nouveau livre
        </Link>
      </div>

      {books.length === 0 ? (
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
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 22,
              color: 'var(--ink-strong)',
              marginBottom: 12,
            }}
          >
            Aucun livre encore
          </div>
          <p style={{ margin: '0 0 24px' }}>
            Commence par ajouter ton premier livre. Tu pourras ensuite ajouter
            ses formats (PDF, broché, relié, Kindle).
          </p>
          <Link
            href="/admin/books/new"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'var(--accent)',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            Créer le premier livre
          </Link>
        </div>
      ) : (
        <BooksTable
          books={booksWithFormats.map((b) => ({
            ...b,
            formatsSummary: b.formats
              .map((f) => `${formatLabel(f.format)} (${formatPrice(f.priceCents, f.currency)})`)
              .join(' · '),
          }))}
        />
      )}
    </div>
  );
}
