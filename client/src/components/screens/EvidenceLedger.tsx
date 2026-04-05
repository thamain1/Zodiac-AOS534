import { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import type { EvidenceArtifact } from '../../types';
import { TruthBadge } from '../shared/TruthBadge';

const ARTIFACT_TYPE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  log_bundle:      { label: 'Log Bundle',       icon: '📋', color: 'text-blue-400' },
  screenshot:      { label: 'Screenshot',       icon: '🖼', color: 'text-purple-400' },
  config_snapshot: { label: 'Config Snapshot',  icon: '⚙',  color: 'text-amber-400' },
  api_trace:       { label: 'API Trace',         icon: '🔗', color: 'text-teal-400' },
  identity_record: { label: 'Identity Record',  icon: '🪪', color: 'text-green-400' },
  network_capture: { label: 'Network Capture',  icon: '📡', color: 'text-orange-400' },
  report:          { label: 'Report',           icon: '📄', color: 'text-slate-400' },
};

const ACTION_COLORS: Record<string, string> = {
  signal_intake:    'text-blue-400',
  correlation:      'text-teal-400',
  truth_validation: 'text-amber-400',
  alert_generated:  'text-red-400',
  artifact_signed:  'text-verified',
};

const ACTION_LABELS: Record<string, string> = {
  signal_intake:    'Signal Intake',
  correlation:      'Correlation',
  truth_validation: 'Truth Validation',
  alert_generated:  'Alert Generated',
  artifact_signed:  'Artifact Signed',
};

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 85 ? 'bg-verified' : pct >= 65 ? 'bg-warning' : 'bg-critical';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-navy-700 rounded-full">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-slate-300 w-8 text-right">{pct}%</span>
    </div>
  );
}

function ChainOfCustodyTimeline({ artifact }: { artifact: EvidenceArtifact }) {
  return (
    <div className="mt-4">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
        Chain of Custody
      </div>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-2.5 top-2 bottom-2 w-px bg-navy-700" />

        {artifact.chain_of_custody.map((entry, i) => {
          const actionColor = ACTION_COLORS[entry.action] ?? 'text-slate-400';
          const isLast = i === artifact.chain_of_custody.length - 1;
          return (
            <div key={i} className="relative flex gap-4 mb-4 last:mb-0">
              {/* Node */}
              <div className={`relative z-10 w-5 h-5 flex items-center justify-center rounded-full border flex-shrink-0 ${
                isLast ? 'bg-teal-500/20 border-teal-500' : 'bg-navy-800 border-navy-600'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isLast ? 'bg-teal-400' : 'bg-slate-500'}`} />
              </div>
              {/* Content */}
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-semibold ${actionColor}`}>
                    {ACTION_LABELS[entry.action] ?? entry.action}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold">{entry.agent}</span>
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  {new Date(entry.timestamp).toISOString().replace('T', ' ').split('.')[0]}Z
                </div>
                {entry.notes && (
                  <div className="text-[10px] text-slate-400 mt-0.5">{entry.notes}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HashDisplay({ hash }: { hash: string }) {
  const [verified, setVerified] = useState(false);

  return (
    <div className="mt-3 rounded border border-navy-700 bg-navy-900/60 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Integrity Hash</span>
        <button
          onClick={() => setVerified(true)}
          className={`text-[9px] px-2 py-0.5 rounded transition-colors ${
            verified
              ? 'bg-verified/20 text-verified border border-verified/30'
              : 'bg-teal-600 text-white hover:bg-teal-500'
          }`}
        >
          {verified ? '✓ Verified' : 'Verify'}
        </button>
      </div>
      <div className="font-mono text-[9px] text-slate-400 break-all leading-relaxed">
        {hash}
      </div>
      {verified && (
        <div className="mt-2 text-[9px] text-verified flex items-center gap-1">
          <span>✓</span>
          <span>Hash match confirmed — artifact unmodified since signing</span>
        </div>
      )}
    </div>
  );
}

type FilterType = 'all' | 'log_bundle' | 'config_snapshot' | 'api_trace' | 'identity_record' | 'network_capture';

export function EvidenceLedger() {
  const [artifacts, setArtifacts] = useState<EvidenceArtifact[]>([]);
  const [selected,  setSelected]  = useState<EvidenceArtifact | null>(null);
  const [filter,    setFilter]    = useState<FilterType>('all');
  const [exporting, setExporting] = useState(false);
  const [exported,  setExported]  = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.evidence.list();
      setArtifacts(res.data);
      if (res.data.length > 0) setSelected(res.data[0]);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = artifacts.filter(a =>
    filter === 'all' ? true : a.artifact_type === filter
  );

  const handleExport = async () => {
    setExporting(true);
    try {
      await api.evidence.exportBundle(selected ? [selected.id] : undefined);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch { /* ignore */ } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── LEFT: Artifact List ────────────────────────────────────────────── */}
      <div className="w-72 border-r border-navy-700 flex flex-col">
        {/* Header */}
        <div className="p-3 border-b border-navy-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-white">Evidence Ledger</span>
            <span className="sim-badge">Simulated</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Apollo · Conduit — {artifacts.length} artifacts
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 border-b border-navy-700">
          {[
            { label: 'Artifacts',   value: artifacts.length },
            { label: 'Avg Conf.',   value: artifacts.length ? `${Math.round(artifacts.reduce((s, a) => s + a.confidence, 0) / artifacts.length * 100)}%` : '—' },
          ].map(m => (
            <div key={m.label} className="p-2 text-center border-r border-navy-700 last:border-0">
              <div className="text-sm font-bold text-teal-400">{m.value}</div>
              <div className="text-[9px] text-slate-500">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Filter row */}
        <div className="p-2 border-b border-navy-700 flex flex-wrap gap-1">
          {(['all', 'log_bundle', 'config_snapshot', 'api_trace', 'identity_record', 'network_capture'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[9px] px-2 py-0.5 rounded capitalize transition-colors ${
                filter === f
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-navy-800 text-slate-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : ARTIFACT_TYPE_LABELS[f]?.label ?? f}
            </button>
          ))}
        </div>

        {/* Artifact list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(a => {
            const isSelected = selected?.id === a.id;
            const typeInfo   = ARTIFACT_TYPE_LABELS[a.artifact_type];
            return (
              <div
                key={a.id}
                onClick={() => setSelected(a)}
                className={`p-3 border-b border-navy-800 cursor-pointer transition-colors ${
                  isSelected ? 'bg-navy-700 border-l-2 border-l-teal-500' : 'hover:bg-navy-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px]">{typeInfo?.icon ?? '📁'}</span>
                  <span className={`text-[9px] font-semibold ${typeInfo?.color ?? 'text-slate-400'}`}>
                    {typeInfo?.label ?? a.artifact_type}
                  </span>
                </div>
                <div className="text-[10px] font-semibold text-white mb-1 leading-tight">{a.title}</div>
                <div className="text-[9px] text-slate-500 mb-1.5">
                  {new Date(a.created_at).toLocaleString()}
                </div>
                <ConfidenceBar value={a.confidence} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CENTER: Artifact Detail + CoC ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4">
        {selected ? (
          <>
            {/* Artifact header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[14px] font-bold text-white mb-1">{selected.title}</div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold ${ARTIFACT_TYPE_LABELS[selected.artifact_type]?.color}`}>
                    {ARTIFACT_TYPE_LABELS[selected.artifact_type]?.icon} {ARTIFACT_TYPE_LABELS[selected.artifact_type]?.label}
                  </span>
                  <TruthBadge label={selected.truth_label} />
                </div>
              </div>
              <button
                onClick={handleExport}
                disabled={exporting || exported}
                className={`text-[10px] px-3 py-1.5 rounded transition-colors ${
                  exported
                    ? 'bg-verified/20 text-verified border border-verified/30'
                    : exporting
                    ? 'bg-navy-700 text-slate-500 cursor-not-allowed'
                    : 'bg-teal-600 text-white hover:bg-teal-500'
                }`}
              >
                {exported ? '✓ Bundle Exported' : exporting ? 'Exporting...' : 'Export Bundle'}
              </button>
            </div>

            {/* Description */}
            <div className="rounded border border-navy-700 bg-navy-800/60 p-4 mb-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Artifact Description</div>
              <div className="text-[11px] text-slate-300 leading-relaxed">{selected.description}</div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <div className="text-[9px] text-slate-500 mb-1">Created</div>
                  <div className="text-[10px] text-slate-300 font-mono">
                    {new Date(selected.created_at).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 mb-1">Object Refs</div>
                  <div className="flex flex-wrap gap-1">
                    {selected.object_refs.map(r => (
                      <span key={r} className="text-[9px] font-mono text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">{r}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 mb-1">Alert Refs</div>
                  <div className="flex flex-wrap gap-1">
                    {selected.alert_refs.length > 0
                      ? selected.alert_refs.map(r => (
                          <span key={r} className="text-[9px] font-mono text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">{r}</span>
                        ))
                      : <span className="text-[9px] text-slate-600">None</span>
                    }
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[9px] text-slate-500 mb-1">Evidence Confidence</div>
                <ConfidenceBar value={selected.confidence} />
              </div>
            </div>

            {/* Chain of Custody */}
            <div className="rounded border border-navy-700 bg-navy-800/60 p-4 mb-4">
              <ChainOfCustodyTimeline artifact={selected} />
            </div>

            {/* Integrity hash */}
            <HashDisplay hash={selected.integrity_hash} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-[11px] text-slate-500">Select an artifact to inspect</div>
          </div>
        )}
      </div>

      {/* ── RIGHT: Apollo + Conduit panel ────────────────────────────────────── */}
      <div className="w-64 border-l border-navy-700 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-navy-700">
          <div className="text-[11px] font-bold text-white mb-1">Evidence Plane</div>
          <div className="text-[9px] text-slate-500">Apollo · Conduit — active</div>
        </div>

        {/* Apollo */}
        <div className="p-3 border-b border-navy-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-400">Apollo</span>
            <span className="text-[9px] text-slate-500">Truth & Evidence</span>
          </div>
          <div className="space-y-2 text-[10px]">
            {[
              { label: 'Artifacts signed',    value: artifacts.length,                               color: 'text-white' },
              { label: 'Avg confidence',       value: artifacts.length ? `${Math.round(artifacts.reduce((s, a) => s + a.confidence, 0) / artifacts.length * 100)}%` : '—', color: 'text-teal-400' },
              { label: 'CoC steps logged',     value: artifacts.reduce((s, a) => s + a.chain_of_custody.length, 0), color: 'text-white' },
            ].map(stat => (
              <div key={stat.label} className="flex justify-between">
                <span className="text-slate-500">{stat.label}</span>
                <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conduit */}
        <div className="p-3 border-b border-navy-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[11px] font-bold text-teal-400">Conduit</span>
            <span className="text-[9px] text-slate-500">Forensic Logging</span>
          </div>
          <div className="space-y-2 text-[10px]">
            {[
              { label: 'Log streams active', value: 15, color: 'text-white' },
              { label: 'Tamper checks',       value: 'Passing', color: 'text-verified' },
              { label: 'Audit buffer',        value: '99.4%', color: 'text-teal-400' },
            ].map(stat => (
              <div key={stat.label} className="flex justify-between">
                <span className="text-slate-500">{stat.label}</span>
                <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5-stage reference */}
        <div className="p-3 border-b border-navy-700">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Evidence Plane</div>
          <div className="space-y-1.5">
            {[
              { label: 'Signal Intake', active: true },
              { label: 'Correlation',   active: true },
              { label: 'Validation',    active: true },
              { label: 'Decision',      active: true },
              { label: 'Evidence & Replay', active: true, highlight: true },
            ].map(stage => (
              <div key={stage.label} className={`text-[9px] flex items-center gap-1.5 ${stage.highlight ? 'text-teal-400 font-semibold' : stage.active ? 'text-slate-300' : 'text-slate-600'}`}>
                <div className={`w-1 h-1 rounded-full ${stage.highlight ? 'bg-teal-400' : stage.active ? 'bg-slate-400' : 'bg-slate-700'}`} />
                {stage.label}
                {stage.highlight && <span className="ml-auto text-[8px] bg-teal-500/20 px-1 rounded">current</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Relic reference */}
        <div className="flex-1 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-[10px] font-bold text-purple-400">Relic</span>
            <span className="text-[9px] text-slate-500">Historical Memory</span>
          </div>
          <div className="text-[9px] text-slate-500 leading-relaxed">
            Relic enables forensic replay of past evidence. Historical artifacts retrievable
            for investigation comparison and replay analysis.
          </div>
          <div className="mt-2 text-[9px] text-slate-600">
            → Screen 13: Scenario Playback
          </div>
        </div>

        <div className="p-3 border-t border-navy-700">
          <div className="sim-badge">Evidence Plane</div>
        </div>
      </div>
    </div>
  );
}
