import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { ShieldAlert, Award, CheckCircle2, Building, Target, Compass } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Corporate Profile & Engineering Heritage',
  description:
    'Learn about ARS EXIM, a premier specialist industrial contractor delivering high-specification Industrial Insulation, Passive Fire Protection, and Scaffolding.',
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
              certified materials, and an institutionalized zero-harm safety culture.
            </p>
          </div>

          <div className="p-8 border border-steel-200 rounded bg-steel-50">
            <Compass className="w-8 h-8 text-navy-900 mb-4" />
            <h3 className="text-xl font-bold text-navy-900 mb-2">Engineering Vision</h3>
            <p className="text-sm text-steel-600 leading-relaxed">
              To be the trusted specialist contractor of choice for major international EPCs and
              plant operators navigating complex turnarounds and infrastructure expansions.
            </p>
          </div>

          <div className="p-8 border border-steel-200 rounded bg-steel-50">
            <ShieldAlert className="w-8 h-8 text-safety-red mb-4" />
            <h3 className="text-xl font-bold text-navy-900 mb-2">Zero-Harm Commitment</h3>
            <p className="text-sm text-steel-600 leading-relaxed">
              Prioritizing the physical well-being of every operative and engineer on site.
              No commercial deadline takes precedence over human safety and procedural rigor.
            </p>
          </div>
        </div>

        {/* Technical Heritage Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-16 py-12 border-y border-steel-200">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight font-display mb-5">
              Built on Technical Capability & Strict Standards Compliance
            </h2>
            <div className="space-y-4 text-sm text-steel-700 leading-relaxed">
              <p>
                From cryogenic LNG containment terminals operating at -196°C to high-temperature superheated
                steam manifolds exceeding 650°C, ARS EXIM mobilizes certified engineers, precision equipment,
                and seasoned field supervision.
              </p>
              <p>
                We maintain full traceability across every installation milestone. Our quality management
                regime integrates comprehensive Inspection & Test Plans (ITPs), non-destructive dry film thickness
                (DFT) testing, and strict environmental ambient logging (dew point, relative humidity, substrate temperature).
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 text-xs font-semibold text-navy-900 bg-steel-100 px-3 py-2 rounded">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>ISO 45001:2018 Certified</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-navy-900 bg-steel-100 px-3 py-2 rounded">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>ISO 9001:2015 Certified</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-navy-900 bg-steel-100 px-3 py-2 rounded">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                <span>ISO 14001:2015 Certified</span>
              </div>
            </div>
          </div>

          <div className="bg-navy-950 p-8 rounded text-white shadow-industrial">
            <h3 className="text-lg font-bold text-white mb-6 border-b border-navy-800 pb-3">
              ARS EXIM Operational Scope
            </h3>
            <ul className="space-y-4 text-sm text-steel-300">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                <span><strong>Turnaround & Shutdown Execution:</strong> Rapid mobilization of multi-disciplinary teams under tight turnaround windows.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                <span><strong>Capital Projects & Greenfields:</strong> High-volume insulation and structural fireproofing on new process units.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                <span><strong>Routine Maintenance Contracting:</strong> Long-term framework contracts for ongoing asset integrity and CUI prevention.</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-navy-800">
              <Link href="/request-a-quote">
                <Button variant="primary" size="md" className="w-full">
                  Engage ARS EXIM for Your Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
