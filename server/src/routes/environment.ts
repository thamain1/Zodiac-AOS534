import { Router } from 'express';
import { state } from '../state.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ ...state.environment, active_alerts: state.getActiveAlertCount() });
});

router.get('/status', (_req, res) => {
  res.json({
    governance_score: state.environment.governance_score,
    evidence_confidence: state.environment.evidence_confidence,
    active_alerts: state.getActiveAlertCount(),
    cp_health: state.environment.cp_health,
    dp_health: state.environment.dp_health,
    secure_channel_status: state.environment.secure_channel_status,
    last_event: state.environment.last_event,
    simulator_mode: state.environment.simulator_mode,
    truth_model: 'v0.98 (simulated)',
  });
});

export default router;
