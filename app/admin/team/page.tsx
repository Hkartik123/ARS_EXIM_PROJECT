export const metadata = {
  title: 'Team | ARS EXIM Admin',
};

export default function AdminTeamPage() {
  return (
    <div className="space-y-6">
      <div className="rounded border border-steel-200 bg-white p-6 shadow-sm">
        <h1 className="font-display text-3xl font-bold text-navy-950">Team</h1>
        <p className="mt-2 text-sm text-steel-700">
          Maintain leadership, planning and technical personnel details for the company profile.
        </p>
      </div>
      <div className="rounded border border-dashed border-steel-300 bg-steel-50 p-10 text-center text-sm text-steel-600">
        Approved employee bios, profiles and order can be configured here for public presentation.
      </div>
    </div>
  );
}
