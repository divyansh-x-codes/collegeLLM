import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  FileText, 
  Send, 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  Clock,
  Printer
} from 'lucide-react';
import { useCollege } from '../../context/CollegeContext.jsx';

export const StudentTranscriptRequestModal = ({ isOpen, onClose, student }) => {
  const { showToast } = useCollege();
  const [purpose, setPurpose] = useState('Graduate School Application');
  const [format, setFormat] = useState('Official Digital E-Transcript (PDF)');
  const [deliveryEmail, setDeliveryEmail] = useState(student?.email || 'maya.lin@unity.edu');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !student) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      showToast('Official transcript generated and sent to ' + deliveryEmail, 'success');
    }, 900);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#0c1427] border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Official Academic Transcript Request</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Transcript Order Dispatched</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                An authenticated, registrar-sealed official transcript has been prepared for {student.firstName} {student.lastName} (Cumulative GPA: {student.gpa?.toFixed(2) || '3.88'}).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#080d1b] border border-slate-800 text-xs text-left font-mono space-y-1">
              <div className="text-slate-400">Recipient: <span className="text-white font-medium">{deliveryEmail}</span></div>
              <div className="text-slate-400">Order ID: <span className="text-indigo-400 font-medium">TRX-2026-9812-ML</span></div>
              <div className="text-slate-400">Verification Seal: <span className="text-emerald-400 font-medium">Registrar Authenticated ✓</span></div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Record</span>
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
              Official transcripts reflect completed semesters, credit weights, letter grades, and cumulative GPA. Unofficial previews can also be printed instantly.
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Purpose of Transcript
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#080d1b] border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Graduate School Application">Graduate School Application</option>
                <option value="Employment Verification">Employment Verification</option>
                <option value="Scholarship / Grant Eligibility">Scholarship / Grant Eligibility</option>
                <option value="Personal Academic Records">Personal Academic Records</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Delivery Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#080d1b] border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Official Digital E-Transcript (PDF)">Official Digital E-Transcript (PDF)</option>
                <option value="Sealed Physical Mailer">Sealed Physical Mailer</option>
                <option value="Instant Unofficial Summary">Instant Unofficial Summary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Destination Email / Delivery Address
              </label>
              <input
                type="text"
                value={deliveryEmail}
                onChange={(e) => setDeliveryEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#080d1b] border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
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
                <span>{isSubmitting ? 'Generating...' : 'Submit Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
