import { prisma } from '@/lib/db/prisma';
import React from 'react';
import { ProjectEditor } from '@/components/admin/project-editor';
import { notFound } from 'next/navigation';
import { isValidDatabaseId } from '@/lib/db/ids';

interface EditProjectPageProps {
  params: { id: string };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  if (!isValidDatabaseId(params.id)) notFound();
  const rawProject = await prisma.project.findUnique({ where: { id: params.id } });

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
