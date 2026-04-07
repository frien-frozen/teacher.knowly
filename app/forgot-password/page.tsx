'use client';
import React, { useState } from 'react';
import { requestPasswordReset } from '@/app/actions/password';
import { useLangRouter } from '@/hooks/useLangRouter';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { push } = useLangRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await requestPasswordReset(email, window.location.origin);
    setMessage(res.message || '');
    setIsError(!res.success);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4 font-nunito">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
        <h1 className="text-2xl font-extrabold text-[#101828] mb-2">Reset Password</h1>
        <p className="text-gray-500 text-sm mb-6 font-medium">Enter your email and we&apos;ll send you a secure reset link.</p>
        
        {message ? (
          <div className={`p-4 font-bold rounded-xl mb-6 ${isError ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@knowly.uz" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-[#101828] transition-all" />
            <button type="submit" disabled={loading} className="w-full bg-[#101828] text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-70 shadow-lg">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
        <button onClick={() => push('/login')} className="mt-6 text-sm font-bold text-gray-500 hover:text-[#101828] transition-colors">Back to Login</button>
      </div>
    </div>
  );
}
