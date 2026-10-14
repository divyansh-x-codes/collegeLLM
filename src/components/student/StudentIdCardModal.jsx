import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Download, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  School,
  Building,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const StudentIdCardModal = ({ isOpen, onClose, student }) => {
  const cardRef = useRef(null);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#0c1427] border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Official Student Identity Credential</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Digital ID Card Preview */}
        <div className="p-6 flex flex-col items-center">
          <div 
            ref={cardRef}
            className="w-full max-w-md rounded-2xl p-6 bg-gradient-to-br from-[#0f172a] via-[#131f37] to-[#1e1b4b] border border-indigo-500/40 shadow-2xl relative overflow-hidden select-none"
          >
            {/* Ambient Background Watermark */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Bar with Crest */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black tracking-wider text-white uppercase">Unity College</div>
                  <div className="text-[9px] font-mono text-indigo-300">Office of the Registrar</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE · 2026–2027
              </span>
            </div>

            {/* Center Section: Photo + Metadata */}
            <div className="flex items-center gap-4 my-5 relative z-10">
              {/* Photo Box */}
              <div className="relative shrink-0">
                {student.avatarUrl ? (
                  <img 
                    src={student.avatarUrl} 
                    alt={student.firstName}
                    className="w-24 h-28 object-cover rounded-xl ring-2 ring-indigo-400/80 shadow-lg"
                  />
                ) : (
                  <div className={`w-24 h-28 rounded-xl bg-gradient-to-br ${student.avatarBg || 'from-indigo-600 to-purple-700'} text-white flex items-center justify-center font-bold text-3xl ring-2 ring-indigo-400/80 shadow-lg`}>
                    {student.firstName?.[0] || 'S'}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 ring-2 ring-[#0f172a]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              {/* Student Details */}
              <div className="space-y-1 min-w-0">
                <div className="text-[10px] font-mono text-indigo-300 font-semibold uppercase">Undergraduate Scholar</div>
                <h4 className="text-lg font-bold text-white tracking-tight leading-tight truncate">
                  {student.firstName} {student.lastName}
                </h4>
                <div className="text-xs text-indigo-200 font-medium truncate">
                  {student.program || 'B.Sc. Computer Science'}
                </div>
                <div className="text-[11px] text-slate-300 truncate">
                  {student.department || 'Computer Science & Engineering'}
                </div>
                <div className="pt-1.5 flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-white px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700">
                    ID: {student.studentId || 'STU-2024-001'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Class of 2027
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Barcode / Hologram */}
            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-[9px] font-mono text-slate-400 relative z-10">
              <div>
                <div className="text-slate-300 font-medium">Valid Thru: June 30, 2027</div>
                <div className="text-[8px] text-slate-500">Security Hash: UC-89241-MAYA</div>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-300">
                <QrCode className="w-7 h-7 text-indigo-300" />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4 text-center max-w-sm">
            This digital credential is authenticated cryptographically by Unity College Registrar & Campus Safety.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-3 bg-[#080d1b]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
