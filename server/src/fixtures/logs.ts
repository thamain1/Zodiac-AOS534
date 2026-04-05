import { LogEntry } from '../types';

export function generateLogEntry(overrides: Partial<LogEntry> = {}): LogEntry {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    stream: 'inter_agent',
    severity: 'info',
    message: 'Agent event',
    truth_label: 'simulated',
    ...overrides,
  };
}

export const staticLogs: LogEntry[] = [
  { id: 'log-001', timestamp: '2026-04-04T22:10:00Z', stream: 'directory_audit', severity: 'critical', message: '[Argus] Identity event: usr-002 (Dana Okafor) — active session detected. Account status: TERMINATED.', object_id: 'usr-002', agent: 'Argus', truth_label: 'simulated' },
  { id: 'log-002', timestamp: '2026-04-04T22:10:12Z', stream: 'directory_audit', severity: 'critical', message: '[Argus] Cross-validation FAIL: terminated identity issued active token. Source: WS-BRANCH-0017.', object_id: 'usr-002', agent: 'Argus', truth_label: 'simulated' },
  { id: 'log-003', timestamp: '2026-04-04T22:10:20Z', stream: 'inter_agent', severity: 'warning', message: '[Verdict] Governance evaluation triggered for usr-002. Policy: no active sessions for terminated identities.', object_id: 'usr-002', agent: 'Verdict', truth_label: 'simulated' },
  { id: 'log-004', timestamp: '2026-04-04T22:10:25Z', stream: 'inter_agent', severity: 'critical', message: '[Verdict] Decision: BLOCKED. Terminated identity with active session. Governance action enforced.', object_id: 'usr-002', agent: 'Verdict', truth_label: 'simulated' },
  { id: 'log-005', timestamp: '2026-04-04T22:11:00Z', stream: 'evidence_ingestion', severity: 'info', message: '[Apollo] Evidence artifact evd-003 initiated. Chain of custody sequence started.', agent: 'Apollo', truth_label: 'simulated' },
  { id: 'log-006', timestamp: '2026-04-04T22:11:30Z', stream: 'artifact_generation', severity: 'info', message: '[Apollo] evd-003 signed and sealed. Integrity hash computed. Chain of custody complete.', agent: 'Apollo', truth_label: 'simulated' },
  { id: 'log-007', timestamp: '2026-04-04T20:00:00Z', stream: 'endpoint_alignment', severity: 'warning', message: '[Bedrock] Compliance scan: WS-BRANCH-0017 — GPO not applied, patch 21 days stale.', object_id: 'ws-002', agent: 'Bedrock', truth_label: 'simulated' },
  { id: 'log-008', timestamp: '2026-04-04T20:01:00Z', stream: 'endpoint_alignment', severity: 'warning', message: '[Argus] Directory cross-check: WS-BRANCH-0017 registered to TERMINATED user (usr-002).', object_id: 'ws-002', agent: 'Argus', truth_label: 'simulated' },
  { id: 'log-009', timestamp: '2026-04-03T18:00:00Z', stream: 'cloud_iam_audit', severity: 'warning', message: '[Aegis] CloudTenant-Dev IAM sync — 3 admin roles over-provisioned vs baseline policy.', object_id: 'cld-002', agent: 'Aegis', truth_label: 'simulated' },
  { id: 'log-010', timestamp: '2026-04-04T22:15:00Z', stream: 'network_substrate', severity: 'critical', message: '[Aegis] VPN-GW-REMOTE: MFA bypass detected. 4 auth events without MFA factor in last 24h.', object_id: 'net-003', agent: 'Aegis', truth_label: 'simulated' },
  { id: 'log-011', timestamp: '2026-04-04T08:00:00Z', stream: 'network_substrate', severity: 'warning', message: '[Aegis] SW-BRANCH-EAST-03: Running vlan_policy_v1.9 — declared v2.1. Config drift confirmed.', object_id: 'net-002', agent: 'Aegis', truth_label: 'simulated' },
  { id: 'log-012', timestamp: '2026-04-04T09:00:00Z', stream: 'inter_agent', severity: 'info', message: '[Relic] Historical pattern match: usr-002 dormant escalation pattern matches prior incident 2025-11-12.', agent: 'Relic', truth_label: 'simulated' },
  { id: 'log-013', timestamp: '2026-04-04T22:12:00Z', stream: 'storyboard_generation', severity: 'info', message: '[Chronicle] Storyboard generation started: Terminated User — Escalated Access.', agent: 'Chronicle', truth_label: 'simulated' },
  { id: 'log-014', timestamp: '2026-04-04T22:12:30Z', stream: 'storyboard_generation', severity: 'info', message: '[Chronicle] Executive storyboard complete. Available at /reports/rpt-001.', agent: 'Chronicle', truth_label: 'simulated' },
];
