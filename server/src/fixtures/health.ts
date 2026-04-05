import { HealthNode } from '../types';

export const healthNodes: HealthNode[] = [
  // ── CONTROL PLANE ──────────────────────────────────────────────────────────
  {
    id: 'cp-001', name: 'FW-CORE-01', plane: 'control_plane', type: 'Firewall',
    status: 'healthy', health_score: 96, latency_ms: 2, uptime_pct: 99.98,
    last_check: '2026-04-05T00:00:00Z',
    description: 'Core perimeter firewall — policy enforced, rule table current.',
    site: 'HQ', truth_label: 'simulated', dependencies: ['cp-002', 'cp-003'],
  },
  {
    id: 'cp-002', name: 'RTR-CORE-01', plane: 'control_plane', type: 'Core Router',
    status: 'healthy', health_score: 93, latency_ms: 3, uptime_pct: 99.95,
    last_check: '2026-04-05T00:00:00Z',
    description: 'Core router — BGP policy v3 active, route table validated.',
    site: 'HQ', truth_label: 'simulated', dependencies: ['cp-001', 'cp-004'],
  },
  {
    id: 'cp-003', name: 'AUTH-SRV-01', plane: 'control_plane', type: 'Auth Server',
    status: 'healthy', health_score: 91, latency_ms: 8, uptime_pct: 99.91,
    last_check: '2026-04-05T00:00:00Z',
    description: 'RADIUS/LDAP authentication server — MFA backend operational.',
    site: 'HQ', truth_label: 'simulated', dependencies: ['cp-005'],
  },
  {
    id: 'cp-004', name: 'SW-BRANCH-EAST-03', plane: 'control_plane', type: 'Switch',
    status: 'degraded', health_score: 61, latency_ms: 22, uptime_pct: 98.4,
    last_check: '2026-04-05T00:00:00Z',
    description: 'Branch switch — VLAN policy drift (v1.9 vs declared v2.1). Latency elevated.',
    site: 'Branch-East', truth_label: 'simulated', dependencies: ['cp-002'],
  },
  {
    id: 'cp-005', name: 'LDAP-HQ', plane: 'control_plane', type: 'Directory',
    status: 'healthy', health_score: 88, latency_ms: 11, uptime_pct: 99.7,
    last_check: '2026-04-05T00:00:00Z',
    description: 'Active Directory domain controller — sync interval normal.',
    site: 'HQ', truth_label: 'simulated', dependencies: [],
  },
  {
    id: 'cp-006', name: 'VPN-GW-REMOTE', plane: 'control_plane', type: 'VPN Gateway',
    status: 'critical', health_score: 34, latency_ms: 145, uptime_pct: 94.2,
    last_check: '2026-04-05T00:00:00Z',
    description: 'VPN gateway — MFA bypass detected. Governance status: blocked. High latency.',
    site: 'Remote', truth_label: 'simulated', dependencies: ['cp-002'],
  },
  {
    id: 'cp-007', name: 'POLICY-ENGINE-01', plane: 'control_plane', type: 'Policy Engine',
    status: 'healthy', health_score: 97, latency_ms: 4, uptime_pct: 99.99,
    last_check: '2026-04-05T00:00:00Z',
    description: 'Verdict policy engine — processing 1,247 evaluations/min. No backlog.',
    site: 'HQ', truth_label: 'simulated', dependencies: ['cp-005', 'cp-003'],
  },

  // ── DATA PLANE ─────────────────────────────────────────────────────────────
  {
    id: 'dp-001', name: 'APP-SRV-01', plane: 'data_plane', type: 'App Server',
    status: 'healthy', health_score: 94, latency_ms: 18, uptime_pct: 99.87,
    last_check: '2026-04-05T00:00:00Z',
    description: 'Primary application server — load balanced, patch current.',
    site: 'HQ', truth_label: 'simulated', dependencies: ['dp-003', 'dp-004'],
  },
  {
    id: 'dp-002', name: 'WEB-SRV-01', plane: 'data_plane', type: 'Web Server',
    status: 'healthy', health_score: 91, latency_ms: 12, uptime_pct: 99.82,
    last_check: '2026-04-05T00:00:00Z',
    description: 'Web tier — TLS 1.3 enforced, certificate valid 87 days.',
    site: 'HQ', truth_label: 'simulated', dependencies: ['dp-001'],
  },
  {
    id: 'dp-003', name: 'DB-PRIMARY', plane: 'data_plane', type: 'Database',
    status: 'healthy', health_score: 89, latency_ms: 9, uptime_pct: 99.95,
    last_check: '2026-04-05T00:00:00Z',
    description: 'Primary database — replication lag: 0.3s. Encryption at rest validated.',
    site: 'HQ', truth_label: 'simulated', dependencies: ['dp-004'],
  },
  {
    id: 'dp-004', name: 'DB-REPLICA', plane: 'data_plane', type: 'Database',
    status: 'degraded', health_score: 72, latency_ms: 38, uptime_pct: 98.9,
    last_check: '2026-04-05T00:00:00Z',
    description: 'Replica database — replication lag elevated: 4.1s. Monitor required.',
    site: 'HQ', truth_label: 'simulated', dependencies: [],
  },
  {
    id: 'dp-005', name: 'STORAGE-NAS-01', plane: 'data_plane', type: 'Storage',
    status: 'healthy', health_score: 85, latency_ms: 6, uptime_pct: 99.6,
    last_check: '2026-04-05T00:00:00Z',
    description: 'NAS storage — capacity 68%. Integrity checks passing.',
    site: 'HQ', truth_label: 'simulated', dependencies: [],
  },
  {
    id: 'dp-006', name: 'API-GW-EDGE', plane: 'data_plane', type: 'API Gateway',
    status: 'degraded', health_score: 63, latency_ms: 74, uptime_pct: 97.3,
    last_check: '2026-04-05T00:00:00Z',
    description: 'Edge API gateway — proxy mode degraded. Fail-open active. 14% uninspected traffic.',
    site: 'HQ', truth_label: 'simulated', dependencies: ['dp-001', 'dp-002'],
  },
  {
    id: 'dp-007', name: 'API-GW-CORE', plane: 'data_plane', type: 'API Gateway',
    status: 'healthy', health_score: 92, latency_ms: 15, uptime_pct: 99.8,
    last_check: '2026-04-05T00:00:00Z',
    description: 'Core API gateway — inline inspection 100%. Fail-closed. No policy gaps.',
    site: 'HQ', truth_label: 'simulated', dependencies: ['dp-001'],
  },
  {
    id: 'dp-008', name: 'WS-BRANCH-0017', plane: 'data_plane', type: 'Workstation',
    status: 'critical', health_score: 29, latency_ms: 210, uptime_pct: 91.0,
    last_check: '2026-04-05T00:00:00Z',
    description: 'Branch workstation — GPO not applied, patch stale 21 days. Registered to terminated user.',
    site: 'Branch-East', truth_label: 'simulated', dependencies: [],
  },
];
