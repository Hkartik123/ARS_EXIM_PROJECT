import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { Leaf, Flame, Recycle, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Sustainability & Energy Conservation',
  description:
    'Industrial energy conservation, carbon footprint reduction, and environmental stewardship by ARS EXIM.',
};

export default function SustainabilityPage() {
  const environmentalCommitments = [
    {
      title: 'Thermal Energy Conservation',
      description:
        'Engineered insulation reduces radiant heat loss by up to 94% on superheated steam and process systems, significantly slashing refinery fuel consumption and scope 1 emissions.',
      icon: Zap,
    },
    {
      title: 'Low-VOC Coating Technologies',
      description:
        'Prioritizing 100% solids epoxy intumescent coatings and water-borne cementitious formulations to minimize volatile organic compounds released into the atmosphere.',
      icon: Flame,
    },
    {
      title: 'Material Lifecycle & Circularity',
      description:
        'Dedicated scrap segregation, metal cladding recycling, and modular reusable system scaffolding that eliminates single-use timber waste.',
      icon: Recycle,
    },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Sustainability' }]} />

        <div className="max-w-3xl my-8">
          <div className="inline-flex items-center space-x-2 bg-success-light border border-success/40 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-success mb-3">
            <Leaf className="w-4 h-4 text-success" />
            <span>Environmental Responsibility</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight font-display mb-4">
            Industrial Sustainability & Energy Conservation
          </h1>
          <p className="text-base sm:text-lg text-steel-600 leading-relaxed">
            Specialist industrial contracting plays a decisive role in the global energy transition.
            Through precision thermal barrier engineering and zero-waste site protocols, ARS EXIM enables
            operators to hit measurable decarbonization targets.
          </p>
        </div>

        {/* Core Environmental Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          {environmentalCommitments.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-8 border border-steel-200 rounded bg-steel-50">
                <Icon className="w-8 h-8 text-success mb-4" />
                <h3 className="text-lg font-bold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-steel-600 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Quantifiable Impact Section */}
        <div className="bg-navy-950 text-white rounded p-8 sm:p-12 my-12 border-t-4 border-gold shadow-industrial">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold font-display text-white mb-4">
              Preventing Energy Loss Through Advanced Thermal Audits
            </h2>
            <p className="text-sm text-steel-300 leading-relaxed mb-6">
              Uninsulated or degraded piping in a mid-sized refinery leaks gigajoules of thermal energy
              every operating hour. ARS EXIM performs calibrated thermographic inspections to pinpoint
              thermal bridges, designing customized removable thermal covers and high-density mineral jackets
              that pay for themselves through fuel savings within months.
            </p>
            <Link href="/request-a-quote">
              <Button variant="primary" size="md">
                Consult on Energy Efficiency Scope
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
