import Link from 'next/link';
import { ArrowRight, Check, ClipboardList } from 'lucide-react';
import { Breadcrumbs } from '@/components/public/breadcrumbs';
import { Button } from '@/components/ui/button';

const projectReviewSteps = [
  {
    title: 'Review the enquiry',
    description: 'Identify the requested discipline, asset, project type, country, schedule and the information already available.',
  },
  {
    title: 'Align the documents',
    description: 'Compare drawings, bills of quantities, specifications and site rules. List missing information and questions that affect scope.',
  },
  {
    title: 'Define the work package',
    description: 'Agree the work limits, interfaces, access assumptions, quantities, responsibilities and exclusions before commercial pricing.',
  },
  {
    title: 'Plan site coordination',
    description: 'Discuss permits, work fronts, operating constraints, materials approvals and the sequence required by the project team.',
  },
  {
    title: 'Agree inspection and handover',
    description: 'Confirm project-specific inspection points, records, acceptance criteria and handover documents in the enquiry or contract documents.',
  },
];

const serviceContent = {
  'hot-insulation': {
    title: 'Hot Insulation',
    subtitle: 'Thermal insulation for hot process systems',
    intro: 'Hot insulation is applied to industrial systems operating at elevated temperatures, helping to conserve heat energy, control surface temperatures and support safe operational conditions. System selection depends on service temperature, operating profile, asset geometry and the project specification. This page outlines common project considerations rather than assuming any single material or application method.',
    applications: [
      'Steam and hot process pipework and valve assemblies.',
      'Boilers, heat exchangers and process vessels operating at elevated temperatures.',
      'Thermal equipment covers, support pads and cladding interfaces.',
      'Hot services where personnel protection or energy conservation is a requirement.',
      'Maintenance-access areas needing removable or inspectable insulation segments.',
    ],
    reviewPoints: [
      ['Operating envelope', 'Provide service temperatures, line lists, equipment data and any operating cycles or thermal excursions.'],
      ['Asset geometry', 'Share isometrics, arrangement drawings, dimensions and access restrictions for the work fronts.'],
      ['System specification', 'Identify approved materials, thickness basis, jacketing, protective coating and insulation interface requirements.'],
      ['Interfaces and access', 'Describe working restrictions, maintenance access requirements and any scaffolding or permits needed.'],
    ],
    faqs: [
      ['What is included in a hot insulation scope?', 'It can cover insulation materials, fittings, accessories, weather protection and installation requirements depending on the project documents and work package definition.'],
      ['Can you quote from drawings and an equipment list?', 'Yes. Drawings, line lists, equipment details, work areas and specification requirements are all useful inputs for establishing the scope.'],
      ['Does insulation need to match a specific specification?', 'Project-specific materials and system requirements must be checked against the client-approved specification before pricing or installation.'],
    ],
  },
  'cold-cryogenic-insulation': {
    title: 'Cold & Cryogenic Insulation',
    subtitle: 'Low-temperature insulation and condensation control',
    intro: 'Cold and cryogenic insulation is used for systems that operate below ambient or at very low temperatures, where heat gain, frosting, condensation and vapour migration can affect performance and asset integrity. The correct solution depends on the operating temperature, system geometry, insulation product, vapour barrier and project specification.',
    applications: [
      'Cryogenic pipework, vessels and storage tanks.',
      'LNG, refrigerated and low-temperature process equipment.',
      'Cold service lines where heat gain or condensation control is required.',
      'Systems with moisture sensitivity or thermal cycling concerns.',
      'Tank and equipment interfaces that require continuous insulation performance.',
    ],
    reviewPoints: [
      ['Operating conditions', 'State the minimum service temperature, temperature range, line list and any relevant process data.'],
      ['System build-up', 'Share the specification for insulation material, vapour barrier, cladding, supports and penetrations.'],
      ['Asset constraints', 'Identify access restrictions, safety requirements, maintenance windows and operating conditions at the site.'],
      ['Inspection criteria', 'Confirm acceptance criteria, test expectations and documentation requirements included in the project scope.'],
    ],
    faqs: [
      ['Can ARS EXIM quote for cryogenic insulation?', 'Project enquiries for cold and cryogenic insulation are reviewed against the available drawings, scope definition and acceptance criteria stated by the client.'],
      ['What project details are most important?', 'Service temperatures, insulation thickness basis, vapour control requirements and site access information are among the most important inputs.'],
      ['Is this different from hot insulation?', 'Yes. Cold and cryogenic systems require attention to condensation, vapour control and low-temperature performance in addition to the general insulation design.'],
    ],
  },
  'industrial-insulation': {
    title: 'Industrial Insulation',
    subtitle: 'Insulation scope for process equipment and piping',
    intro: 'Industrial insulation is specified to manage heat transfer, protect operating conditions, reduce unwanted heat gain or loss, and address personnel or condensation considerations. The system depends on the service temperature, asset geometry, operating environment and client specification. This page describes common enquiry considerations, not a claim that one material or design fits every installation.',
    applications: [
      'Process lines, headers and pipework where thermal control is required.',
      'Vessels, tanks and equipment with defined insulation limits.',
      'Cold or cryogenic services where moisture control and continuity need careful review.',
      'Hot services where personnel protection or heat conservation forms part of the scope.',
      'Removable or maintainable areas where access to valves and instruments is required.',
    ],
    reviewPoints: [
      ['Operating envelope', 'Provide design and operating temperatures, line lists, equipment data and any start-up or cycling conditions.'],
      ['Asset geometry', 'Share isometrics, general arrangement drawings, dimensions, supports, valves and penetrations where available.'],
      ['System specification', 'Identify client-approved materials, thickness calculations, jacketing, vapour control and corrosion-under-insulation requirements.'],
      ['Interfaces and access', 'Describe live-plant restrictions, removal or reinstatement limits, scaffolding needs and nearby work by other contractors.'],
    ],
    faqs: [
      ['Which insulation material do you use?', 'Material selection should follow the client specification, operating conditions, approved product list and applicable project requirements. Share those documents with the enquiry; this website does not assume or promise a particular material.'],
      ['Can you quote from a line list or BOQ?', 'A line list or BOQ is a useful start. Drawings, insulation class, dimensions, access assumptions, cladding details and site conditions may also affect the scope and should be supplied when available.'],
      ['Do you handle cold and cryogenic systems?', 'Cold and cryogenic insulation is among the enquiry categories ARS EXIM presents. Exact service limits, system build-up, vapour control and acceptance criteria must be confirmed from project documents before a technical proposal.'],
    ],
  },
  'passive-fire-protection': {
    title: 'Passive Fire Protection (PFP)',
    subtitle: 'Fire-protection scope for industrial assets and structures',
    intro: 'Passive fire protection is selected to help protect defined assets for a specified fire scenario and duration. The required performance depends on the project fire strategy, asset criticality, environmental exposure, substrate, product system and approval basis. ARS EXIM invites project enquiries for PFP work; no certification, product approval, fire rating or installation record is claimed on this page. Those details must be validated against the project specification.',
    applications: [
      'Structural steel identified for fire protection in the project documents.',
      'Pipe racks, equipment supports and steelwork within a defined protection boundary.',
      'Vessel supports or other critical assets where the project fire strategy requires protection.',
      'Interfaces, edges, connections and penetrations that need to be included in the scope.',
      'Repair, reinstatement or maintenance areas where the existing system is documented.',
    ],
    reviewPoints: [
      ['Fire scenario and performance', 'State the design fire, required duration, section factors or governing project design information where provided.'],
      ['Asset and substrate', 'Supply steel schedules, drawings, substrate condition, primer information and details of adjacent equipment.'],
      ['Approved product system', 'Identify the manufacturer, product, tested configuration, finish and client approvals stated by the project.'],
      ['Inspection and environment', 'Confirm surface-preparation criteria, application conditions, thickness checks, repair rules and required inspection records.'],
    ],
    faqs: [
      ['Can you recommend a fireproofing product?', 'A product should not be selected from a generic website description. It must match the project fire design, approved system, substrate, exposure and client acceptance requirements. Share the specification for assessment.'],
      ['What should be included in an RFQ?', 'Include the asset list, drawings, fire scenario and duration, substrate and primer data, approved product system, quantities, site conditions and inspection requirements if available.'],
      ['Do you provide a specific fire rating or certification?', 'No rating or certification is represented here. The required performance and acceptable evidence are project-specific and should be confirmed from approved design documents and product records.'],
    ],
  },
  scaffolding: {
    title: 'Scaffolding & Access Management',
    subtitle: 'Temporary access scope for industrial work fronts',
    intro: 'Industrial access planning starts with the task, the equipment to be reached and the limits of the live site. A suitable temporary access scope depends on dimensions, loading, ground or support conditions, nearby operations, exclusion zones, weather exposure and the site’s scaffold rules. ARS EXIM accepts enquiries for scaffolding and access requirements; the specific system, design responsibility, inspection regime and equipment availability must be agreed for each project.',
    applications: [
      'Access around vessels, tanks, columns, process equipment and pipe racks.',
      'Work platforms needed for inspection, maintenance, insulation or fire-protection activities.',
      'Restricted or congested work areas where access routes and interfaces need review.',
      'Temporary access for shutdown, turnaround, modification or new-build scopes.',
      'Phased erection, alteration and dismantling where operating areas must remain controlled.',
    ],
    reviewPoints: [
      ['Task and reach', 'Describe the work to be performed, elevations, dimensions, work duration and access points required.'],
      ['Loads and support', 'Provide expected personnel, tools and material loads plus ground, support, tie-in or structure information available.'],
      ['Site interfaces', 'Identify live equipment, vehicle routes, overhead services, simultaneous operations, restricted zones and permit controls.'],
      ['Design and inspection', 'Confirm who provides calculations or design approval, applicable site standards, tagging rules and inspection records.'],
    ],
    faqs: [
      ['Can you price from a site sketch?', 'A marked-up sketch can help start a discussion. Dimensions, elevations, duty, loading, tie-in points, support conditions, access routes and site constraints are needed to establish a reliable work package.'],
      ['Who confirms the scaffold design and inspection rules?', 'The project documents and local site requirements should identify design responsibility, competent-person requirements, inspection frequency, tagging and handover records. These should be agreed before mobilisation.'],
      ['Can access be coordinated with insulation or PFP work?', 'The enquiry can include multiple disciplines and shared work fronts. List each activity, sequence, access window and contractor interface so responsibilities and assumptions can be reviewed together.'],
    ],
  },
} as const;

export function ServiceScopeView({ slug }: { slug: keyof typeof serviceContent }) {
  const service = serviceContent[slug];

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Services', href: '/services' }, { label: service.title }]} />

        <header className="my-8 border-b border-steel-200 pb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-700">ARS EXIM service enquiry</span>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold leading-tight text-navy-950 sm:text-6xl">{service.title}</h1>
          <p className="mt-3 text-lg font-semibold text-navy-700">{service.subtitle}</p>
          <p className="mt-6 max-w-4xl text-base leading-7 text-steel-700">{service.intro}</p>
          <Link className="mt-7 inline-block" href={`/request-a-quote?service=${encodeURIComponent(service.title)}`}>
            <Button variant="primary" size="lg">Discuss this scope <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </header>

        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <section>
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-gold-700" />
              <h2 className="font-display text-2xl font-bold text-navy-950">Typical enquiry scope</h2>
            </div>
            <ul className="mt-5 space-y-4">
              {service.applications.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-steel-700"><Check className="mt-1 h-4 w-4 shrink-0 text-navy-700" />{item}</li>)}
            </ul>

            <h2 className="mt-10 font-display text-2xl font-bold text-navy-950">What to include for review</h2>
            <dl className="mt-5 divide-y divide-steel-200 border-y border-steel-200">
              {service.reviewPoints.map(([title, description]) => (
                <div key={title} className="py-4">
                  <dt className="text-sm font-bold text-navy-950">{title}</dt>
                  <dd className="mt-1 text-sm leading-6 text-steel-700">{description}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-navy-950">A practical project review</h2>
            <p className="mt-3 text-sm leading-6 text-steel-700">The steps below are a discussion framework. The actual sequence, responsibilities, technical submittals and handover requirements must be agreed with the client and relevant site representatives for each project.</p>
            <ol className="mt-5 space-y-0 border-l border-steel-300 pl-6">
              {projectReviewSteps.map((step, index) => (
                <li key={step.title} className="relative border-b border-steel-200 py-4 last:border-b-0">
                  <span className="absolute -left-[2.1rem] top-4 flex h-6 w-6 items-center justify-center rounded-full bg-navy-950 text-[10px] font-bold text-white">0{index + 1}</span>
                  <h3 className="text-sm font-bold text-navy-950">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-steel-700">{step.description}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 bg-[#edf5ff] p-6">
              <h2 className="font-display text-xl font-bold text-navy-950">Technical basis</h2>
              <p className="mt-2 text-sm leading-6 text-steel-700">Materials, manufacturer systems, standards, design values, certifications, inspection criteria and acceptance records are not assumed on this page. Submit the client specification or tender documents so the applicable requirements can be identified before a proposal is prepared.</p>
            </div>
          </section>
        </div>

        <section className="mt-14 border-t border-steel-200 pt-10">
          <h2 className="font-display text-2xl font-bold text-navy-950">Common project questions</h2>
          <div className="mt-5 grid gap-px bg-steel-200 md:grid-cols-3">
            {service.faqs.map(([question, answer]) => (
              <article key={question} className="bg-white p-5 sm:p-6">
                <h3 className="text-sm font-bold leading-5 text-navy-950">{question}</h3>
                <p className="mt-3 text-sm leading-6 text-steel-700">{answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 flex flex-col gap-5 bg-[#10233f] p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div>
            <h2 className="font-display text-2xl font-bold">Have a {service.title.toLowerCase()} enquiry?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">Share the site location, work type, timeline, available drawings and project specification. Attachments can be added through the quote form.</p>
          </div>
          <Link href={`/request-a-quote?service=${encodeURIComponent(service.title)}`} className="shrink-0">
            <Button variant="primary" size="lg">Start an RFQ <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </section>
      </div>
    </div>
  );
}