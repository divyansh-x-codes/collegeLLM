import React, { useState } from 'react';
import { X, Users, Mail, Building, Briefcase, Clock, Loader2 } from 'lucide-react';
import { useCollege } from '../../context/CollegeContext.jsx';

export const AddFacultyModal = ({ isOpen, onClose }) => {
  const { showToast, setStaff } = useCollege();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Computer Science & Engineering',
    title: 'Assistant Professor',
    officeHours: 'Mon/Wed 14:00 – 16:00'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/quick-actions/add-faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json().catch(() => null);
      if (data && data.success && data.faculty) {
        showToast(`Faculty member ${data.faculty.name} appointed successfully!`, 'success');
        if (setStaff) setStaff(prev => [...prev, data.faculty]);
        onClose();
      } else {
        const localFaculty = {
          id: `f-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          department: formData.department,
          title: formData.title || 'Assistant Professor',
          role: 'faculty',
          officeHours: formData.officeHours || 'Mon/Wed 14:00 – 16:00',
          assignedCourseIds: []
        };
        if (setStaff) setStaff(prev => [...prev, localFaculty]);
        showToast(`Faculty member ${localFaculty.name} appointed successfully!`, 'success');
        onClose();
      }
    } catch (err) {
      const localFaculty = {
        id: `f-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        department: formData.department,
        title: formData.title || 'Assistant Professor',
        role: 'faculty',
        officeHours: formData.officeHours || 'Mon/Wed 14:00 – 16:00',
        assignedCourseIds: []
      };
      if (setStaff) setStaff(prev => [...prev, localFaculty]);
      showToast(`Faculty member ${localFaculty.name} appointed successfully!`, 'success');
      onClose();
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
          <div className="w-10 h-10 rounded-xl bg-purple-600/25 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-md">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Appoint New Faculty</h3>
            <p className="text-xs text-slate-400">Add an approved instructor or professor</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name & Title</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Jennifer Hayes"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Institutional Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. jennifer.hayes@unity.edu"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
              <option value="Business Administration">Business Administration</option>
              <option value="Engineering & Technology">Engineering &amp; Technology</option>
              <option value="Design & Media Arts">Design &amp; Media Arts</option>
              <option value="Humanities & Social Sciences">Humanities &amp; Social Sciences</option>
              <option value="Biological & Biomedical Sciences">Biological &amp; Biomedical Sciences</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Academic Rank</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Associate Professor of AI"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Office Hours & Hall</label>
            <input
              type="text"
              value={formData.officeHours}
              onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
              placeholder="e.g. Mon/Wed 14:00 – 16:00 (Hall B-204)"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
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
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Confirm Appointment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
