import React from 'react';
import { ServiceScopeView } from '@/components/public/service-scope-view';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Passive Fire Protection (PFP) & Intumescent Coatings',
  description:
    'Discuss project-specific passive fire protection scope for structural steel and process assets with ARS EXIM.',
};

export default function PassiveFireProtectionPage() {
  return <ServiceScopeView slug="passive-fire-protection" />;
}
