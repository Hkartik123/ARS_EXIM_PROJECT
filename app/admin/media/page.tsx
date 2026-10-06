import { MediaLibrary } from '@/components/admin/media-library';

export const metadata = {
  title: 'Media Library | ARS EXIM Admin',
};

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div className="rounded border border-steel-200 bg-white p-6 shadow-sm">
        <h1 className="font-display text-3xl font-bold text-navy-950">Media Library</h1>
        <p className="mt-2 text-sm text-steel-700">
          Upload, organize, publish and order industrial imagery used by the public gallery.
        </p>
      </div>
      <MediaLibrary />
    </div>
  );
}
