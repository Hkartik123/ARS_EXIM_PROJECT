'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  url: string;
  altText: string;
  caption?: string;
}

export function GalleryGrid({
  images,
  isIllustrativeFallback = false,
}: {
  images: GalleryImage[];
  isIllustrativeFallback?: boolean;
}) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selected]);

  return (
    <>
      {isIllustrativeFallback && (
        <p className="mb-6 rounded border border-gold-300 bg-gold-50 p-4 text-sm leading-6 text-navy-900">
          Gallery images are being prepared. This illustrative industrial team photo is not presented as ARS EXIM project work.
        </p>
      )}
      {images.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelected(image)}
              className="group overflow-hidden rounded border border-steel-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-industrial"
              aria-label={`View image: ${image.title}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-steel-100">
                <Image
                  src={image.url}
                  alt={image.altText || image.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10233f]/75 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-[#10233f]/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  {image.category}
                </span>
              </div>
              <div className="p-5">
                {!isIllustrativeFallback && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-700">
                    Image {String(index + 1).padStart(2, '0')}
                  </p>
                )}
                <p className="mt-2 text-sm font-semibold text-navy-900">{image.title}</p>
                {image.caption && <p className="mt-2 text-xs leading-5 text-steel-700">{image.caption}</p>}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded border border-dashed border-steel-300 bg-white p-10 text-center text-sm text-steel-700">
          No active gallery images are available yet.
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071521]/85 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div role="dialog" aria-modal="true" aria-label={selected.title} className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#10233f] text-white"
              aria-label="Close gallery image"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative h-[55vh] min-h-[260px] max-h-[650px] bg-steel-100">
              <Image
                src={selected.url}
                alt={selected.altText || selected.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="p-6 sm:p-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-700">{selected.category}</span>
              <h2 className="mt-2 font-display text-3xl font-bold text-navy-950">{selected.title}</h2>
              {selected.caption && <p className="mt-2 text-sm leading-6 text-steel-700">{selected.caption}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
