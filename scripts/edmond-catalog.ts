/**
 * edmond-catalog.ts — upsert idempotent du catalogue (books + book_formats).
 *
 * Utilisé par l'agent de maintenance « Edmond » ET exécutable à la main.
 * Lit un fichier JSON (défaut: ~/logimind-edmond-agent/state/catalog.json) et
 * synchronise la base. Conçu pour tourner sans supervision sur la base de PROD.
 *
 * CONTRAT DE SÉCURITÉ (ne jamais enfreindre) :
 *  - Touche UNIQUEMENT les tables `books` et `book_formats`. Jamais orders,
 *    order_items, download_tokens, stripe, newsletter.
 *  - LIGNE DE SÉCURITÉ FINANCIÈRE : ne MODIFIE JAMAIS le prix (price_cents), la
 *    disponibilité (is_available) ni le stripe_price_id. À la création d'un format,
 *    price_cents = data.priceCents ?? 0 et is_available = (price > 0 ? 1 : 0) → un
 *    format à prix 0 n'est jamais achetable via Stripe. La tarification et la vente
 *    Stripe restent une décision humaine (via /admin). L'agent ne crée donc jamais
 *    d'achat possible à un prix fabriqué.
 *  - is_published, release_label, amazon_*_url, métadonnées descriptives : pilotés
 *    par les données (catalog.json). Un livre « publié » à prix 0 + lien Amazon est
 *    une simple VITRINE (visible, achat externe Amazon), pas une vente Stripe.
 *  - Ne supprime jamais rien.
 *
 * Usage :
 *   tsx --env-file-if-exists=.env.local scripts/edmond-catalog.ts [chemin.json] [--dry-run]
 */
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { eq, and } from 'drizzle-orm';
import { db, schema } from '../lib/db';

const now = () => Math.floor(Date.now() / 1000);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const jsonPath =
  args.find((a) => !a.startsWith('--')) ??
  `${homedir()}/logimind-edmond-agent/state/catalog.json`;

type FormatInput = {
  format: 'pdf' | 'kindle' | 'paperback' | 'hardcover';
  isbn?: string | null;
  priceCents?: number;
  pageCount?: number | null;
  luluUrl?: string | null;
};
type BookInput = {
  slug: string;
  title: string;
  subtitle?: string | null;
  author?: string;
  descriptionShort: string;
  descriptionLong: string;
  coverUrl?: string; // vide => placeholder typographique (couverture à fournir)
  amazonKindleUrl?: string | null;
  amazonPaperbackUrl?: string | null;
  releaseLabel?: string | null; // ex. « Parution 2026 » => affiché « à paraître »
  isPublished?: boolean; // vitrine visible ; n'active jamais la vente Stripe
  category?: string | null;
  publishedYear?: number | null;
  displayOrder?: number;
  formats?: FormatInput[];
};

const ALLOWED_FORMATS = new Set(['pdf', 'kindle', 'paperback', 'hardcover']);

function loadCatalog(): BookInput[] {
  let raw: string;
  try {
    raw = readFileSync(jsonPath, 'utf8');
  } catch {
    console.log(`[edmond-catalog] aucun fichier ${jsonPath} → rien à faire.`);
    return [];
  }
  const parsed = JSON.parse(raw);
  const books: BookInput[] = Array.isArray(parsed) ? parsed : parsed.books;
  if (!Array.isArray(books)) throw new Error('JSON invalide : attendu { books: [...] } ou [...]');
  return books;
}

async function run() {
  const books = loadCatalog();
  console.log(`[edmond-catalog] ${books.length} livre(s) dans ${jsonPath}${dryRun ? '  (DRY-RUN)' : ''}`);
  let created = 0,
    updated = 0,
    fmtCreated = 0,
    fmtUpdated = 0,
    skipped = 0;

  for (const b of books) {
    // garde-fous d'entrée : champs obligatoires
    if (!b.slug || !b.title || !b.descriptionShort || !b.descriptionLong) {
      console.log(`  ⏭  "${b.slug ?? '?'}" sauté : slug/title/descriptions obligatoires manquants.`);
      skipped++;
      continue;
    }

    const [existing] = await db.select().from(schema.books).where(eq(schema.books.slug, b.slug)).limit(1);

    let bookId: number;
    if (existing) {
      // UPDATE métadonnées descriptives uniquement — jamais is_published.
      const patch: Record<string, unknown> = {
        title: b.title,
        subtitle: b.subtitle ?? null,
        author: b.author ?? existing.author,
        descriptionShort: b.descriptionShort,
        descriptionLong: b.descriptionLong,
        amazonKindleUrl: b.amazonKindleUrl ?? existing.amazonKindleUrl,
        amazonPaperbackUrl: b.amazonPaperbackUrl ?? existing.amazonPaperbackUrl,
        releaseLabel: b.releaseLabel ?? existing.releaseLabel,
        isPublished: b.isPublished ? 1 : 0,
        category: b.category ?? existing.category,
        publishedYear: b.publishedYear ?? existing.publishedYear,
        displayOrder: b.displayOrder ?? existing.displayOrder,
        updatedAt: now(),
      };
      // coverUrl mis à jour seulement si une vraie valeur est fournie (ne pas écraser une couverture posée via /admin par du vide)
      if (b.coverUrl && b.coverUrl.trim()) patch.coverUrl = b.coverUrl.trim();

      bookId = existing.id;
      console.log(`  ✏️  update book #${bookId} ${b.slug} (is_published=${b.isPublished ? 1 : 0}, release=${b.releaseLabel ?? '-'})`);
      if (!dryRun) await db.update(schema.books).set(patch).where(eq(schema.books.id, bookId)).run();
      updated++;
    } else {
      // INSERT. Vitrine : peut être publié (visible) mais jamais vendable Stripe (cf. formats).
      console.log(`  ➕  create book ${b.isPublished ? 'PUBLIÉ-vitrine' : 'BROUILLON'} ${b.slug} "${b.title}"`);
      if (!dryRun) {
        const res = await db
          .insert(schema.books)
          .values({
            slug: b.slug,
            title: b.title,
            subtitle: b.subtitle ?? null,
            author: b.author ?? 'Édouard de Boysson',
            descriptionShort: b.descriptionShort,
            descriptionLong: b.descriptionLong,
            coverUrl: (b.coverUrl ?? '').trim(),
            amazonKindleUrl: b.amazonKindleUrl ?? null,
            amazonPaperbackUrl: b.amazonPaperbackUrl ?? null,
            releaseLabel: b.releaseLabel ?? null,
            category: b.category ?? null,
            publishedYear: b.publishedYear ?? null,
            isPublished: b.isPublished ? 1 : 0,
            displayOrder: b.displayOrder ?? 0,
          })
          .returning({ id: schema.books.id });
        bookId = res[0].id;
      } else {
        bookId = -1;
      }
      created++;
    }

    // Formats
    for (const f of b.formats ?? []) {
      if (!ALLOWED_FORMATS.has(f.format)) {
        console.log(`     ⏭  format "${f.format}" invalide, sauté.`);
        continue;
      }
      const existingFmt =
        bookId > 0
          ? (
              await db
                .select()
                .from(schema.bookFormats)
                .where(and(eq(schema.bookFormats.bookId, bookId), eq(schema.bookFormats.format, f.format)))
                .limit(1)
            )[0]
          : undefined;

      if (existingFmt) {
        // UPDATE métadonnées descriptives uniquement — jamais price/availability/stripe.
        console.log(`     ✏️  update format ${f.format} (isbn/pages ; prix inchangé=${existingFmt.priceCents}c)`);
        if (!dryRun) {
          await db
            .update(schema.bookFormats)
            .set({
              isbn: f.isbn ?? existingFmt.isbn,
              pageCount: f.pageCount ?? existingFmt.pageCount,
              luluUrl: f.luluUrl ?? existingFmt.luluUrl,
            })
            .where(eq(schema.bookFormats.id, existingFmt.id))
            .run();
        }
        fmtUpdated++;
      } else {
        const price = f.priceCents ?? 0;
        console.log(`     ➕  create format ${f.format} isbn=${f.isbn ?? '-'} price=${price}c available=${price > 0 ? 1 : 0}`);
        if (!dryRun && bookId > 0) {
          await db.insert(schema.bookFormats).values({
            bookId,
            format: f.format,
            isbn: f.isbn ?? null,
            priceCents: price,
            pageCount: f.pageCount ?? null,
            luluUrl: f.luluUrl ?? null,
            isAvailable: price > 0 ? 1 : 0,
          });
        }
        fmtCreated++;
      }
    }
  }

  console.log(
    `[edmond-catalog] terminé : books +${created} ~${updated}, formats +${fmtCreated} ~${fmtUpdated}, sautés ${skipped}.${dryRun ? '  (DRY-RUN, rien écrit)' : ''}`
  );
  process.exit(0);
}

run().catch((e) => {
  console.error('[edmond-catalog] ERREUR :', e);
  process.exit(1);
});
