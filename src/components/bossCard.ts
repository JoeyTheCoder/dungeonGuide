import type { Boss } from '../types';
import { createPriorityBadge } from './priorityBadge';
import { createMechanicTag } from './mechanicTag';

export function createBossCard(boss: Boss): HTMLElement {
  const card = document.createElement('div');
  card.className = 'bg-gray-800 border border-gray-700 rounded-lg p-4';

  // Header
  const header = document.createElement('div');
  header.className = 'flex items-center justify-between gap-3 mb-2';

  const name = document.createElement('h4');
  name.className = 'text-sm font-bold text-gray-100';
  name.textContent = boss.name;

  header.appendChild(name);
  header.appendChild(createPriorityBadge(boss.priority));
  card.appendChild(header);

  // Summary
  const summary = document.createElement('p');
  summary.className = 'text-sm text-gray-400 mb-3';
  summary.textContent = boss.summary;
  card.appendChild(summary);

  // Mechanics list
  const list = document.createElement('ul');
  list.className = 'space-y-1.5';
  for (const mech of boss.mechanics) {
    const li = document.createElement('li');
    li.className = 'flex items-start gap-2 text-sm';
    li.appendChild(createMechanicTag(mech.tag));

    const text = document.createElement('span');
    text.className = 'text-gray-300';
    text.textContent = mech.text;
    li.appendChild(text);

    list.appendChild(li);
  }
  card.appendChild(list);

  return card;
}
