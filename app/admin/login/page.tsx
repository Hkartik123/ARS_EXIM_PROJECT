'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, AlertCircle, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@arsexim.com');
  const [password, setPassword] = useState('ArsEximSecure2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Authentication failed.');
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto mb-3 flex justify-center">
          <Image
            src="/ars-exim-logo-transparent.png"
            alt="ARS EXIM logo"
            width={220}
            height={160}
            priority
            className="h-[128px] w-auto rounded-md bg-white p-1.5 object-contain shadow-sm"
          />
        </div>
        <h2 className="text-2xl font-black text-white font-display tracking-tight">
          ARS EXIM Staff Command Portal
        </h2>
        <p className="mt-1 text-xs text-steel-400 font-semibold uppercase tracking-widest">
          Authorized Engineering & Administrative Access Only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded border border-steel-200 shadow-industrial space-y-6">
          {error && (
            <div className="p-3.5 bg-safety-light border-l-4 border-safety-red text-safety-red text-xs font-semibold rounded flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="admin-email"
              type="email"
              label="Staff Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@arsexim.com"
            />

            <Input
              id="admin-password"
              type="password"
              label="Master Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />

            <div className="p-3 bg-steel-50 rounded border border-steel-200 text-xs text-steel-600 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-gold flex-shrink-0" />
              <span>Sessions are secured with HttpOnly tokens & brute-force backoff protection.</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full text-sm font-bold"
            >
              Authenticate & Enter CMS
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
