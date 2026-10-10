import { prisma } from '@/lib/db/prisma';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, PlusCircle, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminCareersPage() {
  const careers = await prisma.career.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy-900 font-display">Recruitment & Job Openings</h2>
          <p className="text-xs text-steel-500 mt-0.5">
            Manage published engineering and site craft vacancies.
          </p>
        </div>
      </div>

      <div className="bg-white border border-steel-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-steel-50 border-b border-steel-200 text-steel-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-6">Position Title</th>
                <th className="py-3 px-6">Department</th>
                <th className="py-3 px-6">Location</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Posted Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100 text-steel-800">
              {careers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-steel-400">
                    No active job vacancies created.
                  </td>
                </tr>
              ) : (
                careers.map((job: any) => (
                  <tr key={job.id} className="hover:bg-steel-50">
                    <td className="py-4 px-6 font-bold text-navy-900">{job.title}</td>
                    <td className="py-4 px-6">{job.department}</td>
                    <td className="py-4 px-6 text-steel-600">{job.location}</td>
                    <td className="py-4 px-6">{job.employmentType}</td>
                    <td className="py-4 px-6">
                      <Badge variant={job.isOpen ? 'success' : 'steel'}>
                        {job.isOpen ? 'OPEN' : 'CLOSED'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-steel-500 font-medium">
                      {formatDate(job.createdAt)}
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
