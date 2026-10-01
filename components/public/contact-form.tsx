'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Turnstile } from '@/components/public/turnstile';
import { AlertCircle } from 'lucide-react';

const SERVICE_OPTIONS = [
  { label: 'General Technical Inquiry', value: 'General Inquiry' },
  { label: 'Industrial Insulation Services', value: 'Industrial Insulation' },
  { label: 'Passive Fire Protection (PFP)', value: 'Passive Fire Protection' },
  { label: 'Scaffolding & Access Management', value: 'Scaffolding' },
  { label: 'HSE & Safety Governance', value: 'HSE & Compliance' },
  { label: 'Procurement / Vendor Registration', value: 'Procurement' },
];

export function ContactForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    serviceCategory: 'General Inquiry',
    message: '',
    consent: false,
    turnstileToken: 'dev-token',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.consent) {
      setError('Please acknowledge the consent checkbox to submit your inquiry.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/enquiries/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to submit contact message.');
      }

      router.push(`/thank-you?ref=${encodeURIComponent(json.data.referenceNumber)}`);
    } catch (err: any) {
      setError(err.message || 'Error occurred while submitting inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-steel-200 rounded p-6 sm:p-8 shadow-industrial space-y-6">
      {error && (
        <div className="p-4 bg-safety-light border-l-4 border-safety-red text-safety-red rounded flex items-start space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="contact-name"
          label="Your Full Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. John Doe"
        />
        <Input
          id="contact-company"
          label="Company / Organization"
          required
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="e.g. Industrial EPC Corp"
        />
        <Input
          id="contact-email"
          type="email"
          label="Business Email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="johndoe@company.com"
        />
        <Input
          id="contact-phone"
          type="tel"
          label="Contact Number"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+91 9764 425 426"
        />
        <Input
          id="contact-country"
          label="Country / Operating Region"
          required
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          placeholder="United Arab Emirates"
        />
        <Select
          id="contact-service"
          label="Area of Inquiry"
          options={SERVICE_OPTIONS}
          value={formData.serviceCategory}
          onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
        />
      </div>

      <Textarea
        id="contact-message"
        label="Your Message / Inquiry Details"
        required
        rows={4}
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="How can our specialist engineering team assist your facility or project?"
      />

      <Turnstile onVerify={(token) => setFormData({ ...formData, turnstileToken: token })} />

      <label className="flex items-start space-x-3 text-xs text-steel-600 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={formData.consent}
          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
          className="mt-0.5 rounded border-steel-300 text-gold focus:ring-gold"
        />
        <span>
          I agree to ARS EXIM processing my contact coordinates for the purpose of responding to this
          technical inquiry in accordance with the corporate privacy policy.
        </span>
      </label>

      <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full sm:w-auto">
        Transmit Technical Inquiry
      </Button>
    </form>
  );
}
