import { useCallback } from 'react';
import { animate, stagger } from 'animejs';

// Hook for Anime.js v4 micro-interactions
export function useAnime() {
  // Cart badge pop animation
  const cartBadgePop = useCallback((selector: string) => {
    animate(selector, {
      scale: [
        { from: 0, to: 1.5 },
        { to: 1 },
      ],
      duration: 600,
      easing: 'outElastic(1, .5)',
    });
  }, []);

  // Number counter animation
  const countUp = useCallback((selector: string, target: number, duration = 1000) => {
    const el = document.querySelector(selector);
    if (!el) return;
    
    const obj = { value: 0 };
    animate(obj, {
      value: target,
      duration,
      easing: 'outExpo',
      onUpdate: () => {
        el.textContent = Math.round(obj.value).toLocaleString('en-IN');
      },
    });
  }, []);

  // Stagger fade in
  const staggerIn = useCallback((selector: string, delay = 50) => {
    animate(selector, {
      translateY: [20, 0],
      opacity: [0, 1],
      delay: stagger(delay),
      duration: 500,
      easing: 'outCubic',
    });
  }, []);

  // Slide in from right (for toasts, drawers)
  const slideInRight = useCallback((selector: string) => {
    animate(selector, {
      translateX: [100, 0],
      opacity: [0, 1],
      duration: 400,
      easing: 'outCubic',
    });
  }, []);

  // Shake animation (for errors)
  const shake = useCallback((selector: string) => {
    animate(selector, {
      translateX: [0, -10, 10, -10, 10, 0],
      duration: 500,
      easing: 'inOutSine',
    });
  }, []);

  // Pulse animation (for buttons, highlights)
  const pulse = useCallback((selector: string) => {
    animate(selector, {
      scale: [
        { from: 1, to: 1.05 },
        { to: 1 },
      ],
      duration: 600,
      easing: 'inOutSine',
    });
  }, []);

  return {
    cartBadgePop,
    countUp,
    staggerIn,
    slideInRight,
    shake,
    pulse,
  };
}
