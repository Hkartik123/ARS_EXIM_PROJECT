import { ServiceScopeView } from '@/components/public/service-scope-view';

export const metadata = {
  title: 'Cold & Cryogenic Insulation Services | ARS EXIM',
  description:
    'Cold and cryogenic insulation services for low-temperature assets, vapour control and process integrity.',
};

export default function ColdCryogenicInsulationPage() {
  return <ServiceScopeView slug="cold-cryogenic-insulation" />;
}
