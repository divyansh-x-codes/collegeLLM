import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  GraduationCap, 
  Calendar, 
  Camera, 
  ShieldCheck, 
  IdCard, 
  CheckCircle2, 
  Save,
  Lock
} from 'lucide-react';
import { StudentIdCardModal } from './StudentIdCardModal.jsx';

export const StudentProfileView = () => {
  const { currentStudent, updateStudent, showToast, setIsStudentPhotoModalOpen } = useCollege();
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);

  const student = currentStudent || {
    id: 's-1',
    studentId: 'STU-2024-001',
    firstName: 'Maya',
    lastName: 'Lin',
    email: 'maya.lin@unity.edu',
    phone: '+1 (555) 234-8901',
    department: 'Computer Science Department',
    program: 'B.Sc. Computer Science',
    year: 'Junior · 3rd Year',
    cohort: 'Class of 2027',
    status: 'Active',
    gpa: 3.88,
    attendanceRate: 92,
    advisor: 'Prof. Dr. Evelyn Vance',
    address: '402 Oak Ridge Hall, Campus Way',
    emergencyContact: {
      name: 'Elena Lin',
      relationship: 'Mother',
      phone: '+1 (555) 892-1200'
    }
  };

  const [phone, setPhone] = useState(student.phone || '+1 (555) 234-8901');
  const [address, setAddress] = useState(student.address || '402 Oak Ridge Hall, Campus Way');
  const [emergencyPhone, setEmergencyPhone] = useState(student.emergencyContact?.phone || '+1 (555) 892-1200');

  const handleSaveContactInfo = (e) => {
    e.preventDefault();
    if (updateStudent && student.id) {
      updateStudent(student.id, {
        phone,
        address,
        emergencyContact: { ...student.emergencyContact, phone: emergencyPhone }
      });
    }
    showToast('Contact details updated and synchronized with Registrar', 'success');
  };

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-slate-100 font-sans antialiased">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-0.5">
            <span className="text-indigo-400 font-semibold">Institutional Student Record</span>
            <span>·</span>
            <span>ID: {student.studentId}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-400" />
            <span>Student Academic Profile</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative collegiate matriculation credentials and approved student communication channels.
          </p>
        </div>

        <button
          onClick={() => setIsIdCardOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <IdCard className="w-3.5 h-3.5" />
          <span>View Digital Student ID</span>
        </button>
      </div>

      {/* Main Profile Identity Card */}
      <div className="p-6 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-800">
          {/* Avatar with click to change photo */}
          <div 
            onClick={() => setIsStudentPhotoModalOpen && setIsStudentPhotoModalOpen(true)}
            className="relative cursor-pointer group shrink-0"
            title="Click to update picture"
          >
            {student.avatarUrl ? (
              <img 
                src={student.avatarUrl} 
                alt={student.firstName}
                className="w-24 h-24 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-lg group-hover:scale-105 transition-all"
              />
            ) : (
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${student.avatarBg || 'from-indigo-600 to-purple-700'} text-white flex items-center justify-center font-bold text-3xl ring-2 ring-indigo-500 shadow-lg group-hover:scale-105 transition-all`}>
                {student.firstName?.[0] || 'S'}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center ring-2 ring-slate-800 group-hover:bg-indigo-600 transition-colors">
              <Camera className="w-3 h-3 text-indigo-200" />
            </div>
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-white">{student.firstName} {student.lastName}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Active Student
              </span>
            </div>
            <p className="text-xs text-indigo-300 font-medium">
              {student.program || 'B.Sc. Computer Science'} · {student.year || '3rd Year · Semester 1'}
            </p>
            <p className="text-xs text-slate-400">
              Department: {student.department || 'Computer Science Department'}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-400">
              <span>Student ID: <strong className="text-white">{student.studentId}</strong></span>
              <span>Cumulative GPA: <strong className="text-emerald-400">{student.gpa?.toFixed(2) || '3.88'}</strong></span>
              <span>Attendance Rate: <strong className="text-white">{Math.round(student.attendanceRate || 92)}%</strong></span>
            </div>
          </div>
        </div>

        {/* Academic Details (Locked Server Authority) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Official Academic Records (Registrar Governed)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[#080d1b] border border-slate-800 space-y-1">
              <div className="text-slate-500 font-mono text-[10px]">FACULTY ADVISOR</div>
              <div className="text-white font-semibold">{student.advisor || 'Prof. Dr. Evelyn Vance'}</div>
              <div className="text-slate-400 text-[11px]">Department of Computer Science</div>
            </div>

            <div className="p-3 rounded-xl bg-[#080d1b] border border-slate-800 space-y-1">
              <div className="text-slate-500 font-mono text-[10px]">COLLEGIATE EMAIL</div>
              <div className="text-white font-semibold font-mono truncate">{student.email}</div>
              <div className="text-emerald-400 text-[11px]">Google OAuth SSO Verified ✓</div>
            </div>

            <div className="p-3 rounded-xl bg-[#080d1b] border border-slate-800 space-y-1">
              <div className="text-slate-500 font-mono text-[10px]">CONFERRAL TARGET</div>
              <div className="text-white font-semibold">May 2028 (Class of 2027)</div>
              <div className="text-slate-400 text-[11px]">82 / 120 Credits Completed</div>
            </div>
          </div>
        </div>

        {/* Editable Student Communication Information */}
        <form onSubmit={handleSaveContactInfo} className="space-y-4 pt-4 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Approved Student Contact Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Primary Phone Number
              </label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#080d1b] border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Emergency Contact Phone ({student.emergencyContact?.name || 'Parent'})
              </label>
              <input 
                type="text" 
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#080d1b] border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Campus / Residential Address
              </label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#080d1b] border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Contact Details</span>
            </button>
          </div>
        </form>
      </div>

      {/* ID Card Modal */}
      <StudentIdCardModal
        student={student}
        isOpen={isIdCardOpen}
        onClose={() => setIsIdCardOpen(false)}
      />
    </div>
  );
};
