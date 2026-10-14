import React, { useState, useMemo } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  ShieldCheck, 
  Search, 
  User, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  X,
  Filter,
  KeyRound,
  Shield
} from 'lucide-react';

export const UserManagementView = () => {
  const { staff, students, updateUserRole, updateUserStatus, showToast } = useCollege();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');

  // Combined accounts roster
  const users = useMemo(() => {
    const list = [
      ...staff.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        role: s.role || 'faculty',
        title: s.title || 'Faculty Member',
        department: s.department || 'Administration',
        type: 'Staff / Faculty',
        status: s.status || 'Active',
        authMethod: s.email.includes('gmail.com') ? 'Google SSO' : 'Institutional Credentials',
        lastActive: 'Just now'
      })),
      ...students.map(st => ({
        id: st.id,
        studentId: st.studentId,
        name: `${st.firstName} ${st.lastName}`,
        email: st.email,
        role: st.role || 'student',
        title: `${st.program} (${st.year})`,
        department: st.department,
        type: 'Student',
        status: st.status || 'Active',
        authMethod: st.email.includes('gmail.com') ? 'Google SSO' : 'Student ID & SSO',
        lastActive: '18 minutes ago'
      }))
    ];
    return list;
  }, [staff, students]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = searchTerm.toLowerCase();
      const matchSearch = 
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.studentId && u.studentId.toLowerCase().includes(q)) ||
        u.title.toLowerCase().includes(q);

      if (!matchSearch) return false;
      if (selectedType !== 'All' && u.type !== selectedType) return false;
      if (selectedRole !== 'All' && u.role !== selectedRole) return false;
      return true;
    });
  }, [users, searchTerm, selectedType, selectedRole]);

  const handleRoleChange = (userId, newRole) => {
    updateUserRole(userId, newRole);
  };

  const handleStatusToggle = (userId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    updateUserStatus(userId, nextStatus);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 antialiased font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>Institutional User Management & Access Control</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Identity lifecycle, role-based authorization (RBAC), authentication providers, and account status governance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>RBAC Enforcement Active</span>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0c1427] p-3.5 rounded-xl border border-slate-800/90 shadow-md flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search accounts by name, institutional email, or student ID..."
            className="w-full pl-9 pr-8 py-2 text-xs border border-slate-700/80 rounded-lg bg-[#070b14] text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-700/80 rounded-lg bg-[#070b14] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 shadow-inner cursor-pointer"
        >
          <option value="All" className="bg-[#070b14]">All Account Types</option>
          <option value="Staff / Faculty" className="bg-[#070b14]">Staff / Faculty</option>
          <option value="Student" className="bg-[#070b14]">Students</option>
        </select>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-700/80 rounded-lg bg-[#070b14] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 shadow-inner cursor-pointer"
        >
          <option value="All" className="bg-[#070b14]">All Security Roles</option>
          <option value="admin" className="bg-[#070b14]">Administrator</option>
          <option value="faculty" className="bg-[#070b14]">Faculty</option>
          <option value="registrar" className="bg-[#070b14]">Registrar</option>
          <option value="student" className="bg-[#070b14]">Student</option>
          <option value="superadmin" className="bg-[#070b14]">Superadmin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-[#0c1427] rounded-xl border border-slate-800/90 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#080d1b] border-b border-slate-800/90 text-slate-400 font-semibold text-[11px] tracking-wide uppercase select-none">
              <tr>
                <th className="py-3 px-4">User Account</th>
                <th className="py-3 px-4">Account Type</th>
                <th className="py-3 px-4">Role Assignment</th>
                <th className="py-3 px-4">Authentication</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* User info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                        {user.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {user.email === 'simplydivyanshk@gmail.com' && (
                            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/20 px-1.5 py-0.2 rounded border border-indigo-500/40">
                              Master Dean
                            </span>
                          )}
                          {user.email === 'jnv.peren55@gmail.com' && (
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/40">
                              Academic Director
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Account Type */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-200">{user.type}</div>
                    <div className="text-[10px] text-slate-400">{user.title}</div>
                  </td>

                  {/* Role Selection */}
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-2.5 py-1 text-xs border border-slate-700 rounded-lg bg-[#070b14] text-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono cursor-pointer"
                    >
                      <option value="student" className="bg-[#070b14]">student</option>
                      <option value="faculty" className="bg-[#070b14]">faculty</option>
                      <option value="admin" className="bg-[#070b14]">admin</option>
                      <option value="registrar" className="bg-[#070b14]">registrar</option>
                      <option value="superadmin" className="bg-[#070b14]">superadmin</option>
                    </select>
                  </td>

                  {/* Auth method */}
                  <td className="py-3 px-4 text-slate-300">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {user.authMethod}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                      user.status === 'Active'
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                        : 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
                    }`}>
                      {user.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleStatusToggle(user.id, user.status)}
                      className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                        user.status === 'Active'
                          ? 'text-rose-300 hover:text-white bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30'
                          : 'text-emerald-300 hover:text-white bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30'
                      }`}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
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
