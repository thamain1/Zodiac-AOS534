import { clsx } from 'clsx';

/* ── Badge helpers ─────────────────────────────────────── */
function RoadmapBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-amber-500/15 text-amber-400 border border-amber-500/30">
      Roadmap
    </span>
  );
}
function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-teal-500/15 text-teal-400 border border-teal-500/30">
      ● Live
    </span>
  );
}
function SimBadge() {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-blue-500/15 text-blue-400 border border-blue-500/30">
      Simulated
    </span>
  );
}

/* ── Types ─────────────────────────────────────────────── */
interface FeatureItem {
  icon: string;
  name: string;
  desc: string;
  badge?: 'live' | 'simulated' | 'roadmap';
}

interface Wave {
  number: 1 | 2 | 3;
  horizon: string;
  title: string;
  subtitle: string;
  govScore: number;
  accent: string;
  features: FeatureItem[];
  agentHighlight?: string;
}

/* ── Data ──────────────────────────────────────────────── */
const WAVES: Wave[] = [
  {
    number: 1,
    horizon: 'Now',
    title: 'Foundation Platform',
    subtitle: 'Governance simulator fully operational — all 14 screens, 8 scenarios, 12 agents',
    govScore: 67,
    accent: 'teal',
    agentHighlight: 'All 12 agents active: Argus · Verdict · Bedrock · Aegis · Apollo · Conduit · Atlas · Chronicle · Sage · Helm · Canon · Relic',
    features: [
      { icon: '◎', name: 'Mission Overview', desc: 'Platform-wide health, governance score, agent status grid', badge: 'live' },
      { icon: '⬡', name: 'Environment Truth Map', desc: 'Live topology with truth scores, alignment states, blast radius', badge: 'live' },
      { icon: '◈', name: 'Identity Governance', desc: 'RBAC drift detection, terminated-user escalation, Argus validation', badge: 'live' },
      { icon: '☁', name: 'Cloud Governance', desc: 'IAM drift, over-provisioned roles, multi-cloud posture scoring', badge: 'live' },
      { icon: '⬡', name: 'Network / Substrate', desc: 'Multi-vendor drift, wireless substrate risk, Bedrock + Aegis', badge: 'live' },
      { icon: '⇄', name: 'Advanced API', desc: 'Inline vs proxy comparison, fail-open / fail-closed distinction', badge: 'live' },
      { icon: '⬡', name: 'AI Agent Governance', desc: '12-agent constellation, inter-agent feed, Verdict oversight', badge: 'live' },
      { icon: '⊞', name: 'Evidence / Ledger', desc: 'Chain-of-custody, hash verification, Apollo + Conduit artifacts', badge: 'live' },
      { icon: '☰', name: 'Reporting / Storyboards', desc: 'Executive storyboards, 5-stage workflow visualization, Chronicle', badge: 'live' },
      { icon: '⊛', name: 'Secure Channel Visibility', desc: 'mTLS, SPIFFE/SPIRE workload identity, cert expiry tracking', badge: 'live' },
      { icon: '⚑', name: 'Policies / Alerts', desc: 'Policy library, alert management, Helm advisory feed', badge: 'live' },
      { icon: '⊕', name: 'CP / DP Health', desc: '15-node health grid, plane separation, latency + uptime', badge: 'live' },
      { icon: '▶', name: 'Scenario Playback', desc: '8 governance scenarios with step-through replay and evidence capture', badge: 'live' },
      { icon: '→', name: 'Roadmap / Next Waves', desc: 'This screen — platform trajectory and investment narrative', badge: 'live' },
    ],
  },
  {
    number: 2,
    horizon: 'Near-Term',
    title: 'Live Integration Layer',
    subtitle: 'Real data ingestion from production security stacks — governance overlay becomes production-grade',
    govScore: 82,
    accent: 'blue',
    features: [
      { icon: '⊗', name: 'Splunk Integration', desc: 'Live SIEM event ingestion — AOS534 validates, correlates, and governs Splunk output in real time', badge: 'roadmap' },
      { icon: '⊗', name: 'IBM QRadar Connector', desc: 'QRadar alert normalization into truth model — cross-vendor confidence scoring', badge: 'roadmap' },
      { icon: '⊗', name: 'Wazuh Agent Bridge', desc: 'Endpoint telemetry from Wazuh feeds substrate and identity governance pipelines', badge: 'roadmap' },
      { icon: '⊗', name: 'Mobile Operator View', desc: 'Field-optimized interface for on-call operators — critical alerts, one-tap decisions', badge: 'roadmap' },
      { icon: '⊗', name: 'Agentic Auto-Remediation', desc: 'Verdict proposes remediation actions with evidence chains — human approves, platform executes', badge: 'roadmap' },
      { icon: '⊗', name: 'Multi-Site Topology', desc: 'Atlas maps real geographically distributed environments with per-site truth scoring', badge: 'roadmap' },
      { icon: '⊗', name: 'Live Evidence Export', desc: 'Apollo generates court-ready evidence bundles from live data in real time', badge: 'roadmap' },
      { icon: '⊗', name: 'Executive Live Dashboard', desc: 'Board-level read-only view — governance trajectory, risk score, open decisions', badge: 'roadmap' },
    ],
  },
  {
    number: 3,
    horizon: 'Future',
    title: 'Advanced Truth & Sovereignty',
    subtitle: 'Supply-chain visibility, post-quantum cryptography, and global threat correlation complete the platform',
    govScore: 94,
    accent: 'purple',
    features: [
      { icon: '⊗', name: 'Supply-Chain Truth Scoring', desc: 'Vendor component provenance validation — every dependency scored against known-good baselines', badge: 'roadmap' },
      { icon: '⊗', name: 'PQC Full Rollout', desc: 'Post-quantum cryptography across all channels — Kyber-1024, Dilithium-5 deployed platform-wide', badge: 'roadmap' },
      { icon: '⊗', name: 'Canon Dark-Web Intelligence', desc: 'Real-time dark-web signal ingestion — compromised credential matching, threat actor tracking', badge: 'roadmap' },
      { icon: '⊗', name: 'Multi-Tenant Agent Renaming', desc: 'Clients rename all 12 agents to align with internal naming conventions per deployment', badge: 'roadmap' },
      { icon: '⊗', name: 'Federated Truth Model', desc: 'Cross-organization trust federation — share governance evidence across enterprise boundaries with consent', badge: 'roadmap' },
      { icon: '⊗', name: 'Regulatory Mapping Engine', desc: 'Automated alignment to NIST CSF, ISO 27001, SOC2 — evidence artifacts pre-mapped to control frameworks', badge: 'roadmap' },
      { icon: '⊗', name: 'Forensic Replay — Full Fidelity', desc: 'Complete environment state reconstruction from any prior timestamp — full incident reconstruction', badge: 'roadmap' },
      { icon: '⊗', name: 'Autonomous Governance Agent', desc: 'Verdict operates in autonomous mode with human oversight layer — policy enforcement at machine speed', badge: 'roadmap' },
    ],
  },
];

/* ── Governance Trajectory Bar ─────────────────────────── */
function TrajectoryBar() {
  const scores = [67, 82, 94];
  const labels = ['Wave 1\n(Now)', 'Wave 2\n(Near-Term)', 'Wave 3\n(Future)'];
  const colors = ['bg-teal-500', 'bg-blue-500', 'bg-purple-500'];

  return (
    <div className="glass border border-teal-600/20 rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[13px] font-bold text-white">Governance Score Trajectory</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Platform-wide governance score projection across deployment waves</div>
        </div>
        <div className="text-[9px] text-slate-500 uppercase tracking-wide">Simulated Projection</div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-4 h-24 px-2">
        {scores.map((score, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="text-[13px] font-black tabular-nums" style={{ color: i === 0 ? '#2dd4bf' : i === 1 ? '#60a5fa' : '#c084fc' }}>
              {score}
            </div>
            <div className="w-full rounded-t overflow-hidden flex items-end" style={{ height: '56px' }}>
              <div
                className={clsx('w-full rounded-t transition-all', colors[i])}
                style={{ height: `${(score / 100) * 56}px`, opacity: i === 0 ? 1 : 0.6 }}
              />
            </div>
            <div className="text-[9px] text-slate-400 text-center leading-tight whitespace-pre-line">{labels[i]}</div>
          </div>
        ))}

        {/* Baseline */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div className="text-[13px] font-black tabular-nums text-slate-600">~42</div>
          <div className="w-full rounded-t overflow-hidden flex items-end" style={{ height: '56px' }}>
            <div className="w-full rounded-t bg-slate-700" style={{ height: `${(42 / 100) * 56}px` }} />
          </div>
          <div className="text-[9px] text-slate-500 text-center leading-tight">Baseline\n(No AOS534)</div>
        </div>
      </div>

      {/* Arrow indicator */}
      <div className="mt-3 flex items-center gap-2 pt-3 border-t border-navy-700">
        <div className="flex items-center gap-1 text-[10px] text-teal-400">
          <span>◎</span>
          <span className="font-semibold">Wave 1 active today</span>
        </div>
        <div className="flex-1 h-px bg-navy-700" />
        <div className="flex items-center gap-1 text-[10px] text-amber-400">
          <span>→</span>
          <span>Waves 2 & 3 expand with live deployment</span>
        </div>
      </div>
    </div>
  );
}

/* ── Wave Panel ────────────────────────────────────────── */
function WavePanel({ wave }: { wave: Wave }) {
  const accentMap = {
    teal: { border: 'border-teal-500/30', header: 'from-teal-900/30 to-transparent', num: 'text-teal-400', dot: 'bg-teal-500' },
    blue: { border: 'border-blue-500/30', header: 'from-blue-900/30 to-transparent', num: 'text-blue-400', dot: 'bg-blue-500' },
    purple: { border: 'border-purple-500/30', header: 'from-purple-900/30 to-transparent', num: 'text-purple-400', dot: 'bg-purple-500' },
  };
  const acc = accentMap[wave.accent as keyof typeof accentMap];

  return (
    <div className={clsx('glass border rounded-lg overflow-hidden', acc.border)}>
      {/* Wave header */}
      <div className={clsx('bg-gradient-to-r p-4', acc.header)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={clsx('text-[28px] font-black leading-none', acc.num)}>W{wave.number}</span>
              <div>
                <div className="text-[11px] font-bold text-white uppercase tracking-wider">{wave.horizon}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">{wave.title}</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed max-w-xl">{wave.subtitle}</p>
            {wave.agentHighlight && (
              <p className="text-[10px] text-teal-400/80 mt-2 font-mono leading-relaxed">{wave.agentHighlight}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <div className={clsx('text-[28px] font-black leading-none', acc.num)}>{wave.govScore}</div>
            <div className="text-[9px] text-slate-400 uppercase tracking-wide">Gov Score</div>
          </div>
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-2 gap-0 divide-x divide-y divide-navy-700/60">
        {wave.features.map((f, i) => (
          <div key={i} className="p-3 flex items-start gap-2 hover:bg-navy-800/30 transition-colors">
            <span className="text-[14px] mt-0.5 shrink-0"
              style={{ color: wave.accent === 'teal' ? '#2dd4bf' : wave.accent === 'blue' ? '#60a5fa' : '#c084fc' }}>
              {f.icon}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <span className="text-[11px] font-semibold text-white">{f.name}</span>
                {f.badge === 'live' && <LiveBadge />}
                {f.badge === 'simulated' && <SimBadge />}
                {f.badge === 'roadmap' && <RoadmapBadge />}
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Screen ───────────────────────────────────────── */
export function Roadmap() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Screen header */}
      <div className="glass-dark border-b border-teal-600/15 px-6 py-3 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-black text-white">Roadmap / Next Waves</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-wide font-mono">[SCREEN 14]</span>
            <span className="sim-badge">Simulated Environment</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Platform investment narrative — Wave 1 live today, Waves 2 & 3 define the full AOS534 vision
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide">Truth Label</div>
          <LiveBadge />
          <SimBadge />
          <RoadmapBadge />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Platform tagline */}
        <div className="glass border border-teal-600/20 rounded-lg p-5 flex items-start gap-4">
          <div className="w-1 self-stretch bg-teal-500 rounded-full shrink-0" />
          <div>
            <blockquote className="text-[14px] font-semibold text-white italic leading-relaxed">
              "AOS534 does NOT detect issues — you identify issues by combining Intelligence + Evidence + Context."
            </blockquote>
            <p className="text-[10px] text-slate-400 mt-2">
              AOS534 is the governance overlay that sits above and across your existing security stack —
              unifying Splunk, QRadar, Wazuh, and more into a single, court-defensible truth layer.
              What you see here is Wave 1: a fully operational simulator. What follows is the production roadmap.
            </p>
          </div>
        </div>

        {/* Trajectory bar */}
        <TrajectoryBar />

        {/* Wave panels */}
        {WAVES.map(w => <WavePanel key={w.number} wave={w} />)}

        {/* Investment summary */}
        <div className="glass border border-teal-600/20 rounded-lg p-5">
          <div className="text-[12px] font-bold text-white mb-3 uppercase tracking-wide">Platform Positioning Summary</div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'What AOS534 IS', items: ['Governance-first platform', 'Truth-validation system', 'Evidence-driven decisions', 'Chain-of-custody throughout', 'Replayable, auditable intelligence'], color: 'text-teal-400', icon: '✓' },
              { label: 'What AOS534 IS NOT', items: ['A generic SOC dashboard', 'An AI-takes-over system', 'A simple alert console', 'A vendor replacement tool', 'A cyberpunk interface'], color: 'text-critical', icon: '✕' },
              { label: 'Integrates With', items: ['Splunk (overlay, not replace)', 'IBM QRadar (governance layer)', 'Wazuh (endpoint bridge)', 'Any SIEM / XDR / SOAR', 'Future: native agent APIs'], color: 'text-blue-400', icon: '⊗' },
            ].map(col => (
              <div key={col.label} className="glass-dark rounded p-3">
                <div className={clsx('text-[10px] font-bold uppercase tracking-wide mb-2', col.color)}>{col.label}</div>
                <ul className="space-y-1">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[10px] text-slate-300">
                      <span className={clsx('shrink-0 mt-0.5', col.color)}>{col.icon}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Simulation notice */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pb-2">
          <span className="sim-badge">Simulated Data / Governance Logic</span>
          <span>·</span>
          <span>Truth Model: v0.98 (simulated)</span>
          <span>·</span>
          <span>All roadmap items are approved design direction — not current runtime capability</span>
        </div>
      </div>
    </div>
  );
}
