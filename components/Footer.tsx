import Link from 'next/link';
import { NewsletterForm } from './NewsletterForm';

export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-dark)',
        color: 'var(--ink-on-dark)',
        marginTop: 0,
        padding: '56px 24px 32px',
      }}
    >
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1.5fr',
          gap: 48,
          alignItems: 'start',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 26,
              color: 'var(--ink-on-dark)',
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            Logimind
          </div>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 14,
              color: 'rgba(246, 243, 236, 0.6)',
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            Bibliothèque Édouard de Boysson.
          </p>
        </div>

        <div>
          <div
            className="eyebrow"
            style={{ color: 'var(--gold)', marginBottom: 14 }}
          >
            Naviguer
          </div>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              fontSize: 14,
            }}
          >
            {[
              { href: '/', label: 'Catalogue' },
              { href: '/blog', label: 'Journal' },
              { href: '/a-propos', label: 'À propos' },
              { href: '/cgv', label: 'CGV' },
              { href: '/confidentialite', label: 'Confidentialité' },
              { href: '/mentions-legales', label: 'Mentions légales' },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  style={{
                    color: 'rgba(246, 243, 236, 0.78)',
                    textDecoration: 'none',
                    textUnderlineOffset: 3,
                  }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div
            className="eyebrow"
            style={{ color: 'var(--gold)', marginBottom: 14 }}
          >
            Newsletter
          </div>
          <p
            style={{
              fontSize: 13,
              color: 'rgba(246, 243, 236, 0.72)',
              marginTop: 0,
              marginBottom: 14,
              lineHeight: 1.55,
            }}
          >
            Un email par nouvelle parution ou article. Pas de spam, désabonnement
            instantané.
          </p>
          <NewsletterForm source="footer" variant="inline" />
        </div>
      </div>

      <div
        className="container"
        style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: '1px solid rgba(246, 243, 236, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 12,
          color: 'rgba(246, 243, 236, 0.5)',
        }}
      >
        <div>© {new Date().getFullYear()} Édouard de Boysson — Tous droits réservés</div>
        <a
          href="mailto:edouard@de-boysson.com"
          style={{ color: 'rgba(246, 243, 236, 0.65)' }}
        >
          edouard@de-boysson.com
        </a>
      </div>

      <style>{`
        @media (max-width: 760px) {
          footer .container:first-of-type {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </footer>
  );
}
