import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAppStore } from '../../store';
import { TruthBadge } from '../shared/TruthBadge';
import { clsx } from 'clsx';
import type { Scenario } from '../../types';

const TAG_COLORS: Record<string, string> = {
  critical: 'text-critical bg-critical/10 border-critical/20',
  identity: 'text-teal-400 bg-teal-900/10 border-teal-600/20',
  'access-control': 'text-warning bg-warning/10 border-warning/20',
  endpoint: 'text-blue-400 bg-blue-900/10 border-blue-600/20',
  cloud: 'text-purple-400 bg-purple-900/10 border-purple-600/20',
  iam: 'text-orange-400 bg-orange-900/10 border-orange-600/20',
};

function getTagColor(tag: string) {
  return TAG_COLORS[tag] ?? 'text-slate-400 bg-navy-700 border-navy-600';
}

export function ScenarioPlayback() {
  const { setActiveScenario, appendLog } = useAppStore();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selected, setSelected] = useState<Scenario | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [beforeAfter, setBeforeAfter] = useState(false);
  const [mode, setMode] = useState<'operator' | 'executive'>('operator');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.scenarios.list().then(r => {
      setScenarios(r.data);
      if (r.data.length > 0) setSelected(r.data[0]);
    }).finally(() => setLoading(false));
  }, []);

  async function handlePlay() {
    if (!selected) return;
    await api.scenarios.play(selected.id);
    setPlaying(true);
    setCurrentStep(1);
    setActiveScenario({ ...selected, status: 'playing', current_step: 1 });

    // Auto-advance steps for demo feel
    let step = 1;
    const interval = setInterval(async () => {
      step++;
      if (step > selected.total_steps) {
        clearInterval(interval);
        setPlaying(false);
        setCurrentStep(selected.total_steps);
        setActiveScenario({ ...selected, status: 'completed', current_step: selected.total_steps });
        return;
      }
      setCurrentStep(step);
      setActiveScenario(prev => prev ? { ...prev, current_step: step } : null);

      // Emit step logs
      const stepData = selected.steps[step - 1];
      if (stepData) {
        for (const msg of stepData.log_messages) {
          appendLog({
            id: `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            timestamp: new Date().toISOString(),
            stream: 'inter_agent',
            severity: 'info',
            message: msg,
            truth_label: 'simulated',
          });
        }
      }
    }, 2500);
  }

  async function handlePause() {
    if (!selected) return;
    await api.scenarios.pause(selected.id);
    setPlaying(false);
    setActiveScenario(prev => prev ? { ...prev, status: 'paused' } : null);
  }

  async function handleReset() {
    if (!selected) return;
    setPlaying(false);
    setCurrentStep(0);
    setActiveScenario(null);
  }

  async function handleScrub(step: number) {
    if (!selected) return;
    await api.scenarios.scrub(selected.id, step);
    setCurrentStep(step);
    setActiveScenario(prev => prev ? { ...prev, current_step: step } : null);
  }

  async function handleToggleBeforeAfter() {
    if (!selected) return;
    await api.scenarios.toggleBeforeAfter(selected.id);
    setBeforeAfter(!beforeAfter);
  }

  async function handleSetMode(m: 'operator' | 'executive') {
    if (!selected) return;
    await api.scenarios.setMode(selected.id, m);
    setMode(m);
  }

  const progress = selected ? (currentStep / selected.total_steps) * 100 : 0;
  const activeStepData = selected && currentStep > 0 ? selected.steps[currentStep - 1] : null;

  return (
    <div className="flex h-full overflow-hidden">

      {/* Scenario list */}
      <div className="w-64 glass-dark border-r border-teal-600/15 flex flex-col overflow-hidden shrink-0">
        <div className="p-3 border-b border-navy-700">
          <div className="text-[10px] text-teal-400 font-bold uppercase tracking-wide">Scenario Library</div>
          <div className="text-[9px] text-slate-500 mt-0.5">8 Governance Scenarios</div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="text-[10px] text-slate-600 py-3 text-center">Loading...</div>
          ) : (
            scenarios.map((scn, i) => (
              <div
                key={scn.id}
                onClick={() => {
                  setSelected(scn);
                  setCurrentStep(0);
                  setPlaying(false);
                  setActiveScenario(null);
                }}
                className={clsx(
                  'rounded border p-2.5 mb-1.5 cursor-pointer transition-all',
                  selected?.id === scn.id
                    ? 'border-teal-500/40 bg-teal-900/10'
                    : 'border-navy-700 hover:border-teal-600/20'
                )}
              >
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded bg-navy-700 border border-navy-600 flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-teal-600">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-white leading-tight">{scn.name}</div>
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {scn.tags.slice(0, 2).map(tag => (
                        <span key={tag} className={clsx('text-[8px] font-bold uppercase px-1 py-0.5 rounded border', getTagColor(tag))}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <TruthBadge label={scn.truth_label} className="mt-1" />
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Phase 2+ placeholder */}
          {[
            'Network Appliance Drift',
            'Advanced API Inline vs Proxy',
            'AI Governance + Evidence',
            'Storage Governance',
            'Supply-Chain Scoring (Roadmap)',
          ].map((name, i) => (
            <div key={name} className="rounded border border-navy-800 p-2.5 mb-1.5 opacity-40">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded bg-navy-800 border border-navy-700 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-navy-600">{String(i + 4).padStart(2, '0')}</span>
                </div>
                <div>
                  <div className="text-[10px] text-slate-600">{name}</div>
                  <span className="text-[8px] text-slate-700 uppercase">Phase 2+</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main playback area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {selected && (
          <>
            {/* Playback header */}
            <div className="px-5 pt-4 pb-3 border-b border-navy-700 shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-[15px] font-black text-white">{selected.name}</h1>
                    <TruthBadge label={selected.truth_label} />
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-2xl">{selected.description}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  {/* Mode toggle */}
                  <div className="flex bg-navy-800 border border-navy-600 rounded overflow-hidden">
                    {(['operator', 'executive'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => handleSetMode(m)}
                        className={clsx(
                          'text-[9px] font-bold uppercase tracking-wide px-2 py-1.5 transition-all',
                          mode === m ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {/* Before/After */}
                  <button
                    onClick={handleToggleBeforeAfter}
                    className={clsx(
                      'text-[9px] font-bold uppercase tracking-wide px-3 py-1.5 rounded border transition-all',
                      beforeAfter
                        ? 'bg-teal-600/20 border-teal-500/40 text-teal-300'
                        : 'border-navy-600 text-slate-400 hover:text-white'
                    )}
                  >
                    {beforeAfter ? 'After AOS534' : 'Before AOS534'}
                  </button>
                </div>
              </div>

              {/* Timeline scrubber */}
              <div className="mt-3 flex items-center gap-3">
                {/* Play/Pause/Reset */}
                <button
                  onClick={playing ? handlePause : handlePlay}
                  disabled={currentStep >= selected.total_steps && !playing}
                  className={clsx(
                    'w-8 h-8 rounded border flex items-center justify-center text-[14px] transition-all',
                    playing
                      ? 'bg-warning/20 border-warning/40 text-warning hover:bg-warning/30'
                      : 'bg-teal-600/20 border-teal-500/40 text-teal-300 hover:bg-teal-600/30'
                  )}
                >
                  {playing ? '⏸' : '▶'}
                </button>

                <button
                  onClick={handleReset}
                  className="w-8 h-8 rounded border border-navy-600 flex items-center justify-center text-[12px] text-slate-400 hover:text-white transition-all"
                >
                  ↺
                </button>

                {/* Progress bar / step scrubber */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex gap-1">
                    {selected.steps.map((step) => (
                      <button
                        key={step.step}
                        onClick={() => handleScrub(step.step)}
                        className={clsx(
                          'flex-1 h-6 rounded text-[8px] font-bold uppercase transition-all border',
                          currentStep >= step.step
                            ? 'bg-teal-600/30 border-teal-500/40 text-teal-300'
                            : 'bg-navy-800 border-navy-700 text-slate-600 hover:border-teal-600/20'
                        )}
                      >
                        {step.step}
                      </button>
                    ))}
                  </div>
                  <div className="h-1 bg-navy-700 rounded overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 tabular-nums shrink-0">
                  {currentStep}/{selected.total_steps}
                </div>
              </div>
            </div>

            {/* Active step view */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

              {currentStep === 0 ? (
                <div className="flex items-center justify-center h-48 flex-col gap-3">
                  <div className="text-[13px] text-slate-500">Press ▶ to begin scenario playback</div>
                  <div className="text-[10px] text-slate-600">{selected.total_steps} steps · Timeline + logs + evidence output</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {selected.tags.map(tag => (
                      <span key={tag} className={clsx('text-[9px] font-bold uppercase px-2 py-0.5 rounded border', getTagColor(tag))}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Current step card */}
                  {activeStepData && (
                    <div className="glass rounded-lg border border-teal-600/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded bg-teal-600/20 border border-teal-500/40 flex items-center justify-center">
                          <span className="text-[11px] font-black text-teal-300">{activeStepData.step}</span>
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-white">{activeStepData.title}</div>
                          {playing && (
                            <div className="flex items-center gap-1.5 text-[9px] text-teal-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                              Playing...
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-[12px] text-slate-300 mb-3">{activeStepData.description}</p>

                      {/* Score delta */}
                      {activeStepData.score_delta !== 0 && (
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-slate-400">Score impact:</span>
                          <span className={clsx(
                            'font-bold',
                            activeStepData.score_delta < 0 ? 'text-critical' : 'text-verified'
                          )}>
                            {activeStepData.score_delta > 0 ? '+' : ''}{activeStepData.score_delta}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step log output */}
                  {activeStepData && activeStepData.log_messages.length > 0 && (
                    <div className="glass rounded-lg p-4">
                      <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wide mb-2">
                        Step {activeStepData.step} — Agent Log Output
                      </div>
                      <div className="font-mono space-y-1">
                        {activeStepData.log_messages.map((msg, i) => (
                          <div key={i} className="flex items-start gap-2 text-[10px]">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1" />
                            <span className="text-slate-300 leading-relaxed">{msg}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All steps completed */}
                  {currentStep >= selected.total_steps && !playing && (
                    <div className="glass rounded-lg border border-verified/30 bg-verified/5 p-4 text-center">
                      <div className="text-[13px] font-bold text-verified mb-1">Scenario Complete</div>
                      <div className="text-[11px] text-slate-400">
                        Evidence bundle available · Storyboard generated · Chain of custody sealed
                      </div>
                      <div className="flex justify-center gap-3 mt-3">
                        <button className="text-[10px] font-bold text-teal-400 border border-teal-600/30 rounded px-3 py-1.5 hover:bg-teal-900/20 transition-all">
                          View Evidence
                        </button>
                        <button className="text-[10px] font-bold text-teal-400 border border-teal-600/30 rounded px-3 py-1.5 hover:bg-teal-900/20 transition-all">
                          View Storyboard
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Before/After comparison */}
                  {beforeAfter && (
                    <div className="glass rounded-lg p-4">
                      <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wide mb-3">
                        Before / After AOS534 — Governance Impact
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded bg-critical/10 border border-critical/20 p-3">
                          <div className="text-[9px] text-slate-500 uppercase mb-1">Without AOS534</div>
                          <div className="text-3xl font-black text-critical">42</div>
                          <div className="text-[9px] text-slate-500">Governance Score</div>
                          <div className="mt-2 text-[10px] text-slate-400">
                            Alert noise only. No validated evidence. No chain of custody.
                          </div>
                        </div>
                        <div className="rounded bg-verified/10 border border-verified/20 p-3">
                          <div className="text-[9px] text-slate-500 uppercase mb-1">With AOS534</div>
                          <div className="text-3xl font-black text-verified">89</div>
                          <div className="text-[9px] text-slate-500">Governance Score</div>
                          <div className="mt-2 text-[10px] text-slate-400">
                            Validated evidence. Defensible truth. Full audit trail.
                          </div>
                        </div>
                      </div>
                      <TruthBadge label="simulated" className="mt-2" />
                    </div>
                  )}
                </>
              )}

              <div className="text-[9px] text-slate-600 text-center font-mono pb-2">
                SIMULATED DATA / GOVERNANCE LOGIC · ROADMAP CAPABILITIES labeled separately
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
