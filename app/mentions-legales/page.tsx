import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description:
    'Mentions légales du site logimind.org — éditeur SALOMON 31, directeur de publication Édouard de Boysson.',
  robots: { index: true, follow: true },
};

export default function LegalPage() {
  return (
    <div className="container" style={{ padding: '64px 24px 32px', maxWidth: 760 }}>
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Information légale
      </div>
      <h1 style={{ marginBottom: 8 }}>Mentions légales</h1>
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 32 }}>
        Conformément aux dispositions de la loi n°&nbsp;2004-575 du 21&nbsp;juin&nbsp;2004 pour
        la confiance dans l&apos;économie numérique (LCEN).
      </p>

      <article
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 17,
          lineHeight: 1.7,
          color: 'var(--ink-default)',
        }}
      >
        <h2 style={sH}>1. Éditeur du site</h2>
        <p>
          Le site <strong>logimind.org</strong> est édité par&nbsp;:
        </p>
        <div style={card}>
          <p style={{ margin: 0 }}>
            <strong>SALOMON 31</strong>
            <br />
            Société à responsabilité limitée (SARL)
            <br />
            41 boulevard Devaux, 78300 Poissy, France
            <br />
            SIREN&nbsp;: 841&nbsp;697&nbsp;477 &middot; SIRET du siège&nbsp;: 841&nbsp;697&nbsp;477&nbsp;00013
            <br />
            Code APE&nbsp;: 68.20A (Location de logements)
            <br />
            Date de création&nbsp;: 1er&nbsp;octobre&nbsp;2018
            <br />
            Téléphone&nbsp;: <a href="tel:+33633601551">06&nbsp;33&nbsp;60&nbsp;15&nbsp;51</a>
            <br />
            Email&nbsp;:{' '}
            <a href="mailto:edouard@de-boysson.com">edouard@de-boysson.com</a>
          </p>
        </div>
        <p style={{ fontSize: 14, color: 'var(--ink-muted)' }}>
          La diffusion d&apos;ouvrages sous la marque éditoriale Logimind est exercée
          dans le cadre de l&apos;objet social de la société.
        </p>

        <h2 style={sH}>2. Directeur de la publication</h2>
        <p>
          <strong>Édouard de Boysson</strong>, gérant et représentant légal de la
          SARL SALOMON 31, est directeur de la publication au sens de
          l&apos;article&nbsp;93-2 de la loi du 29&nbsp;juillet&nbsp;1982 modifiée. Il est
          responsable du contenu éditorial publié sur le site et dans les ouvrages
          diffusés à travers Logimind.
        </p>
        <p style={{ fontSize: 14, color: 'var(--ink-muted)' }}>
          Identifiants d&apos;autorité de l&apos;auteur&nbsp;: ISNI{' '}
          <a
            href="https://isni.org/isni/000000053039428X"
            target="_blank"
            rel="noopener noreferrer"
          >
            0000&nbsp;0005&nbsp;3039&nbsp;428X
          </a>{' '}
          &middot; ORCID{' '}
          <a
            href="https://orcid.org/0009-0006-0421-1683"
            target="_blank"
            rel="noopener noreferrer"
          >
            0009-0006-0421-1683
          </a>
          .
        </p>

        <h2 style={sH}>3. Hébergement</h2>
        <p>
          Le site est hébergé par&nbsp;:
          <br />
          <strong>Vercel Inc.</strong>
          <br />
          440 N Barranca Ave #4133, Covina, CA&nbsp;91723, États-Unis d&apos;Amérique
          <br />
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
            vercel.com
          </a>
        </p>
        <p>
          La résolution DNS et la protection en bordure du réseau sont assurées par
          Cloudflare, Inc., 101 Townsend St, San Francisco, CA&nbsp;94107, États-Unis.
        </p>

        <h2 style={sH}>4. Paiements et services tiers</h2>
        <p>
          Les transactions sont opérées par <strong>Stripe Payments Europe, Limited</strong>,
          The One Building, 1 Grand Canal Street Lower, Dublin&nbsp;2, Irlande. Aucune
          donnée bancaire complète n&apos;est conservée par l&apos;éditeur.
        </p>
        <p>
          Les notifications transactionnelles et la diffusion de la newsletter sont
          opérées par <strong>Resend, Inc.</strong>, 2261 Market Street #4667, San
          Francisco, CA&nbsp;94114, États-Unis. Le stockage des fichiers numériques
          (PDF) est assuré par Vercel Blob.
        </p>
        <p>
          L&apos;impression à la demande des éditions brochée et reliée est confiée à
          des imprimeurs européens partenaires (notamment Lulu Press, Inc. et
          BoD&nbsp;— Books on Demand GmbH), dont l&apos;identité figure sur la facture.
        </p>

        <h2 style={sH}>5. Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus présents sur logimind.org &mdash; textes,
          articles, descriptions, mises en page, charte graphique, photographies,
          logotypes &mdash; ainsi que les œuvres diffusées sous forme numérique ou
          physique demeurent la propriété exclusive d&apos;Édouard de Boysson, de la
          SARL SALOMON 31 ou de leurs ayants droit respectifs.
        </p>
        <p>
          Toute reproduction, représentation, modification, publication ou adaptation
          de tout ou partie des éléments du site, par quelque procédé que ce soit, est
          interdite sans l&apos;autorisation écrite préalable de l&apos;éditeur, sous
          peine des sanctions prévues aux articles L.&nbsp;335-2 et suivants du Code de
          la propriété intellectuelle.
        </p>

        <h2 style={sH}>6. Crédits</h2>
        <p>
          Typographies&nbsp;: Crimson Pro et Inter (Google Fonts, licence Open Font).
          Génération technique&nbsp;: Next.js (Vercel). Base de données&nbsp;: Turso
          (libSQL).
        </p>

        <h2 style={sH}>7. Droit applicable et juridiction</h2>
        <p>
          Le présent site est régi par le droit français. En cas de litige relatif à
          son contenu ou à son fonctionnement, et à défaut de résolution amiable, les
          tribunaux français seront seuls compétents&nbsp;: le Tribunal de commerce de
          Versailles pour les litiges entre professionnels, le tribunal du lieu de
          résidence du consommateur pour les autres.
        </p>

        <h2 style={sH}>8. Mise à jour</h2>
        <p>
          La présente notice peut être modifiée à tout moment. La date de dernière
          mise à jour fait foi&nbsp;: <em>27&nbsp;mai&nbsp;2026</em>.
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

const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-default)',
  padding: '18px 22px',
  margin: '12px 0 16px',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  lineHeight: 1.7,
};
