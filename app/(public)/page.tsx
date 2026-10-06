import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  HardHat,
  Layers3,
  Paintbrush2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Project } from '@/models/Project';
import { Media } from '@/models/Media';
import { UNVERIFIED_SEED_PROJECT_SLUGS } from '@/lib/projects/visibility';

export const dynamic = 'force-dynamic';

const serviceDisciplines = [
  {
    number: '01',
    title: 'Industrial insulation',
    label: 'HOT · COLD · CRYOGENIC',
    description:
      'Insulation scope for process piping, vessels and temperature-controlled systems, defined against project requirements.',
    href: '/services/industrial-insulation',
    icon: Layers3,
  },
  {
    number: '02',
    title: 'Passive fire protection',
    label: 'STRUCTURAL STEEL · PFP',
    description:
      'Fire protection scope for structural steel and process assets, coordinated to the specified system and project documents.',
    href: '/services/passive-fire-protection',
    icon: Flame,
  },
  {
    number: '03',
    title: 'Scaffolding & access',
    label: 'ENGINEERED TEMPORARY ACCESS',
    description:
      'Temporary access requirements for maintenance and project work, planned around the work front and site constraints.',
    href: '/services/scaffolding',
    icon: HardHat,
  },
  {
    number: '04',
    title: 'Coating and painting',
    label: 'SURFACE PROTECTION · DURABILITY',
    description:
      'Professional industrial coating and painting solutions designed to support surface protection, corrosion resistance and long-term asset performance.',
    href: '/services/coating-and-painting',
    icon: Paintbrush2,
  },
  {
    number: '05',
    title: 'Skilled manpower',
    label: 'INDUSTRIAL PROJECT SUPPORT',
    description:
      'Provision of skilled and experienced manpower for industrial insulation, coating, painting, scaffolding and related project requirements.',
    href: '/services/skilled-manpower',
    icon: Users,
  },
];

async function getFeaturedProjects() {
  try {
    await connectToDatabase();
    const projects = await Project.find({
      publishStatus: 'PUBLISHED',
      isDeleted: false,
      slug: { $nin: UNVERIFIED_SEED_PROJECT_SLUGS },
      featuredImage: { $not: /images\.unsplash\.com/i },
    })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(4)
      .lean();
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to load featured projects:', error);
    return [];
  }
}

async function getFeaturedMedia() {
  try {
    await connectToDatabase();
    const images = await Media.find({ isDeleted: false, isActive: true })
      .sort({ isFeatured: -1, displayOrder: 1, createdAt: -1 })
      .limit(3)
      .lean();
    return images.map((image) => ({
      id: image._id.toString(),
      title: image.title,
      category: image.category,
      url: image.url,
      altText: image.altText || image.title,
      isFeatured: image.isFeatured,
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
  const hasPublishedProjects = featuredProjects.length > 0;
  const galleryImages = featuredMedia.length > 0
    ? featuredMedia
    : [{
        id: 'illustrative-industrial-team',
        title: 'Industrial project team at work',
        category: 'Illustrative',
        url: '/images/industrial-site-team.webp',
        altText: 'Industrial workers in safety helmets and high-visibility clothing gathered at a project site.',
      }];
  const heroImage = featuredMedia.find((image) => image.isFeatured)?.url || '/images/industrial-site-team.webp';

  return (
    <div className="overflow-hidden">
      <section className="relative isolate overflow-hidden bg-[#10233f] text-white">
        <div aria-hidden="true" className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
        <div className="relative mx-auto grid min-h-[640px] w-full max-w-7xl items-center gap-8 px-5 pb-14 pt-24 sm:px-8 sm:py-20 lg:min-h-[690px] lg:grid-cols-[1fr_0.9fr] lg:px-12">
          <div className="home-reveal max-w-4xl">
            <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-gold-100">
              <span className="h-px w-10 bg-gold" />
              ARS EXIM · Specialist industrial contractor
            </div>
            <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.96] text-white sm:text-6xl lg:text-7xl">
              ARS EXIM
            </h1>
            <p className="mt-3 max-w-3xl text-base font-semibold tracking-[0.12em] text-gold-100 uppercase sm:text-lg">
              <span className="text-gold">EX</span>pert <span className="text-gold">I</span>nsulation <span className="text-gold">M</span>anagement
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-white/75 sm:text-sm">
              Industrial insulation · PFP · Scaffolding · Coating & painting · Skilled manpower
            </p>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              ARS EXIM supports industrial project teams with insulation, coating and painting, passive fire protection, scaffolding and skilled manpower services. Share your location, scope and schedule to start a project discussion.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/request-a-quote">
                <Button variant="primary" size="lg" className="min-h-12 w-full sm:w-auto">
                  Request a project quote <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="secondary" size="lg" className="min-h-12 w-full border border-white/35 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                  Explore our services <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-[460px]">
            <Image
              src={heroImage}
              alt="Industrial workers in helmets and high-visibility vests gathered beneath scaffolding at a project site."
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center"
            />
            <span className="absolute bottom-3 left-3 bg-[#10233f]/85 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-white/90">Illustrative industrial site image</span>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-12 grid gap-8 lg:grid-cols-4">
            {[
              { title: 'Technical Expertise', text: 'Professional industrial knowledge applied to insulation, fire protection, scaffolding and surface systems.' },
              { title: 'Quality Focus', text: 'Project-specific execution built around workmanship, specification review and reliable delivery.' },
              { title: 'Skilled Workforce', text: 'Experienced site teams and support personnel for active industrial environments and shutdown work.' },
              { title: 'Safety & Reliability', text: 'Professional safety-minded execution that supports dependable site coordination and project continuity.' },
            ].map((pillar) => (
              <div key={pillar.title} className="rounded-2xl border border-steel-200 bg-steel-50 p-6 shadow-sm">
                <div className="mb-3 h-10 w-10 rounded-full bg-[#10233f] text-gold flex items-center justify-center font-display text-xl font-bold">•</div>
                <h3 className="font-display text-2xl font-bold text-navy-950">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-steel-700">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28" id="capabilities">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-10 grid gap-7 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">Five disciplines · one delivery partner</span>
              <h2 className="mt-3 max-w-3xl font-display text-5xl font-bold leading-[0.98] text-navy-950 sm:text-6xl">
                Built around the worksite.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-steel-700 sm:text-base sm:leading-7">
              From temperature control to fire resistance and safe temporary access, our teams support the work that keeps complex industrial sites moving.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden bg-steel-200 md:grid-cols-3">
            {serviceDisciplines.map((service) => {
              const Icon = service.icon;
              return (
                <Link key={service.number} href={service.href} className="group relative isolate min-h-[390px] overflow-hidden bg-[#10233f] text-white focus-visible:outline-gold">
                  <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gold transition-all group-hover:h-2" />
                  <div className="relative flex min-h-[390px] flex-col justify-between p-6 sm:p-8">
                    <div className="flex items-start justify-between">
                      <span className="font-display text-4xl font-semibold text-gold">{service.number}</span>
                      <span className="flex h-11 w-11 items-center justify-center border border-white/40 text-white transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-navy-950">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-100">{service.label}</span>
                      <h3 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">{service.title}</h3>
                      <p className="mt-3 max-w-md text-sm leading-6 text-white/80">{service.description}</p>
                      <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                        View discipline <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f1f3f2] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">Our work in action</span>
              <h2 className="mt-3 font-display text-5xl font-bold leading-[0.98] text-navy-950 sm:text-6xl">Industrial execution in the field.</h2>
            </div>
            <Link href="/gallery" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-navy-900 hover:text-gold-700">
              View gallery <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {galleryImages.map((item) => (
              <Link key={item.id} href="/gallery" className="group overflow-hidden rounded-2xl border border-steel-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-industrial">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={item.url} alt={item.altText} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10233f]/80 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-[#10233f]/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">{item.category}</span>
                </div>
                <div className="p-5">
                  <p className="font-display text-2xl font-bold text-navy-950">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
          {featuredMedia.length === 0 && (
            <p className="mt-4 text-xs leading-5 text-steel-600">
              This illustrative image is not represented as ARS EXIM project photography. The gallery will show published media uploads here.
            </p>
          )}
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">Potential application areas</span>
              <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-navy-950 sm:text-5xl">Industrial requirements, understood in context.</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-steel-700 sm:text-base">
              ARS EXIM can review enquiries for relevant industrial sectors according to the defined scope, site conditions and project documents. These are application areas, not claims of past project history.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Oil & gas',
              'Petrochemical & refining',
              'Power generation & utilities',
              'Heavy manufacturing & minerals',
              'Marine & offshore infrastructure',
              'Civil & industrial infrastructure',
            ].map((sector) => (
              <div key={sector} className="flex items-center gap-3 border-l-2 border-gold bg-steel-50 px-5 py-4 text-sm font-semibold text-navy-900">
                <span className="h-2 w-2 shrink-0 rotate-45 bg-navy-900" />
                {sector}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#10233f] py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold">A practical project approach</span>
            <h2 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">From first scope to handover.</h2>
            <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">The actual work sequence, responsibilities and acceptance criteria are agreed for each project.</p>
          </div>
          <ol className="mt-10 grid gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ['01', 'Understand', 'Review the requirement, assets, location and available project information.'],
              ['02', 'Plan', 'Align the work package, interfaces, access and project-specific constraints.'],
              ['03', 'Execute', 'Coordinate the agreed scope with appropriate site personnel and work fronts.'],
              ['04', 'Inspect', 'Check work against the project requirements and agreed inspection points.'],
              ['05', 'Deliver', 'Coordinate close-out and handover information defined for the scope.'],
            ].map(([number, title, description]) => (
              <li key={number} className="bg-[#10233f] p-5 sm:p-6">
                <span className="font-display text-3xl font-bold text-gold">{number}</span>
                <h3 className="mt-3 font-display text-2xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/75">{description}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/request-a-quote" className="inline-flex min-h-12 items-center justify-center gap-2 bg-gold px-5 text-sm font-bold text-navy-950 hover:bg-gold-100">Need industrial support? Request a quote <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center border border-white/35 px-5 text-sm font-bold text-white hover:border-gold">Contact ARS EXIM</Link>
          </div>
        </div>
      </section>

      {hasPublishedProjects && <section className="bg-[#f1f3f2] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">Work across energy regions</span>
              <h2 className="mt-3 font-display text-5xl font-bold leading-[0.98] text-navy-950 sm:text-6xl">Selected project references.</h2>
            </div>
            <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-navy-900 hover:text-gold-700">
              All projects <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProjects.map((project: any, index: number) => (
                <Link href={`/projects/${project.slug}`} key={project.slug} className="group min-w-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-steel-200">
                    <Image src={project.featuredImage} alt={project.title} fill unoptimized sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 bg-white px-2.5 py-1 font-display text-lg font-semibold text-navy-950">0{index + 1}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-b border-steel-300 py-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-steel-600">{project.location}, {project.country}</span>
                      <h3 className="mt-1 font-display text-2xl font-semibold leading-tight text-navy-950">{project.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-steel-700">{project.shortDescription}</p>
                      <span className="mt-3 block text-[10px] font-bold uppercase tracking-wider text-gold-700">{project.services.map((service: string) => service.replace(/-/g, ' ')).join(' · ')}</span>
                    </div>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-navy-900 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>}

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">Project engagement</span>
            <h2 className="mt-3 font-display text-5xl font-bold leading-[0.98] text-navy-950 sm:text-6xl">Start with the site requirements.</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-steel-700 sm:text-base">
              Every enquiry is different. Share the work location, service needed, project type and target schedule so the team can assess the request.
            </p>
          </div>
          <ol className="grid gap-0 border-y border-steel-200 sm:grid-cols-2">
            {[
              ['01', 'Define the scope', 'Tell us the discipline, work area and project type.'],
              ['02', 'Share the documents', 'Attach drawings, BOQ or specifications if available.'],
              ['03', 'Discuss the constraints', 'Include access, operating conditions and schedule needs.'],
              ['04', 'Request an assessment', 'The team can review the information and follow up.'],
            ].map(([number, title, description]) => (
              <li key={number} className="border-b border-r border-steel-200 bg-white p-6 sm:p-8">
                <span className="font-display text-3xl font-bold text-gold-700">{number}</span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-navy-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-steel-700">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#10233f] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:px-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Commercial enquiries</span>
            <h2 className="mt-3 font-display text-5xl font-bold leading-[0.98] sm:text-6xl">Have a live project scope?</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Contact ARS EXIM by WhatsApp, email or the project quote form. Include the country, discipline and timeline to help route your enquiry.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a href="https://wa.me/919764425426" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#1f8f5f] px-5 text-sm font-bold text-white hover:bg-[#19784f]">WhatsApp the team <ArrowUpRight className="h-4 w-4" /></a>
            <Link href="/request-a-quote" className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/50 px-5 text-sm font-bold text-white hover:border-gold hover:bg-gold hover:text-navy-950">Send project details <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="bg-gold px-5 py-14 text-navy-950 sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between lg:px-4">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.16em]">Project estimating & proposals</span>
            <h2 className="mt-3 font-display text-5xl font-bold leading-[0.98] sm:text-6xl">Let’s talk about the work ahead.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-navy-950/80 sm:text-base">
              Share your scope, site requirements and project timeline with our team.
            </p>
          </div>
          <Link href="/request-a-quote">
            <Button variant="secondary" size="lg" className="min-h-12 w-full border-navy-950 bg-navy-950 text-white hover:bg-navy-800 sm:w-auto">
              Request a project quote <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}