import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Calendar, 
  Award, 
  Users, 
  FileCheck, 
  Edit, 
  X,
  BookOpen
} from 'lucide-react';

export const AssignmentsView = () => {
  const { assignments, courses, createAssignment, updateAssignment, showToast } = useCollege();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAsg, setEditingAsg] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || 'c-1');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-11-15');
  const [maxPoints, setMaxPoints] = useState(100);

  const filteredAssignments = (assignments || []).filter(a => {
    const matchesSearch = 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;
    if (selectedCourse !== 'All' && a.courseId !== selectedCourse) return false;
    return true;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Assignment title is required.', 'error');
      return;
    }
    createAssignment({
      title: title.trim(),
      courseId,
      description: description.trim(),
      deadline,
      maxPoints: Number(maxPoints) || 100
    });
    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingAsg) return;
    updateAssignment(editingAsg.id, {
      title: editingAsg.title,
      description: editingAsg.description,
      deadline: editingAsg.deadline,
      maxPoints: editingAsg.maxPoints,
      status: editingAsg.status
    });
    setEditingAsg(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 antialiased font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-400" />
            <span>Course Assignments & Submission Pipelines</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional project evaluations, coursework specifications, submission queues, and grading releases
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-[#0c1427] p-3.5 rounded-xl border border-slate-800/90 shadow-md flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assignments by title or project details..."
            className="w-full pl-9 pr-8 py-2 text-xs border border-slate-700/80 rounded-lg bg-[#070b14] text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-700/80 rounded-lg bg-[#070b14] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 shadow-inner cursor-pointer"
        >
          <option value="All" className="bg-[#070b14]">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#070b14]">{c.code} — {c.title}</option>
          ))}
        </select>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssignments.map((asg) => {
          const course = courses.find(c => c.id === asg.courseId);

          return (
            <div
              key={asg.id}
              className="bg-[#0c1427] p-5 rounded-xl border border-slate-800/90 hover:border-indigo-500/50 shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded">
                    {course?.code || 'CS-CORE'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {asg.status || 'Published'}
                    </span>
                    <button
                      onClick={() => setEditingAsg(asg)}
                      className="p-1 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-slate-100 text-sm leading-snug group-hover:text-indigo-300 transition-colors">
                  {asg.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {asg.description || 'Comprehensive term project submission requirement.'}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Due Date:</span>
                  </span>
                  <span className="font-mono font-medium text-slate-200">{asg.deadline}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Max Score:</span>
                  </span>
                  <span className="font-mono font-bold text-amber-400">{asg.maxPoints} Pts</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Submissions:</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{asg.submissionsCount || 14} received</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs modal-backdrop-animate">
          <div className="relative w-full max-w-md bg-[#0c1427] text-slate-100 rounded-xl shadow-2xl border border-slate-800 overflow-hidden modal-content-animate">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#080d1b]">
              <h2 className="text-sm font-bold text-slate-100">Create Course Assignment</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Course</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#070b14]">{c.code} — {c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Database Architecture Benchmark"
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline project requirements and evaluation criteria..."
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Maximum Points</label>
                  <input
                    type="number"
                    value={maxPoints}
                    onChange={(e) => setMaxPoints(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer shadow-md"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
