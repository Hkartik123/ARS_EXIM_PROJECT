import React from 'react';
import { ProjectEditor } from '@/components/admin/project-editor';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Project } from '@/models/Project';
import { notFound } from 'next/navigation';

interface EditProjectPageProps {
  params: { id: string };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  await connectToDatabase();
  const rawProject = await Project.findById(params.id).lean();

  if (!rawProject) {
    notFound();
  }

  const project = JSON.parse(JSON.stringify(rawProject));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-navy-900 font-display">Edit Project Case Study</h2>
      <ProjectEditor initialData={project} isEdit={true} />
    </div>
  );
}
