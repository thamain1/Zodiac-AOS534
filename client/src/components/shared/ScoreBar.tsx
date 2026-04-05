import { clsx } from 'clsx';

interface Props {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function scoreColor(score: number) {
  if (score >= 85) return { bar: 'bg-verified', text: 'text-verified' };
  if (score >= 60) return { bar: 'bg-warning', text: 'text-warning' };
  if (score >= 30) return { bar: 'bg-critical', text: 'text-critical' };
  return { bar: 'bg-slate-500', text: 'text-slate-400' };
}

function scoreLabel(score: number) {
  if (score >= 85) return 'Verified';
  if (score >= 60) return 'Watch';
  if (score >= 30) return 'Degraded';
  return 'Critical';
}

export function ScoreBar({ score, showLabel = true, size = 'md', className }: Props) {
  const colors = scoreColor(score);
  const h = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-2.5' : 'h-1.5';

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      {showLabel && (
        <span className={clsx('text-xs font-bold tabular-nums', colors.text, size === 'sm' ? 'text-[10px]' : '')}>
          {score}
        </span>
      )}
      <div className={clsx('flex-1 rounded-full bg-navy-700 overflow-hidden', h)}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500', colors.bar)}
          style={{ width: `${score}%` }}
        />
      </div>
      {showLabel && (
        <span className={clsx('text-[10px] font-semibold uppercase tracking-wide', colors.text)}>
          {scoreLabel(score)}
        </span>
      )}
    </div>
  );
}
