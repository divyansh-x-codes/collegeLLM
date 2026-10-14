import React, { useState, useMemo } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Mail, 
  Building2, 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  Edit, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  X,
  LayoutGrid,
  List,
  Users,
  Award,
  GraduationCap,
  Sparkles,
  Phone,
  Calendar,
  Layers,
  MapPin
} from 'lucide-react';

export const FacultyStaffView = ({ onOpenAddFaculty }) => {
  const { staff, courses, updateFaculty, deleteFaculty, showToast } = useCollege();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [editingStaff, setEditingStaff] = useState(null);
  const [detailStaff, setDetailStaff] = useState(null);

  const departments = [
    'All',
    'Computer Science & Engineering',
    'Electrical & Computer Engineering',
    'Biological & Biomedical Sciences',
    'Mathematics & Statistics',
    'Business Administration',
    'Design & Media Arts',
    'Deanery Registry & System Control',
    'Institutional Administration & Deanery',
    'Office of Academic Affairs & Matriculation'
  ];

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        (member.title && member.title.toLowerCase().includes(q)) ||
        (member.department && member.department.toLowerCase().includes(q));

      if (!matchSearch) return false;
      if (selectedDept !== 'All' && member.department !== selectedDept) return false;
      if (selectedRole !== 'All' && member.role !== selectedRole) return false;
      return true;
    });
  }, [staff, searchTerm, selectedDept, selectedRole]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove the faculty/staff account for ${name}?`)) {
      deleteFaculty(id);
      showToast(`Removed staff account for ${name}.`, 'info');
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingStaff) return;
    updateFaculty(editingStaff.id, {
      name: editingStaff.name,
      title: editingStaff.title,
      department: editingStaff.department,
      officeHours: editingStaff.officeHours,
      role: editingStaff.role,
      email: editingStaff.email
    });
    showToast(`Updated profile for ${editingStaff.name}.`, 'success');
    setEditingStaff(null);
  };

  // Get assigned courses object for a faculty
  const getFacultyCourses = (member) => {
    return courses.filter((c) =>
      member.assignedCourseIds?.includes(c.id) || 
      (c.instructor && typeof c.instructor === 'string' && c.instructor.includes(member.name)) ||
      (c.instructor && typeof c.instructor === 'object' && c.instructor.name === member.name)
    );
  };

  const totalAssignedCourses = courses.length;

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-7 text-slate-100 font-sans antialiased">
      
      {/* 1. Page Header Banner */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 pb-6 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Faculty Governance
            </span>
            <span>·</span>
            <span className="text-teal-400 font-mono">Academic Year 2026–2027</span>
            <span>·</span>
            <span className="text-slate-300">Active Faculty &amp; Staff Registry</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 shadow-md shadow-purple-500/10">
              <UserCheck className="w-7 h-7" />
            </div>
            <span>Faculty &amp; Academic Staff Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Institutional professors, department chairs, researchers, and active course instruction assignments across Unity College divisions.
          </p>
        </div>

        {/* Top Actions: Search, View Mode Toggle & Appoint Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, title, department..."
              className="pl-10 pr-4 py-2 rounded-xl bg-[#0c1427] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 w-64 shadow-inner"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-2.5 text-slate-500 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Switcher: Grid vs Table */}
          <div className="flex items-center p-1 rounded-xl bg-[#0c1427] border border-slate-800 shadow-inner">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* Add Faculty Action Button */}
          <button
            onClick={onOpenAddFaculty}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl transition-all shadow-md shadow-purple-950/40 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Appoint Faculty / Staff</span>
          </button>
        </div>
      </div>

      {/* 2. Top Academic Faculty KPI Cards (4 Modern Box-Style Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Faculty &amp; Staff</p>
            <p className="text-2xl font-extrabold text-white mt-1">{staff.length} Appointed</p>
            <p className="text-[11px] text-purple-400 mt-0.5 font-mono">Across 6 Academic Divisions</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Tenured Chairs &amp; Deans</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">34 Chairs</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Doctoral Faculty &amp; Deans</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Active Teaching Load</p>
            <p className="text-2xl font-extrabold text-indigo-300 mt-1">{totalAssignedCourses} Modules</p>
            <p className="text-[11px] text-teal-400 mt-0.5 font-mono">100% Curriculum Coverage</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1427] border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Office Hours Coverage</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">98.2% Active</p>
            <p className="text-[11px] text-amber-300 mt-0.5 font-mono">Direct Student Consultations</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Filter Chips and Role Selector Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#0c1427] p-3.5 rounded-2xl border border-slate-800 shadow-md">
        {/* Department Horizontal Scroll Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pl-1 shrink-0 font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Division:
          </span>
          {[
            { id: 'All', label: 'All Divisions' },
            { id: 'Computer Science & Engineering', label: 'Computer Science' },
            { id: 'Electrical & Computer Engineering', label: 'Electrical Eng.' },
            { id: 'Biological & Biomedical Sciences', label: 'Biomedical' },
            { id: 'Mathematics & Statistics', label: 'Mathematics' },
            { id: 'Business Administration', label: 'Business' },
            { id: 'Design & Media Arts', label: 'Design' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedDept(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                selectedDept === item.id
                  ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-200 border-purple-500/40 shadow-sm'
                  : 'bg-[#080d1b] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Role Filter & Counter */}
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-800 rounded-xl bg-[#080d1b] focus:outline-none focus:border-purple-500 text-slate-200 shadow-inner cursor-pointer"
          >
            <option value="All">All Roles ({staff.length})</option>
            <option value="faculty">Faculty &amp; Professors</option>
            <option value="admin">Administrators</option>
            <option value="registrar">Academic Registrars</option>
            <option value="superadmin">Super Administrators</option>
          </select>

          {(searchTerm || selectedDept !== 'All' || selectedRole !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('All');
                setSelectedRole('All');
              }}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer underline underline-offset-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. Display Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="font-mono text-purple-300">{filteredStaff.length}</strong> of{' '}
          <strong className="font-mono text-white">{staff.length}</strong> faculty &amp; staff profiles
        </span>
        <span className="font-mono text-[11px] text-slate-500">
          Unity Faculty Registry • Fall 2026
        </span>
      </div>

      {/* 5. VIEW MODE A: MODERN GRID CARDS VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredStaff.map((member) => {
            const facultyCourses = getFacultyCourses(member);

            return (
              <div
                key={member.id}
                className="p-6 rounded-3xl bg-[#0c1427] border border-slate-800 hover:border-purple-500/50 transition-all duration-200 shadow-xl flex flex-col justify-between space-y-5 group relative overflow-hidden"
              >
                {/* Subtle Ambient Hover Glow */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/10 transition-all" />

                <div>
                  {/* Card Header: Avatar & Status + Role Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-purple-600/30 shrink-0">
                          {member.name.replace(/^(Dr\.|Prof\.|Prof\. Dr\.)\s*/i, '').charAt(0) || 'F'}
                        </div>
                        {/* Live active dot */}
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0c1427] rounded-full" />
                      </div>
                      
                      <div className="min-w-0">
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-900/90 px-2.5 py-0.5 rounded-lg border border-slate-800 block truncate max-w-[180px]">
                          {member.department.split('&')[0].trim()}
                        </span>
                      </div>
                    </div>

                    {/* Role Tag */}
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shadow-sm ${
                      member.role === 'admin' || member.role === 'superadmin'
                        ? 'text-purple-300 bg-purple-500/15 border-purple-500/30'
                        : member.role === 'registrar'
                        ? 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                        : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                    }`}>
                      {member.role || 'FACULTY'}
                    </span>
                  </div>

                  {/* Name and Title */}
                  <h3 className="text-lg font-extrabold text-white group-hover:text-purple-300 transition-colors leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium mt-1 leading-snug">
                    {member.title || 'Appointed Faculty Member'}
                  </p>
                  <p className="text-[11px] text-purple-400 font-mono mt-0.5">
                    {member.department}
                  </p>

                  {/* Contact & Consultation Box */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-[#080d1b] border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <a 
                        href={`mailto:${member.email}`}
                        className="truncate hover:text-purple-300 transition-colors"
                        title={member.email}
                      >
                        {member.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate text-slate-300">
                        {member.officeHours || 'Consultations by Appointment'}
                      </span>
                    </div>
                  </div>

                  {/* Assigned Courses Section */}
                  <div className="mt-4 pt-3.5 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Assigned Modules:</span>
                      </span>
                      <span className="text-indigo-300 font-bold">
                        {facultyCourses.length} {facultyCourses.length === 1 ? 'Course' : 'Courses'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {facultyCourses.length > 0 ? (
                        facultyCourses.map((c) => (
                          <span
                            key={c.id}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                            title={c.title}
                          >
                            {c.code}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">No semester courses assigned</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setDetailStaff(member)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-200 bg-[#080d1b] hover:bg-slate-800 hover:text-white rounded-xl border border-slate-800 hover:border-purple-500/30 transition-all cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setEditingStaff(member)}
                    className="p-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-slate-800 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
                    title="Edit Record"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-colors cursor-pointer"
                    title="Withdraw Account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. VIEW MODE B: ROSTER TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-[#0c1427] rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#080d1b] border-b border-slate-800 text-slate-400 font-semibold text-[11px] tracking-wider uppercase font-mono select-none">
                <tr>
                  <th className="py-4 px-5">Faculty Scholar</th>
                  <th className="py-4 px-5">Title &amp; Academic Division</th>
                  <th className="py-4 px-5">System Role</th>
                  <th className="py-4 px-5">Assigned Modules</th>
                  <th className="py-4 px-5">Office Consultation</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {filteredStaff.map((member) => {
                  const facultyCourses = getFacultyCourses(member);

                  return (
                    <tr key={member.id} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                            {member.name.replace(/^(Dr\.|Prof\.|Prof\. Dr\.)\s*/i, '').charAt(0) || 'F'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                              {member.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department & Title */}
                      <td className="py-3.5 px-5">
                        <div className="text-slate-200 font-semibold leading-tight">{member.title || 'Faculty Member'}</div>
                        <div className="text-[11px] text-purple-400 font-mono mt-0.5 truncate max-w-xs">{member.department}</div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          member.role === 'admin' || member.role === 'superadmin'
                            ? 'text-purple-300 bg-purple-500/15 border border-purple-500/30'
                            : member.role === 'registrar'
                            ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30'
                            : 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30'
                        }`}>
                          {member.role || 'FACULTY'}
                        </span>
                      </td>

                      {/* Assigned Courses */}
                      <td className="py-3.5 px-5">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {facultyCourses.length > 0 ? (
                            facultyCourses.map((c) => (
                              <span 
                                key={c.id} 
                                className="font-mono text-[10px] font-bold bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/25"
                                title={c.title}
                              >
                                {c.code}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 text-[11px] italic">None</span>
                          )}
                        </div>
                      </td>

                      {/* Office Hours */}
                      <td className="py-3.5 px-5 text-slate-300 font-mono text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{member.officeHours || 'By Appointment'}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setDetailStaff(member)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            title="View Full Profile"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingStaff(member)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id, member.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Withdraw Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          FACULTY PROFILE & ASSIGNED COURSES DETAIL MODAL
      ========================================================================= */}
      {detailStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c1427] border border-slate-700 shadow-2xl p-6 sm:p-7 text-slate-100 font-sans space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-purple-600/30">
                  {detailStaff.name.replace(/^(Dr\.|Prof\.|Prof\. Dr\.)\s*/i, '').charAt(0) || 'F'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {detailStaff.role?.toUpperCase() || 'FACULTY'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Unity College Staff ID: {detailStaff.id}</span>
                  </div>
                  <h3 className="font-extrabold text-white text-xl mt-1">{detailStaff.name}</h3>
                  <p className="text-xs text-purple-400 font-medium">{detailStaff.title}</p>
                </div>
              </div>

              <button
                onClick={() => setDetailStaff(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Department & Consultation Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#080d1b] border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Academic Division</span>
                <p className="font-bold text-white text-sm">{detailStaff.department}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#080d1b] border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Office &amp; Consultations</span>
                <p className="font-bold text-amber-300 text-sm">{detailStaff.officeHours || 'By Appointment'}</p>
              </div>
            </div>

            {/* Email Contact Direct Link */}
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 block">Institutional Email</span>
                <p className="text-sm font-mono font-semibold text-white mt-0.5">{detailStaff.email}</p>
              </div>
              <a
                href={`mailto:${detailStaff.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>
            </div>

            {/* Assigned Courses Roster */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Assigned Curriculum Courses</span>
                </span>
                <span className="text-indigo-400 font-bold">
                  {getFacultyCourses(detailStaff).length} Modules
                </span>
              </div>

              <div className="space-y-2">
                {getFacultyCourses(detailStaff).length > 0 ? (
                  getFacultyCourses(detailStaff).map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-[#080d1b] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                            {c.code}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{c.credits} Credits</span>
                        </div>
                        <h4 className="font-bold text-white text-sm mt-1">{c.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {c.schedule?.days?.join(', ') || 'Scheduled'} · {c.schedule?.time || 'TBD'}
                        </p>
                      </div>

                      <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
                        <span className="text-[11px] font-mono text-emerald-400 block">
                          {c.schedule?.room || 'Amphitheater'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {c.enrolledStudentIds?.length || 0} Students Enrolled
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 rounded-2xl bg-[#080d1b] border border-slate-800 text-center text-xs text-slate-500">
                    No active course modules currently assigned to this faculty member for Fall 2026.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setEditingStaff(detailStaff);
                  setDetailStaff(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-[#080d1b] hover:bg-slate-800 border border-slate-800 cursor-pointer"
              >
                Edit Faculty Details
              </button>

              <button
                onClick={() => setDetailStaff(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          EDIT FACULTY PROFILE MODAL
      ========================================================================= */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0c1427] text-slate-100 rounded-3xl shadow-2xl border border-slate-700 p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base font-extrabold text-white">Edit Faculty Profile</h2>
                <p className="text-xs text-slate-400 mt-0.5">{editingStaff.name}</p>
              </div>
              <button 
                onClick={() => setEditingStaff(null)} 
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name &amp; Degree Title</label>
                <input
                  type="text"
                  value={editingStaff.name}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-700 rounded-xl bg-[#070b14] text-white focus:outline-none focus:border-purple-500 shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Academic Designation / Title</label>
                <input
                  type="text"
                  value={editingStaff.title || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-700 rounded-xl bg-[#070b14] text-white focus:outline-none focus:border-purple-500 shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Institutional Email</label>
                <input
                  type="email"
                  value={editingStaff.email || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-700 rounded-xl bg-[#070b14] text-white focus:outline-none focus:border-purple-500 shadow-inner"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Academic Division</label>
                  <select
                    value={editingStaff.department}
                    onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs border border-slate-700 rounded-xl bg-[#070b14] text-white focus:outline-none focus:border-purple-500 cursor-pointer shadow-inner"
                  >
                    {departments.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d} className="bg-[#070b14] text-slate-100">{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">System Role</label>
                  <select
                    value={editingStaff.role || 'faculty'}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs border border-slate-700 rounded-xl bg-[#070b14] text-white focus:outline-none focus:border-purple-500 cursor-pointer shadow-inner"
                  >
                    <option value="faculty">Faculty &amp; Professor</option>
                    <option value="admin">Administrator</option>
                    <option value="registrar">Academic Registrar</option>
                    <option value="superadmin">Super Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Office Location &amp; Consultation Hours</label>
                <input
                  type="text"
                  value={editingStaff.officeHours || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, officeHours: e.target.value })}
                  placeholder="e.g. Mon/Wed 14:00 - 16:00 (Hall B-204)"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-700 rounded-xl bg-[#070b14] text-white focus:outline-none focus:border-purple-500 shadow-inner"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md shadow-purple-950/40 cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
