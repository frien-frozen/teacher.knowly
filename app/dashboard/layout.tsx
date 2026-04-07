'use client';

import React, { useEffect } from 'react';
import { useLangRouter } from '@/hooks/useLangRouter';
import { User, BookOpen, Video, LogOut, UploadCloud } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { push } = useLangRouter();
  const pathname = usePathname();

  useEffect(() => {
    const role = localStorage.getItem('knowly_role');
    if (role === 'ADMIN') {
      push('/admin');
    }
  }, [push]);

  const navItems = [
    { name: 'My Profile', icon: User, path: '/dashboard' },
    { name: 'Course Manager', icon: BookOpen, path: '/dashboard/course' },
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-nunito overflow-hidden">
      
      {/* TEACHER SIDEBAR */}
      <aside className="w-64 bg-[#101828] text-white flex flex-col hidden md:flex shrink-0">
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <img src="/logo.png" alt="Knowly" className="h-7 w-auto brightness-0 invert" />
          <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase tracking-widest rounded-md border border-blue-500/20 mt-1">
            Teacher
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = item.path === '/dashboard' 
              ? pathname === '/dashboard' 
              : pathname?.startsWith(item.path);

            return (
              <button 
                key={item.name}
                onClick={() => push(item.path)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#D92D20] to-[#FDB022] text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
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

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          {children}
        </div>
      </main>

    </div>
  );
}
