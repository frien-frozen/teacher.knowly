'use client';
import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLangRouter } from '@/hooks/useLangRouter';
import { activateTeacherAccount } from '@/app/actions/activate';
import { ShieldCheck, Lock } from 'lucide-react';

function ActivateForm() {
  const searchParams = useSearchParams();
  const { push } = useLangRouter();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  if (!email || !token) {
    return <div className="text-center text-red-600 font-bold p-4">Invalid or missing activation link.</div>;
  }

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return setMessage("Passwords do not match.");
    if (password.length < 6) return setMessage("Password must be at least 6 characters.");
    
    setLoading(true);
    setMessage('');

    const res = await activateTeacherAccount(email, token, password);
    if (res.success) setSuccess(true);
    else setMessage(res.message);
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#101828]">Account Activated!</h2>
        <p className="text-gray-500 font-medium">Your password has been set securely.</p>
        <button onClick={() => push('/login')} className="mt-6 w-full bg-[#101828] text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-[#101828]">Activate Account</h1>
        <p className="text-gray-500 text-sm mt-2 font-medium">Create a secure password for <strong className="text-[#101828]">{email}</strong></p>
      </div>
      {message && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center border border-red-100">{message}</div>}
      <form onSubmit={handleActivate} className="space-y-5">
        <div className="relative">
          <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-[#101828] transition-all" />
        </div>
        <div className="relative">
          <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm Password" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-[#101828] transition-all" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-[#101828] text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-70 shadow-lg">
          {loading ? 'Activating...' : 'Set Password & Activate'}
        </button>
      </form>
    </>
  );
}

export default function ActivatePage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4 font-nunito">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <Suspense fallback={<div className="text-center font-bold text-gray-500">Loading secure connection...</div>}>
          <ActivateForm />
        </Suspense>
      </div>
    </div>
  );
}
