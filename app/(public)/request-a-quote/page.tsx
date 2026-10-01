import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { QuoteForm } from '@/components/public/quote-form';
import { FileSpreadsheet, MessageCircle, ClipboardCheck } from 'lucide-react';

export const metadata = {
  title: 'Request an Industrial Project Quotation (RFQ)',
  description:
    'Submit technical specifications, Bill of Quantities (BoQ), and drawings for Industrial Insulation, Passive Fire Protection, and Scaffolding tenders.',
};

export default function RequestAQuotePage() {
  return (
    <div className="py-12 bg-steel-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Request a Quote' }]} />

        {/* Page Header */}
        <div className="my-8 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-2">
            Commercial Proposals & Estimating
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight font-display mb-4">
            Industrial Project Quotation Request
          </h1>
          <p className="text-base text-steel-600 leading-relaxed max-w-3xl">
            Submit your Bill of Quantities (BoQ), drawings, and technical parameters.
            The more detail you share about the location, discipline, project type and timeline, the easier it is to assess your enquiry.
          </p>
        </div>

        {/* Security & Confidentiality Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-steel-200 rounded p-4 flex items-center space-x-3">
            <FileSpreadsheet className="w-5 h-5 text-gold flex-shrink-0" />
            <span className="text-xs font-semibold text-navy-900">Attach drawings, BOQ or scope documents</span>
          </div>
          <div className="bg-white border border-steel-200 rounded p-4 flex items-center space-x-3">
            <ClipboardCheck className="w-5 h-5 text-gold flex-shrink-0" />
            <span className="text-xs font-semibold text-navy-900">Share project type and anticipated schedule</span>
          </div>
          <a href="https://wa.me/919764425426" target="_blank" rel="noreferrer" className="bg-white border border-steel-200 rounded p-4 flex items-center space-x-3 text-[#177d53] hover:border-[#177d53]">
            <MessageCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-semibold">Or start with WhatsApp</span>
          </a>
        </div>

        {/* Main Quotation Wizard Form */}
        <QuoteForm />
      </div>
    </div>
  );
}
