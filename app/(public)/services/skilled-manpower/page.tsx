import { ServiceScopeView } from '@/components/public/service-scope-view';

export const metadata = {
  title: 'Skilled Manpower Services | ARS EXIM',
  description:
    'Skilled manpower support for industrial insulation, coating, painting, scaffolding and related project requirements.',
};

export default function SkilledManpowerPage() {
  return <ServiceScopeView slug="skilled-manpower" />;
}
