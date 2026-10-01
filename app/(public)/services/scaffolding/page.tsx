import React from 'react';
import { ServiceScopeView } from '@/components/public/service-scope-view';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Engineered Industrial Scaffolding & Turnaround Access',
  description:
    'Discuss project-specific industrial scaffolding and temporary access requirements with ARS EXIM.',
};

export default function ScaffoldingPage() {
  return <ServiceScopeView slug="scaffolding" />;
}
