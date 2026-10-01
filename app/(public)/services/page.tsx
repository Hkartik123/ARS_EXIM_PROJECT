import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Layers, Flame, Building, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Specialist Industrial Contracting Services Matrix',
  description:
    'Overview of ARS EXIM core industrial capabilities: Industrial Insulation, Passive Fire Protection (PFP), and Scaffolding & Access Management.',
};

export default function ServicesPage() {
  const serviceMatrix = [
    {
      slug: 'industrial-insulation',
      title: 'Industrial Insulation',
      tagline: 'Thermal Energy Conservation, Cold/Cryogenic Containment & Acoustic Attenuation',
      icon: Layers,
      description:
        'Engineered insulation solutions for high-temperature process piping, boilers, pressure vessels, and cryogenic liquid storage facilities designed to prevent Corrosion Under Insulation (CUI).',
      applications: [
        'High-pressure steam and condensate manifolds',
        'Ethylene and LNG cryogenic tanks down to -196°C',
        'Rotating equipment acoustic enclosures',
      ],
      standards: ['ASTM C533', 'ASTM C612', 'BS 5970', 'CINI Standards'],
    },
    {
      slug: 'passive-fire-protection',
      title: 'Passive Fire Protection (PFP)',
      tagline: 'Hydrocarbon Fire Barriers & Structural Steel Fireproofing',
      icon: Flame,
      description:
        'Certified plural-component epoxy intumescent coatings and dense cementitious fireproofing safeguarding critical structural steel columns, pipe racks, and pressure vessels against hydrocarbon pool and jet fires.',
      applications: [
        'Main process pipe racks and transfer corridors',
        'Vessel skirts and spherical tank support legs',
        'Offshore topside module blast/fire partitions',
      ],
      standards: ['UL 1709', 'BS 476 Part 20/21', 'API 2218', 'ISO 22899-1'],
    },
    {
      slug: 'scaffolding',
      title: 'Scaffolding & Access Management',
      tagline: 'Engineered Modular Scaffolding, Suspended Access & Turnaround Rigging',
      icon: Building,
      description:
        'Certified modular Ringlock and Cuplok system scaffolding with 3D structural engineering, load calculations, and Scafftag inspection management for complex shutdown turnarounds.',
      applications: [
        'Process column & flare stack maintenance access',
        'Spherical storage tank 360-degree perimeter scaffolds',
        'Suspended marine jetty access platforms',
      ],
      standards: ['BS EN 12811', 'TG20:21', 'OSHA 1926.451'],
    },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Services' }]} />

        <div className="max-w-3xl my-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-2">
            Engineering Capabilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight font-display mb-6">
            Industrial Contracting Capabilities Matrix
          </h1>
          <p className="text-base sm:text-lg text-steel-600 leading-relaxed">
            ARS EXIM brings specialized contracting disciplines under one unified engineering framework.
            Explore our three core capability sectors below.
          </p>
        </div>

        {/* Detailed Service Capability Cards */}
        <div className="space-y-12 my-12">
          {serviceMatrix.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.slug}
                className="bg-steel-50 border border-steel-200 rounded p-8 sm:p-12 transition-all hover:border-steel-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div>
                    <div className="w-12 h-12 bg-navy-900 text-gold rounded flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-navy-900 mb-2">
                      {service.title}
                    </h2>
                    <p className="text-xs font-semibold text-gold-700 uppercase tracking-wider mb-4">
                      {service.tagline}
                    </p>
                    <p className="text-sm text-steel-600 leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <Link href={`/services/${service.slug}`}>
                      <Button variant="secondary" size="md">
                        Full Technical Specification
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  {/* Typical Applications */}
                  <div className="bg-white p-6 rounded border border-steel-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-4 pb-2 border-b border-steel-100">
                      Primary Industrial Applications
                    </h3>
                    <ul className="space-y-3 text-xs text-steel-700 font-medium">
                      {service.applications.map((app, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-gold mr-2 flex-shrink-0 mt-0.5" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Certified Standards & Codes */}
                  <div className="bg-white p-6 rounded border border-steel-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-4 pb-2 border-b border-steel-100">
                      Governing Codes & Standards
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.standards.map((std, i) => (
                        <span
                          key={i}
                          className="bg-steel-100 text-navy-900 font-semibold px-2.5 py-1 rounded text-xs"
                        >
                          {std}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/request-a-quote?service=${encodeURIComponent(service.title)}`}
                      className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-gold-700 hover:text-navy-900"
                    >
                      Request Quote for this Service &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
