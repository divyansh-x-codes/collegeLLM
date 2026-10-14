import React, { useState, useMemo } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers,
  ChevronRight,
  BookOpen,
  CalendarCheck
} from 'lucide-react';
import { WEEKLY_SCHEDULE_ITEMS } from '../../data/mockData.js';

const DAYS = [
  { id: 'Monday', label: 'Monday', short: 'Mon', initialDepth: 0 },
  { id: 'Tuesday', label: 'Tuesday', short: 'Tue', initialDepth: 1 },
  { id: 'Wednesday', label: 'Wednesday', short: 'Wed', initialDepth: 2 },
  { id: 'Thursday', label: 'Thursday', short: 'Thu', initialDepth: 3 },
  { id: 'Friday', label: 'Friday', short: 'Fri', initialDepth: 4 },
  { id: 'Saturday', label: 'Saturday', short: 'Sat', initialDepth: 5 },
];

export const DashboardScheduleDeck = () => {
  const { setActiveTab, setSelectedCourseId, courses } = useCollege();
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [hoveredDay, setHoveredDay] = useState(null);
  const [deckMode, setDeckMode] = useState('deck'); // 'deck' (stacked perspective) or 'grid'

  // Routine for the currently selected day, sorted chronologically
  const routineClasses = useMemo(() => {
    return WEEKLY_SCHEDULE_ITEMS
      .filter((item) => item.day === selectedDay)
      .sort((a, b) => a.startMinutes - b.startMinutes);
  }, [selectedDay]);

  return (
    <div className="bg-[#0c1427] rounded-2xl border border-slate-800 shadow-xl overflow-hidden transition-all">
      {/* Top Header of the Deck Section */}
      <div className="p-5 sm:p-6 pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Class Schedule & Daily Routine
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  Deck Perspective
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Hover over layered day cards to inspect; select any day to bring its daily routine to the front.
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle & Link to Full Timetable */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="inline-flex p-1 bg-[#080d1b] border border-slate-800 rounded-lg text-xs font-medium text-slate-400">
            <button
              onClick={() => setDeckMode('deck')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                deckMode === 'deck'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'hover:text-white'
              }`}
            >
              Deck Stack
            </button>
            <button
              onClick={() => setDeckMode('grid')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                deckMode === 'grid'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'hover:text-white'
              }`}
            >
              Grid View
            </button>
          </div>

          <button
            onClick={() => setActiveTab('timetable')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-[#080d1b] hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Open Full Campus Timetable"
          >
            <span>Full Timetable</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* The Deck Perspective Stage */}
      <div className="p-5 sm:p-6 bg-[#080d1b]/70 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <CalendarDays className="w-4 h-4 text-indigo-400" />
            <span>Select Day to Inspect:</span>
            <span className="font-semibold text-white">{selectedDay}</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            Interactive Deck Hovering Effect
          </span>
        </div>

        {/* DECK PERSPECTIVE MODE */}
        {deckMode === 'deck' ? (
          <div className="deck-stage py-3 overflow-x-auto pb-4">
            <div className="flex items-center min-w-[620px] justify-between gap-2.5 px-1">
              {DAYS.map((day, idx) => {
                const isSelected = selectedDay === day.id;
                const isHovered = hoveredDay === day.id;
                const count = WEEKLY_SCHEDULE_ITEMS.filter((c) => c.day === day.id).length;

                // Natural stacking: Monday in front (z-30), Tuesday behind (z-26), etc.
                // When hovered, elevates to highest layer (z-60)
                // When selected, elevates to front (z-50)
                const naturalZ = 30 - idx * 4;
                const currentZ = isHovered ? 60 : isSelected ? 50 : naturalZ;

                // Perspective styling: subtle tilt and depth
                // Monday is front, Tuesday back, etc.
                const perspectiveTranslateY = isSelected 
                  ? '-10px' 
                  : isHovered 
                  ? '-14px' 
                  : `${idx * 2}px`;

                return (
                  <div
                    key={day.id}
                    onMouseEnter={() => setHoveredDay(day.id)}
                    onMouseLeave={() => setHoveredDay(null)}
                    onClick={() => setSelectedDay(day.id)}
                    style={{
                      zIndex: currentZ,
                      transform: `translateY(${perspectiveTranslateY}) scale(${isSelected ? 1.04 : isHovered ? 1.05 : 0.98 - idx * 0.01})`,
                    }}
                    className={`deck-perspective-item flex-1 relative cursor-pointer rounded-xl p-3 sm:p-4 text-center select-none border transition-all duration-200 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-teal-500 shadow-xl ring-2 ring-teal-400/30'
                        : isHovered
                        ? 'bg-[#111c38] text-white border-indigo-400 shadow-lg'
                        : 'bg-[#0c1427] text-slate-300 border-slate-800 shadow-xs hover:border-slate-700'
                    }`}
                  >
                    {/* Badge on the card */}
                    <div className="flex items-center justify-center mb-1">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                          BROUGHT TO FRONT
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
                          {day.short}
                        </span>
                      )}
                    </div>

                    <div className={`text-sm sm:text-base font-bold tracking-tight ${isSelected ? 'text-white' : 'text-slate-100'}`}>
                      {day.label}
                    </div>

                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className={`text-[11px] font-mono ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                        {count} {count === 1 ? 'class' : 'classes'}
                      </span>
                    </div>

                    {/* Visual Layer Depth Indicator Footprint */}
                    <div className={`mt-2 pt-1.5 border-t text-[10px] font-mono flex items-center justify-center gap-1 ${
                      isSelected ? 'border-slate-800 text-teal-300' : 'border-slate-800/80 text-slate-500'
                    }`}>
                      <span>Layer {idx + 1}</span>
                      {idx === 0 && <span className="text-teal-400 font-bold">(Front)</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* GRID MODE */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {DAYS.map((day, idx) => {
              const isSelected = selectedDay === day.id;
              const count = WEEKLY_SCHEDULE_ITEMS.filter((c) => c.day === day.id).length;

              return (
                <div
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 text-center ${
                    isSelected
                      ? 'bg-slate-900 text-white border-teal-500 shadow-md ring-2 ring-teal-400/20 -translate-y-1'
                      : 'bg-[#0c1427] text-slate-200 border-slate-800 hover:border-indigo-400 hover:bg-[#111c38]'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    {day.short}
                  </div>
                  <div className="text-sm font-bold mt-0.5">
                    {day.label}
                  </div>
                  <div className={`text-[11px] font-mono mt-1 ${isSelected ? 'text-teal-300' : 'text-slate-500'}`}>
                    {count} {count === 1 ? 'class' : 'classes'}
                  </div>
                  {isSelected && (
                    <span className="mt-1.5 inline-block text-[9px] font-bold text-teal-300 uppercase tracking-wider">
                      Selected
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BELOW THAT: Daily Routine Section Matching User's Image Reference */}
      <div className="p-5 sm:p-6 bg-slate-950 text-white relative">
        {/* Subtle Ambient Teal & Indigo Glow in Background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-teal-400 border border-slate-700/80 flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {selectedDay}'s Daily Routine
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {routineClasses.length} Scheduled
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Class routine brought forward via deck perspective selection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('attendance')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Verify Attendance</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Routine Cards List - Sleek Midnight Styling per Image 2 */}
        <div key={selectedDay} className="routine-reveal grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {routineClasses.length > 0 ? (
            routineClasses.map((item, i) => {
              // Find matching course in database if available
              const matchedCourse = courses.find((c) => c.code === item.courseCode);

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (matchedCourse) {
                      setSelectedCourseId(matchedCourse.id);
                      setActiveTab('courses');
                    }
                  }}
                  className="routine-card-glow bg-slate-900/90 border border-slate-800/90 hover:border-teal-400/50 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden group cursor-pointer transition-all duration-200"
                >
                  {/* Subtle Top-Right Ambient Teal Glow on hover */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all pointer-events-none" />

                  {/* Top Row: Teal Badge for Course Code & Type + Status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                        {item.courseCode}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-medium uppercase px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
                        {item.type}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-teal-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      Session {i + 1}
                    </span>
                  </div>

                  {/* Middle: Subject Title */}
                  <h4 className="text-base font-bold text-white group-hover:text-teal-200 transition-colors line-clamp-1">
                    {item.subjectName}
                  </h4>

                  {/* Bottom Row Details: Time, Location (Emerald badge), Faculty */}
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Time Block */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/80 text-xs font-mono">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        <span>{item.startTime} – {item.endTime}</span>
                      </div>

                      {/* Location Badge (Emerald) */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{item.room}</span>
                      </div>
                    </div>

                    {/* Faculty Profile Badge */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 group-hover:text-slate-100 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-teal-300">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="truncate max-w-[140px] font-medium">{item.faculty}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/50">
              <CalendarDays className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No Lectures Scheduled for {selectedDay}</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Campus study facilities, science labs, and research libraries remain accessible.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
