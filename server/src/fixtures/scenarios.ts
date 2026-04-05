import { Scenario } from '../types.js';

export const scenarios: Scenario[] = [
  {
    id: 'scn-001', name: 'Terminated User — Escalated Access',
    description: 'Dana Okafor was terminated on 2026-03-28. This scenario traces the detection of an active session, escalated access to finance resources, and the governance response chain.',
    status: 'idle', current_step: 0, total_steps: 5, mode: 'operator', before_after: false,
    truth_label: 'simulated', tags: ['identity', 'access-control', 'critical'],
    steps: [
      { step: 1, title: 'Termination Event', description: 'HR system signals account termination for Dana Okafor. Argus ingests the event.', affected_object_ids: ['usr-002'], alert_ids: [], log_messages: ['[Argus] Identity event received: usr-002 status → terminated', '[Conduit] Event logged to directory audit stream'], score_delta: 0, confidence_delta: 0 },
      { step: 2, title: 'Active Session Detected', description: 'Authentication token for terminated account detected. Source: WS-BRANCH-0017.', affected_object_ids: ['usr-002', 'ws-002'], alert_ids: ['alr-001'], log_messages: ['[Argus] WARNING: Active session for terminated identity usr-002', '[Conduit] Auth event logged: session token issued post-termination', '[Verdict] Governance evaluation triggered'], score_delta: -40, confidence_delta: -0.1 },
      { step: 3, title: 'Access Escalation Confirmed', description: 'Finance share access logged. Atlas maps blast radius — 3 dependent services exposed.', affected_object_ids: ['usr-002', 'ws-002'], alert_ids: ['alr-001'], log_messages: ['[Atlas] Blast radius: 3 downstream services exposed', '[Aegis] Network path to finance share validated', '[Apollo] Evidence artifact initiated: evd-003'], score_delta: -25, confidence_delta: -0.05 },
      { step: 4, title: 'Governance Response', description: 'Verdict evaluates — account blocked. Apollo seals evidence bundle. Chronicle prepares storyboard.', affected_object_ids: ['usr-002'], alert_ids: ['alr-001'], log_messages: ['[Verdict] Policy decision: BLOCKED — terminated identity with active session', '[Apollo] Evidence artifact evd-003 signed and sealed', '[Chronicle] Storyboard generation initiated'], score_delta: 0, confidence_delta: 0.05 },
      { step: 5, title: 'Evidence & Replay Ready', description: 'Full chain-of-custody complete. Storyboard available. Timeline replayable.', affected_object_ids: ['usr-002', 'ws-002'], alert_ids: ['alr-001'], log_messages: ['[Apollo] Chain of custody sealed. Artifact evd-003 available.', '[Sage] Explanation ready for operator review', '[Chronicle] Executive storyboard generated'], score_delta: 0, confidence_delta: 0.02 },
    ],
  },
  {
    id: 'scn-002', name: 'Directory / Workstation Misalignment',
    description: 'WS-BRANCH-0017 is registered to a terminated user and has not received GPO updates in 21 days. This scenario traces detection, validation, and remediation.',
    status: 'idle', current_step: 0, total_steps: 4, mode: 'operator', before_after: false,
    truth_label: 'simulated', tags: ['endpoint', 'directory', 'compliance'],
    steps: [
      { step: 1, title: 'Compliance Scan', description: 'Endpoint compliance scan detects GPO failure and stale patch on WS-BRANCH-0017.', affected_object_ids: ['ws-002'], alert_ids: [], log_messages: ['[Bedrock] Compliance scan: WS-BRANCH-0017 GPO not applied', '[Conduit] Endpoint alignment event logged'], score_delta: 0, confidence_delta: 0 },
      { step: 2, title: 'Directory Cross-Validation', description: 'Argus cross-validates workstation registration — registered user is terminated.', affected_object_ids: ['ws-002', 'usr-002'], alert_ids: ['alr-002'], log_messages: ['[Argus] Cross-validation: WS-BRANCH-0017 registered to TERMINATED user', '[Verdict] Governance evaluation: alignment_state → misaligned'], score_delta: -35, confidence_delta: -0.08 },
      { step: 3, title: 'Truth Validation', description: 'Apollo validates full misalignment evidence chain. Truth score drops to 29.', affected_object_ids: ['ws-002'], alert_ids: ['alr-002'], log_messages: ['[Apollo] Truth validation complete. Score: 29', '[Apollo] Evidence artifact evd-009 initiated'], score_delta: -20, confidence_delta: 0 },
      { step: 4, title: 'Evidence Sealed', description: 'Config snapshot sealed. Storyboard ready. Remediation advisory issued.', affected_object_ids: ['ws-002'], alert_ids: ['alr-002'], log_messages: ['[Apollo] evd-009 signed and sealed', '[Sage] Advisory: reassign or decommission WS-BRANCH-0017', '[Chronicle] Storyboard generated'], score_delta: 0, confidence_delta: 0.03 },
    ],
  },
  {
    id: 'scn-003', name: 'Cloud IAM Drift',
    description: 'Dev cloud tenant has admin roles granted beyond declared policy. Zodiac detects declared vs verified gap and surfaces evidence.',
    status: 'idle', current_step: 0, total_steps: 4, mode: 'operator', before_after: false,
    truth_label: 'simulated', tags: ['cloud', 'iam', 'drift'],
    steps: [
      { step: 1, title: 'IAM Policy Sync', description: 'CloudIAM-B syncs tenant policy state. Declared: dev-restricted. Verified: 3 admin over-provisions.', affected_object_ids: ['cld-002'], alert_ids: [], log_messages: ['[Aegis] Cloud IAM sync: CloudTenant-Dev', '[Conduit] Cloud IAM audit event logged'], score_delta: 0, confidence_delta: 0 },
      { step: 2, title: 'Drift Detected', description: 'Apollo detects divergence between declared and verified IAM state.', affected_object_ids: ['cld-002'], alert_ids: ['alr-003'], log_messages: ['[Apollo] IAM drift detected: 3 identities over-provisioned', '[Verdict] Policy evaluation: advisory — no production access confirmed yet'], score_delta: -30, confidence_delta: -0.07 },
      { step: 3, title: 'Blast Radius Assessment', description: 'Atlas maps access pathways — over-provisioned identities can reach prod-adjacent resources.', affected_object_ids: ['cld-002', 'cld-001'], alert_ids: ['alr-003'], log_messages: ['[Atlas] Blast radius: prod-adjacent resource exposure identified', '[Aegis] Network path analysis: lateral access possible'], score_delta: -10, confidence_delta: -0.03 },
      { step: 4, title: 'Evidence & Remediation', description: 'Evidence sealed. Remediation advisory: revoke over-provisioned roles.', affected_object_ids: ['cld-002'], alert_ids: ['alr-003'], log_messages: ['[Apollo] Evidence bundle sealed', '[Sage] Remediation guidance generated', '[Chronicle] Storyboard: Cloud IAM Drift available'], score_delta: 0, confidence_delta: 0.02 },
    ],
  },
];
