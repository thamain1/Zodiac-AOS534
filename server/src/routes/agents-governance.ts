import { Router } from 'express';
import { agentStatuses, interAgentMessages } from '../fixtures/agents';

const router = Router();

// GET /agents-governance — all agent statuses
router.get('/', (_req, res) => {
  res.json({ data: agentStatuses, total: agentStatuses.length });
});

// GET /agents-governance/:id
router.get('/:id', (req, res) => {
  const agent = agentStatuses.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  return res.json(agent);
});

// GET /agents-governance/messages/feed — inter-agent message log
router.get('/messages/feed', (_req, res) => {
  res.json({ data: interAgentMessages, total: interAgentMessages.length });
});

export default router;
