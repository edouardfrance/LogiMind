/**
 * Diviseur ornemental éditorial — losange + traits.
 * Sert à structurer les longues pages sans surcharger.
 */
interface OrnamentProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  marginY?: number;
}

export function Ornament({ color, size = 'md', marginY = 32 }: OrnamentProps) {
  const w = size === 'sm' ? 60 : size === 'lg' ? 140 : 100;
  const c = color || 'var(--gold)';

  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin: `${marginY}px 0`,
      }}
    >
      <svg width={w} height={14} viewBox="0 0 100 14" fill="none">
        <line x1="0" y1="7" x2="38" y2="7" stroke={c} strokeWidth="1" />
        <path d="M50 1 L57 7 L50 13 L43 7 Z" fill={c} />
        <line x1="62" y1="7" x2="100" y2="7" stroke={c} strokeWidth="1" />
      </svg>
    </div>
  );
}
