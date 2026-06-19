interface PullQuoteProps {
  children: React.ReactNode;
  attribution?: string;
}

export function PullQuote({ children, attribution }: PullQuoteProps) {
  return (
    <figure
      style={{
        margin: '40px auto',
        maxWidth: 580,
        textAlign: 'center',
        padding: '12px 0',
      }}
    >
      <svg
        aria-hidden="true"
        width="32"
        height="22"
        viewBox="0 0 32 22"
        style={{ display: 'block', margin: '0 auto 8px', color: 'var(--gold)' }}
        fill="currentColor"
      >
        <path d="M0 22V12.5C0 5.6 4.4 0.4 11 0L11.5 3C7.5 3.8 5.3 6.1 5.3 9.3H10V22H0zm17 0v-9.5C17 5.6 21.4 0.4 28 0l0.5 3c-4 0.8-6.2 3.1-6.2 6.3h4.7V22H17z" />
      </svg>
      <blockquote
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.4rem, 2vw, 1.7rem)',
          lineHeight: 1.4,
          fontStyle: 'italic',
          color: 'var(--ink-strong)',
          margin: 0,
          padding: 0,
          fontWeight: 400,
        }}
      >
        {children}
      </blockquote>
      {attribution && (
        <figcaption
          style={{
            marginTop: 12,
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
          }}
        >
          — {attribution}
        </figcaption>
      )}
    </figure>
  );
}
