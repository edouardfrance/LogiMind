import type { Metadata } from 'next';
import Link from 'next/link';
import { EN_VOLUMES } from '@/lib/en-catalog';
import { Ornament } from '@/components/Ornament';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Logimind — Édouard de Boysson (English)',
  description:
    'English editions of the Memento of Psychotherapy. Volume 1 (twelve brief therapies) and Conflict Resolution Therapy available now.',
  alternates: { canonical: '/en', languages: { fr: '/', en: '/en' } },
  openGraph: { locale: 'en_US', url: 'https://logimind.org/en' },
};

export default function EnHome() {
  const featured = EN_VOLUMES[0];
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
            <div className="eyebrow" style={{ marginBottom: 16 }}>Research &amp; documentary synthesis</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 style={{ fontSize: 'clamp(2.1rem, 4.6vw, 3.8rem)', lineHeight: 1.05, marginBottom: 22 }}>
              Édouard de&nbsp;Boysson — Library
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="lead" style={{ maxWidth: 580, margin: '0 auto 28px', color: 'var(--ink-default)' }}>
              Analytical and synthetic work on the corpora of <strong>psychotherapies</strong> and{' '}
              <strong>cognitive sciences</strong>. The English editions are released as each volume
              is translated.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/en/volumes"
                style={{ padding: '14px 28px', background: 'var(--ink-strong)', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
              >
                Browse the volumes
              </Link>
              <Link
                href="/en/glossary"
                style={{ padding: '14px 28px', background: 'transparent', color: 'var(--ink-strong)', textDecoration: 'none', fontSize: 14, fontWeight: 500, border: '1px solid var(--border-strong)', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
              >
                Glossary
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.42}><Ornament marginY={32} /></Reveal>
        </div>
      </section>

      <section style={{ padding: '56px 20px' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Available now</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: 10 }}>{featured.title}</h2>
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--ink-muted)', fontSize: 18, marginBottom: 14 }}>
              {featured.subtitle}
            </p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 17, lineHeight: 1.65, color: 'var(--ink-default)', marginBottom: 22, maxWidth: 620 }}>
              {featured.descriptionShort}
            </p>
            <Link
              href={`/en/volumes/${featured.slug}`}
              style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', minHeight: 44, background: 'var(--accent)', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
            >
              Read more &amp; buy →
            </Link>
          </Reveal>

          <Ornament marginY={40} />

          <Reveal>
            <p style={{ fontSize: 14, color: 'var(--ink-muted)' }}>
              Looking for the French catalogue?{' '}
              <Link href="/" style={{ color: 'var(--ink-strong)' }}>Voir le site en français →</Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
