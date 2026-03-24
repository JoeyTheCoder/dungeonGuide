import type { PriorityLevel } from '../types';

const priorityStyles: Record<PriorityLevel, string> = {
  High:   'bg-red-800/50 text-red-200 border-red-600',
  Medium: 'bg-amber-800/50 text-amber-200 border-amber-600',
  Low:    'bg-slate-700/50 text-slate-300 border-slate-500',
};

export function createPriorityBadge(level: PriorityLevel): HTMLElement {
  const span = document.createElement('span');
  span.className = `inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${priorityStyles[level]}`;
  span.textContent = level;
  return span;
}
