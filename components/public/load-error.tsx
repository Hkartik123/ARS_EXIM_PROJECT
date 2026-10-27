'use client';

import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

interface LoadErrorProps {
  title: string;
  message: string;
}

export function LoadError({ title, message }: LoadErrorProps) {
  const router = useRouter();

  return (
    <div role="alert" className="rounded border border-steel-200 bg-white px-6 py-10 text-center">
      <h2 className="font-display text-2xl font-bold text-navy-900">{title}</h2>
      <p className="mt-2 text-sm text-steel-600">{message}</p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded bg-navy-900 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-navy-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Try again
      </button>
    </div>
  );
}
