import React from 'react';
import { X, User, BookOpen, Award, CalendarCheck2, Mail, Phone, MapPin, Building, ShieldCheck } from 'lucide-react';

export const StudentDetailModal = ({ student, isOpen, onClose }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0f172a] border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-800">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${student.avatarBg || 'from-blue-600 to-indigo-700'} text-white font-black text-xl flex items-center justify-center shadow-lg ring-2 ring-white/10 shrink-0`}>
            {student.firstName[0]}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {student.firstName} {student.lastName}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                {student.status || 'Active'}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              {student.studentId} · {student.cohort || 'Class of 2027'}
            </div>
            <div className="text-xs text-indigo-400 font-medium">
              {student.program}
            </div>
          </div>
        </div>

        {/* Academic Performance Badges */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-sm font-black text-white font-mono">{student.gpa?.toFixed(2) || '3.88'}</div>
              <div className="text-[10px] text-slate-400">Cumulative GPA</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <CalendarCheck2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-sm font-black text-white font-mono">{student.attendanceRate || 95}%</div>
              <div className="text-[10px] text-slate-400">Attendance Rate</div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>Department:</span>
            </span>
            <span className="font-semibold text-white">{student.department}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>University Email:</span>
            </span>
            <span className="font-mono text-white">{student.email}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Academic Advisor:</span>
            </span>
            <span className="font-semibold text-white">{student.advisor || 'Prof. Dr. Evelyn Vance'}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Enrolled Courses:</span>
            </span>
            <span className="font-semibold text-white font-mono">
              {student.enrolledCourseIds?.length || 3} Courses Active
            </span>
          </div>
        </div>

        <div className="pt-5 mt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Roster Card
          </button>
        </div>
      </div>
    </div>
  );
};
