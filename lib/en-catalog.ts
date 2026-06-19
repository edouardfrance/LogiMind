/**
 * Catalogue anglophone (section /en). Données issues du doc d'instructions
 * (addendum 2026-05-28, ASINs confirmés par Edouard). Nomenclature EN = « Volume ».
 */
export interface EnEdition {
  format: 'Paperback' | 'Kindle';
  isbn: string;
  asin?: string;
  amazonUrl: string;
}

export interface EnVolume {
  slug: string;
  title: string;
  subtitle: string;
  descriptionShort: string;
  descriptionLong: string;
  editions: EnEdition[];
  note?: string;
}

export const EN_VOLUMES: EnVolume[] = [
  {
    slug: 'volume-1',
    title: 'Memento of Psychotherapy — Volume 1',
    subtitle: 'Twelve brief therapies of the second and third waves',
    descriptionShort:
      'Twelve brief therapies of the second and third waves (ACT, CFT, DBT and more). The English edition of the French Tome 2.',
    descriptionLong:
      'Volume 1 US gathers twelve brief therapies of the second and third waves — including ACT, CFT and DBT. It is the English edition corresponding to the content of the French Tome 2. Available in paperback and on Kindle through Amazon US.',
    editions: [
      { format: 'Paperback', isbn: '978-2-9595562-6-5', amazonUrl: 'https://www.amazon.com/dp/2959556267' },
      { format: 'Kindle', isbn: '978-2-9595562-7-2', asin: 'B0F7FT9H1Z', amazonUrl: 'https://www.amazon.com/dp/B0F7FT9H1Z' },
    ],
    note: 'English translation by Valérie Escalier.',
  },
  {
    slug: 'crt',
    title: 'Conflict Resolution Therapy (CRT)',
    subtitle: 'TI15 — a standalone brief therapy',
    descriptionShort:
      'Conflict Resolution Therapy (TI15), published in English as a standalone volume. Available in paperback and on Kindle.',
    descriptionLong:
      'Conflict Resolution Therapy (CRT, internal reference TI15) is published in English as a standalone volume, ahead of the staggered English release of the wider Memento. Available in paperback and on Kindle through Amazon US.',
    editions: [
      { format: 'Paperback', isbn: '978-2-9595562-4-1', amazonUrl: 'https://www.amazon.com/dp/2959556240' },
      { format: 'Kindle', isbn: '978-2-9595562-5-8', asin: 'B0F5P62KJY', amazonUrl: 'https://www.amazon.com/dp/B0F5P62KJY' },
    ],
  },
];

/** Volumes annoncés mais pas encore traduits (placeholders du doc). */
export const EN_UPCOMING: { title: string; note: string }[] = [
  {
    title: 'Volume 2',
    note: 'Translation of Tome 1 FR — 15 first-wave brief therapies (incl. CBT, EMDR, Ericksonian hypnosis). Coming soon.',
  },
  { title: 'Volume 3', note: 'Coming in English — Q1 2027.' },
  { title: 'Volumes 4 to 9', note: 'Released in English as each French volume is translated.' },
];

export function getEnVolume(slug: string): EnVolume | undefined {
  return EN_VOLUMES.find((v) => v.slug === slug);
}
