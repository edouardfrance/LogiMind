'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { BlogPost } from '@/lib/schema';
import { CoverUploader } from '../books/CoverUploader';

type Mode = 'create' | 'edit';

interface FormState {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverUrl: string;
  author: string;
  category: string;
  isPublished: boolean;
}

function initial(post?: BlogPost): FormState {
  return {
    slug: post?.slug ?? '',
    title: post?.title ?? '',
    excerpt: post?.excerpt ?? '',
    body: post?.body ?? '',
    coverUrl: post?.coverUrl ?? '',
    author: post?.author ?? 'Édouard de Boysson',
    category: post?.category ?? '',
    isPublished: !!post?.isPublished,
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

export function PostForm({ mode, post }: { mode: Mode; post?: BlogPost }) {
  const router = useRouter();
  const [s, setS] = useState<FormState>(initial(post));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  function patch<K extends keyof FormState>(k: K, v: FormState[K]) {
    setS((prev) => {
      const next = { ...prev, [k]: v };
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
        excerpt: s.excerpt,
        body: s.body,
        coverUrl: s.coverUrl || null,
        author: s.author,
        category: s.category || null,
        isPublished: s.isPublished ? 1 : 0,
      };
      const url = mode === 'create' ? '/api/admin/blog' : `/api/admin/blog/${post!.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { post?: BlogPost; error?: string };
      if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
      setSavedAt(new Date());
      if (mode === 'create' && data.post) {
        router.push(`/admin/blog/${data.post.id}`);
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
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }} className="r2">
        <Field label="Titre*" required>
          <input value={s.title} onChange={(e) => patch('title', e.target.value)} required style={input} />
        </Field>
        <Field label="Slug*">
          <input
            value={s.slug}
            onChange={(e) => patch('slug', e.target.value)}
            required
            pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
            style={input}
          />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="r2">
        <Field label="Catégorie" hint="ex: Psychothérapie, Coaching, Clinique">
          <input value={s.category} onChange={(e) => patch('category', e.target.value)} style={input} />
        </Field>
        <Field label="Auteur*">
          <input value={s.author} onChange={(e) => patch('author', e.target.value)} required style={input} />
        </Field>
      </div>

      <Field label="Image de couverture (optionnel)">
        <CoverUploader value={s.coverUrl} onChange={(u) => patch('coverUrl', u)} slug={s.slug || 'blog'} />
      </Field>

      <Field label="Accroche*" hint="1-2 phrases. Affichée sur la liste des articles et en OG.">
        <textarea
          value={s.excerpt}
          onChange={(e) => patch('excerpt', e.target.value)}
          rows={3}
          maxLength={500}
          required
          style={{ ...input, minHeight: 80, resize: 'vertical' }}
        />
        <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{s.excerpt.length} / 500</span>
      </Field>

      <Field
        label="Corps de l'article*"
        hint="Markdown light supporté : ## titre, ### sous-titre, **gras**, *italique*, [lien](url), > citation, - liste"
      >
        <textarea
          value={s.body}
          onChange={(e) => patch('body', e.target.value)}
          rows={20}
          required
          style={{ ...input, minHeight: 400, resize: 'vertical', fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.6 }}
        />
      </Field>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 12, background: 'var(--bg-muted)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={s.isPublished}
            onChange={(e) => patch('isPublished', e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
          <span style={{ fontSize: 14 }}>Publié</span>
        </label>
      </div>

      {error && <div role="alert" style={{ color: 'var(--danger)', fontSize: 14 }}>{error}</div>}
      {savedAt && !error && (
        <div style={{ color: 'var(--success)', fontSize: 13 }}>
          ✓ Enregistré à {savedAt.toLocaleTimeString('fr-FR')}
        </div>
      )}

      <div>
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
          }}
        >
          {saving ? '…' : mode === 'create' ? 'Créer' : 'Enregistrer'}
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) { .r2 { grid-template-columns: 1fr !important; } }
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
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-default)' }}>
        {label}
        {required && <span style={{ color: 'var(--danger)' }}> *</span>}
      </span>
      {children}
      {hint && <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{hint}</span>}
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
