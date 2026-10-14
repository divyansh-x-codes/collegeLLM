import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  HelpCircle, 
  Headphones, 
  Mail, 
  Building, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  MessageSquare,
  FileText,
  UserCheck
} from 'lucide-react';
import { ContactSupportModal } from './ContactSupportModal.jsx';

export const StudentSupportView = () => {
  const { currentStudent } = useCollege();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const student = currentStudent || {
    firstName: 'Maya',
    advisor: 'Prof. Dr. Evelyn Vance'
  };

  const faqs = [
    { q: 'How do I request an official sealed academic transcript?', a: 'Navigate to Academic Progress or Quick Actions on your dashboard, click "Request Transcript", select your application purpose, and submit. Transcripts are dispatched within 24 hours.' },
    { q: 'What is the minimum attendance requirement policy at Unity College?', a: 'Institutional policy requires a minimum of 75% attendance in all core lectures and laboratory sessions. Attendance below 75% triggers an academic advisory warning.' },
    { q: 'How do I add or drop a course after the semester begins?', a: 'Course registration can be modified during the official Add/Drop window (first two weeks of the term) via the Course Registration action on your dashboard.' },
    { q: 'Where can I access digital textbooks and IEEE research archives?', a: 'Visit the Digital Library section in the left sidebar to access catalog e-books and direct authenticated SSO links to IEEE Xplore and ACM Digital Library.' }
  ];

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-slate-100 font-sans antialiased">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-0.5">
            <span className="text-purple-400 font-semibold">Office of Student Affairs & Academic Success</span>
            <span>·</span>
            <span>24/7 Digital Helpdesk</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Headphones className="w-6 h-6 text-purple-400" />
            <span>Student Help & Advisory Support Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Get academic guidance, submit helpdesk requests, or contact your faculty advisor.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Message Advisor / Support</span>
        </button>
      </div>

      {/* Advisory & Helpdesk Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-300">ACADEMIC ADVISOR</div>
          <div className="font-bold text-white text-sm">{student.advisor || 'Prof. Dr. Evelyn Vance'}</div>
          <p className="text-xs text-slate-400">Office: Turing Hall 410 · Hours: Tue/Thu 10:00 - 12:00</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 pt-2 block cursor-pointer"
          >
            Schedule Advising Session →
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-300">REGISTRAR & RECORDS</div>
          <div className="font-bold text-white text-sm">Eleanor Vance, University Registrar</div>
          <p className="text-xs text-slate-400">Email: registrar@unity.edu · Hall of Administration 201</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 pt-2 block cursor-pointer"
          >
            Registrar Inquiry →
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-300">IT & PORTAL HELPDESK</div>
          <div className="font-bold text-white text-sm">Campus Information Systems</div>
          <p className="text-xs text-slate-400">Email: helpdesk@unity.edu · Hotline: ext 4357</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 pt-2 block cursor-pointer"
          >
            Submit IT Support Ticket →
          </button>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="p-6 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-bold text-white">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Frequently Asked Questions</span>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#080d1b] border border-slate-800/80 space-y-1.5">
              <h4 className="text-xs font-bold text-white">{faq.q}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <ContactSupportModal
        student={student}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
