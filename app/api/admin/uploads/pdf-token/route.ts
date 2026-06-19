/**
 * Direct browser → Vercel Blob upload pour PDFs > 4.5 MB.
 * Pattern : client appelle ce route avec metadata, on renvoie une signed URL
 * que le client utilise pour POST direct au store Blob. Bypass la limite
 * serverless 4.5 MB body.
 *
 * Référence : https://vercel.com/docs/vercel-blob/client-upload
 */
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
        // Vérifie auth admin AVANT de signer le token
        const ok = await isAdminAuthenticated();
        if (!ok) {
          throw new Error('Unauthorized');
        }
        // Valide le type/path
        if (!pathname.startsWith('books/pdf/')) {
          throw new Error('Path doit commencer par books/pdf/');
        }
        return {
          allowedContentTypes: ['application/pdf'],
          maximumSizeInBytes: 80 * 1024 * 1024, // 80 MB max
          tokenPayload: JSON.stringify({ uploadedAt: Date.now() }),
        };
      },
      onUploadCompleted: async () => {
        // Hook post-upload (rien à faire — l'UI met à jour pdfBlobKey via PATCH ensuite)
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'upload failed' },
      { status: 400 }
    );
  }
}
