import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { useAppStore } from '../../store';
import type { LogSeverity } from '../../types';

const severityColor: Record<LogSeverity, string> = {
  debug: 'text-slate-500',
  info: 'text-slate-300',
  warning: 'text-warning',
  error: 'text-critical',
  critical: 'text-critical font-bold',
};

const severityDot: Record<LogSeverity, string> = {
  debug: 'bg-slate-600',
  info: 'bg-teal-500',
  warning: 'bg-warning',
  error: 'bg-critical',
  critical: 'bg-critical',
};

export function LogDrawer() {
  const { liveLogs, logDrawerOpen, clearLogs } = useAppStore();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logDrawerOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [liveLogs, logDrawerOpen]);

  if (!logDrawerOpen) return null;

  return (
    <div className="glass-dark border-t border-teal-600/20 h-48 flex flex-col shrink-0">
      {/* Drawer header */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-navy-700">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wide">Live Log Stream</span>
          <span className="text-[9px] text-slate-500">{liveLogs.length} events</span>
          <span className="sim-badge sim-badge-simulated">Simulated</span>
        </div>
        <button
          onClick={clearLogs}
          className="text-[9px] text-slate-500 hover:text-white uppercase tracking-wide"
        >
          Clear
        </button>
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto px-3 py-1 font-mono">
        {liveLogs.length === 0 ? (
          <div className="text-[10px] text-slate-600 py-2">Waiting for log events...</div>
        ) : (
          liveLogs.map(log => (
            <div key={log.id} className="flex items-start gap-2 py-0.5 hover:bg-navy-800/50 rounded px-1">
              <div className={clsx('w-1.5 h-1.5 rounded-full mt-1 shrink-0', severityDot[log.severity])} />
              <span className="text-[9px] text-slate-500 shrink-0 tabular-nums">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={clsx('text-[10px] leading-relaxed', severityColor[log.severity])}>
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
