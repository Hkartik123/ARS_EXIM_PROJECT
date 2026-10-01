import React from 'react';
import { ProjectEditor } from '@/components/admin/project-editor';

export default function NewProjectPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-navy-900 font-display">Create Industrial Case Study</h2>
      <ProjectEditor />
    </div>
  );
}
