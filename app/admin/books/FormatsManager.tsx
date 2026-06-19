'use client';

import { upload } from '@vercel/blob/client';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import type { BookFormat } from '@/lib/schema';

interface Props {
  bookId: number;
  bookSlug: string;
  formats: BookFormat[];
}

const FORMAT_LABELS: Record<string, string> = {
  pdf: 'PDF',
  kindle: 'Kindle',
  paperback: 'Broché',
  hardcover: 'Relié',
};

export function FormatsManager({ bookId, bookSlug, formats }: Props) {
  const router = useRouter();
  const [adding, setAdding] = useState<keyof typeof FORMAT_LABELS | null>(null);
  const [error, setError] = useState<string | null>(null);

  const existing = new Set(formats.map((f) => f.format));
  const missing = Object.keys(FORMAT_LABELS).filter((k) => !existing.has(k));

  async function addFormat(format: string) {
    setAdding(format as keyof typeof FORMAT_LABELS);
    setError(null);
    try {
      const res = await fetch(`/api/admin/books/${bookId}/formats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          priceCents: 1000, // 10€ default
          isAvailable: 1,
        }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        throw new Error(d.error || `Erreur ${res.status}`);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setAdding(null);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {formats.length === 0 && (
        <div
          style={{
            padding: 24,
            border: '1px dashed var(--border-strong)',
            color: 'var(--ink-muted)',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          Pas encore de format. Ajoute-en au moins un pour pouvoir vendre.
        </div>
      )}

      {formats.map((f) => (
        <FormatRow
          key={f.id}
          bookId={bookId}
          bookSlug={bookSlug}
          format={f}
          onChanged={() => router.refresh()}
        />
      ))}

      {missing.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            paddingTop: 12,
            borderTop: '1px solid var(--border-default)',
          }}
        >
          <span style={{ fontSize: 13, color: 'var(--ink-muted)', alignSelf: 'center' }}>
            Ajouter :
          </span>
          {missing.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => addFormat(m)}
              disabled={adding !== null}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid var(--border-strong)',
                fontSize: 13,
                cursor: adding !== null ? 'wait' : 'pointer',
              }}
            >
              + {FORMAT_LABELS[m]}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div role="alert" style={{ color: 'var(--danger)', fontSize: 13 }}>
          {error}
        </div>
      )}
    </div>
  );
}

function FormatRow({
  bookId,
  bookSlug,
  format,
  onChanged,
}: {
  bookId: number;
  bookSlug: string;
  format: BookFormat;
  onChanged: () => void;
}) {
  const [isbn, setIsbn] = useState(format.isbn ?? '');
  const [priceCents, setPriceCents] = useState(format.priceCents);
  const [luluUrl, setLuluUrl] = useState(format.luluUrl ?? '');
  const [pageCount, setPageCount] = useState(format.pageCount?.toString() ?? '');
  const [weightGrams, setWeightGrams] = useState(format.weightGrams?.toString() ?? '');
  const [pdfUrl, setPdfUrl] = useState(format.pdfBlobKey ?? '');
  const [isAvailable, setIsAvailable] = useState(!!format.isAvailable);
  const [saving, setSaving] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const isPdf = format.format === 'pdf';
  const isPhysical = format.format === 'paperback' || format.format === 'hardcover';

  async function save() {
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/books/${bookId}/formats/${format.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isbn: isbn || null,
          priceCents,
          luluUrl: luluUrl || null,
          pageCount: pageCount ? parseInt(pageCount, 10) : null,
          weightGrams: weightGrams ? parseInt(weightGrams, 10) : null,
          pdfBlobKey: pdfUrl || null,
          isAvailable: isAvailable ? 1 : 0,
        }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        throw new Error(d.error || `Erreur ${res.status}`);
      }
      setMsg('✓ Enregistré');
      onChanged();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm(`Supprimer le format ${FORMAT_LABELS[format.format]} ?`)) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/books/${bookId}/formats/${format.id}`, { method: 'DELETE' });
      onChanged();
    } finally {
      setSaving(false);
    }
  }

  async function uploadPdf(file: File) {
    setPdfUploading(true);
    setErr(null);
    try {
      const sizeMb = file.size / 1024 / 1024;
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
      const path = `books/pdf/${bookSlug}/${Date.now()}-${cleanName}`;

      // Petits PDFs (< 4.4 MB) : upload via API serverless classique
      // Gros PDFs : upload direct client → Blob via signed token
      if (sizeMb < 4.4) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('kind', 'pdf');
        fd.append('slug', bookSlug);
        fd.append('filename', file.name);
        const res = await fetch('/api/admin/uploads', { method: 'POST', body: fd });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed');
        setPdfUrl(data.url);
      } else {
        // Direct browser → Blob (bypass 4.5 MB limit)
        const blob = await upload(path, file, {
          access: 'public',
          handleUploadUrl: '/api/admin/uploads/pdf-token',
          contentType: 'application/pdf',
        });
        setPdfUrl(blob.url);
      }
      setMsg('PDF uploadé. Clique « Enregistrer » pour confirmer.');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erreur upload');
    } finally {
      setPdfUploading(false);
    }
  }

  return (
    <div
      style={{
        border: '1px solid var(--border-default)',
        background: isAvailable ? 'var(--bg-card)' : 'var(--bg-muted)',
        padding: 16,
        display: 'grid',
        gap: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <strong style={{ fontFamily: 'var(--font-serif)', fontSize: 18 }}>
          {FORMAT_LABELS[format.format]}
        </strong>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          En vente
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Mini label="ISBN">
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="978-..."
            style={miniInput}
          />
        </Mini>
        <Mini label={`Prix (centimes EUR) — affiché ${(priceCents / 100).toFixed(2)}€`}>
          <input
            type="number"
            value={priceCents}
            onChange={(e) => setPriceCents(parseInt(e.target.value, 10) || 0)}
            min={0}
            max={99999}
            style={miniInput}
          />
        </Mini>
      </div>

      {isPhysical && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Mini label="Nb pages">
            <input
              type="number"
              value={pageCount}
              onChange={(e) => setPageCount(e.target.value)}
              style={miniInput}
            />
          </Mini>
          <Mini label="Poids (g)">
            <input
              type="number"
              value={weightGrams}
              onChange={(e) => setWeightGrams(e.target.value)}
              style={miniInput}
            />
          </Mini>
          <Mini label="URL Lulu / BoD (optionnel)">
            <input
              type="url"
              value={luluUrl}
              onChange={(e) => setLuluUrl(e.target.value)}
              placeholder="https://lulu.com/..."
              style={miniInput}
            />
          </Mini>
        </div>
      )}

      {isPdf && (
        <div>
          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginBottom: 4 }}>
            Fichier PDF
          </div>
          {pdfUrl ? (
            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                fontSize: 13,
                padding: 8,
                background: 'var(--bg-muted)',
              }}
            >
              <span style={{ color: 'var(--success)' }}>✓ PDF présent</span>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)', fontSize: 12 }}
              >
                voir ↗
              </a>
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                style={{
                  marginLeft: 'auto',
                  background: 'transparent',
                  border: '1px solid var(--border-strong)',
                  padding: '4px 12px',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                Remplacer
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => pdfInputRef.current?.click()}
              disabled={pdfUploading}
              style={{
                padding: '10px 16px',
                background: 'var(--ink-strong)',
                color: '#fff',
                border: 'none',
                fontSize: 13,
                cursor: pdfUploading ? 'wait' : 'pointer',
              }}
            >
              {pdfUploading ? 'Upload…' : 'Uploader le PDF'}
            </button>
          )}
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadPdf(f);
            }}
          />
          <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 4 }}>
            Jusqu&apos;à 80 MB. Petits PDFs (&lt; 4 MB) via serveur, gros PDFs en
            direct browser → Blob.
          </div>
        </div>
      )}

      {format.format === 'kindle' && (
        <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
          Kindle se vend sur Amazon. Renseigne l&apos;URL Amazon dans l&apos;onglet du livre
          au-dessus — c&apos;est ce qui sera utilisé pour le bouton « Acheter sur Amazon ».
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          style={{
            padding: '8px 16px',
            background: 'var(--accent)',
            color: '#fff',
            border: '1px solid var(--accent)',
            fontSize: 13,
            cursor: saving ? 'wait' : 'pointer',
          }}
        >
          {saving ? '…' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={saving}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            color: 'var(--danger)',
            border: '1px solid var(--border-strong)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Supprimer
        </button>
        {msg && <span style={{ color: 'var(--success)', fontSize: 13 }}>{msg}</span>}
        {err && <span style={{ color: 'var(--danger)', fontSize: 13 }}>{err}</span>}
      </div>
    </div>
  );
}

function Mini({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{label}</span>
      {children}
    </label>
  );
}

const miniInput: React.CSSProperties = {
  padding: '8px 10px',
  border: '1px solid var(--border-strong)',
  background: 'var(--bg-page)',
  fontSize: 13,
  fontFamily: 'var(--font-sans)',
  width: '100%',
};
