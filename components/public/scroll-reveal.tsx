'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Fragment } from 'react';
import { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: 'text' | 'image';
}

export function ScrollReveal({
  children,
  className,
  variant = 'text',
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReady(true);
      setVisible(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setReady(true);
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
        setReady(true);
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );

    observer.observe(element);

    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const bounds = element.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;

      const viewportCenter = window.innerHeight / 2;
      const elementCenter = bounds.top + bounds.height / 2;
      const progress = (elementCenter - viewportCenter) / window.innerHeight;
      const offset = Math.max(-14, Math.min(14, -progress * 24));
      element.style.setProperty('--scroll-shift', `${offset.toFixed(2)}px`);
    };

    const requestParallaxUpdate = () => {
      if (frame === 0) frame = window.requestAnimationFrame(updateParallax);
    };

    if (variant === 'image') {
      requestParallaxUpdate();
      window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
      window.addEventListener('resize', requestParallaxUpdate);
    }

    return () => {
      observer.disconnect();
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestParallaxUpdate);
      window.removeEventListener('resize', requestParallaxUpdate);
    };
  }, [variant]);

  return (
    <div
      ref={elementRef}
      className={className}
      data-scroll-reveal=""
      data-motion={variant}
      data-ready={ready}
      data-visible={visible}
    >
      {children}
    </div>
  );
}

interface ScrollTextRevealProps {
  text: string;
  className?: string;
}

export function ScrollTextReveal({ text, className }: ScrollTextRevealProps) {
  const words = text.split(/\s+/);

  return (
    <ScrollReveal className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span
              className="scroll-reveal-word"
              style={{ '--word-index': index } as CSSProperties}
            >
              {word}
            </span>
            {index < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </span>
    </ScrollReveal>
  );
}
