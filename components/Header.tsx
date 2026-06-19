'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname() || '/';
  const isEn = pathname === '/en' || pathname.startsWith('/en/');
  const brandHref = isEn ? '/en' : '/';

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={brandHref} aria-label="Logimind" className="brand">
          <svg
            className="brand-mark"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            aria-hidden="true"
          >
            <path
              d="M11 1.4 L12.7 8 L19.5 10 L19.5 12 L12.7 14 L11 20.6 L9.3 14 L2.5 12 L2.5 10 L9.3 8 Z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
          <span className="brand-text">Logimind</span>
        </Link>

        {isEn ? (
          <nav aria-label="Main navigation" className="main-nav">
            <Link href="/en" className="nav-link">Catalogue</Link>
            <span className="nav-sep" aria-hidden="true">·</span>
            <Link href="/en/volumes" className="nav-link">Volumes</Link>
            <span className="nav-sep" aria-hidden="true">·</span>
            <Link href="/en/glossary" className="nav-link">Glossary</Link>
            <span className="nav-sep nav-contact-sep" aria-hidden="true">·</span>
            <a href="mailto:edouard@de-boysson.com" className="nav-link nav-contact">Contact</a>
            <LangToggle to="/" label="FR" current="EN" />
          </nav>
        ) : (
          <nav aria-label="Navigation principale" className="main-nav">
            <Link href="/" className="nav-link">Catalogue</Link>
            <span className="nav-sep" aria-hidden="true">·</span>
            <Link href="/blog" className="nav-link">Journal</Link>
            <span className="nav-sep" aria-hidden="true">·</span>
            <Link href="/glossaire" className="nav-link">Glossaire</Link>
            <span className="nav-sep nav-secondary-sep" aria-hidden="true">·</span>
            <Link href="/a-propos" className="nav-link nav-secondary">Notice</Link>
            <LangToggle to="/en" label="EN" current="FR" />
          </nav>
        )}
      </div>

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 20;
          width: 100%;
          padding: 24px 0;
          line-height: 1;
          background: linear-gradient(180deg, rgba(253, 251, 246, 0.92) 0%, rgba(246, 243, 236, 0.86) 100%);
          backdrop-filter: blur(16px) saturate(170%);
          -webkit-backdrop-filter: blur(16px) saturate(170%);
          border-bottom: 1px solid var(--border-default);
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          min-width: 0;
          line-height: 1;
        }
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          font-family: var(--font-serif);
          font-size: 26px;
          font-weight: 500;
          letter-spacing: -0.022em;
          line-height: 1;
          color: var(--ink-strong);
          text-decoration: none;
          flex-shrink: 0;
          white-space: nowrap;
          transition: opacity 0.25s var(--ease-smooth);
        }
        .brand:hover { opacity: 0.78; }
        .brand-mark {
          display: block;
          color: var(--gold);
          flex-shrink: 0;
          transition: transform 0.5s var(--ease-smooth);
        }
        .brand:hover .brand-mark { transform: rotate(14deg); }
        .brand-text { display: inline-block; line-height: 1; }
        .main-nav {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
          line-height: 1;
        }
        .nav-link {
          display: inline-flex;
          align-items: center;
          color: var(--ink-default);
          text-decoration: none;
          font-family: var(--font-sans);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          line-height: 1;
          padding: 4px 0;
          position: relative;
          white-space: nowrap;
          transition: color 0.22s var(--ease-smooth);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 1px;
          background: var(--gold);
          transform: scaleX(0);
          transform-origin: right center;
          transition: transform 0.45s var(--ease-smooth);
        }
        .nav-link:hover { color: var(--ink-strong); }
        .nav-link:hover::after { transform: scaleX(1); transform-origin: left center; }
        .nav-sep {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-serif);
          font-size: 13px;
          color: var(--gold);
          opacity: 0.55;
          line-height: 1;
          user-select: none;
          transform: translateY(-1px);
        }
        .lang-toggle {
          display: inline-flex;
          align-items: center;
          margin-left: 6px;
          padding: 5px 9px;
          border: 1px solid var(--border-strong);
          border-radius: 2px;
          font-family: var(--font-sans);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--ink-strong);
          text-decoration: none;
          line-height: 1;
          transition: background 0.2s var(--ease-smooth), color 0.2s var(--ease-smooth);
        }
        .lang-toggle:hover { background: var(--ink-strong); color: #fff; }
        .lang-toggle .lt-current { opacity: 0.4; }
        .lang-toggle .lt-sep { margin: 0 3px; opacity: 0.4; }

        @media (max-width: 768px) {
          .site-header { padding: 18px 0 !important; }
          .header-inner { gap: 14px !important; }
          .brand { font-size: 21px !important; gap: 9px !important; }
          .brand-mark { width: 19px !important; height: 19px !important; }
          .main-nav { gap: 12px !important; }
          .nav-link { font-size: 10.5px !important; letter-spacing: 0.12em !important; }
          .nav-contact, .nav-contact-sep { display: none !important; }
        }
        @media (max-width: 440px) {
          .site-header { padding: 16px 0 !important; }
          .header-inner { gap: 10px !important; }
          .brand { font-size: 19px !important; gap: 7px !important; }
          .brand-mark { width: 16px !important; height: 16px !important; }
          .main-nav { gap: 9px !important; }
          .nav-link { font-size: 10px !important; letter-spacing: 0.10em !important; }
          .nav-sep { font-size: 11px !important; }
          .nav-secondary, .nav-secondary-sep { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function LangToggle({ to, label, current }: { to: string; label: string; current: string }) {
  return (
    <Link href={to} className="lang-toggle" aria-label={`Switch language to ${label}`}>
      <span>{label}</span>
      <span className="lt-sep" aria-hidden="true">|</span>
      <span className="lt-current">{current}</span>
    </Link>
  );
}
