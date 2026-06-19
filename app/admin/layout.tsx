import Link from 'next/link';
import type { Metadata } from 'next';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { LogoutButton } from './LogoutButton';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthenticated();

  return (
    <div style={{ minHeight: 'calc(100vh - 128px)', display: 'flex', flexDirection: 'column' }}>
      {authed && (
        <div
          style={{
            borderBottom: '1px solid var(--border-default)',
            background: 'var(--bg-muted)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <strong style={{ fontFamily: 'var(--font-serif)', fontSize: 16 }}>
              Admin Logimind
            </strong>
            <nav style={{ display: 'flex', gap: 16, fontSize: 14, flexWrap: 'wrap' }}>
              <Link href="/admin" style={{ color: 'var(--ink-default)' }}>
                Livres
              </Link>
              <Link href="/admin/blog" style={{ color: 'var(--ink-default)' }}>
                Journal
              </Link>
              <Link href="/admin/newsletter" style={{ color: 'var(--ink-default)' }}>
                Newsletter
              </Link>
              <Link href="/admin/books/new" style={{ color: 'var(--ink-default)' }}>
                + Livre
              </Link>
              <Link href="/admin/blog/new" style={{ color: 'var(--ink-default)' }}>
                + Article
              </Link>
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--ink-muted)' }}
              >
                Voir le site ↗
              </Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      )}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
