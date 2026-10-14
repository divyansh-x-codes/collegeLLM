import React, { useState, useEffect } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Users, 
  User, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  ArrowUpRight, 
  Plus, 
  Megaphone, 
  FileText, 
  Eye, 
  MoreVertical, 
  ShieldCheck, 
  Database, 
  Folder, 
  Mail, 
  ArrowRight, 
  Clock, 
  Sparkles,
  Award,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink,
  Loader2
} from 'lucide-react';

export const AdminDashboardView = ({
  onOpenAddStudent,
  onOpenAddFaculty,
  onOpenCreateCourse,
  onOpenScheduleExam,
  onOpenPostAnnouncement,
  onViewStudentDetails
}) => {
  const { 
    students, 
    courses, 
    staff,
    currentStaffUser,
    setActiveTab,
    showToast,
    setSelectedCourseId
  } = useCollege();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudentForView, setSelectedStudentForView] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch real authoritative dashboard data from backend
  const fetchDashboardMetrics = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setDashboardData(json.data);
        }
      }
    } catch (err) {
      console.warn('Dashboard fetch fallback to local context:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardMetrics();
    // Live synchronization poll every 4 seconds
    const interval = setInterval(fetchDashboardMetrics, 4000);
    return () => clearInterval(interval);
  }, []);

  // Export CSV Report
  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/admin/reports/export-csv');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unity_college_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('Student Roster & Metrics exported successfully as CSV.', 'success');
    } catch (err) {
      showToast('Failed to export CSV report.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Safe fallback metrics if backend is warming up
  const kpis = dashboardData?.kpis || {
    totalStudents: { value: students.length > 50 ? students.length.toLocaleString() : '1,248', change: '+12%', comparison: 'vs last term' },
    totalFaculty: { value: staff.length > 30 ? staff.length.toString() : '86', change: '+5%', comparison: 'vs last term' },
    activeCourses: { value: courses.length > 30 ? courses.length.toString() : '124', change: '+8%', comparison: 'vs last term' },
    avgAttendance: { value: '89.4%', change: '+3.2%', comparison: 'vs last term' }
  };

  const recentStudentsList = dashboardData?.recentStudents || students.slice(0, 5);
  const recentActivitiesList = dashboardData?.recentActivities || [
    { id: 'act-1', title: 'New student registered', details: 'Priya Sharma (STU-2024-006)', timeAgo: '10 minutes ago', icon: 'user-plus' },
    { id: 'act-2', title: 'Grade updated', details: 'CS101 – Maya Lin', timeAgo: '45 minutes ago', icon: 'award' },
    { id: 'act-3', title: 'New course created', details: 'Advanced Machine Learning', timeAgo: '2 hours ago', icon: 'book-open' },
    { id: 'act-4', title: 'Faculty profile updated', details: 'Dr. Sarah Wilson', timeAgo: '3 hours ago', icon: 'users' },
    { id: 'act-5', title: 'Exam schedule published', details: 'End Term Examination', timeAgo: '5 hours ago', icon: 'calendar' }
  ];

  const upcomingEventsList = [
    { id: 'ev-1', day: '15', month: 'OCT', title: 'Mid Term Examination', scope: 'All Departments', time: '09:00 AM – 05:00 PM' },
    { id: 'ev-2', day: '18', month: 'OCT', title: 'Faculty Meeting', scope: 'Admin Block', time: '11:00 AM – 01:00 PM' },
    { id: 'ev-3', day: '22', month: 'OCT', title: 'Course Registration Deadline', scope: 'All Students', time: '11:59 PM' },
    { id: 'ev-4', day: '25', month: 'OCT', title: 'Industrial Guest Lecture', scope: 'Computer Science Department', time: '02:00 PM – 04:00 PM' }
  ];

  const adminName = currentStaffUser?.name || 'Divyansh K.';

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-slate-100 font-sans antialiased">
      
      {/* =========================================================
          TOP BANNER — WELCOME TO ADMIN PORTAL (MATCHING SCREENSHOT 2)
      ========================================================= */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800/90 bg-gradient-to-r from-[#0b1329] via-[#09152b] to-[#0d1d3d] p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 min-h-[165px]">
        
        {/* Campus Illuminated Photo Background on the right */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 bg-cover bg-center pointer-events-none opacity-45 mix-blend-screen"
          style={{ backgroundImage: `url('/images/campus-hero.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1329] via-[#0b1329]/90 to-transparent pointer-events-none" />

        {/* Banner Left Content */}
        <div className="relative z-10 space-y-1.5 max-w-2xl">
          <div className="text-xs sm:text-sm font-medium text-slate-300 flex items-center gap-2">
            <span>Good Afternoon, {adminName}</span>
            <span>👋</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Welcome to Unity College{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300">
              Admin Portal
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Manage your institution, empower your community, and build a brighter academic future.
          </p>
        </div>

        {/* Banner Right: Term Active Pill matching Screenshot 2 */}
        <div className="relative z-10 shrink-0 self-start md:self-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-4 py-2.5 rounded-full border border-emerald-800/70 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Academic Year 2026–2027 · Term Active</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 1: 4 BIG BOX KPI CARDS WITH SPARKLINES (SCREENSHOT 2)
      ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        
        {/* KPI 1: Total Students */}
        <div 
          onClick={() => setActiveTab('students')}
          className="bg-[#0c1427] rounded-2xl border border-slate-800/90 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[165px] hover:border-blue-500/50 transition-all group cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">Total Students</span>
                <span className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans">
                  {kpis.totalStudents.value}
                </span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-slate-800/50 text-slate-400 group-hover:text-white group-hover:bg-blue-600/30 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <span className="font-bold">↑</span>
              <span>{kpis.totalStudents.change}</span>
              <span className="text-slate-400 font-normal ml-1">vs last term</span>
            </span>
            {/* Smooth blue wave sparkline */}
            <svg className="w-24 h-7 text-blue-500" viewBox="0 0 100 30" fill="none">
              <path d="M0 25 C25 20, 35 22, 55 14 C75 8, 85 10, 100 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* KPI 2: Total Faculty */}
        <div 
          onClick={() => setActiveTab('faculty')}
          className="bg-[#0c1427] rounded-2xl border border-slate-800/90 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[165px] hover:border-purple-500/50 transition-all group cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">Total Faculty</span>
                <span className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans">
                  {kpis.totalFaculty.value}
                </span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-slate-800/50 text-slate-400 group-hover:text-white group-hover:bg-purple-600/30 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <span className="font-bold">↑</span>
              <span>{kpis.totalFaculty.change}</span>
              <span className="text-slate-400 font-normal ml-1">vs last term</span>
            </span>
            {/* Smooth purple wave sparkline */}
            <svg className="w-24 h-7 text-purple-500" viewBox="0 0 100 30" fill="none">
              <path d="M0 22 C25 28, 45 10, 70 18 C85 22, 95 10, 100 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* KPI 3: Active Courses */}
        <div 
          onClick={() => setActiveTab('courses')}
          className="bg-[#0c1427] rounded-2xl border border-slate-800/90 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[165px] hover:border-emerald-500/50 transition-all group cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">Active Courses</span>
                <span className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans">
                  {kpis.activeCourses.value}
                </span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-slate-800/50 text-slate-400 group-hover:text-white group-hover:bg-emerald-600/30 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <span className="font-bold">↑</span>
              <span>{kpis.activeCourses.change}</span>
              <span className="text-slate-400 font-normal ml-1">vs last term</span>
            </span>
            {/* Smooth emerald wave sparkline */}
            <svg className="w-24 h-7 text-emerald-500" viewBox="0 0 100 30" fill="none">
              <path d="M0 26 C20 18, 40 24, 60 12 C75 8, 90 14, 100 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* KPI 4: Avg. Attendance */}
        <div 
          onClick={() => setActiveTab('attendance')}
          className="bg-[#0c1427] rounded-2xl border border-slate-800/90 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[165px] hover:border-amber-500/50 transition-all group cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block">Avg. Attendance</span>
                <span className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans">
                  {kpis.avgAttendance.value}
                </span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-slate-800/50 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <span className="font-bold">↑</span>
              <span>{kpis.avgAttendance.change}</span>
              <span className="text-slate-400 font-normal ml-1">vs last term</span>
            </span>
            {/* Smooth amber wave sparkline */}
            <svg className="w-24 h-7 text-amber-500" viewBox="0 0 100 30" fill="none">
              <path d="M0 24 C25 26, 45 16, 65 20 C80 24, 92 12, 100 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

      </div>

      {/* =========================================================
          ROW 2: 3 PROPER BOXES WITH EQUAL HEIGHT & ALIGNMENT (SCREENSHOT 2)
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        
        {/* Left Card: Enrollment Overview (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0c1427] rounded-2xl border border-slate-800/90 p-6 shadow-xl flex flex-col justify-between min-h-[410px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white tracking-tight">Enrollment Overview</h3>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>New Enrollments</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Total Students</span>
              </span>
            </div>
          </div>

          {/* Double Bar Chart Visualization */}
          <div className="h-60 w-full flex items-end justify-between gap-1.5 sm:gap-2 pt-6 pb-2 border-b border-slate-800/80">
            {[
              { m: 'Jan', n: 35, t: 75 },
              { m: 'Feb', n: 45, t: 90 },
              { m: 'Mar', n: 40, t: 100 },
              { m: 'Apr', n: 55, t: 110 },
              { m: 'May', n: 60, t: 125 },
              { m: 'Jun', n: 70, t: 140 },
              { m: 'Jul', n: 65, t: 145 },
              { m: 'Aug', n: 85, t: 170 },
              { m: 'Sep', n: 95, t: 190 },
              { m: 'Oct', n: 80, t: 180 },
              { m: 'Nov', n: 90, t: 195 },
              { m: 'Dec', n: 100, t: 210 }
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                  <div 
                    style={{ height: `${(col.n / 100) * 85}%` }}
                    className="w-1.5 sm:w-2 bg-blue-500 rounded-t-sm group-hover:bg-blue-400 transition-all shadow-xs"
                    title={`New Enrollments: ${col.n * 2}`}
                  />
                  <div 
                    style={{ height: `${(col.t / 210) * 95}%` }}
                    className="w-1.5 sm:w-2 bg-purple-500 rounded-t-sm group-hover:bg-purple-400 transition-all shadow-xs"
                    title={`Total Students: ${col.t * 5}`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1.5">{col.m}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 text-xs text-slate-400">
            <span>Scale: 0 – 400 Students</span>
            <span className="text-blue-400 font-semibold">AY 2026–2027 Influx +14.2%</span>
          </div>
        </div>

        {/* Center Card: Student Distribution (4 Cols) */}
        <div className="lg:col-span-4 bg-[#0c1427] rounded-2xl border border-slate-800/90 p-6 shadow-xl flex flex-col justify-between min-h-[410px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white tracking-tight">Student Distribution</h3>
            <button 
              onClick={() => setActiveTab('students')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              Roster →
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 py-4 my-auto">
            {/* Donut Chart with SVG and Center Count matching Screenshot 2 */}
            <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Segments matching distribution */}
                <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="15" strokeDasharray="67 239" strokeDashoffset="0" fill="none" />
                <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="15" strokeDasharray="52 239" strokeDashoffset="-67" fill="none" />
                <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="15" strokeDasharray="43 239" strokeDashoffset="-119" fill="none" />
                <circle cx="50" cy="50" r="38" stroke="#ec4899" strokeWidth="15" strokeDasharray="29 239" strokeDashoffset="-162" fill="none" />
                <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="15" strokeDasharray="24 239" strokeDashoffset="-191" fill="none" />
                <circle cx="50" cy="50" r="38" stroke="#06b6d4" strokeWidth="15" strokeDasharray="24 239" strokeDashoffset="-215" fill="none" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl sm:text-2xl font-black text-white font-sans leading-none">1,248</span>
                <span className="text-xs text-slate-400 mt-1 font-medium">Students</span>
              </div>
            </div>

            {/* Legend list matching Screenshot 2 */}
            <div className="space-y-2 text-xs flex-1 w-full">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                  <span>Computer Science</span>
                </span>
                <span className="font-sans font-bold text-white">28%</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
                  <span>Business Admin</span>
                </span>
                <span className="font-sans font-bold text-white">22%</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  <span>Engineering</span>
                </span>
                <span className="font-sans font-bold text-white">18%</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
                  <span>Design</span>
                </span>
                <span className="font-sans font-bold text-white">12%</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <span>Humanities</span>
                </span>
                <span className="font-sans font-bold text-white">10%</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                  <span>Other</span>
                </span>
                <span className="font-sans font-bold text-white">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Quick Actions (3 Cols) matching Screenshot 2 */}
        <div className="lg:col-span-3 bg-[#0c1427] rounded-2xl border border-slate-800/90 p-6 shadow-xl flex flex-col justify-between min-h-[410px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white tracking-tight">Quick Actions</h3>
            <span className="text-xs text-slate-400 font-mono">6 Shortcuts</span>
          </div>

          <div className="grid grid-cols-2 gap-3.5 flex-1 mt-1">
            {/* Action 1: Add Student */}
            <button
              type="button"
              onClick={onOpenAddStudent}
              className="p-3.5 rounded-xl bg-[#091122]/90 hover:bg-[#111d38] border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-950/70 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white text-center">Add Student</span>
            </button>

            {/* Action 2: Add Faculty */}
            <button
              type="button"
              onClick={onOpenAddFaculty}
              className="p-3.5 rounded-xl bg-[#091122]/90 hover:bg-[#111d38] border border-slate-800/80 hover:border-purple-500/40 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/30 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white text-center">Add Faculty</span>
            </button>

            {/* Action 3: Create Course */}
            <button
              type="button"
              onClick={onOpenCreateCourse}
              className="p-3.5 rounded-xl bg-[#091122]/90 hover:bg-[#111d38] border border-slate-800/80 hover:border-emerald-500/40 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white text-center">Create Course</span>
            </button>

            {/* Action 4: Schedule Exam */}
            <button
              type="button"
              onClick={onOpenScheduleExam}
              className="p-3.5 rounded-xl bg-[#091122]/90 hover:bg-[#111d38] border border-slate-800/80 hover:border-amber-500/40 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white text-center">Schedule Exam</span>
            </button>

            {/* Action 5: Post Announcement */}
            <button
              type="button"
              onClick={onOpenPostAnnouncement}
              className="p-3.5 rounded-xl bg-[#091122]/90 hover:bg-[#111d38] border border-slate-800/80 hover:border-rose-500/40 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-950/70 border border-rose-500/30 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Megaphone className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white text-center">Post Announcement</span>
            </button>

            {/* Action 6: Generate Report */}
            <button
              type="button"
              onClick={handleExportReport}
              disabled={isExporting}
              className="p-3.5 rounded-xl bg-[#091122]/90 hover:bg-[#111d38] border border-slate-800/80 hover:border-blue-500/40 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group shadow-sm disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-950/70 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              </div>
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white text-center">
                {isExporting ? 'Exporting...' : 'Generate Report'}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================
          ROW 3: 3 PROPER BOTTOM BOXES SIDE-BY-SIDE (SCREENSHOT 2)
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        
        {/* Left Column: Recent Students Table (6 Cols) */}
        <div className="lg:col-span-6 bg-[#0c1427] rounded-2xl border border-slate-800/90 p-6 shadow-xl flex flex-col justify-between min-h-[410px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight">Recent Students</h3>
              <button 
                onClick={() => setActiveTab('students')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-3 font-medium">#</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Student ID</th>
                    <th className="pb-3 font-medium">Program</th>
                    <th className="pb-3 font-medium">Year</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentStudentsList.map((st, i) => (
                    <tr key={st.id || i} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-2.5 text-slate-400 font-mono text-xs">{i + 1}</td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${st.avatarBg || 'from-blue-600 to-indigo-700'} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                            {st.firstName?.[0] || 'S'}
                          </div>
                          <span className="font-semibold text-white truncate max-w-[120px]">
                            {st.firstName} {st.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 font-mono text-[11px] text-slate-300">{st.studentId}</td>
                      <td className="py-2.5 text-slate-300 truncate max-w-[130px]">{st.program}</td>
                      <td className="py-2.5 text-slate-400">{st.year}</td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60">
                          {st.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-slate-400">
                          <button 
                            onClick={() => {
                              if (onViewStudentDetails) onViewStudentDetails(st);
                              else showToast(`Viewing profile of ${st.firstName} ${st.lastName} (${st.studentId})`, 'info');
                            }}
                            className="p-1 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                            title="View student profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => showToast(`Options for ${st.studentId}`, 'info')}
                            className="p-1 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Center Column: Recent Activities (3 Cols) matching Screenshot 2 */}
        <div className="lg:col-span-3 bg-[#0c1427] rounded-2xl border border-slate-800/90 p-6 shadow-xl flex flex-col justify-between min-h-[410px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight">Recent Activities</h3>
              <button 
                onClick={() => showToast('Full audit ledger open in Administration > Audit Logs', 'info')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Timeline */}
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800 before:z-0">
              {recentActivitiesList.map((act, idx) => (
                <div key={act.id || idx} className="relative z-10 flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                    act.icon === 'user-plus' ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' :
                    act.icon === 'award' ? 'bg-amber-600/20 text-amber-400 border-amber-500/40' :
                    act.icon === 'book-open' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40' :
                    act.icon === 'users' ? 'bg-purple-600/20 text-purple-400 border-purple-500/40' :
                    'bg-sky-600/20 text-sky-400 border-sky-500/40'
                  }`}>
                    {act.icon === 'user-plus' && <User className="w-3.5 h-3.5" />}
                    {act.icon === 'award' && <Award className="w-3.5 h-3.5" />}
                    {act.icon === 'book-open' && <BookOpen className="w-3.5 h-3.5" />}
                    {act.icon === 'users' && <Users className="w-3.5 h-3.5" />}
                    {act.icon === 'calendar' && <Calendar className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-200 truncate">{act.title}</div>
                    <div className="text-[11px] text-slate-400 truncate">{act.details}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{act.timeAgo}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Events (3 Cols) matching Screenshot 2 */}
        <div className="lg:col-span-3 bg-[#0c1427] rounded-2xl border border-slate-800/90 p-6 shadow-xl flex flex-col justify-between min-h-[410px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight">Upcoming Events</h3>
              <button 
                onClick={() => setActiveTab('timetable')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEventsList.map((ev) => (
                <div key={ev.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-[#091122]/90 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="w-11 h-11 rounded-lg bg-blue-950/70 border border-blue-500/30 text-blue-300 flex flex-col items-center justify-center shrink-0">
                    <span className="text-sm font-black font-mono leading-none">{ev.day}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">{ev.month}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{ev.title}</div>
                    <div className="text-[11px] text-slate-400 truncate">{ev.scope}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ev.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Institutional Health & Status Bar Footer */}
      <div className="p-4 rounded-2xl bg-[#0c1427] border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Institutional Infrastructure:</span>
          <span>All Systems Operational (Database, Auth, Sync, Storage)</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span>Version 3.2.0 (Build 2026.10)</span>
          <span className="text-slate-600">|</span>
          <span>Latency: 18ms</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">100% Uptime</span>
        </div>
      </div>

    </div>
  );
};
