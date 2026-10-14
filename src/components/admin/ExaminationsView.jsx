import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Trash2, 
  Award, 
  X,
  AlertCircle,
  Printer,
  ShieldCheck,
  Download,
  CheckCircle2,
  Building2,
  UserCheck
} from 'lucide-react';
import { ScheduleExamModal } from './ScheduleExamModal.jsx';

export const ExaminationsView = () => {
  const { examinations, cancelExamination, showToast, role, currentStudent } = useCollege();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isAdminOrFaculty = role === 'admin' || role === 'faculty' || role === 'professor';

  const filteredExams = (examinations || []).filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.department && e.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id, title) => {
    if (!isAdminOrFaculty) return;
    if (window.confirm(`Are you sure you want to cancel examination "${title}"?`)) {
      cancelExamination(id);
    }
  };

  const handlePrintSchedule = () => {
    window.print();
  };

  const handleDownloadHallTicket = () => {
    showToast('Generating official encrypted Hall Ticket / Admit Card PDF (Fall 2026)...', 'success');
  };

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 antialiased font-sans text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Office of the Collegiate Controller of Examinations
            </span>
            <span>·</span>
            <span className="text-teal-400 font-mono">Term: Fall 2026 Mid-Semester</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-indigo-400" />
            <span>Examinations Scheduling &amp; Hall Allocations</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Centralized institutional examination schedules, arena room assignments, proctoring roster, and student seat allocations.
          </p>
        </div>

        {/* Action Buttons: Conditional on Role */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrintSchedule}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-[#0c1427] border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Routine</span>
          </button>

          {!isAdminOrFaculty && (
            <button
              onClick={handleDownloadHallTicket}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 rounded-xl transition-all shadow-md shadow-teal-950/40 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Hall Ticket</span>
            </button>
          )}

          {isAdminOrFaculty && (
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Examination</span>
            </button>
          )}
        </div>
      </div>

      {/* Student Examination Pass Banner (Student Only) */}
      {!isAdminOrFaculty && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-[#0c1427] to-teal-950/20 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Student Examination Status: Eligible &amp; Verified</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  Admit Slip Issued
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Student ID: STU-2026-808 · Exam Roll: UC-2026-EX-042 · Desk Location: Assigned upon entry
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[11px] font-mono text-slate-400 block">Total Papers Scheduled</span>
            <span className="text-lg font-bold text-teal-300 font-mono">{filteredExams.length} Subjects</span>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-[#0c1427] p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search examinations by title, course code (e.g. CS101, CS201), hall room, or department..."
            className="w-full pl-10 pr-9 py-2 text-xs border border-slate-800 rounded-xl bg-[#070b14] text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-slate-500 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Examination Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredExams.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-[#0c1427] border border-slate-800 text-slate-400 space-y-2">
            <FileText className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-white">No examinations found</p>
            <p className="text-xs text-slate-500">Try adjusting your search query.</p>
          </div>
        ) : (
          filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-[#0c1427] p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-slate-700 shadow-xl transition-all flex flex-col justify-between group space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
                    {exam.courseCode}
                  </span>

                  {/* Delete / Cancel button ONLY visible to Faculty/Admin */}
                  {isAdminOrFaculty ? (
                    <button
                      onClick={() => handleDelete(exam.id, exam.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Cancel Examination (Faculty Administrative Access)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                      Seat Confirmed
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-base leading-snug group-hover:text-indigo-300 transition-colors">
                  {exam.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-sans">{exam.department}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Exam Date:</span>
                  </span>
                  <span className="font-mono font-medium text-slate-200">{exam.date}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Time Window:</span>
                  </span>
                  <span className="font-mono font-medium text-slate-200">{exam.time}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Exam Hall:</span>
                  </span>
                  <span className="font-medium text-slate-200">{exam.room}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800/50">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Max Weightage:</span>
                  </span>
                  <span className="font-mono font-bold text-amber-400">{exam.maxScore || 100} Marks</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Modal: Only rendered when opened by admin/faculty */}
      {isAdminOrFaculty && (
        <ScheduleExamModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
        />
      )}
    </div>
  );
};
