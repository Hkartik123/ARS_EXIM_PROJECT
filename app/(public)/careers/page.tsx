import { prisma } from '@/lib/db/prisma';
import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, Clock, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Careers & Opportunities | ARS EXIM Industrial',
  description:
    'Join ARS EXIM. Explore career opportunities for engineers, QA/QC inspectors, scaffold specialists, and industrial technicians.',
};

export default async function CareersPage() {
  const careers = await prisma.career.findMany({
    where: { isOpen: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="py-12 bg-steel-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Careers' }]} />

        {/* Section Header */}
        <div className="max-w-3xl my-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-2">
            Talent & Engineering Leadership
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight font-display mb-4">
            Build Your Career in Specialist Industrial Contracting
          </h1>
          <p className="text-base text-steel-600 leading-relaxed">
            View current vacancies below. Any role-specific qualifications, location and employment
            terms will be stated in the individual posting.
          </p>
        </div>

        {/* Open Job Listings */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-navy-900 font-display mb-6">
            Current Vacancies ({careers.length})
          </h2>

          {careers.length === 0 ? (
            <div className="bg-white border border-steel-200 rounded p-12 text-center">
              <Briefcase className="w-10 h-10 text-steel-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-navy-900 mb-2">No Active Openings Currently</h3>
              <p className="text-sm text-steel-600 max-w-md mx-auto mb-6">
                Contact ARS EXIM to ask about future opportunities.
              </p>
              <Link href="/contact">
                <Button variant="secondary" size="md">
                  Ask About Opportunities
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {careers.map((job: any) => (
                <Card key={job.slug} className="p-6 bg-white transition-all hover:border-gold">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="navy">{job.department}</Badge>
                        <Badge variant="steel">{job.employmentType}</Badge>
                      </div>
                      <h3 className="text-xl font-bold text-navy-900 leading-snug">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-steel-500 font-medium mt-2">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-gold" />
                          <span>{job.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-gold" />
                          <span>Experience: {job.experienceRequired}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Link href={`/careers/${job.slug}`}>
                        <Button variant="primary" size="md">
                          View & Apply
                          <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
