'use client';

import { useState, useRef } from 'react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  slug: string;
}

export function CoverUploader({ value, onChange, slug }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('kind', 'cover');
      fd.append('slug', slug);
      fd.append('filename', file.name);
      const res = await fetch('/api/admin/uploads', { method: 'POST', body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur upload');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div
        style={{
          width: 140,
          aspectRatio: '2 / 3',
          background: 'var(--bg-muted)',
          border: '1px dashed var(--border-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Couverture actuelle"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{ fontSize: 11, color: 'var(--ink-muted)', textAlign: 'center', padding: 8 }}>
            Pas de couverture
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 240 }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          }}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            padding: '10px 18px',
            background: 'var(--ink-strong)',
            color: '#fff',
            border: 'none',
            fontSize: 13,
            cursor: uploading ? 'wait' : 'pointer',
            opacity: uploading ? 0.6 : 1,
          }}
        >
          {uploading ? 'Upload…' : value ? 'Remplacer l\'image' : 'Choisir une image'}
        </button>
        <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 6 }}>
          JPEG / PNG / WebP. 4.5 MB max. Format conseillé : 1200×1800 px (2:3).
        </div>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ou colle une URL d'image directement"
          style={{
            marginTop: 8,
            width: '100%',
            padding: '8px 10px',
            border: '1px solid var(--border-default)',
            background: 'var(--bg-page)',
            fontSize: 12,
            fontFamily: 'var(--font-sans)',
          }}
        />
        {error && (
          <div role="alert" style={{ color: 'var(--danger)', fontSize: 12, marginTop: 6 }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
