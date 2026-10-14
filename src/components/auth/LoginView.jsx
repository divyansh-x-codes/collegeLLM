import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import {
  School,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Calendar,
  BookOpen,
  Radio,
  FileSpreadsheet,
  HelpCircle,
  X,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Users,
  User,
  Lock,
  Mail,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const LoginView = () => {
  const {
    students,
    staff,
    loginAsStudent,
    loginStaffCredentials,
    loginWithGoogle,
    showToast,
    setActiveTab
  } = useCollege();

  // Student Form State (Empty by default)
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [studentRemember, setStudentRemember] = useState(true);
  const [isStudentSubmitting, setIsStudentSubmitting] = useState(false);
  const [isStudentGoogleLoading, setIsStudentGoogleLoading] = useState(false);

  // Faculty / Admin Form State (Empty by default)
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyPassword, setFacultyPassword] = useState('');
  const [showFacultyPassword, setShowFacultyPassword] = useState(false);
  const [facultyRemember, setFacultyRemember] = useState(true);
  const [isFacultySubmitting, setIsFacultySubmitting] = useState(false);
  const [isFacultyGoogleLoading, setIsFacultyGoogleLoading] = useState(false);

  // Modals & Navigation dropdowns
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotModalType, setForgotModalType] = useState('student');
  const [activeNavDropdown, setActiveNavDropdown] = useState(null);

  // Handle Student Credentials Login
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!studentIdentifier.trim()) {
      showToast('Please enter your Student ID or College Email.', 'error');
      return;
    }
    setIsStudentSubmitting(true);
    setTimeout(() => {
      const ok = loginAsStudent(studentIdentifier);
      if (!ok) setIsStudentSubmitting(false);
    }, 250);
  };

  // Handle Student Google Sign In - Real Firebase Google OAuth
  const handleStudentGoogleAuth = async () => {
    setIsStudentGoogleLoading(true);
    try {
      const res = await loginWithGoogle({ targetPortal: 'student' });
      if (!res.success && res.error?.code !== 'auth/popup-closed-by-user') {
        showToast('Google Sign-In was cancelled or incomplete. Please sign in with your Google account.', 'error');
      }
    } catch (err) {
      console.error('Student Google Auth error:', err);
      showToast('Google authentication failed. Please try again.', 'error');
    } finally {
      setIsStudentGoogleLoading(false);
    }
  };

  // Handle Faculty Credentials Login
  const handleFacultySubmit = (e) => {
    e.preventDefault();
    if (!facultyEmail.trim()) {
      showToast('Please enter your Faculty College Email.', 'error');
      return;
    }
    setIsFacultySubmitting(true);
    setTimeout(() => {
      const ok = loginStaffCredentials(facultyEmail, facultyPassword);
      if (!ok) setIsFacultySubmitting(false);
    }, 250);
  };

  // Handle Faculty Google Sign In - Real Firebase Google OAuth
  const handleFacultyGoogleAuth = async () => {
    setIsFacultyGoogleLoading(true);
    try {
      const res = await loginWithGoogle({ targetPortal: 'admin' });
      if (!res.success && res.error?.code !== 'auth/popup-closed-by-user' && !res.unauthorized) {
        showToast('Google Sign-In was cancelled or incomplete. Please sign in with your Google account.', 'error');
      }
    } catch (err) {
      console.error('Faculty Google Auth error:', err);
      showToast('Google authentication failed. Please try again.', 'error');
    } finally {
      setIsFacultyGoogleLoading(false);
    }
  };

  // Feature cards and nav notice
  const handleFeatureNav = (featureName) => {
    document.getElementById('portal-section')?.scrollIntoView({ behavior: 'smooth' });
    showToast(`Authentication Required: Please sign in to access ${featureName || 'the portal'}.`, 'warning');
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-[#070b14] text-slate-100 flex flex-col justify-between antialiased font-sans selection:bg-indigo-500 selection:text-white relative select-none">

      {/* College Campus Architecture Background — Shifted to the side to showcase architecture */}
      <div
        className="fixed -inset-x-12 inset-y-0 z-0 bg-cover bg-no-repeat pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `url('/images/campus-hero-clean.jpg')`,
          opacity: 0.90,
          backgroundPosition: '38% 45%',
          transform: 'scale(1.06) translateX(3.5%)'
        }}
      />

      {/* Atmospheric Contrast Scrim: Exact matching master gradient with clear illuminated center */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(3, 10, 28, 0.82) 0%, rgba(4, 14, 35, 0.35) 43%, rgba(3, 10, 28, 0.78) 100%)'
        }}
      />
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(3, 10, 28, 0.70) 0%, transparent 40%, rgba(3, 10, 28, 0.82) 100%)'
        }}
      />

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-20 border-b border-slate-800/60 bg-[#070b14]/80 backdrop-blur-md px-4 sm:px-6 py-2 flex items-center justify-between shrink-0">

        {/* Left Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30 ring-1 ring-white/20 shrink-0">
            <School className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-black tracking-tight text-white block leading-tight">
              Unity College
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-300 block font-normal tracking-wide">
              Student Information System &amp; Academic Gateway
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-slate-300">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/70 text-white border border-blue-400/30 shadow-sm font-semibold"
          >
            <School className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveNavDropdown(activeNavDropdown === 'academics' ? null : 'academics')}
              className="flex items-center gap-1 px-3 py-1 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors"
            >
              <span>Academics</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {activeNavDropdown === 'academics' && (
              <div className="absolute top-full left-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-800 p-1.5 shadow-2xl z-50 animate-in fade-in">
                <button onClick={() => handleFeatureNav('Course Catalog')} className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white">Course Catalog</button>
                <button onClick={() => handleFeatureNav('Curriculum & Grading')} className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white">Curriculum &amp; Grading</button>
                <button onClick={() => handleFeatureNav('Study Materials')} className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white">Study Materials</button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleFeatureNav('Examinations & Schedules')}
            className="flex items-center gap-1 px-3 py-1 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Examinations</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => handleFeatureNav('Student Services')}
            className="flex items-center gap-1 px-3 py-1 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Student Services</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => handleFeatureNav('Academic Resources')}
            className="flex items-center gap-1 px-3 py-1 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Resources</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => { setIsForgotModalOpen(true); setForgotModalType('student'); }}
            className="flex items-center gap-1 px-3 py-1 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Support</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </nav>

        {/* Right Status Badge & Theme */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full p-0.5 text-slate-400">
            <button
              type="button"
              onClick={() => showToast('Light preview mode active', 'info')}
              className="p-1 rounded-full text-amber-400 hover:text-amber-300 transition-colors"
              title="Light theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => showToast('Dark nocturnal mode locked for maximum eye comfort', 'info')}
              className="p-1 rounded-full text-indigo-400"
              title="Dark theme active"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-800/70 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AY 2026–2027 · Term Active</span>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT: SPLIT HERO + CHOOSE YOUR PORTAL */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-12 py-2 max-w-[1750px] 2xl:max-w-[1850px] mx-auto w-full my-auto overflow-hidden">
        <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-7 xl:gap-8 2xl:gap-10 items-center">

          {/* LEFT COLUMN: College Overview & Feature Showcase Cards (5 Cols) */}
          <div className="xl:col-span-5 space-y-3.5 text-left relative">

            {/* Top Official Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#091122]/95 border border-indigo-500/60 text-indigo-200 text-xs font-semibold shadow-md shadow-black/40 backdrop-blur-md">
              <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Official Student Computing Network</span>
            </div>

            {/* Main Welcome Title */}
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] 2xl:text-[48px] font-black text-white tracking-tight leading-[1.08] drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)]">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                  Unity College
                </span>
              </h1>
              <p className="text-xs sm:text-sm 2xl:text-[15px] text-slate-100 leading-snug font-medium pt-0.5 max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                Your complete academic ecosystem — access your courses, timetable, attendance, grades, and more, all in one place.
              </p>
            </div>

            {/* Stats Row (4 stats in 1 clean row) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-0.5">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#091122]/92 border border-slate-700/80 backdrop-blur-2xl shadow-md shadow-black/40">
                <div className="w-8.5 h-8.5 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-white font-mono leading-none">10K+</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-200 font-medium leading-none mt-1">Students</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#091122]/92 border border-slate-700/80 backdrop-blur-2xl shadow-md shadow-black/40">
                <div className="w-8.5 h-8.5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-white font-mono leading-none">200+</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-200 font-medium leading-none mt-1">Courses</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#091122]/92 border border-slate-700/80 backdrop-blur-2xl shadow-md shadow-black/40">
                <div className="w-8.5 h-8.5 rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-white font-mono leading-none">50+</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-200 font-medium leading-none mt-1">Faculty Members</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#091122]/92 border border-slate-700/80 backdrop-blur-2xl shadow-md shadow-black/40">
                <div className="w-8.5 h-8.5 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-white font-mono leading-none">100%</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-200 font-medium leading-none mt-1">Secure &amp; Trusted</div>
                </div>
              </div>
            </div>

            {/* 4 Feature Showcase Cards (2x2 grid) with Side-Aligned Icons & Circle Arrows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">

              {/* Card 1: Class Timetable */}
              <div
                onClick={() => handleFeatureNav('Class Timetable')}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-[#091122]/92 border border-slate-700/80 backdrop-blur-2xl shadow-md shadow-black/40 transition-all hover:border-indigo-500/70 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-1">
                  <div className="w-10.5 h-10.5 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/30">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-bold text-white leading-tight">
                      Class Timetable
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 leading-snug">
                      View personalized lecture hours, hall directions and faculty listings.
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-blue-600/25 border border-blue-500/30 text-blue-300 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 2: Course Catalog */}
              <div
                onClick={() => handleFeatureNav('Course Catalog')}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-[#091122]/92 border border-slate-700/80 backdrop-blur-2xl shadow-md shadow-black/40 transition-all hover:border-blue-500/70 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-1">
                  <div className="w-10.5 h-10.5 rounded-xl bg-gradient-to-br from-blue-500 to-sky-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-bold text-white leading-tight">
                      Course Catalog
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 leading-snug">
                      Browse curricula, elective offerings, credits and syllabus details.
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-blue-600/25 border border-blue-500/30 text-blue-300 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 3: Live Attendance */}
              <div
                onClick={() => handleFeatureNav('Live Attendance')}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-[#091122]/92 border border-slate-700/80 backdrop-blur-2xl shadow-md shadow-black/40 transition-all hover:border-emerald-500/70 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-1">
                  <div className="w-10.5 h-10.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-bold text-white leading-tight">
                      Live Attendance
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 leading-snug">
                      Self-service QR check-in and automated attendance verification.
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-blue-600/25 border border-blue-500/30 text-blue-300 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 4: Gradebook & GPA */}
              <div
                onClick={() => handleFeatureNav('Gradebook & GPA')}
                className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-[#091122]/92 border border-slate-700/80 backdrop-blur-2xl shadow-md shadow-black/40 transition-all hover:border-amber-500/70 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-1">
                  <div className="w-10.5 h-10.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-600/30">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-bold text-white leading-tight">
                      Gradebook &amp; GPA
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 leading-snug">
                      Real-time marks, course weights and official transcript records.
                    </p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-blue-600/25 border border-blue-500/30 text-blue-300 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Bottom Promo Banner Card */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900/92 to-blue-950/90 border border-indigo-700/50 backdrop-blur-2xl flex items-center justify-between gap-3.5 shadow-xl">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-indigo-500/40 bg-slate-900 shadow-sm">
                  <img
                    src="/images/mobile-app-mockup.jpg"
                    alt="Student Mobile App"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Everything you need for your academic journey
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 hidden sm:block">
                    Stay organized, informed and connected — anytime, anywhere.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[10px] sm:text-[11px] text-slate-200 font-medium">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Real-time Updates</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Mobile Friendly</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Secure Access</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleFeatureNav('Mobile Ecosystem')}
                className="btn-press px-4.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-600/30 shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Explore Features</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: "Choose Your Portal" with 2 Portal Cards (7 Cols) */}
          <div id="portal-section" className="xl:col-span-7 space-y-2.5 scroll-mt-4">

            {/* Header: Choose Your Portal */}
            <div className="w-full flex flex-col items-center justify-center text-center pb-0.5">
              <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-black text-white tracking-tight drop-shadow-md text-center">
                Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-purple-400">Your Portal</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium drop-shadow text-center max-w-md mx-auto mt-0.5">
                Secure access for students, faculty and administrators
              </p>
            </div>

            {/* TWO PORTAL CARDS SIDE BY SIDE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-4.5 items-stretch">

              {/* =========================================
                  PORTAL CARD 1: STUDENT PORTAL
              ========================================= */}
              <div className="bg-[#091122]/92 rounded-2xl border border-indigo-500/40 shadow-2xl p-4.5 sm:p-5 backdrop-blur-2xl relative flex flex-col justify-between ring-1 ring-white/10 hover:border-blue-500/70 transition-all">
                <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

                <div>
                  {/* Card Header: Centered Icon + Title */}
                  <div className="flex flex-col items-center text-center pb-1.5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/25 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-md mb-1.5 shrink-0">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">Student Portal</h3>
                    <p className="text-xs text-slate-300">Access your academic dashboard</p>
                  </div>

                  {/* Checklist: 4 Vertical Stacked Items with CheckCircle2 */}
                  <div className="space-y-1.5 py-1.5 text-xs sm:text-[13px] text-slate-200 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>View timetable &amp; attendance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Access courses &amp; resources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Check grades &amp; transcripts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Submit assignments &amp; forms</span>
                    </div>
                  </div>

                  {/* Google Sign In Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleStudentGoogleAuth}
                      disabled={isStudentGoogleLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-between shadow-md transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        {isStudentGoogleLoading ? (
                          <Loader2 className="w-4.5 h-4.5 text-blue-600 animate-spin" />
                        ) : (
                          <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                        )}
                        <span>{isStudentGoogleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center my-2.5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700/80" />
                    </div>
                    <span className="relative px-2.5 bg-[#091122] text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                      OR SIGN IN WITH STUDENT ID
                    </span>
                  </div>

                  {/* Student Form */}
                  <form onSubmit={handleStudentSubmit} className="space-y-2">
                    <div>
                      <div className="relative">
                        <div className="absolute left-3.5 top-2.5 text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={studentIdentifier}
                          onChange={(e) => setStudentIdentifier(e.target.value)}
                          placeholder="Student ID or College Email"
                          required
                          className="w-full pl-10 pr-20 py-2.5 bg-slate-950/85 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-blue-500/60 transition-all"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-400">
                          STU-YYYY-XXX
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <div className="absolute left-3.5 top-2.5 text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showStudentPassword ? 'text' : 'password'}
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          placeholder="Password"
                          required
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-950/85 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-blue-500/60 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowStudentPassword(!showStudentPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {showStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300 pt-0.5">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={studentRemember}
                          onChange={(e) => setStudentRemember(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                        />
                        <span>Keep me signed in on this device</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => { setIsForgotModalOpen(true); setForgotModalType('student'); }}
                        className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isStudentSubmitting}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <span>{isStudentSubmitting ? 'Authenticating...' : 'Sign In'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="text-center pt-1.5">
                    <button
                      type="button"
                      onClick={() => { setIsForgotModalOpen(true); setForgotModalType('student'); }}
                      className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      New Student? Contact Administration
                    </button>
                  </div>
                </div>

                {/* Demo Student Accounts Card */}
                <div className="pt-2.5 mt-1 border-t border-slate-800/80">
                  <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold mb-1">
                    Demo Student Accounts (for testing)
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentIdentifier('STU-2024-001');
                      setStudentPassword('student123');
                      showToast('Maya Lin (STU-2024-001) credentials loaded.', 'info');
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7.5 h-7.5 rounded-full bg-blue-600/30 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                        M
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-[13px] font-bold text-white group-hover:text-blue-300 truncate">
                          Maya Lin
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">
                          STU-2024-001
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs sm:text-[13px] font-mono font-bold text-emerald-400">3.88 GPA</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                </div>
              </div>


              {/* =========================================
                  PORTAL CARD 2: ADMIN / FACULTY PORTAL
              ========================================= */}
              <div className="bg-[#06151c]/92 rounded-2xl border border-emerald-500/40 shadow-2xl p-4.5 sm:p-5 backdrop-blur-2xl relative flex flex-col justify-between ring-1 ring-emerald-500/20 hover:border-emerald-400/70 transition-all">
                <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

                <div>
                  {/* Card Header: Centered Icon + Title */}
                  <div className="flex flex-col items-center text-center pb-1.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600/25 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-md mb-1.5 shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">Admin / Faculty Portal</h3>
                    <p className="text-xs text-slate-300">For faculty members and administrators</p>
                  </div>

                  {/* Checklist: 4 Vertical Stacked Items with CheckCircle2 */}
                  <div className="space-y-1.5 py-1.5 text-xs sm:text-[13px] text-slate-200 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Manage student records</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>View faculty dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Access administrative tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Generate reports &amp; analytics</span>
                    </div>
                  </div>

                  {/* Google Sign In Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleFacultyGoogleAuth}
                      disabled={isFacultyGoogleLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-between shadow-md transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        {isFacultyGoogleLoading ? (
                          <Loader2 className="w-4.5 h-4.5 text-emerald-600 animate-spin" />
                        ) : (
                          <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                        )}
                        <span>{isFacultyGoogleLoading ? 'Verifying...' : 'Continue with Google'}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center my-2.5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700/80" />
                    </div>
                    <span className="relative px-2.5 bg-[#06151c] text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                      OR SIGN IN WITH COLLEGE EMAIL
                    </span>
                  </div>

                  {/* Faculty Form */}
                  <form onSubmit={handleFacultySubmit} className="space-y-2">
                    <div>
                      <div className="relative">
                        <div className="absolute left-3.5 top-2.5 text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          value={facultyEmail}
                          onChange={(e) => setFacultyEmail(e.target.value)}
                          placeholder="College Email"
                          required
                          className="w-full pl-10 pr-20 py-2.5 bg-slate-950/85 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-emerald-500/60 transition-all"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-400">
                          faculty@unity.edu
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <div className="absolute left-3.5 top-2.5 text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showFacultyPassword ? 'text' : 'password'}
                          value={facultyPassword}
                          onChange={(e) => setFacultyPassword(e.target.value)}
                          placeholder="Password"
                          required
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-950/85 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-emerald-500/60 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowFacultyPassword(!showFacultyPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          {showFacultyPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300 pt-0.5">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={facultyRemember}
                          onChange={(e) => setFacultyRemember(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                        />
                        <span>Keep me signed in on this device</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => { setIsForgotModalOpen(true); setForgotModalType('faculty'); }}
                        className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isFacultySubmitting}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#00a86b] hover:bg-[#00925d] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <span>{isFacultySubmitting ? 'Authenticating...' : 'Sign In'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="text-center pt-1.5">
                    <span className="text-xs text-slate-400">
                      Authorized Faculty &amp; Staff Only
                    </span>
                  </div>
                </div>

                {/* Demo Faculty Accounts Card */}
                <div className="pt-2.5 mt-1 border-t border-slate-800/80">
                  <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold mb-1">
                    Demo Faculty Accounts (for testing)
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFacultyEmail('simplydivyanshk@gmail.com');
                      setFacultyPassword('faculty123');
                      showToast('Prof. James Carter (simplydivyanshk@gmail.com) loaded.', 'info');
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7.5 h-7.5 rounded-full bg-emerald-600/30 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                        A
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-[13px] font-bold text-white group-hover:text-emerald-300 truncate">
                          Prof. James Carter
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">
                          faculty@unity.edu
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs sm:text-[13px] text-slate-400">Professor</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md px-4 sm:px-6 py-2 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 gap-2 shrink-0">

        {/* Left Links */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-[11px] text-slate-400">
          <span>&copy; 2026 Unity College. All rights reserved.</span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <button
            type="button"
            onClick={() => showToast('Terms of Use: FERPA & Institutional Academic Integrity guidelines apply.', 'info')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Terms of Use
          </button>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <button
            type="button"
            onClick={() => showToast('Privacy Policy: All biometric QR attendance tokens and student grades are 256-bit encrypted.', 'info')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <button
            type="button"
            onClick={() => showToast('Official Student Handbook available at Registrar desk & online repository.', 'info')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Student Handbook
          </button>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <button
            type="button"
            onClick={() => { setIsForgotModalOpen(true); setForgotModalType('student'); }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Contact Support
          </button>
        </div>

        {/* Right Socials & Seal */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2.5 text-slate-400">
            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-red-400 transition-colors" aria-label="YouTube">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors" aria-label="Instagram">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors" aria-label="LinkedIn">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
          <span className="font-serif italic text-cyan-200/90 text-[10px]">
            In Veritate Unitas · Unity College Est. 1892
          </span>
        </div>
      </footer>

      {/* Forgot PIN / Help Modal - Information only, no auto-login bypass */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
              <HelpCircle className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-white">
              {forgotModalType === 'student' ? 'Student Account Recovery' : 'Faculty & Staff Authorization Help'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {forgotModalType === 'student'
                ? 'Student single sign-on supports your institutional Google OAuth or verified matriculation ID (e.g. STU-2024-001). For password resets, contact the Registrar.'
                : 'Faculty access requires an institutional email on the @unity.edu domain or approved Google administrator accounts (simplydivyanshk@gmail.com / jnv.peren55@gmail.com).'}
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="font-semibold text-slate-300">
                {forgotModalType === 'student' ? 'Sample Student Accounts:' : 'Sample Faculty Accounts:'}
              </div>
              <div className="font-mono text-[11px] text-slate-400 space-y-1">
                {forgotModalType === 'student' ? (
                  <>
                    <div>• Maya Lin: <span className="text-blue-400">STU-2024-001</span> (maya.lin@unity.edu)</div>
                    <div>• Marcus Sterling: <span className="text-blue-400">STU-2024-002</span> (marcus.sterling@unity.edu)</div>
                  </>
                ) : (
                  <>
                    <div>• Divyansh K. (Dean): <span className="text-emerald-400">simplydivyanshk@gmail.com</span></div>
                    <div>• Prof. JNV Peren: <span className="text-emerald-400">jnv.peren55@gmail.com</span></div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
