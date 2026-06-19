/**
 * /llms.txt — fiche d'orientation pour crawlers IA / LLM (convention llms.txt).
 * Généré dynamiquement depuis le catalogue publié (DB) + volumes EN + glossaire.
 * Aucune donnée inventée : seules les valeurs présentes en base/catalogue sont listées.
 */
import { getPublishedBooks } from '@/lib/books';
import { EN_VOLUMES } from '@/lib/en-catalog';
import { GLOSSARY } from '@/lib/glossary';

export const runtime = 'nodejs';
export const revalidate = 3600; // 1h

const BASE = 'https://logimind.org';

export async function GET() {
  let books: Awaited<ReturnType<typeof getPublishedBooks>> = [];
  try {
    books = await getPublishedBooks();
  } catch {
    // DB indisponible : on sert au moins l'en-tête + sections statiques.
  }

  const lines: string[] = [];
  lines.push('# Logimind');
  lines.push('');
  lines.push(
    "> Maison d'édition des ouvrages d'Édouard de Boysson : la série « Mémento de psychothérapie », les psychothérapies douces individuelles, « Les Sens Oubliés de la médecine », la série « Électroculture » et des méthodes de conseil en systèmes d'information."
  );
  lines.push('');
  lines.push(
    'Les achats se font sur Amazon (liens « broché » / « Kindle ») ou, pour les titres à paraître, via une inscription à la lettre. Les pages produit FR sont sous /books/{slug} ; le catalogue anglophone (« Volumes ») est sous /en/volumes/{slug}.'
  );
  lines.push('');

  if (books.length > 0) {
    lines.push('## Catalogue (FR)');
    lines.push('');
    for (const b of books) {
      const status = b.releaseLabel ? ` — ${b.releaseLabel}` : '';
      lines.push(`### ${b.title}${status}`);
      if (b.subtitle) lines.push(`*${b.subtitle}*`);
      lines.push(`- Page : ${BASE}/books/${b.slug}`);
      if (b.descriptionShort) lines.push(`- ${b.descriptionShort}`);
      if (b.author) lines.push(`- Auteur : ${b.author}`);
      if (b.publishedYear) lines.push(`- Année : ${b.publishedYear}`);
      const isbns = b.formats.filter((f) => f.isbn).map((f) => `${f.format} ${f.isbn}`);
      if (isbns.length > 0) lines.push(`- ISBN : ${isbns.join(' ; ')}`);
      if (b.amazonPaperbackUrl) lines.push(`- Amazon (broché) : ${b.amazonPaperbackUrl}`);
      if (b.amazonKindleUrl) lines.push(`- Amazon (Kindle) : ${b.amazonKindleUrl}`);
      lines.push('');
    }
  }

  lines.push('## Catalogue (EN) — Volumes');
  lines.push('');
  for (const v of EN_VOLUMES) {
    lines.push(`### ${v.title}`);
    if (v.subtitle) lines.push(`*${v.subtitle}*`);
    lines.push(`- Page : ${BASE}/en/volumes/${v.slug}`);
    if (v.descriptionShort) lines.push(`- ${v.descriptionShort}`);
    for (const e of v.editions) {
      lines.push(`- ${e.format} : ISBN ${e.isbn}${e.asin ? ` · ASIN ${e.asin}` : ''} — ${e.amazonUrl}`);
    }
    lines.push('');
  }

  lines.push('## Glossaire (néologismes propriétaires)');
  lines.push('');
  for (const t of GLOSSARY) {
    lines.push(
      `- ${t.slug.toUpperCase()} — ${t.fr.name} / ${t.en.name} : ${BASE}/glossaire/${t.slug} (EN : ${BASE}/en/glossary/${t.slug})`
    );
  }
  lines.push('');

  lines.push('## Ressources');
  lines.push(`- À propos de l'auteur : ${BASE}/a-propos`);
  lines.push(`- Espace presse : ${BASE}/presse`);
  lines.push(`- Blog : ${BASE}/blog`);
  lines.push(`- Plan du site : ${BASE}/sitemap.xml`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
