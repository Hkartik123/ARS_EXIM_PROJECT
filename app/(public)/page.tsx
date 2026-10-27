import { prisma } from '@/lib/db/prisma';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Flame,
  Layers3,
  Mail,
  MapPin,
  Paintbrush2,
  Phone,
  ShieldCheck,
  Snowflake,
  Users,
  Warehouse,
  Waves,
} from 'lucide-react';
import { ContactForm } from '@/components/public/contact-form';
import { UNVERIFIED_SEED_PROJECT_SLUGS } from '@/lib/projects/visibility';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Global Trade & Industrial Services',
  description:
    'ARS EXIM Global Solutions supports industrial project teams with insulation, passive fire protection, scaffolding, coating and painting, and skilled manpower.',
};

const serviceDisciplines = [
  {
    number: '01',
    title: 'Hot insulation',
    label: 'THERMAL SYSTEMS',
    description:
      'Thermal insulation for hot-service lines, vessels and equipment, defined against project requirements.',
    href: '/services/hot-insulation',
    icon: Layers3,
  },
  {
    number: '02',
    title: 'Cold & cryogenic insulation',
    label: 'LOW-TEMPERATURE SYSTEMS',
    description:
      'Insulation enquiries for low-temperature assets, with requirements aligned to project documentation.',
    href: '/services/cold-cryogenic-insulation',
    icon: Snowflake,
  },
  {
    number: '03',
    title: 'Passive fire protection',
    label: 'STRUCTURAL STEEL · PFP',
    description:
      'Fire protection scope for structural steel and process assets, coordinated to the specified system.',
    href: '/services/passive-fire-protection',
    icon: Flame,
  },
  {
    number: '04',
    title: 'Scaffolding & access',
    label: 'TEMPORARY ACCESS',
    description:
      'Access requirements for maintenance and project work, planned around the work front and site constraints.',
    href: '/services/scaffolding',
    icon: Building2,
  },
  {
    number: '05',
    title: 'Coating & painting',
    label: 'SURFACE PROTECTION',
    description:
      'Industrial coating and painting solutions for surface protection and project-specific asset requirements.',
    href: '/services/coating-and-painting',
    icon: Paintbrush2,
  },
  {
    number: '06',
    title: 'Skilled manpower',
    label: 'PROJECT SUPPORT',
    description:
      'Skilled personnel for insulation, coating, painting, scaffolding and related industrial project scopes.',
    href: '/services/skilled-manpower',
    icon: Users,
  },
];

const industries = [
  { title: 'Oil & gas', icon: Waves },
  { title: 'Petrochemical', icon: Building2 },
  { title: 'Refineries', icon: Warehouse },
  { title: 'Energy & power', icon: Layers3 },
  { title: 'Industrial plants', icon: ShieldCheck },
  { title: 'Process industries', icon: Flame },
];

async function getFeaturedProjects() {
  try {
    return await prisma.project.findMany({
      where: {
        publishStatus: 'PUBLISHED',
        isDeleted: false,
        slug: { notIn: UNVERIFIED_SEED_PROJECT_SLUGS },
        NOT: { featuredImage: { contains: 'images.unsplash.com', mode: 'insensitive' } },
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: 4,
    });
  } catch (error) {
    console.error('Failed to load featured projects:', error);
    return [];
  }
}

async function getFeaturedMedia() {
  try {
    const images = await prisma.media.findMany({
      where: { isDeleted: false, isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: 3,
    });
    return images.map((image) => ({
      id: image.id,
      title: image.title,
      category: image.category,
      url: image.url,
      altText: image.altText || image.title,
    }));
  } catch (error) {
    console.error('Failed to load featured gallery images:', error);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProjects, featuredMedia] = await Promise.all([
    getFeaturedProjects(),
    getFeaturedMedia(),
  ]);
  const galleryImages = featuredMedia.length > 0
    ? featuredMedia
    : [{
        id: 'illustrative-industrial-team',
        title: 'Industrial project team at work',
        category: 'Illustrative',
        url: '/images/industrial-site-team.webp',
        altText: 'Industrial workers in safety helmets at a project site.',
      }];

  return (
    <div className="overflow-hidden">
      <section
        aria-labelledby="home-title"
        className="relative isolate flex min-h-[680px] items-center overflow-hidden bg-[#071D38] text-white sm:min-h-[720px]"
      >
        <Image
          src="/images/corporate-harbor.webp"
          alt="Container ship at a commercial port surrounded by gantry cranes."
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#071D38] via-[#071D38]/90 to-[#071D38]/35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#071D38]/70 via-transparent to-[#071D38]/10"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 640 440"
          fill="none"
          className="pointer-events-none absolute right-0 top-1/2 hidden h-[85%] w-[52%] -translate-y-1/2 opacity-30 lg:block"
        >
          <path d="M92 231C176 145 241 309 326 207S475 145 557 234" stroke="white" strokeWidth="1.5" strokeDasharray="5 8" />
          <path d="M129 89C199 161 229 277 199 354M313 47C282 155 284 286 334 397M466 82C405 172 410 296 482 364" stroke="white" strokeOpacity=".55" />
          <circle cx="92" cy="231" r="5" fill="#C4CED8" />
          <circle cx="326" cy="207" r="5" fill="#C4CED8" />
          <circle cx="557" cy="234" r="5" fill="#C4CED8" />
        </svg>

        <div className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-12">
          <div className="home-reveal max-w-3xl">
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#C4CED8] sm:text-sm">
              <span className="h-px w-9 bg-[#C4CED8]" />
              Global trade <span className="text-white/45">|</span> Stronger together
            </p>
            <h1
              id="home-title"
              className="max-w-3xl font-sans text-5xl font-bold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl"
            >
              Connecting Businesses
              <br className="hidden sm:block" /> Across Borders
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              ARS EXIM supports industrial project teams with insulation, passive fire protection,
              scaffolding, coating and painting, and skilled manpower. Share your scope, location
              and schedule to start a project discussion.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#services"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-white px-6 text-sm font-bold text-[#071D38] transition-colors hover:bg-[#C4CED8]"
              >
                Explore Our Services <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-white/50 px-6 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Contact Us <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
              Industrial insulation <span className="mx-2 text-[#C4CED8]">/</span> PFP
              <span className="mx-2 text-[#C4CED8]">/</span> Access
              <span className="mx-2 text-[#C4CED8]">/</span> Coatings
            </p>
          </div>
        </div>
        <span className="absolute bottom-4 right-5 text-[10px] font-medium tracking-wide text-white/60 sm:right-8">
          Illustrative commercial port imagery
        </span>
      </section>

      <section id="about" className="scroll-mt-24 bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.19em] text-[#527493]">
              About ARS EXIM
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-[-0.035em] text-[#071D38] sm:text-5xl">
              Specialist support for industrial project requirements.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#526273]">
              ARS EXIM brings industrial insulation, passive fire protection, scaffolding and access,
              coating and painting, and skilled manpower into one project enquiry. Each work package
              is shaped around the client’s assets, specifications, site conditions and required interfaces.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {['Insulation', 'Passive fire protection', 'Scaffolding & access', 'Coating & painting', 'Skilled manpower'].map((capability) => (
                <span
                  key={capability}
                  className="border border-[#D7E0E8] bg-[#F2F5F8] px-3 py-2 text-xs font-semibold text-[#12365A]"
                >
                  {capability}
                </span>
              ))}
            </div>
            <Link
              href="/about"
              className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#12365A] transition-colors hover:text-[#527493]"
            >
              More about the company <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -left-3 -top-3 h-full w-full border border-[#C4CED8] sm:-left-5 sm:-top-5" />
            <div className="relative overflow-hidden bg-[#F2F5F8]">
              <Image
                src="/images/industrial-site-team.webp"
                alt="Industrial workers in safety equipment at a project site."
                width={1600}
                height={1067}
                sizes="(max-width: 1024px) 100vw, 44vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#071D38]/80 to-transparent p-5 pt-16 text-white sm:p-7 sm:pt-20">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C4CED8]">ARS EXIM</p>
                  <p className="mt-1 font-semibold">EXpert Insulation Management</p>
                </div>
                <Image
                  src="/ars-exim-logo-transparent.png"
                  alt="ARS EXIM Global Solutions logo"
                  width={622}
                  height={522}
                  className="h-14 w-auto rounded-sm bg-white p-1.5 sm:h-16"
                />
              </div>
            </div>
            <p className="mt-2 text-right text-[10px] text-[#69798A]">Illustrative industrial site image</p>
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 bg-[#F2F5F8] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.19em] text-[#527493]">
                Our services
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-[-0.035em] text-[#071D38] sm:text-5xl">
                The right expertise for the work in front of you.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#526273] sm:text-base">
              Explore ARS EXIM’s specialist service areas. Final scope, materials, standards and
              acceptance criteria are confirmed against project documents.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceDisciplines.map(({ number, title, label, description, href, icon: Icon }) => (
              <Link
                key={number}
                href={href}
                className="group flex min-h-[258px] flex-col border border-[#D7E0E8] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#527493] hover:shadow-[0_16px_40px_-24px_rgba(7,29,56,.45)] sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.14em] text-[#8798A8]">{number}</span>
                  <span className="flex h-11 w-11 items-center justify-center bg-[#E8EEF3] text-[#12365A] transition-colors group-hover:bg-[#12365A] group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.16em] text-[#527493]">{label}</p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-[#071D38]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#526273]">{description}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-bold uppercase tracking-wider text-[#12365A]">
                  View service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/services"
              className="inline-flex min-h-11 items-center gap-2 border border-[#12365A] px-5 text-sm font-bold text-[#12365A] transition-colors hover:bg-[#12365A] hover:text-white"
            >
              View all services <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="industries" className="scroll-mt-24 bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.19em] text-[#527493]">Industries</p>
              <h2 className="mt-4 max-w-xl text-4xl font-bold leading-tight tracking-[-0.035em] text-[#071D38] sm:text-5xl">
                Industrial needs, understood in context.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[#526273] sm:text-base">
              ARS EXIM reviews enquiries for relevant industrial sectors according to the defined
              scope, site conditions and project documents. These are potential application areas,
              not claims of past project history.
            </p>
          </div>
          <div className="mt-9 grid border-l border-t border-[#D7E0E8] sm:grid-cols-2 lg:grid-cols-3">
            {industries.map(({ title, icon: Icon }) => (
              <div
                key={title}
                className="flex min-h-[94px] items-center gap-4 border-b border-r border-[#D7E0E8] px-5 py-5 sm:px-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#F2F5F8] text-[#527493]">
                  <Icon className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-[#182536]">{title}</span>
              </div>
            ))}
          </div>
          <Link
            href="/industries"
            className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#12365A] hover:text-[#527493]"
          >
            Explore industries <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[#071D38] py-20 text-white sm:py-24">
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.12]">
          <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
            <g fill="none" stroke="#C4CED8" strokeWidth="1">
              <path d="M104 180l48-33 42 13 12 30 48 13 9 23-25 16 11 31-31 16-9 37-30 6-14-25-37 5-15-34-33-2 8-37-23-23 13-27-15-21 41-8zM274 350l36 8 21 25-16 21 9 28-24 34-15-17-1-37-20-20 10-42zM485 175l38-19 35 12 23-18 37 21 13 26 41 2 28 26-18 28-36 3-10 34-29 12-17 35-30 4-24 32-27-15 2-36-26-22 8-37-29-24 14-29-31-13 13-22-20-20zM657 164l48-16 45 14 29-8 39 28 11 29-28 15-7 32-35 5-26 24-37-8-20-25-40-7-13-34 25-15-6-34zM797 267l35-13 38 14 14 26 36 13 17 36-26 22-4 38-31 22-17-19-32 8-18-33-23-17 11-35-20-24 20-38zM1011 171l29-21 47 10 29-13 43 23 25 37-17 22-39-5-21 20-31-14-35 10-29-18-42-5-12-25 32-21-9-20zM1136 289l31-18 38 13 7 28-28 26-6 34-29 4-18-25-25-13 3-29z" />
              <path d="M133 205c168-82 266 208 462 48s342-138 525-5" strokeDasharray="5 9" />
              <path d="M210 216c165 8 301 5 417 34s282 63 470 7" strokeOpacity=".7" />
            </g>
            <g fill="#C4CED8">
              <circle cx="133" cy="205" r="4" /><circle cx="595" cy="253" r="4" /><circle cx="1120" cy="248" r="4" />
            </g>
          </svg>
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.19em] text-[#C4CED8]">
              Global trade · Business capabilities
            </p>
            <h2 className="mt-4 max-w-xl text-4xl font-bold leading-tight tracking-[-0.035em] sm:text-5xl">
              Connected thinking. Project-specific execution.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              Industrial work can involve multiple disciplines, site interfaces and supply
              considerations. ARS EXIM works from the scope and requirements shared by each
              project team to shape a practical service enquiry.
            </p>
            <Link
              href="/request-a-quote"
              className="mt-8 inline-flex min-h-12 items-center gap-2 bg-white px-5 text-sm font-bold text-[#071D38] transition-colors hover:bg-[#C4CED8]"
            >
              Discuss your requirements <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="border border-white/20 bg-white/[0.04] p-5 sm:p-7">
            <div className="flex items-center gap-3 border-b border-white/15 pb-4">
              <MapPin className="h-5 w-5 text-[#C4CED8]" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/85">
                An illustrative view of connected trade
              </p>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ['01', 'Project scope'],
                ['02', 'Site requirements'],
                ['03', 'Service coordination'],
              ].map(([number, title]) => (
                <div key={number} className="border-l border-[#C4CED8]/55 pl-3 sm:pl-4">
                  <span className="text-[10px] font-bold tracking-wider text-[#C4CED8]">{number}</span>
                  <p className="mt-2 text-xs font-semibold leading-5 text-white sm:text-sm">{title}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[11px] leading-5 text-white/55">
              Map and route graphics are illustrative and do not indicate ARS EXIM offices,
              destinations or operating coverage.
            </p>
          </div>
        </div>
      </section>

      {galleryImages.length > 0 && (
        <section className="bg-[#F2F5F8] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.19em] text-[#527493]">Project gallery</p>
                <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-[-0.035em] text-[#071D38] sm:text-5xl">
                  Industrial execution in the field.
                </h2>
              </div>
              <Link
                href="/gallery"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#12365A] hover:text-[#527493]"
              >
                View gallery <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {galleryImages.map((item) => (
                <Link
                  key={item.id}
                  href="/gallery"
                  className="group overflow-hidden border border-[#D7E0E8] bg-white transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(7,29,56,.45)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#D7E0E8]">
                    <Image
                      src={item.url}
                      alt={item.altText}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-4 top-4 bg-[#071D38]/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-5">
                    <h3 className="text-lg font-bold text-[#071D38]">{item.title}</h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-[#527493]" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
            {featuredMedia.length === 0 && (
              <p className="mt-4 text-xs leading-5 text-[#69798A]">
                This illustrative image is not represented as ARS EXIM project photography.
              </p>
            )}
          </div>
        </section>
      )}

      {featuredProjects.length > 0 && (
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.19em] text-[#527493]">Published projects</p>
                <h2 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] text-[#071D38] sm:text-5xl">
                  Selected project references.
                </h2>
              </div>
              <Link
                href="/projects"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#12365A] hover:text-[#527493]"
              >
                All projects <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProjects.map((project, index) => (
                <Link href={`/projects/${project.slug}`} key={project.slug} className="group min-w-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#D7E0E8]">
                    <Image
                      src={project.featuredImage || '/images/industrial-site-team.webp'}
                      alt={project.coverImageIsIllustrative ? `Service capability image related to ${project.title}; not project-site photography` : project.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-sm font-bold text-[#071D38]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {project.coverImageIsIllustrative && (
                      <span className="absolute bottom-3 left-3 bg-[#071D38]/85 px-2 py-1 text-[9px] font-semibold text-white">
                        Service imagery · not site photography
                      </span>
                    )}
                  </div>
                  <div className="border-b border-[#D7E0E8] py-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#69798A]">
                      {project.location}, {project.country}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-[#071D38]">{project.title}</h3>
                    {project.shortDescription && (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#526273]">{project.shortDescription}</p>
                    )}
                    {(project.services || []).length > 0 && (
                      <span className="mt-3 block text-[10px] font-bold uppercase tracking-wider text-[#527493]">
                        {project.services.map((service) => service.replace(/-/g, ' ')).join(' · ')}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="scroll-mt-24 bg-[#F2F5F8] py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14 lg:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.19em] text-[#527493]">Contact ARS EXIM</p>
            <h2 className="mt-4 text-4xl font-bold leading-tight tracking-[-0.035em] text-[#071D38] sm:text-5xl">
              Let’s discuss your project requirements.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#526273] sm:text-base">
              Share the work location, service needed, project type and target schedule to start
              an enquiry with the team.
            </p>
            <div className="mt-8 space-y-4 border-t border-[#D7E0E8] pt-6 text-sm">
              <a href="tel:+919764425426" className="flex min-h-11 items-center gap-3 font-semibold text-[#12365A] hover:text-[#527493]">
                <Phone className="h-4 w-4 shrink-0 text-[#527493]" aria-hidden="true" />
                +91 9764 425 426
              </a>
              <a href="mailto:info@arsexim.com" className="flex min-h-11 items-center gap-3 font-semibold text-[#12365A] hover:text-[#527493]">
                <Mail className="h-4 w-4 shrink-0 text-[#527493]" aria-hidden="true" />
                info@arsexim.com
              </a>
              <p className="flex items-center gap-3 text-xs leading-5 text-[#69798A]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#527493]" aria-hidden="true" />
                Project requirements and acceptance criteria are confirmed against your documents.
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
