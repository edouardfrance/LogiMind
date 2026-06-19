/**
 * Admin auth — pattern simple : password + cookie HMAC.
 * - POST password à /api/admin/login → cookie httpOnly signé HMAC pour 30j.
 * - Pages /admin/* check cookie via `requireAdmin()` en server component.
 * - APIs /api/admin/* check via `requireAdminApi()` qui renvoie 401 sinon.
 *
 * Pas de DB users → adapté à un usage solo (Edmond + Édouard).
 * Pour multi-user, refactor avec table users + sessions.
 */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'logimind_admin';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 jours en secondes

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SECRET manquante dans les env vars');
  }
  return secret;
}

function getExpectedPassword(): string {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) {
    throw new Error('ADMIN_PASSWORD manquante dans les env vars');
  }
  return pwd;
}

/** Signe un payload avec HMAC SHA256 → hex. */
export function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex');
}

/** Vérifie le password en temps constant (anti-timing). */
export function checkPassword(input: string): boolean {
  const expected = Buffer.from(getExpectedPassword());
  const got = Buffer.from(input ?? '');
  if (expected.length !== got.length) return false;
  return timingSafeEqual(expected, got);
}

/** Crée la valeur cookie : <timestamp>.<hmac> */
export function createSessionToken(): string {
  const ts = Date.now().toString();
  return `${ts}.${sign(ts)}`;
}

/** Vérifie la validité du cookie. Retourne true si valide ET non expiré. */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [ts, hmac] = parts;
  const expected = sign(ts);
  if (expected.length !== hmac.length) return false;
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(hmac))) return false;
  const issued = parseInt(ts, 10);
  if (!Number.isFinite(issued)) return false;
  const ageSec = (Date.now() - issued) / 1000;
  return ageSec >= 0 && ageSec < COOKIE_MAX_AGE;
}

export async function setSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

/** À utiliser dans les server components /admin/*. Redirige vers /admin/login si non auth. */
export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    redirect('/admin/login');
  }
}

/** À utiliser dans les routes /api/admin/*. Renvoie une Response 401 si non auth, sinon null. */
export async function requireAdminApi(): Promise<Response | null> {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return null;
}
