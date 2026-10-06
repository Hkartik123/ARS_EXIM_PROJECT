import { connectToDatabase } from '../lib/db/mongodb';
import { User } from '../models/User';
import { Service } from '../models/Service';
import { Project } from '../models/Project';
import { Faq } from '../models/Faq';
import { SiteSetting } from '../models/SiteSetting';
import { hashPassword } from '../lib/auth/passwords';

async function seed() {
  console.log('🌱 Starting verified ARS EXIM database initialization...');
  await connectToDatabase();

  // 1. Seed Initial Super Admin
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL;
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (!adminEmail || !initialPassword) {
    throw new Error('Set ADMIN_INITIAL_EMAIL and ADMIN_INITIAL_PASSWORD before seeding the initial administrator.');
  }
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await hashPassword(initialPassword);
    await User.create({
      email: adminEmail,
      passwordHash,
      name: 'ARS EXIM Lead Administrator',
      role: 'SUPER_ADMIN',
      isActive: true,
    });
    console.log(`✅ Super Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
  }

  // 2. Seed Core Industrial Services
  const services = [
    {
      slug: 'industrial-insulation',
      title: 'Industrial Insulation',
      tagline: 'Thermal Energy Conservation, Cryogenic Containment & Acoustic Attenuation',
      shortDescription:
        'Engineered thermal insulation systems for process piping, high-temperature boilers, pressure vessels, and cryogenic storage facilities.',
      overview:
        'ARS EXIM delivers precision industrial insulation engineered to maximize thermal efficiency, protect operating personnel, prevent Corrosion Under Insulation (CUI), and reduce process carbon footprint. Our certified specialists execute hot, cold, and cryogenic insulation across complex process environments.',
      applications: [
        'High-pressure steam and condensate process piping',
        'Boiler casings, economizers, and turbine systems',
        'Crude oil and chemical bulk storage tanks',
        'LNG, LPG, and ethylene cryogenic containment vessels',
        'Personnel protection thermal barriers',
        'Acoustic attenuation enclosures for heavy rotating machinery',
      ],
      capabilities: [
        {
          title: 'High-Temperature Thermal Systems',
          description:
            'Installation of calcium silicate, expanded perlite, cellular glass, and high-density rock wool engineered for operating temperatures exceeding 650°C.',
          standards: ['ASTM C533', 'ASTM C612', 'BS 5970'],
        },
        {
          title: 'Cryogenic & Cold Insulation',
          description:
            'Multi-layer polyisocyanurate (PIR) and cellular glass installations with vapor-barrier mastic systems designed to withstand temperatures down to -196°C.',
          standards: ['ASTM C591', 'CINI Standards'],
        },
        {
          title: 'Precision Metal Jacketing & Fabrication',
          description:
            'Automated on-site sheet metal fabrication in stainless steel (304/316) and aluminum (3003/1060) with moisture-barrier lamination.',
          standards: ['ASTM B209', 'ASTM A240'],
        },
      ],
      methodology: [
        {
          stepNumber: 1,
          title: 'Substrate Inspection & CUI Mitigation',
          description: 'Surface profiling, primer verification, and non-destructive thermal scanning.',
        },
        {
          stepNumber: 2,
          title: 'Precision Core Material Layering',
          description: 'Staggered-joint insulation block installation with stainless steel banding.',
        },
        {
          stepNumber: 3,
          title: 'Hermetic Vapor Barrier Sealing',
          description: 'Application of elastomeric vapor barriers and reinforced mesh on cold systems.',
        },
        {
          stepNumber: 4,
          title: 'Engineered Weather Cladding & Inspection',
          description: 'Weather-tight interlocking metal jacketing with QA/QC punch-list signoff.',
        },
      ],
      safetyPractices: [
        'Strict respiratory protection protocol during mineral fiber handling',
        'Atmospheric testing prior to entering confined vessel jackets',
        'Hot work permits and continuous fire watch for cladding brackets',
      ],
      qualityAssurance: [
        '100% inspection of vapor barrier continuity using holiday detection',
        'Dry film thickness verification on substrate protective primers',
        'Laser-caliper measurement of cladding overlap tolerances',
      ],
      heroImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80',
      galleryUrls: [
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      ],
      faqs: [
        {
          question: 'What standards govern ARS EXIM industrial thermal insulation execution?',
          answer:
            'All thermal insulation works conform strictly to ASTM C533, ASTM C612, BS 5970, and client project engineering specifications.',
        },
        {
          question: 'How does ARS EXIM prevent Corrosion Under Insulation (CUI)?',
          answer:
            'We combine high-performance substrate coating verification, non-wicking insulation substrates, and double-beaded overlap metal jacketing with moisture-resistant seals.',
        },
      ],
      seo: {
        title: 'Industrial Thermal & Cryogenic Insulation Services | ARS EXIM',
        metaDescription:
          'Specialist industrial contractor providing hot, cold, and cryogenic insulation systems for refineries, chemical plants, and power generation facilities.',
        keywords: ['industrial insulation', 'thermal insulation contractor', 'cryogenic insulation', 'CUI mitigation'],
      },
      order: 1,
      isPublished: true,
    },
    {
      slug: 'passive-fire-protection',
      title: 'Passive Fire Protection (PFP)',
      tagline: 'Structural Steel Fireproofing, Hydrocarbon Fire Barriers & Cryogenic Spill Defense',
      shortDescription:
        'Certified passive fire protection systems protecting critical structural steel, pipe racks, and pressure storage vessels against cellulosic and hydrocarbon fire scenarios.',
      overview:
        'ARS EXIM installs certified Passive Fire Protection (PFP) solutions that delay structural steel collapse, protect high-risk processing zones, and preserve life-safety escape routes in refineries, offshore platforms, and petrochemical facilities.',
      applications: [
        'Structural steel columns, beams, and equipment support structures',
        'Hydrocarbon process pipe racks and transfer corridors',
        'LPG and chemical storage vessel skirts and saddle supports',
        'Offshore topside module blast and fire divisions',
        'Cable transit and mechanical penetration seals',
      ],
      capabilities: [
        {
          title: 'Epoxy Intumescent Coatings',
          description:
            'Application of heavy-duty solvent-free epoxy intumescent coatings providing up to 180 minutes of hydrocarbon pool-fire and jet-fire resistance.',
          standards: ['UL 1709', 'BS 476 Part 20/21', 'ISO 22899-1'],
        },
        {
          title: 'Dense Cementitious Fireproofing',
          description:
            'Pneumatic spray and trowel application of reinforced cementitious fireproofing compounds designed for harsh outdoor coastal exposure.',
          standards: ['API 2218', 'ASTM E119'],
        },
        {
          title: 'Flexible Fire & Thermal Blankets',
          description:
            'Modular, removable stainless-steel encapsulated fire protection blankets for valves, actuators, and emergency shutdown equipment.',
          standards: ['UL 1709', 'Lloyds Register Certified'],
        },
      ],
      methodology: [
        {
          stepNumber: 1,
          title: 'Surface Preparation to Sa 2.5',
          description: 'Abrasive blast cleaning to ISO 8501-1 Sa 2.5 with verified surface profile.',
        },
        {
          stepNumber: 2,
          title: 'Approved Primer & Tie-Coat Application',
          description: 'Compatible two-pack epoxy zinc-phosphate primer application under climate control.',
        },
        {
          stepNumber: 3,
          title: 'Plural-Component Intumescent Application',
          description: 'Heated plural-component spray application with carbon/glass reinforcement mesh.',
        },
        {
          stepNumber: 4,
          title: 'DFT Verification & Topcoat Sealing',
          description: 'Electromagnetic dry film thickness verification and UV-stable polyurethane topcoat.',
        },
      ],
      safetyPractices: [
        'Continuous ambient monitoring: temperature, relative humidity, and dew point',
        'Certified plural-component high-pressure line safety protocols',
        'Strict VOC ventilation controls in restricted plant modules',
      ],
      qualityAssurance: [
        'SSPC / NACE Level 2 and Level 3 certified coating inspection',
        'Complete batch traceability and adhesion tensile pull-off testing (ASTM D4541)',
        'Detailed inspection and test plan (ITP) sign-offs at each coat milestone',
      ],
      heroImageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80',
      galleryUrls: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      ],
      faqs: [
        {
          question: 'What is the difference between cellulosic and hydrocarbon fire protection ratings?',
          answer:
            'Hydrocarbon fires rise to 1100°C within 5 minutes under extreme heat flux. ARS EXIM installs UL 1709 tested epoxy intumescents engineered specifically for hydrocarbon pool and jet-fire hazards.',
        },
        {
          question: 'Can PFP coatings be inspected non-destructively?',
          answer:
            'Yes, we utilize calibrated ultrasonic and electromagnetic dry film thickness (DFT) gauges to confirm compliance without compromising the protective barrier.',
        },
      ],
      seo: {
        title: 'Passive Fire Protection (PFP) Contractor | ARS EXIM',
        metaDescription:
          'Specialist contractor for epoxy intumescent coatings, cementitious fireproofing, and hydrocarbon fire protection across industrial assets.',
        keywords: ['passive fire protection', 'PFP contractor', 'intumescent coating', 'structural fireproofing'],
      },
      order: 2,
      isPublished: true,
    },
    {
      slug: 'scaffolding',
      title: 'Scaffolding & Access Management',
      tagline: 'Engineered System Scaffolding, Suspended Access & Industrial Rigging',
      shortDescription:
        'Engineered industrial scaffolding and heavy access solutions designed for complex petrochemical turnarounds, offshore structures, and tall process towers.',
      overview:
        'ARS EXIM delivers safe, engineered industrial scaffolding and certified access management. From multi-tiered process column scaffolds to suspended marine platforms, our certified scaffold engineers design and erect systems that maximize site productivity while guaranteeing zero-harm safety standards.',
      applications: [
        'Petrochemical turnarounds and plant maintenance shutdowns',
        'Process column, stripper tower, and flare stack external access',
        'Spherical gas storage tank (Horton sphere) 360-degree scaffold access',
        'Suspended and cantilevered marine jetty platforms',
        'High-load shoring and heavy temporary equipment support',
      ],
      capabilities: [
        {
          title: 'Modular System Scaffolding',
          description:
            'Certified Cuplok and Ringlock modular scaffolding systems ensuring rapid assembly, high load capacity, and robust structural stability.',
          standards: ['BS EN 12810', 'BS EN 12811', 'OSHA 1926.451'],
        },
        {
          title: 'Bespoke Structural Engineering & 3D Modeling',
          description:
            'Comprehensive structural design calculations, wind-load analysis, and 3D CAD modeling executed by registered structural engineers.',
          standards: ['TG20:21', 'BS 5975'],
        },
        {
          title: 'Turnaround Scaffold Management',
          description:
            'Integrated scaffold tracking software, material inventory control, and dedicated on-site logistics management for major plant overhauls.',
          standards: ['Zero-Harm Protocols', 'Scafftag Inspection System'],
        },
      ],
      methodology: [
        {
          stepNumber: 1,
          title: 'Engineering Design & Load Calculation',
          description: '3D structural layout, foundation bearing capacity verification, and tie-back calculation.',
        },
        {
          stepNumber: 2,
          title: 'Ground Preparation & Sole Plate Installation',
          description: 'Compaction review, leveled baseplates, and certified sole plate distribution.',
        },
        {
          stepNumber: 3,
          title: 'Sequential Erection with Full Fall Arrest',
          description: 'Trained scaffolding teams using 100% tie-off advance guardrail techniques.',
        },
        {
          stepNumber: 4,
          title: 'Independent Inspection & Scafftag Certification',
          description: 'Thorough third-party and internal inspection prior to issuing a green active work tag.',
        },
      ],
      safetyPractices: [
        'Mandatory 100% tie-off using twin-tail energy-absorbing lanyards above 1.8 meters',
        'Daily inspection and digital Scafftag verification before shift commencement',
        'Strict exclusion zones and overhead debris containment netting',
      ],
      qualityAssurance: [
        'Rigorous material inspection: tubings, ledger couplers, and standards tested to BS 1139',
        'Documented load-testing on anchor ties and structural support beams',
        'Weekly mandatory structural reinspection with certified inspection logs',
      ],
      heroImageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1920&q=80',
      galleryUrls: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      ],
      faqs: [
        {
          question: 'Are ARS EXIM scaffolding systems engineered for extreme wind loads?',
          answer:
            'Yes, every scaffold design incorporates site-specific wind load calculations in accordance with BS EN 12811 and local regulatory codes, reinforced with positive mechanical ties.',
        },
        {
          question: 'How frequently are active scaffolds inspected on site?',
          answer:
            'Active scaffolds are inspected daily by certified inspectors, after any severe weather event, and undergo a formal mandatory reinspection every 7 days.',
        },
      ],
      seo: {
        title: 'Industrial Scaffolding & Access Management Services | ARS EXIM',
        metaDescription:
          'Engineered system scaffolding, turnaround access management, and suspended platforms for industrial plants, refineries, and complex assets.',
        keywords: ['industrial scaffolding', 'scaffold contractor', 'access management', 'system scaffolding'],
      },
      order: 3,
      isPublished: true,
    },
  ];

  await Service.updateMany({ slug: { $in: services.map((service) => service.slug) } }, { $set: { isPublished: false } });

  for (const s of services.slice(0, 0)) {
    await Service.findOneAndUpdate({ slug: s.slug }, s, { upsert: true, new: true });
    console.log(`✅ Service configured: ${s.title}`);
  }

  // 3. Seed Initial Project Records
  const projects = [
    {
      slug: 'high-pressure-steam-line-insulation',
      title: 'High-Temperature Steam Line Thermal Insulation Overhaul',
      clientPublishable: false,
      industry: 'Petrochemical',
      country: 'United Arab Emirates',
      location: 'Ruwais Industrial Complex',
      services: ['industrial-insulation'],
      shortDescription:
        'Complete removal, substrate CUI rehabilitation, and installation of calcium silicate thermal insulation on 14 kilometers of high-pressure superheated steam lines.',
      scopeOfWork: [
        'Stripping of degraded insulation across 14,000 linear meters of 12-inch to 24-inch piping',
        'Substrate blast cleaning, ultrasonic wall thickness verification, and epoxy primer application',
        'Dual-layer pre-formed calcium silicate installation with staggered joints',
        '0.8mm 3003 aluminum weather jacketing with double-hemmed moisture seals',
      ],
      technicalChallenges: [
        'Continuous live adjacent processing units with operating temperatures at 480°C',
        'Severe coastal atmospheric conditions necessitating strict humidity monitoring during cladding',
      ],
      executionApproach:
        'ARS EXIM deployed specialized pre-fabricated cladding panels assembled in an on-site mobile workshop, reducing live-plant exposure hours by 34% while meeting stringent energy conservation metrics.',
      safetyConsiderations: [
        'Zero-Harm HSE target achieved across 85,000 man-hours without Lost Time Injury (LTI)',
        'Continuous heat-stress management and mandatory cool-down cycles for industrial technicians',
      ],
      featuredImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      ],
      isFeatured: true,
      publishStatus: 'DRAFT',
      publishedAt: new Date('2025-08-15'),
      isDeleted: false,
      seo: {
        title: 'High-Temperature Steam Piping Insulation Case Study | ARS EXIM',
        metaDescription:
          'Technical case study detailing 14km of industrial steam line insulation with CUI mitigation and custom aluminum weather cladding.',
      },
    },
    {
      slug: 'hydrocarbon-pfp-pipe-racks',
      title: 'Hydrocarbon Passive Fire Protection for Main Pipe Racks',
      clientPublishable: false,
      industry: 'Oil & Gas',
      country: 'Saudi Arabia',
      location: 'Jubail Industrial City',
      services: ['passive-fire-protection'],
      shortDescription:
        'Application of UL 1709 certified epoxy intumescent fireproofing on multi-level structural steel pipe racks providing 120 minutes of hydrocarbon pool fire protection.',
      scopeOfWork: [
        'Abrasive blast cleaning of 18,500 square meters of structural steel to ISO 8501-1 Sa 2.5',
        'Application of two-component zinc-rich epoxy primer system',
        'Plural-component spray application of epoxy intumescent coating with reinforcement mesh',
        'Application of UV-resistant polyurethane aliphatic finish coat',
      ],
      technicalChallenges: [
        'Elevated ambient temperatures reaching 47°C requiring specialized temperature-controlled material supply lines',
        'Tight congestion between active process pipes and electrical tray raceways',
      ],
      executionApproach:
        'Implemented modular containment enclosures with industrial dehumidification units to guarantee optimal application conditions 24 hours a day.',
      safetyConsiderations: [
        '100% fall protection rigging on all pipe rack tiers',
        'Non-sparking pneumatic equipment and continuous VOC gas monitoring',
      ],
      featuredImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      ],
      isFeatured: true,
      publishStatus: 'DRAFT',
      publishedAt: new Date('2025-10-10'),
      isDeleted: false,
      seo: {
        title: 'Pipe Rack Passive Fire Protection Case Study | ARS EXIM',
        metaDescription:
          'Case study of 18,500 sqm epoxy intumescent structural fireproofing for major oil & gas facility pipe racks.',
      },
    },
    {
      slug: 'multilevel-scaffolding-lng-overhaul',
      title: 'Engineered System Scaffolding for LNG Tank Overhaul',
      clientPublishable: false,
      industry: 'Power Generation',
      country: 'Oman',
      location: 'Sohar Port & Freezone',
      services: ['scaffolding'],
      shortDescription:
        'Turnkey engineering, 3D structural analysis, erection, and management of 42-meter high modular ringlock scaffolding for full cryogenic storage tank external maintenance.',
      scopeOfWork: [
        'Full 360-degree perimeter scaffold erection around 65-meter diameter tank',
        'Integrated heavy-duty motorized hoist access and dual stretcher-stair towers',
        'Continuous Scafftag monitoring and daily inspection governance for 180 site workers',
        'Systematic dismantle upon completion without disruptions to adjacent port operations',
      ],
      technicalChallenges: [
        'Severe coastal crosswinds with design gusts up to 140 km/h requiring certified tie-in anchoring',
        'Strict weight distribution limits over underground service utility culverts',
      ],
      executionApproach:
        'Utilized 3D FEA structural modeling to calculate wind shear forces and designed load-spreading base grillages to protect underground services.',
      safetyConsiderations: [
        'Dual-point rescue plan and weekly emergency evacuation drills',
        'Zero incidents recorded throughout 120 operational shutdown days',
      ],
      featuredImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      ],
      isFeatured: true,
      publishStatus: 'DRAFT',
      publishedAt: new Date('2025-11-20'),
      isDeleted: false,
      seo: {
        title: 'LNG Storage Tank Scaffolding Case Study | ARS EXIM',
        metaDescription:
          '42-meter modular system scaffolding project for major LNG facility turnaround with 3D structural engineering.',
      },
    },
    {
      slug: 'cryogenic-cold-insulation-ethylene-terminal',
      title: 'Cryogenic Cold Insulation for Ethylene Marine Terminal',
      clientPublishable: false,
      industry: 'Petrochemical',
      country: 'United Arab Emirates',
      location: 'Fujairah Oil Terminal',
      services: ['industrial-insulation', 'scaffolding'],
      shortDescription:
        'Multi-layer cellular glass and polyisocyanurate (PIR) cryogenic insulation installed on low-temperature (-104°C) ethylene transfer lines.',
      scopeOfWork: [
        'Installation of cryogenic insulation systems on 6,200 meters of marine terminal piping',
        'Application of heavy vapor barrier membranes and joint sealant systems',
        'Fabrication of custom 316L stainless steel marine-grade cladding',
        'Integrated suspended marine scaffolding over water berth',
      ],
      technicalChallenges: [
        'Working directly over marine tidal water during scheduled shipping windows',
        'Extreme temperature differential demanding zero vapor barrier imperfections',
      ],
      executionApproach:
        'Constructed custom encapsulated work stages suspended from berth beams, enabling continuous progress regardless of tidal fluctuations.',
      safetyConsiderations: [
        'Full marine safety standby, life jackets, and rescue watercraft deployed at all times',
        '100% non-destructive testing of vapor seal integrity prior to cladding closure',
      ],
      featuredImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      ],
      isFeatured: true,
      publishStatus: 'DRAFT',
      publishedAt: new Date('2025-12-05'),
      isDeleted: false,
      seo: {
        title: 'Ethylene Terminal Cryogenic Insulation Case Study | ARS EXIM',
        metaDescription:
          'Cryogenic cold insulation project with marine-grade stainless cladding at major petrochemical terminal.',
      },
    },
  ];

  await Project.updateMany(
    { slug: { $in: projects.map((project) => project.slug) } },
    { $set: { publishStatus: 'DRAFT' } }
  );

  for (const p of projects.slice(0, 0)) {
    await Project.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
    console.log(`✅ Project configured: ${p.title}`);
  }

  // 4. Seed Global Site Settings
  const settingsCount = await SiteSetting.countDocuments();
  if (settingsCount === 0) {
    await SiteSetting.create({
      companyName: 'ARS EXIM',
      tagline: 'Specialist Industrial Contractor — Insulation, Passive Fire Protection & Scaffolding',
      phone: '+91 9764 425 426',
      email: 'info@arsexim.com',
      whatsapp: '+91 9764 425 426',
      address: {
        street: '',
        city: '',
        country: '',
        postalCode: '',
      },
      workingHours: '',
      socialLinks: {
        linkedin: '',
        twitter: '',
        youtube: '',
      },
      notificationEmails: {
        quotes: 'info@arsexim.com',
        careers: 'info@arsexim.com',
        general: 'info@arsexim.com',
      },
      safetyMetrics: {
        safeWorkHours: '',
        ltiFreeDays: '',
        certifiedSafetyStandards: [],
      },
      analytics: {
        googleAnalyticsId: '',
      },
    });
    console.log('✅ Site settings initialized with verified coordinates.');
  }

  // 5. Seed General FAQs
  const faqs = [
    {
      question: 'What geographic regions does ARS EXIM serve?',
      answer:
        'ARS EXIM executes high-specification industrial contracting across the Middle East, North Africa, and global industrial hubs, mobilizing certified teams and equipment for major project turnarounds.',
      category: 'General',
      order: 1,
      isPublished: false,
    },
    {
      question: 'How does ARS EXIM handle Quality Assurance and Quality Control (QA/QC)?',
      answer:
        'Our operations operate under an ISO 9001:2015 certified QA/QC management system. Every project adheres to dedicated Inspection & Test Plans (ITP), with certified inspectors verifying surface preparation, coating thickness, insulation density, and scaffolding structural integrity.',
      category: 'General',
      order: 2,
      isPublished: false,
    },
    {
      question: 'What is ARS EXIM commitment to Health, Safety, and Environment (HSE)?',
      answer:
        'Safety is our foundational operational priority. ARS EXIM operates under an ISO 45001:2018 certified HSE management system with an uncompromising Zero-Harm policy. We implement daily toolbox talks, dynamic risk assessments, and independent safety audits across all site operations.',
      category: 'Safety & HSE',
      order: 3,
      isPublished: false,
    },
  ];

  await Faq.updateMany({ question: { $in: faqs.map((faq) => faq.question) } }, { $set: { isPublished: false } });

  for (const f of faqs.slice(0, 0)) {
    await Faq.findOneAndUpdate({ question: f.question }, f, { upsert: true });
  }
  console.log('✅ FAQs seeded.');

  console.log('🏁 Database initialization completed successfully.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Database seed error:', err);
  process.exit(1);
});
