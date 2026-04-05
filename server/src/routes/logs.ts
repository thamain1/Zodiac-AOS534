import { Router, Request, Response } from 'express';
import { staticLogs, generateLogEntry } from '../fixtures/logs.js';
import { state } from '../state.js';

const router = Router();

const LOG_STREAMS = [
  'directory_audit', 'cloud_iam_audit', 'endpoint_alignment',
  'api_request_policy', 'control_plane_health', 'data_plane_health',
  'network_substrate', 'policy_governance', 'advisory_intake',
  'standards_compliance', 'inter_agent', 'mtls_pqc_spiffe',
  'evidence_ingestion', 'artifact_generation', 'storyboard_generation',
];

router.get('/streams', (_req, res) => { res.json({ streams: LOG_STREAMS }); });

router.get('/', (req, res) => {
  const { stream, severity, q, object_id } = req.query as Record<string, string>;
  let filtered = [...staticLogs];
  if (stream) filtered = filtered.filter(l => l.stream === stream);
  if (severity) filtered = filtered.filter(l => l.severity === severity);
  if (object_id) filtered = filtered.filter(l => l.object_id === object_id);
  if (q) { const lq = q.toLowerCase(); filtered = filtered.filter(l => l.message.toLowerCase().includes(lq)); }
  res.json({ data: filtered.sort((a, b) => b.timestamp.localeCompare(a.timestamp)), total: filtered.length });
});

router.get('/subscribe', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  state.sseClients.add(res as unknown as NodeJS.WritableStream);

  const agentMessages = [
    { agent: 'Argus', stream: 'directory_audit', messages: ['Identity sync pulse — all registries nominal', 'RBAC validation complete — 847 identities checked'] },
    { agent: 'Aegis', stream: 'network_substrate', messages: ['Network posture scan complete — 23 appliances checked', 'Transport layer governance nominal'] },
    { agent: 'Apollo', stream: 'artifact_generation', messages: ['Evidence pipeline nominal — 0 queued artifacts', 'Truth model v0.98 (simulated) — all checks passing'] },
    { agent: 'Conduit', stream: 'evidence_ingestion', messages: ['Log ingestion rate: 2,847 events/min', 'Normalization pipeline: nominal'] },
    { agent: 'Atlas', stream: 'inter_agent', messages: ['Topology sync complete — 11 nodes, 10 edges mapped', 'Dependency graph updated'] },
    { agent: 'Verdict', stream: 'policy_governance', messages: ['Governance engine nominal — 6 active policies', 'Decision confidence: 0.94 average'] },
  ];

  const interval = setInterval(() => {
    const pick = agentMessages[Math.floor(Math.random() * agentMessages.length)];
    const msg = pick.messages[Math.floor(Math.random() * pick.messages.length)];
    const entry = generateLogEntry({ stream: pick.stream, severity: 'info', message: `[${pick.agent}] ${msg}`, agent: pick.agent });
    try { res.write(`event: log\ndata: ${JSON.stringify(entry)}\n\n`); } catch { clearInterval(interval); }
  }, 3000);

  req.on('close', () => { clearInterval(interval); state.sseClients.delete(res as unknown as NodeJS.WritableStream); });
});

export default router;
