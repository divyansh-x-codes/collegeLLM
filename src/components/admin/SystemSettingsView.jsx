import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Settings, 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  Lock, 
  Save, 
  CheckCircle2, 
  Clock, 
  Radio,
  FileText
} from 'lucide-react';

export const SystemSettingsView = () => {
  const { systemSettings, updateSystemSettings, showToast, logAuditEvent } = useCollege();
  
  const [formData, setFormData] = useState({
    institutionName: systemSettings?.institutionName || 'Unity College of Engineering & Technology',
    institutionCode: systemSettings?.institutionCode || 'UC-1892',
    campusAddress: systemSettings?.campusAddress || '400 University Parkway, Cambridge, MA 02138',
    registrarEmail: systemSettings?.registrarEmail || 'registrar@unity.edu',
    adminContact: systemSettings?.adminContact || '+1 (555) 019-2830',
    minAttendanceRequirement: systemSettings?.minAttendanceRequirement || 75,
    probationGpaThreshold: systemSettings?.probationGpaThreshold || 2.0,
    maxCreditsPerTerm: systemSettings?.maxCreditsPerTerm || 24,
    gradingScale: systemSettings?.gradingScale || '4.0 Scale (A=4.0, B=3.0, C=2.0, D=1.0, F=0.0)',
    allowedDomains: systemSettings?.allowedDomains || 'unity.edu, gmail.com',
    authDomainRestricted: systemSettings?.authDomainRestricted !== undefined ? systemSettings.authDomainRestricted : true,
    auditLoggingEnabled: systemSettings?.auditLoggingEnabled !== undefined ? systemSettings.auditLoggingEnabled : true,
    sessionTimeoutMinutes: systemSettings?.sessionTimeoutMinutes || 60
  });

  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSystemSettings(formData);
    logAuditEvent('SYSTEM_SETTINGS_UPDATE', 'Institutional policies and configurations updated');
    setIsSaving(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 antialiased font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <span>Institutional System Settings & Security Policies</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Global institution configuration, academic evaluation criteria, grading policies, and telemetry parameters
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSection('profile')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            activeSection === 'profile'
              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Institution Profile</span>
        </button>
        <button
          onClick={() => setActiveSection('academic')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            activeSection === 'academic'
              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Academic & Grading Policies</span>
        </button>
        <button
          onClick={() => setActiveSection('security')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            activeSection === 'security'
              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Security & Authentication</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="bg-[#0c1427] p-5 rounded-xl border border-slate-800/90 shadow-md space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Institutional Identity & Accreditation</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Institution Legal Name</label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) => handleChange('institutionName', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Institution Code / Matriculation ID</label>
                <input
                  type="text"
                  value={formData.institutionCode}
                  onChange={(e) => handleChange('institutionCode', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 font-mono focus:ring-2 focus:ring-indigo-500 uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Physical Address</label>
              <input
                type="text"
                value={formData.campusAddress}
                onChange={(e) => handleChange('campusAddress', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registrar Official Email</label>
                <input
                  type="email"
                  value={formData.registrarEmail}
                  onChange={(e) => handleChange('registrarEmail', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 font-mono focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Administration Contact</label>
                <input
                  type="text"
                  value={formData.adminContact}
                  onChange={(e) => handleChange('adminContact', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Academic Policies */}
        {activeSection === 'academic' && (
          <div className="bg-[#0c1427] p-5 rounded-xl border border-slate-800/90 shadow-md space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Academic Regulations & Matriculation Thresholds</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Min Attendance Requirement (%)</label>
                <input
                  type="number"
                  value={formData.minAttendanceRequirement}
                  onChange={(e) => handleChange('minAttendanceRequirement', Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 font-mono focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Students below this percentage are automatically flagged.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Probation GPA Threshold</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.probationGpaThreshold}
                  onChange={(e) => handleChange('probationGpaThreshold', Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 font-mono focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">GPA under this score triggers Academic Probation.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Max Credits Per Term</label>
                <input
                  type="number"
                  value={formData.maxCreditsPerTerm}
                  onChange={(e) => handleChange('maxCreditsPerTerm', Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 font-mono focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Upper limit for undergraduate curriculum enrollment.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Grading Scale Formula</label>
              <input
                type="text"
                value={formData.gradingScale}
                onChange={(e) => handleChange('gradingScale', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Security Section */}
        {activeSection === 'security' && (
          <div className="bg-[#0c1427] p-5 rounded-xl border border-slate-800/90 shadow-md space-y-4">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>Authentication & Session Policies</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Allowed Single Sign-On Domains</label>
              <input
                type="text"
                value={formData.allowedDomains}
                onChange={(e) => handleChange('allowedDomains', e.target.value)}
                placeholder="e.g. unity.edu, gmail.com"
                className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 font-mono focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">Comma-separated email domains permitted for Google SSO authentication.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Session Inactivity Timeout (Minutes)</label>
                <input
                  type="number"
                  value={formData.sessionTimeoutMinutes}
                  onChange={(e) => handleChange('sessionTimeoutMinutes', Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 font-mono focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col justify-center space-y-2 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.auditLoggingEnabled}
                    onChange={(e) => handleChange('auditLoggingEnabled', e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Record all administrative actions to permanent audit log</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.authDomainRestricted}
                    onChange={(e) => handleChange('authDomainRestricted', e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Enforce domain restrictions on Google OAuth sign-in</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
