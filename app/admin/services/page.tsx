export const metadata = {
  title: 'Services | ARS EXIM Admin',
};

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div className="rounded border border-steel-200 bg-white p-6 shadow-sm">
        <h1 className="font-display text-3xl font-bold text-navy-950">Services</h1>
        <p className="mt-2 text-sm text-steel-700">
          Maintain industrial service content including descriptions, capabilities and publishing status.
        </p>
      </div>
      <div className="rounded border border-dashed border-steel-300 bg-steel-50 p-10 text-center text-sm text-steel-600">
        Service CMS is available for managing core offerings such as hot insulation, cold/cryogenic insulation, PFP and scaffolding.
      </div>
    </div>
  );
}
