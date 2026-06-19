/**
 * Seed dev : crée 2 livres factices avec leurs formats.
 * Usage : `npm run db:seed`
 *
 * À remplacer par les vrais livres d'Edmond une fois les métadonnées fournies.
 */
import { runMigrations } from '../lib/migrate-libsql';
import { db, schema } from '../lib/db';
import { eq } from 'drizzle-orm';

interface SeedBook {
  slug: string;
  title: string;
  subtitle?: string;
  descriptionShort: string;
  descriptionLong: string;
  category?: string;
  publishedYear?: number;
  coverUrl: string;
  amazonKindleUrl?: string;
  formats: {
    format: 'pdf' | 'kindle' | 'paperback' | 'hardcover';
    isbn?: string;
    priceCents: number;
    pageCount?: number;
    weightGrams?: number;
    luluUrl?: string;
    pdfBlobKey?: string;
  }[];
}

const SEED_BOOKS: SeedBook[] = [
  {
    slug: 'exemple-livre-un',
    title: 'Premier livre (exemple)',
    subtitle: 'Sous-titre éditorial',
    descriptionShort:
      'Un texte d\'exemple pour valider la mise en page. Remplacez par la vraie description courte.',
    descriptionLong:
      'Texte long d\'exemple. Vous pouvez utiliser plusieurs paragraphes ici — ils seront affichés tels quels avec leurs retours à la ligne.\n\nC\'est ici qu\'on développe le pitch du livre, le contexte de son écriture, ce qu\'il apporte au lecteur.\n\nRemplacez par le vrai contenu via le seed ou via l\'admin.',
    category: 'Essai',
    publishedYear: 2026,
    coverUrl:
      'https://placehold.co/800x1200/efece5/8b1e1e/png?text=Logimind%5CnExemple',
    amazonKindleUrl: 'https://www.amazon.fr/dp/EXAMPLE',
    formats: [
      { format: 'pdf', isbn: '978-2-12345-001-0', priceCents: 990 },
      {
        format: 'paperback',
        isbn: '978-2-12345-002-7',
        priceCents: 1890,
        pageCount: 220,
        weightGrams: 280,
        luluUrl: 'https://www.lulu.com/exemple',
      },
      {
        format: 'hardcover',
        isbn: '978-2-12345-003-4',
        priceCents: 2890,
        pageCount: 220,
        weightGrams: 460,
        luluUrl: 'https://www.lulu.com/exemple-hc',
      },
      { format: 'kindle', isbn: 'B0CXXXX001', priceCents: 799 },
    ],
  },
  {
    slug: 'exemple-livre-deux',
    title: 'Deuxième livre (exemple)',
    descriptionShort: 'Un autre ouvrage de démonstration.',
    descriptionLong:
      'Description longue pour le deuxième livre exemple.\n\nÀ remplacer par le contenu réel.',
    category: 'Récit',
    publishedYear: 2025,
    coverUrl: 'https://placehold.co/800x1200/1a1a1a/f7f5f0/png?text=Livre+2',
    formats: [
      { format: 'pdf', isbn: '978-2-12345-101-9', priceCents: 1290 },
      {
        format: 'paperback',
        isbn: '978-2-12345-102-6',
        priceCents: 1990,
        pageCount: 340,
        weightGrams: 420,
      },
    ],
  },
];

async function main() {
  console.log('🔧 Migrations…');
  await runMigrations();

  console.log('🌱 Seed livres…');
  for (const data of SEED_BOOKS) {
    // Idempotent : upsert par slug
    const [existing] = await db
      .select()
      .from(schema.books)
      .where(eq(schema.books.slug, data.slug))
      .limit(1);

    let bookId: number;
    if (existing) {
      bookId = existing.id;
      console.log(`  • ${data.slug} (existe, id=${bookId})`);
    } else {
      const [row] = await db
        .insert(schema.books)
        .values({
          slug: data.slug,
          title: data.title,
          subtitle: data.subtitle ?? null,
          descriptionShort: data.descriptionShort,
          descriptionLong: data.descriptionLong,
          category: data.category ?? null,
          publishedYear: data.publishedYear ?? null,
          coverUrl: data.coverUrl,
          amazonKindleUrl: data.amazonKindleUrl ?? null,
          isPublished: 1,
        })
        .returning();
      bookId = row.id;
      console.log(`  ✓ créé ${data.slug} (id=${bookId})`);
    }

    for (const f of data.formats) {
      const [existingFormat] = await db
        .select()
        .from(schema.bookFormats)
        .where(eq(schema.bookFormats.bookId, bookId))
        .limit(50);
      const already = existingFormat
        ? await db
            .select()
            .from(schema.bookFormats)
            .where(eq(schema.bookFormats.bookId, bookId))
            .then((rows) => rows.find((r) => r.format === f.format))
        : null;

      if (already) {
        console.log(`     - ${f.format} (existe)`);
        continue;
      }
      await db.insert(schema.bookFormats).values({
        bookId,
        format: f.format,
        isbn: f.isbn ?? null,
        priceCents: f.priceCents,
        pageCount: f.pageCount ?? null,
        weightGrams: f.weightGrams ?? null,
        luluUrl: f.luluUrl ?? null,
        pdfBlobKey: f.pdfBlobKey ?? null,
        isAvailable: 1,
      });
      console.log(`     + ${f.format} (${(f.priceCents / 100).toFixed(2)}€)`);
    }
  }

  console.log('✅ Seed terminé');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
