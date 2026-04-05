import { useAppStore } from '../../store';
import { clsx } from 'clsx';

export function Footer() {
  const { environment, activeScenario, simulatorMode, setLogDrawerOpen, logDrawerOpen } = useAppStore();

  const scenarioProgress = activeScenario
    ? Math.round((activeScenario.current_step / activeScenario.total_steps) * 100)
    : 0;

  return (
    <footer className="glass-dark border-t border-teal-600/15 h-9 flex items-center px-4 gap-4 shrink-0 z-40">
      {/* Phase indicator */}
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] text-slate-500 uppercase tracking-wide">Phase</span>
        <span className="text-[11px] font-bold text-teal-500">1</span>
        <span className="text-[9px] text-slate-600">of 4</span>
      </div>

      <div className="w-px h-4 bg-navy-600" />

      {/* Mode */}
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] text-slate-500 uppercase tracking-wide">Mode</span>
        <span className={clsx(
          'text-[10px] font-bold uppercase',
          simulatorMode === 'executive' ? 'text-teal-400' : 'text-white'
        )}>
          {simulatorMode}
        </span>
      </div>

      {/* Scenario progress */}
      {activeScenario && (
        <>
          <div className="w-px h-4 bg-navy-600" />
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-500 uppercase tracking-wide">Scenario</span>
            <span className="text-[10px] text-white font-medium truncate max-w-40">{activeScenario.name}</span>
            <div className="w-16 h-1 bg-navy-700 rounded overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded transition-all duration-500"
                style={{ width: `${scenarioProgress}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-400 tabular-nums">
              {activeScenario.current_step}/{activeScenario.total_steps}
            </span>
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Last event */}
      {environment?.last_event && (
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-[9px] text-slate-500 font-mono">
            {new Date(environment.last_event).toLocaleTimeString()}
          </span>
        </div>
      )}

      <div className="w-px h-4 bg-navy-600" />

      {/* Quick links */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setLogDrawerOpen(!logDrawerOpen)}
          className={clsx(
            'text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border transition-all',
            logDrawerOpen
              ? 'border-teal-500/50 text-teal-400 bg-teal-600/10'
              : 'border-navy-600 text-slate-500 hover:text-teal-400 hover:border-teal-600/30'
          )}
        >
          Logs
        </button>
        <button className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border border-navy-600 text-slate-500 hover:text-teal-400 hover:border-teal-600/30 transition-all">
          Evidence
        </button>
        <button className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border border-navy-600 text-slate-500 hover:text-teal-400 hover:border-teal-600/30 transition-all">
          Storyboard
        </button>
      </div>

      {/* Demo label */}
      <div className="w-px h-4 bg-navy-600" />
      <span className="text-[8px] text-slate-600 uppercase tracking-widest font-mono">Demo Mode</span>
    </footer>
  );
}
