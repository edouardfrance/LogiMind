# Logimind

Site de vente des livres d'Edmond de Boysson. Catalogue numérique + impression à la demande.

**Prod :** https://logimind.org

## Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript strict
- Drizzle ORM + libSQL/Turso
- Stripe Checkout (compte partagé avec PeptiCore, namespace `logimind`)
- Resend (email transactionnel)
- Vercel Blob (stockage PDF privé)
- Vercel hosting + Cloudflare DNS

## Setup local

```bash
cp .env.example .env.local        # remplir les valeurs
npm install
npm run db:migrate                # crée les tables (file:./local.db par défaut)
npm run db:seed                   # 2 livres exemple
npm run dev                       # http://localhost:3000
```

## Scripts

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — serve la build
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `npm run db:migrate` — exécute les migrations idempotentes
- `npm run db:seed` — insère des livres de démonstration

## Architecture

```
app/
  page.tsx                   # Catalogue
  books/[slug]/page.tsx      # Fiche livre
  orders/success/page.tsx    # Confirmation post-checkout
  api/
    checkout/route.ts        # POST → Stripe Checkout Session
    stripe/webhook/route.ts  # Webhook fulfillment
    download/[token]/route.ts # PDF download via signed token
components/                  # Header, Footer, BookCard, BuyButton
lib/                         # schema, db, stripe, resend, blob, tokens, books
scripts/seed.ts              # Données de démo
```

## Flux d'achat

1. **PDF** → Stripe Checkout → webhook → `createDownloadToken` → email Resend avec lien `/api/download/[token]`
2. **Broché / Relié** → Stripe Checkout (avec shipping) → webhook → email confirmation → commande manuelle Lulu/BoD (V1) / API auto (V2)
3. **Kindle** → bouton externe → Amazon

## Migrations

**Ne jamais utiliser drizzle-kit.** Toute nouvelle table ou colonne va dans `lib/migrate-libsql.ts` en `CREATE TABLE IF NOT EXISTS` ou `ALTER TABLE` wrappé dans un try/catch idempotent. Append-only, jamais modifier une migration shippée.

## Sécurité

- Tokens download : 32 bytes random, expirent 7j, 5 DL max
- Stripe webhook : signature vérifiée via `STRIPE_WEBHOOK_SECRET`
- Pas de stockage de données bancaires (Stripe handle)
- Headers via Cloudflare proxy (HSTS, etc.)
