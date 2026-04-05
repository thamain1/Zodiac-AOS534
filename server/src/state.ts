import { environment as envData } from './fixtures/environment';
import { alerts as alertData } from './fixtures/alerts';
import { scenarios as scenarioData } from './fixtures/scenarios';
import { Environment, Alert, Scenario, SimulatorMode } from './types';

class AppState {
  environment: Environment = { ...envData };
  alerts: Alert[] = alertData.map(a => ({ ...a }));
  scenarios: Scenario[] = scenarioData.map(s => ({ ...s }));
  sseClients: Set<NodeJS.WritableStream> = new Set();

  getActiveAlertCount() {
    return this.alerts.filter(a => a.status === 'active').length;
  }

  broadcastSSE(event: string, data: unknown) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.sseClients) {
      try {
        client.write(payload);
      } catch {
        this.sseClients.delete(client);
      }
    }
  }

  setScenarioStatus(id: string, status: Scenario['status'], step?: number) {
    const scn = this.scenarios.find(s => s.id === id);
    if (!scn) return;
    scn.status = status;
    if (step !== undefined) scn.current_step = step;
    this.broadcastSSE('scenario_update', { scenario_id: id, status, step: scn.current_step });
  }

  setMode(mode: SimulatorMode) {
    this.environment.simulator_mode = mode;
    this.broadcastSSE('mode_change', { mode });
  }

  toggleBeforeAfter(scenarioId: string) {
    const scn = this.scenarios.find(s => s.id === scenarioId);
    if (!scn) return;
    scn.before_after = !scn.before_after;
    this.broadcastSSE('before_after_toggle', { scenario_id: scenarioId, before_after: scn.before_after });
  }
}

export const state = new AppState();
