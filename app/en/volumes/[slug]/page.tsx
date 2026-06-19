import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { EN_VOLUMES, getEnVolume } from '@/lib/en-catalog';
import { Reveal } from '@/components/Reveal';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return EN_VOLUMES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const v = getEnVolume(slug);
  if (!v) return { title: 'Not found' };
  return {
    title: v.title,
    description: v.descriptionShort,
    alternates: { canonical: `/en/volumes/${v.slug}`, languages: { fr: '/', en: `/en/volumes/${v.slug}` } },
  };
}

export default async function VolumePage({ params }: PageProps) {
  const { slug } = await params;
  const v = getEnVolume(slug);
  if (!v) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: v.title,
    alternativeHeadline: v.subtitle,
    description: v.descriptionShort,
    author: {
      '@type': 'Person',
      name: 'Édouard de Boysson',
      sameAs: [
        'https://orcid.org/0009-0006-0421-1683',
        'https://isni.org/isni/000000053039428X',
      ],
    },
    publisher: { '@type': 'Organization', name: 'Logimind' },
    inLanguage: 'en-US',
    workExample: v.editions.map((e) => ({
      '@type': 'Book',
      bookFormat: e.format === 'Kindle' ? 'https://schema.org/EBook' : 'https://schema.org/Paperback',
      isbn: e.isbn,
      inLanguage: 'en-US',
      url: e.amazonUrl,
    })),
  };

  return (
    <article className="container" style={{ maxWidth: 680, padding: '56px 24px' }}>
      <Reveal>
        <Link href="/en/volumes" style={{ fontSize: 13, color: 'var(--ink-muted)', textDecoration: 'none' }}>
          ← Volumes
        </Link>
        <h1 style={{ margin: '18px 0 8px' }}>{v.title}</h1>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontStyle: 'italic', color: 'var(--ink-muted)', marginBottom: 24 }}>
          {v.subtitle}
        </p>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, lineHeight: 1.7, color: 'var(--ink-default)', marginBottom: 16 }}>
          {v.descriptionLong}
        </p>
        {v.note && (
          <p style={{ fontSize: 14, color: 'var(--ink-muted)', marginBottom: 32 }}>{v.note}</p>
        )}

        <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 28 }}>
          <h2 style={{ fontSize: 16, marginBottom: 16, fontFamily: 'var(--font-sans)' }}>Available editions</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {v.editions.map((e, idx) => (
              <a
                key={e.isbn}
                href={e.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  padding: '14px 20px',
                  border: '1px solid',
                  borderColor: idx === 0 ? 'var(--accent)' : 'var(--border-strong)',
                  background: idx === 0 ? 'var(--accent)' : 'var(--bg-card)',
                  color: idx === 0 ? '#fff' : 'var(--ink-strong)',
                  textDecoration: 'none',
                  minWidth: 200,
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 500 }}>{e.format}</span>
                <span style={{ fontSize: 13, opacity: 0.9 }}>Buy on Amazon ↗</span>
              </a>
            ))}
          </div>
        </div>

        <details style={{ borderTop: '1px solid var(--border-default)', marginTop: 28, paddingTop: 16, fontSize: 13, color: 'var(--ink-muted)' }}>
          <summary style={{ cursor: 'pointer', color: 'var(--ink-default)' }}>Bibliographic information</summary>
          <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
            {v.editions.map((e) => (
              <div key={e.isbn}>
                ISBN ({e.format})&nbsp;: <code>{e.isbn}</code>
                {e.asin ? ` · ASIN ${e.asin}` : ''}
              </div>
            ))}
          </div>
        </details>

        <p style={{ marginTop: 28, fontSize: 14, color: 'var(--ink-muted)' }}>
          Disponible en français&nbsp;:{' '}
          <Link href="/" style={{ color: 'var(--ink-strong)' }}>voir le catalogue FR →</Link>
        </p>
      </Reveal>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
