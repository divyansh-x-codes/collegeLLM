import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Layers, 
  Download,
  Clock,
  ChevronRight
} from 'lucide-react';
import { StudentTranscriptRequestModal } from './StudentTranscriptRequestModal.jsx';

export const StudentAcademicProgressView = () => {
  const { currentStudent, showToast } = useCollege();
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  const student = currentStudent || {
    firstName: 'Maya',
    lastName: 'Lin',
    studentId: 'STU-2024-001',
    program: 'B.Sc. Computer Science',
    department: 'Computer Science Department',
    gpa: 3.88
  };

  const semesterHistory = [
    { sem: 'Year 1 · Fall 2024', gpa: 3.92, credits: 16, status: 'Completed', courses: ['CS101 Intro to Computing', 'MATH110 Calculus I', 'ENG101 College Writing', 'PHYS101 Mechanics'] },
    { sem: 'Year 1 · Spring 2025', gpa: 3.85, credits: 16, status: 'Completed', courses: ['CS102 Object Oriented Programming', 'MATH120 Calculus II', 'MATH210 Discrete Math', 'PHYS102 Electromagnetism'] },
    { sem: 'Year 2 · Fall 2025', gpa: 3.82, credits: 17, status: 'Completed', courses: ['CS201 Data Structures', 'CS250 Computer Systems', 'MATH220 Linear Algebra', 'STAT210 Probability'] },
    { sem: 'Year 2 · Spring 2026', gpa: 3.91, credits: 17, status: 'Completed', courses: ['CS301 Algorithms', 'CS310 Compilers', 'ECE215 Digital Systems', 'GEN201 Ethics in Tech'] },
    { sem: 'Year 3 · Fall 2026 (Current)', gpa: 3.88, credits: 16, status: 'In Progress', courses: ['CS201 Data Structures & Algorithms', 'CS203 Database Systems', 'CS205 Web Technologies', 'CS206 Software Engineering'] }
  ];

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-slate-100 font-sans antialiased">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-0.5">
            <span className="text-teal-400 font-semibold">Degree Audit & Matriculation</span>
            <span>·</span>
            <span>B.Sc. Computer Science</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-teal-400" />
            <span>Academic Progress & Degree Audit</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cumulative GPA trajectory, completed semester credits, and degree graduation requirements.
          </p>
        </div>

        <button
          onClick={() => setIsTranscriptOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Request Official Transcript</span>
        </button>
      </div>

      {/* Top 3 Degree Milestone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Credits Completed */}
        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Credits Earned</span>
            <span className="text-teal-400 font-bold font-mono">68% Reached</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">82 / 120</div>
          <div className="w-full h-2 rounded-full bg-[#080d1b] overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full" style={{ width: '68%' }} />
          </div>
          <div className="text-[11px] text-slate-400 font-mono">38 Credits Remaining for B.Sc. Conferral</div>
        </div>

        {/* Cumulative GPA */}
        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Cumulative GPA</span>
            <span className="text-emerald-400 font-bold font-mono">Magna Cum Laude</span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">3.88</div>
          <div className="w-full h-2 rounded-full bg-[#080d1b] overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '97%' }} />
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Minimum Graduation Threshold: 2.00 GPA</div>
        </div>

        {/* Expected Graduation */}
        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Conferral Target</span>
            <span className="text-indigo-400 font-bold font-mono">On Schedule</span>
          </div>
          <div className="text-3xl font-extrabold text-white">May 2028</div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Commencement Ceremony Class of 2028</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Advisor: Prof. Dr. Evelyn Vance</div>
        </div>
      </div>

      {/* Semester by Semester History Table */}
      <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Academic History & Semester Breakdown</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">5 Recorded Terms</span>
        </div>

        <div className="space-y-3">
          {semesterHistory.map((s, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-[#080d1b] border border-slate-800/80 hover:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{s.sem}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    s.status === 'Completed' 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {s.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {s.courses.join(' · ')}
                </div>
              </div>

              <div className="flex items-center gap-5 text-xs font-mono shrink-0">
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">TERM CREDITS</div>
                  <div className="text-white font-bold">{s.credits} Credits</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-[10px]">TERM GPA</div>
                  <div className="text-emerald-400 font-bold">{s.gpa.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transcript Modal */}
      <StudentTranscriptRequestModal
        student={student}
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
      />
    </div>
  );
};
