'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AlertCircle, ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';

const categories = [
  'Insulation',
  'Scaffolding',
  'Coating & Painting',
  'Skilled Manpower',
  'Projects',
  'Industrial Sites',
  'Workforce',
  'Equipment',
  'General',
];

interface MediaItem {
  _id: string;
  title: string;
  category: string;
  altText: string;
  caption?: string;
  url: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
}

export function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', altText: '', caption: '', category: 'General', displayOrder: '0' });
  const [file, setFile] = useState<File | null>(null);

  const loadItems = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch('/api/admin/media');
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Unable to load media library.');
      }
      setItems(result.data.media);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load media library.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const upload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError('Choose an image file to upload.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const body = new FormData();
      body.set('image', file);
      body.set('title', form.title);
      body.set('altText', form.altText);
      body.set('caption', form.caption);
      body.set('category', form.category);
      body.set('displayOrder', form.displayOrder);
      const response = await fetch('/api/admin/media', { method: 'POST', body });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Image upload failed.');
      }
      setForm({ title: '', altText: '', caption: '', category: 'General', displayOrder: '0' });
      setFile(null);
      event.currentTarget.reset();
      await loadItems();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed.');
    } finally {
      setSaving(false);
    }
  };

  const updateItem = async (id: string, patch: Partial<MediaItem>) => {
    setError(null);
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Media update failed.');
      }
      setItems((current) => current.map((item) => (item._id === id ? result.data.media : item)));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Media update failed.');
    }
  };

  const deleteItem = async (item: MediaItem) => {
    if (!window.confirm(`Remove "${item.title}" from the public gallery?`)) return;
    setError(null);
    try {
      const response = await fetch(`/api/admin/media/${item._id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Media deletion failed.');
      }
      setItems((current) => current.filter((entry) => entry._id !== item._id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Media deletion failed.');
    }
  };

  const replaceImage = async (item: MediaItem, replacement: File) => {
    setError(null);
    try {
      const body = new FormData();
      body.set('image', replacement);
      const response = await fetch(`/api/admin/media/${item._id}`, { method: 'POST', body });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Image replacement failed.');
      }
      setItems((current) => current.map((entry) => entry._id === item._id ? result.data.media : entry));
    } catch (replaceError) {
      setError(replaceError instanceof Error ? replaceError.message : 'Image replacement failed.');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div role="alert" className="flex items-start gap-2 rounded border-l-4 border-safety-red bg-safety-light p-4 text-sm text-safety-red">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={upload} className="grid gap-4 rounded border border-steel-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div className="md:col-span-2">
          <h2 className="font-display text-2xl font-bold text-navy-950">Add a gallery image</h2>
          <p className="mt-1 text-sm text-steel-700">Images are optimized to WebP and kept inactive until you choose to publish them.</p>
        </div>
        <label className="text-xs font-semibold text-navy-900">
          Image file
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="mt-2 block w-full rounded border border-steel-300 p-2 text-sm"
          />
          <span className="mt-1 block text-xs text-steel-600">JPEG, PNG, WebP or AVIF · maximum 10 MB</span>
        </label>
        <label className="text-xs font-semibold text-navy-900">
          Image title
          <input required maxLength={160} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-2 block w-full rounded border border-steel-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-xs font-semibold text-navy-900">
          Alt text
          <input maxLength={250} value={form.altText} onChange={(event) => setForm({ ...form, altText: event.target.value })} className="mt-2 block w-full rounded border border-steel-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-xs font-semibold text-navy-900">
          Description (optional)
          <input maxLength={500} value={form.caption} onChange={(event) => setForm({ ...form, caption: event.target.value })} className="mt-2 block w-full rounded border border-steel-300 px-3 py-2 text-sm" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-semibold text-navy-900">
            Category
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-2 block w-full rounded border border-steel-300 bg-white px-3 py-2 text-sm">
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="text-xs font-semibold text-navy-900">
            Display order
            <input type="number" min="0" max="10000" value={form.displayOrder} onChange={(event) => setForm({ ...form, displayOrder: event.target.value })} className="mt-2 block w-full rounded border border-steel-300 px-3 py-2 text-sm" />
          </label>
        </div>
        <div className="md:col-span-2">
          <button disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded bg-navy-900 px-5 text-sm font-bold text-white transition hover:bg-navy-800 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload image
          </button>
        </div>
      </form>

      <section className="rounded border border-steel-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-950">Gallery assets</h2>
            <p className="mt-1 text-sm text-steel-700">Edit labels, visibility, featured status and display order.</p>
          </div>
          <span className="text-xs font-semibold text-steel-600">{items.length} item{items.length === 1 ? '' : 's'}</span>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 py-12 text-sm text-steel-700"><Loader2 className="h-4 w-4 animate-spin" />Loading media...</div>
        ) : items.length === 0 ? (
          <div className="rounded border border-dashed border-steel-300 bg-steel-50 p-10 text-center">
            <ImagePlus className="mx-auto h-8 w-8 text-steel-500" />
            <p className="mt-3 text-sm font-semibold text-navy-900">No uploaded gallery images yet</p>
            <p className="mt-1 text-sm text-steel-700">Upload a real project or capability image to publish it on the website.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item._id} className="overflow-hidden rounded border border-steel-200">
                <div className="relative aspect-[4/3] bg-steel-100">
                  <Image src={item.url} alt={item.altText || item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <div className="space-y-3 p-4">
                  <input aria-label="Image title" value={item.title} onChange={(event) => setItems((current) => current.map((entry) => entry._id === item._id ? { ...entry, title: event.target.value } : entry))} onBlur={() => void updateItem(item._id, { title: item.title })} className="w-full border-b border-steel-300 pb-1 text-sm font-semibold text-navy-900" />
                  <input aria-label="Image alt text" value={item.altText || ''} onChange={(event) => setItems((current) => current.map((entry) => entry._id === item._id ? { ...entry, altText: event.target.value } : entry))} onBlur={() => void updateItem(item._id, { altText: item.altText })} placeholder="Accessible image description" className="w-full rounded border border-steel-300 px-2 py-1 text-xs" />
                  <input aria-label="Image caption" value={item.caption || ''} onChange={(event) => setItems((current) => current.map((entry) => entry._id === item._id ? { ...entry, caption: event.target.value } : entry))} onBlur={() => void updateItem(item._id, { caption: item.caption || '' })} placeholder="Optional caption" className="w-full rounded border border-steel-300 px-2 py-1 text-xs" />
                  <div className="grid grid-cols-[1fr_5rem] gap-2">
                    <select aria-label="Image category" value={item.category} onChange={(event) => void updateItem(item._id, { category: event.target.value })} className="rounded border border-steel-300 bg-white px-2 py-1 text-xs">
                      {categories.map((category) => <option key={category}>{category}</option>)}
                    </select>
                    <input aria-label="Display order" type="number" min="0" max="10000" value={item.displayOrder} onChange={(event) => setItems((current) => current.map((entry) => entry._id === item._id ? { ...entry, displayOrder: Number(event.target.value) } : entry))} onBlur={() => void updateItem(item._id, { displayOrder: item.displayOrder })} className="w-full rounded border border-steel-300 px-2 py-1 text-xs" />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-steel-200 pt-3">
                    <label className="flex items-center gap-2 text-xs font-semibold text-navy-900">
                      <input type="checkbox" checked={item.isActive} onChange={(event) => void updateItem(item._id, { isActive: event.target.checked })} />
                      Published
                    </label>
                    <label className="cursor-pointer text-xs font-bold text-navy-900 hover:underline">
                      Replace image
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        className="sr-only"
                        onChange={(event) => {
                          const replacement = event.target.files?.[0];
                          if (replacement) void replaceImage(item, replacement);
                          event.currentTarget.value = '';
                        }}
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-navy-900">
                      <input type="checkbox" checked={item.isFeatured} onChange={(event) => void updateItem(item._id, { isFeatured: event.target.checked })} />
                      Featured
                    </label>
                    <button type="button" onClick={() => void deleteItem(item)} className="inline-flex items-center gap-1 text-xs font-bold text-safety-red hover:underline">
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
