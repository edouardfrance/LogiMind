/**
 * Page post-checkout. Reçoit ?session_id=cs_test_... de Stripe.
 *
 * Affiche un état générique de confirmation. Le vrai traitement de la
 * commande passe par le webhook Stripe — donc on ne refetch pas l'order
 * ici (race condition possible avec le webhook). Si l'utilisateur
 * recharge plus tard, l'order sera bien là.
 */
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;
  const hasSession = Boolean(session_id);

  return (
    <div
      className="container"
      style={{
        padding: '80px 24px',
        maxWidth: 640,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 48,
          marginBottom: 24,
        }}
        aria-hidden="true"
      >
        ✓
      </div>
      <h1 style={{ marginBottom: 16 }}>
        {hasSession ? 'Merci pour votre commande' : 'Commande confirmée'}
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 19,
          lineHeight: 1.65,
          color: 'var(--ink-default)',
          marginBottom: 24,
        }}
      >
        Votre paiement a bien été reçu. Un email de confirmation vient de vous être envoyé.
      </p>
      <div
        style={{
          padding: 24,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          marginBottom: 32,
          textAlign: 'left',
        }}
      >
        <h2 style={{ fontSize: 16, fontFamily: 'var(--font-sans)', marginBottom: 12 }}>
          Et maintenant ?
        </h2>
        <ul
          style={{
            margin: 0,
            paddingLeft: 20,
            fontSize: 15,
            lineHeight: 1.7,
            color: 'var(--ink-default)',
          }}
        >
          <li>
            <strong>PDF</strong> : vérifiez votre boîte mail (et les indésirables). Le lien de
            téléchargement est valable 7 jours.
          </li>
          <li>
            <strong>Livre physique (broché / relié)</strong> : nous lançons l&apos;impression.
            Expédition sous 7 à 14 jours ouvrés. Vous recevrez un numéro de suivi.
          </li>
        </ul>
      </div>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'var(--accent)',
            color: '#fff',
            textDecoration: 'none',
            border: '1px solid var(--accent)',
          }}
        >
          Retour au catalogue
        </Link>
        <a
          href="mailto:edouard@de-boysson.com"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'transparent',
            color: 'var(--ink-strong)',
            textDecoration: 'none',
            border: '1px solid var(--border-strong)',
          }}
        >
          Besoin d&apos;aide ?
        </a>
      </div>
      {session_id && (
        <div style={{ marginTop: 32, fontSize: 11, color: 'var(--ink-faint)' }}>
          Référence : <code>{session_id}</code>
        </div>
      )}
    </div>
  );
}
