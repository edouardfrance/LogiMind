/**
 * GET /api/download/[token]
 *
 * Sert un PDF de livre via token signé stocké en DB.
 * - Vérifie validité (exists, not expired, not exhausted).
 * - Incrémente le download counter.
 * - Redirige vers l'URL Vercel Blob (qui sert le PDF avec headers de download).
 *
 * Anti-leak : tokens 32 bytes random, expirent à 7j, max 5 DL.
 * Pas mis en cache (force-dynamic) pour que le compteur soit fiable.
 */
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { validateAndIncrementToken } from '@/lib/tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(_req: Request, { params }: RouteContext) {
  const { token } = await params;

  if (!token || token.length < 16) {
    return errorPage(400, 'Lien invalide.');
  }

  const result = await validateAndIncrementToken(token);
  if (!result.ok) {
    if (result.reason === 'expired') {
      return errorPage(
        410,
        'Ce lien a expiré. Contactez edouard@de-boysson.com pour récupérer votre livre.'
      );
    }
    if (result.reason === 'exhausted') {
      return errorPage(
        410,
        'Nombre maximum de téléchargements atteint. Contactez edouard@de-boysson.com.'
      );
    }
    return errorPage(404, 'Lien introuvable.');
  }

  // Charge le format pour récupérer le blob URL
  const [format] = await db
    .select()
    .from(schema.bookFormats)
    .where(eq(schema.bookFormats.id, result.token!.bookFormatId))
    .limit(1);

  if (!format?.pdfBlobKey) {
    return errorPage(500, 'Le fichier PDF n\'est pas configuré. Contactez le support.');
  }

  // pdfBlobKey peut être soit l'URL complète Vercel Blob (https://...blob.vercel-storage.com/...),
  // soit juste la clé interne. On gère les deux.
  const url = format.pdfBlobKey.startsWith('http')
    ? format.pdfBlobKey
    : `https://blob.vercel-storage.com/${format.pdfBlobKey}`;

  return NextResponse.redirect(url, 302);
}

function errorPage(status: number, message: string): Response {
  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>Téléchargement indisponible</title>
<style>
  body{font-family:Georgia,serif;background:#f7f5f0;color:#1a1a1a;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;}
  .card{max-width:520px;background:#fff;border:1px solid #e5e1d8;padding:40px;text-align:center;}
  h1{font-size:22px;margin:0 0 16px;}
  p{font-size:16px;line-height:1.6;color:#2a2a2a;margin:0 0 12px;}
  a{color:#8b1e1e;}
</style></head><body>
<div class="card">
<h1>Téléchargement indisponible</h1>
<p>${message}</p>
<p><a href="https://logimind.org">Retour au catalogue</a></p>
</div></body></html>`;
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
