import { EvidenceArtifact } from '../types.js';

export const evidence: EvidenceArtifact[] = [
  {
    id: 'evd-001', title: 'Identity Verification — Marcus Webb',
    description: 'Directory record cross-validated with Argus. MFA confirmed. Session tokens valid.',
    artifact_type: 'identity_record', created_at: '2026-04-01T08:01:00Z',
    object_refs: ['usr-001'], alert_refs: [],
    chain_of_custody: [
      { timestamp: '2026-04-01T08:00:00Z', action: 'signal_intake', agent: 'Conduit', notes: 'Directory sync event ingested' },
      { timestamp: '2026-04-01T08:00:05Z', action: 'correlation', agent: 'Argus', notes: 'Identity validated against registry' },
      { timestamp: '2026-04-01T08:00:08Z', action: 'truth_validation', agent: 'Apollo', notes: 'Truth score computed: 92' },
      { timestamp: '2026-04-01T08:00:09Z', action: 'artifact_signed', agent: 'Apollo', notes: 'Evidence artifact signed and preserved' },
    ],
    integrity_hash: 'sha256:a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
    truth_label: 'simulated', confidence: 0.95,
  },
  {
    id: 'evd-003', title: 'Terminated User Active Session — Dana Okafor',
    description: 'Authentication event detected for terminated account. Session token issued 2026-04-04T22:10Z. Source IP: 192.168.45.17 (WS-BRANCH-0017). Finance share access logged.',
    artifact_type: 'log_bundle', created_at: '2026-04-04T22:11:30Z',
    object_refs: ['usr-002', 'ws-002'], alert_refs: ['alr-001'],
    chain_of_custody: [
      { timestamp: '2026-04-04T22:10:00Z', action: 'signal_intake', agent: 'Conduit', notes: 'Auth event ingested from DirectorySync-A' },
      { timestamp: '2026-04-04T22:10:12Z', action: 'correlation', agent: 'Argus', notes: 'Identity correlated — account status: terminated' },
      { timestamp: '2026-04-04T22:10:20Z', action: 'truth_validation', agent: 'Apollo', notes: 'Misalignment confirmed. Truth score: 14' },
      { timestamp: '2026-04-04T22:10:25Z', action: 'alert_generated', agent: 'Verdict', notes: 'Critical alert raised — governance action: blocked' },
      { timestamp: '2026-04-04T22:11:30Z', action: 'artifact_signed', agent: 'Apollo', notes: 'Evidence bundle sealed. Chain of custody complete.' },
    ],
    integrity_hash: 'sha256:f9e8d7c6b5a4f9e8d7c6b5a4f9e8d7c6b5a4f9e8d7c6b5a4f9e8d7c6b5a4f9e8',
    truth_label: 'simulated', confidence: 0.91,
  },
  {
    id: 'evd-009', title: 'Workstation Compliance Failure — WS-BRANCH-0017',
    description: 'GPO application status: NOT APPLIED. Last patch date: 2026-03-14. Directory registration: Dana Okafor (terminated). Config snapshot captured.',
    artifact_type: 'config_snapshot', created_at: '2026-04-04T20:05:00Z',
    object_refs: ['ws-002'], alert_refs: ['alr-002'],
    chain_of_custody: [
      { timestamp: '2026-04-04T20:00:00Z', action: 'signal_intake', agent: 'Conduit', notes: 'Endpoint compliance scan result ingested' },
      { timestamp: '2026-04-04T20:01:00Z', action: 'correlation', agent: 'Bedrock', notes: 'Config compared against declared baseline' },
      { timestamp: '2026-04-04T20:02:00Z', action: 'truth_validation', agent: 'Apollo', notes: 'Misalignment confirmed. Truth score: 29' },
      { timestamp: '2026-04-04T20:05:00Z', action: 'artifact_signed', agent: 'Apollo', notes: 'Config snapshot sealed.' },
    ],
    integrity_hash: 'sha256:1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b',
    truth_label: 'simulated', confidence: 0.88,
  },
];
