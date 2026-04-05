export type AlignmentState = 'aligned' | 'misaligned' | 'unknown' | 'insufficient_evidence';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type GovernanceStatus = 'advisory' | 'blocked' | 'allowed' | 'restricted' | 'unknown';
export type PlaneTag = 'control_plane' | 'data_plane' | 'evidence_plane' | 'reporting_plane' | 'governance_plane' | 'identity_plane' | 'advisory_plane';
export type TruthLabel = 'runtime_inspired' | 'simulated' | 'roadmap';
export type ObjectType = 'user' | 'workstation' | 'server' | 'network_appliance' | 'cloud_tenant' | 'api_gateway' | 'ai_agent' | 'service_account';
export type AlertSeverity = 'info' | 'warning' | 'high' | 'critical';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';
export type LogSeverity = 'debug' | 'info' | 'warning' | 'error' | 'critical';
export type SimulatorMode = 'guided' | 'free' | 'operator' | 'executive' | 'playback';
export type ScenarioStatus = 'idle' | 'playing' | 'paused' | 'completed';

export interface GovernedObject {
  id: string;
  name: string;
  type: ObjectType;
  declared_state: string;
  verified_state: string;
  alignment_state: AlignmentState;
  truth_score: number;
  confidence_score: number;
  evidence_refs: string[];
  owner_system: string;
  risk_level: RiskLevel;
  governance_status: GovernanceStatus;
  last_change: string;
  source_of_signal: string;
  plane: PlaneTag;
  truth_label: TruthLabel;
  site?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  object_id?: string;
  object_name?: string;
  created_at: string;
  updated_at: string;
  truth_label: TruthLabel;
  plane: PlaneTag;
  evidence_refs: string[];
  scenario_id?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  stream: string;
  severity: LogSeverity;
  message: string;
  object_id?: string;
  object_name?: string;
  agent?: string;
  truth_label: TruthLabel;
  metadata?: Record<string, unknown>;
}

export interface EvidenceArtifact {
  id: string;
  title: string;
  description: string;
  artifact_type: string;
  created_at: string;
  object_refs: string[];
  alert_refs: string[];
  chain_of_custody: ChainOfCustodyEntry[];
  integrity_hash: string;
  truth_label: TruthLabel;
  confidence: number;
}

export interface ChainOfCustodyEntry {
  timestamp: string;
  action: string;
  agent: string;
  notes?: string;
}

export interface ScenarioStep {
  step: number;
  title: string;
  description: string;
  affected_object_ids: string[];
  alert_ids: string[];
  log_messages: string[];
  score_delta: number;
  confidence_delta: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  status: ScenarioStatus;
  current_step: number;
  total_steps: number;
  mode: SimulatorMode;
  before_after: boolean;
  steps: ScenarioStep[];
  truth_label: TruthLabel;
  tags: string[];
}

export interface TopologyNode {
  id: string;
  object_id: string;
  label: string;
  type: ObjectType;
  x: number;
  y: number;
  truth_score: number;
  alignment_state: AlignmentState;
  risk_level: RiskLevel;
  plane: PlaneTag;
  truth_label: TruthLabel;
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  trust_level: 'trusted' | 'partial' | 'untrusted' | 'unknown';
  truth_label: TruthLabel;
}

export interface Environment {
  id: string;
  name: string;
  description: string;
  governance_score: number;
  evidence_confidence: number;
  active_alerts: number;
  cp_health: number;
  dp_health: number;
  secure_channel_status: 'healthy' | 'degraded' | 'unknown';
  last_event: string;
  simulator_mode: SimulatorMode;
  current_scenario?: string;
  truth_model?: string;
}

export interface HealthNode {
  id: string;
  name: string;
  plane: 'control_plane' | 'data_plane';
  type: string;
  status: 'healthy' | 'degraded' | 'critical' | 'unknown';
  health_score: number;
  latency_ms: number;
  uptime_pct: number;
  last_check: string;
  description: string;
  site: string;
  truth_label: TruthLabel;
  dependencies: string[];
  metadata?: Record<string, unknown>;
}

export interface Report {
  id: string;
  title: string;
  type: 'operator' | 'executive' | 'storyboard';
  scenario_id?: string;
  created_at: string;
  summary: string;
  before_score: number;
  after_score: number;
  findings: string[];
  evidence_refs: string[];
  truth_label: TruthLabel;
}
