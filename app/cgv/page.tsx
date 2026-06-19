import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente',
  description:
    'Conditions générales de vente applicables aux ouvrages numériques et physiques diffusés par SALOMON 31 sur logimind.org.',
  robots: { index: true, follow: true },
};

export default function CgvPage() {
  return (
    <div className="container" style={{ padding: '64px 24px 32px', maxWidth: 760 }}>
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Conditions générales de vente
      </div>
      <h1 style={{ marginBottom: 8 }}>CGV</h1>
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 32 }}>
        Version en vigueur au 27&nbsp;mai&nbsp;2026.
      </p>

      <article
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 17,
          lineHeight: 1.7,
          color: 'var(--ink-default)',
        }}
      >
        <h2 style={sH}>1. Champ d&apos;application</h2>
        <p>
          Les présentes Conditions Générales de Vente (ci-après «&nbsp;CGV&nbsp;»)
          régissent l&apos;ensemble des transactions conclues à distance, via le site{' '}
          <a href="https://logimind.org">logimind.org</a>, entre&nbsp;:
        </p>
        <div style={card}>
          <p style={{ margin: 0 }}>
            <strong>L&apos;éditeur (vendeur)&nbsp;:</strong>
            <br />
            SARL SALOMON 31 &middot; SIREN 841&nbsp;697&nbsp;477 &middot; SIRET 841&nbsp;697&nbsp;477&nbsp;00013
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
        <p>
          <strong>L&apos;acquéreur&nbsp;:</strong> toute personne physique ou morale,
          consommateur ou professionnel, passant commande sur le site.
        </p>
        <p>
          Toute commande implique l&apos;acceptation pleine et entière des présentes
          CGV. L&apos;éditeur se réserve la possibilité de les modifier à tout
          moment&nbsp;; les CGV applicables sont celles en vigueur à la date de la
          commande.
        </p>

        <h2 style={sH}>2. Produits</h2>
        <p>
          Logimind diffuse les ouvrages d&apos;Édouard de Boysson dans quatre formats
          indépendants&nbsp;:
        </p>
        <ul style={ul}>
          <li>
            <strong>PDF</strong> — livre numérique téléchargeable, lecture sur tous
            supports compatibles ;
          </li>
          <li>
            <strong>Broché</strong> — livre physique à couverture souple, imprimé à la
            demande ;
          </li>
          <li>
            <strong>Relié</strong> — livre physique à couverture rigide, imprimé à la
            demande ;
          </li>
          <li>
            <strong>Kindle</strong> — format numérique distribué par Amazon.com&nbsp;Inc.
            (le bouton renvoie vers la fiche Amazon ; l&apos;achat n&apos;est pas
            conclu avec la SARL SALOMON 31).
          </li>
        </ul>
        <p>
          Chaque format dispose d&apos;un ISBN distinct, indiqué sur la fiche du
          livre.
        </p>

        <h2 style={sH}>3. Prix</h2>
        <p>
          Les prix sont indiqués en euros (€) toutes taxes comprises. La TVA
          applicable est celle en vigueur à la date de la commande&nbsp;: 5,5&nbsp;%
          pour les livres papier, 5,5&nbsp;% pour les livres numériques ayant un
          équivalent physique commercialisé (art.&nbsp;278-0 bis du Code général des
          impôts), 20&nbsp;% pour les contenus numériques sans équivalent papier.
        </p>
        <p>
          Les frais d&apos;expédition des livres physiques sont indiqués au panier
          avant validation. Aucune surfacture liée au moyen de paiement n&apos;est
          appliquée.
        </p>

        <h2 style={sH}>4. Commande</h2>
        <p>
          La commande devient ferme et définitive à compter du paiement effectif. Un
          email de confirmation est adressé automatiquement à l&apos;acquéreur dans
          les minutes qui suivent. Tout litige sur la commande doit être signalé sous
          48&nbsp;heures à{' '}
          <a href="mailto:edouard@de-boysson.com">edouard@de-boysson.com</a>.
        </p>

        <h2 style={sH}>5. Paiement</h2>
        <p>
          Le paiement s&apos;effectue intégralement à la commande, par carte bancaire,
          via la plateforme sécurisée <strong>Stripe Payments Europe, Limited</strong>.
          Aucune donnée bancaire complète n&apos;est conservée par l&apos;éditeur. Les
          informations échangées sont chiffrées selon les standards PCI&nbsp;DSS.
        </p>

        <h2 style={sH}>6. Livraison</h2>
        <h3 style={sH3}>6.1 Livraison numérique (PDF)</h3>
        <p>
          Le lien de téléchargement est adressé par email immédiatement après
          confirmation du paiement. Il est valable <strong>7&nbsp;jours</strong> et
          permet jusqu&apos;à <strong>5&nbsp;téléchargements</strong>. En cas de
          difficulté, contactez{' '}
          <a href="mailto:edouard@de-boysson.com">edouard@de-boysson.com</a>&nbsp;: un
          nouveau lien sera émis gratuitement.
        </p>
        <h3 style={sH3}>6.2 Livraison physique (broché, relié)</h3>
        <p>
          Les livres physiques sont imprimés à la demande chez un partenaire européen.
          Le délai d&apos;impression et d&apos;expédition est de{' '}
          <strong>7 à 14&nbsp;jours ouvrés</strong> à compter de la commande. Un
          numéro de suivi est communiqué dès l&apos;expédition.
        </p>
        <p>
          En cas de retard supérieur à 30&nbsp;jours non imputable à un cas de force
          majeure, l&apos;acquéreur peut demander la résolution de la vente et le
          remboursement intégral, conformément à l&apos;article L.&nbsp;216-2 du Code
          de la consommation.
        </p>

        <h2 style={sH}>7. Droit de rétractation</h2>
        <p>
          <strong>Livre numérique (PDF)&nbsp;:</strong> conformément à
          l&apos;article&nbsp;L.&nbsp;221-28&nbsp;13° du Code de la consommation, le
          droit de rétractation ne peut être exercé pour la fourniture d&apos;un
          contenu numérique non fourni sur un support matériel dont
          l&apos;exécution a commencé après accord préalable exprès du consommateur
          et renoncement exprès à son droit de rétractation. L&apos;acquéreur
          consent expressément à l&apos;exécution immédiate du téléchargement dès
          réception de l&apos;email contenant le lien.
        </p>
        <p>
          <strong>Livre physique (broché, relié)&nbsp;:</strong> l&apos;acquéreur
          dispose d&apos;un délai de <strong>14&nbsp;jours</strong> à compter de la
          réception pour exercer son droit de rétractation, sans avoir à motiver sa
          décision (art.&nbsp;L.&nbsp;221-18 du Code de la consommation). La
          notification doit être adressée à{' '}
          <a href="mailto:edouard@de-boysson.com">edouard@de-boysson.com</a>. Le livre
          doit être retourné dans son état d&apos;origine sous 14&nbsp;jours
          supplémentaires. Les frais de retour sont à la charge de l&apos;acquéreur.
          Le remboursement intervient au plus tard 14&nbsp;jours après réception du
          livre retourné.
        </p>

        <h2 style={sH}>8. Garanties légales</h2>
        <p>
          Les produits bénéficient des garanties légales de conformité
          (art.&nbsp;L.&nbsp;217-3 et suivants du Code de la consommation) et contre
          les vices cachés (art.&nbsp;1641 du Code civil). Toute demande doit être
          formulée à{' '}
          <a href="mailto:edouard@de-boysson.com">edouard@de-boysson.com</a>.
        </p>

        <h2 style={sH}>9. Propriété intellectuelle</h2>
        <p>
          L&apos;achat d&apos;un livre, quel que soit son format, n&apos;emporte
          aucun transfert de droits de propriété intellectuelle. L&apos;acquéreur
          dispose d&apos;une licence d&apos;usage strictement personnelle et non
          transférable. Toute reproduction, mise à disposition publique,
          redistribution ou commercialisation est strictement interdite et peut
          engager la responsabilité civile et pénale de son auteur.
        </p>

        <h2 style={sH}>10. Données personnelles</h2>
        <p>
          Les données collectées dans le cadre des commandes et des inscriptions à la
          newsletter sont traitées conformément à la{' '}
          <a href="/confidentialite">politique de confidentialité</a>.
        </p>

        <h2 style={sH}>11. Médiation de la consommation</h2>
        <p>
          Conformément aux articles L.&nbsp;612-1 et suivants du Code de la
          consommation, l&apos;acquéreur consommateur peut, après réclamation écrite
          préalable restée infructueuse pendant deux mois, recourir gratuitement au
          médiateur de la consommation désigné par l&apos;éditeur&nbsp;:
        </p>
        <div style={card}>
          <p style={{ margin: 0 }}>
            <strong>MEDICYS</strong>
            <br />
            Centre de médiation et règlement amiable des huissiers de justice
            <br />
            73 boulevard de Clichy, 75009 Paris, France
            <br />
            Téléphone&nbsp;: 01&nbsp;49&nbsp;70&nbsp;15&nbsp;93
            <br />
            Saisine en ligne&nbsp;:{' '}
            <a
              href="https://app.medicys.fr"
              target="_blank"
              rel="noopener noreferrer"
            >
              app.medicys.fr
            </a>
            <br />
            Site&nbsp;:{' '}
            <a
              href="https://www.medicys.fr"
              target="_blank"
              rel="noopener noreferrer"
            >
              medicys.fr
            </a>
          </p>
        </div>
        <p>
          Conformément à l&apos;article&nbsp;14 du règlement (UE) n°&nbsp;524/2013, la
          Commission européenne met également à disposition une{' '}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
          >
            plateforme européenne de règlement en ligne des litiges
          </a>.
        </p>
        <p>
          Les présentes CGV sont soumises au droit français. À défaut d&apos;accord
          amiable, tout litige sera porté devant les tribunaux français
          territorialement compétents.
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
const sH3: React.CSSProperties = {
  marginTop: 18,
  marginBottom: 8,
  fontSize: 17,
  fontFamily: 'var(--font-serif)',
  color: 'var(--ink-strong)',
};
const ul: React.CSSProperties = { paddingLeft: 22, marginBottom: 20 };
const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-default)',
  padding: '18px 22px',
  margin: '12px 0 16px',
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  lineHeight: 1.7,
};
