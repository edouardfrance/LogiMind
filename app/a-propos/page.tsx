import type { Metadata } from 'next';
import { Ornament } from '@/components/Ornament';
import { NewsletterSection } from '@/components/NewsletterSection';
import { Reveal } from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Édouard de Boysson',
  description:
    'Notice : chercheur, méthodiste et systémiste, spécialiste de l\'analyse des fonds de bibliothèques universitaires en psychothérapies et sciences cognitives.',
  openGraph: {
    title: 'Édouard de Boysson — Logimind',
    description:
      'Chercheur. Méthode documentaire et systémique. Travail sur les bibliothèques universitaires en psychothérapies et sciences cognitives.',
  },
};

// Identité auteur — identifiants pérennes (sources : ORCID, ISNI/Bowker).
const AUTHOR_ORCID = '0009-0006-0421-1683';
const AUTHOR_ISNI = '0000 0005 3039 428X';
const AUTHOR_ISNI_COMPACT = '000000053039428X';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Édouard de Boysson',
  url: 'https://logimind.org/a-propos',
  jobTitle: 'Chercheur',
  inLanguage: ['fr-FR', 'en-US'],
  sameAs: [
    `https://orcid.org/${AUTHOR_ORCID}`,
    `https://isni.org/isni/${AUTHOR_ISNI_COMPACT}`,
  ],
  identifier: [
    { '@type': 'PropertyValue', propertyID: 'ORCID', value: AUTHOR_ORCID },
    { '@type': 'PropertyValue', propertyID: 'ISNI', value: AUTHOR_ISNI_COMPACT },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <section
        style={{
          padding: '80px 20px 40px',
          background: 'linear-gradient(180deg, var(--bg-page-deep) 0%, var(--bg-page) 100%)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div className="container" style={{ maxWidth: 720 }}>
          <Reveal>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              Notice
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1
              style={{
                fontSize: 'clamp(1.9rem, 4vw, 3.2rem)',
                lineHeight: 1.05,
                marginBottom: 20,
              }}
            >
              Édouard de&nbsp;Boysson
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p
              className="lead"
              style={{ color: 'var(--ink-default)', maxWidth: 620 }}
            >
              Chercheur. Méthodiste et systémiste. Spécialiste et analyste des fonds de
              bibliothèques universitaires en psychothérapies et sciences cognitives.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ padding: '48px 20px 24px' }}>
        <article
          className="container"
          style={{
            maxWidth: 680,
            fontFamily: 'var(--font-serif)',
            fontSize: 18,
            lineHeight: 1.75,
            color: 'var(--ink-default)',
          }}
        >
          <Reveal>
            <h2 style={sectionH}>Démarche</h2>
            <p>
              Les ouvrages réunis sur Logimind résultent d&apos;un travail de lecture,
              de mise en relation et de synthèse mené à partir des fonds des
              bibliothèques universitaires. La méthode est documentaire&nbsp;:
              confronter les sources, restituer les corpus, identifier les invariants
              et les angles morts. L&apos;approche est systémique&nbsp;: considérer
              chaque concept dans son réseau de dépendances plutôt qu&apos;isolément.
            </p>
            <p>
              Aucune position clinique personnelle n&apos;est défendue&nbsp;:
              l&apos;objet est l&apos;état des savoirs publiés, leur cohérence interne
              et leurs zones de controverse.
            </p>
          </Reveal>

          <Reveal>
            <h2 style={sectionH}>Domaines</h2>
            <p>Les travaux disponibles couvrent deux domaines complémentaires&nbsp;:</p>
            <ul style={ul}>
              <li>
                <strong>Psychothérapies</strong> — cartographie des courants, de leurs
                fondements théoriques et de leurs dispositifs cliniques. Mise en
                perspective historique et critique.
              </li>
              <li>
                <strong>Sciences cognitives</strong> — synthèse des apports issus de la
                psychologie cognitive, des neurosciences, de la linguistique et de la
                philosophie de l&apos;esprit, dans la mesure où ils éclairent les
                pratiques d&apos;accompagnement.
              </li>
            </ul>
            <p>
              L&apos;articulation des deux domaines constitue le fil conducteur de la
              bibliographie&nbsp;: <em>ce que les sciences cognitives apportent à la
              clinique, et ce que la clinique met à l&apos;épreuve dans les sciences
              cognitives</em>.
            </p>
          </Reveal>

          <Reveal>
            <h2 style={sectionH}>Format éditorial</h2>
            <p>
              Chaque ouvrage est référencé avec son ISBN propre et publié dans quatre
              formats indépendants&nbsp;: <strong>PDF</strong>, <strong>broché</strong>,
              <strong> relié</strong>, <strong>Kindle</strong>. Les livres physiques
              sont imprimés à la demande.
            </p>
            <p>
              Le catalogue complet est consultable en{' '}
              <a href="/">page d&apos;accueil</a>. Les articles du{' '}
              <a href="/blog">Journal</a> reprennent ponctuellement des éléments des
              ouvrages sous forme d&apos;extraits ou de mises au point.
            </p>
          </Reveal>

          <Reveal>
            <h2 style={sectionH}>Parcours &amp; interventions</h2>
            <ul style={ul}>
              <li>
                Directeur de la chaire <strong>EVIDEN.CY</strong> à CY Cergy Paris
                Université (depuis 2024).
              </li>
              <li>
                Professeur en <strong>Master 2</strong>, Conférence des Grandes Écoles
                (depuis 2021).
              </li>
              <li>
                Formation <strong>Harvard Business School</strong> — Executive Education
                (2019-2020).
              </li>
            </ul>
            <p>Trois thèmes d&apos;intervention pour écoles et universités&nbsp;:</p>
            <ul style={ul}>
              <li>Cartographier les 40 psychothérapies brèves contemporaines.</li>
              <li>De la CBT à l&apos;ACT et à la CFT&nbsp;: comprendre les trois vagues.</li>
              <li>Sensorialité oubliée&nbsp;: ce que la médecine n&apos;observe plus.</li>
            </ul>
            <p style={{ fontSize: 15 }}>
              <a href="mailto:edouard@de-boysson.com">
                Disponible pour conférences en écoles et universités →
              </a>
            </p>
          </Reveal>

          <Reveal>
            <h2 style={sectionH}>Identifiants académiques</h2>
            <p style={{ marginBottom: 8 }}>
              Identifiants pérennes rattachés à l&apos;auteur dans les registres
              d&apos;autorité internationaux&nbsp;:
            </p>
            <ul style={ul}>
              <li>
                <strong>ORCID</strong>&nbsp;:{' '}
                <a
                  href={`https://orcid.org/${AUTHOR_ORCID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {AUTHOR_ORCID}
                </a>
              </li>
              <li>
                <strong>ISNI</strong>&nbsp;:{' '}
                <a
                  href={`https://isni.org/isni/${AUTHOR_ISNI_COMPACT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {AUTHOR_ISNI}
                </a>
              </li>
            </ul>
          </Reveal>

          <Ornament marginY={40} />

          <Reveal>
            <h2 style={sectionH}>Correspondance</h2>
            <p style={{ marginBottom: 8 }}>
              Pour toute question éditoriale, demande de devis professionnelle ou
              correspondance avec l&apos;auteur&nbsp;:
            </p>
            <p style={{ marginBottom: 0 }}>
              <a href="mailto:edouard@de-boysson.com">edouard@de-boysson.com</a>
            </p>
            <p style={{ fontSize: 14, color: 'var(--ink-muted)', marginTop: 24 }}>
              Cette notice sera complétée au fil des parutions par une bibliographie
              structurée et un index des concepts.
            </p>
          </Reveal>
        </article>
      </section>

      <NewsletterSection source="a-propos" variant="dark" />
    </>
  );
}

const sectionH: React.CSSProperties = {
  marginTop: 40,
  marginBottom: 14,
  fontSize: 24,
  fontFamily: 'var(--font-serif)',
  color: 'var(--ink-strong)',
};

const ul: React.CSSProperties = {
  paddingLeft: 22,
  marginBottom: 22,
};
