'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const FALLBACK_IMAGE = '/images/industrial-site-team.webp';

interface ProjectImageProps {
  src?: string;
  alt: string;
  className?: string;
  sizes: string;
  fill?: boolean;
}

export function ProjectImage({ src, alt, className, sizes, fill = false }: ProjectImageProps) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK_IMAGE);

  useEffect(() => {
    setImageSrc(src || FALLBACK_IMAGE);
  }, [src]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      className={className}
      sizes={sizes}
      fill={fill}
      unoptimized
      onError={() => setImageSrc(FALLBACK_IMAGE)}
    />
  );
}
