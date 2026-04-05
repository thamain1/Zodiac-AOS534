import { Router } from 'express';
import { reports } from '../fixtures/reports';

const router = Router();

router.get('/', (_req, res) => { res.json({ data: reports, total: reports.length }); });
router.get('/:id', (req, res) => {
  const r = reports.find(x => x.id === req.params.id);
  if (!r) return res.status(404).json({ error: 'Not found' });
  return res.json(r);
});
router.post('/export', (_req, res) => {
  res.json({ exported_at: new Date().toISOString(), format: 'zodiac_report_v1', truth_label: 'simulated' });
});

export default router;
