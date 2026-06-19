import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBookBySlug, formatLabel, formatPrice } from '@/lib/books';
import { BuyButton } from '@/components/BuyButton';
import { BookSchema } from '@/components/BookSchema';
import { PurchaseFAQ } from '@/components/PurchaseFAQ';
import { TrustBadges } from '@/components/TrustBadges';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug).catch(() => null);
  if (!book) return { title: 'Livre introuvable' };
  // Image OG : couverture HD si disponible, sinon carte typographique générée
  // dynamiquement (/og) — jamais de fausse couverture.
  const ogImage = book.coverUrl
    ? book.coverUrl
    : `https://logimind.org/og?title=${encodeURIComponent(book.title)}&subtitle=${encodeURIComponent(book.subtitle ?? book.author)}`;
  return {
    title: book.title,
    description: book.descriptionShort,
    alternates: { canonical: `/books/${book.slug}` },
    openGraph: {
      type: 'book',
      title: book.title,
      description: book.descriptionShort,
      url: `https://logimind.org/books/${book.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: book.title,
      description: book.descriptionShort,
      images: [ogImage],
    },
  };
}

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params;
  let book: Awaited<ReturnType<typeof getBookBySlug>> = null;

  try {
    book = await getBookBySlug(slug);
  } catch {
    notFound();
  }

  if (!book) notFound();

  const orderedFormats = ['pdf', 'paperback', 'hardcover', 'kindle']
    .map((fmt) => book!.formats.find((f) => f.format === fmt))
    .filter((f): f is NonNullable<typeof f> => f !== undefined);

  // Options d'achat : vente Stripe (prix réel + disponible) vs achat externe Amazon (vitrine).
  const sellable = orderedFormats.filter((f) => f.priceCents > 0 && f.isAvailable);
  const amazonOptions = [
    book.amazonPaperbackUrl
      ? { key: 'az-paperback', label: 'Broché', url: book.amazonPaperbackUrl }
      : null,
    book.amazonKindleUrl
      ? { key: 'az-kindle', label: 'Kindle', url: book.amazonKindleUrl }
      : null,
  ].filter((o): o is { key: string; label: string; url: string } => o !== null);

  return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 320px) 1fr',
          gap: 56,
          alignItems: 'start',
        }}
        className="book-grid"
      >
        {/* Couverture */}
        <div>
          <div
            style={{
              aspectRatio: '2 / 3',
              background: 'var(--bg-muted)',
              border: '1px solid var(--border-default)',
              overflow: 'hidden',
              position: 'sticky',
              top: 88,
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {book.coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.coverUrl}
                alt={`Couverture de ${book.title}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
        </div>

        {/* Détail */}
        <div>
          {book.category && (
            <div
              style={{
                fontSize: 12,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-muted)',
                marginBottom: 12,
              }}
            >
              {book.category}
            </div>
          )}
          <h1 style={{ marginBottom: 8 }}>{book.title}</h1>
          {book.subtitle && (
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 22,
                fontStyle: 'italic',
                color: 'var(--ink-muted)',
                marginBottom: 16,
              }}
            >
              {book.subtitle}
            </div>
          )}
          <div style={{ fontSize: 14, color: 'var(--ink-muted)', marginBottom: 32 }}>
            par <strong style={{ color: 'var(--ink-strong)' }}>{book.author}</strong>
            {book.publishedYear ? ` · ${book.publishedYear}` : ''}
          </div>

          {/* Description longue : on suppose markdown light → plain text avec line breaks */}
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 18,
              lineHeight: 1.65,
              color: 'var(--ink-default)',
              marginBottom: 40,
              maxWidth: 580,
              whiteSpace: 'pre-wrap',
            }}
          >
            {book.descriptionLong}
          </div>

          {book.excerptUrl && (
            <div style={{ marginBottom: 32 }}>
              <a
                href={book.excerptUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 14,
                  color: 'var(--ink-strong)',
                  textDecorationColor: 'var(--accent)',
                }}
              >
                Lire un extrait gratuit (PDF) ↗
              </a>
            </div>
          )}

          {/* Achat : à paraître / vente Stripe / achat externe Amazon */}
          <div
            style={{
              borderTop: '1px solid var(--border-default)',
              paddingTop: 32,
              marginBottom: 24,
            }}
          >
            {book.releaseLabel ? (
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  padding: '20px 24px',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    color: 'var(--gold)',
                    marginBottom: 8,
                  }}
                >
                  À paraître
                </div>
                <p style={{ margin: '0 0 4px', fontSize: 16, color: 'var(--ink-strong)' }}>
                  {book.releaseLabel}
                </p>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-muted)' }}>
                  Inscrivez-vous à la lettre pour être prévenu·e de la parution.
                </p>
              </div>
            ) : sellable.length > 0 || amazonOptions.length > 0 ? (
              <>
                <h2 style={{ fontSize: 16, marginBottom: 16, fontFamily: 'var(--font-sans)' }}>
                  {sellable.length > 0 ? 'Choisir un format' : 'Disponible sur Amazon'}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {sellable.map((fmt, idx) => {
                    const sub =
                      fmt.format === 'pdf'
                        ? 'Téléchargement immédiat'
                        : fmt.format === 'paperback' || fmt.format === 'hardcover'
                          ? 'Livraison 7-14 jours'
                          : undefined;
                    return (
                      <BuyButton
                        key={fmt.id}
                        bookFormatId={fmt.id}
                        label={formatLabel(fmt.format)}
                        price={formatPrice(fmt.priceCents, fmt.currency)}
                        subLabel={sub}
                        primary={idx === 0}
                      />
                    );
                  })}
                  {amazonOptions.map((opt, idx) => (
                    <BuyButton
                      key={opt.key}
                      bookFormatId={0}
                      label={opt.label}
                      price="Voir sur Amazon ↗"
                      externalUrl={opt.url}
                      primary={sellable.length === 0 && idx === 0}
                    />
                  ))}
                </div>
                {sellable.length > 0 && <TrustBadges />}
              </>
            ) : (
              <div style={{ color: 'var(--ink-muted)', fontSize: 14 }}>
                Bientôt disponible.
              </div>
            )}
          </div>

          <PurchaseFAQ />
          <BookSchema book={book} formats={book.formats} />

          {/* ISBNs (transparence + SEO) */}
          {orderedFormats.some((f) => f.isbn) && (
            <details
              style={{
                borderTop: '1px solid var(--border-default)',
                paddingTop: 16,
                fontSize: 13,
                color: 'var(--ink-muted)',
              }}
            >
              <summary style={{ cursor: 'pointer', color: 'var(--ink-default)' }}>
                Informations bibliographiques
              </summary>
              <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
                {orderedFormats
                  .filter((f) => f.isbn)
                  .map((f) => (
                    <div key={f.id}>
                      ISBN ({formatLabel(f.format)}) : <code>{f.isbn}</code>
                      {f.pageCount ? ` · ${f.pageCount} pages` : ''}
                    </div>
                  ))}
              </div>
            </details>
          )}
        </div>
      </div>

      {/* Responsive grid override */}
      <style>{`
        @media (max-width: 768px) {
          .book-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
}
