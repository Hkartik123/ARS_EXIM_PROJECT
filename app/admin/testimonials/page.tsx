export const metadata = {
  title: 'Testimonials | ARS EXIM Admin',
};

export default function AdminTestimonialsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded border border-steel-200 bg-white p-6 shadow-sm">
        <h1 className="font-display text-3xl font-bold text-navy-950">Testimonials</h1>
        <p className="mt-2 text-sm text-steel-700">
          Approve and publish endorsements only where they are valid and approved by the company.
        </p>
      </div>
      <div className="rounded border border-dashed border-steel-300 bg-steel-50 p-10 text-center text-sm text-steel-600">
        Approved testimonial content can be controlled here to keep public-facing claims precise and evidence-based.
      </div>
    </div>
  );
}
