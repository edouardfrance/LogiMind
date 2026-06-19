'use client';

import { useState } from 'react';

interface Props {
  source?: string;
  /** Variant 'inline' (footer, alignement gauche) ou 'card' (section dédiée, centré). */
  variant?: 'inline' | 'card';
}

export function NewsletterForm({ source = 'site', variant = 'card' }: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    setMsg(null);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        alreadySubscribed?: boolean;
      };
      if (!res.ok || !data.ok) throw new Error(data.error || 'Erreur');
      setState('success');
      setMsg(
        data.alreadySubscribed
          ? 'Vous êtes déjà inscrit·e — merci !'
          : 'Merci. Vous serez informé·e des prochaines parutions.'
      );
      setEmail('');
    } catch (e) {
      setState('error');
      setMsg(e instanceof Error ? e.message : 'Erreur inconnue');
    }
  }

  const isCard = variant === 'card';
  const align = isCard ? 'center' : 'left';

  return (
    <form
      onSubmit={submit}
      style={{
        display: 'flex',
        flexDirection: 'column', // toujours colonne — input row + helper below
        gap: 8,
        width: '100%',
        maxWidth: isCard ? 480 : '100%',
        margin: isCard ? '0 auto' : 0,
        textAlign: align,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 8,
          width: '100%',
          minWidth: 0,
        }}
      >
        <input
          type="email"
          required
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === 'loading' || state === 'success'}
          aria-label="Votre adresse email"
          style={{
            flex: '1 1 0',
            minWidth: 0, // laisse l'input shrink en flex sans déborder
            padding: '12px 14px',
            border: '1px solid var(--border-strong)',
            background: 'var(--bg-card)',
            fontSize: 15,
            fontFamily: 'var(--font-sans)',
            color: 'var(--ink-strong)',
          }}
        />
        <button
          type="submit"
          disabled={state === 'loading' || state === 'success' || !email}
          style={{
            flexShrink: 0,
            padding: '12px 18px',
            background: state === 'success' ? 'var(--success)' : 'var(--ink-strong)',
            color: '#fff',
            border: 'none',
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.02em',
            cursor: state === 'loading' ? 'wait' : 'pointer',
            transition: 'background 0.18s ease',
            opacity: state === 'loading' || !email ? 0.6 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {state === 'loading' ? '…' : state === 'success' ? '✓' : "S'inscrire"}
        </button>
      </div>

      {msg && (
        <div
          role={state === 'error' ? 'alert' : 'status'}
          style={{
            fontSize: 12,
            color: state === 'error' ? 'var(--danger)' : 'var(--ink-muted)',
            textAlign: align,
            marginTop: 2,
          }}
        >
          {msg}
        </div>
      )}

      {state === 'idle' && !msg && (
        <div
          style={{
            fontSize: 11,
            lineHeight: 1.5,
            color: isCard ? 'var(--ink-faint)' : 'rgba(246, 243, 236, 0.45)',
            textAlign: align,
            marginTop: 2,
          }}
        >
          Aucun spam. Désabonnement en un clic.
        </div>
      )}
    </form>
  );
}
