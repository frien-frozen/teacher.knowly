'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLangRouter } from '@/hooks/useLangRouter';
import { Users, FileText, Database, LogOut, ShieldCheck, UserPlus } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { push } = useLangRouter();
  const pathname = usePathname();

  useEffect(() => {
    const role = localStorage.getItem('knowly_role');
    if (role === 'TEACHER') {
      push('/dashboard');
    }
  }, [push]);

  const navItems = [
    { name: 'Applications', icon: FileText, path: '/admin' },
    { name: 'Teachers', icon: Users, path: '/admin/teachers' },
    { name: 'Invite Educator', icon: UserPlus, path: '/admin/invite' },
    { name: 'Curriculum Editor', icon: Database, path: '/admin/curriculum' },
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-nunito overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#0c111d] text-white flex flex-col shrink-0 border-r border-gray-800">
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <span className="text-xl font-extrabold tracking-tight">Knowly</span>
          <span className="ml-2 flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest rounded-md border border-emerald-500/20 mt-1">
            <ShieldCheck className="w-3 h-3" /> Admin
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = item.path === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.path);
            return (
              <button 
                key={item.name}
                onClick={() => push(item.path)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={() => push('/')} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-3 rounded-xl hover:bg-white/5 font-bold text-sm">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
        {children}
      </main>
    </div>
  );
}
