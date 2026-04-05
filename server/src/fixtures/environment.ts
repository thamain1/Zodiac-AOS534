import { Environment } from '../types.js';

export const environment: Environment = {
  id: 'env-001',
  name: 'Acme Corp — Multi-Site',
  description: 'Simulated enterprise environment — HQ + Branch-East + Remote + Cloud',
  governance_score: 67,
  evidence_confidence: 0.87,
  active_alerts: 5,
  cp_health: 94,
  dp_health: 88,
  secure_channel_status: 'degraded',
  last_event: '2026-04-04T22:15:00Z',
  simulator_mode: 'operator',
};
