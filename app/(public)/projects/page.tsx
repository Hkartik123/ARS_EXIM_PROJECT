import { prisma } from '@/lib/db/prisma';
import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { ProjectFilter } from '@/components/public/project-filter';
import { UNVERIFIED_SEED_PROJECT_SLUGS } from '@/lib/projects/visibility';
import { normalizeProjectRecord } from '@/lib/projects/normalize';
import { projectServiceImagery } from '@/lib/projects/service-imagery';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Our Projects',
  description:
    'Explore ARS EXIM project references and specialist industrial service capabilities.',
};

export default async function ProjectsPage() {
  let projects = [];
  let hasLoadError = false;

  try {
    const rawProjects = await prisma.project.findMany({
      where: {
        OR: [{ publishStatus: 'PUBLISHED' }, { published: true }],
        isDeleted: false,
        slug: { notIn: UNVERIFIED_SEED_PROJECT_SLUGS },
        NOT: { featuredImage: { contains: 'images.unsplash.com', mode: 'insensitive' } },
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });

    projects = rawProjects.map(normalizeProjectRecord).filter(Boolean);
  } catch (error) {
    console.error('Failed to load public projects:', error);
    hasLoadError = true;
  }

  return (
    <div className="py-12 bg-steel-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Projects' }]} />

        <div className="max-w-3xl my-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-2">
            ARS EXIM · Project Portfolio
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight font-display mb-4">
            Our Projects
          </h1>
          <p className="text-base text-steel-600 leading-relaxed">
            ARS EXIM shares project details only where they are approved for public release. Explore
            published project references and the industrial service capabilities supporting our work.
          </p>
        </div>

        {hasLoadError ? (
          <div role="alert" className="rounded border border-steel-200 bg-white px-6 py-12 text-center">
            <h2 className="font-display text-2xl font-bold text-navy-900">Projects are temporarily unavailable</h2>
            <p className="mt-2 text-sm text-steel-600">Unable to load projects at the moment. Please try again later.</p>
          </div>
        ) : (
          <ProjectFilter initialProjects={projects} />
        )}

        <section aria-labelledby="project-capabilities-heading" className="mt-20">
          <div className="mb-8 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">Service capabilities</span>
            <h2 id="project-capabilities-heading" className="mt-3 font-display text-3xl font-bold text-navy-950 sm:text-4xl">
              Specialist work across connected disciplines.
            </h2>
            <p className="mt-3 text-sm leading-6 text-steel-700">
              These images show ARS EXIM service capabilities; they are not represented as photographs of a specific project.
            </p>
          </div>
          <div className="space-y-10">
            {projectServiceImagery.map((service) => (
              <div key={service.category}>
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-steel-200 pb-3">
                  <h3 className="font-display text-2xl font-bold text-navy-950">{service.category}</h3>
                  <p className="text-xs font-medium text-steel-600">{service.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {service.images.map((image) => (
                    <Link
                      key={image.src}
                      href={service.href}
                      className="group relative block overflow-hidden bg-navy-950 focus-visible:outline-gold"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-transparent to-transparent" />
                        <span className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-wider text-white">
                          Explore services
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
