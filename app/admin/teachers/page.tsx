'use client';

import React, { useEffect, useState } from 'react';
import { getAllTeachers } from '@/app/actions/admin';
import { BookOpen, MoreVertical, ShieldAlert } from 'lucide-react';

export default function ManageTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeachers() {
      const res = await getAllTeachers();
      if (res.success) setTeachers(res.data);
      setLoading(false);
    }
    loadTeachers();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto w-full font-nunito">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#101828] tracking-tight">Manage Teachers</h1>
        <p className="text-gray-500 font-medium mt-1">View active educators and manage their subject assignments.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="font-extrabold text-[#101828]">Active Team</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500 font-bold">Loading teachers...</div>
        ) : teachers.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-bold">No teachers found.</p>
            <p className="text-gray-400 text-sm mt-1">Approve applications to add teachers to the platform.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100">
                  <th className="p-5">Educator</th>
                  <th className="p-5">Assigned Subject</th>
                  <th className="p-5">Joined Date</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5">
                      <p className="font-bold text-[#101828] text-sm">{teacher.name}</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{teacher.email}</p>
                    </td>
                    <td className="p-5">
                      {teacher.subject ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-100">
                          <BookOpen className="w-3.5 h-3.5" /> {teacher.subject.name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold border border-gray-200">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-sm text-gray-500 font-medium">
                      {new Date(teacher.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-5 text-right">
                      <button className="p-2 text-gray-400 hover:text-[#101828] transition-colors rounded-lg hover:bg-gray-100">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
