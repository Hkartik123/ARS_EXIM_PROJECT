import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MessageCircle, ShieldCheck, ArrowRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#edf5ff] text-navy-900 pt-16 pb-12 border-t-4 border-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <div className="mb-4">
              <Image
                src="/ars-exim-logo-transparent.png"
                alt="ARS EXIM Global Solutions logo"
                width={144}
                height={144}
                className="h-[112px] w-[112px] sm:h-[132px] sm:w-[132px] object-contain"
              />
            </div>
            <p className="text-sm text-navy-700 leading-relaxed mb-6">
              Industrial insulation, passive fire protection and scaffolding services for project enquiries.
            </p>
            <div className="flex items-center space-x-2 text-xs font-semibold text-navy-900 bg-white border border-[#dfeaf7] p-2.5 rounded">
              <ShieldCheck className="w-4 h-4 text-navy-900 flex-shrink-0" />
              <span>Scope aligned to project requirements</span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-navy-900 mb-5">
              Industrial Services
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/services/hot-insulation"
                  className="hover:text-gold transition-colors flex items-center group"
                >
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-steel-500 group-hover:text-gold transition-colors" />
                  Hot Insulation
                </Link>
              </li>
              <li>
                <Link
                  href="/services/cold-cryogenic-insulation"
                  className="hover:text-gold transition-colors flex items-center group"
                >
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-steel-500 group-hover:text-gold transition-colors" />
                  Cold / Cryogenic Insulation
                </Link>
              </li>
              <li>
                <Link
                  href="/services/passive-fire-protection"
                  className="hover:text-gold transition-colors flex items-center group"
                >
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-steel-500 group-hover:text-gold transition-colors" />
                  Passive Fire Protection
                </Link>
              </li>
              <li>
                <Link
                  href="/services/scaffolding"
                  className="hover:text-gold transition-colors flex items-center group"
                >
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-steel-500 group-hover:text-gold transition-colors" />
                  Scaffolding & Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-navy-900 mb-5">
              Company & Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  About ARS EXIM
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/industries" className="hover:text-gold transition-colors">
                  Industries
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-gold transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Coordinates */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-navy-900 mb-5">
              Project Enquiries
            </h3>
            <div className="space-y-4 text-sm text-navy-700">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-navy-900 flex-shrink-0" />
                <a href="tel:+919764425426" className="hover:text-navy-900 transition-colors">
                  +91 9764 425 426
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-navy-900 flex-shrink-0" />
                <a href="mailto:info@arsexim.com" className="hover:text-navy-900 transition-colors">
                  info@arsexim.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-4 h-4 text-[#177d53] flex-shrink-0" />
                <a href="https://wa.me/919764425426" target="_blank" rel="noreferrer" className="font-semibold text-[#177d53] hover:text-[#105d3e] transition-colors">
                  WhatsApp project enquiries
                </a>
              </div>
              <div className="pt-2">
                <Link
                  href="/request-a-quote"
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-navy-900 hover:underline"
                >
                  Submit Project Specifications &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#cfe0f7] text-xs text-navy-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© {currentYear} ARS EXIM. All rights reserved. Engineering & Specialist Contracting.</p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="hover:text-navy-900 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-navy-900 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
