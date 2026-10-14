import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  FolderOpen, 
  Download, 
  Search, 
  FileText, 
  BookOpen, 
  Calendar, 
  User, 
  Check, 
  ExternalLink,
  Plus,
  Trash2,
  X,
  Upload,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const StudyMaterialsView = () => {
  const { studyMaterials, courses, addStudyMaterial, deleteStudyMaterial, role, currentStaffUser, showToast } = useCollege();
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [search, setSearch] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form states for faculty upload
  const [newTitle, setNewTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState(courses[0]?.code || 'CS-301');
  const [newCategory, setNewCategory] = useState('Lecture Slides');
  const [newFileType, setNewFileType] = useState('PDF');
  const [newFileSize, setNewFileSize] = useState('4.8 MB');

  const isAdminOrFaculty = role === 'admin' || role === 'professor' || role === 'faculty';

  const filtered = (studyMaterials || []).filter((m) => {
    const matchesCourse = selectedCourse === 'all' || m.courseCode === selectedCourse;
    const matchesQuery = 
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      (m.courseName && m.courseName.toLowerCase().includes(search.toLowerCase())) ||
      (m.category && m.category.toLowerCase().includes(search.toLowerCase()));
    return matchesCourse && matchesQuery;
  });

  const handleDownload = (material) => {
    showToast(`Downloading "${material.title}" (${material.size})...`, 'success');
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}"?`)) {
      deleteStudyMaterial(id);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Document title is required.', 'error');
      return;
    }
    const matchedCourse = courses.find(c => c.code === newCourseCode);

    addStudyMaterial({
      courseCode: newCourseCode,
      courseName: matchedCourse ? matchedCourse.title : 'Curriculum Subject',
      title: newTitle.trim(),
      category: newCategory,
      type: newFileType,
      size: newFileSize,
      instructor: currentStaffUser?.name || 'Prof. Faculty Member',
      uploadedDate: new Date().toISOString().split('T')[0]
    });

    setNewTitle('');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-slate-100 font-sans antialiased">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span className="font-semibold text-indigo-400">Unity College</span>
            <span>·</span>
            <span>Curriculum Resource Repository</span>
            <span>·</span>
            <span className="text-teal-400 font-mono">Fall 2026 Term</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <span>Study Materials &amp; Lecture Notes</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Verified course slides, past examination question sets, lab handouts, and dataset bundles.
          </p>
        </div>

        {isAdminOrFaculty && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-950/40 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Material</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0c1427] rounded-2xl border border-slate-800/90 p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="material-course" className="text-xs font-bold text-slate-300 whitespace-nowrap flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Course:</span>
          </label>
          <select
            id="material-course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-[#080d1b] border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.code}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#080d1b] border border-slate-800 text-xs text-white placeholder:text-slate-500 rounded-xl pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Materials Table / Card List */}
      <div className="bg-[#0c1427] rounded-2xl border border-slate-800/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#091122] border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">File Type &amp; Size</th>
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4">Uploaded</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                    No study materials found for this search.
                  </td>
                </tr>
              ) : (
                filtered.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400 whitespace-nowrap">
                      {mat.courseCode}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white max-w-xs">
                      {mat.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 font-medium whitespace-nowrap">
                        {mat.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {mat.type} · {mat.size}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {mat.instructor}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {mat.uploadedDate}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownload(mat)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/70 hover:bg-indigo-900/70 border border-indigo-700/60 hover:border-indigo-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>

                        {isAdminOrFaculty && (
                          <button
                            onClick={() => handleDelete(mat.id, mat.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Remove Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          FACULTY UPLOAD STUDY MATERIAL MODAL
      ========================================================================= */}
      {isUploadModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0c1427] text-slate-100 rounded-3xl shadow-2xl border border-slate-700 p-6 sm:p-7 space-y-5 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">Release Course Material</h2>
                  <p className="text-xs text-slate-400">Distribute lecture slides, manuals or datasets</p>
                </div>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Document Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lecture 08: Distributed Paxos & Raft Slides"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-700 rounded-xl bg-[#070b14] text-white focus:outline-none focus:border-indigo-500 shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Course</label>
                  <select
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-700 rounded-xl bg-[#070b14] text-white focus:outline-none focus:border-indigo-500 cursor-pointer shadow-inner"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.code} className="bg-[#070b14] text-white">
                        {c.code} · {c.title.substring(0, 22)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-700 rounded-xl bg-[#070b14] text-white focus:outline-none focus:border-indigo-500 cursor-pointer shadow-inner"
                  >
                    <option value="Lecture Slides">Lecture Slides</option>
                    <option value="Lab Manual">Lab Manual</option>
                    <option value="Past Exam Papers">Past Exam Papers</option>
                    <option value="Reference Textbook">Reference Textbook</option>
                    <option value="Datasets">Datasets &amp; Code</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">File Format</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-700 rounded-xl bg-[#070b14] text-white focus:outline-none focus:border-indigo-500 cursor-pointer shadow-inner"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="ZIP">ZIP Archive</option>
                    <option value="PPTX">PowerPoint (PPTX)</option>
                    <option value="JUPYTER">Jupyter Notebook (.ipynb)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">File Size</label>
                  <input
                    type="text"
                    value={newFileSize}
                    onChange={(e) => setNewFileSize(e.target.value)}
                    placeholder="e.g. 5.4 MB"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-700 rounded-xl bg-[#070b14] text-white focus:outline-none focus:border-indigo-500 shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-950/40 cursor-pointer"
                >
                  Release to Students
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
