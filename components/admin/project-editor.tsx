'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProjectEditorProps {
  initialData?: any;
  isEdit?: boolean;
}

const INDUSTRY_OPTIONS = [
  { label: 'Select industry sector', value: '' },
  { label: 'Oil & Gas', value: 'Oil & Gas' },
  { label: 'Petrochemical', value: 'Petrochemical' },
  { label: 'Power Generation', value: 'Power Generation' },
  { label: 'Heavy Manufacturing', value: 'Heavy Manufacturing' },
  { label: 'Marine & Offshore', value: 'Marine & Offshore' },
  { label: 'Infrastructure', value: 'Infrastructure' },
];

const SERVICE_OPTIONS = [
  { label: 'Industrial Insulation', value: 'industrial-insulation' },
  { label: 'Passive Fire Protection', value: 'passive-fire-protection' },
  { label: 'Scaffolding & Access', value: 'scaffolding' },
];

const PUBLISH_STATUS_OPTIONS = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Under Review', value: 'REVIEW' },
  { label: 'Published Live', value: 'PUBLISHED' },
  { label: 'Archived', value: 'ARCHIVED' },
];

export function ProjectEditor({ initialData, isEdit = false }: ProjectEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    client: initialData?.client || '',
    clientPublishable: initialData?.clientPublishable || false,
    industry: initialData?.industry || '',
    country: initialData?.country || '',
    location: initialData?.location || '',
    services: initialData?.services || ['industrial-insulation'],
    shortDescription: initialData?.shortDescription || '',
    scopeOfWork: initialData?.scopeOfWork ? initialData.scopeOfWork.join('\n') : '',
    technicalChallenges: initialData?.technicalChallenges ? initialData.technicalChallenges.join('\n') : '',
    executionApproach: initialData?.executionApproach || '',
    safetyConsiderations: initialData?.safetyConsiderations ? initialData.safetyConsiderations.join('\n') : '',
    featuredImage: initialData?.featuredImage || '',
    galleryImages: initialData?.galleryImages ? initialData.galleryImages.join('\n') : '',
    isFeatured: initialData?.isFeatured || false,
    publishStatus: initialData?.publishStatus || 'DRAFT',
    seoTitle: initialData?.seo?.title || '',
    seoMetaDescription: initialData?.seo?.metaDescription || '',
  });

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !isEdit && !prev.slug ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
      seoTitle: !prev.seoTitle ? `${val} | ARS EXIM Project Case Study` : prev.seoTitle,
    }));
  };

  const handleServiceToggle = (serviceValue: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(serviceValue);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s: string) => s !== serviceValue)
          : [...prev.services, serviceValue],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.services.length === 0) {
      setError('Please select at least one industrial service.');
      return;
    }

    setLoading(true);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      client: formData.client,
      clientPublishable: formData.clientPublishable,
      industry: formData.industry,
      country: formData.country,
      location: formData.location,
      services: formData.services,
      shortDescription: formData.shortDescription,
      scopeOfWork: formData.scopeOfWork.split('\n').map((line: string) => line.trim()).filter(Boolean),
      technicalChallenges: formData.technicalChallenges.split('\n').map((line: string) => line.trim()).filter(Boolean),
      executionApproach: formData.executionApproach,
      safetyConsiderations: formData.safetyConsiderations.split('\n').map((line: string) => line.trim()).filter(Boolean),
      featuredImage: formData.featuredImage,
      galleryImages: formData.galleryImages.split('\n').map((line: string) => line.trim()).filter(Boolean),
      isFeatured: formData.isFeatured,
      publishStatus: formData.publishStatus,
      seo: {
        title: formData.seoTitle || formData.title,
        metaDescription: formData.seoMetaDescription || formData.shortDescription,
      },
    };

    try {
      const url = isEdit ? `/api/admin/projects/${initialData._id}` : '/api/admin/projects';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to save project.');
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving project dossier.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center text-xs font-bold text-steel-500 hover:text-navy-900 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Projects Table
      </Link>

      <form onSubmit={handleSubmit} className="bg-white border border-steel-200 rounded p-8 shadow-sm space-y-8">
        {error && (
          <div className="p-4 bg-safety-light border-l-4 border-safety-red text-safety-red text-xs font-semibold rounded flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Basic Identifiers */}
        <div>
          <h3 className="text-base font-bold text-navy-900 border-b border-steel-100 pb-2 mb-4">
            1. Project Identification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Input
                id="title"
                label="Case Study Title"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. High-Pressure Steam Line Insulation Overhaul"
              />
            </div>
            <Input
              id="slug"
              label="URL Slug (Permanent link)"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. steam-line-insulation-overhaul"
            />
            <Select
              id="industry"
              label="Industry Sector"
              options={INDUSTRY_OPTIONS}
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            />
            <Input
              id="location"
              label="Facility / Site Location"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Ruwais Industrial Zone"
            />
            <Input
              id="country"
              label="Country"
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="e.g. United Arab Emirates"
            />
          </div>
        </div>

        {/* Section 2: Client & Disciplines */}
        <div>
          <h3 className="text-base font-bold text-navy-900 border-b border-steel-100 pb-2 mb-4">
            2. Disciplines & Client Visibility
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-steel-700 mb-2">
                Tagged Industrial Disciplines <span className="text-safety-red">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {SERVICE_OPTIONS.map((svc) => {
                  const checked = formData.services.includes(svc.value);
                  return (
                    <button
                      type="button"
                      key={svc.value}
                      onClick={() => handleServiceToggle(svc.value)}
                      className={`px-3.5 py-2 rounded text-xs font-semibold border transition-colors ${
                        checked ? 'bg-navy-900 text-gold border-navy-900' : 'bg-white text-steel-700 border-steel-300'
                      }`}
                    >
                      {svc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <Input
                id="client"
                label="Client / Operator Name"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g. National Oil Company"
              />
              <div className="flex items-center pt-6">
                <label className="flex items-center space-x-2 text-xs font-semibold text-navy-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.clientPublishable}
                    onChange={(e) => setFormData({ ...formData, clientPublishable: e.target.checked })}
                    className="rounded border-steel-300 text-gold focus:ring-gold"
                  />
                  <span>Client permission confirmed for public display</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Technical Execution Dossier */}
        <div>
          <h3 className="text-base font-bold text-navy-900 border-b border-steel-100 pb-2 mb-4">
            3. Technical Execution Details
          </h3>
          <div className="space-y-5">
            <Textarea
              id="shortDescription"
              label="Executive Scope Summary"
              required
              rows={3}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="High-level overview of the engineering scope delivered..."
            />
            <Textarea
              id="scopeOfWork"
              label="Delivered Scope of Work (One item per line)"
              required
              rows={4}
              value={formData.scopeOfWork}
              onChange={(e) => setFormData({ ...formData, scopeOfWork: e.target.value })}
              placeholder="Stripping 14,000 linear meters of piping&#10;Substrate blast cleaning to Sa 2.5&#10;Dual-layer calcium silicate installation"
            />
            <Textarea
              id="technicalChallenges"
              label="Technical Challenges Overcome (One item per line)"
              rows={3}
              value={formData.technicalChallenges}
              onChange={(e) => setFormData({ ...formData, technicalChallenges: e.target.value })}
              placeholder="Operating adjacent live units at 480°C&#10;Severe coastal humidity during cladding closure"
            />
            <Textarea
              id="executionApproach"
              label="Engineered Execution Approach"
              required
              rows={4}
              value={formData.executionApproach}
              onChange={(e) => setFormData({ ...formData, executionApproach: e.target.value })}
              placeholder="Describe tooling, pre-fabrication, and scheduling methods deployed..."
            />
            <Textarea
              id="safetyConsiderations"
              label="Safety & Environmental Metrics (One item per line)"
              rows={3}
              value={formData.safetyConsiderations}
              onChange={(e) => setFormData({ ...formData, safetyConsiderations: e.target.value })}
              placeholder="Zero-Harm HSE achieved over 85,000 man-hours&#10;Continuous atmospheric monitoring"
            />
          </div>
        </div>

        {/* Section 4: Media & Imagery */}
        <div>
          <h3 className="text-base font-bold text-navy-900 border-b border-steel-100 pb-2 mb-4">
            4. Imagery & Gallery
          </h3>
          <div className="space-y-5">
            <Input
              id="featuredImage"
              label="Featured Image URL"
              required
              placeholder="Use a client-approved project image URL"
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
            />
            <Textarea
              id="galleryImages"
              label="Additional Gallery Image URLs (One URL per line)"
              rows={3}
              value={formData.galleryImages}
              onChange={(e) => setFormData({ ...formData, galleryImages: e.target.value })}
            />
          </div>
        </div>

        {/* Section 5: Status & SEO */}
        <div>
          <h3 className="text-base font-bold text-navy-900 border-b border-steel-100 pb-2 mb-4">
            5. Publishing Status & SEO Metadata
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <Select
              id="publishStatus"
              label="Publish Status"
              options={PUBLISH_STATUS_OPTIONS}
              value={formData.publishStatus}
              onChange={(e) => setFormData({ ...formData, publishStatus: e.target.value })}
            />
            <div className="flex items-center pt-6">
              <label className="flex items-center space-x-2 text-xs font-semibold text-navy-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-steel-300 text-gold focus:ring-gold"
                />
                <span>Feature on Homepage Showcase</span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <Input
                id="seoTitle"
                label="SEO Meta Title"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Textarea
                id="seoMetaDescription"
                label="SEO Meta Description"
                rows={2}
                value={formData.seoMetaDescription}
                onChange={(e) => setFormData({ ...formData, seoMetaDescription: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-steel-200 flex justify-end space-x-4">
          <Link href="/admin/projects">
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" size="md" isLoading={loading}>
            {isEdit ? 'Update Project Dossier' : 'Save & Publish Project Dossier'}
          </Button>
        </div>
      </form>
    </div>
  );
}
