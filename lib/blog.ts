/**
 * Queries blog posts + helpers.
 */
import { and, desc, eq, ne } from 'drizzle-orm';
import { db, schema } from './db';
import type { BlogPost } from './schema';

export async function getPublishedPosts(): Promise<BlogPost[]> {
  return db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.isPublished, 1))
    .orderBy(desc(schema.blogPosts.publishedAt));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const [row] = await db
    .select()
    .from(schema.blogPosts)
    .where(and(eq(schema.blogPosts.slug, slug), eq(schema.blogPosts.isPublished, 1)))
    .limit(1);
  return row ?? null;
}

export async function getRelatedPosts(currentId: number, limit = 3): Promise<BlogPost[]> {
  return db
    .select()
    .from(schema.blogPosts)
    .where(and(eq(schema.blogPosts.isPublished, 1), ne(schema.blogPosts.id, currentId)))
    .orderBy(desc(schema.blogPosts.publishedAt))
    .limit(limit);
}

/** Markdown très light : ## titre, paragraphes, *italique*, **gras**, lien [txt](url). */
export function renderMarkdownLight(md: string): string {
  let html = escapeHtml(md);

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');

  // Bold + italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Blockquote
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Liste
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);

  // Paragraphes : doubles newlines → split, wrap non-block
  const blocks = html.split(/\n\n+/);
  return blocks
    .map((b) => {
      const t = b.trim();
      if (!t) return '';
      if (/^<(h2|h3|ul|blockquote)/.test(t)) return t;
      return `<p>${t.replace(/\n/g, '<br />')}</p>`;
    })
    .join('\n');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function estimateReadingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220)); // ~220 mots/minute
}

export function formatPublishedDate(epochSec: number | null): string {
  if (!epochSec) return '';
  return new Date(epochSec * 1000).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
