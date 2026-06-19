import Link from 'next/link';
import type { BookWithFormats } from '@/lib/books';
import { formatPrice } from '@/lib/books';

interface BookCardProps {
  book: BookWithFormats;
}

export function BookCard({ book }: BookCardProps) {
  const sellable = book.formats.filter((f) => f.priceCents > 0 && f.isAvailable);
  const minPrice = sellable.length ? Math.min(...sellable.map((f) => f.priceCents)) : null;
  const hasAmazon = Boolean(book.amazonPaperbackUrl || book.amazonKindleUrl);

  return (
    <Link
      href={`/books/${book.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '100%',
      }}
      className="book-card"
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '2 / 3',
          background: 'var(--bg-muted)',
          overflow: 'hidden',
        }}
      >
        {book.coverUrl ? (
          // Image native pour éviter la config Image domains au début
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={`Couverture de ${book.title}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              fontFamily: 'var(--font-serif)',
              fontSize: 32,
              color: 'var(--ink-faint)',
            }}
          >
            {book.title.charAt(0)}
          </div>
        )}
      </div>

      <div
        style={{
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          flex: 1,
        }}
      >
        {book.category && (
          <div
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--ink-muted)',
            }}
          >
            {book.category}
          </div>
        )}
        <h3
          style={{
            fontSize: 20,
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {book.title}
        </h3>
        {book.subtitle && (
          <div style={{ fontSize: 14, color: 'var(--ink-muted)', fontStyle: 'italic' }}>
            {book.subtitle}
          </div>
        )}
        <p
          style={{
            fontSize: 14,
            color: 'var(--ink-default)',
            margin: '8px 0 0',
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {book.descriptionShort}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 12,
            paddingTop: 12,
            borderTop: '1px solid var(--border-default)',
          }}
        >
          {book.releaseLabel ? (
            <div
              style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                color: 'var(--gold)',
              }}
            >
              À paraître
            </div>
          ) : minPrice !== null ? (
            <div style={{ fontSize: 14, color: 'var(--ink-muted)' }}>
              à partir de{' '}
              <strong style={{ color: 'var(--ink-strong)' }}>{formatPrice(minPrice)}</strong>
            </div>
          ) : hasAmazon ? (
            <div style={{ fontSize: 14, color: 'var(--ink-muted)' }}>Sur Amazon</div>
          ) : (
            <span />
          )}
          <div
            style={{
              fontSize: 13,
              color: 'var(--accent)',
              fontWeight: 500,
            }}
          >
            Découvrir →
          </div>
        </div>
      </div>
    </Link>
  );
}
