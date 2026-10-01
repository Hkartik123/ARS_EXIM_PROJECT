export const metadata = {
  title: 'Settings | ARS EXIM Admin',
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded border border-steel-200 bg-white p-6 shadow-sm">
        <h1 className="font-display text-3xl font-bold text-navy-950">Company Settings</h1>
        <p className="mt-2 text-sm text-steel-700">
          Maintain company identity, contact details, social links, SEO defaults and footer content in one place.
        </p>
      </div>
      <div className="rounded border border-dashed border-steel-300 bg-steel-50 p-10 text-center text-sm text-steel-600">
        Corporate configuration is managed centrally so public pages pick up approved contact information and branding updates.
      </div>
    </div>
  );
}
