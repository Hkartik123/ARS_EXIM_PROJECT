import { Building2 } from 'lucide-react';
import { ProjectImage } from '@/components/public/project-image';

interface ProjectCoverProps {
  src?: string;
  alt: string;
  isIllustrative?: boolean;
  sizes: string;
  className: string;
  imageClassName?: string;
}

export function ProjectCover({
  src,
  alt,
  isIllustrative,
  sizes,
  className,
  imageClassName,
}: ProjectCoverProps) {
  if (isIllustrative) {
    return (
      <div
        aria-hidden="true"
        className={`relative flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_75%_20%,rgba(55,103,145,0.55),transparent_45%),linear-gradient(135deg,#071D35_0%,#12365A_100%)] ${className}`}
      >
        <div className="absolute inset-4 border border-white/10" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
        <div className="absolute bottom-0 left-1/4 top-0 w-px bg-white/10" />
        <div className="relative flex flex-col items-center gap-3 text-white">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10">
            <Building2 className="h-7 w-7 text-[#DCE3EA]" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/75">
            Project reference
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-navy-950 ${className}`}>
      <ProjectImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={imageClassName || 'object-cover'}
      />
    </div>
  );
}
