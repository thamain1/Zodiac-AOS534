import { Alert } from '../types';

export const alerts: Alert[] = [
  {
    id: 'alr-001', title: 'Terminated User — Active Session Detected',
    description: 'Dana Okafor (usr-002) was terminated 2026-03-28. An active authenticated session was detected on WS-BRANCH-0017 at 2026-04-04T22:10Z. Escalated access to finance share observed.',
    severity: 'critical', status: 'active', object_id: 'usr-002', object_name: 'Dana Okafor',
    created_at: '2026-04-04T22:11:00Z', updated_at: '2026-04-04T22:15:00Z',
    truth_label: 'simulated', plane: 'identity_plane', evidence_refs: ['evd-003', 'evd-004'], scenario_id: 'scn-001',
  },
  {
    id: 'alr-002', title: 'Workstation-Directory Misalignment: WS-BRANCH-0017',
    description: 'WS-BRANCH-0017 is registered to terminated user Dana Okafor in directory. GPO not applied. Patch 21 days stale.',
    severity: 'high', status: 'active', object_id: 'ws-002', object_name: 'WS-BRANCH-0017',
    created_at: '2026-04-04T20:00:00Z', updated_at: '2026-04-04T22:00:00Z',
    truth_label: 'simulated', plane: 'data_plane', evidence_refs: ['evd-009', 'evd-010'], scenario_id: 'scn-002',
  },
  {
    id: 'alr-003', title: 'Cloud IAM Drift — Dev Tenant Over-Provisioned',
    description: 'CloudTenant-Dev declared dev-restricted access. Verified: admin role granted to 3 additional identities not in baseline policy.',
    severity: 'high', status: 'active', object_id: 'cld-002', object_name: 'CloudTenant-Dev',
    created_at: '2026-04-03T18:00:00Z', updated_at: '2026-04-04T10:00:00Z',
    truth_label: 'simulated', plane: 'governance_plane', evidence_refs: ['evd-016', 'evd-017'], scenario_id: 'scn-003',
  },
  {
    id: 'alr-004', title: 'VPN Gateway — MFA Bypass Observed',
    description: 'VPN-GW-REMOTE declared MFA required. Authentication logs show bypass pattern. 4 successful auth events without MFA in last 24h.',
    severity: 'critical', status: 'active', object_id: 'net-003', object_name: 'VPN-GW-REMOTE',
    created_at: '2026-04-04T22:15:00Z', updated_at: '2026-04-04T22:20:00Z',
    truth_label: 'simulated', plane: 'control_plane', evidence_refs: ['evd-014'], scenario_id: 'scn-004',
  },
  {
    id: 'alr-005', title: 'Service Account Privilege Drift',
    description: 'SVC-BackupAgent declared as restricted service account. Verified with domain admin privileges. No change ticket found.',
    severity: 'high', status: 'acknowledged', object_id: 'usr-003', object_name: 'SVC-BackupAgent',
    created_at: '2026-04-02T03:15:00Z', updated_at: '2026-04-04T09:00:00Z',
    truth_label: 'simulated', plane: 'identity_plane', evidence_refs: ['evd-005'],
  },
  {
    id: 'alr-006', title: 'Network Policy Drift: SW-BRANCH-EAST-03',
    description: 'Branch switch declared vlan_policy_v2.1, running legacy v1.9. VLAN segmentation gap allows lateral movement.',
    severity: 'high', status: 'active', object_id: 'net-002', object_name: 'SW-BRANCH-EAST-03',
    created_at: '2026-04-01T00:00:00Z', updated_at: '2026-04-04T08:00:00Z',
    truth_label: 'simulated', plane: 'control_plane', evidence_refs: ['evd-012', 'evd-013'], scenario_id: 'scn-004',
  },
];
