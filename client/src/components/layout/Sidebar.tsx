import { clsx } from 'clsx';
import { useAppStore, type Screen } from '../../store';

interface NavItem {
  screen: Screen;
  icon: string;
  label: string;
  phase?: number;
  coming?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { screen: 'mission-overview',       icon: '◎', label: 'Mission Overview',         phase: 1 },
  { screen: 'environment-truth-map',  icon: '⬡', label: 'Environment Truth Map',    phase: 1 },
  { screen: 'identity-governance',    icon: '◈', label: 'Identity Governance',       phase: 1 },
  { screen: 'cloud-governance',       icon: '☁', label: 'Cloud Governance',          phase: 3 },
  { screen: 'network-substrate',      icon: '⬡', label: 'Network / Substrate',       phase: 2 },
  { screen: 'advanced-api',           icon: '⇄', label: 'Advanced API',              phase: 2 },
  { screen: 'ai-agent-governance',    icon: '⬡', label: 'AI Agent Governance',       phase: 3 },
  { screen: 'evidence-ledger',        icon: '⊞', label: 'Evidence / Ledger',         phase: 2 },
  { screen: 'reporting-storyboards',  icon: '☰', label: 'Reporting / Storyboards',   phase: 1 },
  { screen: 'secure-channel',         icon: '⊛', label: 'Secure Channel',            phase: 3 },
  { screen: 'policies-alerts',        icon: '⚑', label: 'Policies / Alerts',         phase: 3 },
  { screen: 'cp-dp-health',          icon: '⊕', label: 'CP / DP Health',            phase: 2 },
  { screen: 'scenario-playback',      icon: '▶', label: 'Scenario Playback',         phase: 1 },
  { screen: 'roadmap',                icon: '→', label: 'Roadmap / Next Waves',      phase: 4 },
];

export function Sidebar() {
  const { currentScreen, setScreen } = useAppStore();

  return (
    <aside className="glass-dark border-r border-teal-600/15 w-14 flex flex-col items-center py-3 gap-1 shrink-0 overflow-y-auto">
      {NAV_ITEMS.map((item, i) => {
        const active = currentScreen === item.screen;
        const available = !item.coming;

        return (
          <div key={item.screen} className="relative group w-full flex justify-center">
            {i === 3 && <div className="w-8 h-px bg-navy-600 mb-1 mx-auto" />}
            <button
              onClick={() => available && setScreen(item.screen)}
              disabled={!available}
              title={item.label}
              className={clsx(
                'w-10 h-10 rounded flex items-center justify-center text-[16px] transition-all relative',
                active
                  ? 'bg-teal-600/20 text-teal-400 border border-teal-500/40'
                  : available
                    ? 'text-slate-400 hover:text-teal-300 hover:bg-navy-700'
                    : 'text-navy-600 cursor-not-allowed'
              )}
            >
              {item.icon}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-teal-400 rounded-r" />
              )}
            </button>

            {/* Tooltip */}
            <div className="absolute left-14 top-1/2 -translate-y-1/2 z-50 hidden group-hover:flex items-center gap-2 pointer-events-none">
              <div className="glass border border-teal-600/20 rounded px-2 py-1 whitespace-nowrap shadow-lg">
                <span className="text-[11px] text-white font-medium">{item.label}</span>
                {item.coming && (
                  <span className="ml-1.5 text-[9px] text-slate-500">Phase {item.phase}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom: screen number indicator */}
      <div className="mt-auto pt-2 border-t border-navy-700 w-8">
        <div className="text-[9px] text-slate-600 text-center font-mono">
          {NAV_ITEMS.findIndex(n => n.screen === currentScreen) + 1}/14
        </div>
      </div>
    </aside>
  );
}
