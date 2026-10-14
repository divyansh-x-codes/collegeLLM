import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Users2, 
  MapPin, 
  Clock, 
  User, 
  Check, 
  Plus, 
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';

export const StudentsClubView = () => {
  const { studentClubs, toggleClubJoin } = useCollege();
  const [search, setSearch] = useState('');

  const filtered = studentClubs.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-slate-100 font-sans antialiased">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span className="font-semibold text-indigo-400">Unity College</span>
            <span>·</span>
            <span>Student Life & Associations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users2 className="w-6 h-6 text-indigo-400" />
            <span>Students Clubs & Societies</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Join academic guilds, technology chapters, debate societies, and inter-disciplinary project teams.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search clubs & societies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0c1427] border border-slate-800 text-xs text-white placeholder:text-slate-500 rounded-xl pl-9 pr-3.5 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Clubs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((club) => (
          <div
            key={club.id}
            className="bg-[#0c1427] rounded-2xl border border-slate-800/90 hover:border-indigo-500/40 transition-all p-6 shadow-xl space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 font-mono">
                  {club.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {club.members} active members
                </span>
              </div>

              <h2 className="text-base font-bold text-white leading-snug group-hover:text-indigo-200 transition-colors">
                {club.name}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed min-h-[44px]">
                {club.description}
              </p>

              <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Lead: <strong className="text-white">{club.lead}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-300">{club.meetingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{club.venue}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                club.joined ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                {club.joined ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Member Active</span>
                  </>
                ) : (
                  <span>Open to Join</span>
                )}
              </span>

              <button
                onClick={() => toggleClubJoin(club.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  club.joined
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
                }`}
              >
                {club.joined ? 'Leave Club' : 'Join Club'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
