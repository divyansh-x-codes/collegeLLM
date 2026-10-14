import React, { useState, useEffect } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { X, BookOpen, AlertCircle } from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electrical & Computer Engineering',
  'Biological & Biomedical Sciences',
  'Mathematics & Statistics',
  'Business & Economics',
];

export const CourseFormModal = ({
  isOpen,
  onClose,
  initialCourse,
}) => {
  const { addCourse, updateCourse } = useCollege();

  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [credits, setCredits] = useState(4);
  const [prerequisitesInput, setPrerequisitesInput] = useState('');
  const [capacity, setCapacity] = useState(40);
  const [instructorName, setInstructorName] = useState('Dr. Evelyn Vance');
  const [instructorTitle, setInstructorTitle] = useState('Professor & Department Chair');
  const [instructorEmail, setInstructorEmail] = useState('e.vance@unity.edu');
  const [instructorOffice, setInstructorOffice] = useState('Turing Hall 410');
  const [term, setTerm] = useState('Fall 2026');
  const [scheduleDays, setScheduleDays] = useState(['Mon', 'Wed', 'Fri']);
  const [scheduleTime, setScheduleTime] = useState('10:00 AM - 11:30 AM');
  const [room, setRoom] = useState('Hall B · Turing Amphitheater');

  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialCourse) {
      setCode(initialCourse.code);
      setTitle(initialCourse.title);
      setDescription(initialCourse.description);
      setDepartment(initialCourse.department);
      setCredits(initialCourse.credits);
      setPrerequisitesInput(initialCourse.prerequisites.join(', '));
      setCapacity(initialCourse.capacity);
      setInstructorName(initialCourse.instructor.name);
      setInstructorTitle(initialCourse.instructor.title);
      setInstructorEmail(initialCourse.instructor.email);
      setInstructorOffice(initialCourse.instructor.office);
      setTerm(initialCourse.term);
      setScheduleDays(initialCourse.schedule.days);
      setScheduleTime(initialCourse.schedule.time);
      setRoom(initialCourse.schedule.room);
    } else {
      setCode('');
      setTitle('');
      setDescription('');
      setDepartment('Computer Science & Engineering');
      setCredits(4);
      setPrerequisitesInput('');
      setCapacity(40);
      setInstructorName('Dr. Evelyn Vance');
      setInstructorTitle('Professor & Department Chair');
      setInstructorEmail('e.vance@unity.edu');
      setInstructorOffice('Turing Hall 410');
      setTerm('Fall 2026');
      setScheduleDays(['Mon', 'Wed', 'Fri']);
      setScheduleTime('10:00 AM - 11:30 AM');
      setRoom('Hall B · Turing Amphitheater');
    }
    setError(null);
  }, [initialCourse, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Course code is required (e.g. CS-301).');
      return;
    }
    if (!title.trim()) {
      setError('Course title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Course description is required.');
      return;
    }

    const prereqs = prerequisitesInput
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const coursePayload = {
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim(),
      department,
      credits: Number(credits) || 3,
      prerequisites: prereqs.length > 0 ? prereqs : ['None'],
      capacity: Number(capacity) || 30,
      instructor: {
        id: initialCourse ? initialCourse.instructor.id : `inst-${Date.now()}`,
        name: instructorName.trim(),
        title: instructorTitle.trim(),
        email: instructorEmail.trim(),
        office: instructorOffice.trim(),
      },
      term,
      schedule: {
        days: scheduleDays,
        time: scheduleTime,
        room: room.trim(),
      },
    };

    if (initialCourse) {
      updateCourse(initialCourse.id, coursePayload);
    } else {
      addCourse(coursePayload);
    }

    onClose();
  };

  const handleDayToggle = (day) => {
    setScheduleDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto modal-backdrop-animate">
      <div className="relative w-full max-w-2xl bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden my-8 modal-content-animate text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0c1427]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                {initialCourse ? `Edit Course: ${initialCourse.code}` : 'Add New Academic Course'}
              </h2>
              <p className="text-xs text-slate-400">
                Course catalog and curriculum administration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[76vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs bg-rose-950/80 text-rose-300 border border-rose-800/80 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CS-301"
                className="w-full px-3 py-2 text-xs bg-[#080d1b] border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-mono uppercase"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Advanced Algorithms & Complexity"
                className="w-full px-3 py-2 text-xs bg-[#080d1b] border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Course Description *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline syllabus, primary learning goals, algorithmic paradigms, or lab components..."
              className="w-full px-3 py-2 text-xs bg-[#080d1b] border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#080d1b] border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-[#0f172a] text-white">
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Credits
              </label>
              <select
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[#080d1b] border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-mono"
              >
                <option value={1} className="bg-[#0f172a] text-white">1 Credit</option>
                <option value={2} className="bg-[#0f172a] text-white">2 Credits</option>
                <option value={3} className="bg-[#0f172a] text-white">3 Credits</option>
                <option value={4} className="bg-[#0f172a] text-white">4 Credits</option>
                <option value={5} className="bg-[#0f172a] text-white">5 Credits</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Seat Capacity
              </label>
              <input
                type="number"
                min={5}
                max={250}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-[#080d1b] border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Prerequisites (comma-separated)
            </label>
            <input
              type="text"
              value={prerequisitesInput}
              onChange={(e) => setPrerequisitesInput(e.target.value)}
              placeholder="e.g. CS-201 Data Structures, MATH-210 Discrete Math"
              className="w-full px-3 py-2 text-xs bg-[#080d1b] border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Leave blank or write &quot;None&quot; if there are no prior prerequisites required.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-white mb-2">Faculty & Schedule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Instructor Name</label>
                <input
                  type="text"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#080d1b] border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Instructor Email</label>
                <input
                  type="email"
                  value={instructorEmail}
                  onChange={(e) => setInstructorEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#080d1b] border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Lecture Time</label>
                <input
                  type="text"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  placeholder="10:00 AM - 11:30 AM"
                  className="w-full px-3 py-2 text-xs bg-[#080d1b] border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Classroom / Hall</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Hall B · Turing Amphitheater"
                  className="w-full px-3 py-2 text-xs bg-[#080d1b] border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs text-slate-300 mb-1">Meeting Days</label>
              <div className="flex gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => {
                  const isSelected = scheduleDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow-xs'
                          : 'bg-[#080d1b] text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-md transition-colors cursor-pointer"
            >
              {initialCourse ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
