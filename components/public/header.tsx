'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { CompanyLogo } from '@/components/ui/company-logo';

const serviceLinks = [
  { name: 'All services', href: '/services' },
  { name: 'Hot insulation', href: '/services/hot-insulation' },
  { name: 'Cold & cryogenic insulation', href: '/services/cold-cryogenic-insulation' },
  { name: 'Passive fire protection', href: '/services/passive-fire-protection' },
  { name: 'Coating & painting', href: '/services/coating-and-painting' },
  { name: 'Skilled manpower', href: '/services/skilled-manpower' },
  { name: 'Scaffolding & access', href: '/services/scaffolding' },
];

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Industries', href: '/industries' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const servicesActive = pathname.startsWith('/services');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[60] bg-white px-4 py-3 font-bold text-[#071D35] focus:not-sr-only"
      >
        Skip to main content
      </a>

      <header className={`sticky top-0 z-50 border-b border-white/10 bg-[#071D35] text-white transition-shadow duration-200 ${scrolled ? 'shadow-[0_8px_24px_rgba(7,29,56,.22)]' : ''}`}>
        <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-5 px-5 py-3 sm:px-8 sm:py-4 lg:min-h-[112px] lg:px-8 lg:py-6">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3.5" aria-label="ARS EXIM – EXpert Insulation Management home">
            <CompanyLogo
              priority
              sizes="(max-width: 640px) 60px, (max-width: 1023px) 65px, 75px"
              className="h-10 w-auto shrink-0 object-contain sm:h-[54px] lg:h-[62px]"
            />
            <span className="block min-w-0">
              <span className="block truncate text-[11px] font-bold uppercase tracking-[0.08em] text-white sm:text-[13px] sm:tracking-[0.1em] lg:text-base">
                ARS EXIM
              </span>
              <span className="mt-0.5 block text-[8px] font-medium leading-tight tracking-normal text-[#DCE3EA] sm:mt-1 sm:text-[10px] sm:tracking-[0.08em] lg:text-xs">
                <strong>EX</strong>pert <strong>I</strong>nsulation <strong>M</strong>anagement
              </span>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex xl:gap-8">
            {navigation.slice(0, 2).map((link) => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative py-3 text-sm font-semibold transition-colors hover:text-white ${active ? 'text-white' : 'text-white/70'}`}
                >
                  {link.name}
                  {active && <span className="absolute inset-x-0 bottom-1 h-0.5 bg-[#DCE3EA]" />}
                </Link>
              );
            })}

            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
              onFocus={() => setServicesOpen(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setServicesOpen(false);
                }
              }}
            >
              <div className="flex items-center gap-1">
                <Link
                  href="/services"
                  aria-current={servicesActive ? 'page' : undefined}
                  className={`py-3 text-sm font-semibold transition-colors hover:text-white ${servicesActive ? 'text-white' : 'text-white/70'}`}
                >
                  Services
                </Link>
                <button
                  type="button"
                  aria-label="Toggle services menu"
                  aria-expanded={servicesOpen}
                  aria-controls="services-menu"
                  onClick={() => setServicesOpen((open) => !open)}
                  className="flex h-9 w-7 items-center justify-center text-white/70 transition-colors hover:text-white focus-visible:outline-white"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
              </div>
              {servicesOpen && (
                <div id="services-menu" className="absolute left-0 top-full w-64 border border-[#D8E0E8] bg-white py-2 text-[#263445] shadow-xl">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={pathname === link.href ? 'page' : undefined}
                      className={`block px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#F3F6F9] hover:text-[#12365A] ${pathname === link.href ? 'bg-[#F3F6F9] text-[#12365A]' : ''}`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navigation.slice(2).map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative py-3 text-sm font-semibold transition-colors hover:text-white ${active ? 'text-white' : 'text-white/70'}`}
                >
                  {link.name}
                  {active && <span className="absolute inset-x-0 bottom-1 h-0.5 bg-[#DCE3EA]" />}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Link
              href="/request-a-quote"
              className="inline-flex min-h-10 items-center justify-center gap-2 bg-white px-4 text-xs font-bold text-[#071D35] transition-colors hover:bg-[#DCE3EA]"
            >
              Request a Quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/25 text-white transition-colors hover:bg-white/10 focus-visible:outline-white lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="max-h-[calc(100vh-7rem)] overflow-y-auto border-t border-white/15 bg-[#071D35] px-4 pb-6 pt-3 text-white lg:hidden sm:px-8"
          >
            {navigation.slice(0, 2).map((link) => {
              const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-12 items-center border-b border-white/10 text-sm font-semibold ${active ? 'text-white' : 'text-white/75'}`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="border-b border-white/10">
              <div className="flex min-h-12 items-center justify-between">
                <Link href="/services" aria-current={servicesActive ? 'page' : undefined} className={`text-sm font-semibold ${servicesActive ? 'text-white' : 'text-white/75'}`}>
                  Services
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen((open) => !open)}
                  aria-label="Toggle services submenu"
                  aria-expanded={mobileServicesOpen}
                  aria-controls="mobile-services-menu"
                  className="flex h-11 w-11 items-center justify-center text-white/80"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
              </div>
              {mobileServicesOpen && (
                <div id="mobile-services-menu" className="space-y-1 pb-3 pl-4">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={pathname === link.href ? 'page' : undefined}
                      className="flex min-h-10 items-center text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {navigation.slice(2).map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-12 items-center border-b border-white/10 text-sm font-semibold ${active ? 'text-white' : 'text-white/75'}`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/request-a-quote"
              className="mt-5 flex min-h-12 items-center justify-center gap-2 bg-white px-4 text-sm font-bold text-[#071D35] transition-colors hover:bg-[#DCE3EA]"
            >
              Request a Quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
