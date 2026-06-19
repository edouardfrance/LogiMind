import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    'Politique de confidentialité et traitement des données personnelles sur logimind.org, conforme au Règlement général sur la protection des données.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="container" style={{ padding: '64px 24px 32px', maxWidth: 760 }}>
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Données personnelles
      </div>
      <h1 style={{ marginBottom: 8 }}>Politique de confidentialité</h1>
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 32 }}>
        Conforme au Règlement (UE) 2016/679 du 27&nbsp;avril&nbsp;2016 (RGPD) et à la loi
        n°&nbsp;78-17 du 6&nbsp;janvier&nbsp;1978 modifiée. Version au 27&nbsp;mai&nbsp;2026.
      </p>

      <article
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 17,
          lineHeight: 1.7,
          color: 'var(--ink-default)',
        }}
      >
        <h2 style={sH}>1. Responsable du traitement</h2>
        <p>
          Le responsable du traitement des données personnelles collectées sur le site
          logimind.org est&nbsp;:
        </p>
        <div style={card}>
          <p style={{ margin: 0 }}>
            <strong>SARL SALOMON 31</strong>
            <br />
            SIREN 841&nbsp;697&nbsp;477 &middot; SIRET 841&nbsp;697&nbsp;477&nbsp;00013
            <br />
            41 boulevard Devaux, 78300 Poissy, France
            <br />
            Téléphone&nbsp;: <a href="tel:+33633601551">06&nbsp;33&nbsp;60&nbsp;15&nbsp;51</a>
            {' '}&middot; Email&nbsp;:{' '}
            <a href="mailto:edouard@de-boysson.com">edouard@de-boysson.com</a>
            <br />
            Représentée par Édouard de Boysson, gérant.
          </p>
        </div>

        <h2 style={sH}>2. Données collectées et finalités</h2>
        <table style={tbl}>
          <thead>
            <tr>
              <th style={th}>Données</th>
              <th style={th}>Finalité</th>
              <th style={th}>Base légale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={td}>Email, nom, adresse de livraison</td>
              <td style={td}>Exécution de la commande et livraison</td>
              <td style={td}>Exécution du contrat (art.&nbsp;6.1.b RGPD)</td>
            </tr>
            <tr>
              <td style={td}>Email + adresse IP</td>
              <td style={td}>Inscription à la newsletter</td>
              <td style={td}>Consentement (art.&nbsp;6.1.a RGPD)</td>
            </tr>
            <tr>
              <td style={td}>Données de facturation</td>
              <td style={td}>Comptabilité et obligations fiscales</td>
              <td style={td}>Obligation légale (art.&nbsp;6.1.c RGPD)</td>
            </tr>
            <tr>
              <td style={td}>Token de téléchargement, journaux d&apos;accès</td>
              <td style={td}>Sécurité, lutte contre la fraude, garantie du service</td>
              <td style={td}>Intérêt légitime (art.&nbsp;6.1.f RGPD)</td>
            </tr>
          </tbody>
        </table>

        <p>
          <strong>Aucune donnée bancaire complète</strong> n&apos;est conservée par
          l&apos;éditeur. Le traitement de paiement est intégralement opéré par Stripe.
        </p>

        <h2 style={sH}>3. Destinataires et sous-traitants</h2>
        <p>
          Les données sont accessibles à l&apos;éditeur et aux sous-traitants
          techniques strictement nécessaires à la fourniture du service&nbsp;:
        </p>
        <ul style={ul}>
          <li>
            <strong>Stripe Payments Europe Ltd.</strong> (Irlande) — paiement ;
          </li>
          <li>
            <strong>Resend, Inc.</strong> (États-Unis) — emails transactionnels et
            newsletter ;
          </li>
          <li>
            <strong>Vercel Inc.</strong> (États-Unis) — hébergement, stockage des
            fichiers PDF ;
          </li>
          <li>
            <strong>Cloudflare, Inc.</strong> (États-Unis) — DNS, protection réseau ;
          </li>
          <li>
            <strong>Turso (ChiselStrike Inc.)</strong> (États-Unis / Europe) — base de
            données ;
          </li>
          <li>
            <strong>Lulu Press, Inc.</strong> et/ou <strong>BoD</strong> (États-Unis /
            Allemagne) — impression et expédition des livres physiques (l&apos;adresse
            de livraison leur est transmise uniquement pour les commandes physiques).
          </li>
        </ul>
        <p>
          Aucune donnée n&apos;est revendue, louée, ni transmise à des tiers à des
          fins commerciales.
        </p>

        <h2 style={sH}>4. Transferts hors Union européenne</h2>
        <p>
          Certains sous-traitants sont établis aux États-Unis. Les transferts sont
          encadrés soit par des décisions d&apos;adéquation (Data Privacy Framework
          UE-États-Unis quand applicable), soit par les Clauses Contractuelles Types
          (CCT) adoptées par la Commission européenne le 4&nbsp;juin&nbsp;2021.
        </p>

        <h2 style={sH}>5. Durée de conservation</h2>
        <ul style={ul}>
          <li>
            <strong>Données de commande et de facturation&nbsp;:</strong> 10&nbsp;ans
            à compter de la clôture de l&apos;exercice (obligation comptable,
            art.&nbsp;L.&nbsp;123-22 du Code de commerce).
          </li>
          <li>
            <strong>Inscription newsletter&nbsp;:</strong> jusqu&apos;à
            désabonnement, puis effacement dans les 3&nbsp;ans en cas d&apos;inactivité
            prolongée.
          </li>
          <li>
            <strong>Tokens de téléchargement&nbsp;:</strong> 7&nbsp;jours après
            émission, puis purgés.
          </li>
          <li>
            <strong>Journaux techniques&nbsp;:</strong> 12&nbsp;mois maximum.
          </li>
        </ul>

        <h2 style={sH}>6. Vos droits</h2>
        <p>
          Conformément aux articles&nbsp;15 à&nbsp;22 du RGPD, vous disposez à tout
          moment des droits suivants sur vos données&nbsp;:
        </p>
        <ul style={ul}>
          <li>droit d&apos;accès et de communication d&apos;une copie ;</li>
          <li>droit de rectification ;</li>
          <li>droit à l&apos;effacement (droit à l&apos;oubli) ;</li>
          <li>droit à la limitation du traitement ;</li>
          <li>droit à la portabilité ;</li>
          <li>droit d&apos;opposition au traitement fondé sur l&apos;intérêt légitime ;</li>
          <li>
            droit de définir des directives relatives au sort des données après le
            décès (art.&nbsp;85 de la loi Informatique et Libertés).
          </li>
        </ul>
        <p>
          Pour exercer ces droits, écrivez à{' '}
          <a href="mailto:edouard@de-boysson.com">edouard@de-boysson.com</a> ou par
          courrier postal à l&apos;adresse&nbsp;: SARL SALOMON 31, 41 boulevard
          Devaux, 78300 Poissy. Une réponse vous sera apportée dans un délai maximum
          d&apos;un mois.
        </p>
        <p>
          En cas de difficulté, vous pouvez introduire une réclamation auprès de la{' '}
          <a
            href="https://www.cnil.fr/fr/plaintes"
            target="_blank"
            rel="noopener noreferrer"
          >
            Commission Nationale de l&apos;Informatique et des Libertés (CNIL)
          </a>, 3&nbsp;place de Fontenoy, 75007&nbsp;Paris.
        </p>

        <h2 style={sH}>7. Cookies et traceurs</h2>
        <p>
          Le site logimind.org ne dépose <strong>aucun cookie de mesure
          d&apos;audience, de profilage ou de publicité</strong>. Seuls sont déposés,
          le cas échéant, les cookies strictement nécessaires au fonctionnement du
          tunnel de paiement Stripe (exemptés de consentement au titre de
          l&apos;article&nbsp;82 de la loi Informatique et Libertés).
        </p>

        <h2 style={sH}>8. Sécurité</h2>
        <p>
          L&apos;éditeur met en œuvre les mesures techniques et organisationnelles
          appropriées pour préserver la confidentialité, l&apos;intégrité et la
          disponibilité des données&nbsp;: chiffrement TLS en transit, contrôle
          d&apos;accès, journalisation des accès admin, tokens de téléchargement
          signés et limités dans le temps, sauvegardes régulières.
        </p>

        <h2 style={sH}>9. Modifications</h2>
        <p>
          La présente politique peut être amendée pour refléter une évolution
          réglementaire ou un changement de sous-traitant. La date de dernière mise à
          jour figure en tête de la présente notice. Une notification est adressée
          aux abonnés à la newsletter en cas de modification substantielle.
        </p>
      </article>
    </div>
  );
}

const sH: React.CSSProperties = {
  marginTop: 36,
  marginBottom: 12,
  fontSize: 22,
  fontFamily: 'var(--font-serif)',
  color: 'var(--ink-strong)',
};
const ul: React.CSSProperties = { paddingLeft: 22, marginBottom: 20 };
const tbl: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  margin: '16px 0 24px',
  fontSize: 14,
  fontFamily: 'var(--font-sans)',
};
const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 12px',
  background: 'var(--bg-muted)',
  borderBottom: '1px solid var(--border-strong)',
  fontWeight: 500,
  fontSize: 12,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--ink-strong)',
};
const td: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--border-default)',
  verticalAlign: 'top',
  color: 'var(--ink-default)',
};
const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-default)',
  padding: '18px 22px',
  margin: '12px 0 16px',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  lineHeight: 1.7,
};
