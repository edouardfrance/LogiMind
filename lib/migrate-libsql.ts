/**
 * Migrations idempotentes pour libSQL.
 * Append-only — jamais modifier une migration shippée.
 * Wrapper .catch(() => {}) sur chaque ALTER pour les colonnes déjà ajoutées.
 *
 * Usage : import et appeler `await runMigrations()` au démarrage app
 * (ou via un script `npm run db:migrate`).
 */
import { libsql } from './db';

const STATEMENTS: string[] = [
  // ===== books =====
  `CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    author TEXT NOT NULL DEFAULT 'Édouard de Boysson',
    description_short TEXT NOT NULL,
    description_long TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    excerpt_url TEXT,
    amazon_kindle_url TEXT,
    category TEXT,
    published_year INTEGER,
    is_published INTEGER NOT NULL DEFAULT 0,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS books_slug_idx ON books(slug)`,
  `CREATE INDEX IF NOT EXISTS books_published_idx ON books(is_published, display_order)`,
  // Colonnes additives (append-only, idempotentes via le catch "duplicate column")
  `ALTER TABLE books ADD COLUMN amazon_paperback_url TEXT`,
  `ALTER TABLE books ADD COLUMN release_label TEXT`,

  // ===== book_formats =====
  `CREATE TABLE IF NOT EXISTS book_formats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    format TEXT NOT NULL,
    isbn TEXT,
    price_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    pdf_blob_key TEXT,
    pdf_size_bytes INTEGER,
    lulu_url TEXT,
    page_count INTEGER,
    weight_grams INTEGER,
    stripe_price_id TEXT,
    is_available INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS book_formats_book_format_idx ON book_formats(book_id, format)`,
  `CREATE INDEX IF NOT EXISTS book_formats_book_id_idx ON book_formats(book_id)`,

  // ===== orders =====
  `CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stripe_session_id TEXT NOT NULL,
    stripe_payment_intent TEXT,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    shipping_address_json TEXT,
    total_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    status TEXT NOT NULL DEFAULT 'pending',
    has_digital INTEGER NOT NULL DEFAULT 0,
    has_physical INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    paid_at INTEGER,
    fulfilled_at INTEGER
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS orders_session_idx ON orders(stripe_session_id)`,
  `CREATE INDEX IF NOT EXISTS orders_email_idx ON orders(customer_email)`,

  // ===== order_items =====
  `CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    book_format_id INTEGER NOT NULL REFERENCES book_formats(id),
    book_title TEXT NOT NULL,
    format TEXT NOT NULL,
    isbn TEXT,
    price_cents INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1
  )`,
  `CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items(order_id)`,

  // ===== download_tokens =====
  `CREATE TABLE IF NOT EXISTS download_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    book_format_id INTEGER NOT NULL REFERENCES book_formats(id),
    expires_at INTEGER NOT NULL,
    max_downloads INTEGER NOT NULL DEFAULT 5,
    download_count INTEGER NOT NULL DEFAULT 0,
    last_downloaded_at INTEGER,
    created_at INTEGER NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS download_tokens_token_idx ON download_tokens(token)`,
  `CREATE INDEX IF NOT EXISTS download_tokens_order_idx ON download_tokens(order_id)`,

  // ===== blog_posts =====
  `CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    body TEXT NOT NULL,
    cover_url TEXT,
    author TEXT NOT NULL DEFAULT 'Édouard de Boysson',
    category TEXT,
    reading_minutes INTEGER,
    related_book_id INTEGER REFERENCES books(id) ON DELETE SET NULL,
    is_published INTEGER NOT NULL DEFAULT 0,
    published_at INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug)`,
  `CREATE INDEX IF NOT EXISTS blog_posts_pub_idx ON blog_posts(is_published, published_at)`,

  // ===== newsletter_subscribers =====
  `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    source TEXT,
    ip TEXT,
    confirmed_at INTEGER,
    unsubscribed_at INTEGER,
    created_at INTEGER NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS newsletter_email_idx ON newsletter_subscribers(email)`,
];

export async function runMigrations(): Promise<void> {
  for (const sql of STATEMENTS) {
    try {
      await libsql.execute(sql);
    } catch (err) {
      // Idempotent : on ignore les "already exists"
      const msg = err instanceof Error ? err.message : String(err);
      if (!/already exists|duplicate column/i.test(msg)) {
        console.error('[migrate]', sql.slice(0, 80), '->', msg);
        throw err;
      }
    }
  }
}

// Permet `npm run db:migrate` en standalone
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('✅ Migrations OK');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Migration failed:', err);
      process.exit(1);
    });
}
