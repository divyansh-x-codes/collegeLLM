import React from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { Table, Maximize2, Minimize2 } from 'lucide-react';

export const TableDensityToggle = ({ className = '' }) => {
  const { isCompactMode, setIsCompactMode } = useCollege();

  return (
    <button
      type="button"
      onClick={() => setIsCompactMode(!isCompactMode)}
      title={isCompactMode ? 'Switch to Standard Table Spacing' : 'Switch to Compact / Smaller Table Spacing'}
      aria-label="Toggle compact table density"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer shadow-xs ${
        isCompactMode
          ? 'bg-indigo-950/70 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/80 shadow-indigo-950/40'
          : 'bg-[#0b1329] border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
      } ${className}`}
    >
      {isCompactMode ? (
        <>
          <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Compact Density</span>
        </>
      ) : (
        <>
          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Standard Density</span>
        </>
      )}
    </button>
  );
};
