/**
 * Queries livres : catalogue + détail par slug.
 * Charge livres + tous leurs formats en une roundtrip côté serveur.
 */
import { and, asc, eq } from 'drizzle-orm';
import { db, schema } from './db';
import type { Book, BookFormat } from './schema';

export interface BookWithFormats extends Book {
  formats: BookFormat[];
}

/** Catalogue publié, ordonné par display_order asc puis title. */
export async function getPublishedBooks(): Promise<BookWithFormats[]> {
  const rows = await db
    .select()
    .from(schema.books)
    .where(eq(schema.books.isPublished, 1))
    .orderBy(asc(schema.books.displayOrder), asc(schema.books.title));

  if (rows.length === 0) return [];

  const formats = await db
    .select()
    .from(schema.bookFormats)
    .where(eq(schema.bookFormats.isAvailable, 1));

  return rows.map((book) => ({
    ...book,
    formats: formats.filter((f) => f.bookId === book.id),
  }));
}

export async function getBookBySlug(slug: string): Promise<BookWithFormats | null> {
  const [book] = await db
    .select()
    .from(schema.books)
    .where(and(eq(schema.books.slug, slug), eq(schema.books.isPublished, 1)))
    .limit(1);

  if (!book) return null;

  const formats = await db
    .select()
    .from(schema.bookFormats)
    .where(eq(schema.bookFormats.bookId, book.id))
    .orderBy(asc(schema.bookFormats.priceCents));

  return { ...book, formats };
}

export async function getBookFormatById(id: number): Promise<BookFormat | null> {
  const [row] = await db
    .select()
    .from(schema.bookFormats)
    .where(eq(schema.bookFormats.id, id))
    .limit(1);
  return row ?? null;
}

/** Label FR pour un format. */
export function formatLabel(fmt: string): string {
  switch (fmt) {
    case 'pdf':
      return 'PDF';
    case 'kindle':
      return 'Kindle';
    case 'paperback':
      return 'Broché';
    case 'hardcover':
      return 'Relié';
    default:
      return fmt;
  }
}

/** Format prix EUR depuis cents. */
export function formatPrice(cents: number, currency = 'EUR'): string {
  const eur = cents / 100;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: eur % 1 === 0 ? 0 : 2,
  }).format(eur);
}
