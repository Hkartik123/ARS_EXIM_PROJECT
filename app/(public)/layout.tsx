import React from 'react';
import { Header } from '@/components/public/header';
import { Footer } from '@/components/public/footer';
import { WhatsAppButton } from '@/components/public/whatsapp-button';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
