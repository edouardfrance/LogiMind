/**
 * POST /api/stripe/webhook
 *
 * - Vérifie la signature Stripe (STRIPE_WEBHOOK_SECRET).
 * - Sur `checkout.session.completed` :
 *    1. Insère/maj l'order en DB (idempotent via stripe_session_id unique).
 *    2. Crée order_items snapshot.
 *    3. Pour PDF : crée download_token + envoie email Resend.
 *    4. Pour physique : email confirmation (la commande Lulu/BoD est manuelle V1).
 *
 * Toujours répondre 200 même en cas d'erreur métier — Stripe retry sinon.
 * Logger les erreurs côté serveur pour reprise manuelle.
 */
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { eq } from 'drizzle-orm';
import { getStripe } from '@/lib/stripe';
import { db, schema } from '@/lib/db';
import { createDownloadToken } from '@/lib/tokens';
import { sendDigitalDelivery, sendPhysicalConfirmation } from '@/lib/resend';
import { formatLabel } from '@/lib/books';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    console.error('[webhook] missing signature or secret');
    return NextResponse.json({ error: 'misconfigured' }, { status: 400 });
  }

  const raw = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error('[webhook] signature invalid', e);
    return NextResponse.json({ error: 'signature invalid' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    }
    return NextResponse.json({ received: true });
  } catch (e) {
    // On log mais on renvoie 200 — l'order est sauvegardée si on est passé en DB.
    // Pour les sides effects (email) qui auraient échoué : reprise manuelle via admin.
    console.error('[webhook] handler error', e);
    return NextResponse.json({ received: true, warning: 'handler error' });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const meta = session.metadata ?? {};
  if (meta.namespace !== 'logimind') {
    // Pas une commande Logimind (autre app sur même compte Stripe) → ignore
    return;
  }
  const bookFormatId = Number(meta.bookFormatId);
  const bookId = Number(meta.bookId);
  if (!bookFormatId || !bookId) {
    console.error('[webhook] missing bookFormatId/bookId in metadata', meta);
    return;
  }

  // 1. Idempotence : si déjà traité, skip
  const existing = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.stripeSessionId, session.id))
    .limit(1);

  if (existing[0]?.status === 'paid' || existing[0]?.status === 'fulfilled') {
    console.log('[webhook] session already processed', session.id);
    return;
  }

  // 2. Charge le format pour snapshot
  const [format] = await db
    .select()
    .from(schema.bookFormats)
    .where(eq(schema.bookFormats.id, bookFormatId))
    .limit(1);

  if (!format) {
    console.error('[webhook] bookFormat not found', bookFormatId);
    return;
  }

  const [book] = await db
    .select()
    .from(schema.books)
    .where(eq(schema.books.id, bookId))
    .limit(1);

  if (!book) {
    console.error('[webhook] book not found', bookId);
    return;
  }

  const isDigital = format.format === 'pdf';
  const isPhysical = format.format === 'paperback' || format.format === 'hardcover';
  const customerEmail =
    session.customer_details?.email ?? session.customer_email ?? 'unknown@unknown';
  const customerName = session.customer_details?.name ?? null;
  const shippingDetails =
    (session as Stripe.Checkout.Session & {
      shipping_details?: { address?: Stripe.Address; name?: string };
    }).shipping_details;
  const address = shippingDetails?.address ?? null;
  const shippingAddressJson = address ? JSON.stringify(address) : null;

  // 3. Insert/upsert order
  let order = existing[0];
  if (!order) {
    const [inserted] = await db
      .insert(schema.orders)
      .values({
        stripeSessionId: session.id,
        stripePaymentIntent:
          typeof session.payment_intent === 'string' ? session.payment_intent : null,
        customerEmail,
        customerName,
        shippingAddressJson,
        totalCents: session.amount_total ?? format.priceCents,
        currency: (session.currency ?? format.currency).toUpperCase(),
        status: 'paid',
        hasDigital: isDigital ? 1 : 0,
        hasPhysical: isPhysical ? 1 : 0,
        paidAt: Math.floor(Date.now() / 1000),
      })
      .returning();
    order = inserted;
  } else {
    await db
      .update(schema.orders)
      .set({
        status: 'paid',
        paidAt: Math.floor(Date.now() / 1000),
        customerEmail,
        customerName,
        shippingAddressJson,
      })
      .where(eq(schema.orders.id, order.id));
  }

  // 4. order_items
  const [existingItem] = await db
    .select()
    .from(schema.orderItems)
    .where(eq(schema.orderItems.orderId, order.id))
    .limit(1);

  if (!existingItem) {
    await db.insert(schema.orderItems).values({
      orderId: order.id,
      bookFormatId: format.id,
      bookTitle: book.title,
      format: format.format,
      isbn: format.isbn ?? null,
      priceCents: format.priceCents,
      quantity: 1,
    });
  }

  // 5. Side effects email
  if (isDigital) {
    const token = await createDownloadToken({
      orderId: order.id,
      bookFormatId: format.id,
    });
    const origin = process.env.APP_URL ?? 'https://logimind.org';
    const downloadUrl = `${origin}/api/download/${token.token}`;

    await sendDigitalDelivery({
      to: customerEmail,
      customerName,
      bookTitle: book.title,
      downloadUrl,
      expiresAt: token.expiresAtDate,
      maxDownloads: token.maxDownloads,
    });
  } else if (isPhysical) {
    const formattedAddress = address
      ? [
          shippingDetails?.name,
          address.line1,
          address.line2,
          [address.postal_code, address.city].filter(Boolean).join(' '),
          address.state,
          address.country,
        ]
          .filter(Boolean)
          .join('\n')
      : '(adresse non fournie)';

    await sendPhysicalConfirmation({
      to: customerEmail,
      customerName,
      bookTitle: book.title,
      format: format.format as 'paperback' | 'hardcover',
      shippingAddress: formattedAddress,
    });

    // TODO V2 : appeler API Lulu xPress automatiquement.
    // V1 : Edmond reçoit notif email + commande manuellement sur Lulu/BoD.
    console.log('[webhook] physical order received, requires manual fulfillment', {
      orderId: order.id,
      bookSlug: book.slug,
      format: format.format,
    });
  }
}
