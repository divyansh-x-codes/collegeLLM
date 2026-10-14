import React, { useState, useMemo } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Filter, 
  Check, 
  CheckCircle2, 
  CalendarDays,
  Tag
} from 'lucide-react';

export const UpcomingEventsView = () => {
  const { events, toggleEventRegistration, showToast } = useCollege();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set(events.map((e) => e.category));
    return ['all', ...Array.from(set)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'all') return events;
    return events.filter((e) => e.category === selectedCategory);
  }, [events, selectedCategory]);

  return (
    <div className="p-6 sm:p-7 lg:p-8 max-w-[1720px] mx-auto space-y-6 text-slate-100 font-sans antialiased">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <span className="font-semibold text-indigo-400">Unity College</span>
            <span>·</span>
            <span>Campus Activities & Calendar</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <span>Upcoming Campus Events</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover hackathons, guest lectures, academic examination dates, and student showcases.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                  : 'bg-[#0c1427] text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat === 'all' ? 'All Events' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-[#0c1427] rounded-2xl border border-slate-800/90 hover:border-indigo-500/40 transition-all p-6 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 font-mono">
                  {evt.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Capacity: {evt.capacity} seats
                </span>
              </div>

              <h2 className="text-lg font-bold text-white leading-snug">
                {evt.title}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                {evt.description}
              </p>

              <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="font-semibold text-white">{evt.date}</span>
                  <span className="text-slate-600">·</span>
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-300">{evt.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{evt.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-400">Organized by {evt.organizer}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                evt.registered ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                {evt.registered ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>RSVP Confirmed</span>
                  </>
                ) : (
                  <span>Registration Open</span>
                )}
              </span>

              <button
                onClick={() => toggleEventRegistration(evt.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  evt.registered
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                }`}
              >
                {evt.registered ? 'Cancel RSVP' : 'Register / RSVP'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
