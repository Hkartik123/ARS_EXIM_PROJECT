import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-xs text-steel-500">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:text-gold flex items-center transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <ChevronRight className="w-3 h-3 text-steel-400" />
            {item.href ? (
              <Link href={item.href} className="hover:text-gold transition-colors font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-navy-900 font-bold" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
