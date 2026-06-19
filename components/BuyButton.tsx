'use client';

import { useState } from 'react';

interface BuyButtonProps {
  bookFormatId: number;
  label: string;
  price: string;
  subLabel?: string;
  /** Pour Kindle : URL externe Amazon, pas de Stripe Checkout. */
  externalUrl?: string;
  primary?: boolean;
}

export function BuyButton({
  bookFormatId,
  label,
  price,
  subLabel,
  externalUrl,
  primary = false,
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (externalUrl) {
      window.open(externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookFormatId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Erreur lors de la création du paiement');
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
      setLoading(false);
    }
  }

  const baseStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    padding: '14px 20px',
    border: '1px solid',
    borderColor: primary ? 'var(--accent)' : 'var(--border-strong)',
    background: primary ? 'var(--accent)' : 'var(--bg-card)',
    color: primary ? '#fff' : 'var(--ink-strong)',
    minHeight: 64,
    minWidth: 200,
    textAlign: 'left',
    transition: 'background 0.15s ease, border-color 0.15s ease, transform 0.05s ease',
    fontFamily: 'var(--font-sans)',
    opacity: loading ? 0.6 : 1,
    cursor: loading ? 'wait' : 'pointer',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        style={baseStyle}
        aria-label={`${label} — ${price}`}
      >
        <span style={{ fontSize: 15, fontWeight: 500 }}>
          {loading ? 'Redirection…' : label}
        </span>
        <span style={{ fontSize: 13, opacity: 0.9 }}>
          {price}
          {subLabel ? ` · ${subLabel}` : ''}
        </span>
      </button>
      {error && (
        <div
          role="alert"
          style={{ fontSize: 12, color: 'var(--danger)' }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
