import React from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Home,
  BookMarked,
  User,
  BookOpen,
  FileText,
  CalendarDays,
  Award,
  GraduationCap,
  FolderOpen,
  Megaphone,
  TrendingUp,
  Settings,
  HelpCircle,
  Users,
  UserCheck,
  Building2,
  CalendarCheck2,
  ShieldCheck,
  BarChart3,
  Activity,
  RotateCcw
} from 'lucide-react';

export const Sidebar = ({ onOpenRegisterStudent, onOpenAddCourse }) => {
  const { 
    activeTab, 
    setActiveTab, 
    role, 
    isSidebarCollapsed,
    showToast,
    requestSwitchToFaculty,
    setRole
  } = useCollege();

  const isAdminOrFaculty = role === 'admin' || role === 'professor' || role === 'faculty';

  // Student Navigation Items matching the Medium-style screenshot order & aesthetics
  const studentNavItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'library', label: 'Library', icon: BookMarked },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'examinations', label: 'Examinations', icon: Award },
    { id: 'grading', label: 'Grades & Results', icon: GraduationCap },
    { id: 'materials', label: 'Course Materials', icon: FolderOpen },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'progress', label: 'Academic Stats', icon: TrendingUp },
  ];

  const studentBottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
  ];

  // Admin / Faculty Navigation Items
  const adminNavItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'faculty', label: 'Faculty & Staff', icon: UserCheck },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'examinations', label: 'Examinations', icon: Award },
    { id: 'grading', label: 'Grades & Results', icon: GraduationCap },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ];

  const adminBottomItems = [
    { id: 'users', label: 'User Management', icon: ShieldCheck },
    { id: 'reports', label: 'Reports & Stats', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'audit', label: 'Audit Logs', icon: Activity },
  ];

  const mainItems = isAdminOrFaculty ? adminNavItems : studentNavItems;
  const bottomItems = isAdminOrFaculty ? adminBottomItems : studentBottomItems;

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleTogglePortal = () => {
    if (isAdminOrFaculty) {
      setRole('student');
      setActiveTab('dashboard');
      showToast('Switched to Student Portal view.', 'info');
    } else {
      requestSwitchToFaculty();
    }
  };

  return (
    <aside 
      className={`${
        isSidebarCollapsed ? 'w-[72px]' : 'w-64 sm:w-[270px]'
      } bg-[#070b14] border-r border-slate-800/80 flex flex-col shrink-0 h-full text-slate-300 select-none z-20 transition-all duration-200 shadow-xl overflow-hidden`}
    >
      {/* Navigation Links List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={isSidebarCollapsed ? item.label : undefined}
              className={`w-full relative flex items-center transition-all duration-200 cursor-pointer group rounded-xl btn-press ${
                isSidebarCollapsed 
                  ? 'justify-center py-3 px-2' 
                  : 'gap-3.5 px-4 py-2.5 text-[15px] hover:translate-x-0.5'
              } ${
                isActive
                  ? 'bg-slate-800/60 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/30 font-medium'
              }`}
            >
              {/* Sleek Inset Active Indicator Pill */}
              {isActive && (
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
              )}

              {/* Icon */}
              <Icon 
                className={`w-5 h-5 shrink-0 transition-all duration-200 group-hover:scale-110 ${
                  isActive 
                    ? 'text-white stroke-[2.2]' 
                    : 'text-slate-400 group-hover:text-slate-200 stroke-[1.8]'
                }`} 
              />

              {/* Label */}
              {!isSidebarCollapsed && (
                <span className="truncate tracking-normal text-[15px]">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}

        {/* Divider matching reference image spacing */}
        <div className={`my-2.5 border-t border-slate-800/80 ${isSidebarCollapsed ? 'mx-2' : 'mx-3'}`} />

        {/* Secondary / Bottom navigation items */}
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={isSidebarCollapsed ? item.label : undefined}
              className={`w-full relative flex items-center transition-all duration-200 cursor-pointer group rounded-xl btn-press ${
                isSidebarCollapsed 
                  ? 'justify-center py-3 px-2' 
                  : 'gap-3.5 px-4 py-2.5 text-[15px] hover:translate-x-0.5'
              } ${
                isActive
                  ? 'bg-slate-800/60 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/30 font-medium'
              }`}
            >
              {isActive && (
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
              )}

              <Icon 
                className={`w-5 h-5 shrink-0 transition-all duration-200 group-hover:scale-110 ${
                  isActive 
                    ? 'text-white stroke-[2.2]' 
                    : 'text-slate-400 group-hover:text-slate-200 stroke-[1.8]'
                }`} 
              />

              {!isSidebarCollapsed && (
                <span className="truncate tracking-normal text-[15px]">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Switch Portal Button */}
      <div className={`p-3 border-t border-slate-800/80 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={handleTogglePortal}
          title={isAdminOrFaculty ? "Switch to Student View" : "Switch to Faculty Portal"}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 to-purple-950/40 hover:from-indigo-900/60 hover:to-purple-900/60 text-indigo-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm group ${
            isSidebarCollapsed ? 'w-10 h-10 p-0' : 'w-full px-3'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-indigo-400 group-hover:-rotate-90 transition-transform duration-200 shrink-0" />
          {!isSidebarCollapsed && (
            <span className="truncate">
              {isAdminOrFaculty ? 'Switch to Student View' : 'Switch to Faculty Portal'}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};
