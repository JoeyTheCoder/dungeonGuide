import type { Dungeon } from '../types';
import { navigate } from '../router';

/** Simple left-nav listing Season 1 Mythic+ dungeons */
export function createSidebar(dungeons: Dungeon[], activeId?: string): HTMLElement {
  const aside = document.createElement('aside');
  aside.className = 'w-48 shrink-0 bg-gray-950 border-r border-gray-800/60 flex flex-col py-4 overflow-y-auto';

  const label = document.createElement('p');
  label.className = 'text-[10px] font-bold uppercase tracking-widest text-gray-600 px-4 mb-3';
  label.textContent = 'Season 1';
  aside.appendChild(label);

  for (const d of dungeons) {
    const isActive = d.id === activeId;
    const link = document.createElement('a');
    link.href = `#/mythicplus/${d.id}`;
    link.className = [
      'block px-4 py-1.5 text-sm border-l-2 transition-all',
      isActive
        ? 'text-amber-400 border-amber-500 bg-amber-500/5'
        : 'text-gray-500 border-transparent hover:text-gray-200 hover:border-gray-600 hover:bg-gray-800/30',
    ].join(' ');
    link.textContent = d.name;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(`/mythicplus/${d.id}`);
    });
    aside.appendChild(link);
  }

  return aside;
}
