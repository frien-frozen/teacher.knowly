'use client';
import React, { useEffect, useState } from 'react';
import { getTeacherProfile, getTeacherSyllabus, addTeacherTopic, updateTopicVideo } from '@/app/actions/teacherDashboard';
import { Layers, FileText, Plus, BookOpen, Youtube, Link, CheckCircle } from 'lucide-react';

export default function CourseManager() {
  const [profile, setProfile] = useState<any>(null);
  const [syllabus, setSyllabus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [videoInput, setVideoInput] = useState('');

  const loadData = async () => {
    const [profileRes, syllabusRes] = await Promise.all([
      getTeacherProfile(),
      getTeacherSyllabus(),
    ]);

    if (profileRes.success) setProfile(profileRes.data);
    if (syllabusRes.success) setSyllabus(syllabusRes.data || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleAddTopic = async (unitId: string) => {
    const title = prompt("New Topic Title:");
    if (!title) return;
    await addTeacherTopic(unitId, title.trim());
    loadData();
  };

  const handleSaveVideo = async (topicId: string) => {
    const res = await updateTopicVideo(topicId, videoInput);
    if (res.success) {
      setEditingTopic(null);
      loadData();
    } else {
      alert(res.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto w-full font-nunito">
        <div className="text-center p-10 font-bold text-gray-500">Loading your syllabus...</div>
      </div>
    );
  }

  const subjectName = profile?.subject?.name || 'Your Subject';
  const curriculumName = profile?.subject?.curriculum?.name || '';

  return (
    <div className="p-8 max-w-5xl mx-auto w-full font-nunito">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#101828] tracking-tight">Course Manager</h1>
        <div className="flex items-center gap-2 mt-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <p className="text-gray-500 font-bold text-sm">
            Managing curriculum for: <span className="text-[#101828]">{curriculumName} — {subjectName}</span>
          </p>
        </div>
      </div>

      {syllabus.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center flex flex-col items-center shadow-sm">
          <Layers className="w-8 h-8 text-gray-400 mb-4" />
          <p className="text-gray-500 font-bold">No units found for your subject.</p>
          <p className="text-gray-400 text-sm mt-1">Ask your Admin to create units in the Curriculum Editor.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {syllabus.map((unit, idx) => (
            <div key={unit.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-5 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-extrabold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <h2 className="font-extrabold text-[#101828] text-sm md:text-base">{unit.title}</h2>
                </div>
                <button onClick={() => handleAddTopic(unit.id)} className="text-sm font-bold text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 border border-purple-100 sm:border-transparent">
                  <Plus className="w-4 h-4" /> Add Topic
                </button>
              </div>
              <div className="p-5">
                {unit.topics?.length === 0 ? (
                  <p className="text-sm font-medium text-gray-400">No topics yet. Add your first one above.</p>
                ) : (
                  <div className="space-y-2">
                    {unit.topics?.map((topic: any, tIdx: number) => (
                      <div key={topic.id} className="border border-gray-100 rounded-xl overflow-hidden transition-all">
                        {/* Topic Header */}
                        <div 
                          onClick={() => {
                            setEditingTopic(editingTopic === topic.id ? null : topic.id);
                            setVideoInput(topic.ytLink || '');
                          }}
                          className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="font-bold text-sm text-[#101828]">{tIdx + 1}. {topic.title}</span>
                          </div>
                          {topic.ytLink ? (
                            <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-md">
                              <Youtube className="w-3 h-3" /> Video Linked
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-gray-400">+ Add Video</span>
                          )}
                        </div>

                        {/* Expanded Video Editor */}
                        {editingTopic === topic.id && (
                          <div className="p-5 bg-white border-t border-gray-100">
                            <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider block mb-2">Lesson Video URL (YouTube)</label>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <div className="relative flex-1">
                                <Link className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input 
                                  type="url" 
                                  value={videoInput}
                                  onChange={(e) => setVideoInput(e.target.value)}
                                  placeholder="https://youtube.com/watch?v=..." 
                                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-[#101828] transition-all text-sm" 
                                />
                              </div>
                              <button 
                                onClick={() => handleSaveVideo(topic.id)}
                                className="bg-[#101828] text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
                              >
                                <CheckCircle className="w-4 h-4" /> Save Link
                              </button>
                            </div>
                            {videoInput.includes('youtube.com') && (
                              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                                  <Youtube className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-bold text-sm text-[#101828]">YouTube Video Detected</p>
                                  <p className="text-xs text-gray-500 font-medium">This video will be embedded in the student portal, authored by you.</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
