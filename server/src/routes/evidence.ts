import { Router } from 'express';
import { evidence } from '../fixtures/evidence.js';

const router = Router();

router.get('/', (_req, res) => { res.json({ data: evidence, total: evidence.length }); });
router.get('/:id', (req, res) => {
  const item = evidence.find(e => e.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  return res.json(item);
});
router.post('/exportBundle', (req, res) => {
  const { ids } = req.body as { ids: string[] };
  const bundle = ids ? evidence.filter(e => ids.includes(e.id)) : evidence;
  res.json({ bundle, exported_at: new Date().toISOString(), format: 'zodiac_evidence_bundle_v1', truth_label: 'simulated' });
});

export default router;
