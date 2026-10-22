import { prisma } from '@/lib/db/prisma';
import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { ProjectFilter } from '@/components/public/project-filter';
import { UNVERIFIED_SEED_PROJECT_SLUGS } from '@/lib/projects/visibility';
import { normalizeProjectRecord } from '@/lib/projects/normalize';
import { projectServiceImagery } from '@/lib/projects/service-imagery';
import { clientSiteImages } from '@/lib/projects/client-site-imagery';
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
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Projects' }]} />

        <div className="max-w-3xl my-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-2">
            ARS EXIM · Project Portfolio
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight font-display mb-4">
            Our Projects
          </h1>
          <p className="text-base text-steel-600 leading-relaxed">
            Explore approved project references and the industrial services ARS EXIM provides.
            Project details are shared only where they are approved for public release.
          </p>
        </div>

        {hasLoadError ? (
          <div className="mb-10 border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950" role="status">
            Published project references are temporarily unavailable. Client-provided site photography is shown below;
            project identity and service scope have not been confirmed.
          </div>
        ) : (
          <ProjectFilter initialProjects={projects} />
        )}

        <section aria-labelledby="client-site-photography-heading" className="mt-10">
          <div className="mb-5 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">Industrial Sites</span>
            <h2 id="client-site-photography-heading" className="mt-2 font-display text-2xl font-bold text-navy-950 sm:text-3xl">
              Client-provided site photography
            </h2>
            <p className="mt-2 text-sm leading-6 text-steel-700">
              Site imagery is presented separately from verified project references.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {clientSiteImages.map((image) => (
              <figure key={image.id} className="overflow-hidden border border-steel-200 bg-white shadow-sm">
                <div className="relative aspect-[16/9] bg-steel-100">
                  <Image
                    src={image.url}
                    alt={image.altText}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-700">{image.category}</span>
                  <h3 className="mt-1 font-semibold text-navy-900">{image.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-steel-700">{image.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border border-[#dfeaf7] bg-white p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-xl font-bold text-navy-900">Planning a similar scope?</h2>
            <p className="mt-1 text-sm text-steel-600">Share your project specifications with our team.</p>
          </div>
          <Link
            href="/request-a-quote"
            className="inline-flex min-h-11 items-center justify-center rounded bg-gold px-5 py-2 text-xs font-bold uppercase tracking-wider text-navy-950 transition-colors hover:bg-gold-600"
          >
            Submit Project Specifications
          </Link>
        </div>

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
