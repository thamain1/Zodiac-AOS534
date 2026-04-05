import { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import type { GovernedObject, Alert } from '../../types';
import { ScoreBar } from '../shared/ScoreBar';
import { AlignmentBadge, RiskBadge, GovStatusBadge, PlaneBadge } from '../shared/Badges';
import { TruthBadge } from '../shared/TruthBadge';

const NETWORK_TYPES = ['network_appliance'];

const AGENTS = [
  { name: 'Bedrock', role: 'Hardware & Substrate Security', color: 'text-orange-400', status: 'active' },
  { name: 'Aegis',   role: 'Network Governance',            color: 'text-teal-400',   status: 'active' },
  { name: 'Atlas',   role: 'Topology & Dependency Mapping', color: 'text-blue-400',   status: 'active' },
];

const SITE_COLORS: Record<string, string> = {
  'HQ':          'text-teal-400',
  'Branch-East': 'text-amber-400',
  'Remote':      'text-red-400',
  'Cloud':       'text-blue-400',
};

type FilterMode = 'all' | 'misaligned' | 'critical';

function SubstrateRiskPanel({ obj }: { obj: GovernedObject }) {
  const isWireless = obj.tags?.includes('wireless');
  const isVPN      = obj.tags?.includes('vpn');
  const isDrift    = obj.tags?.includes('config-drift');

  if (!isWireless && !isVPN && !isDrift) return null;

  return (
    <div className="mt-3 rounded border border-amber-500/30 bg-amber-500/5 p-3">
      <div className="text-[10px] font-bold text-amber-400 mb-2 uppercase tracking-wider">
        Substrate Risk Indicators
      </div>
      {isWireless && (
        <div className="flex items-start gap-2 mb-1.5">
          <span className="text-amber-400 mt-0.5">⚠</span>
          <span className="text-[11px] text-slate-300">
            <span className="font-semibold text-amber-300">Physical-layer exposure</span> — WPA2-Personal broadcasting.
            Rogue device association possible. Bedrock substrate risk elevated.
          </span>
        </div>
      )}
      {isVPN && (
        <div className="flex items-start gap-2 mb-1.5">
          <span className="text-red-400 mt-0.5">⚠</span>
          <span className="text-[11px] text-slate-300">
            <span className="font-semibold text-red-300">MFA bypass active</span> — VPN gateway auth logs show
            token issuance without second factor. Aegis governance action: blocked.
          </span>
        </div>
      )}
      {isDrift && (
        <div className="flex items-start gap-2">
          <span className="text-amber-400 mt-0.5">⚠</span>
          <span className="text-[11px] text-slate-300">
            <span className="font-semibold text-amber-300">Policy version drift</span> — Running config behind
            declared version. VLAN segmentation gap on Finance subnet.
          </span>
        </div>
      )}
    </div>
  );
}

function PolicyDriftVisual({ obj }: { obj: GovernedObject }) {
  if (obj.alignment_state !== 'misaligned') return null;
  return (
    <div className="mt-3 rounded border border-navy-700 bg-navy-900/60 p-3">
      <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Declared vs Verified</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded bg-teal-500/10 border border-teal-500/20 p-2">
          <div className="text-[9px] text-teal-400 font-bold mb-1">DECLARED</div>
          <div className="text-[11px] text-teal-300 font-mono">{obj.declared_state}</div>
        </div>
        <div className="rounded bg-red-500/10 border border-red-500/20 p-2">
          <div className="text-[9px] text-red-400 font-bold mb-1">VERIFIED</div>
          <div className="text-[11px] text-red-300 font-mono">{obj.verified_state}</div>
        </div>
      </div>
    </div>
  );
}

export function NetworkSubstrate() {
  const [objects, setObjects] = useState<GovernedObject[]>([]);
  const [alerts,  setAlerts]  = useState<Alert[]>([]);
  const [selected, setSelected] = useState<GovernedObject | null>(null);
  const [filter, setFilter] = useState<FilterMode>('all');

  const load = useCallback(async () => {
    try {
      const [objs, alrts] = await Promise.all([
        api.objects.list({ type: 'network_appliance' }),
        api.alerts.list({ status: 'active' }),
      ]);
      setObjects(objs.data);
      setAlerts(alrts.data);
      if (objs.data.length > 0 && !selected) setSelected(objs.data[0]);
    } catch { /* ignore */ }
  }, [selected]);

  useEffect(() => { load(); }, [load]);

  const filtered = objects.filter(o => {
    if (filter === 'misaligned') return o.alignment_state === 'misaligned';
    if (filter === 'critical')   return o.risk_level === 'critical';
    return true;
  });

  const objectAlerts = (id: string) => alerts.filter(a => a.object_id === id);

  const avgScore = objects.length
    ? Math.round(objects.reduce((s, o) => s + o.truth_score, 0) / objects.length)
    : 0;
  const misalignedCount = objects.filter(o => o.alignment_state === 'misaligned').length;
  const criticalCount   = objects.filter(o => o.risk_level === 'critical').length;

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── LEFT: Appliance List ───────────────────────────────────────────── */}
      <div className="w-72 border-r border-navy-700 flex flex-col">
        {/* Header */}
        <div className="p-3 border-b border-navy-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-white">Network / Substrate</span>
            <span className="sim-badge">Simulated</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {NETWORK_TYPES.join(' · ')} — {objects.length} objects
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 border-b border-navy-700">
          {[
            { label: 'Avg Score', value: avgScore,         color: avgScore >= 70 ? 'text-verified' : avgScore >= 40 ? 'text-warning' : 'text-critical' },
            { label: 'Misaligned', value: misalignedCount, color: misalignedCount > 0 ? 'text-warning' : 'text-verified' },
            { label: 'Critical',   value: criticalCount,   color: criticalCount > 0  ? 'text-critical' : 'text-verified' },
          ].map(m => (
            <div key={m.label} className="p-2 text-center border-r border-navy-700 last:border-0">
              <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
              <div className="text-[9px] text-slate-500">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-1 p-2 border-b border-navy-700">
          {(['all', 'misaligned', 'critical'] as FilterMode[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 text-[10px] py-1 rounded capitalize transition-colors ${
                filter === f
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-navy-800 text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Appliance list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(obj => {
            const isSelected = selected?.id === obj.id;
            const objAlerts  = objectAlerts(obj.id);
            return (
              <div
                key={obj.id}
                onClick={() => setSelected(obj)}
                className={`p-3 border-b border-navy-800 cursor-pointer transition-colors ${
                  isSelected ? 'bg-navy-700 border-l-2 border-l-teal-500' : 'hover:bg-navy-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-white">{obj.name}</span>
                  {objAlerts.length > 0 && (
                    <span className="text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                      {objAlerts.length} alert{objAlerts.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <AlignmentBadge state={obj.alignment_state} />
                  <RiskBadge level={obj.risk_level} />
                  <span className={`text-[9px] ${SITE_COLORS[obj.site ?? ''] ?? 'text-slate-400'}`}>
                    {obj.site}
                  </span>
                </div>
                <ScoreBar score={obj.truth_score} size="sm" />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CENTER: Topology + Agents ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Network topology visual */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[12px] font-bold text-white">Network Governance View</div>
              <div className="text-[10px] text-slate-500">
                Physical · Logical · Transport layers — Aegis + Bedrock + Atlas
              </div>
            </div>
            <TruthBadge label="simulated" />
          </div>

          {/* Multi-vendor drift indicator */}
          <div className="rounded border border-navy-700 bg-navy-800/60 p-4 mb-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Multi-Vendor Policy Drift Map — Scenario 4
            </div>
            <div className="grid grid-cols-3 gap-3">
              {objects.filter(o => o.tags?.includes('scenario-4') || o.alignment_state === 'misaligned').map(obj => (
                <div
                  key={obj.id}
                  onClick={() => setSelected(obj)}
                  className={`rounded border p-3 cursor-pointer transition-all ${
                    obj.risk_level === 'critical'
                      ? 'border-red-500/40 bg-red-500/5 hover:bg-red-500/10'
                      : obj.alignment_state === 'misaligned'
                      ? 'border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10'
                      : 'border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10'
                  } ${selected?.id === obj.id ? 'ring-1 ring-teal-500' : ''}`}
                >
                  <div className="text-[11px] font-semibold text-white mb-1">{obj.name}</div>
                  <div className="text-[9px] text-slate-400 mb-2">{obj.site} · {obj.type.replace('_', ' ')}</div>
                  <div className="grid grid-cols-2 gap-1 text-[9px]">
                    <div className="text-teal-400">Declared:</div>
                    <div className="text-teal-300 font-mono truncate">{obj.declared_state.split('_')[0]}</div>
                    <div className={obj.alignment_state === 'misaligned' ? 'text-red-400' : 'text-teal-400'}>Verified:</div>
                    <div className={`font-mono truncate ${obj.alignment_state === 'misaligned' ? 'text-red-300' : 'text-teal-300'}`}>
                      {obj.verified_state.split('_')[0]}
                    </div>
                  </div>
                  <div className="mt-2">
                    <ScoreBar score={obj.truth_score} size="sm" />
                  </div>
                </div>
              ))}
              {objects.filter(o => o.alignment_state === 'aligned').map(obj => (
                <div
                  key={obj.id}
                  onClick={() => setSelected(obj)}
                  className={`rounded border border-teal-500/20 bg-teal-500/5 p-3 cursor-pointer transition-all hover:bg-teal-500/10 ${selected?.id === obj.id ? 'ring-1 ring-teal-500' : ''}`}
                >
                  <div className="text-[11px] font-semibold text-white mb-1">{obj.name}</div>
                  <div className="text-[9px] text-slate-400 mb-2">{obj.site} · {obj.type.replace('_', ' ')}</div>
                  <div className="grid grid-cols-2 gap-1 text-[9px]">
                    <div className="text-teal-400">Declared:</div>
                    <div className="text-teal-300 font-mono truncate">{obj.declared_state.split('_')[0]}</div>
                    <div className="text-teal-400">Verified:</div>
                    <div className="text-teal-300 font-mono truncate">{obj.verified_state.split('_')[0]}</div>
                  </div>
                  <div className="mt-2">
                    <ScoreBar score={obj.truth_score} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Agents */}
          <div className="rounded border border-navy-700 bg-navy-800/60 p-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Active Governance Agents
            </div>
            <div className="grid grid-cols-3 gap-3">
              {AGENTS.map(agent => (
                <div key={agent.name} className="rounded border border-navy-700 bg-navy-900/60 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    <span className={`text-[12px] font-bold ${agent.color}`}>{agent.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{agent.role}</div>
                  <div className="mt-2 text-[9px] text-teal-400 bg-teal-500/10 rounded px-2 py-1">
                    {agent.status === 'active' ? '● Active — monitoring' : '○ Standby'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Object Detail ────────────────────────────────────────────── */}
      <div className="w-80 border-l border-navy-700 flex flex-col overflow-hidden">
        {selected ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-white">{selected.name}</span>
              <GovStatusBadge status={selected.governance_status} />
            </div>

            <ScoreBar score={selected.truth_score} size="md" showLabel />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <div className="text-[9px] text-slate-500 mb-1">Alignment</div>
                <AlignmentBadge state={selected.alignment_state} />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 mb-1">Risk</div>
                <RiskBadge level={selected.risk_level} />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 mb-1">Plane</div>
                <PlaneBadge plane={selected.plane} />
              </div>
              <div>
                <div className="text-[9px] text-slate-500 mb-1">Site</div>
                <span className={`text-[10px] font-semibold ${SITE_COLORS[selected.site ?? ''] ?? 'text-slate-400'}`}>
                  {selected.site}
                </span>
              </div>
            </div>

            <PolicyDriftVisual obj={selected} />
            <SubstrateRiskPanel obj={selected} />

            <div className="mt-3 rounded border border-navy-700 bg-navy-900/60 p-3">
              <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Signal</div>
              <div className="text-[10px] text-slate-300">{selected.description}</div>
              <div className="mt-2 text-[9px] text-slate-500">
                Source: {selected.source_of_signal}
              </div>
              <div className="text-[9px] text-slate-500">
                Owner: {selected.owner_system}
              </div>
              <div className="text-[9px] text-slate-500">
                Last change: {new Date(selected.last_change).toLocaleString()}
              </div>
            </div>

            {selected.evidence_refs.length > 0 && (
              <div className="mt-3">
                <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Evidence Refs</div>
                <div className="flex flex-wrap gap-1">
                  {selected.evidence_refs.map(r => (
                    <span key={r} className="text-[9px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Alerts for this object */}
            {objectAlerts(selected.id).length > 0 && (
              <div className="mt-3">
                <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Active Alerts</div>
                {objectAlerts(selected.id).map(a => (
                  <div key={a.id} className="mb-2 rounded border border-red-500/30 bg-red-500/5 p-2">
                    <div className="text-[10px] font-semibold text-red-300">{a.title}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{a.description}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3">
              <TruthBadge label={selected.truth_label} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-[11px] text-slate-500">Select an appliance</div>
          </div>
        )}

        {/* Sage Advisory */}
        <div className="border-t border-navy-700 p-3">
          <div className="text-[9px] font-bold text-teal-400 mb-1.5">SAGE — Governance Advisory</div>
          <div className="text-[10px] text-slate-400 leading-relaxed">
            {selected?.alignment_state === 'misaligned'
              ? `${selected.name} shows declared vs verified divergence. Aegis recommends policy re-attestation. Bedrock confirms substrate risk. Atlas has mapped downstream blast radius.`
              : selected?.alignment_state === 'aligned'
              ? `${selected?.name} is governance-aligned. Truth score validated by Apollo. No corrective action required.`
              : 'Select a network object to receive governance advisory.'}
          </div>
          <div className="mt-1.5 text-[9px] text-slate-600">
            AOS534 does NOT detect issues — intelligence + evidence + context
          </div>
        </div>
      </div>
    </div>
  );
}
