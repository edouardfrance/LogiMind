/**
 * Logimind — Drizzle schema (libSQL/Turso)
 *
 * Conventions :
 * - timestamps stockés en epoch seconds (integer)
 * - prix en centimes EUR (integer)
 * - boolean encodés en integer 0/1
 * - jamais de drizzle-kit ; migrations dans lib/migrate-libsql.ts
 */
import { sqliteTable, integer, text, uniqueIndex, index } from 'drizzle-orm/sqlite-core';

/** Métadonnées d'un livre (indépendantes du format) */
export const books = sqliteTable(
  'books',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    author: text('author').notNull().default('Édouard de Boysson'),
    descriptionShort: text('description_short').notNull(),
    descriptionLong: text('description_long').notNull(),
    coverUrl: text('cover_url').notNull(),
    excerptUrl: text('excerpt_url'),
    amazonKindleUrl: text('amazon_kindle_url'),
    /** Lien Amazon de l'édition brochée (vitrine, achat externe). */
    amazonPaperbackUrl: text('amazon_paperback_url'),
    category: text('category'),
    publishedYear: integer('published_year'),
    /** Si renseigné (ex. « Parution 2026 »), le livre est affiché « à paraître » : visible mais non achetable. */
    releaseLabel: text('release_label'),
    isPublished: integer('is_published').notNull().default(0),
    displayOrder: integer('display_order').notNull().default(0),
    createdAt: integer('created_at')
      .notNull()
      .$defaultFn(() => Math.floor(Date.now() / 1000)),
    updatedAt: integer('updated_at')
      .notNull()
      .$defaultFn(() => Math.floor(Date.now() / 1000)),
  },
  (t) => ({
    slugIdx: uniqueIndex('books_slug_idx').on(t.slug),
    publishedIdx: index('books_published_idx').on(t.isPublished, t.displayOrder),
  })
);

/** Format vendable d'un livre. Un livre peut avoir 1-4 formats. */
export const bookFormats = sqliteTable(
  'book_formats',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    bookId: integer('book_id')
      .notNull()
      .references(() => books.id, { onDelete: 'cascade' }),
    /** 'pdf' | 'kindle' | 'paperback' | 'hardcover' */
    format: text('format').notNull(),
    isbn: text('isbn'),
    priceCents: integer('price_cents').notNull(),
    currency: text('currency').notNull().default('EUR'),

    /** PDF : path Vercel Blob (servi via signed token) */
    pdfBlobKey: text('pdf_blob_key'),
    pdfSizeBytes: integer('pdf_size_bytes'),

    /** Physique : on redirige vers Lulu/BoD pour V1, API auto en V2 */
    luluUrl: text('lulu_url'),
    pageCount: integer('page_count'),
    weightGrams: integer('weight_grams'),

    /** Stripe Price id (créé via API au seed ou via admin) */
    stripePriceId: text('stripe_price_id'),

    isAvailable: integer('is_available').notNull().default(1),
    createdAt: integer('created_at')
      .notNull()
      .$defaultFn(() => Math.floor(Date.now() / 1000)),
  },
  (t) => ({
    bookFormatIdx: uniqueIndex('book_formats_book_format_idx').on(t.bookId, t.format),
    bookIdIdx: index('book_formats_book_id_idx').on(t.bookId),
  })
);

/** Commande Stripe. Une session Checkout = un order. */
export const orders = sqliteTable(
  'orders',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    stripeSessionId: text('stripe_session_id').notNull(),
    stripePaymentIntent: text('stripe_payment_intent'),
    customerEmail: text('customer_email').notNull(),
    customerName: text('customer_name'),
    /** JSON.stringify({line1, city, postal_code, country, ...}) si physique */
    shippingAddressJson: text('shipping_address_json'),
    totalCents: integer('total_cents').notNull(),
    currency: text('currency').notNull().default('EUR'),
    /** 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded' */
    status: text('status').notNull().default('pending'),
    hasDigital: integer('has_digital').notNull().default(0),
    hasPhysical: integer('has_physical').notNull().default(0),
    createdAt: integer('created_at')
      .notNull()
      .$defaultFn(() => Math.floor(Date.now() / 1000)),
    paidAt: integer('paid_at'),
    fulfilledAt: integer('fulfilled_at'),
  },
  (t) => ({
    sessionIdx: uniqueIndex('orders_session_idx').on(t.stripeSessionId),
    emailIdx: index('orders_email_idx').on(t.customerEmail),
  })
);

/** Ligne d'une commande. Snapshot titre/format pour archivage. */
export const orderItems = sqliteTable(
  'order_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderId: integer('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    bookFormatId: integer('book_format_id')
      .notNull()
      .references(() => bookFormats.id),
    bookTitle: text('book_title').notNull(),
    format: text('format').notNull(),
    isbn: text('isbn'),
    priceCents: integer('price_cents').notNull(),
    quantity: integer('quantity').notNull().default(1),
  },
  (t) => ({
    orderIdx: index('order_items_order_idx').on(t.orderId),
  })
);

/** Token signé pour télécharger un PDF post-paiement. */
export const downloadTokens = sqliteTable(
  'download_tokens',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    token: text('token').notNull(),
    orderId: integer('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    bookFormatId: integer('book_format_id')
      .notNull()
      .references(() => bookFormats.id),
    expiresAt: integer('expires_at').notNull(),
    maxDownloads: integer('max_downloads').notNull().default(5),
    downloadCount: integer('download_count').notNull().default(0),
    lastDownloadedAt: integer('last_downloaded_at'),
    createdAt: integer('created_at')
      .notNull()
      .$defaultFn(() => Math.floor(Date.now() / 1000)),
  },
  (t) => ({
    tokenIdx: uniqueIndex('download_tokens_token_idx').on(t.token),
    orderIdx: index('download_tokens_order_idx').on(t.orderId),
  })
);

/** Articles de blog — markdown light dans body, géré via /admin/blog. */
export const blogPosts = sqliteTable(
  'blog_posts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    excerpt: text('excerpt').notNull(),
    body: text('body').notNull(),
    coverUrl: text('cover_url'),
    author: text('author').notNull().default('Édouard de Boysson'),
    category: text('category'),
    readingMinutes: integer('reading_minutes'),
    relatedBookId: integer('related_book_id').references(() => books.id, { onDelete: 'set null' }),
    isPublished: integer('is_published').notNull().default(0),
    publishedAt: integer('published_at'),
    createdAt: integer('created_at')
      .notNull()
      .$defaultFn(() => Math.floor(Date.now() / 1000)),
    updatedAt: integer('updated_at')
      .notNull()
      .$defaultFn(() => Math.floor(Date.now() / 1000)),
  },
  (t) => ({
    blogSlugIdx: uniqueIndex('blog_posts_slug_idx').on(t.slug),
    blogPubIdx: index('blog_posts_pub_idx').on(t.isPublished, t.publishedAt),
  })
);

/** Inscrits à la newsletter. */
export const newsletterSubscribers = sqliteTable(
  'newsletter_subscribers',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull(),
    source: text('source'),
    ip: text('ip'),
    confirmedAt: integer('confirmed_at'),
    unsubscribedAt: integer('unsubscribed_at'),
    createdAt: integer('created_at')
      .notNull()
      .$defaultFn(() => Math.floor(Date.now() / 1000)),
  },
  (t) => ({
    emailIdx: uniqueIndex('newsletter_email_idx').on(t.email),
  })
);

export type Book = typeof books.$inferSelect;
export type BookFormat = typeof bookFormats.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type DownloadToken = typeof downloadTokens.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
