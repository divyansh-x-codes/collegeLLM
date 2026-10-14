import React from 'react';
import { X, Award, Printer } from 'lucide-react';

export const StudentTranscriptModal = ({
  isOpen,
  onClose,
  student,
  course,
  gradeRecord,
}) => {
  if (!isOpen || !student || !course || !gradeRecord) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto modal-backdrop-animate">
      <div className="relative w-full max-w-2xl bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden my-8 modal-content-animate text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0c1427]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Award className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Official Term Grade Report & Transcript
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {course.code} · {course.term} · Unity College
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[72vh] overflow-y-auto">
          {/* Student Profile Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#080d1b] rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Student Name</span>
              <p className="font-bold text-white mt-0.5">{student.firstName} {student.lastName}</p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Student ID</span>
              <p className="font-mono font-medium text-indigo-400 mt-0.5">{student.studentId}</p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Department</span>
              <p className="text-slate-300 mt-0.5 truncate">{student.department}</p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Academic Standing</span>
              <p className="text-emerald-400 font-semibold mt-0.5">{student.status}</p>
            </div>
          </div>

          {/* Grade Summary Scorecard */}
          <div className="flex items-center justify-between p-4 bg-indigo-950/60 rounded-xl border border-indigo-800/80">
            <div>
              <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Overall Course Evaluation
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Status: <strong className="font-mono text-emerald-400">{gradeRecord.status}</strong>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Weighted Score</div>
                <div className="text-xl font-bold font-mono text-white">
                  {gradeRecord.weightedPercentage}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Letter Grade</div>
                <div className="text-2xl font-extrabold font-mono text-indigo-400">
                  {gradeRecord.letterGrade}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Grade Point</div>
                <div className="text-xl font-bold font-mono text-white">
                  {gradeRecord.gpaPoint.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Breakdown Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Itemized Assessment Scores
            </h3>
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-[#0c1427]">
              <table className="w-full text-left text-xs table-compact">
                <thead className="bg-[#080d1b] border-b border-slate-800 text-slate-400 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Assessment Item</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3 text-right">Weight</th>
                    <th className="py-2 px-3 text-right">Score</th>
                    <th className="py-2 px-3 text-right">Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-slate-200">
                  {course.assessments.map((asm) => {
                    const rawScore = gradeRecord.scores[asm.id] !== undefined ? gradeRecord.scores[asm.id] : 0;
                    const contribution = ((rawScore / asm.maxScore) * asm.weight).toFixed(1);

                    return (
                      <tr key={asm.id} className="hover:bg-slate-900/50">
                        <td className="py-2 px-3 font-sans font-medium text-white">{asm.name}</td>
                        <td className="py-2 px-3 font-sans text-slate-400">{asm.category}</td>
                        <td className="py-2 px-3 text-right text-slate-300">{asm.weight}%</td>
                        <td className="py-2 px-3 text-right font-semibold text-white">
                          {rawScore} / {asm.maxScore}
                        </td>
                        <td className="py-2 px-3 text-right text-indigo-400 font-bold">
                          +{contribution}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-[#0c1427] flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Transcript</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
