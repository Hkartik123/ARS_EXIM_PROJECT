'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  FileText,
  Download,
  Clock,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';

interface EnquiryDetailPageProps {
  params: { id: string };
}

export default function EnquiryDetailPage({ params }: EnquiryDetailPageProps) {
  const router = useRouter();
  const [enquiry, setEnquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchEnquiry = async () => {
    try {
      const res = await fetch(`/api/admin/enquiries/${params.id}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setEnquiry(json.data.enquiry);
        setNewStatus(json.data.enquiry.status);
      }
    } catch (err) {
      console.error('Failed to fetch enquiry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiry();
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/enquiries/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note: newNote.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setEnquiry(json.data.enquiry);
        setNewNote('');
        setFeedback('Status and operational notes updated successfully.');
      } else {
        setFeedback(json.error?.message || 'Failed to update enquiry.');
      }
    } catch {
      setFeedback('Error occurred while updating.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-sm font-semibold text-steel-500">Loading enquiry dossier...</div>;
  }

  if (!enquiry) {
    return (
      <div className="py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy-900">Enquiry record not found</h2>
        <Link href="/admin/enquiries">
          <Button variant="secondary" size="md">
            &larr; Back to Enquiries
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <Link
        href="/admin/enquiries"
        className="inline-flex items-center text-xs font-bold text-steel-500 hover:text-navy-900 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Enquiries Inbox
      </Link>

      {/* Header Dossier Strip */}
      <div className="bg-white border border-steel-200 rounded p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="text-2xl font-black font-mono text-navy-900">
              {enquiry.referenceNumber}
            </span>
            <Badge variant={enquiry.status === 'NEW' ? 'safety' : 'steel'}>
              {enquiry.status}
            </Badge>
          </div>
          <p className="text-xs text-steel-500">
            Registered on {formatDateTime(enquiry.createdAt)} • IP: {enquiry.ipAddress}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold uppercase tracking-wider text-steel-400 block">
            Submission Type
          </span>
          <span className="text-base font-bold text-navy-900 font-display">
            {enquiry.type === 'QUOTE' ? 'Project Quotation (RFQ)' : 'General Contact Inquiry'}
          </span>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-steel-100 border-l-4 border-gold text-navy-950 text-xs font-bold rounded">
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Scope & Attachments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company & Client Coordinates */}
          <div className="bg-white border border-steel-200 rounded p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b border-steel-100 pb-2">
              Client & Company Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-steel-400 block font-semibold">Company Name</span>
                <span className="text-sm font-bold text-navy-900">{enquiry.company}</span>
              </div>
              <div>
                <span className="text-steel-400 block font-semibold">Contact Person</span>
                <span className="text-sm font-bold text-navy-900">{enquiry.name}</span>
              </div>
              <div>
                <span className="text-steel-400 block font-semibold">Email</span>
                <a href={`mailto:${enquiry.email}`} className="text-gold-700 font-bold hover:underline">
                  {enquiry.email}
                </a>
              </div>
              <div>
                <span className="text-steel-400 block font-semibold">Phone</span>
                <a href={`tel:${enquiry.phone}`} className="text-navy-900 font-bold">
                  {enquiry.phone}
                </a>
              </div>
              <div>
                <span className="text-steel-400 block font-semibold">Country</span>
                <span className="font-semibold text-navy-900">{enquiry.country}</span>
              </div>
              <div>
                <span className="text-steel-400 block font-semibold">Location</span>
                <span className="font-semibold text-navy-900">{enquiry.location || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Project Scope & Disciplines */}
          <div className="bg-white border border-steel-200 rounded p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b border-steel-100 pb-2">
              Technical Project Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4">
              <div>
                <span className="text-steel-400 block font-semibold">Project Name</span>
                <span className="font-bold text-navy-900">{enquiry.projectName || 'N/A'}</span>
              </div>
              <div>
                <span className="text-steel-400 block font-semibold">Project Type</span>
                <span className="font-bold text-navy-900">{enquiry.projectType || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-steel-400 block font-semibold">Industry Sector</span>
                <span className="font-bold text-navy-900">{enquiry.industry || 'N/A'}</span>
              </div>
              <div>
                <span className="text-steel-400 block font-semibold">Expected Start Date</span>
                <span className="font-bold text-navy-900">{enquiry.expectedStartDate || 'Flexible'}</span>
              </div>
              <div>
                <span className="text-steel-400 block font-semibold">Project Duration</span>
                <span className="font-bold text-navy-900">{enquiry.projectDuration || 'Flexible'}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-steel-400 block font-semibold mb-1">Required Disciplines</span>
              <div className="flex flex-wrap gap-1.5">
                {enquiry.requiredServices?.map((s: string) => (
                  <Badge key={s} variant="navy">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-steel-400 block font-semibold mb-2">Technical Scope Description</span>
              <div className="p-4 bg-steel-50 rounded border border-steel-200 text-xs sm:text-sm text-steel-800 leading-relaxed whitespace-pre-wrap">
                {enquiry.scopeDescription}
              </div>
            </div>
          </div>

          {/* Uploaded Technical Files */}
          <div className="bg-white border border-steel-200 rounded p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b border-steel-100 pb-2">
              Attached Engineering Files ({enquiry.attachments?.length || 0})
            </h3>
            {enquiry.attachments && enquiry.attachments.length > 0 ? (
              <div className="space-y-2">
                {enquiry.attachments.map((file: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 bg-steel-50 border border-steel-200 rounded text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <FileText className="w-4 h-4 text-gold flex-shrink-0" />
                      <span className="font-bold text-navy-900 truncate">{file.originalName}</span>
                      <span className="text-steel-400">({(file.fileSize / (1024 * 1024)).toFixed(2)} MB)</span>
                    </div>
                    <a
                      href={`/uploads/${file.storageKey}`}
                      target="_blank"
                      download
                      className="inline-flex items-center px-3 py-1.5 bg-navy-900 text-gold rounded font-bold uppercase tracking-wider text-[11px] hover:bg-navy-800"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-steel-400">No documents or drawings attached to this inquiry.</p>
            )}
          </div>
        </div>

        {/* Right Column: Workflow Status & Internal Notes */}
        <div className="space-y-6">
          <form onSubmit={handleUpdate} className="bg-white border border-steel-200 rounded p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900 border-b border-steel-100 pb-2">
              Triage & Status Action
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-steel-700 mb-1.5">
                Current Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded border border-steel-300 bg-white font-bold text-navy-900"
              >
                <option value="NEW">NEW (Unreviewed)</option>
                <option value="CONTACTED">CONTACTED (Client Follow-up)</option>
                <option value="UNDER_REVIEW">UNDER REVIEW (Estimating Active)</option>
                <option value="CLOSED">CLOSED (Proposal Finalized)</option>
                <option value="SPAM">SPAM / INVALID</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div>
              <Textarea
                id="newNote"
                label="Append Internal Operational Note"
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log phone calls, estimating assigned personnel, BoQ queries..."
              />
            </div>

            <Button type="submit" variant="primary" size="md" isLoading={updating} className="w-full">
              Save Status & Note
            </Button>
          </form>

          {/* Notes History Trail */}
          <div className="bg-white border border-steel-200 rounded p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-steel-100 pb-2">
              <MessageSquare className="w-4 h-4 text-gold" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                Internal Notes Trail ({enquiry.notes?.length || 0})
              </h3>
            </div>

            {enquiry.notes && enquiry.notes.length > 0 ? (
              <div className="space-y-3">
                {enquiry.notes.map((note: any, idx: number) => (
                  <div key={idx} className="p-3 bg-steel-50 rounded border border-steel-200 text-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-steel-400 font-semibold">
                      <span>{note.authorName}</span>
                      <span>{formatDateTime(note.createdAt)}</span>
                    </div>
                    <p className="text-steel-800 font-medium leading-relaxed">{note.note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-steel-400">No internal notes added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
