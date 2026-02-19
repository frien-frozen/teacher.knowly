'use client';

import React from 'react';
import { useLangRouter } from '@/hooks/useLangRouter';
import { useLanguage } from '@/context/LanguageContext';
import { LogIn, ArrowRight } from 'lucide-react';

const NAV_TEXT = {
    en: {
        directions: "Directions",
        mission: "Our Purpose",
        community: "Community",
        login: "Login",
        apply: "Start Teaching",
        langName: "English"
    },
    uz: {
        directions: "Yo'nalishlar",
        mission: "Maqsadimiz",
        community: "Jamoa",
        login: "Kirish",
        apply: "Boshlash",
        langName: "O'zbek"
    }
};

export default function Header() {
    const { push, lang } = useLangRouter();
    const { toggleLanguage } = useLanguage();
    const t = NAV_TEXT[lang as 'en' | 'uz'] || NAV_TEXT.uz;

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            push(`/#${id}`);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-24 bg-white/95 backdrop-blur-xl border-b border-gray-100">
            <div className="w-full max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                <div onClick={() => push('/')} className="cursor-pointer hover:opacity-80 transition-opacity flex items-center">
                    <img src="/logos/knowly-header.png" alt="KNOWLY" className="h-12 w-auto object-contain" />
                </div>

                <nav className="hidden md:flex items-center gap-1 bg-[#F3F4F6] px-2 py-2 rounded-full border border-gray-200">
                    <button onClick={() => scrollTo('curriculums')} className="px-6 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-gray-500 hover:bg-white hover:text-[#D92D20] hover:shadow-sm transition-all">
                        {t.directions}
                    </button>
                    <button onClick={() => scrollTo('mission')} className="px-6 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-gray-500 hover:bg-white hover:text-[#D92D20] hover:shadow-sm transition-all">
                        {t.mission}
                    </button>
                    <button onClick={() => scrollTo('teachers')} className="px-6 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-gray-500 hover:bg-white hover:text-[#D92D20] hover:shadow-sm transition-all">
                        {t.community}
                    </button>
                </nav>

                <div className="flex items-center gap-3">
                    <button onClick={toggleLanguage} className="hidden sm:flex items-center gap-2 px-4 py-3 bg-[#F3F4F6] hover:bg-gray-200 rounded-full transition-colors text-xs font-extrabold text-gray-600 border border-gray-200">
                        <span>{lang === 'uz' ? '🇺🇿' : '🇬🇧'}</span>
                    </button>

                    <button onClick={() => push('/login')} className="hidden sm:flex items-center gap-2 px-5 py-3 bg-[#F3F4F6] hover:bg-gray-200 text-gray-600 rounded-full font-extrabold text-xs uppercase tracking-wider border border-gray-200 transition-all">
                        <LogIn className="w-4 h-4" />
                        <span>{t.login}</span>
                    </button>

                    <button onClick={() => push('/apply')} className="bg-[#FDB022] text-[#7B2D08] px-8 py-3 rounded-2xl font-extrabold text-sm hover:bg-[#F59E0B] transition-all border-b-4 border-[#D97706] active:border-b-0 active:translate-y-1 active:mt-1 flex items-center gap-2">
                        <span>{t.apply}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}
