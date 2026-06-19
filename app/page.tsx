import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedBooks } from '@/lib/books';
import { getPublishedPosts, formatPublishedDate } from '@/lib/blog';
import { BookCard } from '@/components/BookCard';
import { Ornament } from '@/components/Ornament';
import { NewsletterSection } from '@/components/NewsletterSection';
import { Reveal } from '@/components/Reveal';

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    languages: { fr: '/', en: '/en', 'x-default': '/' },
  },
};

export default async function CatalogPage() {
  let books: Awaited<ReturnType<typeof getPublishedBooks>> = [];
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  let dbError: string | null = null;

  try {
    [books, posts] = await Promise.all([getPublishedBooks(), getPublishedPosts()]);
  } catch (e) {
    dbError = e instanceof Error ? e.message : 'Erreur DB';
  }

  const featured = books[0];
  const others = books.slice(1);

  return (
    <>
      <section
        style={{
          padding: '88px 20px 56px',
          background: 'linear-gradient(180deg, var(--bg-page-deep) 0%, var(--bg-page) 100%)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div className="container" style={{ maxWidth: 760, textAlign: 'center' }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              Recherche &amp; synthèse documentaire
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              style={{
                fontSize: 'clamp(2.1rem, 4.6vw, 3.8rem)',
                lineHeight: 1.05,
                marginBottom: 22,
              }}
            >
              Bibliothèque Édouard de&nbsp;Boysson
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              className="lead"
              style={{ maxWidth: 580, margin: '0 auto 28px', color: 'var(--ink-default)' }}
            >
              Travaux d&apos;analyse et de synthèse sur les corpus de
              <strong> psychothérapies</strong> et de <strong>sciences cognitives</strong>.
              Approche méthodique et systémique, à partir des fonds de bibliothèques
              universitaires.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: 8,
              }}
            >
              <Link
                href="#catalogue"
                style={{
                  padding: '14px 28px',
                  background: 'var(--ink-strong)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: '0.03em',
                  minHeight: 44,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Voir le catalogue
              </Link>
              <Link
                href="/a-propos"
                style={{
                  padding: '14px 28px',
                  background: 'transparent',
                  color: 'var(--ink-strong)',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: '0.03em',
                  border: '1px solid var(--border-strong)',
                  minHeight: 44,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Notice auteur
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.42}>
            <Ornament marginY={32} />
          </Reveal>
        </div>
      </section>

      <section id="catalogue" style={{ padding: '64px 20px 32px' }}>
        <div className="container">
          {dbError && (
            <div style={errBox}>
              Catalogue temporairement indisponible.
              <div style={{ fontSize: 12, marginTop: 8 }}>Détail technique&nbsp;: {dbError}</div>
            </div>
          )}

          {!dbError && books.length === 0 && (
            <Reveal>
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 24px',
                  color: 'var(--ink-muted)',
                  border: '1px dashed var(--border-strong)',
                  background: 'var(--bg-card)',
                  maxWidth: 640,
                  margin: '0 auto',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.6rem, 4vw, 1.9rem)',
                    color: 'var(--ink-strong)',
                    marginBottom: 12,
                    fontStyle: 'italic',
                  }}
                >
                  Mise sous presse.
                </div>
                <p style={{ margin: '0 0 24px', fontFamily: 'var(--font-serif)', fontSize: 17 }}>
                  Les premiers ouvrages seront publiés ici très prochainement.
                  <br />
                  En attendant, inscrivez-vous pour être prévenu·e.
                </p>
                <Link
                  href="/blog"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '12px 24px',
                    minHeight: 44,
                    background: 'transparent',
                    color: 'var(--ink-strong)',
                    border: '1px solid var(--border-strong)',
                    textDecoration: 'none',
                    fontSize: 14,
                  }}
                >
                  Lire le Journal en attendant
                </Link>
              </div>
            </Reveal>
          )}

          {featured && (
            <Reveal>
              <article
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(220px, 320px) 1fr',
                  gap: 56,
                  alignItems: 'center',
                  marginBottom: 80,
                  padding: 32,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-md)',
                }}
                className="featured-grid"
              >
                <Link href={`/books/${featured.slug}`} style={{ display: 'block' }}>
                  <div
                    style={{
                      aspectRatio: '2 / 3',
                      background: 'var(--bg-muted)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {featured.coverUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featured.coverUrl}
                        alt={`Couverture de ${featured.title}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 64,
                          color: 'var(--ink-faint)',
                        }}
                      >
                        {featured.title.charAt(0)}
                      </span>
                    )}
                  </div>
                </Link>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 12 }}>
                    À la une
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', marginBottom: 10 }}>
                    {featured.title}
                  </h2>
                  {featured.subtitle && (
                    <div
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(17px, 2vw, 19px)',
                        fontStyle: 'italic',
                        color: 'var(--ink-muted)',
                        marginBottom: 16,
                      }}
                    >
                      {featured.subtitle}
                    </div>
                  )}
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 17,
                      lineHeight: 1.65,
                      color: 'var(--ink-default)',
                      margin: '0 0 24px',
                    }}
                  >
                    {featured.descriptionShort}
                  </p>
                  <Link
                    href={`/books/${featured.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '12px 24px',
                      minHeight: 44,
                      background: 'var(--accent)',
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    Lire la fiche &amp; acheter →
                  </Link>
                </div>
              </article>
            </Reveal>
          )}

          {others.length > 0 && (
            <>
              <Reveal>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: 24,
                  }}
                >
                  <h2 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.7rem)', fontFamily: 'var(--font-serif)' }}>
                    Autres ouvrages
                  </h2>
                  <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
                    {others.length} livre{others.length > 1 ? 's' : ''}
                  </span>
                </div>
              </Reveal>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: 24,
                }}
              >
                {others.map((book, i) => (
                  <Reveal key={book.id} delay={Math.min(i * 0.06, 0.3)}>
                    <BookCard book={book} />
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {posts.length > 0 && (
        <section style={{ padding: '64px 20px', background: 'var(--bg-page-deep)' }}>
          <div className="container" style={{ maxWidth: 920 }}>
            <Reveal>
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
                  <div className="eyebrow" style={{ marginBottom: 8 }}>
                    Journal
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2rem)' }}>
                    Lectures &amp; réflexions
                  </h2>
                </div>
                <Link
                  href="/blog"
                  style={{
                    fontSize: 14,
                    color: 'var(--ink-strong)',
                    textDecorationColor: 'var(--accent)',
                  }}
                >
                  Tous les articles →
                </Link>
              </div>
            </Reveal>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 20,
              }}
            >
              {posts.slice(0, 3).map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <li
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-default)',
                      padding: 24,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      height: '100%',
                    }}
                    className="book-card-hover"
                  >
                    <Link
                      href={`/blog/${p.slug}`}
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      {p.category && (
                        <div
                          style={{
                            fontSize: 11,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--gold)',
                            marginBottom: 10,
                            fontWeight: 600,
                          }}
                        >
                          {p.category}
                        </div>
                      )}
                      <h3 style={{ fontSize: 20, lineHeight: 1.25, marginBottom: 10 }}>
                        {p.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: 15,
                          lineHeight: 1.55,
                          color: 'var(--ink-muted)',
                          margin: '0 0 12px',
                        }}
                      >
                        {p.excerpt}
                      </p>
                      <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
                        {formatPublishedDate(p.publishedAt)}
                        {p.readingMinutes ? ` · ${p.readingMinutes} min` : ''}
                      </div>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <NewsletterSection source="home" variant="dark" />

      <style>{`
        @media (max-width: 768px) {
          .featured-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
            text-align: center;
            padding: 24px !important;
          }
          .featured-grid img {
            max-width: 200px;
            margin: 0 auto;
          }
        }
      `}</style>
    </>
  );
}

const errBox: React.CSSProperties = {
  border: '1px solid var(--border-default)',
  background: 'var(--bg-card)',
  padding: 24,
  textAlign: 'center',
  color: 'var(--ink-muted)',
  maxWidth: 600,
  margin: '0 auto',
};
