import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  HardHat,
  Layers3,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Project } from '@/models/Project';
import { IndustrialScene } from '@/components/public/industrial-scene';

export const dynamic = 'force-dynamic';

const serviceDisciplines = [
  {
    number: '01',
    title: 'Industrial insulation',
    label: 'HOT · COLD · CRYOGENIC',
    description:
      'Thermal systems that conserve energy, control process temperatures and prevent condensation in low-temperature and cryogenic service.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85',
    alt: 'Engineer reviewing industrial process equipment',
    href: '/services/industrial-insulation',
    icon: Layers3,
  },
  {
    number: '02',
    title: 'Passive fire protection',
    label: 'STRUCTURAL STEEL · PFP',
    description:
      'Cementitious fireproofing for load-bearing tank supports, pipe racks and connected structures, helping steel retain integrity during a fire event.',
    image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1400&q=85',
    alt: 'Industrial energy facility with structural process equipment',
    href: '/services/passive-fire-protection',
    icon: Flame,
  },
  {
    number: '03',
    title: 'Scaffolding & access',
    label: 'ENGINEERED TEMPORARY ACCESS',
    description:
      'End-to-end temporary access, from engineering and safe erection to dismantling, with platforms tailored to tanks, vessels and complex structures.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=85',
    alt: 'Industrial construction structure and elevated work area',
    href: '/services/scaffolding',
    icon: HardHat,
  },
];

const suppliedProjects = [
  {
    title: 'Jafurah Gas Project Phase-I',
    location: 'KSA',
    image: 'https://images.unsplash.com/photo-1513828583688-c52646e850da?auto=format&fit=crop&w=1200&q=85',
    alt: 'Industrial gas processing equipment',
  },
  {
    title: 'Ras Tanura CFP EXT',
    location: 'KSA',
    image: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1200&q=85',
    alt: 'Refinery structures and process piping',
  },
  {
    title: 'West Qurna Oil Field',
    location: 'Basra · Iraq',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=85',
    alt: 'Industrial engineering work at an energy facility',
  },
  {
    title: 'Ras Gas Expansion',
    location: 'Doha · Qatar',
    image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1200&q=85',
    alt: 'Large-scale gas and energy infrastructure',
  },
];

async function getFeaturedProjects() {
  try {
    await connectToDatabase();
    const projects = await Project.find({ publishStatus: 'PUBLISHED', isDeleted: false })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(4)
      .lean();
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to load featured projects:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();
  const hasPublishedProjects = featuredProjects.length > 0;

  return (
    <div className="overflow-hidden">
      <section className="relative isolate flex min-h-[640px] items-end bg-navy-950 text-white sm:min-h-[700px] lg:min-h-[760px]">
        <Image
          src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2400&q=90"
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="z-0 object-cover object-center"
        />
        <div className="absolute inset-0 z-10 bg-navy-950/65" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-navy-950/45" />

        <div className="relative z-20 mx-auto grid w-full max-w-7xl gap-12 px-5 pb-14 pt-28 sm:px-8 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-end lg:px-12 lg:pb-24">
          <div className="home-reveal max-w-4xl">
            <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-gold-100">
              <span className="h-px w-10 bg-gold" />
              OpEx · Field-tested execution
            </div>
            <h1 className="max-w-4xl font-display text-6xl font-bold leading-[0.94] text-white sm:text-7xl lg:text-8xl">
              Industrial work,
              <br />
              <span className="text-gold">done with purpose.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              ARS EXIM brings more than 20 years of niche industry experience to insulation, passive fire protection and engineered access work across demanding process environments.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/request-a-quote">
                <Button variant="primary" size="lg" className="min-h-12 w-full sm:w-auto">
                  Talk through your project <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="secondary" size="lg" className="min-h-12 w-full border border-white/35 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                  Explore our services <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-white/30 pt-5 lg:grid-cols-1 lg:gap-7 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <div>
              <span className="block font-display text-5xl font-bold leading-none text-gold">20+</span>
              <span className="mt-2 block text-xs font-semibold uppercase tracking-wider text-white/75">Years of niche experience</span>
            </div>
            <div>
              <span className="block font-display text-5xl font-bold leading-none text-white">03</span>
              <span className="mt-2 block text-xs font-semibold uppercase tracking-wider text-white/75">Specialist disciplines</span>
            </div>
          </div>
        </div>
        <a href="#capabilities" className="absolute bottom-7 right-8 hidden items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/75 lg:flex">
          Scroll to explore <span className="h-10 w-px bg-gold" />
        </a>
      </section>

      <section className="bg-white py-20 sm:py-28" id="capabilities">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-10 grid gap-7 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">Three disciplines · one delivery partner</span>
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
                <Link key={service.number} href={service.href} className="group relative isolate min-h-[440px] overflow-hidden bg-navy-950 text-white focus-visible:outline-gold">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="z-0 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 z-10 bg-navy-950/70 transition-colors duration-300 group-hover:bg-navy-950/55" />
                  <div className="relative z-20 flex min-h-[440px] flex-col justify-between p-6 sm:p-8">
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

      <section className="bg-[#101b25] text-white" aria-labelledby="model-heading">
        <div className="mx-auto grid max-w-7xl items-center gap-4 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.76fr_1.24fr] lg:px-12">
          <div className="relative z-10 py-6">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold">A closer look at the work</span>
            <h2 id="model-heading" className="mt-4 max-w-lg font-display text-5xl font-bold leading-[0.98] sm:text-6xl">
              Complex structures. Considered access.
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/70 sm:text-base">
              Industrial sites bring vessels, elevated pipework and changing work fronts together. Our disciplines are designed to work alongside those realities.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold uppercase tracking-wider text-white/80">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 bg-gold" /> Vessels</span>
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 bg-gold" /> Pipe racks</span>
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 bg-gold" /> Access systems</span>
            </div>
            <Link href="/services/scaffolding" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-gold hover:text-white">
              Explore access management <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="min-w-0" aria-label="Interactive industrial structure model">
            <IndustrialScene />
          </div>
        </div>
      </section>

      <section className="bg-[#f1f3f2] py-20 sm:py-28">
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

          {hasPublishedProjects ? (
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
                    </div>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-navy-900 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {suppliedProjects.map((project, index) => (
                <article key={project.title} className="group min-w-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-steel-200">
                    <Image src={project.image} alt={project.alt} fill unoptimized sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 bg-white px-2.5 py-1 font-display text-lg font-semibold text-navy-950">0{index + 1}</span>
                  </div>
                  <div className="border-b border-steel-300 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-steel-600">{project.location}</span>
                    <h3 className="mt-1 font-display text-2xl font-semibold leading-tight text-navy-950">{project.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700">Operational excellence</span>
            <h2 className="mt-3 font-display text-5xl font-bold leading-[0.98] text-navy-950 sm:text-6xl">Field-tested. Site-aware. Focused.</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-steel-700 sm:text-base">
              More than two decades of niche industry experience informs how ARS EXIM approaches planning, coordination and worksite performance.
            </p>
          </div>
          <div className="grid gap-px bg-steel-200 sm:grid-cols-2">
            <div className="bg-white p-6 sm:p-8">
              <span className="font-display text-5xl font-bold text-gold-700">20+</span>
              <h3 className="mt-3 font-display text-2xl font-semibold text-navy-950">Years in the industry</h3>
              <p className="mt-2 text-sm leading-6 text-steel-700">Niche industrial experience across specialist contracting disciplines.</p>
            </div>
            <div className="bg-white p-6 sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center bg-navy-950 text-gold"><ShieldCheck className="h-6 w-6" /></span>
              <h3 className="mt-3 font-display text-2xl font-semibold text-navy-950">People before pace</h3>
              <p className="mt-2 text-sm leading-6 text-steel-700">Health and safety remain central to planning work in active industrial environments.</p>
            </div>
            <div className="bg-white p-6 sm:p-8">
              <span className="font-display text-5xl font-bold text-navy-950">03</span>
              <h3 className="mt-3 font-display text-2xl font-semibold text-navy-950">Connected disciplines</h3>
              <p className="mt-2 text-sm leading-6 text-steel-700">Insulation, passive fire protection and scaffolding & access management.</p>
            </div>
            <div className="bg-white p-6 sm:p-8">
              <span className="font-display text-3xl font-bold uppercase text-navy-950">OpEx</span>
              <h3 className="mt-3 font-display text-2xl font-semibold text-navy-950">Continuous improvement</h3>
              <p className="mt-2 text-sm leading-6 text-steel-700">A practical focus on process optimization and performance improvement.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate min-h-[430px] overflow-hidden bg-navy-950 text-white">
        <Image
          src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2200&q=85"
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="z-0 object-cover"
        />
        <div className="absolute inset-0 z-10 bg-navy-950/75" />
        <div className="relative z-20 mx-auto grid min-h-[430px] max-w-7xl items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:px-12">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold">A responsible way forward</span>
            <h2 className="mt-3 font-display text-5xl font-bold leading-[0.98] sm:text-6xl">Better work for people and place.</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              ARS EXIM is committed to protecting people and supporting a safe, clean and sustainable environment for present and future generations.
            </p>
          </div>
          <Link href="/sustainability" className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/50 px-5 text-sm font-bold text-white transition-colors hover:border-gold hover:bg-gold hover:text-navy-950">
            Our sustainability approach <ArrowUpRight className="h-4 w-4" />
          </Link>
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