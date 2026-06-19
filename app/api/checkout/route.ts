/**
 * POST /api/checkout
 * Body : { bookFormatId: number }
 * → crée une Stripe Checkout Session et renvoie { url }.
 *
 * - PDF : pas de shipping, métadonnées { kind: 'digital' }
 * - paperback / hardcover : shipping required (FR + EU), { kind: 'physical' }
 * - kindle : ne devrait pas passer ici (redirect Amazon côté UI)
 */
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe, STRIPE_NAMESPACE } from '@/lib/stripe';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { formatLabel } from '@/lib/books';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BodySchema = z.object({
  bookFormatId: z.number().int().positive(),
});

export async function POST(req: Request) {
  let parsed: { bookFormatId: number };
  try {
    const json = await req.json();
    parsed = BodySchema.parse(json);
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  // Charge format + book
  const [format] = await db
    .select()
    .from(schema.bookFormats)
    .where(eq(schema.bookFormats.id, parsed.bookFormatId))
    .limit(1);

  if (!format) {
    return NextResponse.json({ error: 'Format introuvable' }, { status: 404 });
  }
  if (!format.isAvailable) {
    return NextResponse.json({ error: 'Format non disponible' }, { status: 410 });
  }
  if (format.format === 'kindle') {
    return NextResponse.json(
      { error: 'Kindle se vend uniquement sur Amazon' },
      { status: 400 }
    );
  }

  const [book] = await db
    .select()
    .from(schema.books)
    .where(eq(schema.books.id, format.bookId))
    .limit(1);

  if (!book) {
    return NextResponse.json({ error: 'Livre introuvable' }, { status: 404 });
  }

  const isDigital = format.format === 'pdf';
  const isPhysical = format.format === 'paperback' || format.format === 'hardcover';

  const origin = req.headers.get('origin') ?? process.env.APP_URL ?? 'https://logimind.org';
  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: format.currency.toLowerCase(),
            unit_amount: format.priceCents,
            product_data: {
              name: `${book.title} — ${formatLabel(format.format)}`,
              description: book.descriptionShort.slice(0, 500),
              metadata: {
                namespace: STRIPE_NAMESPACE,
                bookSlug: book.slug,
                format: format.format,
                isbn: format.isbn ?? '',
              },
              ...(book.coverUrl ? { images: [book.coverUrl] } : {}),
            },
          },
        },
      ],
      customer_creation: 'always',
      customer_email: undefined, // Stripe demande au customer
      // Shipping si physique
      shipping_address_collection: isPhysical
        ? {
            allowed_countries: [
              'FR', 'BE', 'LU', 'CH', 'DE', 'ES', 'IT', 'NL', 'PT', 'GB',
              'IE', 'AT', 'DK', 'SE', 'FI', 'NO', 'PL', 'CZ', 'US', 'CA',
            ],
          }
        : undefined,
      // Frais de port simples : à raffiner selon poids/pays
      shipping_options: isPhysical
        ? [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: 590, currency: 'eur' },
                display_name: 'Livraison standard (7-14 jours)',
                delivery_estimate: {
                  minimum: { unit: 'business_day', value: 7 },
                  maximum: { unit: 'business_day', value: 14 },
                },
              },
            },
          ]
        : undefined,
      automatic_tax: { enabled: false }, // à activer quand TVA configurée Stripe
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      success_url: `${origin}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/books/${book.slug}`,
      metadata: {
        namespace: STRIPE_NAMESPACE,
        bookId: String(book.id),
        bookFormatId: String(format.id),
        bookSlug: book.slug,
        format: format.format,
        kind: isDigital ? 'digital' : 'physical',
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Session sans URL' }, { status: 500 });
    }
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error('[checkout] stripe error', e);
    const msg = e instanceof Error ? e.message : 'Erreur Stripe';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
