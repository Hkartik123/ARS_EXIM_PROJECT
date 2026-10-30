import Image from 'next/image';

interface CompanyLogoProps {
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function CompanyLogo({ className, priority = false, sizes }: CompanyLogoProps) {
  return (
    <Image
      src="/ars-exim-logo-transparent.png"
      alt="ARS EXIM"
      width={622}
      height={522}
      priority={priority}
      sizes={sizes}
      className={`object-contain ${className ?? ''}`}
    />
  );
}
