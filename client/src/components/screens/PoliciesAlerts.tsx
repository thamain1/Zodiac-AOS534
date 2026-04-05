import { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import type { PolicyRecord, Alert } from '../../types';
import { TruthBadge } from '../shared/TruthBadge';
import { SeverityBadge } from '../shared/Badges';

// ── Policy helpers ──────────────────────────────────────────────────────────

const DOMAIN_COLORS: Record<string, string> = {
  identity:   'text-blue-400   bg-blue-400/10   border-blue-400/20',
  network:    'text-teal-400   bg-teal-400/10   border-teal-400/20',
  cloud:      'text-purple-400 bg-purple-400/10 border-purple-400/20',
  api:        'text-orange-400 bg-orange-400/10 border-orange-400/20',
  endpoint:   'text-amber-400  bg-amber-400/10  border-amber-400/20',
  governance: 'text-slate-400  bg-slate-400/10  border-slate-400/20',
};

const STATUS_STYLES: Record<PolicyRecord['status'], string> = {
  active:     'text-verified bg-verified/10 border-verified/20',
  draft:      'text-amber-400 bg-amber-400/10 border-amber-400/20',
  deprecated: 'text-slate-500 bg-slate-700/30 border-slate-600/20',
};

const ACTION_STYLES: Record<PolicyRecord['action_on_fail'], string> = {
  block:    'text-critical',
  restrict: 'text-warning',
  alert:    'text-amber-400',
  notify:   'text-blue-400',
};

type PolicyFilter = 'all' | PolicyRecord['domain'];
type StatusFilter = 'all' | PolicyRecord['status'];
type MainView = 'policies' | 'alerts';

// ── Helm Advisory feed (static seeded) ─────────────────────────────────────
const HELM_ADVISORIES = [
  { id: 'helm-001', source: 'CISA KEV',      severity: 'critical' as const, message: 'VPN gateway MFA bypass pattern matches known threat actor TTP. Confidence: 0.74. Policy pol-005 triggered.',      ts: '2026-04-04T22:17:00Z' },
  { id: 'helm-002', source: 'ISACs',          severity: 'high'     as const, message: 'VLAN segmentation bypass technique active in sector. Correlates to net-002 drift. Policy pol-004 advisory.',      ts: '2026-04-04T18:05:00Z' },
  { id: 'helm-003', source: 'Vendor Advisory', severity: 'warning'  as const, message: 'TLS 1.2 deprecation advisory. 2 channels detected running TLS 1.2. Recommend upgrade timeline.',                ts: '2026-04-03T14:00:00Z' },
  { id: 'helm-004', source: 'CISA KEV',       severity: 'info'     as const, message: 'No new KEV entries match current environment. Next scan in 6 hours.',                                             ts: '2026-04-05T00:00:00Z' },
];

const CANON_SIGNALS = [
  { id: 'canon-001', label: 'Supply Chain Risk Preview', note: 'External threat-hunting for third-party component provenance. Maps to Scenario 8 — Roadmap only.', truth_label: 'roadmap' as const },
  { id: 'canon-002', label: 'Dark Web Credential Monitor', note: 'Monitors for organizational credential exposure. Alert feed integration pending.', truth_label: 'roadmap' as const },
];

function PolicyCard({ policy, selected, onClick }: { policy: PolicyRecord; selected: boolean; onClick: () => void }) {
  const domainStyle  = DOMAIN_COLORS[policy.domain]  ?? 'text-slate-400';
  const statusStyle  = STATUS_STYLES[policy.status];

  return (
    <div
      onClick={onClick}
      className={`p-3 border-b border-navy-800 cursor-pointer transition-colors ${
        selected ? 'bg-navy-700 border-l-2 border-l-teal-500' : 'hover:bg-navy-800'
      } ${policy.truth_label === 'roadmap' ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-[10px] font-semibold text-white leading-tight">{policy.name}</span>
        {policy.truth_label === 'roadmap' && <TruthBadge label="roadmap" />}
      </div>
      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border capitalize ${domainStyle}`}>
          {policy.domain}
        </span>
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border capitalize ${statusStyle}`}>
          {policy.status}
        </span>
        <span className="text-[9px] text-slate-500">{policy.version}</span>
      </div>
      <div className="flex items-center gap-2 text-[9px] text-slate-500">
        <span>Fail: <span className={`font-semibold ${ACTION_STYLES[policy.action_on_fail]}`}>{policy.action_on_fail}</span></span>
        <span>Threshold: {policy.truth_score_threshold}</span>
      </div>
    </div>
  );
}

function PolicyDetail({ policy }: { policy: PolicyRecord }) {
  return (
    <div className="p-4 overflow-y-auto h-full">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[13px] font-bold text-white leading-tight">{policy.name}</span>
        <TruthBadge label={policy.truth_label} />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-[10px] font-semibold px-2 py-1 rounded border capitalize ${DOMAIN_COLORS[policy.domain]}`}>
          {policy.domain}
        </span>
        <span className={`text-[10px] font-semibold px-2 py-1 rounded border capitalize ${STATUS_STYLES[policy.status]}`}>
          {policy.status}
        </span>
        <span className="text-[10px] text-slate-400 bg-navy-800 border border-navy-700 px-2 py-1 rounded">
          {policy.version}
        </span>
      </div>

      <div className="rounded border border-navy-700 bg-navy-800/60 p-3 mb-3">
        <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Policy Description</div>
        <div className="text-[11px] text-slate-300 leading-relaxed">{policy.description}</div>
      </div>

      <div className="rounded border border-navy-700 bg-navy-800/60 p-3 mb-3">
        <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Governance Parameters</div>
        <div className="space-y-2">
          {[
            { label: 'Truth score threshold', value: policy.truth_score_threshold, note: 'Score below triggers action' },
            { label: 'Action on fail',        value: <span className={`font-bold ${ACTION_STYLES[policy.action_on_fail]}`}>{policy.action_on_fail.toUpperCase()}</span> },
            { label: 'Approver',              value: policy.approver },
            { label: 'Version',               value: policy.version },
            { label: 'Last updated',          value: new Date(policy.updated_at).toLocaleDateString() },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center">
              <div>
                <div className="text-[9px] text-slate-500">{row.label}</div>
                {row.note && <div className="text-[8px] text-slate-600">{row.note}</div>}
              </div>
              <div className="text-[10px] text-slate-300">{row.value}</div>
            </div>
          ))}
        </div>
      </div>

      {policy.tags && policy.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {policy.tags.map(t => (
            <span key={t} className="text-[9px] text-slate-500 bg-navy-800 border border-navy-700 px-1.5 py-0.5 rounded">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export function PoliciesAlerts() {
  const [policies,  setPolicies]  = useState<PolicyRecord[]>([]);
  const [alerts,    setAlerts]    = useState<Alert[]>([]);
  const [selPolicy, setSelPolicy] = useState<PolicyRecord | null>(null);
  const [domFilter, setDomFilter] = useState<PolicyFilter>('all');
  const [stFilter,  setStFilter]  = useState<StatusFilter>('all');
  const [mainView,  setMainView]  = useState<MainView>('policies');

  const load = useCallback(async () => {
    try {
      const [pols, alrts] = await Promise.all([
        api.policies.list(),
        api.alerts.list(),
      ]);
      setPolicies(pols.data);
      setAlerts(alrts.data);
      setSelPolicy(pols.data[0] ?? null);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAck = async (id: string) => {
    try {
      await api.alerts.ack(id);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a));
    } catch { /* ignore */ }
  };

  const filteredPolicies = policies.filter(p => {
    if (domFilter !== 'all' && p.domain !== domFilter) return false;
    if (stFilter  !== 'all' && p.status !== stFilter)  return false;
    return true;
  });

  const domains: PolicyFilter[] = ['all', 'identity', 'network', 'cloud', 'api', 'governance'];
  const statuses: StatusFilter[] = ['all', 'active', 'draft', 'deprecated'];

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── LEFT: Policy / Alert List ──────────────────────────────────────── */}
      <div className="w-72 border-r border-navy-700 flex flex-col">
        {/* View toggle */}
        <div className="flex border-b border-navy-700">
          {(['policies', 'alerts'] as MainView[]).map(v => (
            <button
              key={v}
              onClick={() => setMainView(v)}
              className={`flex-1 py-2.5 text-[11px] font-semibold capitalize transition-colors ${
                mainView === v ? 'bg-navy-700 text-white border-b-2 border-teal-500' : 'text-slate-400 hover:text-white'
              }`}
            >
              {v === 'alerts' ? `Alerts (${alerts.filter(a => a.status === 'active').length})` : 'Policies'}
            </button>
          ))}
        </div>

        {mainView === 'policies' ? (
          <>
            {/* Filters */}
            <div className="p-2 border-b border-navy-700 space-y-2">
              <div className="flex flex-wrap gap-1">
                {domains.map(d => (
                  <button key={d} onClick={() => setDomFilter(d)}
                    className={`text-[9px] px-2 py-0.5 rounded capitalize transition-colors ${
                      domFilter === d ? 'bg-teal-600 text-white' : 'bg-navy-800 text-slate-400 hover:text-white'
                    }`}
                  >{d}</button>
                ))}
              </div>
              <div className="flex gap-1">
                {statuses.map(s => (
                  <button key={s} onClick={() => setStFilter(s)}
                    className={`flex-1 text-[9px] py-0.5 rounded capitalize transition-colors ${
                      stFilter === s ? 'bg-navy-600 text-white' : 'bg-navy-800 text-slate-400 hover:text-white'
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Policy list */}
            <div className="flex-1 overflow-y-auto">
              {filteredPolicies.map(p => (
                <PolicyCard
                  key={p.id}
                  policy={p}
                  selected={selPolicy?.id === p.id}
                  onClick={() => setSelPolicy(p)}
                />
              ))}
            </div>
          </>
        ) : (
          /* Alert list */
          <div className="flex-1 overflow-y-auto">
            {alerts.map(a => (
              <div key={a.id} className="p-3 border-b border-navy-800">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-white leading-tight">{a.title}</span>
                  <SeverityBadge severity={a.severity} />
                </div>
                <div className="text-[9px] text-slate-500 mb-2">{a.description}</div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] ${a.status === 'active' ? 'text-red-400' : a.status === 'acknowledged' ? 'text-amber-400' : 'text-verified'}`}>
                    ● {a.status}
                  </span>
                  {a.status === 'active' && (
                    <button
                      onClick={() => handleAck(a.id)}
                      className="text-[9px] px-2 py-0.5 bg-navy-700 hover:bg-navy-600 text-slate-300 rounded transition-colors"
                    >
                      Ack
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── CENTER: Policy Detail ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {mainView === 'policies' && selPolicy ? (
          <div className="flex-1 overflow-hidden">
            <PolicyDetail policy={selPolicy} />
          </div>
        ) : mainView === 'alerts' ? (
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-[12px] font-bold text-white mb-4">Alert Management</div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Active',       value: alerts.filter(a => a.status === 'active').length,       color: 'text-critical' },
                { label: 'Acknowledged', value: alerts.filter(a => a.status === 'acknowledged').length, color: 'text-warning' },
                { label: 'Resolved',     value: alerts.filter(a => a.status === 'resolved').length,     color: 'text-verified' },
              ].map(s => (
                <div key={s.label} className="rounded border border-navy-700 bg-navy-800/60 p-3 text-center">
                  <div className={`text-[22px] font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 italic">
              Select an alert from the left panel to manage it.
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-[11px] text-slate-500">Select a policy</div>
          </div>
        )}
      </div>

      {/* ── RIGHT: Helm + Canon + Agents ──────────────────────────────────── */}
      <div className="w-72 border-l border-navy-700 flex flex-col overflow-hidden">
        {/* Helm advisory feed */}
        <div className="border-b border-navy-700 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-400">Helm</span>
            <span className="text-[9px] text-slate-500">Threat Intel Validation</span>
          </div>
          <div className="space-y-2">
            {HELM_ADVISORIES.map(a => (
              <div key={a.id} className="rounded border border-navy-700 bg-navy-900/60 p-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`text-[9px] font-bold ${
                    a.severity === 'critical' ? 'text-critical' :
                    a.severity === 'high'     ? 'text-red-400' :
                    a.severity === 'warning'  ? 'text-warning' : 'text-blue-400'
                  }`}>
                    [{a.severity.toUpperCase()}]
                  </span>
                  <span className="text-[9px] text-slate-500">{a.source}</span>
                </div>
                <div className="text-[9px] text-slate-400 leading-relaxed">{a.message}</div>
                <div className="text-[8px] text-slate-600 mt-1 font-mono">
                  {new Date(a.ts).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Canon external signals — Roadmap */}
        <div className="border-b border-navy-700 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-[11px] font-bold text-purple-400">Canon</span>
            <span className="text-[9px] text-slate-500">External Threat-Hunting</span>
            <TruthBadge label="roadmap" />
          </div>
          <div className="space-y-2">
            {CANON_SIGNALS.map(s => (
              <div key={s.id} className="rounded border border-purple-500/20 bg-purple-500/5 p-2">
                <div className="text-[9px] font-semibold text-purple-300 mb-0.5">{s.label}</div>
                <div className="text-[9px] text-slate-500 leading-relaxed">{s.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Governing agents */}
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Governing Agents</div>
          <div className="space-y-2">
            {[
              { name: 'Aegis',  role: 'Network policy enforcement',   color: 'text-teal-400' },
              { name: 'Helm',   role: 'Threat intel correlation',     color: 'text-amber-400' },
              { name: 'Atlas',  role: 'Topology + blast radius',      color: 'text-blue-400' },
              { name: 'Argus',  role: 'Identity policy authority',    color: 'text-purple-400' },
            ].map(agent => (
              <div key={agent.name} className="flex items-center gap-2 rounded border border-navy-700 bg-navy-800/40 p-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />
                <div>
                  <div className={`text-[10px] font-bold ${agent.color}`}>{agent.name}</div>
                  <div className="text-[9px] text-slate-500">{agent.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-navy-700 p-2 flex gap-2">
          <span className="sim-badge">Governance Logic</span>
          <TruthBadge label="simulated" />
        </div>
      </div>
    </div>
  );
}
