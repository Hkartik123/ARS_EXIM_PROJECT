import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919764425426"
      target="_blank"
      rel="noreferrer"
      aria-label="Contact ARS EXIM on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f8f5f] text-white shadow-lg transition-colors hover:bg-[#19784f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f8f5f]"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </a>
  );
}