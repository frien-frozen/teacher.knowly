'use client';

import React, { useState } from 'react';
import { useLangRouter } from '@/hooks/useLangRouter';
import { ArrowLeft, Globe, Star, Zap, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const CONTENT = {
    en: {
        back: "Back to Home",
        heading: "Become a Knowly Educator",
        subheading: "Apply to become a verified Knowly Teacher and start sharing your knowledge.",
        form: {
            title: "Teacher Application",
            subtitle: "Please fill in your details below.",
            name: "Full Name",
            placeName: "e.g. Aziz Rahimov",
            email: "Email Address",
            placeEmail: "name@example.com",
            phone: "Phone Number",
            placePhone: "+998 90 123 45 67",
            curriculum: "Curriculum",
            placeCurriculum: "Select curriculum",
            subject: "Subject",
            placeSubject: "Select subject",
            linkedin: "LinkedIn / CV Link",
            placeLinkedin: "https://linkedin.com/in/...",
            motivation: "Why do you want to join our team?",
            placeMotivation: "Tell us about your experience...",
            submit: "Submit Application",
            submitting: "Processing..."
        },
        success: {
            title: "Application Received",
            desc: "Thank you! Our team is reviewing your profile. Please check your email inbox for the next steps within 24 hours.",
            home: "Return to Homepage"
        }
    },
    uz: {
        back: "Bosh sahifaga qaytish",
        heading: "Knowly-da Ustoziga Aylaning!",
        subheading: "Tasdiqlangan Knowly ustoziga aylaning va bilimingizni butun mamlakat bo'ylab ulashing.",
        form: {
            title: "O'qituvchi anketasi",
            subtitle: "Iltimos, quyidagi ma'lumotlarni to'ldiring.",
            name: "To'liq Ismingiz",
            placeName: "Masalan: Aziz Rahimov",
            email: "Elektron Pochta",
            placeEmail: "ism@misol.uz",
            phone: "Telefon Raqam",
            placePhone: "+998 90 123 45 67",
            curriculum: "Ta'lim Dasturi",
            placeCurriculum: "Dasturni tanlang",
            subject: "Faningiz",
            placeSubject: "Fanni tanlang",
            linkedin: "LinkedIn / CV Havolasi",
            placeLinkedin: "https://linkedin.com/in/...",
            motivation: "Nima uchun jamoamizga qo'shilmoqchisiz?",
            placeMotivation: "Tajribangiz haqida so'zlab bering...",
            submit: "Arizani Yuborish",
            submitting: "Yuborilmoqda..."
        },
        success: {
            title: "Ariza Qabul Qilindi",
            desc: "Rahmat! Jamoamiz arizangizni ko'rib chiqmoqda. Iltimos, keyingi qadamlar uchun 24 soat ichida elektron pochtangizni tekshiring.",
            home: "Bosh sahifaga qaytish"
        }
    }
};

const CURRICULUMS = [
    "Cambridge Lower Secondary",
    "Cambridge IGCSE",
    "Cambridge A-Level",
    "Pearson Edexcel",
    "National Standard (Milliy)"
];

const SUBJECTS = {
    en: ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English", "Business", "Economics", "Other"],
    uz: ["Matematika", "Fizika", "Kimyo", "Biologiya", "Informatika", "Ingliz tili", "Biznes", "Iqtisodiyot", "Boshqa"]
};

const checkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: 0.8, ease: "easeInOut" as const }
    }
};

export default function ApplyPage() {
    const { lang, push } = useLangRouter();
    const t = CONTENT[lang as 'en' | 'uz'] || CONTENT.uz;
    const currentSubjects = SUBJECTS[lang as 'en' | 'uz'] || SUBJECTS.uz;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[9999] w-screen h-screen bg-white flex font-nunito overflow-hidden">

            {/* 1. LEFT SIDE — Fixed, No Scroll */}
            <div className="hidden lg:flex w-5/12 h-full bg-[#101828] relative overflow-hidden flex-col justify-between p-12 xl:p-16 text-white shadow-[20px_0_40px_rgba(0,0,0,0.1)] z-10">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-[#D92D20] rounded-full blur-[150px] opacity-20"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-[#FDB022] rounded-full blur-[150px] opacity-20"></div>
                </div>

                <div className="relative z-10">
                    <div onClick={() => push('/')} className="cursor-pointer opacity-90 hover:opacity-100 transition-opacity mb-10 inline-block">
                        <img src="/logos/knowly-header.png" alt="KNOWLY" className="h-10 w-auto" />
                    </div>
                    <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight mb-6 tracking-tight">{t.heading}</h1>
                    <p className="text-gray-400 text-lg font-medium max-w-sm leading-relaxed">{t.subheading}</p>
                </div>

                <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none">
                    <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 right-10 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-2xl flex items-center justify-center border-t border-white/20">
                        <Globe className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-1/3 left-10 w-20 h-20 bg-gradient-to-br from-[#FDB022] to-orange-600 rounded-full shadow-2xl flex items-center justify-center border-t border-white/20">
                        <Star className="w-8 h-8 text-white fill-white" />
                    </motion.div>
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-[#D92D20] to-red-800 rounded-[2rem] shadow-2xl flex items-center justify-center border-t border-white/20 rotate-12">
                        <Zap className="w-14 h-14 text-white fill-white" />
                    </motion.div>
                </div>

                <div className="relative z-10 text-xs text-gray-500 font-bold uppercase tracking-wider">© 2026 Knowly Inc.</div>
            </div>

            {/* 2. RIGHT SIDE — Independently Scrollable */}
            <div className="w-full lg:w-7/12 h-full bg-white relative flex flex-col items-center overflow-y-auto">

                {/* Back Button */}
                <div className="absolute top-6 left-6 md:top-8 md:left-8 w-full z-20">
                    <button onClick={() => push('/')} className="flex items-center gap-3 text-gray-400 font-bold text-sm hover:text-[#101828] transition-colors w-fit">
                        <ArrowLeft className="w-5 h-5" />
                        {t.back}
                    </button>
                </div>

                {/* Inner Centered Container */}
                <div className="w-full max-w-[520px] mx-auto py-24 px-6 mt-auto mb-auto flex flex-col justify-center min-h-full">

                    {isSuccess ? (
                        <div className="text-center">
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-50"></div>
                                <svg className="w-12 h-12 text-green-600 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <motion.path variants={checkVariants} initial="hidden" animate="visible" d="M20 6L9 17l-5-5" />
                                </svg>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <h2 className="text-3xl font-extrabold text-[#101828] mb-4">{t.success.title}</h2>
                                <p className="text-gray-500 text-base font-medium mb-10 leading-relaxed max-w-sm mx-auto">{t.success.desc}</p>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                <button onClick={() => push('/')} className="bg-[#101828] text-white px-10 py-4 rounded-xl font-bold text-base shadow-xl hover:bg-black hover:scale-105 active:scale-95 transition-all">
                                    {t.success.home}
                                </button>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="w-full">
                            <div className="mb-10">
                                <h2 className="text-3xl md:text-4xl font-extrabold text-[#101828] mb-2 tracking-tight">{t.form.title}</h2>
                                <p className="text-gray-500 font-bold text-base">{t.form.subtitle}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label={t.form.name} type="text" required placeholder={t.form.placeName} />
                                    <InputField label={t.form.email} type="email" required placeholder={t.form.placeEmail} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label={t.form.phone} type="tel" required placeholder={t.form.placePhone} />
                                    <InputField label={t.form.linkedin} type="url" placeholder={t.form.placeLinkedin} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SelectField label={t.form.curriculum} required placeholder={t.form.placeCurriculum} options={CURRICULUMS} />
                                    <SelectField label={t.form.subject} required placeholder={t.form.placeSubject} options={currentSubjects} />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest ml-1">
                                        {t.form.motivation} <span className="text-red-500">*</span>
                                    </label>
                                    <textarea rows={4} required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]/20 focus:bg-white outline-none font-bold text-gray-800 transition-all resize-none text-base placeholder:text-gray-400 placeholder:font-medium" placeholder={t.form.placeMotivation}></textarea>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" disabled={isSubmitting} className="w-full bg-[#101828] text-white py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:bg-black hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                                        {isSubmitting && <Zap className="w-5 h-5 animate-pulse" />}
                                        <span>{isSubmitting ? t.form.submitting : t.form.submit}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InputField({ label, type, required, placeholder }: {
    label: string;
    type: string;
    required?: boolean;
    placeholder?: string;
}) {
    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest ml-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                required={required}
                placeholder={placeholder}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]/20 focus:bg-white outline-none font-bold text-gray-800 transition-all text-base placeholder:text-gray-400 placeholder:font-medium"
            />
        </div>
    );
}

function SelectField({ label, required, placeholder, options }: {
    label: string;
    required?: boolean;
    placeholder: string;
    options: string[];
}) {
    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest ml-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <select
                    required={required}
                    defaultValue=""
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]/20 focus:bg-white outline-none font-bold text-gray-800 transition-all text-base appearance-none cursor-pointer invalid:text-gray-400"
                >
                    <option value="" disabled hidden>{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt} className="text-gray-800">{opt}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
}
