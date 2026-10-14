import React, { useState, useMemo } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  UserPlus, 
  Search, 
  X, 
  AlertTriangle, 
  LayoutGrid, 
  List, 
  ExternalLink,
  GraduationCap,
  Download,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { StudentRegisterModal } from './StudentRegisterModal.jsx';
import { StudentDetailDrawer } from './StudentDetailDrawer.jsx';
import { TableDensityToggle } from '../common/TableDensityToggle.jsx';

const DEPARTMENTS = [
  'All Departments',
  'Computer Science & Engineering',
  'Electrical & Computer Engineering',
  'Biological & Biomedical Sciences',
  'Mathematics & Statistics',
  'Business & Economics',
];

const YEARS = ['All Years', 'Freshman', 'Sophomore', 'Junior', 'Senior'];

export const StudentRegistrationView = ({
  isRegisterModalOpen,
  setIsRegisterModalOpen,
}) => {
  const { students, role, isCompactMode, showToast } = useCollege();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [detailStudent, setDetailStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        student.firstName.toLowerCase().includes(q) ||
        student.lastName.toLowerCase().includes(q) ||
        student.studentId.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        student.program.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (selectedDept !== 'All Departments' && student.department !== selectedDept) {
        return false;
      }

      if (selectedYear !== 'All Years' && student.year !== selectedYear) {
        return false;
      }

      if (selectedStatus !== 'all' && student.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [students, searchTerm, selectedDept, selectedYear, selectedStatus]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const handleExportCsv = () => {
    window.open('/api/admin/reports/export-csv', '_blank');
    showToast('Exporting student roster to CSV file...', 'info');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 antialiased font-sans">
      {/* Top Header Banner matching exact screenshot reference */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>Student Directory & Academic Matriculation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional student records, academic standings, cumulative GPAs, and advisor assignments
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <TableDensityToggle />

          <button
            onClick={handleExportCsv}
            title="Download CSV report"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/90 border border-slate-700/80 rounded-lg hover:bg-slate-700 hover:text-white transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          {(role === 'admin' || role === 'professor' || role === 'faculty') && (
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Student</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-[#0c1427] p-3.5 rounded-xl border border-slate-800/90 space-y-3 shadow-md">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name, ID (e.g. STU-2024-001), or email..."
              className="w-full pl-9 pr-8 py-2 text-xs border border-slate-700/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#070b14] text-slate-100 placeholder:text-slate-500 shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Department filter */}
          <select
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs border border-slate-700/80 rounded-lg bg-[#070b14] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 shadow-inner cursor-pointer"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept} className="bg-[#070b14] text-slate-200">
                {dept}
              </option>
            ))}
          </select>

          {/* Academic Year filter */}
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs border border-slate-700/80 rounded-lg bg-[#070b14] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 shadow-inner cursor-pointer"
          >
            {YEARS.map((y) => (
              <option key={y} value={y} className="bg-[#070b14] text-slate-200">
                {y}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs border border-slate-700/80 rounded-lg bg-[#070b14] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 shadow-inner cursor-pointer"
          >
            <option value="all" className="bg-[#070b14] text-slate-200">All Statuses</option>
            <option value="Active" className="bg-[#070b14] text-slate-200">Active Enrolled</option>
            <option value="Academic Probation" className="bg-[#070b14] text-slate-200">Academic Probation</option>
            <option value="On Leave" className="bg-[#070b14] text-slate-200">On Leave</option>
          </select>
        </div>

        {/* Result metrics bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5 border-t border-slate-800/60">
          <span>
            Displaying <strong className="font-mono text-slate-200">{filteredStudents.length}</strong> of{' '}
            <strong className="font-mono text-slate-200">{students.length}</strong> registered students
          </span>

          {(searchTerm || selectedDept !== 'All Departments' || selectedYear !== 'All Years' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('All Departments');
                setSelectedYear('All Years');
                setSelectedStatus('all');
                setCurrentPage(1);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Directory Table View - High Density Dark Mode UI matching screenshot */}
      {filteredStudents.length === 0 ? (
        <div className="p-16 text-center bg-[#0c1427] rounded-xl border border-slate-800/90 shadow-md">
          <GraduationCap className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-200">No students match the criteria</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your department, academic year, or search query.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-[#0c1427] rounded-xl border border-slate-800/90 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className={`w-full text-left ${isCompactMode ? 'table-compact' : ''}`}>
              <thead className="bg-[#080d1b] border-b border-slate-800/90 text-slate-400 font-semibold text-[11px] tracking-wide uppercase select-none">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Department & Degree</th>
                  <th className="py-3 px-4">Standing</th>
                  <th className="py-3 px-4">GPA</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-xs">
                {paginatedStudents.map((student) => {
                  const isProbation = student.status === 'Academic Probation' || student.gpa < 2.0;
                  const isAtRiskAttendance = student.attendanceRate < 75;

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      onClick={() => setDetailStudent(student)}
                    >
                      {/* Name & Avatar */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          {student.avatarUrl ? (
                            <img
                              src={student.avatarUrl}
                              alt={student.firstName}
                              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700 shadow-sm"
                            />
                          ) : (
                            <div
                              className={`w-8 h-8 rounded-full bg-gradient-to-br ${student.avatarBg || 'from-indigo-600 to-blue-700'} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}
                            >
                              {student.firstName[0]}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors leading-tight truncate">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="py-2.5 px-4 font-mono font-medium text-slate-300 text-xs">
                        {student.studentId}
                      </td>

                      {/* Department & Degree */}
                      <td className="py-2.5 px-4">
                        <div className="text-slate-200 font-medium leading-tight">{student.program}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                          {student.department}
                        </div>
                      </td>

                      {/* Standing */}
                      <td className="py-2.5 px-4 text-slate-300">
                        <div className="font-medium text-slate-200">{student.year}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{student.cohort}</div>
                      </td>

                      {/* GPA */}
                      <td className="py-2.5 px-4">
                        <span
                          className={`font-mono font-bold text-xs ${
                            isProbation ? 'text-rose-400' : 'text-slate-100'
                          }`}
                        >
                          {student.gpa.toFixed(2)}
                        </span>
                      </td>

                      {/* Attendance */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono font-semibold text-xs ${
                              isAtRiskAttendance ? 'text-rose-400 font-bold' : 'text-slate-200'
                            }`}
                          >
                            {student.attendanceRate}%
                          </span>
                          {isAtRiskAttendance && (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-2.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                            isProbation
                              ? 'text-rose-300 bg-rose-500/15 border border-rose-500/30'
                              : student.status === 'Active'
                              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                              : 'text-amber-300 bg-amber-500/10 border border-amber-500/30'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailStudent(student);
                          }}
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium text-xs cursor-pointer group-hover:translate-x-0.5 transition-all"
                        >
                          <span>Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 bg-[#080d1b] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredStudents.length)} of {filteredStudents.length} entries
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-6 h-6 rounded text-xs font-mono font-medium cursor-pointer ${
                      currentPage === i + 1
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-slate-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedStudents.map((student) => {
            const isProbation = student.status === 'Academic Probation' || student.gpa < 2.0;

            return (
              <div
                key={student.id}
                onClick={() => setDetailStudent(student)}
                className="bg-[#0c1427] p-4 rounded-xl border border-slate-800/90 hover:border-indigo-500/50 shadow-md hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                        isProbation
                          ? 'text-rose-300 bg-rose-500/15 border border-rose-500/30'
                          : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                      }`}
                    >
                      {student.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{student.studentId}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {student.avatarUrl ? (
                      <img
                        src={student.avatarUrl}
                        alt={student.firstName}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-700 shadow-sm"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${student.avatarBg || 'from-indigo-600 to-blue-700'} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}
                      >
                        {student.firstName[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors truncate">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-xs text-slate-400 font-mono truncate">{student.email}</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 font-medium">{student.program}</div>
                  <div className="text-[11px] text-slate-500 mb-3 truncate">{student.department}</div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-semibold">Cumulative GPA</span>
                    <span className={`font-mono font-bold ${isProbation ? 'text-rose-400' : 'text-slate-100'}`}>
                      {student.gpa.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-semibold">Attendance</span>
                    <span className="font-mono font-semibold text-slate-200">{student.attendanceRate}%</span>
                  </div>
                  <button className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs flex items-center gap-1">
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Registration Modal */}
      <StudentRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* Detail Drawer */}
      <StudentDetailDrawer
        student={detailStudent}
        isOpen={!!detailStudent}
        onClose={() => setDetailStudent(null)}
      />
    </div>
  );
};
