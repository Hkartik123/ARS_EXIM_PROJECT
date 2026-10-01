'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Turnstile } from '@/components/public/turnstile';
import { CheckCircle2, AlertCircle, UploadCloud, FileText } from 'lucide-react';

interface CareerApplyFormProps {
  jobId: string;
  jobTitle: string;
}

export function CareerApplyForm({ jobId, jobTitle }: CareerApplyFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    phone: '',
    currentLocation: '',
    yearsOfExperience: '',
    coverLetter: '',
    turnstileToken: 'dev-token',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setError('Resume file size cannot exceed 10MB.');
        return;
      }
      setError(null);
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resumeFile) {
      setError('Please upload your resume / CV (PDF or DOCX format).');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('jobId', jobId);
      data.append('jobTitle', jobTitle);
      data.append('candidateName', formData.candidateName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('currentLocation', formData.currentLocation);
      data.append('yearsOfExperience', formData.yearsOfExperience);
      data.append('coverLetter', formData.coverLetter);
      data.append('turnstileToken', formData.turnstileToken);
      data.append('resume', resumeFile);

      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to submit application.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error submitting application.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-success-light border border-success/40 p-8 rounded text-center">
        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
        <h3 className="text-xl font-bold text-navy-900 mb-2">Application Received</h3>
        <p className="text-sm text-steel-700 max-w-md mx-auto leading-relaxed">
          Thank you for applying for the position of <strong>{jobTitle}</strong>. Our human resources
          and technical recruitment team will review your qualifications and contact you directly if shortlisted.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-steel-200 rounded p-6 sm:p-8 shadow-sm space-y-6">
      <h3 className="text-xl font-bold text-navy-900 pb-3 border-b border-steel-100">
        Submit Your Application
      </h3>

      {error && (
        <div className="p-4 bg-safety-light border-l-4 border-safety-red text-safety-red rounded flex items-start space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="candidateName"
          label="Full Legal Name"
          required
          value={formData.candidateName}
          onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
          placeholder="e.g. Michael Smith"
        />
        <Input
          id="email"
          type="email"
          label="Email Address"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="michael.smith@email.com"
        />
        <Input
          id="phone"
          type="tel"
          label="Contact Number"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+91 9764 425 426"
        />
        <Input
          id="currentLocation"
          label="Current Location (City, Country)"
          required
          value={formData.currentLocation}
          onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
          placeholder="Dubai, UAE"
        />
        <div className="sm:col-span-2">
          <Input
            id="yearsOfExperience"
            type="number"
            min="0"
            max="50"
            label="Years of Relevant Industrial Experience"
            required
            value={formData.yearsOfExperience}
            onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
            placeholder="e.g. 7"
          />
        </div>
      </div>

      <Textarea
        id="coverLetter"
        label="Cover Note / Key Certifications Summary"
        rows={3}
        value={formData.coverLetter}
        onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
        placeholder="Detail your industrial certifications (e.g. CSWIP, NACE, CISRS, IOSH) and key project background..."
      />

      {/* Resume File Upload */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-steel-700 mb-1.5">
          Resume / CV Document <span className="text-safety-red">*</span>
        </label>
        <div className="border border-dashed border-steel-300 rounded p-4 text-center bg-steel-50">
          <input
            type="file"
            id="resume-file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          {resumeFile ? (
            <div className="flex items-center justify-center space-x-2 text-xs font-bold text-navy-900">
              <FileText className="w-4 h-4 text-gold" />
              <span>{resumeFile.name} ({(resumeFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
            </div>
          ) : (
            <label htmlFor="resume-file" className="cursor-pointer">
              <UploadCloud className="w-6 h-6 text-steel-400 mx-auto mb-1" />
              <span className="text-xs text-navy-900 font-semibold underline">
                Select PDF or DOCX file (Max 10MB)
              </span>
            </label>
          )}
        </div>
      </div>

      <Turnstile onVerify={(token) => setFormData({ ...formData, turnstileToken: token })} />

      <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full">
        Submit Formal Application
      </Button>
    </form>
  );
}
