/**
 * Validation + helpers newsletter.
 * Pour V1 : pas de double opt-in (juste collecte simple). On peut ajouter
 * confirmation_token plus tard si besoin légal RGPD strict.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(s: string): boolean {
  if (typeof s !== 'string') return false;
  const trimmed = s.trim().toLowerCase();
  if (trimmed.length > 254 || trimmed.length < 5) return false;
  return EMAIL_RE.test(trimmed);
}

export function normalizeEmail(s: string): string {
  return s.trim().toLowerCase();
}
