/**
 * Schema.org JSON-LD pour fiche livre : Book + Product avec Offer par format.
 * Améliore rich results Google + AI Overviews.
 */
import type { Book, BookFormat } from '@/lib/schema';

interface Props {
  book: Book;
  formats: BookFormat[];
}

// Identifiants d'autorité de l'auteur (ISNI lié à la PERSONNE, pas à l'ouvrage :
// le livre conserve ISBN + DOI ; l'auteur porte ORCID + ISNI via sameAs).
const AUTHOR_NAME = 'Édouard de Boysson';
const AUTHOR_SAME_AS = [
  'https://orcid.org/0009-0006-0421-1683',
  'https://isni.org/isni/000000053039428X',
];

function authorNode(name: string) {
  const isKnownAuthor = name.trim() === AUTHOR_NAME;
  return {
    '@type': 'Person',
    name,
    ...(isKnownAuthor ? { sameAs: AUTHOR_SAME_AS } : {}),
  };
}

export function BookSchema({ book, formats }: Props) {
  // Offres de vente directe (Stripe) : uniquement formats avec prix réel + disponibles.
  const directOffers = formats
    .filter((f) => f.isAvailable && f.priceCents > 0)
    .map((f) => ({
      '@type': 'Offer',
      price: (f.priceCents / 100).toFixed(2),
      priceCurrency: f.currency,
      availability: 'https://schema.org/InStock',
      url: `https://logimind.org/books/${book.slug}`,
      itemOffered: {
        '@type': 'ProductModel',
        name: `${book.title} — ${formatLabelFr(f.format)}`,
        ...(f.isbn ? { isbn: f.isbn } : {}),
        ...(f.pageCount ? { numberOfPages: f.pageCount } : {}),
        bookFormat: bookFormatUrl(f.format),
      },
    }));

  // Offres externes Amazon : URL réelle du catalogue, sans prix (jamais inventé).
  // Représente fidèlement « achetable sur Amazon » dans le Schema.org.
  const amazonOffers = [
    book.amazonPaperbackUrl
      ? { url: book.amazonPaperbackUrl, format: 'paperback' as const }
      : null,
    book.amazonKindleUrl ? { url: book.amazonKindleUrl, format: 'kindle' as const } : null,
  ]
    .filter((o): o is { url: string; format: 'paperback' | 'kindle' } => o !== null)
    .map((o) => ({
      '@type': 'Offer',
      url: o.url,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Amazon' },
      itemOffered: {
        '@type': 'ProductModel',
        name: `${book.title} — ${formatLabelFr(o.format)}`,
        bookFormat: bookFormatUrl(o.format),
      },
    }));

  const offers = [...directOffers, ...amazonOffers];

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    ...(book.subtitle ? { alternativeHeadline: book.subtitle } : {}),
    description: book.descriptionShort,
    author: authorNode(book.author),
    publisher: { '@type': 'Organization', name: 'Logimind' },
    ...(book.publishedYear ? { datePublished: String(book.publishedYear) } : {}),
    ...(book.coverUrl ? { image: book.coverUrl } : {}),
    url: `https://logimind.org/books/${book.slug}`,
    inLanguage: 'fr',
    ...(offers.length > 0
      ? {
          offers: offers.length === 1 ? offers[0] : offers,
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function formatLabelFr(fmt: string): string {
  return fmt === 'pdf' ? 'PDF' : fmt === 'kindle' ? 'Kindle' : fmt === 'paperback' ? 'Broché' : 'Relié';
}

function bookFormatUrl(fmt: string): string {
  switch (fmt) {
    case 'pdf':
      return 'https://schema.org/EBook';
    case 'kindle':
      return 'https://schema.org/EBook';
    case 'paperback':
      return 'https://schema.org/Paperback';
    case 'hardcover':
      return 'https://schema.org/Hardcover';
    default:
      return 'https://schema.org/Book';
  }
}
