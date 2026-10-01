import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { QuoteForm } from '@/components/public/quote-form';
import { ShieldCheck, FileSpreadsheet, Clock, Lock } from 'lucide-react';

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
            Our industrial estimating team reviews your scope and issues a formal commercial proposal
            within 1 business day.
          </p>
        </div>

        {/* Security & Confidentiality Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-steel-200 rounded p-4 flex items-center space-x-3">
            <Lock className="w-5 h-5 text-gold flex-shrink-0" />
            <span className="text-xs font-semibold text-navy-900">Protected Under Strict Commercial NDA</span>
          </div>
          <div className="bg-white border border-steel-200 rounded p-4 flex items-center space-x-3">
            <FileSpreadsheet className="w-5 h-5 text-gold flex-shrink-0" />
            <span className="text-xs font-semibold text-navy-900">Direct BoQ & Drawing Ingestion</span>
          </div>
          <div className="bg-white border border-steel-200 rounded p-4 flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gold flex-shrink-0" />
            <span className="text-xs font-semibold text-navy-900">1 Business Day Estimating Response</span>
          </div>
        </div>

        {/* Main Quotation Wizard Form */}
        <QuoteForm />
      </div>
    </div>
  );
}
