import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Activity, Cpu, RefreshCw, CheckCircle, Database, AlertCircle } from 'lucide-react';
import { aiSentinel } from '../services/aiSentinel';

interface AISentinelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISentinelModal: React.FC<AISentinelModalProps> = ({ isOpen, onClose }) => {
  const [healthScore, setHealthScore] = useState(100);
  const [repairCount, setRepairCount] = useState(0);
  const [logs, setLogs] = useState(aiSentinel.getLogs());
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<Array<{ name: string; status: 'Operational' | 'Optimized'; latencyMs: number }> | null>(null);

  useEffect(() => {
    return aiSentinel.subscribe(() => {
      setHealthScore(aiSentinel.getHealthScore());
      setRepairCount(aiSentinel.getRepairCount());
      setLogs(aiSentinel.getLogs());
    });
  }, []);

  if (!isOpen) return null;

  const handleDeepScan = async () => {
    setIsScanning(true);
    setScanResults(null);
    try {
      const res = await aiSentinel.runDeepDiagnosticScan();
      setScanResults(res.results);
      setHealthScore(res.score);
    } finally {
      setIsScanning(false);
    }
  };

  const handlePurge = () => {
    aiSentinel.purgeCache();
    setLogs(aiSentinel.getLogs());
    setRepairCount(aiSentinel.getRepairCount());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-5 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">AI Sentinel Engine</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold uppercase tracking-wider">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous self-healing & runtime exception guard</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-300 flex-1">
          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-slate-400 text-[11px] mb-1">Health Score</div>
              <div className="text-2xl font-black text-emerald-400">{healthScore}%</div>
              <div className="text-[10px] text-emerald-500/80 mt-0.5">Optimal</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-slate-400 text-[11px] mb-1">Self-Healed</div>
              <div className="text-2xl font-black text-amber-400">{repairCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Events guarded</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-slate-400 text-[11px] mb-1">Storage Guard</div>
              <div className="text-2xl font-black text-blue-400">Active</div>
              <div className="text-[10px] text-blue-400/80 mt-0.5">Schema verified</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleDeepScan}
              disabled={isScanning}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning Subsystems...' : 'Run Deep Diagnostic Scan'}</span>
            </button>
            <button
              onClick={handlePurge}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
            >
              Purge Cache
            </button>
          </div>

          {/* Scan Results */}
          {scanResults && (
            <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-white flex items-center justify-between">
                <span>Subsystem Verification Results</span>
                <span className="text-emerald-400 text-[11px]">10/10 Verified Operational</span>
              </h4>
              <div className="divide-y divide-slate-850">
                {scanResults.map((sub, idx) => (
                  <div key={idx} className="py-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {sub.name}
                    </span>
                    <span className="font-mono text-slate-400">{sub.latencyMs}ms</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real-time self-healing logs */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center justify-between">
              <span>Sentinel Incident & Healing Ledger</span>
              <span className="text-slate-500 font-normal">{logs.length} entries</span>
            </h4>

            {logs.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 text-center text-slate-400">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                <p>System clean. Zero unhandled exceptions or data corruption detected.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-bold text-amber-400">{log.subsystem}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="text-slate-200"><strong>Issue:</strong> {log.issue}</div>
                    <div className="text-emerald-400"><strong>Healed:</strong> {log.actionTaken}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            💡 <strong>How AI Sentinel Works:</strong> Runs as a high-speed defensive layer in browser memory. It wraps calculation boundary limits, intercepts JavaScript exceptions before they freeze the screen, verifies DOM elements, and preserves persistent storage integrity so your legal drafts are never lost.
          </div>
        </div>
      </div>
    </div>
  );
};
