import { describe, expect, it } from 'vitest';
import { normalizeProjectForPersistence } from './normalize';

describe('normalizeProjectForPersistence', () => {
  it('normalizes publication, image aliases, and featured aliases', () => {
    const project = normalizeProjectForPersistence({
      title: 'Test project',
      publishStatus: 'PUBLISHED',
      coverImage: '/images/cover.webp',
      featured: true,
    });

    expect(project).toMatchObject({
      published: true,
      publishStatus: 'PUBLISHED',
      featured: true,
      isFeatured: true,
      coverImage: '/images/cover.webp',
      featuredImage: '/images/cover.webp',
    });
    expect(project.publishedAt).toBeInstanceOf(Date);
  });

  it('preserves an existing publication date and clears it for drafts', () => {
    const publishedAt = new Date('2025-05-01T00:00:00.000Z');
    const published = normalizeProjectForPersistence(
      { publishStatus: 'PUBLISHED' },
      { publishedAt }
    );
    const draft = normalizeProjectForPersistence(
      { publishStatus: 'DRAFT', published: false },
      { publishedAt }
    );

    expect(published.publishedAt).toBe(publishedAt);
    expect(draft.published).toBe(false);
    expect(draft.publishedAt).toBeNull();
  });
});
