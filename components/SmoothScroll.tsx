'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

/**
 * Smooth scroll global via Lenis — desktop ET mobile.
 * - Inertie longue, easing expoOut éditorial
 * - syncTouch activé sur mobile pour un feel cohérent partout
 * - Désactivé automatiquement si prefers-reduced-motion
 * - Désactivé sur /admin/* (formulaires)
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.35, // un peu plus long → sensation lente et éditoriale
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true, // smooth touch sur mobile
      syncTouchLerp: 0.08, // un peu plus snappy en touch
      touchMultiplier: 1.2,
      wheelMultiplier: 0.95,
      lerp: 0.085,
      gestureOrientation: 'vertical',
    });

    let raf = 0;
    function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [isAdmin]);

  return null;
}
