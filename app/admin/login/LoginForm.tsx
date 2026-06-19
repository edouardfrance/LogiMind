'use client';

import { useState } from 'react';

export function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }
      window.location.href = '/admin';
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>Mot de passe</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          autoComplete="current-password"
          required
          style={{
            padding: '12px 14px',
            border: '1px solid var(--border-strong)',
            background: 'var(--bg-page)',
            fontSize: 16,
            fontFamily: 'var(--font-sans)',
          }}
        />
      </label>
      {error && (
        <div role="alert" style={{ fontSize: 13, color: 'var(--danger)' }}>
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading || !password}
        style={{
          padding: '12px 16px',
          background: 'var(--accent)',
          color: '#fff',
          border: '1px solid var(--accent)',
          fontSize: 15,
          fontFamily: 'var(--font-sans)',
          cursor: loading ? 'wait' : 'pointer',
          opacity: loading || !password ? 0.6 : 1,
        }}
      >
        {loading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}
