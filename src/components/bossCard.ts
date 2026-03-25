import type { Boss } from '../types';
import { createPriorityBadge } from './priorityBadge';
import { createMechanicTag } from './mechanicTag';

export function createBossCard(boss: Boss): HTMLElement {
  const card = document.createElement('div');
  card.className = 'w-full bg-gray-900/60 border border-gray-800/50 rounded-xl p-5';

  // Header
  const header = document.createElement('div');
  header.className = 'flex items-start justify-between gap-3 mb-4';

  const name = document.createElement('h4');
  name.className = 'text-lg font-bold text-gray-100';
  name.textContent = boss.name;

  header.appendChild(name);
  header.appendChild(createPriorityBadge(boss.priority));
  card.appendChild(header);

  if (boss.summary.trim()) {
    const summary = document.createElement('p');
    summary.className = 'text-sm text-gray-400 mb-4';
    summary.textContent = boss.summary;
    card.appendChild(summary);
  }

  if (boss.mechanics.length > 0) {
    const phaseTitle = document.createElement('p');
    phaseTitle.className = 'text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3';
    phaseTitle.textContent = 'Phases & Notes';
    card.appendChild(phaseTitle);

    const list = document.createElement('ul');
    list.className = 'space-y-3';

    for (const mech of boss.mechanics) {
      const li = document.createElement('li');
      li.className = 'rounded-lg border border-gray-700/70 bg-gray-900/40 px-4 py-3';

      const tags = mech.tags ?? (mech.tag ? [mech.tag] : []);
      if (tags.length > 0) {
        const tagRow = document.createElement('div');
        tagRow.className = 'flex flex-wrap gap-1.5 mb-2';
        for (const tag of tags) {
          tagRow.appendChild(createMechanicTag(tag));
        }
        li.appendChild(tagRow);
      }

      const text = document.createElement('p');
      text.className = 'text-sm text-gray-200 leading-6';
      text.textContent = `• ${mech.text}`;
      li.appendChild(text);

      list.appendChild(li);
    }

    card.appendChild(list);
  } else if (boss.tags?.length) {
    const tagRow = document.createElement('div');
    tagRow.className = 'flex flex-wrap gap-1.5';
    for (const tag of boss.tags) {
      tagRow.appendChild(createMechanicTag(tag));
    }
    card.appendChild(tagRow);
  }

  return card;
}
