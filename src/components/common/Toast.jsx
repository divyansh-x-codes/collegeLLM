import React from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, dismissToast } = useCollege();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl bg-[#0c1427]/95 backdrop-blur-md transition-all transform duration-200 ${
              isSuccess
                ? 'border-emerald-500/40 text-emerald-100 shadow-emerald-950/20'
                : isError
                ? 'border-rose-500/40 text-rose-100 shadow-rose-950/20'
                : 'border-slate-800 text-slate-100 shadow-slate-950/40'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              ) : isError ? (
                <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Info className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
            <div className="text-xs font-medium flex-1 leading-relaxed text-slate-200">
              {toast.message}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
