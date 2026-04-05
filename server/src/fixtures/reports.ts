import { Report } from '../types.js';

export const reports: Report[] = [
  {
    id: 'rpt-001', title: 'Terminated User — Escalated Access: Governance Response',
    type: 'executive', scenario_id: 'scn-001', created_at: '2026-04-04T22:12:30Z',
    summary: 'A terminated employee (Dana Okafor) was detected with an active authenticated session on a branch workstation. Escalated access to finance resources was confirmed. Zodiac identified the misalignment between declared state (terminated) and verified state (active session), raised a critical governance alert, blocked the account, and sealed a complete evidence bundle with chain-of-custody documentation.',
    before_score: 72, after_score: 89,
    findings: [
      'Terminated identity with active session detected — 1 account',
      'Finance share access confirmed — 3 resources exposed',
      'Workstation registered to terminated user — 1 endpoint',
      'GPO not applied — 21-day compliance gap',
      'Evidence chain sealed — chain of custody complete',
      'Governance action: account blocked, session terminated',
    ],
    evidence_refs: ['evd-003', 'evd-009'], truth_label: 'simulated',
  },
  {
    id: 'rpt-002', title: 'Cloud IAM Drift — Dev Tenant Governance Review',
    type: 'operator', scenario_id: 'scn-003', created_at: '2026-04-04T10:00:00Z',
    summary: 'Cloud development tenant was found to have 3 admin roles granted beyond declared least-privilege policy. Atlas mapped adjacency to production tenant resources. Evidence preserved and remediation advisory issued.',
    before_score: 68, after_score: 84,
    findings: [
      'Admin role over-provisioned — 3 identities',
      'Production-adjacent resource exposure confirmed',
      'IAM policy drift: declared vs verified gap',
      'Remediation: revoke over-provisioned roles',
      'Evidence bundle sealed',
    ],
    evidence_refs: [], truth_label: 'simulated',
  },
];
