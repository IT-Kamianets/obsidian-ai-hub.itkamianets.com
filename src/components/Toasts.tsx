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
          className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl backdrop-blur-md flex items-start space-x-3 transition-all animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-950/85 border-emerald-700/60 text-emerald-100 shadow-emerald-950/30'
              : toast.type === 'warning'
              ? 'bg-amber-950/85 border-amber-700/60 text-amber-100 shadow-amber-950/30'
              : toast.type === 'tool'
              ? 'bg-purple-950/90 border-purple-600/70 text-purple-100 shadow-purple-950/40'
              : 'bg-obsidian-surface/90 border-obsidian-border text-white shadow-black/40'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {toast.type === 'tool' && <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
          </div>

          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-semibold leading-tight">{toast.message}</p>
            {toast.subtext && (
              <p className="text-[11px] font-mono text-obsidian-muted mt-0.5 leading-snug truncate">
                {toast.subtext}
              </p>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-obsidian-dim hover:text-white shrink-0 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
