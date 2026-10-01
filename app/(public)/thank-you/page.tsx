import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, FileCheck, Phone, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageProps {
  searchParams: { ref?: string };
}

export const metadata = {
  title: 'Inquiry Confirmation & Reference Number',
  description: 'Your inquiry has been successfully received by ARS EXIM Engineering.',
};

export default function ThankYouPage({ searchParams }: PageProps) {
  const referenceNumber = searchParams.ref || 'QR-PENDING';

  return (
    <div className="py-20 bg-steel-50 min-h-[75vh] flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-6">
        <div className="bg-white border border-steel-200 rounded p-8 sm:p-12 shadow-industrial text-center">
          <div className="w-16 h-16 bg-success-light text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-3xl font-black text-navy-900 font-display mb-2">
            Inquiry Registered Successfully
          </h1>

          <p className="text-sm text-steel-600 mb-6">
            Your project technical specifications have been committed to our engineering proposal pipeline.
          </p>

          {/* Reference Badge */}
          <div className="bg-navy-950 text-white rounded p-5 my-6 border-l-4 border-gold">
            <span className="text-xs uppercase tracking-widest text-gold block mb-1 font-semibold">
              Official Tracking Reference Number
            </span>
            <div className="text-2xl sm:text-3xl font-black font-display tracking-wider text-white">
              {referenceNumber}
            </div>
            <p className="text-xs text-steel-400 mt-1">
              Please quote this reference number in all subsequent technical correspondence.
            </p>
          </div>

          {/* Next Steps */}
          <div className="text-left bg-steel-50 p-6 rounded border border-steel-200 text-xs sm:text-sm text-steel-700 space-y-3 mb-8">
            <h3 className="font-bold text-navy-900 text-sm">Next Steps in Estimating Review:</h3>
            <p>
              1. <strong>Scope Validation:</strong> Our senior estimator reviews your Bill of Quantities (BoQ) and drawings.
            </p>
            <p>
              2. <strong>Technical Proposal:</strong> A formal commercial tender dossier will be emailed to your contact address within 1 business day.
            </p>
            <p>
              3. <strong>Immediate Mobilization:</strong> If this inquiry relates to an urgent shutdown or emergency plant maintenance, contact our operations desk at <strong className="text-navy-900">+91 9764 425 426</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button variant="secondary" size="md">
                Return to Homepage
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" size="md">
                Explore Case Studies
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
