import { prisma } from '@/lib/db/prisma';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Building2,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { UNVERIFIED_SEED_PROJECT_SLUGS } from '@/lib/projects/visibility';
import { normalizeProjectRecord } from '@/lib/projects/normalize';
import { ProjectImage } from '@/components/public/project-image';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps) {
  const project = await prisma.project.findFirst({
    where: {
      slug: params.slug,
      NOT: [
        { slug: { in: UNVERIFIED_SEED_PROJECT_SLUGS } },
        { featuredImage: { contains: 'images.unsplash.com', mode: 'insensitive' } },
      ],
      OR: [{ publishStatus: 'PUBLISHED' }, { published: true }],
      isDeleted: false,
    },
  });
  if (!project) return { title: 'Project Dossier Not Found' };
  const seo = project.seo && typeof project.seo === 'object' && !Array.isArray(project.seo)
    ? project.seo as { title?: string; metaDescription?: string }
    : {};

  return {
    title: seo.title || project.title,
    description: seo.metaDescription || project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const rawProject = await prisma.project.findFirst({
    where: {
      slug: params.slug,
      NOT: [
        { slug: { in: UNVERIFIED_SEED_PROJECT_SLUGS } },
        { featuredImage: { contains: 'images.unsplash.com', mode: 'insensitive' } },
      ],
      OR: [{ publishStatus: 'PUBLISHED' }, { published: true }],
      isDeleted: false,
    },
  });

  if (!rawProject) {
    notFound();
  }

  const project = normalizeProjectRecord(rawProject);

  // Find related projects by service or industry
  const relatedProjects = await prisma.project.findMany({
    where: {
      slug: { notIn: [...UNVERIFIED_SEED_PROJECT_SLUGS, project.slug] },
      isDeleted: false,
      NOT: { featuredImage: { contains: 'images.unsplash.com', mode: 'insensitive' } },
      AND: [
        { OR: [{ publishStatus: 'PUBLISHED' }, { published: true }] },
        { OR: [{ services: { hasSome: project.services } }, { industry: project.industry }] },
      ],
    },
    take: 2,
  });

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Projects', href: '/projects' },
            { label: project.title },
          ]}
        />

        {/* Dossier Header */}
        <div className="my-8">
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="navy">{project.category || project.industry || 'Project reference'}</Badge>
            {project.status && <Badge variant="steel">{project.status}</Badge>}
            {(project.services || []).map((svc: string) => (
              <Badge key={svc} variant="gold">
                {svc.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight font-display mb-4">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs text-steel-600 font-semibold pt-2 border-t border-steel-200">
            <span className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Location: {[project.location, project.country].filter(Boolean).join(', ') || 'Not provided'}</span>
            </span>
            {project.clientPublishable && project.client && (
              <span className="flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Client: {project.client}</span>
              </span>
            )}
          </div>
        </div>

        {/* Hero Featured Media */}
        <div className="relative h-96 sm:h-[480px] w-full rounded overflow-hidden shadow-industrial-lg mb-12 bg-navy-950">
          <ProjectImage
            src={project.featuredImage || '/images/industrial-site-team.webp'}
            alt={project.coverImageIsIllustrative ? `Service capability imagery related to ${project.title}; not project-specific photography` : project.title}
            fill
            sizes="(max-width: 640px) 100vw, 90vw"
            className="object-cover"
          />
          {project.coverImageIsIllustrative && (
            <span className="absolute bottom-4 left-4 rounded bg-navy-950/80 px-3 py-2 text-xs font-semibold text-white">
              Service capability imagery · not project-site photography
            </span>
          )}
        </div>

        {/* Technical Dossier Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-12">
          {/* Main Execution Sections */}
          <div className="lg:col-span-2 space-y-10">
            {/* Executive Overview */}
            {(project.shortDescription || project.description) && (
              <section>
                <h2 className="mb-3 font-display text-2xl font-bold text-navy-900">Project Overview</h2>
                <p className="text-base leading-relaxed text-steel-700">
                  {project.description || project.shortDescription}
                </p>
              </section>
            )}

            {/* Scope of Work */}
            {project.scopeOfWork?.length > 0 && <section className="bg-steel-50 border border-steel-200 rounded p-6 sm:p-8">
              <h2 className="text-xl font-bold text-navy-900 font-display mb-4 pb-2 border-b border-steel-200">
                Delivered Scope of Work (BoQ Summary)
              </h2>
              <ul className="space-y-3">
                {project.scopeOfWork.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start text-sm text-steel-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-gold mr-3 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>}

            {/* Technical Challenges */}
            {project.technicalChallenges && project.technicalChallenges.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-navy-900 font-display mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-gold mr-2" />
                  Technical Challenges Encountered
                </h2>
                <div className="space-y-3">
                  {project.technicalChallenges.map((challenge: string, idx: number) => (
                    <div key={idx} className="p-4 border-l-4 border-gold bg-steel-50 text-sm text-steel-700">
                      {challenge}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Execution Approach */}
            {project.executionApproach && (
              <section>
                <h2 className="text-xl font-bold text-navy-900 font-display mb-3">
                  Engineered Execution Approach
                </h2>
                <p className="text-sm text-steel-700 leading-relaxed bg-white border border-steel-200 p-6 rounded">
                  {project.executionApproach}
                </p>
              </section>
            )}

            {/* Safety & HSE Considerations */}
            {project.safetyConsiderations && project.safetyConsiderations.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-navy-900 font-display mb-4 flex items-center">
                  <ShieldAlert className="w-5 h-5 text-safety-red mr-2" />
                  Project Safety Considerations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.safetyConsiderations.map((safety: string, idx: number) => (
                    <div key={idx} className="p-4 border border-steel-200 rounded bg-safety-light/40 text-xs text-navy-950 font-medium">
                      {safety}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery Images */}
            {project.galleryImages && project.galleryImages.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-navy-900 font-display mb-4">
                  Site Execution Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.galleryImages.map((imgUrl: string, idx: number) => (
                    <div key={idx} className="relative h-64 rounded overflow-hidden border border-steel-200 shadow-sm bg-navy-950">
                      <ProjectImage
                        src={imgUrl || '/images/industrial-site-team.webp'}
                        alt={`${project.title} - Site verification image ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {project.coverImageIsIllustrative && (
              <p className="border-l-2 border-gold bg-steel-50 px-4 py-3 text-xs leading-5 text-steel-600">
                The displayed image illustrates an ARS EXIM service capability and is not a photograph of this specific project.
              </p>
            )}

            {(project.services || []).length > 0 && (
              <section>
                <h2 className="mb-4 font-display text-xl font-bold text-navy-900">Related Services</h2>
                <div className="flex flex-wrap gap-3">
                  {project.services.map((service: string) => {
                    const serviceLinks: Record<string, string> = {
                      'industrial-insulation': '/services/industrial-insulation',
                      'passive-fire-protection': '/services/passive-fire-protection',
                      scaffolding: '/services/scaffolding',
                    };
                    const href = serviceLinks[service] || '/services';
                    return (
                      <Link key={service} href={href} className="inline-flex min-h-10 items-center gap-2 border border-steel-200 px-4 text-xs font-bold uppercase text-navy-900 hover:border-gold">
                        {service.replace(/-/g, ' ')} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar CTA & Related Projects */}
          <div className="space-y-8">
            <div className="bg-navy-950 text-white rounded p-8 shadow-industrial">
              <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-2">
                Turnaround & Capital Bids
              </span>
              <h3 className="text-lg font-bold text-white mb-3">
                Have a Similar Scope of Work?
              </h3>
              <p className="text-xs text-steel-300 leading-relaxed mb-6">
                Our estimating engineers are available to review your facility BoQ and technical drawings.
              </p>
              <Link href="/request-a-quote">
                <Button variant="primary" size="md" className="w-full">
                  Request RFQ for This Discipline
                </Button>
              </Link>
            </div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="bg-steel-50 border border-steel-200 rounded p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-4 pb-2 border-b border-steel-200">
                  Related Case Studies
                </h3>
                <div className="space-y-4">
                  {relatedProjects.map((rp: any) => (
                    <Link
                      key={rp.slug}
                      href={`/projects/${rp.slug}`}
                      className="block p-3 bg-white border border-steel-200 rounded hover:border-gold transition-colors group"
                    >
                      <span className="text-[10px] uppercase font-bold text-gold-700 block">
                        {rp.industry}
                      </span>
                      <h4 className="text-xs font-bold text-navy-900 group-hover:text-gold transition-colors leading-snug">
                        {rp.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
