import { prisma } from '@/lib/db/prisma';
import React from 'react';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { CareerApplyForm } from '@/components/public/career-apply-form';
import { MapPin, Clock, Briefcase, CheckCircle2 } from 'lucide-react';

interface PageProps {
  params: { slug: string };
}

export default async function CareerDetailPage({ params }: PageProps) {
  const rawJob = await prisma.career.findFirst({ where: { slug: params.slug, isOpen: true } });

  if (!rawJob) {
    notFound();
  }

  const job = rawJob;

  return (
    <div className="py-12 bg-steel-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Careers', href: '/careers' },
            { label: job.title },
          ]}
        />

        {/* Job Header */}
        <div className="bg-white border border-steel-200 rounded p-8 sm:p-10 my-8 shadow-sm">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="navy">{job.department}</Badge>
            <Badge variant="gold">{job.employmentType}</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 font-display mb-4">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-steel-600 font-medium">
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-gold" />
              <span>Location: {job.location}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-gold" />
              <span>Required Experience: {job.experienceRequired}</span>
            </span>
          </div>
        </div>

        {/* Content & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-8 items-start">
          <div className="lg:col-span-2 space-y-8 bg-white border border-steel-200 rounded p-8">
            <section>
              <h2 className="text-xl font-bold text-navy-900 font-display mb-3">Role Overview</h2>
              <p className="text-sm text-steel-700 leading-relaxed">{job.overview}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-900 font-display mb-3">Key Responsibilities</h2>
              <ul className="space-y-2.5">
                {job.responsibilities.map((resp: string, idx: number) => (
                  <li key={idx} className="flex items-start text-xs sm:text-sm text-steel-700">
                    <CheckCircle2 className="w-4 h-4 text-gold mr-2.5 flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-navy-900 font-display mb-3">Requirements & Competencies</h2>
              <ul className="space-y-2.5">
                {job.requirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start text-xs sm:text-sm text-steel-700">
                    <CheckCircle2 className="w-4 h-4 text-navy-900 mr-2.5 flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Application Form Sidebar */}
          <div>
            <CareerApplyForm jobId={job.id} jobTitle={job.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
