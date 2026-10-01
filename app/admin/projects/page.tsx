'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit3, Trash2, Eye, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const json = await res.json();
      if (res.ok && json.success) {
        setProjects(json.data.projects);
      }
    } catch (err) {
      console.error('Failed to fetch admin projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to soft-delete project "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert('Failed to delete project.');
      }
    } catch {
      alert('Error occurred while deleting project.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy-900 font-display">Industrial Project Case Studies</h2>
          <p className="text-xs text-steel-500 mt-0.5">
            Manage verified industrial dossiers, technical challenges, and client visibility permissions.
          </p>
        </div>

        <Link href="/admin/projects/new">
          <Button variant="primary" size="md">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Project Dossier
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-steel-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-steel-50 border-b border-steel-200 text-steel-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-6">Project Title</th>
                <th className="py-3 px-6">Industry / Location</th>
                <th className="py-3 px-6">Disciplines</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Updated</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100 text-steel-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-steel-400">
                    Loading project case studies...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-steel-400">
                    No project case studies recorded. Click &quot;Add New Project Dossier&quot; to create one.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p._id} className="hover:bg-steel-50">
                    <td className="py-4 px-6">
                      <div className="font-bold text-navy-900">{p.title}</div>
                      <div className="text-[11px] text-steel-400 font-mono">/{p.slug}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-navy-900">{p.industry}</div>
                      <div className="text-[11px] text-steel-500">{p.location}, {p.country}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {p.services.map((svc: string) => (
                          <span
                            key={svc}
                            className="bg-steel-100 text-steel-700 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                          >
                            {svc.replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={p.publishStatus === 'PUBLISHED' ? 'success' : 'steel'}>
                        {p.publishStatus}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-steel-500 font-medium">
                      {formatDate(p.updatedAt)}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        className="inline-block p-1.5 text-steel-400 hover:text-navy-900 transition-colors"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/projects/${p._id}/edit`}
                        className="inline-block p-1.5 text-steel-400 hover:text-gold transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p._id, p.title)}
                        className="p-1.5 text-steel-400 hover:text-safety-red transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
