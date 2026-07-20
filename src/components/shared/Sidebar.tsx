'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, BookOpen, User, BarChart2,
  Settings, ChevronLeft, ChevronRight, GraduationCap, BookMarked,
} from 'lucide-react';

const studentLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/my-courses', label: 'My Courses', icon: BookMarked },
  { href: '/catalog', label: 'Course Catalog', icon: BookOpen },
  { href: '/profile', label: 'My Profile', icon: User },
];

const adminLinks = [
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ role }: { role: 'student' | 'admin' }) {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const pathname = usePathname();
  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-white border-r flex flex-col transition-all duration-200 z-10',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="p-4 flex items-center justify-between border-b">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary">ESCRS</span>
          </div>
        )}
        <button onClick={toggleSidebar} className="p-1 rounded hover:bg-muted ml-auto">
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {sidebarOpen && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {sidebarOpen && (
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground capitalize">{role} Portal</p>
        </div>
      )}
    </aside>
  );
}
