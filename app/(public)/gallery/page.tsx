import Link from 'next/link';
import { ArrowRight, Images } from 'lucide-react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { Button } from '@/components/ui/button';

const galleryItems = [
  'Project access and scaffold erection',
  'Thermal insulation installation works',
  'Passive fire protection application',
  'Industrial site coordination',
  'Installation at process asset area',
  'Field supervision and QA review',
];

export const metadata = {
  title: 'Project Gallery | ARS EXIM',
  description: 'View industrial project work, installation activity and site execution from ARS EXIM projects.',
};

export default function GalleryPage() {
  return (
    <div className="bg-steel-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Gallery' }]} />

        <header className="my-8 max-w-3xl">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-gold-700">Project portfolio</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-navy-950 sm:text-6xl">
            Industrial project gallery.
          </h1>
          <p className="mt-4 text-base leading-7 text-steel-700 sm:text-lg">
            A gallery view of site execution, insulation work fronts, access installation and project coordination across industrial scopes.
          </p>
        </header>

        <div className="mb-8 flex items-center gap-3 rounded border border-steel-200 bg-white p-3 text-sm text-steel-700">
          <Images className="h-4 w-4 text-gold-700" />
          <span>Gallery content is managed through the admin media library and updated as project assets become available.</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((label, index) => (
            <div key={label} className="group overflow-hidden rounded border border-steel-200 bg-white">
              <div className="aspect-[4/3] bg-gradient-to-br from-[#10233f] via-[#173a68] to-[#d7e7ff] p-5 text-white">
                <div className="flex h-full items-end justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Project {index + 1}</span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em]">
                    Site
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-navy-900">{label}</p>
              </div>
            </div>
          ))}
        </div>

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
