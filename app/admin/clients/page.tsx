export const metadata = {
  title: 'Clients | ARS EXIM Admin',
};

export default function AdminClientsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded border border-steel-200 bg-white p-6 shadow-sm">
        <h1 className="font-display text-3xl font-bold text-navy-950">Client Logos</h1>
        <p className="mt-2 text-sm text-steel-700">
          Manage approved client or partner branding only where valid permission exists.
        </p>
      </div>
      <div className="rounded border border-dashed border-steel-300 bg-steel-50 p-10 text-center text-sm text-steel-600">
        Client relationship data can be safely added and published only with approval.
      </div>
    </div>
  );
}
