import React, { useState, useMemo } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  CalendarCheck2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Filter, 
  Download, 
  Check, 
  X, 
  Radio, 
  QrCode,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { QrKioskModal } from './QrKioskModal.jsx';
import { TableDensityToggle } from '../common/TableDensityToggle.jsx';

export const AttendanceTrackerView = () => {
  const { 
    courses, 
    subjectAttendance, 
    setSubjectAttendance,
    liveSession, 
    role, 
    currentStudent, 
    selectedCourseId, 
    setSelectedCourseId,
    showToast,
    isCompactMode,
    studentSelfCheckIn,
    toggleSessionLive
  } = useCollege();

  // Selected subject in the dropdown (defaults to selectedCourseId or first available)
  const [selectedSubjectId, setSelectedSubjectId] = useState(() => {
    return selectedCourseId && subjectAttendance[selectedCourseId] ? selectedCourseId : 'c-1';
  });

  // Filter for history list ('all', 'Present', 'Absent', 'Late', 'Excused')
  const [historyFilter, setHistoryFilter] = useState('all');
  const [isKioskOpen, setIsKioskOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('subject'); // 'subject' or 'liveSession'

  // Get active subject attendance data dynamically
  const activeSubjectData = useMemo(() => {
    if (subjectAttendance[selectedSubjectId]) {
      return subjectAttendance[selectedSubjectId];
    }
    // Fallback: look up in courses and construct default structure
    const course = courses.find((c) => c.id === selectedSubjectId) || courses[0];
    return {
      courseId: course?.id || 'c-1',
      subjectCode: course?.code || 'CS-301',
      subjectName: course?.title || 'Course Subject',
      instructor: course?.instructor?.name || 'Faculty Member',
      room: course?.schedule?.room || 'Campus Hall',
      credits: course?.credits || 3,
      totalClasses: 20,
      classesAttended: 18,
      classesMissed: 2,
      attendanceRate: 90.0,
      history: []
    };
  }, [subjectAttendance, selectedSubjectId, courses]);

  // Selected course metadata
  const selectedCourseMeta = courses.find((c) => c.id === selectedSubjectId);

  // Filtered attendance history
  const filteredHistory = useMemo(() => {
    if (!activeSubjectData.history) return [];
    if (historyFilter === 'all') return activeSubjectData.history;
    return activeSubjectData.history.filter((h) => h.status === historyFilter);
  }, [activeSubjectData, historyFilter]);

  // CSV Export for Subject Attendance
  const handleExportCSV = () => {
    const headers = ['Session #', 'Date', 'Day', 'Time', 'Venue', 'Topic', 'Status', 'Mode', 'Remarks'];
    const rows = (activeSubjectData.history || []).map((h) => [
      h.sessionNum,
      h.date,
      h.day,
      `"${h.time}"`,
      `"${h.room}"`,
      `"${h.topic}"`,
      h.status,
      h.mode,
      `"${h.remarks || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${activeSubjectData.subjectCode}_Log.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Attendance report for ${activeSubjectData.subjectCode} exported.`, 'success');
  };

  const isPolicyMet = activeSubjectData.attendanceRate >= 75;

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-slate-100 font-sans antialiased">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span className="font-semibold text-indigo-400">Unity College</span>
            <span>·</span>
            <span>Academic Attendance Registry</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck2 className="w-6 h-6 text-emerald-400" />
            <span>Attendance Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a subject to inspect real-time percentage, attended/missed lecture counts, and official history.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <TableDensityToggle />
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          {role !== 'student' && (
            <button
              onClick={() => setIsKioskOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-md cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-white" />
              <span>Launch QR Kiosk</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Subject Selection Dropdown Bar */}
      <div className="bg-[#0c1427] rounded-xl border border-slate-800 p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="subject-select" className="text-xs font-bold text-slate-300 whitespace-nowrap flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Select Subject:</span>
          </label>
          <div className="relative flex-1 max-w-md">
            <select
              id="subject-select"
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setSelectedCourseId(e.target.value);
                showToast(`Switched to ${subjectAttendance[e.target.value]?.subjectCode || 'subject'}.`, 'info');
              }}
              className="w-full bg-[#080d1b] border border-slate-700/80 text-white text-xs font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id} className="bg-[#0f172a] text-white">
                  {course.code} — {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Subject Quick Metadata */}
        <div className="flex items-center gap-4 text-xs text-slate-400 divide-x divide-slate-800 shrink-0">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-medium text-slate-200">{activeSubjectData.instructor}</span>
          </span>
          <span className="pl-4 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{activeSubjectData.room}</span>
          </span>
          <span className="pl-4 font-mono font-semibold text-indigo-400">
            {activeSubjectData.credits} Credits
          </span>
        </div>
      </div>

      {/* 4 Attendance Statistics KPI Cards for Selected Subject */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Attendance Percentage */}
        <div className="bg-[#0c1427] rounded-xl border border-slate-800 p-4 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Attendance Percentage
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              isPolicyMet ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80' : 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
            }`}>
              {isPolicyMet ? 'Good Standing' : 'Below 75%'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold font-mono tracking-tight ${
              isPolicyMet ? 'text-white' : 'text-rose-400'
            }`}>
              {activeSubjectData.attendanceRate}%
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                isPolicyMet ? 'bg-indigo-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(activeSubjectData.attendanceRate, 100)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400">
            Institutional minimum target: 75.0%
          </div>
        </div>

        {/* Metric 2: Classes Attended */}
        <div className="bg-[#0c1427] rounded-xl border border-slate-800 p-4 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Classes Attended
            </span>
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400">
            {activeSubjectData.classesAttended}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Lectures & labs marked present/late
          </p>
        </div>

        {/* Metric 3: Classes Missed */}
        <div className="bg-[#0c1427] rounded-xl border border-slate-800 p-4 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Classes Missed
            </span>
            <X className="w-4 h-4 text-rose-400" />
          </div>
          <div className={`text-3xl font-bold font-mono ${activeSubjectData.classesMissed > 2 ? 'text-rose-400' : 'text-white'}`}>
            {activeSubjectData.classesMissed}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Unexcused absences to date
          </p>
        </div>

        {/* Metric 4: Total Classes Conducted */}
        <div className="bg-[#0c1427] rounded-xl border border-slate-800 p-4 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Total Classes
            </span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {activeSubjectData.totalClasses}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Total curriculum sessions held
          </p>
        </div>

      </div>

      {/* Attendance History Section */}
      <div className="bg-[#0c1427] rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Section Header & Status Filters */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080d1b]">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Attendance History</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                ({filteredHistory.length} recorded sessions for {activeSubjectData.subjectCode})
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological log of verified lecture attendances, biometric check-ins, and leave notices.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Filter:</span>
            </span>
            {['all', 'Present', 'Absent', 'Late'].map((st) => (
              <button
                key={st}
                onClick={() => setHistoryFilter(st)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  historyFilter === st
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-[#0c1427] border border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {st === 'all' ? 'All Records' : st}
              </button>
            ))}
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className={`w-full text-left ${isCompactMode ? 'table-compact' : ''}`}>
            <thead className="bg-[#080d1b] border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase tracking-wider font-mono">
              <tr>
                <th className="py-2.5 px-4">Session #</th>
                <th className="py-2.5 px-4">Date & Day</th>
                <th className="py-2.5 px-4">Time & Venue</th>
                <th className="py-2.5 px-4">Topic / Session Title</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Verification</th>
                <th className="py-2.5 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs text-slate-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No attendance records found for this filter.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                      #{item.sessionNum}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{item.date}</div>
                      <div className="text-[11px] text-slate-400">{item.day}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                      <div>{item.time}</div>
                      <div className="text-slate-400">{item.room}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-medium max-w-xs">
                      {item.topic}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.status === 'Present'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                          : item.status === 'Late'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-800/80'
                          : item.status === 'Excused'
                          ? 'bg-blue-950/80 text-blue-400 border border-blue-800/80'
                          : 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                      }`}>
                        {item.status === 'Present' && <Check className="w-3 h-3 text-emerald-400" />}
                        {item.status === 'Absent' && <X className="w-3 h-3 text-rose-400" />}
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {item.mode}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      {item.remarks || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Kiosk Dialog */}
      <QrKioskModal isOpen={isKioskOpen} onClose={() => setIsKioskOpen(false)} />
    </div>
  );
};
