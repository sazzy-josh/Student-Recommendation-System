'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUIStore } from '@/store/uiStore';

interface AppLayoutProps {
  children: React.ReactNode;
  role: 'student' | 'admin';
}

export function AppLayout({ children, role }: AppLayoutProps) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar role={role} />
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-200 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
