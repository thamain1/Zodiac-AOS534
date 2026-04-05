import { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import type { GovernedObject, Alert } from '../../types';
import { ScoreBar } from '../shared/ScoreBar';
import { AlignmentBadge, RiskBadge, GovStatusBadge, PlaneBadge } from '../shared/Badges';
import { TruthBadge } from '../shared/TruthBadge';

const CLOUD_TYPES: GovernedObject['type'][] = ['cloud_tenant', 'service_account', 'server'];

type ResourceGroup = 'all' | 'iam' | 'compute' | 'storage';

const GROUP_TAGS: Record<ResourceGroup, string[]> = {
  all:     [],
  iam:     ['iam-role', 'service-account'],
  compute: ['compute'],
  storage: ['storage'],
};

const RESOURCE_ICONS: Record<string, string> = {
  'iam-role':       '🔑',
  'service-account':'⚙',
  'compute':        '🖥',
  'storage':        '🗄',
  'prod':           '🟢',
  'dev':            '🔵',
};

function getResourceIcon(tags?: string[]): string {
  if (!tags) return '☁';
  for (const tag of tags) {
    if (RESOURCE_ICONS[tag]) return RESOURCE_ICONS[tag];
  }
  return '☁';
}

function IAMDriftChain({ obj }: { obj: GovernedObject }) {
  if (obj.alignment_state !== 'misaligned') return null;
  const isIAM    = obj.tags?.some(t => ['iam-role', 'over-provisioned'].includes(t));
  const isAccess = obj.tags?.includes('prod-access');
  const isPublic = obj.tags?.includes('public-exposure');

  return (
    <div className="mt-3 rounded border border-amber-500/30 bg-amber-500/5 p-3">
      <div className="text-[10px] font-bold text-amber-400 mb-2 uppercase tracking-wider">
        IAM Drift Chain
      </div>
      {isIAM && (
        <div className="flex items-start gap-1.5 text-[10px] text-slate-300">
          <span className="text-amber-400 mt-0.5">→</span>
          <span><span className="text-amber-300 font-semibold">Role over-provisioned</span> — admin role active in dev tenant where policy declares no-admin. Sage advisory: restrict immediately.</span>
        </div>
      )}
      {isAccess && (
        <div className="flex items-start gap-1.5 text-[10px] text-slate-300 mt-1.5">
          <span className="text-red-400 mt-0.5">→</span>
          <span><span className="text-red-300 font-semibold">Prod subnet access detected</span> — dev VM routing to production subnet. Network segmentation breach. Governance: blocked.</span>
        </div>
      )}
      {isPublic && (
        <div className="flex items-start gap-1.5 text-[10px] text-slate-300 mt-1.5">
          <span className="text-red-400 mt-0.5">→</span>
          <span><span className="text-red-300 font-semibold">Public ACL on dev storage</span> — bucket declared private, verified public-read. Log data potentially exposed.</span>
        </div>
      )}
    </div>
  );
}

function BeforeAfterPanel({ beforeScore, afterScore }: { beforeScore: number; afterScore: number }) {
  const [showAfter, setShowAfter] = useState(false);
  const score = showAfter ? afterScore : beforeScore;
  const scoreColor = score >= 70 ? 'text-verified' : score >= 40 ? 'text-warning' : 'text-critical';

  return (
    <div className="rounded border border-navy-700 bg-navy-800/60 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Governance Score</span>
        <button
          onClick={() => setShowAfter(v => !v)}
          className={`text-[9px] px-2 py-0.5 rounded transition-colors ${showAfter ? 'bg-teal-600 text-white' : 'bg-navy-700 text-slate-400 hover:text-white'}`}
        >
          {showAfter ? 'After Remediation' : 'Before Remediation'}
        </button>
      </div>
      <div className={`text-[28px] font-bold ${scoreColor} mb-1`}>{score}</div>
      <ScoreBar score={score} size="md" />
      {showAfter && (
        <div className="mt-2 text-[10px] text-teal-400">
          +{afterScore - beforeScore} points after cloud IAM remediation
        </div>
      )}
    </div>
  );
}

export function CloudGovernance() {
  const [cloudObjects, setCloudObjects] = useState<GovernedObject[]>([]);
  const [baseObjects,  setBaseObjects]  = useState<GovernedObject[]>([]);
  const [alerts,       setAlerts]       = useState<Alert[]>([]);
  const [selected,     setSelected]     = useState<GovernedObject | null>(null);
  const [group,        setGroup]        = useState<ResourceGroup>('all');

  const load = useCallback(async () => {
    try {
      const [objs, alrts] = await Promise.all([
        api.objects.list({ site: 'Cloud' }),
        api.alerts.list({ status: 'active' }),
      ]);
      // Combine base cloud objects with any server-side cloud objects
      const all = objs.data.filter(o => CLOUD_TYPES.includes(o.type) || o.site === 'Cloud');
      setBaseObjects(all);
      setCloudObjects(all);
      setAlerts(alrts.data);
      if (all.length > 0) setSelected(all.find(o => o.alignment_state === 'misaligned') ?? all[0]);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  const allObjs = [...cloudObjects, ...baseObjects].filter(
    (o, i, arr) => arr.findIndex(x => x.id === o.id) === i
  );

  const filtered = group === 'all'
    ? allObjs
    : allObjs.filter(o => GROUP_TAGS[group].some(tag => o.tags?.includes(tag)));

  const misalignedCount = allObjs.filter(o => o.alignment_state === 'misaligned').length;
  const criticalCount   = allObjs.filter(o => o.risk_level === 'critical').length;
  const avgScore = allObjs.length
    ? Math.round(allObjs.reduce((s, o) => s + o.truth_score, 0) / allObjs.length)
    : 0;

  const objectAlerts = (id: string) => alerts.filter(a => a.object_id === id);

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── LEFT: Resource List ────────────────────────────────────────────── */}
      <div className="w-72 border-r border-navy-700 flex flex-col">
        <div className="p-3 border-b border-navy-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-white">Cloud Governance</span>
            <span className="sim-badge">Simulated</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Sage · CloudIAM-B · Aegis — {allObjs.length} resources
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 border-b border-navy-700">
          {[
            { label: 'Avg Score',  value: avgScore,        color: avgScore >= 70 ? 'text-verified' : 'text-warning' },
            { label: 'Misaligned', value: misalignedCount, color: misalignedCount > 0 ? 'text-warning' : 'text-verified' },
            { label: 'Critical',   value: criticalCount,   color: criticalCount > 0  ? 'text-critical' : 'text-verified' },
          ].map(m => (
            <div key={m.label} className="p-2 text-center border-r border-navy-700 last:border-0">
              <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
              <div className="text-[9px] text-slate-500">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Group filter */}
        <div className="flex gap-1 p-2 border-b border-navy-700">
          {(['all', 'iam', 'compute', 'storage'] as ResourceGroup[]).map(g => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={`flex-1 text-[9px] py-1 rounded capitalize transition-colors ${
                group === g ? 'bg-teal-600 text-white font-semibold' : 'bg-navy-800 text-slate-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Resource list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(obj => {
            const isSelected = selected?.id === obj.id;
            const oAlerts    = objectAlerts(obj.id);
            return (
              <div
                key={obj.id}
                onClick={() => setSelected(obj)}
                className={`p-3 border-b border-navy-800 cursor-pointer transition-colors ${
                  isSelected ? 'bg-navy-700 border-l-2 border-l-teal-500' : 'hover:bg-navy-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px]">{getResourceIcon(obj.tags)}</span>
                  <span className="text-[10px] font-semibold text-white truncate">{obj.name}</span>
                  {oAlerts.length > 0 && (
                    <span className="ml-auto text-[9px] bg-red-500/20 text-red-400 px-1 py-0.5 rounded flex-shrink-0">
                      {oAlerts.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <AlignmentBadge state={obj.alignment_state} />
                  <RiskBadge level={obj.risk_level} />
                </div>
                <ScoreBar score={obj.truth_score} size="sm" />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CENTER: Cloud Truth Map ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[12px] font-bold text-white">Cloud Resource Truth Map</div>
              <div className="text-[10px] text-slate-500">
                IAM · Compute · Storage — Scenario 3: Cloud IAM Drift
              </div>
            </div>
            <TruthBadge label="simulated" />
          </div>

          {/* Before/After */}
          <BeforeAfterPanel beforeScore={41} afterScore={73} />

          {/* IAM Drift Callout */}
          <div className="mt-4 rounded border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="text-[11px] font-bold text-amber-400 mb-3">
              ⚠ Scenario 3 — Cloud IAM Drift Active
            </div>
            <div className="grid grid-cols-3 gap-3">
              {allObjs.filter(o => o.tags?.includes('scenario-3')).map(obj => (
                <div
                  key={obj.id}
                  onClick={() => setSelected(obj)}
                  className={`rounded border border-red-500/30 bg-red-500/5 p-3 cursor-pointer hover:bg-red-500/10 transition-colors ${selected?.id === obj.id ? 'ring-1 ring-teal-500' : ''}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px]">{getResourceIcon(obj.tags)}</span>
                    <span className="text-[10px] font-semibold text-white truncate">{obj.name}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-0.5 text-[9px] mb-2">
                    <div className="flex gap-1">
                      <span className="text-teal-400 w-14 flex-shrink-0">Declared:</span>
                      <span className="text-teal-300 font-mono truncate">{obj.declared_state.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-red-400 w-14 flex-shrink-0">Verified:</span>
                      <span className="text-red-300 font-mono truncate">{obj.verified_state.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                  <ScoreBar score={obj.truth_score} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* All resources grid */}
          <div className="mt-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              All Cloud Resources
            </div>
            <div className="grid grid-cols-3 gap-3">
              {allObjs.filter(o => !o.tags?.includes('scenario-3')).map(obj => (
                <div
                  key={obj.id}
                  onClick={() => setSelected(obj)}
                  className={`rounded border p-3 cursor-pointer transition-all ${
                    obj.alignment_state === 'aligned'
                      ? 'border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10'
                      : 'border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10'
                  } ${selected?.id === obj.id ? 'ring-1 ring-teal-500' : ''}`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[11px]">{getResourceIcon(obj.tags)}</span>
                    <span className="text-[10px] font-semibold text-white truncate">{obj.name}</span>
                  </div>
                  <AlignmentBadge state={obj.alignment_state} />
                  <div className="mt-2">
                    <ScoreBar score={obj.truth_score} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Detail + Sage ──────────────────────────────────────────── */}
      <div className="w-80 border-l border-navy-700 flex flex-col overflow-hidden">
        {selected ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-white">{selected.name}</span>
              <GovStatusBadge status={selected.governance_status} />
            </div>

            <ScoreBar score={selected.truth_score} size="md" showLabel />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div><div className="text-[9px] text-slate-500 mb-1">Alignment</div><AlignmentBadge state={selected.alignment_state} /></div>
              <div><div className="text-[9px] text-slate-500 mb-1">Risk</div><RiskBadge level={selected.risk_level} /></div>
              <div><div className="text-[9px] text-slate-500 mb-1">Plane</div><PlaneBadge plane={selected.plane} /></div>
              <div><div className="text-[9px] text-slate-500 mb-1">Site</div><span className="text-[10px] text-blue-400 font-semibold">{selected.site}</span></div>
            </div>

            {selected.alignment_state === 'misaligned' && (
              <div className="mt-3 rounded border border-navy-700 bg-navy-900/60 p-3">
                <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Declared vs Verified</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded bg-teal-500/10 border border-teal-500/20 p-2">
                    <div className="text-[9px] text-teal-400 font-bold mb-1">DECLARED</div>
                    <div className="text-[10px] text-teal-300 font-mono leading-relaxed">{selected.declared_state.replace(/_/g, ' ')}</div>
                  </div>
                  <div className="rounded bg-red-500/10 border border-red-500/20 p-2">
                    <div className="text-[9px] text-red-400 font-bold mb-1">VERIFIED</div>
                    <div className="text-[10px] text-red-300 font-mono leading-relaxed">{selected.verified_state.replace(/_/g, ' ')}</div>
                  </div>
                </div>
              </div>
            )}

            <IAMDriftChain obj={selected} />

            <div className="mt-3 rounded border border-navy-700 bg-navy-900/60 p-3">
              <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Signal</div>
              <div className="text-[10px] text-slate-300">{selected.description}</div>
              <div className="mt-2 text-[9px] text-slate-500">Source: {selected.source_of_signal}</div>
              <div className="text-[9px] text-slate-500">Last change: {new Date(selected.last_change).toLocaleString()}</div>
            </div>

            {selected.evidence_refs.length > 0 && (
              <div className="mt-3">
                <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Evidence Refs</div>
                <div className="flex flex-wrap gap-1">
                  {selected.evidence_refs.map(r => (
                    <span key={r} className="text-[9px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">{r}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3"><TruthBadge label={selected.truth_label} /></div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-[11px] text-slate-500">Select a cloud resource</div>
          </div>
        )}

        {/* Sage Advisory */}
        <div className="border-t border-navy-700 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[10px] font-bold text-teal-400">Sage — Cloud Governance Advisory</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-relaxed">
            {selected?.alignment_state === 'misaligned'
              ? `${selected.name} has declared vs verified divergence in the cloud IAM layer. This is Scenario 3 — admin role or over-provisioned access in dev tenant. Remedy: revoke excess role, re-attest IAM policy, generate evidence artifact via Apollo.`
              : selected
              ? `${selected.name} is cloud-governance aligned. IAM policy enforced. No corrective action required.`
              : 'Select a cloud resource for Sage advisory.'}
          </div>
        </div>
      </div>
    </div>
  );
}
