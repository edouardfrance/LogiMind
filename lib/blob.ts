/**
 * Vercel Blob — stockage privé des PDFs.
 * Upload via script admin (npm run upload-pdf), download via signed token côté serveur.
 */
import { put, head, del, list, type PutBlobResult } from '@vercel/blob';

const PDF_PREFIX = 'books/pdf/';

export async function uploadBookPdf(
  bookSlug: string,
  filename: string,
  data: Buffer | Blob | ReadableStream
): Promise<PutBlobResult> {
  const key = `${PDF_PREFIX}${bookSlug}/${filename}`;
  return put(key, data, {
    access: 'public', // signed token côté DB suffit pour l'access control
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/pdf',
  });
}

export async function getPdfMetadata(blobKey: string) {
  return head(blobKey);
}

export async function deletePdf(blobKey: string) {
  return del(blobKey);
}

export async function listAllPdfs() {
  return list({ prefix: PDF_PREFIX });
}
