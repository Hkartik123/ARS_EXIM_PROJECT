import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://arsexim.com'),
  title: {
    default: 'ARS EXIM | Specialist Industrial Contractor — Insulation, PFP & Scaffolding',
    template: '%s | ARS EXIM',
  },
  description:
    'Authoritative industrial contractor providing high-specification Industrial Thermal & Cryogenic Insulation, Passive Fire Protection (PFP), and Scaffolding & Access Management for global process infrastructure.',
  keywords: [
    'industrial insulation contractor',
    'passive fire protection',
    'PFP contractor',
    'system scaffolding',
    'access management',
    'cryogenic insulation',
    'thermal insulation',
    'plant turnaround',
  ],
  authors: [{ name: 'ARS EXIM Engineering' }],
  creator: 'ARS EXIM',
  publisher: 'ARS EXIM',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/ars-exim-logo-transparent.png',
    shortcut: '/ars-exim-logo-transparent.png',
    apple: '/ars-exim-logo-transparent.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://arsexim.com',
    siteName: 'ARS EXIM',
    title: 'ARS EXIM | Specialist Industrial Contractor',
    description:
      'Engineered industrial solutions across Industrial Insulation, Passive Fire Protection, and Scaffolding.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'ARS EXIM Industrial Contracting Operations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARS EXIM | Specialist Industrial Contractor',
    description: 'Engineering excellence in Industrial Insulation, PFP, and Scaffolding.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans text-navy-950 bg-white">
        {children}
      </body>
    </html>
  );
}
