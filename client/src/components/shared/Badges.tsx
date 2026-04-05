import { clsx } from 'clsx';
import type { AlignmentState, RiskLevel, AlertSeverity, GovernanceStatus } from '../../types';

// Alignment Badge
const alignmentConfig: Record<AlignmentState, { label: string; cls: string }> = {
  aligned: { label: 'Aligned', cls: 'bg-verified/10 text-verified border border-verified/30' },
  misaligned: { label: 'Misaligned', cls: 'bg-critical/10 text-critical border border-critical/30' },
  unknown: { label: 'Unknown', cls: 'bg-slate-500/10 text-slate-400 border border-slate-500/30' },
  insufficient_evidence: { label: 'Insuff. Evidence', cls: 'bg-warning/10 text-warning border border-warning/30' },
};

export function AlignmentBadge({ state, className }: { state: AlignmentState; className?: string }) {
  const c = alignmentConfig[state];
  return (
    <span className={clsx('text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded', c.cls, className)}>
      {c.label}
    </span>
  );
}

// Risk Badge
const riskConfig: Record<RiskLevel, { label: string; cls: string }> = {
  low: { label: 'Low', cls: 'bg-verified/10 text-verified border border-verified/20' },
  medium: { label: 'Medium', cls: 'bg-warning/10 text-warning border border-warning/20' },
  high: { label: 'High', cls: 'bg-critical/10 text-critical border border-critical/20' },
  critical: { label: 'Critical', cls: 'bg-critical/20 text-critical border border-critical/40 font-black' },
};

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const c = riskConfig[level];
  return (
    <span className={clsx('text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded', c.cls, className)}>
      {c.label}
    </span>
  );
}

// Severity Badge
const severityConfig: Record<AlertSeverity, { label: string; cls: string }> = {
  info: { label: 'Info', cls: 'bg-info/10 text-info border border-info/20' },
  warning: { label: 'Warning', cls: 'bg-warning/10 text-warning border border-warning/20' },
  high: { label: 'High', cls: 'bg-critical/10 text-critical border border-critical/20' },
  critical: { label: 'Critical', cls: 'bg-critical/20 text-critical border border-critical/50 font-black' },
};

export function SeverityBadge({ severity, className }: { severity: AlertSeverity; className?: string }) {
  const c = severityConfig[severity];
  return (
    <span className={clsx('text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded', c.cls, className)}>
      {c.label}
    </span>
  );
}

// Governance Status Badge
const govConfig: Record<GovernanceStatus, { label: string; cls: string }> = {
  allowed: { label: 'Allowed', cls: 'bg-verified/10 text-verified border border-verified/20' },
  advisory: { label: 'Advisory', cls: 'bg-warning/10 text-warning border border-warning/20' },
  restricted: { label: 'Restricted', cls: 'bg-warning/15 text-warning border border-warning/30' },
  blocked: { label: 'Blocked', cls: 'bg-critical/15 text-critical border border-critical/40' },
  unknown: { label: 'Unknown', cls: 'bg-slate-500/10 text-slate-400 border border-slate-500/20' },
};

export function GovStatusBadge({ status, className }: { status: GovernanceStatus; className?: string }) {
  const c = govConfig[status];
  return (
    <span className={clsx('text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded', c.cls, className)}>
      {c.label}
    </span>
  );
}

// Plane Tag
export function PlaneBadge({ plane, className }: { plane: string; className?: string }) {
  return (
    <span className={clsx('text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-navy-700 text-slate-400 border border-navy-600', className)}>
      {plane.replace('_', ' ')}
    </span>
  );
}
