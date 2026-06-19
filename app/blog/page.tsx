import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedPosts, formatPublishedDate } from '@/lib/blog';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Articles et réflexions d\'Édouard de Boysson : psychothérapie, contre-hypnose, coaching, et regards cliniques.',
  openGraph: {
    title: 'Journal — Logimind',
    description:
      'Articles et réflexions d\'Édouard de Boysson.',
  },
};

export default async function BlogIndexPage() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  let dbError: string | null = null;
  try {
    posts = await getPublishedPosts();
  } catch (e) {
    dbError = e instanceof Error ? e.message : 'erreur DB';
  }

  return (
    <div className="container" style={{ padding: '64px 24px', maxWidth: 880 }}>
      <header style={{ marginBottom: 48, textAlign: 'center' }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            marginBottom: 12,
          }}
        >
          Journal
        </div>
        <h1 style={{ marginBottom: 16 }}>Réflexions &amp; clinique</h1>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 19,
            lineHeight: 1.6,
            color: 'var(--ink-default)',
            maxWidth: 560,
            margin: '0 auto',
          }}
        >
          Articles, repères, et regards d&apos;Édouard de Boysson — un travail au long cours
          partagé librement.
        </p>
      </header>

      {dbError && (
        <div style={errBox}>
          Le journal est temporairement indisponible. Réessaie dans un instant.
        </div>
      )}

      {!dbError && posts.length === 0 && (
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
            Premiers articles à venir
          </div>
          <p style={{ margin: 0 }}>
            Le journal s&apos;enrichira dans les semaines à venir.{' '}
            <Link href="/" style={{ color: 'var(--accent)' }}>
              Voir les livres
            </Link>{' '}
            en attendant.
          </p>
        </div>
      )}

      {posts.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {posts.map((p, i) => (
            <li
              key={p.id}
              style={{
                borderTop: i === 0 ? '1px solid var(--border-default)' : 'none',
                borderBottom: '1px solid var(--border-default)',
                padding: '32px 0',
              }}
            >
              <Link
                href={`/blog/${p.slug}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: p.coverUrl ? '180px 1fr' : '1fr',
                  gap: 24,
                  textDecoration: 'none',
                  color: 'inherit',
                  alignItems: 'center',
                }}
                className="blog-card"
              >
                {p.coverUrl && (
                  <div
                    style={{
                      aspectRatio: '4 / 3',
                      background: 'var(--bg-muted)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.coverUrl}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div>
                  {p.category && (
                    <div
                      style={{
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--ink-muted)',
                        marginBottom: 8,
                      }}
                    >
                      {p.category}
                    </div>
                  )}
                  <h2 style={{ fontSize: 24, lineHeight: 1.2, marginBottom: 8 }}>{p.title}</h2>
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 17,
                      lineHeight: 1.55,
                      color: 'var(--ink-default)',
                      margin: '0 0 12px',
                    }}
                  >
                    {p.excerpt}
                  </p>
                  <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                    {formatPublishedDate(p.publishedAt)}
                    {p.readingMinutes ? ` · ${p.readingMinutes} min` : ''}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        @media (max-width: 640px) {
          .blog-card {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const errBox: React.CSSProperties = {
  padding: 24,
  border: '1px solid var(--border-default)',
  background: 'var(--bg-card)',
  textAlign: 'center',
  color: 'var(--ink-muted)',
  maxWidth: 600,
  margin: '0 auto',
};
