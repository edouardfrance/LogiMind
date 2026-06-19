/**
 * Resend client + templates email transactionnels.
 * From : noreply@logimind.org (à valider dans Resend → Domains).
 */
import { Resend } from 'resend';

const FROM = 'Logimind <noreply@logimind.org>';
const REPLY_TO = 'edouard@de-boysson.com';

let cached: Resend | null = null;
function client(): Resend {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY manquante dans .env');
  cached = new Resend(key);
  return cached;
}

interface DigitalDeliveryInput {
  to: string;
  customerName?: string | null;
  bookTitle: string;
  downloadUrl: string;
  expiresAt: Date;
  maxDownloads: number;
}

export async function sendDigitalDelivery(input: DigitalDeliveryInput) {
  const { to, customerName, bookTitle, downloadUrl, expiresAt, maxDownloads } = input;
  const greeting = customerName ? `Bonjour ${customerName},` : 'Bonjour,';
  const expiresFr = expiresAt.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return client().emails.send({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: `Votre livre : ${bookTitle}`,
    text: `${greeting}

Merci pour votre achat. Voici le lien de téléchargement de votre livre « ${bookTitle} » :

${downloadUrl}

Ce lien est valable jusqu'au ${expiresFr} et permet jusqu'à ${maxDownloads} téléchargements.

Pour toute question : edouard@de-boysson.com

— Logimind`,
    html: digitalHtml({ greeting, bookTitle, downloadUrl, expiresFr, maxDownloads }),
  });
}

interface PhysicalConfirmationInput {
  to: string;
  customerName?: string | null;
  bookTitle: string;
  format: 'paperback' | 'hardcover';
  shippingAddress: string;
}

export async function sendPhysicalConfirmation(input: PhysicalConfirmationInput) {
  const { to, customerName, bookTitle, format, shippingAddress } = input;
  const greeting = customerName ? `Bonjour ${customerName},` : 'Bonjour,';
  const formatFr = format === 'paperback' ? 'broché' : 'relié';

  return client().emails.send({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: `Commande confirmée : ${bookTitle} (${formatFr})`,
    text: `${greeting}

Votre commande pour « ${bookTitle} » (édition ${formatFr}) est confirmée.

Adresse de livraison :
${shippingAddress}

Délai estimé : 7 à 14 jours ouvrés. Vous recevrez un email avec le numéro de suivi dès expédition.

Pour toute question : edouard@de-boysson.com

— Logimind`,
  });
}

function digitalHtml(p: {
  greeting: string;
  bookTitle: string;
  downloadUrl: string;
  expiresFr: string;
  maxDownloads: number;
}): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Votre livre</title></head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e5e1d8;padding:40px;">
        <tr><td>
          <h1 style="margin:0 0 8px;font-size:28px;font-weight:400;letter-spacing:-0.5px;">Logimind</h1>
          <div style="height:1px;background:#e5e1d8;margin:0 0 28px;"></div>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${escapeHtml(p.greeting)}</p>
          <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">
            Merci pour votre achat. Voici le lien de téléchargement de votre livre
            <strong>« ${escapeHtml(p.bookTitle)} »</strong>.
          </p>
          <p style="margin:0 0 32px;text-align:center;">
            <a href="${p.downloadUrl}" style="display:inline-block;background:#8b1e1e;color:#fff;text-decoration:none;padding:14px 28px;font-size:16px;letter-spacing:0.3px;">
              Télécharger le PDF
            </a>
          </p>
          <p style="margin:0 0 8px;font-size:13px;color:#6b6b6b;">
            Lien valable jusqu'au ${escapeHtml(p.expiresFr)} — ${p.maxDownloads} téléchargements max.
          </p>
          <p style="margin:24px 0 0;font-size:13px;color:#6b6b6b;">
            Une question ? Répondez à cet email ou écrivez à <a href="mailto:edouard@de-boysson.com" style="color:#8b1e1e;">edouard@de-boysson.com</a>.
          </p>
        </td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:12px;color:#999;">© Logimind</p>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
