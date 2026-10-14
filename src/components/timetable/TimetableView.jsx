import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  Download, 
  Printer, 
  Calendar,
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  X,
  Sparkles,
  ShieldCheck,
  Building2,
  BookOpen,
  Check,
  Copy
} from 'lucide-react';
import { WEEKLY_SCHEDULE_ITEMS } from '../../data/mockData.js';

// Color palette mapping by course code
const COURSE_COLORS = {
  'CS-301': {
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    card: 'bg-teal-950/50 border-teal-500/40 text-teal-100 hover:border-teal-300',
    dot: 'bg-teal-400',
    accent: 'text-teal-300'
  },
  'CS-420': {
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    card: 'bg-indigo-950/50 border-indigo-500/40 text-indigo-100 hover:border-indigo-300',
    dot: 'bg-indigo-400',
    accent: 'text-indigo-300'
  },
  'ECE-215': {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    card: 'bg-amber-950/50 border-amber-500/40 text-amber-100 hover:border-amber-300',
    dot: 'bg-amber-400',
    accent: 'text-amber-300'
  },
  'STAT-310': {
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    card: 'bg-rose-950/50 border-rose-500/40 text-rose-100 hover:border-rose-300',
    dot: 'bg-rose-400',
    accent: 'text-rose-300'
  },
  'BIO-240': {
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    card: 'bg-emerald-950/50 border-emerald-500/40 text-emerald-100 hover:border-emerald-300',
    dot: 'bg-emerald-400',
    accent: 'text-emerald-300'
  },
  'ECON-305': {
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    card: 'bg-sky-950/50 border-sky-500/40 text-sky-100 hover:border-sky-300',
    dot: 'bg-sky-400',
    accent: 'text-sky-300'
  }
};

const TIME_SLOTS = [
  { label: '08:00 AM', hour: 8, minutes: 480 },
  { label: '09:00 AM', hour: 9, minutes: 540 },
  { label: '10:00 AM', hour: 10, minutes: 600 },
  { label: '11:00 AM', hour: 11, minutes: 660 },
  { label: '12:00 PM', hour: 12, minutes: 720 },
  { label: '01:00 PM', hour: 13, minutes: 780 },
  { label: '02:00 PM', hour: 14, minutes: 840 },
  { label: '03:00 PM', hour: 15, minutes: 900 },
  { label: '04:00 PM', hour: 16, minutes: 960 },
  { label: '05:00 PM', hour: 17, minutes: 1020 },
];

const getSubjectDisplay = (cls) => {
  if (!cls) return '';
  if (cls.courseCode === 'CS-301') return 'Algorithms';
  if (cls.courseCode === 'CS-420') return 'Distributed Systems';
  if (cls.courseCode === 'ECE-215') return 'Signals & Systems';
  if (cls.courseCode === 'STAT-310') return 'Statistics';
  if (cls.courseCode === 'BIO-240') return 'Genomics';
  if (cls.courseCode === 'ECON-305') return 'Econometrics';
  if (cls.subjectName) {
    return cls.subjectName.split('&')[0].split('·')[0].trim();
  }
  return '';
};

const WEEK_DAYS = [
  { id: 'Monday', label: 'Monday', short: 'Mon', date: 'Oct 12' },
  { id: 'Tuesday', label: 'Tuesday', short: 'Tue', date: 'Oct 13' },
  { id: 'Wednesday', label: 'Wednesday', short: 'Wed', date: 'Oct 14', isToday: true },
  { id: 'Thursday', label: 'Thursday', short: 'Thu', date: 'Oct 15' },
  { id: 'Friday', label: 'Friday', short: 'Fri', date: 'Oct 16' },
  { id: 'Saturday', label: 'Saturday', short: 'Sat', date: 'Oct 17' },
  { id: 'Sunday', label: 'Sunday', short: 'Sun', date: 'Oct 18' }
];

export const TimetableView = () => {
  const { showToast, examinations, assignments } = useCollege();

  // Calendar View: 'month' | 'week' | 'day'
  const [viewMode, setViewMode] = useState('month');
  const [currentMonth, setCurrentMonth] = useState('October 2026');
  const [selectedDay, setSelectedDay] = useState('Wednesday');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [selectedClassModal, setSelectedClassModal] = useState(null);
  const [hasCopied, setHasCopied] = useState(false);

  // Filtered schedule items by subject filter
  const filteredSchedule = useMemo(() => {
    if (selectedCourseFilter === 'all') return WEEKLY_SCHEDULE_ITEMS;
    return WEEKLY_SCHEDULE_ITEMS.filter(c => c.courseCode === selectedCourseFilter);
  }, [selectedCourseFilter]);

  // Classes for the selected day in Day mode
  const dayClasses = useMemo(() => {
    return filteredSchedule
      .filter((item) => item.day === selectedDay)
      .sort((a, b) => a.startMinutes - b.startMinutes);
  }, [selectedDay, filteredSchedule]);

  // Export calendar .ics
  const handleExport = () => {
    let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Unity College//Collegiate Timetable//EN\n";
    filteredSchedule.forEach((c) => {
      ics += `BEGIN:VEVENT\nSUMMARY:${c.courseCode} - ${c.subjectName}\nDESCRIPTION:Faculty: ${c.faculty} | Room: ${c.room} (${c.type})\nLOCATION:${c.room}\nEND:VEVENT\n`;
    });
    ics += "END:VCALENDAR";

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Unity_College_Academic_Calendar_Fall2026.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Academic Calendar exported to (.ics)`, 'success');
  };

  const copyDetails = (cls) => {
    const text = `${cls.courseCode} - ${cls.subjectName}\nSlot: ${cls.day} ${cls.startTime} - ${cls.endTime}\nRoom: ${cls.room}\nInstructor: ${cls.faculty}`;
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    showToast('Class session details copied to clipboard.', 'success');
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Helper to map weekday to classes
  const getClassesForWeekday = (dayName) => {
    return filteredSchedule.filter(c => c.day === dayName).slice(0, 3);
  };

  // Course filter choices
  const courseCodes = ['all', 'CS-301', 'CS-420', 'ECE-215', 'STAT-310', 'BIO-240', 'ECON-305'];

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-slate-100 font-sans antialiased">
      
      {/* =========================================================================
          1. CLEAN CALENDAR TOOLBAR & CONTROLS (NO CLUTTER METRICS)
      ========================================================================= */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-5 border-b border-slate-800">
        
        {/* Left: Title & Term Badge */}
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-500/10 shrink-0">
            <CalendarDays className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-teal-400 font-semibold">Fall 2026 Term</span>
              <span>·</span>
              <span className="text-slate-300">Week 7 · Divyansh's Schedule</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Academic Calendar &amp; Timetable
            </h1>
          </div>
        </div>

        {/* Center: Month Navigation Controls */}
        <div className="flex items-center gap-2.5 bg-[#0c1427] px-3 py-1.5 rounded-2xl border border-slate-800 shadow-md self-start xl:self-auto">
          <button
            onClick={() => showToast('Navigated to previous academic month', 'info')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => {
              setViewMode('month');
              showToast('Reset to current date (Oct 14, 2026)', 'info');
            }}
            className="px-2.5 py-1 text-xs font-mono font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition-colors cursor-pointer"
          >
            Today
          </button>

          <span className="text-sm font-extrabold text-white px-2 font-sans tracking-wide">
            {viewMode === 'day' 
              ? `${selectedDay}, Oct 14, 2026` 
              : viewMode === 'week' 
              ? 'Oct 12 – Oct 18, 2026' 
              : currentMonth}
          </span>

          <button
            onClick={() => showToast('Navigated to next academic month', 'info')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: View Selector & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented View Mode Toggle */}
          <div className="flex items-center bg-[#0c1427] p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'day'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Day
            </button>
          </div>

          {/* Subject Filter Dropdown */}
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono border border-slate-800 rounded-xl bg-[#0c1427] focus:outline-none focus:border-indigo-500 text-slate-200 shadow-inner cursor-pointer"
          >
            <option value="all">All Courses (22 Sessions)</option>
            <option value="CS-301">CS-301 Algorithms</option>
            <option value="CS-420">CS-420 Distributed Systems</option>
            <option value="ECE-215">ECE-215 Signals &amp; Systems</option>
            <option value="STAT-310">STAT-310 Statistics</option>
            <option value="BIO-240">BIO-240 Genomics</option>
            <option value="ECON-305">ECON-305 Econometrics</option>
          </select>

          {/* Export & Print */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-[#0c1427] hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors cursor-pointer"
            title="Download Calendar (.ics)"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Export .ICS</span>
          </button>
          
          <button
            onClick={() => window.print()}
            className="p-1.5 text-slate-400 hover:text-white bg-[#0c1427] hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors cursor-pointer"
            title="Print Calendar"
          >
            <Printer className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: PROPER MONTH VIEW CALENDAR (CLASSIC 7-DAY MONTH GRID)
      ========================================================================= */}
      {viewMode === 'month' && (
        <div className="bg-[#0c1427] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Day of Week Header Row */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-[#080d1b] text-center font-mono text-xs font-bold text-slate-400 uppercase py-3 select-none">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <div key={day} className="tracking-wider">
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{day.substring(0, 3)}</span>
              </div>
            ))}
          </div>

          {/* 35 Calendar Cells for October 2026 */}
          {/* Note: Oct 1, 2026 is Thursday. 
              Sun Sep 27, Mon Sep 28, Tue Sep 29, Wed Sep 30 are previous month days. */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-800/80 bg-[#070b14]">
            
            {/* Previous month days: Sep 27 to Sep 30 */}
            {[27, 28, 29, 30].map((prevDate) => (
              <div key={`sep-${prevDate}`} className="min-h-[115px] p-2 bg-[#060913]/60 text-slate-600 font-mono text-xs select-none">
                <span className="block text-right pr-1 pt-0.5">{prevDate}</span>
              </div>
            ))}

            {/* October Days 1 to 31 */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((dateNum) => {
              // Day of week for dateNum in Oct 2026 (Oct 1 is Thu = index 4)
              const dayOfWeekIndex = (4 + (dateNum - 1)) % 7; 
              // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
              const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const dayName = dayNames[dayOfWeekIndex];
              const isToday = dateNum === 14; // Current Date: Oct 14, 2026 (Wednesday)

              // Classes for this weekday
              const daySchedule = filteredSchedule.filter(c => c.day === dayName);

              return (
                <div
                  key={`oct-${dateNum}`}
                  className={`min-h-[120px] p-2 transition-colors flex flex-col justify-between ${
                    isToday 
                      ? 'bg-indigo-950/20 border-indigo-500/40 relative' 
                      : 'hover:bg-slate-800/20'
                  }`}
                >
                  {/* Date Number Header */}
                  <div className="flex items-center justify-between pb-1">
                    {isToday ? (
                      <span className="text-[10px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded bg-teal-500 text-slate-950">
                        Today
                      </span>
                    ) : (
                      <span />
                    )}

                    <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      isToday 
                        ? 'bg-indigo-600 text-white font-extrabold shadow-sm shadow-indigo-500/50' 
                        : 'text-slate-400'
                    }`}>
                      {dateNum}
                    </span>
                  </div>

                  {/* Scheduled Class Events, Dynamic Faculty Exams & Campus Dates */}
                  <div className="space-y-1 flex-1 overflow-hidden">
                    {/* Real-time Faculty Scheduled Examinations */}
                    {(examinations || [])
                      .filter(ex => ex.date === `2026-10-${String(dateNum).padStart(2, '0')}`)
                      .map(ex => (
                        <div
                          key={`exam-${ex.id}`}
                          onClick={() => setSelectedClassModal({
                            id: ex.id,
                            courseCode: ex.courseCode || 'EXAM',
                            subjectName: ex.title,
                            room: ex.room || 'Examination Arena',
                            instructor: 'Board of Examiners',
                            startTime: ex.time || '09:00 AM',
                            type: 'Official Examination',
                            currentDay: `${dayName}, Oct ${dateNum}`
                          })}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-amber-500/25 text-amber-200 border border-amber-500/50 truncate font-extrabold cursor-pointer hover:scale-[1.02] flex items-center gap-1 shadow-sm"
                          title={`EXAM: ${ex.title} (${ex.time || 'Scheduled'})`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                          <span className="truncate">📝 {ex.courseCode}: {ex.title}</span>
                        </div>
                      ))}

                    {/* Real-time Faculty Assignments Due */}
                    {(assignments || [])
                      .filter(asg => asg.dueDate === `2026-10-${String(dateNum).padStart(2, '0')}`)
                      .map(asg => (
                        <div
                          key={`asg-${asg.id}`}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-200 border border-purple-500/40 truncate font-semibold flex items-center gap-1"
                          title={`Due: ${asg.title}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                          <span className="truncate">📌 {asg.title}</span>
                        </div>
                      ))}

                    {/* Milestone Highlights */}
                    {dateNum === 18 && (
                      <div className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 truncate font-semibold">
                        ⚡ Hackathon Day
                      </div>
                    )}
                    {dateNum === 22 && (
                      <div className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30 truncate font-semibold">
                        🎓 Dr. Lamport Lecture
                      </div>
                    )}

                    {/* Class Session Pills */}
                    {daySchedule.slice(0, 2).map((cls) => {
                      const colors = COURSE_COLORS[cls.courseCode] || COURSE_COLORS['CS-301'];
                      const subject = getSubjectDisplay(cls);
                      return (
                        <div
                          key={`${dateNum}-${cls.id}`}
                          onClick={() => setSelectedClassModal({ ...cls, currentDay: `${dayName}, Oct ${dateNum}` })}
                          className={`text-[10px] font-mono px-1.5 py-1 rounded-md border truncate font-bold cursor-pointer transition-transform hover:scale-[1.02] shadow-sm flex items-center gap-1.5 ${colors.badge}`}
                          title={`${cls.startTime} ${cls.courseCode}: ${cls.subjectName} (${cls.room})`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                          <span className="shrink-0 text-slate-300 font-semibold">{cls.startTime.split(' ')[0]}</span>
                          <span className="shrink-0 font-extrabold">{cls.courseCode}</span>
                          {subject && (
                            <span className="truncate font-medium text-white/95">· {subject}</span>
                          )}
                        </div>
                      );
                    })}

                    {daySchedule.length > 2 && (
                      <button
                        onClick={() => {
                          setSelectedDay(dayName);
                          setViewMode('day');
                        }}
                        className="text-[9px] font-mono text-slate-400 hover:text-indigo-300 pl-1 block transition-colors cursor-pointer"
                      >
                        +{daySchedule.length - 2} more sessions
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Next Month Days: Nov 1 to Nov 7 to complete 35-day grid */}
            {[1, 2, 3, 4, 5, 6, 7].slice(0, 7 - ((4 + 31) % 7)).map((nextDate) => (
              <div key={`nov-${nextDate}`} className="min-h-[115px] p-2 bg-[#060913]/60 text-slate-600 font-mono text-xs select-none">
                <span className="block text-right pr-1 pt-0.5">{nextDate}</span>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: PROPER WEEK VIEW TIMETABLE MATRIX (WEEK OF OCT 12 - 18)
      ========================================================================= */}
      {viewMode === 'week' && (
        <div className="rounded-3xl bg-[#0c1427] border border-slate-800 shadow-2xl overflow-hidden">
          
          {/* Week Header Days */}
          <div className="grid grid-cols-8 border-b border-slate-800 bg-[#080d1b] text-center font-mono select-none">
            <div className="py-3 px-2 border-r border-slate-800 text-xs font-bold text-slate-500 uppercase">
              Time
            </div>
            {WEEK_DAYS.map((d) => (
              <div
                key={d.id}
                className={`py-3 px-2 border-r border-slate-800 last:border-r-0 ${
                  d.isToday ? 'bg-indigo-950/40 border-b-2 border-b-indigo-400' : ''
                }`}
              >
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                  {d.short}
                </span>
                <span className={`text-xs font-extrabold block mt-0.5 ${d.isToday ? 'text-teal-300' : 'text-white'}`}>
                  {d.date}
                </span>
              </div>
            ))}
          </div>

          {/* Time Slot Rows */}
          <div className="divide-y divide-slate-800/80 bg-[#070b14]">
            {TIME_SLOTS.map((slot) => (
              <div key={slot.label} className="grid grid-cols-8 min-h-[75px] divide-x divide-slate-800/60">
                {/* Time Axis Column */}
                <div className="p-2.5 text-right font-mono text-[11px] text-slate-500 bg-[#080d1b]/50 select-none">
                  {slot.label}
                </div>

                {/* Day Columns */}
                {WEEK_DAYS.map((d) => {
                  const matchingClasses = filteredSchedule.filter((item) => {
                    if (item.day !== d.id) return false;
                    const diff = item.startMinutes - slot.minutes;
                    return diff >= 0 && diff < 60;
                  });

                  return (
                    <div
                      key={`${d.id}-${slot.label}`}
                      className={`p-1.5 transition-colors relative ${
                        d.isToday ? 'bg-indigo-950/15' : 'hover:bg-slate-800/10'
                      }`}
                    >
                      {matchingClasses.map((item) => {
                        const colors = COURSE_COLORS[item.courseCode] || COURSE_COLORS['CS-301'];
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedClassModal({ ...item, currentDay: `${d.label}, ${d.date}` })}
                            className={`p-2 rounded-xl border transition-all duration-150 cursor-pointer shadow-md group ${colors.card}`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded border ${colors.badge}`}>
                                {item.courseCode}
                              </span>
                              <span className="text-[9px] font-mono text-slate-300">
                                {item.startTime}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-white group-hover:text-teal-200 transition-colors truncate">
                              {item.subjectName}
                            </div>
                            <div className="text-[10px] text-slate-300 font-mono truncate mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                              <span className="truncate">{item.room.split('·')[0].trim()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* =========================================================================
          VIEW 3: PROPER DAY VIEW (HOURLY ITINERARY)
      ========================================================================= */}
      {viewMode === 'day' && (
        <div className="p-6 rounded-3xl bg-[#0c1427] border border-slate-800 shadow-2xl space-y-5">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                  selectedDay === d
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-950/40'
                    : 'bg-[#080d1b] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>{selectedDay}'s Daily Lecture Timeline</span>
            </h2>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {dayClasses.length} Scheduled Sessions
            </span>
          </div>

          {/* Timeline Cards */}
          <div className="space-y-3">
            {dayClasses.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#080d1b] border border-slate-800 text-slate-400">
                <Calendar className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-base font-bold text-white">No classes scheduled for {selectedDay}</p>
                <p className="text-xs text-slate-500 mt-1">Free academic hours for self-directed studies.</p>
              </div>
            ) : (
              dayClasses.map((item, idx) => {
                const colors = COURSE_COLORS[item.courseCode] || COURSE_COLORS['CS-301'];
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedClassModal({ ...item, currentDay: selectedDay })}
                    className="p-5 rounded-2xl bg-[#080d1b] border border-slate-800 hover:border-indigo-500/40 transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono min-w-[90px] shrink-0">
                        <span className="text-xs font-bold text-white block">{item.startTime}</span>
                        <span className="text-[10px] text-slate-500 block">to {item.endTime}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${colors.badge}`}>
                            {item.courseCode}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {item.type}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {item.subjectName}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-2">
                          <span>Faculty: <strong className="text-slate-300">{item.faculty}</strong></span>
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                      <div className="flex items-center sm:justify-end gap-1.5 text-emerald-300 font-medium text-xs">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{item.room}</span>
                      </div>
                      <span className="text-[11px] font-mono text-indigo-400 mt-1 block">
                        Click for Details →
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE CLASS SESSION DETAILS MODAL (ZERO UNWANTED REDIRECTS)
      ========================================================================= */}
      {selectedClassModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0c1427] border border-slate-700 shadow-2xl p-6 sm:p-7 text-slate-100 font-sans space-y-5 my-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selectedClassModal.courseCode}
                </span>
                <span className="text-xs font-mono text-teal-400 font-semibold">
                  {selectedClassModal.type}
                </span>
              </div>
              <button
                onClick={() => setSelectedClassModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white leading-snug">
                {selectedClassModal.subjectName}
              </h3>
              <p className="text-xs text-indigo-400 font-mono mt-1">
                Collegiate Curriculum • Academic Term Active
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#080d1b] border border-slate-800 space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Scheduled Time:</span>
                </span>
                <span className="text-white font-bold">{selectedClassModal.startTime} – {selectedClassModal.endTime}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Amphitheater / Hall:</span>
                </span>
                <span className="text-emerald-300 font-semibold">{selectedClassModal.room}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-purple-400" />
                  <span>Faculty Instructor:</span>
                </span>
                <span className="text-slate-200">{selectedClassModal.faculty}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                onClick={() => copyDetails(selectedClassModal)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-200 bg-[#080d1b] hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors cursor-pointer"
              >
                {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{hasCopied ? 'Copied' : 'Copy Session Details'}</span>
              </button>
              
              <button
                onClick={() => setSelectedClassModal(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
