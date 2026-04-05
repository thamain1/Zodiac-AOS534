import { clsx } from 'clsx';
import type { TruthLabel } from '../../types';

interface Props {
  label: TruthLabel;
  className?: string;
}

const config: Record<TruthLabel, { text: string; cls: string }> = {
  runtime_inspired: { text: 'Runtime-Inspired', cls: 'sim-badge' },
  simulated: { text: 'Simulated', cls: 'sim-badge sim-badge-simulated' },
  roadmap: { text: 'Roadmap', cls: 'sim-badge sim-badge-roadmap' },
};

export function TruthBadge({ label, className }: Props) {
  const c = config[label];
  return <span className={clsx(c.cls, className)}>{c.text}</span>;
}
