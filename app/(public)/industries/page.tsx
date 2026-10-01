import Link from 'next/link';
import { ArrowRight, Factory, Gauge, Landmark, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { Button } from '@/components/ui/button';

const industries = [
  {
    title: 'Oil & Gas',
    description: 'Upstream and downstream assets requiring insulation, access and fire protection support in demanding environments.',
    icon: Gauge,
  },
  {
    title: 'Petrochemical',
    description: 'Process plant services aligned with production reliability, maintenance windows and thermal performance requirements.',
    icon: Factory,
  },
  {
    title: 'Refineries',
    description: 'Turnaround support, maintenance access and asset protection across complex refinery infrastructure.',
    icon: Wrench,
  },
  {
    title: 'Energy & Power',
    description: 'Thermal and structural support solutions for power generation and process utility environments.',
    icon: Landmark,
  },
  {
    title: 'Industrial Plants',
    description: 'Specialist service execution for plant expansions, upgrades and routine maintenance programmes.',
    icon: ShieldCheck,
  },
  {
    title: 'Process Industries',
    description: 'Industrial systems where temperature control, access planning and asset protection remain mission-critical.',
    icon: Truck,
  },
];

export const metadata = {
  title: 'Industries We Serve | ARS EXIM',
  description:
    'Industrial sectors served by ARS EXIM: oil & gas, petrochemical, refineries, energy, industrial plants and process environments.',
};

export default function IndustriesPage() {
  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Industries' }]} />

        <header className="my-8 max-w-3xl">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-gold-700">Sector expertise</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-navy-950 sm:text-6xl">
            Industries we support.
          </h1>
          <p className="mt-4 text-base leading-7 text-steel-700 sm:text-lg">
            ARS EXIM works with industrial clients and project teams requiring specialist insulation, passive fire protection and scaffolding solutions in high-risk, operationally demanding environments.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {industries.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded border border-steel-200 bg-steel-50 p-6 shadow-sm transition hover:-translate-y-1 hover:border-gold-500 hover:shadow-md">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded bg-navy-950 text-gold">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-bold text-navy-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-steel-700">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 rounded bg-[#10233f] p-7 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Need a project-specific review?</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/75">
              Share the project region, service type and work requirement to begin a technical discussion.
            </p>
          </div>
          <Link href="/request-a-quote">
            <Button variant="primary" size="lg">
              Request a Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
