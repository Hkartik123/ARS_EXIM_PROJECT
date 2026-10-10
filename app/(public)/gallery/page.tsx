import { prisma } from '@/lib/db/prisma';
import Link from 'next/link';
import { ArrowRight, Images } from 'lucide-react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { Button } from '@/components/ui/button';
import { GalleryGrid, GalleryImage } from '@/components/public/gallery-grid';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Project Gallery | ARS EXIM',
  description: 'Industrial capability and project images managed by ARS EXIM.',
};

async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const items = await prisma.media.findMany({
    where: { isDeleted: false, isActive: true },
    orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
  });
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      url: item.url,
      altText: item.altText || '',
      caption: item.caption || undefined,
    }));
  } catch (error) {
    console.error('Failed to load gallery images:', error);
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getGalleryImages();
  const isIllustrativeFallback = images.length === 0;
  const displayedImages = isIllustrativeFallback
    ? [{
        id: 'illustrative-industrial-team',
        title: 'Industrial project team at work',
        category: 'Illustrative',
        url: '/images/industrial-site-team.webp',
        altText: 'Industrial workers in safety helmets and high-visibility clothing gathered at a project site.',
      }]
    : images;

  return (
    <div className="bg-steel-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Gallery' }]} />

        <header className="my-8 max-w-4xl">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-gold-700">Project portfolio</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-navy-950 sm:text-6xl">Our work in action.</h1>
          <p className="mt-4 text-base leading-7 text-steel-700 sm:text-lg">
            A glimpse into industrial expertise, field execution and technical capabilities across insulation, scaffolding, painting and manpower support.
          </p>
        </header>

        <div className="mb-8 flex items-center gap-3 rounded border border-steel-200 bg-white p-3 text-sm text-steel-700">
          <Images className="h-4 w-4 shrink-0 text-gold-700" />
          <span>Published gallery assets are selected and maintained in the admin media library.</span>
        </div>

        <GalleryGrid images={displayedImages} isIllustrativeFallback={isIllustrativeFallback} />

        <div className="mt-12 flex justify-center">
          <Link href="/projects">
            <Button variant="secondary" size="lg">
              View project references
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
