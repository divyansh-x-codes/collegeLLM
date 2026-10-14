import React from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Radio, 
  Trash2, 
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const StudentDetailDrawer = ({
  student,
  isOpen,
  onClose,
}) => {
  const { courses, deleteStudent, role, showToast } = useCollege();

  if (!isOpen || !student) return null;

  const enrolledCourses = courses.filter((c) => student.enrolledCourseIds?.includes(c.id));
  const isAtRiskAttendance = student.attendanceRate < 75;
  const isAtRiskGpa = student.gpa < 2.2;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to withdraw student ${student.firstName} ${student.lastName} from academic registry?`)) {
      deleteStudent(student.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs antialiased font-sans">
      <div className="relative w-full max-w-md h-full bg-[#0c1427] text-slate-100 shadow-2xl border-l border-slate-800 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 bg-[#080d1b]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.firstName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500/50 shadow-md"
                />
              ) : (
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${student.avatarBg || 'from-indigo-600 to-blue-700'} text-white flex items-center justify-center font-bold text-base shadow-md`}
                >
                  {student.firstName[0]}
                </div>
              )}
              <div>
                <h2 className="text-base font-bold text-slate-100 leading-tight">
                  {student.firstName} {student.lastName}
                </h2>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  {student.studentId} · {student.year}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs custom-scrollbar">
          {/* Standing Banner */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#070b14] rounded-xl border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1 font-semibold uppercase">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cumulative GPA</span>
                </span>
              </div>
              <div
                className={`text-2xl font-bold font-mono mt-1 ${
                  isAtRiskGpa ? 'text-rose-400' : 'text-slate-100'
                }`}
              >
                {student.gpa.toFixed(2)}
              </div>
              {isAtRiskGpa && (
                <div className="text-[10px] text-rose-400 font-medium flex items-center gap-1 mt-0.5">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Academic Probation</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-[#070b14] rounded-xl border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1 font-semibold uppercase">
                  <Radio className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Term Attendance</span>
                </span>
              </div>
              <div
                className={`text-2xl font-bold font-mono mt-1 ${
                  isAtRiskAttendance ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {student.attendanceRate}%
              </div>
              {isAtRiskAttendance && (
                <div className="text-[10px] text-rose-400 font-medium flex items-center gap-1 mt-0.5">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Below 75% Policy</span>
                </div>
              )}
            </div>
          </div>

          {/* Academic Details */}
          <div>
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
              Academic Program
            </h3>
            <div className="space-y-1.5 bg-[#070b14] p-3 rounded-xl border border-slate-800 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-medium text-slate-200 text-right">{student.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Degree:</span>
                <span className="font-medium text-slate-200">{student.program}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cohort:</span>
                <span className="font-mono text-slate-200">{student.cohort}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Faculty Advisor:</span>
                <span className="font-medium text-indigo-400">{student.advisor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Matriculated:</span>
                <span className="font-mono text-slate-200">{student.enrollmentDate}</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
              Institutional Contact
            </h3>
            <div className="space-y-2 bg-[#070b14] p-3 rounded-xl border border-slate-800 text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="font-mono text-indigo-400">{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{student.phone}</span>
              </div>
              {student.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>{student.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          {student.emergencyContact && (
            <div>
              <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                Emergency Contact
              </h3>
              <div className="bg-[#070b14] p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                <div className="font-semibold text-slate-200">
                  {student.emergencyContact.name} ({student.emergencyContact.relationship})
                </div>
                <div className="font-mono text-slate-400 text-[11px]">
                  {student.emergencyContact.phone}
                </div>
              </div>
            </div>
          )}

          {/* Enrolled Courses */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Active Enrolled Courses ({enrolledCourses.length})
              </h3>
            </div>
            <div className="space-y-2">
              {enrolledCourses.length === 0 ? (
                <p className="text-slate-500 italic">No courses currently enrolled.</p>
              ) : (
                enrolledCourses.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border border-slate-800 bg-[#070b14] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-mono font-bold text-indigo-400 text-xs">{c.code}</div>
                      <div className="font-medium text-slate-200 truncate max-w-[200px]">
                        {c.title}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{c.credits} Credits</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-[#080d1b] flex items-center justify-between">
          {(role === 'admin' || role === 'professor' || role === 'faculty') && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Withdraw Student</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-4 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
