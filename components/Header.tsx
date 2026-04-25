'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLangRouter } from '@/hooks/useLangRouter';
import { useLanguage } from '@/context/LanguageContext';
import { LogIn, ArrowRight, Menu, X, ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react';
import { getSession, logoutUser } from '@/app/actions/auth';

const NAV_TEXT = {
    en: {
        directions: "Directions",
        mission: "Our Purpose",
        community: "Community",
        login: "Login",
        apply: "Start Teaching",
        dashboard: "Go to Dashboard",
        logout: "Log Out",
    },
    uz: {
        directions: "Yo'nalishlar",
        mission: "Maqsadimiz",
        community: "Jamoa",
        login: "Kirish",
        apply: "Boshlash",
        dashboard: "Dashboard",
        logout: "Chiqish",
    }
};

type Session = { name: string; email: string; role: string } | null;

export default function Header() {
    const pathname = usePathname();
    const { push, lang } = useLangRouter();
    const { toggleLanguage } = useLanguage();
    const t = NAV_TEXT[lang as 'en' | 'uz'] || NAV_TEXT.uz;

    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [session, setSession] = useState<Session>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getSession().then(s => setSession(s as Session));
    }, []);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    if (pathname && (
        pathname.includes('/apply') ||
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/activate') ||
        pathname.startsWith('/forgot-password') ||
        pathname.startsWith('/reset-password')
    )) return null;

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            push(`/#${id}`);
        }
        setMenuOpen(false);
    };

    const handleLogout = async () => {
        await logoutUser();
        setSession(null);
        setDropdownOpen(false);
        push('/');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">

                {/* Logo */}
                <div onClick={() => push('/')} className="cursor-pointer hover:opacity-80 transition-opacity flex items-center shrink-0">
                    <img src="/logos/knowly-header.png" alt="KNOWLY" className="h-9 sm:h-11 w-auto object-contain" />
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1 bg-[#F3F4F6] px-2 py-2 rounded-full border border-gray-200">
                    <button onClick={() => scrollTo('curriculums')} className="px-5 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-gray-500 hover:bg-white hover:text-[#D92D20] hover:shadow-sm transition-all">
                        {t.directions}
                    </button>
                    <button onClick={() => scrollTo('mission')} className="px-5 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-gray-500 hover:bg-white hover:text-[#D92D20] hover:shadow-sm transition-all">
                        {t.mission}
                    </button>
                    <button onClick={() => scrollTo('teachers')} className="px-5 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-gray-500 hover:bg-white hover:text-[#D92D20] hover:shadow-sm transition-all">
                        {t.community}
                    </button>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <button onClick={toggleLanguage} className="flex items-center justify-center w-10 h-10 bg-[#F3F4F6] hover:bg-gray-200 rounded-full transition-colors text-sm border border-gray-200">
                        <span>{lang === 'uz' ? '🇺🇿' : '🇬🇧'}</span>
                    </button>

                    {session ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(v => !v)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-[#F3F4F6] hover:bg-gray-200 text-gray-700 rounded-full font-extrabold text-xs uppercase tracking-wider border border-gray-200 transition-all"
                            >
                                <div className="w-5 h-5 rounded-full bg-[#D92D20] flex items-center justify-center text-white text-[9px] font-black shrink-0">
                                    {session.name?.[0]?.toUpperCase() || <User className="w-3 h-3" />}
                                </div>
                                <span className="max-w-[80px] truncate">{session.name}</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                    <button
                                        onClick={() => { push(session.role === 'ADMIN' ? '/admin' : '/dashboard'); setDropdownOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <LayoutDashboard className="w-4 h-4 text-[#D92D20]" />
                                        {t.dashboard}
                                    </button>
                                    <div className="h-px bg-gray-100" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        {t.logout}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => push('/login')} className="flex items-center gap-2 px-5 py-2.5 bg-[#F3F4F6] hover:bg-gray-200 text-gray-600 rounded-full font-extrabold text-xs uppercase tracking-wider border border-gray-200 transition-all">
                            <LogIn className="w-4 h-4" />
                            <span>{t.login}</span>
                        </button>
                    )}

                    <button onClick={() => window.open('/apply', '_blank', 'noopener,noreferrer')} className="bg-[#FDB022] text-[#7B2D08] px-6 py-2.5 rounded-2xl font-extrabold text-sm hover:bg-[#F59E0B] transition-all border-b-4 border-[#D97706] active:border-b-0 active:translate-y-1 flex items-center gap-2">
                        <span>{t.apply}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Mobile: lang + hamburger */}
                <div className="flex md:hidden items-center gap-2">
                    <button onClick={toggleLanguage} className="w-9 h-9 bg-[#F3F4F6] hover:bg-gray-200 rounded-full flex items-center justify-center text-sm border border-gray-200">
                        <span>{lang === 'uz' ? '🇺🇿' : '🇬🇧'}</span>
                    </button>
                    <button
                        onClick={() => setMenuOpen(v => !v)}
                        className="w-9 h-9 bg-[#F3F4F6] hover:bg-gray-200 rounded-full flex items-center justify-center border border-gray-200"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-5 pt-3 flex flex-col gap-2 shadow-lg">
                    <button onClick={() => scrollTo('curriculums')} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#D92D20] transition-colors uppercase tracking-wide">
                        {t.directions}
                    </button>
                    <button onClick={() => scrollTo('mission')} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#D92D20] transition-colors uppercase tracking-wide">
                        {t.mission}
                    </button>
                    <button onClick={() => scrollTo('teachers')} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#D92D20] transition-colors uppercase tracking-wide">
                        {t.community}
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                    {session ? (
                        <>
                            <div className="px-4 py-2 text-xs font-extrabold text-gray-400 uppercase tracking-widest">{session.name}</div>
                            <button
                                onClick={() => { push(session.role === 'ADMIN' ? '/admin' : '/dashboard'); setMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4 text-[#D92D20]" />
                                {t.dashboard}
                            </button>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors">
                                <LogOut className="w-4 h-4" />
                                {t.logout}
                            </button>
                        </>
                    ) : (
                        <button onClick={() => { push('/login'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                            <LogIn className="w-4 h-4 text-gray-500" />
                            {t.login}
                        </button>
                    )}
                    <button onClick={() => { window.open('/apply', '_blank', 'noopener,noreferrer'); setMenuOpen(false); }} className="mt-1 bg-[#FDB022] text-[#7B2D08] px-5 py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 border-b-4 border-[#D97706]">
                        {t.apply} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </header>
    );
}
