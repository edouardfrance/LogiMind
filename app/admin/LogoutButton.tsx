'use client';

import { useState } from 'react';

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      style={{
        padding: '6px 12px',
        background: 'transparent',
        color: 'var(--ink-muted)',
        border: '1px solid var(--border-strong)',
        fontSize: 13,
        cursor: 'pointer',
      }}
    >
      {loading ? '…' : 'Déconnexion'}
    </button>
  );
}
