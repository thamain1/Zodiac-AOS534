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
    { agent: 'Argus',    stream: 'directory_audit',         messages: ['Identity sync pulse — all registries nominal', 'RBAC validation complete — 847 identities checked', 'Session token rotation — 12 identities refreshed'] },
    { agent: 'Aegis',    stream: 'network_substrate',        messages: ['Network posture scan complete — 23 appliances checked', 'Transport layer governance nominal', 'BGP peer validation — 4 uplinks confirmed'] },
    { agent: 'Apollo',   stream: 'artifact_generation',      messages: ['Evidence pipeline nominal — 0 queued artifacts', 'Truth model v0.98 (simulated) — all checks passing', 'Signed artifact EVD-022 — chain-of-custody sealed'] },
    { agent: 'Conduit',  stream: 'evidence_ingestion',       messages: ['Log ingestion rate: 2,847 events/min', 'Normalization pipeline: nominal', 'Tamper-resistant store: 0 violations detected'] },
    { agent: 'Atlas',    stream: 'inter_agent',              messages: ['Topology sync complete — 11 nodes, 10 edges mapped', 'Dependency graph updated', 'Blast radius calculated — 3 critical paths flagged'] },
    { agent: 'Verdict',  stream: 'policy_governance',        messages: ['Governance engine nominal — 6 active policies', 'Decision confidence: 0.94 average', 'Policy pol-003 evaluated — PASS'] },
    { agent: 'Bedrock',  stream: 'network_substrate',        messages: ['Substrate scan — WAP-HQ-FLOOR2 WPA2-Personal risk flagged', 'Hardware attestation complete — 15 devices verified', 'Physical-layer trust score: 71'] },
    { agent: 'Chronicle',stream: 'storyboard_generation',    messages: ['Storyboard draft compiled — Scenario 1 narrative ready', 'Executive summary updated — 3 open findings', 'Escalation package generated for identity governance event'] },
    { agent: 'Sage',     stream: 'policy_governance',        messages: ['Plain-language advisory generated for network drift event', 'Operator guidance: review ch-007 plaintext channel', 'Context summary: cloud IAM drift — 2 over-provisioned roles'] },
    { agent: 'Helm',     stream: 'advisory_intake',          messages: ['Threat intel validated — CISA advisory cross-referenced', 'CVE-2024-38475 enriched — confidence 0.91', 'Advisory feed: 4 new external signals processed'] },
    { agent: 'Canon',    stream: 'standards_compliance',     messages: ['External threat scan complete — dark web monitoring nominal', 'Standards alignment check: NIST CSF 2.0 — 84% coverage', 'Emerging risk: supply-chain advisory queued for review'] },
    { agent: 'Relic',    stream: 'evidence_ingestion',       messages: ['Historical retrieval: 14 prior artifacts surfaced for SCN-001', 'Archive query complete — matching events found: 3', 'Forensic memory sync — prior identity event correlated'] },
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
