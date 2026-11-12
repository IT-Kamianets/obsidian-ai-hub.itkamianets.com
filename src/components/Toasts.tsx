import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, Cpu, X } from 'lucide-react';

export const Toasts: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 text-zinc-900 dark:text-zinc-100 shadow-xl backdrop-blur-md flex items-start space-x-3 transition-all animate-fade-in"
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
            {toast.type === 'tool' && <Cpu className="w-4 h-4 text-zinc-700 dark:text-zinc-300 animate-pulse" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />}
          </div>

          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-semibold leading-tight">{toast.message}</p>
            {toast.subtext && (
              <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug truncate">
                {toast.subtext}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 shrink-0 p-0.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
export default Toasts;
