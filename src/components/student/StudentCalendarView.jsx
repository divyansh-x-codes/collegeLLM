import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Download
} from 'lucide-react';
import { useCollege } from '../../context/CollegeContext.jsx';

export const StudentCalendarView = () => {
  const { showToast } = useCollege();
  const [selectedMonth, setSelectedMonth] = useState('October 2026');

  const institutionalDates = [
    { date: 'Oct 13, 2026', title: 'Fall Term Midpoint & Academic Advisory Week', type: 'Academic Advising', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { date: 'Oct 15, 2026', title: 'Course Assignment 2 Deadline', type: 'Coursework Deadline', badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { date: 'Oct 18, 2026', title: 'Annual Campus Hackathon & AI Showcase', type: 'Student Campus Event', badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
    { date: 'Oct 26 - Oct 31, 2026', title: 'Fall 2026 Midterm Examination Period', type: 'Examination Week', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    { date: 'Nov 02, 2026', title: 'Spring 2027 Course Registration Opens', type: 'Registrar Milestone', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { date: 'Nov 26 - Nov 28, 2026', title: 'Thanksgiving & Fall Campus Recess', type: 'Institutional Holiday', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { date: 'Dec 14 - Dec 19, 2026', title: 'Fall 2026 Final Examinations & Project Juries', type: 'Final Exams', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    { date: 'Dec 22, 2026', title: 'Official Term Grades Published to Student Portals', type: 'Grade Release', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
  ];

  const handleExportCalendar = () => {
    showToast('Exported Fall 2026 Academic Calendar (.ics) to downloads', 'success');
  };

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-slate-100 font-sans antialiased">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-0.5">
            <span className="text-indigo-400 font-semibold">Office of the Registrar</span>
            <span>·</span>
            <span>Academic Year 2026–2027</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
            <span>Collegiate Academic Calendar & Deadlines</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative institutional timetable, registration windows, midterm schedules, and term holidays.
          </p>
        </div>

        <button
          onClick={handleExportCalendar}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#0c1427] border border-slate-800 hover:border-slate-700 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sync to Calendar (.ics)</span>
        </button>
      </div>

      {/* Calendar List */}
      <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl space-y-3">
        {institutionalDates.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#080d1b] border border-slate-800/80 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-36 shrink-0 font-mono text-xs font-bold text-indigo-300">
                {item.date}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white text-sm truncate">{item.title}</div>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded text-xs font-mono font-semibold border shrink-0 ${item.badgeColor}`}>
              {item.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
