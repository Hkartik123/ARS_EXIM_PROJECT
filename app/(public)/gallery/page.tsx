import { prisma } from '@/lib/db/prisma';
import Link from 'next/link';
import { ArrowRight, Images } from 'lucide-react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { Button } from '@/components/ui/button';
import { GalleryGrid, GalleryImage } from '@/components/public/gallery-grid';
import { LoadError } from '@/components/public/load-error';
import { clientSiteImages } from '@/lib/projects/client-site-imagery';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Project Gallery | ARS EXIM',
  description: 'Client-provided industrial site photography and approved images managed by ARS EXIM.',
};

async function getGalleryImages(): Promise<{ images: GalleryImage[]; hasLoadError: boolean }> {
  try {
    const items = await prisma.media.findMany({
      where: { isDeleted: false, isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
    });
    const mediaImages = items
      .filter((item) => !clientSiteImages.some((image) => image.url === item.url))
      .map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        url: item.url,
        altText: item.altText || '',
        caption: item.caption || undefined,
      }));
    return { images: [...clientSiteImages, ...mediaImages], hasLoadError: false };
  } catch (error) {
    console.error('Failed to load gallery images:', error);
    return { images: [...clientSiteImages], hasLoadError: true };
  }
}

export default async function GalleryPage() {
  const { images, hasLoadError } = await getGalleryImages();

  return (
    <div className="bg-steel-50 py-12">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Gallery' }]} />

        <header className="my-8 max-w-4xl">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Industrial photography</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-navy-950 sm:text-6xl">Industrial Gallery</h1>
          <p className="mt-4 text-base leading-7 text-steel-700 sm:text-lg">
            Client-provided industrial site photography and approved images. Captions are limited to details that have been verified.
          </p>
        </header>

        {hasLoadError ? (
          <div className="mb-8">
            <LoadError
              title="Some gallery images could not be loaded"
              message="The client-provided photograph is still available below. Try again to reload published media."
            />
          </div>
        ) : (
          <div className="mb-8 flex items-center gap-3 rounded border border-steel-200 bg-white p-3 text-sm text-steel-700">
            <Images className="h-4 w-4 shrink-0 text-accent-700" />
            <span>Published gallery assets are selected and maintained in the admin media library.</span>
          </div>
        )}

        <GalleryGrid images={images} />

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
