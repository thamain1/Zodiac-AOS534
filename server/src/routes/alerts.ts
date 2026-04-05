import { Router } from 'express';
import { state } from '../state';

const router = Router();

router.get('/', (req, res) => {
  const { status, severity, object_id } = req.query as Record<string, string>;
  let filtered = [...state.alerts];
  if (status) filtered = filtered.filter(a => a.status === status);
  if (severity) filtered = filtered.filter(a => a.severity === severity);
  if (object_id) filtered = filtered.filter(a => a.object_id === object_id);
  res.json({ data: filtered, total: filtered.length });
});

router.post('/:id/ack', (req, res) => {
  const alert = state.alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Not found' });
  alert.status = 'acknowledged';
  alert.updated_at = new Date().toISOString();
  state.broadcastSSE('alert_update', alert);
  return res.json(alert);
});

export default router;
