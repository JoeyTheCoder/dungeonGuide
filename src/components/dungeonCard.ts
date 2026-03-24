import type { Dungeon } from '../types';
import { navigate } from '../router';
import { createPriorityBadge } from './priorityBadge';
import { createMechanicTag } from './mechanicTag';
import type { MechanicTag } from '../types';

/** Collect unique mechanic tags across bosses and trash */
function collectTags(dungeon: Dungeon): MechanicTag[] {
  const tags = new Set<MechanicTag>();
  for (const b of dungeon.bosses) for (const m of b.mechanics) {
    if (m.tag) tags.add(m.tag);
    for (const tag of m.tags ?? []) tags.add(tag);
  }
  for (const b of dungeon.bosses) for (const tag of b.tags ?? []) tags.add(tag);
  for (const t of dungeon.trash) for (const m of t.mechanics) {
    if (m.tag) tags.add(m.tag);
    for (const tag of m.tags ?? []) tags.add(tag);
  }
  for (const t of dungeon.trash) for (const tag of t.tags ?? []) tags.add(tag);
  return [...tags];
}

/** Determine overall priority (highest among bosses) */
function overallPriority(dungeon: Dungeon): 'High' | 'Medium' | 'Low' {
  if (dungeon.bosses.some(b => b.priority === 'High')) return 'High';
  if (dungeon.bosses.some(b => b.priority === 'Medium')) return 'Medium';
  return 'Low';
}

export function createDungeonCard(dungeon: Dungeon): HTMLElement {
  const card = document.createElement('article');
  card.className = 'bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-amber-500/50 transition-colors cursor-pointer group';

  // Header row
  const header = document.createElement('div');
  header.className = 'flex items-start justify-between gap-3 mb-2';

  const title = document.createElement('h3');
  title.className = 'text-base font-bold text-gray-100 group-hover:text-amber-400 transition-colors';
  title.textContent = dungeon.name;

  header.appendChild(title);
  header.appendChild(createPriorityBadge(overallPriority(dungeon)));
  card.appendChild(header);

  // Summary
  const summary = document.createElement('p');
  summary.className = 'text-sm text-gray-400 mb-3 line-clamp-2';
  summary.textContent = dungeon.summary;
  card.appendChild(summary);

  // Stats row
  const stats = document.createElement('div');
  stats.className = 'text-xs text-gray-500 mb-3';
  stats.textContent = `${dungeon.bosses.length} bosses · ${dungeon.trash.length} key trash mobs`;
  card.appendChild(stats);

  // Tag row
  const tagRow = document.createElement('div');
  tagRow.className = 'flex flex-wrap gap-1.5';
  for (const tag of collectTags(dungeon)) {
    tagRow.appendChild(createMechanicTag(tag));
  }
  card.appendChild(tagRow);

  // Navigation
  card.addEventListener('click', () => navigate(`/mythicplus/${dungeon.id}`));

  return card;
}
