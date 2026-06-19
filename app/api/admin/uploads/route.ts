/**
 * POST /api/admin/uploads — upload direct vers Vercel Blob.
 *
 * Body : multipart/form-data avec `file` + `kind` ('cover' | 'pdf' | 'excerpt')
 * Réponse : { url, pathname, size }
 *
 * Limite Vercel hobby = 4.5 MB par request. Pour PDFs > 4.5 MB on bascule
 * vers handleUpload (signed URL client → Blob direct). À ajouter en V2.
 */
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAdminApi } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_COVERS = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_PDFS = new Set(['application/pdf']);

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth) return auth;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "BLOB_READ_WRITE_TOKEN manquant. Crée un store Blob sur Vercel dashboard → Storage.",
      },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'multipart attendu' }, { status: 400 });
  }

  const file = formData.get('file');
  const kind = String(formData.get('kind') ?? 'cover');
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'champ "file" manquant' }, { status: 400 });
  }

  // Validation MIME
  const allowed =
    kind === 'cover'
      ? ALLOWED_COVERS
      : kind === 'pdf' || kind === 'excerpt'
        ? ALLOWED_PDFS
        : null;

  if (!allowed) {
    return NextResponse.json(
      { error: `kind invalide : ${kind}` },
      { status: 400 }
    );
  }
  if (!allowed.has(file.type)) {
    return NextResponse.json(
      { error: `Type ${file.type} non autorisé pour ${kind}` },
      { status: 415 }
    );
  }

  // Taille
  const sizeMb = file.size / 1024 / 1024;
  if (sizeMb > 4.4) {
    return NextResponse.json(
      {
        error: `Fichier trop gros (${sizeMb.toFixed(1)} MB > 4.5 MB). Pour PDFs lourds : feature direct upload à activer.`,
      },
      { status: 413 }
    );
  }

  // Construction du path
  const originalName =
    (formData.get('filename') as string) ||
    (file as File).name ||
    `upload-${Date.now()}`;
  const cleanName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
  const folder =
    kind === 'cover' ? 'covers' : kind === 'pdf' ? 'books/pdf' : 'books/excerpts';
  const slug = String(formData.get('slug') ?? 'misc').replace(/[^a-z0-9-]/g, '');
  const key = `${folder}/${slug || 'misc'}/${Date.now()}-${cleanName}`;

  try {
    const blob = await put(key, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type,
    });
    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      size: file.size,
    });
  } catch (e) {
    console.error('[upload] blob put error', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'upload failed' },
      { status: 500 }
    );
  }
}
