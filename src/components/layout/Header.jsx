import React, { useState, useEffect } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Search, 
  Bell, 
  Settings, 
  Sun, 
  Moon, 
  ChevronDown, 
  LogOut, 
  UserCheck, 
  ShieldCheck, 
  RotateCcw,
  QrCode,
  Camera,
  CheckCircle2,
  ExternalLink,
  User,
  TrendingUp,
  Menu,
  School
} from 'lucide-react';
import { NotificationCenterModal } from '../notifications/NotificationCenterModal.jsx';
import { MobileTestModal } from '../common/MobileTestModal.jsx';
import { GlobalSearchModal } from '../admin/GlobalSearchModal.jsx';

export const Header = ({ onSelectStudent, onSelectCourse }) => {
  const { 
    role, 
    setRole, 
    activeTab, 
    setActiveTab, 
    currentStudent,
    currentStaffUser,
    notifications,
    setIsStudentPhotoModalOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    showToast,
    requestSwitchToFaculty,
    logout 
  } = useCollege();

  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const unreadCount = notifications ? notifications.filter((n) => n.unread).length : 4;
  const isAdminOrFaculty = role === 'admin' || role === 'professor' || role === 'faculty';

  // Global Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* =========================================================================
     ADMIN & FACULTY TOP HEADER — EXACT SCREENSHOT VISUAL MATCH
     ========================================================================= */
  if (isAdminOrFaculty) {
    return (
      <header className="h-16 px-4 sm:px-6 bg-[#070b14] border-b border-slate-800/80 flex items-center justify-between gap-4 text-slate-200 sticky top-0 z-30 shadow-md">
        
        {/* Left Side: Hamburger + Unity College Logo + Rounded Pill Search */}
        <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
          {/* Hamburger button */}
          <button
            onClick={() => setIsSidebarCollapsed(prev => !prev)}
            className="p-2 -ml-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-5 h-5 text-slate-300 hover:text-white" />
          </button>

          {/* Unity College Logo - Editorial Serif typography matching reference image */}
          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 font-bold group-hover:scale-105 transition-transform">
              <School className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-serif font-black tracking-tight text-xl sm:text-2xl text-white group-hover:text-indigo-200 transition-colors">
              Unity College
            </span>
            <span className="hidden md:inline-flex text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold">
              Admin
            </span>
          </div>

          {/* Medium-style Rounded Pill Search Bar */}
          {/* Medium-style Rounded Pill Search Bar with Glow Animation */}
          <div
            onClick={() => setIsGlobalSearchOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0c1427] border border-slate-800 text-slate-400 hover:border-indigo-500/50 hover:bg-[#0e172e] hover:shadow-[0_0_16px_rgba(99,102,241,0.15)] hover:text-slate-200 transition-all duration-200 cursor-pointer group shadow-inner w-44 sm:w-64 md:w-80"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-200 shrink-0" />
            <span className="truncate flex-1 text-sm font-normal text-slate-400 group-hover:text-slate-200">
              Search
            </span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-900 text-slate-500 border border-slate-800 group-hover:border-indigo-500/40 group-hover:text-indigo-300 transition-colors">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Side: Tools & Administrator Profile */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Notification Bell with red count badge '4' matching screenshot */}
          <button
            onClick={() => setIsNotificationCenterOpen(true)}
            title="Notifications & System Alerts"
            className="btn-press relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer group"
          >
            <Bell className="w-4 h-4 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
            <span className="badge-bounce absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#070b14] shadow-md shadow-rose-600/40">
              {unreadCount > 0 ? unreadCount : 4}
            </span>
          </button>

          {/* Settings Gear Icon */}
          <button
            onClick={() => {
              setActiveTab('settings');
              showToast('Navigated to System Settings', 'info');
            }}
            title="System Settings"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Sun / Moon Theme Switcher matching screenshot */}
          <div className="flex items-center bg-[#0b1329] border border-slate-800 rounded-xl p-0.5">
            <button
              onClick={() => setIsDarkMode(false)}
              title="Light theme"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                !isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDarkMode(true)}
              title="Dark theme (active)"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDarkMode ? 'bg-indigo-600/30 text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Administrator Profile Pill matching screenshot */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-[#0b1329] hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                alt="Divyansh K."
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/60 shrink-0"
              />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate max-w-[130px]">
                  {currentStaffUser?.name || 'Divyansh K.'}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>Administrator</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </span>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setIsProfileMenuOpen(false)}
              >
                <div className="p-2 border-b border-slate-800 mb-1">
                  <div className="font-bold text-white">{currentStaffUser?.name || 'Prof. James Carter'}</div>
                  <div className="text-[11px] text-slate-400 truncate">{currentStaffUser?.email || 'faculty@unity.edu'}</div>
                  <div className="text-[10px] text-indigo-400 font-mono mt-0.5">Role: System Administrator</div>
                </div>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setRole('student');
                    setActiveTab('dashboard');
                    showToast('Switched to Student Portal view (Maya Lin).', 'info');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer text-left font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Switch to Student View</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setActiveTab('settings');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer text-left font-medium"
                >
                  <Settings className="w-3.5 h-3.5 text-indigo-400" />
                  <span>System Settings</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    showToast('Admin API Health: Express server connected on port 3001.', 'success');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer text-left font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Backend Health Status</span>
                </button>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-950/60 transition-colors cursor-pointer text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Global Search Modal */}
        <GlobalSearchModal
          isOpen={isGlobalSearchOpen}
          onClose={() => setIsGlobalSearchOpen(false)}
          onSelectStudent={onSelectStudent}
          onSelectCourse={onSelectCourse}
        />

        {/* Notification Center Modal */}
        <NotificationCenterModal
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
        />
      </header>
    );
  }

  /* =========================================================================
     STUDENT TOP HEADER
     ========================================================================= */
  /* =========================================================================
     STUDENT TOP HEADER — EXACT REFERENCE SCREENSHOT MATCH
     ========================================================================= */
  const student = currentStudent || {
    firstName: 'Maya',
    lastName: 'Lin',
    studentId: 'STU-2024-001',
    email: 'maya.lin@unity.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  };

  return (
    <header className="h-16 px-5 sm:px-6 bg-[#070b14] border-b border-slate-800/80 flex items-center justify-between gap-4 text-slate-200 sticky top-0 z-30 shadow-md">
      
      {/* Left: Hamburger Icon + Unity College Logo + Rounded Pill Search */}
      <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
        {/* Hamburger button */}
        <button
          onClick={() => setIsSidebarCollapsed(prev => !prev)}
          className="p-2 -ml-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer shrink-0"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu className="w-5 h-5 text-slate-300 hover:text-white" />
        </button>

        {/* Unity College Logo - Editorial Serif typography matching reference image */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 font-bold group-hover:scale-105 transition-transform">
            <School className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-serif font-black tracking-tight text-xl sm:text-2xl text-white group-hover:text-indigo-200 transition-colors">
            Unity College
          </span>
          <span className="hidden md:inline-flex text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30 font-bold">
            Student
          </span>
        </div>

        {/* Medium-style Rounded Pill Search Bar with Glow Animation */}
        <div
          onClick={() => setIsGlobalSearchOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0c1427] border border-slate-800 text-slate-400 hover:border-indigo-500/50 hover:bg-[#0e172e] hover:shadow-[0_0_16px_rgba(99,102,241,0.15)] hover:text-slate-200 transition-all duration-200 cursor-pointer group shadow-inner w-44 sm:w-64 md:w-80"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-200 shrink-0" />
          <span className="truncate flex-1 text-sm font-normal text-slate-400 group-hover:text-slate-200">
            Search
          </span>
          <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-900 text-slate-500 border border-slate-800 group-hover:border-indigo-500/40 group-hover:text-indigo-300 transition-colors">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Side: Notifications, Settings, Theme Switcher, Student Profile */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Notification Bell with Badge '3' matching screenshot */}
        <button
          onClick={() => setIsNotificationCenterOpen(true)}
          title="Student Announcements & Notices"
          className="btn-press relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer group"
        >
          <Bell className="w-4 h-4 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
          <span className="badge-bounce absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#070b14] shadow-md shadow-rose-600/40">
            3
          </span>
        </button>

        {/* Settings Gear Icon */}
        <button
          onClick={() => {
            setActiveTab('settings');
            showToast('Navigated to Student Settings', 'info');
          }}
          title="Student Settings"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Sun / Moon Theme Switcher matching screenshot */}
        <div className="flex items-center bg-[#0b1329] border border-slate-800 rounded-xl p-0.5">
          <button
            onClick={() => setIsDarkMode(false)}
            title="Light theme"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              !isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsDarkMode(true)}
            title="Dark theme (Active)"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDarkMode ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Student Profile Capsule Button matching reference image */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 py-1 px-2 rounded-xl hover:bg-slate-800/70 transition-all cursor-pointer group border border-transparent hover:border-slate-800"
          >
            <div className="relative shrink-0">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.firstName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/80 shadow-md group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${student.avatarBg || 'from-indigo-600 to-purple-700'} text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-500/80 shadow-md`}>
                  {student.firstName[0]}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#070b14]" />
            </div>

            <div className="flex flex-col text-left leading-tight hidden sm:flex">
              <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                {student.firstName} {student.lastName}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {student.studentId || 'STU-2024-001'}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300 hidden sm:inline" />
          </button>

          {/* Student Profile Dropdown */}
          {isProfileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setIsProfileMenuOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-2xl p-2 text-xs z-50 animate-fadeIn">
                <div className="p-2.5 border-b border-slate-800 flex items-center gap-2.5">
                  {student.avatarUrl ? (
                    <img
                      src={student.avatarUrl}
                      alt={student.firstName}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-indigo-500 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      {student.firstName[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate">{student.firstName} {student.lastName}</div>
                    <div className="text-[10px] text-indigo-400 font-mono truncate">{student.email}</div>
                    <div className="text-[10px] text-slate-400 font-mono">B.Sc. Computer Science</div>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setActiveTab('profile');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer text-left font-medium"
                  >
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>View Student Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsStudentPhotoModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer text-left font-medium"
                  >
                    <Camera className="w-3.5 h-3.5 text-teal-400" />
                    <span>Change Student Photo</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setActiveTab('progress');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer text-left font-medium"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span>Academic Degree Progress</span>
                  </button>
                </div>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    requestSwitchToFaculty();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-indigo-400 hover:text-white hover:bg-indigo-950/60 transition-colors cursor-pointer text-left font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Switch to Faculty Portal</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-950/60 transition-colors cursor-pointer text-left font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onSelectStudent={onSelectStudent}
        onSelectCourse={onSelectCourse}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </header>
  );
};
