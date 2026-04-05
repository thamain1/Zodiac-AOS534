import { Router } from 'express';
import { channels } from '../fixtures/channels';

const router = Router();

// GET /channels — optional filter: status, site
router.get('/', (req, res) => {
  let result = [...channels];
  if (req.query.status) result = result.filter(c => c.status === req.query.status);
  if (req.query.site)   result = result.filter(c => c.site === req.query.site);
  res.json({ data: result, total: result.length });
});

// GET /channels/:id
router.get('/:id', (req, res) => {
  const channel = channels.find(c => c.id === req.params.id);
  if (!channel) return res.status(404).json({ error: 'Channel not found' });
  return res.json(channel);
});

export default router;
