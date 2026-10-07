'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export function FounderProfile() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    setIsVisible(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="founders-heading"
      className="overflow-hidden bg-[#10233f] py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-12">
        <div
          data-visible={isVisible}
          className="founder-reveal relative mx-auto w-full max-w-md"
        >
          <div className="absolute -inset-3 border border-gold/60" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden bg-navy-900 shadow-industrial-lg">
            <Image
              src="/images/project-capabilities/founder-rs.webp"
              alt="ARS EXIM founder portrait"
              fill
              sizes="(max-width: 1024px) 80vw, 34vw"
              className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
            />
          </div>
          <span className="absolute -bottom-6 -right-3 h-16 w-16 border-b-4 border-r-4 border-gold" aria-hidden="true" />
        </div>

        <div data-visible={isVisible} className="founder-copy space-y-5">
          <span className="block text-xs font-bold uppercase tracking-[0.18em] text-gold">
            About Founders
          </span>
          <h2
            id="founders-heading"
            className="font-display text-4xl font-bold leading-tight sm:text-5xl"
          >
            Two Decades of Field-Tested Excellence. Global Expertise. Local Precision
          </h2>
          <p className="max-w-2xl text-base leading-7 text-white/75">
            ARS EXIM supports industrial project teams with specialist insulation, passive fire
            protection, scaffolding and access, coating and painting, and skilled manpower services.
          </p>
          <Link
            href="/about"
            className="inline-flex min-h-11 items-center gap-2 border border-white/40 px-5 text-sm font-bold text-white transition-colors hover:border-gold hover:bg-gold hover:text-navy-950 focus-visible:outline-gold"
          >
            About ARS EXIM <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
