'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Book } from '@/lib/schema';
import { CoverUploader } from './CoverUploader';

type Mode = 'create' | 'edit';
interface Props {
  mode: Mode;
  book?: Book;
}

interface FormState {
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  descriptionShort: string;
  descriptionLong: string;
  category: string;
  publishedYear: string;
  coverUrl: string;
  excerptUrl: string;
  amazonKindleUrl: string;
  isPublished: boolean;
  displayOrder: string;
}

function initialFrom(book?: Book): FormState {
  return {
    slug: book?.slug ?? '',
    title: book?.title ?? '',
    subtitle: book?.subtitle ?? '',
    author: book?.author ?? 'Édouard de Boysson',
    descriptionShort: book?.descriptionShort ?? '',
    descriptionLong: book?.descriptionLong ?? '',
    category: book?.category ?? '',
    publishedYear: book?.publishedYear?.toString() ?? '',
    coverUrl: book?.coverUrl ?? '',
    excerptUrl: book?.excerptUrl ?? '',
    amazonKindleUrl: book?.amazonKindleUrl ?? '',
    isPublished: !!book?.isPublished,
    displayOrder: book?.displayOrder?.toString() ?? '0',
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function BookForm({ mode, book }: Props) {
  const router = useRouter();
  const [s, setS] = useState<FormState>(initialFrom(book));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  function patch<K extends keyof FormState>(k: K, v: FormState[K]) {
    setS((prev) => {
      const next = { ...prev, [k]: v };
      // Auto-slugify si nouveau livre et slug vide
      if (mode === 'create' && k === 'title' && !prev.slug) {
        next.slug = slugify(String(v));
      }
      return next;
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        slug: s.slug,
        title: s.title,
        subtitle: s.subtitle || null,
        author: s.author,
        descriptionShort: s.descriptionShort,
        descriptionLong: s.descriptionLong,
        category: s.category || null,
        publishedYear: s.publishedYear ? parseInt(s.publishedYear, 10) : null,
        coverUrl: s.coverUrl,
        excerptUrl: s.excerptUrl || null,
        amazonKindleUrl: s.amazonKindleUrl || null,
        isPublished: s.isPublished ? 1 : 0,
        displayOrder: parseInt(s.displayOrder, 10) || 0,
      };

      const url = mode === 'create' ? '/api/admin/books' : `/api/admin/books/${book!.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { book?: Book; error?: string };
      if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);

      setSavedAt(new Date());
      if (mode === 'create' && data.book) {
        router.push(`/admin/books/${data.book.id}`);
      } else {
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={save}
      style={{
        display: 'grid',
        gap: 20,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        padding: 24,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }} className="row-2">
        <Field label="Titre*" required>
          <input
            type="text"
            value={s.title}
            onChange={(e) => patch('title', e.target.value)}
            required
            style={input}
          />
        </Field>
        <Field label="Slug URL*" hint="kebab-case, ex: contre-hypnose">
          <input
            type="text"
            value={s.slug}
            onChange={(e) => patch('slug', e.target.value)}
            required
            pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
            style={input}
          />
        </Field>
      </div>

      <Field label="Sous-titre">
        <input
          type="text"
          value={s.subtitle}
          onChange={(e) => patch('subtitle', e.target.value)}
          style={input}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }} className="row-3">
        <Field label="Auteur*" required>
          <input
            type="text"
            value={s.author}
            onChange={(e) => patch('author', e.target.value)}
            required
            style={input}
          />
        </Field>
        <Field label="Catégorie" hint="ex: Psychothérapie, Coaching">
          <input
            type="text"
            value={s.category}
            onChange={(e) => patch('category', e.target.value)}
            style={input}
          />
        </Field>
        <Field label="Année de publication">
          <input
            type="number"
            value={s.publishedYear}
            onChange={(e) => patch('publishedYear', e.target.value)}
            min={1900}
            max={2100}
            style={input}
          />
        </Field>
      </div>

      <Field label="Couverture (image)*" required>
        <CoverUploader
          value={s.coverUrl}
          onChange={(url) => patch('coverUrl', url)}
          slug={s.slug || 'misc'}
        />
      </Field>

      <Field
        label="Description courte*"
        hint="1-2 phrases. Affichée sur les cartes du catalogue."
        required
      >
        <textarea
          value={s.descriptionShort}
          onChange={(e) => patch('descriptionShort', e.target.value)}
          rows={3}
          maxLength={500}
          required
          style={{ ...input, resize: 'vertical', minHeight: 80 }}
        />
        <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
          {s.descriptionShort.length} / 500
        </span>
      </Field>

      <Field
        label="Description longue*"
        hint="Affichée sur la fiche livre. Retours à la ligne préservés. Markdown light bientôt."
        required
      >
        <textarea
          value={s.descriptionLong}
          onChange={(e) => patch('descriptionLong', e.target.value)}
          rows={10}
          required
          style={{ ...input, resize: 'vertical', minHeight: 240, fontFamily: 'var(--font-serif)' }}
        />
      </Field>

      <Field label="URL extrait PDF (optionnel)">
        <input
          type="url"
          value={s.excerptUrl}
          onChange={(e) => patch('excerptUrl', e.target.value)}
          placeholder="https://..."
          style={input}
        />
      </Field>

      <Field
        label="URL Amazon (Kindle)"
        hint="Si tu vends Kindle sur Amazon, colle l'URL produit ici. Le bouton Kindle ouvrira ce lien."
      >
        <input
          type="url"
          value={s.amazonKindleUrl}
          onChange={(e) => patch('amazonKindleUrl', e.target.value)}
          placeholder="https://www.amazon.fr/dp/..."
          style={input}
        />
      </Field>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: 16,
          background: 'var(--bg-muted)',
          flexWrap: 'wrap',
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={s.isPublished}
            onChange={(e) => patch('isPublished', e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
          <span style={{ fontSize: 14 }}>Publié (visible sur le site)</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>Ordre d&apos;affichage :</span>
          <input
            type="number"
            value={s.displayOrder}
            onChange={(e) => patch('displayOrder', e.target.value)}
            min={0}
            max={9999}
            style={{ ...input, width: 80 }}
          />
        </label>
      </div>

      {error && (
        <div role="alert" style={{ color: 'var(--danger)', fontSize: 14 }}>
          {error}
        </div>
      )}
      {savedAt && !error && (
        <div style={{ color: 'var(--success)', fontSize: 13 }}>
          ✓ Enregistré à {savedAt.toLocaleTimeString('fr-FR')}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: '12px 24px',
            background: 'var(--accent)',
            color: '#fff',
            border: '1px solid var(--accent)',
            fontSize: 15,
            cursor: saving ? 'wait' : 'pointer',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Enregistrement…' : mode === 'create' ? 'Créer le livre' : 'Enregistrer'}
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .row-2, .row-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
  hint,
  required,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 13, color: 'var(--ink-default)', fontWeight: 500 }}>
        {label}
        {required && <span style={{ color: 'var(--danger)' }}> *</span>}
      </span>
      {children}
      {hint && (
        <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
          {hint}
        </span>
      )}
    </label>
  );
}

const input: React.CSSProperties = {
  padding: '10px 12px',
  border: '1px solid var(--border-strong)',
  background: 'var(--bg-page)',
  fontSize: 14,
  fontFamily: 'var(--font-sans)',
  width: '100%',
};
