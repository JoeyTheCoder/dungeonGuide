import type { Dungeon } from '../types';
import { navigate } from '../router.ts';

export function createDungeonCard(dungeon: Dungeon): HTMLElement {
  const card = document.createElement('article');
  card.className = [
    'bg-gray-900/60 border border-gray-800/50 rounded-xl p-5',
    'hover:border-amber-500/40 hover:bg-gray-900/80 transition-all cursor-pointer group',
  ].join(' ');

  // Title
  const title = document.createElement('h3');
  title.className = 'text-base font-bold text-gray-100 group-hover:text-amber-400 transition-colors mb-2';
  title.textContent = dungeon.name;
  card.appendChild(title);

  // Summary
  const summary = document.createElement('p');
  summary.className = 'text-sm text-gray-400 leading-relaxed mb-3 line-clamp-2';
  summary.textContent = dungeon.summary;
  card.appendChild(summary);

  // Expansion badge
  if (dungeon.expansion) {
    const expBadge = document.createElement('span');
    expBadge.className = 'inline-block text-xs font-medium text-gray-500 bg-gray-800/60 px-2.5 py-1 rounded-md';
    expBadge.textContent = dungeon.expansion;
    card.appendChild(expBadge);
  }

  // Navigation
  card.addEventListener('click', () => navigate(`/${dungeon.section ?? 'mythicplus'}/${dungeon.id}`));

  return card;
}
