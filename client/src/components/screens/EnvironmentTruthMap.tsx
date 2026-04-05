import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { useAppStore } from '../../store';
import { ScoreBar } from '../shared/ScoreBar';
import { TruthBadge } from '../shared/TruthBadge';
import { AlignmentBadge, RiskBadge } from '../shared/Badges';
import { clsx } from 'clsx';
import type { TopologyNode, TopologyEdge, GovernedObject } from '../../types';

const NODE_COLORS: Record<string, string> = {
  user: '#00c8d0',
  service_account: '#f59e0b',
  workstation: '#3b82f6',
  network_appliance: '#8b5cf6',
  cloud_tenant: '#22c55e',
  api_gateway: '#f97316',
  ai_agent: '#ec4899',
  server: '#64748b',
};

const ALIGNMENT_RING: Record<string, string> = {
  aligned: '#22c55e',
  misaligned: '#ef4444',
  unknown: '#6b7a94',
  insufficient_evidence: '#f59e0b',
};

function truthScoreGlow(score: number) {
  if (score >= 85) return 'rgba(34,197,94,0.4)';
  if (score >= 60) return 'rgba(245,158,11,0.4)';
  return 'rgba(239,68,68,0.5)';
}

interface CanvasNode extends TopologyNode {
  cx: number;
  cy: number;
}

export function EnvironmentTruthMap() {
  const { setSelectedObjectId } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes] = useState<TopologyNode[]>([]);
  const [edges, setEdges] = useState<TopologyEdge[]>([]);
  const [selected, setSelected] = useState<GovernedObject | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.topology.get()]).then(([topo]) => {
      setNodes(topo.nodes);
      setEdges(topo.edges);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current || nodes.length === 0) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const scaleX = (width - 80) / 1200;
    const scaleY = (height - 80) / 560;
    const cNodes = nodes.map(n => ({
      ...n,
      cx: 40 + n.x * scaleX,
      cy: 40 + n.y * scaleY,
    }));
    setCanvasNodes(cNodes);
  }, [nodes, containerRef.current]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasNodes.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Draw edges
    for (const edge of edges) {
      const src = canvasNodes.find(n => n.id === edge.source);
      const tgt = canvasNodes.find(n => n.id === edge.target);
      if (!src || !tgt) continue;

      ctx.beginPath();
      ctx.moveTo(src.cx, src.cy);
      ctx.lineTo(tgt.cx, tgt.cy);

      const color = edge.trust_level === 'trusted' ? 'rgba(34,197,94,0.35)' :
                    edge.trust_level === 'partial' ? 'rgba(245,158,11,0.3)' :
                    'rgba(239,68,68,0.4)';
      ctx.strokeStyle = color;
      ctx.lineWidth = edge.trust_level === 'untrusted' ? 1.5 : 1;
      if (edge.trust_level === 'untrusted') {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Edge label midpoint
      if (edge.label) {
        const mx = (src.cx + tgt.cx) / 2;
        const my = (src.cy + tgt.cy) / 2;
        ctx.font = '9px monospace';
        ctx.fillStyle = 'rgba(160,172,192,0.7)';
        ctx.textAlign = 'center';
        ctx.fillText(edge.label, mx, my - 4);
      }
    }

    // Draw nodes
    for (const node of canvasNodes) {
      const isFiltered = filter !== 'all' && node.plane !== filter && node.alignment_state !== filter;
      if (isFiltered) continue;

      const isHovered = hoveredNode === node.id;
      const nodeColor = NODE_COLORS[node.type] ?? '#64748b';
      const ringColor = ALIGNMENT_RING[node.alignment_state];
      const radius = isHovered ? 14 : 11;

      // Glow for misaligned / critical
      if (node.alignment_state === 'misaligned' || node.risk_level === 'critical') {
        ctx.beginPath();
        ctx.arc(node.cx, node.cy, radius + 6, 0, Math.PI * 2);
        const grd = ctx.createRadialGradient(node.cx, node.cy, radius, node.cx, node.cy, radius + 8);
        grd.addColorStop(0, truthScoreGlow(node.truth_score));
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // Ring (alignment state)
      ctx.beginPath();
      ctx.arc(node.cx, node.cy, radius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Node body
      ctx.beginPath();
      ctx.arc(node.cx, node.cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor + '33';
      ctx.fill();
      ctx.strokeStyle = nodeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Truth score mini bar
      const barW = 24;
      const barH = 3;
      const barX = node.cx - barW / 2;
      const barY = node.cy + radius + 5;
      ctx.fillStyle = 'rgba(13,20,38,0.8)';
      ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
      ctx.fillStyle = node.truth_score >= 85 ? '#22c55e' : node.truth_score >= 60 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(barX, barY, barW * (node.truth_score / 100), barH);

      // Label
      ctx.font = isHovered ? 'bold 10px Inter, sans-serif' : '9px Inter, sans-serif';
      ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(208,216,232,0.9)';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.cx, node.cy + radius + 18);
    }
  }, [canvasNodes, edges, hoveredNode, filter]);

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const node of canvasNodes) {
      const dist = Math.sqrt((x - node.cx) ** 2 + (y - node.cy) ** 2);
      if (dist <= 16) {
        setSelectedObjectId(node.object_id);
        api.objects.get(node.object_id).then(obj => setSelected(obj));
        return;
      }
    }
    setSelected(null);
  }

  function handleCanvasMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const node of canvasNodes) {
      const dist = Math.sqrt((x - node.cx) ** 2 + (y - node.cy) ** 2);
      if (dist <= 16) {
        setHoveredNode(node.id);
        if (canvasRef.current) canvasRef.current.style.cursor = 'pointer';
        return;
      }
    }
    setHoveredNode(null);
    if (canvasRef.current) canvasRef.current.style.cursor = 'default';
  }

  const misalignedCount = nodes.filter(n => n.alignment_state === 'misaligned').length;
  const criticalCount = nodes.filter(n => n.risk_level === 'critical').length;

  return (
    <div className="flex h-full overflow-hidden">

      {/* Left: Layer controls */}
      <div className="w-44 glass-dark border-r border-teal-600/15 flex flex-col p-3 gap-3 shrink-0">
        <div>
          <div className="text-[9px] text-slate-500 uppercase tracking-wide mb-2">Topology Layers</div>
          {[
            { key: 'all', label: 'All Layers' },
            { key: 'identity_plane', label: 'Identity' },
            { key: 'control_plane', label: 'Control' },
            { key: 'data_plane', label: 'Data' },
            { key: 'governance_plane', label: 'Governance' },
          ].map(layer => (
            <button
              key={layer.key}
              onClick={() => setFilter(layer.key)}
              className={clsx(
                'w-full text-left text-[10px] px-2 py-1.5 rounded mb-0.5 transition-all',
                filter === layer.key
                  ? 'bg-teal-600/20 text-teal-300 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-navy-700'
              )}
            >
              {layer.label}
            </button>
          ))}
        </div>

        <div className="border-t border-navy-700 pt-2">
          <div className="text-[9px] text-slate-500 uppercase tracking-wide mb-2">Legend</div>
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5 mb-1">
              <div className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: color, background: color + '33' }} />
              <span className="text-[9px] text-slate-400">{type.replace('_', ' ')}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-navy-700 pt-2">
          <div className="text-[9px] text-slate-500 uppercase tracking-wide mb-2">Alignment</div>
          {Object.entries(ALIGNMENT_RING).map(([state, color]) => (
            <div key={state} className="flex items-center gap-1.5 mb-1">
              <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: color }} />
              <span className="text-[9px] text-slate-400 capitalize">{state.replace('_', ' ')}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="border-t border-navy-700 pt-2 mt-auto">
          <div className="text-[9px] text-slate-500 mb-1">Live Feeds: {nodes.length} nodes</div>
          {misalignedCount > 0 && (
            <div className="text-[10px] font-bold text-critical">{misalignedCount} Misaligned</div>
          )}
          {criticalCount > 0 && (
            <div className="text-[10px] font-bold text-critical">{criticalCount} Critical</div>
          )}
          <div className="mt-1">
            <TruthBadge label="simulated" />
          </div>
        </div>
      </div>

      {/* Center: Canvas */}
      <div ref={containerRef} className="flex-1 flex flex-col overflow-hidden relative">
        <div className="px-4 pt-3 pb-2 border-b border-navy-700 flex items-center gap-3 shrink-0">
          <h1 className="text-[13px] font-black text-white">Environment Truth Map</h1>
          <TruthBadge label="simulated" />
          <span className="text-[10px] text-slate-400">Atlas · Topology & Dependency Mapping</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="sim-badge">Simulated Environment</span>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-[11px] text-slate-500">Loading topology...</div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={containerRef.current?.clientWidth ?? 800}
            height={containerRef.current ? containerRef.current.clientHeight - 52 : 500}
            className="flex-1 w-full"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMove}
          />
        )}

        {/* Bottom label */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
          <span className="text-[9px] text-slate-600 font-mono">
            SIMULATED DATA / GOVERNANCE LOGIC · Click nodes to inspect
          </span>
        </div>
      </div>

      {/* Right detail panel */}
      <div className="w-64 glass border-l border-teal-600/15 flex flex-col overflow-y-auto shrink-0">
        <div className="p-3 border-b border-navy-700">
          <div className="text-[10px] text-teal-400 font-bold uppercase tracking-wide mb-1">
            {selected ? 'Object Detail' : 'Mission Control'}
          </div>
          {!selected && (
            <p className="text-[10px] text-slate-500">Click a node on the map to inspect its governance state.</p>
          )}
        </div>

        {selected ? (
          <div className="p-3 space-y-3">
            <div>
              <div className="text-[13px] font-bold text-white">{selected.name}</div>
              <div className="text-[9px] text-slate-400 font-mono">{selected.id}</div>
              <div className="mt-1 flex gap-1 flex-wrap">
                <TruthBadge label={selected.truth_label} />
                <AlignmentBadge state={selected.alignment_state} />
              </div>
            </div>

            <ScoreBar score={selected.truth_score} size="md" />

            <div className="space-y-1.5">
              <div className="rounded bg-navy-800 p-2">
                <div className="text-[9px] text-slate-500 uppercase">Declared</div>
                <div className="text-[10px] font-mono text-white mt-0.5">{selected.declared_state}</div>
              </div>
              <div className={clsx('rounded p-2', selected.alignment_state === 'misaligned' ? 'bg-critical/10 border border-critical/20' : 'bg-navy-800')}>
                <div className="text-[9px] text-slate-500 uppercase">Verified</div>
                <div className={clsx('text-[10px] font-mono mt-0.5', selected.alignment_state === 'misaligned' ? 'text-critical' : 'text-verified')}>
                  {selected.verified_state}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              <RiskBadge level={selected.risk_level} />
            </div>

            <div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wide">Source of Signal</div>
              <div className="text-[10px] text-slate-300 mt-0.5">{selected.source_of_signal}</div>
            </div>

            {selected.description && (
              <div className="rounded bg-navy-800 p-2">
                <div className="text-[10px] text-slate-300 leading-relaxed">{selected.description}</div>
              </div>
            )}

            {/* Atlas blast radius note */}
            <div className="rounded border border-teal-600/25 bg-teal-900/10 p-2">
              <div className="text-[9px] font-bold text-teal-400 uppercase tracking-wide mb-1">Atlas — Dependencies</div>
              <div className="text-[10px] text-slate-300">
                {edges.filter(e =>
                  canvasNodes.find(n => n.id === e.source)?.object_id === selected.id ||
                  canvasNodes.find(n => n.id === e.target)?.object_id === selected.id
                ).length} topology edges. Click node to see blast radius.
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {/* Summary stats */}
            <div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wide mb-2">Environment Summary</div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Total Nodes</span>
                  <span className="text-white font-bold">{nodes.length}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Aligned</span>
                  <span className="text-verified font-bold">{nodes.filter(n => n.alignment_state === 'aligned').length}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Misaligned</span>
                  <span className="text-critical font-bold">{nodes.filter(n => n.alignment_state === 'misaligned').length}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Total Edges</span>
                  <span className="text-white font-bold">{edges.length}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-navy-700 pt-2">
              <div className="text-[9px] text-slate-500 uppercase tracking-wide mb-1">Impact Analysis</div>
              {nodes.filter(n => n.risk_level === 'critical' || n.alignment_state === 'misaligned').slice(0, 4).map(n => (
                <div key={n.id} className="flex items-center gap-1.5 mb-1.5">
                  <div className={clsx('w-1.5 h-1.5 rounded-full shrink-0',
                    n.risk_level === 'critical' ? 'bg-critical animate-pulse' : 'bg-warning'
                  )} />
                  <span className="text-[10px] text-slate-300">{n.label}</span>
                  <span className="text-[9px] text-slate-600 ml-auto">{n.truth_score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
