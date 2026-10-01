import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-steel-50 py-16 px-4">
      <div className="max-w-md w-full bg-white border border-steel-200 rounded p-8 text-center shadow-industrial">
        <div className="w-12 h-12 bg-navy-900 text-gold rounded flex items-center justify-center mx-auto mb-4 font-black text-lg">
          404
        </div>
        <h1 className="text-2xl font-black text-navy-900 font-display mb-2">
          Page Not Located
        </h1>
        <p className="text-xs text-steel-600 mb-6 leading-relaxed">
          The requested engineering dossier, service route, or page coordinate does not exist or has been relocated.
        </p>
        <div className="space-y-3">
          <Link href="/" className="block">
            <Button variant="primary" size="md" className="w-full">
              Return to Homepage
            </Button>
          </Link>
          <Link href="/services" className="block">
            <Button variant="outline" size="md" className="w-full">
              Explore Services Matrix
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
