import { TopologyNode, TopologyEdge } from '../types.js';

export const topologyNodes: TopologyNode[] = [
  { id: 'node-usr-001', object_id: 'usr-001', label: 'Marcus Webb', type: 'user', x: 200, y: 180, truth_score: 92, alignment_state: 'aligned', risk_level: 'low', plane: 'identity_plane', truth_label: 'simulated' },
  { id: 'node-usr-002', object_id: 'usr-002', label: 'Dana Okafor', type: 'user', x: 200, y: 320, truth_score: 14, alignment_state: 'misaligned', risk_level: 'critical', plane: 'identity_plane', truth_label: 'simulated' },
  { id: 'node-usr-003', object_id: 'usr-003', label: 'SVC-BackupAgent', type: 'service_account', x: 200, y: 460, truth_score: 31, alignment_state: 'misaligned', risk_level: 'high', plane: 'identity_plane', truth_label: 'simulated' },
  { id: 'node-ws-001', object_id: 'ws-001', label: 'WS-HQ-0042', type: 'workstation', x: 480, y: 180, truth_score: 86, alignment_state: 'aligned', risk_level: 'low', plane: 'data_plane', truth_label: 'simulated' },
  { id: 'node-ws-002', object_id: 'ws-002', label: 'WS-BRANCH-0017', type: 'workstation', x: 480, y: 320, truth_score: 29, alignment_state: 'misaligned', risk_level: 'high', plane: 'data_plane', truth_label: 'simulated' },
  { id: 'node-net-001', object_id: 'net-001', label: 'FW-CORE-01', type: 'network_appliance', x: 760, y: 220, truth_score: 91, alignment_state: 'aligned', risk_level: 'low', plane: 'control_plane', truth_label: 'simulated' },
  { id: 'node-net-002', object_id: 'net-002', label: 'SW-BRANCH-EAST-03', type: 'network_appliance', x: 760, y: 360, truth_score: 38, alignment_state: 'misaligned', risk_level: 'high', plane: 'control_plane', truth_label: 'simulated' },
  { id: 'node-net-003', object_id: 'net-003', label: 'VPN-GW-REMOTE', type: 'network_appliance', x: 760, y: 480, truth_score: 22, alignment_state: 'misaligned', risk_level: 'critical', plane: 'control_plane', truth_label: 'simulated' },
  { id: 'node-cld-001', object_id: 'cld-001', label: 'CloudTenant-Prod', type: 'cloud_tenant', x: 1040, y: 200, truth_score: 82, alignment_state: 'aligned', risk_level: 'low', plane: 'governance_plane', truth_label: 'simulated' },
  { id: 'node-cld-002', object_id: 'cld-002', label: 'CloudTenant-Dev', type: 'cloud_tenant', x: 1040, y: 360, truth_score: 41, alignment_state: 'misaligned', risk_level: 'high', plane: 'governance_plane', truth_label: 'simulated' },
  { id: 'node-api-001', object_id: 'api-001', label: 'API-GW-EDGE', type: 'api_gateway', x: 1040, y: 500, truth_score: 55, alignment_state: 'misaligned', risk_level: 'medium', plane: 'data_plane', truth_label: 'simulated' },
];

export const topologyEdges: TopologyEdge[] = [
  { id: 'edge-001', source: 'node-usr-002', target: 'node-ws-002', label: 'active session', trust_level: 'untrusted', truth_label: 'simulated' },
  { id: 'edge-002', source: 'node-usr-001', target: 'node-ws-001', label: 'authenticated', trust_level: 'trusted', truth_label: 'simulated' },
  { id: 'edge-003', source: 'node-ws-001', target: 'node-net-001', label: 'network path', trust_level: 'trusted', truth_label: 'simulated' },
  { id: 'edge-004', source: 'node-ws-002', target: 'node-net-002', label: 'network path', trust_level: 'partial', truth_label: 'simulated' },
  { id: 'edge-005', source: 'node-net-001', target: 'node-cld-001', label: 'secure tunnel', trust_level: 'trusted', truth_label: 'simulated' },
  { id: 'edge-006', source: 'node-net-002', target: 'node-cld-002', label: 'drift path', trust_level: 'untrusted', truth_label: 'simulated' },
  { id: 'edge-007', source: 'node-cld-002', target: 'node-cld-001', label: 'adjacent access', trust_level: 'partial', truth_label: 'simulated' },
  { id: 'edge-008', source: 'node-net-003', target: 'node-cld-001', label: 'vpn tunnel', trust_level: 'partial', truth_label: 'simulated' },
  { id: 'edge-009', source: 'node-api-001', target: 'node-cld-001', label: 'api gateway', trust_level: 'partial', truth_label: 'simulated' },
  { id: 'edge-010', source: 'node-usr-003', target: 'node-ws-001', label: 'service access', trust_level: 'partial', truth_label: 'simulated' },
];
