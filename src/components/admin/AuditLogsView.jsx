import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Activity, 
  Search, 
  ShieldCheck, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  FileText,
  Filter,
  Download
} from 'lucide-react';

export const AuditLogsView = () => {
  const { auditLogs, showToast } = useCollege();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('All');

  const filteredLogs = (auditLogs || []).filter(log => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (log.actor && log.actor.toLowerCase().includes(q)) ||
      (log.action && log.action.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q));

    if (!matchSearch) return false;
    if (selectedAction !== 'All' && log.action !== selectedAction) return false;
    return true;
  });

  const handleExportLogs = () => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `unity_audit_logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Audit log telemetry exported to JSON.', 'info');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 antialiased font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <span>Enterprise Audit Logs & Security Telemetry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable transaction trail for student enrollments, grade publications, faculty provisions, and institutional security changes
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/90 border border-slate-700/80 rounded-lg hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Trail</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0c1427] p-3.5 rounded-xl border border-slate-800/90 shadow-md flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by actor, action type, or event description..."
            className="w-full pl-9 pr-8 py-2 text-xs border border-slate-700/80 rounded-lg bg-[#070b14] text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-700/80 rounded-lg bg-[#070b14] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 shadow-inner cursor-pointer"
        >
          <option value="All" className="bg-[#070b14]">All Action Types</option>
          <option value="PORTAL_ACCESS" className="bg-[#070b14]">PORTAL_ACCESS</option>
          <option value="USER_ROLE_CHANGED" className="bg-[#070b14]">USER_ROLE_CHANGED</option>
          <option value="FACULTY_CREATED" className="bg-[#070b14]">FACULTY_CREATED</option>
          <option value="DEPARTMENT_CREATED" className="bg-[#070b14]">DEPARTMENT_CREATED</option>
          <option value="TERM_ACTIVATED" className="bg-[#070b14]">TERM_ACTIVATED</option>
          <option value="EXAM_SCHEDULED" className="bg-[#070b14]">EXAM_SCHEDULED</option>
          <option value="ANNOUNCEMENT_POSTED" className="bg-[#070b14]">ANNOUNCEMENT_POSTED</option>
        </select>
      </div>

      {/* Audit Table */}
      <div className="bg-[#0c1427] rounded-xl border border-slate-800/90 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#080d1b] border-b border-slate-800/90 text-slate-400 font-semibold text-[11px] tracking-wide uppercase select-none">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Transaction Details</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                  </td>
                  <td className="py-3 px-4 text-slate-200 font-medium font-sans">
                    {log.actor || 'Administrator'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans text-xs">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{log.status || 'Verified'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
