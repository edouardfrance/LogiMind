/**
 * Génération + vérification de tokens de téléchargement post-paiement.
 * Pattern : token random base64url stocké en DB avec expiry + download counter.
 */
import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';
import { db, schema } from './db';

const DEFAULT_TTL_DAYS = 7;
const DEFAULT_MAX_DOWNLOADS = 5;

export function generateToken(): string {
  return randomBytes(32).toString('base64url');
}

interface CreateDownloadTokenInput {
  orderId: number;
  bookFormatId: number;
  ttlDays?: number;
  maxDownloads?: number;
}

export async function createDownloadToken(input: CreateDownloadTokenInput) {
  const ttlDays = input.ttlDays ?? DEFAULT_TTL_DAYS;
  const maxDownloads = input.maxDownloads ?? DEFAULT_MAX_DOWNLOADS;
  const token = generateToken();
  const expiresAt = Math.floor(Date.now() / 1000) + ttlDays * 24 * 60 * 60;

  const [row] = await db
    .insert(schema.downloadTokens)
    .values({
      token,
      orderId: input.orderId,
      bookFormatId: input.bookFormatId,
      expiresAt,
      maxDownloads,
    })
    .returning();

  return { ...row, expiresAtDate: new Date(expiresAt * 1000) };
}

export interface TokenValidationResult {
  ok: boolean;
  reason?: 'not_found' | 'expired' | 'exhausted';
  token?: typeof schema.downloadTokens.$inferSelect;
}

export async function validateAndIncrementToken(token: string): Promise<TokenValidationResult> {
  const [row] = await db
    .select()
    .from(schema.downloadTokens)
    .where(eq(schema.downloadTokens.token, token))
    .limit(1);

  if (!row) return { ok: false, reason: 'not_found' };

  const now = Math.floor(Date.now() / 1000);
  if (row.expiresAt < now) return { ok: false, reason: 'expired', token: row };
  if (row.downloadCount >= row.maxDownloads) {
    return { ok: false, reason: 'exhausted', token: row };
  }

  await db
    .update(schema.downloadTokens)
    .set({
      downloadCount: row.downloadCount + 1,
      lastDownloadedAt: now,
    })
    .where(eq(schema.downloadTokens.id, row.id));

  return { ok: true, token: row };
}
