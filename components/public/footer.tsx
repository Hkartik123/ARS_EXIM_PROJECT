import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Mail, MessageCircle, Phone } from 'lucide-react';

const services = [
  { label: 'Hot insulation', href: '/services/hot-insulation' },
  { label: 'Cold & cryogenic insulation', href: '/services/cold-cryogenic-insulation' },
  { label: 'Passive fire protection', href: '/services/passive-fire-protection' },
  { label: 'Coating & painting', href: '/services/coating-and-painting' },
  { label: 'Skilled manpower', href: '/services/skilled-manpower' },
  { label: 'Scaffolding & access', href: '/services/scaffolding' },
];

const companyLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Industries', href: '/industries' },
  { label: 'Projects', href: '/projects' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#071D38] pb-32 pt-16 text-white sm:pb-12 sm:pt-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 border-b border-white/15 pb-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.85fr_0.75fr_1fr] lg:gap-10">
          <div>
            <Link href="/" aria-label="ARS EXIM Global Solutions home" className="inline-flex items-center gap-3">
              <span className="flex h-[66px] w-[82px] items-center justify-center rounded-sm bg-white p-2">
                <Image
                  src="/ars-exim-logo-transparent.png"
                  alt="ARS EXIM Global Solutions logo"
                  width={622}
                  height={522}
                  className="h-full w-full object-contain"
                />
              </span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.12em]">ARS EXIM</span>
                <span className="mt-1 block text-[10px] tracking-wide text-[#C4CED8]">Global Solutions</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
              Industrial insulation, passive fire protection, scaffolding, coating and painting,
              and skilled manpower services for project enquiries.
            </p>
            <p className="mt-4 text-xs font-semibold tracking-wide text-[#C4CED8]">
              EXpert Insulation Management
            </p>
          </div>

          <div>
            <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-[#C4CED8]">
              Industrial services
            </h2>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.href}>
                  <Link href={service.href} className="group inline-flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white">
                    <ArrowRight className="h-3.5 w-3.5 text-[#C4CED8] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-[#C4CED8]">
              Explore
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/75 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-[#C4CED8]">
              Project enquiries
            </h2>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="tel:+919764425426" className="inline-flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-[#C4CED8]" aria-hidden="true" />
                  +91 9764 425 426
                </a>
              </li>
              <li>
                <a href="mailto:info@arsexim.com" className="inline-flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                  <Mail className="h-4 w-4 shrink-0 text-[#C4CED8]" aria-hidden="true" />
                  info@arsexim.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/919764425426" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                  <MessageCircle className="h-4 w-4 shrink-0 text-[#C4CED8]" aria-hidden="true" />
                  WhatsApp project enquiries
                </a>
              </li>
            </ul>
            <Link
              href="/request-a-quote"
              className="mt-6 inline-flex min-h-11 items-center gap-2 border border-white/40 px-4 text-xs font-bold text-white transition-colors hover:border-white hover:bg-white hover:text-[#071D38]"
            >
              Submit project details <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} ARS EXIM Global Solutions. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="transition-colors hover:text-white">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
