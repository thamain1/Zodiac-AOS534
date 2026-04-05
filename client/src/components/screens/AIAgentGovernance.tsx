import { useEffect, useState, useCallback, useRef } from 'react';
import { api } from '../../services/api';
import type { AgentStatus, InterAgentMessage } from '../../types';
import { TruthBadge } from '../shared/TruthBadge';

const PLANE_COLORS: Record<string, string> = {
  identity_plane:   'text-blue-400   border-blue-400/30',
  governance_plane: 'text-amber-400  border-amber-400/30',
  control_plane:    'text-teal-400   border-teal-400/30',
  data_plane:       'text-purple-400 border-purple-400/30',
  evidence_plane:   'text-green-400  border-green-400/30',
  reporting_plane:  'text-orange-400 border-orange-400/30',
  advisory_plane:   'text-slate-400  border-slate-400/30',
};

const AGENT_ACCENT: Record<string, string> = {
  Argus:    'text-blue-400',
  Verdict:  'text-amber-400',
  Bedrock:  'text-orange-400',
  Aegis:    'text-teal-400',
  Apollo:   'text-yellow-400',
  Conduit:  'text-green-400',
  Atlas:    'text-purple-400',
  Chronicle:'text-red-400',
  Sage:     'text-cyan-400',
  Helm:     'text-amber-300',
  Canon:    'text-indigo-400',
  Relic:    'text-slate-400',
};

function HealthRing({ score, size = 48 }: { score: number; size?: number }) {
  const r       = (size - 6) / 2;
  const circ    = 2 * Math.PI * r;
  const offset  = circ - (score / 100) * circ;
  const color   = score >= 85 ? '#22c55e' : score >= 65 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth="4" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

function AgentCard({ agent, selected, onClick }: { agent: AgentStatus; selected: boolean; onClick: () => void }) {
  const accent    = AGENT_ACCENT[agent.display_name] ?? 'text-slate-400';
  const planeColor = PLANE_COLORS[agent.plane]?.split(' ')[0] ?? 'text-slate-400';
  const statusDot  = agent.status === 'active' ? 'bg-verified animate-pulse' : agent.status === 'degraded' ? 'bg-warning' : 'bg-slate-500';

  return (
    <div
      onClick={onClick}
      className={`rounded border p-3 cursor-pointer transition-all ${
        selected
          ? 'border-teal-500/60 bg-teal-500/10 ring-1 ring-teal-500/40'
          : `border-navy-700 bg-navy-800/40 hover:border-navy-600 ${PLANE_COLORS[agent.plane]?.split(' ')[1] ?? ''}`
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-shrink-0">
          <HealthRing score={agent.health_score} size={40} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[9px] font-bold text-white">{agent.health_score}</span>
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot}`} />
            <span className={`text-[11px] font-bold ${accent}`}>{agent.display_name}</span>
          </div>
          <div className={`text-[9px] ${planeColor}`}>{agent.plane.replace('_plane', '').replace('_', ' ')}</div>
        </div>
      </div>
      <div className="flex justify-between text-[9px] text-slate-500">
        <span>{agent.decisions_per_min} dec/min</span>
        <span>conf: {Math.round(agent.confidence * 100)}%</span>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: InterAgentMessage }) {
  const fromAccent = AGENT_ACCENT[msg.from] ?? 'text-slate-300';
  const toColor    = msg.to === 'All' ? 'text-amber-300' : (AGENT_ACCENT[msg.to] ?? 'text-slate-400');

  return (
    <div className="p-2 border-b border-navy-800 hover:bg-navy-800/40 transition-colors">
      <div className="flex items-center gap-2 mb-0.5">
        <span className={`text-[9px] font-bold ${fromAccent}`}>{msg.from}</span>
        <span className="text-[9px] text-slate-600">→</span>
        <span className={`text-[9px] font-bold ${toColor}`}>{msg.to}</span>
        <span className="ml-auto text-[8px] text-slate-600 font-mono">
          {new Date(msg.ts).toLocaleTimeString()}
        </span>
      </div>
      <div className="text-[10px] text-slate-300 leading-relaxed">{msg.message}</div>
    </div>
  );
}

export function AIAgentGovernance() {
  const [agents,   setAgents]   = useState<AgentStatus[]>([]);
  const [messages, setMessages] = useState<InterAgentMessage[]>([]);
  const [selected, setSelected] = useState<AgentStatus | null>(null);
  const [liveMode, setLiveMode] = useState(true);
  const feedRef  = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const [agts, msgs] = await Promise.all([
        api.agentsGovernance.list(),
        api.agentsGovernance.messageFeed(),
      ]);
      setAgents(agts.data);
      setMessages(msgs.data);
      setSelected(agts.data.find(a => a.display_name === 'Verdict') ?? agts.data[0]);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Simulate new inter-agent messages arriving when liveMode is on
  useEffect(() => {
    if (!liveMode) return;
    const LIVE_MSGS: Omit<InterAgentMessage, 'id'>[] = [
      { from: 'Conduit',   to: 'Apollo',   message: 'New log bundle sealed for Scenario 1. Awaiting signing.',       ts: new Date().toISOString() },
      { from: 'Argus',     to: 'Verdict',  message: 'Identity truth score re-evaluated: usr-003 confidence updated.', ts: new Date().toISOString() },
      { from: 'Aegis',     to: 'Atlas',    message: 'Network topology change detected at Branch-East. Blast radius update requested.', ts: new Date().toISOString() },
      { from: 'Verdict',   to: 'Chronicle',message: 'Governance decision logged. Storyboard generation authorized.',  ts: new Date().toISOString() },
    ];
    let i = 0;
    const interval = setInterval(() => {
      const msg = LIVE_MSGS[i % LIVE_MSGS.length];
      setMessages(prev => [{ ...msg, id: `live-${Date.now()}`, ts: new Date().toISOString() }, ...prev.slice(0, 29)]);
      i++;
    }, 4000);
    return () => clearInterval(interval);
  }, [liveMode]);

  // Auto-scroll feed
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0;
  }, [messages]);

  const activeCount  = agents.filter(a => a.status === 'active').length;
  const totalDecisions = agents.reduce((s, a) => s + a.decisions_per_min, 0);
  const avgConfidence  = agents.length
    ? Math.round(agents.reduce((s, a) => s + a.confidence, 0) / agents.length * 100)
    : 0;

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── LEFT: Agent Constellation ────────────────────────────────────── */}
      <div className="flex flex-col border-r border-navy-700" style={{ width: '340px' }}>
        {/* Header */}
        <div className="p-3 border-b border-navy-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-white">AI Agent Governance</span>
            <span className="sim-badge">Simulated</span>
          </div>
          <div className="text-[10px] text-slate-500">12 agents — Verdict oversight</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 border-b border-navy-700">
          {[
            { label: 'Active',      value: activeCount,      color: 'text-verified' },
            { label: 'Dec/min',     value: totalDecisions,   color: 'text-white' },
            { label: 'Avg conf',    value: `${avgConfidence}%`, color: 'text-teal-400' },
          ].map(m => (
            <div key={m.label} className="p-2 text-center border-r border-navy-700 last:border-0">
              <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
              <div className="text-[9px] text-slate-500">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Agent grid */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="grid grid-cols-2 gap-2">
            {agents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                selected={selected?.id === agent.id}
                onClick={() => setSelected(agent)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── CENTER: Inter-Agent Feed ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-navy-700 px-4 py-2 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-white">Inter-Agent Governance Feed</div>
            <div className="text-[10px] text-slate-500">Real-time agent communication — Conduit stream</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLiveMode(v => !v)}
              className={`text-[10px] px-3 py-1.5 rounded border transition-colors ${
                liveMode
                  ? 'border-teal-500/40 bg-teal-500/10 text-teal-400'
                  : 'border-navy-600 text-slate-400 hover:text-white'
              }`}
            >
              {liveMode ? '● Live' : '○ Paused'}
            </button>
            <TruthBadge label="simulated" />
          </div>
        </div>

        <div ref={feedRef} className="flex-1 overflow-y-auto">
          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </div>

        {/* Verdict decision highlight */}
        <div className="border-t border-amber-500/30 bg-amber-500/5 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-bold text-amber-400">Verdict — Governance Ruling</span>
            <span className="ml-auto text-[9px] text-slate-600 font-mono">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-300 leading-relaxed">
            Cross-agent evidence compiled. 3 critical governance events active. usr-002 (terminated access): BLOCK issued.
            net-003 (MFA bypass): BLOCK issued. cld-str-002 (public bucket): BLOCK issued. Awaiting operator acknowledgment.
          </div>
        </div>
      </div>

      {/* ── RIGHT: Agent Detail ────────────────────────────────────────────── */}
      <div className="w-72 border-l border-navy-700 flex flex-col overflow-hidden">
        {selected ? (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <HealthRing score={selected.health_score} size={52} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">{selected.health_score}</span>
                    </div>
                  </div>
                  <div>
                    <div className={`text-[13px] font-bold ${AGENT_ACCENT[selected.display_name] ?? 'text-white'}`}>
                      {selected.display_name}
                    </div>
                    <div className="text-[9px] text-slate-500">{selected.internal_ref}</div>
                  </div>
                </div>
                <TruthBadge label={selected.truth_label} />
              </div>

              <div className="rounded border border-navy-700 bg-navy-800/60 p-3 mb-3">
                <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Role</div>
                <div className="text-[10px] text-slate-300 leading-relaxed">{selected.role}</div>
              </div>

              <div className="rounded border border-navy-700 bg-navy-800/60 p-3 mb-3">
                <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Metrics</div>
                <div className="space-y-2">
                  {[
                    { label: 'Status',          value: <span className={`font-semibold ${selected.status === 'active' ? 'text-verified' : 'text-slate-400'}`}>{selected.status}</span> },
                    { label: 'Health score',     value: selected.health_score },
                    { label: 'Truth score',      value: selected.truth_score },
                    { label: 'Confidence',       value: `${Math.round(selected.confidence * 100)}%` },
                    { label: 'Decisions / min',  value: selected.decisions_per_min },
                    { label: 'Plane',            value: <span className={PLANE_COLORS[selected.plane]?.split(' ')[0] ?? 'text-slate-400'}>{selected.plane.replace('_', ' ')}</span> },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="text-[9px] text-slate-500">{row.label}</span>
                      <span className="text-[10px] text-slate-300">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded border border-navy-700 bg-navy-900/60 p-3">
                <div className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Current Task</div>
                <div className="text-[10px] text-slate-300 leading-relaxed">{selected.current_task}</div>
                <div className="text-[9px] text-slate-600 mt-1 font-mono">
                  Last active: {new Date(selected.last_active).toLocaleString()}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-[11px] text-slate-500">Select an agent</div>
          </div>
        )}

        {/* Platform mindset */}
        <div className="border-t border-navy-700 p-3">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Platform Principle</div>
          <div className="text-[9px] text-slate-600 leading-relaxed italic">
            "AOS534 does NOT detect issues — you identify issues by combining Intelligence + Evidence + Context."
          </div>
        </div>
      </div>
    </div>
  );
}
