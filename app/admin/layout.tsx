'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLangRouter } from '@/hooks/useLangRouter';
import { Users, FileText, Database, LogOut, ShieldCheck, UserPlus, Menu, X } from 'lucide-react';
import { logoutUser, getSession } from '@/app/actions/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { push } = useLangRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    getSession().then(session => {
      if (!session) push('/login');
      else if (session.role === 'TEACHER') push('/dashboard');
    });
  }, [push]);

  const navItems = [
    { name: 'Applications', icon: FileText, path: '/admin' },
    { name: 'Teachers', icon: Users, path: '/admin/teachers' },
    { name: 'Invite Educator', icon: UserPlus, path: '/admin/invite' },
    { name: 'Curriculum Editor', icon: Database, path: '/admin/curriculum' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F9FAFB] font-nunito overflow-hidden relative">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between bg-[#0c111d] text-white p-4 shrink-0 z-40">
        <div className="flex items-center">
          <img src="/kn.svg" alt="Knowly" className="h-8 w-auto" />
          <span className="ml-2 flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest rounded-md border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> Admin
          </span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 border border-white/20 rounded-md hover:bg-white/10 transition-colors">
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* OVERLAY FOR MOBILE */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0c111d] text-white flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0 shrink-0 border-r border-gray-800
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-20 hidden md:flex items-center px-8 border-b border-white/10 shrink-0">
          <img src="/kn.svg" alt="Knowly" className="h-8 w-auto" />
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
                onClick={() => { push(item.path); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <button 
            onClick={async () => {
              await logoutUser();
              push('/');
            }} 
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-3 rounded-xl hover:bg-white/5 font-bold text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <div className="flex-1 overflow-y-auto bg-[#F9FAFB] w-full items-center justify-center">
          {children}
        </div>
      </main>
    </div>
  );
}
