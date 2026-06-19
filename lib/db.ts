/**
 * libSQL client + Drizzle wrapper.
 * Utilise TURSO_DATABASE_URL + TURSO_AUTH_TOKEN en prod.
 * En dev local sans Turso : fallback file:./local.db
 */
import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

declare global {
  // eslint-disable-next-line no-var
  var __libsqlClient: Client | undefined;
}

function buildClient(): Client {
  const url = process.env.TURSO_DATABASE_URL || 'file:./local.db';
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url.startsWith('libsql://') && !authToken) {
    throw new Error('TURSO_AUTH_TOKEN requis quand TURSO_DATABASE_URL pointe vers libsql://');
  }

  return createClient({
    url,
    ...(authToken ? { authToken } : {}),
  });
}

export const libsql: Client = globalThis.__libsqlClient ?? buildClient();
if (process.env.NODE_ENV !== 'production') globalThis.__libsqlClient = libsql;

export const db = drizzle(libsql, { schema });
export { schema };
