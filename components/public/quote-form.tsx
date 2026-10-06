'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Turnstile } from '@/components/public/turnstile';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react';

const REQUIRED_SERVICE_OPTIONS = [
  'Insulation - Hot',
  'Insulation - Cold/Cryogenic',
  'PFP (Passive Fire Protection)',
  'Scaffolding & Access',
  'Coating and Painting',
  'Skilled Manpower',
  'Multiple Services Integrated',
  'Technical Evaluation / Not Sure',
];

const INDUSTRY_OPTIONS = [
  { label: 'Select Industry Sector', value: '' },
  { label: 'Oil & Gas Upstream / Downstream', value: 'Oil & Gas' },
  { label: 'Petrochemical & Refining', value: 'Petrochemical' },
  { label: 'Power Generation & Utilities', value: 'Power Generation' },
  { label: 'Heavy Manufacturing & Minerals', value: 'Heavy Manufacturing' },
  { label: 'Marine & Offshore Infrastructure', value: 'Marine & Offshore' },
  { label: 'Civil & Industrial Infrastructure', value: 'Infrastructure' },
];

const PROJECT_TYPE_OPTIONS = [
  { label: 'Select Project Type', value: '' },
  { label: 'Shutdown / turnaround', value: 'Shutdown / turnaround' },
  { label: 'New build / capital project', value: 'New build / capital project' },
  { label: 'Maintenance / modification', value: 'Maintenance / modification' },
  { label: 'Other / not yet defined', value: 'Other / not yet defined' },
];

export function QuoteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    projectName: '',
    projectType: '',
    industry: '',
    location: '',
    requiredServices: [] as string[],
    expectedStartDate: '',
    projectDuration: '',
    scopeDescription: '',
    consent: false,
    turnstileToken: 'dev-token',
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => {
      const exists = prev.requiredServices.includes(service);
      return {
        ...prev,
        requiredServices: exists
          ? prev.requiredServices.filter((s) => s !== service)
          : [...prev.requiredServices, service],
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > 5) {
      setError('A maximum of 5 files may be uploaded per quotation request.');
      return;
    }

    const totalSize = [...files, ...selectedFiles].reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 25 * 1024 * 1024) {
      setError('Total upload size cannot exceed 25MB.');
      return;
    }

    setError(null);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.requiredServices.length === 0) {
      setError('Please select at least one required industrial service category.');
      return;
    }

    if (!formData.consent) {
      setError('You must confirm consent to process project specifications.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('company', formData.company);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('country', formData.country);
      data.append('projectName', formData.projectName);
      data.append('projectType', formData.projectType);
      data.append('industry', formData.industry);
      data.append('location', formData.location);
      data.append('requiredServices', JSON.stringify(formData.requiredServices));
      data.append('expectedStartDate', formData.expectedStartDate);
      data.append('projectDuration', formData.projectDuration);
      data.append('scopeDescription', formData.scopeDescription);
      data.append('consent', 'true');
      data.append('turnstileToken', formData.turnstileToken);

      files.forEach((file) => {
        data.append('files', file);
      });

      const res = await fetch('/api/enquiries/quote', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to submit quotation request.');
      }

      // Successful database persistence -> redirect to confirmation page
      router.push(`/thank-you?ref=${encodeURIComponent(json.data.referenceNumber)}`);
    } catch (err: any) {
      setError(err.message || 'Network error encountered. Please check details and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-steel-200 rounded p-6 sm:p-10 shadow-industrial space-y-8">
      {error && (
        <div className="p-4 bg-safety-light border-l-4 border-safety-red text-safety-red rounded flex items-start space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Corporate & Contact Coordinates */}
      <div>
        <h3 className="text-lg font-bold text-navy-900 border-b border-steel-200 pb-2 mb-5">
          1. Company & Contact Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="name"
            label="Contact Person Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. John Doe, Lead Project Engineer"
          />
          <Input
            id="company"
            label="Company / Enterprise Name"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g. Petrochemical Solutions Ltd."
          />
          <Input
            id="email"
            type="email"
            label="Corporate Email Address"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="johndoe@company.com"
          />
          <Input
            id="phone"
            type="tel"
            label="Phone / Mobile Number"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 9764 425 426"
          />
          <div className="sm:col-span-2">
            <Input
              id="country"
              label="Country / Region of Operation"
              required
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="e.g. United Arab Emirates, Saudi Arabia, Oman, etc."
            />
          </div>
        </div>
      </div>

      {/* Step 2: Industrial Project Scope */}
      <div>
        <h3 className="text-lg font-bold text-navy-900 border-b border-steel-200 pb-2 mb-5">
          2. Project Specifications & Scope
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <Input
            id="projectName"
            label="Project Name / Facility ID (Optional)"
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            placeholder="e.g. Refinery Unit 4 Overhaul"
          />
          <Select
            id="industry"
            label="Industry Sector"
            options={INDUSTRY_OPTIONS}
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />
          <Select
            id="projectType"
            label="Project Type"
            options={PROJECT_TYPE_OPTIONS}
            required
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
          />
          <Input
            id="location"
            label="Project Site Location (Optional)"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. Ruwais Industrial Zone"
          />
          <Input
            id="expectedStartDate"
            type="date"
            label="Anticipated Start Date (Optional)"
            value={formData.expectedStartDate}
            onChange={(e) => setFormData({ ...formData, expectedStartDate: e.target.value })}
          />
        </div>

        {/* Required Services Checkboxes */}
        <div className="mb-5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-steel-700 mb-2">
            Required Industrial Services <span className="text-safety-red">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REQUIRED_SERVICE_OPTIONS.map((service) => {
              const checked = formData.requiredServices.includes(service);
              return (
                <button
                  type="button"
                  key={service}
                  onClick={() => handleServiceToggle(service)}
                  className={`flex items-center space-x-3 p-3 text-left border rounded text-xs font-semibold transition-colors ${
                    checked
                      ? 'border-navy-900 bg-navy-900 text-white'
                      : 'border-steel-300 text-steel-700 hover:border-navy-700 bg-white'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                      checked ? 'bg-gold border-gold text-navy-950' : 'border-steel-400 bg-white'
                    }`}
                  >
                    {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span>{service}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Textarea
          id="scopeDescription"
          label="Detailed Technical Scope Description"
          required
          rows={5}
          value={formData.scopeDescription}
          onChange={(e) => setFormData({ ...formData, scopeDescription: e.target.value })}
          placeholder="Please specify engineering parameters, operating temperatures, pipe diameters, square meter area, fire resistance ratings, or scaffolding dimensions..."
        />
      </div>

      {/* Step 3: Engineering Attachments & Verification */}
      <div>
        <h3 className="text-lg font-bold text-navy-900 border-b border-steel-200 pb-2 mb-4">
          3. Technical Documents & Drawings (BoQ, Specs, P&ID)
        </h3>
        <p className="text-xs text-steel-500 mb-4">
          Allowed formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG. Max 5 files, 10MB per file, 25MB total.
        </p>

        <div className="border-2 border-dashed border-steel-300 rounded p-6 text-center hover:border-navy-700 transition-colors bg-steel-50">
          <UploadCloud className="w-8 h-8 text-steel-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-navy-900 mb-1">
            Drag and drop project specifications here, or click to browse
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <span className="inline-block mt-2 bg-navy-900 text-white text-xs font-semibold px-4 py-2 rounded cursor-pointer hover:bg-navy-800 transition-colors">
              Select Files
            </span>
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white border border-steel-200 rounded text-xs"
              >
                <div className="flex items-center space-x-2 truncate">
                  <FileText className="w-4 h-4 text-gold flex-shrink-0" />
                  <span className="font-semibold text-navy-900 truncate">{file.name}</span>
                  <span className="text-steel-400">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-steel-400 hover:text-safety-red transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 space-y-4">
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
              I confirm that the submitted project specifications are accurate and authorize ARS EXIM to
              use these details to respond to my quotation request in accordance with the privacy policy.
            </span>
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-steel-200">
        <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full sm:w-auto">
          Submit Industrial Quotation Request
        </Button>
      </div>
    </form>
  );
}
