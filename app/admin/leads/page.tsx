export const metadata = {
  title: 'Leads | ARS EXIM Admin',
};

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded border border-steel-200 bg-white p-6 shadow-sm">
        <h1 className="font-display text-3xl font-bold text-navy-950">Leads</h1>
        <p className="mt-2 text-sm text-steel-700">
          Review quotation requests, status updates and notes from the ARS EXIM sales pipeline.
        </p>
      </div>
      <div className="rounded border border-dashed border-steel-300 bg-steel-50 p-10 text-center text-sm text-steel-600">
        Lead management is connected to the enquiry workflow and can be extended through the admin dashboard.
      </div>
    </div>
  );
}
