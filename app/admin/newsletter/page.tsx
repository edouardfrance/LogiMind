import { desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin-auth';
import { db, schema } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function NewsletterAdmin() {
  await requireAdmin();
  const rows = await db
    .select()
    .from(schema.newsletterSubscribers)
    .orderBy(desc(schema.newsletterSubscribers.createdAt));

  const active = rows.filter((r) => !r.unsubscribedAt);

  return (
    <div style={{ padding: '32px 24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 4 }}>Newsletter</h1>
          <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
            {active.length} inscrit{active.length > 1 ? 's' : ''} actif
            {active.length > 1 ? 's' : ''} ·{' '}
            {rows.length - active.length} désinscription
            {rows.length - active.length > 1 ? 's' : ''}
          </div>
        </div>
        <a
          href="/api/admin/newsletter?format=csv"
          style={{
            padding: '10px 18px',
            background: 'var(--ink-strong)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: 14,
            border: '1px solid var(--ink-strong)',
          }}
        >
          Exporter CSV
        </a>
      </div>

      {rows.length === 0 ? (
        <div
          style={{
            border: '1px dashed var(--border-strong)',
            padding: '60px 32px',
            textAlign: 'center',
            color: 'var(--ink-muted)',
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          <p style={{ margin: 0 }}>Aucun inscrit pour l&apos;instant.</p>
        </div>
      ) : (
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
                <th style={th}>Email</th>
                <th style={th}>Source</th>
                <th style={th}>Inscrit le</th>
                <th style={th}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderTop: '1px solid var(--border-default)' }}>
                  <td style={td}>
                    <a
                      href={`mailto:${r.email}`}
                      style={{ color: 'var(--ink-strong)', textDecoration: 'none' }}
                    >
                      {r.email}
                    </a>
                  </td>
                  <td style={{ ...td, color: 'var(--ink-muted)', fontSize: 13 }}>
                    {r.source || '—'}
                  </td>
                  <td style={{ ...td, color: 'var(--ink-muted)', fontSize: 13 }}>
                    {new Date(r.createdAt * 1000).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td style={td}>
                    {r.unsubscribedAt ? (
                      <span style={{ color: 'var(--warning)', fontSize: 12 }}>
                        Désinscrit
                      </span>
                    ) : (
                      <span style={{ color: 'var(--success)', fontSize: 12 }}>Actif</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
