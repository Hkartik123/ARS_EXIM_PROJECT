import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { ProjectFilter } from '@/components/public/project-filter';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Project } from '@/models/Project';
import { UNVERIFIED_SEED_PROJECT_SLUGS } from '@/lib/projects/visibility';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Project References',
  description:
    'Review project references ARS EXIM is able to share publicly, or contact the team to discuss an industrial scope.',
};

export default async function ProjectsPage() {
  await connectToDatabase();
  const rawProjects = await Project.find({
    publishStatus: 'PUBLISHED',
    isDeleted: false,
    slug: { $nin: UNVERIFIED_SEED_PROJECT_SLUGS },
    featuredImage: { $not: /images\.unsplash\.com/i },
  })
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean();

  const projects = JSON.parse(JSON.stringify(rawProjects));

  return (
    <div className="py-12 bg-steel-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Projects' }]} />

        <div className="max-w-3xl my-8">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-2">
            Project References
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight font-display mb-4">
            Public Project References
          </h1>
          <p className="text-base text-steel-600 leading-relaxed">
            ARS EXIM shares project details only where they are approved for public release. For a
            comparable industrial scope, contact the team with your service, location and requirements.
          </p>
        </div>

        <ProjectFilter initialProjects={projects} />
      </div>
    </div>
  );
}
