import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { ContactForm } from '@/components/public/contact-form';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Contact Corporate Headquarters & Operations Hub',
  description:
    'Get in touch with ARS EXIM engineering and estimating teams for industrial inquiries, vendor registration, and technical support.',
};

export default function ContactPage() {
  return (
    <div className="py-12 bg-steel-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        <div className="max-w-3xl my-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-2">
            Direct Communications
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight font-display mb-4">
            Connect with ARS EXIM Engineering
          </h1>
          <p className="text-base text-steel-600 leading-relaxed">
            Have a technical query, plant maintenance requirement, or need to schedule an on-site
            facility inspection? Reach out to our operational team directly or submit the inquiry form below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-10 items-start">
          {/* Coordinates Sidebar */}
          <div className="space-y-6">
            <div className="bg-navy-950 text-white rounded p-8 shadow-industrial space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-navy-800 pb-3">
                Corporate Headquarters
              </h2>

              <div className="flex items-start space-x-3 text-sm text-steel-300">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span>
                  Global project coordination and registered-office support available by inquiry<br />
                  Response is coordinated through the ARS EXIM operations team.
                </span>
              </div>

              <div className="flex items-center space-x-3 text-sm text-steel-300">
                <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                <a href="tel:+919764425426" className="hover:text-gold transition-colors font-medium">
                  +91 9764 425 426
                </a>
              </div>

              <div className="flex items-center space-x-3 text-sm text-steel-300">
                <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                <a href="mailto:info@arsexim.com" className="hover:text-gold transition-colors font-medium">
                  info@arsexim.com
                </a>
              </div>

              <div className="flex items-start space-x-3 text-sm text-steel-300 pt-2 border-t border-navy-800">
                <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span>
                  Monday – Friday: 08:00 – 18:00 (GST)<br />
                  Emergency Shutdown Mobilization: 24/7
                </span>
              </div>
            </div>

            <div className="bg-white border border-steel-200 rounded p-6">
              <div className="flex items-center space-x-3 mb-2">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <h3 className="font-bold text-navy-900 text-sm">Vendor Pre-Qualification</h3>
              </div>
              <p className="text-xs text-steel-600 leading-relaxed">
                To register ARS EXIM in your approved vendor list (AVL), please email our commercial proposals desk at{' '}
                <a href="mailto:info@arsexim.com" className="text-navy-900 font-bold underline">
                  info@arsexim.com
                </a>.
              </p>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
