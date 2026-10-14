import React, { useState, useEffect } from 'react';
import { Search, X, User, BookOpen, Users, ArrowRight } from 'lucide-react';
import { useCollege } from '../../context/CollegeContext.jsx';

export const GlobalSearchModal = ({ isOpen, onClose, onSelectStudent, onSelectCourse }) => {
  const { students, courses, staff, setActiveTab } = useCollege();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredStudents = q ? students.filter(s => 
    s.firstName.toLowerCase().includes(q) ||
    s.lastName.toLowerCase().includes(q) ||
    s.studentId.toLowerCase().includes(q) ||
    s.email.toLowerCase().includes(q)
  ).slice(0, 4) : students.slice(0, 3);

  const filteredCourses = q ? courses.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.code.toLowerCase().includes(q) ||
    c.department.toLowerCase().includes(q)
  ).slice(0, 4) : courses.slice(0, 3);

  const filteredStaff = q ? staff.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.email.toLowerCase().includes(q) ||
    s.department?.toLowerCase().includes(q)
  ).slice(0, 3) : staff.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl relative text-slate-100">
        
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, faculty, courses, departments..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Students Group */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Students</span>
            </div>
            <div className="space-y-1">
              {filteredStudents.map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    if (onSelectStudent) onSelectStudent(st);
                    onClose();
                  }}
                  className="w-full p-2 rounded-xl hover:bg-slate-850 flex items-center justify-between text-left group transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {st.firstName[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-bold group-hover:text-blue-300 truncate">
                        {st.firstName} {st.lastName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {st.studentId} · {st.department}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Courses Group */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Courses</span>
            </div>
            <div className="space-y-1">
              {filteredCourses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    if (onSelectCourse) onSelectCourse(c);
                    setActiveTab('courses');
                    onClose();
                  }}
                  className="w-full p-2 rounded-xl hover:bg-slate-850 flex items-center justify-between text-left group transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-bold group-hover:text-emerald-300 truncate">
                        {c.code} – {c.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {c.department} · {c.credits} Credits
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Faculty Group */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Faculty &amp; Staff</span>
            </div>
            <div className="space-y-1">
              {filteredStaff.map((f) => (
                <div
                  key={f.id}
                  className="w-full p-2 rounded-xl hover:bg-slate-850 flex items-center justify-between text-left group transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {f.name[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-bold group-hover:text-purple-300 truncate">
                        {f.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {f.title || f.role} · {f.department || 'Academic Deanery'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/60">
                    {f.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>Search navigation active</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
