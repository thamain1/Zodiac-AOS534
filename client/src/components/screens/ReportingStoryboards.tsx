import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAppStore } from '../../store';
import { TruthBadge } from '../shared/TruthBadge';
import { ScoreBar } from '../shared/ScoreBar';
import { clsx } from 'clsx';
import type { Report, EvidenceArtifact } from '../../types';

const WORKFLOW_STAGES = [
  { step: '01', name: 'Signal Intake',     icon: '⬡', color: 'teal' },
  { step: '02', name: 'Correlation',        icon: '⊕', color: 'blue' },
  { step: '03', name: 'Truth Validation',   icon: '◎', color: 'amber' },
  { step: '04', name: 'Decision',           icon: '▶', color: 'verified' },
  { step: '05', name: 'Evidence & Replay',  icon: '⊞', color: 'purple' },
];

const stageColorMap: Record<string, string> = {
  teal: 'border-teal-500/40 bg-teal-900/10',
  blue: 'border-info/40 bg-info/5',
  amber: 'border-warning/40 bg-warning/5',
  verified: 'border-verified/40 bg-verified/5',
  purple: 'border-purple-500/40 bg-purple-900/10',
};

const stageTextMap: Record<string, string> = {
  teal: 'text-teal-400',
  blue: 'text-info',
  amber: 'text-warning',
  verified: 'text-verified',
  purple: 'text-purple-400',
};

export function ReportingStoryboards() {
  const { simulatorMode } = useAppStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [evidence, setEvidence] = useState<EvidenceArtifact[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState<'storyboard' | 'operator' | 'executive'>('storyboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.reports.list(), api.evidence.list()]).then(([r, e]) => {
      setReports(r.data);
      setEvidence(e.data);
      if (r.data.length > 0) setSelected(r.data[0]);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-full overflow-hidden">

      {/* Report list sidebar */}
      <div className="w-56 glass-dark border-r border-teal-600/15 flex flex-col overflow-hidden shrink-0">
        <div className="p-3 border-b border-navy-700">
          <div className="text-[10px] text-teal-400 font-bold uppercase tracking-wide">Storyboards & Reports</div>
          <div className="text-[9px] text-slate-500 mt-0.5">Chronicle · Narrative Agent</div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-navy-700">
          {(['storyboard', 'operator', 'executive'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'flex-1 text-[9px] font-bold uppercase tracking-wide py-2 transition-all',
                activeTab === tab ? 'text-teal-400 border-b-2 border-teal-500' : 'text-slate-500 hover:text-white'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="text-[10px] text-slate-600 py-3 text-center">Loading...</div>
          ) : reports.length === 0 ? (
            <div className="text-[10px] text-slate-600 py-3 text-center">No reports</div>
          ) : (
            reports.map(report => (
              <div
                key={report.id}
                onClick={() => setSelected(report)}
                className={clsx(
                  'rounded p-2.5 mb-1.5 cursor-pointer border transition-all',
                  selected?.id === report.id
                    ? 'border-teal-500/40 bg-teal-900/10'
                    : 'border-navy-700 hover:border-teal-600/20 hover:bg-navy-800'
                )}
              >
                <div className="text-[10px] font-bold text-white leading-snug">{report.title}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className={clsx(
                    'text-[8px] uppercase font-bold px-1 py-0.5 rounded',
                    report.type === 'executive' ? 'bg-teal-600/20 text-teal-400' :
                    'bg-navy-700 text-slate-400'
                  )}>
                    {report.type}
                  </span>
                  <span className="text-[8px] text-slate-600">
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
                <TruthBadge label={report.truth_label} className="mt-1" />
              </div>
            ))
          )}
        </div>

        {/* Export button */}
        <div className="p-3 border-t border-navy-700">
          <button
            onClick={() => api.reports.export()}
            className="w-full text-[10px] font-bold text-teal-400 border border-teal-600/30 rounded py-1.5 hover:bg-teal-900/20 transition-all"
          >
            Export Report Bundle
          </button>
        </div>
      </div>

      {/* Main report view */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Report header */}
        {selected && (
          <div className="px-5 pt-4 pb-3 border-b border-navy-700 shrink-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-[15px] font-black text-white">{selected.title}</h1>
                  <TruthBadge label={selected.truth_label} />
                  <span className={clsx(
                    'text-[9px] font-bold uppercase px-1.5 py-0.5 rounded',
                    selected.type === 'executive' ? 'bg-teal-600/20 text-teal-400' : 'bg-navy-700 text-slate-400'
                  )}>
                    {selected.type}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {new Date(selected.created_at).toLocaleString()} · {selected.evidence_refs.length} evidence artifacts
                </div>
              </div>

              {/* Before/After scores */}
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-[9px] text-slate-500 uppercase mb-1">Before</div>
                  <div className="text-2xl font-black text-critical tabular-nums">{selected.before_score}</div>
                </div>
                <div className="text-slate-600 text-lg">→</div>
                <div className="text-center">
                  <div className="text-[9px] text-slate-500 uppercase mb-1">After</div>
                  <div className="text-2xl font-black text-verified tabular-nums">{selected.after_score}</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] text-slate-500 uppercase mb-1">Delta</div>
                  <div className="text-2xl font-black text-teal-400 tabular-nums">
                    +{selected.after_score - selected.before_score}
                  </div>
                </div>
              </div>
            </div>

            {/* Score bars */}
            <div className="flex gap-4 mt-3">
              <div className="flex-1">
                <div className="text-[9px] text-slate-500 mb-1 uppercase">Before AOS534</div>
                <ScoreBar score={selected.before_score} size="md" />
              </div>
              <div className="flex-1">
                <div className="text-[9px] text-slate-500 mb-1 uppercase">After AOS534</div>
                <ScoreBar score={selected.after_score} size="md" />
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* 5-Stage Workflow visualization */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-bold text-teal-400 uppercase tracking-wide">
                Governance Workflow — This Incident
              </h2>
              <TruthBadge label="simulated" />
            </div>
            <div className="flex gap-2">
              {WORKFLOW_STAGES.map((stage, i) => (
                <div key={stage.step} className={clsx(
                  'flex-1 rounded border p-3',
                  stageColorMap[stage.color]
                )}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={clsx('text-[16px]', stageTextMap[stage.color])}>{stage.icon}</span>
                    <span className={clsx('text-[10px] font-bold', stageTextMap[stage.color])}>{stage.step}</span>
                  </div>
                  <div className="text-[10px] font-bold text-white">{stage.name}</div>
                  <div className={clsx('text-[9px] mt-1 font-semibold uppercase tracking-wide', stageTextMap[stage.color])}>
                    {i < 3 ? '98% Conf' : 'Complete'}
                  </div>
                  <div className="text-[8px] text-slate-500 mt-1">Honesty: Verified</div>
                </div>
              ))}
            </div>
            {/* Timeline scrubber placeholder */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[9px] text-slate-600 font-mono">04/04 22:10</span>
              <div className="flex-1 h-1 bg-navy-700 rounded overflow-hidden">
                <div className="h-full bg-teal-600 rounded" style={{ width: '100%' }} />
              </div>
              <span className="text-[9px] text-slate-600 font-mono">04/04 22:13</span>
            </div>
          </div>

          {selected && (
            <>
              {/* Summary */}
              <div className="glass rounded-lg p-4">
                <h2 className="text-[11px] font-bold text-teal-400 uppercase tracking-wide mb-2">
                  {simulatorMode === 'executive' ? 'Executive Summary' : 'Operator Summary'}
                </h2>
                <p className="text-[12px] text-slate-300 leading-relaxed">{selected.summary}</p>
              </div>

              {/* Findings */}
              <div className="glass rounded-lg p-4">
                <h2 className="text-[11px] font-bold text-teal-400 uppercase tracking-wide mb-3">
                  Key Findings — {selected.findings.length} Items
                </h2>
                <div className="space-y-2">
                  {selected.findings.map((finding, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded bg-teal-600/20 border border-teal-600/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[9px] font-bold text-teal-400">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <span className="text-[12px] text-slate-300 leading-relaxed">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence chain */}
              <div className="glass rounded-lg p-4">
                <h2 className="text-[11px] font-bold text-teal-400 uppercase tracking-wide mb-3">
                  Evidence Chain — Chain of Custody
                </h2>
                <div className="space-y-2">
                  {evidence.filter(e => selected.evidence_refs.includes(e.id)).map(evd => (
                    <div key={evd.id} className="rounded border border-navy-600 p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-[11px] font-bold text-white">{evd.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{evd.id} · {evd.artifact_type}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-[10px] font-bold text-teal-400">
                            {(evd.confidence * 100).toFixed(0)}% conf
                          </div>
                          <TruthBadge label={evd.truth_label} />
                        </div>
                      </div>

                      {/* Chain of custody mini timeline */}
                      <div className="mt-2 pl-2 border-l border-teal-600/20 space-y-1">
                        {evd.chain_of_custody.map((entry, ci) => (
                          <div key={ci} className="flex items-start gap-2 text-[9px]">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-0.5" />
                            <span className="text-slate-500 font-mono shrink-0">
                              {new Date(entry.timestamp).toLocaleTimeString()}
                            </span>
                            <span className="text-teal-400 font-bold shrink-0">[{entry.agent}]</span>
                            <span className="text-slate-400">{entry.action}</span>
                            {entry.notes && <span className="text-slate-500">— {entry.notes}</span>}
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 text-[9px] font-mono text-slate-600 truncate">
                        {evd.integrity_hash}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="text-[9px] text-slate-600 text-center font-mono pb-2">
            SIMULATED DATA / GOVERNANCE LOGIC · Truth Model: v0.98 (simulated)
          </div>
        </div>
      </div>
    </div>
  );
}
