export function normalizeProjectRecord(project: any) {
  if (!project) return null;

  const normalized = { ...project };
  const id = normalized._id ? normalized._id.toString() : normalized.id;

  normalized.id = id;
  normalized._id = id;
  normalized.slug = normalized.slug || '';
  normalized.title = normalized.title || 'Untitled project';
  normalized.category = normalized.category || normalized.industry || 'Other';
  normalized.industry = normalized.industry || normalized.category || 'Other';
  normalized.clientName = normalized.clientName || normalized.client || '';
  normalized.client = normalized.client || normalized.clientName || '';
  normalized.coverImage = normalized.coverImage || normalized.featuredImage || '';
  normalized.featuredImage = normalized.featuredImage || normalized.coverImage || '/images/industrial-site-team.webp';
  normalized.galleryImages = Array.isArray(normalized.galleryImages) ? normalized.galleryImages : [];
  normalized.services = Array.isArray(normalized.services) ? normalized.services : [];
  normalized.shortDescription = normalized.shortDescription || normalized.description || 'Project summary coming soon.';
  normalized.description = normalized.description || normalized.shortDescription || '';
  normalized.published = normalized.published ?? normalized.publishStatus === 'PUBLISHED';
  normalized.featured = normalized.featured ?? normalized.isFeatured ?? false;
  normalized.isFeatured = normalized.isFeatured ?? normalized.featured ?? false;
  normalized.status = normalized.status || normalized.projectStatus || '';
  normalized.location = normalized.location || '';
  normalized.country = normalized.country || '';

  return normalized;
}

export function toPublicProjectRecord(project: any) {
  const normalized = normalizeProjectRecord(project);
  if (!normalized) return null;

  const publicProject = {
    _id: normalized._id,
    id: normalized.id,
    slug: normalized.slug,
    title: normalized.title,
    category: normalized.category,
    industry: normalized.industry,
    country: normalized.country,
    location: normalized.location,
    status: normalized.status,
    services: normalized.services,
    shortDescription: normalized.shortDescription,
    description: normalized.description,
    scopeOfWork: normalized.scopeOfWork,
    technicalChallenges: normalized.technicalChallenges,
    executionApproach: normalized.executionApproach,
    safetyConsiderations: normalized.safetyConsiderations,
    featuredImage: normalized.featuredImage,
    coverImage: normalized.coverImage,
    coverImageIsIllustrative: normalized.coverImageIsIllustrative,
    galleryImages: normalized.galleryImages,
    isFeatured: normalized.isFeatured,
    featured: normalized.featured,
    published: normalized.published,
    publishStatus: normalized.publishStatus,
    createdAt: normalized.createdAt,
    updatedAt: normalized.updatedAt,
    seo: normalized.seo,
  };

  if (normalized.clientPublishable && normalized.client) {
    return { ...publicProject, client: normalized.client, clientName: normalized.client };
  }

  return publicProject;
}

export function normalizeProjectPayload(input: any = {}) {
  const payload = { ...input };
  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  const slugSource = typeof payload.slug === 'string' && payload.slug.trim() ? payload.slug.trim() : title;

  payload.title = title;
  payload.slug = slugSource
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'project';

  payload.category = payload.category || payload.industry || 'Other';
  payload.industry = payload.industry || payload.category || 'Other';
  payload.clientName = payload.clientName || payload.client || '';
  payload.client = payload.client || payload.clientName || '';
  payload.coverImage = payload.coverImage || payload.featuredImage || '';
  payload.featuredImage = payload.featuredImage || payload.coverImage || '/images/industrial-site-team.webp';
  payload.galleryImages = Array.isArray(payload.galleryImages) ? payload.galleryImages : [];
  payload.services = Array.isArray(payload.services) ? payload.services.filter(Boolean) : [];
  payload.scopeOfWork = Array.isArray(payload.scopeOfWork) ? payload.scopeOfWork.filter(Boolean) : [];
  payload.technicalChallenges = Array.isArray(payload.technicalChallenges) ? payload.technicalChallenges.filter(Boolean) : [];
  payload.safetyConsiderations = Array.isArray(payload.safetyConsiderations) ? payload.safetyConsiderations.filter(Boolean) : [];
  payload.shortDescription = payload.shortDescription || payload.description || '';
  payload.description = payload.description || payload.shortDescription || '';
  payload.published = payload.published ?? payload.publishStatus === 'PUBLISHED';
  payload.featured = payload.featured ?? payload.isFeatured ?? false;
  payload.isFeatured = payload.isFeatured ?? payload.featured ?? false;
  payload.publishStatus = payload.publishStatus || (payload.published ? 'PUBLISHED' : 'DRAFT');
  if (!payload.status) {
    delete payload.status;
  }

  if (payload.seo) {
    payload.seo = {
      title: payload.seo.title || payload.title,
      metaDescription: payload.seo.metaDescription || payload.shortDescription,
    };
  }

  return payload;
}

export function normalizeProjectForPersistence(input: any = {}, previous?: any) {
  const normalized = normalizeProjectPayload({ ...previous, ...input });
  const isPublished = normalized.publishStatus === 'PUBLISHED' || Boolean(normalized.published);
  const publishedAt = isPublished
    ? normalized.publishedAt || previous?.publishedAt || new Date()
    : null;

  const {
    id: _id,
    _id: _legacyId,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...data
  } = normalized;

  return {
    ...data,
    published: isPublished,
    publishStatus: isPublished && normalized.publishStatus === 'PUBLISHED' ? 'PUBLISHED' : normalized.publishStatus,
    publishedAt,
    featuredImage: normalized.featuredImage || normalized.coverImage || '/images/industrial-site-team.webp',
    coverImage: normalized.coverImage || normalized.featuredImage || '',
    isFeatured: Boolean(normalized.isFeatured ?? normalized.featured),
    featured: Boolean(normalized.featured ?? normalized.isFeatured),
  };
}
