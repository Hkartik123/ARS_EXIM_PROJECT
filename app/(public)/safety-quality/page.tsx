import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { ShieldAlert, FileCheck, AlertOctagon, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Health, Safety & Environment (HSE) & Quality Assurance (QA/QC)',
  description:
    'Discuss project-specific health, safety, quality and inspection requirements for industrial insulation, passive fire protection and scaffolding scopes.',
};

export default function SafetyQualityPage() {
  const qualityPillars = [
    {
      title: 'Inspection & Test Plans (ITP)',
      description:
        'Identify the client inspection plan, hold and witness points, records, and approval responsibilities required for the specific work package.',
      icon: FileCheck,
    },
    {
      title: 'Stop Work Authority (SWA)',
      description:
        'Confirm stop-work expectations, escalation routes and site-specific controls with the client before work is planned.',
      icon: AlertOctagon,
    },
    {
      title: 'Daily Dynamic Risk Assessments (JSA)',
      description:
        'Review task risk assessments, permits, access restrictions and interfaces with live operations against the site requirements.',
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
            <span>Project-specific safety and quality</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight font-display mb-4">
            Safety Leadership & Quality Assurance
          </h1>
          <p className="text-base sm:text-lg text-steel-600 leading-relaxed">
            Safety, quality and inspection requirements vary by site, client and scope. They should be
            agreed from the project documents and applicable site rules before work begins.
          </p>
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

        {/* Project documentation */}
        <div className="my-16 py-12 border-t border-steel-200">
          <h2 className="text-2xl font-bold text-navy-900 font-display mb-8">
            Aligning project documentation
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-steel-700">
            Tender and work-pack discussions may include the client’s specifications, approved product
            systems, method statements, inspection and test plans, competency requirements, permits,
            risk controls and handover records. No certificate, safety statistic or standard is claimed
            here; applicability should be confirmed for each enquiry.
          </p>
        </div>

        {/* CTA Strip */}
        <div className="mt-12 p-8 bg-steel-100 rounded flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-navy-900">Have project HSE or QA/QC requirements?</h3>
            <p className="text-xs text-steel-600">Share the tender requirements so the requested scope and documentation can be discussed.</p>
          </div>
          <Link href="/contact">
            <Button variant="secondary" size="md">
              Discuss Project Requirements
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
