import { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { api } from '../../services/api';
import { ScoreBar } from '../shared/ScoreBar';
import { TruthBadge } from '../shared/TruthBadge';
import { AlignmentBadge, RiskBadge, GovStatusBadge, PlaneBadge } from '../shared/Badges';
import { clsx } from 'clsx';
import type { GovernedObject, Alert } from '../../types';

export function IdentityGovernance() {
  const { simulatorMode, setSelectedObjectId } = useAppStore();
  const [identities, setIdentities] = useState<GovernedObject[]>([]);
  const [idAlerts, setIdAlerts] = useState<Alert[]>([]);
  const [selected, setSelected] = useState<GovernedObject | null>(null);
  const [filter, setFilter] = useState<'all' | 'misaligned' | 'critical'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.objects.list({ type: 'user' }),
      api.objects.list({ type: 'service_account' }),
      api.alerts.list({ status: 'active' }),
    ]).then(([users, svcAccts, alerts]) => {
      const allIds = [...users.data, ...svcAccts.data];
      setIdentities(allIds);
      setIdAlerts(alerts.data.filter(a => a.plane === 'identity_plane'));
      if (allIds.length > 0) setSelected(allIds[0]);
    }).finally(() => setLoading(false));
  }, []);

  const displayed = identities.filter(i => {
    if (filter === 'misaligned') return i.alignment_state === 'misaligned';
    if (filter === 'critical') return i.risk_level === 'critical';
    return true;
  });

  const avgScore = identities.length
    ? Math.round(identities.reduce((s, i) => s + i.truth_score, 0) / identities.length)
    : 0;
  const misaligned = identities.filter(i => i.alignment_state === 'misaligned').length;

  return (
    <div className="flex h-full overflow-hidden">

      {/* Main content */}
      <div className="flex-1 flex flex-col gap-0 overflow-hidden">

        {/* Screen header */}
        <div className="px-5 pt-4 pb-3 border-b border-navy-700 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-lg font-black text-white">Identity Governance</h1>
                <TruthBadge label="simulated" />
                <span className="text-[9px] text-slate-500">Argus · Sage</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Declared vs verified identity state — registry alignment, RBAC posture, privilege governance.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="sim-badge">Simulated Data</span>
              {simulatorMode === 'executive' && (
                <span className="sim-badge">Executive View</span>
              )}
            </div>
          </div>

          {/* Summary bar */}
          <div className="flex gap-4 mt-3">
            {[
              { label: 'Identity Truth Score', value: avgScore, type: 'score' as const },
              { label: 'Total Identities', value: identities.length, type: 'num' as const },
              { label: 'Misaligned', value: misaligned, type: 'num' as const, color: misaligned > 0 ? 'critical' : 'verified' },
              { label: 'Active Alerts', value: idAlerts.length, type: 'num' as const, color: idAlerts.length > 0 ? 'warning' : 'verified' },
            ].map(item => (
              <div key={item.label} className="glass rounded px-3 py-2 min-w-28">
                <div className="text-[9px] text-slate-400 uppercase tracking-wide mb-1">{item.label}</div>
                {item.type === 'score' ? (
                  <ScoreBar score={item.value} size="sm" />
                ) : (
                  <div className={clsx(
                    'text-xl font-black tabular-nums',
                    item.color === 'critical' ? 'text-critical' :
                    item.color === 'warning' ? 'text-warning' :
                    item.color === 'verified' ? 'text-verified' : 'text-white'
                  )}>
                    {item.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Filter bar + grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 py-2 border-b border-navy-700 flex items-center gap-3 shrink-0">
            <span className="text-[9px] text-slate-500 uppercase tracking-wide">Filter:</span>
            {(['all', 'misaligned', 'critical'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  'text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border transition-all',
                  filter === f
                    ? 'border-teal-500/50 bg-teal-600/15 text-teal-300'
                    : 'border-navy-600 text-slate-500 hover:text-white'
                )}
              >
                {f === 'all' ? `All (${identities.length})` :
                 f === 'misaligned' ? `Misaligned (${identities.filter(i => i.alignment_state === 'misaligned').length})` :
                 `Critical (${identities.filter(i => i.risk_level === 'critical').length})`}
              </button>
            ))}

            {/* Sage advisory indicator */}
            <div className="ml-auto flex items-center gap-1.5 text-[10px] text-teal-500">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span className="font-semibold">Sage</span>
              <span className="text-slate-400">— explainability active</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-3">
            {loading ? (
              <div className="text-[11px] text-slate-500 py-8 text-center">Loading identity data...</div>
            ) : (
              <div className="space-y-1.5">
                {displayed.map(identity => (
                  <div
                    key={identity.id}
                    onClick={() => {
                      setSelected(identity);
                      setSelectedObjectId(identity.id);
                    }}
                    className={clsx(
                      'rounded border p-3 cursor-pointer transition-all hover:border-teal-600/40',
                      selected?.id === identity.id
                        ? 'border-teal-500/40 bg-teal-900/10'
                        : identity.alignment_state === 'misaligned'
                          ? 'border-critical/30 bg-critical/5 hover:bg-critical/8'
                          : 'border-navy-600 bg-navy-800/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {/* Identity icon */}
                      <div className={clsx(
                        'w-8 h-8 rounded flex items-center justify-center text-sm font-black shrink-0',
                        identity.risk_level === 'critical' ? 'bg-critical/20 text-critical' :
                        identity.risk_level === 'high' ? 'bg-warning/20 text-warning' :
                        'bg-teal-600/15 text-teal-400'
                      )}>
                        {identity.type === 'service_account' ? '⚙' : '◈'}
                      </div>

                      {/* Identity info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-white">{identity.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{identity.id}</span>
                          <TruthBadge label={identity.truth_label} />
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400">{identity.owner_system}</span>
                          <span className="text-slate-600">·</span>
                          <span className="text-[10px] text-slate-400">{identity.site}</span>
                          {identity.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[9px] bg-navy-700 text-slate-400 px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                        </div>
                      </div>

                      {/* Score + badges */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-24">
                          <ScoreBar score={identity.truth_score} size="sm" />
                        </div>
                        <AlignmentBadge state={identity.alignment_state} />
                        <RiskBadge level={identity.risk_level} />
                        <GovStatusBadge status={identity.governance_status} />
                        <PlaneBadge plane={identity.plane} />
                      </div>
                    </div>

                    {/* Declared vs Verified */}
                    {identity.alignment_state === 'misaligned' && (
                      <div className="mt-2 flex gap-3 pl-11">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] text-slate-500 uppercase">Declared:</span>
                          <span className="text-[10px] font-mono text-slate-300">{identity.declared_state}</span>
                        </div>
                        <span className="text-slate-600">→</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] text-slate-500 uppercase">Verified:</span>
                          <span className="text-[10px] font-mono text-critical">{identity.verified_state}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active alerts strip */}
        {idAlerts.length > 0 && (
          <div className="border-t border-critical/20 bg-critical/5 px-5 py-2 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] text-critical font-bold uppercase tracking-wide">Identity Alerts:</span>
              {idAlerts.map(alert => (
                <div key={alert.id} className="flex items-center gap-1.5 text-[10px] text-critical bg-critical/10 border border-critical/20 rounded px-2 py-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-critical animate-pulse" />
                  {alert.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right detail panel */}
      {selected && (
        <div className="w-72 glass border-l border-teal-600/15 flex flex-col overflow-y-auto shrink-0">
          <div className="p-4 border-b border-navy-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wide">Identity Detail</span>
              <TruthBadge label={selected.truth_label} />
            </div>
            <div className="text-[15px] font-bold text-white">{selected.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">{selected.id}</div>
          </div>

          <div className="p-4 space-y-4">
            {/* Score */}
            <div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wide mb-1">Truth Score</div>
              <ScoreBar score={selected.truth_score} size="lg" />
              <div className="text-[10px] text-slate-400 mt-1">
                Confidence: <span className="text-white">{(selected.confidence_score * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Declared vs Verified */}
            <div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wide mb-2">Declared vs Verified</div>
              <div className="space-y-1.5">
                <div className="rounded bg-navy-800 p-2">
                  <div className="text-[9px] text-slate-500 uppercase">Declared State</div>
                  <div className="text-[11px] font-mono text-white mt-0.5">{selected.declared_state}</div>
                </div>
                <div className={clsx(
                  'rounded p-2',
                  selected.alignment_state === 'misaligned' ? 'bg-critical/10 border border-critical/20' : 'bg-navy-800'
                )}>
                  <div className="text-[9px] text-slate-500 uppercase">Verified State</div>
                  <div className={clsx(
                    'text-[11px] font-mono mt-0.5',
                    selected.alignment_state === 'misaligned' ? 'text-critical' : 'text-verified'
                  )}>
                    {selected.verified_state}
                  </div>
                </div>
              </div>
            </div>

            {/* Status badges */}
            <div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wide mb-2">Governance Status</div>
              <div className="flex flex-wrap gap-1.5">
                <AlignmentBadge state={selected.alignment_state} />
                <RiskBadge level={selected.risk_level} />
                <GovStatusBadge status={selected.governance_status} />
              </div>
              <div className="mt-1.5">
                <PlaneBadge plane={selected.plane} />
              </div>
            </div>

            {/* Owner / source */}
            <div className="space-y-2">
              <div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wide">Owner System</div>
                <div className="text-[11px] text-white font-mono mt-0.5">{selected.owner_system}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wide">Source of Signal</div>
                <div className="text-[10px] text-slate-300 mt-0.5">{selected.source_of_signal}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wide">Last Change</div>
                <div className="text-[10px] text-slate-300 font-mono mt-0.5">
                  {new Date(selected.last_change).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Evidence refs */}
            {selected.evidence_refs.length > 0 && (
              <div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wide mb-1">Evidence References</div>
                <div className="space-y-1">
                  {selected.evidence_refs.map(ref => (
                    <div key={ref} className="text-[10px] font-mono text-teal-400 bg-teal-900/10 border border-teal-600/20 rounded px-2 py-1">
                      {ref}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sage advisory */}
            <div className="rounded border border-teal-600/25 bg-teal-900/10 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span className="text-[9px] font-bold text-teal-400 uppercase tracking-wide">Sage — Advisory</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-relaxed">
                {selected.alignment_state === 'misaligned'
                  ? `This identity shows a critical gap between declared and verified state. The governance engine has flagged this for immediate review. Evidence is available for audit.`
                  : `This identity is aligned with declared policy. No governance action required at this time.`
                }
              </p>
              <div className="mt-1.5 text-[9px] text-slate-500 italic">
                Truth Model: v0.98 (simulated)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
