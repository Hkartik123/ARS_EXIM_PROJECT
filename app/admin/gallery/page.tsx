export const metadata = {
  title: 'Gallery | ARS EXIM Admin',
};

export default function AdminGalleryPage() {
  return (
    <div className="space-y-6">
      <div className="rounded border border-steel-200 bg-white p-6 shadow-sm">
        <h1 className="font-display text-3xl font-bold text-navy-950">Gallery</h1>
        <p className="mt-2 text-sm text-steel-700">
          Upload, organise and manage project and site imagery within the media library.
        </p>
      </div>
      <div className="rounded border border-dashed border-steel-300 bg-steel-50 p-10 text-center text-sm text-steel-600">
        Media assets can be reviewed from the admin side and surfaced dynamically across the public gallery and portfolio pages.
      </div>
    </div>
  );
}
