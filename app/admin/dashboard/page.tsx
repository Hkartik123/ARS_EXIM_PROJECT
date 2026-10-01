'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Inbox,
  Clock,
  FolderGit2,
  Users,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  PlusCircle,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/admin/dashboard');
        const json = await res.json();
        if (res.ok && json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-sm font-semibold text-steel-500">
        Loading operational metrics...
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalQuotes: 0,
    newQuotes: 0,
    totalProjects: 0,
    totalApplications: 0,
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight font-display">
            Operational Overview
          </h2>
          <p className="text-xs text-steel-500 font-medium mt-0.5">
            Real-time quotation triage, project publishing status, and platform audit records.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/api/admin/enquiries/export"
            className="inline-flex items-center px-4 py-2 border border-steel-300 rounded text-xs font-bold uppercase tracking-wider text-navy-900 bg-white hover:bg-steel-50 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-gold" />
            Export RFQ CSV
          </a>
          <Link href="/admin/projects/new">
            <Button variant="primary" size="md">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Case Study
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-6 bg-white border border-steel-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-steel-500">
              Total Quotation RFQs
            </span>
            <Inbox className="w-5 h-5 text-gold" />
          </div>
          <div className="text-3xl font-black text-navy-900 font-display mt-2">
            {metrics.totalQuotes}
          </div>
          <p className="text-[11px] text-steel-400 mt-1">Direct inquiries via website</p>
        </Card>

        <Card className="p-6 bg-white border border-steel-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-steel-500">
              New / Pending Triage
            </span>
            <Clock className="w-5 h-5 text-safety-red" />
          </div>
          <div className="text-3xl font-black text-safety-red font-display mt-2">
            {metrics.newQuotes}
          </div>
          <p className="text-[11px] text-steel-400 mt-1">Requires estimating review</p>
        </Card>

        <Card className="p-6 bg-white border border-steel-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-steel-500">
              Project Case Studies
            </span>
            <FolderGit2 className="w-5 h-5 text-navy-900" />
          </div>
          <div className="text-3xl font-black text-navy-900 font-display mt-2">
            {metrics.totalProjects}
          </div>
          <p className="text-[11px] text-steel-400 mt-1">Verified published dossiers</p>
        </Card>

        <Card className="p-6 bg-white border border-steel-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-steel-500">
              Job Applications
            </span>
            <Users className="w-5 h-5 text-success" />
          </div>
          <div className="text-3xl font-black text-navy-900 font-display mt-2">
            {metrics.totalApplications}
          </div>
          <p className="text-[11px] text-steel-400 mt-1">Candidate submissions</p>
        </Card>
      </div>

      {/* Recent Enquiries & RFQs Stream */}
      <div className="bg-white border border-steel-200 rounded shadow-sm overflow-hidden">
        <div className="p-6 border-b border-steel-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-navy-900">Recent Quotation Requests & Inquiries</h3>
          <Link
            href="/admin/enquiries"
            className="text-xs font-bold uppercase tracking-wider text-gold-700 hover:text-navy-900 flex items-center"
          >
            <span>View All Inquiries</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-steel-50 border-b border-steel-200 text-steel-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-6">Reference</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Company / Contact</th>
                <th className="py-3 px-6">Discipline</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100 text-steel-800">
              {data?.recentEnquiries && data.recentEnquiries.length > 0 ? (
                data.recentEnquiries.map((enq: any) => (
                  <tr key={enq._id} className="hover:bg-steel-50">
                    <td className="py-4 px-6 font-bold text-navy-900">{enq.referenceNumber}</td>
                    <td className="py-4 px-6 text-steel-500">{formatDate(enq.createdAt)}</td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-navy-900">{enq.company}</div>
                      <div className="text-[11px] text-steel-500">{enq.name}</div>
                    </td>
                    <td className="py-4 px-6 text-[11px] text-steel-600">
                      {enq.requiredServices?.slice(0, 2).join(', ') || 'General'}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={enq.status === 'NEW' ? 'safety' : 'steel'}>{enq.status}</Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/enquiries/${enq._id}`}
                        className="text-xs font-bold text-navy-900 hover:text-gold uppercase tracking-wider"
                      >
                        Review &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-steel-400">
                    No recent inquiries recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Security & Platform Audit Logs */}
      <div className="bg-white border border-steel-200 rounded shadow-sm p-6">
        <div className="flex items-center justify-between mb-4 border-b border-steel-100 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h3 className="text-base font-bold text-navy-900">Security Audit Activity</h3>
          </div>
          <Link
            href="/admin/audit-logs"
            className="text-xs font-bold uppercase tracking-wider text-gold-700 hover:text-navy-900"
          >
            Audit Log Ledger &rarr;
          </Link>
        </div>

        <div className="space-y-3">
          {data?.recentAuditLogs && data.recentAuditLogs.length > 0 ? (
            data.recentAuditLogs.map((log: any) => (
              <div
                key={log._id}
                className="flex items-center justify-between p-3 bg-steel-50 rounded text-xs"
              >
                <div>
                  <span className="font-bold text-navy-900 mr-2">[{log.action}]</span>
                  <span className="text-steel-600">
                    {log.entity} by <strong>{log.userEmail}</strong>
                  </span>
                </div>
                <div className="text-steel-400 font-medium">
                  {formatDate(log.createdAt)} • IP: {log.ipAddress}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-steel-400">No security audit logs recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
