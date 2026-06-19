'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

interface RevealProps {
  children: React.ReactNode;
  /** Délai (en secondes) avant le start de l'animation. */
  delay?: number;
  /** Distance verticale du translate départ (px). */
  distance?: number;
  /** Durée (s) de l'animation. */
  duration?: number;
  /** Style supplémentaire wrapper. */
  style?: CSSProperties;
  /** Désactive sur prefers-reduced-motion. */
  as?: 'div' | 'section' | 'article' | 'header' | 'aside';
}

/**
 * Reveal scroll-driven via IntersectionObserver.
 * Lent et fluide (1.1 s par défaut), easing custom doux.
 * Trigger une seule fois quand l'élément entre dans le viewport.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 18,
  duration = 1.1,
  style,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setVisible(true);
        return;
      }
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const baseStyle: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${distance}px)`,
    transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    willChange: 'opacity, transform',
    ...style,
  };

  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement & HTMLElement>} style={baseStyle}>
      {children}
    </Tag>
  );
}
