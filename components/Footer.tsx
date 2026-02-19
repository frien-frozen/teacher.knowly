'use client';

import React from 'react';
import { useLangRouter } from '@/hooks/useLangRouter';
import { Mail, Phone, MapPin, Instagram, Send, Youtube, Facebook } from 'lucide-react';

const FOOTER_TEXT = {
    en: {
        tagline: "Empowering Uzbekistan's youth with world-class education.",
        platform: "Platform",
        directions: "Directions",
        teachers: "Teachers",
        mission: "Mission",
        stories: "Stories",
        contact: "Contact",
        call: "CALL",
        email: "EMAIL",
        location: "LOCATION",
        address: "Ferghana, Uzbekistan",
        rights: "© 2026 Knowly Inc.",
        privacy: "Privacy",
        terms: "Terms"
    },
    uz: {
        tagline: "O'zbekiston yoshlarini jahon darajasidagi ta'lim bilan ta'minlaymiz.",
        platform: "Platforma",
        directions: "Yo'nalishlar",
        teachers: "Ustozlar",
        mission: "Missiya",
        stories: "Hikoyalar",
        contact: "Aloqa",
        call: "QO'NG'IROQ",
        email: "EMAIL",
        location: "MANZIL",
        address: "Farg'ona, O'zbekiston",
        rights: "© 2026 Knowly Inc.",
        privacy: "Maxfiylik",
        terms: "Shartlar"
    }
};

export default function Footer() {
    const { lang, push } = useLangRouter();
    const t = FOOTER_TEXT[lang as 'en' | 'uz'] || FOOTER_TEXT.uz;

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer id="footer" className="bg-[#0B0F19] text-white pt-20 pb-10">
            <div className="w-full max-w-7xl mx-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                    {/* Brand & Socials */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => push('/')}>
                            <img src="/logos/knowly-header.png" alt="KNOWLY" className="h-8 w-auto" />
                        </div>
                        <p className="text-gray-400 leading-relaxed font-medium text-sm">{t.tagline}</p>
                        <div className="flex gap-4 pt-2">
                            {[Instagram, Send, Youtube, Facebook].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-[#1A2235] flex items-center justify-center hover:bg-[#D92D20] transition-colors text-white">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div className="lg:pl-8">
                        <h4 className="font-bold text-lg mb-6 text-white">{t.platform}</h4>
                        <ul className="space-y-4 text-gray-400 font-medium text-sm">
                            <li><button onClick={() => scrollTo('curriculums')} className="hover:text-white transition-colors">{t.directions}</button></li>
                            <li><button onClick={() => scrollTo('teachers')} className="hover:text-white transition-colors">{t.teachers}</button></li>
                            <li><button onClick={() => scrollTo('mission')} className="hover:text-white transition-colors">{t.mission}</button></li>
                            <li><button className="hover:text-white transition-colors">{t.stories}</button></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="font-bold text-lg mb-6 text-white">{t.contact}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a href="tel:+998944101777" className="flex items-center gap-4 p-4 rounded-2xl bg-[#131B2B] border border-gray-800 hover:border-gray-600 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-[#FDB022]/10 flex items-center justify-center text-[#FDB022] group-hover:scale-110 transition-transform">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{t.call}</p>
                                    <p className="font-bold text-white tracking-wide">+998 94 410 17 77</p>
                                </div>
                            </a>

                            <a href="mailto:contact@knowly.uz" className="flex items-center gap-4 p-4 rounded-2xl bg-[#131B2B] border border-gray-800 hover:border-gray-600 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-[#D92D20]/10 flex items-center justify-center text-[#D92D20] group-hover:scale-110 transition-transform">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{t.email}</p>
                                    <p className="font-bold text-white tracking-wide">contact@knowly.uz</p>
                                </div>
                            </a>

                            <div className="sm:col-span-2 flex items-center gap-4 p-4 rounded-2xl bg-[#131B2B] border border-gray-800">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{t.location}</p>
                                    <p className="font-bold text-white tracking-wide">{t.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-medium">
                    <p>{t.rights}</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">{t.privacy}</a>
                        <a href="#" className="hover:text-white transition-colors">{t.terms}</a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
