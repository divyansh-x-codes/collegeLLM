import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  X, 
  Send,
  FileCode,
  FileCheck
} from 'lucide-react';

export const StudentAssignmentsView = () => {
  const { assignments, courses, submitAssignment, showToast } = useCollege();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedAssignmentForSubmit, setSelectedAssignmentForSubmit] = useState(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Map and enrich live assignments from CollegeContext
  const liveAssignments = useMemo(() => {
    return (assignments || []).map((asg) => {
      const course = courses.find(c => c.id === asg.courseId);
      const courseName = course ? `${course.code} · ${course.title}` : (asg.course || 'Core Curriculum Module');
      const faculty = course?.instructor?.name || asg.faculty || 'Department Faculty';
      const dueDateFormatted = asg.dueDate || (asg.deadline ? `${asg.deadline}, 11:59 PM` : '15 Oct 2026, 11:59 PM');

      return {
        id: asg.id,
        title: asg.title,
        course: courseName,
        faculty: faculty,
        dueDate: dueDateFormatted,
        maxScore: asg.maxScore || asg.maxPoints || 100,
        status: asg.status === 'Published' ? 'Pending' : (asg.status || 'Pending'),
        score: asg.score,
        instructions: asg.instructions || asg.description || 'Follow standard departmental rubric and submit your source code repository or lab report.',
        feedback: asg.feedback,
        submittedFile: asg.submittedFile
      };
    });
  }, [assignments, courses]);

  const handleSubmitAssignment = (e) => {
    e.preventDefault();
    if (!uploadFileName) {
      showToast('Please select or name a file to submit', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      submitAssignment(selectedAssignmentForSubmit.id, {
        file: uploadFileName,
        notes: submissionNotes
      });
      setIsSubmitting(false);
      setSelectedAssignmentForSubmit(null);
      setUploadFileName('');
      setSubmissionNotes('');
    }, 500);
  };

  const filtered = liveAssignments.filter(a => {
    if (activeFilter === 'Pending') return a.status === 'Pending';
    if (activeFilter === 'Submitted') return a.status === 'Submitted';
    if (activeFilter === 'Graded') return a.status === 'Graded';
    return true;
  });

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-slate-100 font-sans antialiased">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-0.5">
            <span className="text-indigo-400 font-semibold">Continuous Assessment</span>
            <span>·</span>
            <span>Fall 2026</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            <span>Assignments & Coursework Submissions</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Submit coursework, track evaluation deadlines, and inspect graded faculty rubrics.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-[#0c1427] p-1 rounded-xl border border-slate-800">
          {['All', 'Pending', 'Submitted', 'Graded'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeFilter === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-indigo-300 font-semibold">
                  {item.course}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">{item.faculty}</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-slate-400 font-bold">Max: {item.maxScore} pts</span>
              </div>

              <h3 className="text-base font-bold text-white leading-tight">
                {item.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2">
                {item.instructions}
              </p>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Due: {item.dueDate}</span>
                </div>
                {item.submittedFile && (
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Submitted: {item.submittedFile}</span>
                  </div>
                )}
              </div>

              {item.feedback && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 mt-2">
                  <strong>Faculty Feedback:</strong> {item.feedback}
                </div>
              )}
            </div>

            {/* Actions / Status */}
            <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
              <div>
                {item.status === 'Graded' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Graded: {item.score} / {item.maxScore}
                  </span>
                ) : item.status === 'Submitted' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Submitted
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    <Clock className="w-3.5 h-3.5" />
                    Pending
                  </span>
                )}
              </div>

              {item.status === 'Pending' ? (
                <button
                  onClick={() => setSelectedAssignmentForSubmit(item)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Submit Assignment</span>
                </button>
              ) : (
                <button
                  onClick={() => showToast('Submission receipt downloaded', 'info')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-[#080d1b] border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Receipt</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal Dialog Teleported to Document Body */}
      {selectedAssignmentForSubmit && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0c1427] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm">Submit Coursework File</h3>
              </div>
              <button 
                onClick={() => setSelectedAssignmentForSubmit(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAssignment} className="p-6 space-y-4">
              <div>
                <span className="text-[11px] font-mono text-indigo-300 font-semibold uppercase">{selectedAssignmentForSubmit.course}</span>
                <h4 className="font-bold text-white text-sm mt-0.5">{selectedAssignmentForSubmit.title}</h4>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Select File (.zip, .pdf, .py, .cpp, .tar.gz)
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadFileName(e.target.files?.[0]?.name || 'MayaLin_Assignment_Archive.zip')}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Notes for Faculty (Optional)
                </label>
                <textarea
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Include any compilation instructions or library dependencies..."
                  className="w-full px-3 py-2 rounded-xl bg-[#080d1b] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentForSubmit(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Uploading...' : 'Confirm Submission'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
