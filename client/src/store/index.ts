import { create } from 'zustand';
import type { Environment, Alert, LogEntry, Scenario, SimulatorMode } from '../types';

export type Screen =
  | 'mission-overview'
  | 'environment-truth-map'
  | 'identity-governance'
  | 'cloud-governance'
  | 'network-substrate'
  | 'advanced-api'
  | 'ai-agent-governance'
  | 'evidence-ledger'
  | 'reporting-storyboards'
  | 'secure-channel'
  | 'policies-alerts'
  | 'cp-dp-health'
  | 'scenario-playback'
  | 'roadmap';

interface AppStore {
  // Navigation
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;

  // Environment / header state
  environment: Environment | null;
  setEnvironment: (env: Environment) => void;

  // Mode
  simulatorMode: SimulatorMode;
  setSimulatorMode: (mode: SimulatorMode) => void;

  // Alerts
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;

  // Live logs (SSE stream)
  liveLogs: LogEntry[];
  appendLog: (entry: LogEntry) => void;
  clearLogs: () => void;

  // Active scenario
  activeScenario: Scenario | null;
  setActiveScenario: (scenario: Scenario | null) => void;

  // Selected object (for detail panel)
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;

  // Log drawer
  logDrawerOpen: boolean;
  setLogDrawerOpen: (open: boolean) => void;

  // Guided demo overlay
  guidedDemoOpen: boolean;
  setGuidedDemoOpen: (open: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentScreen: 'mission-overview',
  setScreen: (screen) => set({ currentScreen: screen }),

  environment: null,
  setEnvironment: (env) => set({ environment: env }),

  simulatorMode: 'operator',
  setSimulatorMode: (mode) => set({ simulatorMode: mode }),

  alerts: [],
  setAlerts: (alerts) => set({ alerts }),

  liveLogs: [],
  appendLog: (entry) =>
    set((state) => ({
      liveLogs: [entry, ...state.liveLogs].slice(0, 200),
    })),
  clearLogs: () => set({ liveLogs: [] }),

  activeScenario: null,
  setActiveScenario: (scenario) => set({ activeScenario: scenario }),

  selectedObjectId: null,
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),

  logDrawerOpen: false,
  setLogDrawerOpen: (open) => set({ logDrawerOpen: open }),

  guidedDemoOpen: false,
  setGuidedDemoOpen: (open) => set({ guidedDemoOpen: open }),
}));
