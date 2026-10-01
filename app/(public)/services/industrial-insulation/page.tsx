import React from 'react';
import { ServiceDetailView } from '@/components/public/service-detail-view';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Industrial Thermal & Cryogenic Insulation Services',
  description:
    'Engineering specification for high-temperature piping insulation, cold/cryogenic insulation, and CUI prevention by ARS EXIM.',
};

export default function IndustrialInsulationPage() {
  return <ServiceDetailView slug="industrial-insulation" />;
}
