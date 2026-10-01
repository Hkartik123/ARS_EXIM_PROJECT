import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { ShieldAlert, CheckCircle2, Award, FileCheck, AlertOctagon, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Health, Safety & Environment (HSE) & Quality Assurance (QA/QC)',
  description:
    'ARS EXIM zero-harm safety charter, ISO 45001:2018 occupational safety protocols, and ISO 9001:2015 quality assurance management.',
};

export default function SafetyQualityPage() {
  const qualityPillars = [
    {
      title: 'Inspection & Test Plans (ITP)',
      description:
        'Every project operates under a customized, client-approved ITP with documented Hold, Witness, and Review inspection milestones.',
      icon: FileCheck,
    },
    {
      title: 'Stop Work Authority (SWA)',
      description:
        'Every employee and contractor on site holds the absolute authority and obligation to suspend work without penalty upon observing any unsafe condition.',
      icon: AlertOctagon,
    },
    {
      title: 'Daily Dynamic Risk Assessments (JSA)',
      description:
        'Mandatory shift-starter Job Safety Analysis covering confined space entry, hot work permits, and working at height.',
      icon: HeartHandshake,
    },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Safety & Quality' }]} />

        {/* Section Header */}
        <div className="max-w-3xl my-8">
          <div className="inline-flex items-center space-x-2 bg-safety-light border border-safety-red/40 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-safety-red mb-3">
            <ShieldAlert className="w-4 h-4 text-safety-red" />
            <span>Zero-Harm Safety Governance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight font-display mb-4">
            Safety Leadership & Quality Assurance
          </h1>
          <p className="text-base sm:text-lg text-steel-600 leading-relaxed">
            Operating in high-hazard live refineries, offshore platforms, and petrochemical facilities
            requires an uncompromising safety philosophy. Safety is not a procedural checkbox at ARS EXIM;
            it is our core operational foundation.
          </p>
        </div>

        {/* Key Metrics Banner */}
        <div className="bg-navy-950 text-white rounded p-8 sm:p-10 my-12 border-l-4 border-gold shadow-industrial">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-gold font-display">2,500,000+</div>
              <div className="text-xs uppercase tracking-wider text-steel-300 font-semibold mt-1">
                Safe Man-Hours Executed
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-gold font-display">1,800+</div>
              <div className="text-xs uppercase tracking-wider text-steel-300 font-semibold mt-1">
                LTI-Free Operational Days
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-gold font-display">100%</div>
              <div className="text-xs uppercase tracking-wider text-steel-300 font-semibold mt-1">
                Hold-Point Verification Signoff
              </div>
            </div>
          </div>
        </div>

        {/* HSE Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          {qualityPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="p-8 border border-steel-200 rounded bg-steel-50">
                <Icon className="w-8 h-8 text-safety-red mb-4" />
                <h3 className="text-lg font-bold text-navy-900 mb-2">{p.title}</h3>
                <p className="text-xs sm:text-sm text-steel-600 leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>

        {/* Certified Standards Section */}
        <div className="my-16 py-12 border-t border-steel-200">
          <h2 className="text-2xl font-bold text-navy-900 font-display mb-8">
            Accredited International Management Standards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-steel-200 rounded bg-white shadow-sm">
              <span className="text-xs font-bold text-gold-700 uppercase tracking-wider block mb-1">
                Occupational Health & Safety
              </span>
              <h3 className="text-xl font-bold text-navy-900 mb-2">ISO 45001:2018</h3>
              <p className="text-xs text-steel-600 leading-relaxed">
                Comprehensive occupational safety management framework mitigating operational risk and
                preventing workplace injuries across extreme industrial environments.
              </p>
            </div>

            <div className="p-6 border border-steel-200 rounded bg-white shadow-sm">
              <span className="text-xs font-bold text-gold-700 uppercase tracking-wider block mb-1">
                Quality Management System
              </span>
              <h3 className="text-xl font-bold text-navy-900 mb-2">ISO 9001:2015</h3>
              <p className="text-xs text-steel-600 leading-relaxed">
                Institutionalized quality control ensuring consistent material batch compliance,
                verified calibration, and traceable documentation across all installation phases.
              </p>
            </div>

            <div className="p-6 border border-steel-200 rounded bg-white shadow-sm">
              <span className="text-xs font-bold text-gold-700 uppercase tracking-wider block mb-1">
                Environmental Governance
              </span>
              <h3 className="text-xl font-bold text-navy-900 mb-2">ISO 14001:2015</h3>
              <p className="text-xs text-steel-600 leading-relaxed">
                Systematic environmental stewardship minimizing waste generation, volatile organic
                compound emissions, and carbon footprint during field operations.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="mt-12 p-8 bg-steel-100 rounded flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-navy-900">Require HSE Dossier or Quality Plans for an Upcoming Tender?</h3>
            <p className="text-xs text-steel-600">Our compliance officers provide verified safety documentation for pre-qualification.</p>
          </div>
          <Link href="/contact">
            <Button variant="secondary" size="md">
              Request HSE Pre-Qualification Pack
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
