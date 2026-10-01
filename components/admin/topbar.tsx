'use client';

import React from 'react';
import { UserRole } from '@/models/User';
import { ShieldCheck, User } from 'lucide-react';

interface TopbarProps {
  title: string;
  userName?: string;
  userRole?: UserRole;
}

export function AdminTopbar({ title, userName = 'Admin', userRole = 'SUPER_ADMIN' }: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-steel-200 px-6 sm:px-8 flex items-center justify-between">
      <h1 className="text-xl font-bold text-navy-900 tracking-tight">{title}</h1>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-xs text-steel-600 bg-steel-100 px-3 py-1.5 rounded">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          <span className="font-semibold text-navy-900">{userName}</span>
          <span className="text-steel-400 font-bold">•</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-gold-700 bg-gold-100 px-1.5 py-0.5 rounded">
            {userRole}
          </span>
        </div>
      </div>
    </header>
  );
}
