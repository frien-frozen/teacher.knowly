'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface LanguageContextType {
    language: string;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize from URL to prevent hydration mismatch
    const initialLang = searchParams.get('lang') === 'en' ? 'en' : 'uz';
    const [language, setLanguage] = useState(initialLang);

    // One-way binding: URL -> State only
    useEffect(() => {
        const urlLang = searchParams.get('lang');
        if (urlLang === 'en' || urlLang === 'uz') {
            setLanguage(urlLang);
        }
    }, [searchParams]);

    const toggleLanguage = () => {
        const newLang = language === 'uz' ? 'en' : 'uz';
        setLanguage(newLang);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('lang', newLang);
        router.push(currentUrl.pathname + currentUrl.search);
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
