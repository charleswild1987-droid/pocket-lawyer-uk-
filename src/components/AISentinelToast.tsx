import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, X, Sparkles } from 'lucide-react';
import { aiSentinel, RepairLog } from '../services/aiSentinel';

export const AISentinelToast: React.FC = () => {
  const [activeToast, setActiveToast] = useState<RepairLog | null>(null);

  useEffect(() => {
    return aiSentinel.onRepair((log) => {
      setActiveToast(log);
      const timer = setTimeout(() => {
        setActiveToast((current) => (current?.id === log.id ? null : current));
      }, 5000);
      return () => clearTimeout(timer);
    });
  }, []);

  if (!activeToast) return null;

  return (
    <aside
      aria-label="AI Sentinel notifications"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm w-full animate-bounce-short"
    >
      <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-emerald-500/60 shadow-2xl shadow-emerald-950 text-slate-100 flex items-start gap-3 backdrop-blur-md">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>

        <div className="flex-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI Sentinel Self-Healed
            </span>
            <span className="text-[10px] text-slate-400">{activeToast.timestamp}</span>
          </div>
          <p className="font-semibold text-white mt-0.5">{activeToast.subsystem}</p>
          <p className="text-slate-300 text-[11px] mt-0.5">{activeToast.issue}</p>
          <div className="mt-1.5 py-1 px-2 rounded bg-emerald-950/80 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">
            ✓ {activeToast.actionTaken}
          </div>
        </div>

        <button
          onClick={() => setActiveToast(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
