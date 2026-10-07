'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { projectServiceImagery } from '@/lib/projects/service-imagery';

interface ProjectEditorProps {
  initialData?: any;
  isEdit?: boolean;
}

interface ProjectMediaItem {
  _id: string;
  title: string;
  category: string;
  altText: string;
  url: string;
  isServiceImagery?: boolean;
}

const INDUSTRY_OPTIONS = [
  { label: 'Select industry sector', value: '' },
  { label: 'Oil & Gas', value: 'Oil & Gas' },
  { label: 'Petrochemical', value: 'Petrochemical' },
  { label: 'Power Generation', value: 'Power Generation' },
  { label: 'Heavy Manufacturing', value: 'Heavy Manufacturing' },
  { label: 'Marine & Offshore', value: 'Marine & Offshore' },
  { label: 'Infrastructure', value: 'Infrastructure' },
  { label: 'Other', value: 'Other' },
];

const CATEGORY_OPTIONS = [
  { label: 'Select project category', value: '' },
  { label: 'Insulation', value: 'Insulation' },
  { label: 'PFP', value: 'PFP' },
  { label: 'Scaffolding', value: 'Scaffolding' },
  { label: 'Industrial', value: 'Industrial' },
  { label: 'Construction', value: 'Construction' },
  { label: 'Maintenance', value: 'Maintenance' },
  { label: 'Other', value: 'Other' },
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

const PROJECT_STATUS_OPTIONS = [
  { label: 'Select project status', value: '' },
  { label: 'Upcoming', value: 'UPCOMING' },
  { label: 'Ongoing', value: 'ONGOING' },
  { label: 'Completed', value: 'COMPLETED' },
];

export function ProjectEditor({ initialData, isEdit = false }: ProjectEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<ProjectMediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    category: initialData?.category || initialData?.industry || '',
    client: initialData?.client || '',
    clientPublishable: initialData?.clientPublishable || false,
    industry: initialData?.industry || '',
    status: initialData?.status || 'UPCOMING',
    country: initialData?.country || '',
    location: initialData?.location || '',
    services: initialData?.services || ['industrial-insulation'],
    shortDescription: initialData?.shortDescription || '',
    scopeOfWork: initialData?.scopeOfWork ? initialData.scopeOfWork.join('\n') : '',
    technicalChallenges: initialData?.technicalChallenges ? initialData.technicalChallenges.join('\n') : '',
    executionApproach: initialData?.executionApproach || '',
    safetyConsiderations: initialData?.safetyConsiderations ? initialData.safetyConsiderations.join('\n') : '',
    featuredImage: initialData?.featuredImage || initialData?.coverImage || '',
    coverImageIsIllustrative: initialData?.coverImageIsIllustrative || false,
    galleryImages: initialData?.galleryImages ? initialData.galleryImages.join('\n') : '',
    isFeatured: initialData?.isFeatured || initialData?.featured || false,
    publishStatus: initialData?.publishStatus || (initialData?.published ? 'PUBLISHED' : 'DRAFT'),
    seoTitle: initialData?.seo?.title || '',
    seoMetaDescription: initialData?.seo?.metaDescription || '',
  });

  const serviceMediaItems: ProjectMediaItem[] = projectServiceImagery.flatMap((service) =>
    service.images.map((image) => ({
      _id: image.src,
      title: image.alt,
      category: service.category,
      altText: image.alt,
      url: image.src,
      isServiceImagery: true,
    }))
  );

  const loadMedia = useCallback(async () => {
    setMediaLoading(true);
    setMediaError(null);
    try {
      const response = await fetch('/api/admin/media');
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Unable to load the image library.');
      }
      setMediaItems(result.data.media);
    } catch (loadError) {
      setMediaError(loadError instanceof Error ? loadError.message : 'Unable to load the image library.');
    } finally {
      setMediaLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  const toggleGalleryImage = (url: string) => {
    const images = formData.galleryImages.split('\n').map((image: string) => image.trim()).filter(Boolean);
    const nextImages = images.includes(url) ? images.filter((image: string) => image !== url) : [...images, url];
    setFormData((prev) => ({ ...prev, galleryImages: nextImages.join('\n') }));
  };

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

    setLoading(true);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      category: formData.category || formData.industry || 'Other',
      client: formData.client,
      clientPublishable: formData.clientPublishable,
      industry: formData.industry || formData.category || 'Other',
      status: formData.status || 'UPCOMING',
      country: formData.country,
      location: formData.location,
      services: formData.services,
      shortDescription: formData.shortDescription,
      description: formData.shortDescription,
      scopeOfWork: formData.scopeOfWork.split('\n').map((line: string) => line.trim()).filter(Boolean),
      technicalChallenges: formData.technicalChallenges.split('\n').map((line: string) => line.trim()).filter(Boolean),
      executionApproach: formData.executionApproach,
      safetyConsiderations: formData.safetyConsiderations.split('\n').map((line: string) => line.trim()).filter(Boolean),
      featuredImage: formData.featuredImage,
      coverImage: formData.featuredImage,
      coverImageIsIllustrative: formData.coverImageIsIllustrative,
      galleryImages: formData.galleryImages.split('\n').map((line: string) => line.trim()).filter(Boolean),
      isFeatured: formData.isFeatured,
      featured: formData.isFeatured,
      published: formData.publishStatus === 'PUBLISHED',
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
              onChange={(e) => setFormData({ ...formData, industry: e.target.value, category: e.target.value || formData.category })}
            />
            <Select
              id="category"
              label="Project Category"
              options={CATEGORY_OPTIONS}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <Select
              id="status"
              label="Project Status"
              options={PROJECT_STATUS_OPTIONS}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
              rows={3}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="High-level overview of the engineering scope delivered..."
            />
            <Textarea
              id="scopeOfWork"
              label="Delivered Scope of Work (One item per line)"
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-steel-600">
                Choose a first-party service image or an uploaded, approved project image. Upload project-specific imagery in the media library.
              </p>
              <div className="flex shrink-0 gap-3">
                <button type="button" onClick={() => void loadMedia()} className="text-xs font-bold text-navy-900 underline">
                  Reload images
                </button>
                <Link href="/admin/media" target="_blank" className="text-xs font-bold text-gold-700 underline">
                  Upload images
                </Link>
              </div>
            </div>
            {mediaError && (
              <div role="alert" className="rounded border-l-4 border-safety-red bg-safety-light p-3 text-xs text-safety-red">
                {mediaError}
              </div>
            )}
            {formData.featuredImage && (
              <div className="flex items-center gap-4 rounded border border-gold/60 bg-gold/5 p-3">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden bg-steel-100">
                  <Image src={formData.featuredImage} alt="Selected project cover image" fill unoptimized sizes="112px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy-900">Cover image selected</p>
                  <p className="truncate text-xs text-steel-600">{formData.featuredImage}</p>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, featuredImage: '', coverImageIsIllustrative: false }))}
                    className="mt-1 text-xs font-semibold text-safety-red underline"
                  >
                    Remove cover image
                  </button>
                </div>
              </div>
            )}
            {mediaLoading ? (
              <p className="py-6 text-center text-xs text-steel-500">Loading image library…</p>
            ) : mediaItems.length === 0 && serviceMediaItems.length === 0 ? (
              <p className="rounded border border-steel-200 bg-steel-50 p-4 text-xs text-steel-600">
                No uploaded images are available. Upload an approved project image to the media library, then reload this list.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {[...serviceMediaItems, ...mediaItems].map((item) => {
                  const selectedAsCover = formData.featuredImage === item.url;
                  const selectedInGallery = formData.galleryImages.split('\n').includes(item.url);
                  return (
                    <div key={item._id} className="overflow-hidden rounded border border-steel-200 bg-white">
                      <div className="relative aspect-[4/3] bg-steel-100">
                        <Image src={item.url} alt={item.altText || item.title} fill unoptimized sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />
                      </div>
                      <div className="space-y-2 p-2">
                        <p className="truncate text-[11px] font-semibold text-navy-900" title={item.title}>{item.title}</p>
                        <p className="text-[9px] font-medium uppercase tracking-wide text-steel-500">{item.category}</p>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, featuredImage: item.url, coverImageIsIllustrative: Boolean(item.isServiceImagery) }))}
                          aria-pressed={selectedAsCover}
                          className={`min-h-9 w-full rounded border px-2 text-[10px] font-bold uppercase tracking-wide ${selectedAsCover ? 'border-navy-900 bg-navy-900 text-white' : 'border-steel-300 text-navy-900 hover:bg-steel-50'}`}
                        >
                          {selectedAsCover ? 'Cover image' : 'Set as cover'}
                        </button>
                        {item.isServiceImagery ? (
                          <p className="text-center text-[9px] leading-4 text-steel-500">Capability image · cover only</p>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleGalleryImage(item.url)}
                            aria-pressed={selectedInGallery}
                            className={`min-h-9 w-full rounded border px-2 text-[10px] font-bold uppercase tracking-wide ${selectedInGallery ? 'border-gold bg-gold/20 text-navy-900' : 'border-steel-300 text-navy-900 hover:bg-steel-50'}`}
                          >
                            {selectedInGallery ? 'Remove from gallery' : 'Add to gallery'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
