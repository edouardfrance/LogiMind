/**
 * OG image dynamique générique. Pour les fiches livre, on a déjà la cover
 * en image OG via metadata. Ce route sert de fallback site-wide.
 *
 * URL : /og?title=...&subtitle=...
 */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'Logimind';
  const subtitle =
    searchParams.get('subtitle') ?? 'Les livres d\'Édouard de Boysson';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f7f5f0',
          padding: 80,
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: '#8b1e1e',
            letterSpacing: 6,
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Logimind
        </div>
        <div
          style={{
            width: 80,
            height: 1,
            background: '#c9c3b5',
            marginBottom: 40,
          }}
        />
        <div
          style={{
            fontSize: 64,
            color: '#1a1a1a',
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: 920,
            marginBottom: 24,
            display: 'flex',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#6b6b6b',
            textAlign: 'center',
            fontStyle: 'italic',
            display: 'flex',
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
