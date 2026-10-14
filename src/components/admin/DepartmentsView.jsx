import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Building2, 
  Plus, 
  Users, 
  BookOpen, 
  DollarSign, 
  Edit, 
  Trash2, 
  X, 
  GraduationCap,
  ShieldCheck,
  Search
} from 'lucide-react';

export const DepartmentsView = () => {
  const { departments, courses, students, addDepartment, updateDepartment, deleteDepartment, showToast } = useCollege();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  // Form states for Add
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [chair, setChair] = useState('');
  const [budget, setBudget] = useState('$1.5M');

  const filteredDepts = (departments || []).filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.chair && d.chair.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      showToast('Department Code and Name are required.', 'error');
      return;
    }
    addDepartment({
      code: code.toUpperCase().trim(),
      name: name.trim(),
      chair: chair.trim() || 'Prof. Unassigned',
      budget: budget.trim() || '$1.0M',
      studentCount: 150,
      facultyCount: 15
    });
    setCode('');
    setName('');
    setChair('');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingDept) return;
    updateDepartment(editingDept.id, {
      code: editingDept.code.toUpperCase().trim(),
      name: editingDept.name.trim(),
      chair: editingDept.chair,
      budget: editingDept.budget
    });
    setEditingDept(null);
  };

  const handleDelete = (id, deptCode) => {
    if (window.confirm(`Are you sure you want to archive department ${deptCode}?`)) {
      deleteDepartment(id);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 antialiased font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Academic Departments & Faculty Divisions</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional faculties, academic schools, chairs of study, and curriculum resource allocations
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0c1427] p-3.5 rounded-xl border border-slate-800/90 shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search departments by code (e.g. CSE), name, or department chair..."
            className="w-full pl-9 pr-8 py-2 text-xs border border-slate-700/80 rounded-lg bg-[#070b14] text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepts.map((dept) => {
          const deptCourses = courses.filter(c => c.department?.toLowerCase() === dept.name?.toLowerCase());
          const deptStudents = students.filter(s => s.department?.toLowerCase() === dept.name?.toLowerCase());

          return (
            <div
              key={dept.id}
              className="bg-[#0c1427] p-5 rounded-xl border border-slate-800/90 hover:border-indigo-500/50 shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-md">
                    {dept.code}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingDept(dept)}
                      className="p-1 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit Department"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id, dept.code)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Archive Department"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-slate-100 text-sm leading-snug group-hover:text-indigo-300 transition-colors">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Chair: <strong className="text-slate-200">{dept.chair}</strong>
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#070b14] p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Faculty</div>
                  <div className="font-mono text-sm font-bold text-slate-200 mt-0.5">{dept.facultyCount || 18}</div>
                </div>
                <div className="bg-[#070b14] p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Students</div>
                  <div className="font-mono text-sm font-bold text-slate-200 mt-0.5">{deptStudents.length || dept.studentCount || 240}</div>
                </div>
                <div className="bg-[#070b14] p-2 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Budget</div>
                  <div className="font-mono text-sm font-bold text-emerald-400 mt-0.5">{dept.budget || '$1.2M'}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Department Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs modal-backdrop-animate">
          <div className="relative w-full max-w-md bg-[#0c1427] text-slate-100 rounded-xl shadow-2xl border border-slate-800 overflow-hidden modal-content-animate">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#080d1b]">
              <h2 className="text-sm font-bold text-slate-100">Add Academic Department</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department Code *</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CSE, ENG, BIO"
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 font-mono focus:ring-2 focus:ring-indigo-500 uppercase"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Department of Artificial Intelligence"
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department Chair</label>
                <input
                  type="text"
                  value={chair}
                  onChange={(e) => setChair(e.target.value)}
                  placeholder="e.g. Prof. Dr. Alan Turing"
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Allocated Budget</label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. $1.5M"
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
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
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs modal-backdrop-animate">
          <div className="relative w-full max-w-md bg-[#0c1427] text-slate-100 rounded-xl shadow-2xl border border-slate-800 overflow-hidden modal-content-animate">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#080d1b]">
              <h2 className="text-sm font-bold text-slate-100">Edit Department: {editingDept.code}</h2>
              <button onClick={() => setEditingDept(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department Code</label>
                <input
                  type="text"
                  value={editingDept.code}
                  onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 font-mono uppercase focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department Name</label>
                <input
                  type="text"
                  value={editingDept.name}
                  onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department Chair</label>
                <input
                  type="text"
                  value={editingDept.chair || ''}
                  onChange={(e) => setEditingDept({ ...editingDept, chair: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Allocated Budget</label>
                <input
                  type="text"
                  value={editingDept.budget || ''}
                  onChange={(e) => setEditingDept({ ...editingDept, budget: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-100 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingDept(null)}
                  className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
