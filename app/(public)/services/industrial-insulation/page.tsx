import React from 'react';
import { ServiceScopeView } from '@/components/public/service-scope-view';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Industrial Thermal & Cryogenic Insulation Services',
  description:
    'Discuss project-specific industrial insulation scope for process piping, equipment, vessels and temperature-controlled services.',
};

export default function IndustrialInsulationPage() {
  return <ServiceScopeView slug="industrial-insulation" />;
}
