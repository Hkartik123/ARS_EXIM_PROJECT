import { ServiceScopeView } from '@/components/public/service-scope-view';

export const metadata = {
  title: 'Hot Insulation Services | ARS EXIM',
  description:
    'Thermal insulation solutions for industrial hot process systems, energy conservation and safe operating conditions.',
};

export default function HotInsulationPage() {
  return <ServiceScopeView slug="hot-insulation" />;
}
