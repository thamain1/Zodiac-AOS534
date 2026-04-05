import { Router } from 'express';
import { objects } from '../fixtures/objects';

const router = Router();

router.get('/', (req, res) => {
  const { type, site, risk, alignment, q } = req.query as Record<string, string>;
  let filtered = [...objects];
  if (type) filtered = filtered.filter(o => o.type === type);
  if (site) filtered = filtered.filter(o => o.site === site);
  if (risk) filtered = filtered.filter(o => o.risk_level === risk);
  if (alignment) filtered = filtered.filter(o => o.alignment_state === alignment);
  if (q) {
    const lq = q.toLowerCase();
    filtered = filtered.filter(o => o.name.toLowerCase().includes(lq) || o.description?.toLowerCase().includes(lq));
  }
  res.json({ data: filtered, total: filtered.length });
});

router.get('/:id', (req, res) => {
  const obj = objects.find(o => o.id === req.params.id);
  if (!obj) return res.status(404).json({ error: 'Not found' });
  return res.json(obj);
});

export default router;
