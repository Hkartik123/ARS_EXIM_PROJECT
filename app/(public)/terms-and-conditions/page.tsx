import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';

export const metadata = {
  title: 'Terms & Conditions of Technical Engagement',
  description: 'ARS EXIM corporate terms and conditions of website use and technical project engagement.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />

        <div className="my-8">
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 font-display mb-4">
            Terms & Conditions of Website Use
          </h1>
          <p className="text-xs text-steel-500 font-semibold uppercase tracking-wider mb-8">
            Last Updated: January 2026 | ARS EXIM
          </p>

          <div className="prose prose-sm max-w-none text-steel-700 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-navy-900">1. Intellectual Property & Technical Specifications</h2>
              <p>
                All technical descriptions, methodology diagrams, case study dossiers, and engineering
                specifications on arsexim.com are the proprietary intellectual property of ARS EXIM.
                Reproduction or distribution without prior written consent is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-900">2. Estimating & Quotation Submissions</h2>
              <p>
                Submission of technical data via the Request a Quote system constitutes an invitation
                to treat and does not create a binding construction contract until a formal commercial
                agreement is bilaterally signed by authorized corporate officers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-900">3. Safety Standards & Governing Law</h2>
              <p>
                All contracting engagements conform strictly to local safety authority requirements,
                client facility rules, and international engineering standards. These terms are governed
                by the laws of the United Arab Emirates.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
