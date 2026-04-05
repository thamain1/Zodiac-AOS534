import { Router } from 'express';
import { topologyNodes, topologyEdges } from '../fixtures/topology';

const router = Router();
router.get('/', (_req, res) => { res.json({ nodes: topologyNodes, edges: topologyEdges }); });
export default router;
