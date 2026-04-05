import { Router } from 'express';
import { state } from '../state';

const router = Router();

router.get('/', (_req, res) => { res.json({ data: state.scenarios }); });

router.get('/:id', (req, res) => {
  const scn = state.scenarios.find(s => s.id === req.params.id);
  if (!scn) return res.status(404).json({ error: 'Not found' });
  return res.json(scn);
});

router.post('/:id/play', (req, res) => { state.setScenarioStatus(req.params.id, 'playing', 1); res.json({ ok: true }); });
router.post('/:id/pause', (req, res) => { state.setScenarioStatus(req.params.id, 'paused'); res.json({ ok: true }); });
router.post('/:id/scrub', (req, res) => { const { step } = req.body as { step: number }; state.setScenarioStatus(req.params.id, 'paused', step); res.json({ ok: true }); });
router.post('/:id/setMode', (req, res) => { const { mode } = req.body as { mode: string }; state.setMode(mode as 'operator' | 'executive'); res.json({ ok: true }); });
router.post('/:id/toggleBeforeAfter', (req, res) => { state.toggleBeforeAfter(req.params.id); res.json({ ok: true }); });

export default router;
