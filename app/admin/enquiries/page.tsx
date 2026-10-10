'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { FileSpreadsheet, Search, RefreshCw, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (typeFilter !== 'ALL') params.append('type', typeFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setEnquiries(json.data.enquiries);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnquiries();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy-900 font-display">
            Inquiries & Quotation RFQs
          </h2>
          <p className="text-xs text-steel-500 mt-0.5">
            Manage incoming tender specifications, client scopes, and status triage.
          </p>
        </div>

        <a
          href="/api/admin/enquiries/export"
          className="inline-flex items-center px-4 py-2 border border-steel-300 rounded text-xs font-bold uppercase tracking-wider text-navy-900 bg-white hover:bg-steel-50 shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2 text-gold" />
          Export All as CSV
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-steel-200 rounded p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full sm:w-auto flex gap-2">
          <input
            type="text"
            placeholder="Search by Reference, Company, Name, Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-10 px-3 text-xs rounded border border-steel-300 focus:border-navy-700 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-navy-900 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-navy-800"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded border border-steel-300 bg-white text-navy-900 font-semibold"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
            <option value="CLOSED">CLOSED</option>
            <option value="SPAM">SPAM</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded border border-steel-300 bg-white text-navy-900 font-semibold"
          >
            <option value="ALL">All Types</option>
            <option value="QUOTE">Quotations (RFQ)</option>
            <option value="CONTACT">Contact Inquiries</option>
          </select>
        </div>
      </div>

      {/* Enquiries Grid */}
      <div className="bg-white border border-steel-200 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-steel-50 border-b border-steel-200 text-steel-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-6">Reference</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Company / Contact</th>
                <th className="py-3 px-6">Country</th>
                <th className="py-3 px-6">Required Services</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100 text-steel-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-steel-400">
                    Loading inquiries...
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-steel-400">
                    No inquiries found matching criteria.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-steel-50">
                    <td className="py-4 px-6 font-bold text-navy-900 font-mono">
                      {enq.referenceNumber}
                      <span className="block text-[10px] text-steel-400 uppercase font-sans">
                        {enq.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-steel-500 font-medium">
                      {formatDate(enq.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-navy-900">{enq.company}</div>
                      <div className="text-[11px] text-steel-500">
                        {enq.name} • {enq.email}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-steel-700">{enq.country}</td>
                    <td className="py-4 px-6 text-[11px] text-steel-600">
                      {enq.requiredServices?.slice(0, 2).join(', ') || 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          enq.status === 'NEW'
                            ? 'safety'
                            : enq.status === 'CLOSED'
                            ? 'success'
                            : 'steel'
                        }
                      >
                        {enq.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/enquiries/${enq.id}`}
                        className="inline-flex items-center text-xs font-bold text-navy-900 hover:text-gold uppercase tracking-wider"
                      >
                        <span>Review</span>
                        <Eye className="w-3.5 h-3.5 ml-1" />
                      </Link>
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
