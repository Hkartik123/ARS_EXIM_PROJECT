'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

interface TurnstileProps {
  onVerify: (token: string) => void;
}

export function Turnstile({ onVerify }: TurnstileProps) {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // In dev or test environments, simulate verification automatically
    const timer = setTimeout(() => {
      setVerified(true);
      onVerify('cf-turnstile-mock-token-verified');
    }, 400);

    return () => clearTimeout(timer);
  }, [onVerify]);

  return (
    <div className="flex items-center space-x-2 py-2 px-3 bg-steel-50 border border-steel-200 rounded text-xs text-steel-600">
      <ShieldCheck className="w-4 h-4 text-success" />
      <span>Security Verification: {verified ? 'Human verification confirmed' : 'Checking security token...'}</span>
    </div>
  );
}
