'use client';
import React, { useEffect, useState } from 'react';
import { getPendingApplications, resolveApplication } from '@/app/actions/application';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApps = async () => {
    setLoading(true);
    const res = await getPendingApplications();
    if (res.success) setApps(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleResolve = async (app: any, status: 'APPROVED' | 'REJECTED') => {
    setLoading(true);
    await resolveApplication(app.id, app.email, app.fullName, app.subject, status, window.location.origin);
    const res = await getPendingApplications();
    if (res.success) setApps(res.data);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full font-nunito">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#101828]">Admin Dashboard</h1>
        <p className="text-gray-500 font-medium">Manage pending teacher applications.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-extrabold text-[#101828]">Pending Applications</h2>
        </div>
        
        {loading ? (
          <div className="p-10 text-center text-gray-500 font-bold">Loading...</div>
        ) : apps.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center">
            <Clock className="w-8 h-8 text-gray-400 mb-4" />
            <p className="text-gray-500 font-bold">No pending applications.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {apps.map((app) => (
              <div key={app.id} className="p-6 hover:bg-gray-50/50 flex flex-col lg:flex-row gap-6 items-start justify-between transition-colors">
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-[#101828] text-lg">{app.fullName}</p>
                    <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">{app.subject}</span>
                  </div>
                  <div className="text-sm text-gray-500 font-medium flex flex-wrap gap-4">
                    <span><strong className="text-gray-400 mr-1">@</strong>{app.email}</span>
                    {app.phone && <span><strong className="text-gray-400 mr-1">#</strong>{app.phone}</span>}
                  </div>
                  {app.experience && (
                    <div className="bg-white p-4 rounded-xl border border-gray-100 mt-3 relative shadow-sm">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5 absolute -top-2.5 left-3 bg-white px-1.5">Experience & Qualifications</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{app.experience}</p>
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 gap-2 w-full lg:w-auto mt-2 lg:mt-0 pt-2 lg:pt-0 border-t justify-end lg:border-t-0 border-gray-100">
                  <button onClick={() => handleResolve(app, 'APPROVED')} className="flex-1 lg:flex-none bg-emerald-600 text-white hover:bg-emerald-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all text-center">Approve</button>
                  <button onClick={() => handleResolve(app, 'REJECTED')} className="flex-1 lg:flex-none bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all text-center">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
