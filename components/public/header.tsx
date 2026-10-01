'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, Mail, ShieldAlert, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    {
      name: 'Services',
      href: '/services',
      subLinks: [
        { name: 'Overview', href: '/services' },
        { name: 'Hot Insulation', href: '/services/hot-insulation' },
        { name: 'Cold & Cryogenic Insulation', href: '/services/cold-cryogenic-insulation' },
        { name: 'Passive Fire Protection', href: '/services/passive-fire-protection' },
        { name: 'Scaffolding & Access', href: '/services/scaffolding' },
      ],
    },
    { name: 'Industries', href: '/industries' },
    { name: 'Projects', href: '/projects' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Skip to Main Content for WCAG 2.2 AA Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-gold text-navy-950 font-bold px-4 py-2 rounded shadow-lg"
      >
        Skip to main content
      </a>

      {/* Top Utility Bar */}
      <div className="bg-[#edf5ff] text-navy-900 text-xs py-2 border-b border-[#d9eafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="hidden items-center space-x-6 sm:flex">
            <span className="flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-safety-red" />
              <span className="font-semibold text-navy-900">Site safety · Quality · Coordination</span>
            </span>
            <span className="hidden sm:inline-block text-navy-700">
              Insulation · PFP · Scaffolding & Access
            </span>
          </div>
          <div className="flex items-center space-x-5">
            <a
              href="tel:+919764425426"
              className="hover:text-navy-700 transition-colors flex items-center space-x-1 text-navy-900"
            >
              <Phone className="w-3 h-3 text-navy-900" />
              <span>+91 9764 425 426</span>
            </a>
            <a
              href="mailto:info@arsexim.com"
              className="hover:text-navy-700 transition-colors hidden md:flex items-center space-x-1 text-navy-900"
            >
              <Mail className="w-3 h-3 text-navy-900" />
              <span>info@arsexim.com</span>
            </a>
            <a href="https://wa.me/919764425426" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-semibold text-[#177d53] transition-colors hover:text-[#105d3e]">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-200 bg-white text-navy-900 border-b border-[#dfe9f6]',
          scrolled ? 'shadow-industrial-lg py-2.5' : 'py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group max-w-[380px]">
            <Image
              src="/ars-exim-logo-transparent.png"
              alt="ARS EXIM Global Solutions logo"
              width={96}
              height={96}
              priority
              className="h-[76px] w-[76px] sm:h-[92px] sm:w-[92px] object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              if (link.subLinks) {
                return (
                  <div
                    key={link.name}
                    className="relative group"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      type="button"
                      aria-expanded={servicesOpen}
                      className={cn(
                        'flex items-center space-x-1 text-sm font-semibold tracking-wide transition-colors py-2 focus:outline-none focus:text-navy-900',
                        isActive ? 'text-navy-900' : 'text-navy-700 hover:text-navy-900'
                      )}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className="w-4 h-4 text-navy-700 group-hover:text-navy-900 transition-transform group-hover:rotate-180" />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 w-64 pt-2 hidden group-hover:block transition-all">
                      <div className="bg-white border border-[#dfeaf7] rounded shadow-industrial-lg py-2">
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={cn(
                              'block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                              pathname === sub.href
                                ? 'bg-[#edf5ff] text-navy-900 font-bold'
                                : 'text-navy-700 hover:bg-[#edf5ff] hover:text-navy-900'
                            )}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'text-sm font-semibold tracking-wide transition-colors py-2 relative',
                    isActive
                      ? 'text-navy-900'
                      : 'text-navy-700 hover:text-navy-900'
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy-900 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Primary CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/request-a-quote">
              <Button variant="primary" size="md">
                Request a Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-navy-900 hover:text-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-900 rounded"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#dfeaf7] px-4 pt-3 pb-6 space-y-2 text-navy-900">
            {navLinks.map((link) => {
              if (link.subLinks) {
                return (
                  <div key={link.name} className="py-2 border-b border-navy-800">
                    <span className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-2">
                      {link.name}
                    </span>
                    <div className="pl-3 space-y-1.5">
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="block text-sm font-semibold text-navy-700 hover:text-navy-900 py-1"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-base font-semibold text-navy-900 hover:text-navy-700 py-2 border-b border-[#dfeaf7]"
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-4">
              <Link href="/request-a-quote" className="block w-full">
                <Button variant="primary" size="lg" className="w-full">
                  Request a Project Quote
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
