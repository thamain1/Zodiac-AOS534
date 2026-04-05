import { useState } from 'react';
import { clsx } from 'clsx';
import { useAppStore } from '../../store';
import type { Screen } from '../../store';

interface DemoStep {
  step: number;
  screen: Screen;
  icon: string;
  title: string;
  what: string;
  say: string;
  highlight: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    screen: 'mission-overview',
    icon: '◎',
    title: 'Mission Overview',
    what: 'The command center — platform-wide health at a glance',
    say: 'This is where every investor demo starts. You see governance score, active alerts, agent status, and the 5-stage pipeline in a single view. AOS534 gives leadership a real-time truth posture — not a list of alerts.',
    highlight: 'Point to the Governance Score and say: "This number tells you how aligned your declared state is against your verified state — across every layer of your environment."',
  },
  {
    step: 2,
    screen: 'environment-truth-map',
    icon: '⬡',
    title: 'Environment Truth Map',
    what: 'The centerpiece — every node, link, and truth score mapped live',
    say: 'This is the living topology. Every node carries a truth score and alignment state. Red means declared vs verified mismatch. You can click any node and see exactly what AOS534 knows, what it verified, and what evidence backs it up.',
    highlight: 'Point to a misaligned node and say: "Atlas mapped this. Apollo signed the evidence. Now we can prove what happened — not just alert on it."',
  },
  {
    step: 3,
    screen: 'scenario-playback',
    icon: '▶',
    title: 'Scenario Playback — Terminated User',
    what: 'Governance in action — step through a live scenario with evidence capture',
    say: 'Scenario 1: a terminated employee still had escalated access 72 hours after their off-boarding. Argus detected the identity misalignment. Apollo sealed the evidence chain. Let me step through it.',
    highlight: 'Click Scenario 1 and walk through 2-3 steps. Say: "Every step is replayable. Every finding has an evidence artifact. This is court-defensible, not just alerting."',
  },
  {
    step: 4,
    screen: 'evidence-ledger',
    icon: '⊞',
    title: 'Evidence / Ledger',
    what: 'Every finding is court-defensible — chain-of-custody view',
    say: 'This is what separates AOS534 from every other platform. Not just detection — evidence. Every artifact has a hash, a timestamp, a signing agent, and a chain of custody. Click Verify on any artifact.',
    highlight: 'Click Verify Hash on an artifact. Say: "Apollo generated this. Conduit protected it. Relic can recall it two years from now. Chain of custody — from discovery to courtroom."',
  },
  {
    step: 5,
    screen: 'reporting-storyboards',
    icon: '☰',
    title: 'Reporting / Storyboards',
    what: 'The executive view — Chronicle turns findings into a narrative',
    say: 'Chronicle takes everything — signals, correlations, evidence, decisions — and turns it into a story that a board member can read in 5 minutes. This is AOS534\'s answer to the question: "What actually happened, and what do we do now?"',
    highlight: 'Point to the storyboard view and say: "One click exports this as a signed, timestamped executive report. Simulated today — production-ready in Wave 2."',
  },
];

export function GuidedDemoOverlay() {
  const { guidedDemoOpen, setGuidedDemoOpen, setScreen } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);

  if (!guidedDemoOpen) return null;

  const step = DEMO_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === DEMO_STEPS.length - 1;

  const handleGoToScreen = () => {
    setScreen(step.screen);
  };

  const handleNext = () => {
    if (isLast) {
      setGuidedDemoOpen(false);
      setCurrentStep(0);
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setScreen(DEMO_STEPS[nextStep].screen);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setScreen(DEMO_STEPS[prevStep].screen);
    }
  };

  const handleClose = () => {
    setGuidedDemoOpen(false);
    setCurrentStep(0);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel — bottom-right anchored, non-blocking */}
      <div className="fixed bottom-16 right-4 z-[100] w-[420px] glass border border-teal-500/40 rounded-xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900/40 to-transparent border-b border-teal-600/20 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-teal-400 text-[14px]">◎</span>
            <div>
              <div className="text-[12px] font-bold text-white">Guided Investor Demo</div>
              <div className="text-[9px] text-teal-400/70 uppercase tracking-wide">5-Step Platform Walkthrough</div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-navy-700 transition-colors text-[12px]"
          >
            ✕
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 px-4 pt-3">
          {DEMO_STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => { setCurrentStep(i); setScreen(DEMO_STEPS[i].screen); }}
              className={clsx(
                'flex-1 h-1.5 rounded-full transition-all',
                i === currentStep ? 'bg-teal-400' : i < currentStep ? 'bg-teal-600/50' : 'bg-navy-600'
              )}
              title={`Step ${i + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="px-4 pt-3 pb-4 space-y-3">

          {/* Step number + screen */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 text-[13px] font-black shrink-0">
              {step.step}
            </div>
            <div>
              <div className="text-[13px] font-bold text-white flex items-center gap-1.5">
                <span>{step.icon}</span>
                <span>{step.title}</span>
              </div>
              <div className="text-[10px] text-slate-400">{step.what}</div>
            </div>
          </div>

          {/* What to say */}
          <div className="glass-dark rounded-lg p-3">
            <div className="text-[9px] text-teal-400 uppercase tracking-wider font-bold mb-1.5">What to say</div>
            <p className="text-[11px] text-slate-200 leading-relaxed">{step.say}</p>
          </div>

          {/* Highlight action */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-bold mb-1.5">Key Action</div>
            <p className="text-[10px] text-amber-200/80 leading-relaxed">{step.highlight}</p>
          </div>

          {/* Go to screen button */}
          <button
            onClick={handleGoToScreen}
            className="w-full py-1.5 rounded text-[10px] font-semibold text-teal-400 border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 transition-colors"
          >
            → Navigate to {step.title}
          </button>

          {/* Nav buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handlePrev}
              disabled={isFirst}
              className={clsx(
                'flex-1 py-2 rounded text-[11px] font-semibold transition-all',
                isFirst
                  ? 'text-slate-600 border border-navy-600 cursor-not-allowed'
                  : 'text-slate-300 border border-navy-600 hover:border-teal-600/40 hover:text-white'
              )}
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              className={clsx(
                'flex-1 py-2 rounded text-[11px] font-bold transition-all',
                isLast
                  ? 'bg-teal-600 text-white hover:bg-teal-500'
                  : 'bg-teal-600/80 text-white hover:bg-teal-600'
              )}
            >
              {isLast ? 'Finish Demo ✓' : 'Next Step →'}
            </button>
          </div>

          {/* Step counter */}
          <div className="text-center text-[9px] text-slate-500">
            Step {step.step} of {DEMO_STEPS.length} · <span className="sim-badge">Simulated Environment</span>
          </div>
        </div>
      </div>
    </>
  );
}
