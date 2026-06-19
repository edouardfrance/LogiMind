'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Row {
  id: number;
  slug: string;
  title: string;
  category: string | null;
  isPublished: number;
  publishedAtLabel: string;
}

export function BlogTable({ posts }: { posts: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);

  async function toggle(id: number, current: number) {
    setBusy(id);
    try {
      await fetch(`/api/admin/blog/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: current ? 0 : 1 }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: number, title: string) {
    if (!confirm(`Supprimer « ${title} » ?`)) return;
    setBusy(id);
    try {
      await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        overflowX: 'auto',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: 'var(--bg-muted)', textAlign: 'left' }}>
            <th style={th}>Titre</th>
            <th style={th}>Catégorie</th>
            <th style={th}>Publié le</th>
            <th style={{ ...th, textAlign: 'center' }}>Statut</th>
            <th style={{ ...th, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr
              key={p.id}
              style={{ borderTop: '1px solid var(--border-default)', opacity: busy === p.id ? 0.5 : 1 }}
            >
              <td style={td}>
                <Link
                  href={`/admin/blog/${p.id}`}
                  style={{ color: 'var(--ink-strong)', textDecoration: 'none', fontWeight: 500 }}
                >
                  {p.title}
                </Link>
                <div style={{ fontSize: 11, color: 'var(--ink-faint)' }}>/blog/{p.slug}</div>
              </td>
              <td style={td}>{p.category || '—'}</td>
              <td style={td}>{p.publishedAtLabel || '—'}</td>
              <td style={{ ...td, textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => toggle(p.id, p.isPublished)}
                  disabled={busy === p.id}
                  style={{
                    border: '1px solid',
                    borderColor: p.isPublished ? 'var(--success)' : 'var(--border-strong)',
                    background: p.isPublished ? 'var(--success)' : 'transparent',
                    color: p.isPublished ? '#fff' : 'var(--ink-muted)',
                    padding: '4px 10px',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {p.isPublished ? '✓ live' : 'brouillon'}
                </button>
              </td>
              <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Link
                  href={`/admin/blog/${p.id}`}
                  style={{ color: 'var(--accent)', fontSize: 13, marginRight: 12, textDecoration: 'none' }}
                >
                  Éditer
                </Link>
                <button
                  type="button"
                  onClick={() => remove(p.id, p.title)}
                  disabled={busy === p.id}
                  style={{
                    background: 'transparent',
                    color: 'var(--danger)',
                    border: 'none',
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--ink-muted)',
};
const td: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'top' };
