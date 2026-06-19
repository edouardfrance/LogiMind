import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GLOSSARY, getTerm } from '@/lib/glossary';
import { Reveal } from '@/components/Reveal';

interface PageProps {
  params: Promise<{ term: string }>;
}

export function generateStaticParams() {
  return GLOSSARY.map((t) => ({ term: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { term } = await params;
  const t = getTerm(term);
  if (!t) return { title: 'Term not found' };
  return {
    title: `${t.acronym} — ${t.en.name}`,
    description: t.en.definition.slice(0, 155),
    alternates: {
      canonical: `/en/glossary/${t.slug}`,
      languages: { fr: `/glossaire/${t.slug}`, en: `/en/glossary/${t.slug}` },
    },
  };
}

export default async function TermPage({ params }: PageProps) {
  const { term } = await params;
  const t = getTerm(term);
  if (!t) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: t.en.name,
    alternateName: t.acronym,
    description: t.en.definition,
    inLanguage: 'en',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'LogiMind proprietary neologisms',
      url: 'https://logimind.org/en/glossary',
    },
  };

  return (
    <article className="container" style={{ maxWidth: 680, padding: '56px 24px' }}>
      <Reveal>
        <Link href="/en/glossary" style={{ fontSize: 13, color: 'var(--ink-muted)', textDecoration: 'none' }}>
          ← Glossary
        </Link>
        <div style={{ marginTop: 18, marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 6vw, 3.2rem)', color: 'var(--ink-strong)' }}>
            {t.acronym}
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: 'var(--ink-muted)', fontWeight: 400, marginBottom: 28 }}>
          {t.en.name}
        </h1>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--ink-default)' }}>
          {t.en.definition}
        </p>
        <p style={{ marginTop: 28, fontSize: 14, color: 'var(--ink-muted)' }}>
          Nom français&nbsp;:{' '}
          <Link href={`/glossaire/${t.slug}`} style={{ color: 'var(--ink-strong)' }}>
            {t.fr.name}
          </Link>
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
