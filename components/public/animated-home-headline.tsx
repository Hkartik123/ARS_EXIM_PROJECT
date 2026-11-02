import type { CSSProperties } from 'react';

const headline = 'ARS EXIM';

export function AnimatedHomeHeadline() {
  return (
    <h1
      id="home-title"
      aria-label={headline}
      className="max-w-3xl font-sans text-5xl font-bold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl"
    >
      {Array.from(headline).map((character, index) => (
        <span
          key={`${character}-${index}`}
          aria-hidden="true"
          className="hero-letter"
          style={{ '--letter-index': index } as CSSProperties}
        >
          {character === ' ' ? '\u00a0' : character}
        </span>
      ))}
    </h1>
  );
}
