import { Router } from 'express';
import { healthNodes } from '../fixtures/health';

const router = Router();

// GET /health-nodes
router.get('/', (_req, res) => {
  res.json({ data: healthNodes, total: healthNodes.length });
});

// GET /health-nodes/:id
router.get('/:id', (req, res) => {
  const node = healthNodes.find(n => n.id === req.params.id);
  if (!node) return res.status(404).json({ error: 'Node not found' });
  return res.json(node);
});

// GET /health-nodes/plane/:plane — filter by control_plane or data_plane
router.get('/plane/:plane', (req, res) => {
  const filtered = healthNodes.filter(n => n.plane === req.params.plane);
  res.json({ data: filtered, total: filtered.length });
});

export default router;
