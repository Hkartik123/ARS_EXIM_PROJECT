'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  FolderPlus,
  Wrench,
  Inbox,
  Briefcase,
  Users,
  Image as ImageIcon,
  ImagePlus,
  MessageSquareQuote,
  HelpCircle,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/models/User';
import { CompanyLogo } from '@/components/ui/company-logo';

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
  const canManageContent = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN_CONTENT';

  return (
    <aside className="w-64 bg-steel-50 text-navy-900 flex flex-col border-r border-steel-200 flex-shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-steel-200 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center space-x-3">
          <CompanyLogo sizes="86px" className="h-[72px] w-auto" />
        </Link>
      </div>

      {canManageContent && (
        <div className="border-b border-steel-200 px-4 py-4">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-steel-500">
            Quick Upload
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/admin/projects/new"
              className="flex min-h-16 flex-col items-center justify-center gap-1 rounded border border-steel-200 bg-white px-2 py-2 text-center text-[11px] font-semibold text-navy-900 transition-colors hover:border-accent hover:bg-steel-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <FolderPlus className="h-4 w-4 text-accent-700" aria-hidden="true" />
              Project details
            </Link>
            <Link
              href="/admin/media"
              className="flex min-h-16 flex-col items-center justify-center gap-1 rounded border border-steel-200 bg-white px-2 py-2 text-center text-[11px] font-semibold text-navy-900 transition-colors hover:border-accent hover:bg-steel-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <ImagePlus className="h-4 w-4 text-accent-700" aria-hidden="true" />
              Upload image
            </Link>
          </div>
        </div>
      )}

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
                    ? 'bg-white text-navy-900 font-bold shadow-sm border border-steel-200'
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
