'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Lock, Save, AlertCircle } from 'lucide-react';
import { getTeacherProfile } from '@/app/actions/teacherDashboard';

export default function TeacherProfile() {
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState<any>(null);

  const [displayName, setDisplayName] = useState('');
  const [displayEmail, setDisplayEmail] = useState('');
  const [bio, setBio] = useState('');

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = objectUrl;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const MAX_SIZE = 800;
      let width = img.width;
      let height = img.height;

      if (width > height && width > MAX_SIZE) {
        height *= MAX_SIZE / width;
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width *= MAX_SIZE / height;
        height = MAX_SIZE;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/webp', 0.8);
      });

      if (!blob) throw new Error("Could not compress image");

      const formData = new FormData();
      formData.append('file', blob, 'profile.webp');

      const { uploadProfileImage } = await import('@/app/actions/profile');
      const res = await uploadProfileImage(formData);

      if (res.success && res.url) {
        setTeacherData((prev: any) => ({ ...prev, profilePic: res.url }));
      } else {
        alert(res.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    async function loadProfile() {
      // TODO: Replace with actual session email from auth context/cookies
      const email = localStorage.getItem('knowly_email') || 'ismatullohbakh2010@gmail.com';
      const res = await getTeacherProfile(email);
      if (res.success && res.data) {
        setTeacherData(res.data);
        setDisplayName(res.data.name || '');
        setDisplayEmail(res.data.email || '');
        setBio(res.data.bio || '');
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto w-full">
        <div className="text-center p-10 font-bold text-gray-500">Loading profile...</div>
      </div>
    );
  }

  const curriculumName = teacherData?.subject?.curriculum?.name || 'Unassigned';
  const subjectName = teacherData?.subject?.name || 'Unassigned';
  const initials = displayName ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <div className="p-8 max-w-4xl mx-auto w-full">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#101828] tracking-tight">My Profile</h1>
        <p className="text-gray-500 font-medium mt-1">Manage your public teacher profile and personal details.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <form onSubmit={handleSave} className="p-8 md:p-10 space-y-10">
          
          {/* PROFILE PHOTO SECTION */}
          <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-gray-100">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                {teacherData?.profilePic ? (
                  <img src={teacherData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-extrabold text-gray-400">{initials}</span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#101828]">Profile Picture</h3>
              <p className="text-sm text-gray-500 font-medium mb-4">PNG, JPG up to 5MB. This will be shown to students.</p>
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="px-5 py-2 bg-gray-100 text-[#101828] font-bold text-sm rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">
                {isUploading ? "Uploading..." : "Upload New Photo"}
              </button>
            </div>
          </div>

          {/* EDITABLE FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Full Name</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]/20 outline-none font-bold text-[#101828] transition-all text-sm" />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">Email Address <Lock className="w-3 h-3 text-gray-400" /></label>
              <input type="email" value={displayEmail} readOnly disabled className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed outline-none font-bold transition-all text-sm" />
            </div>
          </div>

          {/* LOCKED ADMIN FIELDS */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FDB022]"></div>
            <div className="flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-[#FDB022] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-extrabold text-[#101828]">Academic Assignment</h4>
                <p className="text-xs text-gray-500 font-medium mt-1">Your assigned curriculum and subject are managed by Knowly Administration. Contact support if you need to request a change.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Curriculum</label>
                <div className="w-full px-5 py-3.5 bg-gray-200/50 border border-gray-200 rounded-xl font-bold text-gray-500 text-sm flex justify-between items-center cursor-not-allowed">
                  {curriculumName}
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Assigned Subject</label>
                <div className="w-full px-5 py-3.5 bg-gray-200/50 border border-gray-200 rounded-xl font-bold text-gray-500 text-sm flex justify-between items-center cursor-not-allowed">
                  {subjectName}
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* BIO */}
          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Teacher Bio / About Me</label>
            <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell your students about yourself..." className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#D92D20] focus:ring-2 focus:ring-[#D92D20]/20 outline-none font-bold text-[#101828] transition-all text-sm resize-none"></textarea>
          </div>

          {/* SUBMIT */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" disabled={isSaving} className="bg-[#101828] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:bg-black transition-all disabled:opacity-70 flex items-center gap-2">
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
