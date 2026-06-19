import { NewsletterForm } from './NewsletterForm';
import { Ornament } from './Ornament';

interface Props {
  source?: string;
  variant?: 'light' | 'dark';
}

export function NewsletterSection({ source = 'site-section', variant = 'dark' }: Props) {
  const isDark = variant === 'dark';
  return (
    <section
      style={{
        background: isDark ? 'var(--bg-dark)' : 'var(--bg-page-deep)',
        color: isDark ? 'var(--ink-on-dark)' : 'var(--ink-strong)',
        padding: '72px 24px',
        margin: '80px 0 0',
      }}
    >
      <div
        style={{
          maxWidth: 640,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div
          className="eyebrow"
          style={{ color: 'var(--gold)', marginBottom: 16 }}
        >
          Newsletter
        </div>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            color: isDark ? 'var(--ink-on-dark)' : 'var(--ink-strong)',
            marginBottom: 16,
            lineHeight: 1.15,
          }}
        >
          Recevez les nouvelles parutions
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 18,
            lineHeight: 1.6,
            color: isDark ? 'rgba(246, 243, 236, 0.78)' : 'var(--ink-muted)',
            marginBottom: 28,
          }}
        >
          Un email par nouveau livre, par texte du Journal, par actualité — jamais plus.
          Pas de promotions intrusives, pas de partage de vos données.
        </p>
        <Ornament color={isDark ? 'var(--gold)' : 'var(--gold)'} size="sm" marginY={0} />
        <div style={{ marginTop: 24 }}>
          <NewsletterForm source={source} variant="card" />
        </div>
      </div>
    </section>
  );
}
