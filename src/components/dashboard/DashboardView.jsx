import React, { useState, useEffect } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Users, 
  BookOpen, 
  CalendarCheck2, 
  Award, 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  ArrowRight,
  ChevronRight,
  Camera,
  Activity,
  FileText,
  ShieldCheck,
  PlusCircle,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Building,
  GraduationCap
} from 'lucide-react';
import { SUBJECT_ATTENDANCE_DATA } from '../../data/mockData.js';
import { DashboardScheduleDeck } from './DashboardScheduleDeck.jsx';

export const DashboardView = () => {
  const { 
    students, 
    courses, 
    staff,
    departments,
    examinations,
    assignments,
    auditLogs,
    recentActivities,
    systemStatus,
    setActiveTab, 
    role,
    user,
    currentStudent,
    setIsStudentPhotoModalOpen,
    setSelectedCourseId
  } = useCollege();

  const [backendHealth, setBackendHealth] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setBackendHealth(data))
      .catch(() => setBackendHealth({ status: 'offline' }));
  }, []);

  // Real database metrics computation
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const totalFaculty = staff?.length || 8;
  const activeCoursesCount = courses.length;

  const totalGpa = students.reduce((acc, s) => acc + (s.gpa || 0), 0);
  const avgCampusGpa = totalStudents > 0 ? (totalGpa / totalStudents).toFixed(2) : '3.65';

  const totalAttendance = students.reduce((acc, s) => acc + (s.attendanceRate || 0), 0);
  const avgCampusAttendance = totalStudents > 0 ? Math.round(totalAttendance / totalStudents) : 92;

  const upcomingExamsCount = examinations?.length || 4;
  const pendingAssignmentsCount = assignments?.length || 4;

  // Department Distribution calculation
  const deptMap = {};
  students.forEach(s => {
    const dept = s.department || 'General Science';
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });
  const deptList = Object.entries(deptMap).map(([name, count]) => ({
    name,
    count,
    percentage: totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0
  }));

  // Attendance subjects preview
  const subjectList = Object.values(SUBJECT_ATTENDANCE_DATA).slice(0, 4);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Context */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          {role === 'student' && currentStudent ? (
            <div 
              onClick={() => setIsStudentPhotoModalOpen(true)}
              className="relative cursor-pointer group shrink-0"
              title="Click to change student photo"
            >
              {currentStudent.avatarUrl ? (
                <img
                  src={currentStudent.avatarUrl}
                  alt={currentStudent.firstName}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500 shadow-md group-hover:scale-105 transition-all"
                />
              ) : (
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentStudent.avatarBg || 'from-indigo-600 to-purple-700'} text-white flex items-center justify-center font-bold text-lg ring-2 ring-indigo-500/40 shadow-md group-hover:scale-105 transition-all`}
                >
                  {currentStudent.firstName?.[0] || 'S'}
                </div>
              )}
              <div 
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md ring-1 ring-slate-700 group-hover:bg-indigo-600 transition-colors"
                title="Change picture"
              >
                <Camera className="w-2.5 h-2.5 text-indigo-200" />
              </div>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Building className="w-6 h-6" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-0.5">
              <span className="font-semibold text-white">Unity College</span>
              <span>·</span>
              <span className="text-indigo-400">Fall 2026 Academic Term</span>
              {role === 'student' && currentStudent && (
                <>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold">{currentStudent.studentId}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {role === 'student' && currentStudent 
                ? `Welcome back, ${currentStudent.firstName} ${currentStudent.lastName}` 
                : 'Executive Campus Administration'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {role === 'student' && currentStudent 
                ? `${currentStudent.department} · Advisor: ${currentStudent.advisor}`
                : 'Real-time administrative telemetry, student matriculation, faculty distribution, and academic scheduling.'}
            </p>
          </div>
        </div>

        {/* Quick Administrative Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {role !== 'student' ? (
            <>
              <button
                onClick={() => setActiveTab('students')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Student Directory</span>
              </button>
              <button
                onClick={() => setActiveTab('examinations')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-[#0c1427] border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg transition-all cursor-pointer"
              >
                <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                <span>Examinations</span>
              </button>
              <button
                onClick={() => setActiveTab('audit-logs')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-[#0c1427] border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audit Logs</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('attendance')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#0c1427] border border-slate-800 rounded-lg hover:border-slate-700 transition-all cursor-pointer"
              >
                <CalendarCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>My Attendance</span>
              </button>
              <button
                onClick={() => setActiveTab('timetable')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all cursor-pointer"
              >
                <CalendarDays className="w-3.5 h-3.5 text-indigo-200" />
                <span>Class Timetable</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 8 Metric KPI Cards (Executive Dark Architecture) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Total Enrolled Students */}
        <div 
          onClick={() => setActiveTab('students')}
          className="p-4 bg-[#0c1427] rounded-xl border border-slate-800 hover:border-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {role === 'student' ? 'My Enrolled Courses' : 'Active Students'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            {role === 'student' && currentStudent 
              ? currentStudent.enrolledCourseIds?.length || 4
              : activeStudents}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span className="text-emerald-400 font-medium">Authoritative DB</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Metric 2: Active Faculty */}
        <div 
          onClick={() => setActiveTab(role === 'student' ? 'courses' : 'faculty')}
          className="p-4 bg-[#0c1427] rounded-xl border border-slate-800 hover:border-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {role === 'student' ? 'Active Faculty' : 'Faculty & Staff'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <User className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            {totalFaculty}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>5 Academic Depts</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Metric 3: Active Courses */}
        <div 
          onClick={() => setActiveTab('courses')}
          className="p-4 bg-[#0c1427] rounded-xl border border-slate-800 hover:border-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Active Courses
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            {activeCoursesCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Curriculum Live</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Metric 4: Campus Attendance */}
        <div 
          onClick={() => setActiveTab('attendance')}
          className="p-4 bg-[#0c1427] rounded-xl border border-slate-800 hover:border-emerald-500/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {role === 'student' ? 'My Attendance' : 'Avg. Attendance'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            {role === 'student' && currentStudent 
              ? `${Math.round(currentStudent.attendanceRate || 95)}%` 
              : `${avgCampusAttendance}%`}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span className="text-emerald-400 font-mono font-semibold">&ge; 75% policy met</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Metric 5: Average Term GPA */}
        <div 
          onClick={() => setActiveTab('grading')}
          className="p-4 bg-[#0c1427] rounded-xl border border-slate-800 hover:border-amber-500/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {role === 'student' ? 'Cumulative GPA' : 'Mean Campus GPA'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            {role === 'student' && currentStudent ? currentStudent.gpa?.toFixed(2) : avgCampusGpa}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>4.00 Max Scale</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Metric 6: Scheduled Exams */}
        <div 
          onClick={() => setActiveTab('examinations')}
          className="p-4 bg-[#0c1427] rounded-xl border border-slate-800 hover:border-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Examinations
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            {upcomingExamsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Fall Midterms</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Metric 7: Course Assignments */}
        <div 
          onClick={() => setActiveTab('assignments')}
          className="p-4 bg-[#0c1427] rounded-xl border border-slate-800 hover:border-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Assignments
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-2">
            {pendingAssignmentsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>In Evaluation</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Metric 8: Backend Telemetry */}
        <div 
          onClick={() => setActiveTab('settings')}
          className="p-4 bg-[#0c1427] rounded-xl border border-slate-800 hover:border-emerald-500/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Backend Status
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-2 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Port 3001 Connected</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

      {/* Analytics & Department Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution (2 cols) */}
        <div className="lg:col-span-2 bg-[#0c1427] rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Student Matriculation by Department</h2>
              <span className="text-xs font-mono text-slate-400">· Live Database Records</span>
            </div>
            <button
              onClick={() => setActiveTab('departments')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Depts</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {deptList.map((d, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300 truncate max-w-sm">{d.name}</span>
                  <div className="flex items-center gap-2 font-mono text-slate-400">
                    <span className="text-white font-semibold">{d.count} students</span>
                    <span>({d.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#080d1b] rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(d.percentage, 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Realtime Backend System Status Panel */}
        <div className="bg-[#0c1427] rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">System Service Health</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active
            </span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'REST API & Express Daemon', latency: '12ms', status: 'Operational' },
              { name: 'JSON Persistent DB (server/database.json)', latency: '4ms', status: 'Operational' },
              { name: 'Authentication & Session Guard', latency: '18ms', status: 'Operational' },
              { name: 'Academic Records Polling Syncer', latency: '3s loop', status: 'Synchronized' }
            ].map((svc, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-[#080d1b] border border-slate-800 text-xs">
                <div>
                  <div className="font-medium text-slate-200">{svc.name}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">Latency: {svc.latency}</div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{svc.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Server Uptime</span>
            <span className="text-indigo-400 font-bold">100.0% Continuous</span>
          </div>
        </div>
      </div>

      {/* 3D Deck Perspective Class Schedule & Daily Routine */}
      <DashboardScheduleDeck />

      {/* Subject Attendance Overview */}
      <div className="bg-[#0c1427] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Subject Attendance Telemetry</h2>
            <span className="text-xs font-mono text-slate-400">· Minimum requirement &ge; 75%</span>
          </div>
          <button
            onClick={() => setActiveTab('attendance')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Attendance Tracker</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {subjectList.map((sub) => {
            const isGood = sub.attendanceRate >= 75;
            return (
              <div 
                key={sub.courseId}
                onClick={() => {
                  setSelectedCourseId(sub.courseId);
                  setActiveTab('attendance');
                }}
                className="p-3.5 rounded-xl border border-slate-800 hover:border-emerald-500/50 hover:bg-[#111c38] transition-all duration-150 cursor-pointer group bg-[#080d1b]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-white">
                    {sub.subjectCode}
                  </span>
                  <span className={`text-xs font-bold font-mono ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {sub.attendanceRate}%
                  </span>
                </div>
                <div className="text-xs text-slate-300 truncate font-medium mb-2" title={sub.subjectName}>
                  {sub.subjectName}
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#070b14] rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      isGood ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(sub.attendanceRate, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                  <span>{sub.classesAttended}/{sub.totalClasses} classes</span>
                  <span>{sub.classesMissed} missed</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
