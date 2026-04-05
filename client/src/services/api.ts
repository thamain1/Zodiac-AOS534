import type {
  GovernedObject, Alert, LogEntry, EvidenceArtifact,
  Scenario, TopologyNode, TopologyEdge, Environment, Report
} from '../types';

const BASE = '/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

function buildQuery(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) q.set(k, v);
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const api = {
  environment: {
    get: () => get<Environment>('/environment'),
    status: () => get<Environment>('/environment/status'),
  },

  objects: {
    list: (params?: { type?: string; site?: string; risk?: string; alignment?: string; q?: string }) =>
      get<{ data: GovernedObject[]; total: number }>(`/objects${buildQuery(params ?? {})}`),
    get: (id: string) => get<GovernedObject>(`/objects/${id}`),
  },

  alerts: {
    list: (params?: { status?: string; severity?: string; object_id?: string }) =>
      get<{ data: Alert[]; total: number }>(`/alerts${buildQuery(params ?? {})}`),
    ack: (id: string) => post<Alert>(`/alerts/${id}/ack`),
  },

  logs: {
    streams: () => get<{ streams: string[] }>('/logs/streams'),
    list: (params?: { stream?: string; severity?: string; q?: string; object_id?: string }) =>
      get<{ data: LogEntry[]; total: number }>(`/logs${buildQuery(params ?? {})}`),
    subscribe: () => new EventSource(`${BASE}/logs/subscribe`),
  },

  evidence: {
    list: () => get<{ data: EvidenceArtifact[]; total: number }>('/evidence'),
    get: (id: string) => get<EvidenceArtifact>(`/evidence/${id}`),
    exportBundle: (ids?: string[]) => post<{ bundle: EvidenceArtifact[] }>('/evidence/exportBundle', { ids }),
  },

  reports: {
    list: () => get<{ data: Report[]; total: number }>('/reports'),
    get: (id: string) => get<Report>(`/reports/${id}`),
    export: () => post('/reports/export'),
  },

  scenarios: {
    list: () => get<{ data: Scenario[] }>('/scenarios'),
    get: (id: string) => get<Scenario>(`/scenarios/${id}`),
    play: (id: string) => post(`/scenarios/${id}/play`),
    pause: (id: string) => post(`/scenarios/${id}/pause`),
    scrub: (id: string, step: number) => post(`/scenarios/${id}/scrub`, { step }),
    setMode: (id: string, mode: string) => post(`/scenarios/${id}/setMode`, { mode }),
    toggleBeforeAfter: (id: string) => post(`/scenarios/${id}/toggleBeforeAfter`),
  },

  topology: {
    get: () => get<{ nodes: TopologyNode[]; edges: TopologyEdge[] }>('/topology'),
  },
};
