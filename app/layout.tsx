import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://arsexim.com'),
  title: {
    default: 'ARS EXIM | EXpert Insulation Management',
    template: '%s | ARS EXIM',
  },
  description:
    'ARS EXIM delivers EXpert Insulation Management with industrial insulation, coating and painting, passive fire protection, scaffolding and skilled manpower services for project infrastructure.',
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
    title: 'ARS EXIM | EXpert Insulation Management',
    description:
      'Industrial insulation, coating and painting, passive fire protection, scaffolding and skilled manpower delivered under EXpert Insulation Management.',
    images: [
      {
        url: '/ars-exim-social.png',
        width: 1200,
        height: 630,
        alt: 'ARS EXIM EXpert Insulation Management industrial services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARS EXIM | EXpert Insulation Management',
    description: 'Industrial insulation, coating and painting, passive fire protection, scaffolding and skilled manpower delivered by ARS EXIM.',
    images: ['/ars-exim-social.png'],
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
