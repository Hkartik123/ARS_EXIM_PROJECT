import React from 'react';
import { ServiceDetailView } from '@/components/public/service-detail-view';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Passive Fire Protection (PFP) & Intumescent Coatings',
  description:
    'Certified structural steel fireproofing, hydrocarbon pool/jet fire protection, and dense cementitious coatings by ARS EXIM.',
};

export default function PassiveFireProtectionPage() {
  return <ServiceDetailView slug="passive-fire-protection" />;
}
