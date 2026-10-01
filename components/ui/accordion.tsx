'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  question: string;
  answer: string;
}

export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="border border-steel-200 bg-white rounded overflow-hidden transition-colors"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between p-5 text-left font-semibold text-navy-900 transition-colors hover:bg-steel-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700"
            >
              <span className="text-base font-bold pr-4">{item.question}</span>
              <ChevronDown
                className={cn('h-5 w-5 text-steel-500 transition-transform duration-200 flex-shrink-0', isOpen && 'rotate-180 text-gold')}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-steel-700 border-t border-steel-100 bg-white">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
