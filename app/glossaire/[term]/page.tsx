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
  if (!t) return { title: 'Terme introuvable' };
  return {
    title: `${t.acronym} — ${t.fr.name}`,
    description: t.fr.definition.slice(0, 155),
    alternates: {
      canonical: `/glossaire/${t.slug}`,
      languages: { en: `/en/glossary/${t.slug}`, fr: `/glossaire/${t.slug}` },
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
    name: t.fr.name,
    alternateName: t.acronym,
    description: t.fr.definition,
    inLanguage: 'fr',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Néologismes propriétaires LogiMind',
      url: 'https://logimind.org/glossaire',
    },
  };

  return (
    <article className="container" style={{ maxWidth: 680, padding: '56px 24px' }}>
      <Reveal>
        <Link href="/glossaire" style={{ fontSize: 13, color: 'var(--ink-muted)', textDecoration: 'none' }}>
          ← Glossaire
        </Link>
        <div style={{ marginTop: 18, marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 6vw, 3.2rem)', color: 'var(--ink-strong)' }}>
            {t.acronym}
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: 'var(--ink-muted)', fontWeight: 400, marginBottom: 28 }}>
          {t.fr.name}
        </h1>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 19, lineHeight: 1.7, color: 'var(--ink-default)' }}>
          {t.fr.definition}
        </p>
        <p style={{ marginTop: 28, fontSize: 14, color: 'var(--ink-muted)' }}>
          English name (acronym preserved as invariant)&nbsp;:{' '}
          <Link href={`/en/glossary/${t.slug}`} style={{ color: 'var(--ink-strong)' }}>
            {t.en.name}
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
