import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Trash2, 
  X,
  AlertCircle,
  Bell,
  Radio,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { PostAnnouncementModal } from './PostAnnouncementModal.jsx';

export const AnnouncementsView = () => {
  const { announcements, deleteAnnouncement, showToast, role } = useCollege();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const isAdminOrFaculty = role === 'admin' || role === 'faculty' || role === 'professor';

  const filteredAnnouncements = (announcements || []).filter((a) => {
    const matchSearch = 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.author && a.author.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchSearch) return false;
    if (selectedAudience !== 'all' && a.targetAudience !== selectedAudience && a.targetAudience !== 'all') return false;
    if (selectedPriority !== 'all' && a.priority !== selectedPriority) return false;
    return true;
  });

  const handleDelete = (id, title) => {
    if (!isAdminOrFaculty) return;
    if (window.confirm(`Are you sure you want to remove announcement "${title}"?`)) {
      deleteAnnouncement(id);
    }
  };

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 antialiased font-sans text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Official Campus Broadcast Network
            </span>
            <span>·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Feed Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-indigo-400" />
            <span>Campus Broadcasts & Official Announcements</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Institutional bulletins, academic directives, senate proceedings, examination schedules, and campus emergency notices.
          </p>
        </div>

        {/* Action Button: ONLY for Faculty / Admin */}
        {isAdminOrFaculty && (
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post Announcement</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0c1427] p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search announcements by title, content keywords, or author..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-800 bg-[#070b14] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-slate-500 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-800 rounded-xl bg-[#070b14] focus:outline-none focus:border-indigo-500 text-slate-200 shadow-inner cursor-pointer"
          >
            <option value="all">All Audiences</option>
            <option value="students">Students Only</option>
            <option value="faculty">Faculty &amp; Staff Only</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-800 rounded-xl bg-[#070b14] focus:outline-none focus:border-indigo-500 text-slate-200 shadow-inner cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">Urgent / High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="normal">Normal Priority</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0c1427] border border-slate-800 text-slate-400 space-y-2">
            <Megaphone className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-white">No announcements found</p>
            <p className="text-xs text-slate-500">Try clearing your search keyword or audience filter.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="bg-[#0c1427] p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-xl group space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    ann.priority === 'high'
                      ? 'text-rose-400 bg-rose-500/15 border border-rose-500/30'
                      : ann.priority === 'medium'
                      ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
                      : 'text-indigo-300 bg-indigo-500/15 border border-indigo-500/30'
                  }`}>
                    {ann.priority || 'Normal'} Priority
                  </span>
                  
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                    Target: {ann.targetAudience?.toUpperCase() || 'CAMPUS-WIDE'}
                  </span>
                  
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {ann.date}
                  </span>
                </div>

                {/* Delete button: ONLY visible to Faculty/Admin */}
                {isAdminOrFaculty && (
                  <button
                    onClick={() => handleDelete(ann.id, ann.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Remove Announcement (Faculty Administrative Access)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {ann.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1.5 font-sans">
                  {ann.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Authorized Author: <strong className="text-slate-200">{ann.author || 'Institutional Registry'}</strong> ({ann.authorRole || 'Faculty'})</span>
                </span>
                
                <span className="text-[11px] font-mono text-emerald-400 inline-flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>Live Broadcasted</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Modal: Rendered only when admin/faculty triggers it */}
      {isAdminOrFaculty && (
        <PostAnnouncementModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
        />
      )}
    </div>
  );
};
