'use client';
import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { getCurriculums } from '@/app/actions/curriculum';
import { sendTeacherInvite } from '@/app/actions/invite';

export default function InviteEducator() {
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [selectedCurrId, setSelectedCurrId] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchDB() {
      const res = await getCurriculums();
      if (res.success) setCurriculums(res.data);
      setLoading(false);
    }
    fetchDB();
  }, []);

  const activeCurriculum = curriculums.find(c => c.id === selectedCurrId);
  const availableSubjects: any[] = activeCurriculum ? activeCurriculum.subjects : [];

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setMessage('');
    
    const subject = availableSubjects.find((s: any) => s.id === selectedSubId);
    if (!subject || !activeCurriculum) {
      setMessage('Please select both curriculum and subject.');
      setSending(false);
      return;
    }

    const res = await sendTeacherInvite(
      name, email, activeCurriculum.name, subject.name, subject.id, window.location.origin
    );
    
    setMessage(res.message || '');
    if (res.success) {
      setName(''); setEmail(''); setSelectedCurrId(''); setSelectedSubId('');
    }
    setSending(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full font-nunito">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#101828]">Invite Educator</h1>
        <p className="text-gray-500 font-medium">Directly invite a teacher and assign them to a subject.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        {message && (
          <div className={`mb-6 p-4 rounded-xl font-bold text-sm ${message.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {message}
          </div>
        )}
      
        {loading ? <div className="text-gray-500 font-bold">Loading...</div> : (
          <form onSubmit={handleInvite} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Full Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Aziz Rahimov" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-[#101828] transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="aziz@knowly.uz" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-[#101828] transition-all" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">1. Select Curriculum</label>
                <select required value={selectedCurrId} onChange={(e) => { setSelectedCurrId(e.target.value); setSelectedSubId(''); }} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-[#101828] transition-all cursor-pointer">
                  <option value="">Choose...</option>
                  {curriculums.map(c => <option key={`curr-${c.id}`} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">2. Assign Subject</label>
                <select required disabled={!selectedCurrId} value={selectedSubId} onChange={(e) => setSelectedSubId(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-[#101828] transition-all cursor-pointer disabled:opacity-50">
                  <option value="">Choose...</option>
                  {availableSubjects.map((s: any) => <option key={`sub-${s.id}`} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={sending} className="w-full bg-[#101828] text-white py-4 rounded-xl font-extrabold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg mt-4 disabled:opacity-70">
              <Send className="w-5 h-5" /> {sending ? 'Sending...' : 'Send Invitation Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
