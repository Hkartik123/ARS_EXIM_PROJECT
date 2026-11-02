import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface AnimatedCtaLinkProps {
  href: string;
  children: ReactNode;
  appearance?: 'primary' | 'outline';
  className?: string;
}

export function AnimatedCtaLink({
  href,
  children,
  appearance = 'primary',
  className = '',
}: AnimatedCtaLinkProps) {
  return (
    <Link
      href={href}
      className={`animated-cta animated-cta--${appearance} ${className}`}
    >
      <span>{children}</span>
      <span className="animated-cta__indicator" aria-hidden="true">
        <span className="animated-cta__dot" />
        <ArrowRight className="animated-cta__arrow" />
      </span>
    </Link>
  );
}
