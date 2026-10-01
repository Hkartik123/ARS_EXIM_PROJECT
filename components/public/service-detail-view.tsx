import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRight, ShieldCheck, Wrench, Layers } from 'lucide-react';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Service } from '@/models/Service';
import { Project } from '@/models/Project';

export async function ServiceDetailView({ slug }: { slug: string }) {
  await connectToDatabase();
  const service = await Service.findOne({ slug }).lean();

  if (!service) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-navy-900">Service Not Found</h1>
        <p className="text-steel-600 mt-2">The requested industrial service specification could not be located.</p>
        <Link href="/services" className="mt-4 inline-block text-gold font-bold">
          &larr; Return to Services Overview
        </Link>
      </div>
    );
  }

  const relatedProjects = await Project.find({
    services: slug,
    publishStatus: 'PUBLISHED',
    isDeleted: false,
  })
    .limit(2)
    .lean();

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Services', href: '/services' },
            { label: service.title },
          ]}
        />

        {/* Hero Banner */}
        <div className="bg-navy-950 text-white rounded p-8 sm:p-14 my-8 relative overflow-hidden shadow-industrial">
          <div className="max-w-3xl relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-3">
              Specialist Engineering Discipline
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-display text-white mb-4">
              {service.title}
            </h1>
            <p className="text-base sm:text-lg text-steel-300 leading-relaxed mb-8">
              {service.tagline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/request-a-quote?service=${encodeURIComponent(service.title)}`}>
                <Button variant="primary" size="md">
                  Request RFQ for {service.title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Technical Overview & Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-16">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-navy-900 font-display">
              Technical Overview & Engineering Scope
            </h2>
            <p className="text-base text-steel-700 leading-relaxed">
              {service.overview}
            </p>

            {/* Core Capabilities */}
            <h3 className="text-xl font-bold text-navy-900 pt-6">
              Engineering Capabilities & Material Systems
            </h3>
            <div className="space-y-4">
              {service.capabilities.map((cap: any, idx: number) => (
                <div key={idx} className="p-5 border border-steel-200 rounded bg-steel-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-bold text-navy-900">{cap.title}</h4>
                    {cap.standards && (
                      <div className="flex gap-1.5">
                        {cap.standards.map((s: string) => (
                          <Badge key={s} variant="steel">{s}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-steel-600">{cap.description}</p>
                </div>
              ))}
            </div>

            {/* Step-by-Step Methodology */}
            <h3 className="text-xl font-bold text-navy-900 pt-6">
              Execution Methodology & Milestone Workflow
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.methodology.map((m: any) => (
                <div key={m.stepNumber} className="p-4 border border-steel-200 rounded bg-white">
                  <div className="w-7 h-7 bg-navy-900 text-gold rounded font-bold text-xs flex items-center justify-center mb-2">
                    {m.stepNumber}
                  </div>
                  <h5 className="font-bold text-sm text-navy-900 mb-1">{m.title}</h5>
                  <p className="text-xs text-steel-600 leading-relaxed">{m.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Applications & Quality Verification */}
          <div className="space-y-8">
            <div className="bg-steel-50 border border-steel-200 rounded p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-4 pb-2 border-b border-steel-200">
                Key Industrial Applications
              </h3>
              <ul className="space-y-3 text-xs text-steel-700 font-medium">
                {service.applications.map((app: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-gold mr-2 flex-shrink-0 mt-0.5" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-navy-900 text-white rounded p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold mb-3">
                Quality Assurance & HSE
              </h3>
              <ul className="space-y-3 text-xs text-steel-300">
                {service.qualityAssurance.map((qa: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <ShieldCheck className="w-4 h-4 text-success mr-2 flex-shrink-0 mt-0.5" />
                    <span>{qa}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Technical FAQs Accordion */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="my-16 py-12 border-t border-steel-200">
            <h2 className="text-2xl font-bold text-navy-900 font-display mb-8">
              Technical Specifications & Frequently Asked Questions
            </h2>
            <Accordion items={service.faqs} />
          </div>
        )}

        {/* Related Project Dossiers */}
        {relatedProjects.length > 0 && (
          <div className="my-16 py-12 border-t border-steel-200">
            <h2 className="text-2xl font-bold text-navy-900 font-display mb-8">
              Verified Project Executions in {service.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProjects.map((p: any) => (
                <div key={p.slug} className="border border-steel-200 rounded p-6 bg-steel-50 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-steel-500 block mb-1">
                      {p.location}, {p.country}
                    </span>
                    <h3 className="text-lg font-bold text-navy-900 mb-2">{p.title}</h3>
                    <p className="text-xs text-steel-600 line-clamp-3 mb-4">{p.shortDescription}</p>
                  </div>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-navy-900 hover:text-gold"
                  >
                    <span>Read Technical Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
