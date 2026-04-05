import { Router } from 'express';
import { policies } from '../fixtures/policies.js';

const router = Router();

// GET /policies — optional filters: domain, status
router.get('/', (req, res) => {
  let result = [...policies];
  if (req.query.domain) result = result.filter(p => p.domain === req.query.domain);
  if (req.query.status) result = result.filter(p => p.status === req.query.status);
  res.json({ data: result, total: result.length });
});

// GET /policies/:id
router.get('/:id', (req, res) => {
  const policy = policies.find(p => p.id === req.params.id);
  if (!policy) return res.status(404).json({ error: 'Policy not found' });
  return res.json(policy);
});

// POST /policies (stub — returns created policy echo)
router.post('/', (req, res) => {
  res.status(201).json({ ...req.body, id: `pol-${Date.now()}`, truth_label: 'simulated', status: 'draft' });
});

export default router;
