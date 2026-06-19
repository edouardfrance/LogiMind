'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Row {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  author: string;
  category: string | null;
  publishedYear: number | null;
  isPublished: number;
  displayOrder: number;
  formatsSummary: string;
}

interface Props {
  books: Row[];
}

export function BooksTable({ books }: Props) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);

  async function togglePublish(id: number, current: number) {
    setBusyId(id);
    try {
      await fetch(`/api/admin/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: current ? 0 : 1 }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: number, title: string) {
    if (!confirm(`Supprimer définitivement « ${title} » et tous ses formats ?`)) return;
    setBusyId(id);
    try {
      await fetch(`/api/admin/books/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setBusyId(null);
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
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 14,
          minWidth: 900,
        }}
      >
        <thead>
          <tr style={{ background: 'var(--bg-muted)', textAlign: 'left' }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Titre</th>
            <th style={thStyle}>Catégorie</th>
            <th style={thStyle}>Année</th>
            <th style={thStyle}>Formats &amp; prix</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>Publié</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr
              key={b.id}
              style={{
                borderTop: '1px solid var(--border-default)',
                opacity: busyId === b.id ? 0.5 : 1,
              }}
            >
              <td style={{ ...tdStyle, color: 'var(--ink-muted)' }}>{b.displayOrder}</td>
              <td style={tdStyle}>
                <Link
                  href={`/admin/books/${b.id}`}
                  style={{
                    fontWeight: 500,
                    color: 'var(--ink-strong)',
                    textDecoration: 'none',
                  }}
                >
                  {b.title}
                </Link>
                {b.subtitle && (
                  <div style={{ fontSize: 12, color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                    {b.subtitle}
                  </div>
                )}
                <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 2 }}>
                  /{b.slug}
                </div>
              </td>
              <td style={tdStyle}>{b.category || '—'}</td>
              <td style={tdStyle}>{b.publishedYear || '—'}</td>
              <td style={{ ...tdStyle, fontSize: 12, color: 'var(--ink-muted)' }}>
                {b.formatsSummary || (
                  <span style={{ color: 'var(--warning)' }}>aucun format</span>
                )}
              </td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => togglePublish(b.id, b.isPublished)}
                  disabled={busyId === b.id}
                  style={{
                    border: '1px solid',
                    borderColor: b.isPublished ? 'var(--success)' : 'var(--border-strong)',
                    background: b.isPublished ? 'var(--success)' : 'transparent',
                    color: b.isPublished ? '#fff' : 'var(--ink-muted)',
                    padding: '4px 10px',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                  aria-label={b.isPublished ? 'Dépublier' : 'Publier'}
                >
                  {b.isPublished ? '✓ live' : 'brouillon'}
                </button>
              </td>
              <td style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Link
                  href={`/admin/books/${b.id}`}
                  style={{
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    fontSize: 13,
                    marginRight: 12,
                  }}
                >
                  Éditer
                </Link>
                <button
                  type="button"
                  onClick={() => remove(b.id, b.title)}
                  disabled={busyId === b.id}
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

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--ink-muted)',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 16px',
  verticalAlign: 'top',
};
