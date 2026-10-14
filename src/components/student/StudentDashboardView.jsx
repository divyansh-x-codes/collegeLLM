import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  BookOpen, 
  Clock, 
  BarChart2, 
  FileText, 
  ChevronRight, 
  Calendar, 
  ArrowRight, 
  ChevronLeft, 
  GraduationCap, 
  Building, 
  Mail, 
  Camera, 
  IdCard, 
  Download, 
  Headphones, 
  Pin, 
  CheckCircle2, 
  Award, 
  Layers, 
  User, 
  Sparkles, 
  Upload, 
  HelpCircle,
  Megaphone,
  Check,
  TrendingUp,
  History,
  ShieldCheck,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { StudentIdCardModal } from './StudentIdCardModal.jsx';
import { StudentTranscriptRequestModal } from './StudentTranscriptRequestModal.jsx';
import { CourseRegistrationModal } from './CourseRegistrationModal.jsx';
import { ContactSupportModal } from './ContactSupportModal.jsx';

export const StudentDashboardView = () => {
  const { 
    currentStudent, 
    courses, 
    grades, 
    attendanceRecords, 
    setActiveTab, 
    setSelectedCourseId,
    setIsStudentPhotoModalOpen,
    announcements,
    assignments,
    showToast 
  } = useCollege();

  // Quick Action Modals state
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [isCourseRegOpen, setIsCourseRegOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Timetable pagination state
  const [timetableDayIndex, setTimetableDayIndex] = useState(0);
  const timetableDays = ['Monday, 13 Oct 2026', 'Tuesday, 14 Oct 2026', 'Wednesday, 15 Oct 2026'];

  // Fallback student profile matching Divyansh Chaudhary / Maya Lin
  const student = currentStudent || {
    id: 's-1',
    studentId: 'STU-2026-808',
    firstName: 'Divyansh',
    lastName: 'Chaudhary',
    email: 'wini.techx@gmail.com',
    program: 'B.Sc. Computer Science',
    department: 'Computer Science & Engineering',
    standing: '3rd Year · Semester 1',
    gpa: 3.88,
    attendanceRate: 95,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['c-1', 'c-2', 'c-3', 'c-4']
  };

  // Timetable list
  const todaysClasses = [
    {
      id: 'tt-1',
      time: '08:00 – 09:30',
      title: 'Data Structures and Algorithms',
      code: 'CS201',
      type: 'Lecture',
      room: 'Main Academic Building · Room 301',
      faculty: 'Prof. Sarah Wilson',
      status: 'Ongoing',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      id: 'tt-2',
      time: '10:00 – 11:30',
      title: 'Database Systems Architecture',
      code: 'CS203',
      type: 'Lecture',
      room: 'Main Academic Building · Room 205',
      faculty: 'Prof. Michael Chen',
      status: 'Next',
      statusColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
    },
    {
      id: 'tt-3',
      time: '01:00 – 02:30',
      title: 'Web Technologies & Cloud Lab',
      code: 'CS205',
      type: 'Lab',
      room: 'Turing Computer Lab 2',
      faculty: 'Prof. Emily Davis',
      status: 'Upcoming',
      statusColor: 'bg-slate-800 text-slate-400 border-slate-700'
    },
    {
      id: 'tt-4',
      time: '03:00 – 04:30',
      title: 'Software Engineering Principles',
      code: 'CS206',
      type: 'Tutorial',
      room: 'Engineering Complex · Room 102',
      faculty: 'Prof. David Kim',
      status: 'Upcoming',
      statusColor: 'bg-slate-800 text-slate-400 border-slate-700'
    }
  ];

  // Live Upcoming Deadlines from assignments
  const upcomingDeadlines = (assignments && assignments.length > 0)
    ? assignments.filter(a => a.status !== 'Graded').slice(0, 3).map((a, idx) => {
        const course = courses.find(c => c.id === a.courseId);
        const courseLabel = course ? `${course.code} ${course.title}` : (a.course || 'Core Course');
        const dayStr = a.deadline ? a.deadline.split('-')[2] || '15' : (15 + idx * 3).toString();
        const colors = [
          'bg-blue-600/30 text-blue-400 border-blue-500/40',
          'bg-purple-600/30 text-purple-400 border-purple-500/40',
          'bg-rose-600/30 text-rose-400 border-rose-500/40'
        ];
        return {
          id: a.id,
          day: dayStr,
          month: 'OCT',
          title: a.title,
          course: courseLabel,
          time: a.dueDate ? a.dueDate.split(',')[1]?.trim() || '11:59 PM' : '11:59 PM',
          color: colors[idx % colors.length]
        };
      })
    : [
        {
          id: 'dl-1',
          day: '15',
          month: 'OCT',
          title: 'Assignment 2: Cloud API Integration',
          course: 'Web Technologies (CS205)',
          time: '11:59 PM',
          color: 'bg-blue-600/30 text-blue-400 border-blue-500/40'
        },
        {
          id: 'dl-2',
          day: '18',
          month: 'OCT',
          title: 'Lab Report: SQL B-Tree Indices',
          course: 'Database Systems (CS203)',
          time: '11:59 PM',
          color: 'bg-purple-600/30 text-purple-400 border-purple-500/40'
        },
        {
          id: 'dl-3',
          day: '22',
          month: 'OCT',
          title: 'Project Proposal: Distributed Mesh',
          course: 'Software Engineering (CS206)',
          time: '11:59 PM',
          color: 'bg-rose-600/30 text-rose-400 border-rose-500/40'
        }
      ];

  // My Courses list
  const myCoursesList = [
    {
      id: 'c-1',
      code: 'CS201',
      title: 'Data Structures and Algorithms',
      faculty: 'Prof. Sarah Wilson',
      credits: 4,
      attendance: '96%',
      iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      id: 'c-2',
      code: 'CS203',
      title: 'Database Systems Architecture',
      faculty: 'Prof. Michael Chen',
      credits: 3,
      attendance: '94%',
      iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    {
      id: 'c-3',
      code: 'CS205',
      title: 'Web Technologies & Cloud Systems',
      faculty: 'Prof. Emily Davis',
      credits: 4,
      attendance: '98%',
      iconBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30'
    },
    {
      id: 'c-4',
      code: 'CS206',
      title: 'Software Engineering & Lifecycle',
      faculty: 'Prof. David Kim',
      credits: 3,
      attendance: '92%',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    }
  ];

  // Recent Grades
  const recentGradesList = [
    {
      id: 'rg-1',
      code: 'CS201',
      title: 'Data Structures and Algorithms',
      assessment: 'Mid Term Examination',
      grade: 'A',
      score: '92 / 100',
      gradeColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'rg-2',
      code: 'CS203',
      title: 'Database Systems Architecture',
      assessment: 'Assignment 1 (Normalization)',
      grade: 'A-',
      score: '88 / 100',
      gradeColor: 'text-emerald-400',
      iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    },
    {
      id: 'rg-3',
      code: 'CS205',
      title: 'Web Technologies & Cloud Systems',
      assessment: 'Lab Practical Report 1',
      grade: 'A',
      score: '94 / 100',
      gradeColor: 'text-emerald-400',
      iconBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30'
    },
    {
      id: 'rg-4',
      code: 'CS206',
      title: 'Software Engineering & Lifecycle',
      assessment: 'Architecture Design Quiz',
      grade: 'B+',
      score: '86 / 100',
      gradeColor: 'text-amber-400',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    }
  ];

  // Live Announcements from CollegeContext
  const studentAnnouncements = (announcements && announcements.length > 0)
    ? announcements.slice(0, 3).map((ann) => {
        const isHigh = ann.priority === 'high' || ann.priority === 'urgent' || ann.badge === 'High Priority';
        return {
          id: ann.id,
          title: ann.title,
          source: ann.department || ann.author || 'Academic Administration',
          time: ann.date || 'Recent',
          badge: isHigh ? 'High Priority' : 'Official',
          badgeColor: isHigh 
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40',
          icon: isHigh ? Pin : Sparkles
        };
      })
    : [
        {
          id: 'ann-1',
          title: 'Fall 2026 Mid-Term Examination Schedule Released',
          source: 'Office of the Controller of Examinations',
          time: '2 hours ago',
          badge: 'High Priority',
          badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
          icon: Pin
        },
        {
          id: 'ann-2',
          title: 'Digital Commons Extended 24/7 RFID Access',
          source: 'Turing Science Wing Library',
          time: '1 day ago',
          icon: BookOpen
        },
        {
          id: 'ann-3',
          title: 'ACM / IEEE Industrial Tech Summit Keynote',
          source: 'Computer Science Department',
          time: '2 days ago',
          icon: Sparkles
        }
      ];

  // Recent activities
  const recentActivities = [
    {
      id: 'act-1',
      title: 'Assignment Submitted',
      detail: 'Web Technologies (CS205)',
      time: '2 hours ago',
      icon: Upload,
      iconColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'act-2',
      title: 'Attendance Recorded',
      detail: 'Database Systems (CS203)',
      time: '5 hours ago',
      icon: Calendar,
      iconColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    },
    {
      id: 'act-3',
      title: 'Midterm Grade Published',
      detail: 'Data Structures (CS201)',
      time: '1 day ago',
      icon: FileText,
      iconColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
    },
    {
      id: 'act-4',
      title: 'Textbook Reserve Active',
      detail: 'Introduction to Algorithms (CLRS)',
      time: '2 days ago',
      icon: BookOpen,
      iconColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    }
  ];

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-7 text-slate-100 font-sans antialiased">
      
      {/* 1. TOP WELCOME HERO BANNER with smooth fade-in and subtle shimmer */}
      <div className="animate-fade-up stagger-1 relative rounded-3xl overflow-hidden border border-slate-800 bg-[#0c1427] p-6 sm:p-8 shadow-2xl flex flex-col justify-between min-h-[175px] group">
        {/* Subtle Campus Photography & Gradient Vignette */}
        <div 
          className="absolute inset-0 bg-cover bg-right opacity-30 mix-blend-luminosity pointer-events-none group-hover:scale-102 transition-transform duration-700 ease-out"
          style={{ backgroundImage: `url('/images/campus-hero.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-[#0b1328]/95 to-transparent pointer-events-none" />
        <div className="absolute inset-0 shimmer-overlay pointer-events-none opacity-40" />

        {/* Top Badges & Latin Motto */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <span>Good Afternoon,</span>
            <span className="text-white font-bold">{student.firstName} {student.lastName}</span>
            <span className="inline-block hover:rotate-12 transition-transform duration-200 cursor-default">👋</span>
          </div>

          <div className="flex flex-col items-end text-right gap-1.5 shrink-0">
            <div className="flex flex-col text-right">
              <span className="italic font-serif text-slate-300 text-xs tracking-wide">"In Veritate Unitas"</span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Unity College Est. 1892</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#05281e] text-emerald-300 border border-emerald-500/30 shadow-sm transition-all duration-300 hover:border-emerald-500/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AY 2026–2027 · Term Active
            </span>
          </div>
        </div>

        {/* Big Welcome Heading */}
        <div className="relative z-10 mt-4 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Welcome back, {student.firstName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            Stay on track with your studies, examine your class schedules, check assignment deadlines, and track your degree progress.
          </p>
        </div>
      </div>

      {/* 2. MASTER 12-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start">
        
        {/* =========================================================================
            LEFT COLUMN (8 of 12 cols in XL): Core Academic Flow
        ========================================================================= */}
        <div className="xl:col-span-8 2xl:col-span-9 space-y-7 min-w-0">
          
          {/* A. 4 KPI STATS CARDS with Stagger Animation and Micro-Hover Elevation */}
          <div className="animate-fade-up stagger-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* KPI 1: Enrolled Courses */}
            <div 
              onClick={() => setActiveTab('courses')}
              className="card-interactive btn-press p-3.5 sm:p-4 rounded-xl bg-[#0c1427] border border-slate-800 hover:border-indigo-500/60 transition-all duration-200 cursor-pointer group shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/25 transition-all duration-200 shadow-inner">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="w-6 h-6 rounded-md bg-slate-800/80 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-medium">Enrolled Courses</span>
                <div className="text-2xl font-extrabold font-mono text-white mt-0.5 group-hover:text-indigo-200 transition-colors">3</div>
                <div className="text-[10.5px] text-indigo-400 font-mono mt-0.5">13 Credit Hours</div>
              </div>
            </div>

            {/* KPI 2: Current GPA */}
            <div 
              onClick={() => setActiveTab('progress')}
              className="card-interactive btn-press p-3.5 sm:p-4 rounded-xl bg-[#0c1427] border border-slate-800 hover:border-teal-500/60 transition-all duration-200 cursor-pointer group shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-500/25 transition-all duration-200 shadow-inner">
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                </div>
                <div className="w-6 h-6 rounded-md bg-slate-800/80 group-hover:bg-teal-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Sparkline decoration with smooth glow on hover */}
              <div className="absolute right-0 bottom-1.5 w-24 h-9 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <svg viewBox="0 0 100 40" className="w-full h-full stroke-teal-400 fill-none" strokeWidth="2.5">
                  <path d="M0,32 Q25,36 50,22 T80,14 T100,6" />
                </svg>
              </div>

              <div className="relative z-10">
                <span className="text-[11px] text-slate-400 font-medium">Cumulative GPA</span>
                <div className="text-2xl font-extrabold font-mono text-white mt-0.5 group-hover:text-teal-200 transition-colors">3.88</div>
                <div className="text-[10.5px] text-teal-400 font-mono mt-0.5">Out of 4.00 · Top Decile</div>
              </div>
            </div>

            {/* KPI 3: Attendance */}
            <div 
              onClick={() => setActiveTab('attendance')}
              className="card-interactive btn-press p-3.5 sm:p-4 rounded-xl bg-[#0c1427] border border-slate-800 hover:border-blue-500/60 transition-all duration-200 cursor-pointer group shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/25 transition-all duration-200 shadow-inner">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div className="w-6 h-6 rounded-md bg-slate-800/80 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-medium">Term Attendance</span>
                <div className="text-2xl font-extrabold font-mono text-white mt-0.5 group-hover:text-blue-200 transition-colors">95%</div>
                <div className="text-[10.5px] text-emerald-400 font-mono mt-0.5">↑ +4% vs last month</div>
              </div>
            </div>

            {/* KPI 4: Pending Assignments */}
            <div 
              onClick={() => setActiveTab('assignments')}
              className="card-interactive btn-press p-3.5 sm:p-4 rounded-xl bg-[#0c1427] border border-slate-800 hover:border-amber-500/60 transition-all duration-200 cursor-pointer group shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/25 transition-all duration-200 shadow-inner">
                  <FileText className="w-4 h-4 text-amber-400" />
                </div>
                <div className="w-6 h-6 rounded-md bg-slate-800/80 group-hover:bg-amber-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Sparkline decoration with smooth glow on hover */}
              <div className="absolute right-0 bottom-1.5 w-24 h-9 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <svg viewBox="0 0 100 40" className="w-full h-full stroke-amber-400 fill-none" strokeWidth="2.5">
                  <path d="M0,28 Q25,38 50,20 T80,10 T100,24" />
                </svg>
              </div>

              <div className="relative z-10">
                <span className="text-[11px] text-slate-400 font-medium">Pending Assignments</span>
                <div className="text-2xl font-extrabold font-mono text-white mt-0.5 group-hover:text-amber-200 transition-colors">
                  {assignments ? assignments.filter(a => a.status !== 'Graded').length : 3}
                </div>
                <div className="text-[10.5px] text-amber-400 font-mono mt-0.5">Due This Month</div>
              </div>
            </div>

          </div>

          {/* B. ROW 2: TODAY'S TIMETABLE & ACADEMIC PROGRESS (Equal Width Boxes) */}
          <div className="animate-fade-up stagger-3 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* Box 1: Today's Timetable */}
            <div className="card-interactive p-6 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-sm font-bold text-white tracking-wide">Today's Class Schedule</h2>
                </div>
                
                {/* Day Switcher Controls */}
                <div className="flex items-center gap-1.5 bg-[#080d1b] px-2 py-1 rounded-xl border border-slate-800">
                  <span className="text-xs font-mono text-slate-300">{timetableDays[timetableDayIndex]}</span>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setTimetableDayIndex((prev) => (prev > 0 ? prev - 1 : 2))}
                      className="btn-press p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
                      title="Previous Day"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setTimetableDayIndex((prev) => (prev < 2 ? prev + 1 : 0))}
                      className="btn-press p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
                      title="Next Day"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Class Schedule Items */}
              <div className="space-y-3">
                {todaysClasses.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#080d1b] border border-slate-800/80 hover:border-indigo-500/50 hover:bg-[#0c1427] hover:translate-x-1 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div className="font-mono text-xs text-slate-400 shrink-0 font-semibold w-28 group-hover:text-indigo-300 transition-colors">
                        {item.time}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs truncate group-hover:text-indigo-200 transition-colors">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold shrink-0">
                            {item.code}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{item.type}</span>
                          <span>·</span>
                          <span className="truncate">{item.room}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border self-start sm:self-center shrink-0 transition-transform duration-200 group-hover:scale-105 flex items-center gap-1.5 ${item.statusColor}`}>
                      {item.status === 'Ongoing' && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px]">All slots verified by Academic Registrar</span>
                <button
                  onClick={() => setActiveTab('timetable')}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer group transition-colors"
                >
                  <span>Full Weekly Schedule</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Box 2: Academic Progress & Degree Audit */}
            <div className="card-interactive p-6 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <BarChart2 className="w-4 h-4 text-teal-400" />
                  <h2 className="text-sm font-bold text-white tracking-wide">Degree Progress &amp; Audit</h2>
                </div>
                <button
                  onClick={() => setActiveTab('progress')}
                  className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer group transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Progress Ring & Breakdown */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 my-auto">
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="#1e293b" strokeWidth="8" fill="none" />
                    <circle 
                      cx="50" cy="50" r="38" 
                      stroke="#06b6d4" 
                      strokeWidth="8" 
                      strokeDasharray="238.76" 
                      strokeDashoffset={238.76 * (1 - 0.68)} 
                      strokeLinecap="round"
                      fill="none" 
                    />
                    <circle 
                      cx="50" cy="50" r="38" 
                      stroke="#8b5cf6" 
                      strokeWidth="8" 
                      strokeDasharray="238.76" 
                      strokeDashoffset={238.76 * (1 - 0.22)} 
                      transform="rotate(244 50 50)"
                      strokeLinecap="round"
                      fill="none" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-extrabold text-white font-mono">68%</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Completed</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 min-w-0 w-full sm:w-auto">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Current Academic Standing</span>
                    <div className="text-sm font-bold text-white mt-0.5">3rd Year · Semester 1</div>
                  </div>

                  <div className="space-y-2 pt-1 font-mono text-xs">
                    <div className="flex items-center justify-between gap-3 text-slate-300">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                        <span>Completed Credits</span>
                      </span>
                      <span className="font-bold text-white">68% (82 Credits)</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-slate-300">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                        <span>In Progress Term</span>
                      </span>
                      <span className="font-bold text-white">22% (26 Credits)</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-slate-300">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                        <span>Remaining to Graduate</span>
                      </span>
                      <span className="font-bold text-slate-400">10% (12 Credits)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Credits Meter Bar */}
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-400">Degree Credits Status</span>
                  <span className="font-bold text-white">82 / 120 Total Credits</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#080d1b] overflow-hidden border border-slate-800">
                  <div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 rounded-full" style={{ width: '68%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                    Expected Graduation: <strong className="text-slate-200">May 2028</strong>
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">First Class Standing</span>
                </div>
              </div>
            </div>

          </div>

          {/* C. ROW 3: MY COURSES & RECENT GRADES (Equal Width Boxes) */}
          <div className="animate-fade-up stagger-4 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* Box 3: Enrolled Courses */}
            <div className="card-interactive p-6 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-sm font-bold text-white tracking-wide">Enrolled Courses (Semester 5)</h2>
                </div>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer group transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="space-y-2.5">
                {myCoursesList.map((c) => (
                  <div 
                    key={c.id}
                    onClick={() => {
                      setSelectedCourseId(c.id);
                      setActiveTab('courses');
                    }}
                    className="p-3 rounded-xl bg-[#080d1b] border border-slate-800/80 hover:border-indigo-500/50 hover:bg-[#0c1427] hover:translate-x-1 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs border shrink-0 transition-transform duration-200 group-hover:scale-105 ${c.iconBg}`}>
                        {c.code}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                          {c.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{c.faculty}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 shrink-0">
                      <span className="hidden sm:inline px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-300">{c.attendance}</span>
                      <span>{c.credits} Crd</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between font-mono">
                <span>Total Enrolled Credits</span>
                <span className="font-bold text-indigo-400">14 Credit Units</span>
              </div>
            </div>

            {/* Box 4: Recent Published Grades */}
            <div className="card-interactive p-6 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-purple-400" />
                  <h2 className="text-sm font-bold text-white tracking-wide">Recent Published Grades</h2>
                </div>
                <button
                  onClick={() => setActiveTab('grading')}
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer group transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="space-y-2.5">
                {recentGradesList.map((g) => (
                  <div 
                    key={g.id}
                    onClick={() => setActiveTab('grading')}
                    className="p-3 rounded-xl bg-[#080d1b] border border-slate-800/80 hover:border-purple-500/50 hover:bg-[#0c1427] hover:translate-x-1 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs border shrink-0 transition-transform duration-200 group-hover:scale-105 ${g.iconBg}`}>
                        {g.code}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                          {g.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{g.assessment}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 text-right">
                      <div>
                        <div className={`text-xs font-bold font-mono ${g.gradeColor}`}>{g.grade}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{g.score}</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between font-mono">
                <span>Official Assessment Ledger</span>
                <span className="text-emerald-400 font-bold">Verified ✓</span>
              </div>
            </div>

          </div>

          {/* D. ROW 4: RECENT ACADEMIC ACTIVITY LOG */}
          <div className="animate-fade-up stagger-5 card-interactive p-6 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-white tracking-wide">Recent Academic Activity</h2>
              </div>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Campus Ledger
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {recentActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div 
                    key={act.id}
                    className="p-3.5 rounded-xl bg-[#080d1b] border border-slate-800/80 hover:border-slate-700 hover:bg-[#0c1427] hover:-translate-y-0.5 flex items-center gap-3 transition-all duration-200 group cursor-default"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${act.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate group-hover:text-indigo-200 transition-colors">{act.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{act.detail}</div>
                      <div className="text-[9px] text-slate-500 font-mono mt-0.5">{act.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN (4 of 12 cols in XL): Aligned Profile, Deadlines & Services
        ========================================================================= */}
        <div className="animate-fade-up stagger-3 xl:col-span-4 2xl:col-span-3 space-y-7 min-w-0">
          
          {/* Box 5: My Student Profile */}
          <div className="card-interactive p-6 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">My Profile</span>
              </div>
              <button
                onClick={() => setActiveTab('profile')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-3.5 my-1">
              <div 
                onClick={() => setIsStudentPhotoModalOpen(true)}
                className="relative cursor-pointer group shrink-0"
                title="Click to change student picture"
              >
                {student.avatarUrl ? (
                  <img
                    src={student.avatarUrl}
                    alt={student.firstName}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500 shadow-md group-hover:scale-105 transition-all"
                  />
                ) : (
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${student.avatarBg || 'from-indigo-600 to-purple-700'} text-white flex items-center justify-center font-bold text-xl ring-2 ring-indigo-500 shadow-md`}>
                    {student.firstName[0]}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center ring-1 ring-slate-700 group-hover:bg-indigo-600 transition-colors">
                  <Camera className="w-2.5 h-2.5 text-indigo-200" />
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-white text-base truncate leading-tight">
                  {student.firstName} {student.lastName}
                </h3>
                <div className="flex items-center gap-2 mt-1 font-mono text-[11px]">
                  <span className="text-slate-400">{student.studentId || 'STU-2026-808'}</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Academic metadata list */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">{student.program || 'B.Sc. Computer Science'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>3rd Year · Semester 1</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">{student.department || 'Computer Science & Engineering'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate text-slate-400 font-mono text-[11px]">{student.email}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsIdCardOpen(true)}
                className="btn-press w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all text-xs font-semibold cursor-pointer shadow-sm hover:shadow-indigo-600/25"
              >
                <IdCard className="w-3.5 h-3.5" />
                <span>View Collegiate ID Pass</span>
              </button>
            </div>
          </div>

          {/* Box 6: Upcoming Deadlines & Tasks */}
          <div className="card-interactive p-6 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white tracking-wide">Upcoming Deadlines</h2>
              </div>
              <button
                onClick={() => setActiveTab('assignments')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer group transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.map((dl) => (
                <div 
                  key={dl.id}
                  onClick={() => setActiveTab('assignments')}
                  className="p-3 rounded-xl bg-[#080d1b] border border-slate-800/80 hover:border-blue-500/50 hover:bg-[#0c1427] hover:translate-x-1 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-mono font-bold leading-none border shrink-0 transition-transform duration-200 group-hover:scale-105 ${dl.color}`}>
                      <span className="text-xs">{dl.day}</span>
                      <span className="text-[9px] uppercase mt-0.5">{dl.month}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                        {dl.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{dl.course}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{dl.time}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Canvas Submission Portal</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Open
              </span>
            </div>
          </div>

          {/* Box 7: Campus Bulletins */}
          <div className="card-interactive p-6 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white tracking-wide">Campus Bulletins</h2>
              </div>
              <button
                onClick={() => setActiveTab('announcements')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {studentAnnouncements.map((ann) => {
                const Icon = ann.icon;
                return (
                  <div 
                    key={ann.id}
                    onClick={() => setActiveTab('announcements')}
                    className="p-3 rounded-xl bg-[#080d1b] border border-slate-800 hover:border-slate-700 flex items-start gap-3 cursor-pointer transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white leading-snug group-hover:text-amber-300 transition-colors">
                        {ann.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">
                        {ann.source} · {ann.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Box 8: Quick Action Shortcuts */}
          <div className="p-6 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h2 className="text-sm font-bold text-white tracking-wide">Student Services Hub</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsIdCardOpen(true)}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#080d1b] border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-950/20 text-center transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <IdCard className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-white group-hover:text-indigo-300 leading-tight">
                  Student ID
                </span>
              </button>

              <button
                onClick={() => setIsTranscriptOpen(true)}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#080d1b] border border-slate-800 hover:border-amber-500/50 hover:bg-amber-950/20 text-center transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-white group-hover:text-amber-300 leading-tight">
                  Transcripts
                </span>
              </button>

              <button
                onClick={() => setIsCourseRegOpen(true)}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#080d1b] border border-slate-800 hover:border-teal-500/50 hover:bg-teal-950/20 text-center transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-white group-hover:text-teal-300 leading-tight">
                  Course Reg
                </span>
              </button>

              <button
                onClick={() => setIsSupportOpen(true)}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#080d1b] border border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/20 text-center transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <Headphones className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-white group-hover:text-purple-300 leading-tight">
                  Help Desk
                </span>
              </button>
            </div>

            <div className="text-[10px] text-slate-500 font-mono text-center">
              Campus Support Desk: Available 24/7
            </div>
          </div>

        </div>

      </div>

      {/* QUICK ACTION MODALS */}
      <StudentIdCardModal
        student={student}
        isOpen={isIdCardOpen}
        onClose={() => setIsIdCardOpen(false)}
      />

      <StudentTranscriptRequestModal
        student={student}
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
      />

      <CourseRegistrationModal
        student={student}
        isOpen={isCourseRegOpen}
        onClose={() => setIsCourseRegOpen(false)}
      />

      <ContactSupportModal
        student={student}
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
};
