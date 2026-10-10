import { prisma } from '@/lib/db/prisma';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminApplicationsPage() {
  const applications = await prisma.application.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-navy-900 font-display">Candidate Applications</h2>
          <p className="text-xs text-steel-500 mt-0.5">
            Review resumes and qualifications submitted for industrial job openings.
          </p>
        </div>
      </div>

      <div className="bg-white border border-steel-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-steel-50 border-b border-steel-200 text-steel-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-6">Applicant Name</th>
                <th className="py-3 px-6">Position</th>
                <th className="py-3 px-6">Location</th>
                <th className="py-3 px-6">Experience</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Submitted</th>
                <th className="py-3 px-6 text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100 text-steel-800">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-steel-400">
                    No candidate applications submitted yet.
                  </td>
                </tr>
              ) : (
                applications.map((app: any) => (
                  <tr key={app.id} className="hover:bg-steel-50">
                    <td className="py-4 px-6">
                      <div className="font-bold text-navy-900">{app.candidateName}</div>
                      <div className="text-[11px] text-steel-500">{app.email} • {app.phone}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-navy-900">{app.jobTitle}</td>
                    <td className="py-4 px-6 text-steel-600">{app.currentLocation}</td>
                    <td className="py-4 px-6 font-semibold">{app.yearsOfExperience} years</td>
                    <td className="py-4 px-6">
                      <Badge variant="steel">{app.status}</Badge>
                    </td>
                    <td className="py-4 px-6 text-steel-500">{formatDate(app.createdAt)}</td>
                    <td className="py-4 px-6 text-right">
                      <a
                        href={`/uploads/${app.resumeStorageKey}`}
                        target="_blank"
                        download
                        className="inline-flex items-center px-3 py-1 bg-navy-900 text-gold rounded font-bold uppercase tracking-wider text-[11px] hover:bg-navy-800"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        CV
                      </a>
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
