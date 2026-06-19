import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Connexion admin',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 128px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          padding: 40,
          width: '100%',
          maxWidth: 380,
        }}
      >
        <h1
          style={{
            fontSize: 24,
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          Espace admin
        </h1>
        <p
          style={{
            fontSize: 13,
            color: 'var(--ink-muted)',
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          Logimind
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
