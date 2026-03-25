import type { Boss } from '../types';
import { createPriorityBadge } from './priorityBadge';
import { createMechanicTag } from './mechanicTag';

export function createBossCard(boss: Boss): HTMLElement {
  const card = document.createElement('div');
  card.className = 'w-full bg-gray-900/60 border border-gray-800/50 rounded-xl p-5';
  const expandedHeaderClass = 'flex flex-col gap-3 mb-4 sm:flex-row sm:items-start sm:justify-between';
  const collapsedHeaderClass = 'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between';

  // Header
  const header = document.createElement('div');
  header.className = expandedHeaderClass;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'flex min-w-0 items-center gap-3 text-left text-gray-100 transition-colors hover:text-amber-400';
  toggle.setAttribute('aria-expanded', 'true');

  const arrow = document.createElement('span');
  arrow.className = 'text-2xl leading-none text-gray-500 transition-transform';
  arrow.textContent = '▾';
  toggle.appendChild(arrow);

  const name = document.createElement('h4');
  name.className = 'text-lg font-bold text-gray-100 min-w-0';
  name.textContent = boss.name;
  toggle.appendChild(name);

  header.appendChild(toggle);
  header.appendChild(createPriorityBadge(boss.priority));
  card.appendChild(header);

  const details = document.createElement('div');

  if (boss.summary.trim()) {
    const summary = document.createElement('p');
    summary.className = 'text-sm text-gray-400 mb-4';
    summary.textContent = boss.summary;
    details.appendChild(summary);
  }

  if (boss.mechanics.length > 0) {
    const phaseTitle = document.createElement('p');
    phaseTitle.className = 'text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3';
    phaseTitle.textContent = 'Phases & Notes';
    details.appendChild(phaseTitle);

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

    details.appendChild(list);
  } else if (boss.tags?.length) {
    const tagRow = document.createElement('div');
    tagRow.className = 'flex flex-wrap gap-1.5';
    for (const tag of boss.tags) {
      tagRow.appendChild(createMechanicTag(tag));
    }
    details.appendChild(tagRow);
  }

  function setExpandedState(isExpanded: boolean) {
    toggle.setAttribute('aria-expanded', String(isExpanded));
    details.hidden = !isExpanded;
    arrow.textContent = isExpanded ? '▾' : '▸';
    header.className = isExpanded ? expandedHeaderClass : collapsedHeaderClass;
  }

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    setExpandedState(!isExpanded);
  });

  setExpandedState(true);
  card.appendChild(details);

  return card;
}
