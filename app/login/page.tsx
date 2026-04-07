'use client';

import React, { useState } from 'react';
import { useLangRouter } from '@/hooks/useLangRouter';
import { motion } from 'framer-motion';
import { initiateLogin, verifyOTP } from '@/app/actions/auth';

const CONTENT = {
    en: {
        heading: "Sign in to Knowly",
        email: "Email address",
        password: "Password",
        forgot: "Forgot password?",
        btn: "Sign in",
        loading: "Verifying...",
        new: "New to Knowly?",
        create: "Create an account.",
        error: "Account not found. Please check your credentials.",
        footer: ["Terms", "Privacy", "Security", "Contact Knowly"]
    },
    uz: {
        heading: "Knowly-ga kirish",
        email: "Elektron pochta",
        password: "Parol",
        forgot: "Parolni unutdingizmi?",
        btn: "Kirish",
        loading: "Tekshirilmoqda...",
        new: "Knowly-da yangimisiz?",
        create: "Hisob yarating.",
        error: "Hisob topilmadi. Iltimos, ma'lumotlaringizni tekshiring.",
        footer: ["Shartlar", "Maxfiylik", "Xavfsizlik", "Aloqa"]
    }
};

export default function LoginPage() {
    const { lang, push } = useLangRouter();
    const t = CONTENT[lang as 'en' | 'uz'] || CONTENT.uz;
    
    const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await initiateLogin(email, password);
            if (res.success) {
                setStep('OTP');
                setError('');
            } else {
                setError(res.message || 'An error occurred.');
            }
        } catch (err: any) {
            setError(err.message || "FATAL 500: Check your VS Code Terminal for the real error.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await verifyOTP(email, otp);
            if (res.success) {
                localStorage.setItem('knowly_role', res.user?.role || '');
                localStorage.setItem('knowly_email', email);
                if (res.user?.role === 'ADMIN') {
                    push('/admin');
                } else {
                    push('/dashboard');
                }
            } else {
                setError(res.message || 'An error occurred.');
            }
        } catch (err) {
            setError("An unexpected frontend error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#F9FAFB] flex flex-col items-center justify-center p-4 overflow-y-auto font-nunito">

            {/* Background blurs */}
            <div className="absolute top-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-red-100/40 rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-yellow-100/40 rounded-full blur-[100px] opacity-60"></div>
            </div>

            {/* Logo + Heading */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8 relative z-10"
            >
                <div onClick={() => push('/')} className="cursor-pointer hover:opacity-80 transition-opacity inline-block">
                    <img src="/logos/knowly-header.png" alt="Knowly" className="h-12 w-auto mx-auto mb-6" />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#101828] tracking-tight">
                    {t.heading}
                </h1>
            </motion.div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-sm bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/60 border border-gray-100 relative z-10"
            >
                <form onSubmit={step === 'EMAIL' ? handleSendOTP : handleVerify} className="space-y-5">

                    {/* Email */}
                    <div className="space-y-1.5" style={{ display: step === 'EMAIL' ? 'block' : 'none' }}>
                        <label className="text-xs font-bold text-gray-700 ml-1">{t.email}</label>
                        <input
                            type="email"
                            required={step === 'EMAIL'}
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError(''); }}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-4 focus:ring-[#D92D20]/10 focus:border-[#D92D20] outline-none font-bold text-[#101828] text-sm transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5" style={{ display: step === 'EMAIL' ? 'block' : 'none' }}>
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-gray-700">{t.password}</label>
                            <a href="/forgot-password" className="text-xs font-bold text-[#D92D20] hover:underline">{t.forgot}</a>
                        </div>
                        <input
                            type="password"
                            required={step === 'EMAIL'}
                            value={password}
                            onChange={e => { setPassword(e.target.value); setError(''); }}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-4 focus:ring-[#D92D20]/10 focus:border-[#D92D20] outline-none font-bold text-[#101828] text-sm transition-all"
                        />
                    </div>

                    {/* OTP */}
                    {step === 'OTP' && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 ml-1">Security Code (OTP)</label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                value={otp}
                                onChange={(e) => { setOtp(e.target.value); setError(''); }}
                                placeholder="000000"
                                className="w-full py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]/20 outline-none font-bold text-[#101828] text-2xl tracking-[0.75em] text-center transition-all"
                            />
                            <p className="text-gray-500 text-sm mt-2 font-medium text-center">
                                We sent a secure code to <span className="font-bold text-[#101828]">{email}</span>
                            </p>
                        </div>
                    )}

                    {/* Error banner */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[#D92D20] text-sm font-bold"
                        >
                            <span className="text-base">⚠️</span>
                            {error}
                        </motion.div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#101828] text-white py-3 rounded-xl font-extrabold text-sm shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
                    >
                        {isLoading ? t.loading : (step === 'EMAIL' ? t.btn : 'Verify Code')}
                    </button>

                    {/* Resend / Change Email (only on OTP step) */}
                    {step === 'OTP' && (
                        <div className="flex items-center justify-between mt-4">
                            <button type="button" onClick={handleSendOTP} className="text-sm font-bold text-gray-500 hover:text-[#101828] transition-colors">
                                Resend Code
                            </button>
                            <button type="button" onClick={() => setStep('EMAIL')} className="text-sm font-bold text-gray-500 hover:text-[#101828] transition-colors">
                                Change Email
                            </button>
                        </div>
                    )}

                </form>

                {/* Create Account */}
                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        {t.new}{" "}
                        <button onClick={() => push('/apply')} className="text-[#D92D20] font-bold hover:underline">
                            {t.create}
                        </button>
                    </p>
                </div>
            </motion.div>

            {/* Footer links */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-12 text-center relative z-10"
            >
                <ul className="flex flex-wrap justify-center gap-6">
                    {t.footer.map((item, i) => (
                        <li key={i}>
                            <a href="#" className="text-xs font-bold text-gray-400 hover:text-[#D92D20] hover:underline transition-colors">
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 flex items-center justify-center gap-2 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <img src="/logos/knowly-header.png" alt="Logo" className="h-4 w-auto" />
                    <span className="text-[10px] font-bold text-gray-400">© 2026 Knowly Inc.</span>
                </div>
            </motion.div>

        </div>
    );
}
