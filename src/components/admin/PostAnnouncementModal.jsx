import React, { useState } from 'react';
import { X, Megaphone, Users, ShieldAlert, Loader2 } from 'lucide-react';
import { useCollege } from '../../context/CollegeContext.jsx';

export const PostAnnouncementModal = ({ isOpen, onClose }) => {
  const { postAnnouncement, showToast, setNotifications, currentStaffUser } = useCollege();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'all',
    priority: 'normal'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await postAnnouncement({
        ...formData,
        author: currentStaffUser?.name || 'Prof. James Carter',
        authorRole: currentStaffUser?.role || 'Faculty Administrator'
      });
      if (setNotifications && created) {
        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            title: created.title,
            message: created.content,
            type: formData.priority === 'high' ? 'alert' : 'info',
            timestamp: 'Just now',
            unread: true
          },
          ...prev
        ]);
      }
      onClose();
    } catch (err) {
      showToast('Error while posting announcement.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0f172a] border border-slate-700/80 rounded-3xl max-w-md w-full p-6 text-left shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-rose-600/25 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-md">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Broadcast Announcement</h3>
            <p className="text-xs text-slate-400">Publish institutional notice to student &amp; faculty portals</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Headline</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Important Notice: Library Hours Extended"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Target Audience</label>
            <select
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="all">All Campus (Students, Faculty, Staff)</option>
              <option value="students">Students Only</option>
              <option value="faculty">Faculty &amp; Instructors Only</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Priority Level</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="normal">Normal Information Notice</option>
              <option value="high">Urgent / High Priority Alert</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Announcement Body</label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write the full announcement text here..."
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500 leading-relaxed"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Publish Notice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
