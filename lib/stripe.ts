/**
 * Stripe client serveur. Réutilise le compte Stripe PeptiCore — donc
 * STRIPE_SECRET_KEY pointe vers le même compte mais on crée des Products
 * dédiés Logimind (préfixés "Logimind: " pour distinguer dans le dashboard).
 */
import Stripe from 'stripe';

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY manquante dans .env');
  }
  cached = new Stripe(key, {
    // version Stripe pinée — matche les types fournis par le SDK installé
    apiVersion: '2026-04-22.dahlia',
    typescript: true,
  });
  return cached;
}

/** Préfixe utilisé sur tous les Stripe Products / metadata pour filtrer côté dashboard. */
export const STRIPE_NAMESPACE = 'logimind';
