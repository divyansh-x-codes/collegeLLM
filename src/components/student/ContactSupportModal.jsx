import React, { useState } from 'react';
import { 
  X, 
  Headphones, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Mail,
  UserCheck,
  Building
} from 'lucide-react';
import { useCollege } from '../../context/CollegeContext.jsx';

export const ContactSupportModal = ({ isOpen, onClose, student }) => {
  const { showToast } = useCollege();
  const [topic, setTopic] = useState('Academic Advising / Degree Audit');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !student) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Support ticket dispatched to Office of Student Affairs', 'success');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0c1427] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-sm">Academic Support & Advisory Desk</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Ticket Submitted Successfully</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Your inquiry has been routed to your designated academic advisor, <strong>{student.advisor || 'Prof. Dr. Evelyn Vance'}</strong>. An email notification will be sent to {student.email}.
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setMessage('');
                onClose();
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Advisor Card */}
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="text-purple-300 font-semibold">Assigned Academic Advisor</div>
                <div className="text-white font-bold">{student.advisor || 'Prof. Dr. Evelyn Vance'}</div>
                <div className="text-slate-400 text-[11px] font-mono">e.vance@unity.edu · Turing Hall 410</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Support Category
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#080d1b] border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Academic Advising / Degree Audit">Academic Advising / Degree Audit</option>
                <option value="Course Registration & Prerequisites">Course Registration & Prerequisites</option>
                <option value="Attendance Dispute / Excuse">Attendance Dispute / Excuse</option>
                <option value="IT Support & Portal Assistance">IT Support & Portal Assistance</option>
                <option value="Financial Aid / Registrar Inquiry">Financial Aid / Registrar Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Your Message / Request
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Explain what you need assistance with..."
                className="w-full px-3 py-2.5 rounded-xl bg-[#080d1b] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
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
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg shadow-md transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
