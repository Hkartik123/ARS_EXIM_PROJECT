'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

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
}: {
  images: GalleryImage[];
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(images.map((image) => image.category || 'Uncategorized')))],
    [images]
  );
  const filteredImages = useMemo(
    () =>
      selectedCategory === 'All'
        ? images
        : images.filter((image) => (image.category || 'Uncategorized') === selectedCategory),
    [images, selectedCategory]
  );
  const selected = selectedIndex === null ? null : filteredImages[selectedIndex] || null;

  useEffect(() => {
    if (selectedIndex === null || !selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedIndex(null);
        openerRef.current?.focus();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setSelectedIndex((index) => (index === null ? 0 : (index - 1 + filteredImages.length) % filteredImages.length));
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setSelectedIndex((index) => (index === null ? 0 : (index + 1) % filteredImages.length));
      } else if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredImages.length, selected, selectedIndex]);

  const closeGallery = () => {
    setSelectedIndex(null);
    openerRef.current?.focus();
  };

  return (
    <>
      {images.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2" aria-label="Filter gallery by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => {
                setSelectedIndex(null);
                setSelectedCategory(category);
              }}
              className={`min-h-11 rounded-full px-4 py-2 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                selectedCategory === category
                  ? 'bg-navy-900 text-white'
                  : 'border border-steel-200 bg-white text-steel-700 hover:border-navy-900 hover:text-navy-900'
              }`}
            >
              {category === 'All' ? 'All images' : category}
            </button>
          ))}
        </div>
      )}

      {filteredImages.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setSelectedIndex(index);
              }}
              className="group overflow-hidden rounded border border-steel-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-industrial focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
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
                  {image.category || 'Uncategorized'}
                </span>
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-navy-900">{image.title}</p>
                {image.caption && <p className="mt-2 text-xs leading-5 text-steel-700">{image.caption}</p>}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded border border-dashed border-steel-300 bg-white p-10 text-center text-sm text-steel-700">
          No images are available in this category yet.
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071521]/85 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeGallery();
          }}
        >
          <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={selected.title} className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeGallery}
              className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#10233f] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:right-4 sm:top-4"
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
              {filteredImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedIndex((index) => (index === null ? 0 : (index - 1 + filteredImages.length) % filteredImages.length))}
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#10233f]/90 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIndex((index) => (index === null ? 0 : (index + 1) % filteredImages.length))}
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#10233f]/90 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            <div className="p-6 sm:p-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-700">{selected.category || 'Uncategorized'}</span>
              <h2 className="mt-2 font-display text-3xl font-bold text-navy-950">{selected.title}</h2>
              {selected.caption && <p className="mt-2 text-sm leading-6 text-steel-700">{selected.caption}</p>}
              {filteredImages.length > 1 && (
                <p className="mt-4 text-xs font-medium text-steel-500" aria-live="polite">
                  {selectedIndex === null ? 0 : selectedIndex + 1} of {filteredImages.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
