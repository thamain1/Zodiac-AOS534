import { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import type { GovernedObject } from '../../types';
import { ScoreBar } from '../shared/ScoreBar';
import { AlignmentBadge, RiskBadge, GovStatusBadge } from '../shared/Badges';
import { TruthBadge } from '../shared/TruthBadge';

type RequestStatus = 'inspected' | 'bypassed' | 'blocked' | 'pending';

interface SimRequest {
  id: string;
  method: string;
  path: string;
  source: string;
  inline: RequestStatus;
  proxy: RequestStatus;
  policy: string;
  latency_inline: number;
  latency_proxy: number;
}

const SIMULATED_REQUESTS: SimRequest[] = [
  { id: 'req-001', method: 'POST', path: '/api/v2/auth/token',      source: '10.0.1.45',  inline: 'inspected', proxy: 'inspected', policy: 'Auth-Policy-v3', latency_inline: 8,   latency_proxy: 12  },
  { id: 'req-002', method: 'GET',  path: '/api/v1/users/export',    source: '10.0.1.202', inline: 'blocked',   proxy: 'bypassed',  policy: 'DataExport-Block', latency_inline: 6, latency_proxy: 0   },
  { id: 'req-003', method: 'PUT',  path: '/api/v2/config/override', source: '10.0.45.17', inline: 'inspected', proxy: 'bypassed',  policy: 'Config-Policy-v2', latency_inline: 11, latency_proxy: 0  },
  { id: 'req-004', method: 'GET',  path: '/api/v1/health',          source: '10.0.0.1',   inline: 'inspected', proxy: 'inspected', policy: 'Allow-Health',    latency_inline: 3,  latency_proxy: 4   },
  { id: 'req-005', method: 'DELETE', path: '/api/v2/records/batch', source: '192.168.45.17', inline: 'blocked', proxy: 'bypassed', policy: 'Delete-Restrict', latency_inline: 7, latency_proxy: 0  },
  { id: 'req-006', method: 'POST', path: '/api/v3/ingest/bulk',     source: '10.0.2.88',  inline: 'inspected', proxy: 'pending',   policy: 'Ingest-Policy-v1', latency_inline: 14, latency_proxy: 0  },
  { id: 'req-007', method: 'GET',  path: '/api/v2/reports/audit',   source: '10.0.1.101', inline: 'inspected', proxy: 'inspected', policy: 'Report-Allow',    latency_inline: 9,  latency_proxy: 11  },
  { id: 'req-008', method: 'PATCH', path: '/api/v2/users/role',     source: '10.0.45.17', inline: 'blocked',   proxy: 'bypassed',  policy: 'RoleChange-Block', latency_inline: 5, latency_proxy: 0  },
];

const STATUS_STYLES: Record<RequestStatus, { dot: string; text: string; bg: string }> = {
  inspected: { dot: 'bg-verified',  text: 'text-verified', bg: 'bg-verified/10 border-verified/20' },
  blocked:   { dot: 'bg-critical',  text: 'text-critical', bg: 'bg-critical/10 border-critical/20' },
  bypassed:  { dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  pending:   { dot: 'bg-slate-400', text: 'text-slate-400', bg: 'bg-slate-400/10 border-slate-400/20' },
};

const METHOD_COLORS: Record<string, string> = {
  GET:    'text-blue-400 bg-blue-400/10',
  POST:   'text-teal-400 bg-teal-400/10',
  PUT:    'text-amber-400 bg-amber-400/10',
  PATCH:  'text-amber-400 bg-amber-400/10',
  DELETE: 'text-red-400 bg-red-400/10',
};

function RequestRow({ req, showDelta }: { req: SimRequest; showDelta: boolean }) {
  const inlineSt  = STATUS_STYLES[req.inline];
  const proxySt   = STATUS_STYLES[req.proxy];
  const hasDelta  = req.inline !== req.proxy;

  return (
    <div className={`grid grid-cols-12 gap-2 py-2 px-3 border-b border-navy-800 text-[10px] items-center ${hasDelta && showDelta ? 'bg-amber-500/5' : 'hover:bg-navy-800/40'} transition-colors`}>
      <div className="col-span-1">
        <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[9px] ${METHOD_COLORS[req.method] ?? 'text-slate-400'}`}>
          {req.method}
        </span>
      </div>
      <div className="col-span-3 font-mono text-slate-300 truncate">{req.path}</div>
      <div className="col-span-2 font-mono text-slate-500">{req.source}</div>
      <div className="col-span-2">
        <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${inlineSt.bg}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${inlineSt.dot}`} />
          <span className={inlineSt.text}>{req.inline}</span>
          {req.inline !== 'bypassed' && req.inline !== 'pending' && (
            <span className="text-slate-600">{req.latency_inline}ms</span>
          )}
        </span>
      </div>
      <div className="col-span-2">
        <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${proxySt.bg}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${proxySt.dot}`} />
          <span className={proxySt.text}>{req.proxy}</span>
          {req.proxy === 'inspected' && (
            <span className="text-slate-600">{req.latency_proxy}ms</span>
          )}
        </span>
      </div>
      <div className="col-span-2 text-slate-500 truncate">{req.policy}</div>
    </div>
  );
}

export function AdvancedAPI() {
  const [edgeGw,  setEdgeGw]  = useState<GovernedObject | null>(null);
  const [coreGw,  setCoreGw]  = useState<GovernedObject | null>(null);
  const [showDelta, setShowDelta] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await api.objects.list({ type: 'api_gateway' });
      setEdgeGw(res.data.find(o => o.id === 'api-001') ?? null);
      setCoreGw(res.data.find(o => o.id === 'api-002') ?? null);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  const inlineBypassCount  = SIMULATED_REQUESTS.filter(r => r.proxy === 'bypassed').length;
  const totalRequests      = SIMULATED_REQUESTS.length;
  const inspectionRate     = Math.round(((totalRequests - inlineBypassCount) / totalRequests) * 100);
  const blockedCount       = SIMULATED_REQUESTS.filter(r => r.inline === 'blocked').length;

  return (
    <div className="flex h-full overflow-hidden flex-col">
      {/* ── TOP: Mode Comparison Banner ──────────────────────────────────────── */}
      <div className="border-b border-navy-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[12px] font-bold text-white">Advanced API Governance</div>
            <div className="text-[10px] text-slate-500">
              Inline Inspection vs Proxy Mode — Scenario 5 · Fail-open / Fail-closed analysis
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDelta(!showDelta)}
              className={`text-[10px] px-3 py-1.5 rounded border transition-colors ${showDelta ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' : 'border-navy-600 text-slate-400 hover:text-white'}`}
            >
              {showDelta ? '● Highlighting mode gaps' : '○ Show mode gaps'}
            </button>
            <TruthBadge label="simulated" />
          </div>
        </div>

        {/* Gateway cards side by side */}
        <div className="grid grid-cols-2 gap-4">
          {/* EDGE — degraded proxy, fail-open */}
          <div className="rounded border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-[13px] font-bold text-white">{edgeGw?.name ?? 'API-GW-EDGE'}</div>
                <div className="text-[10px] text-amber-400 font-semibold">PROXY MODE — DEGRADED</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-slate-500 mb-0.5">FAIL BEHAVIOR</div>
                <div className="text-[12px] font-bold text-amber-300 bg-amber-500/15 px-2 py-1 rounded">
                  FAIL-OPEN
                </div>
              </div>
            </div>

            <div className="text-[10px] text-amber-200/70 mb-3">
              Edge gateway — traffic routed <em>around</em> the inspection engine when proxy degrades.
              Uninspected requests transit to backend. Suitable for edge, NOT for core paths.
            </div>

            {edgeGw && (
              <>
                <ScoreBar score={edgeGw.truth_score} size="sm" showLabel />
                <div className="mt-2 flex gap-2">
                  <AlignmentBadge state={edgeGw.alignment_state} />
                  <RiskBadge level={edgeGw.risk_level} />
                  <GovStatusBadge status={edgeGw.governance_status} />
                </div>
              </>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded bg-navy-900/60 border border-navy-700 p-2 text-center">
                <div className="text-[16px] font-bold text-amber-300">{inlineBypassCount}</div>
                <div className="text-[9px] text-slate-500">Requests bypassed</div>
              </div>
              <div className="rounded bg-navy-900/60 border border-navy-700 p-2 text-center">
                <div className="text-[16px] font-bold text-amber-300">{100 - inspectionRate}%</div>
                <div className="text-[9px] text-slate-500">Uninspected traffic</div>
              </div>
            </div>
          </div>

          {/* CORE — inline, fail-closed */}
          <div className="rounded border border-teal-500/30 bg-teal-500/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-[13px] font-bold text-white">{coreGw?.name ?? 'API-GW-CORE'}</div>
                <div className="text-[10px] text-teal-400 font-semibold">INLINE MODE — ACTIVE</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] text-slate-500 mb-0.5">FAIL BEHAVIOR</div>
                <div className="text-[12px] font-bold text-teal-300 bg-teal-500/15 px-2 py-1 rounded">
                  FAIL-CLOSED
                </div>
              </div>
            </div>

            <div className="text-[10px] text-teal-200/70 mb-3">
              Core gateway — traffic passes <em>through</em> the inspection engine synchronously.
              If inspection fails, request is dropped. Required for core and middleware paths.
            </div>

            {coreGw && (
              <>
                <ScoreBar score={coreGw.truth_score} size="sm" showLabel />
                <div className="mt-2 flex gap-2">
                  <AlignmentBadge state={coreGw.alignment_state} />
                  <RiskBadge level={coreGw.risk_level} />
                  <GovStatusBadge status={coreGw.governance_status} />
                </div>
              </>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded bg-navy-900/60 border border-navy-700 p-2 text-center">
                <div className="text-[16px] font-bold text-teal-300">100%</div>
                <div className="text-[9px] text-slate-500">Inspection coverage</div>
              </div>
              <div className="rounded bg-navy-900/60 border border-navy-700 p-2 text-center">
                <div className="text-[16px] font-bold text-teal-300">{blockedCount}</div>
                <div className="text-[9px] text-slate-500">Requests blocked</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE: Key Distinction Callout ─────────────────────────────────── */}
      <div className="border-b border-navy-700 px-4 py-2 bg-navy-800/40">
        <div className="flex gap-6 text-[10px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-amber-400" />
            <span className="text-slate-400"><span className="text-amber-300 font-semibold">Fail-open</span> — Edge use. Degradation allows uninspected traffic. Risk accepted at perimeter.</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-teal-400" />
            <span className="text-slate-400"><span className="text-teal-300 font-semibold">Fail-closed</span> — Core / middleware. Degradation blocks traffic. Risk rejected at service boundary.</span>
          </div>
          <div className="ml-auto text-slate-600 italic">
            AOS534 validates actual inspection behavior against declared policy
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Request Table ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="border-b border-navy-700 px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-white">
              Request Inspection Log
              <span className="ml-2 text-[9px] text-slate-500 font-normal">Simulated trace — Scenario 5</span>
            </div>
            <div className="flex gap-4 text-[10px]">
              <span className="text-slate-400">
                Inline: <span className="text-verified font-semibold">100%</span> inspected
              </span>
              <span className="text-slate-400">
                Proxy: <span className="text-amber-400 font-semibold">{inspectionRate}%</span> inspected
              </span>
              <span className="text-slate-400">
                Blocked: <span className="text-critical font-semibold">{blockedCount}</span> (inline only)
              </span>
            </div>
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-12 gap-2 px-3 py-1.5 bg-navy-800/60 border-b border-navy-800 text-[9px] text-slate-500 uppercase tracking-wider">
          <div className="col-span-1">Method</div>
          <div className="col-span-3">Path</div>
          <div className="col-span-2">Source IP</div>
          <div className="col-span-2">Inline (Core)</div>
          <div className="col-span-2">Proxy (Edge)</div>
          <div className="col-span-2">Policy</div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {SIMULATED_REQUESTS.map(req => (
            <RequestRow key={req.id} req={req} showDelta={showDelta} />
          ))}
        </div>
      </div>

      {/* ── BOTTOM: Evidence footer ───────────────────────────────────────────── */}
      <div className="border-t border-navy-700 px-4 py-2 flex items-center gap-4">
        <div className="text-[9px] text-slate-500">Evidence refs: evd-018 · evd-022</div>
        <div className="text-[9px] text-slate-500">Apollo signed · Conduit sealed · Aegis validated</div>
        <div className="ml-auto flex gap-2">
          <span className="sim-badge">Simulated Data</span>
          <span className="sim-badge">Governance Logic</span>
        </div>
      </div>
    </div>
  );
}
