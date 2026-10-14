import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useCollege } from '../../context/CollegeContext.jsx';

export const CourseRegistrationModal = ({ isOpen, onClose, student }) => {
  const { courses, showToast } = useCollege();
  const [selectedTerm, setSelectedTerm] = useState('Spring 2027');

  if (!isOpen || !student) return null;

  const availableCourses = [
    { id: 'reg-1', code: 'CS-310', title: 'Compiler Construction & Language Design', credits: 4, faculty: 'Prof. David Kim', capacity: 35, enrolled: 22, schedule: 'Tue/Thu 10:00 - 11:30 AM' },
    { id: 'reg-2', code: 'CS-340', title: 'Artificial Intelligence & Neural Networks', credits: 4, faculty: 'Prof. Emily Davis', capacity: 40, enrolled: 38, schedule: 'Mon/Wed 01:00 - 02:30 PM' },
    { id: 'reg-3', code: 'CS-365', title: 'Computer Networks & Internet Protocols', credits: 3, faculty: 'Dr. Gregory Thorne', capacity: 30, enrolled: 19, schedule: 'Fri 09:00 - 12:00 PM' },
    { id: 'reg-4', code: 'MATH-320', title: 'Numerical Analysis & Matrix Algorithms', credits: 3, faculty: 'Prof. Arthur Pendelton', capacity: 25, enrolled: 14, schedule: 'Tue/Thu 02:00 - 03:30 PM' },
  ];

  const handleRegister = (c) => {
    showToast(`Successfully registered for ${c.code}: ${c.title}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0c1427] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="font-bold text-white text-sm">Course Registration Gateway</h3>
              <p className="text-[11px] text-slate-400">Next Semester Academic Matriculation · {selectedTerm}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Credit Limit Alert */}
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Registration Status: <strong>Eligible</strong> (Good Academic Standing, GPA 3.88)</span>
            </div>
            <span className="font-mono text-teal-200">Max Limit: 18 Credits</span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Available Courses for Selection</h4>
            {availableCourses.map((c) => (
              <div 
                key={c.id}
                className="p-3.5 rounded-xl bg-[#080d1b] border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {c.code}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{c.credits} Credits</span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {c.capacity - c.enrolled} seats open
                    </span>
                  </div>
                  <div className="font-bold text-white text-sm">{c.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Instructor: {c.faculty} · {c.schedule}
                  </div>
                </div>

                <button
                  onClick={() => handleRegister(c)}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-[#080d1b]">
          <span className="text-xs text-slate-400 font-mono">Add/Drop Deadline: Nov 28, 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
