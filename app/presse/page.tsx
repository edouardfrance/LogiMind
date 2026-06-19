import type { Metadata } from 'next';
import Link from 'next/link';
import { Ornament } from '@/components/Ornament';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Espace presse',
  description:
    "Espace presse Logimind : à propos de l'auteur, disponibilité pour conférences et formations, contact presse.",
  alternates: { canonical: '/presse' },
};

const sectionH: React.CSSProperties = {
  marginTop: 40,
  marginBottom: 14,
  fontSize: 24,
  fontFamily: 'var(--font-serif)',
  color: 'var(--ink-strong)',
};

export default function PressePage() {
  return (
    <>
      <section
        style={{
          padding: '80px 20px 40px',
          background: 'linear-gradient(180deg, var(--bg-page-deep) 0%, var(--bg-page) 100%)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div className="container" style={{ maxWidth: 720 }}>
          <Reveal><div className="eyebrow" style={{ marginBottom: 14 }}>Espace presse</div></Reveal>
          <Reveal delay={0.08}>
            <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 1.05, marginBottom: 18 }}>
              Presse &amp; interventions
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="lead" style={{ color: 'var(--ink-default)', maxWidth: 620 }}>
              Ressources pour journalistes, écoles et organisateurs de conférences.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: '48px 20px 24px' }}>
        <article
          className="container"
          style={{ maxWidth: 680, fontFamily: 'var(--font-serif)', fontSize: 18, lineHeight: 1.75, color: 'var(--ink-default)' }}
        >
          <Reveal>
            <h2 style={sectionH}>À propos de l&apos;auteur</h2>
            <p>
              Édouard de Boysson est chercheur, méthodiste et systémiste. Il conduit un travail de
              lecture, de mise en relation et de synthèse à partir des fonds des bibliothèques
              universitaires, en psychothérapies et en sciences cognitives. Il est directeur de la
              chaire EVIDEN.CY à CY Cergy Paris Université, professeur en Master 2 (Conférence des
              Grandes Écoles) et a suivi l&apos;Executive Education de la Harvard Business School.
            </p>
          </Reveal>

          <Reveal>
            <h2 style={sectionH}>Disponible pour conférences et formations</h2>
            <p>Trois thèmes d&apos;intervention phares&nbsp;:</p>
            <ul style={{ paddingLeft: 22 }}>
              <li>Cartographier les 40 psychothérapies brèves contemporaines.</li>
              <li>De la CBT à l&apos;ACT et à la CFT&nbsp;: comprendre les trois vagues.</li>
              <li>Sensorialité oubliée&nbsp;: ce que la médecine n&apos;observe plus.</li>
            </ul>
            <p style={{ fontSize: 15 }}>
              <a href="mailto:edouard@de-boysson.com">Inviter l&apos;auteur / demander un devis →</a>
            </p>
          </Reveal>

          <Reveal>
            <h2 style={sectionH}>Citations courtes</h2>
            <blockquote
              style={{
                borderLeft: '2px solid var(--gold)',
                paddingLeft: 18,
                margin: '0 0 16px',
                fontStyle: 'italic',
                color: 'var(--ink-strong)',
              }}
            >
              « L&apos;objet n&apos;est pas de défendre une école, mais de restituer l&apos;état des
              savoirs publiés, leur cohérence interne et leurs zones de controverse. »
            </blockquote>
            <blockquote
              style={{
                borderLeft: '2px solid var(--gold)',
                paddingLeft: 18,
                margin: 0,
                fontStyle: 'italic',
                color: 'var(--ink-strong)',
              }}
            >
              « Comprendre une psychothérapie, c&apos;est la considérer dans son réseau de
              dépendances, pas isolément. »
            </blockquote>
          </Reveal>

          <Ornament marginY={40} />

          <Reveal>
            <h2 style={sectionH}>Contact presse</h2>
            <p style={{ marginBottom: 8 }}>
              <a href="mailto:edouard@de-boysson.com">edouard@de-boysson.com</a>
            </p>
            <p style={{ fontSize: 14, color: 'var(--ink-muted)', marginTop: 8 }}>
              Iconographie (couvertures, portrait) et dossier de presse complet disponibles sur
              demande. Voir aussi la{' '}
              <Link href="/a-propos">notice auteur</Link> et le{' '}
              <Link href="/glossaire">glossaire</Link>.
            </p>
          </Reveal>
        </article>
      </section>
    </>
  );
}
