import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { ShieldAlert, Target, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Corporate Profile & Engineering Heritage',
  description:
    'Learn about ARS EXIM and its industrial insulation, passive fire protection, and scaffolding services.',
};

export default function AboutPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        {/* Section Header */}
        <div className="max-w-3xl my-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-2">
            Company Overview
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight font-display mb-6">
            Engineering Precision in Industrial Contracting
          </h1>
          <p className="text-base sm:text-lg text-steel-600 leading-relaxed">
            ARS EXIM is an engineering-driven industrial contractor specializing in the execution
            of mission-critical insulation, structural fireproofing, and specialized scaffolding access
            across the energy, chemical, and manufacturing sectors.
          </p>
        </div>

        {/* Heritage & Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          <div className="p-8 border border-steel-200 rounded bg-steel-50">
            <Target className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-xl font-bold text-navy-900 mb-2">Our Mission</h3>
            <p className="text-sm text-steel-600 leading-relaxed">
              To safeguard high-hazard industrial assets through uncompromising technical execution,
              project-specific work planning, agreed materials, and site safety requirements.
            </p>
          </div>

          <div className="p-8 border border-steel-200 rounded bg-steel-50">
            <Compass className="w-8 h-8 text-navy-900 mb-4" />
            <h3 className="text-xl font-bold text-navy-900 mb-2">Engineering Vision</h3>
            <p className="text-sm text-steel-600 leading-relaxed">
              To support project teams with clearly defined specialist industrial service scopes.
            </p>
          </div>

          <div className="p-8 border border-steel-200 rounded bg-steel-50">
            <ShieldAlert className="w-8 h-8 text-safety-red mb-4" />
            <h3 className="text-xl font-bold text-navy-900 mb-2">Site Safety Requirements</h3>
            <p className="text-sm text-steel-600 leading-relaxed">
              Safety plans, permits, competencies and work controls need to be aligned with the
              client, site rules and agreed scope before work begins.
            </p>
          </div>
        </div>

        {/* Technical Heritage Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-16 py-12 border-y border-steel-200">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight font-display mb-5">
              Three specialist service areas
            </h2>
            <div className="space-y-4 text-sm text-steel-700 leading-relaxed">
              <p>
                ARS EXIM focuses on industrial insulation, passive fire protection and scaffolding
                and access. The required work package depends on the asset, site conditions and
                project documentation.
              </p>
              <p>
                During an enquiry, project teams can share drawings, BOQs, specifications, location
                and schedule requirements. Materials, standards, inspection points, responsibilities
                and acceptance criteria should be confirmed against the client’s project documents.
              </p>
            </div>

          </div>

          <div className="bg-navy-950 p-8 rounded text-white shadow-industrial">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-navy-800 pb-3">
              Scope discussion can cover
            </h3>
            <ul className="space-y-4 text-sm text-steel-300">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                <span><strong>Work type:</strong> Shutdown, turnaround, new-build or maintenance scope.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                <span><strong>Work area:</strong> Equipment, piping, structures and access requirements.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                <span><strong>Project basis:</strong> Location, schedule, quantities and site-specific requirements.</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-navy-800">
              <Link href="/request-a-quote">
                <Button variant="primary" size="md" className="w-full">
                  Discuss a Project Scope <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
