import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';

export const metadata = {
  title: 'Privacy Policy & Data Protection',
  description: 'ARS EXIM corporate privacy policy, technical data handling, and confidentiality standards.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

        <div className="my-8">
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 font-display mb-4">
            Corporate Privacy Policy & Data Protection
          </h1>
          <p className="text-xs text-steel-500 font-semibold uppercase tracking-wider mb-8">
            Last Updated: January 2026 | ARS EXIM Data Governance
          </p>

          <div className="prose prose-sm max-w-none text-steel-700 space-y-6 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-navy-900">1. Commitment to Client Confidentiality</h2>
              <p>
                ARS EXIM operates as a specialist industrial contractor handling proprietary engineering
                drawings, facility P&IDs, Bills of Quantities (BoQs), and tender specifications.
                We treat all submitted technical project data with strict confidentiality under commercial NDA standards.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-900">2. Collection of Technical & Corporate Data</h2>
              <p>
                When you submit a quotation request, job application, or contact form, we collect corporate
                contact coordinates (name, email, phone, organization, country) and project scope parameters.
                We do not sell, rent, or monetize client data under any circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-900">3. Technical Document Security & Storage</h2>
              <p>
                Uploaded engineering documents are stored in encrypted, access-restricted cloud object storage.
                Access is limited exclusively to accredited estimating and technical engineering personnel
                evaluating the scope of work.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-900">4. Contact Data Governance Officer</h2>
              <p>
                For data access requests, deletion of technical tenders, or privacy queries, contact our
                compliance officer at <a href="mailto:privacy@arsexim.com" className="text-navy-900 font-bold underline">privacy@arsexim.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
