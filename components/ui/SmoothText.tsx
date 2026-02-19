'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function SmoothText({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const { language } = useLanguage();

    return (
        <AnimatePresence mode="wait">
            <motion.span
                key={language} // Triggers animation when language changes
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`inline-block ${className}`}
            >
                {children}
            </motion.span>
        </AnimatePresence>
    );
}
