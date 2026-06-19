import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  formatPublishedDate,
  getPostBySlug,
  getRelatedPosts,
  renderMarkdownLight,
} from '@/lib/blog';
import { Ornament } from '@/components/Ornament';
import { NewsletterSection } from '@/components/NewsletterSection';

export const revalidate = 120;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return { title: 'Article introuvable' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt ? new Date(post.publishedAt * 1000).toISOString() : undefined,
      authors: [post.author],
      ...(post.coverUrl ? { images: [post.coverUrl] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post.id, 3);
  const html = renderMarkdownLight(post.body);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
      ...(post.author.trim() === 'Édouard de Boysson'
        ? {
            sameAs: [
              'https://orcid.org/0009-0006-0421-1683',
              'https://isni.org/isni/000000053039428X',
            ],
          }
        : {}),
    },
    publisher: { '@type': 'Organization', name: 'Logimind' },
    datePublished: post.publishedAt
      ? new Date(post.publishedAt * 1000).toISOString()
      : undefined,
    image: post.coverUrl ?? undefined,
    inLanguage: 'fr',
  };

  return (
    <>
      <article style={{ padding: '48px 24px 64px' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <Link
            href="/blog"
            style={{
              fontSize: 13,
              color: 'var(--ink-muted)',
              textDecoration: 'none',
            }}
          >
            ← Journal
          </Link>
          <header style={{ marginTop: 32, marginBottom: 40, textAlign: 'center' }}>
            {post.category && (
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                {post.category}
              </div>
            )}
            <h1 style={{ marginBottom: 20, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              {post.title}
            </h1>
            <p
              className="lead"
              style={{
                color: 'var(--ink-muted)',
                maxWidth: 540,
                margin: '0 auto 24px',
                fontStyle: 'italic',
              }}
            >
              {post.excerpt}
            </p>
            <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
              <strong style={{ color: 'var(--ink-strong)' }}>{post.author}</strong>
              {' · '}
              {formatPublishedDate(post.publishedAt)}
              {post.readingMinutes ? ` · ${post.readingMinutes} min de lecture` : ''}
            </div>
            <Ornament marginY={28} />
          </header>

          {post.coverUrl && (
            <div
              style={{
                marginBottom: 40,
                background: 'var(--bg-muted)',
                aspectRatio: '16 / 9',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverUrl}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <Ornament marginY={48} />

          <div
            style={{
              padding: 24,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, margin: '0 0 12px' }}>
              Cet article vous a plu&nbsp;?
            </p>
            <p style={{ fontSize: 13, color: 'var(--ink-muted)', margin: '0 0 16px' }}>
              Découvrez les ouvrages d&apos;Édouard de Boysson dans le catalogue.
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: '10px 22px',
                background: 'var(--ink-strong)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Voir les livres
            </Link>
          </div>

          {related.length > 0 && (
            <aside
              style={{
                marginTop: 56,
                paddingTop: 32,
                borderTop: '1px solid var(--border-default)',
              }}
            >
              <div className="eyebrow" style={{ marginBottom: 16, color: 'var(--gold)' }}>
                À lire aussi
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {related.map((r) => (
                  <li key={r.id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border-default)' }}>
                    <Link
                      href={`/blog/${r.slug}`}
                      style={{
                        color: 'var(--ink-strong)',
                        fontSize: 18,
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 500,
                        textDecorationColor: 'var(--border-strong)',
                      }}
                    >
                      {r.title}
                    </Link>
                    <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
                      {formatPublishedDate(r.publishedAt)}
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </article>

      <NewsletterSection source={`blog-${post.slug}`} variant="dark" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <style>{`
        .prose {
          font-family: var(--font-serif);
          font-size: 20px;
          line-height: 1.78;
          color: var(--ink-default);
        }
        .prose > p:first-of-type::first-letter {
          font-size: 4.4em;
          float: left;
          line-height: 0.92;
          padding: 6px 12px 0 0;
          font-weight: 500;
          color: var(--accent);
          font-family: var(--font-serif);
        }
        .prose h2 {
          font-family: var(--font-serif);
          font-size: 28px;
          margin: 44px 0 16px;
          color: var(--ink-strong);
          letter-spacing: -0.01em;
        }
        .prose h3 {
          font-family: var(--font-serif);
          font-size: 22px;
          margin: 32px 0 12px;
          color: var(--ink-strong);
        }
        .prose p {
          margin: 0 0 20px;
        }
        .prose ul {
          margin: 0 0 22px;
          padding-left: 24px;
        }
        .prose li {
          margin-bottom: 8px;
        }
        .prose blockquote {
          margin: 32px 0;
          padding: 14px 24px;
          border-left: 3px solid var(--gold);
          background: var(--bg-card);
          font-style: italic;
          color: var(--ink-default);
          font-size: 0.95em;
        }
        .prose a {
          color: var(--ink-strong);
          text-decoration-color: var(--accent);
          text-decoration-thickness: 1px;
        }
        .prose strong {
          color: var(--ink-strong);
          font-weight: 600;
        }
        .prose em {
          font-style: italic;
        }
      `}</style>
    </>
  );
}
