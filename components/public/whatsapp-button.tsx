import Link from 'next/link';
import { ArrowRight, MessageCircle, Quote } from 'lucide-react';

export function WhatsAppButton() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <Link
        href="/request-a-quote"
        aria-label="Get a project quote"
        className="inline-flex h-11 w-11 items-center justify-center gap-2 rounded-full bg-gold text-xs font-bold uppercase tracking-wider text-navy-950 shadow-lg transition-transform hover:-translate-y-0.5 sm:w-auto sm:px-4"
      >
        <Quote className="h-4 w-4 sm:hidden" aria-hidden="true" />
        <span className="hidden sm:inline">Get a Quote</span>
        <ArrowRight className="hidden h-4 w-4 sm:block" aria-hidden="true" />
      </Link>
      <a
        href="https://wa.me/919764425426"
        target="_blank"
        rel="noreferrer"
        aria-label="Contact ARS EXIM on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1f8f5f] text-white shadow-lg transition-colors hover:bg-[#19784f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f8f5f]"
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </a>
    </div>
  );
}