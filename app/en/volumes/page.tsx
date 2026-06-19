import type { Metadata } from 'next';
import Link from 'next/link';
import { EN_VOLUMES, EN_UPCOMING } from '@/lib/en-catalog';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Volumes (English)',
  description: 'English volumes of the Memento of Psychotherapy — available and forthcoming.',
  alternates: { canonical: '/en/volumes', languages: { fr: '/', en: '/en/volumes' } },
};

export default function VolumesIndex() {
  return (
    <>
      <section
        style={{
          padding: '80px 20px 36px',
          background: 'linear-gradient(180deg, var(--bg-page-deep) 0%, var(--bg-page) 100%)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div className="container" style={{ maxWidth: 760 }}>
          <Reveal><div className="eyebrow" style={{ marginBottom: 14 }}>Catalogue</div></Reveal>
          <Reveal delay={0.08}>
            <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.05, marginBottom: 16 }}>
              English volumes
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="lead" style={{ color: 'var(--ink-default)', maxWidth: 600 }}>
              The English catalogue uses “Volume”. New volumes are released as each French volume
              is translated and validated.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: '48px 20px' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ display: 'grid', gap: 16, marginBottom: 48 }}>
            {EN_VOLUMES.map((v, i) => (
              <Reveal key={v.slug} delay={Math.min(i * 0.07, 0.3)}>
                <Link
                  href={`/en/volumes/${v.slug}`}
                  style={{ display: 'block', padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border-default)', textDecoration: 'none', color: 'inherit' }}
                  className="book-card-hover"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: 22, margin: 0 }}>{v.title}</h2>
                    <span style={{ fontSize: 12, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                      Available
                    </span>
                  </div>
                  <p style={{ fontStyle: 'italic', color: 'var(--ink-muted)', fontFamily: 'var(--font-serif)', margin: '6px 0 0' }}>{v.subtitle}</p>
                  <p style={{ margin: '10px 0 0', fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.6, color: 'var(--ink-default)' }}>
                    {v.descriptionShort}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <h2 style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.6rem)', fontFamily: 'var(--font-serif)', marginBottom: 18 }}>
              Forthcoming
            </h2>
          </Reveal>
          <div style={{ display: 'grid', gap: 12 }}>
            {EN_UPCOMING.map((u, i) => (
              <Reveal key={u.title} delay={Math.min(i * 0.06, 0.2)}>
                <div style={{ padding: '16px 20px', border: '1px dashed var(--border-strong)', background: 'var(--bg-card)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--ink-strong)', marginBottom: 4 }}>{u.title}</div>
                  <div style={{ fontSize: 14, color: 'var(--ink-muted)', fontFamily: 'var(--font-serif)' }}>{u.note}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
