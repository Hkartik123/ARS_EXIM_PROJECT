import React from 'react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { ProjectFilter } from '@/components/public/project-filter';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Project } from '@/models/Project';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Project Case Studies & Industrial Execution Portfolio',
  description:
    'Explore verified technical case studies across Industrial Insulation, Passive Fire Protection, and Scaffolding executed by ARS EXIM.',
};

export default async function ProjectsPage() {
  await connectToDatabase();
  const rawProjects = await Project.find({
    publishStatus: 'PUBLISHED',
    isDeleted: false,
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
            Execution Track Record
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight font-display mb-4">
            Industrial Project Case Studies
          </h1>
          <p className="text-base text-steel-600 leading-relaxed">
            Detailed technical case studies showcasing engineered execution across petrochemical refineries,
            offshore modules, cryogenic terminals, and power generation assets.
          </p>
        </div>

        <ProjectFilter initialProjects={projects} />
      </div>
    </div>
  );
}
