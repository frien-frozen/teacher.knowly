'use client';
import React, { useEffect, useState } from 'react';
import { getCurriculums, createCurriculum, createSubject, createUnit, createTopicAdmin, updateCurriculum, updateSubject, updateUnit, updateTopicAdmin, deleteCurriculum, deleteSubject, deleteUnit, deleteTopicAdmin } from '@/app/actions/curriculum';
import { importSubjectSyllabus } from '@/app/actions/import';
import { Database, Plus, Folder, BookOpen, Layers, FileText, Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

export default function CurriculumEditor() {
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Unit,Topic\n1. Forces and Motion,1.1 Movement and position\n1. Forces and Motion,1.2 Velocity";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "knowly_subject_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadData = async () => {
    const res = await getCurriculums();
    if (res.success) setCurriculums(res.data);
  };

  useEffect(() => { 
    getCurriculums().then(res => {
      if (res.success) setCurriculums(res.data);
      setLoading(false);
    });
  }, []);

  const handleAddCurriculum = async () => {
    const name = prompt("New Curriculum Name (e.g., Cambridge IGCSE):"); 
    if (!name) return;
    await createCurriculum(name.trim()); 
    loadData();
  };
  const handleAddSubject = async (currId: string) => {
    const name = prompt("New Subject Name (e.g., Mathematics):"); 
    if (!name) return;
    await createSubject(currId, name.trim()); 
    setExpanded(prev => ({ ...prev, [currId]: true }));
    loadData();
  };
  const handleAddUnit = async (subId: string) => {
    const title = prompt("New Unit Title (e.g., Algebra):"); 
    if (!title) return;
    await createUnit(subId, title.trim()); 
    setExpanded(prev => ({ ...prev, [subId]: true }));
    loadData();
  };
  const handleAddTopic = async (unitId: string) => {
    const title = prompt("New Topic Title (e.g., Quadratic Equations):"); 
    if (!title) return;
    await createTopicAdmin(unitId, title.trim()); 
    setExpanded(prev => ({ ...prev, [unitId]: true }));
    loadData();
  };

  const handleEdit = async (type: 'curr'|'sub'|'unit'|'topic', id: string, oldName: string) => {
    const newName = prompt(`Rename "${oldName}" to:`, oldName);
    if (!newName || newName === oldName) return;
    if (type === 'curr') await updateCurriculum(id, newName.trim());
    if (type === 'sub') await updateSubject(id, newName.trim());
    if (type === 'unit') await updateUnit(id, newName.trim());
    if (type === 'topic') await updateTopicAdmin(id, newName.trim());
    loadData();
  };

  const handleDelete = async (type: 'curr'|'sub'|'unit'|'topic', id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    if (type === 'curr') await deleteCurriculum(id);
    if (type === 'sub') await deleteSubject(id);
    if (type === 'unit') await deleteUnit(id);
    if (type === 'topic') await deleteTopicAdmin(id);
    loadData();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full font-nunito">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#101828]">Curriculum Base (Live)</h1>
          <p className="text-gray-500 font-medium">Changes here instantly update learn.knowly.uz</p>
        </div>
        <button onClick={handleAddCurriculum} className="bg-[#101828] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors">
          <Plus className="w-5 h-5" /> Add Curriculum
        </button>
      </div>

      {loading ? (
        <div className="text-center p-10 font-bold text-gray-500">Loading live data...</div>
      ) : curriculums.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center flex flex-col items-center shadow-sm">
          <Database className="w-8 h-8 text-gray-400 mb-4" />
          <p className="text-gray-500 font-bold">Database is empty.</p>
          <p className="text-gray-400 text-sm mt-1">Click &apos;Add Curriculum&apos; to start building.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {curriculums.map((curr) => (
            <div key={curr.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 -ml-2 rounded-lg transition-colors flex-1"
                  onClick={() => toggle(curr.id)}
                >
                  {expanded[curr.id] ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                  <Folder className="text-emerald-500 w-6 h-6"/>
                  <h2 className="text-xl font-black text-[#101828] select-none">{curr.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit('curr', curr.id, curr.name)} className="text-gray-400 hover:text-emerald-600 transition-colors p-2">
                    <Edit2 className="w-4 h-4"/>
                  </button>
                  <button onClick={() => handleDelete('curr', curr.id)} className="text-gray-400 hover:text-red-600 transition-colors p-2">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                  <button onClick={() => handleAddSubject(curr.id)} className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors ml-2">
                    + Subject
                  </button>
                </div>
              </div>
              
              {expanded[curr.id] && (
                <div className="space-y-4 pl-4 border-l-2 border-gray-100 ml-3 pt-2 mt-2">
                  {curr.subjects?.length === 0 && (
                    <p className="text-sm font-medium text-gray-400 py-2">No subjects yet.</p>
                  )}
                  {curr.subjects?.map((sub: any) => (
                    <div key={sub.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 -ml-1.5 rounded-lg transition-colors flex-1"
                          onClick={() => toggle(sub.id)}
                        >
                          {expanded[sub.id] ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                          <BookOpen className="text-blue-500 w-5 h-5"/>
                          <h3 className="font-bold text-[#101828] select-none">{sub.name}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEdit('sub', sub.id, sub.name)} className="text-gray-400 hover:text-blue-600 transition-colors p-1.5">
                            <Edit2 className="w-3.5 h-3.5"/>
                          </button>
                          <button onClick={() => handleDelete('sub', sub.id)} className="text-gray-400 hover:text-red-600 transition-colors p-1.5">
                            <Trash2 className="w-3.5 h-3.5"/>
                          </button>
                          
                          <div className="flex items-center gap-2 ml-3 border-l border-gray-200 pl-3">
                            <button 
                              onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}
                              className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 hover:text-[#101828] transition-colors"
                            >
                              ↓ Template
                            </button>
                            
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded cursor-pointer transition-colors">
                              ↑ Upload CSV
                              <input 
                                type="file" 
                                accept=".csv" 
                                className="hidden" 
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const reader = new FileReader();
                                  reader.onload = async (event) => {
                                    const text = event.target?.result as string;
                                    const res = await importSubjectSyllabus(sub.id, text);
                                    alert(res.message);
                                    loadData();
                                  };
                                  reader.readAsText(file);
                                }} 
                              />
                            </label>
                          </div>

                          <button onClick={() => handleAddUnit(sub.id)} className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2.5 py-1 rounded-md transition-colors ml-2 border border-blue-200">
                            + Unit
                          </button>
                        </div>
                      </div>
                      
                      {expanded[sub.id] && (
                        <div className="space-y-2 pl-4 border-l-2 border-gray-200 ml-2 mt-3 pt-1">
                          {sub.units?.length === 0 && (
                            <p className="text-xs font-medium text-gray-400 py-1">No units yet.</p>
                          )}
                          {sub.units?.map((unit: any) => (
                            <div key={unit.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                              <div className="flex items-center justify-between">
                                <div 
                                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 -ml-1 rounded-lg transition-colors flex-1"
                                  onClick={() => toggle(unit.id)}
                                >
                                  {expanded[unit.id] ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                                  <Layers className="text-purple-500 w-4 h-4"/>
                                  <h4 className="font-bold text-sm text-[#101828] select-none">{unit.title}</h4>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button onClick={() => handleEdit('unit', unit.id, unit.title)} className="text-gray-400 hover:text-purple-600 transition-colors p-1">
                                    <Edit2 className="w-3 h-3"/>
                                  </button>
                                  <button onClick={() => handleDelete('unit', unit.id)} className="text-gray-400 hover:text-red-600 transition-colors p-1">
                                    <Trash2 className="w-3 h-3"/>
                                  </button>
                                  <button onClick={() => handleAddTopic(unit.id)} className="text-xs font-bold text-purple-600 hover:bg-purple-50 px-2.5 py-1 rounded-md transition-colors ml-1">
                                    + Topic
                                  </button>
                                </div>
                              </div>
                              
                              {expanded[unit.id] && unit.topics?.length > 0 && (
                                <div className="mt-2 space-y-1 pl-6">
                                  {unit.topics?.map((topic: any) => (
                                    <div key={topic.id} className="flex items-center justify-between text-sm text-gray-600 group p-1 -ml-1 rounded-md hover:bg-gray-50">
                                      <div className="flex items-center gap-2">
                                        <FileText className="w-3 h-3 text-gray-400"/> 
                                        <span>{topic.title}</span>
                                      </div>
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => handleEdit('topic', topic.id, topic.title)} className="text-gray-400 hover:text-gray-700 transition-colors p-1">
                                          <Edit2 className="w-3 h-3"/>
                                        </button>
                                        <button onClick={() => handleDelete('topic', topic.id)} className="text-gray-400 hover:text-red-600 transition-colors p-1">
                                          <Trash2 className="w-3 h-3"/>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
