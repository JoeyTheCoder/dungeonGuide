import type { TrashMob } from '../types';
import { createPriorityBadge } from './priorityBadge';
import { createMechanicTag } from './mechanicTag';

export function createTrashCard(mob: TrashMob): HTMLElement {
  const card = document.createElement('div');
  card.className = 'bg-gray-900/60 border border-gray-800/50 rounded-xl p-4';

  // Header
  const header = document.createElement('div');
  header.className = 'flex items-center justify-between gap-3 mb-2';

  const name = document.createElement('h4');
  name.className = 'text-sm font-bold text-gray-200';
  name.textContent = mob.name;

  header.appendChild(name);
  header.appendChild(createPriorityBadge(mob.priority));
  card.appendChild(header);

  // Summary
  const summary = document.createElement('p');
  summary.className = 'text-sm text-gray-400 mb-3';
  summary.textContent = mob.summary;
  card.appendChild(summary);

  if (mob.tags?.length) {
    const tagRow = document.createElement('div');
    tagRow.className = 'flex flex-wrap gap-1.5';
    for (const tag of mob.tags) {
      tagRow.appendChild(createMechanicTag(tag));
    }
    card.appendChild(tagRow);
  } else {
    const list = document.createElement('ul');
    list.className = 'space-y-1.5';
    for (const mech of mob.mechanics) {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2 text-sm';

      const tags = mech.tags ?? (mech.tag ? [mech.tag] : []);
      for (const tag of tags) {
        li.appendChild(createMechanicTag(tag));
      }

      const text = document.createElement('span');
      text.className = 'text-gray-300';
      text.textContent = mech.text;
      li.appendChild(text);

      list.appendChild(li);
    }
    card.appendChild(list);
  }

  return card;
}
