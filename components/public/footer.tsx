import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-steel-300 pt-16 pb-12 border-t-4 border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 bg-gold rounded flex items-center justify-center font-black text-navy-950 text-lg">
                ARS
              </div>
              <span className="font-black text-xl tracking-wider text-white font-display">
                ARS EXIM
              </span>
            </div>
            <p className="text-sm text-steel-400 leading-relaxed mb-6">
              Specialist industrial contractor executing high-specification Industrial Insulation,
              Passive Fire Protection (PFP), and Scaffolding & Access Management for major process
              facilities and infrastructure assets globally.
            </p>
            <div className="flex items-center space-x-2 text-xs font-semibold text-white bg-navy-900 border border-navy-800 p-2.5 rounded">
              <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Safety-led industrial execution</span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gold mb-5">
              Industrial Services
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/services/industrial-insulation"
                  className="hover:text-gold transition-colors flex items-center group"
                >
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-steel-500 group-hover:text-gold transition-colors" />
                  Industrial Thermal & Cold Insulation
                </Link>
              </li>
              <li>
                <Link
                  href="/services/passive-fire-protection"
                  className="hover:text-gold transition-colors flex items-center group"
                >
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-steel-500 group-hover:text-gold transition-colors" />
                  Passive Fire Protection (PFP)
                </Link>
              </li>
              <li>
                <Link
                  href="/services/scaffolding"
                  className="hover:text-gold transition-colors flex items-center group"
                >
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-steel-500 group-hover:text-gold transition-colors" />
                  Scaffolding & Access Management
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-gold transition-colors flex items-center group text-steel-400"
                >
                  <ArrowRight className="w-3.5 h-3.5 mr-2 text-steel-500 group-hover:text-gold transition-colors" />
                  Capabilities Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gold mb-5">
              Corporate Governance
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  Corporate Profile & Heritage
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-gold transition-colors">
                  Project Technical Case Studies
                </Link>
              </li>
              <li>
                <Link href="/safety-quality" className="hover:text-gold transition-colors">
                  HSE Management & Zero-Harm
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-gold transition-colors">
                  Energy Conservation & ESG
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-gold transition-colors">
                  Career Opportunities
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Global Office Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Coordinates */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gold mb-5">
              Project Enquiries
            </h3>
            <div className="space-y-4 text-sm text-steel-300">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="tel:+919764425426" className="hover:text-gold transition-colors">
                  +91 9764 425 426
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:info@arsexim.com" className="hover:text-gold transition-colors">
                  info@arsexim.com
                </a>
              </div>
              <div className="pt-2">
                <Link
                  href="/request-a-quote"
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-gold hover:underline"
                >
                  Submit Project Specifications &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-navy-800 text-xs text-steel-400 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© {currentYear} ARS EXIM. All rights reserved. Engineering & Specialist Contracting.</p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="hover:text-steel-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-steel-200 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/admin/login" className="hover:text-gold transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
