import type { MetadataRoute } from 'next';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/lib/db';
import { GLOSSARY } from '@/lib/glossary';
import { EN_VOLUMES } from '@/lib/en-catalog';

const BASE = 'https://logimind.org';

export const revalidate = 3600; // 1h

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/a-propos`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/glossaire`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/presse`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/cgv`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/mentions-legales`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/confidentialite`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    // Section anglophone
    { url: `${BASE}/en`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/en/volumes`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/en/glossary`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    ...GLOSSARY.map((t) => ({
      url: `${BASE}/glossaire/${t.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
    ...GLOSSARY.map((t) => ({
      url: `${BASE}/en/glossary/${t.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
    ...EN_VOLUMES.map((v) => ({
      url: `${BASE}/en/volumes/${v.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  let bookEntries: MetadataRoute.Sitemap = [];
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const books = await db
      .select({ slug: schema.books.slug, updatedAt: schema.books.updatedAt })
      .from(schema.books)
      .where(eq(schema.books.isPublished, 1));
    bookEntries = books.map((b) => ({
      url: `${BASE}/books/${b.slug}`,
      lastModified: new Date(b.updatedAt * 1000),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));
  } catch {
    // DB indisponible : sitemap dégradé
  }

  try {
    const posts = await db
      .select({ slug: schema.blogPosts.slug, updatedAt: schema.blogPosts.updatedAt })
      .from(schema.blogPosts)
      .where(eq(schema.blogPosts.isPublished, 1));
    blogEntries = posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt * 1000),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {}

  return [...staticEntries, ...bookEntries, ...blogEntries];
}
