'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, Mail, ShieldAlert } from 'lucide-react';
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
    { name: 'About', href: '/about' },
    {
      name: 'Services',
      href: '/services',
      subLinks: [
        { name: 'Overview Matrix', href: '/services' },
        { name: 'Industrial Insulation', href: '/services/industrial-insulation' },
        { name: 'Passive Fire Protection', href: '/services/passive-fire-protection' },
        { name: 'Scaffolding & Access', href: '/services/scaffolding' },
      ],
    },
    { name: 'Projects', href: '/projects' },
    { name: 'Safety & Quality', href: '/safety-quality' },
    { name: 'Sustainability', href: '/sustainability' },
    { name: 'Careers', href: '/careers' },
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
      <div className="bg-navy-950 text-steel-300 text-xs py-2 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-safety-red" />
              <span className="font-semibold text-white">Zero-Harm Safety Commitment</span>
            </span>
            <span className="hidden sm:inline-block text-steel-400">
              Safety · Quality · Field-tested delivery
            </span>
          </div>
          <div className="flex items-center space-x-5">
            <a
              href="tel:+919764425426"
              className="hover:text-gold transition-colors flex items-center space-x-1"
            >
              <Phone className="w-3 h-3 text-gold" />
              <span>+91 9764 425 426</span>
            </a>
            <a
              href="mailto:info@arsexim.com"
              className="hover:text-gold transition-colors hidden md:flex items-center space-x-1"
            >
              <Mail className="w-3 h-3 text-gold" />
              <span>info@arsexim.com</span>
            </a>
            <Link
              href="/admin/login"
              className="text-steel-400 hover:text-white transition-colors text-[11px] uppercase tracking-wider"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-200 bg-navy-900 text-white border-b border-navy-800',
          scrolled ? 'shadow-industrial-lg py-2.5' : 'py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gold rounded flex items-center justify-center font-black text-navy-950 text-xl tracking-tighter shadow-sm group-hover:bg-gold-600 transition-colors">
              ARS
            </div>
            <div>
              <span className="block font-black text-xl tracking-wider text-white leading-none font-display">
                ARS EXIM
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-steel-300 font-semibold mt-0.5">
                Specialist Industrial Contractor
              </span>
            </div>
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
                        'flex items-center space-x-1 text-sm font-semibold tracking-wide transition-colors py-2 focus:outline-none focus:text-gold',
                        isActive ? 'text-gold' : 'text-steel-200 hover:text-gold'
                      )}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className="w-4 h-4 text-steel-400 group-hover:text-gold transition-transform group-hover:rotate-180" />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 w-64 pt-2 hidden group-hover:block transition-all">
                      <div className="bg-navy-950 border border-navy-700 rounded shadow-industrial-lg py-2">
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={cn(
                              'block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                              pathname === sub.href
                                ? 'bg-navy-800 text-gold font-bold'
                                : 'text-steel-200 hover:bg-navy-800 hover:text-white'
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
                      ? 'text-gold'
                      : 'text-steel-200 hover:text-gold'
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
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
              className="p-2 text-steel-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-gold rounded"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-navy-950 border-t border-navy-800 px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => {
              if (link.subLinks) {
                return (
                  <div key={link.name} className="py-2 border-b border-navy-800">
                    <span className="block text-xs font-bold uppercase tracking-wider text-steel-400 mb-2">
                      {link.name}
                    </span>
                    <div className="pl-3 space-y-1.5">
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="block text-sm font-semibold text-steel-200 hover:text-gold py-1"
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
                  className="block text-base font-semibold text-steel-100 hover:text-gold py-2 border-b border-navy-800"
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
