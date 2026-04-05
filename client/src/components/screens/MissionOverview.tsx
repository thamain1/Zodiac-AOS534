import { useAppStore } from '../../store';
import { ScoreBar } from '../shared/ScoreBar';
import { TruthBadge } from '../shared/TruthBadge';
import { SeverityBadge } from '../shared/Badges';
import { clsx } from 'clsx';

const AGENTS = [
  { name: 'Argus',    role: 'Identity & Trust Authority',          screen: '03' },
  { name: 'Verdict',  role: 'Governance Reasoning',                 screen: '07' },
  { name: 'Bedrock',  role: 'Hardware / Substrate Security',        screen: '05' },
  { name: 'Aegis',    role: 'Network Governance',                   screen: '05' },
  { name: 'Apollo',   role: 'Truth & Evidence Authority',           screen: '08' },
  { name: 'Conduit',  role: 'Secure Logging & Forensic Correlation',screen: '08' },
  { name: 'Atlas',    role: 'Topology & Dependency Mapping',        screen: '02' },
  { name: 'Chronicle',role: 'Narrative Reporting',                  screen: '09' },
  { name: 'Sage',     role: 'Explainability & Human Guidance',      screen: '03' },
  { name: 'Helm',     role: 'Threat Intelligence Validation',       screen: '11' },
  { name: 'Canon',    role: 'External Threat Hunting',              screen: '11' },
  { name: 'Relic',    role: 'Historical Memory & Evidence Recall',  screen: '08' },
];

const WORKFLOW = [
  { step: '01', name: 'Signal Intake',       desc: 'Ingest signals from distributed agents and integrations' },
  { step: '02', name: 'Correlation',          desc: 'Link signals across time, space, entity, and behavior' },
  { step: '03', name: 'Truth Validation',     desc: 'Validate against authoritative sources — algorithm-driven' },
  { step: '04', name: 'Decision',             desc: 'Present validated evidence for human or automated decisioning' },
  { step: '05', name: 'Evidence & Replay',    desc: 'Preserve chain-of-custody, enable forensic replay' },
];

const INTEGRATIONS = ['Splunk', 'IBM QRadar', 'Wazuh'];

export function MissionOverview() {
  const { environment, alerts, simulatorMode } = useAppStore();

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticals = activeAlerts.filter(a => a.severity === 'critical');
  const govScore = environment?.governance_score ?? 67;

  return (
    <div className="flex flex-col gap-4 p-5 overflow-y-auto h-full">

      {/* Top banner */}
      <div className="glass rounded-lg p-4 border border-teal-600/20">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black text-white tracking-tight">ZODIAC — Mission Overview</h1>
              <TruthBadge label="simulated" />
            </div>
            <p className="text-sm text-slate-400 max-w-2xl">
              AOS534 is the <span className="text-teal-400 font-semibold">truth, evidence, and decision layer</span> that
              sits above and across your existing security tools. It does not replace them — it{' '}
              <span className="text-white font-semibold">unifies, scrutinizes, and validates</span> across them.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="sim-badge">Simulated Environment</span>
            <span className="sim-badge sim-badge-simulated">Demo Mode</span>
          </div>
        </div>

        {/* Core mindset quote */}
        <div className="mt-3 border border-teal-600/30 rounded bg-teal-900/10 px-4 py-2">
          <p className="text-[13px] text-teal-300 italic font-medium">
            "AOS534 does NOT detect issues — you identify issues by combining{' '}
            <span className="text-white font-bold not-italic">Intelligence + Evidence + Context</span>."
          </p>
        </div>
      </div>

      {/* Status strip */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Governance Score', value: govScore, type: 'score' as const },
          { label: 'Evidence Confidence', value: Math.round((environment?.evidence_confidence ?? 0.87) * 100), type: 'pct' as const, color: 'teal' },
          { label: 'Active Alerts', value: activeAlerts.length, type: 'count' as const, color: activeAlerts.length > 0 ? 'amber' : 'green' },
          { label: 'CP Health', value: environment?.cp_health ?? 94, type: 'pct' as const, color: 'green' },
          { label: 'DP Health', value: environment?.dp_health ?? 88, type: 'pct' as const, color: 'green' },
        ].map(item => (
          <div key={item.label} className="glass rounded-lg p-3">
            <div className="text-[9px] text-slate-400 uppercase tracking-wide mb-1">{item.label}</div>
            {item.type === 'score' ? (
              <ScoreBar score={item.value} size="md" />
            ) : (
              <div className={clsx(
                'text-2xl font-black tabular-nums',
                item.color === 'teal' ? 'text-teal-400' :
                item.color === 'amber' ? 'text-warning' :
                item.color === 'green' ? 'text-verified' : 'text-white'
              )}>
                {item.value}{item.type === 'pct' ? '%' : ''}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">

        {/* 5-Stage Workflow */}
        <div className="col-span-2 glass rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-bold text-teal-400 uppercase tracking-wide">
              The 5-Stage Governance Workflow
            </h2>
            <TruthBadge label="runtime_inspired" />
          </div>
          <div className="flex gap-2">
            {WORKFLOW.map((w, i) => (
              <div key={w.step} className="flex-1 flex flex-col">
                <div className="glass rounded p-3 border border-teal-600/15 flex-1">
                  <div className="text-[18px] font-black text-teal-600 leading-none mb-1">{w.step}</div>
                  <div className="text-[11px] font-bold text-white mb-1">{w.name}</div>
                  <div className="text-[10px] text-slate-400 leading-relaxed">{w.desc}</div>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <div className="flex justify-end pr-0 pt-1">
                    <span className="text-teal-600 text-[10px]">▶</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* IS / IS NOT */}
        <div className="glass rounded-lg p-4">
          <h2 className="text-[11px] font-bold text-teal-400 uppercase tracking-wide mb-3">
            Governance Overlay
          </h2>
          <div className="space-y-1 mb-3">
            {[
              'Governance-first truth platform',
              'Evidence-driven decision environment',
              'Auditable, replayable intelligence layer',
              'Court-defensible chain-of-custody',
            ].map(item => (
              <div key={item} className="flex items-start gap-1.5">
                <span className="text-verified text-[10px] mt-0.5">✓</span>
                <span className="text-[10px] text-slate-300">{item}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-navy-600 pt-2 space-y-1">
            {[
              'Not a SIEM / XDR replacement',
              'Not a vendor takeover tool',
              'Not an alert console',
            ].map(item => (
              <div key={item} className="flex items-start gap-1.5">
                <span className="text-slate-600 text-[10px] mt-0.5">✗</span>
                <span className="text-[10px] text-slate-500">{item}</span>
              </div>
            ))}
          </div>

          {/* Integrations */}
          <div className="mt-3 border-t border-navy-600 pt-2">
            <div className="text-[9px] text-slate-500 uppercase tracking-wide mb-1.5">Governance Overlay Across</div>
            <div className="flex gap-1 flex-wrap">
              {INTEGRATIONS.map(i => (
                <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded bg-navy-700 border border-navy-600 text-slate-300">
                  {i}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">

        {/* Agent Constellation */}
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-bold text-teal-400 uppercase tracking-wide">
              Agent Network — 12 Governance Agents
            </h2>
            <TruthBadge label="simulated" />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {AGENTS.map(agent => (
              <div key={agent.name} className="glass rounded p-2 border border-navy-600 hover:border-teal-600/30 transition-all">
                <div className="text-[11px] font-bold text-teal-400">{agent.name}</div>
                <div className="text-[9px] text-slate-500 leading-tight mt-0.5">{agent.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Alerts preview */}
        <div className="glass rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-bold text-teal-400 uppercase tracking-wide">
              Active Governance Alerts
            </h2>
            <span className={clsx(
              'text-[11px] font-bold tabular-nums',
              criticals.length > 0 ? 'text-critical' : 'text-warning'
            )}>
              {activeAlerts.length} Active
            </span>
          </div>
          {activeAlerts.length === 0 ? (
            <div className="text-[11px] text-slate-500 py-4 text-center">No active alerts</div>
          ) : (
            <div className="space-y-2">
              {activeAlerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="flex items-start gap-2 rounded bg-navy-800 p-2 border border-navy-700">
                  <SeverityBadge severity={alert.severity} className="shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-white truncate">{alert.title}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      {new Date(alert.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              {activeAlerts.length > 5 && (
                <div className="text-[9px] text-slate-500 text-center">+{activeAlerts.length - 5} more</div>
              )}
            </div>
          )}

          {/* Before/After teaser */}
          {simulatorMode === 'executive' && (
            <div className="mt-3 border-t border-navy-600 pt-2">
              <div className="text-[9px] text-slate-500 uppercase tracking-wide mb-1.5">Before / After AOS534</div>
              <div className="flex gap-2">
                <div className="flex-1 rounded bg-critical/10 border border-critical/20 p-2">
                  <div className="text-[9px] text-slate-500 uppercase">Before</div>
                  <div className="text-lg font-black text-critical tabular-nums">42</div>
                  <div className="text-[9px] text-slate-500">Gov Score</div>
                </div>
                <div className="flex items-center text-slate-600">→</div>
                <div className="flex-1 rounded bg-verified/10 border border-verified/20 p-2">
                  <div className="text-[9px] text-slate-500 uppercase">After</div>
                  <div className="text-lg font-black text-verified tabular-nums">{govScore}</div>
                  <div className="text-[9px] text-slate-500">Gov Score</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Design optimization targets */}
      <div className="glass rounded border border-teal-600/15 px-4 py-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[9px] text-slate-500 uppercase tracking-wide">Design Targets:</span>
          {['Clarity', 'Proof', 'Trust', 'Control', 'Replayability', 'Executive Readability'].map(t => (
            <span key={t} className="text-[9px] font-bold text-teal-500 uppercase tracking-wide">{t}</span>
          ))}
          <div className="flex-1" />
          <span className="text-[9px] text-slate-600 font-mono">SIMULATED DATA / GOVERNANCE LOGIC</span>
        </div>
      </div>
    </div>
  );
}
