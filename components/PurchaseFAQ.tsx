/**
 * FAQ achat affichée sur la fiche livre. Contient aussi un FAQPage schema.org
 * pour les rich results Google.
 */
const FAQ_ITEMS = [
  {
    q: 'Comment recevoir mon PDF ?',
    a: 'Immédiatement après le paiement, tu reçois un email avec un lien sécurisé pour télécharger ton PDF. Le lien est valable 7 jours et permet jusqu\'à 5 téléchargements.',
  },
  {
    q: 'Combien de temps pour un livre physique ?',
    a: 'Les livres brochés et reliés sont imprimés à la demande. Comptez 7 à 14 jours ouvrés entre le paiement et la réception, incluant l\'impression et l\'expédition.',
  },
  {
    q: 'Puis-je acheter pour offrir ?',
    a: 'Oui : indique simplement l\'adresse de livraison du destinataire au moment du paiement. Pour le PDF, communique-nous l\'email du destinataire après commande (edouard@de-boysson.com).',
  },
  {
    q: 'Y a-t-il des frais cachés ?',
    a: 'Non. Le prix affiché inclut la TVA. Les frais de port (5,90 €) ne s\'ajoutent que pour les livres physiques et sont indiqués avant validation du paiement.',
  },
  {
    q: 'Comment vous contacter en cas de problème ?',
    a: 'Écris à edouard@de-boysson.com — réponse sous 24h ouvrées.',
  },
];

export function PurchaseFAQ() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <section
      style={{
        marginTop: 48,
        paddingTop: 32,
        borderTop: '1px solid var(--border-default)',
      }}
    >
      <h2
        style={{
          fontSize: 18,
          marginBottom: 16,
          fontFamily: 'var(--font-sans)',
        }}
      >
        Questions fréquentes
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {FAQ_ITEMS.map((item, i) => (
          <details
            key={i}
            style={{
              padding: '14px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
            }}
          >
            <summary
              style={{
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 15,
                color: 'var(--ink-strong)',
              }}
            >
              {item.q}
            </summary>
            <p
              style={{
                marginTop: 10,
                marginBottom: 0,
                fontSize: 14,
                lineHeight: 1.6,
                color: 'var(--ink-default)',
              }}
            >
              {item.a}
            </p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </section>
  );
}
