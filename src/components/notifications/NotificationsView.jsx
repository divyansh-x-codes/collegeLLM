import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  AlertTriangle, 
  CalendarClock, 
  Megaphone, 
  Calendar,
  Check,
  ArrowRight
} from 'lucide-react';

export const NotificationsView = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setActiveTab } = useCollege();
  const [filter, setFilter] = useState('all'); // 'all', 'deadline', 'schedule', 'announcement', 'unread'

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return n.unread;
    if (filter === 'deadline') return n.type === 'deadline';
    if (filter === 'schedule') return n.type === 'schedule';
    if (filter === 'announcement') return n.type === 'announcement';
    return true;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-slate-100 font-sans antialiased">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span className="font-semibold text-indigo-400">Unity College</span>
            <span>·</span>
            <span>Academic Bulletin</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-sky-400" />
            <span>Campus Notification Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed of upcoming assignment deadlines, lecture schedule changes, and official college announcements.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-300 bg-[#0c1427] border border-indigo-500/30 rounded-xl hover:bg-indigo-950/60 transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-indigo-400" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 font-semibold rounded-xl transition-colors cursor-pointer shrink-0 border ${
            filter === 'all'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : 'bg-[#0c1427] text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('deadline')}
          className={`px-3 py-1.5 font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 border ${
            filter === 'deadline'
              ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
              : 'bg-[#0c1427] text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <CalendarClock className="w-3.5 h-3.5" />
          <span>Deadlines</span>
        </button>
        <button
          onClick={() => setFilter('schedule')}
          className={`px-3 py-1.5 font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 border ${
            filter === 'schedule'
              ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
              : 'bg-[#0c1427] text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Schedule Changes</span>
        </button>
        <button
          onClick={() => setFilter('announcement')}
          className={`px-3 py-1.5 font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 border ${
            filter === 'announcement'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : 'bg-[#0c1427] text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Announcements</span>
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 font-semibold rounded-xl transition-colors cursor-pointer shrink-0 border ${
            filter === 'unread'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : 'bg-[#0c1427] text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-[#0c1427] rounded-2xl border border-slate-800 text-slate-400 text-xs italic">
            No notices found in this filter category.
          </div>
        ) : (
          filtered.map((item) => {
            const isDeadline = item.type === 'deadline';
            const isSchedule = item.type === 'schedule';

            return (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationRead(item.id);
                  if (item.linkTab) setActiveTab(item.linkTab);
                }}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-4 group hover:border-indigo-500/50 shadow-xl ${
                  item.unread
                    ? 'bg-[#0c1427] border-indigo-500/30'
                    : 'bg-[#0c1427]/70 border-slate-800/80 hover:bg-[#0c1427]'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    isDeadline
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : isSchedule
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  }`}>
                    {isDeadline ? (
                      <CalendarClock className="w-4 h-4" />
                    ) : isSchedule ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Megaphone className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-800">
                        {item.courseCode}
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </span>
                      {item.urgent && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider font-mono">
                          Urgent
                        </span>
                      )}
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 animate-pulse" />
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                      {item.dueDate && (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Due: {item.dueDate}</span>
                        </span>
                      )}
                      {item.effectiveDate && (
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.effectiveDate}</span>
                        </span>
                      )}
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  {item.unread && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationRead(item.id);
                      }}
                      className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 whitespace-nowrap cursor-pointer hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
