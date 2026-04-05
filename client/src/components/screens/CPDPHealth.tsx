import { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import type { HealthNode } from '../../types';
import { TruthBadge } from '../shared/TruthBadge';

function StatusDot({ status }: { status: HealthNode['status'] }) {
  const styles = {
    healthy:  'bg-verified animate-pulse',
    degraded: 'bg-warning',
    critical: 'bg-critical animate-pulse',
    unknown:  'bg-slate-500',
  };
  return <div className={`w-2 h-2 rounded-full flex-shrink-0 ${styles[status]}`} />;
}

function HealthBar({ score, status }: { score: number; status: HealthNode['status'] }) {
  const color = status === 'healthy' ? 'bg-verified' : status === 'degraded' ? 'bg-warning' : status === 'critical' ? 'bg-critical' : 'bg-slate-600';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-navy-700 rounded-full">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] font-bold text-slate-300 w-7 text-right">{score}</span>
    </div>
  );
}

function LatencyBadge({ ms }: { ms: number }) {
  const color = ms < 20 ? 'text-verified bg-verified/10' : ms < 60 ? 'text-warning bg-warning/10' : 'text-critical bg-critical/10';
  return (
    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${color}`}>
      {ms}ms
    </span>
  );
}

function UptimeBadge({ pct }: { pct: number }) {
  const color = pct >= 99 ? 'text-verified' : pct >= 97 ? 'text-warning' : 'text-critical';
  return <span className={`text-[9px] font-mono ${color}`}>{pct.toFixed(1)}%</span>;
}

function NodeCard({
  node,
  selected,
  onSelect,
}: {
  node: HealthNode;
  selected: boolean;
  onSelect: (n: HealthNode) => void;
}) {
  return (
    <div
      onClick={() => onSelect(node)}
      className={`rounded border p-3 cursor-pointer transition-all ${
        node.status === 'critical'
          ? 'border-red-500/40 bg-red-500/5'
          : node.status === 'degraded'
          ? 'border-amber-500/30 bg-amber-500/5'
          : 'border-navy-700 bg-navy-800/40'
      } ${selected ? 'ring-1 ring-teal-500' : 'hover:border-navy-600'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <StatusDot status={node.status} />
          <span className="text-[11px] font-semibold text-white">{node.name}</span>
        </div>
        <LatencyBadge ms={node.latency_ms} />
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] text-slate-500">{node.type} · {node.site}</span>
        <UptimeBadge pct={node.uptime_pct} />
      </div>
      <HealthBar score={node.health_score} status={node.status} />
    </div>
  );
}

function PlaneColumn({
  title,
  plane,
  nodes,
  planeScore,
  selectedId,
  onSelect,
  borderColor,
  accentColor,
}: {
  title: string;
  plane: string;
  nodes: HealthNode[];
  planeScore: number;
  selectedId: string | null;
  onSelect: (n: HealthNode) => void;
  borderColor: string;
  accentColor: string;
}) {
  const healthyCount  = nodes.filter(n => n.status === 'healthy').length;
  const degradedCount = nodes.filter(n => n.status === 'degraded').length;
  const criticalCount = nodes.filter(n => n.status === 'critical').length;

  return (
    <div className={`flex flex-col border-r ${borderColor} last:border-r-0 overflow-hidden`} style={{ flex: '1 1 0' }}>
      {/* Column header */}
      <div className={`p-3 border-b ${borderColor} bg-navy-800/40`}>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[12px] font-bold ${accentColor}`}>{title}</span>
          <TruthBadge label="simulated" />
        </div>
        <div className="text-[10px] text-slate-500 mb-2">{plane.replace('_', ' ')} — {nodes.length} nodes</div>

        {/* Plane score bar */}
        <div className="mb-2">
          <div className="flex justify-between text-[9px] mb-1">
            <span className="text-slate-500">Plane Health</span>
            <span className={`font-bold ${planeScore >= 85 ? 'text-verified' : planeScore >= 65 ? 'text-warning' : 'text-critical'}`}>
              {planeScore}
            </span>
          </div>
          <div className="h-1.5 bg-navy-700 rounded-full">
            <div
              className={`h-full rounded-full ${planeScore >= 85 ? 'bg-verified' : planeScore >= 65 ? 'bg-warning' : 'bg-critical'}`}
              style={{ width: `${planeScore}%` }}
            />
          </div>
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-3 gap-1">
          {[
            { label: 'Healthy',  value: healthyCount,  color: 'text-verified' },
            { label: 'Degraded', value: degradedCount, color: 'text-warning' },
            { label: 'Critical', value: criticalCount, color: 'text-critical' },
          ].map(s => (
            <div key={s.label} className="text-center bg-navy-900/60 rounded p-1">
              <div className={`text-[11px] font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[8px] text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Node list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {nodes.map(node => (
          <NodeCard
            key={node.id}
            node={node}
            selected={selectedId === node.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function NodeDetailPanel({ node }: { node: HealthNode }) {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-3">
        <StatusDot status={node.status} />
        <span className="text-[13px] font-bold text-white">{node.name}</span>
      </div>

      <div className={`rounded border p-3 mb-3 ${
        node.status === 'critical' ? 'border-red-500/30 bg-red-500/5' :
        node.status === 'degraded' ? 'border-amber-500/30 bg-amber-500/5' :
        'border-teal-500/20 bg-teal-500/5'
      }`}>
        <div className="text-[10px] text-slate-300 leading-relaxed">{node.description}</div>
      </div>

      <div className="rounded border border-navy-700 bg-navy-800/60 p-3 mb-3">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Health Metrics</div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[9px] mb-1">
              <span className="text-slate-500">Health Score</span>
              <span className="font-bold text-white">{node.health_score}</span>
            </div>
            <HealthBar score={node.health_score} status={node.status} />
          </div>
          {[
            { label: 'Latency',  value: <LatencyBadge ms={node.latency_ms} /> },
            { label: 'Uptime',   value: <UptimeBadge pct={node.uptime_pct} /> },
            { label: 'Type',     value: <span className="text-[10px] text-slate-300">{node.type}</span> },
            { label: 'Site',     value: <span className="text-[10px] text-slate-300">{node.site}</span> },
            { label: 'Last check', value: <span className="text-[9px] text-slate-400 font-mono">{new Date(node.last_check).toLocaleTimeString()}</span> },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center">
              <span className="text-[9px] text-slate-500">{row.label}</span>
              {row.value}
            </div>
          ))}
        </div>
      </div>

      {node.dependencies.length > 0 && (
        <div className="rounded border border-navy-700 bg-navy-800/60 p-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Dependencies</div>
          <div className="flex flex-wrap gap-1">
            {node.dependencies.map(dep => (
              <span key={dep} className="text-[9px] font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
                {dep}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3">
        <TruthBadge label={node.truth_label} />
      </div>
    </div>
  );
}

export function CPDPHealth() {
  const [nodes,    setNodes]    = useState<HealthNode[]>([]);
  const [selected, setSelected] = useState<HealthNode | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await api.healthNodes.list();
      setNodes(res.data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  const cpNodes = nodes.filter(n => n.plane === 'control_plane');
  const dpNodes = nodes.filter(n => n.plane === 'data_plane');

  const cpScore = cpNodes.length
    ? Math.round(cpNodes.reduce((s, n) => s + n.health_score, 0) / cpNodes.length)
    : 0;
  const dpScore = dpNodes.length
    ? Math.round(dpNodes.reduce((s, n) => s + n.health_score, 0) / dpNodes.length)
    : 0;

  return (
    <div className="flex h-full overflow-hidden flex-col">
      {/* Top bar */}
      <div className="border-b border-navy-700 px-4 py-2 flex items-center justify-between">
        <div>
          <div className="text-[12px] font-bold text-white">Control Plane / Data Plane Health</div>
          <div className="text-[10px] text-slate-500">
            Infrastructure health — separated by governance function
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className={`text-[16px] font-bold ${cpScore >= 85 ? 'text-verified' : cpScore >= 65 ? 'text-warning' : 'text-critical'}`}>
              {cpScore}
            </div>
            <div className="text-[9px] text-slate-500">CP Health</div>
          </div>
          <div className="w-px h-8 bg-navy-700" />
          <div className="text-center">
            <div className={`text-[16px] font-bold ${dpScore >= 85 ? 'text-verified' : dpScore >= 65 ? 'text-warning' : 'text-critical'}`}>
              {dpScore}
            </div>
            <div className="text-[9px] text-slate-500">DP Health</div>
          </div>
          <div className="w-px h-8 bg-navy-700" />
          <div className="flex gap-3 text-[10px]">
            {[
              { dot: 'bg-verified', label: 'Healthy' },
              { dot: 'bg-warning',  label: 'Degraded' },
              { dot: 'bg-critical', label: 'Critical' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${l.dot}`} />
                <span className="text-slate-400">{l.label}</span>
              </div>
            ))}
          </div>
          <TruthBadge label="simulated" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* CP column */}
        <PlaneColumn
          title="Control Plane"
          plane="control_plane"
          nodes={cpNodes}
          planeScore={cpScore}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
          borderColor="border-navy-700"
          accentColor="text-teal-400"
        />

        {/* DP column */}
        <PlaneColumn
          title="Data Plane"
          plane="data_plane"
          nodes={dpNodes}
          planeScore={dpScore}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
          borderColor="border-navy-700"
          accentColor="text-blue-400"
        />

        {/* Detail panel */}
        <div className="w-72 border-l border-navy-700 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-navy-700">
            <div className="text-[11px] font-bold text-white">Node Detail</div>
            <div className="text-[9px] text-slate-500">Select a node to inspect</div>
          </div>

          {selected ? (
            <div className="flex-1 overflow-hidden">
              <NodeDetailPanel node={selected} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-[11px] text-slate-500">Select a node</div>
            </div>
          )}

          {/* Bottom — plane separation note */}
          <div className="border-t border-navy-700 p-3">
            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Plane Separation</div>
            <div className="text-[9px] text-slate-600 leading-relaxed">
              Control Plane = policy, auth, routing, enforcement.
              Data Plane = workloads, APIs, databases, storage.
              AOS534 governs both separately and in combination.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
