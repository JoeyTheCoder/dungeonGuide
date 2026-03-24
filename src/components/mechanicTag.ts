import type { MechanicTag } from '../types';

// Color mapping for each mechanic tag
const tagStyles: Record<MechanicTag, string> = {
  Kick:    'bg-red-900/60 text-red-300 border-red-700',
  Stun:    'bg-yellow-900/60 text-yellow-300 border-yellow-700',
  Dispel:  'bg-purple-900/60 text-purple-300 border-purple-700',
  Dodge:   'bg-blue-900/60 text-blue-300 border-blue-700',
  Tank:    'bg-gray-700/60 text-gray-200 border-gray-500',
  Healer:  'bg-green-900/60 text-green-300 border-green-700',
};

export function createMechanicTag(tag: MechanicTag): HTMLElement {
  const span = document.createElement('span');
  span.className = `inline-block text-xs font-semibold px-2 py-0.5 rounded border ${tagStyles[tag]}`;
  span.textContent = tag;
  return span;
}
