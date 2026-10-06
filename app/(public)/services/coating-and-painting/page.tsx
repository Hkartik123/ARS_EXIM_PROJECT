import { ServiceScopeView } from '@/components/public/service-scope-view';

export const metadata = {
  title: 'Coating and Painting Services | ARS EXIM',
  description:
    'Industrial coating and painting solutions for surface protection, durability and long-term asset performance.',
};

export default function CoatingAndPaintingPage() {
  return <ServiceScopeView slug="coating-and-painting" />;
}
