import { Scenario } from '../types';

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
  {
    id: 'scn-004', name: 'Network Appliance Multi-Vendor Drift',
    description: 'Two network appliances from different vendors are running behind their declared policy versions. Aegis detects the drift, Bedrock flags physical-layer exposure, Atlas maps blast radius.',
    status: 'idle', current_step: 0, total_steps: 5, mode: 'operator', before_after: false,
    truth_label: 'simulated', tags: ['network', 'config-drift', 'multi-vendor'],
    steps: [
      { step: 1, title: 'Policy Attestation Cycle', description: 'Scheduled policy attestation begins. NetworkAgent-D pulls running config from all appliances.', affected_object_ids: ['net-002', 'net-004'], alert_ids: [], log_messages: ['[Aegis] Policy attestation cycle initiated — 5 appliances queried', '[Conduit] Network substrate audit stream opened'], score_delta: 0, confidence_delta: 0 },
      { step: 2, title: 'Version Drift Detected — Switch', description: 'SW-BRANCH-EAST-03 running VLAN policy v1.9. Declared: v2.1. Segmentation gap on VLAN 40 (Finance).', affected_object_ids: ['net-002'], alert_ids: ['alr-003'], log_messages: ['[Aegis] DRIFT: SW-BRANCH-EAST-03 policy v1.9 ≠ declared v2.1', '[Verdict] Advisory triggered — VLAN Finance segmentation gap', '[Conduit] Config snapshot captured: net-002'], score_delta: -28, confidence_delta: -0.06 },
      { step: 3, title: 'Substrate Exposure — WAP', description: 'Bedrock detects WAP-HQ-FLOOR2 broadcasting WPA2-Personal. Declared: WPA3-Enterprise. Physical-layer exposure.', affected_object_ids: ['net-004'], alert_ids: ['alr-005'], log_messages: ['[Bedrock] SUBSTRATE RISK: WAP-HQ-FLOOR2 WPA2-Personal detected', '[Bedrock] Physical-layer exposure — rogue association possible', '[Aegis] Wireless governance advisory issued'], score_delta: -20, confidence_delta: -0.05 },
      { step: 4, title: 'Blast Radius — Atlas', description: 'Atlas maps downstream exposure. VLAN gap exposes 7 Finance hosts. WAP exposes floor 2 segment.', affected_object_ids: ['net-002', 'net-004'], alert_ids: ['alr-003', 'alr-005'], log_messages: ['[Atlas] Blast radius: VLAN gap → 7 Finance hosts reachable', '[Atlas] WAP exposure → 12 devices on floor 2 segment', '[Verdict] Governance summary: 2 misaligned appliances, advisory active'], score_delta: 0, confidence_delta: -0.02 },
      { step: 5, title: 'Evidence Sealed', description: 'Apollo seals config snapshots and network capture artifacts. Sage issues plain-language remediation advisory.', affected_object_ids: ['net-002', 'net-004'], alert_ids: ['alr-003', 'alr-005'], log_messages: ['[Apollo] Evidence artifacts evd-012, evd-020 sealed', '[Sage] Remediation: update switch policy, reconfigure WAP to WPA3-Enterprise', '[Chronicle] Storyboard: Multi-Vendor Drift available'], score_delta: 0, confidence_delta: 0.03 },
    ],
  },
  {
    id: 'scn-005', name: 'Advanced API — Inline vs Proxy Difference',
    description: 'API-GW-EDGE is declared inline but running in degraded proxy mode. 14% of requests transit uninspected. Aegis validates the mode differential and surfaces the fail-open risk.',
    status: 'idle', current_step: 0, total_steps: 4, mode: 'operator', before_after: false,
    truth_label: 'simulated', tags: ['api', 'inspection', 'fail-open'],
    steps: [
      { step: 1, title: 'API Inspection Audit', description: 'APIInspect-E begins scheduled inspection coverage audit across all API gateways.', affected_object_ids: ['api-001', 'api-002'], alert_ids: [], log_messages: ['[Aegis] API inspection audit initiated — 2 gateways', '[Conduit] API request policy stream opened'], score_delta: 0, confidence_delta: 0 },
      { step: 2, title: 'Mode Differential Detected', description: 'API-GW-EDGE declared inline, verified proxy-degraded. 14% of requests bypassing policy evaluation. Fail-open engaged.', affected_object_ids: ['api-001'], alert_ids: ['alr-004'], log_messages: ['[Aegis] MODE DRIFT: API-GW-EDGE declared inline, running proxy-degraded', '[Aegis] 14% uninspected traffic — fail-open active', '[Verdict] Advisory: edge gateway acceptable but policy gap must be documented'], score_delta: -22, confidence_delta: -0.08 },
      { step: 3, title: 'Core Gateway Verified', description: 'API-GW-CORE confirmed inline, 100% inspection, fail-closed. No policy gap. Truth score: 88.', affected_object_ids: ['api-002'], alert_ids: [], log_messages: ['[Aegis] API-GW-CORE: inline confirmed, 100% inspection coverage', '[Apollo] Evidence artifact evd-022 validated — core gateway truth score: 88', '[Verdict] Core path: governance-compliant'], score_delta: 0, confidence_delta: 0.02 },
      { step: 4, title: 'Evidence & Mode Comparison', description: 'Apollo seals API trace bundles for both gateways. Mode comparison documented for operator decision.', affected_object_ids: ['api-001', 'api-002'], alert_ids: ['alr-004'], log_messages: ['[Apollo] API trace artifacts evd-018, evd-022 sealed', '[Sage] Edge fail-open is accepted risk — document and monitor. Core fail-closed: correct posture.', '[Chronicle] Storyboard: API Mode Differential available'], score_delta: 0, confidence_delta: 0.03 },
    ],
  },
  {
    id: 'scn-006', name: 'AI Governance + Evidence Path',
    description: 'Demonstrates the full agent governance chain — from signal intake through inter-agent reasoning to Verdict decision, evidence sealing, and Chronicle storyboard generation.',
    status: 'idle', current_step: 0, total_steps: 5, mode: 'operator', before_after: false,
    truth_label: 'simulated', tags: ['ai-governance', 'evidence', 'inter-agent'],
    steps: [
      { step: 1, title: 'Multi-Signal Intake', description: 'Three agents simultaneously ingest signals: Argus (identity event), Bedrock (endpoint scan), Aegis (network pulse).', affected_object_ids: ['usr-003', 'ws-002', 'net-002'], alert_ids: [], log_messages: ['[Argus] Identity signal: SVC-BackupAgent privilege elevation detected', '[Bedrock] Endpoint signal: WS-BRANCH-0017 substrate non-compliance', '[Aegis] Network signal: Branch-East policy drift persists'], score_delta: 0, confidence_delta: 0 },
      { step: 2, title: 'Inter-Agent Correlation', description: 'Atlas correlates signals — all three objects share Branch-East dependency. Single blast radius encompasses all three events.', affected_object_ids: ['usr-003', 'ws-002', 'net-002'], alert_ids: [], log_messages: ['[Atlas] Correlation: 3 signals share Branch-East topology node', '[Atlas] Unified blast radius mapped — 9 downstream services', '[Conduit] Inter-agent correlation event logged to evidence stream'], score_delta: -15, confidence_delta: -0.04 },
      { step: 3, title: 'Verdict Cross-Agent Ruling', description: 'Verdict evaluates combined evidence from Argus, Bedrock, Aegis, Atlas. Issues unified governance ruling.', affected_object_ids: ['usr-003', 'ws-002', 'net-002'], alert_ids: ['alr-002'], log_messages: ['[Verdict] Cross-agent evaluation: 3 misaligned objects, shared exposure', '[Verdict] Ruling: RESTRICT SVC-BackupAgent, ADVISORY on branch assets', '[Helm] External correlation: no known active exploit targeting this pattern'], score_delta: 0, confidence_delta: 0.04 },
      { step: 4, title: 'Apollo Evidence Sealing', description: 'Apollo generates and signs 3 linked evidence artifacts. Chain-of-custody spans all contributing agents.', affected_object_ids: ['usr-003', 'ws-002', 'net-002'], alert_ids: ['alr-002'], log_messages: ['[Apollo] 3 evidence artifacts generated and signed', '[Apollo] Cross-artifact linkage: shared Branch-East investigation ID', '[Conduit] Evidence bundle secured in tamper-resistant store'], score_delta: 0, confidence_delta: 0.03 },
      { step: 5, title: 'Chronicle Storyboard', description: 'Chronicle generates full multi-agent storyboard. Sage provides plain-language executive summary. Replay available.', affected_object_ids: ['usr-003', 'ws-002', 'net-002'], alert_ids: ['alr-002'], log_messages: ['[Chronicle] Multi-agent storyboard generated: Branch-East Governance Review', '[Sage] Executive summary: 3 Branch-East objects require attention — evidence sealed, replay available', '[Relic] Investigation archived for historical retrieval'], score_delta: 0, confidence_delta: 0.02 },
    ],
  },
  {
    id: 'scn-007', name: 'Storage Governance + Runtime Validation',
    description: 'A dev storage bucket has a public-read ACL contradicting its declared private policy. Zodiac detects the runtime state, validates against declared posture, and triggers governance response.',
    status: 'idle', current_step: 0, total_steps: 4, mode: 'operator', before_after: false,
    truth_label: 'simulated', tags: ['cloud', 'storage', 'runtime-validation'],
    steps: [
      { step: 1, title: 'Runtime State Sync', description: 'CloudIAM-B runtime validation cycle pulls actual ACL configuration from all storage buckets.', affected_object_ids: ['cld-str-002'], alert_ids: [], log_messages: ['[Aegis] Storage runtime sync initiated — CloudTenant-Dev', '[Conduit] Cloud IAM audit stream: storage bucket scan'], score_delta: 0, confidence_delta: 0 },
      { step: 2, title: 'Public ACL Detected', description: 'bucket-dev-logs ACL verified: public-read. Declared: private-dev-only. Critical governance gap — log data potentially exposed.', affected_object_ids: ['cld-str-002'], alert_ids: [], log_messages: ['[Aegis] CRITICAL: bucket-dev-logs ACL = public-read (declared: private)', '[Verdict] Governance action: BLOCK — public exposure of internal logs', '[Conduit] Runtime state capture logged'], score_delta: -45, confidence_delta: -0.1 },
      { step: 3, title: 'Data Exposure Assessment', description: 'Atlas maps what data the bucket contains and who could access it. Helm cross-references against known data exfil patterns.', affected_object_ids: ['cld-str-002'], alert_ids: [], log_messages: ['[Atlas] Bucket contents: application logs, auth events — sensitivity: HIGH', '[Helm] External pattern match: public bucket + auth logs = known exfil pattern', '[Verdict] Escalate: evidence required before remediation'], score_delta: 0, confidence_delta: -0.03 },
      { step: 4, title: 'Evidence + Remediation Path', description: 'Apollo seals runtime capture. Sage issues remediation: revoke public ACL, audit access logs, generate incident report.', affected_object_ids: ['cld-str-002'], alert_ids: [], log_messages: ['[Apollo] Runtime capture sealed — evd-017 updated with public exposure event', '[Sage] Remediation: (1) revoke public-read ACL immediately (2) audit who accessed (3) notify data governance', '[Chronicle] Storyboard: Storage Governance Failure available'], score_delta: 0, confidence_delta: 0.05 },
    ],
  },
  {
    id: 'scn-008', name: 'Supply-Chain Truth Scoring (Roadmap Preview)',
    description: 'A preview of the planned supply-chain governance capability — third-party component provenance validation, signature checking, and vulnerability cross-reference. Roadmap feature, not current capability.',
    status: 'idle', current_step: 0, total_steps: 3, mode: 'operator', before_after: false,
    truth_label: 'roadmap', tags: ['supply-chain', 'roadmap', 'provenance'],
    steps: [
      { step: 1, title: 'Component Provenance Intake [Roadmap]', description: 'Canon scans software bill of materials (SBOM). Each component traced to origin repository, signature, and build attestation.', affected_object_ids: [], alert_ids: [], log_messages: ['[Canon] SBOM ingestion: 847 components identified', '[Canon] Provenance chain initiated — origin tracing in progress', '[Conduit] Supply-chain audit stream opened'], score_delta: 0, confidence_delta: 0 },
      { step: 2, title: 'Signature + Vulnerability Cross-Reference [Roadmap]', description: 'Apollo validates component signatures. Helm cross-references against vulnerability databases and known supply-chain compromise indicators.', affected_object_ids: [], alert_ids: [], log_messages: ['[Apollo] Signature validation: 841/847 components verified', '[Helm] 6 components flagged: 2 known CVEs, 4 unverified provenance', '[Verdict] Supply-chain truth scores computed: range 22–96'], score_delta: -12, confidence_delta: -0.04 },
      { step: 3, title: 'Supply-Chain Truth Report [Roadmap]', description: 'Chronicle generates supply-chain governance report. Trust scores per component surfaced to operator and executive views.', affected_object_ids: [], alert_ids: [], log_messages: ['[Chronicle] Supply-chain storyboard generated — 6 components require review', '[Sage] Plain-language summary: 99.3% of components verified. 6 require immediate provenance review.', '[Apollo] Supply-chain evidence bundle sealed — audit-ready'], score_delta: 0, confidence_delta: 0.02 },
    ],
  },
];
