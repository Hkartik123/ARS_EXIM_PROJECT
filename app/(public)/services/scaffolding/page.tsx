import React from 'react';
import { ServiceDetailView } from '@/components/public/service-detail-view';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Engineered Industrial Scaffolding & Turnaround Access',
  description:
    'Modular Ringlock/Cuplok system scaffolding, 3D structural load calculation, and Scafftag management by ARS EXIM.',
};

export default function ScaffoldingPage() {
  return <ServiceDetailView slug="scaffolding" />;
}
