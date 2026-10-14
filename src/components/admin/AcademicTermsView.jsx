import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  CalendarCheck2, 
  Sparkles, 
  Edit, 
  X,
  AlertCircle
} from 'lucide-react';

export const AcademicTermsView = () => {
  const { academicTerms, addAcademicTerm, setActiveAcademicTerm, showToast } = useCollege();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [termName, setTermName] = useState('Academic Year 2027–2028');
  const [termType, setTermType] = useState('Fall Term');
  const [termCode, setTermCode] = useState('AY27-F');
  const [startDate, setStartDate] = useState('2027-08-25');
  const [endDate, setEndDate] = useState('2027-12-18');
  const [isCurrent, setIsCurrent] = useState(false);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!termName.trim() || !termType.trim()) {
      showToast('Term Name and Period are required.', 'error');
      return;
    }
    addAcademicTerm({
      name: termName.trim(),
      term: termType.trim(),
      code: termCode.trim().toUpperCase(),
      startDate,
      endDate,
      isCurrent
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 antialiased font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>Academic Terms & Semester Calendars</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Authoritative institutional academic cycles, examination periods, and active registration windows
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Academic Term</span>
        </button>
      </div>

      {/* Active Term Hero Banner */}
      {academicTerms.find(t => t.isCurrent) && (
        <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/70 via-[#0c1427] to-purple-950/40 border border-indigo-500/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shrink-0">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Institutional Term
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {academicTerms.find(t => t.isCurrent)?.code}
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">
                {academicTerms.find(t => t.isCurrent)?.name} — {academicTerms.find(t => t.isCurrent)?.term}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Session duration: {academicTerms.find(t => t.isCurrent)?.startDate} through {academicTerms.find(t => t.isCurrent)?.endDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              All student & faculty dashboards currently synchronized to this term.
            </span>
          </div>
        </div>
      )}

      {/* Terms Table */}
      <div className="bg-[#0c1427] rounded-xl border border-slate-800/90 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800/80 bg-[#080d1b] flex items-center justify-between">
          <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
            All Academic Cycles & Registration Windows
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {academicTerms.length} configured terms
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#080d1b]/60 border-b border-slate-800 text-slate-400 font-semibold text-[11px] tracking-wide uppercase select-none">
              <tr>
                <th className="py-3 px-4">Term Code</th>
                <th className="py-3 px-4">Academic Year & Session</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">End Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {academicTerms.map((term) => (
                <tr key={term.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                    {term.code}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-100">{term.name}</div>
                    <div className="text-slate-400 text-[11px]">{term.term}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {term.startDate}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {term.endDate}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                      term.isCurrent
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                        : term.status === 'Upcoming'
                        ? 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/30'
                        : 'text-slate-400 bg-slate-800'
                    }`}>
                      {term.isCurrent ? 'ACTIVE' : term.status?.toUpperCase() || 'COMPLETED'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {term.isCurrent ? (
                      <span className="text-[11px] text-emerald-400 font-medium inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Current Session</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveAcademicTerm(term.id)}
                        className="px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-700/60 rounded-lg transition-colors cursor-pointer"
                      >
                        Set as Active
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Academic Term Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs modal-backdrop-animate">
          <div className="relative w-full max-w-md bg-[#0c1427] text-slate-100 rounded-xl shadow-2xl border border-slate-800 overflow-hidden modal-content-animate">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#080d1b]">
              <h2 className="text-sm font-bold text-slate-100">Create Academic Term</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Year</label>
                <input
                  type="text"
                  value={termName}
                  onChange={(e) => setTermName(e.target.value)}
                  placeholder="e.g. Academic Year 2026–2027"
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Semester / Term</label>
                  <select
                    value={termType}
                    onChange={(e) => setTermType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Fall Term" className="bg-[#070b14]">Fall Term</option>
                    <option value="Spring Term" className="bg-[#070b14]">Spring Term</option>
                    <option value="Summer Term" className="bg-[#070b14]">Summer Term</option>
                    <option value="Winter Intensive" className="bg-[#070b14]">Winter Intensive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Term Code</label>
                  <input
                    type="text"
                    value={termCode}
                    onChange={(e) => setTermCode(e.target.value)}
                    placeholder="e.g. AY27-F"
                    className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 font-mono uppercase focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCurrent}
                    onChange={(e) => setIsCurrent(e.target.checked)}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Immediately set as the active institutional session</span>
                </label>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer shadow-md"
                >
                  Create Term
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
