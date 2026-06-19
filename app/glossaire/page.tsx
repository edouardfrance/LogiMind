import type { Metadata } from 'next';
import Link from 'next/link';
import { GLOSSARY, UNIQUENESS_NOTE_FR } from '@/lib/glossary';
import { Ornament } from '@/components/Ornament';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Glossaire des néologismes',
  description:
    'Néologismes propriétaires LogiMind : TIAB, TBRN, TBCE. Définitions et tests d\'unicité.',
  alternates: { canonical: '/glossaire', languages: { 'en': '/en/glossary', 'fr': '/glossaire' } },
};

export default function GlossairePage() {
  return (
    <>
      <section
        style={{
          padding: '80px 20px 36px',
          background: 'linear-gradient(180deg, var(--bg-page-deep) 0%, var(--bg-page) 100%)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div className="container" style={{ maxWidth: 720 }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 14 }}>Glossaire</div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.05, marginBottom: 18 }}>
              Néologismes propriétaires
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="lead" style={{ color: 'var(--ink-default)', maxWidth: 600 }}>
              Trois approches brèves dont le sigle est conservé invariant en français et en
              anglais.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: '48px 20px' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{ display: 'grid', gap: 16 }}>
            {GLOSSARY.map((t, i) => (
              <Reveal key={t.slug} delay={Math.min(i * 0.07, 0.3)}>
                <Link
                  href={`/glossaire/${t.slug}`}
                  style={{
                    display: 'block',
                    padding: 24,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                  className="book-card-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--ink-strong)' }}>
                      {t.acronym}
                    </span>
                    <span style={{ fontStyle: 'italic', color: 'var(--ink-muted)', fontFamily: 'var(--font-serif)' }}>
                      {t.fr.name}
                    </span>
                  </div>
                  <p style={{ margin: '10px 0 0', fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.6, color: 'var(--ink-default)' }}>
                    {t.fr.definition}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>

          <Ornament marginY={40} />

          <Reveal>
            <div
              style={{
                fontSize: 14,
                color: 'var(--ink-muted)',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                borderLeft: '2px solid var(--gold)',
                paddingLeft: 16,
              }}
            >
              {UNIQUENESS_NOTE_FR}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
