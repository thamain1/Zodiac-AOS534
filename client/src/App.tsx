import { useEffect } from 'react';
import { useAppStore } from './store';
import { api } from './services/api';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { LogDrawer } from './components/layout/LogDrawer';
import { MissionOverview } from './components/screens/MissionOverview';
import { EnvironmentTruthMap } from './components/screens/EnvironmentTruthMap';
import { IdentityGovernance } from './components/screens/IdentityGovernance';
import { ReportingStoryboards } from './components/screens/ReportingStoryboards';
import { ScenarioPlayback } from './components/screens/ScenarioPlayback';
import type { Screen } from './store';

function ComingSoon({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="text-[13px] font-bold text-white">{name}</div>
      <div className="text-[10px] text-slate-500">Coming in Phase 2 / 3</div>
      <div className="sim-badge">Simulated Environment</div>
    </div>
  );
}

function ScreenRouter({ screen }: { screen: Screen }) {
  switch (screen) {
    case 'mission-overview':      return <MissionOverview />;
    case 'environment-truth-map': return <EnvironmentTruthMap />;
    case 'identity-governance':   return <IdentityGovernance />;
    case 'reporting-storyboards': return <ReportingStoryboards />;
    case 'scenario-playback':     return <ScenarioPlayback />;
    case 'cloud-governance':      return <ComingSoon name="Cloud Governance" />;
    case 'network-substrate':     return <ComingSoon name="Network / Substrate Governance" />;
    case 'advanced-api':          return <ComingSoon name="Advanced API" />;
    case 'ai-agent-governance':   return <ComingSoon name="AI Agent Governance" />;
    case 'evidence-ledger':       return <ComingSoon name="Evidence / Ledger" />;
    case 'secure-channel':        return <ComingSoon name="Secure Channel Visibility" />;
    case 'policies-alerts':       return <ComingSoon name="Policies / Alerts / Config" />;
    case 'cp-dp-health':          return <ComingSoon name="Control Plane / Data Plane Health" />;
    case 'roadmap':               return <ComingSoon name="Roadmap / Next Waves" />;
    default:                      return <MissionOverview />;
  }
}

export default function App() {
  const { currentScreen, setEnvironment, setAlerts, appendLog } = useAppStore();

  // Bootstrap — load environment + alerts
  useEffect(() => {
    api.environment.status().then(env => setEnvironment(env)).catch(console.error);
    api.alerts.list().then(r => setAlerts(r.data)).catch(console.error);
  }, [setEnvironment, setAlerts]);

  // SSE log stream
  useEffect(() => {
    const es = api.logs.subscribe();
    es.addEventListener('log', (e: MessageEvent) => {
      try {
        const entry = JSON.parse(e.data);
        appendLog(entry);
      } catch { /* ignore parse errors */ }
    });
    return () => es.close();
  }, [appendLog]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-navy-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <ScreenRouter screen={currentScreen} />
        </main>
      </div>
      <LogDrawer />
      <Footer />
    </div>
  );
}
