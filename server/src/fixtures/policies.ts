import { PolicyRecord } from '../types';

export const policies: PolicyRecord[] = [
  // IDENTITY
  {
    id: 'pol-001', name: 'Identity Termination Enforcement',
    description: 'Terminated accounts must be invalidated within 2 hours of HR signal. Any active session for a terminated account triggers immediate governance block.',
    domain: 'identity', status: 'active', version: 'v3.1',
    truth_score_threshold: 70, action_on_fail: 'block',
    approver: 'CISO', created_at: '2026-01-15T00:00:00Z', updated_at: '2026-03-01T00:00:00Z',
    truth_label: 'simulated', tags: ['identity', 'termination', 'scenario-1'],
  },
  {
    id: 'pol-002', name: 'Privileged Access Recertification',
    description: 'All privileged accounts require quarterly recertification. Accounts not recertified within 90 days are automatically restricted pending review.',
    domain: 'identity', status: 'active', version: 'v2.4',
    truth_score_threshold: 75, action_on_fail: 'restrict',
    approver: 'IAM Lead', created_at: '2025-10-01T00:00:00Z', updated_at: '2026-02-15T00:00:00Z',
    truth_label: 'simulated', tags: ['identity', 'privileged', 'recertification'],
  },
  {
    id: 'pol-003', name: 'Service Account Privilege Baseline',
    description: 'Service accounts must not exceed declared privilege scope. Elevation above declared baseline triggers advisory alert and blocks downstream governance.',
    domain: 'identity', status: 'active', version: 'v1.8',
    truth_score_threshold: 80, action_on_fail: 'alert',
    approver: 'IAM Lead', created_at: '2025-08-01T00:00:00Z', updated_at: '2026-01-10T00:00:00Z',
    truth_label: 'simulated', tags: ['identity', 'service-account'],
  },
  // NETWORK
  {
    id: 'pol-004', name: 'Network Policy Version Attestation',
    description: 'All network appliances must run the declared policy version. Drift of more than one minor version triggers advisory. Drift of one major version triggers block.',
    domain: 'network', status: 'active', version: 'v4.2',
    truth_score_threshold: 65, action_on_fail: 'alert',
    approver: 'Network Governance Lead', created_at: '2025-11-01T00:00:00Z', updated_at: '2026-02-28T00:00:00Z',
    truth_label: 'simulated', tags: ['network', 'config-drift', 'scenario-4'],
  },
  {
    id: 'pol-005', name: 'VPN Multi-Factor Authentication Enforcement',
    description: 'All VPN gateway connections require MFA. Any bypass detected in authentication logs triggers immediate governance block and critical alert.',
    domain: 'network', status: 'active', version: 'v2.0',
    truth_score_threshold: 90, action_on_fail: 'block',
    approver: 'CISO', created_at: '2025-06-01T00:00:00Z', updated_at: '2026-03-15T00:00:00Z',
    truth_label: 'simulated', tags: ['network', 'vpn', 'mfa'],
  },
  {
    id: 'pol-006', name: 'Wireless Substrate Security Standard',
    description: 'All wireless access points must enforce WPA3-Enterprise. Detection of WPA2-Personal or open SSID triggers advisory and substrate risk escalation to Bedrock.',
    domain: 'network', status: 'active', version: 'v1.3',
    truth_score_threshold: 75, action_on_fail: 'alert',
    approver: 'Network Governance Lead', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-03-20T00:00:00Z',
    truth_label: 'simulated', tags: ['network', 'wireless', 'substrate'],
  },
  // CLOUD
  {
    id: 'pol-007', name: 'Cloud IAM Role Provisioning Boundary',
    description: 'Cloud IAM roles must not exceed declared privilege scope. Admin role assignment in dev tenants triggers immediate advisory and mandatory review.',
    domain: 'cloud', status: 'active', version: 'v2.2',
    truth_score_threshold: 70, action_on_fail: 'alert',
    approver: 'Cloud Governance Lead', created_at: '2025-09-01T00:00:00Z', updated_at: '2026-02-01T00:00:00Z',
    truth_label: 'simulated', tags: ['cloud', 'iam', 'scenario-3'],
  },
  {
    id: 'pol-008', name: 'Cloud Tenant MFA Enforcement',
    description: 'MFA must be enforced for all cloud tenant admin accounts. Non-compliant accounts are automatically restricted pending recertification.',
    domain: 'cloud', status: 'active', version: 'v1.6',
    truth_score_threshold: 85, action_on_fail: 'restrict',
    approver: 'Cloud Governance Lead', created_at: '2026-01-20T00:00:00Z', updated_at: '2026-03-05T00:00:00Z',
    truth_label: 'simulated', tags: ['cloud', 'mfa'],
  },
  // API
  {
    id: 'pol-009', name: 'API Gateway Inspection Coverage',
    description: 'Core API gateways must maintain 100% request inspection coverage. Edge gateways must maintain minimum 85%. Fail-open on core paths triggers critical alert.',
    domain: 'api', status: 'active', version: 'v3.0',
    truth_score_threshold: 80, action_on_fail: 'alert',
    approver: 'Platform Lead', created_at: '2025-12-01T00:00:00Z', updated_at: '2026-03-10T00:00:00Z',
    truth_label: 'simulated', tags: ['api', 'inspection', 'scenario-5'],
  },
  {
    id: 'pol-010', name: 'Data Export Authorization Policy',
    description: 'Bulk data export requests require explicit authorization token. Unauthorized export attempts are blocked at the API layer and generate evidence artifacts.',
    domain: 'api', status: 'draft', version: 'v0.3',
    truth_score_threshold: 90, action_on_fail: 'block',
    approver: 'Data Governance Lead', created_at: '2026-03-25T00:00:00Z', updated_at: '2026-04-01T00:00:00Z',
    truth_label: 'simulated', tags: ['api', 'data-export', 'draft'],
  },
  // GOVERNANCE
  {
    id: 'pol-011', name: 'Evidence Retention Minimum Standard',
    description: 'All governance evidence artifacts must be retained for minimum 90 days with tamper-resistant chain-of-custody. Apollo enforces signing. Conduit enforces retention.',
    domain: 'governance', status: 'active', version: 'v1.1',
    truth_score_threshold: 95, action_on_fail: 'notify',
    approver: 'CISO', created_at: '2025-07-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
    truth_label: 'simulated', tags: ['governance', 'evidence', 'retention'],
  },
  {
    id: 'pol-012', name: 'Supply Chain Trust Scoring (Preview)',
    description: 'Third-party component truth scoring based on provenance, signature validation, and known-vulnerability cross-reference. Governance integration with build pipeline.',
    domain: 'governance', status: 'draft', version: 'v0.1',
    truth_score_threshold: 75, action_on_fail: 'notify',
    approver: 'Platform Lead', created_at: '2026-04-01T00:00:00Z', updated_at: '2026-04-01T00:00:00Z',
    truth_label: 'roadmap', tags: ['supply-chain', 'roadmap', 'scenario-8'],
  },
];
