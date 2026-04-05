import { useAppStore } from '../../store';
import type { SimulatorMode } from '../../types';
import { clsx } from 'clsx';

const MODE_LABELS: Record<SimulatorMode, string> = {
  guided: 'Guided Demo',
  free: 'Free Explore',
  operator: 'Operator',
  executive: 'Executive',
  playback: 'Playback',
};

function HealthDot({ value, label }: { value: number; label: string }) {
  const color = value >= 90 ? 'bg-verified' : value >= 70 ? 'bg-warning' : 'bg-critical';
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-1">
        <div className={clsx('w-1.5 h-1.5 rounded-full', color)} />
        <span className="text-[11px] font-bold text-white tabular-nums">{value}%</span>
      </div>
      <span className="text-[9px] text-slate-400 uppercase tracking-wide">{label}</span>
    </div>
  );
}

function StatItem({ label, value, color = 'text-white' }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={clsx('text-[12px] font-bold tabular-nums', color)}>{value}</span>
      <span className="text-[9px] text-slate-400 uppercase tracking-wide whitespace-nowrap">{label}</span>
    </div>
  );
}

export function Header() {
  const { environment, simulatorMode, setSimulatorMode, alerts } = useAppStore();

  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const criticalAlerts = alerts.filter(a => a.status === 'active' && a.severity === 'critical').length;

  const govScore = environment?.governance_score ?? 67;
  const govColor = govScore >= 80 ? 'text-verified' : govScore >= 60 ? 'text-warning' : 'text-critical';

  const secChannel = environment?.secure_channel_status ?? 'degraded';
  const secColor = secChannel === 'healthy' ? 'text-verified' : secChannel === 'degraded' ? 'text-warning' : 'text-slate-400';

  return (
    <header className="glass-dark border-b border-teal-600/20 px-4 h-14 flex items-center justify-between shrink-0 z-50">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[15px] font-black text-white tracking-tight leading-none">ZODIAC</span>
          <span className="text-[9px] text-teal-500 uppercase tracking-widest leading-none mt-0.5">AOS534 Platform</span>
        </div>
        <div className="w-px h-8 bg-navy-600" />
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase tracking-wide leading-none">Environment</span>
          <span className="text-[12px] font-semibold text-white leading-none mt-0.5">
            {environment?.name ?? 'Acme Corp — Multi-Site'}
          </span>
        </div>
      </div>

      {/* Center: Stats */}
      <div className="flex items-center gap-5">
        {/* Mode selector */}
        <div className="flex items-center gap-1 bg-navy-800 border border-navy-600 rounded px-1 py-0.5">
          {(['operator', 'executive'] as SimulatorMode[]).map(m => (
            <button
              key={m}
              onClick={() => setSimulatorMode(m)}
              className={clsx(
                'text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded transition-all',
                simulatorMode === m
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        <div className="w-px h-8 bg-navy-600" />

        <StatItem
          label="Gov Score"
          value={`${govScore}`}
          color={govColor}
        />
        <div className="w-px h-6 bg-navy-600" />
        <StatItem
          label="Evidence Conf"
          value={`${((environment?.evidence_confidence ?? 0.87) * 100).toFixed(0)}%`}
          color="text-teal-400"
        />
        <div className="w-px h-6 bg-navy-600" />
        <div className="flex flex-col items-center gap-0.5">
          <span className={clsx('text-[12px] font-bold', criticalAlerts > 0 ? 'text-critical' : activeAlerts > 0 ? 'text-warning' : 'text-verified')}>
            {activeAlerts}
          </span>
          <span className="text-[9px] text-slate-400 uppercase tracking-wide">Alerts</span>
        </div>
        <div className="w-px h-6 bg-navy-600" />
        <HealthDot value={environment?.cp_health ?? 94} label="CP" />
        <HealthDot value={environment?.dp_health ?? 88} label="DP" />
        <div className="w-px h-6 bg-navy-600" />
        <div className="flex flex-col items-center gap-0.5">
          <span className={clsx('text-[11px] font-bold uppercase', secColor)}>{secChannel}</span>
          <span className="text-[9px] text-slate-400 uppercase tracking-wide">Sec Channel</span>
        </div>
      </div>

      {/* Right: Sim labels + logo area */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end gap-0.5">
          <span className="sim-badge">Simulated Environment</span>
          <span className="text-[9px] text-slate-500 font-mono">
            Truth Model: v0.98 (simulated)
          </span>
        </div>
        <div className="w-px h-8 bg-navy-600" />
        {/* Bull+Lion placeholder — replaced with actual logo asset when available */}
        <div className="w-10 h-10 rounded border border-teal-600/30 bg-navy-800 flex items-center justify-center">
          <span className="text-[10px] text-teal-500 font-black">4W</span>
        </div>
      </div>
    </header>
  );
}
