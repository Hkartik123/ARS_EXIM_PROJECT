'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopbar } from '@/components/admin/topbar';
import { UserRole } from '@/models/User';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<{ name: string; email: string; role: UserRole } | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const json = await res.json();
        if (res.ok && json.success) {
          setUser(json.data.user);
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-white text-sm font-semibold">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <span>Authenticating Administrator Privileges...</span>
        </div>
      </div>
    );
  }

  const getPageTitle = () => {
    if (pathname.includes('/projects')) return 'Project Case Studies';
    if (pathname.includes('/enquiries')) return 'Enquiries & Quotation Requests';
    if (pathname.includes('/careers')) return 'Recruitment & Job Openings';
    if (pathname.includes('/applications')) return 'Candidate Applications';
    if (pathname.includes('/media')) return 'Media Asset Library';
    if (pathname.includes('/settings')) return 'Corporate Site Settings';
    if (pathname.includes('/audit-logs')) return 'Security Audit Trail';
    return 'Operations Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-steel-100 font-sans">
      <AdminSidebar
        userRole={user?.role}
        userName={user?.name}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar
          title={getPageTitle()}
          userName={user?.name}
          userRole={user?.role}
        />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
