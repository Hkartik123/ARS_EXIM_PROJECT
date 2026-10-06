'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  Wrench,
  Inbox,
  Briefcase,
  Users,
  Image as ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/models/User';

interface SidebarProps {
  userRole?: UserRole;
  userName?: string;
  onLogout: () => void;
}

export function AdminSidebar({ userRole = 'SUPER_ADMIN', userName = 'Admin', onLogout }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN_CONTENT', 'SALES_BD', 'HR', 'VIEWER'] },
    { name: 'Projects', href: '/admin/projects', icon: FolderGit2, roles: ['SUPER_ADMIN', 'ADMIN_CONTENT', 'VIEWER'] },
    { name: 'Services', href: '/admin/services', icon: Wrench, roles: ['SUPER_ADMIN', 'ADMIN_CONTENT', 'VIEWER'] },
    { name: 'Enquiries & RFQs', href: '/admin/enquiries', icon: Inbox, roles: ['SUPER_ADMIN', 'SALES_BD', 'VIEWER'] },
    { name: 'Careers', href: '/admin/careers', icon: Briefcase, roles: ['SUPER_ADMIN', 'HR', 'VIEWER'] },
    { name: 'Applications', href: '/admin/applications', icon: Users, roles: ['SUPER_ADMIN', 'HR', 'VIEWER'] },
    { name: 'Media Library', href: '/admin/media', icon: ImageIcon, roles: ['SUPER_ADMIN', 'ADMIN_CONTENT'] },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote, roles: ['SUPER_ADMIN', 'ADMIN_CONTENT'] },
    { name: 'Technical FAQs', href: '/admin/faqs', icon: HelpCircle, roles: ['SUPER_ADMIN', 'ADMIN_CONTENT'] },
    { name: 'Site Settings', href: '/admin/settings', icon: Settings, roles: ['SUPER_ADMIN'] },
    { name: 'Staff Users', href: '/admin/users', icon: Users, roles: ['SUPER_ADMIN'] },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldCheck, roles: ['SUPER_ADMIN'] },
  ];

  return (
    <aside className="w-64 bg-[#edf5ff] text-navy-900 flex flex-col border-r border-[#dfeaf7] flex-shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#dfeaf7] flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center space-x-3">
          <Image src="/ars-exim-logo-transparent.png" alt="ARS EXIM logo" width={220} height={120} className="h-[88px] w-auto object-contain" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation
          .filter((item) => userRole === 'SUPER_ADMIN' || item.roles.includes(userRole))
          .map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3.5 py-2.5 rounded text-xs font-semibold tracking-wide transition-colors group',
                  isActive
                    ? 'bg-white text-navy-900 font-bold shadow-sm border border-[#dfeaf7]'
                    : 'text-navy-700 hover:bg-white hover:text-navy-900'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 mr-3 transition-colors',
                    isActive ? 'text-navy-900' : 'text-navy-700 group-hover:text-navy-900'
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
      </nav>

      {/* Bottom User Coordinates & Signout */}
      <div className="p-4 border-t border-navy-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-navy-700 hover:text-navy-900 transition-colors"
        >
          <span>View Public Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={onLogout}
          type="button"
          className="w-full flex items-center px-3 py-2 text-xs font-semibold text-safety-red hover:bg-navy-900 rounded transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
