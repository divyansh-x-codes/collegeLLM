import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Settings, 
  Bell, 
  ShieldCheck, 
  Moon, 
  Lock, 
  Save, 
  CheckCircle2, 
  Smartphone,
  Eye
} from 'lucide-react';

export const StudentSettingsView = () => {
  const { showToast } = useCollege();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [assignmentReminders, setAssignmentReminders] = useState(true);
  const [gradeReleaseAlerts, setGradeReleaseAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    showToast('Student preferences saved successfully', 'success');
  };

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-slate-100 font-sans antialiased">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span>Student Portal Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure notification dispatches, portal appearance, and account authentication security.
        </p>
      </div>

      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Notification Preferences */}
        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
            <Bell className="w-4 h-4 text-indigo-400" />
            <span>Notification & Dispatch Preferences</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#080d1b] border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-white">Assignment Deadline Alerts</div>
                <div className="text-slate-400 text-[11px]">Receive notification 48 hours and 2 hours prior to coursework due times</div>
              </div>
              <input
                type="checkbox"
                checked={assignmentReminders}
                onChange={(e) => setAssignmentReminders(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-800 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#080d1b] border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-white">Grade Release Notifications</div>
                <div className="text-slate-400 text-[11px]">Instant alert when faculty approves and releases exam marks or project feedback</div>
              </div>
              <input
                type="checkbox"
                checked={gradeReleaseAlerts}
                onChange={(e) => setGradeReleaseAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-800 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#080d1b] border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-white">Collegiate Email Dispatches</div>
                <div className="text-slate-400 text-[11px]">Forward campus emergency bulletins and announcements to student email</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-800 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Account Security & Session Shield</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#080d1b] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Google OAuth Authentication</div>
                <div className="text-slate-400 text-[11px]">Secured via Institutional Google Workspace SSO (unity.edu)</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400">
                Connected
              </span>
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#080d1b] border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-white">Two-Factor Authentication (2FA)</div>
                <div className="text-slate-400 text-[11px]">Enforce hardware security key or authenticator prompt upon login</div>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-800 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
